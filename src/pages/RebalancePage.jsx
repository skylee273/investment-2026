import { useState, useEffect } from 'react'

// 카테고리별 색상
const CATEGORY_COLORS = {
  'Big Tech': '#3182F6',
  '빅테크': '#3182F6',
  'S&P500': '#6366F1',
  '금융': '#10B981',
  '에너지': '#F59E0B',
  '반도체': '#EC4899',
  '헬스케어': '#8B5CF6',
  'AI/SW': '#06B6D4',
  '암호화폐': '#F97316',
  '국내대형': '#EF4444',
  '국내중소': '#F97316',
  '국내주식': '#EF4444',
  '채권': '#6B7280',
  'ETF': '#3B82F6',
  '신흥국': '#10B981',
  '금': '#FBBF24',
  '해외주식': '#3182F6',
  '배당주': '#10B981',
  'CMA': '#8B95A1',
  '현금성': '#8B95A1',
  '퇴직연금': '#6366F1',
  '연금': '#6366F1',
  '나스닥': '#7C3AED',
}

// ========== 하우가 패밀리 목표 비중 (카테고리별) ==========
const HAUGA_TARGET_WEIGHTS = {
  'Big Tech': 25,
  'S&P500': 15,
  '국내주식': 30,
  '에너지': 10,
  '반도체': 5,
  '헬스케어': 3,
  '금융': 2,
  '채권': 5,
  '암호화폐': 3,
  '현금성': 2,
  '연금': 0, // IRP 예수금은 별도
}

// ========== 가윤 달리오 목표 비중 (카테고리별) ==========
const GAYOON_TARGET_WEIGHTS = {
  'S&P500': 40,
  '배당주': 8,
  '국내주식': 18,
  '나스닥': 5,
  '신흥국': 4,
  '채권': 4,
  '금': 3,
  'Big Tech': 5,
  '암호화폐': 2,
  '현금성': 10,
  '연금': 1,
}

// ========== 하우가 패밀리 전체 보유 종목 (2026.03.29 기준) ==========
const HAUGA_ALL_HOLDINGS = [
  // 토스증권 해외주식
  { name: '아마존', ticker: 'AMZN', currentKRW: 365295, category: 'Big Tech', account: '토스' },
  { name: '알파벳 C', ticker: 'GOOG', currentKRW: 58467, category: 'Big Tech', account: '토스' },
  { name: '마이크로소프트', ticker: 'MSFT', currentKRW: 41152, category: 'Big Tech', account: '토스' },
  { name: '메타', ticker: 'META', currentKRW: 19672, category: 'Big Tech', account: '토스' },
  { name: '뱅크오브아메리카', ticker: 'BAC', currentKRW: 19012, category: '금융', account: '토스' },
  { name: '알파벳 A', ticker: 'GOOGL', currentKRW: 16903, category: 'Big Tech', account: '토스' },
  { name: 'SPY', ticker: 'SPY', currentKRW: 16890, category: 'S&P500', account: '토스' },
  { name: '인튜이티브 서지컬', ticker: 'ISRG', currentKRW: 7313, category: '헬스케어', account: '토스' },
  { name: '퀄컴', ticker: 'QCOM', currentKRW: 6850, category: '반도체', account: '토스' },
  { name: '브로드컴', ticker: 'AVGO', currentKRW: 2686, category: '반도체', account: '토스' },
  { name: '테슬라', ticker: 'TSLA', currentKRW: 2687, category: 'Big Tech', account: '토스' },
  // 미래에셋 연금저축
  { name: 'KODEX 200', ticker: '069500', currentKRW: 1055925, category: '국내주식', account: '연금' },
  { name: 'KODEX 코스닥150', ticker: '229200', currentKRW: 337110, category: '국내주식', account: '연금' },
  // 미래에셋 ISA
  { name: 'KODEX 코스닥150', ticker: '229200_I', currentKRW: 99150, category: '국내주식', account: 'ISA' },
  { name: 'TIGER 미국채10년선물', ticker: '305080', currentKRW: 202875, category: '채권', account: 'ISA' },
  { name: 'TIGER 미국S&P500', ticker: '360750_I', currentKRW: 195360, category: 'S&P500', account: 'ISA' },
  // 미래에셋 종합 (해외주식)
  { name: '셰브론', ticker: 'CVX', currentKRW: 636068, category: '에너지', account: '종합' },
  { name: '알파벳 C', ticker: 'GOOG_M', currentKRW: 412337, category: 'Big Tech', account: '종합' },
  { name: 'TIGER 미국S&P500', ticker: '360750', currentKRW: 170940, category: 'S&P500', account: '종합' },
  { name: '1Q S&P500미국채혼합', ticker: '484790', currentKRW: 116200, category: 'S&P500', account: '종합' },
  { name: '화이자', ticker: 'PFE', currentKRW: 50000, category: '헬스케어', account: '종합' },
  // 미래에셋 IRP
  { name: 'IRP 예수금', ticker: 'IRP', currentKRW: 250069, category: '연금', account: 'IRP' },
  // 미래에셋 CMA
  { name: 'CMA (가족여행)', ticker: 'CMA', currentKRW: 610106, category: '현금성', account: 'CMA' },
  // 업비트 암호화폐
  { name: '비트코인', ticker: 'BTC', currentKRW: 165490, category: '암호화폐', account: '업비트' },
]

