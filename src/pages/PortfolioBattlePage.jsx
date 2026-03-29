import { useState, useEffect } from 'react'

// 포트폴리오 대결 2026
// 기간: 2026.02.22 ~ 2026.12.24 (10개월)
// 최종 업데이트: 2026.03.03

const BATTLE_INFO = {
  startDate: '2026-02-22',
  endDate: '2026-12-24',
  prize: '치킨 사주기 🍗',
  lastUpdate: '2026.03.29',
}

// ========== 하우가 패밀리 (하늘) 실제 데이터 - 2026.03.29 기준 ==========
const HAUGA_HOLDINGS = [
  // 토스증권 해외주식 (12개 종목) - 총 557,857원, 원금 621,337원, -10.21%
  { ticker: 'MSFT', name: '마이크로소프트', currentKRW: 41152, investedKRW: 47590, gainPercent: -13.52 },
  { ticker: 'META', name: '메타', currentKRW: 19672, investedKRW: 23670, gainPercent: -16.88 },
  { ticker: 'BAC', name: '뱅크오브아메리카', currentKRW: 19012, investedKRW: 20702, gainPercent: -8.16 },
  { ticker: 'AVGO', name: '브로드컴', currentKRW: 2686, investedKRW: 2973, gainPercent: -9.64 },
  { ticker: 'AMZN', name: '아마존', currentKRW: 365295, investedKRW: 405610, gainPercent: -9.93 },
  { ticker: 'GOOGL', name: '알파벳 A', currentKRW: 16903, investedKRW: 19727, gainPercent: -14.31 },
  { ticker: 'GOOG', name: '알파벳 C', currentKRW: 58467, investedKRW: 63641, gainPercent: -8.12 },
  { ticker: 'ISRG', name: '인튜이티브 서지컬', currentKRW: 7313, investedKRW: 7882, gainPercent: -7.21 },
  { ticker: 'QCOM', name: '퀄컴', currentKRW: 6850, investedKRW: 7883, gainPercent: -13.09 },
  { ticker: 'TSLA', name: '테슬라', currentKRW: 2687, investedKRW: 2969, gainPercent: -9.48 },
  { ticker: 'SPY', name: 'SPY', currentKRW: 16890, investedKRW: 17704, gainPercent: -4.59 },
  // 미래에셋 - 종합 (12개 종목)
  { ticker: 'TIGER_SP', name: 'TIGER 미국S&P500', currentKRW: 170940, investedKRW: 174090, gainPercent: -1.81 },
  { ticker: '1Q_HYB', name: '1Q 미국S&P500미국채혼합', currentKRW: 116200, investedKRW: 116250, gainPercent: -0.04 },
  { ticker: 'CVX', name: '셰브론', currentKRW: 636068, investedKRW: 568711, gainPercent: 11.84 },
  { ticker: 'GOOG_M', name: '알파벳 C (미래)', currentKRW: 412337, investedKRW: 468022, gainPercent: -11.90 },
  { ticker: 'USD', name: '미국달러', currentKRW: 271, investedKRW: 271, gainPercent: 0.00 },
  { ticker: 'CMA', name: '발행어음CMA', currentKRW: 610106, investedKRW: 610000, gainPercent: 0.02 },
  { ticker: 'KODEX200', name: 'KODEX 200', currentKRW: 1055925, investedKRW: 1131700, gainPercent: -6.70 },
  { ticker: 'KODEX150_P', name: 'KODEX 코스닥150 (연금)', currentKRW: 337110, investedKRW: 344775, gainPercent: -2.22 },
  { ticker: 'IRP', name: '이하늘 개인형IRP', currentKRW: 250069, investedKRW: 250069, gainPercent: 0.00 },
  { ticker: 'KODEX150_I', name: 'KODEX 코스닥150 (ISA)', currentKRW: 99150, investedKRW: 101075, gainPercent: -1.90 },
  { ticker: 'TIGER_SP_I', name: 'TIGER 미국S&P500 (ISA)', currentKRW: 195360, investedKRW: 196840, gainPercent: -0.75 },
  { ticker: 'TIGER_BOND', name: 'TIGER 미국채10년선물', currentKRW: 202875, investedKRW: 198375, gainPercent: 2.27 },
  // 업비트 - 암호화폐
  { ticker: 'BTC', name: '비트코인', currentKRW: 165490, investedKRW: 167040, gainPercent: -0.93 },
]

