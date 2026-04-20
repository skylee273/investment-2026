import { useState, useEffect } from 'react'

// 포트폴리오 대결 2026
const BATTLE_INFO = {
  startDate: '2026-02-22',
  endDate: '2026-12-24',
  prize: '치킨',
  lastUpdate: '2026.04.11 (하늘 업데이트)',
}

// ========== 공정한 수익률 계산을 위한 기준 데이터 ==========
// 대결 시작일(2026.02.22) 기준 "진짜 투입 원금"
// 증권사 이동으로 인한 왜곡을 방지하기 위해 최초 투입금만 기록
//
// [중요] 이 값은 "처음 투자한 원금"입니다.
// 증권사를 이동해도 이 값은 변하지 않습니다.
// 예: 한투에서 1000만원→1100만원 되고 미래에셋으로 이동해도,
//     원금은 여전히 1000만원으로 계산합니다.
const BATTLE_START_DATA = {
  haneul: {
    // 토스(62만) + 미래에셋 연금(147.6만) + ISA(49.6만) + 종합(137.7만) + IRP(25만) + CMA(61만) + 비트(16.7만)
    initialCapital: 4997665,
    description: '토스 + 미래에셋 (연금/ISA/종합/IRP/CMA) + 업비트',
  },
  gayoon: {
    // 삼성(해외+ISA) + 미래에셋(연금/CMA/IRP) + 한투(아마존) + 업비트
    // 모든 계좌의 "처음 투자한 금액" 합계
    initialCapital: 67150260,
    // 실현수익: 증권사 이동 시 이미 실현된 수익 (현재 0으로 설정)
    // 한투→삼성 이동 시 실현된 수익이 있다면 여기에 기록
    realizedGains: 0,
    description: '삼성(해외주식/ISA) + 미래에셋(연금/CMA/IRP) + 한투 + 업비트',
  },
}

// ========== 하우가 패밀리 (하늘) 실제 데이터 (2026.04.11) ==========
const HAUGA_HOLDINGS = [
  // 토스증권 해외주식
  { ticker: 'MSFT', name: '마이크로소프트', currentKRW: 42130, investedKRW: 47590, gainPercent: -11.4 },
  { ticker: 'META', name: '메타', currentKRW: 23167, investedKRW: 23670, gainPercent: -2.1 },
  { ticker: 'VST', name: '비스트라 에너지', currentKRW: 906, investedKRW: 986, gainPercent: -8.0 },
  { ticker: 'AMZN', name: '아마존 (토스)', currentKRW: 428785, investedKRW: 405610, gainPercent: 5.7 },
  { ticker: 'GOOGL', name: '알파벳 A', currentKRW: 19238, investedKRW: 19727, gainPercent: -2.4 },
  { ticker: 'ISRG', name: '인튜이티브 서지컬', currentKRW: 7195, investedKRW: 7882, gainPercent: -8.7 },
  { ticker: 'QCOM', name: '퀄컴', currentKRW: 6784, investedKRW: 7883, gainPercent: -13.9 },
  { ticker: 'TSLA', name: '테슬라', currentKRW: 2566, investedKRW: 2969, gainPercent: -13.5 },
  // 미래에셋 해외주식
  { ticker: 'CVX', name: '셰브론', currentKRW: 558523, investedKRW: 559234, gainPercent: -0.13 },
  { ticker: 'GOOG_M', name: '알파벳 C (미래)', currentKRW: 467613, investedKRW: 460222, gainPercent: 1.61 },
  { ticker: 'ORCL', name: '오라클', currentKRW: 204525, investedKRW: 202481, gainPercent: 1.01 },
  // 미래에셋 국내주식/ETF
  { ticker: '1Q_HYB', name: '1Q 미국S&P500미국채혼합', currentKRW: 116800, investedKRW: 116250, gainPercent: 0.47 },
  { ticker: 'TIGER_SP', name: 'TIGER 미국S&P500', currentKRW: 175735, investedKRW: 174090, gainPercent: 0.94 },
  { ticker: 'KODEX200', name: 'KODEX 200', currentKRW: 1152515, investedKRW: 1131700, gainPercent: 1.84 },
  { ticker: 'KODEX150_P', name: 'KODEX 코스닥150 (연금)', currentKRW: 315775, investedKRW: 344775, gainPercent: -8.41 },
  { ticker: 'KODEX_NAS', name: 'KODEX 미국나스닥100', currentKRW: 98720, investedKRW: 92160, gainPercent: 7.12 },
  { ticker: 'KODEX150_I', name: 'KODEX 코스닥150 (ISA)', currentKRW: 92875, investedKRW: 101075, gainPercent: -8.11 },
  { ticker: 'TIGER_BOND', name: 'TIGER 미국채10년선물', currentKRW: 201450, investedKRW: 198375, gainPercent: 1.55 },
  { ticker: 'TIGER_SP_I', name: 'TIGER 미국S&P500 (ISA)', currentKRW: 200840, investedKRW: 196840, gainPercent: 2.03 },
  // 미래에셋 예수금
  { ticker: 'CASH', name: '예수금 (원화)', currentKRW: 263921, investedKRW: 263921, gainPercent: 0.00 },
  // 업비트
  { ticker: 'BTC', name: '비트코인', currentKRW: 176419, investedKRW: 167063, gainPercent: 5.56 },
]

