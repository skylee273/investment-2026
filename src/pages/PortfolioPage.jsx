import { useState, useEffect, useCallback } from 'react'
import { fetchPortfolioPrices, clearPriceCache } from '../services/stockApi'

// 2026년 분기별 포트폴리오
// targetWeight: 목표비중(%), investedKRW: 투자원금(원), gainKRW: 현재 평가손익(원)
// per: 주가수익비율, pbr: 주가순자산비율 (2026.02 기준)
const TARGET_TOTAL = 1000000 // 목표 총 투자금액 100만원

// 2월 실현수익
const REALIZED_GAINS = {
  month: '2026-02',
  total: 2900,
  details: [
    { type: '판매수익', amount: 2828, percent: 2.0 },
    { type: '배당금', amount: 42 },
    { type: '계좌이자', amount: 30 },
  ]
}

// 토스증권 보유 종목 (소수점 주식)
const TOSS_HOLDINGS = [
  { ticker: 'ADA', name: '에이다 (카르다노)', shares: 0, currentKRW: 63529, gainKRW: 3452, gainPercent: 5.75, type: 'crypto' },
  { ticker: 'AMZN', name: '아마존', shares: 1.218978, currentKRW: 357500, gainKRW: -48109, gainPercent: -11.8 },
  { ticker: 'GOOG', name: '알파벳 C', shares: 0.141936, currentKRW: 61640, gainKRW: -2000, gainPercent: -3.1 },
  { ticker: 'MSFT', name: '마이크로소프트', shares: 0.076658, currentKRW: 42545, gainKRW: -5044, gainPercent: -10.5 },
  { ticker: 'CVX', name: '셰브론', shares: 0.104341, currentKRW: 28864, gainKRW: 2229, gainPercent: 8.3 },
  { ticker: 'META', name: '메타', shares: 0.024868, currentKRW: 22607, gainKRW: -1062, gainPercent: -4.4 },
  { ticker: 'AXP', name: '아메리칸 익스프레스', shares: 0.049313, currentKRW: 21474, gainKRW: -4117, gainPercent: -16.0 },
  { ticker: 'BAC', name: '뱅크오브아메리카', shares: 0.269012, currentKRW: 18877, gainKRW: -1824, gainPercent: -8.8 },
  { ticker: 'GOOGL', name: '알파벳 A', shares: 0.040947, currentKRW: 17793, gainKRW: -1933, gainPercent: -9.7 },
  { ticker: 'SPY', name: 'SPY', shares: 0.017702, currentKRW: 17155, gainKRW: -548, gainPercent: -3.0 },
  { ticker: 'MP', name: 'MP 머티리얼스', shares: 0.096771, currentKRW: 7964, gainKRW: -890, gainPercent: -10.0 },
  { ticker: 'ISRG', name: '인튜이티브 서지컬', shares: 0.010737, currentKRW: 7656, gainKRW: -225, gainPercent: -2.8 },
  { ticker: 'QCOM', name: '퀄컴', shares: 0.035814, currentKRW: 7193, gainKRW: -689, gainPercent: -8.7 },
  { ticker: 'PLTR', name: '팔란티어', shares: 0.015311, currentKRW: 3097, gainKRW: 127, gainPercent: 4.2 },
  { ticker: 'TSLA', name: '테슬라', shares: 0.004935, currentKRW: 2765, gainKRW: -203, gainPercent: -6.8 },
  { ticker: 'AVGO', name: '브로드컴', shares: 0.005936, currentKRW: 2640, gainKRW: -332, gainPercent: -11.1 },
  { ticker: 'VRT', name: '버티브 홀딩스', shares: 0.005514, currentKRW: 1933, gainKRW: -60, gainPercent: -3.0 },
  { ticker: 'VST', name: '비스트라 에너지', shares: 0.003951, currentKRW: 955, gainKRW: -30, gainPercent: -3.0 },
]

// 토스증권 ETF/채권 (미래에셋으로 이동됨)
const TOSS_ETFS = []

// 미래에셋증권 계좌별 보유 종목 (2026.03.02 기준)
const MIRAE_ACCOUNTS = [
  {
    id: 'pension',
    name: '연금저축계좌',
    accountNo: '010-8784-7546-2',
    icon: '🧓',
    totalKRW: 827010,
    gainKRW: 45340,
    gainPercent: 6.31,
    holdings: [
      { name: 'KODEX 200', shares: 7, currentKRW: 658840, investedKRW: 617700, gainKRW: 41140, gainPercent: 6.66 },
      { name: 'KODEX 코스닥150', shares: 5, currentKRW: 105500, investedKRW: 101300, gainKRW: 4200, gainPercent: 4.15 },
    ]
  },
  {
    id: 'isa',
    name: 'ISA (중개형)',
    accountNo: '660-9824-0136-0',
    icon: '📊',
    totalKRW: 504089,
    gainKRW: 4780,
    gainPercent: 0.96,
    holdings: [
      { name: 'KODEX 코스닥150', shares: 5, currentKRW: 105500, investedKRW: 101075, gainKRW: 4425, gainPercent: 4.38 },
      { name: 'TIGER 미국채10년선물', shares: 15, currentKRW: 199050, investedKRW: 198375, gainKRW: 675, gainPercent: 0.34 },
      { name: 'TIGER 미국S&P500', shares: 8, currentKRW: 196520, investedKRW: 196840, gainKRW: -320, gainPercent: -0.16 },
    ]
  },
  {
    id: 'cma-emergency',
    name: '비상금 CMA',
    accountNo: '690-6340-5654-1',
    icon: '💰',
    totalKRW: 600179,
    gainKRW: 147,
    gainPercent: 0.02,
    holdings: [
      { name: '발행어음CMA(개인)', shares: 0, currentKRW: 600179, investedKRW: 600032, gainKRW: 147, gainPercent: 0.02 },
    ]
  },
  {
    id: 'stock',
    name: '종합_주식',
    accountNo: '010-8784-7546-0',
    icon: '📈',
    totalKRW: 740637,
    gainKRW: -3838,
    gainPercent: -0.52,
    holdings: [
      { name: '알파벳 C', shares: 1, currentKRW: 443632, investedKRW: 442635, gainKRW: 997, gainPercent: 0.23 },
      { name: 'TIGER 미국S&P500', shares: 7, currentKRW: 171955, investedKRW: 174090, gainKRW: -2135, gainPercent: -1.23 },
      { name: '1Q 미국S&P500미국채혼합', shares: 10, currentKRW: 113550, investedKRW: 116250, gainKRW: -2700, gainPercent: -2.32 },
    ]
  },
  {
    id: 'cma-family',
    name: '하우가 가족여행 CMA',
    accountNo: '010-8784-7546-1',
    icon: '✈️',
    totalKRW: 410119,
    gainKRW: 119,
    gainPercent: 0.03,
    holdings: [
      { name: '발행어음CMA(개인)', shares: 0, currentKRW: 410119, investedKRW: 410000, gainKRW: 119, gainPercent: 0.03 },
    ]
  },
]

// 미래에셋 전체 보유 종목 (기존 코드 호환용)
const MIRAE_HOLDINGS = MIRAE_ACCOUNTS.flatMap(acc => acc.holdings)

// 매도 예정/완료 종목 (비중 미포함)
const PENDING_SALES = []

// 보험/저축 계좌 (투자 외 계좌)
const CASH_ACCOUNTS = [
  { id: 'hanwha-insurance', name: '한화생명보험저축', icon: '🛡️', targetKRW: 30240000, currentKRW: 12390000, depositDay: null, monthlyDeposit: 210000, depositCount: 59, targetCount: 144, note: '월 21만원 × 59/144회 납입' },
  { id: 'housing', name: '청약저축', icon: '🏠', targetKRW: 3000000, currentKRW: 720000, depositDay: 25, monthlyDeposit: 20000, depositCount: 36, targetCount: 24, note: '1순위 달성 (36회 납입)' },
]

