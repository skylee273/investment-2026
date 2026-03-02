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
    currentKRW: 2638715,
    gainKRW: -143319,
    gainPercent: -5.15,
    note: '한화증권 · 9주',
  },
  {
    id: 'bitcoin',
    name: '비트코인 (BTC)',
    icon: '₿',
    type: 'crypto',
    ticker: 'BTC',
    investedKRW: 999500,
    currentKRW: 990775,
    gainKRW: -8724,
    gainPercent: -0.87,
    buyPriceBTC: 98180000,
    btcAmount: 0.01018028,
    note: '업비트 · 0.0102 BTC',
  },
]

// 1. 고정자산 (빼면 손해나는 자산)
const FIXED_ASSETS = [
  { id: 'youth-account', name: '청년 도약 계좌', icon: '🚀', currentKRW: 16800000, note: '5년 만기 · 6%+정부기여금' },
  { id: 'housing', name: '청약저축', icon: '🏠', currentKRW: 6220000, note: '1순위 충족 · 2.3%' },
  { id: 'isa', name: 'ISA', icon: '📈', currentKRW: 20041099, investedKRW: 19999709, gainKRW: 41390, gainPercent: 0.21, note: '삼성증권 · +0.21%' },
  { id: 'pension', name: '연금저축', icon: '🧓', currentKRW: 3999404, investedKRW: 4000204, gainKRW: -800, gainPercent: -0.02, note: '한화증권 · -0.02%' },
  { id: 'irp', name: 'IRP (퇴직연금)', icon: '🏦', currentKRW: 273323, investedKRW: 200000, gainKRW: 73323, gainPercent: 36.66, note: '삼성증권 · +36.66%' },
]

// 2. 비변동성 자산 (투자 중인 자산 + 받을 돈)
const STABLE_ASSETS = [
  { id: 'sp500-dividend', name: 'S&P500 + 배당주', icon: '📈', currentKRW: 24796498, investedKRW: 22758816, gainKRW: 2037682, gainPercent: 8.96, note: '삼성증권 · +8.96%', type: 'stock' },
  // 아마존, 비트코인은 TRACKED_ASSETS에서 가져옴
  { id: 'family', name: '가족 받을 돈', icon: '👨‍👩‍👧', currentKRW: 20000000, note: '6월 수령 예정', type: 'receivable' },
  { id: 'deposit', name: '전세 보증금', icon: '🏢', currentKRW: 45000000, note: '7월 수령 예정', type: 'receivable' },
]

// 3. 변동성 자산 (언제든 쓸 수 있는 자산)
const LIQUID_ASSETS = [
  { id: 'cma', name: 'CMA', icon: '💵', currentKRW: 7738854, investedKRW: 7737693, gainKRW: 1161, gainPercent: 0.02, note: '삼성증권 · +0.02%' },
  { id: 'free-savings', name: '자율적금', icon: '💰', currentKRW: 4500000, note: '1년 만기 · 2026-09 · 3.3%' },
]

