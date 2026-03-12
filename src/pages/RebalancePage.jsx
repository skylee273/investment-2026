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
  '채권': '#6B7280',
  'ETF': '#3B82F6',
  '신흥국': '#10B981',
  '금': '#FBBF24',
  '해외주식': '#3182F6',
  '배당주': '#10B981',
  'CMA': '#8B95A1',
  '퇴직연금': '#6366F1',
}

// ========== 하우가 패밀리 데이터 ==========
const HAUGA_PORTFOLIOS = {
  toss: {
    name: '토스증권 해외주식',
    icon: '🇺🇸',
    target: [
      { ticker: 'AMZN', name: '아마존', category: 'Big Tech', targetWeight: 52 },
      { ticker: 'ADA', name: '에이다', category: '암호화폐', targetWeight: 9 },
      { ticker: 'GOOG', name: '알파벳 C', category: 'Big Tech', targetWeight: 9 },
      { ticker: 'MSFT', name: '마이크로소프트', category: 'Big Tech', targetWeight: 6 },
      { ticker: 'CVX', name: '셰브론', category: '에너지', targetWeight: 4 },
      { ticker: 'META', name: '메타', category: 'Big Tech', targetWeight: 3 },
      { ticker: 'GOOGL+BAC+AXP', name: '기타 (알파벳A, 금융)', category: '금융', targetWeight: 9 },
      { ticker: 'SPY+기타', name: 'ETF/기타', category: 'ETF', targetWeight: 8 },
    ],
    holdings: [
      { ticker: 'ADA', name: '에이다 (카르다노)', currentKRW: 63529, category: '암호화폐' },
      { ticker: 'AMZN', name: '아마존', currentKRW: 357500, category: 'Big Tech' },
      { ticker: 'GOOG', name: '알파벳 C', currentKRW: 61640, category: 'Big Tech' },
      { ticker: 'MSFT', name: '마이크로소프트', currentKRW: 42545, category: 'Big Tech' },
      { ticker: 'CVX', name: '셰브론', currentKRW: 28864, category: '에너지' },
      { ticker: 'META', name: '메타', currentKRW: 22607, category: 'Big Tech' },
      { ticker: 'AXP', name: '아메리칸 익스프레스', currentKRW: 21474, category: '금융' },
      { ticker: 'BAC', name: '뱅크오브아메리카', currentKRW: 18877, category: '금융' },
      { ticker: 'GOOGL', name: '알파벳 A', currentKRW: 17793, category: 'Big Tech' },
      { ticker: 'SPY', name: 'SPY', currentKRW: 17155, category: 'ETF' },
      { ticker: 'MP', name: 'MP 머티리얼스', currentKRW: 7964, category: '소재' },
      { ticker: 'ISRG', name: '인튜이티브 서지컬', currentKRW: 7656, category: '헬스케어' },
      { ticker: 'QCOM', name: '퀄컴', currentKRW: 7193, category: '반도체' },
      { ticker: 'PLTR', name: '팔란티어', currentKRW: 3097, category: 'AI/SW' },
      { ticker: 'TSLA', name: '테슬라', currentKRW: 2765, category: '자동차' },
      { ticker: 'AVGO', name: '브로드컴', currentKRW: 2640, category: '반도체' },
      { ticker: 'VRT', name: '버티브 홀딩스', currentKRW: 1933, category: 'AI/SW' },
      { ticker: 'VST', name: '비스트라 에너지', currentKRW: 955, category: '에너지' },
    ],
  },
  pension: {
    name: '연금저축',
    icon: '🧓',
    target: [
      { ticker: '069500', name: 'KODEX 코스피200', category: '국내대형', targetWeight: 80 },
      { ticker: '229200', name: 'KODEX 코스닥150', category: '국내중소', targetWeight: 20 },
    ],
    holdings: [
      { name: 'KODEX 200', ticker: '069500', currentKRW: 658840, category: '국내대형' },
      { name: 'KODEX 코스닥150', ticker: '229200', currentKRW: 105500, category: '국내중소' },
    ],
  },
  isa: {
    name: 'ISA',
    icon: '📊',
    target: [
      { ticker: '305080', name: 'TIGER 미국채10년선물', category: '채권', targetWeight: 40 },
      { ticker: '360750', name: 'TIGER 미국S&P500', category: 'S&P500', targetWeight: 39 },
      { ticker: '229200', name: 'KODEX 코스닥150', category: '국내중소', targetWeight: 21 },
    ],
    holdings: [
      { name: 'KODEX 코스닥150', ticker: '229200', currentKRW: 105500, category: '국내중소' },
      { name: 'TIGER 미국채10년선물', ticker: '305080', currentKRW: 199050, category: '채권' },
      { name: 'TIGER 미국S&P500', ticker: '360750', currentKRW: 196520, category: 'S&P500' },
    ],
  },
  stock: {
    name: '종합_주식',
    icon: '📈',
    target: [
      { ticker: 'GOOG', name: '알파벳 C', category: 'Big Tech', targetWeight: 60 },
      { ticker: '360750', name: 'TIGER 미국S&P500', category: 'S&P500', targetWeight: 23 },
      { ticker: '484790', name: '1Q 미국S&P500미국채혼합', category: 'ETF', targetWeight: 15 },
    ],
    holdings: [
      { name: '알파벳 C', ticker: 'GOOG', currentKRW: 443632, category: 'Big Tech' },
      { name: 'TIGER 미국S&P500', ticker: '360750', currentKRW: 171955, category: 'S&P500' },
      { name: '1Q 미국S&P500미국채혼합', ticker: '484790', currentKRW: 113550, category: 'ETF' },
    ],
  },
  irp: {
    name: 'IRP',
    icon: '🏦',
    target: [
      { ticker: '133690', name: 'TIGER 미국나스닥100', category: 'S&P500', targetWeight: 35 },
      { ticker: '360750', name: 'TIGER 미국S&P500', category: 'S&P500', targetWeight: 21 },
      { ticker: '195980', name: 'TIGER MSCI신흥국', category: '신흥국', targetWeight: 14 },
      { ticker: '472150', name: 'KODEX 골드액티브', category: '금', targetWeight: 30 },
    ],
    holdings: [],
  },
}