// 공모주 청약 일정
const IPO_SUBSCRIPTIONS = [
  {
    id: 1,
    name: '케이뱅크',
    code: '279570',
    subscriptionStart: '2026-02-24',
    subscriptionEnd: '2026-02-25',
    refundDate: '2026-02-27',
    listingDate: '2026-03-06',
    priceRange: '9,500 ~ 12,000원',
    finalPrice: null,
    competition: null,
    subscriptionAmount: 0,
    allocated: 0,
    status: 'failed',
    broker: '미래에셋증권, KB증권, NH투자증권',
    note: '탈락',
  },
  {
    id: 2,
    name: '액스비스',
    code: '',
    subscriptionStart: '2026-02',
    subscriptionEnd: '2026-02',
    refundDate: null,
    listingDate: null,
    priceRange: '',
    finalPrice: null,
    competition: null,
    subscriptionAmount: 0,
    allocated: 1,
    status: 'allocated',
    broker: '',
    note: '1주 배정',
  },
]

const QUARTERLY_PORTFOLIOS = {
  'Q1': {
    label: '2026년 1분기',
    period: '2026.01 - 2026.03',
    portfolio: [
      { ticker: '069500.KS', displayTicker: 'KODEX200', name: 'KODEX 200', type: 'ETF', currency: 'KRW', targetWeight: 30, investedKRW: 0, gainKRW: 0, per: null, pbr: null },
      { ticker: '360750.KS', displayTicker: 'TIGER S&P', name: 'Tiger S&P 500', type: 'ETF', currency: 'KRW', targetWeight: 10, investedKRW: 0, gainKRW: 0, per: null, pbr: null },
      { ticker: '472160.KS', displayTicker: 'TIGER혼합50', name: 'TIGER 미국S&P500채권혼합50액티브', type: 'ETF', currency: 'KRW', targetWeight: 10, investedKRW: 0, gainKRW: 0, per: null, pbr: null },
      { ticker: 'CVX', displayTicker: 'CVX', name: '셰브론', type: 'Stock', currency: 'USD', targetWeight: 10, investedKRW: 0, gainKRW: 0, per: null, pbr: null },
      { ticker: 'AMZN', displayTicker: 'AMZN', name: '아마존', type: 'Stock', currency: 'USD', targetWeight: 10, investedKRW: 0, gainKRW: 0, per: null, pbr: null },
      { ticker: 'GOOG', displayTicker: 'GOOG', name: '알파벳 C (A+C 합산)', type: 'Stock', currency: 'USD', targetWeight: 12, investedKRW: 0, gainKRW: 0, per: null, pbr: null },
      { ticker: '229200.KS', displayTicker: 'KODEX코스닥150', name: 'KODEX 코스닥150', type: 'ETF', currency: 'KRW', targetWeight: 13, investedKRW: 0, gainKRW: 0, per: null, pbr: null },
      { ticker: 'ADA-USD', displayTicker: 'ADA', name: '에이다 (카르다노)', type: 'Crypto', currency: 'USD', targetWeight: 5, investedKRW: 0, gainKRW: 0, per: null, pbr: null },
    ]
  },
  'Q2': {
    label: '2026년 2분기',
    period: '2026.04 - 2026.06',
    portfolio: [] // 나중에 리밸런싱
  },
  'Q3': {
    label: '2026년 3분기',
    period: '2026.07 - 2026.09',
    portfolio: [] // 나중에 리밸런싱
  },
  'Q4': {
    label: '2026년 4분기',
    period: '2026.10 - 2026.12',
    portfolio: [] // 나중에 리밸런싱
  },
}

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4']

// localStorage 키
const STORAGE_KEY = 'portfolio_tracking_data'

// 추적 데이터 로드 (매수가, 매수 후 고점)
const loadTrackingData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

// 추적 데이터 저장
const saveTrackingData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// 총 투자금액은 포트폴리오에서 동적으로 계산

const SECTOR_COLORS = {
  '069500.KS': '#3182F6',
  '360750.KS': '#6366F1',
  '472160.KS': '#8B5CF6',
  '484790.KS': '#06B6D4',
  '229200.KS': '#E91E63', // KODEX 코스닥150
  'CVX': '#795548',
  'AMZN': '#FF9900',
  'GOOG': '#34A853',
  'BAC': '#012169',
  'MSFT': '#00A4EF',
  'TSM': '#C6011F',
  'ADA-USD': '#0033AD', // 카르다노 (에이다)
}

const styles = {
  container: {
    maxWidth: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#191F28',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: '#8B95A1',
    marginTop: '4px',
  },
  refreshButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#3182F6',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  lastUpdate: {
    fontSize: '12px',
    color: '#8B95A1',
    marginTop: '8px',
  },
  rulesCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px',
    border: '1px solid #FFE082',
  },
  rulesTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#F57F17',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  rulesList: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    fontSize: '13px',
    color: '#5D4037',
  },
  ruleItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #E5E8EB',
  },
  summaryLabel: {
    fontSize: '13px',
    color: '#8B95A1',
    marginBottom: '8px',
  },
  summaryValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#191F28',
  },
  mainGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  tableCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    border: '1px solid #E5E8EB',
    overflow: 'hidden',
  },
  tableHeader: {
    padding: '20px',
    borderBottom: '1px solid #E5E8EB',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#191F28',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#8B95A1',
    backgroundColor: '#F7F8FA',
    borderBottom: '1px solid #E5E8EB',
  },
  thRight: {
    padding: '12px 16px',
    textAlign: 'right',
    fontSize: '12px',
    fontWeight: '600',
    color: '#8B95A1',
    backgroundColor: '#F7F8FA',
    borderBottom: '1px solid #E5E8EB',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#191F28',
    borderBottom: '1px solid #F2F4F6',
  },
  tdRight: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#191F28',
    borderBottom: '1px solid #F2F4F6',
    textAlign: 'right',
  },
  tickerCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  tickerDot: (color) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: color,
    flexShrink: 0,
  }),
  tickerInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  tickerSymbol: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#191F28',
  },
  tickerName: {
    fontSize: '11px',
    color: '#8B95A1',
  },
  alertBadge: (type) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    backgroundColor: type === 'danger' ? '#FFEBEE' : type === 'warning' ? '#FFF8E1' : '#E8F5E9',
    color: type === 'danger' ? '#F04438' : type === 'warning' ? '#F57F17' : '#00C853',
  }),
  priceCell: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  priceValue: {
    fontWeight: '600',
  },
  priceChange: (isPositive) => ({
    fontSize: '11px',
    color: isPositive ? '#00C853' : '#F04438',
  }),
  chartCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #E5E8EB',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '40px',
  },
  chartTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#191F28',
    marginBottom: '20px',
  },
  pieContainer: {
    position: 'relative',
    width: '200px',
    height: '200px',
    flexShrink: 0,
  },
  pieCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    backgroundColor: 'white',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieCenterValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#191F28',
  },
  pieCenterLabel: {
    fontSize: '12px',
    color: '#8B95A1',
  },
  legendList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    flex: 1,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '13px',
  },
  legendLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  legendDot: (color) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: color,
  }),
  legendName: {
    color: '#4E5968',
  },
  legendValue: {
    fontWeight: '600',
    color: '#191F28',
  },
  metricBadge: {
    display: 'inline-block',
    padding: '2px 6px',
    backgroundColor: '#F2F4F6',
    borderRadius: '4px',
    fontSize: '11px',
    color: '#4E5968',
  },
  warningRow: (type) => ({
    backgroundColor: type === 'danger' ? '#FFF5F5' : type === 'warning' ? '#FFFBEB' : 'transparent',
  }),
  statusDot: (isLive) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: isLive ? '#00C853' : '#F57F17',
    display: 'inline-block',
    marginRight: '8px',
  }),
}

// CSS for pie chart (목표 비중 기반)
const getPieChartStyle = (portfolio) => {
  let accumulated = 0
  const gradientParts = portfolio.map((item) => {
    const start = accumulated
    accumulated += item.targetWeight
    return `${SECTOR_COLORS[item.ticker] || '#8B95A1'} ${start}% ${accumulated}%`
  })

  return {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: `conic-gradient(${gradientParts.join(', ')})`,
  }
}

