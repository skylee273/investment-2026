import { useState, useEffect } from 'react'

// localStorage 키
const MONTHLY_SNAPSHOTS_KEY = 'monthly_snapshots'

// 월 이름
const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

// 카테고리별 색상
const CATEGORY_COLORS = {
  '해외주식': '#3182F6',
  '국내주식': '#EF4444',
  '국내ETF': '#6366F1',
  'ETF': '#6366F1',
  '연금': '#10B981',
  '현금성': '#8B95A1',
  '암호화폐': '#F97316',
  'Big Tech': '#3182F6',
  '에너지': '#F59E0B',
  '금융': '#10B981',
  '반도체': '#EC4899',
  '헬스케어': '#8B5CF6',
  '채권': '#6B7280',
  '금': '#FBBF24',
  '신흥국': '#14B8A6',
  'S&P500': '#6366F1',
  '배당주': '#22C55E',
  '나스닥': '#7C3AED',
  'CMA': '#8B95A1',
}

// ========== 하우가 패밀리 데이터 (2026.03.29 기준) ==========
const HAUGA_HOLDINGS = [
  // 토스증권 해외주식
  { ticker: 'AMZN', name: '아마존', currentKRW: 365295, investedKRW: 405610, gainKRW: -40314, gainPercent: -9.93, category: 'Big Tech' },
  { ticker: 'GOOG', name: '알파벳 C', currentKRW: 58467, investedKRW: 63641, gainKRW: -5173, gainPercent: -8.12, category: 'Big Tech' },
  { ticker: 'GOOGL', name: '알파벳 A', currentKRW: 16903, investedKRW: 19727, gainKRW: -2823, gainPercent: -14.31, category: 'Big Tech' },
  { ticker: 'MSFT', name: '마이크로소프트', currentKRW: 41152, investedKRW: 47590, gainKRW: -6437, gainPercent: -13.52, category: 'Big Tech' },
  { ticker: 'META', name: '메타', currentKRW: 19672, investedKRW: 23670, gainKRW: -3997, gainPercent: -16.88, category: 'Big Tech' },
  { ticker: 'TSLA', name: '테슬라', currentKRW: 2687, investedKRW: 2969, gainKRW: -281, gainPercent: -9.48, category: 'Big Tech' },
  { ticker: 'BAC', name: '뱅크오브아메리카', currentKRW: 19012, investedKRW: 20702, gainKRW: -1689, gainPercent: -8.16, category: '금융' },
  { ticker: 'AVGO', name: '브로드컴', currentKRW: 2686, investedKRW: 2973, gainKRW: -286, gainPercent: -9.64, category: '반도체' },
  { ticker: 'QCOM', name: '퀄컴', currentKRW: 6850, investedKRW: 7883, gainKRW: -1032, gainPercent: -13.09, category: '반도체' },
  { ticker: 'ISRG', name: '인튜이티브 서지컬', currentKRW: 7313, investedKRW: 7882, gainKRW: -568, gainPercent: -7.21, category: '헬스케어' },
  { ticker: 'SPY', name: 'SPY', currentKRW: 16890, investedKRW: 17704, gainKRW: -813, gainPercent: -4.59, category: 'S&P500' },
  // 미래에셋 - 연금저축
  { ticker: 'KODEX200_P', name: 'KODEX 200 (연금)', currentKRW: 1055925, investedKRW: 1131700, gainKRW: -75775, gainPercent: -6.70, category: '국내주식' },
  { ticker: 'KODEX150_P', name: 'KODEX 코스닥150 (연금)', currentKRW: 337110, investedKRW: 344775, gainKRW: -7665, gainPercent: -2.22, category: '국내주식' },
  // 미래에셋 - ISA
  { ticker: 'KODEX150_I', name: 'KODEX 코스닥150 (ISA)', currentKRW: 99150, investedKRW: 101075, gainKRW: -1925, gainPercent: -1.90, category: '국내주식' },
  { ticker: 'TIGER_BOND', name: 'TIGER 미국채10년선물', currentKRW: 202875, investedKRW: 198375, gainKRW: 4500, gainPercent: 2.27, category: '채권' },
  { ticker: 'TIGER_SP_I', name: 'TIGER 미국S&P500 (ISA)', currentKRW: 195360, investedKRW: 196840, gainKRW: -1480, gainPercent: -0.75, category: 'S&P500' },
  // 미래에셋 - 종합 (해외주식)
  { ticker: 'TIGER_SP', name: 'TIGER 미국S&P500', currentKRW: 170940, investedKRW: 174090, gainKRW: -3150, gainPercent: -1.81, category: 'S&P500' },
  { ticker: '1Q_HYB', name: '1Q S&P500미국채혼합', currentKRW: 116200, investedKRW: 116250, gainKRW: -50, gainPercent: -0.04, category: 'S&P500' },
  { ticker: 'CVX', name: '셰브론', currentKRW: 636068, investedKRW: 568711, gainKRW: 67357, gainPercent: 11.84, category: '에너지' },
  { ticker: 'GOOG_M', name: '알파벳 C (미래)', currentKRW: 412337, investedKRW: 468022, gainKRW: -55685, gainPercent: -11.90, category: 'Big Tech' },
  { ticker: 'PFE', name: '화이자', currentKRW: 50000, investedKRW: 50000, gainKRW: 0, gainPercent: 0.00, category: '헬스케어' },
  // 미래에셋 - IRP
  { ticker: 'IRP', name: 'IRP 예수금', currentKRW: 250069, investedKRW: 250069, gainKRW: 0, gainPercent: 0.00, category: '연금' },
  // 미래에셋 - CMA
  { ticker: 'CMA', name: 'CMA (가족여행)', currentKRW: 610106, investedKRW: 610096, gainKRW: 10, gainPercent: 0.00, category: '현금성' },
  // 업비트 - 암호화폐
  { ticker: 'BTC', name: '비트코인', currentKRW: 165490, investedKRW: 167040, gainKRW: -1552, gainPercent: -0.93, category: '암호화폐' },
]

