import { useState, useEffect } from 'react'

// 포트폴리오 대결 2026
const BATTLE_INFO = {
  startDate: '2026-01-01',
  endDate: '2026-12-24',
  prize: '치킨',
  lastUpdate: '2026.04.22',
}

// ========== 2026년 투자수익 대결 ==========
// 규칙: 2026년 1월 1일부터의 "투자수익"으로 비교 (미실현 포함)
// - 투자수익 = 현재 평가금액 - 투자원금
// - 원금 크기와 무관하게 순수하게 "얼마를 벌었냐"로 비교
// - 매월 업데이트
const INVESTMENT_GAINS_2026 = {
  haneul: {
    // 2026.04.22 기준
    totalGain: 305739,
    totalInvested: 2218765 + 150000,  // 미래에셋 + 업비트
    returnPercent: 12.91,  // 종합 수익률
    breakdown: [
      { account: '미래에셋 (IRP/연금/ISA)', gain: 276902, invested: 2218765, returnPercent: 12.48 },
      { account: '업비트 (비트코인)', gain: 28837, invested: 150000, returnPercent: 19.22 },
    ],
    description: '미래에셋/업비트',
  },
  gayoon: {
    // 2026.04.22 기준
    totalGain: 5694523,
    totalInvested: 67161241,  // 총 투자원금
    returnPercent: 8.48,  // 종합 수익률
    breakdown: [
      { account: '미래에셋', gain: 910713, invested: 7194764, returnPercent: 12.66 },
      { account: '삼성증권', gain: 4266429, invested: 49922697, returnPercent: 8.55 },
      { account: '한국투자', gain: 271395, invested: 2941594, returnPercent: 9.23 },
      { account: '업비트 (비트코인)', gain: 245986, invested: 1098351, returnPercent: 22.40 },
    ],
    description: '삼성/미래에셋/한투/업비트',
  },
}

