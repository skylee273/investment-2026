import { useState } from 'react'

// 포트폴리오 대결 2026
// 기간: 2026.02 ~ 2027.02 (1년)

const BATTLE_INFO = {
  startDate: '2026-02-22',
  endDate: '2026-12-24',
  prize: '치킨 사주기 🍗',
}

// 하늘 포트폴리오 요약
const HANEUL_PORTFOLIO = {
  name: '하늘',
  emoji: '☁️',
  color: '#3182F6',
  strategy: '개별주 + ETF 혼합',
  totalInvestment: 1000000,
  currentValue: 1000000,
  monthlyData: [
    { month: '2월', value: 1000000, return: 0 },
  ],
  holdings: [
    { name: 'KODEX 200', weight: 30 },
    { name: 'KODEX 코스닥150', weight: 13 },
    { name: 'GOOG', weight: 12 },
    { name: 'TIGER S&P 500', weight: 10 },
    { name: 'TIGER 혼합50', weight: 10 },
    { name: 'CVX', weight: 10 },
    { name: 'AMZN', weight: 10 },
    { name: 'ADA', weight: 5 },
  ],
}

// 가윤 포트폴리오 요약
const GAYOON_PORTFOLIO = {
  name: '가윤',
  emoji: '🐰',
  color: '#00C853',
  strategy: '리밸런싱 기반 ETF',
  totalInvestment: 1000000,
  currentValue: 1000000,
  monthlyData: [
    { month: '2월', value: 1000000, return: 0 },
  ],
  holdings: [
    { name: 'S&P500 ETF', weight: 40 },
    { name: 'KODEX 200', weight: 20 },
    { name: 'KODEX 코스닥150', weight: 10 },
    { name: 'KODEX 국고채10년', weight: 10 },
    { name: 'TIGER 미국채10년', weight: 10 },
    { name: 'KODEX 골드', weight: 10 },
  ],
}

const styles = {
  container: {
    maxWidth: '100%',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '32px',
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
  vsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    marginBottom: '32px',
  },
  playerCard: (color, isWinning) => ({
    flex: 1,
    maxWidth: '400px',
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '24px',
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
    fontSize: '40px',
  },
  playerName: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#191F28',
  },
  playerStrategy: {
    fontSize: '12px',
    color: '#8B95A1',
  },
  vsText: {
    fontSize: '32px',
    fontWeight: '900',
    color: '#F04438',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #F2F4F6',
  },
  statLabel: {
    fontSize: '13px',
    color: '#8B95A1',
  },
  statValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#191F28',
  },
  returnValue: (isPositive) => ({
    fontSize: '20px',
    fontWeight: '800',
    color: isPositive ? '#00C853' : isPositive === false ? '#F04438' : '#8B95A1',
  }),
  progressSection: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #E5E8EB',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#191F28',
    marginBottom: '20px',
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
  battleBarLeft: (percent, color) => ({
    width: `${percent}%`,
    backgroundColor: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: '16px',
    color: 'white',
    fontWeight: '700',
    fontSize: '14px',
    transition: 'width 0.5s ease',
  }),
  battleBarRight: (percent, color) => ({
    width: `${percent}%`,
    backgroundColor: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: '16px',
    color: 'white',
    fontWeight: '700',
    fontSize: '14px',
    transition: 'width 0.5s ease',
  }),
  holdingsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '24px',
  },
  holdingsCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #E5E8EB',
  },
  holdingsTitle: (color) => ({
    fontSize: '16px',
    fontWeight: '700',
    color: color,
    marginBottom: '16px',
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
  dDayCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #FFE082',
    textAlign: 'center',
    marginBottom: '24px',
  },
  dDayValue: {
    fontSize: '48px',
    fontWeight: '800',
    color: '#F57F17',
  },
  dDayLabel: {
    fontSize: '14px',
    color: '#856404',
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
  winnerBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 12px',
    backgroundColor: '#FFE082',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#F57F17',
  },
  tieText: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#8B95A1',
    padding: '20px',
  },
}