// ========== 가윤 달리오 전체 보유 종목 (2026.03.29 기준) ==========
const GAYOON_ALL_HOLDINGS = [
  // 삼성증권 해외주식
  { name: 'Vanguard S&P500', ticker: 'VOO', currentKRW: 19317195, category: 'S&P500', account: '삼성' },
  { name: 'VOO (소수점)', ticker: 'VOO_P', currentKRW: 647620, category: 'S&P500', account: '삼성' },
  { name: 'Schwab 배당주', ticker: 'SCHD', currentKRW: 4584872, category: '배당주', account: '삼성' },
  { name: '케이뱅크', ticker: 'KBANK', currentKRW: 62700, category: '국내주식', account: '삼성' },
  // 삼성증권 ISA
  { name: 'KODEX 200', ticker: 'KODEX200_ISA', currentKRW: 5117175, category: '국내주식', account: 'ISA' },
  { name: 'TIGER S&P500', ticker: 'TIGER_SP_ISA', currentKRW: 4835160, category: 'S&P500', account: 'ISA' },
  { name: 'TIGER 나스닥100', ticker: 'TIGER_NAS', currentKRW: 2857680, category: '나스닥', account: 'ISA' },
  { name: 'PLUS 신흥국MSCI', ticker: 'PLUS_EM', currentKRW: 2695055, category: '신흥국', account: 'ISA' },
  { name: 'TIGER 미국채10년', ticker: 'TIGER_BD', currentKRW: 2069325, category: '채권', account: 'ISA' },
  { name: 'KODEX 금액티브', ticker: 'KODEX_G', currentKRW: 1806720, category: '금', account: 'ISA' },
  // 한투 해외주식
  { name: '아마존', ticker: 'AMZN', currentKRW: 2702213, category: 'Big Tech', account: '한투' },
  // 미래에셋 연금저축
  { name: 'KODEX 200', ticker: 'KODEX200_P', currentKRW: 4467375, category: '국내주식', account: '연금' },
  { name: 'KODEX 코스닥150', ticker: 'KODEX150_P', currentKRW: 1070820, category: '국내주식', account: '연금' },
  // 미래에셋 CMA
  { name: '발행어음CMA', ticker: 'CMA', currentKRW: 14030691, category: '현금성', account: 'CMA' },
  // 미래에셋 IRP
  { name: 'TDF2025', ticker: 'TDF2025', currentKRW: 265937, category: '연금', account: 'IRP' },
  // 업비트 암호화폐
  { name: '비트코인', ticker: 'BTC', currentKRW: 1091846, category: '암호화폐', account: '업비트' },
]

