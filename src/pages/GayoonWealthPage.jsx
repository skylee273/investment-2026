import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// 분기별 포트폴리오
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4']

const QUARTERLY_PORTFOLIOS = {
  'Q1': {
    label: '2026년 1분기',
    period: '2026.01 - 2026.03',
    portfolio: [
      { ticker: 'KODEX200', name: 'KODEX 200', type: 'ETF', investedKRW: 0, gainKRW: 0 },
      { ticker: 'TIGER S&P', name: 'TIGER 미국S&P500', type: 'ETF', investedKRW: 0, gainKRW: 0 },
    ]
  },
  'Q2': { label: '2026년 2분기', period: '2026.04 - 2026.06', portfolio: [] },
  'Q3': { label: '2026년 3분기', period: '2026.07 - 2026.09', portfolio: [] },
  'Q4': { label: '2026년 4분기', period: '2026.10 - 2026.12', portfolio: [] },
}

// 세제혜택 계좌 현황
const TAX_ACCOUNTS = [
  { id: 'pension', name: '연금저축', icon: '🧓', targetKRW: 6000000, currentKRW: 6000000, depositDay: null, note: '세액공제 79.2만원', status: '완료' },
  { id: 'irp', name: 'IRP', icon: '🏦', targetKRW: 3000000, currentKRW: 250000, depositDay: 25, note: '세액공제 39.6만원 · 월 25만원', status: '진행중' },
  { id: 'isa', name: 'ISA', icon: '📈', targetKRW: 20000000, currentKRW: 20000000, depositDay: null, note: '비과세 200만원', status: '완료' },
  { id: 'pension-extra', name: '추가 연금저축', icon: '💰', targetKRW: 9000000, currentKRW: 0, depositDay: 25, note: '과세이연 · 월 60만원', status: '진행중' },
]

// ISA 포트폴리오 (2,000만원) - S&P 50% / 나스닥 15% / 신흥국 15% / 금 10% / 채권 10%
const ISA_PORTFOLIO = [
  { ticker: '360750', name: 'TIGER 미국S&P500', category: '해외주식', targetWeight: 50, risk: 3 },
  { ticker: '133690', name: 'TIGER 미국나스닥100', category: '해외주식', targetWeight: 15, risk: 4 },
  { ticker: '195980', name: 'TIGER MSCI신흥국', category: '해외주식', targetWeight: 15, risk: 5 },
  { ticker: '472150', name: 'KODEX 골드액티브', category: '금', targetWeight: 10, risk: 1 },
  { ticker: '305080', name: 'TIGER 미국채10년선물', category: '채권', targetWeight: 10, risk: 1 },
]

// 연금저축 포트폴리오 (600만원) - 국내주식 100% (7:3)
const PENSION_PORTFOLIO = [
  { ticker: '069500', name: 'KODEX 코스피200', category: '국내주식', targetWeight: 70, risk: 2 },
  { ticker: '229200', name: 'KODEX 코스닥150', category: '국내주식', targetWeight: 30, risk: 3 },
]

// IRP 포트폴리오 (300만원) - 위험자산 70% + 안전자산 30%
const IRP_PORTFOLIO = [
  { ticker: '133690', name: 'TIGER 미국나스닥100', category: '해외주식', targetWeight: 35, risk: 4 },
  { ticker: '360750', name: 'TIGER 미국S&P500', category: '해외주식', targetWeight: 21, risk: 3 },
  { ticker: '195980', name: 'TIGER MSCI신흥국', category: '해외주식', targetWeight: 14, risk: 5 },
  { ticker: '472150', name: 'KODEX 골드액티브', category: '금', targetWeight: 30, risk: 1 },
]

// 추가 연금저축 포트폴리오 (900만원)
const PENSION_EXTRA_PORTFOLIO = [
  { ticker: '069500', name: 'KODEX 코스피200', category: '국내주식', targetWeight: 25, risk: 2 },
  { ticker: '360750', name: 'TIGER 미국S&P500', category: '해외주식', targetWeight: 20, risk: 3 },
  { ticker: '472150', name: 'KODEX 골드액티브', category: '금', targetWeight: 20, risk: 1 },
  { ticker: '133690', name: 'TIGER 미국나스닥100', category: '해외주식', targetWeight: 15, risk: 4 },
  { ticker: '195980', name: 'TIGER MSCI신흥국', category: '해외주식', targetWeight: 10, risk: 5 },
  { ticker: '229200', name: 'KODEX 코스닥150', category: '국내주식', targetWeight: 10, risk: 3 },
]

// 실시간 추적 자산 (매입가 기준 수익률 계산)
const TRACKED_ASSETS = [
  {
    id: 'amazon',
    name: '아마존 (AMZN)',
    icon: '🛒',
    type: 'manual',
    shares: 9,
    investedKRW: 2782034,
    currentKRW: 2653715,
    note: '9주 보유',
  },
  {
    id: 'bitcoin',
    name: '비트코인 (BTC)',
    icon: '₿',
    type: 'crypto',
    ticker: 'BTC',
    investedKRW: 1000000,
    buyPriceBTC: 98180000, // 매입 시 BTC 가격
    btcAmount: 1000000 / 98180000, // 보유 BTC 수량
    note: '매입가 9,818만원',
  },
]