export default function PortfolioPage() {
  const [currentQuarter, setCurrentQuarter] = useState('Q1')
  const [data, setData] = useState({})
  const [lastUpdate, setLastUpdate] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [error, setError] = useState(null)
  const [exchangeRate, setExchangeRate] = useState(1450)
  const [trackingData, setTrackingData] = useState(() => loadTrackingData())
  // trackingData 구조: { [quarter]: { [ticker]: { avgPrice, highSinceBuy, buyDate } } }

  // 필터 상태
  const [filter, setFilter] = useState({
    status: 'all', // all, invested, notInvested, needBuy, overBuy
    alert: 'all',  // all, danger, warning, caution, profit
    sort: 'weight', // weight, name, gain, per
  })

  // 현재 분기 포트폴리오
  const PORTFOLIO = QUARTERLY_PORTFOLIOS[currentQuarter]?.portfolio || []
  const quarterInfo = QUARTERLY_PORTFOLIOS[currentQuarter]

  const refreshData = useCallback(async (forceRefresh = false) => {
    if (PORTFOLIO.length === 0) {
      setError('이 분기의 포트폴리오가 아직 구성되지 않았습니다.')
      return
    }

    setIsRefreshing(true)
    setError(null)

    try {
      if (forceRefresh) {
        clearPriceCache()
      }

      const tickers = PORTFOLIO.map(item => item.ticker)
      const result = await fetchPortfolioPrices(tickers)

      // API 결과를 state 형식으로 변환
      const newData = {}
      for (const item of PORTFOLIO) {
        const priceData = result.prices[item.ticker.toUpperCase()]
        if (priceData) {
          newData[item.ticker] = {
            price: priceData.price,
            prevClose: priceData.previousClose,
            change: priceData.changePercent,
            high3y: priceData.high3y || priceData.price,
            high52w: priceData.fiftyTwoWeekHigh,
            low52w: priceData.fiftyTwoWeekLow,
            // PER/PBR (API에서 가져온 실제 데이터)
            per: priceData.per,
            pbr: priceData.pbr,
            // 추가 지표
            forwardPE: priceData.forwardPE,
            roe: priceData.roe,
            dividendYield: priceData.dividendYield,
            targetPrice: priceData.targetPrice,
            marketState: priceData.marketState,
            currency: priceData.currency,
          }
        }
      }

      setData(newData)
      setExchangeRate(result.exchangeRate)
      setLastUpdate(new Date())
      setIsLive(true)

      // 추적 데이터 업데이트 (분기별로 관리)
      const updatedTracking = { ...trackingData }
      if (!updatedTracking[currentQuarter]) {
        updatedTracking[currentQuarter] = {}
      }
      let trackingChanged = false

      for (const item of PORTFOLIO) {
        const priceData = result.prices[item.ticker.toUpperCase()]
        if (priceData?.price) {
          const currentPrice = priceData.price
          const existing = updatedTracking[currentQuarter][item.ticker]

          if (!existing) {
            // 첫 기록: 오늘 매수로 간주 (매수가 = 현재가, 고점 = 현재가)
            updatedTracking[currentQuarter][item.ticker] = {
              avgPrice: currentPrice,
              highSinceBuy: currentPrice,
              buyDate: new Date().toISOString().split('T')[0],
            }
            trackingChanged = true
          } else if (currentPrice > existing.highSinceBuy) {
            // 새 고점 갱신
            updatedTracking[currentQuarter][item.ticker] = {
              ...existing,
              highSinceBuy: currentPrice,
            }
            trackingChanged = true
          }
        }
      }

      if (trackingChanged) {
        setTrackingData(updatedTracking)
        saveTrackingData(updatedTracking)
      }
    } catch (err) {
      console.error('데이터 로딩 오류:', err)
      setError('데이터를 불러오는데 실패했습니다.')
      setIsLive(false)
    } finally {
      setIsRefreshing(false)
    }
  }, [currentQuarter, PORTFOLIO])

  // 초기 로드 및 분기 변경시 새로고침
  useEffect(() => {
    refreshData()
  }, [currentQuarter])

  // 자동 새로고침 (60초마다)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData()
    }, 60000)
    return () => clearInterval(interval)
  }, [refreshData])

  // 매수 후 고점 대비 하락률 계산 (분기별)
  const getDropFromHigh = (ticker) => {
    const stockData = data[ticker]
    const quarterTracking = trackingData[currentQuarter] || {}
    const tracking = quarterTracking[ticker]
    if (!stockData?.price || !tracking?.highSinceBuy) return 0
    return ((stockData.price - tracking.highSinceBuy) / tracking.highSinceBuy) * 100
  }

  // 매수 후 고점 가져오기 (분기별)
  const getHighSinceBuy = (ticker) => {
    const quarterTracking = trackingData[currentQuarter] || {}
    return quarterTracking[ticker]?.highSinceBuy || null
  }

  // 알림 타입 결정 (고점 대비)
  const getAlertType = (dropPercent) => {
    if (dropPercent <= -15) return 'danger'
    if (dropPercent <= -10) return 'warning'
    if (dropPercent <= -5) return 'caution'
    return 'normal'
  }

  // 상태 아이콘 반환
  const getStatusIcon = (dropPercent, gainPercent) => {
    if (dropPercent <= -15) return { icon: '🚨', label: '-15% 손절', color: '#F04438' }
    if (dropPercent <= -10) return { icon: '⚠️', label: '-10% 주의', color: '#F57F17' }
    if (dropPercent <= -5) return { icon: '📉', label: '-5% 관찰', color: '#FF9800' }
    if (gainPercent >= 10) return { icon: '🔥🔥', label: '+10%↑', color: '#00C853' }
    if (gainPercent >= 5) return { icon: '🔥', label: '+5%↑', color: '#00C853' }
    return null
  }

  // 매수가 역산 (현재가와 손익률로 계산)
  const getPurchasePrice = (item, currentPrice) => {
    if (!item.investedKRW || item.investedKRW === 0) return null
    const gainPercent = item.gainKRW / item.investedKRW
    return currentPrice / (1 + gainPercent)
  }

  // 고점대비 하락률 계산 (매수가 기준, 손익률 활용)
  const getDropFromHighByItem = (item, stockData) => {
    if (!item.investedKRW || item.investedKRW === 0 || !stockData?.price) return 0
    const currentPrice = stockData.price
    const purchasePrice = getPurchasePrice(item, currentPrice)
    const quarterTracking = trackingData[currentQuarter] || {}
    const tracking = quarterTracking[item.ticker]

    // 고점: 저장된 고점 vs 매수가 중 큰 값
    const highSinceBuy = tracking?.highSinceBuy || purchasePrice
    const actualHigh = Math.max(highSinceBuy, purchasePrice)

    if (!actualHigh || actualHigh === 0) return 0
    return ((currentPrice - actualHigh) / actualHigh) * 100
  }

  // 매수후 고점 가져오기 (매수가 포함)
  const getHighSinceBuyByItem = (item, stockData) => {
    if (!item.investedKRW || item.investedKRW === 0 || !stockData?.price) return null
    const currentPrice = stockData.price
    const purchasePrice = getPurchasePrice(item, currentPrice)
    const quarterTracking = trackingData[currentQuarter] || {}
    const tracking = quarterTracking[item.ticker]

    const highSinceBuy = tracking?.highSinceBuy || purchasePrice
    return Math.max(highSinceBuy, purchasePrice, currentPrice)
  }

  // 내 수익률 계산 (매수가 대비, 분기별)
  const getMyGainPercent = (ticker) => {
    const stockData = data[ticker]
    const quarterTracking = trackingData[currentQuarter] || {}
    const tracking = quarterTracking[ticker]
    if (!stockData?.price || !tracking?.avgPrice) return 0
    return ((stockData.price - tracking.avgPrice) / tracking.avgPrice) * 100
  }

  // 포트폴리오 가치 계산 (전체 자산 포함)
  const calculatePortfolioValue = () => {
    let totalCost = 0 // 총 투자원금
    let totalGain = 0 // 총 수익금

    // PORTFOLIO (기존 목표 포트폴리오)
    PORTFOLIO.forEach(item => {
      totalCost += item.investedKRW || 0
      totalGain += item.gainKRW || 0
    })

    // 토스증권 보유 종목
    TOSS_HOLDINGS.forEach(item => {
      const invested = item.currentKRW - item.gainKRW
      totalCost += invested
      totalGain += item.gainKRW || 0
    })

    // 미래에셋증권 계좌별
    MIRAE_ACCOUNTS.forEach(acc => {
      acc.holdings.forEach(item => {
        totalCost += item.investedKRW || 0
        totalGain += item.gainKRW || 0
      })
    })

    const totalValue = totalCost + totalGain
    const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0
    return { totalCost, totalValue, totalGain, totalGainPercent }
  }

  // 총 투자금액 계산
  const TOTAL_INVESTMENT = PORTFOLIO.reduce((sum, item) => sum + (item.investedKRW || 0), 0)
    + TOSS_HOLDINGS.reduce((sum, h) => sum + (h.currentKRW - h.gainKRW), 0)
    + MIRAE_ACCOUNTS.reduce((sum, acc) => sum + acc.holdings.reduce((s, h) => s + h.investedKRW, 0), 0)

  const portfolioStats = calculatePortfolioValue()

  // 위험 종목 수 (고점 대비 -10% 이상 하락)
  const warningCount = TOSS_HOLDINGS.filter(item => item.gainPercent <= -10 && item.gainPercent > -15).length
  const dangerCount = TOSS_HOLDINGS.filter(item => item.gainPercent <= -15).length

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🏠 하우가 패밀리</h1>
          <p style={styles.subtitle}>
            {quarterInfo?.label} ({quarterInfo?.period}) · 투자 원금: ₩{TOTAL_INVESTMENT.toLocaleString()}
          </p>
          <p style={styles.lastUpdate}>
            <span style={styles.statusDot(isLive)} />
            {isLive ? '실시간' : '데이터 로딩 중...'}
            {lastUpdate && ` · 마지막 업데이트: ${lastUpdate.toLocaleTimeString()}`}
            {exchangeRate && ` · 환율: $1 = ₩${exchangeRate.toLocaleString()}`}
          </p>
        </div>
        <button
          style={{
            ...styles.refreshButton,
            opacity: isRefreshing ? 0.7 : 1,
          }}
          onClick={() => refreshData(true)}
          disabled={isRefreshing}
        >
          <span style={isRefreshing ? { animation: 'spin 1s linear infinite', display: 'inline-block' } : {}}>↻</span>
          {isRefreshing ? '새로고침 중...' : '데이터 새로고침'}
        </button>
      </div>

      {/* 분기 선택 탭 */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        padding: '4px',
        backgroundColor: '#F2F4F6',
        borderRadius: '12px',
        width: 'fit-content',
      }}>
        {QUARTERS.map(quarter => {
          const info = QUARTERLY_PORTFOLIOS[quarter]
          const isActive = currentQuarter === quarter
          const isEmpty = info.portfolio.length === 0
          return (
            <button
              key={quarter}
              onClick={() => setCurrentQuarter(quarter)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isEmpty ? 'not-allowed' : 'pointer',
                backgroundColor: isActive ? 'white' : 'transparent',
                color: isActive ? '#3182F6' : isEmpty ? '#B0B8C1' : '#4E5968',
                boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s',
                opacity: isEmpty ? 0.6 : 1,
              }}
            >
              {quarter}
              {isEmpty && <span style={{ marginLeft: '4px', fontSize: '10px' }}>예정</span>}
            </button>
          )
        })}
      </div>

      {/* 에러 표시 */}
      {error && (
        <div style={{
          padding: '16px 20px',
          backgroundColor: '#FFF5F5',
          borderRadius: '12px',
          border: '1px solid #FFCDD2',
          marginBottom: '20px',
          color: '#F04438',
          fontSize: '14px',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* 빈 포트폴리오 */}
      {PORTFOLIO.length === 0 ? (
        <div style={{
          padding: '60px 40px',
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #E5E8EB',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#191F28', marginBottom: '8px' }}>
            {quarterInfo?.label} 포트폴리오
          </h2>
          <p style={{ fontSize: '14px', color: '#8B95A1', marginBottom: '24px' }}>
            아직 이 분기의 포트폴리오가 구성되지 않았습니다.<br />
            분기 시작 전에 리밸런싱 계획을 세워보세요.
          </p>
          <div style={{
            padding: '16px',
            backgroundColor: '#F7F8FA',
            borderRadius: '12px',
            fontSize: '13px',
            color: '#4E5968',
          }}>
            💡 <strong>팁:</strong> 분기별로 포트폴리오를 재구성하면 시장 상황에 맞게 자산을 조정할 수 있습니다.
          </div>
        </div>
      ) : (
      <>
      {/* 투자 원칙 */}
      <div style={styles.rulesCard}>
        <div style={styles.rulesTitle}>
          <span>📋</span> 나의 투자 원칙
        </div>
        <div style={styles.rulesList}>
          <div style={styles.ruleItem}>
            <span>🔴</span>
            <span><strong>손절:</strong> -15% 고려, -20% 무조건 실행 (무서워하면 안 된다)</span>
          </div>
          <div style={styles.ruleItem}>
            <span>🟢</span>
            <span><strong>익절:</strong> 최고가 대비 -10% 하락 시 매도</span>
          </div>
          <div style={styles.ruleItem}>
            <span>📈</span>
            <span><strong>원칙:</strong> 오르는 주식은 팔지 않는다</span>
          </div>
          <div style={styles.ruleItem}>
            <span>🎯</span>
            <span><strong>전략:</strong> 무릎에 사서 어깨에 판다</span>
          </div>
        </div>
      </div>

      {/* 요약 카드 */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>총 평가금액</div>
          <div style={styles.summaryValue}>₩{Math.round(portfolioStats.totalValue).toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#8B95A1', marginTop: '4px' }}>
            투자원금: ₩{Math.round(portfolioStats.totalCost).toLocaleString()}
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>총 수익</div>
          <div style={{ ...styles.summaryValue, color: portfolioStats.totalGain >= 0 ? '#00C853' : '#F04438' }}>
            {portfolioStats.totalGain >= 0 ? '+' : ''}₩{Math.round(portfolioStats.totalGain).toLocaleString()}
          </div>
          <div style={{ fontSize: '13px', color: portfolioStats.totalGainPercent >= 0 ? '#00C853' : '#F04438', marginTop: '4px' }}>
            {portfolioStats.totalGainPercent >= 0 ? '+' : ''}{portfolioStats.totalGainPercent.toFixed(2)}%
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>주의 종목 (고점 -10%)</div>
          <div style={{ ...styles.summaryValue, color: warningCount > 0 ? '#F57F17' : '#00C853' }}>{warningCount}</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>위험 종목 (고점 -15%)</div>
          <div style={{ ...styles.summaryValue, color: dangerCount > 0 ? '#F04438' : '#00C853' }}>{dangerCount}</div>
        </div>
      </div>

      {/* 비상금/현금 계좌 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {CASH_ACCOUNTS.map(account => {
          const progress = account.currentKRW / account.targetKRW * 100
          const remaining = account.targetKRW - account.currentKRW
          const today = new Date().getDate()
          const daysUntilDeposit = account.depositDay >= today
            ? account.depositDay - today
            : (new Date(new Date().getFullYear(), new Date().getMonth() + 1, account.depositDay).getDate() - today + 30) % 30

          return (
            <div key={account.id} style={{
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '16px',
              border: '1px solid #E5E8EB',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{account.icon}</span>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#191F28' }}>{account.name}</div>
                    <div style={{ fontSize: '11px', color: '#8B95A1' }}>{account.note}</div>
                  </div>
                </div>
                <div style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  backgroundColor: daysUntilDeposit <= 3 ? '#FFEBEE' : '#E8F3FF',
                  color: daysUntilDeposit <= 3 ? '#F04438' : '#3182F6',
                }}>
                  {daysUntilDeposit === 0 ? '오늘 입금!' : `D-${daysUntilDeposit}`}
                </div>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', color: '#6B7684' }}>현재</span>
                  <span style={{ fontSize: '13px', color: '#6B7684' }}>목표</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '20px', fontWeight: '700', color: '#191F28' }}>
                    ₩{account.currentKRW.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '14px', color: '#8B95A1' }}>
                    ₩{account.targetKRW.toLocaleString()}
                  </span>
                </div>
              </div>

              <div style={{
                height: '8px',
                backgroundColor: '#F2F4F6',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '8px',
              }}>
                <div style={{
                  width: `${Math.min(progress, 100)}%`,
                  height: '100%',
                  backgroundColor: progress >= 100 ? '#00C853' : '#3182F6',
                  borderRadius: '4px',
                  transition: 'width 0.3s',
                }} />
              </div>

              <div style={{ fontSize: '12px', color: remaining > 0 ? '#F57F17' : '#00C853' }}>
                {remaining > 0
                  ? `⏳ ₩${remaining.toLocaleString()} 더 필요 ${account.depositDay ? `(매월 ${account.depositDay}일 입금)` : '(여유될 때마다)'}`
                  : '✓ 목표 달성!'}
              </div>
            </div>
          )
        })}
      </div>

      {/* 2월 실현수익 */}
      <div style={{
        padding: '20px',
        backgroundColor: '#E8F5E9',
        borderRadius: '16px',
        border: '1px solid #A5D6A7',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>💰</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#2E7D32' }}>2월 실현수익</span>
          </div>
          <span style={{ fontSize: '24px', fontWeight: '700', color: '#00C853' }}>
            +{REALIZED_GAINS.total.toLocaleString()}원
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {REALIZED_GAINS.details.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: '#4E5968' }}>{item.type}</span>
              <span style={{ color: '#00C853', fontWeight: '600' }}>
                +{item.amount.toLocaleString()}원
                {item.percent && ` (${item.percent}%)`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 보유종목 - 증권사별 */}
      <div style={{
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #E5E8EB',
        marginBottom: '24px',
      }}>
        {/* 섹션 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>💼</span>
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#191F28' }}>보유종목</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#191F28' }}>
              ₩{(TOSS_HOLDINGS.reduce((sum, h) => sum + h.currentKRW, 0) + MIRAE_ACCOUNTS.reduce((sum, acc) => sum + acc.totalKRW, 0)).toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: (TOSS_HOLDINGS.reduce((sum, h) => sum + h.gainKRW, 0) + MIRAE_ACCOUNTS.reduce((sum, acc) => sum + acc.gainKRW, 0)) >= 0 ? '#00C853' : '#F04438' }}>
              {(TOSS_HOLDINGS.reduce((sum, h) => sum + h.gainKRW, 0) + MIRAE_ACCOUNTS.reduce((sum, acc) => sum + acc.gainKRW, 0)) >= 0 ? '+' : ''}
              ₩{(TOSS_HOLDINGS.reduce((sum, h) => sum + h.gainKRW, 0) + MIRAE_ACCOUNTS.reduce((sum, acc) => sum + acc.gainKRW, 0)).toLocaleString()}
            </div>
          </div>
        </div>

        {/* ===== 토스증권 ===== */}
        <div style={{
          backgroundColor: '#F0F7FF',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>📱</span>
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#191F28' }}>토스증권</span>
              <span style={{ fontSize: '12px', color: '#3182F6', backgroundColor: '#E8F3FF', padding: '2px 8px', borderRadius: '4px' }}>해외주식</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#191F28' }}>
                ₩{TOSS_HOLDINGS.reduce((sum, h) => sum + h.currentKRW, 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: TOSS_HOLDINGS.reduce((sum, h) => sum + h.gainKRW, 0) >= 0 ? '#00C853' : '#F04438' }}>
                {TOSS_HOLDINGS.reduce((sum, h) => sum + h.gainKRW, 0) >= 0 ? '+' : ''}
                ₩{TOSS_HOLDINGS.reduce((sum, h) => sum + h.gainKRW, 0).toLocaleString()}
              </div>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', backgroundColor: 'white', borderRadius: '8px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E8EB' }}>
                <th style={{ padding: '8px', textAlign: 'left', color: '#8B95A1', fontWeight: '500' }}>종목</th>
                <th style={{ padding: '8px', textAlign: 'right', color: '#8B95A1', fontWeight: '500' }}>보유</th>
                <th style={{ padding: '8px', textAlign: 'right', color: '#8B95A1', fontWeight: '500' }}>평가금액</th>
                <th style={{ padding: '8px', textAlign: 'right', color: '#8B95A1', fontWeight: '500' }}>손익</th>
              </tr>
            </thead>
            <tbody>
              {TOSS_HOLDINGS.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F2F4F6' }}>
                  <td style={{ padding: '8px' }}>
                    <div style={{ fontWeight: '600', fontSize: '12px' }}>{item.ticker}</div>
                    <div style={{ fontSize: '10px', color: '#8B95A1' }}>{item.name}</div>
                  </td>
                  <td style={{ padding: '8px', textAlign: 'right', color: '#8B95A1', fontSize: '11px' }}>
                    {item.shares.toFixed(4)}주
                  </td>
                  <td style={{ padding: '8px', textAlign: 'right', fontWeight: '600', fontSize: '12px' }}>
                    ₩{item.currentKRW.toLocaleString()}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'right' }}>
                    <span style={{ color: item.gainKRW >= 0 ? '#00C853' : '#F04438', fontWeight: '600', fontSize: '12px' }}>
                      {item.gainKRW >= 0 ? '+' : ''}{item.gainKRW.toLocaleString()}
                    </span>
                    <div style={{ fontSize: '10px', color: item.gainPercent >= 0 ? '#00C853' : '#F04438' }}>
                      ({item.gainPercent >= 0 ? '+' : ''}{item.gainPercent}%)
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== 미래에셋증권 ===== */}
        <div style={{
          backgroundColor: '#FFF8E1',
          borderRadius: '12px',
          padding: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🏦</span>
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#191F28' }}>미래에셋증권</span>
              <span style={{ fontSize: '12px', color: '#F57C00', backgroundColor: '#FFE0B2', padding: '2px 8px', borderRadius: '4px' }}>5개 계좌</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#191F28' }}>
                ₩{MIRAE_ACCOUNTS.reduce((sum, acc) => sum + acc.totalKRW, 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: MIRAE_ACCOUNTS.reduce((sum, acc) => sum + acc.gainKRW, 0) >= 0 ? '#00C853' : '#F04438' }}>
                {MIRAE_ACCOUNTS.reduce((sum, acc) => sum + acc.gainKRW, 0) >= 0 ? '+' : ''}
                ₩{MIRAE_ACCOUNTS.reduce((sum, acc) => sum + acc.gainKRW, 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* 미래에셋 계좌별 */}
          {MIRAE_ACCOUNTS.map((account) => (
          <div key={account.id} style={{ marginBottom: '20px' }}>
            {/* 계좌 헤더 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              backgroundColor: '#F7F8FA',
              borderRadius: '8px',
              marginBottom: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>{account.icon}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#191F28' }}>{account.name}</div>
                  <div style={{ fontSize: '11px', color: '#8B95A1' }}>{account.accountNo}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#191F28' }}>
                  ₩{account.totalKRW.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: account.gainKRW >= 0 ? '#00C853' : '#F04438' }}>
                  {account.gainKRW >= 0 ? '▲' : '▼'} {Math.abs(account.gainKRW).toLocaleString()}원 ({account.gainKRW >= 0 ? '+' : ''}{account.gainPercent}%)
                </div>
              </div>
            </div>

            {/* 종목 테이블 */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E8EB' }}>
                  <th style={{ padding: '8px', textAlign: 'left', color: '#8B95A1', fontWeight: '500' }}>종목</th>
                  <th style={{ padding: '8px', textAlign: 'right', color: '#8B95A1', fontWeight: '500' }}>수량</th>
                  <th style={{ padding: '8px', textAlign: 'right', color: '#8B95A1', fontWeight: '500' }}>평가금액</th>
                  <th style={{ padding: '8px', textAlign: 'right', color: '#8B95A1', fontWeight: '500' }}>매입금액</th>
                  <th style={{ padding: '8px', textAlign: 'right', color: '#8B95A1', fontWeight: '500' }}>손익</th>
                </tr>
              </thead>
              <tbody>
                {account.holdings.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F2F4F6' }}>
                    <td style={{ padding: '10px 8px', fontWeight: '600' }}>{item.name}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', color: '#8B95A1' }}>
                      {item.shares > 0 ? `${item.shares}주` : '-'}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: '600' }}>
                      ₩{item.currentKRW.toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', color: '#8B95A1' }}>
                      ₩{item.investedKRW.toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                      <span style={{ color: item.gainKRW >= 0 ? '#00C853' : '#F04438', fontWeight: '600' }}>
                        {item.gainKRW >= 0 ? '+' : ''}{item.gainKRW.toLocaleString()}
                      </span>
                      <div style={{ fontSize: '11px', color: item.gainPercent >= 0 ? '#00C853' : '#F04438' }}>
                        ({item.gainPercent >= 0 ? '+' : ''}{item.gainPercent}%)
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        </div>
      </div>

      {/* 공모주 청약 */}
      <div style={{
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #E5E8EB',
        marginBottom: '24px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🎯</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#191F28' }}>공모주 청약</span>
          </div>
          <a
            href="https://www.38.co.kr/html/fund/index.htm?o=k"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '6px 12px',
              backgroundColor: '#F2F4F6',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#4E5968',
              textDecoration: 'none',
            }}
          >
            📅 청약일정 보기 →
          </a>
        </div>

        {IPO_SUBSCRIPTIONS.length === 0 ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#8B95A1',
            backgroundColor: '#F8F9FA',
            borderRadius: '12px',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📋</div>
            <div style={{ fontSize: '14px', marginBottom: '8px' }}>현재 예정된 청약이 없습니다</div>
            <div style={{ fontSize: '12px', color: '#B0B8C1' }}>
              청약 일정이 생기면 여기에 추가됩니다
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {IPO_SUBSCRIPTIONS.map(ipo => {
              const today = new Date().toISOString().split('T')[0]
              const isSubscribing = today >= ipo.subscriptionStart && today <= ipo.subscriptionEnd
              const isPast = today > ipo.listingDate

              const statusColors = {
                upcoming: { bg: '#E8F3FF', color: '#3182F6', label: '청약예정' },
                subscribing: { bg: '#FFF3E0', color: '#F57C00', label: '청약중' },
                waiting: { bg: '#F3E5F5', color: '#9C27B0', label: '배정대기' },
                listed: { bg: '#E8F5E9', color: '#00C853', label: '상장완료' },
                missed: { bg: '#F5F5F5', color: '#9E9E9E', label: '미참여' },
              }
              const status = statusColors[ipo.status] || statusColors.upcoming

              return (
                <div key={ipo.id} style={{
                  padding: '16px',
                  backgroundColor: '#F8F9FA',
                  borderRadius: '12px',
                  border: isSubscribing ? '2px solid #F57C00' : '1px solid #E5E8EB',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#191F28' }}>
                        {ipo.name}
                        <span style={{ fontSize: '12px', fontWeight: '400', color: '#8B95A1', marginLeft: '8px' }}>
                          {ipo.code}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#6B7684', marginTop: '4px' }}>
                        {ipo.broker}
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backgroundColor: status.bg,
                      color: status.color,
                    }}>
                      {status.label}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '12px' }}>
                    <div>
                      <div style={{ color: '#8B95A1', marginBottom: '2px' }}>청약일</div>
                      <div style={{ color: '#191F28', fontWeight: '500' }}>
                        {ipo.subscriptionStart.slice(5)} ~ {ipo.subscriptionEnd.slice(5)}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#8B95A1', marginBottom: '2px' }}>공모가</div>
                      <div style={{ color: '#191F28', fontWeight: '500' }}>
                        {ipo.finalPrice ? `${ipo.finalPrice.toLocaleString()}원` : ipo.priceRange}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#8B95A1', marginBottom: '2px' }}>경쟁률</div>
                      <div style={{ color: ipo.competition ? '#3182F6' : '#8B95A1', fontWeight: '500' }}>
                        {ipo.competition ? `${ipo.competition}:1` : '-'}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#8B95A1', marginBottom: '2px' }}>배정</div>
                      <div style={{ color: ipo.allocated ? '#00C853' : '#8B95A1', fontWeight: '600' }}>
                        {ipo.allocated ? `${ipo.allocated}주` : '-'}
                      </div>
                    </div>
                  </div>

                  {ipo.subscriptionAmount > 0 && (
                    <div style={{
                      marginTop: '12px',
                      padding: '8px 12px',
                      backgroundColor: '#E8F3FF',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#3182F6',
                    }}>
                      💰 청약 증거금: ₩{ipo.subscriptionAmount.toLocaleString()}
                      {ipo.refundDate && ` · 환불일: ${ipo.refundDate.slice(5)}`}
                    </div>
                  )}

                  {ipo.note && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#6B7684' }}>
                      📝 {ipo.note}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div style={styles.mainGrid}>
        {/* 종목 테이블 */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <span style={styles.tableTitle}>보유 종목</span>
            <span style={{ fontSize: '13px', color: '#8B95A1' }}>{PORTFOLIO.length}개 종목 · 목표 ₩{TARGET_TOTAL.toLocaleString()}</span>
          </div>

          {/* 필터 */}
          <div style={{
            padding: '12px 20px',
            borderBottom: '1px solid #E5E8EB',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#8B95A1' }}>투자상태:</span>
              {[
                { value: 'all', label: '전체' },
                { value: 'invested', label: '보유중' },
                { value: 'notInvested', label: '미투자' },
                { value: 'needBuy', label: '추가매수' },
                { value: 'overBuy', label: '초과' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setFilter({ ...filter, status: opt.value })}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    backgroundColor: filter.status === opt.value ? '#3182F6' : '#F2F4F6',
                    color: filter.status === opt.value ? 'white' : '#4E5968',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#8B95A1' }}>상태:</span>
              {[
                { value: 'all', label: '전체' },
                { value: 'danger', label: '🚨 손절' },
                { value: 'warning', label: '⚠️ 주의' },
                { value: 'caution', label: '📉 관찰' },
                { value: 'profit', label: '🔥 수익' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setFilter({ ...filter, alert: opt.value })}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    backgroundColor: filter.alert === opt.value ? '#3182F6' : '#F2F4F6',
                    color: filter.alert === opt.value ? 'white' : '#4E5968',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#8B95A1' }}>정렬:</span>
              <select
                value={filter.sort}
                onChange={(e) => setFilter({ ...filter, sort: e.target.value })}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #E5E8EB',
                  fontSize: '12px',
                  color: '#4E5968',
                  cursor: 'pointer',
                }}
              >
                <option value="weight">목표비중순</option>
                <option value="invested">투자금액순</option>
                <option value="gain">수익률순</option>
                <option value="per">PER순</option>
                <option value="name">이름순</option>
              </select>
            </div>
          </div>
          <div>
            <table style={{ ...styles.table, tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, width: '140px' }}>종목</th>
                  <th style={{ ...styles.thRight, width: '60px' }}>목표</th>
                  <th style={{ ...styles.thRight, width: '80px' }}>목표금액</th>
                  <th style={{ ...styles.thRight, width: '80px' }}>투자금액</th>
                  <th style={{ ...styles.thRight, width: '90px' }}>추가매수</th>
                  <th style={{ ...styles.thRight, width: '70px' }}>현재가</th>
                  <th style={{ ...styles.thRight, width: '70px' }}>매수후고점</th>
                  <th style={{ ...styles.thRight, width: '65px' }}>고점대비</th>
                  <th style={{ ...styles.thRight, width: '50px' }}>PER</th>
                  <th style={{ ...styles.thRight, width: '50px' }}>PBR</th>
                  <th style={{ ...styles.thRight, width: '80px' }}>평가금액</th>
                  <th style={{ ...styles.thRight, width: '80px' }}>손익</th>
                  <th style={{ ...styles.thRight, width: '60px' }}>수익률</th>
                  <th style={{ ...styles.th, width: '90px' }}>상태</th>
                </tr>
              </thead>
              <tbody>
                {PORTFOLIO
                  // 필터 적용
                  .filter(item => {
                    const targetAmount = TARGET_TOTAL * (item.targetWeight / 100)
                    const needToBuy = targetAmount - item.investedKRW
                    const myGainPercent = item.investedKRW > 0 ? (item.gainKRW / item.investedKRW) * 100 : 0
                    const stockData = data[item.ticker]
                    const dropFromHigh = getDropFromHighByItem(item, stockData)

                    // 투자상태 필터
                    if (filter.status === 'invested' && item.investedKRW === 0) return false
                    if (filter.status === 'notInvested' && item.investedKRW > 0) return false
                    if (filter.status === 'needBuy' && needToBuy <= 0) return false
                    if (filter.status === 'overBuy' && needToBuy >= 0) return false

                    // 상태 필터
                    if (filter.alert === 'danger' && !(item.investedKRW > 0 && dropFromHigh <= -15)) return false
                    if (filter.alert === 'warning' && !(item.investedKRW > 0 && dropFromHigh > -15 && dropFromHigh <= -10)) return false
                    if (filter.alert === 'caution' && !(item.investedKRW > 0 && dropFromHigh > -10 && dropFromHigh <= -5)) return false
                    if (filter.alert === 'profit' && !(item.investedKRW > 0 && myGainPercent >= 5)) return false

                    return true
                  })
                  // 정렬 적용
                  .sort((a, b) => {
                    if (filter.sort === 'weight') return b.targetWeight - a.targetWeight
                    if (filter.sort === 'invested') return b.investedKRW - a.investedKRW
                    if (filter.sort === 'gain') {
                      const gainA = a.investedKRW > 0 ? (a.gainKRW / a.investedKRW) * 100 : -999
                      const gainB = b.investedKRW > 0 ? (b.gainKRW / b.investedKRW) * 100 : -999
                      return gainB - gainA
                    }
                    if (filter.sort === 'per') {
                      const perA = a.per || 999
                      const perB = b.per || 999
                      return perA - perB
                    }
                    if (filter.sort === 'name') return a.name.localeCompare(b.name)
                    return 0
                  })
                  .map(item => {
                  const stockData = data[item.ticker]
                  // 실제 손익률 계산
                  const myGainPercent = item.investedKRW > 0 ? (item.gainKRW / item.investedKRW) * 100 : 0
                  // 고점대비 계산 (새 함수 사용)
                  const dropFromHigh = getDropFromHighByItem(item, stockData)
                  const highSinceBuy = getHighSinceBuyByItem(item, stockData)
                  const alertType = item.investedKRW > 0 ? getAlertType(dropFromHigh) : 'normal'
                  const statusInfo = item.investedKRW > 0 ? getStatusIcon(dropFromHigh, myGainPercent) : null
                  const cost = item.investedKRW
                  const currentValue = cost + item.gainKRW
                  // 목표 금액 및 추가 매수 필요 금액
                  const targetAmount = TARGET_TOTAL * (item.targetWeight / 100)
                  const needToBuy = targetAmount - item.investedKRW
                  const isNotInvested = item.investedKRW === 0

                  return (
                    <tr key={item.ticker} style={{
                      ...styles.warningRow(alertType),
                      backgroundColor: isNotInvested ? '#FFFBEB' : styles.warningRow(alertType).backgroundColor,
                      opacity: isNotInvested ? 0.9 : 1,
                    }}>
                      <td style={styles.td}>
                        <div style={styles.tickerCell}>
                          <div style={styles.tickerDot(SECTOR_COLORS[item.ticker] || '#8B95A1')} />
                          <div style={styles.tickerInfo}>
                            <span style={styles.tickerSymbol}>{item.displayTicker}</span>
                            <span style={styles.tickerName}>{item.name}</span>
                          </div>
                        </div>
                      </td>
                      {/* 목표비중 */}
                      <td style={styles.tdRight}>
                        <strong>{item.targetWeight}%</strong>
                      </td>
                      {/* 목표금액 */}
                      <td style={styles.tdRight}>
                        ₩{targetAmount.toLocaleString()}
                      </td>
                      {/* 투자금액 */}
                      <td style={styles.tdRight}>
                        <span style={{ color: isNotInvested ? '#F57F17' : '#191F28' }}>
                          {isNotInvested ? '미투자' : `₩${item.investedKRW.toLocaleString()}`}
                        </span>
                      </td>
                      {/* 추가매수 */}
                      <td style={styles.tdRight}>
                        <span style={{
                          color: needToBuy > 0 ? '#3182F6' : needToBuy < 0 ? '#F04438' : '#00C853',
                          fontWeight: '600',
                          fontSize: '12px',
                        }}>
                          {needToBuy > 0 ? `+₩${Math.round(needToBuy).toLocaleString()}` :
                           needToBuy < 0 ? `초과 ₩${Math.abs(Math.round(needToBuy)).toLocaleString()}` : '완료'}
                        </span>
                      </td>
                      {/* 현재가 */}
                      <td style={styles.tdRight}>
                        <span style={styles.priceValue}>
                          {stockData?.price ? (
                            <>
                              {item.currency === 'KRW' ? '₩' : '$'}
                              {stockData.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </>
                          ) : '-'}
                        </span>
                      </td>
                      {/* 매수후고점 */}
                      <td style={styles.tdRight}>
                        {item.investedKRW > 0 && highSinceBuy ? (
                          <span style={{ color: '#8B95A1', fontSize: '12px' }}>
                            {item.currency === 'KRW' ? '₩' : '$'}
                            {highSinceBuy.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </span>
                        ) : '-'}
                      </td>
                      {/* 고점대비 */}
                      <td style={styles.tdRight}>
                        {item.investedKRW > 0 ? (
                          <span style={{
                            color: dropFromHigh >= 0 ? '#00C853' : dropFromHigh >= -5 ? '#FF9800' : dropFromHigh >= -10 ? '#F57F17' : '#F04438',
                            fontWeight: '600',
                            fontSize: '12px',
                          }}>
                            {dropFromHigh >= 0 ? '+' : ''}{dropFromHigh.toFixed(1)}%
                          </span>
                        ) : '-'}
                      </td>
                      {/* PER */}
                      <td style={styles.tdRight}>
                        {item.per ? (
                          <span style={{
                            ...styles.metricBadge,
                            backgroundColor: item.per > 50 ? '#FFEBEE' : item.per < 20 ? '#E8F5E9' : '#F2F4F6',
                            color: item.per > 50 ? '#F04438' : item.per < 20 ? '#00C853' : '#4E5968',
                          }}>{item.per.toFixed(1)}</span>
                        ) : '-'}
                      </td>
                      {/* PBR */}
                      <td style={styles.tdRight}>
                        {item.pbr ? (
                          <span style={{
                            ...styles.metricBadge,
                            backgroundColor: item.pbr > 10 ? '#FFEBEE' : item.pbr < 3 ? '#E8F5E9' : '#F2F4F6',
                            color: item.pbr > 10 ? '#F04438' : item.pbr < 3 ? '#00C853' : '#4E5968',
                          }}>{item.pbr.toFixed(1)}</span>
                        ) : '-'}
                      </td>
                      {/* 평가금액 */}
                      <td style={styles.tdRight}>
                        {item.investedKRW > 0 ? `₩${Math.round(currentValue).toLocaleString()}` : '-'}
                      </td>
                      {/* 손익금액 */}
                      <td style={styles.tdRight}>
                        {item.investedKRW > 0 ? (
                          <span style={{
                            color: item.gainKRW > 0 ? '#00C853' : item.gainKRW < 0 ? '#F04438' : '#8B95A1',
                            fontWeight: '600'
                          }}>
                            {item.gainKRW >= 0 ? '+' : ''}₩{item.gainKRW.toLocaleString()}
                          </span>
                        ) : '-'}
                      </td>
                      {/* 수익률 */}
                      <td style={styles.tdRight}>
                        {item.investedKRW > 0 ? (
                          <span style={{
                            color: myGainPercent > 0 ? '#00C853' : myGainPercent < 0 ? '#F04438' : '#8B95A1',
                            fontWeight: '600'
                          }}>
                            {myGainPercent > 0 ? '+' : ''}{myGainPercent.toFixed(2)}%
                          </span>
                        ) : '-'}
                      </td>
                      {/* 상태 */}
                      <td style={styles.td}>
                        {isNotInvested ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            backgroundColor: '#FFF8E1',
                            color: '#F57F17',
                          }}>
                            ⏳ 매수예정
                          </span>
                        ) : statusInfo ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            backgroundColor: statusInfo.color === '#F04438' ? '#FFEBEE' :
                                           statusInfo.color === '#F57F17' ? '#FFF8E1' :
                                           statusInfo.color === '#FF9800' ? '#FFF3E0' : '#E8F5E9',
                            color: statusInfo.color,
                          }}>
                            {statusInfo.icon} {statusInfo.label}
                          </span>
                        ) : (
                          <span style={{ color: '#8B95A1', fontSize: '12px' }}>—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 비중 차트 */}
        <div style={styles.chartCard}>
          <div>
            <div style={styles.chartTitle}>목표 포트폴리오 비중</div>
            <div style={styles.pieContainer}>
              <div style={getPieChartStyle(PORTFOLIO)} />
              <div style={styles.pieCenter}>
                <div style={styles.pieCenterValue}>₩{(TARGET_TOTAL / 10000).toFixed(0)}만</div>
                <div style={styles.pieCenterLabel}>목표 투자금</div>
              </div>
            </div>
          </div>

          <div style={styles.legendList}>
            {PORTFOLIO
              .sort((a, b) => b.targetWeight - a.targetWeight)
              .map(item => {
                const isInvested = item.investedKRW > 0
                return (
                  <div key={item.ticker} style={{
                    ...styles.legendItem,
                    opacity: isInvested ? 1 : 0.6,
                  }}>
                    <div style={styles.legendLeft}>
                      <div style={styles.legendDot(SECTOR_COLORS[item.ticker] || '#8B95A1')} />
                      <span style={{
                        ...styles.legendName,
                        fontWeight: isInvested ? 'normal' : '500',
                        color: isInvested ? '#4E5968' : '#F57F17',
                      }}>
                        {item.name}
                        {!isInvested && ' ⏳'}
                      </span>
                    </div>
                    <span style={styles.legendValue}>{item.targetWeight}%</span>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* 알림 섹션 */}
      {(dangerCount > 0 || warningCount > 0) && (
        <div style={{
          marginTop: '24px',
          padding: '20px',
          backgroundColor: dangerCount > 0 ? '#FFF5F5' : '#FFFBEB',
          borderRadius: '16px',
          border: `1px solid ${dangerCount > 0 ? '#FFCDD2' : '#FFE082'}`
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '700',
            color: dangerCount > 0 ? '#F04438' : '#F57F17',
            marginBottom: '12px'
          }}>
            {dangerCount > 0 ? '🚨 손절 검토 필요' : '⚠️ 주의 종목 발생'}
          </div>
          <div style={{ fontSize: '14px', color: '#4E5968', lineHeight: '1.8' }}>
            {PORTFOLIO.filter(item => {
              const drop = getDropFromHigh(item.ticker)
              return drop <= -10
            }).map(item => {
              const drop = getDropFromHigh(item.ticker)
              const alertType = getAlertType(drop)
              return (
                <div key={item.ticker} style={{ marginBottom: '8px' }}>
                  <strong>{item.name} ({item.displayTicker})</strong>:
                  고점 대비 <span style={{
                    color: alertType === 'danger' ? '#F04438' : '#F57F17',
                    fontWeight: '600'
                  }}>{drop.toFixed(1)}%</span>
                  {alertType === 'danger' && (
                    <span style={{ marginLeft: '8px', color: '#F04438' }}>
                      → 원칙: -15% 손절 고려, -20% 무조건
                    </span>
                  )}
                  {alertType === 'warning' && (
                    <span style={{ marginLeft: '8px', color: '#F57F17' }}>
                      → 모니터링 필요
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 매도 예정 종목 (기타) */}
      {PENDING_SALES.length > 0 && (
        <div style={{
          marginTop: '24px',
          padding: '20px',
          backgroundColor: '#FFF9E6',
          borderRadius: '16px',
          border: '1px solid #FFE082',
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#F57F17',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            📦 기타 (매도 예정 종목)
            <span style={{ fontSize: '12px', fontWeight: '500', color: '#856404' }}>
              · 비중 미포함 · 매도 후 금액 기록 예정
            </span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #FFE082' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '12px', color: '#856404' }}>종목</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: '12px', color: '#856404' }}>투자원금</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: '12px', color: '#856404' }}>평가손익</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: '12px', color: '#856404' }}>상태</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: '12px', color: '#856404' }}>매도금액</th>
              </tr>
            </thead>
            <tbody>
              {PENDING_SALES.map(item => (
                <tr key={item.ticker}>
                  <td style={{ padding: '10px 12px', fontSize: '13px' }}>
                    <span style={{ fontWeight: '600' }}>{item.displayTicker}</span>
                    <span style={{ marginLeft: '8px', color: '#856404' }}>{item.name}</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '13px' }}>
                    ₩{item.investedKRW.toLocaleString()}
                  </td>
                  <td style={{
                    padding: '10px 12px',
                    textAlign: 'right',
                    fontSize: '13px',
                    color: item.gainKRW >= 0 ? '#00C853' : '#F04438',
                    fontWeight: '600',
                  }}>
                    {item.gainKRW >= 0 ? '+' : ''}₩{item.gainKRW.toLocaleString()}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backgroundColor: item.status === '매도예정' ? '#FFF3E0' : '#E8F5E9',
                      color: item.status === '매도예정' ? '#F57C00' : '#00C853',
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '13px', color: '#856404' }}>
                    {item.soldKRW ? `₩${item.soldKRW.toLocaleString()}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '1px solid #FFE082' }}>
                <td style={{ padding: '10px 12px', fontSize: '13px', fontWeight: '600' }}>합계</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '13px', fontWeight: '600' }}>
                  ₩{PENDING_SALES.reduce((sum, item) => sum + item.investedKRW, 0).toLocaleString()}
                </td>
                <td style={{
                  padding: '10px 12px',
                  textAlign: 'right',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: PENDING_SALES.reduce((sum, item) => sum + item.gainKRW, 0) >= 0 ? '#00C853' : '#F04438',
                }}>
                  {PENDING_SALES.reduce((sum, item) => sum + item.gainKRW, 0) >= 0 ? '+' : ''}
                  ₩{PENDING_SALES.reduce((sum, item) => sum + item.gainKRW, 0).toLocaleString()}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* 범례 설명 */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#F7F8FA',
        borderRadius: '12px',
        fontSize: '12px',
        color: '#8B95A1',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <span><strong>범례:</strong></span>
        <span>🔥 = 내 수익 +5% 이상</span>
        <span>⚠️ = 매수후고점 대비 -10% 이상</span>
        <span>🚨 = 매수후고점 대비 -15% 이상 (손절 고려)</span>
        <span>PER = 주가수익비율</span>
        <span>PBR = 주가순자산비율</span>
        <span>ROE = 자기자본이익률 (15%+ 우량)</span>
      </div>
      </>
      )}
    </div>
  )
}