// ========== 가윤 달리오 데이터 (2026.03.29 기준) ==========
const GAYOON_HOLDINGS = [
  // 삼성증권 - 해외주식
  { ticker: 'VOO', name: 'Vanguard S&P500', currentKRW: 19317195, investedKRW: 18034965, gainKRW: 1282230, gainPercent: 7.11, category: 'S&P500' },
  { ticker: 'VOO_P', name: 'VOO (소수점)', currentKRW: 647620, investedKRW: 676691, gainKRW: -29071, gainPercent: -4.30, category: 'S&P500' },
  { ticker: 'SCHD', name: 'Schwab 배당주', currentKRW: 4584872, investedKRW: 4047160, gainKRW: 537712, gainPercent: 13.29, category: '배당주' },
  { ticker: 'KBANK', name: '케이뱅크', currentKRW: 62700, investedKRW: 83000, gainKRW: -20300, gainPercent: -24.46, category: '국내주식' },
  // 삼성증권 - ISA
  { ticker: 'KODEX200_ISA', name: 'KODEX 200 (ISA)', currentKRW: 5117175, investedKRW: 5223390, gainKRW: -106215, gainPercent: -2.03, category: '국내주식' },
  { ticker: 'TIGER_NAS', name: 'TIGER 나스닥100', currentKRW: 2857680, investedKRW: 2891400, gainKRW: -33720, gainPercent: -1.17, category: '나스닥' },
  { ticker: 'PLUS_EM', name: 'PLUS 신흥국MSCI', currentKRW: 2695055, investedKRW: 2997060, gainKRW: -302005, gainPercent: -10.08, category: '신흥국' },
  { ticker: 'TIGER_BD', name: 'TIGER 미국채10년', currentKRW: 2069325, investedKRW: 2003535, gainKRW: 65790, gainPercent: 3.28, category: '채권' },
  { ticker: 'TIGER_SP_ISA', name: 'TIGER S&P500 (ISA)', currentKRW: 4835160, investedKRW: 4888810, gainKRW: -53650, gainPercent: -1.10, category: 'S&P500' },
  { ticker: 'KODEX_G', name: 'KODEX 금액티브', currentKRW: 1806720, investedKRW: 1984640, gainKRW: -177920, gainPercent: -8.96, category: '금' },
  // 한투 - 해외주식
  { ticker: 'AMZN', name: '아마존 (한투)', currentKRW: 2702213, investedKRW: 2941594, gainKRW: -239381, gainPercent: -8.13, category: 'Big Tech' },
  // 미래에셋 - 연금저축
  { ticker: 'KODEX200_P', name: 'KODEX 200 (연금)', currentKRW: 4467375, investedKRW: 4912225, gainKRW: -444850, gainPercent: -9.06, category: '국내주식' },
  { ticker: 'KODEX150_P', name: 'KODEX 코스닥150 (연금)', currentKRW: 1070820, investedKRW: 1084800, gainKRW: -13980, gainPercent: -1.29, category: '국내주식' },
  // 미래에셋 - CMA
  { ticker: 'CMA', name: '발행어음CMA', currentKRW: 14030691, investedKRW: 14015160, gainKRW: 15531, gainPercent: 0.11, category: '현금성' },
  // 미래에셋 - IRP
  { ticker: 'TDF2025', name: 'TDF2025 (IRP)', currentKRW: 265937, investedKRW: 267479, gainKRW: -1542, gainPercent: -0.58, category: '연금' },
  // 업비트 - 암호화폐
  { ticker: 'BTC', name: '비트코인', currentKRW: 1091846, investedKRW: 1098351, gainKRW: -6504, gainPercent: -0.59, category: '암호화폐' },
]