// 1. 고정자산 (빼면 손해나는 자산)
const FIXED_ASSETS = [
  { id: 'youth-account', name: '청년 도약 계좌', icon: '🚀', currentKRW: 16800000, note: '5년 만기 · 6%+정부기여금' },
  { id: 'housing', name: '청약저축', icon: '🏠', currentKRW: 6220000, note: '1순위 충족 · 2.3%' },
  { id: 'isa', name: 'ISA', icon: '📈', currentKRW: 20000000, note: '비과세 200만원' },
  { id: 'pension', name: '연금저축', icon: '🧓', currentKRW: 6000000, note: '세액공제 79.2만원' },
]

// 2. 비변동성 자산 (투자 중인 자산 + 받을 돈)
const STABLE_ASSETS = [
  { id: 'sp500-dividend', name: 'S&P500 + 배당주', icon: '📈', currentKRW: 26796000, note: '소수점 매수', type: 'stock' },
  // 아마존, 비트코인은 TRACKED_ASSETS에서 가져옴
  { id: 'family', name: '가족 받을 돈', icon: '👨‍👩‍👧', currentKRW: 20000000, note: '6월 수령 예정', type: 'receivable' },
  { id: 'deposit', name: '전세 보증금', icon: '🏢', currentKRW: 45000000, note: '7월 수령 예정', type: 'receivable' },
]

// 3. 변동성 자산 (언제든 쓸 수 있는 자산)
const LIQUID_ASSETS = [
  { id: 'cma', name: 'CMA', icon: '💵', currentKRW: 6690000, note: '6개월치 생활비' },
  { id: 'free-savings', name: '자율적금', icon: '💰', currentKRW: 4500000, note: '1년 만기 · 2026-09 · 3.3%' },
  { id: 'irp', name: 'IRP', icon: '🏦', currentKRW: 250000, note: '세액공제 39.6만원 · 월 25만원' },
  { id: 'pension-extra', name: '추가 연금저축', icon: '💰', currentKRW: 0, note: '과세이연 · 월 60만원 예정' },
]

// 전체 보유 종목 통합 (ISA + 연금저축 + IRP + 개별주식)
const GAYOON_ALL_HOLDINGS = [
  // ISA (2,000만원)
  ...ISA_PORTFOLIO.map(item => ({
    ...item,
    account: 'ISA',
    accountIcon: '📈',
    investedKRW: Math.round(20000000 * item.targetWeight / 100),
    currentKRW: Math.round(20000000 * item.targetWeight / 100),
    gainKRW: 0,
    gainPercent: 0,
  })),
  // 연금저축 (600만원)
  ...PENSION_PORTFOLIO.map(item => ({
    ...item,
    account: '연금저축',
    accountIcon: '🧓',
    investedKRW: Math.round(6000000 * item.targetWeight / 100),
    currentKRW: Math.round(6000000 * item.targetWeight / 100),
    gainKRW: 0,
    gainPercent: 0,
  })),
  // IRP (25만원 현재)
  ...IRP_PORTFOLIO.map(item => ({
    ...item,
    account: 'IRP',
    accountIcon: '🏦',
    investedKRW: Math.round(250000 * item.targetWeight / 100),
    currentKRW: Math.round(250000 * item.targetWeight / 100),
    gainKRW: 0,
    gainPercent: 0,
  })),
  // S&P500 + 배당주
  {
    ticker: 'SPY+DIV',
    name: 'S&P500 + 배당주',
    category: '해외주식',
    account: '해외주식',
    accountIcon: '📊',
    investedKRW: 26796000,
    currentKRW: 26796000,
    gainKRW: 0,
    gainPercent: 0,
    risk: 3,
  },
  // 아마존
  {
    ticker: 'AMZN',
    name: '아마존',
    category: '해외주식',
    account: '해외주식',
    accountIcon: '🛒',
    shares: 9,
    investedKRW: 2782034,
    currentKRW: 2653715,
    gainKRW: -128319,
    gainPercent: -4.61,
    risk: 4,
  },
  // 비트코인 (실시간 가격은 컴포넌트 내에서 계산)
  {
    ticker: 'BTC',
    name: '비트코인',
    category: '암호화폐',
    account: '암호화폐',
    accountIcon: '₿',
    investedKRW: 1000000,
    currentKRW: 1000000, // 기본값, 실시간으로 업데이트
    gainKRW: 0,
    gainPercent: 0,
    risk: 5,
    isCrypto: true,
    btcAmount: 1000000 / 98180000,
  },
]