// ========== 가윤 달리오 실제 데이터 - 2026.03.29 기준 ==========
const GAYOON_HOLDINGS = [
  // 삼성증권 - 해외주식 (VOO, SCHD, 케이뱅크)
  { ticker: 'VOO', name: 'Vanguard S&P500 ETF', currentKRW: 19317195, investedKRW: 18034965, gainPercent: 7.11 },
  { ticker: 'VOO_P', name: 'VOO (소수점)', currentKRW: 647620, investedKRW: 676691, gainPercent: -4.30 },
  { ticker: 'SCHD', name: 'Schwab 배당주 ETF', currentKRW: 4584872, investedKRW: 4047160, gainPercent: 13.29 },
  { ticker: 'KBANK', name: '케이뱅크', currentKRW: 62700, investedKRW: 83000, gainPercent: -24.46 },
  // 삼성증권 - ISA
  { ticker: 'KODEX200_ISA', name: 'KODEX 200 (ISA)', currentKRW: 5117175, investedKRW: 5223390, gainPercent: -2.03 },
  { ticker: 'TIGER_NAS', name: 'TIGER 미국나스닥100', currentKRW: 2857680, investedKRW: 2891400, gainPercent: -1.17 },
  { ticker: 'PLUS_EM', name: 'PLUS 신흥국MSCI', currentKRW: 2695055, investedKRW: 2997060, gainPercent: -10.08 },
  { ticker: 'TIGER_BD', name: 'TIGER 미국채10년선물', currentKRW: 2069325, investedKRW: 2003535, gainPercent: 3.28 },
  { ticker: 'TIGER_SP_ISA', name: 'TIGER 미국S&P500 (ISA)', currentKRW: 4835160, investedKRW: 4888810, gainPercent: -1.10 },
  { ticker: 'KODEX_G', name: 'KODEX 금액티브', currentKRW: 1806720, investedKRW: 1984640, gainPercent: -8.96 },
  { ticker: 'ISA_CASH', name: 'ISA 예수금', currentKRW: 10332, investedKRW: 10332, gainPercent: 0.00 },
  // 한투 - 해외주식
  { ticker: 'AMZN', name: '아마존 (한투)', currentKRW: 2702213, investedKRW: 2941594, gainPercent: -8.13 },
  // 미래에셋 - 연금저축
  { ticker: 'KODEX200_P', name: 'KODEX 200 (연금)', currentKRW: 4467375, investedKRW: 4912225, gainPercent: -9.06 },
  { ticker: 'KODEX150_P', name: 'KODEX 코스닥150 (연금)', currentKRW: 1070820, investedKRW: 1084800, gainPercent: -1.29 },
  // 미래에셋 - CMA
  { ticker: 'CMA', name: '발행어음CMA', currentKRW: 14030691, investedKRW: 14015160, gainPercent: 0.11 },
  // 미래에셋 - IRP
  { ticker: 'TDF2025', name: 'TDF2025 (IRP)', currentKRW: 265937, investedKRW: 267479, gainPercent: -0.58 },
  { ticker: 'IRP_CASH', name: 'IRP 현금성자산', currentKRW: 89, investedKRW: 89, gainPercent: 0.00 },
  // 업비트 - 암호화폐
  { ticker: 'BTC', name: '비트코인', currentKRW: 1091846, investedKRW: 1098351, gainPercent: -0.59 },
]

// 수익률 계산
const calculatePortfolioStats = (holdings) => {
  const totalCurrent = holdings.reduce((sum, h) => sum + h.currentKRW, 0)
  const totalInvested = holdings.reduce((sum, h) => sum + h.investedKRW, 0)
  const totalGain = totalCurrent - totalInvested
  const returnPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0
  return { totalCurrent, totalInvested, totalGain, returnPercent }
}

