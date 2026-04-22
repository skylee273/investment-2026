import { useState, useEffect } from 'react'

// 포트폴리오 대결 2026
const BATTLE_INFO = {
  startDate: '2026-02-22',
  endDate: '2026-12-24',
  prize: '치킨',
  lastUpdate: '2026.03.29',
}

// ========== 하우가 패밀리 (하늘) 실제 데이터 ==========
const HAUGA_HOLDINGS = [
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
  { ticker: 'BTC', name: '비트코인', currentKRW: 165490, investedKRW: 167040, gainPercent: -0.93 },
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

// 월별 수익률 기록
const MONTHLY_RECORDS = {
  '2026-02': { haneul: -2.1, gayoon: -1.8 },
  '2026-03': { haneul: -3.2, gayoon: 0.4 },
}

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

  const haugaStats = calculatePortfolioStats(HAUGA_HOLDINGS)
  const gayoonStats = calculatePortfolioStats(GAYOON_HOLDINGS)
  const haneulReturn = haugaStats.returnPercent
  const gayoonReturn = gayoonStats.returnPercent

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

  // 월별 승리
  const haneulWins = Object.values(MONTHLY_RECORDS).filter(d => d.haneul > d.gayoon).length
  const gayoonWins = Object.values(MONTHLY_RECORDS).filter(d => d.gayoon > d.haneul).length

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

      {/* 월별 기록 */}
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
          월별 기록
        </div>
        {['02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m) => {
          const key = `2026-${m}`
          const data = MONTHLY_RECORDS[key]
          const monthName = parseInt(m) + '월'

          return (
            <div key={key} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: m !== '12' ? '1px solid #F2F4F6' : 'none',
              opacity: data ? 1 : 0.4,
            }}>
              <div style={{ width: '40px', fontSize: '14px', fontWeight: '500', color: '#191F28' }}>
                {monthName}
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                {data ? (
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: data.haneul >= 0 ? '#00C853' : '#F04438'
                  }}>
                    {data.haneul >= 0 ? '+' : ''}{data.haneul.toFixed(1)}%
                  </span>
                ) : <span style={{ color: '#CED4DA' }}>-</span>}
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                {data ? (
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: data.gayoon >= 0 ? '#00C853' : '#F04438'
                  }}>
                    {data.gayoon >= 0 ? '+' : ''}{data.gayoon.toFixed(1)}%
                  </span>
                ) : <span style={{ color: '#CED4DA' }}>-</span>}
              </div>
              <div style={{ width: '60px', textAlign: 'right' }}>
                {data ? (
                  data.haneul > data.gayoon ? (
                    <span style={{ fontSize: '12px', color: '#3182F6', fontWeight: '600' }}>☁️</span>
                  ) : data.gayoon > data.haneul ? (
                    <span style={{ fontSize: '12px', color: '#00C853', fontWeight: '600' }}>🐰</span>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#8B95A1' }}>-</span>
                  )
                ) : <span style={{ color: '#CED4DA' }}>-</span>}
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