export default function PortfolioBattlePage() {
  // 수익률 계산
  const haneulReturn = ((HANEUL_PORTFOLIO.currentValue - HANEUL_PORTFOLIO.totalInvestment) / HANEUL_PORTFOLIO.totalInvestment) * 100
  const gayoonReturn = ((GAYOON_PORTFOLIO.currentValue - GAYOON_PORTFOLIO.totalInvestment) / GAYOON_PORTFOLIO.totalInvestment) * 100

  // 승자 결정
  const getWinner = () => {
    if (haneulReturn > gayoonReturn) return 'haneul'
    if (gayoonReturn > haneulReturn) return 'gayoon'
    return 'tie'
  }
  const winner = getWinner()

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

  // 대결 바 비율 계산
  const totalReturn = Math.abs(haneulReturn) + Math.abs(gayoonReturn)
  const haneulBarPercent = totalReturn === 0 ? 50 : (Math.max(haneulReturn, 0) / (Math.max(haneulReturn, 0) + Math.max(gayoonReturn, 0)) * 100) || 50
  const gayoonBarPercent = 100 - haneulBarPercent

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
          2026.02.22 ~ 2026.12.24 · 10개월간 수익률 대결 · 상품: {BATTLE_INFO.prize}
        </p>
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

      {/* VS 카드 */}
      <div style={styles.vsContainer}>
        {/* 하늘 */}
        <div style={styles.playerCard(HANEUL_PORTFOLIO.color, winner === 'haneul')}>
          <div style={styles.playerHeader}>
            <span style={styles.playerEmoji}>{HANEUL_PORTFOLIO.emoji}</span>
            <div>
              <div style={styles.playerName}>
                {HANEUL_PORTFOLIO.name}
                {winner === 'haneul' && <span style={{ ...styles.winnerBadge, marginLeft: '8px' }}>👑 선두</span>}
              </div>
              <div style={styles.playerStrategy}>{HANEUL_PORTFOLIO.strategy}</div>
            </div>
          </div>

          <div style={styles.statRow}>
            <span style={styles.statLabel}>투자원금</span>
            <span style={styles.statValue}>₩{HANEUL_PORTFOLIO.totalInvestment.toLocaleString()}</span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>현재가치</span>
            <span style={styles.statValue}>₩{HANEUL_PORTFOLIO.currentValue.toLocaleString()}</span>
          </div>
          <div style={{ ...styles.statRow, borderBottom: 'none' }}>
            <span style={styles.statLabel}>수익률</span>
            <span style={styles.returnValue(haneulReturn > 0 ? true : haneulReturn < 0 ? false : null)}>
              {haneulReturn > 0 ? '+' : ''}{haneulReturn.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* VS */}
        <div style={styles.vsText}>VS</div>

        {/* 가윤 */}
        <div style={styles.playerCard(GAYOON_PORTFOLIO.color, winner === 'gayoon')}>
          <div style={styles.playerHeader}>
            <span style={styles.playerEmoji}>{GAYOON_PORTFOLIO.emoji}</span>
            <div>
              <div style={styles.playerName}>
                {GAYOON_PORTFOLIO.name}
                {winner === 'gayoon' && <span style={{ ...styles.winnerBadge, marginLeft: '8px' }}>👑 선두</span>}
              </div>
              <div style={styles.playerStrategy}>{GAYOON_PORTFOLIO.strategy}</div>
            </div>
          </div>

          <div style={styles.statRow}>
            <span style={styles.statLabel}>투자원금</span>
            <span style={styles.statValue}>₩{GAYOON_PORTFOLIO.totalInvestment.toLocaleString()}</span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>현재가치</span>
            <span style={styles.statValue}>₩{GAYOON_PORTFOLIO.currentValue.toLocaleString()}</span>
          </div>
          <div style={{ ...styles.statRow, borderBottom: 'none' }}>
            <span style={styles.statLabel}>수익률</span>
            <span style={styles.returnValue(gayoonReturn > 0 ? true : gayoonReturn < 0 ? false : null)}>
              {gayoonReturn > 0 ? '+' : ''}{gayoonReturn.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* 현재 상황 */}
      <div style={styles.progressSection}>
        <div style={styles.sectionTitle}>
          <span>📊</span> 현재 대결 상황
        </div>

        {winner === 'tie' ? (
          <div style={styles.tieText}>
            🤝 현재 동점입니다! 대결은 이제 시작!
          </div>
        ) : (
          <div style={styles.battleBar}>
            <div style={styles.battleBarLeft(haneulBarPercent, HANEUL_PORTFOLIO.color)}>
              {HANEUL_PORTFOLIO.emoji} {haneulReturn.toFixed(1)}%
            </div>
            <div style={styles.battleBarRight(gayoonBarPercent, GAYOON_PORTFOLIO.color)}>
              {gayoonReturn.toFixed(1)}% {GAYOON_PORTFOLIO.emoji}
            </div>
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '12px',
          fontSize: '13px',
          color: '#8B95A1',
        }}>
          <span>{HANEUL_PORTFOLIO.name}</span>
          <span>{GAYOON_PORTFOLIO.name}</span>
        </div>
      </div>

      {/* 보유 종목 비교 */}
      <div style={styles.holdingsGrid}>
        <div style={styles.holdingsCard}>
          <div style={styles.holdingsTitle(HANEUL_PORTFOLIO.color)}>
            {HANEUL_PORTFOLIO.emoji} {HANEUL_PORTFOLIO.name} 포트폴리오
          </div>
          {HANEUL_PORTFOLIO.holdings.map((item, idx) => (
            <div key={idx} style={styles.holdingItem}>
              <span>{item.name}</span>
              <span style={{ fontWeight: '600' }}>{item.weight}%</span>
            </div>
          ))}
        </div>

        <div style={styles.holdingsCard}>
          <div style={styles.holdingsTitle(GAYOON_PORTFOLIO.color)}>
            {GAYOON_PORTFOLIO.emoji} {GAYOON_PORTFOLIO.name} 포트폴리오
          </div>
          {GAYOON_PORTFOLIO.holdings.map((item, idx) => (
            <div key={idx} style={styles.holdingItem}>
              <span>{item.name}</span>
              <span style={{ fontWeight: '600' }}>{item.weight}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* 대결 규칙 */}
      <div style={styles.rulesCard}>
        <div style={styles.rulesTitle}>📋 대결 규칙</div>
        <div style={styles.rulesList}>
          <div>1. 기간: 2026.02.22 ~ 2026.12.24 (10개월)</div>
          <div>2. 기준: 동일 원금 대비 수익률</div>
          <div>3. 승리 조건: 1년 후 더 높은 수익률</div>
          <div>4. 상품: 패자가 승자에게 {BATTLE_INFO.prize}</div>
          <div>5. 중간 리밸런싱/매매 자유</div>
        </div>
      </div>
    </div>
  )
}