// ========== 가윤 달리오 데이터 ==========
const GAYOON_PORTFOLIOS = {
  sp500: {
    name: 'S&P500 + 배당주',
    icon: '📈',
    target: [
      { ticker: 'VOO', name: 'Vanguard S&P500', category: '해외주식', targetWeight: 80 },
      { ticker: 'SCHD', name: 'Schwab 배당주', category: '배당주', targetWeight: 20 },
    ],
    holdings: [
      { ticker: 'VOO', name: 'Vanguard S&P500 ETF', currentKRW: 19577473 + 656352, category: '해외주식' },
      { ticker: 'SCHD', name: 'Schwab 미국 배당주 ETF', currentKRW: 4562673, category: '배당주' },
    ],
  },
  isa: {
    name: 'ISA',
    icon: '📊',
    target: [
      { ticker: '069500', name: 'KODEX 코스피200', category: '국내대형', targetWeight: 30 },
      { ticker: '360750', name: 'TIGER 미국S&P500', category: 'S&P500', targetWeight: 20 },
      { ticker: '133690', name: 'TIGER 미국나스닥100', category: 'S&P500', targetWeight: 15 },
      { ticker: '195980', name: 'TIGER MSCI신흥국', category: '신흥국', targetWeight: 15 },
      { ticker: '472150', name: 'KODEX 골드액티브', category: '금', targetWeight: 10 },
      { ticker: '305080', name: 'TIGER 미국채10년선물', category: '채권', targetWeight: 10 },
    ],
    holdings: [
      // 현재 보유: 총 7,026,625원
      { ticker: '195980', name: 'PLUS 신흥국MSCI (→ TIGER 신흥국)', currentKRW: 2991835, category: '신흥국' },
      { ticker: '305080', name: 'TIGER 미국채10년선물', currentKRW: 2030310, category: '채권' },
      { ticker: '472150', name: 'KODEX 금액티브', currentKRW: 2004480, category: '금' },
    ],
  },
  pension: {
    name: '연금저축',
    icon: '🧓',
    target: [
      { ticker: '069500', name: 'KODEX 200', category: '국내대형', targetWeight: 100 },
    ],
    holdings: [
      { ticker: 'KODEX200', name: 'KODEX 200', currentKRW: 1976520, category: '국내대형' },
    ],
  },
  irp: {
    name: 'IRP',
    icon: '🏦',
    target: [
      { ticker: 'IRP', name: 'IRP 투자상품', category: '퇴직연금', targetWeight: 100 },
    ],
    holdings: [
      { ticker: 'IRP투자', name: 'IRP 투자상품', currentKRW: 273323, category: '퇴직연금' },
    ],
  },
  cma: {
    name: 'CMA',
    icon: '💵',
    target: [
      { ticker: 'MMF', name: '삼성신종MMF', category: 'CMA', targetWeight: 100 },
    ],
    holdings: [
      { ticker: 'MMF', name: '삼성신종MMF (CMA)', currentKRW: 6631937, category: 'CMA' },
    ],
  },
}

