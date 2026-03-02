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

// 현재 자산 현황
const CURRENT_ASSETS = {
  // 일반 증권 주식 (IRP 섹션 위쪽에 표시)
  stocks: [
    { id: 'sp500-dividend', name: 'S&P500 + 배당주', icon: '📈', currentKRW: 26796000, note: '소수점 매수' },
  ],
  locked: [
    { id: 'youth-account', name: '청년 도약 계좌', icon: '🚀', currentKRW: 16800000, monthlyDeposit: 700000, endDate: '2029-03', interestRate: '6% + 정부기여금', note: '5년 만기' },
    { id: 'housing', name: '청약저축', icon: '🏠', currentKRW: 6220000, monthlyDeposit: 20000, endDate: null, interestRate: '2.3%', note: '1순위 충족' },
    { id: 'free-savings', name: '자율적금', icon: '💰', currentKRW: 4500000, monthlyDeposit: 900000, endDate: '2026-09', interestRate: '3.3%', note: '1년 만기' },
  ],
  cma: { id: 'cma', name: 'CMA', icon: '💵', currentKRW: 6690000, note: '6개월치 생활비' },
  receivables: [
    { id: 'family', name: '가족 받을 돈', icon: '👨‍👩‍👧', amount: 20000000, expectedDate: '2026-06', note: '6월 수령 예정' },
    { id: 'deposit', name: '전세 보증금', icon: '🏢', amount: 45000000, expectedDate: '2026-07', note: '7월 수령 예정' },
  ],
}

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
  const [prices, setPrices] = useState({ btc: null, amzn: null, usdkrw: 1450 })
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)

  // 실시간 시세 가져오기
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // BTC 가격 (CoinGecko)
        const btcRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=krw')
        const btcData = await btcRes.json()

        // AMZN 가격 + 환율 (Yahoo Finance via proxy or fallback)
        // 무료 API 제한으로 환율은 고정값 사용, 주가는 추정
        const usdkrw = 1450 // 환율 고정

        // Yahoo Finance API (CORS 우회 필요하므로 간단히 추정값 사용)
        // 실제 서비스에서는 백엔드 프록시 필요
        let amznPrice = null
        try {
          const amznRes = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/AMZN?interval=1d&range=1d')
          const amznData = await amznRes.json()
          amznPrice = amznData?.chart?.result?.[0]?.meta?.regularMarketPrice
        } catch {
          amznPrice = 220 // fallback
        }

        setPrices({
          btc: btcData?.bitcoin?.krw || null,
          amzn: amznPrice,
          usdkrw: usdkrw,
        })
        setLastUpdate(new Date())
      } catch (error) {
        console.error('가격 조회 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 60000) // 1분마다 갱신
    return () => clearInterval(interval)
  }, [])

  // 실시간 자산 계산
  const trackedAssetsWithReturns = TRACKED_ASSETS.map(asset => {
    if (asset.type === 'crypto' && prices.btc) {
      const currentValue = asset.btcAmount * prices.btc
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

  // 총 자산 계산
  const totalTracked = trackedAssetsWithReturns.reduce((sum, item) => sum + (item.currentKRW || 0), 0)
  const totalStocks = CURRENT_ASSETS.stocks.reduce((sum, item) => sum + item.currentKRW, 0) + totalTracked
  const totalLocked = CURRENT_ASSETS.locked.reduce((sum, item) => sum + item.currentKRW, 0)
  const totalCMA = CURRENT_ASSETS.cma.currentKRW
  const totalTaxAccounts = TAX_ACCOUNTS.reduce((sum, item) => sum + item.currentKRW, 0)
  const totalReceivables = CURRENT_ASSETS.receivables.reduce((sum, item) => sum + item.amount, 0)
  const totalCurrentAssets = totalStocks + totalLocked + totalCMA + totalTaxAccounts

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
          <div style={styles.summaryLabel}>세제혜택 계좌</div>
          <div style={styles.summaryValue}>₩{totalTaxAccounts.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#00C853', marginTop: '4px' }}>
            세액공제 118.8만원
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>일반 증권</div>
          <div style={styles.summaryValue}>₩{Math.round(totalStocks).toLocaleString()}</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>받을 돈 (6~7월)</div>
          <div style={styles.summaryValue}>₩{totalReceivables.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#9C27B0', marginTop: '4px' }}>
            수령 후 {((totalCurrentAssets + totalReceivables) / 100000000).toFixed(2)}억
          </div>
        </div>
      </div>

      {/* 통합 자산 현황 */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#191F28', marginBottom: '12px' }}>💰 자산 현황</h3>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {/* 일반 증권 주식 */}
        {CURRENT_ASSETS.stocks.map(item => (
          <div key={item.id} style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #E5E8EB',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#191F28' }}>{item.name}</div>
                  <div style={{ fontSize: '11px', color: '#8B95A1' }}>{item.note}</div>
                </div>
              </div>
              <div style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                backgroundColor: '#E8F3FF',
                color: '#3182F6',
              }}>
                주식
              </div>
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#191F28' }}>
              ₩{item.currentKRW.toLocaleString()}
            </div>
          </div>
        ))}

        {/* 실시간 추적 자산 (AMZN, BTC) */}
        {trackedAssetsWithReturns.map(asset => (
          <div key={asset.id} style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '16px',
            border: `1px solid ${asset.returnRate >= 0 ? '#E8F5E9' : '#FFEBEE'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>{asset.icon}</span>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#191F28' }}>{asset.name}</div>
                  <div style={{ fontSize: '11px', color: '#8B95A1' }}>{asset.note}</div>
                </div>
              </div>
              <div style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                backgroundColor: asset.returnRate >= 0 ? '#E8F5E9' : '#FFEBEE',
                color: asset.returnRate >= 0 ? '#00C853' : '#F04438',
              }}>
                {(asset.type === 'manual' || !loading) ? `${asset.returnRate >= 0 ? '+' : ''}${asset.returnRate.toFixed(1)}%` : '...'}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#191F28' }}>
                {(asset.type === 'manual' || !loading) ? `₩${Math.round(asset.currentKRW).toLocaleString()}` : '로딩...'}
              </div>
              <div style={{ fontSize: '11px', color: '#8B95A1' }}>
                매입 ₩{asset.investedKRW.toLocaleString()}
              </div>
            </div>
            {asset.type === 'manual' && (
              <div style={{ fontSize: '10px', color: asset.currentKRW >= asset.investedKRW ? '#00C853' : '#F04438', marginTop: '6px' }}>
                평가손익 {asset.currentKRW >= asset.investedKRW ? '+' : ''}₩{(asset.currentKRW - asset.investedKRW).toLocaleString()}
              </div>
            )}
            {asset.type === 'crypto' && prices.btc && (
              <div style={{ fontSize: '10px', color: '#6B7684', marginTop: '6px' }}>
                BTC ₩{prices.btc.toLocaleString()} · 보유 {asset.btcAmount.toFixed(6)} BTC
              </div>
            )}
          </div>
        ))}

        {/* 세제혜택 계좌 */}
        {TAX_ACCOUNTS.map(account => {
          const progress = account.targetKRW > 0 ? (account.currentKRW / account.targetKRW) * 100 : 0
          const remaining = account.targetKRW - account.currentKRW
          const today = new Date().getDate()
          const daysUntilDeposit = account.depositDay
            ? (account.depositDay >= today
              ? account.depositDay - today
              : (new Date(new Date().getFullYear(), new Date().getMonth() + 1, account.depositDay).getDate() - today + 30) % 30)
            : null

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
                  backgroundColor: progress >= 100 ? '#E8F5E9' : daysUntilDeposit !== null && daysUntilDeposit <= 3 ? '#FFEBEE' : '#E8F3FF',
                  color: progress >= 100 ? '#2E7D32' : daysUntilDeposit !== null && daysUntilDeposit <= 3 ? '#F04438' : '#3182F6',
                }}>
                  {progress >= 100 ? '완료' : daysUntilDeposit === 0 ? '오늘!' : daysUntilDeposit !== null ? `D-${daysUntilDeposit}` : '세제혜택'}
                </div>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '20px', fontWeight: '700', color: '#191F28' }}>
                    ₩{account.currentKRW.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '12px', color: '#8B95A1' }}>
                    / {(account.targetKRW / 10000).toLocaleString()}만
                  </span>
                </div>
              </div>

              <div style={{
                height: '6px',
                backgroundColor: '#F2F4F6',
                borderRadius: '3px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${Math.min(progress, 100)}%`,
                  height: '100%',
                  backgroundColor: progress >= 100 ? '#00C853' : '#3182F6',
                  borderRadius: '3px',
                }} />
              </div>
            </div>
          )
        })}

        {/* 묶여있는 돈 */}
        {CURRENT_ASSETS.locked.map(item => (
          <div key={item.id} style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #E5E8EB',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#191F28' }}>{item.name}</div>
                  <div style={{ fontSize: '11px', color: '#8B95A1' }}>{item.note} · {item.interestRate}</div>
                </div>
              </div>
              <div style={{
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                backgroundColor: '#FFF3E0',
                color: '#E65100',
              }}>
                {item.endDate ? `만기 ${item.endDate}` : '적금'}
              </div>
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#191F28', marginBottom: '4px' }}>
              ₩{item.currentKRW.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#6B7684' }}>
              월 {(item.monthlyDeposit / 10000).toLocaleString()}만원 납입
            </div>
          </div>
        ))}

        {/* CMA */}
        <div style={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #E5E8EB',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>{CURRENT_ASSETS.cma.icon}</span>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#191F28' }}>{CURRENT_ASSETS.cma.name}</div>
                <div style={{ fontSize: '11px', color: '#8B95A1' }}>{CURRENT_ASSETS.cma.note}</div>
              </div>
            </div>
            <div style={{
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '600',
              backgroundColor: '#E8F5E9',
              color: '#2E7D32',
            }}>
              비상금
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#191F28' }}>
            ₩{CURRENT_ASSETS.cma.currentKRW.toLocaleString()}
          </div>
        </div>

        {/* 받을 돈 */}
        {CURRENT_ASSETS.receivables.map(item => {
          const target = new Date(item.expectedDate)
          const now = new Date()
          const daysUntil = Math.ceil((target - now) / (1000 * 60 * 60 * 24))

          return (
            <div key={item.id} style={{
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '16px',
              border: '1px solid #F3E5F5',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#191F28' }}>{item.name}</div>
                    <div style={{ fontSize: '11px', color: '#8B95A1' }}>{item.note}</div>
                  </div>
                </div>
                <div style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  backgroundColor: '#F3E5F5',
                  color: '#9C27B0',
                }}>
                  D-{daysUntil}
                </div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#9C27B0' }}>
                ₩{item.amount.toLocaleString()}
              </div>
            </div>
          )
        })}
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
                    <div style={{ fontSize: '11px', color: '#8B95A1' }}>{item.targetWeight}%</div>
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
                    <div style={{ fontSize: '11px', color: '#8B95A1' }}>{item.targetWeight}%</div>
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
    </div>
  )
}