// 초기 스냅샷 데이터
const INITIAL_SNAPSHOTS = {
  hauga: {
    '2026-01': {
      date: '2026-01-31',
      totalKRW: 4000000,
      totalInvested: 4100000,
      holdings: HAUGA_HOLDINGS.map(h => ({ ...h, currentKRW: Math.round(h.investedKRW * 0.98) })),
      realizedGain: 0,
      note: '연초 시작',
    },
    '2026-02': {
      date: '2026-02-28',
      totalKRW: 4150000,
      totalInvested: 4100000,
      holdings: HAUGA_HOLDINGS.map(h => ({ ...h, currentKRW: Math.round(h.investedKRW * 1.01) })),
      realizedGain: 2900,
      note: '배당금+판매수익 2,900원',
    },
  },
  gayoon: {
    '2026-01': {
      date: '2026-01-31',
      totalKRW: 65000000,
      totalInvested: 63000000,
      holdings: GAYOON_HOLDINGS.map(h => ({ ...h, currentKRW: Math.round(h.investedKRW * 1.03) })),
      realizedGain: 0,
      note: '연초 시작',
    },
    '2026-02': {
      date: '2026-02-28',
      totalKRW: 66500000,
      totalInvested: 63000000,
      holdings: GAYOON_HOLDINGS.map(h => ({ ...h, currentKRW: Math.round(h.investedKRW * 1.05) })),
      realizedGain: 15000,
      note: '배당금 15,000원',
    },
  },
}