export default function RebalancePage() {
  const [isMobile, setIsMobile] = useState(false)
  const [mainTab, setMainTab] = useState('hauga') // 'hauga' or 'gayoon'
  const [sortBy, setSortBy] = useState('amount') // 'amount', 'weight', 'category'
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 전체 보유 종목
  const allHoldings = mainTab === 'hauga' ? HAUGA_ALL_HOLDINGS : GAYOON_ALL_HOLDINGS
  const targetWeights = mainTab === 'hauga' ? HAUGA_TARGET_WEIGHTS : GAYOON_TARGET_WEIGHTS
  const totalKRW = allHoldings.reduce((sum, h) => sum + h.currentKRW, 0)

  // 비중 계산된 종목 리스트
  const holdingsWithWeight = allHoldings.map(h => ({
    ...h,
    weight: (h.currentKRW / totalKRW) * 100
  }))

  // 카테고리별 합계
  const categoryTotals = allHoldings.reduce((acc, h) => {
    const cat = h.category || '기타'
    acc[cat] = (acc[cat] || 0) + h.currentKRW
    return acc
  }, {})

  // 카테고리별 종목 그룹핑
  const categoryHoldings = allHoldings.reduce((acc, h) => {
    const cat = h.category || '기타'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(h.name)
    return acc
  }, {})

  // 리밸런싱 의견 계산
  const getRebalanceRecommendations = () => {
    const recommendations = []

    Object.entries(categoryTotals).forEach(([cat, amount]) => {
      const currentWeight = (amount / totalKRW) * 100
      const targetWeight = targetWeights[cat] || 0
      const diff = targetWeight - currentWeight
      const diffKRW = (diff / 100) * totalKRW

      let action = '유지'
      let actionColor = '#8B95A1'
      let icon = '⚪'

      if (diff > 2) {
        action = '매수'
        actionColor = '#2E7D32'
        icon = '🟢'
      } else if (diff < -2) {
        action = '매도'
        actionColor = '#C62828'
        icon = '🔴'
      } else if (diff > 0.5) {
        action = '소량 매수'
        actionColor = '#66BB6A'
        icon = '🟡'
      } else if (diff < -0.5) {
        action = '소량 매도'
        actionColor = '#EF5350'
        icon = '🟡'
      }

      recommendations.push({
        category: cat,
        currentWeight,
        targetWeight,
        diff,
        diffKRW,
        action,
        actionColor,
        icon,
        holdings: categoryHoldings[cat] || [],
      })
    })

    // 목표에 있지만 현재 보유하지 않은 카테고리
    Object.entries(targetWeights).forEach(([cat, target]) => {
      if (!categoryTotals[cat] && target > 0) {
        recommendations.push({
          category: cat,
          currentWeight: 0,
          targetWeight: target,
          diff: target,
          diffKRW: (target / 100) * totalKRW,
          action: '신규 매수',
          actionColor: '#1565C0',
          icon: '🔵',
          holdings: [],
        })
      }
    })

    return recommendations.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
  }

  const recommendations = getRebalanceRecommendations()

  // 정렬
  const sortedHoldings = [...holdingsWithWeight].sort((a, b) => {
    if (sortBy === 'amount') return b.currentKRW - a.currentKRW
    if (sortBy === 'weight') return b.weight - a.weight
    if (sortBy === 'category') return (a.category || '').localeCompare(b.category || '')
    return 0
  })

  // 필터링
  const filteredHoldings = filterCategory === 'all'
    ? sortedHoldings
    : sortedHoldings.filter(h => h.category === filterCategory)

  // 카테고리 목록
  const categories = Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a])

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
    filterRow: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    select: {
      padding: '10px 14px',
      borderRadius: '10px',
      border: '1px solid #E5E8EB',
      backgroundColor: 'white',
      fontSize: '13px',
      fontWeight: '500',
      color: '#191F28',
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
    tableWrapper: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: (clickable) => ({
      textAlign: 'left',
      padding: '12px 8px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#8B95A1',
      borderBottom: '1px solid #E5E8EB',
      whiteSpace: 'nowrap',
      cursor: clickable ? 'pointer' : 'default',
    }),
    td: {
      padding: '14px 8px',
      fontSize: '13px',
      color: '#191F28',
      borderBottom: '1px solid #F2F4F6',
    },
    accountBadge: {
      display: 'inline-block',
      padding: '3px 8px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: '600',
      backgroundColor: '#F2F4F6',
      color: '#6B7684',
    },
    barWrapper: {
      width: '100%',
      height: '6px',
      backgroundColor: '#F2F4F6',
      borderRadius: '3px',
      overflow: 'hidden',
    },
    barFill: (color, width) => ({
      height: '100%',
      width: `${width}%`,
      backgroundColor: color,
      borderRadius: '3px',
    }),
    colorDot: (color) => ({
      width: '10px',
      height: '10px',
      borderRadius: '3px',
      backgroundColor: color,
      flexShrink: 0,
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
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: '12px',
    },
    categoryItem: {
      display: 'flex',
      alignItems: 'flex-start',
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
      marginTop: '2px',
    }),
    holdingTag: {
      display: 'inline-block',
      padding: '3px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: '500',
      backgroundColor: '#E5E8EB',
      color: '#4E5968',
      marginRight: '4px',
      marginTop: '4px',
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>⚖️ 리밸런싱</h1>
        <p style={styles.subtitle}>전체 보유 종목의 현재 비중을 확인하세요</p>
      </div>

      {/* 메인 탭: 하우가 패밀리 vs 가윤 달리오 */}
      <div style={styles.mainTabs}>
        <div
          style={styles.mainTab(mainTab === 'hauga')}
          onClick={() => setMainTab('hauga')}
        >
          <div style={styles.mainTabEmoji}>☁️</div>
          <div style={styles.mainTabName(mainTab === 'hauga')}>하우가 패밀리</div>
          <div style={styles.mainTabSub}>{allHoldings.length}개 종목</div>
        </div>
        <div
          style={styles.mainTab(mainTab === 'gayoon')}
          onClick={() => setMainTab('gayoon')}
        >
          <div style={styles.mainTabEmoji}>🐰</div>
          <div style={styles.mainTabName(mainTab === 'gayoon')}>가윤 달리오</div>
          <div style={styles.mainTabSub}>{GAYOON_ALL_HOLDINGS.length}개 종목</div>
        </div>
      </div>

      {/* 필터/정렬 */}
      <div style={styles.filterRow}>
        <select
          style={styles.select}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="amount">금액순</option>
          <option value="weight">비중순</option>
          <option value="category">카테고리순</option>
        </select>
        <select
          style={styles.select}
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">전체 카테고리</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* 요약 카드 */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard(false)}>
          <div style={styles.summaryLabel(false)}>총 자산</div>
          <div style={styles.summaryValue(false)}>{(totalKRW / 10000).toFixed(0)}만</div>
          <div style={styles.summarySubtext(false)}>₩{totalKRW.toLocaleString()}</div>
        </div>
        <div style={styles.summaryCard(false)}>
          <div style={styles.summaryLabel(false)}>보유 종목</div>
          <div style={styles.summaryValue(false)}>{allHoldings.length}개</div>
          <div style={styles.summarySubtext(false)}>{categories.length}개 카테고리</div>
        </div>
        <div style={styles.summaryCard(true)}>
          <div style={styles.summaryLabel(true)}>조정 필요</div>
          <div style={styles.summaryValue(true)}>
            {recommendations.filter(r => r.action !== '유지').length}건
          </div>
          <div style={styles.summarySubtext(true)}>
            매수 {recommendations.filter(r => r.action.includes('매수')).length} /
            매도 {recommendations.filter(r => r.action.includes('매도')).length}
          </div>
        </div>
        <div style={styles.summaryCard(false)}>
          <div style={styles.summaryLabel(false)}>표시 종목</div>
          <div style={styles.summaryValue(false)}>{filteredHoldings.length}개</div>
          <div style={styles.summarySubtext(false)}>
            {filterCategory === 'all' ? '전체' : filterCategory}
          </div>
        </div>
      </div>

      {/* 카테고리별 비중 */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <span>📊</span>
          <span>카테고리별 비중</span>
        </div>

        <div style={styles.categoryBar}>
          {Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, amount]) => {
              const percent = (amount / totalKRW) * 100
              const color = CATEGORY_COLORS[cat] || '#9CA3AF'
              return (
                <div
                  key={cat}
                  style={styles.categorySegment(color, percent)}
                  title={`${cat}: ${percent.toFixed(1)}%`}
                >
                  {percent >= 8 ? `${percent.toFixed(0)}%` : ''}
                </div>
              )
            })}
        </div>

        <div style={styles.categoryList}>
          {Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, amount]) => {
              const percent = (amount / totalKRW) * 100
              const color = CATEGORY_COLORS[cat] || '#9CA3AF'
              const holdings = categoryHoldings[cat] || []
              return (
                <div key={cat} style={styles.categoryItem}>
                  <div style={styles.categoryDot(color)} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#191F28' }}>{cat}</div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#191F28' }}>
                        {percent.toFixed(1)}%
                      </div>
                    </div>
                    <div style={{ fontSize: '11px', color: '#8B95A1', marginTop: '2px' }}>
                      {(amount / 10000).toFixed(0)}만원
                    </div>
                    <div style={{ marginTop: '6px' }}>
                      {holdings.map((name, idx) => (
                        <span key={idx} style={styles.holdingTag}>{name}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {/* 리밸런싱 의견 */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <span>💡</span>
          <span>리밸런싱 의견</span>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th(false)}>카테고리</th>
                <th style={{ ...styles.th(false), textAlign: 'center' }}>현재</th>
                <th style={{ ...styles.th(false), textAlign: 'center' }}>목표</th>
                <th style={{ ...styles.th(false), textAlign: 'center' }}>차이</th>
                <th style={{ ...styles.th(false), textAlign: 'center' }}>의견</th>
                <th style={{ ...styles.th(false), textAlign: 'right' }}>조정 금액</th>
              </tr>
            </thead>
            <tbody>
              {recommendations
                .filter(r => r.action !== '유지')
                .map((rec, idx) => {
                  const color = CATEGORY_COLORS[rec.category] || '#9CA3AF'
                  return (
                    <tr key={idx}>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={styles.colorDot(color)} />
                          <div>
                            <div style={{ fontWeight: '600' }}>{rec.category}</div>
                            {rec.holdings.length > 0 && (
                              <div style={{ fontSize: '10px', color: '#8B95A1', marginTop: '2px' }}>
                                {rec.holdings.slice(0, 3).join(', ')}
                                {rec.holdings.length > 3 && ` 외 ${rec.holdings.length - 3}개`}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>
                        {rec.currentWeight.toFixed(1)}%
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', color: '#3182F6' }}>
                        {rec.targetWeight.toFixed(1)}%
                      </td>
                      <td style={{
                        ...styles.td,
                        textAlign: 'center',
                        fontWeight: '600',
                        color: rec.diff > 0 ? '#2E7D32' : '#C62828'
                      }}>
                        {rec.diff > 0 ? '+' : ''}{rec.diff.toFixed(1)}%
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          backgroundColor: rec.action.includes('매수') ? '#E8F5E9' : '#FFEBEE',
                          color: rec.actionColor,
                          fontSize: '12px',
                          fontWeight: '600',
                        }}>
                          {rec.icon} {rec.action}
                        </span>
                      </td>
                      <td style={{
                        ...styles.td,
                        textAlign: 'right',
                        fontWeight: '600',
                        color: rec.diff > 0 ? '#2E7D32' : '#C62828'
                      }}>
                        {rec.diff > 0 ? '+' : ''}{(rec.diffKRW / 10000).toFixed(0)}만원
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>

        {recommendations.filter(r => r.action !== '유지').length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#8B95A1' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
            <div>포트폴리오가 목표 비중과 잘 맞습니다!</div>
          </div>
        )}
      </div>

      {/* 전체 종목 테이블 */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <span>📋</span>
          <span>전체 보유 종목</span>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th(true)} onClick={() => setSortBy('category')}>
                  종목 {sortBy === 'category' && '▼'}
                </th>
                <th style={{ ...styles.th(false), textAlign: 'center' }}>계좌</th>
                <th style={{ ...styles.th(true), textAlign: 'right' }} onClick={() => setSortBy('amount')}>
                  금액 {sortBy === 'amount' && '▼'}
                </th>
                <th style={{ ...styles.th(true), textAlign: 'right' }} onClick={() => setSortBy('weight')}>
                  비중 {sortBy === 'weight' && '▼'}
                </th>
                <th style={styles.th(false)}>비중 바</th>
              </tr>
            </thead>
            <tbody>
              {filteredHoldings.map((item, idx) => {
                const color = CATEGORY_COLORS[item.category] || '#9CA3AF'
                const maxWeight = sortedHoldings[0]?.weight || 1

                return (
                  <tr key={idx}>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={styles.colorDot(color)} />
                        <div>
                          <div style={{ fontWeight: '600' }}>{item.name}</div>
                          <div style={{ fontSize: '11px', color: '#8B95A1' }}>{item.category}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <span style={styles.accountBadge}>{item.account}</span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600' }}>
                      {item.currentKRW >= 10000
                        ? `${(item.currentKRW / 10000).toFixed(0)}만`
                        : `${item.currentKRW.toLocaleString()}원`
                      }
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600' }}>
                      {item.weight.toFixed(1)}%
                    </td>
                    <td style={{ ...styles.td, width: '100px' }}>
                      <div style={styles.barWrapper}>
                        <div style={styles.barFill(color, (item.weight / maxWeight) * 100)} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
