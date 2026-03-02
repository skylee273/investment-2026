// 주식 시세 API 서비스
// Yahoo Finance 비공식 API 사용 (무료, CORS 프록시 필요)

const CORS_PROXY = 'https://corsproxy.io/?'
const YAHOO_CHART_API = 'https://query1.finance.yahoo.com/v8/finance/chart/'
const YAHOO_QUOTE_API = 'https://query1.finance.yahoo.com/v10/finance/quoteSummary/'
const YAHOO_QUOTE_V7_API = 'https://query1.finance.yahoo.com/v7/finance/quote'

// 캐시 (1분)
const priceCache = new Map()
const CACHE_DURATION = 1 * 60 * 1000

// 환율 캐시
let exchangeRate = 1446 // 기본값
let exchangeRateUpdated = 0

// 종목 기본 통계 조회 (PER, PBR 등)
async function fetchStockStats(ticker) {
  try {
    // v7 quote API - URL을 직접 구성
    const apiUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${ticker}`
    const proxyUrl = CORS_PROXY + encodeURIComponent(apiUrl)

    console.log(`[StockAPI] Fetching ${ticker} from:`, proxyUrl)
    const response = await fetch(proxyUrl)
    const data = await response.json()
    console.log(`[StockAPI] Response for ${ticker}:`, data)

    if (data.quoteResponse?.result?.[0]) {
      const quote = data.quoteResponse.result[0]
      console.log(`[StockAPI] ${ticker} - PER: ${quote.trailingPE}, PBR: ${quote.priceToBook}`)
      return {
        trailingPE: quote.trailingPE || null,
        forwardPE: quote.forwardPE || null,
        priceToBook: quote.priceToBook || null,
        pegRatio: quote.pegRatio || null,
        returnOnEquity: null,
        dividendYield: quote.trailingAnnualDividendYield || null,
        epsTrailingTwelveMonths: quote.epsTrailingTwelveMonths || null,
        marketCap: quote.marketCap || null,
      }
    }

    console.log(`[StockAPI] No data in quoteResponse for ${ticker}`)
    return null
  } catch (error) {
    console.error(`[StockAPI] Error fetching stats for ${ticker}:`, error)
    return null
  }
}

// 단일 종목 시세 조회 (52주 고점 + PER/PBR 포함)
export async function fetchStockPrice(ticker) {
  const cacheKey = ticker.toUpperCase()
  const cached = priceCache.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  try {
    // 차트 데이터 조회 (3년 데이터로 고점 계산)
    // PER/PBR은 포트폴리오 데이터에서 직접 관리
    const chartResponse = await fetch(`${CORS_PROXY}${encodeURIComponent(YAHOO_CHART_API + ticker + '?interval=1d&range=3y')}`)
    const stats = null // API 비활성화 - 포트폴리오에서 직접 관리

    const chartData = await chartResponse.json()

    if (chartData.chart?.result?.[0]) {
      const result = chartData.chart.result[0]
      const meta = result.meta
      const quote = result.indicators?.quote?.[0]

      // 3년 고점 계산
      let high3y = meta.regularMarketPrice
      if (quote?.high) {
        high3y = Math.max(...quote.high.filter(h => h !== null))
      }

      const priceData = {
        ticker: cacheKey,
        price: meta.regularMarketPrice,
        previousClose: meta.chartPreviousClose || meta.previousClose,
        change: meta.regularMarketPrice - (meta.chartPreviousClose || meta.previousClose),
        changePercent: ((meta.regularMarketPrice - (meta.chartPreviousClose || meta.previousClose)) / (meta.chartPreviousClose || meta.previousClose)) * 100,
        currency: meta.currency,
        marketState: meta.marketState,
        exchange: meta.exchangeName,
        high3y: high3y,
        fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: meta.fiftyTwoWeekLow,
        // PER/PBR 추가
        per: stats?.trailingPE || stats?.forwardPE || null,
        pbr: stats?.priceToBook || null,
        // 추가 지표
        forwardPE: stats?.forwardPE || null,
        pegRatio: stats?.pegRatio || null,
        roe: stats?.returnOnEquity ? (stats.returnOnEquity * 100) : null,
        dividendYield: stats?.dividendYield ? (stats.dividendYield * 100) : null,
        targetPrice: stats?.targetMeanPrice || null,
      }

      priceCache.set(cacheKey, { data: priceData, timestamp: Date.now() })
      return priceData
    }
    return null
  } catch (error) {
    console.error(`Error fetching ${ticker}:`, error)
    return null
  }
}

// 여러 종목 시세 일괄 조회
export async function fetchMultipleStockPrices(tickers) {
  const results = {}
  const tickersToFetch = []

  // 캐시 확인
  for (const ticker of tickers) {
    const cacheKey = ticker.toUpperCase()
    const cached = priceCache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      results[cacheKey] = cached.data
    } else {
      tickersToFetch.push(ticker)
    }
  }

  // 캐시에 없는 종목만 조회 (병렬)
  if (tickersToFetch.length > 0) {
    const promises = tickersToFetch.map(ticker =>
      fetchStockPrice(ticker).then(data => ({ ticker, data }))
    )

    const fetchedResults = await Promise.allSettled(promises)

    for (const result of fetchedResults) {
      if (result.status === 'fulfilled' && result.value.data) {
        results[result.value.ticker.toUpperCase()] = result.value.data
      }
    }
  }

  return results
}

// USD/KRW 환율 조회
export async function fetchExchangeRate() {
  if (Date.now() - exchangeRateUpdated < CACHE_DURATION) {
    return exchangeRate
  }

  try {
    const url = `${CORS_PROXY}${encodeURIComponent(YAHOO_CHART_API + 'USDKRW=X?interval=1d&range=1d')}`
    const response = await fetch(url)
    const data = await response.json()

    if (data.chart?.result?.[0]?.meta?.regularMarketPrice) {
      exchangeRate = data.chart.result[0].meta.regularMarketPrice
      exchangeRateUpdated = Date.now()
    }
  } catch (error) {
    console.error('Error fetching exchange rate:', error)
  }

  return exchangeRate
}

// 시세 + 환율 일괄 조회
export async function fetchPortfolioPrices(tickers) {
  const [prices, rate] = await Promise.all([
    fetchMultipleStockPrices(tickers),
    fetchExchangeRate()
  ])

  return {
    prices,
    exchangeRate: rate,
    updatedAt: new Date().toISOString()
  }
}

// 캐시 클리어
export function clearPriceCache() {
  priceCache.clear()
  exchangeRateUpdated = 0
}