// ========== 가윤 달리오 실제 데이터 ==========
const GAYOON_HOLDINGS = [
  { ticker: 'VOO', name: 'Vanguard S&P500 ETF', currentKRW: 19317195, investedKRW: 18034965, gainPercent: 7.11 },
  { ticker: 'VOO_P', name: 'VOO (소수점)', currentKRW: 647620, investedKRW: 676691, gainPercent: -4.30 },
  { ticker: 'SCHD', name: 'Schwab 배당주 ETF', currentKRW: 4584872, investedKRW: 4047160, gainPercent: 13.29 },
  { ticker: 'KBANK', name: '케이뱅크', currentKRW: 62700, investedKRW: 83000, gainPercent: -24.46 },
  { ticker: 'KODEX200_ISA', name: 'KODEX 200 (ISA)', currentKRW: 5117175, investedKRW: 5223390, gainPercent: -2.03 },
  { ticker: 'TIGER_NAS', name: 'TIGER 미국나스닥100', currentKRW: 2857680, investedKRW: 2891400, gainPercent: -1.17 },
  { ticker: 'PLUS_EM', name: 'PLUS 신흥국MSCI', currentKRW: 2695055, investedKRW: 2997060, gainPercent: -10.08 },
  { ticker: 'TIGER_BD', name: 'TIGER 미국채10년선물', currentKRW: 2069325, investedKRW: 2003535, gainPercent: 3.28 },
  { ticker: 'TIGER_SP_ISA', name: 'TIGER 미국S&P500 (ISA)', currentKRW: 4835160, investedKRW: 4888810, gainPercent: -1.10 },
  { ticker: 'KODEX_G', name: 'KODEX 금액티브', currentKRW: 1806720, investedKRW: 1984640, gainPercent: -8.96 },
  { ticker: 'ISA_CASH', name: 'ISA 예수금', currentKRW: 10332, investedKRW: 10332, gainPercent: 0.00 },
  { ticker: 'AMZN', name: '아마존 (한투)', currentKRW: 2702213, investedKRW: 2941594, gainPercent: -8.13 },
  { ticker: 'KODEX200_P', name: 'KODEX 200 (연금)', currentKRW: 4467375, investedKRW: 4912225, gainPercent: -9.06 },
  { ticker: 'KODEX150_P', name: 'KODEX 코스닥150 (연금)', currentKRW: 1070820, investedKRW: 1084800, gainPercent: -1.29 },
  { ticker: 'CMA', name: '발행어음CMA', currentKRW: 14030691, investedKRW: 14015160, gainPercent: 0.11 },
  { ticker: 'TDF2025', name: 'TDF2025 (IRP)', currentKRW: 265937, investedKRW: 267479, gainPercent: -0.58 },
  { ticker: 'IRP_CASH', name: 'IRP 현금성자산', currentKRW: 89, investedKRW: 89, gainPercent: 0.00 },
  { ticker: 'BTC', name: '비트코인', currentKRW: 1091846, investedKRW: 1098351, gainPercent: -0.59 },
]

// 월별 누적 데이터 기록
// totalValue: 해당 월말 총 평가금액
// deposits: 해당 월 추가 입금액
// withdrawals: 해당 월 출금액
const MONTHLY_RECORDS = {
  '2026-02': {
    haneul: { totalValue: 4997665, deposits: 0, withdrawals: 0 },
    gayoon: { totalValue: 67150260, deposits: 0, withdrawals: 0 },
  },
  '2026-03': {
    haneul: { totalValue: 4808828, deposits: 0, withdrawals: 0 },
    gayoon: { totalValue: 67622384, deposits: 0, withdrawals: 0 },
  },
  '2026-04': {
    haneul: { totalValue: 4854776, deposits: 0, withdrawals: 0 },
    // 가윤 데이터는 캡처 받으면 추가
    gayoon: { totalValue: 67622384, deposits: 0, withdrawals: 0 }, // 임시: 3월 데이터 유지
  },
}