export default function MonthlyReportPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [mainTab, setMainTab] = useState('hauga')
  const [selectedMonth, setSelectedMonth] = useState('2026-03')
  const [snapshots, setSnapshots] = useState({ hauga: {}, gayoon: {} })

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 스냅샷 로드
  useEffect(() => {
    const saved = localStorage.getItem(MONTHLY_SNAPSHOTS_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      setSnapshots({
        hauga: { ...INITIAL_SNAPSHOTS.hauga, ...parsed.hauga },
        gayoon: { ...INITIAL_SNAPSHOTS.gayoon, ...parsed.gayoon },
      })
    } else {
      setSnapshots(INITIAL_SNAPSHOTS)
    }
  }, [])

  // 현재 월 데이터
  const currentHoldings = mainTab === 'hauga' ? HAUGA_HOLDINGS : GAYOON_HOLDINGS
  const currentTotal = currentHoldings.reduce((sum, h) => sum + h.currentKRW, 0)
  const currentInvested = currentHoldings.reduce((sum, h) => sum + h.investedKRW, 0)
  const currentGain = currentHoldings.reduce((sum, h) => sum + h.gainKRW, 0)

  const currentData = {
    date: new Date().toISOString().split('T')[0],
    totalKRW: currentTotal,
    totalInvested: currentInvested,
    holdings: currentHoldings,
    realizedGain: mainTab === 'hauga' ? 2900 : 15000,
  }

  // 선택된 월 데이터
  const isCurrentMonth = selectedMonth === '2026-03'
  const monthSnapshots = snapshots[mainTab] || {}
  const monthData = isCurrentMonth ? currentData : monthSnapshots[selectedMonth]

  // 이전 월 데이터
  const prevMonthKey = (() => {
    const [year, month] = selectedMonth.split('-').map(Number)
    const prevMonth = month === 1 ? 12 : month - 1
    const prevYear = month === 1 ? year - 1 : year
    return `${prevYear}-${String(prevMonth).padStart(2, '0')}`
  })()
  const prevMonthData = monthSnapshots[prevMonthKey]

  // 월 수익률
  const monthlyReturn = prevMonthData && monthData
    ? ((monthData.totalKRW - prevMonthData.totalKRW) / prevMonthData.totalKRW * 100).toFixed(2)
    : null

  // 연초 대비 수익률
  const janData = monthSnapshots['2026-01']
  const ytdReturn = janData && monthData
    ? ((monthData.totalKRW - janData.totalKRW) / janData.totalKRW * 100).toFixed(2)
    : null

  // 총 수익률 (투자원금 대비)
  const totalReturn = monthData
    ? ((monthData.totalKRW - monthData.totalInvested) / monthData.totalInvested * 100).toFixed(2)
    : null

  // 최고/최저 종목
  const sortedByGain = [...(monthData?.holdings || [])].sort((a, b) =>
    (b.gainPercent || 0) - (a.gainPercent || 0)
  )
  const bestStock = sortedByGain[0]
  const worstStock = sortedByGain[sortedByGain.length - 1]

  // 카테고리별 합계
  const categoryTotals = (monthData?.holdings || []).reduce((acc, h) => {
    const cat = h.category || '기타'
    acc[cat] = (acc[cat] || 0) + h.currentKRW
    return acc
  }, {})

  // 스냅샷 저장
  const saveSnapshot = () => {
    const yearMonth = selectedMonth
    const newSnapshots = {
      ...snapshots,
      [mainTab]: {
        ...snapshots[mainTab],
        [yearMonth]: currentData,
      },
    }
    setSnapshots(newSnapshots)
    localStorage.setItem(MONTHLY_SNAPSHOTS_KEY, JSON.stringify(newSnapshots))
    alert(`${mainTab === 'hauga' ? '하우가 패밀리' : '가윤 달리오'} ${yearMonth} 스냅샷이 저장되었습니다!`)
  }

  // 사용 가능한 월
  const availableMonths = ['2026-01', '2026-02', '2026-03']

  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
    },
    header: {
      marginBottom: '24px',
    },
    title: {
      fontSize: isMobile ? '24px' : '28px',
      fontWeight: '700',
      color: '#191F28',
      margin: 0,
      marginBottom: '8px',
    },
    subtitle: {
      fontSize: '14px',
      color: '#8B95A1',
      margin: 0,
    },
    mainTabs: {
      display: 'flex',
      gap: '12px',
      marginBottom: '20px',
    },
    mainTab: (isActive) => ({
      flex: 1,
      padding: '16px',
      borderRadius: '16px',
      border: isActive ? '2px solid #3182F6' : '1px solid #E5E8EB',
      backgroundColor: isActive ? '#E8F3FF' : 'white',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'all 0.2s',
    }),
    mainTabEmoji: {
      fontSize: '28px',
      marginBottom: '8px',
    },
    mainTabName: (isActive) => ({
      fontSize: '16px',
      fontWeight: '700',
      color: isActive ? '#3182F6' : '#191F28',
    }),
    mainTabSub: {
      fontSize: '12px',
      color: '#8B95A1',
      marginTop: '4px',
    },
    monthSelector: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px',
      flexWrap: 'wrap',
    },
    select: {
      padding: '12px 16px',
      borderRadius: '12px',
      border: '1px solid #E5E8EB',
      backgroundColor: 'white',
      fontSize: '14px',
      fontWeight: '600',
      color: '#191F28',
      cursor: 'pointer',
      minWidth: '150px',
    },
    saveButton: {
      padding: '12px 20px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: '#3182F6',
      color: 'white',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '24px',
    },
    summaryCard: (highlight) => ({
      backgroundColor: highlight ? '#3182F6' : 'white',
      borderRadius: '16px',
      padding: '20px',
      border: highlight ? 'none' : '1px solid #E5E8EB',
    }),
    summaryLabel: (highlight) => ({
      fontSize: '12px',
      color: highlight ? 'rgba(255,255,255,0.8)' : '#8B95A1',
      marginBottom: '8px',
    }),
    summaryValue: (highlight) => ({
      fontSize: isMobile ? '18px' : '22px',
      fontWeight: '700',
      color: highlight ? 'white' : '#191F28',
    }),
    summarySubtext: (highlight) => ({
      fontSize: '11px',
      color: highlight ? 'rgba(255,255,255,0.7)' : '#8B95A1',
      marginTop: '4px',
    }),
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid #E5E8EB',
      marginBottom: '20px',
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#191F28',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    stockCard: (isTop) => ({
      flex: 1,
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: isTop ? '#E8F5E9' : '#FFEBEE',
    }),
    stockLabel: (isTop) => ({
      fontSize: '12px',
      color: isTop ? '#2E7D32' : '#C62828',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    }),
    stockName: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#191F28',
      marginBottom: '4px',
    },
    stockReturn: (isPositive) => ({
      fontSize: '14px',
      fontWeight: '600',
      color: isPositive ? '#2E7D32' : '#C62828',
    }),
    categoryBar: {
      display: 'flex',
      height: '24px',
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '16px',
    },
    categorySegment: (color, width) => ({
      width: `${width}%`,
      backgroundColor: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '10px',
      fontWeight: '600',
    }),
    categoryList: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)',
      gap: '12px',
    },
    categoryItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px',
      backgroundColor: '#F7F8FA',
      borderRadius: '10px',
    },
    categoryDot: (color) => ({
      width: '12px',
      height: '12px',
      borderRadius: '4px',
      backgroundColor: color,
    }),
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#8B95A1',
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '16px',
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📊 월간 리포트</h1>
        <p style={styles.subtitle}>월별 투자 성과 요약 및 분석</p>
      </div>

      {/* 메인 탭 */}
      <div style={styles.mainTabs}>
        <div
          style={styles.mainTab(mainTab === 'hauga')}
          onClick={() => setMainTab('hauga')}
        >
          <div style={styles.mainTabEmoji}>☁️</div>
          <div style={styles.mainTabName(mainTab === 'hauga')}>하우가 패밀리</div>
          <div style={styles.mainTabSub}>총 {(HAUGA_HOLDINGS.reduce((s, h) => s + h.currentKRW, 0) / 10000).toFixed(0)}만원</div>
        </div>
        <div
          style={styles.mainTab(mainTab === 'gayoon')}
          onClick={() => setMainTab('gayoon')}
        >
          <div style={styles.mainTabEmoji}>🐰</div>
          <div style={styles.mainTabName(mainTab === 'gayoon')}>가윤 달리오</div>
          <div style={styles.mainTabSub}>총 {(GAYOON_HOLDINGS.reduce((s, h) => s + h.currentKRW, 0) / 10000).toFixed(0)}만원</div>
        </div>
      </div>

      {/* 월 선택 */}
      <div style={styles.monthSelector}>
        <select
          style={styles.select}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {availableMonths.map(month => (
            <option key={month} value={month}>
              {month.replace('-', '년 ')}월
            </option>
          ))}
        </select>
        {isCurrentMonth && (
          <button style={styles.saveButton} onClick={saveSnapshot}>
            📸 스냅샷 저장
          </button>
        )}
      </div>

      {!monthData ? (
        <div style={styles.card}>
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <p>이 달의 데이터가 없습니다</p>
          </div>
        </div>
      ) : (
        <>
          {/* 요약 카드 */}
          <div style={styles.summaryGrid}>
            <div style={styles.summaryCard(false)}>
              <div style={styles.summaryLabel(false)}>총 자산</div>
              <div style={styles.summaryValue(false)}>
                {(monthData.totalKRW / 10000).toFixed(0)}만
              </div>
              <div style={styles.summarySubtext(false)}>
                ₩{monthData.totalKRW.toLocaleString()}
              </div>
            </div>
            <div style={styles.summaryCard(false)}>
              <div style={styles.summaryLabel(false)}>투자원금</div>
              <div style={styles.summaryValue(false)}>
                {(monthData.totalInvested / 10000).toFixed(0)}만
              </div>
              <div style={styles.summarySubtext(false)}>
                ₩{monthData.totalInvested?.toLocaleString() || '-'}
              </div>
            </div>
            <div style={styles.summaryCard(true)}>
              <div style={styles.summaryLabel(true)}>총 수익률</div>
              <div style={styles.summaryValue(true)}>
                {totalReturn ? `${totalReturn >= 0 ? '+' : ''}${totalReturn}%` : '-'}
              </div>
              <div style={styles.summarySubtext(true)}>
                {monthData.totalKRW - monthData.totalInvested >= 0 ? '+' : ''}
                {((monthData.totalKRW - monthData.totalInvested) / 10000).toFixed(0)}만원
              </div>
            </div>
            <div style={styles.summaryCard(false)}>
              <div style={styles.summaryLabel(false)}>연초 대비 (YTD)</div>
              <div style={{
                ...styles.summaryValue(false),
                color: ytdReturn >= 0 ? '#2E7D32' : '#C62828'
              }}>
                {ytdReturn ? `${ytdReturn >= 0 ? '+' : ''}${ytdReturn}%` : '-'}
              </div>
              <div style={styles.summarySubtext(false)}>
                2026년 1월 대비
              </div>
            </div>
          </div>

          {/* 최고/최저 종목 */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <span>🏆</span>
              <span>최고/최저 수익 종목</span>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexDirection: isMobile ? 'column' : 'row' }}>
              <div style={styles.stockCard(true)}>
                <div style={styles.stockLabel(true)}>
                  <span>🔥</span> 최고 수익
                </div>
                <div style={styles.stockName}>{bestStock?.name || '-'}</div>
                <div style={styles.stockReturn(true)}>
                  {bestStock?.gainPercent !== undefined ? `${bestStock.gainPercent >= 0 ? '+' : ''}${bestStock.gainPercent.toFixed(2)}%` : '-'}
                </div>
              </div>
              <div style={styles.stockCard(false)}>
                <div style={styles.stockLabel(false)}>
                  <span>📉</span> 최저 수익
                </div>
                <div style={styles.stockName}>{worstStock?.name || '-'}</div>
                <div style={styles.stockReturn(false)}>
                  {worstStock?.gainPercent !== undefined ? `${worstStock.gainPercent.toFixed(2)}%` : '-'}
                </div>
              </div>
            </div>
          </div>

          {/* 카테고리별 성과 */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <span>📁</span>
              <span>카테고리별 자산 배분</span>
            </div>

            <div style={styles.categoryBar}>
              {Object.entries(categoryTotals)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, amount]) => {
                  const percent = (amount / monthData.totalKRW) * 100
                  const color = CATEGORY_COLORS[cat] || '#9CA3AF'
                  return (
                    <div
                      key={cat}
                      style={styles.categorySegment(color, percent)}
                      title={`${cat}: ${percent.toFixed(1)}%`}
                    >
                      {percent >= 10 ? `${percent.toFixed(0)}%` : ''}
                    </div>
                  )
                })}
            </div>

            <div style={styles.categoryList}>
              {Object.entries(categoryTotals)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, amount]) => {
                  const percent = (amount / monthData.totalKRW) * 100
                  const color = CATEGORY_COLORS[cat] || '#9CA3AF'
                  return (
                    <div key={cat} style={styles.categoryItem}>
                      <div style={styles.categoryDot(color)} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#191F28' }}>{cat}</div>
                        <div style={{ fontSize: '11px', color: '#8B95A1' }}>
                          {(amount / 10000).toFixed(0)}만원
                        </div>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#191F28' }}>
                        {percent.toFixed(1)}%
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* 실현 손익 */}
          {monthData.realizedGain > 0 && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>
                <span>💵</span>
                <span>실현 손익</span>
              </div>
              <div style={{
                padding: '16px',
                backgroundColor: '#E8F5E9',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#2E7D32' }}>이번 달 실현수익</div>
                  <div style={{ fontSize: '12px', color: '#8B95A1', marginTop: '4px' }}>
                    배당금 + 매매차익
                  </div>
                </div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#2E7D32' }}>
                  +₩{monthData.realizedGain.toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* 월별 추이 */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <span>📈</span>
              <span>월별 자산 추이</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '120px' }}>
              {availableMonths.map(month => {
                const data = month === '2026-03' ? currentData : monthSnapshots[month]
                const maxTotal = Math.max(
                  ...availableMonths.map(m =>
                    (m === '2026-03' ? currentData : monthSnapshots[m])?.totalKRW || 0
                  )
                )
                const height = data ? (data.totalKRW / maxTotal) * 100 : 0
                const isSelected = month === selectedMonth

                return (
                  <div
                    key={month}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: `${height}%`,
                      backgroundColor: isSelected ? '#3182F6' : '#E5E8EB',
                      borderRadius: '6px',
                      minHeight: data ? '20px' : '4px',
                      transition: 'all 0.3s',
                    }} />
                    <div style={{
                      fontSize: '11px',
                      fontWeight: isSelected ? '700' : '500',
                      color: isSelected ? '#3182F6' : '#8B95A1',
                    }}>
                      {month.split('-')[1]}월
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