// ========== 하우가 패밀리 (하늘) 실제 데이터 (2026.04.22) ==========
// 토스증권 제외, 미래에셋 + 업비트만 포함
const HAUGA_HOLDINGS = [
  // 미래에셋 상품별 자산
  { ticker: 'STOCK', name: '주식 (미래에셋)', currentKRW: 3835525, investedKRW: 3688816, gainPercent: 3.98 },
  { ticker: 'CMA', name: '발행어음 (CMA)', currentKRW: 863681, investedKRW: 863445, gainPercent: 0.03 },
  { ticker: 'IRP', name: '퇴직연금 (IRP)', currentKRW: 263861, investedKRW: 250000, gainPercent: 5.54 },
  { ticker: 'FX', name: '외화 예수금', currentKRW: 12953, investedKRW: 12953, gainPercent: 0.00 },
  { ticker: 'CASH', name: 'D+2 원화예수금', currentKRW: 5209, investedKRW: 0, gainPercent: 0.00 },
  // 업비트
  { ticker: 'BTC', name: '비트코인', currentKRW: 178837, investedKRW: 150000, gainPercent: 19.22 },
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

// 월별 투자수익 기록 (2026년 기준)
// 해당 월까지 누적 투자수익 (미실현 포함)
const MONTHLY_GAINS = {
  '2026-01': { haneul: null, gayoon: null },
  '2026-02': { haneul: null, gayoon: null },
  '2026-03': { haneul: null, gayoon: null },
  '2026-04': { haneul: 305739, gayoon: 5694523 },  // 4월 업데이트
  '2026-05': { haneul: null, gayoon: null },
  '2026-06': { haneul: null, gayoon: null },
  '2026-07': { haneul: null, gayoon: null },
  '2026-08': { haneul: null, gayoon: null },
  '2026-09': { haneul: null, gayoon: null },
  '2026-10': { haneul: null, gayoon: null },
  '2026-11': { haneul: null, gayoon: null },
  '2026-12': { haneul: null, gayoon: null },
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

  const [showFairness, setShowFairness] = useState(false)

  const haugaStats = calculatePortfolioStats(HAUGA_HOLDINGS)
  const gayoonStats = calculatePortfolioStats(GAYOON_HOLDINGS)

  // 2026년 투자수익으로 비교 (미실현 포함)
  const haneulGain = INVESTMENT_GAINS_2026.haneul.totalGain
  const gayoonGain = INVESTMENT_GAINS_2026.gayoon.totalGain

  const winner = haneulGain > gayoonGain ? 'haneul' : gayoonGain > haneulGain ? 'gayoon' : 'tie'
  const gap = Math.abs(haneulGain - gayoonGain)

  // D-day
  const today = new Date()
  const endDate = new Date(BATTLE_INFO.endDate)
  const dDay = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))
  const startDate = new Date(BATTLE_INFO.startDate)
  const progressPercent = Math.min(Math.max(((today - startDate) / (endDate - startDate)) * 100, 0), 100)

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
              +{gap.toLocaleString()}원 리드
            </div>
          )}
        </div>

        {/* 투자수익 비교 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '8px' }}>☁️ 하늘</div>
            <div style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '800' }}>
              {haneulGain === 0 ? '대기중' : (haneulGain >= 0 ? '+' : '') + haneulGain.toLocaleString() + '원'}
            </div>
            <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>
              {INVESTMENT_GAINS_2026.haneul.description}
            </div>
          </div>

          <div style={{
            width: '1px',
            height: '60px',
            backgroundColor: 'rgba(255,255,255,0.3)',
          }} />

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '8px' }}>🐰 가윤</div>
            <div style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '800' }}>
              {gayoonGain >= 0 ? '+' : ''}{gayoonGain.toLocaleString()}원
            </div>
            <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>
              {INVESTMENT_GAINS_2026.gayoon.description}
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

      {/* 🔥 수익률 % 대결 - 불꽃 VS 그래프 🔥 */}
      <div style={{
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '24px',
        padding: isMobile ? '24px' : '32px',
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 배경 불꽃 효과 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(255,107,0,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(255,0,107,0.15) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />

        {/* 타이틀 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '24px',
          position: 'relative',
        }}>
          <div style={{
            fontSize: '12px',
            color: '#888',
            letterSpacing: '2px',
            marginBottom: '4px',
          }}>
            RETURN RATE BATTLE
          </div>
          <div style={{
            fontSize: isMobile ? '20px' : '24px',
            fontWeight: '800',
            background: 'linear-gradient(90deg, #ff6b00, #ff0080, #ff6b00)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shine 3s linear infinite',
          }}>
            수익률 % 대결
          </div>
          <style>{`
            @keyframes shine {
              to { background-position: 200% center; }
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            @keyframes fireGlow {
              0%, 100% { box-shadow: 0 0 20px rgba(255,107,0,0.5), 0 0 40px rgba(255,107,0,0.3); }
              50% { box-shadow: 0 0 30px rgba(255,107,0,0.7), 0 0 60px rgba(255,107,0,0.5); }
            }
            @keyframes fireGlowPink {
              0%, 100% { box-shadow: 0 0 20px rgba(255,0,107,0.5), 0 0 40px rgba(255,0,107,0.3); }
              50% { box-shadow: 0 0 30px rgba(255,0,107,0.7), 0 0 60px rgba(255,0,107,0.5); }
            }
          `}</style>
        </div>

        {/* VS 배틀 영역 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          position: 'relative',
        }}>
          {/* 하늘 */}
          <div style={{
            flex: 1,
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '8px',
            }}>☁️</div>
            <div style={{
              fontSize: '14px',
              color: '#aaa',
              marginBottom: '12px',
            }}>하늘</div>
            <div style={{
              fontSize: isMobile ? '36px' : '48px',
              fontWeight: '900',
              color: '#ff6b00',
              textShadow: '0 0 20px rgba(255,107,0,0.5)',
              animation: 'pulse 2s ease-in-out infinite',
            }}>
              {INVESTMENT_GAINS_2026.haneul.returnPercent.toFixed(2)}%
            </div>
            <div style={{
              marginTop: '16px',
              height: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${Math.min(INVESTMENT_GAINS_2026.haneul.returnPercent * 4, 100)}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #ff6b00, #ff9500)',
                borderRadius: '4px',
                animation: 'fireGlow 1.5s ease-in-out infinite',
              }} />
            </div>
          </div>

          {/* VS 뱃지 */}
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff6b00 0%, #ff0080 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            fontSize: '18px',
            color: 'white',
            boxShadow: '0 0 30px rgba(255,107,0,0.5), 0 0 60px rgba(255,0,107,0.3)',
            animation: 'pulse 1s ease-in-out infinite',
            flexShrink: 0,
          }}>
            VS
          </div>

          {/* 가윤 */}
          <div style={{
            flex: 1,
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '32px',
              marginBottom: '8px',
            }}>🐰</div>
            <div style={{
              fontSize: '14px',
              color: '#aaa',
              marginBottom: '12px',
            }}>가윤</div>
            <div style={{
              fontSize: isMobile ? '36px' : '48px',
              fontWeight: '900',
              color: '#ff0080',
              textShadow: '0 0 20px rgba(255,0,107,0.5)',
              animation: 'pulse 2s ease-in-out infinite',
            }}>
              {INVESTMENT_GAINS_2026.gayoon.returnPercent.toFixed(2)}%
            </div>
            <div style={{
              marginTop: '16px',
              height: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${Math.min(INVESTMENT_GAINS_2026.gayoon.returnPercent * 4, 100)}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #ff0080, #ff69b4)',
                borderRadius: '4px',
                animation: 'fireGlowPink 1.5s ease-in-out infinite',
              }} />
            </div>
          </div>
        </div>

        {/* 승자 표시 */}
        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          padding: '16px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          {INVESTMENT_GAINS_2026.haneul.returnPercent > INVESTMENT_GAINS_2026.gayoon.returnPercent ? (
            <>
              <div style={{ fontSize: '14px', color: '#888', marginBottom: '4px' }}>수익률 승자</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#ff6b00' }}>
                🏆 ☁️ 하늘 WIN! 🔥
              </div>
              <div style={{ fontSize: '13px', color: '#aaa', marginTop: '8px' }}>
                +{(INVESTMENT_GAINS_2026.haneul.returnPercent - INVESTMENT_GAINS_2026.gayoon.returnPercent).toFixed(2)}%p 차이
              </div>
            </>
          ) : INVESTMENT_GAINS_2026.gayoon.returnPercent > INVESTMENT_GAINS_2026.haneul.returnPercent ? (
            <>
              <div style={{ fontSize: '14px', color: '#888', marginBottom: '4px' }}>수익률 승자</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#ff0080' }}>
                🏆 🐰 가윤 WIN! 🔥
              </div>
              <div style={{ fontSize: '13px', color: '#aaa', marginTop: '8px' }}>
                +{(INVESTMENT_GAINS_2026.gayoon.returnPercent - INVESTMENT_GAINS_2026.haneul.returnPercent).toFixed(2)}%p 차이
              </div>
            </>
          ) : (
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff' }}>
              🤝 무승부!
            </div>
          )}
        </div>

        {/* 📊 상세 비교 테이블 */}
        <div style={{
          marginTop: '24px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#fff',
            marginBottom: '16px',
            textAlign: 'center',
          }}>
            📊 수익률 계산 상세 내역
          </div>

          {/* 계산 공식 */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>수익률 공식</div>
            <div style={{ fontSize: '14px', color: '#fff', fontFamily: 'monospace' }}>
              수익률(%) = (투자수익 ÷ 투자원금) × 100
            </div>
          </div>

          {/* 하늘 상세 */}
          <div style={{
            marginBottom: '20px',
            padding: '16px',
            background: 'rgba(255,107,0,0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(255,107,0,0.3)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#ff6b00' }}>
                ☁️ 하늘
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: '800',
                color: '#ff6b00',
              }}>
                {INVESTMENT_GAINS_2026.haneul.returnPercent.toFixed(2)}%
              </div>
            </div>

            {/* 계좌별 breakdown */}
            {INVESTMENT_GAINS_2026.haneul.breakdown.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 0',
                borderTop: idx > 0 ? '1px solid rgba(255,107,0,0.2)' : 'none',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', color: '#fff', marginBottom: '4px' }}>{item.account}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>
                    투자 {item.invested.toLocaleString()}원 → 수익 +{item.gain.toLocaleString()}원
                  </div>
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#ff6b00',
                  minWidth: '70px',
                  textAlign: 'right',
                }}>
                  {item.returnPercent.toFixed(2)}%
                </div>
              </div>
            ))}

            {/* 합계 */}
            <div style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '2px solid rgba(255,107,0,0.5)',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#888' }}>총 투자원금</div>
                <div style={{ fontSize: '15px', color: '#fff', fontWeight: '600' }}>
                  {INVESTMENT_GAINS_2026.haneul.totalInvested.toLocaleString()}원
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#888' }}>총 투자수익</div>
                <div style={{ fontSize: '15px', color: '#00ff88', fontWeight: '600' }}>
                  +{INVESTMENT_GAINS_2026.haneul.totalGain.toLocaleString()}원
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#888' }}>종합 수익률</div>
                <div style={{ fontSize: '15px', color: '#ff6b00', fontWeight: '700' }}>
                  {INVESTMENT_GAINS_2026.haneul.returnPercent.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          {/* 가윤 상세 */}
          <div style={{
            padding: '16px',
            background: 'rgba(255,0,107,0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(255,0,107,0.3)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#ff0080' }}>
                🐰 가윤
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: '800',
                color: '#ff0080',
              }}>
                {INVESTMENT_GAINS_2026.gayoon.returnPercent.toFixed(2)}%
              </div>
            </div>

            {/* 계좌별 breakdown */}
            {INVESTMENT_GAINS_2026.gayoon.breakdown.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 0',
                borderTop: idx > 0 ? '1px solid rgba(255,0,107,0.2)' : 'none',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', color: '#fff', marginBottom: '4px' }}>{item.account}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>
                    투자 {item.invested.toLocaleString()}원 → 수익 +{item.gain.toLocaleString()}원
                  </div>
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#ff0080',
                  minWidth: '70px',
                  textAlign: 'right',
                }}>
                  {item.returnPercent.toFixed(2)}%
                </div>
              </div>
            ))}

            {/* 합계 */}
            <div style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '2px solid rgba(255,0,107,0.5)',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#888' }}>총 투자원금</div>
                <div style={{ fontSize: '15px', color: '#fff', fontWeight: '600' }}>
                  {INVESTMENT_GAINS_2026.gayoon.totalInvested.toLocaleString()}원
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#888' }}>총 투자수익</div>
                <div style={{ fontSize: '15px', color: '#00ff88', fontWeight: '600' }}>
                  +{INVESTMENT_GAINS_2026.gayoon.totalGain.toLocaleString()}원
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#888' }}>종합 수익률</div>
                <div style={{ fontSize: '15px', color: '#ff0080', fontWeight: '700' }}>
                  {INVESTMENT_GAINS_2026.gayoon.returnPercent.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 📈 계좌별 수익률 비교 차트 */}
        <div style={{
          marginTop: '20px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#fff',
            marginBottom: '16px',
            textAlign: 'center',
          }}>
            📈 계좌별 수익률 비교
          </div>

          {/* 하늘 계좌별 바 */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', color: '#ff6b00', marginBottom: '8px', fontWeight: '600' }}>☁️ 하늘</div>
            {INVESTMENT_GAINS_2026.haneul.breakdown.map((item, idx) => (
              <div key={idx} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#aaa', marginBottom: '4px' }}>
                  <span>{item.account}</span>
                  <span style={{ color: '#ff6b00', fontWeight: '600' }}>{item.returnPercent.toFixed(2)}%</span>
                </div>
                <div style={{ height: '12px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(item.returnPercent * 3, 100)}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #ff6b00, #ff9500)',
                    borderRadius: '6px',
                    transition: 'width 1s ease-out',
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* 가윤 계좌별 바 */}
          <div>
            <div style={{ fontSize: '12px', color: '#ff0080', marginBottom: '8px', fontWeight: '600' }}>🐰 가윤</div>
            {INVESTMENT_GAINS_2026.gayoon.breakdown.map((item, idx) => (
              <div key={idx} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#aaa', marginBottom: '4px' }}>
                  <span>{item.account}</span>
                  <span style={{ color: '#ff0080', fontWeight: '600' }}>{item.returnPercent.toFixed(2)}%</span>
                </div>
                <div style={{ height: '12px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(item.returnPercent * 3, 100)}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #ff0080, #ff69b4)',
                    borderRadius: '6px',
                    transition: 'width 1s ease-out',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🎯 결론 */}
        <div style={{
          marginTop: '20px',
          background: 'linear-gradient(135deg, rgba(255,107,0,0.2) 0%, rgba(255,0,107,0.2) 100%)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(255,255,255,0.2)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>🎯 최종 판정</div>
          <div style={{ fontSize: '18px', color: '#fff', fontWeight: '700', marginBottom: '12px' }}>
            {INVESTMENT_GAINS_2026.haneul.returnPercent > INVESTMENT_GAINS_2026.gayoon.returnPercent ? (
              <>같은 돈을 투자했다면 <span style={{ color: '#ff6b00' }}>하늘</span>이 더 많이 벌었다!</>
            ) : (
              <>같은 돈을 투자했다면 <span style={{ color: '#ff0080' }}>가윤</span>이 더 많이 벌었다!</>
            )}
          </div>
          <div style={{ fontSize: '13px', color: '#aaa', lineHeight: '1.6' }}>
            {INVESTMENT_GAINS_2026.haneul.returnPercent > INVESTMENT_GAINS_2026.gayoon.returnPercent ? (
              <>
                하늘: {INVESTMENT_GAINS_2026.haneul.totalInvested.toLocaleString()}원 투자 → {INVESTMENT_GAINS_2026.haneul.returnPercent.toFixed(2)}% 수익<br />
                가윤: {INVESTMENT_GAINS_2026.gayoon.totalInvested.toLocaleString()}원 투자 → {INVESTMENT_GAINS_2026.gayoon.returnPercent.toFixed(2)}% 수익<br /><br />
                <span style={{ color: '#ff6b00' }}>
                  💡 만약 가윤이 하늘처럼 {INVESTMENT_GAINS_2026.haneul.totalInvested.toLocaleString()}원만 투자했다면?<br />
                  → 수익: {Math.round(INVESTMENT_GAINS_2026.haneul.totalInvested * INVESTMENT_GAINS_2026.gayoon.returnPercent / 100).toLocaleString()}원 (하늘보다 {Math.round(INVESTMENT_GAINS_2026.haneul.totalGain - INVESTMENT_GAINS_2026.haneul.totalInvested * INVESTMENT_GAINS_2026.gayoon.returnPercent / 100).toLocaleString()}원 적음)
                </span>
              </>
            ) : (
              <>
                가윤: {INVESTMENT_GAINS_2026.gayoon.totalInvested.toLocaleString()}원 투자 → {INVESTMENT_GAINS_2026.gayoon.returnPercent.toFixed(2)}% 수익<br />
                하늘: {INVESTMENT_GAINS_2026.haneul.totalInvested.toLocaleString()}원 투자 → {INVESTMENT_GAINS_2026.haneul.returnPercent.toFixed(2)}% 수익<br /><br />
                <span style={{ color: '#ff0080' }}>
                  💡 만약 하늘이 가윤처럼 {INVESTMENT_GAINS_2026.gayoon.totalInvested.toLocaleString()}원 투자했다면?<br />
                  → 수익: {Math.round(INVESTMENT_GAINS_2026.gayoon.totalInvested * INVESTMENT_GAINS_2026.haneul.returnPercent / 100).toLocaleString()}원
                </span>
              </>
            )}
          </div>
        </div>

        {/* ⚖️ 공정성 설명 */}
        <div style={{
          marginTop: '20px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>⚖️ 왜 수익률(%)로 비교하나요?</div>
          <div style={{ fontSize: '12px', color: '#aaa', lineHeight: '1.6' }}>
            • <strong style={{ color: '#fff' }}>공정한 비교</strong>: 투자금 크기가 달라도 "투자 실력"을 비교 가능<br />
            • <strong style={{ color: '#fff' }}>같은 조건</strong>: 100만원 투자로 환산하면 누가 더 벌었는지 명확<br />
            • <strong style={{ color: '#fff' }}>실제 예시</strong>:
            {INVESTMENT_GAINS_2026.haneul.returnPercent > INVESTMENT_GAINS_2026.gayoon.returnPercent ? (
              <> 하늘 100만원 → +{(INVESTMENT_GAINS_2026.haneul.returnPercent * 10000).toLocaleString()}원 vs 가윤 100만원 → +{(INVESTMENT_GAINS_2026.gayoon.returnPercent * 10000).toLocaleString()}원</>
            ) : (
              <> 가윤 100만원 → +{(INVESTMENT_GAINS_2026.gayoon.returnPercent * 10000).toLocaleString()}원 vs 하늘 100만원 → +{(INVESTMENT_GAINS_2026.haneul.returnPercent * 10000).toLocaleString()}원</>
            )}
          </div>
        </div>
      </div>

      {/* 대결 규칙 설명 섹션 */}
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
            대결 규칙
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
            {/* 왜 투자수익으로 비교하나요? */}
            <div style={{
              backgroundColor: '#E8F3FF',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#3182F6', marginBottom: '8px' }}>
                왜 투자수익으로 비교하나요?
              </div>
              <div style={{ fontSize: '13px', color: '#4E5968', lineHeight: '1.6' }}>
                • <strong>원금 크기와 무관</strong>: 순수하게 "얼마를 벌었냐"로 비교<br />
                • <strong>실제 투자 성과 반영</strong>: 미실현 수익도 실력<br />
                • <strong>명확한 기준</strong>: 현재 평가금액 - 투자원금 = 투자수익
                <br /><br />
                2026년 1월 1일부터 12월 24일까지의 <strong>투자수익</strong>으로 승부!
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
                투자수익 = 현재 평가금액 - 투자원금
              </div>
              <div style={{
                fontSize: '13px',
                color: '#4E5968',
                backgroundColor: 'white',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #E5E8EB',
                lineHeight: '1.6',
              }}>
                • <strong>현재 평가금액</strong>: 보유 중인 모든 자산의 현재 가치<br />
                • <strong>투자원금</strong>: 실제로 투자한 금액 (입금액 - 출금액)<br />
                • <strong>투자수익</strong>: 실현 + 미실현 수익 모두 포함
              </div>
            </div>

            {/* 하늘 상세 */}
            <div style={{
              border: '1px solid #E5E8EB',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px',
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#191F28', marginBottom: '12px' }}>
                ☁️ 하늘 투자수익 내역
              </div>
              {INVESTMENT_GAINS_2026.haneul.totalGain === 0 ? (
                <div style={{ fontSize: '13px', color: '#8B95A1', textAlign: 'center', padding: '16px' }}>
                  데이터 업데이트 대기 중<br />
                  (증권사 앱에서 투자수익 스크린샷 필요)
                </div>
              ) : (
                <table style={{ width: '100%', fontSize: '13px', color: '#4E5968' }}>
                  <tbody>
                    {INVESTMENT_GAINS_2026.haneul.breakdown.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: '6px 0' }}>{item.account}</td>
                        <td style={{ textAlign: 'right', fontWeight: '600', color: item.gain >= 0 ? '#00C853' : '#F04438' }}>
                          {item.gain >= 0 ? '+' : ''}{item.gain.toLocaleString()}원
                        </td>
                      </tr>
                    ))}
                    <tr style={{ borderTop: '1px solid #E5E8EB' }}>
                      <td style={{ padding: '10px 0 6px', fontWeight: '600', color: '#191F28' }}>총 투자수익</td>
                      <td style={{
                        textAlign: 'right',
                        fontWeight: '700',
                        fontSize: '16px',
                        color: INVESTMENT_GAINS_2026.haneul.totalGain >= 0 ? '#00C853' : '#F04438'
                      }}>
                        {INVESTMENT_GAINS_2026.haneul.totalGain >= 0 ? '+' : ''}{INVESTMENT_GAINS_2026.haneul.totalGain.toLocaleString()}원
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>

            {/* 가윤 상세 */}
            <div style={{
              border: '1px solid #E5E8EB',
              borderRadius: '12px',
              padding: '16px',
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#191F28', marginBottom: '12px' }}>
                🐰 가윤 투자수익 내역
              </div>
              <table style={{ width: '100%', fontSize: '13px', color: '#4E5968' }}>
                <tbody>
                  {INVESTMENT_GAINS_2026.gayoon.breakdown.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '6px 0' }}>{item.account}</td>
                      <td style={{ textAlign: 'right', fontWeight: '600', color: item.gain >= 0 ? '#00C853' : '#F04438' }}>
                        {item.gain >= 0 ? '+' : ''}{item.gain.toLocaleString()}원
                      </td>
                    </tr>
                  ))}
                  <tr style={{ borderTop: '1px solid #E5E8EB' }}>
                    <td style={{ padding: '10px 0 6px', fontWeight: '600', color: '#191F28' }}>총 투자수익</td>
                    <td style={{
                      textAlign: 'right',
                      fontWeight: '700',
                      fontSize: '16px',
                      color: '#00C853'
                    }}>
                      +{INVESTMENT_GAINS_2026.gayoon.totalGain.toLocaleString()}원
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        )}
      </div>

      {/* 매월 업데이트 가이드 */}
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
            필요한 스크린샷
          </div>
          <div style={{ fontSize: '13px', color: '#4E5968', lineHeight: '1.8' }}>
            각 증권사 앱에서 <strong>"투자수익"</strong> 화면 캡처
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li>미래에셋: 자산 → 투자손익 탭</li>
              <li>삼성증권: 자산 → 투자손익 탭</li>
              <li>한투: 자산 → 투자손익 탭</li>
              <li>업비트: 포트폴리오 → 총 손익</li>
            </ul>
            <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#E0F2FE', borderRadius: '6px' }}>
              💡 현재 평가금액 - 투자원금 = 투자수익
            </div>
          </div>
        </div>

        {/* 확인할 항목 */}
        <div style={{
          backgroundColor: '#F0FDF4',
          borderRadius: '12px',
          padding: '16px',
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#15803D', marginBottom: '12px' }}>
            확인할 항목
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #E5E8EB',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '12px', color: '#8B95A1' }}>1</div>
              <div style={{ fontWeight: '600', fontSize: '13px' }}>평가금액</div>
            </div>
            <div style={{
              backgroundColor: 'white',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #E5E8EB',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '12px', color: '#8B95A1' }}>2</div>
              <div style={{ fontWeight: '600', fontSize: '13px' }}>투자원금</div>
            </div>
          </div>
        </div>
      </div>

      {/* 현재 투자수익 현황 */}
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
          📊 2026년 투자수익 현황
        </div>

        {/* 가윤 투자수익 breakdown */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', color: '#8B95A1', marginBottom: '8px' }}>🐰 가윤</div>
          <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
            <tbody>
              {INVESTMENT_GAINS_2026.gayoon.breakdown.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F2F4F6' }}>
                  <td style={{ padding: '10px 8px', color: '#4E5968' }}>{item.account}</td>
                  <td style={{
                    padding: '10px 8px',
                    textAlign: 'right',
                    fontWeight: '600',
                    color: item.gain >= 0 ? '#00C853' : '#F04438'
                  }}>
                    {item.gain >= 0 ? '+' : ''}{item.gain.toLocaleString()}원
                  </td>
                </tr>
              ))}
              <tr style={{ backgroundColor: '#F7F8FA' }}>
                <td style={{ padding: '12px 8px', fontWeight: '600', color: '#191F28' }}>총 투자수익</td>
                <td style={{
                  padding: '12px 8px',
                  textAlign: 'right',
                  fontWeight: '700',
                  fontSize: '15px',
                  color: '#00C853'
                }}>
                  +{INVESTMENT_GAINS_2026.gayoon.totalGain.toLocaleString()}원
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 하늘 투자수익 */}
        <div>
          <div style={{ fontSize: '13px', color: '#8B95A1', marginBottom: '8px' }}>☁️ 하늘</div>
          {INVESTMENT_GAINS_2026.haneul.totalGain === 0 ? (
            <div style={{
              padding: '20px',
              textAlign: 'center',
              backgroundColor: '#F7F8FA',
              borderRadius: '8px',
              color: '#8B95A1',
              fontSize: '13px',
            }}>
              데이터 업데이트 대기 중
            </div>
          ) : (
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
              <tbody>
                {INVESTMENT_GAINS_2026.haneul.breakdown.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F2F4F6' }}>
                    <td style={{ padding: '10px 8px', color: '#4E5968' }}>{item.account}</td>
                    <td style={{
                      padding: '10px 8px',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: item.gain >= 0 ? '#00C853' : '#F04438'
                    }}>
                      {item.gain >= 0 ? '+' : ''}{item.gain.toLocaleString()}원
                    </td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: '#F7F8FA' }}>
                  <td style={{ padding: '12px 8px', fontWeight: '600', color: '#191F28' }}>총 투자수익</td>
                  <td style={{
                    padding: '12px 8px',
                    textAlign: 'right',
                    fontWeight: '700',
                    fontSize: '15px',
                    color: INVESTMENT_GAINS_2026.haneul.totalGain >= 0 ? '#00C853' : '#F04438'
                  }}>
                    {INVESTMENT_GAINS_2026.haneul.totalGain >= 0 ? '+' : ''}{INVESTMENT_GAINS_2026.haneul.totalGain.toLocaleString()}원
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* 월별 투자수익 기록 */}
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
          월별 투자수익 기록
        </div>

        {/* 테이블 헤더 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '60px 1fr 1fr 60px',
          gap: '4px',
          padding: '8px 0',
          borderBottom: '2px solid #E5E8EB',
          fontSize: '11px',
          color: '#8B95A1',
          fontWeight: '500',
        }}>
          <div>월</div>
          <div style={{ textAlign: 'right' }}>☁️ 하늘</div>
          <div style={{ textAlign: 'right' }}>🐰 가윤</div>
          <div style={{ textAlign: 'center' }}>승자</div>
        </div>

        {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m) => {
          const key = `2026-${m}`
          const data = MONTHLY_GAINS[key]
          const monthName = parseInt(m) + '월'

          const hGain = data?.haneul
          const gGain = data?.gayoon

          return (
            <div key={key} style={{
              display: 'grid',
              gridTemplateColumns: '50px 1fr 1fr 1fr 1fr 50px',
              gap: '4px',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: m !== '12' ? '1px solid #F2F4F6' : 'none',
              opacity: (hGain !== null && hGain !== undefined) || (gGain !== null && gGain !== undefined) ? 1 : 0.4,
              fontSize: '13px',
            }}>
              <div style={{ fontWeight: '500', color: '#191F28' }}>
                {monthName}
              </div>
              <div style={{
                textAlign: 'right',
                fontWeight: '600',
                color: hGain !== null && hGain !== undefined && hGain !== 0 ? (hGain >= 0 ? '#00C853' : '#F04438') : '#CED4DA'
              }}>
                {hGain !== null && hGain !== undefined ? (hGain === 0 ? '대기중' : `${hGain >= 0 ? '+' : ''}${hGain.toLocaleString()}원`) : '-'}
              </div>
              <div style={{
                textAlign: 'right',
                fontWeight: '600',
                color: gGain !== null && gGain !== undefined ? (gGain >= 0 ? '#00C853' : '#F04438') : '#CED4DA'
              }}>
                {gGain !== null && gGain !== undefined ? `${gGain >= 0 ? '+' : ''}${gGain.toLocaleString()}원` : '-'}
              </div>
              <div style={{ textAlign: 'center' }}>
                {hGain !== null && gGain !== null && hGain !== undefined && gGain !== undefined && hGain !== 0 ? (
                  hGain > gGain ? '☁️' : gGain > hGain ? '🐰' : '🤝'
                ) : (gGain !== null && gGain !== undefined ? '🐰' : '-')}
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
        2026년 투자수익 대결 · 패자가 {BATTLE_INFO.prize} 사기
      </div>
    </div>
  )
}