// 리밸런싱 계산
const calculateRebalance = (target, holdings, totalKRW) => {
  return target.map(t => {
    const holding = holdings.find(h =>
      h.ticker === t.ticker ||
      h.name?.includes(t.name?.split(' ')[0]) ||
      t.ticker?.includes(h.ticker)
    )
    const currentKRW = holding?.currentKRW || 0
    const currentWeight = totalKRW > 0 ? (currentKRW / totalKRW) * 100 : 0
    const targetKRW = totalKRW * (t.targetWeight / 100)
    const diffKRW = targetKRW - currentKRW
    const diffPercent = t.targetWeight - currentWeight

    return {
      ...t,
      currentKRW,
      currentWeight: Math.round(currentWeight * 100) / 100,
      targetKRW: Math.round(targetKRW),
      diffKRW: Math.round(diffKRW),
      diffPercent: Math.round(diffPercent * 100) / 100,
      action: diffKRW > 5000 ? 'buy' : diffKRW < -5000 ? 'sell' : 'hold'
    }
  })
}

export default function RebalancePage() {
  const [isMobile, setIsMobile] = useState(false)
  const [mainTab, setMainTab] = useState('hauga') // 'hauga' or 'gayoon'
  const [selectedAccount, setSelectedAccount] = useState('toss')

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 탭 변경 시 계좌 초기화
  useEffect(() => {
    setSelectedAccount(mainTab === 'hauga' ? 'toss' : 'sp500')
  }, [mainTab])

  const portfolios = mainTab === 'hauga' ? HAUGA_PORTFOLIOS : GAYOON_PORTFOLIOS
  const portfolio = portfolios[selectedAccount]
  const totalKRW = portfolio?.holdings.reduce((sum, h) => sum + h.currentKRW, 0) || 0
  const rebalanceData = portfolio ? calculateRebalance(portfolio.target, portfolio.holdings, totalKRW) : []

  // 리밸런싱 필요 여부
  const needsRebalance = rebalanceData.some(item => Math.abs(item.diffPercent) > 5)
  const totalBuy = rebalanceData.filter(i => i.action === 'buy').reduce((sum, i) => sum + i.diffKRW, 0)
  const totalSell = rebalanceData.filter(i => i.action === 'sell').reduce((sum, i) => sum + Math.abs(i.diffKRW), 0)

  // 목표 달성률
  const achievementRate = rebalanceData.reduce((sum, item) => {
    const rate = item.targetWeight > 0
      ? Math.min(100, (item.currentWeight / item.targetWeight) * 100)
      : 100
    return sum + rate * (item.targetWeight / 100)
  }, 0)

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
    tabs: {
      display: 'flex',
      gap: '8px',
      marginBottom: '24px',
      flexWrap: 'wrap',
    },
    tab: (isActive) => ({
      padding: '10px 16px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: isActive ? '#3182F6' : '#F2F4F6',
      color: isActive ? 'white' : '#4E5968',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s',
    }),
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
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
    summarySubtext: {
      fontSize: '12px',
      color: '#8B95A1',
      marginTop: '4px',
    },
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
    th: {
      textAlign: 'left',
      padding: '12px 8px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#8B95A1',
      borderBottom: '1px solid #E5E8EB',
      whiteSpace: 'nowrap',
    },
    td: {
      padding: '14px 8px',
      fontSize: '13px',
      color: '#191F28',
      borderBottom: '1px solid #F2F4F6',
    },
    badge: (action) => ({
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '600',
      backgroundColor: action === 'buy' ? '#E8F5E9' : action === 'sell' ? '#FFEBEE' : '#F2F4F6',
      color: action === 'buy' ? '#2E7D32' : action === 'sell' ? '#C62828' : '#6B7684',
    }),
    barContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    barWrapper: {
      flex: 1,
      height: '8px',
      backgroundColor: '#F2F4F6',
      borderRadius: '4px',
      overflow: 'hidden',
      position: 'relative',
    },
    barTarget: {
      position: 'absolute',
      height: '100%',
      backgroundColor: '#E5E8EB',
      borderRadius: '4px',
    },
    barCurrent: (color) => ({
      position: 'absolute',
      height: '100%',
      backgroundColor: color,
      borderRadius: '4px',
    }),
    diffText: (isPositive) => ({
      fontSize: '12px',
      fontWeight: '600',
      color: isPositive ? '#2E7D32' : '#C62828',
    }),
    statusBadge: (needsRebalance) => ({
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '600',
      backgroundColor: needsRebalance ? '#FFF3E0' : '#E8F5E9',
      color: needsRebalance ? '#E65100' : '#2E7D32',
    }),
    colorDot: (color) => ({
      width: '10px',
      height: '10px',
      borderRadius: '3px',
      backgroundColor: color,
      flexShrink: 0,
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

  const accounts = Object.entries(portfolios).map(([key, val]) => ({
    key,
    name: val.name,
    icon: val.icon,
  }))

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>⚖️ 리밸런싱</h1>
        <p style={styles.subtitle}>목표 비중과 현재 비중을 비교하여 리밸런싱 필요 금액을 확인하세요</p>
      </div>

      {/* 메인 탭: 하우가 패밀리 vs 가윤 달리오 */}
      <div style={styles.mainTabs}>
        <div
          style={styles.mainTab(mainTab === 'hauga')}
          onClick={() => setMainTab('hauga')}
        >
          <div style={styles.mainTabEmoji}>☁️</div>
          <div style={styles.mainTabName(mainTab === 'hauga')}>하우가 패밀리</div>
          <div style={styles.mainTabSub}>하늘 포트폴리오</div>
        </div>
        <div
          style={styles.mainTab(mainTab === 'gayoon')}
          onClick={() => setMainTab('gayoon')}
        >
          <div style={styles.mainTabEmoji}>🐰</div>
          <div style={styles.mainTabName(mainTab === 'gayoon')}>가윤 달리오</div>
          <div style={styles.mainTabSub}>가윤 포트폴리오</div>
        </div>
      </div>

      {/* 계좌 탭 */}
      <div style={styles.tabs}>
        {accounts.map(acc => (
          <button
            key={acc.key}
            style={styles.tab(selectedAccount === acc.key)}
            onClick={() => setSelectedAccount(acc.key)}
          >
            <span>{acc.icon}</span>
            <span>{acc.name}</span>
          </button>
        ))}
      </div>

      {/* 요약 카드 */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>총 자산</div>
          <div style={styles.summaryValue}>{totalKRW.toLocaleString()}원</div>
          <div style={styles.summarySubtext}>{(totalKRW / 10000).toFixed(1)}만원</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>목표 달성률</div>
          <div style={styles.summaryValue}>{achievementRate.toFixed(1)}%</div>
          <div style={styles.summarySubtext}>
            {achievementRate >= 95 ? '🎯 목표 근접' : achievementRate >= 80 ? '📈 양호' : '⚠️ 조정 필요'}
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>리밸런싱 필요</div>
          <div style={{ ...styles.summaryValue, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={styles.statusBadge(needsRebalance)}>
              {needsRebalance ? '조정 필요' : '균형 상태'}
            </span>
          </div>
          {needsRebalance && (
            <div style={styles.summarySubtext}>
              매수 +{totalBuy.toLocaleString()}원 / 매도 -{totalSell.toLocaleString()}원
            </div>
          )}
        </div>
      </div>

      {/* 비중 비교 테이블 */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <span>{portfolio?.icon}</span>
          <span>{portfolio?.name} 비중 비교</span>
        </div>

        {portfolio?.holdings.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <p>아직 보유 종목이 없습니다</p>
            <p style={{ fontSize: '13px', marginTop: '8px' }}>
              목표 비중에 맞게 종목을 매수해보세요
            </p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>종목</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>목표</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>현재</th>
                  <th style={styles.th}>비중 비교</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>편차</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>조정 금액</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>액션</th>
                </tr>
              </thead>
              <tbody>
                {rebalanceData.map((item, idx) => {
                  const color = CATEGORY_COLORS[item.category] || '#9CA3AF'
                  const maxWeight = Math.max(item.targetWeight, item.currentWeight, 1)

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
                      <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>
                        {item.targetWeight}%
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        {item.currentWeight.toFixed(1)}%
                      </td>
                      <td style={styles.td}>
                        <div style={styles.barContainer}>
                          <div style={styles.barWrapper}>
                            <div
                              style={{
                                ...styles.barTarget,
                                width: `${(item.targetWeight / maxWeight) * 100}%`
                              }}
                            />
                            <div
                              style={{
                                ...styles.barCurrent(color),
                                width: `${(item.currentWeight / maxWeight) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <span style={styles.diffText(item.diffPercent >= 0)}>
                          {item.diffPercent >= 0 ? '+' : ''}{item.diffPercent.toFixed(1)}%
                        </span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <span style={styles.diffText(item.diffKRW >= 0)}>
                          {item.diffKRW >= 0 ? '+' : ''}{item.diffKRW.toLocaleString()}원
                        </span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <span style={styles.badge(item.action)}>
                          {item.action === 'buy' ? '매수' : item.action === 'sell' ? '매도' : '유지'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 리밸런싱 액션 요약 */}
      {needsRebalance && (
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span>📋</span>
            <span>리밸런싱 액션 요약</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {rebalanceData.filter(i => i.action !== 'hold').map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: item.action === 'buy' ? '#E8F5E9' : '#FFEBEE',
                  borderRadius: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>
                    {item.action === 'buy' ? '📈' : '📉'}
                  </span>
                  <div>
                    <div style={{ fontWeight: '600', color: '#191F28' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#8B95A1' }}>
                      {item.currentWeight.toFixed(1)}% → {item.targetWeight}%
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontWeight: '700',
                    color: item.action === 'buy' ? '#2E7D32' : '#C62828',
                  }}>
                    {item.action === 'buy' ? '+' : ''}{item.diffKRW.toLocaleString()}원
                  </div>
                  <div style={{ fontSize: '12px', color: '#8B95A1' }}>
                    {item.action === 'buy' ? '매수' : '매도'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