// 전체 보유 종목 통합 (실제 데이터 기반 - 2026.03.02)
const GAYOON_ALL_HOLDINGS = [
  // 삼성증권 - 해외주식 (S&P500 + 배당주)
  {
    ticker: 'VOO',
    name: 'Vanguard S&P500 ETF',
    category: '해외주식',
    account: '해외주식',
    accountIcon: '📈',
    investedKRW: 18034965,
    currentKRW: 19577473,
    gainKRW: 1542508,
    gainPercent: 8.55,
    risk: 3,
  },
  {
    ticker: 'VOO(소)',
    name: 'Vanguard S&P500 ETF (소수점)',
    category: '해외주식',
    account: '해외주식',
    accountIcon: '📈',
    investedKRW: 676691,
    currentKRW: 656352,
    gainKRW: -20339,
    gainPercent: -3.01,
    risk: 3,
  },
  {
    ticker: 'SCHD',
    name: 'Schwab 미국 배당주 ETF',
    category: '해외주식',
    account: '해외주식',
    accountIcon: '💰',
    investedKRW: 4047160,
    currentKRW: 4562673,
    gainKRW: 515513,
    gainPercent: 12.74,
    risk: 2,
  },
  // 한화증권 - 아마존
  {
    ticker: 'AMZN',
    name: '아마존',
    category: '해외주식',
    account: '해외주식',
    accountIcon: '🛒',
    shares: 9,
    investedKRW: 2782034,
    currentKRW: 2638715,
    gainKRW: -143319,
    gainPercent: -5.15,
    risk: 4,
  },
  // 삼성증권 - ISA
  {
    ticker: 'PLUS신흥국',
    name: 'PLUS 신흥국MSCI(합성 H)',
    category: '신흥국',
    account: 'ISA',
    accountIcon: '🌏',
    investedKRW: 2997060,
    currentKRW: 2991835,
    gainKRW: -5225,
    gainPercent: -0.17,
    risk: 4,
  },
  {
    ticker: 'TIGER미국채',
    name: 'TIGER 미국채10년선물',
    category: '채권',
    account: 'ISA',
    accountIcon: '📊',
    investedKRW: 2003535,
    currentKRW: 2030310,
    gainKRW: 26775,
    gainPercent: 1.34,
    risk: 1,
  },
  {
    ticker: 'KODEX금',
    name: 'KODEX 금액티브',
    category: '금',
    account: 'ISA',
    accountIcon: '🥇',
    investedKRW: 1984640,
    currentKRW: 2004480,
    gainKRW: 19840,
    gainPercent: 1.00,
    risk: 1,
  },
  // 한화증권 - 연금저축
  {
    ticker: 'KODEX200',
    name: 'KODEX 200',
    category: '국내대형',
    account: '연금저축',
    accountIcon: '🧓',
    shares: 21,
    investedKRW: 1977045,
    currentKRW: 1976520,
    gainKRW: -525,
    gainPercent: -0.03,
    risk: 2,
  },
  // 삼성증권 - IRP (퇴직연금)
  {
    ticker: 'IRP투자',
    name: 'IRP 투자상품',
    category: '퇴직연금',
    account: 'IRP',
    accountIcon: '🏦',
    investedKRW: 200000,
    currentKRW: 273323,
    gainKRW: 73323,
    gainPercent: 36.66,
    risk: 3,
  },
  // 삼성증권 - CMA
  {
    ticker: 'MMF',
    name: '삼성신종MMF (CMA)',
    category: 'CMA',
    account: 'CMA',
    accountIcon: '💵',
    investedKRW: 6630776,
    currentKRW: 6631937,
    gainKRW: 1161,
    gainPercent: 0.02,
    risk: 1,
  },
  // 업비트 - 비트코인
  {
    ticker: 'BTC',
    name: '비트코인',
    category: '암호화폐',
    account: '암호화폐',
    accountIcon: '₿',
    investedKRW: 999500,
    currentKRW: 990775,
    gainKRW: -8724,
    gainPercent: -0.87,
    risk: 5,
    isCrypto: true,
    btcAmount: 0.01018028,
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
function PortfolioChart({ icon, title, amount, status, statusColor, items, isMobile = false }) {
  // 안정자산 비율 계산 (risk <= 2: 안정, risk >= 3: 위험)
  const safeAssetWeight = items
    .filter(item => item.risk <= 2)
    .reduce((sum, item) => sum + item.targetWeight, 0)
  const riskAssetWeight = 100 - safeAssetWeight

  // 평균 위험도 계산
  const avgRisk = items.reduce((sum, item) => sum + (item.risk * item.targetWeight), 0) / 100

  return (
    <div style={{
      padding: isMobile ? '14px' : '20px',
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #E5E8EB',
    }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isMobile ? '10px' : '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: isMobile ? '18px' : '20px' }}>{icon}</span>
          <div>
            <div style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: '#191F28' }}>{title}</div>
            <div style={{ fontSize: isMobile ? '11px' : '13px', color: '#8B95A1' }}>{(amount / 10000).toLocaleString()}만원</div>
          </div>
        </div>
        <div style={{
          padding: isMobile ? '3px 8px' : '4px 10px',
          backgroundColor: statusColor.bg,
          borderRadius: '6px',
          fontSize: isMobile ? '10px' : '11px',
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
        marginBottom: isMobile ? '10px' : '12px',
        padding: isMobile ? '8px 10px' : '10px 12px',
        backgroundColor: '#F7F8FA',
        borderRadius: '8px',
      }}>
        <div style={{ display: 'flex', gap: isMobile ? '8px' : '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <span style={{ fontSize: isMobile ? '10px' : '12px', color: '#4E5968' }}>위험 {riskAssetWeight}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span style={{ fontSize: isMobile ? '10px' : '12px', color: '#4E5968' }}>안정 {safeAssetWeight}%</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: isMobile ? '9px' : '11px', color: '#8B95A1' }}>평균</span>
          <RiskStars risk={Math.round(avgRisk)} />
        </div>
      </div>

      {/* 스택 바 차트 */}
      <div style={{
        display: 'flex',
        height: isMobile ? '24px' : '28px',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: isMobile ? '10px' : '12px',
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
                fontSize: isMobile ? '9px' : '10px',
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '4px' : '6px' }}>
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
              padding: isMobile ? '6px 8px' : '8px 10px',
              backgroundColor: isSafe ? '#F0FDF4' : '#FFFBEB',
              borderRadius: '8px',
              fontSize: isMobile ? '10px' : '11px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '8px', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '2px',
                  backgroundColor: color,
                  flexShrink: 0,
                }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '6px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#4E5968', fontWeight: '600', fontSize: isMobile ? '10px' : '11px' }}>
                      {item.name.replace('TIGER ', '').replace('KODEX ', '')}
                    </span>
                    <RiskStars risk={item.risk} />
                  </div>
                  <span style={{ color: '#8B95A1', fontSize: isMobile ? '8px' : '10px' }}>{item.ticker}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '10px', flexShrink: 0 }}>
                <span style={{ color: '#6B7684', fontSize: isMobile ? '10px' : '12px' }}>{item.targetWeight}%</span>
                <span style={{ color: '#191F28', fontWeight: '700', fontSize: isMobile ? '10px' : '12px', minWidth: isMobile ? '40px' : '50px', textAlign: 'right' }}>
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
  container: { maxWidth: '100%', overflowX: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#191F28', margin: 0 },
  subtitle: { fontSize: '14px', color: '#8B95A1', marginTop: '4px' },
  lastUpdate: { fontSize: '12px', color: '#8B95A1', marginTop: '8px', display: 'flex', alignItems: 'center' },
  statusDot: (isLive) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: isLive ? '#00C853' : '#F57F17',
    display: 'inline-block',
    marginRight: '8px',
  }),
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

  // 모바일 감지
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  // 실시간 자산 계산 (이미 계산된 손익 데이터 사용)
  const trackedAssetsWithReturns = TRACKED_ASSETS.map(asset => {
    // 비트코인은 실시간 가격 사용 (선택사항)
    if (asset.type === 'crypto' && prices.btc) {
      const currentValue = asset.btcAmount * prices.btc
      const gainKRW = currentValue - asset.investedKRW
      const returnRate = (gainKRW / asset.investedKRW) * 100
      return { ...asset, currentKRW: currentValue, gainKRW, returnRate }
    }
    // 나머지는 기존 데이터 사용
    return { ...asset, returnRate: asset.gainPercent }
  })

  const quarterInfo = QUARTERLY_PORTFOLIOS[currentQuarter]
  const PORTFOLIO = quarterInfo?.portfolio || []
  const isLive = lastUpdate !== null

  // 총 투자 원금 계산
  const TOTAL_INVESTMENT = GAYOON_ALL_HOLDINGS.reduce((sum, item) => sum + item.investedKRW, 0)

  // 총 자산 계산 (새 구조)
  const totalTracked = trackedAssetsWithReturns.reduce((sum, item) => sum + (item.currentKRW || 0), 0)
  const totalFixed = FIXED_ASSETS.reduce((sum, item) => sum + item.currentKRW, 0)
  const totalStable = STABLE_ASSETS.reduce((sum, item) => sum + item.currentKRW, 0) + totalTracked
  const totalLiquid = LIQUID_ASSETS.reduce((sum, item) => sum + item.currentKRW, 0)
  const totalReceivables = STABLE_ASSETS.filter(a => a.type === 'receivable').reduce((sum, item) => sum + item.currentKRW, 0)
  const totalCurrentAssets = totalFixed + totalStable + totalLiquid - totalReceivables // 받을돈 중복 제거

  // 총 손익 계산
  const totalGainHoldings = GAYOON_ALL_HOLDINGS.reduce((sum, item) => sum + (item.gainKRW || 0), 0)
  const totalGainPercent = TOTAL_INVESTMENT > 0 ? (totalGainHoldings / TOTAL_INVESTMENT) * 100 : 0

  return (
    <div style={styles.container}>
      {/* 헤더 */}
      <div style={{
        ...styles.header,
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? '16px' : '0',
      }}>
        <div>
          <h1 style={{ ...styles.title, fontSize: isMobile ? '20px' : '24px' }}>🐰 가윤 달리오</h1>
          <p style={{ ...styles.subtitle, fontSize: isMobile ? '12px' : '14px' }}>
            {quarterInfo?.label} ({quarterInfo?.period}) · 투자 원금: ₩{TOTAL_INVESTMENT.toLocaleString()}
            <span style={{
              marginLeft: '8px',
              color: totalGainHoldings >= 0 ? '#00C853' : '#F04438',
              fontWeight: '600'
            }}>
              ({totalGainHoldings >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}%)
            </span>
          </p>
          <p style={{ ...styles.lastUpdate, fontSize: isMobile ? '11px' : '12px' }}>
            <span style={styles.statusDot(isLive)} />
            {isLive ? '실시간' : '데이터 로딩 중...'}
            {lastUpdate && ` · ${lastUpdate.toLocaleTimeString()}`}
            {prices.usdkrw && !isMobile && ` · 환율: $1 = ₩${prices.usdkrw.toLocaleString()}`}
          </p>
        </div>
        <button
          onClick={() => navigate('/gayoon/report')}
          style={{
            padding: isMobile ? '10px 16px' : '12px 20px',
            backgroundColor: '#3182F6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: isMobile ? '13px' : '14px',
            fontWeight: '600',
            cursor: 'pointer',
            width: isMobile ? '100%' : 'auto',
          }}
        >
          📊 상세 리포트
        </button>
      </div>

      {/* 분기 선택 탭 */}
      <div style={{
        display: 'flex',
        gap: isMobile ? '4px' : '8px',
        marginBottom: '24px',
        padding: '4px',
        backgroundColor: '#F2F4F6',
        borderRadius: '12px',
        width: isMobile ? '100%' : 'fit-content',
        overflowX: 'auto',
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
                padding: isMobile ? '8px 14px' : '10px 20px',
                borderRadius: '8px',
                border: isActive && isEmpty ? '1px solid #3182F6' : 'none',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: isActive ? 'white' : 'transparent',
                color: isActive ? '#3182F6' : isEmpty ? '#B0B8C1' : '#4E5968',
                boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                opacity: isEmpty && !isActive ? 0.6 : 1,
                flexShrink: 0,
              }}
            >
              {quarter}
              {isEmpty && <span style={{ marginLeft: '4px', fontSize: '10px' }}>예정</span>}
            </button>
          )
        })}
      </div>

      {/* 빈 포트폴리오 (Q2, Q3, Q4) */}
      {PORTFOLIO.length === 0 ? (
        <>
          {/* 경고 배너 */}
          <div style={{
            padding: isMobile ? '14px 16px' : '16px 20px',
            backgroundColor: '#FFF5F5',
            borderRadius: '12px',
            border: '1px solid #FFCDD2',
            marginBottom: '24px',
            textAlign: 'center',
            color: '#D32F2F',
            fontSize: isMobile ? '13px' : '14px',
            fontWeight: '500',
          }}>
            ⚠️ 이 분기의 포트폴리오가 아직 구성되지 않았습니다.
          </div>

          {/* 빈 상태 카드 */}
          <div style={{
            padding: isMobile ? '40px 24px' : '60px 40px',
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #E5E8EB',
            textAlign: 'center',
            marginBottom: '24px',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <h2 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '700', color: '#191F28', marginBottom: '8px' }}>
              {quarterInfo?.label} 포트폴리오
            </h2>
            <p style={{ fontSize: isMobile ? '13px' : '14px', color: '#8B95A1', marginBottom: '24px', lineHeight: '1.6' }}>
              아직 이 분기의 포트폴리오가 구성되지 않았습니다.<br />
              분기 시작 전에 리밸런싱 계획을 세워보세요.
            </p>
            <div style={{
              padding: '16px',
              backgroundColor: '#F7F8FA',
              borderRadius: '12px',
              fontSize: isMobile ? '12px' : '13px',
              color: '#4E5968',
            }}>
              💡 <strong>팁:</strong> 분기별로 포트폴리오를 재구성하면 시장 상황에 맞게 자산을 조정할 수 있습니다.
            </div>
          </div>
        </>
      ) : (
      <>
      {/* 투자 원칙 */}
      <div style={{ ...styles.rulesCard, padding: isMobile ? '16px' : '20px' }}>
        <div style={styles.rulesTitle}>
          <span>📋</span> 나의 투자 원칙
        </div>
        <div style={{
          ...styles.rulesList,
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '8px' : '12px',
        }}>
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
        padding: isMobile ? '16px' : '20px',
        marginBottom: '24px',
        border: '1px solid #BBDEFB',
      }}>
        <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '700', color: '#1565C0', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>💡</span> 시장 인사이트
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: isMobile ? '12px' : '13px', color: '#37474F' }}>
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
      <div style={{
        ...styles.summaryGrid,
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? '12px' : '16px',
      }}>
        <div style={{ ...styles.summaryCard, padding: isMobile ? '14px' : '20px' }}>
          <div style={{ ...styles.summaryLabel, fontSize: isMobile ? '11px' : '13px' }}>총 자산 (현재)</div>
          <div style={{ ...styles.summaryValue, fontSize: isMobile ? '18px' : '24px' }}>₩{Math.round(totalCurrentAssets).toLocaleString()}</div>
          <div style={{ fontSize: isMobile ? '10px' : '12px', color: '#3182F6', marginTop: '4px' }}>
            {(totalCurrentAssets / 100000000).toFixed(2)}억
          </div>
        </div>
        <div style={{ ...styles.summaryCard, padding: isMobile ? '14px' : '20px' }}>
          <div style={{ ...styles.summaryLabel, fontSize: isMobile ? '11px' : '13px' }}>고정자산</div>
          <div style={{ ...styles.summaryValue, fontSize: isMobile ? '18px' : '24px' }}>₩{totalFixed.toLocaleString()}</div>
          <div style={{ fontSize: isMobile ? '10px' : '12px', color: '#8B95A1', marginTop: '4px' }}>
            빼면 손해
          </div>
        </div>
        <div style={{ ...styles.summaryCard, padding: isMobile ? '14px' : '20px' }}>
          <div style={{ ...styles.summaryLabel, fontSize: isMobile ? '11px' : '13px' }}>비변동성 자산</div>
          <div style={{ ...styles.summaryValue, fontSize: isMobile ? '18px' : '24px' }}>₩{Math.round(totalStable).toLocaleString()}</div>
          <div style={{ fontSize: isMobile ? '10px' : '12px', color: '#3182F6', marginTop: '4px' }}>
            투자 + 받을돈
          </div>
        </div>
        <div style={{ ...styles.summaryCard, padding: isMobile ? '14px' : '20px' }}>
          <div style={{ ...styles.summaryLabel, fontSize: isMobile ? '11px' : '13px' }}>변동성 자산</div>
          <div style={{ ...styles.summaryValue, fontSize: isMobile ? '18px' : '24px' }}>₩{totalLiquid.toLocaleString()}</div>
          <div style={{ fontSize: isMobile ? '10px' : '12px', color: '#00C853', marginTop: '4px' }}>
            언제든 사용
          </div>
        </div>
      </div>

      {/* 1. 고정자산 */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: '#191F28', marginBottom: '4px' }}>🔒 고정자산</h3>
        <p style={{ fontSize: isMobile ? '11px' : '12px', color: '#8B95A1', margin: 0 }}>빼면 손해나는 자산</p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? '10px' : '12px',
        marginBottom: '24px',
      }}>
        {FIXED_ASSETS.map(item => (
          <div key={item.id} style={{
            padding: isMobile ? '12px' : '16px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: `1px solid ${item.gainKRW > 0 ? '#E8F5E9' : item.gainKRW < 0 ? '#FFEBEE' : '#E5E8EB'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: isMobile ? '18px' : '20px' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '600', color: '#191F28' }}>{item.name}</div>
                  <div style={{ fontSize: isMobile ? '9px' : '10px', color: '#8B95A1' }}>{item.note}</div>
                </div>
              </div>
              {item.gainPercent !== undefined && (
                <div style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: isMobile ? '9px' : '10px',
                  fontWeight: '600',
                  backgroundColor: item.gainPercent >= 0 ? '#E8F5E9' : '#FFEBEE',
                  color: item.gainPercent >= 0 ? '#00C853' : '#F04438',
                }}>
                  {item.gainPercent >= 0 ? '+' : ''}{item.gainPercent.toFixed(2)}%
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#191F28' }}>
                ₩{item.currentKRW.toLocaleString()}
              </div>
              {item.gainKRW !== undefined && (
                <div style={{ fontSize: isMobile ? '10px' : '11px', color: item.gainKRW >= 0 ? '#00C853' : '#F04438', fontWeight: '600' }}>
                  {item.gainKRW >= 0 ? '+' : ''}₩{item.gainKRW.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 2. 비변동성 자산 */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: '#191F28', marginBottom: '4px' }}>📈 비변동성 자산</h3>
        <p style={{ fontSize: isMobile ? '11px' : '12px', color: '#8B95A1', margin: 0 }}>투자 중인 자산 + 받을 돈</p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? '10px' : '12px',
        marginBottom: '24px',
      }}>
        {/* S&P500 */}
        {STABLE_ASSETS.filter(a => a.type === 'stock').map(item => (
          <div key={item.id} style={{
            padding: isMobile ? '12px' : '16px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: `1px solid ${item.gainKRW >= 0 ? '#E8F5E9' : '#FFEBEE'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: isMobile ? '18px' : '20px' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '600', color: '#191F28' }}>{item.name}</div>
                  <div style={{ fontSize: isMobile ? '9px' : '10px', color: '#8B95A1' }}>{item.note}</div>
                </div>
              </div>
              {item.gainPercent !== undefined && (
                <div style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: isMobile ? '9px' : '10px',
                  fontWeight: '600',
                  backgroundColor: item.gainPercent >= 0 ? '#E8F5E9' : '#FFEBEE',
                  color: item.gainPercent >= 0 ? '#00C853' : '#F04438',
                }}>
                  {item.gainPercent >= 0 ? '+' : ''}{item.gainPercent.toFixed(2)}%
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: item.gainKRW >= 0 ? '#00C853' : '#F04438' }}>
                ₩{item.currentKRW.toLocaleString()}
              </div>
              {item.gainKRW !== undefined && (
                <div style={{ fontSize: isMobile ? '10px' : '11px', color: item.gainKRW >= 0 ? '#00C853' : '#F04438', fontWeight: '600' }}>
                  {item.gainKRW >= 0 ? '+' : ''}₩{item.gainKRW.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* 아마존, 비트코인 (실시간 추적) */}
        {trackedAssetsWithReturns.map(asset => (
          <div key={asset.id} style={{
            padding: isMobile ? '12px' : '16px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: `1px solid ${asset.returnRate >= 0 ? '#E8F5E9' : '#FFEBEE'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: isMobile ? '18px' : '20px' }}>{asset.icon}</span>
                <div>
                  <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '600', color: '#191F28' }}>{asset.name}</div>
                  <div style={{ fontSize: isMobile ? '9px' : '10px', color: '#8B95A1' }}>{asset.note}</div>
                </div>
              </div>
              <div style={{
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: isMobile ? '9px' : '10px',
                fontWeight: '600',
                backgroundColor: asset.returnRate >= 0 ? '#E8F5E9' : '#FFEBEE',
                color: asset.returnRate >= 0 ? '#00C853' : '#F04438',
              }}>
                {`${asset.returnRate >= 0 ? '+' : ''}${asset.returnRate.toFixed(1)}%`}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#191F28' }}>
                ₩{Math.round(asset.currentKRW).toLocaleString()}
              </div>
              <div style={{ fontSize: isMobile ? '9px' : '10px', color: '#8B95A1' }}>
                매입 ₩{asset.investedKRW.toLocaleString()}
              </div>
            </div>
            {asset.type === 'crypto' && prices.btc && (
              <div style={{ fontSize: isMobile ? '8px' : '9px', color: '#6B7684', marginTop: '4px' }}>
                BTC ₩{prices.btc.toLocaleString()}
              </div>
            )}
          </div>
        ))}

        {/* 받을 돈 */}
        {STABLE_ASSETS.filter(a => a.type === 'receivable').map(item => (
          <div key={item.id} style={{
            padding: isMobile ? '12px' : '16px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #F3E5F5',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: isMobile ? '18px' : '20px' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '600', color: '#191F28' }}>{item.name}</div>
                <div style={{ fontSize: isMobile ? '9px' : '10px', color: '#8B95A1' }}>{item.note}</div>
              </div>
            </div>
            <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#9C27B0' }}>
              ₩{item.currentKRW.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* 3. 변동성 자산 */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: '#191F28', marginBottom: '4px' }}>💧 변동성 자산</h3>
        <p style={{ fontSize: isMobile ? '11px' : '12px', color: '#8B95A1', margin: 0 }}>언제든 쓸 수 있는 자산</p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? '10px' : '12px',
        marginBottom: '24px',
      }}>
        {LIQUID_ASSETS.map(item => (
          <div key={item.id} style={{
            padding: isMobile ? '12px' : '16px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: `1px solid ${item.gainKRW > 0 ? '#E8F5E9' : item.gainKRW < 0 ? '#FFEBEE' : '#E5E8EB'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: isMobile ? '18px' : '20px' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '600', color: '#191F28' }}>{item.name}</div>
                  <div style={{ fontSize: isMobile ? '9px' : '10px', color: '#8B95A1' }}>{item.note}</div>
                </div>
              </div>
              {item.gainPercent !== undefined && (
                <div style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: isMobile ? '9px' : '10px',
                  fontWeight: '600',
                  backgroundColor: item.gainPercent >= 0 ? '#E8F5E9' : '#FFEBEE',
                  color: item.gainPercent >= 0 ? '#00C853' : '#F04438',
                }}>
                  {item.gainPercent >= 0 ? '+' : ''}{item.gainPercent.toFixed(2)}%
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#191F28' }}>
                ₩{item.currentKRW.toLocaleString()}
              </div>
              {item.gainKRW !== undefined && (
                <div style={{ fontSize: isMobile ? '10px' : '11px', color: item.gainKRW >= 0 ? '#00C853' : '#F04438', fontWeight: '600' }}>
                  {item.gainKRW >= 0 ? '+' : ''}₩{item.gainKRW.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 포트폴리오 구성 */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: '#191F28', marginBottom: '12px' }}>📊 포트폴리오 구성</h3>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? '12px' : '16px',
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
          isMobile={isMobile}
        />

        {/* 연금저축 포트폴리오 */}
        <PortfolioChart
          icon="🧓"
          title="연금저축"
          amount={6000000}
          status="완료"
          statusColor={{ bg: '#E8F5E9', text: '#2E7D32' }}
          items={PENSION_PORTFOLIO}
          isMobile={isMobile}
        />

        {/* IRP 포트폴리오 */}
        <PortfolioChart
          icon="🏦"
          title="IRP"
          amount={3000000}
          status="진행중"
          statusColor={{ bg: '#E8F3FF', text: '#3182F6' }}
          items={IRP_PORTFOLIO}
          isMobile={isMobile}
        />

        {/* 추가 연금저축 포트폴리오 */}
        <PortfolioChart
          icon="💰"
          title="추가 연금저축"
          amount={9000000}
          status="예정"
          statusColor={{ bg: '#FFF3E0', text: '#E65100' }}
          items={PENSION_EXTRA_PORTFOLIO}
          isMobile={isMobile}
        />
      </div>

      {/* 월 매수 가이드 */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: '#191F28', marginBottom: '12px' }}>📅 월 매수 가이드</h3>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? '12px' : '16px',
        marginBottom: '24px',
      }}>
        {/* IRP 월 25만원 */}
        <div style={{
          padding: isMobile ? '14px' : '20px',
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #E5E8EB',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: isMobile ? '12px' : '16px' }}>
            <span style={{ fontSize: isMobile ? '18px' : '20px' }}>🏦</span>
            <div>
              <div style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: '#191F28' }}>IRP 월 매수</div>
              <div style={{ fontSize: isMobile ? '11px' : '13px', color: '#3182F6', fontWeight: '600' }}>매월 25만원</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '6px' : '8px' }}>
            {IRP_PORTFOLIO.map(item => {
              const amount = Math.round(250000 * item.targetWeight / 100)
              return (
                <div key={item.ticker} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: isMobile ? '8px 10px' : '10px 12px',
                  backgroundColor: '#F7F8FA',
                  borderRadius: '8px',
                }}>
                  <div>
                    <div style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '600', color: '#191F28' }}>
                      {item.name.replace('TIGER ', '').replace('KODEX ', '')}
                    </div>
                    <div style={{ fontSize: isMobile ? '10px' : '11px', color: '#8B95A1' }}>
                      <span style={{ backgroundColor: '#E8F3FF', padding: '2px 6px', borderRadius: '4px', marginRight: '6px', color: '#3182F6', fontWeight: '600', fontSize: isMobile ? '9px' : '11px' }}>{item.ticker}</span>
                      {item.targetWeight}%
                    </div>
                  </div>
                  <div style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '700', color: '#3182F6' }}>
                    ₩{amount.toLocaleString()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 추가 연금저축 월 60만원 */}
        <div style={{
          padding: isMobile ? '14px' : '20px',
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #E5E8EB',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: isMobile ? '12px' : '16px' }}>
            <span style={{ fontSize: isMobile ? '18px' : '20px' }}>💰</span>
            <div>
              <div style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: '#191F28' }}>추가 연금저축 월 매수</div>
              <div style={{ fontSize: isMobile ? '11px' : '13px', color: '#E65100', fontWeight: '600' }}>매월 60만원 (예정)</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '6px' : '8px' }}>
            {PENSION_EXTRA_PORTFOLIO.map(item => {
              const amount = Math.round(600000 * item.targetWeight / 100)
              return (
                <div key={item.ticker} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: isMobile ? '8px 10px' : '10px 12px',
                  backgroundColor: '#F7F8FA',
                  borderRadius: '8px',
                }}>
                  <div>
                    <div style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '600', color: '#191F28' }}>
                      {item.name.replace('TIGER ', '').replace('KODEX ', '')}
                    </div>
                    <div style={{ fontSize: isMobile ? '10px' : '11px', color: '#8B95A1' }}>
                      <span style={{ backgroundColor: '#FFF3E0', padding: '2px 6px', borderRadius: '4px', marginRight: '6px', color: '#E65100', fontWeight: '600', fontSize: isMobile ? '9px' : '11px' }}>{item.ticker}</span>
                      {item.targetWeight}%
                    </div>
                  </div>
                  <div style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '700', color: '#E65100' }}>
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
        <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: '#191F28', marginBottom: '12px' }}>💼 보유 종목</h3>
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
          padding: isMobile ? '12px 16px' : '16px 20px',
          borderBottom: '1px solid #E5E8EB',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? '4px' : '0',
        }}>
          <span style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: '#191F28' }}>전체 보유 종목</span>
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
          padding: isMobile ? '10px 16px' : '12px 20px',
          borderBottom: '1px solid #E5E8EB',
          display: 'flex',
          gap: isMobile ? '12px' : '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#8B95A1' }}>계좌:</span>
            {[
              { value: 'all', label: '전체' },
              { value: '해외주식', label: '해외주식' },
              { value: 'ISA', label: 'ISA' },
              { value: '연금저축', label: '연금저축' },
              { value: 'IRP', label: 'IRP' },
              { value: 'CMA', label: 'CMA' },
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
        <div style={{ overflowX: isMobile ? 'hidden' : 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? 'auto' : '800px' }}>
            <thead>
              <tr>
                {!isMobile && <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#8B95A1', backgroundColor: '#F7F8FA', borderBottom: '1px solid #E5E8EB', width: '100px' }}>계좌</th>}
                <th style={{ padding: isMobile ? '8px 4px 8px 8px' : '12px 16px', textAlign: 'left', fontSize: isMobile ? '10px' : '12px', fontWeight: '600', color: '#8B95A1', backgroundColor: '#F7F8FA', borderBottom: '1px solid #E5E8EB' }}>종목명</th>
                <th style={{ padding: isMobile ? '8px 2px' : '12px 16px', textAlign: 'right', fontSize: isMobile ? '10px' : '12px', fontWeight: '600', color: '#8B95A1', backgroundColor: '#F7F8FA', borderBottom: '1px solid #E5E8EB' }}>매입</th>
                <th style={{ padding: isMobile ? '8px 2px' : '12px 16px', textAlign: 'right', fontSize: isMobile ? '10px' : '12px', fontWeight: '600', color: '#8B95A1', backgroundColor: '#F7F8FA', borderBottom: '1px solid #E5E8EB' }}>평가</th>
                {!isMobile && <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#8B95A1', backgroundColor: '#F7F8FA', borderBottom: '1px solid #E5E8EB', width: '90px' }}>손익</th>}
                <th style={{ padding: isMobile ? '8px 8px 8px 2px' : '12px 16px', textAlign: 'right', fontSize: isMobile ? '10px' : '12px', fontWeight: '600', color: '#8B95A1', backgroundColor: '#F7F8FA', borderBottom: '1px solid #E5E8EB' }}>수익률</th>
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
                      {/* 계좌 - PC만 */}
                      {!isMobile && (
                        <td style={{ padding: '14px 16px', fontSize: '14px', color: '#191F28', borderBottom: '1px solid #F2F4F6' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{item.accountIcon}</span>
                            <span style={{ fontSize: '12px', color: '#4E5968' }}>{item.account}</span>
                          </div>
                        </td>
                      )}
                      {/* 종목명 */}
                      <td style={{ padding: isMobile ? '8px 2px 8px 8px' : '14px 16px', fontSize: isMobile ? '11px' : '14px', color: '#191F28', borderBottom: '1px solid #F2F4F6' }}>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: isMobile ? '11px' : '13px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            {isMobile && <span style={{ fontSize: '10px' }}>{item.accountIcon}</span>}
                            {item.ticker}
                          </div>
                          <div style={{ fontSize: isMobile ? '9px' : '11px', color: '#8B95A1' }}>{item.name}</div>
                        </div>
                      </td>
                      {/* 매입금액 */}
                      <td style={{ padding: isMobile ? '8px 2px' : '14px 16px', fontSize: isMobile ? '10px' : '13px', color: '#8B95A1', borderBottom: '1px solid #F2F4F6', textAlign: 'right' }}>
                        {isMobile ? `${(item.investedKRW / 10000).toFixed(0)}만` : `₩${Math.round(item.investedKRW).toLocaleString()}`}
                      </td>
                      {/* 평가금액 */}
                      <td style={{ padding: isMobile ? '8px 2px' : '14px 16px', fontSize: isMobile ? '11px' : '14px', fontWeight: '600', color: '#191F28', borderBottom: '1px solid #F2F4F6', textAlign: 'right' }}>
                        {isMobile ? `${(item.currentKRW / 10000).toFixed(0)}만` : `₩${Math.round(item.currentKRW).toLocaleString()}`}
                      </td>
                      {/* 손익 - PC만 */}
                      {!isMobile && (
                        <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', borderBottom: '1px solid #F2F4F6', textAlign: 'right', color: item.gainKRW > 0 ? '#00C853' : item.gainKRW < 0 ? '#F04438' : '#8B95A1' }}>
                          {item.gainKRW >= 0 ? '+' : ''}₩{Math.round(item.gainKRW).toLocaleString()}
                        </td>
                      )}
                      {/* 수익률 */}
                      <td style={{ padding: isMobile ? '8px 8px 8px 2px' : '14px 16px', borderBottom: '1px solid #F2F4F6', textAlign: 'right' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: isMobile ? '2px 4px' : '4px 8px',
                          borderRadius: '6px',
                          fontSize: isMobile ? '10px' : '12px',
                          fontWeight: '600',
                          backgroundColor: gainPercent >= 5 ? '#E8F5E9' : gainPercent > 0 ? '#F0FFF4' : gainPercent <= -15 ? '#FFCDD2' : gainPercent <= -10 ? '#FFE0B2' : gainPercent < 0 ? '#FFEBEE' : '#F2F4F6',
                          color: gainPercent > 0 ? '#00C853' : gainPercent <= -15 ? '#D32F2F' : gainPercent <= -10 ? '#F57C00' : gainPercent < 0 ? '#F04438' : '#8B95A1',
                        }}>
                          {gainPercent >= 5 && '🔥'}
                          {gainPercent <= -15 && '🚨'}
                          {gainPercent > -15 && gainPercent <= -10 && '⚠️'}
                          {gainPercent > 0 ? '+' : ''}{gainPercent.toFixed(isMobile ? 1 : 2)}%
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
          padding: isMobile ? '12px 16px' : '16px 20px',
          borderTop: '1px solid #E5E8EB',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? '8px' : '0',
          backgroundColor: '#F7F8FA',
        }}>
          <span style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#191F28' }}>
            합계 ({GAYOON_ALL_HOLDINGS
              .filter(item => holdingsFilter.account === 'all' || item.account === holdingsFilter.account)
              .length}개 종목)
          </span>
          <div style={{ display: 'flex', gap: isMobile ? '12px' : '24px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: isMobile ? '12px' : '14px', color: '#4E5968' }}>
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
            <span style={{ fontSize: isMobile ? '12px' : '14px', color: '#4E5968' }}>
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
          padding: isMobile ? '12px 16px' : '16px 20px',
          borderTop: '1px solid #E5E8EB',
          backgroundColor: '#FAFAFA',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            flexWrap: 'wrap',
            gap: isMobile ? '6px' : '16px',
            fontSize: isMobile ? '11px' : '12px',
            color: '#4E5968',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: isMobile ? '12px' : '14px' }}>🔥</span>
              <span>= +5% 이상</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: isMobile ? '12px' : '14px' }}>⚠️</span>
              <span>= -10% 이상</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: isMobile ? '12px' : '14px' }}>🚨</span>
              <span>= -15% 이상 (손절)</span>
            </span>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  )
}