// 카테고리별 색상
const CATEGORY_COLORS = {
  'S&P500': '#3182F6',
  '나스닥': '#7C3AED',
  '신흥국': '#10B981',
  '금': '#F59E0B',
  '채권': '#6B7280',
  '국내대형': '#EF4444',
  '국내중소': '#F97316',
}

// 자산명 → 카테고리 매핑
const getAssetCategory = (name) => {
  if (name.includes('S&P') || name.includes('SPY')) return 'S&P500'
  if (name.includes('나스닥')) return '나스닥'
  if (name.includes('신흥국')) return '신흥국'
  if (name.includes('금')) return '금'
  if (name.includes('채권')) return '채권'
  if (name.includes('코스피') || name.includes('KODEX 200')) return '국내대형'
  if (name.includes('코스닥')) return '국내중소'
  return '기타'
}

// 안정자산 여부 판단 (금, 채권 = 안정자산)
const isSafeAsset = (name) => {
  return name.includes('금') || name.includes('골드') || name.includes('채권')
}

// 별 5개 위험도 표시
const RiskStars = ({ risk }) => {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: i <= risk ? '#F59E0B' : '#E5E8EB', fontSize: '10px' }}>★</span>
    )
  }
  return <span style={{ display: 'inline-flex', gap: '1px' }}>{stars}</span>
}

