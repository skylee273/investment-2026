import { useState, useEffect } from 'react'

// 빌 애크먼 포트폴리오 (Pershing Square Q4 2025)
const ACKMAN_PORTFOLIO = {
  name: '빌 애크먼',
  fund: 'Pershing Square Capital',
  aum: '$15.5B',
  filingDate: '2026-02-17',
  description: '행동주의 투자의 대가. 집중 투자 전략으로 유명하며, 장기 복리 성장주에 집중.',
  style: '집중 투자 · 행동주의 · 장기 보유',
  holdings: [
    { ticker: 'BN', name: 'Brookfield Corp', weight: 18.15, change: 'hold', description: '글로벌 대체자산 운용사' },
    { ticker: 'UBER', name: 'Uber Technologies', weight: 15.90, change: 'trim', description: '글로벌 모빌리티 플랫폼' },
    { ticker: 'AMZN', name: 'Amazon.com', weight: 14.28, change: 'add', description: 'e커머스 · 클라우드 (AWS)', changeDetail: '+65%' },
    { ticker: 'GOOG', name: 'Alphabet (Class C)', weight: 12.46, change: 'hold', description: '검색 · 유튜브 · AI' },
    { ticker: 'META', name: 'Meta Platforms', weight: 11.37, change: 'new', description: 'SNS · 메타버스 · AI', changeDetail: '신규 매수' },
    { ticker: 'QSR', name: 'Restaurant Brands Intl', weight: 9.47, change: 'trim', description: '버거킹 · 팀홀튼 모회사' },
    { ticker: 'HHH', name: 'Howard Hughes Holdings', weight: 8.12, change: 'hold', description: '부동산 개발 (장기 보유)' },
    { ticker: 'HLT', name: 'Hilton Worldwide', weight: 0, change: 'sold', description: '호텔 체인', changeDetail: '전량 매도' },
    { ticker: 'CMG', name: 'Chipotle Mexican Grill', weight: 0, change: 'sold', description: '패스트캐주얼 레스토랑', changeDetail: '전량 매도' },
  ],
  keyMoves: [
    'META 신규 매수 (11.37%)',
    'AMZN 65% 증가',
    'HLT, CMG 전량 매도 (밸류에이션 이유)',
  ],
}

// 그렉 아벨 포트폴리오 (Berkshire Hathaway 2026)
const ABEL_PORTFOLIO = {
  name: '그렉 아벨',
  fund: 'Berkshire Hathaway',
  aum: '$318B',
  filingDate: '2026-02-17',
  description: '워렌 버핏의 후계자. 2026년 1월부터 CEO. 핵심 보유주 장기 유지 전략.',
  style: '가치 투자 · 영구 보유 · 안전마진',
  holdings: [
    { ticker: 'AAPL', name: 'Apple', weight: 28.1, change: 'hold', description: '최대 포지션 (축소 후에도)', core: true },
    { ticker: 'AXP', name: 'American Express', weight: 16.2, change: 'hold', description: '프리미엄 카드 · 30년 보유', core: true },
    { ticker: 'BAC', name: 'Bank of America', weight: 11.8, change: 'hold', description: '미국 2위 은행', core: true },
    { ticker: 'KO', name: 'Coca-Cola', weight: 9.4, change: 'hold', description: '배당 귀족 · 36년 보유', core: true },
    { ticker: 'CVX', name: 'Chevron', weight: 6.3, change: 'hold', description: '통합 에너지 기업', core: true },
    { ticker: 'OXY', name: 'Occidental Petroleum', weight: 4.8, change: 'hold', description: '석유·가스 생산' },
    { ticker: 'MCO', name: "Moody's Corp", weight: 4.2, change: 'hold', description: '신용평가 기관' },
    { ticker: 'KHC', name: 'Kraft Heinz', weight: 3.8, change: 'sell', description: '식품 대기업', changeDetail: '매도 예정' },
    { ticker: 'SOGO', name: '일본 5대 상사', weight: 13.3, change: 'hold', description: '미쓰비시·이토추·미쓰이 등', core: true },
  ],
  keyMoves: [
    'Kraft Heinz 전량 매도 검토 중',
    '2026.03.05 자사주 매입 재개',
    '그렉 아벨 개인 $15M 매수',
  ],
}