const calculatePortfolioStats = (holdings) => {
  const totalCurrent = holdings.reduce((sum, h) => sum + h.currentKRW, 0)
  const totalInvested = holdings.reduce((sum, h) => sum + h.investedKRW, 0)
  const totalGain = totalCurrent - totalInvested
  const returnPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0
  return { totalCurrent, totalInvested, totalGain, returnPercent }
}

// 공정한 수익률 계산 (대결 시작 시점 원금 기준)
const calculateFairReturn = (holdings, startData) => {
  const totalCurrent = holdings.reduce((sum, h) => sum + h.currentKRW, 0)
  const realizedGains = startData.realizedGains || 0

  // 공식: (현재 총 자산 + 실현수익 - 최초 원금) / 최초 원금 × 100
  const totalGain = totalCurrent - startData.initialCapital + realizedGains
  const fairReturnPercent = (totalGain / startData.initialCapital) * 100

  return {
    totalCurrent,
    initialCapital: startData.initialCapital,
    realizedGains,
    totalGain,
    fairReturnPercent,
  }
}

export default function PortfolioBattlePage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const [showFairness, setShowFairness] = useState(false)

  const haugaStats = calculatePortfolioStats(HAUGA_HOLDINGS)
  const gayoonStats = calculatePortfolioStats(GAYOON_HOLDINGS)

  // 공정한 수익률 계산 (대결 시작 원금 기준)
  const haneulFair = calculateFairReturn(HAUGA_HOLDINGS, BATTLE_START_DATA.haneul)
  const gayoonFair = calculateFairReturn(GAYOON_HOLDINGS, BATTLE_START_DATA.gayoon)

  // 대결은 공정한 수익률로 비교
  const haneulReturn = haneulFair.fairReturnPercent
  const gayoonReturn = gayoonFair.fairReturnPercent

  const winner = haneulReturn > gayoonReturn ? 'haneul' : gayoonReturn > haneulReturn ? 'gayoon' : 'tie'
  const gap = Math.abs(haneulReturn - gayoonReturn)

  // D-day
  const today = new Date()
  const endDate = new Date(BATTLE_INFO.endDate)
  const dDay = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))
  const startDate = new Date(BATTLE_INFO.startDate)
  const progressPercent = Math.min(Math.max(((today - startDate) / (endDate - startDate)) * 100, 0), 100)

  // 통계
  const calculateStats = (holdings) => {
    const gains = holdings.map(h => h.gainPercent)
    return {
      avg: gains.reduce((a, b) => a + b, 0) / gains.length,
      max: Math.max(...gains),
      min: Math.min(...gains),
      count: holdings.length
    }
  }
  const haugaAnalytics = calculateStats(HAUGA_HOLDINGS)
  const gayoonAnalytics = calculateStats(GAYOON_HOLDINGS)

  // 월별 승리 (누적 수익률 기준)
  const getMonthlyReturn = (person, monthKey) => {
    const data = MONTHLY_RECORDS[monthKey]
    if (!data || !data[person]) return null
    const startData = BATTLE_START_DATA[person]
    const cumDeposits = Object.entries(MONTHLY_RECORDS)
      .filter(([k]) => k <= monthKey)
      .reduce((sum, [, d]) => sum + (d[person]?.deposits || 0) - (d[person]?.withdrawals || 0), 0)
    const adjustedBase = startData.initialCapital + cumDeposits
    return ((data[person].totalValue - adjustedBase) / adjustedBase) * 100
  }

  const monthKeys = Object.keys(MONTHLY_RECORDS).filter(k => k !== '2026-02') // 시작월 제외
  const haneulWins = monthKeys.filter(k => {
    const h = getMonthlyReturn('haneul', k)
    const g = getMonthlyReturn('gayoon', k)
    return h !== null && g !== null && h > g
  }).length
  const gayoonWins = monthKeys.filter(k => {
    const h = getMonthlyReturn('haneul', k)
    const g = getMonthlyReturn('gayoon', k)
    return h !== null && g !== null && g > h
  }).length

  // 공통 종목
  const compareHoldings = () => {
    const normalize = (ticker) => ticker.replace(/_[A-Z]+$/, '').replace('_M', '')
    const hMap = {}, gMap = {}
    HAUGA_HOLDINGS.forEach(h => {
      const k = normalize(h.ticker)
      hMap[k] = hMap[k] ? { ...hMap[k], totalKRW: hMap[k].totalKRW + h.currentKRW } : { ...h, totalKRW: h.currentKRW }
    })
    GAYOON_HOLDINGS.forEach(h => {
      const k = normalize(h.ticker)
      gMap[k] = gMap[k] ? { ...gMap[k], totalKRW: gMap[k].totalKRW + h.currentKRW } : { ...h, totalKRW: h.currentKRW }
    })
    const result = []
    Object.keys(hMap).forEach(k => {
      if (gMap[k] && !['CMA', 'USD', 'IRP', 'ISA_CASH', 'IRP_CASH'].includes(k)) {
        result.push({
          name: hMap[k].name.replace(/\s*\([^)]*\)/g, ''),
          haneul: { amount: hMap[k].totalKRW, gain: hMap[k].gainPercent },
          gayoon: { amount: gMap[k].totalKRW, gain: gMap[k].gainPercent },
        })
      }
    })
    return result.sort((a, b) => (b.haneul.amount + b.gayoon.amount) - (a.haneul.amount + a.gayoon.amount))
  }
  const holdingsComparison = compareHoldings()

  return (
    <div style={{ maxWidth: '100%' }}>
      {/* 헤더 - 심플 */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: isMobile ? '22px' : '26px',
          fontWeight: '700',
          color: '#191F28',
          margin: 0,
        }}>
          수익률 대결
        </h1>
        <p style={{ fontSize: '14px', color: '#8B95A1', marginTop: '4px' }}>
          {BATTLE_INFO.lastUpdate} 기준
        </p>
      </div>

      {/* 메인 대시보드 - 핵심 정보만 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '24px',
        padding: isMobile ? '24px' : '32px',
        marginBottom: '24px',
        color: 'white',
      }}>
        {/* 현재 선두 */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '4px' }}>현재 선두</div>
          <div style={{ fontSize: isMobile ? '32px' : '40px', fontWeight: '800' }}>
            {winner === 'gayoon' ? '🐰 가윤' : winner === 'haneul' ? '☁️ 하늘' : '🤝 동점'}
          </div>
          {winner !== 'tie' && (
            <div style={{ fontSize: '16px', opacity: 0.9, marginTop: '4px' }}>
              +{gap.toFixed(2)}%p 리드
            </div>
          )}
        </div>

        {/* 수익률 비교 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '8px' }}>☁️ 하늘</div>
            <div style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: '800' }}>
              {haneulReturn >= 0 ? '+' : ''}{haneulReturn.toFixed(2)}%
            </div>
            <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
              {(haugaStats.totalCurrent / 10000).toFixed(0)}만원
            </div>
          </div>

          <div style={{
            width: '1px',
            height: '60px',
            backgroundColor: 'rgba(255,255,255,0.3)',
          }} />

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '8px' }}>🐰 가윤</div>
            <div style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: '800' }}>
              {gayoonReturn >= 0 ? '+' : ''}{gayoonReturn.toFixed(2)}%
            </div>
            <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
              {(gayoonStats.totalCurrent / 10000).toFixed(0)}만원
            </div>
          </div>
        </div>

        {/* D-Day */}
        <div style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.2)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}>
            <span style={{ fontSize: '13px', opacity: 0.8 }}>D-{dDay}</span>
            <span style={{ fontSize: '13px', opacity: 0.8 }}>{progressPercent.toFixed(0)}%</span>
          </div>
          <div style={{
            height: '6px',
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: 'white',
              borderRadius: '3px',
            }} />
          </div>
        </div>
      </div>

      {/* 공정성 설명 섹션 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => setShowFairness(!showFairness)}
        >
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#191F28' }}>
            수익률 계산 방식
          </div>
          <div style={{
            fontSize: '20px',
            color: '#8B95A1',
            transform: showFairness ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s',
          }}>
            ▼
          </div>
        </div>

        {showFairness && (
          <div style={{ marginTop: '16px' }}>
            {/* 왜 공정한가? 설명 */}
            <div style={{
              backgroundColor: '#E8F3FF',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#3182F6', marginBottom: '8px' }}>
                왜 이 방식이 공정한가요?
              </div>
              <div style={{ fontSize: '13px', color: '#4E5968', lineHeight: '1.6' }}>
                증권사를 옮기면 이전 수익이 "새 원금"으로 바뀌어 수익률이 0%로 리셋됩니다.
                예를 들어 한투에서 +150만원 수익을 내고 미래에셋으로 옮기면,
                미래에셋에서는 그 150만원이 "원금"으로 잡혀서 수익이 사라진 것처럼 보이죠.
                <br /><br />
                <strong>그래서 우리는 "대결 시작일 기준 진짜 원금"으로 계산합니다.</strong>
                <br />
                이렇게 하면 증권사를 몇 번 옮기든, 실현 수익이든 미실현 수익이든 모두 공평하게 반영됩니다.
              </div>
            </div>

            {/* 계산 공식 */}
            <div style={{
              backgroundColor: '#F7F8FA',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
            }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#191F28', marginBottom: '12px' }}>
                계산 공식
              </div>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '13px',
                color: '#4E5968',
                backgroundColor: 'white',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #E5E8EB',
              }}>
                수익률 = (현재 총 자산 - 대결 시작 원금) ÷ 대결 시작 원금 × 100
              </div>
            </div>

            {/* 하늘 계산 상세 */}
            <div style={{
              border: '1px solid #E5E8EB',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px',
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#191F28', marginBottom: '12px' }}>
                ☁️ 하늘 수익률 계산
              </div>
              <table style={{ width: '100%', fontSize: '13px', color: '#4E5968' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px 0' }}>대결 시작 원금 (02.22)</td>
                    <td style={{ textAlign: 'right', fontWeight: '600' }}>
                      {(BATTLE_START_DATA.haneul.initialCapital / 10000).toLocaleString()}만원
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0' }}>현재 총 자산</td>
                    <td style={{ textAlign: 'right', fontWeight: '600' }}>
                      {(haneulFair.totalCurrent / 10000).toFixed(1)}만원
                    </td>
                  </tr>
                  <tr style={{ borderTop: '1px solid #E5E8EB' }}>
                    <td style={{ padding: '10px 0 6px', fontWeight: '600', color: '#191F28' }}>총 손익</td>
                    <td style={{
                      textAlign: 'right',
                      fontWeight: '700',
                      color: haneulFair.totalGain >= 0 ? '#00C853' : '#F04438'
                    }}>
                      {haneulFair.totalGain >= 0 ? '+' : ''}{(haneulFair.totalGain / 10000).toFixed(1)}만원
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0', fontWeight: '600', color: '#191F28' }}>수익률</td>
                    <td style={{
                      textAlign: 'right',
                      fontWeight: '700',
                      fontSize: '16px',
                      color: haneulReturn >= 0 ? '#00C853' : '#F04438'
                    }}>
                      {haneulReturn >= 0 ? '+' : ''}{haneulReturn.toFixed(2)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 가윤 계산 상세 */}
            <div style={{
              border: '1px solid #E5E8EB',
              borderRadius: '12px',
              padding: '16px',
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#191F28', marginBottom: '12px' }}>
                🐰 가윤 수익률 계산
              </div>
              <table style={{ width: '100%', fontSize: '13px', color: '#4E5968' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px 0' }}>대결 시작 원금 (02.22)</td>
                    <td style={{ textAlign: 'right', fontWeight: '600' }}>
                      {(BATTLE_START_DATA.gayoon.initialCapital / 10000).toLocaleString()}만원
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0' }}>현재 총 자산</td>
                    <td style={{ textAlign: 'right', fontWeight: '600' }}>
                      {(gayoonFair.totalCurrent / 10000).toFixed(1)}만원
                    </td>
                  </tr>
                  {gayoonFair.realizedGains > 0 && (
                    <tr>
                      <td style={{ padding: '6px 0', color: '#8B95A1' }}>
                        (포함: 실현수익)
                      </td>
                      <td style={{ textAlign: 'right', color: '#00C853', fontWeight: '500' }}>
                        +{(gayoonFair.realizedGains / 10000).toFixed(1)}만원
                      </td>
                    </tr>
                  )}
                  <tr style={{ borderTop: '1px solid #E5E8EB' }}>
                    <td style={{ padding: '10px 0 6px', fontWeight: '600', color: '#191F28' }}>총 손익</td>
                    <td style={{
                      textAlign: 'right',
                      fontWeight: '700',
                      color: gayoonFair.totalGain >= 0 ? '#00C853' : '#F04438'
                    }}>
                      {gayoonFair.totalGain >= 0 ? '+' : ''}{(gayoonFair.totalGain / 10000).toFixed(1)}만원
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0', fontWeight: '600', color: '#191F28' }}>수익률</td>
                    <td style={{
                      textAlign: 'right',
                      fontWeight: '700',
                      fontSize: '16px',
                      color: gayoonReturn >= 0 ? '#00C853' : '#F04438'
                    }}>
                      {gayoonReturn >= 0 ? '+' : ''}{gayoonReturn.toFixed(2)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        )}
      </div>

      {/* 데이터 입력 가이드 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#191F28',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span>📋</span> 매월 업데이트 가이드
        </div>

        {/* 필요한 스크린샷 */}
        <div style={{
          backgroundColor: '#F0F9FF',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#0369A1', marginBottom: '12px' }}>
            1. 필요한 스크린샷
          </div>
          <div style={{ fontSize: '13px', color: '#4E5968', lineHeight: '1.8' }}>
            <div style={{ marginBottom: '12px' }}>
              <strong>☁️ 하늘</strong>
              <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                <li>토스증권 → 해외주식 탭 (총 평가금액)</li>
                <li>미래에셋 → 연금저축/ISA/종합/IRP/CMA 각각</li>
                <li>업비트 → 보유자산 (비트코인)</li>
              </ul>
            </div>
            <div>
              <strong>🐰 가윤</strong>
              <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px' }}>
                <li>삼성증권 → 해외주식/ISA 탭 (총 평가금액)</li>
                <li>미래에셋 → 연금저축/CMA/IRP 각각</li>
                <li>한투 → 해외주식 (아마존)</li>
                <li>업비트 → 보유자산 (비트코인)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 필요한 숫자 */}
        <div style={{
          backgroundColor: '#F0FDF4',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#15803D', marginBottom: '12px' }}>
            2. 캡처에서 확인할 숫자
          </div>
          <div style={{ fontSize: '13px', color: '#4E5968', lineHeight: '1.8' }}>
            각 증권사/계좌별로 다음 정보가 필요합니다:
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              marginTop: '8px',
            }}>
              <div style={{
                backgroundColor: 'white',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #E5E8EB',
              }}>
                <div style={{ fontSize: '12px', color: '#8B95A1' }}>필수</div>
                <div style={{ fontWeight: '600' }}>총 평가금액</div>
              </div>
              <div style={{
                backgroundColor: 'white',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #E5E8EB',
              }}>
                <div style={{ fontSize: '12px', color: '#8B95A1' }}>추가입금 있을 때만</div>
                <div style={{ fontWeight: '600' }}>이번 달 입금액</div>
              </div>
            </div>
          </div>
        </div>

        {/* 수익률 계산 공식 */}
        <div style={{
          backgroundColor: '#FEF3C7',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#92400E', marginBottom: '12px' }}>
            3. 수익률 계산 방법
          </div>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#4E5968',
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '8px',
            lineHeight: '1.6',
          }}>
            조정원금 = 시작평가 + 누적입금 - 누적출금<br/>
            <strong>수익률 = (현재평가 - 조정원금) ÷ 조정원금 × 100</strong>
          </div>
          <div style={{ fontSize: '12px', color: '#92400E', marginTop: '8px' }}>
            ※ 추가 입금을 빼서 계산하므로, 돈을 많이 넣는다고 유리하지 않습니다
          </div>
        </div>

        {/* 예시 */}
        <div style={{
          backgroundColor: '#F5F3FF',
          borderRadius: '12px',
          padding: '16px',
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#6D28D9', marginBottom: '12px' }}>
            4. 예시
          </div>
          <div style={{ fontSize: '13px', color: '#4E5968', lineHeight: '1.6' }}>
            <div style={{ marginBottom: '8px' }}>
              • 2월 시작: 6,000만원<br/>
              • 3월 추가입금: 200만원<br/>
              • 4월 현재 평가: 6,500만원
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #E5E8EB',
            }}>
              조정원금 = 6,000 + 200 = 6,200만원<br/>
              수익률 = (6,500 - 6,200) ÷ 6,200 × 100 = <strong style={{ color: '#00C853' }}>+4.84%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 현재 기록된 데이터 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#191F28',
          marginBottom: '16px',
        }}>
          📊 현재 기록된 데이터
        </div>

        <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #E5E8EB' }}>
              <th style={{ padding: '10px 8px', textAlign: 'left', color: '#8B95A1', fontWeight: '500' }}>항목</th>
              <th style={{ padding: '10px 8px', textAlign: 'right', color: '#8B95A1', fontWeight: '500' }}>☁️ 하늘</th>
              <th style={{ padding: '10px 8px', textAlign: 'right', color: '#8B95A1', fontWeight: '500' }}>🐰 가윤</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #F2F4F6' }}>
              <td style={{ padding: '12px 8px', color: '#4E5968' }}>시작 평가 (02.22)</td>
              <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>
                {(BATTLE_START_DATA.haneul.initialCapital / 10000).toFixed(1)}만원
              </td>
              <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>
                {(BATTLE_START_DATA.gayoon.initialCapital / 10000).toFixed(1)}만원
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #F2F4F6' }}>
              <td style={{ padding: '12px 8px', color: '#4E5968' }}>누적 추가입금</td>
              <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>0만원</td>
              <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>0만원</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #F2F4F6' }}>
              <td style={{ padding: '12px 8px', color: '#4E5968' }}>현재 총 평가</td>
              <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>
                {(haneulFair.totalCurrent / 10000).toFixed(1)}만원
              </td>
              <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>
                {(gayoonFair.totalCurrent / 10000).toFixed(1)}만원
              </td>
            </tr>
            <tr style={{ backgroundColor: '#F7F8FA' }}>
              <td style={{ padding: '12px 8px', fontWeight: '600', color: '#191F28' }}>수익률</td>
              <td style={{
                padding: '12px 8px',
                textAlign: 'right',
                fontWeight: '700',
                color: haneulReturn >= 0 ? '#00C853' : '#F04438'
              }}>
                {haneulReturn >= 0 ? '+' : ''}{haneulReturn.toFixed(2)}%
              </td>
              <td style={{
                padding: '12px 8px',
                textAlign: 'right',
                fontWeight: '700',
                color: gayoonReturn >= 0 ? '#00C853' : '#F04438'
              }}>
                {gayoonReturn >= 0 ? '+' : ''}{gayoonReturn.toFixed(2)}%
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#FEF2F2',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#991B1B',
          lineHeight: '1.5',
        }}>
          <strong>⚠️ 확인 필요:</strong> 위 "시작 평가 (02.22)" 값이 대결 시작일 기준 실제 총 평가금액과 일치하는지 확인해주세요.
          다르다면 정확한 값을 알려주세요.
        </div>
      </div>

      {/* 월간 승리 현황 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#191F28',
          marginBottom: '16px',
        }}>
          월간 스코어
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '24px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#3182F6' }}>{haneulWins}</div>
            <div style={{ fontSize: '13px', color: '#8B95A1' }}>☁️ 하늘</div>
          </div>
          <div style={{ fontSize: '20px', color: '#E5E8EB' }}>:</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#00C853' }}>{gayoonWins}</div>
            <div style={{ fontSize: '13px', color: '#8B95A1' }}>🐰 가윤</div>
          </div>
        </div>
      </div>

      {/* 통계 그리드 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginBottom: '16px',
      }}>
        {[
          { label: '종목 수', h: haugaAnalytics.count, g: gayoonAnalytics.count, unit: '개' },
          { label: '평균', h: haugaAnalytics.avg, g: gayoonAnalytics.avg, unit: '%', format: true },
          { label: '최고', h: haugaAnalytics.max, g: gayoonAnalytics.max, unit: '%', format: true, green: true },
          { label: '최저', h: haugaAnalytics.min, g: gayoonAnalytics.min, unit: '%', format: true, red: true },
        ].map((item, i) => (
          <div key={i} style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <div style={{ fontSize: '12px', color: '#8B95A1', marginBottom: '12px' }}>{item.label}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#8B95A1', marginBottom: '2px' }}>하늘</div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: item.green ? '#00C853' : item.red ? '#F04438' : item.format ? (item.h >= 0 ? '#00C853' : '#F04438') : '#191F28'
                }}>
                  {item.format ? `${item.h >= 0 ? '+' : ''}${item.h.toFixed(1)}` : item.h}{item.unit}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: '#8B95A1', marginBottom: '2px' }}>가윤</div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: item.green ? '#00C853' : item.red ? '#F04438' : item.format ? (item.g >= 0 ? '#00C853' : '#F04438') : '#191F28'
                }}>
                  {item.format ? `${item.g >= 0 ? '+' : ''}${item.g.toFixed(1)}` : item.g}{item.unit}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 공통 종목 비교 */}
      {holdingsComparison.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <div style={{
            fontSize: '15px',
            fontWeight: '600',
            color: '#191F28',
            marginBottom: '16px',
          }}>
            공통 종목
          </div>
          {holdingsComparison.map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: idx < holdingsComparison.length - 1 ? '1px solid #F2F4F6' : 'none',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#191F28' }}>{item.name}</div>
              </div>
              <div style={{ textAlign: 'right', marginRight: '16px' }}>
                <div style={{ fontSize: '13px', color: '#8B95A1' }}>하늘</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: item.haneul.gain >= 0 ? '#00C853' : '#F04438' }}>
                  {item.haneul.gain >= 0 ? '+' : ''}{item.haneul.gain.toFixed(1)}%
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', color: '#8B95A1' }}>가윤</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: item.gayoon.gain >= 0 ? '#00C853' : '#F04438' }}>
                  {item.gayoon.gain >= 0 ? '+' : ''}{item.gayoon.gain.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 월별 누적 기록 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          fontSize: '15px',
          fontWeight: '600',
          color: '#191F28',
          marginBottom: '16px',
        }}>
          월별 누적 기록
        </div>

        {/* 테이블 헤더 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '50px 1fr 1fr 1fr 1fr 50px',
          gap: '4px',
          padding: '8px 0',
          borderBottom: '2px solid #E5E8EB',
          fontSize: '11px',
          color: '#8B95A1',
          fontWeight: '500',
        }}>
          <div>월</div>
          <div style={{ textAlign: 'right' }}>하늘 평가</div>
          <div style={{ textAlign: 'right' }}>하늘 수익률</div>
          <div style={{ textAlign: 'right' }}>가윤 평가</div>
          <div style={{ textAlign: 'right' }}>가윤 수익률</div>
          <div style={{ textAlign: 'center' }}>승자</div>
        </div>

        {['02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m) => {
          const key = `2026-${m}`
          const data = MONTHLY_RECORDS[key]
          const monthName = parseInt(m) + '월'

          // 수익률 계산 (시작 대비)
          const calcReturn = (person, personData) => {
            if (!personData) return null
            const startData = BATTLE_START_DATA[person]
            const cumDeposits = Object.entries(MONTHLY_RECORDS)
              .filter(([k]) => k <= key)
              .reduce((sum, [, d]) => sum + (d[person]?.deposits || 0) - (d[person]?.withdrawals || 0), 0)
            const adjustedBase = startData.initialCapital + cumDeposits
            return ((personData.totalValue - adjustedBase) / adjustedBase) * 100
          }

          const hReturn = data ? calcReturn('haneul', data.haneul) : null
          const gReturn = data ? calcReturn('gayoon', data.gayoon) : null

          return (
            <div key={key} style={{
              display: 'grid',
              gridTemplateColumns: '50px 1fr 1fr 1fr 1fr 50px',
              gap: '4px',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: m !== '12' ? '1px solid #F2F4F6' : 'none',
              opacity: data ? 1 : 0.4,
              fontSize: '13px',
            }}>
              <div style={{ fontWeight: '500', color: '#191F28' }}>
                {monthName}
              </div>
              <div style={{ textAlign: 'right', color: '#4E5968' }}>
                {data ? `${(data.haneul.totalValue / 10000).toFixed(0)}만` : '-'}
              </div>
              <div style={{
                textAlign: 'right',
                fontWeight: '600',
                color: hReturn !== null ? (hReturn >= 0 ? '#00C853' : '#F04438') : '#CED4DA'
              }}>
                {hReturn !== null ? `${hReturn >= 0 ? '+' : ''}${hReturn.toFixed(1)}%` : '-'}
              </div>
              <div style={{ textAlign: 'right', color: '#4E5968' }}>
                {data ? `${(data.gayoon.totalValue / 10000).toFixed(0)}만` : '-'}
              </div>
              <div style={{
                textAlign: 'right',
                fontWeight: '600',
                color: gReturn !== null ? (gReturn >= 0 ? '#00C853' : '#F04438') : '#CED4DA'
              }}>
                {gReturn !== null ? `${gReturn >= 0 ? '+' : ''}${gReturn.toFixed(1)}%` : '-'}
              </div>
              <div style={{ textAlign: 'center' }}>
                {hReturn !== null && gReturn !== null ? (
                  hReturn > gReturn ? '☁️' : gReturn > hReturn ? '🐰' : '🤝'
                ) : '-'}
              </div>
            </div>
          )
        })}
      </div>

      {/* 푸터 정보 */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#8B95A1',
      }}>
        2026.02.22 ~ 12.24 · 패자가 {BATTLE_INFO.prize} 사기
      </div>
    </div>
  )
}