// 포트폴리오 차트 컴포넌트
function PortfolioChart({ icon, title, amount, status, statusColor, items }) {
  // 안정자산 비율 계산 (risk <= 2: 안정, risk >= 3: 위험)
  const safeAssetWeight = items
    .filter(item => item.risk <= 2)
    .reduce((sum, item) => sum + item.targetWeight, 0)
  const riskAssetWeight = 100 - safeAssetWeight

  // 평균 위험도 계산
  const avgRisk = items.reduce((sum, item) => sum + (item.risk * item.targetWeight), 0) / 100

  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #E5E8EB',
    }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>{icon}</span>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#191F28' }}>{title}</div>
            <div style={{ fontSize: '13px', color: '#8B95A1' }}>{(amount / 10000).toLocaleString()}만원</div>
          </div>
        </div>
        <div style={{
          padding: '4px 10px',
          backgroundColor: statusColor.bg,
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: '600',
          color: statusColor.text,
        }}>
          {status}
        </div>
      </div>

      {/* 위험/안정 자산 비율 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        padding: '10px 12px',
        backgroundColor: '#F7F8FA',
        borderRadius: '8px',
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <span style={{ fontSize: '12px', color: '#4E5968' }}>위험 {riskAssetWeight}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span style={{ fontSize: '12px', color: '#4E5968' }}>안정 {safeAssetWeight}%</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: '#8B95A1' }}>평균</span>
          <RiskStars risk={Math.round(avgRisk)} />
        </div>
      </div>

      {/* 스택 바 차트 */}
      <div style={{
        display: 'flex',
        height: '28px',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '12px',
      }}>
        {items.map((item, index) => {
          const category = getAssetCategory(item.name)
          const color = CATEGORY_COLORS[category] || '#9CA3AF'
          return (
            <div
              key={item.ticker}
              style={{
                width: `${item.targetWeight}%`,
                backgroundColor: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '10px',
                fontWeight: '600',
                borderRight: index < items.length - 1 ? '1px solid rgba(255,255,255,0.3)' : 'none',
              }}
              title={`${item.name}: ${item.targetWeight}%`}
            >
              {item.targetWeight >= 10 ? `${item.targetWeight}%` : item.targetWeight}
            </div>
          )
        })}
      </div>

      {/* 자산별 상세 (종목코드, 금액, 위험도 포함) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map(item => {
          const category = getAssetCategory(item.name)
          const color = CATEGORY_COLORS[category] || '#9CA3AF'
          const itemAmount = Math.round(amount * item.targetWeight / 100)
          const isSafe = item.risk <= 2
          return (
            <div key={item.ticker} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              backgroundColor: isSafe ? '#F0FDF4' : '#FFFBEB',
              borderRadius: '8px',
              fontSize: '11px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '2px',
                  backgroundColor: color,
                  flexShrink: 0,
                }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#4E5968', fontWeight: '600' }}>
                      {item.name.replace('TIGER ', '').replace('KODEX ', '')}
                    </span>
                    <RiskStars risk={item.risk} />
                  </div>
                  <span style={{ color: '#8B95A1', fontSize: '10px' }}>{item.ticker}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <span style={{ color: '#6B7684', fontSize: '12px' }}>{item.targetWeight}%</span>
                <span style={{ color: '#191F28', fontWeight: '700', fontSize: '12px', minWidth: '50px', textAlign: 'right' }}>
                  {(itemAmount / 10000).toLocaleString()}만
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: '100%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#191F28', margin: 0 },
  subtitle: { fontSize: '14px', color: '#8B95A1', marginTop: '4px' },
  rulesCard: { backgroundColor: '#FFF9E6', borderRadius: '16px', padding: '20px', marginBottom: '24px', border: '1px solid #FFE082' },
  rulesTitle: { fontSize: '14px', fontWeight: '700', color: '#F57F17', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' },
  rulesList: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: '#5D4037' },
  ruleItem: { display: 'flex', alignItems: 'flex-start', gap: '8px' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  summaryCard: { backgroundColor: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #E5E8EB' },
  summaryLabel: { fontSize: '13px', color: '#8B95A1', marginBottom: '8px' },
  summaryValue: { fontSize: '24px', fontWeight: '700', color: '#191F28' },
}

export default function GayoonWealthPage() {
  const navigate = useNavigate()
  const [currentQuarter, setCurrentQuarter] = useState('Q1')

  // 보유 종목 필터 상태
  const [holdingsFilter, setHoldingsFilter] = useState({
    account: 'all', // all, ISA, 연금저축, IRP, 해외주식, 암호화폐
    sort: 'value', // value, gain, name
  })

  // localStorage에서 캐시된 가격 불러오기
  const getCachedPrices = () => {
    try {
      const cached = localStorage.getItem('btcPrice')
      if (cached) {
        const { price, timestamp } = JSON.parse(cached)
        // 1시간 이내 캐시는 유효
        if (Date.now() - timestamp < 3600000) {
          return price
        }
      }
    } catch {}
    return 125000000 // 기본값 1.25억
  }

  const [prices, setPrices] = useState({ btc: getCachedPrices(), usdkrw: 1450 })
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  // 실시간 시세 가져오기 (5분마다, 에러 방지)
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // BTC 가격 (CoinGecko) - 에러 시 캐시 사용
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5초 타임아웃

        const btcRes = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=krw',
          { signal: controller.signal }
        )
        clearTimeout(timeoutId)

        if (btcRes.ok) {
          const btcData = await btcRes.json()
          const btcPrice = btcData?.bitcoin?.krw

          if (btcPrice) {
            // localStorage에 캐시 저장
            localStorage.setItem('btcPrice', JSON.stringify({
              price: btcPrice,
              timestamp: Date.now()
            }))

            setPrices(prev => ({ ...prev, btc: btcPrice }))
            setLastUpdate(new Date())
          }
        }
      } catch (error) {
        // 에러 시 조용히 무시 (캐시된 값 사용)
        console.log('시세 조회 스킵:', error.name)
      } finally {
        setLoading(false)
      }
    }

    // 첫 로드 시 약간 지연 후 fetch (rate limit 방지)
    const initialDelay = setTimeout(fetchPrices, 1000)

    // 5분마다 갱신 (rate limit 방지)
    const interval = setInterval(fetchPrices, 300000)

    return () => {
      clearTimeout(initialDelay)
      clearInterval(interval)
    }
  }, [])

  // 실시간 자산 계산 (prices.btc가 없어도 기본값 사용)
  const trackedAssetsWithReturns = TRACKED_ASSETS.map(asset => {
    if (asset.type === 'crypto') {
      const btcPrice = prices.btc || 125000000 // 기본값 1.25억
      const currentValue = asset.btcAmount * btcPrice
      const returnRate = ((currentValue - asset.investedKRW) / asset.investedKRW) * 100
      return { ...asset, currentKRW: currentValue, returnRate }
    }
    if (asset.type === 'manual') {
      const returnRate = ((asset.currentKRW - asset.investedKRW) / asset.investedKRW) * 100
      return { ...asset, returnRate }
    }
    return { ...asset, currentKRW: asset.investedKRW, returnRate: 0 }
  })

  const quarterInfo = QUARTERLY_PORTFOLIOS[currentQuarter]
  const PORTFOLIO = quarterInfo?.portfolio || []

  // 총 자산 계산 (새 구조)
  const totalTracked = trackedAssetsWithReturns.reduce((sum, item) => sum + (item.currentKRW || 0), 0)
  const totalFixed = FIXED_ASSETS.reduce((sum, item) => sum + item.currentKRW, 0)
  const totalStable = STABLE_ASSETS.reduce((sum, item) => sum + item.currentKRW, 0) + totalTracked
  const totalLiquid = LIQUID_ASSETS.reduce((sum, item) => sum + item.currentKRW, 0)
  const totalReceivables = STABLE_ASSETS.filter(a => a.type === 'receivable').reduce((sum, item) => sum + item.currentKRW, 0)
  const totalCurrentAssets = totalFixed + totalStable + totalLiquid - totalReceivables // 받을돈 중복 제거

  return (
    <div style={styles.container}>
      {/* 헤더 */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🐰 가윤 달리오</h1>
          <p style={styles.subtitle}>세제혜택 계좌 + 자산 현황</p>
        </div>
        <button
          onClick={() => navigate('/gayoon/report')}
          style={{
            padding: '12px 20px',
            backgroundColor: '#3182F6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          📊 상세 리포트
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
                opacity: isEmpty ? 0.6 : 1,
              }}
            >
              {quarter}
              {isEmpty && <span style={{ marginLeft: '4px', fontSize: '10px' }}>예정</span>}
            </button>
          )
        })}
      </div>

      {/* 투자 원칙 */}
      <div style={styles.rulesCard}>
        <div style={styles.rulesTitle}>
          <span>📋</span> 나의 투자 원칙
        </div>
        <div style={styles.rulesList}>
          <div style={styles.ruleItem}>
            <span>🔴</span>
            <span><strong>손절:</strong> -10% 하락 시 매도 (규칙만 정해도 편향성 제거)</span>
          </div>
          <div style={styles.ruleItem}>
            <span>🟢</span>
            <span><strong>익절:</strong> 최고가 대비 -10% 하락 시 매도</span>
          </div>
          <div style={styles.ruleItem}>
            <span>⚠️</span>
            <span><strong>레버리지:</strong> 절대 안함 (ETF로 위험 분산)</span>
          </div>
          <div style={styles.ruleItem}>
            <span>🎯</span>
            <span><strong>전략:</strong> 무릎에 사서 어깨에 판다</span>
          </div>
        </div>
      </div>

      {/* 시장 인사이트 */}
      <div style={{
        backgroundColor: '#F0F7FF',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        border: '1px solid #BBDEFB',
      }}>
        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1565C0', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>💡</span> 시장 인사이트
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#37474F' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span>📊</span>
            <span>자산 가격은 합리적 예상보다 훨씬 높게 형성됨</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span>🤖</span>
            <span>AI 버블 주의 - 인프라 부족으로 대중화까지 시간 필요</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span>⚛️</span>
            <span>양자컴퓨팅 - 너무 먼 미래, 기대값만 반영 중</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <span>🧠</span>
            <span>손절은 어렵다 - 내 위험수용능력 파악이 먼저</span>
          </div>
        </div>
      </div>

      {/* 시세 업데이트 안내 */}
      {lastUpdate && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
          fontSize: '11px',
          color: '#8B95A1',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00C853' }} />
          실시간 시세 · {lastUpdate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 업데이트
        </div>
      )}

      {/* 요약 카드 */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>총 자산 (현재)</div>
          <div style={styles.summaryValue}>₩{Math.round(totalCurrentAssets).toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#3182F6', marginTop: '4px' }}>
            {(totalCurrentAssets / 100000000).toFixed(2)}억
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>고정자산</div>
          <div style={styles.summaryValue}>₩{totalFixed.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#8B95A1', marginTop: '4px' }}>
            빼면 손해
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>비변동성 자산</div>
          <div style={styles.summaryValue}>₩{Math.round(totalStable).toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#3182F6', marginTop: '4px' }}>
            투자 + 받을돈
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>변동성 자산</div>
          <div style={styles.summaryValue}>₩{totalLiquid.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#00C853', marginTop: '4px' }}>
            언제든 사용
          </div>
        </div>
      </div>

      {/* 1. 고정자산 */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#191F28', marginBottom: '4px' }}>🔒 고정자산</h3>
        <p style={{ fontSize: '12px', color: '#8B95A1', margin: 0 }}>빼면 손해나는 자산</p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {FIXED_ASSETS.map(item => (
          <div key={item.id} style={{
            padding: '16px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #E5E8EB',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#191F28' }}>{item.name}</div>
                <div style={{ fontSize: '10px', color: '#8B95A1' }}>{item.note}</div>
              </div>
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#191F28' }}>
              ₩{item.currentKRW.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* 2. 비변동성 자산 */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#191F28', marginBottom: '4px' }}>📈 비변동성 자산</h3>
        <p style={{ fontSize: '12px', color: '#8B95A1', margin: 0 }}>투자 중인 자산 + 받을 돈</p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {/* S&P500 */}
        {STABLE_ASSETS.filter(a => a.type === 'stock').map(item => (
          <div key={item.id} style={{
            padding: '16px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #E8F3FF',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#191F28' }}>{item.name}</div>
                <div style={{ fontSize: '10px', color: '#8B95A1' }}>{item.note}</div>
              </div>
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#3182F6' }}>
              ₩{item.currentKRW.toLocaleString()}
            </div>
          </div>
        ))}

        {/* 아마존, 비트코인 (실시간 추적) */}
        {trackedAssetsWithReturns.map(asset => (
          <div key={asset.id} style={{
            padding: '16px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: `1px solid ${asset.returnRate >= 0 ? '#E8F5E9' : '#FFEBEE'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>{asset.icon}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#191F28' }}>{asset.name}</div>
                  <div style={{ fontSize: '10px', color: '#8B95A1' }}>{asset.note}</div>
                </div>
              </div>
              <div style={{
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: '600',
                backgroundColor: asset.returnRate >= 0 ? '#E8F5E9' : '#FFEBEE',
                color: asset.returnRate >= 0 ? '#00C853' : '#F04438',
              }}>
                {`${asset.returnRate >= 0 ? '+' : ''}${asset.returnRate.toFixed(1)}%`}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#191F28' }}>
                ₩{Math.round(asset.currentKRW).toLocaleString()}
              </div>
              <div style={{ fontSize: '10px', color: '#8B95A1' }}>
                매입 ₩{asset.investedKRW.toLocaleString()}
              </div>
            </div>
            {asset.type === 'crypto' && prices.btc && (
              <div style={{ fontSize: '9px', color: '#6B7684', marginTop: '4px' }}>
                BTC ₩{prices.btc.toLocaleString()}
              </div>
            )}
          </div>
        ))}

        {/* 받을 돈 */}
        {STABLE_ASSETS.filter(a => a.type === 'receivable').map(item => (
          <div key={item.id} style={{
            padding: '16px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #F3E5F5',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#191F28' }}>{item.name}</div>
                <div style={{ fontSize: '10px', color: '#8B95A1' }}>{item.note}</div>
              </div>
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#9C27B0' }}>
              ₩{item.currentKRW.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* 3. 변동성 자산 */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#191F28', marginBottom: '4px' }}>💧 변동성 자산</h3>
        <p style={{ fontSize: '12px', color: '#8B95A1', margin: 0 }}>언제든 쓸 수 있는 자산</p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {LIQUID_ASSETS.map(item => (
          <div key={item.id} style={{
            padding: '16px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #E5E8EB',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#191F28' }}>{item.name}</div>
                <div style={{ fontSize: '10px', color: '#8B95A1' }}>{item.note}</div>
              </div>
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#191F28' }}>
              ₩{item.currentKRW.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* 포트폴리오 구성 */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#191F28', marginBottom: '12px' }}>📊 포트폴리오 구성</h3>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {/* ISA 포트폴리오 */}
        <PortfolioChart
          icon="📈"
          title="ISA"
          amount={20000000}
          status="완료"
          statusColor={{ bg: '#E8F5E9', text: '#2E7D32' }}
          items={ISA_PORTFOLIO}
        />

        {/* 연금저축 포트폴리오 */}
        <PortfolioChart
          icon="🧓"
          title="연금저축"
          amount={6000000}
          status="완료"
          statusColor={{ bg: '#E8F5E9', text: '#2E7D32' }}
          items={PENSION_PORTFOLIO}
        />

        {/* IRP 포트폴리오 */}
        <PortfolioChart
          icon="🏦"
          title="IRP"
          amount={3000000}
          status="진행중"
          statusColor={{ bg: '#E8F3FF', text: '#3182F6' }}
          items={IRP_PORTFOLIO}
        />

        {/* 추가 연금저축 포트폴리오 */}
        <PortfolioChart
          icon="💰"
          title="추가 연금저축"
          amount={9000000}
          status="예정"
          statusColor={{ bg: '#FFF3E0', text: '#E65100' }}
          items={PENSION_EXTRA_PORTFOLIO}
        />
      </div>

      {/* 월 매수 가이드 */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#191F28', marginBottom: '12px' }}>📅 월 매수 가이드</h3>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {/* IRP 월 25만원 */}
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #E5E8EB',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px' }}>🏦</span>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#191F28' }}>IRP 월 매수</div>
              <div style={{ fontSize: '13px', color: '#3182F6', fontWeight: '600' }}>매월 25만원</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {IRP_PORTFOLIO.map(item => {
              const amount = Math.round(250000 * item.targetWeight / 100)
              return (
                <div key={item.ticker} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  backgroundColor: '#F7F8FA',
                  borderRadius: '8px',
                }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#191F28' }}>
                      {item.name.replace('TIGER ', '').replace('KODEX ', '')}
                    </div>
                    <div style={{ fontSize: '11px', color: '#8B95A1' }}>
                      <span style={{ backgroundColor: '#E8F3FF', padding: '2px 6px', borderRadius: '4px', marginRight: '6px', color: '#3182F6', fontWeight: '600' }}>{item.ticker}</span>
                      {item.targetWeight}%
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#3182F6' }}>
                    ₩{amount.toLocaleString()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 추가 연금저축 월 60만원 */}
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #E5E8EB',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px' }}>💰</span>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#191F28' }}>추가 연금저축 월 매수</div>
              <div style={{ fontSize: '13px', color: '#E65100', fontWeight: '600' }}>매월 60만원 (예정)</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PENSION_EXTRA_PORTFOLIO.map(item => {
              const amount = Math.round(600000 * item.targetWeight / 100)
              return (
                <div key={item.ticker} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  backgroundColor: '#F7F8FA',
                  borderRadius: '8px',
                }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#191F28' }}>
                      {item.name.replace('TIGER ', '').replace('KODEX ', '')}
                    </div>
                    <div style={{ fontSize: '11px', color: '#8B95A1' }}>
                      <span style={{ backgroundColor: '#FFF3E0', padding: '2px 6px', borderRadius: '4px', marginRight: '6px', color: '#E65100', fontWeight: '600' }}>{item.ticker}</span>
                      {item.targetWeight}%
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#E65100' }}>
                    ₩{amount.toLocaleString()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 보유 종목 테이블 */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#191F28', marginBottom: '12px' }}>💼 보유 종목</h3>
      </div>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #E5E8EB',
        overflow: 'hidden',
        marginBottom: '24px',
      }}>
        {/* 헤더 */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #E5E8EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '16px', fontWeight: '700', color: '#191F28' }}>전체 보유 종목</span>
          <span style={{ fontSize: '13px', color: '#8B95A1' }}>
            {(() => {
              // 비트코인 실시간 가격 반영
              const btcItem = GAYOON_ALL_HOLDINGS.find(h => h.ticker === 'BTC')
              const btcCurrentValue = btcItem ? btcItem.btcAmount * (prices.btc || 125000000) : 0
              const btcInvested = btcItem ? btcItem.investedKRW : 0
              const otherTotal = GAYOON_ALL_HOLDINGS.filter(h => h.ticker !== 'BTC').reduce((acc, h) => acc + h.currentKRW, 0)
              return GAYOON_ALL_HOLDINGS.length
            })()}개 종목
          </span>
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
            <span style={{ fontSize: '12px', color: '#8B95A1' }}>계좌:</span>
            {[
              { value: 'all', label: '전체' },
              { value: 'ISA', label: 'ISA' },
              { value: '연금저축', label: '연금저축' },
              { value: 'IRP', label: 'IRP' },
              { value: '해외주식', label: '해외주식' },
              { value: '암호화폐', label: '암호화폐' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setHoldingsFilter({ ...holdingsFilter, account: opt.value })}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  backgroundColor: holdingsFilter.account === opt.value ? '#3182F6' : '#F2F4F6',
                  color: holdingsFilter.account === opt.value ? 'white' : '#4E5968',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#8B95A1' }}>정렬:</span>
            <select
              value={holdingsFilter.sort}
              onChange={(e) => setHoldingsFilter({ ...holdingsFilter, sort: e.target.value })}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #E5E8EB',
                fontSize: '12px',
                color: '#4E5968',
                cursor: 'pointer',
              }}
            >
              <option value="value">평가금액순</option>
              <option value="gain">수익률순</option>
              <option value="name">이름순</option>
            </select>
          </div>
        </div>

        {/* 테이블 */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#8B95A1', backgroundColor: '#F7F8FA', borderBottom: '1px solid #E5E8EB', width: '100px' }}>계좌</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#8B95A1', backgroundColor: '#F7F8FA', borderBottom: '1px solid #E5E8EB', width: '180px' }}>종목명</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#8B95A1', backgroundColor: '#F7F8FA', borderBottom: '1px solid #E5E8EB', width: '100px' }}>매입금액</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#8B95A1', backgroundColor: '#F7F8FA', borderBottom: '1px solid #E5E8EB', width: '100px' }}>평가금액</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#8B95A1', backgroundColor: '#F7F8FA', borderBottom: '1px solid #E5E8EB', width: '90px' }}>손익</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#8B95A1', backgroundColor: '#F7F8FA', borderBottom: '1px solid #E5E8EB', width: '80px' }}>수익률</th>
              </tr>
            </thead>
            <tbody>
              {GAYOON_ALL_HOLDINGS
                // 비트코인 실시간 가격 반영
                .map(item => {
                  if (item.isCrypto && item.ticker === 'BTC') {
                    const btcPrice = prices.btc || 125000000
                    const currentValue = item.btcAmount * btcPrice
                    const gainKRW = currentValue - item.investedKRW
                    const gainPercent = (gainKRW / item.investedKRW) * 100
                    return { ...item, currentKRW: currentValue, gainKRW, gainPercent }
                  }
                  return item
                })
                // 필터 적용
                .filter(item => {
                  if (holdingsFilter.account !== 'all' && item.account !== holdingsFilter.account) return false
                  return true
                })
                // 정렬 적용
                .sort((a, b) => {
                  if (holdingsFilter.sort === 'value') return b.currentKRW - a.currentKRW
                  if (holdingsFilter.sort === 'gain') return b.gainPercent - a.gainPercent
                  if (holdingsFilter.sort === 'name') return a.name.localeCompare(b.name)
                  return 0
                })
                .map((item, idx) => {
                  const gainPercent = item.gainPercent
                  return (
                    <tr key={`${item.account}-${item.ticker}-${idx}`}>
                      {/* 계좌 */}
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: '#191F28', borderBottom: '1px solid #F2F4F6' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{item.accountIcon}</span>
                          <span style={{ fontSize: '12px', color: '#4E5968' }}>{item.account}</span>
                        </div>
                      </td>
                      {/* 종목명 */}
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: '#191F28', borderBottom: '1px solid #F2F4F6' }}>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '13px' }}>{item.ticker}</div>
                          <div style={{ fontSize: '11px', color: '#8B95A1' }}>{item.name}</div>
                        </div>
                      </td>
                      {/* 매입금액 */}
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#8B95A1', borderBottom: '1px solid #F2F4F6', textAlign: 'right' }}>
                        ₩{Math.round(item.investedKRW).toLocaleString()}
                      </td>
                      {/* 평가금액 */}
                      <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '600', color: '#191F28', borderBottom: '1px solid #F2F4F6', textAlign: 'right' }}>
                        ₩{Math.round(item.currentKRW).toLocaleString()}
                      </td>
                      {/* 손익 */}
                      <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', borderBottom: '1px solid #F2F4F6', textAlign: 'right', color: item.gainKRW > 0 ? '#00C853' : item.gainKRW < 0 ? '#F04438' : '#8B95A1' }}>
                        {item.gainKRW >= 0 ? '+' : ''}₩{Math.round(item.gainKRW).toLocaleString()}
                      </td>
                      {/* 수익률 */}
                      <td style={{ padding: '14px 16px', borderBottom: '1px solid #F2F4F6', textAlign: 'right' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: gainPercent >= 5 ? '#E8F5E9' : gainPercent > 0 ? '#F0FFF4' : gainPercent <= -15 ? '#FFCDD2' : gainPercent <= -10 ? '#FFE0B2' : gainPercent < 0 ? '#FFEBEE' : '#F2F4F6',
                          color: gainPercent > 0 ? '#00C853' : gainPercent <= -15 ? '#D32F2F' : gainPercent <= -10 ? '#F57C00' : gainPercent < 0 ? '#F04438' : '#8B95A1',
                        }}>
                          {gainPercent >= 5 && '🔥 '}
                          {gainPercent <= -15 && '🚨 '}
                          {gainPercent > -15 && gainPercent <= -10 && '⚠️ '}
                          {gainPercent > 0 ? '+' : ''}{gainPercent.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>

        {/* 합계 */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #E5E8EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#F7F8FA',
        }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#191F28' }}>
            합계 ({GAYOON_ALL_HOLDINGS
              .filter(item => holdingsFilter.account === 'all' || item.account === holdingsFilter.account)
              .length}개 종목)
          </span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span style={{ fontSize: '14px', color: '#4E5968' }}>
              평가금액: <strong style={{ color: '#191F28' }}>
                ₩{Math.round(GAYOON_ALL_HOLDINGS
                  .map(item => {
                    if (item.isCrypto && item.ticker === 'BTC') {
                      return { ...item, currentKRW: item.btcAmount * (prices.btc || 125000000) }
                    }
                    return item
                  })
                  .filter(item => holdingsFilter.account === 'all' || item.account === holdingsFilter.account)
                  .reduce((acc, item) => acc + item.currentKRW, 0)).toLocaleString()}
              </strong>
            </span>
            <span style={{ fontSize: '14px', color: '#4E5968' }}>
              손익: <strong style={{
                color: (() => {
                  const totalGain = GAYOON_ALL_HOLDINGS
                    .map(item => {
                      if (item.isCrypto && item.ticker === 'BTC') {
                        const currentValue = item.btcAmount * (prices.btc || 125000000)
                        return { ...item, gainKRW: currentValue - item.investedKRW }
                      }
                      return item
                    })
                    .filter(item => holdingsFilter.account === 'all' || item.account === holdingsFilter.account)
                    .reduce((acc, item) => acc + item.gainKRW, 0)
                  return totalGain >= 0 ? '#00C853' : '#F04438'
                })()
              }}>
                {(() => {
                  const totalGain = GAYOON_ALL_HOLDINGS
                    .map(item => {
                      if (item.isCrypto && item.ticker === 'BTC') {
                        const currentValue = item.btcAmount * (prices.btc || 125000000)
                        return { ...item, gainKRW: currentValue - item.investedKRW }
                      }
                      return item
                    })
                    .filter(item => holdingsFilter.account === 'all' || item.account === holdingsFilter.account)
                    .reduce((acc, item) => acc + item.gainKRW, 0)
                  return `${totalGain >= 0 ? '+' : ''}₩${Math.round(totalGain).toLocaleString()}`
                })()}
              </strong>
            </span>
          </div>
        </div>

        {/* 범례 */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #E5E8EB',
          backgroundColor: '#FAFAFA',
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '12px',
            color: '#4E5968',
          }}>
            <span><strong style={{ color: '#00C853' }}>🔥</strong> = 내 수익 +5% 이상</span>
            <span><strong style={{ color: '#F57F17' }}>⚠️</strong> = 매수후고점 대비 -10% 이상</span>
            <span><strong style={{ color: '#F04438' }}>🚨</strong> = 매수후고점 대비 -15% 이상 (손절 고려)</span>
            <span><strong>PER</strong> = 주가수익비율</span>
            <span><strong>PBR</strong> = 주가순자산비율</span>
            <span><strong>ROE</strong> = 자기자본이익률 (15%+ 우량)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