export default function GuruPortfolioPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [selectedGuru, setSelectedGuru] = useState('ackman')

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const portfolio = selectedGuru === 'ackman' ? ACKMAN_PORTFOLIO : ABEL_PORTFOLIO

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
    tabContainer: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
    },
    tab: (isActive) => ({
      flex: 1,
      padding: '16px 20px',
      borderRadius: '16px',
      border: isActive ? '2px solid #3182F6' : '1px solid #E5E8EB',
      backgroundColor: isActive ? '#E8F3FF' : 'white',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }),
    tabName: (isActive) => ({
      fontSize: '16px',
      fontWeight: '700',
      color: isActive ? '#3182F6' : '#191F28',
      marginBottom: '4px',
    }),
    tabFund: {
      fontSize: '12px',
      color: '#8B95A1',
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
    profileSection: {
      display: 'flex',
      gap: '20px',
      alignItems: isMobile ? 'flex-start' : 'center',
      flexDirection: isMobile ? 'column' : 'row',
    },
    avatar: {
      width: '80px',
      height: '80px',
      borderRadius: '20px',
      background: selectedGuru === 'ackman'
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      color: 'white',
      fontWeight: '700',
      flexShrink: 0,
    },
    profileInfo: {
      flex: 1,
    },
    guruName: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#191F28',
      marginBottom: '4px',
    },
    fundName: {
      fontSize: '14px',
      color: '#3182F6',
      fontWeight: '600',
      marginBottom: '8px',
    },
    description: {
      fontSize: '13px',
      color: '#6B7684',
      lineHeight: '1.5',
      marginBottom: '12px',
    },
    statRow: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
    },
    stat: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    statLabel: {
      fontSize: '12px',
      color: '#8B95A1',
    },
    statValue: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#191F28',
    },
    styleBadge: {
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: '8px',
      backgroundColor: '#F2F4F6',
      fontSize: '12px',
      color: '#4E5968',
      marginTop: '8px',
    },
    holdingItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 16px',
      backgroundColor: '#F7F8FA',
      borderRadius: '12px',
      marginBottom: '8px',
    },
    holdingLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flex: 1,
    },
    tickerBadge: {
      padding: '8px 12px',
      borderRadius: '10px',
      backgroundColor: '#191F28',
      color: 'white',
      fontSize: '13px',
      fontWeight: '700',
      minWidth: '60px',
      textAlign: 'center',
    },
    holdingInfo: {
      flex: 1,
    },
    holdingName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#191F28',
      marginBottom: '2px',
    },
    holdingDesc: {
      fontSize: '12px',
      color: '#8B95A1',
    },
    holdingRight: {
      textAlign: 'right',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    weight: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#191F28',
    },
    changeBadge: (type) => {
      const colors = {
        new: { bg: '#E8F5E9', color: '#2E7D32' },
        add: { bg: '#E3F2FD', color: '#1565C0' },
        hold: { bg: '#F2F4F6', color: '#6B7684' },
        trim: { bg: '#FFF3E0', color: '#E65100' },
        sell: { bg: '#FFEBEE', color: '#C62828' },
        sold: { bg: '#FFCDD2', color: '#B71C1C' },
      }
      const c = colors[type] || colors.hold
      return {
        padding: '4px 8px',
        borderRadius: '6px',
        backgroundColor: c.bg,
        color: c.color,
        fontSize: '11px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
      }
    },
    coreBadge: {
      padding: '2px 6px',
      borderRadius: '4px',
      backgroundColor: '#3182F6',
      color: 'white',
      fontSize: '10px',
      fontWeight: '600',
      marginLeft: '6px',
    },
    keyMoveItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '12px 0',
      borderBottom: '1px solid #F2F4F6',
    },
    keyMoveIcon: {
      width: '24px',
      height: '24px',
      borderRadius: '6px',
      backgroundColor: '#E8F3FF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      flexShrink: 0,
    },
    keyMoveText: {
      fontSize: '14px',
      color: '#191F28',
      lineHeight: '1.4',
    },
    soldItem: {
      opacity: 0.5,
      textDecoration: 'line-through',
    },
    disclaimer: {
      fontSize: '11px',
      color: '#8B95A1',
      textAlign: 'center',
      padding: '16px',
      borderTop: '1px solid #E5E8EB',
      marginTop: '20px',
    },
  }

  const getChangeLabel = (change) => {
    const labels = {
      new: '신규',
      add: '증가',
      hold: '유지',
      trim: '축소',
      sell: '매도예정',
      sold: '매도완료',
    }
    return labels[change] || change
  }

  const activeHoldings = portfolio.holdings.filter(h => h.weight > 0)
  const soldHoldings = portfolio.holdings.filter(h => h.weight === 0)

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>구루 포트폴리오</h1>
        <p style={styles.subtitle}>빌 애크먼 & 그렉 아벨의 최신 13F 포트폴리오</p>
      </div>

      {/* 구루 선택 탭 */}
      <div style={styles.tabContainer}>
        <div
          style={styles.tab(selectedGuru === 'ackman')}
          onClick={() => setSelectedGuru('ackman')}
        >
          <div style={styles.tabName(selectedGuru === 'ackman')}>빌 애크먼</div>
          <div style={styles.tabFund}>Pershing Square · $15.5B</div>
        </div>
        <div
          style={styles.tab(selectedGuru === 'abel')}
          onClick={() => setSelectedGuru('abel')}
        >
          <div style={styles.tabName(selectedGuru === 'abel')}>그렉 아벨</div>
          <div style={styles.tabFund}>Berkshire Hathaway · $318B</div>
        </div>
      </div>

      {/* 프로필 카드 */}
      <div style={styles.card}>
        <div style={styles.profileSection}>
          <div style={styles.avatar}>
            {selectedGuru === 'ackman' ? 'BA' : 'GA'}
          </div>
          <div style={styles.profileInfo}>
            <div style={styles.guruName}>{portfolio.name}</div>
            <div style={styles.fundName}>{portfolio.fund}</div>
            <div style={styles.description}>{portfolio.description}</div>
            <div style={styles.statRow}>
              <div style={styles.stat}>
                <span style={styles.statLabel}>운용자산</span>
                <span style={styles.statValue}>{portfolio.aum}</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statLabel}>공시일</span>
                <span style={styles.statValue}>{portfolio.filingDate}</span>
              </div>
            </div>
            <div style={styles.styleBadge}>{portfolio.style}</div>
          </div>
        </div>
      </div>

      {/* 주요 변동 */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <span>🔔</span>
          <span>Q4 2025 주요 변동</span>
        </div>
        {portfolio.keyMoves.map((move, idx) => (
          <div key={idx} style={styles.keyMoveItem}>
            <div style={styles.keyMoveIcon}>📌</div>
            <div style={styles.keyMoveText}>{move}</div>
          </div>
        ))}
      </div>

      {/* 포트폴리오 보유 종목 */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <span>📊</span>
          <span>포트폴리오 ({activeHoldings.length}개 종목)</span>
        </div>
        {activeHoldings.map((holding, idx) => (
          <div key={idx} style={styles.holdingItem}>
            <div style={styles.holdingLeft}>
              <div style={styles.tickerBadge}>{holding.ticker}</div>
              <div style={styles.holdingInfo}>
                <div style={styles.holdingName}>
                  {holding.name}
                  {holding.core && <span style={styles.coreBadge}>CORE</span>}
                </div>
                <div style={styles.holdingDesc}>{holding.description}</div>
              </div>
            </div>
            <div style={styles.holdingRight}>
              <span style={styles.changeBadge(holding.change)}>
                {getChangeLabel(holding.change)}
                {holding.changeDetail && ` ${holding.changeDetail}`}
              </span>
              <span style={styles.weight}>{holding.weight}%</span>
            </div>
          </div>
        ))}

        {/* 매도한 종목 */}
        {soldHoldings.length > 0 && (
          <>
            <div style={{ ...styles.cardTitle, marginTop: '24px', color: '#8B95A1' }}>
              <span>📤</span>
              <span>매도 완료</span>
            </div>
            {soldHoldings.map((holding, idx) => (
              <div key={idx} style={{ ...styles.holdingItem, opacity: 0.6 }}>
                <div style={styles.holdingLeft}>
                  <div style={{ ...styles.tickerBadge, backgroundColor: '#8B95A1' }}>{holding.ticker}</div>
                  <div style={styles.holdingInfo}>
                    <div style={{ ...styles.holdingName, textDecoration: 'line-through' }}>{holding.name}</div>
                    <div style={styles.holdingDesc}>{holding.description}</div>
                  </div>
                </div>
                <div style={styles.holdingRight}>
                  <span style={styles.changeBadge(holding.change)}>
                    {holding.changeDetail || '전량 매도'}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div style={styles.disclaimer}>
        * 데이터 출처: SEC 13F Filing (Q4 2025) · 실제 투자 전 추가 검토 필요
      </div>
    </div>
  )
}