export default function PortfolioBattlePage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 실시간 계산
  const haugaStats = calculatePortfolioStats(HAUGA_HOLDINGS)
  const gayoonStats = calculatePortfolioStats(GAYOON_HOLDINGS)

  const haneulReturn = haugaStats.returnPercent
  const gayoonReturn = gayoonStats.returnPercent

  // 승자 결정
  const getWinner = () => {
    if (haneulReturn > gayoonReturn) return 'haneul'
    if (gayoonReturn > haneulReturn) return 'gayoon'
    return 'tie'
  }
  const winner = getWinner()
  const gap = Math.abs(haneulReturn - gayoonReturn)

  // D-day 계산
  const today = new Date()
  const endDate = new Date(BATTLE_INFO.endDate)
  const diffTime = endDate - today
  const dDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // 진행률 계산
  const startDate = new Date(BATTLE_INFO.startDate)
  const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24)
  const passedDays = (today - startDate) / (1000 * 60 * 60 * 24)
  const progressPercent = Math.min(Math.max((passedDays / totalDays) * 100, 0), 100)

  // 주요 보유 종목 (비중 기준 상위 5개)
  const getTopHoldings = (holdings, stats) => {
    return [...holdings]
      .sort((a, b) => b.currentKRW - a.currentKRW)
      .slice(0, 5)
      .map(h => ({
        name: h.name.replace('Vanguard ', '').replace('Schwab ', '').replace(' ETF', ''),
        weight: ((h.currentKRW / stats.totalCurrent) * 100).toFixed(1),
        gainPercent: h.gainPercent,
      }))
  }

  const haugaTop = getTopHoldings(HAUGA_HOLDINGS, haugaStats)
  const gayoonTop = getTopHoldings(GAYOON_HOLDINGS, gayoonStats)

  const styles = {
    container: {
      maxWidth: '100%',
    },
    header: {
      textAlign: 'center',
      marginBottom: '24px',
    },
    title: {
      fontSize: isMobile ? '24px' : '32px',
      fontWeight: '800',
      color: '#191F28',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
    },
    subtitle: {
      fontSize: '14px',
      color: '#8B95A1',
      marginTop: '8px',
    },
    updateBadge: {
      display: 'inline-block',
      padding: '4px 10px',
      backgroundColor: '#E8F5E9',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#2E7D32',
      marginTop: '8px',
    },
    dDayCard: {
      backgroundColor: '#FFF9E6',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid #FFE082',
      textAlign: 'center',
      marginBottom: '24px',
    },
    dDayValue: {
      fontSize: isMobile ? '36px' : '48px',
      fontWeight: '800',
      color: '#F57F17',
    },
    dDayLabel: {
      fontSize: '14px',
      color: '#856404',
      marginTop: '8px',
    },
    vsContainer: {
      display: 'flex',
      alignItems: isMobile ? 'stretch' : 'center',
      justifyContent: 'center',
      gap: isMobile ? '12px' : '24px',
      marginBottom: '24px',
      flexDirection: isMobile ? 'column' : 'row',
    },
    playerCard: (color, isWinning) => ({
      flex: 1,
      maxWidth: isMobile ? '100%' : '400px',
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '20px',
      border: isWinning ? `3px solid ${color}` : '1px solid #E5E8EB',
      boxShadow: isWinning ? `0 8px 32px ${color}30` : 'none',
      transition: 'all 0.3s',
    }),
    playerHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
    },
    playerEmoji: {
      fontSize: '36px',
    },
    playerName: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#191F28',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    playerStrategy: {
      fontSize: '12px',
      color: '#8B95A1',
    },
    winnerBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '4px 10px',
      backgroundColor: '#FFE082',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '700',
      color: '#F57F17',
    },
    statRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: '1px solid #F2F4F6',
    },
    statLabel: {
      fontSize: '13px',
      color: '#8B95A1',
    },
    statValue: {
      fontSize: '15px',
      fontWeight: '700',
      color: '#191F28',
    },
    returnValue: (isPositive) => ({
      fontSize: '22px',
      fontWeight: '800',
      color: isPositive > 0 ? '#00C853' : isPositive < 0 ? '#F04438' : '#8B95A1',
    }),
    vsText: {
      fontSize: isMobile ? '24px' : '32px',
      fontWeight: '900',
      color: '#F04438',
      textAlign: 'center',
      padding: isMobile ? '8px 0' : '0',
    },
    progressSection: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid #E5E8EB',
      marginBottom: '24px',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#191F28',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    battleBar: {
      height: '48px',
      backgroundColor: '#F2F4F6',
      borderRadius: '24px',
      display: 'flex',
      overflow: 'hidden',
      position: 'relative',
    },
    battleBarHalf: (color, isLeft) => ({
      width: '50%',
      backgroundColor: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: isLeft ? 'flex-start' : 'flex-end',
      padding: isLeft ? '0 0 0 16px' : '0 16px 0 0',
      color: 'white',
      fontWeight: '700',
      fontSize: '14px',
    }),
    holdingsGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: '16px',
      marginBottom: '24px',
    },
    holdingsCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '16px',
      border: '1px solid #E5E8EB',
    },
    holdingsTitle: (color) => ({
      fontSize: '14px',
      fontWeight: '700',
      color: color,
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }),
    holdingItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid #F2F4F6',
      fontSize: '13px',
    },
    holdingReturn: (isPositive) => ({
      fontSize: '12px',
      fontWeight: '600',
      color: isPositive >= 0 ? '#00C853' : '#F04438',
    }),
    gapCard: {
      backgroundColor: winner === 'tie' ? '#F7F8FA' : winner === 'haneul' ? '#E8F3FF' : '#E8F5E9',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '24px',
      textAlign: 'center',
    },
    gapValue: {
      fontSize: '28px',
      fontWeight: '800',
      color: winner === 'haneul' ? '#3182F6' : '#00C853',
    },
    gapLabel: {
      fontSize: '14px',
      color: '#6B7684',
      marginTop: '8px',
    },
    rulesCard: {
      backgroundColor: '#F0F7FF',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid #BBDEFB',
    },
    rulesTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#3182F6',
      marginBottom: '12px',
    },
    rulesList: {
      fontSize: '13px',
      color: '#4E5968',
      lineHeight: '2',
    },
  }

  return (
    <div style={styles.container}>
      {/* 헤더 */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          <span>🏆</span>
          포트폴리오 대결
          <span>🏆</span>
        </h1>
        <p style={styles.subtitle}>
          2026.02.22 ~ 2026.12.24 · 10개월 수익률 대결 · 상품: {BATTLE_INFO.prize}
        </p>
        <div style={styles.updateBadge}>
          🔄 최종 업데이트: {BATTLE_INFO.lastUpdate}
        </div>
      </div>

      {/* D-Day */}
      <div style={styles.dDayCard}>
        <div style={styles.dDayValue}>D-{dDay}</div>
        <div style={styles.dDayLabel}>대결 종료까지</div>
        <div style={{
          marginTop: '16px',
          height: '8px',
          backgroundColor: '#FFE082',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            backgroundColor: '#F57F17',
            borderRadius: '4px',
          }} />
        </div>
        <div style={{ fontSize: '12px', color: '#856404', marginTop: '8px' }}>
          진행률 {progressPercent.toFixed(1)}%
        </div>
      </div>

      {/* 격차 카드 */}
      <div style={styles.gapCard}>
        {winner === 'tie' ? (
          <>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🤝</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#6B7684' }}>현재 동점!</div>
          </>
        ) : (
          <>
            <div style={styles.gapValue}>
              {winner === 'haneul' ? '☁️ 하늘' : '🐰 가윤'} 선두!
            </div>
            <div style={styles.gapLabel}>
              {gap.toFixed(2)}%p 차이로 앞서고 있습니다
            </div>
          </>
        )}
      </div>

      {/* VS 카드 */}
      <div style={styles.vsContainer}>
        {/* 하늘 */}
        <div style={styles.playerCard('#3182F6', winner === 'haneul')}>
          <div style={styles.playerHeader}>
            <span style={styles.playerEmoji}>☁️</span>
            <div>
              <div style={styles.playerName}>
                하우가 패밀리
                {winner === 'haneul' && <span style={styles.winnerBadge}>👑 선두</span>}
              </div>
              <div style={styles.playerStrategy}>개별주 + ETF 혼합 전략</div>
            </div>
          </div>

          <div style={styles.statRow}>
            <span style={styles.statLabel}>투자원금</span>
            <span style={styles.statValue}>₩{haugaStats.totalInvested.toLocaleString()}</span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>현재가치</span>
            <span style={styles.statValue}>₩{haugaStats.totalCurrent.toLocaleString()}</span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>평가손익</span>
            <span style={{ ...styles.statValue, color: haugaStats.totalGain >= 0 ? '#00C853' : '#F04438' }}>
              {haugaStats.totalGain >= 0 ? '+' : ''}{haugaStats.totalGain.toLocaleString()}원
            </span>
          </div>
          <div style={{ ...styles.statRow, borderBottom: 'none', paddingTop: '16px' }}>
            <span style={styles.statLabel}>수익률</span>
            <span style={styles.returnValue(haneulReturn)}>
              {haneulReturn >= 0 ? '+' : ''}{haneulReturn.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* VS */}
        <div style={styles.vsText}>VS</div>

        {/* 가윤 */}
        <div style={styles.playerCard('#00C853', winner === 'gayoon')}>
          <div style={styles.playerHeader}>
            <span style={styles.playerEmoji}>🐰</span>
            <div>
              <div style={styles.playerName}>
                가윤 달리오
                {winner === 'gayoon' && <span style={styles.winnerBadge}>👑 선두</span>}
              </div>
              <div style={styles.playerStrategy}>ETF 리밸런싱 전략</div>
            </div>
          </div>

          <div style={styles.statRow}>
            <span style={styles.statLabel}>투자원금</span>
            <span style={styles.statValue}>₩{gayoonStats.totalInvested.toLocaleString()}</span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>현재가치</span>
            <span style={styles.statValue}>₩{gayoonStats.totalCurrent.toLocaleString()}</span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>평가손익</span>
            <span style={{ ...styles.statValue, color: gayoonStats.totalGain >= 0 ? '#00C853' : '#F04438' }}>
              {gayoonStats.totalGain >= 0 ? '+' : ''}{gayoonStats.totalGain.toLocaleString()}원
            </span>
          </div>
          <div style={{ ...styles.statRow, borderBottom: 'none', paddingTop: '16px' }}>
            <span style={styles.statLabel}>수익률</span>
            <span style={styles.returnValue(gayoonReturn)}>
              {gayoonReturn >= 0 ? '+' : ''}{gayoonReturn.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* 대결 현황 바 */}
      <div style={styles.progressSection}>
        <div style={styles.sectionTitle}>
          <span>📊</span> 수익률 비교
        </div>
        <div style={styles.battleBar}>
          <div style={styles.battleBarHalf('#3182F6', true)}>
            ☁️ {haneulReturn >= 0 ? '+' : ''}{haneulReturn.toFixed(2)}%
          </div>
          <div style={styles.battleBarHalf('#00C853', false)}>
            {gayoonReturn >= 0 ? '+' : ''}{gayoonReturn.toFixed(2)}% 🐰
          </div>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '8px',
          fontSize: '12px',
          color: '#8B95A1',
        }}>
          <span>하우가 패밀리 ({HAUGA_HOLDINGS.length}개 종목)</span>
          <span>가윤 달리오 ({GAYOON_HOLDINGS.length}개 종목)</span>
        </div>
      </div>

      {/* 주요 보유 종목 비교 */}
      <div style={styles.holdingsGrid}>
        <div style={styles.holdingsCard}>
          <div style={styles.holdingsTitle('#3182F6')}>
            ☁️ 하우가 TOP 5
          </div>
          {haugaTop.map((item, idx) => (
            <div key={idx} style={styles.holdingItem}>
              <span>{item.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontWeight: '600' }}>{item.weight}%</span>
                <span style={styles.holdingReturn(item.gainPercent)}>
                  {item.gainPercent >= 0 ? '+' : ''}{item.gainPercent.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.holdingsCard}>
          <div style={styles.holdingsTitle('#00C853')}>
            🐰 가윤 TOP 5
          </div>
          {gayoonTop.map((item, idx) => (
            <div key={idx} style={styles.holdingItem}>
              <span>{item.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontWeight: '600' }}>{item.weight}%</span>
                <span style={styles.holdingReturn(item.gainPercent)}>
                  {item.gainPercent >= 0 ? '+' : ''}{item.gainPercent.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 대결 규칙 */}
      <div style={styles.rulesCard}>
        <div style={styles.rulesTitle}>📋 대결 규칙</div>
        <div style={styles.rulesList}>
          <div>1. 기간: 2026.02.22 ~ 2026.12.24 (10개월)</div>
          <div>2. 기준: 투자원금 대비 수익률 (실시간 계산)</div>
          <div>3. 승리 조건: 종료일 기준 더 높은 수익률</div>
          <div>4. 상품: 패자가 승자에게 {BATTLE_INFO.prize}</div>
          <div>5. 중간 리밸런싱/매매 자유</div>
        </div>
      </div>

      {/* 수익률 측정 방식 안내 */}
      <div style={{
        backgroundColor: '#FFF8E1',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #FFE082',
        marginTop: '24px',
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: '800',
          color: '#F57F17',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span>⚖️</span> 왜 이 방식이 가장 공정한가요?
        </div>

        <div style={{
          backgroundColor: '#FFFDE7',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#F57F17', marginBottom: '8px' }}>
            ❌ 단순 현재 수익률 캡처가 불공정한 이유
          </div>
          <div style={{ fontSize: '13px', color: '#5D4037', lineHeight: '1.8' }}>
            • 매입 시점이 다르면 비교 불가 (일찍 산 사람이 유리/불리)<br/>
            • 중간 입금/출금 시 수익률 왜곡<br/>
            • 계좌마다 수익률 계산 방식이 다름
          </div>
        </div>

        <div style={{
          backgroundColor: '#E8F5E9',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#2E7D32', marginBottom: '8px' }}>
            ✅ 우리의 공정한 방식: 대결 시작일 기준 수익률
          </div>
          <div style={{ fontSize: '13px', color: '#1B5E20', lineHeight: '1.8' }}>
            • <strong>대결 시작일(2026.02.22)</strong> 총 평가금액을 기준점으로 설정<br/>
            • 그 이후의 수익률만 비교<br/>
            • 과거 매입 시점과 무관하게 <strong>같은 출발선</strong>에서 시작<br/>
            • 순수하게 <strong>대결 기간 동안의 운용능력</strong>만 비교
          </div>
        </div>

        <div style={{
          backgroundColor: '#FFF3E0',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#E65100', marginBottom: '8px' }}>
            📐 수익률 계산 공식
          </div>
          <div style={{
            fontSize: '15px',
            fontWeight: '700',
            color: '#BF360C',
            textAlign: 'center',
            padding: '12px',
            backgroundColor: '#FBE9E7',
            borderRadius: '8px',
            fontFamily: 'monospace',
          }}>
            수익률 = (현재 평가금액 - 시작일 평가금액) / 시작일 평가금액 × 100
          </div>
        </div>

        <div style={{
          backgroundColor: '#E3F2FD',
          borderRadius: '12px',
          padding: '16px',
        }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#1565C0', marginBottom: '12px' }}>
            📱 주식 앱에서 데이터 전달하는 방법
          </div>
          <div style={{ fontSize: '13px', color: '#0D47A1', lineHeight: '1.8', marginBottom: '12px' }}>
            각 계좌별로 <strong>"총 평가금액"</strong>만 알려주면 됩니다!
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '12px',
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '12px',
              border: '1px solid #BBDEFB',
            }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#1565C0', marginBottom: '8px' }}>
                방법 1: 텍스트로 전달
              </div>
              <div style={{
                fontSize: '12px',
                color: '#37474F',
                lineHeight: '1.6',
                backgroundColor: '#F5F5F5',
                padding: '8px',
                borderRadius: '6px',
                fontFamily: 'monospace',
              }}>
                삼성증권: 24,140,146원<br/>
                미래에셋: 4,500,000원<br/>
                합계: 28,640,146원
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '12px',
              border: '1px solid #BBDEFB',
            }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#1565C0', marginBottom: '8px' }}>
                방법 2: 스크린샷 전달
              </div>
              <div style={{ fontSize: '12px', color: '#37474F', lineHeight: '1.6' }}>
                각 증권사 앱에서<br/>
                <strong>"내 자산"</strong> 또는 <strong>"총 평가금액"</strong><br/>
                화면 스크린샷 전송
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '12px',
            padding: '10px',
            backgroundColor: '#FFECB3',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#FF6F00',
            fontWeight: '600',
          }}>
            💡 TIP: 매월 말일에 업데이트하면 추적하기 편해요!
          </div>
        </div>
      </div>

      {/* 중간 입출금 처리 안내 */}
      <div style={{
        backgroundColor: '#F3E5F5',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #CE93D8',
        marginTop: '16px',
      }}>
        <div style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#7B1FA2',
          marginBottom: '12px',
        }}>
          💰 중간에 돈을 입금하거나 출금하면?
        </div>
        <div style={{ fontSize: '13px', color: '#4A148C', lineHeight: '1.8' }}>
          <strong>입금 시:</strong> 입금액만큼 "시작일 평가금액"에 더해줌<br/>
          <strong>출금 시:</strong> 출금액만큼 "시작일 평가금액"에서 빼줌<br/><br/>
          <div style={{
            backgroundColor: '#EDE7F6',
            padding: '12px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '12px',
          }}>
            예시: 시작 1,000만원 → 중간에 200만원 입금<br/>
            → 조정된 시작금액 = 1,200만원<br/>
            → 현재 1,500만원이면 수익률 = (1,500-1,200)/1,200 = 25%
          </div>
        </div>
      </div>
    </div>
  )
}
