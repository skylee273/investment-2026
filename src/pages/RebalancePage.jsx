import { useState, useEffect, useRef } from 'react'

const TABS = [
  { id: 'personal', label: '맞춤 분석', icon: '👤' },
  { id: 'overview', label: '개요', icon: '📖' },
  { id: 'strategy', label: '전략', icon: '🎯' },
  { id: 'allocation', label: '자산배분', icon: '📊' },
  { id: 'execution', label: '실행', icon: '✅' },
  { id: 'tax', label: '세금', icon: '💰' },
  { id: 'lifecycle', label: '생애주기', icon: '🔄' },
  { id: 'mistakes', label: '실수방지', icon: '⚠️' },
  { id: 'glossary', label: '용어', icon: '📚' },
]

// 색상 상수
const COLORS = {
  primary: '#3182F6',
  primaryLight: '#E8F3FF',
  success: '#01A76B',
  successLight: '#E6F7F1',
  warning: '#F57F17',
  warningLight: '#FFF8E1',
  textPrimary: '#191F28',
  textSecondary: '#8B95A1',
  background: '#F7F8FA',
  white: '#FFFFFF',
  border: '#E5E8EB',
}

export default function RebalancePage() {
  const [activeTab, setActiveTab] = useState('personal')
  const [personalTab, setPersonalTab] = useState('haneul')
  const [isMobile, setIsMobile] = useState(false)
  const tabsRef = useRef(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 탭 변경 시 해당 탭이 보이도록 스크롤
  useEffect(() => {
    if (tabsRef.current) {
      const activeButton = tabsRef.current.querySelector(`[data-tab="${activeTab}"]`)
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
  }, [activeTab])

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: COLORS.background,
      paddingBottom: isMobile ? 80 : 40,
    },
    hero: {
      background: `linear-gradient(135deg, ${COLORS.primary} 0%, #1E6CE0 100%)`,
      padding: isMobile ? '32px 20px' : '48px 40px',
      color: COLORS.white,
    },
    heroTitle: {
      fontSize: isMobile ? 28 : 36,
      fontWeight: 700,
      marginBottom: 12,
    },
    heroSubtitle: {
      fontSize: isMobile ? 15 : 17,
      opacity: 0.9,
      lineHeight: 1.6,
    },
    tabsWrapper: {
      position: 'sticky',
      top: 0,
      backgroundColor: COLORS.white,
      borderBottom: `1px solid ${COLORS.border}`,
      zIndex: 100,
    },
    tabsContainer: {
      display: 'flex',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      padding: '0 16px',
    },
    tab: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: isMobile ? '14px 12px' : '16px 20px',
      fontSize: isMobile ? 13 : 14,
      fontWeight: isActive ? 600 : 500,
      color: isActive ? COLORS.primary : COLORS.textSecondary,
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: isActive ? `3px solid ${COLORS.primary}` : '3px solid transparent',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'all 0.2s',
    }),
    content: {
      padding: isMobile ? '20px 16px' : '32px 40px',
      maxWidth: 1000,
      margin: '0 auto',
    },
    card: {
      backgroundColor: COLORS.white,
      borderRadius: 16,
      padding: isMobile ? 20 : 28,
      marginBottom: 20,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },
    cardTitle: {
      fontSize: isMobile ? 18 : 22,
      fontWeight: 700,
      color: COLORS.textPrimary,
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    },
    paragraph: {
      fontSize: isMobile ? 14 : 15,
      lineHeight: 1.8,
      color: COLORS.textPrimary,
      marginBottom: 16,
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: isMobile ? 13 : 14,
      marginBottom: 16,
    },
    th: {
      backgroundColor: COLORS.background,
      padding: isMobile ? '10px 8px' : '12px 16px',
      textAlign: 'left',
      fontWeight: 600,
      color: COLORS.textPrimary,
      borderBottom: `2px solid ${COLORS.border}`,
    },
    td: {
      padding: isMobile ? '10px 8px' : '12px 16px',
      borderBottom: `1px solid ${COLORS.border}`,
      color: COLORS.textPrimary,
    },
    tipBox: (type = 'info') => ({
      backgroundColor: type === 'warning' ? COLORS.warningLight : COLORS.primaryLight,
      borderLeft: `4px solid ${type === 'warning' ? COLORS.warning : COLORS.primary}`,
      borderRadius: '0 12px 12px 0',
      padding: isMobile ? 16 : 20,
      marginBottom: 16,
    }),
    tipTitle: (type = 'info') => ({
      fontSize: isMobile ? 14 : 15,
      fontWeight: 600,
      color: type === 'warning' ? COLORS.warning : COLORS.primary,
      marginBottom: 8,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }),
    tipText: {
      fontSize: isMobile ? 13 : 14,
      lineHeight: 1.6,
      color: COLORS.textPrimary,
    },
    badge: (color = COLORS.primary) => ({
      display: 'inline-block',
      backgroundColor: color,
      color: COLORS.white,
      fontSize: 12,
      fontWeight: 600,
      padding: '4px 10px',
      borderRadius: 20,
      marginRight: 8,
    }),
    stepNumber: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      backgroundColor: COLORS.primary,
      color: COLORS.white,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      fontWeight: 700,
      flexShrink: 0,
    },
    stepContainer: {
      display: 'flex',
      gap: 16,
      marginBottom: 24,
    },
    stepContent: {
      flex: 1,
    },
    stepTitle: {
      fontSize: isMobile ? 15 : 16,
      fontWeight: 600,
      color: COLORS.textPrimary,
      marginBottom: 8,
    },
    checkItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      marginBottom: 10,
      fontSize: isMobile ? 13 : 14,
      color: COLORS.textPrimary,
      lineHeight: 1.5,
    },
    checkbox: {
      width: 18,
      height: 18,
      border: `2px solid ${COLORS.border}`,
      borderRadius: 4,
      flexShrink: 0,
      marginTop: 2,
    },
    mistakeCard: {
      backgroundColor: COLORS.white,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 12,
      padding: isMobile ? 16 : 20,
      marginBottom: 16,
    },
    mistakeNumber: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 24,
      backgroundColor: '#FF6B6B',
      color: COLORS.white,
      borderRadius: '50%',
      fontSize: 12,
      fontWeight: 700,
      marginRight: 10,
    },
    solutionBox: {
      backgroundColor: COLORS.successLight,
      borderRadius: 8,
      padding: 12,
      marginTop: 12,
    },
    lifecycleSection: {
      borderLeft: `4px solid ${COLORS.primary}`,
      paddingLeft: 20,
      marginBottom: 24,
    },
    ageTitle: {
      fontSize: isMobile ? 16 : 18,
      fontWeight: 700,
      color: COLORS.primary,
      marginBottom: 12,
    },
  }

  const renderOverview = () => (
    <>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>📖 리밸런싱이란?</h2>
        <p style={styles.paragraph}>
          <strong>리밸런싱(Rebalancing)</strong>은 시간이 지남에 따라 변동된 포트폴리오 비중을
          원래 설정한 목표 배분으로 되돌리는 과정입니다. 시장 변동으로 인해 자산 비중이
          원래 계획과 달라지면, 의도치 않은 리스크 노출이 발생할 수 있습니다.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>구분</th>
                <th style={styles.th}>초기 배분</th>
                <th style={styles.th}>1년 후</th>
                <th style={styles.th}>리밸런싱 후</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}>주식</td>
                <td style={styles.td}>60%</td>
                <td style={styles.td}>72%</td>
                <td style={styles.td}>60%</td>
              </tr>
              <tr>
                <td style={styles.td}>채권</td>
                <td style={styles.td}>40%</td>
                <td style={styles.td}>28%</td>
                <td style={styles.td}>40%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>💡 왜 리밸런싱이 필요한가?</h2>

        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: COLORS.primary }}>
            1. 리스크 드리프트 방지
          </h3>
          <p style={styles.paragraph}>
            주식이 상승하면 포트폴리오 내 주식 비중이 높아져 전체 변동성이 증가합니다.
            정기적인 리밸런싱으로 원래 의도한 리스크 수준을 유지할 수 있습니다.
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: COLORS.primary }}>
            2. 투자 규율 확립
          </h3>
          <p style={styles.paragraph}>
            감정에 휘둘리지 않고 "비싸진 자산은 팔고, 싸진 자산은 사는"
            규율 있는 투자를 실천할 수 있습니다.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: COLORS.primary }}>
            3. 장기 수익률 개선
          </h3>
          <p style={{ ...styles.paragraph, marginBottom: 0 }}>
            Vanguard 연구에 따르면, 정기적인 리밸런싱은 연평균 0.35%의 추가 수익을
            가져올 수 있습니다. 20년간 복리로 계산하면 상당한 차이가 됩니다.
          </p>
        </div>
      </div>

      <div style={styles.tipBox('info')}>
        <div style={styles.tipTitle('info')}>💡 핵심 포인트</div>
        <p style={styles.tipText}>
          리밸런싱은 수익을 극대화하기 위한 것이 아니라, 리스크를 관리하면서
          꾸준한 성과를 얻기 위한 전략입니다. "무릎에서 사서 어깨에서 팔기"를
          시스템으로 실현하는 방법이라고 할 수 있습니다.
        </p>
      </div>
    </>
  )

  const renderStrategy = () => (
    <>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>📅 캘린더 리밸런싱</h2>
        <p style={styles.paragraph}>
          정해진 주기(월별, 분기별, 반기별, 연간)마다 포트폴리오를 점검하고 조정하는 방식입니다.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>주기</th>
                <th style={styles.th}>장점</th>
                <th style={styles.th}>단점</th>
                <th style={styles.th}>추천 대상</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}><strong>월별</strong></td>
                <td style={styles.td}>빠른 대응</td>
                <td style={styles.td}>잦은 거래비용</td>
                <td style={styles.td}>적극적 투자자</td>
              </tr>
              <tr>
                <td style={{ ...styles.td, backgroundColor: COLORS.primaryLight }}><strong>분기별</strong></td>
                <td style={{ ...styles.td, backgroundColor: COLORS.primaryLight }}>균형잡힌 접근</td>
                <td style={{ ...styles.td, backgroundColor: COLORS.primaryLight }}>적절한 빈도</td>
                <td style={{ ...styles.td, backgroundColor: COLORS.primaryLight }}>⭐ 대부분 투자자</td>
              </tr>
              <tr>
                <td style={styles.td}><strong>반기별</strong></td>
                <td style={styles.td}>낮은 비용</td>
                <td style={styles.td}>큰 괴리 가능</td>
                <td style={styles.td}>장기 투자자</td>
              </tr>
              <tr>
                <td style={styles.td}><strong>연간</strong></td>
                <td style={styles.td}>최소 비용</td>
                <td style={styles.td}>리스크 누적</td>
                <td style={styles.td}>패시브 투자자</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>📏 밴드 리밸런싱 (5/25 룰)</h2>
        <p style={styles.paragraph}>
          목표 비중에서 특정 범위(밴드)를 벗어날 때만 리밸런싱하는 방식입니다.
        </p>

        <div style={styles.tipBox('info')}>
          <div style={styles.tipTitle('info')}>5/25 룰이란?</div>
          <p style={styles.tipText}>
            <strong>절대 기준:</strong> 목표 비중에서 ±5%p 이상 벗어나면 리밸런싱<br/>
            <strong>상대 기준:</strong> 목표 비중의 ±25% 이상 벗어나면 리밸런싱<br/><br/>
            예시: 주식 목표 60% → 절대 기준으로 65% 또는 55%, 상대 기준으로 75%(60×1.25) 또는 45%(60×0.75)
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>자산</th>
                <th style={styles.th}>목표</th>
                <th style={styles.th}>하한선</th>
                <th style={styles.th}>상한선</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}>주식</td>
                <td style={styles.td}>60%</td>
                <td style={styles.td}>55%</td>
                <td style={styles.td}>65%</td>
              </tr>
              <tr>
                <td style={styles.td}>채권</td>
                <td style={styles.td}>30%</td>
                <td style={styles.td}>25%</td>
                <td style={styles.td}>35%</td>
              </tr>
              <tr>
                <td style={styles.td}>대체투자</td>
                <td style={styles.td}>10%</td>
                <td style={styles.td}>7.5%</td>
                <td style={styles.td}>12.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🎯 하이브리드 전략 (권장)</h2>
        <p style={styles.paragraph}>
          캘린더와 밴드 방식을 결합한 최적의 접근법입니다.
        </p>

        <div style={styles.tipBox('info')}>
          <div style={styles.tipTitle('info')}>⭐ 추천 전략</div>
          <p style={styles.tipText}>
            <strong>기본:</strong> 분기마다 정기 점검 (1월, 4월, 7월, 10월)<br/>
            <strong>예외:</strong> 밴드(±5%p) 이탈 시 즉시 리밸런싱<br/>
            <strong>트리거:</strong> 신규 자금 유입 시 저비중 자산 매수
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <span style={styles.badge(COLORS.primary)}>분기 점검</span>
          <span style={styles.badge(COLORS.success)}>밴드 모니터링</span>
          <span style={styles.badge(COLORS.warning)}>현금흐름 활용</span>
        </div>
      </div>
    </>
  )

  const renderAllocation = () => (
    <>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>👤 투자자 프로파일 요소</h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>요소</th>
                <th style={styles.th}>보수적</th>
                <th style={styles.th}>중립</th>
                <th style={styles.th}>공격적</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}><strong>투자 기간</strong></td>
                <td style={styles.td}>5년 미만</td>
                <td style={styles.td}>5-15년</td>
                <td style={styles.td}>15년 이상</td>
              </tr>
              <tr>
                <td style={styles.td}><strong>리스크 허용</strong></td>
                <td style={styles.td}>-10% 한계</td>
                <td style={styles.td}>-20% 수용</td>
                <td style={styles.td}>-30%+ 수용</td>
              </tr>
              <tr>
                <td style={styles.td}><strong>소득 안정성</strong></td>
                <td style={styles.td}>불안정</td>
                <td style={styles.td}>보통</td>
                <td style={styles.td}>매우 안정</td>
              </tr>
              <tr>
                <td style={styles.td}><strong>비상자금</strong></td>
                <td style={styles.td}>3개월 미만</td>
                <td style={styles.td}>3-6개월</td>
                <td style={styles.td}>6개월 이상</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>📊 주요 자산배분 모델</h2>

        <div style={{ marginBottom: 24, padding: 20, backgroundColor: COLORS.background, borderRadius: 12 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, color: COLORS.textPrimary }}>
            1. 전통적 60/40 포트폴리오
          </h3>
          <p style={{ ...styles.paragraph, marginBottom: 12 }}>
            주식 60% + 채권 40%의 클래식한 배분. 단순하면서도 검증된 전략입니다.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <span style={styles.badge(COLORS.primary)}>주식 60%</span>
            <span style={styles.badge(COLORS.success)}>채권 40%</span>
          </div>
        </div>

        <div style={{ marginBottom: 24, padding: 20, backgroundColor: COLORS.background, borderRadius: 12 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, color: COLORS.textPrimary }}>
            2. 올웨더 포트폴리오 (레이 달리오)
          </h3>
          <p style={{ ...styles.paragraph, marginBottom: 12 }}>
            어떤 경제 환경에서도 안정적인 성과를 목표로 하는 전천후 전략입니다.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={styles.badge(COLORS.primary)}>주식 30%</span>
            <span style={styles.badge(COLORS.success)}>장기채 40%</span>
            <span style={styles.badge('#6B7280')}>중기채 15%</span>
            <span style={styles.badge(COLORS.warning)}>금 7.5%</span>
            <span style={styles.badge('#8B5CF6')}>원자재 7.5%</span>
          </div>
        </div>

        <div style={{ marginBottom: 24, padding: 20, backgroundColor: COLORS.background, borderRadius: 12 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, color: COLORS.textPrimary }}>
            3. 영구 포트폴리오 (해리 브라운)
          </h3>
          <p style={{ ...styles.paragraph, marginBottom: 12 }}>
            4개 자산에 균등 배분하는 극도로 단순한 전략입니다.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={styles.badge(COLORS.primary)}>주식 25%</span>
            <span style={styles.badge(COLORS.success)}>채권 25%</span>
            <span style={styles.badge(COLORS.warning)}>금 25%</span>
            <span style={styles.badge('#6B7280')}>현금 25%</span>
          </div>
        </div>

        <div style={{ padding: 20, backgroundColor: COLORS.background, borderRadius: 12 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, color: COLORS.textPrimary }}>
            4. 공격적 성장 포트폴리오
          </h3>
          <p style={{ ...styles.paragraph, marginBottom: 12 }}>
            장기 투자자를 위한 고위험 고수익 전략입니다.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={styles.badge(COLORS.primary)}>주식 80%</span>
            <span style={styles.badge(COLORS.success)}>채권 15%</span>
            <span style={styles.badge('#6B7280')}>현금 5%</span>
          </div>
        </div>
      </div>

      <div style={styles.tipBox('info')}>
        <div style={styles.tipTitle('info')}>📌 핵심 설계 원칙</div>
        <p style={styles.tipText}>
          1. <strong>분산투자:</strong> 상관관계가 낮은 자산들로 구성<br/>
          2. <strong>비용 최소화:</strong> 저비용 인덱스 펀드/ETF 활용<br/>
          3. <strong>단순함 유지:</strong> 관리 가능한 5-7개 자산 이내로 구성
        </p>
      </div>
    </>
  )

  const renderExecution = () => (
    <>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>✅ 5단계 리밸런싱 프로세스</h2>

        <div style={styles.stepContainer}>
          <div style={styles.stepNumber}>1</div>
          <div style={styles.stepContent}>
            <h3 style={styles.stepTitle}>현재 포트폴리오 점검</h3>
            <p style={{ ...styles.paragraph, marginBottom: 0 }}>
              모든 계좌의 자산을 합산하여 현재 비중을 계산합니다.
              증권사 앱이나 스프레드시트를 활용하세요.
            </p>
          </div>
        </div>

        <div style={styles.stepContainer}>
          <div style={styles.stepNumber}>2</div>
          <div style={styles.stepContent}>
            <h3 style={styles.stepTitle}>목표 대비 괴리 확인</h3>
            <p style={{ ...styles.paragraph, marginBottom: 0 }}>
              각 자산군의 현재 비중과 목표 비중의 차이를 계산합니다.
              ±5%p 이상 차이나면 조정이 필요합니다.
            </p>
          </div>
        </div>

        <div style={styles.stepContainer}>
          <div style={styles.stepNumber}>3</div>
          <div style={styles.stepContent}>
            <h3 style={styles.stepTitle}>조정 방법 결정</h3>
            <p style={{ ...styles.paragraph, marginBottom: 0 }}>
              신규 자금으로 저비중 자산 매수(우선), 또는 고비중 자산 매도 후
              저비중 자산 매수를 결정합니다.
            </p>
          </div>
        </div>

        <div style={styles.stepContainer}>
          <div style={styles.stepNumber}>4</div>
          <div style={styles.stepContent}>
            <h3 style={styles.stepTitle}>세금 효율적 실행</h3>
            <p style={{ ...styles.paragraph, marginBottom: 0 }}>
              과세계좌보다 ISA/연금계좌에서 먼저 조정하고,
              손실이 있는 자산은 손익통산에 활용합니다.
            </p>
          </div>
        </div>

        <div style={styles.stepContainer}>
          <div style={styles.stepNumber}>5</div>
          <div style={styles.stepContent}>
            <h3 style={styles.stepTitle}>기록 및 다음 일정 설정</h3>
            <p style={{ ...styles.paragraph, marginBottom: 0 }}>
              리밸런싱 내역을 기록하고 다음 점검 일정을 캘린더에 등록합니다.
            </p>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>📋 분기 리밸런싱 체크리스트</h2>

        <div style={styles.checkItem}>
          <div style={styles.checkbox}></div>
          <span>전체 자산 현황 업데이트 (모든 계좌 합산)</span>
        </div>
        <div style={styles.checkItem}>
          <div style={styles.checkbox}></div>
          <span>목표 배분 대비 현재 비중 비교</span>
        </div>
        <div style={styles.checkItem}>
          <div style={styles.checkbox}></div>
          <span>±5%p 이상 괴리 자산 확인</span>
        </div>
        <div style={styles.checkItem}>
          <div style={styles.checkbox}></div>
          <span>신규 입금/배당금 활용 가능 여부 확인</span>
        </div>
        <div style={styles.checkItem}>
          <div style={styles.checkbox}></div>
          <span>세금 영향 검토 (과세계좌 매도 시)</span>
        </div>
        <div style={styles.checkItem}>
          <div style={styles.checkbox}></div>
          <span>거래 실행 및 체결 확인</span>
        </div>
        <div style={styles.checkItem}>
          <div style={styles.checkbox}></div>
          <span>리밸런싱 기록 저장 (날짜, 거래내역, 비용)</span>
        </div>
        <div style={styles.checkItem}>
          <div style={styles.checkbox}></div>
          <span>다음 점검일 캘린더 등록</span>
        </div>
      </div>

      <div style={styles.tipBox('warning')}>
        <div style={styles.tipTitle('warning')}>⚠️ 주의사항</div>
        <p style={styles.tipText}>
          리밸런싱은 시장 타이밍을 맞추는 것이 아닙니다.
          "지금 주식이 빠질 것 같으니 채권으로 옮기자"는 생각은 리밸런싱이 아니라 투기입니다.
          정해진 규칙에 따라 기계적으로 실행하세요.
        </p>
      </div>
    </>
  )

  const renderTax = () => (
    <>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>💰 Tax Location 전략</h2>
        <p style={styles.paragraph}>
          자산의 특성에 따라 적절한 계좌에 배치하면 세금을 최소화할 수 있습니다.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>계좌 유형</th>
                <th style={styles.th}>적합한 자산</th>
                <th style={styles.th}>이유</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}><strong>연금계좌</strong><br/>(IRP/연금저축)</td>
                <td style={styles.td}>채권, 리츠, 배당주</td>
                <td style={styles.td}>이자/배당 소득에 대한 과세 이연</td>
              </tr>
              <tr>
                <td style={styles.td}><strong>ISA</strong></td>
                <td style={styles.td}>국내주식, 국내채권</td>
                <td style={styles.td}>200만원까지 비과세, 초과분 9.9%</td>
              </tr>
              <tr>
                <td style={styles.td}><strong>일반 계좌</strong></td>
                <td style={styles.td}>해외주식, 성장주</td>
                <td style={styles.td}>250만원 공제, 장기보유 시 유리</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>📉 거래비용 최소화 팁</h2>

        <div style={styles.tipBox('info')}>
          <div style={styles.tipTitle('info')}>💡 신규 자금 활용</div>
          <p style={styles.tipText}>
            기존 자산을 매도하지 않고, 새로 입금되는 월급/배당금으로
            저비중 자산을 매수하면 거래비용과 세금을 모두 절약할 수 있습니다.
          </p>
        </div>

        <div style={styles.tipBox('info')}>
          <div style={styles.tipTitle('info')}>💡 손익통산 활용</div>
          <p style={styles.tipText}>
            손실이 발생한 자산을 매도하면, 다른 자산의 이익과 상계하여
            세금을 줄일 수 있습니다. 연말에 특히 유용한 전략입니다.
          </p>
        </div>

        <div style={styles.tipBox('info')}>
          <div style={styles.tipTitle('info')}>💡 배당금 자동 재투자</div>
          <p style={styles.tipText}>
            배당금이 지급되면 저비중 자산에 자동으로 재투자되도록 설정하면
            별도의 리밸런싱 없이도 비중을 유지할 수 있습니다.
          </p>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🔄 계좌별 리밸런싱 순서</h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>순서</th>
                <th style={styles.th}>계좌</th>
                <th style={styles.th}>이유</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...styles.td, textAlign: 'center' }}><strong>1</strong></td>
                <td style={styles.td}>IRP/연금저축</td>
                <td style={styles.td}>매매 시 세금 없음</td>
              </tr>
              <tr>
                <td style={{ ...styles.td, textAlign: 'center' }}><strong>2</strong></td>
                <td style={styles.td}>ISA</td>
                <td style={styles.td}>비과세 한도 내 무세금</td>
              </tr>
              <tr>
                <td style={{ ...styles.td, textAlign: 'center' }}><strong>3</strong></td>
                <td style={styles.td}>일반 과세계좌</td>
                <td style={styles.td}>양도세 발생 가능</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )

  const renderLifecycle = () => (
    <>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🔄 생애주기별 자산배분</h2>
        <p style={styles.paragraph}>
          나이와 상황에 따라 적절한 자산배분은 달라집니다.
          일반적인 가이드라인을 참고하되, 개인 상황에 맞게 조정하세요.
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.lifecycleSection}>
          <h3 style={styles.ageTitle}>20-30대: 자산 형성기</h3>
          <p style={styles.paragraph}>
            긴 투자 기간을 활용하여 성장 자산에 집중할 수 있는 시기입니다.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <span style={styles.badge(COLORS.primary)}>주식 80-90%</span>
            <span style={styles.badge(COLORS.success)}>채권 10-20%</span>
          </div>
          <div style={styles.tipBox('info')}>
            <p style={styles.tipText}>
              <strong>전략:</strong> 변동성을 감내하고 장기 성장에 베팅.
              매월 적립식 투자로 평균 매입단가를 낮추는 것이 핵심입니다.
            </p>
          </div>
        </div>

        <div style={styles.lifecycleSection}>
          <h3 style={styles.ageTitle}>40대: 자산 증식기</h3>
          <p style={styles.paragraph}>
            수입이 최고조에 달하는 시기. 리스크를 점진적으로 줄이기 시작합니다.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <span style={styles.badge(COLORS.primary)}>주식 60-70%</span>
            <span style={styles.badge(COLORS.success)}>채권 25-35%</span>
            <span style={styles.badge('#6B7280')}>대체투자 5-10%</span>
          </div>
          <div style={styles.tipBox('info')}>
            <p style={styles.tipText}>
              <strong>전략:</strong> 배당주나 가치주 비중 확대.
              자녀 교육비 등 큰 지출에 대비한 유동성 확보 필요.
            </p>
          </div>
        </div>

        <div style={styles.lifecycleSection}>
          <h3 style={styles.ageTitle}>50대: 은퇴 준비기</h3>
          <p style={styles.paragraph}>
            은퇴가 가시화되는 시기. 자산 보존과 인컴 창출의 균형이 중요합니다.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <span style={styles.badge(COLORS.primary)}>주식 40-50%</span>
            <span style={styles.badge(COLORS.success)}>채권 40-50%</span>
            <span style={styles.badge('#6B7280')}>현금성 자산 10%</span>
          </div>
          <div style={styles.tipBox('info')}>
            <p style={styles.tipText}>
              <strong>전략:</strong> 배당 및 이자 수익 극대화.
              연금 수령 시점을 고려한 자금 계획 수립.
            </p>
          </div>
        </div>

        <div style={styles.lifecycleSection}>
          <h3 style={styles.ageTitle}>60대+: 은퇴 생활기</h3>
          <p style={styles.paragraph}>
            안정적인 현금 흐름이 가장 중요합니다. 원금 보존에 집중하세요.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <span style={styles.badge(COLORS.primary)}>주식 20-30%</span>
            <span style={styles.badge(COLORS.success)}>채권 50-60%</span>
            <span style={styles.badge('#6B7280')}>현금성 자산 20%</span>
          </div>
          <div style={styles.tipBox('info')}>
            <p style={styles.tipText}>
              <strong>전략:</strong> 인플레이션 헤지를 위해 일부 주식 유지.
              2-3년치 생활비는 현금성 자산으로 보유.
            </p>
          </div>
        </div>
      </div>

      <div style={styles.tipBox('warning')}>
        <div style={styles.tipTitle('warning')}>⚠️ 주의</div>
        <p style={styles.tipText}>
          위 가이드라인은 일반적인 참고사항입니다.
          개인의 위험 허용도, 다른 수입원(연금, 부동산 등), 건강 상태,
          부양가족 여부 등에 따라 크게 달라질 수 있습니다.
        </p>
      </div>
    </>
  )

  const renderMistakes = () => (
    <>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>⚠️ 리밸런싱 주요 실수 5가지</h2>
      </div>

      <div style={styles.mistakeCard}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>
          <span style={styles.mistakeNumber}>1</span>
          너무 잦은 리밸런싱
        </h3>
        <p style={{ ...styles.paragraph, marginBottom: 0 }}>
          매일 또는 매주 포트폴리오를 조정하면 거래비용이 누적되고,
          세금 효율성도 떨어집니다.
        </p>
        <div style={styles.solutionBox}>
          <strong style={{ color: COLORS.success }}>해결책:</strong> 분기 또는 반기 단위로 점검하고,
          ±5%p 이상 괴리 시에만 조정하세요.
        </div>
      </div>

      <div style={styles.mistakeCard}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>
          <span style={styles.mistakeNumber}>2</span>
          시장 타이밍 시도
        </h3>
        <p style={{ ...styles.paragraph, marginBottom: 0 }}>
          "지금 주식이 많이 올랐으니 팔아야지" 같은 예측에 기반한 조정은
          리밸런싱이 아니라 투기입니다.
        </p>
        <div style={styles.solutionBox}>
          <strong style={{ color: COLORS.success }}>해결책:</strong> 정해진 규칙(캘린더/밴드)에 따라
          기계적으로 실행하세요. 감정을 배제하세요.
        </div>
      </div>

      <div style={styles.mistakeCard}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>
          <span style={styles.mistakeNumber}>3</span>
          세금 비용 무시
        </h3>
        <p style={{ ...styles.paragraph, marginBottom: 0 }}>
          과세계좌에서 수익이 난 자산을 매도하면 양도세가 발생합니다.
          세금을 고려하지 않으면 실질 수익률이 크게 줄어듭니다.
        </p>
        <div style={styles.solutionBox}>
          <strong style={{ color: COLORS.success }}>해결책:</strong> ISA/연금계좌에서 먼저 리밸런싱하고,
          신규 자금으로 조정하는 것을 우선하세요.
        </div>
      </div>

      <div style={styles.mistakeCard}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>
          <span style={styles.mistakeNumber}>4</span>
          일부 계좌만 고려
        </h3>
        <p style={{ ...styles.paragraph, marginBottom: 0 }}>
          연금계좌, ISA, 일반계좌를 따로따로 관리하면 전체 포트폴리오 관점에서
          비효율적인 배분이 될 수 있습니다.
        </p>
        <div style={styles.solutionBox}>
          <strong style={{ color: COLORS.success }}>해결책:</strong> 모든 계좌의 자산을 합산하여
          전체 포트폴리오 기준으로 비중을 계산하세요.
        </div>
      </div>

      <div style={styles.mistakeCard}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>
          <span style={styles.mistakeNumber}>5</span>
          목표 배분 미설정
        </h3>
        <p style={{ ...styles.paragraph, marginBottom: 0 }}>
          명확한 목표 비중 없이 "대충 균형 맞추기"는 일관성 없는 투자로 이어집니다.
        </p>
        <div style={styles.solutionBox}>
          <strong style={{ color: COLORS.success }}>해결책:</strong> 먼저 자신의 투자 목표와
          위험 허용도에 맞는 목표 배분을 설정하고, 문서화하세요.
        </div>
      </div>
    </>
  )

  const renderGlossary = () => (
    <>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>📚 핵심 용어 정리</h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, width: '30%' }}>용어</th>
                <th style={styles.th}>설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}><strong>리밸런싱</strong></td>
                <td style={styles.td}>포트폴리오 비중을 목표 배분으로 재조정하는 과정</td>
              </tr>
              <tr>
                <td style={styles.td}><strong>자산배분</strong></td>
                <td style={styles.td}>주식, 채권, 현금 등 자산군별로 투자 비중을 결정하는 전략</td>
              </tr>
              <tr>
                <td style={styles.td}><strong>밴드</strong></td>
                <td style={styles.td}>목표 비중을 중심으로 허용되는 범위 (예: 60% ± 5%)</td>
              </tr>
              <tr>
                <td style={styles.td}><strong>드리프트</strong></td>
                <td style={styles.td}>시장 변동으로 인해 실제 비중이 목표에서 벗어나는 현상</td>
              </tr>
              <tr>
                <td style={styles.td}><strong>Tax Location</strong></td>
                <td style={styles.td}>자산 특성에 따라 세금 효율적인 계좌에 배치하는 전략</td>
              </tr>
              <tr>
                <td style={styles.td}><strong>손익통산</strong></td>
                <td style={styles.td}>투자 손실과 이익을 상계하여 세금을 줄이는 방법</td>
              </tr>
              <tr>
                <td style={styles.td}><strong>적립식 투자</strong></td>
                <td style={styles.td}>정기적으로 일정 금액을 투자하여 평균 매입단가를 낮추는 방법 (DCA)</td>
              </tr>
              <tr>
                <td style={styles.td}><strong>상관관계</strong></td>
                <td style={styles.td}>두 자산 가격이 함께 움직이는 정도 (-1~+1, 낮을수록 분산 효과)</td>
              </tr>
              <tr>
                <td style={styles.td}><strong>변동성</strong></td>
                <td style={styles.td}>자산 가격의 변동 폭, 리스크의 대표적인 지표</td>
              </tr>
              <tr>
                <td style={styles.td}><strong>인컴 자산</strong></td>
                <td style={styles.td}>배당이나 이자 등 정기적인 현금 흐름을 제공하는 자산</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={styles.tipBox('info')}>
        <div style={styles.tipTitle('info')}>💡 더 알아보기</div>
        <p style={styles.tipText}>
          투자 용어가 어렵게 느껴진다면, 가장 중요한 것은 <strong>"분산투자"</strong>와
          <strong>"장기투자"</strong> 두 가지입니다. 다양한 자산에 나누어 투자하고,
          시간을 두고 꾸준히 유지하는 것이 핵심입니다.
        </p>
      </div>
    </>
  )

  const renderPersonal = () => {
    const subTabStyle = (isActive) => ({
      flex: 1,
      padding: isMobile ? '12px 8px' : '14px 20px',
      fontSize: isMobile ? 14 : 15,
      fontWeight: isActive ? 700 : 500,
      color: isActive ? COLORS.white : COLORS.textPrimary,
      backgroundColor: isActive ? COLORS.primary : COLORS.white,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 8,
      cursor: 'pointer',
      transition: 'all 0.2s',
    })

    const progressBar = (current, target, color = COLORS.primary) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, height: 8, backgroundColor: COLORS.background, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${Math.min(current / target * 100, 100)}%`, height: '100%', backgroundColor: color, borderRadius: 4 }} />
        </div>
        <span style={{ fontSize: 12, color: COLORS.textSecondary, minWidth: 45 }}>{current}%</span>
      </div>
    )

    // 하늘버핏 데이터
    const haneulData = {
      total: 4430000,
      portfolio: [
        { account: '연금저축', asset: 'KODEX 200, 코스닥150', amount: 1390000, ratio: 31.4 },
        { account: 'ISA', asset: '코스닥150, 미국채, S&P500', amount: 500000, ratio: 11.3 },
        { account: '해외주식(미래)', asset: '셰브론, 알파벳, 화이자', amount: 1100000, ratio: 24.8 },
        { account: '토스', asset: '아마존, 알파벳, 메타 등', amount: 560000, ratio: 12.6 },
        { account: 'IRP', asset: '예수금', amount: 250000, ratio: 5.6 },
        { account: 'CMA', asset: '가족여행', amount: 610000, ratio: 13.8 },
        { account: '암호화폐', asset: '비트코인', amount: 20000, ratio: 0.5 },
      ],
      allocation: [
        { category: '해외주식(S&P/나스닥)', current: 25, target: 50, gap: -25 },
        { category: '국내주식', current: 43, target: 20, gap: 23 },
        { category: '채권/금', current: 5, target: 10, gap: -5 },
        { category: '현금', current: 19, target: 10, gap: 9 },
        { category: '대체투자(암호화폐)', current: 0.5, target: 5, gap: -4.5 },
        { category: '개별종목', current: 7.5, target: 5, gap: 2.5 },
      ],
      sellRecommend: [
        { asset: 'KODEX 200', current: 1060000, sell: 500000, reason: '국내주식 비중 축소' },
        { asset: 'CMA(가족여행)', current: 610000, sell: 300000, reason: '현금 과다 조정' },
      ],
      buyRecommend: [
        { asset: 'TIGER 미국S&P500', target: 0, buy: 500000, reason: '해외주식 비중 확대' },
        { asset: 'TIGER 미국채10년', target: 0, buy: 150000, reason: '안전자산 확보' },
        { asset: '비트코인', target: 20000, buy: 150000, reason: '대체투자 분산' },
      ],
    }

    // 가윤달리오 데이터
    const gayoonData = {
      total: 65620000,
      portfolio: [
        { account: '해외주식(삼성)', asset: 'VOO, SCHD, 케이뱅크', amount: 24610000, ratio: 37.5 },
        { account: '한투', asset: '아마존', amount: 2700000, ratio: 4.1 },
        { account: 'ISA(삼성)', asset: '코스피, 나스닥, 신흥국, 채권, 금', amount: 19380000, ratio: 29.5 },
        { account: '연금저축', asset: 'KODEX 200, 코스닥150', amount: 5540000, ratio: 8.4 },
        { account: 'CMA', asset: '발행어음', amount: 14030000, ratio: 21.4 },
        { account: 'IRP', asset: 'TDF2025', amount: 270000, ratio: 0.4 },
        { account: '암호화폐', asset: '비트코인', amount: 1090000, ratio: 1.7 },
      ],
      allocation: [
        { category: '해외주식(S&P/배당)', current: 42, target: 50, gap: -8 },
        { category: '국내주식', current: 18, target: 15, gap: 3 },
        { category: '채권/금', current: 6, target: 10, gap: -4 },
        { category: '현금', current: 21, target: 10, gap: 11 },
        { category: '신흥국/대체', current: 6, target: 10, gap: -4 },
        { category: '암호화폐', current: 2, target: 5, gap: -3 },
      ],
      // 해외주식 전략
      overseasStrategy: {
        action: 'Hold (계속 보유)',
        reason: '올해 이미 250만원 수익 실현, 매도 시 세금 발생',
        stopLoss: '-20% 이상 하락 시 재검토',
      },
      // ISA 리밸런싱 (삼성증권)
      isaRebalance: {
        sell: [
          { asset: 'KODEX 200 차익실현', amount: 3000000 },
          { asset: 'TIGER 미국S&P500 차익실현', amount: 2000000 },
          { asset: 'TIGER 미국나스닥100 차익실현', amount: 1000000 },
        ],
        buy: [
          { asset: 'PLUS 신흥국MSCI', amount: 2000000 },
          { asset: 'KODEX 코스닥150', amount: 2000000 },
          { asset: 'TIGER 미국채10년', amount: 1000000 },
          { asset: 'KODEX 금액티브', amount: 500000 },
          { asset: 'TIGER SOFR달러', amount: 500000 },
        ],
        reason: '차익 실현 시점, 안전자산 분배, 저평가된 코스닥/신흥국 재투자',
        // 분할 매도 전략 (5단계) - 총 600만원
        sellStrategy: [
          { step: '1차', rate: '+7%', amount: 1200000, items: [
            { name: 'KODEX 200', amount: 600000 },
            { name: 'S&P500', amount: 400000 },
            { name: '나스닥100', amount: 200000 },
          ]},
          { step: '2차', rate: '+10%', amount: 1200000, items: [
            { name: 'KODEX 200', amount: 600000 },
            { name: 'S&P500', amount: 400000 },
            { name: '나스닥100', amount: 200000 },
          ]},
          { step: '3차', rate: '+13%', amount: 1200000, items: [
            { name: 'KODEX 200', amount: 600000 },
            { name: 'S&P500', amount: 400000 },
            { name: '나스닥100', amount: 200000 },
          ]},
          { step: '4차', rate: '+16%', amount: 1200000, items: [
            { name: 'KODEX 200', amount: 600000 },
            { name: 'S&P500', amount: 400000 },
            { name: '나스닥100', amount: 200000 },
          ]},
          { step: '5차', rate: '+20%', amount: 1200000, items: [
            { name: 'KODEX 200', amount: 600000 },
            { name: 'S&P500', amount: 400000 },
            { name: '나스닥100', amount: 200000 },
          ]},
        ],
        sellTotal: 6000000,
        sellNote: '6월까지 미매도 시: 7% 이상이면 전량 매도',
        // 분할 매수 전략 (6단계) - 총 600만원 (안전자산 우선 배치)
        buyStrategy: [
          { step: '1차', rate: '-3%', amount: 700000, items: [
            { name: '미국채10년', amount: 200000 },
            { name: '금액티브', amount: 150000 },
            { name: 'SOFR달러', amount: 150000 },
            { name: '신흥국', amount: 100000 },
            { name: '코스닥150', amount: 100000 },
          ]},
          { step: '2차', rate: '-5%', amount: 800000, items: [
            { name: '미국채10년', amount: 200000 },
            { name: '금액티브', amount: 150000 },
            { name: 'SOFR달러', amount: 150000 },
            { name: '신흥국', amount: 150000 },
            { name: '코스닥150', amount: 150000 },
          ]},
          { step: '3차', rate: '-7%', amount: 900000, items: [
            { name: '미국채10년', amount: 200000 },
            { name: '금액티브', amount: 100000 },
            { name: 'SOFR달러', amount: 100000 },
            { name: '신흥국', amount: 250000 },
            { name: '코스닥150', amount: 250000 },
          ]},
          { step: '4차', rate: '-10%', amount: 1000000, items: [
            { name: '미국채10년', amount: 200000 },
            { name: '금액티브', amount: 100000 },
            { name: 'SOFR달러', amount: 100000 },
            { name: '신흥국', amount: 300000 },
            { name: '코스닥150', amount: 300000 },
          ]},
          { step: '5차', rate: '-12%', amount: 1200000, items: [
            { name: '미국채10년', amount: 200000 },
            { name: '신흥국', amount: 500000 },
            { name: '코스닥150', amount: 500000 },
          ]},
          { step: '6차', rate: '-15%', amount: 1400000, items: [
            { name: '신흥국', amount: 700000 },
            { name: '코스닥150', amount: 700000 },
          ]},
        ],
        buyTotal: 6000000,
        buyNote: '6월까지 미매수 시: 마이너스면 구매',
      },
      // 연금저축 리밸런싱 (미래에셋)
      pensionRebalance: {
        sell: [
          { asset: 'KODEX 200 차익실현', amount: 4000000 },
        ],
        buy: [
          { asset: 'KODEX 코스닥150', amount: 1000000 },
          { asset: 'TIGER 미국채10년', amount: 500000 },
          { asset: 'KODEX 금액티브', amount: 500000 },
          { asset: 'TIGER SOFR달러', amount: 500000 },
          { asset: 'TIGER 미국S&P500', amount: 1000000 },
          { asset: 'TIGER 미국나스닥100', amount: 500000 },
        ],
        reason: '과세이연 혜택을 위해 해외주식 필요, 차익 실현 후 저평가 자산 + 안전자산 분산',
        // 분할 매도 전략 (7단계) - 총 400만원
        sellStrategy: [
          { step: '1차', rate: '+7%', amount: 1000000, items: [{ name: 'KODEX 200', amount: 1000000 }]},
          { step: '2차', rate: '+9%', amount: 800000, items: [{ name: 'KODEX 200', amount: 800000 }]},
          { step: '3차', rate: '+11%', amount: 600000, items: [{ name: 'KODEX 200', amount: 600000 }]},
          { step: '4차', rate: '+14%', amount: 520000, items: [{ name: 'KODEX 200', amount: 520000 }]},
          { step: '5차', rate: '+16%', amount: 440000, items: [{ name: 'KODEX 200', amount: 440000 }]},
          { step: '6차', rate: '+18%', amount: 360000, items: [{ name: 'KODEX 200', amount: 360000 }]},
          { step: '7차', rate: '+20%', amount: 280000, items: [{ name: 'KODEX 200', amount: 280000 }]},
        ],
        sellTotal: 4000000,
        sellNote: '6월까지 미매도 시: 7% 이상이면 전량 매도',
        // 분할 매수 전략 (3단계) - 총 400만원
        buyStrategy: [
          { step: '1차', rate: '-3%', amount: 1000000, items: [
            { name: '미국채10년', amount: 150000 },
            { name: '금액티브', amount: 150000 },
            { name: 'SOFR달러', amount: 150000 },
            { name: '코스닥150', amount: 200000 },
            { name: 'S&P500', amount: 200000 },
            { name: '나스닥100', amount: 150000 },
          ]},
          { step: '2차', rate: '-5%', amount: 1300000, items: [
            { name: '미국채10년', amount: 200000 },
            { name: '금액티브', amount: 200000 },
            { name: 'SOFR달러', amount: 200000 },
            { name: '코스닥150', amount: 300000 },
            { name: 'S&P500', amount: 300000 },
            { name: '나스닥100', amount: 100000 },
          ]},
          { step: '3차', rate: '-7%', amount: 1700000, items: [
            { name: '미국채10년', amount: 150000 },
            { name: '금액티브', amount: 150000 },
            { name: 'SOFR달러', amount: 150000 },
            { name: '코스닥150', amount: 500000 },
            { name: 'S&P500', amount: 500000 },
            { name: '나스닥100', amount: 250000 },
          ]},
        ],
        buyTotal: 4000000,
        buyNote: '6월까지 미매수 시: 마이너스면 구매',
      },
      sellRecommend: [
        { asset: 'KODEX 200 (ISA)', current: 3000000, sell: 3000000, reason: 'ISA 차익실현' },
        { asset: 'TIGER S&P500 (ISA)', current: 2000000, sell: 2000000, reason: 'ISA 차익실현' },
        { asset: 'TIGER 나스닥100 (ISA)', current: 1000000, sell: 1000000, reason: 'ISA 차익실현' },
        { asset: 'KODEX 200 (연금)', current: 4000000, sell: 4000000, reason: '연금 차익실현' },
      ],
      buyRecommend: [
        { asset: 'PLUS 신흥국MSCI', target: 0, buy: 2000000, reason: '신흥국 저평가 구간' },
        { asset: 'KODEX 코스닥150', target: 0, buy: 3000000, reason: '코스닥 저평가 구간' },
        { asset: 'TIGER 미국채10년', target: 2070000, buy: 1500000, reason: '안전자산 확보' },
        { asset: 'KODEX 금액티브', target: 0, buy: 1000000, reason: '인플레 헤지' },
        { asset: 'TIGER SOFR달러', target: 0, buy: 1000000, reason: '달러 + 금리 수익' },
        { asset: 'TIGER 미국S&P500 (연금)', target: 0, buy: 1000000, reason: '해외주식 과세이연' },
        { asset: 'TIGER 미국나스닥100 (연금)', target: 0, buy: 500000, reason: '성장주 노출' },
      ],
      // 하늘버핏의 리밸런싱 의견
      haneulOpinion: {
        title: '하늘버핏의 리밸런싱 의견',
        summary: '가윤님의 포트폴리오는 "핵심-위성" 전략의 교과서적인 구성입니다. VOO와 SCHD가 핵심 자산(37.5%)을 형성하고, ISA 내 6개 자산군 분산이 리스크를 효과적으로 관리하고 있습니다.',
        situation: [
          '해외주식: +250만원 수익 중. 양도소득세 고려 시 계속 보유가 유리',
          'ISA/연금: 국내 대형주(KODEX 200) 비중이 높아 차익 실현 적기',
          '시장 전망: 코스닥/신흥국 저평가 구간, 안전자산 분산 필요',
        ],
        recommendations: [
          '해외주식(VOO, SCHD, 아마존): Hold - 세금 효율성 우선',
          'ISA 리밸런싱: KODEX 200 → 신흥국/코스닥 재투자',
          '연금저축 리밸런싱: 국내주식 → 해외ETF + 안전자산 분산',
          '손절 기준: 개별 종목 -20% 도달 시 재검토',
        ],
        tradingStrategy: {
          title: '분할 매수/매도 전략',
          sellRule: '7~20% 수익 구간에서 차익 실현',
          buyRule: '한 번에 몰빵 금지! 4월 동안 일자를 나눠서, 내려갈 때 조금씩 더 사는 방식으로 분할 매수',
        },
      },
      // 월가 전설들 평가
      legends: [
        {
          name: '워렌 버핏',
          style: '가치투자',
          icon: '🎩',
          color: '#F59E0B',
          rating: 'B+',
          comment: 'VOO와 SCHD 보유는 합리적이나, 차익 실현 후 재투자 종목의 본질적 가치를 충분히 분석했는지 확인이 필요합니다. 신흥국 투자는 이해 범위 밖일 수 있습니다.',
        },
        {
          name: '레이 달리오',
          style: '올웨더',
          icon: '🌊',
          color: '#3182F6',
          rating: 'A-',
          comment: '채권, 금, 주식의 분산은 좋습니다. SOFR 달러 추가로 인플레이션 헤지도 고려한 점이 훌륭합니다. 다만 원자재 비중이 금에만 한정된 점은 아쉽습니다.',
        },
        {
          name: '피터 린치',
          style: '성장주',
          icon: '📈',
          color: '#10B981',
          rating: 'B',
          comment: '나스닥 ETF를 통한 성장주 노출은 좋지만, 개별 종목 발굴 기회가 제한적입니다. \'10루타 종목\'을 직접 찾아볼 여지를 남겨두세요.',
        },
        {
          name: '존 보글',
          style: '인덱스',
          icon: '📊',
          color: '#8B5CF6',
          rating: 'A',
          comment: '저비용 인덱스 ETF 중심의 리밸런싱은 제가 평생 주장한 원칙과 일치합니다. VOO, TIGER S&P500 같은 저비용 상품 선택은 현명한 결정입니다.',
        },
        {
          name: '하워드 막스',
          style: '리스크',
          icon: '⚖️',
          color: '#EF4444',
          rating: 'B+',
          comment: '차익 실현 타이밍이 적절합니다. \'2차 사고\'를 할 수 있는 현금 여력을 확보한 점이 좋습니다. 신흥국 재투자는 \'떨어지는 칼날\'일 수 있으니 분할 매수를 권합니다.',
        },
        {
          name: '하늘버핏',
          style: '미래의 전설',
          icon: '🌤️',
          color: '#667EEA',
          rating: 'A',
          comment: '가윤이 포트폴리오 구성 아주 좋아요! VOO+SCHD 코어 전략에 ISA/연금 세제혜택까지 완벽하게 활용하고 있어요. 현금 확보하면서 기회 매수 노리는 것도 현명한 판단! 앞으로 떨어지는 우량주 하나씩 줍줍하면서 부자 됩시다~ 움하하하하 🚀',
        },
      ],
      overallGrade: 'B+',
      overallComment: '안정적인 코어-위성 전략에 적절한 리밸런싱. 세금 효율성과 자산배분 모두 고려한 합리적 판단.',
      // 기회 매수 전략
      opportunityBuy: {
        title: '기회 매수 전략',
        cashStrategy: {
          title: 'CMA 현금 확보 전략',
          reason: '오빠한테 받을 돈(2,000만원)과 전세 보증금(4,500만원)을 고려하면 현금 확보가 중요합니다. 새 집 계약 시 필요한 자금이기도 하고, 시장 하락 시 기회 매수 여력을 확보하는 전략입니다.',
          status: '현재 CMA 유지 권장',
        },
        monthlyPlan: {
          title: '월별 기회 매수 플랜',
          description: '현금을 확보한 상태에서 많이 떨어진 우량 기업들을 한 달에 1~2개씩 기회가 되면 조금씩 줍줍하는 전략입니다.',
          frequency: '월 1~2종목',
          amount: '종목당 30~50만원',
        },
        thisMonth: {
          title: '2026년 4월 추천 종목',
          picks: [
            {
              ticker: 'ORCL',
              name: '오라클 (Oracle)',
              reason: '한국 대기업을 포함한 글로벌 기업들이 오라클 DB를 쉽게 대체할 수 없음. 현재 가격이 매우 매력적인 구간!',
              sector: '기술/클라우드',
              color: '#F80000',
            },
            {
              ticker: 'CVX',
              name: '쉐브론 (Chevron)',
              reason: '전쟁이 끝나면 유가 하락? 그래도 "유가" 자체는 안전 투자. 안정적 배당(4%+)으로 꾸준히 하나씩 모아두면 배당으로 두둑히 챙길 수 있음!',
              sector: '에너지/배당',
              color: '#0066CC',
            },
          ],
        },
      },
    }

    const data = personalTab === 'haneul' ? haneulData : gayoonData
    const name = personalTab === 'haneul' ? '하늘버핏' : '가윤달리오'
    const emoji = personalTab === 'haneul' ? '🌤️' : '👩‍💼'

    const formatMoney = (n) => n.toLocaleString() + '원'

    return (
      <>
        {/* 서브 탭 */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <button
            style={subTabStyle(personalTab === 'haneul')}
            onClick={() => setPersonalTab('haneul')}
          >
            🌤️ 하늘버핏
          </button>
          <button
            style={subTabStyle(personalTab === 'gayoon')}
            onClick={() => setPersonalTab('gayoon')}
          >
            👩‍💼 가윤달리오
          </button>
        </div>

        {/* 요약 카드 */}
        <div style={{ ...styles.card, backgroundColor: COLORS.primaryLight, border: `2px solid ${COLORS.primary}` }}>
          <h2 style={{ ...styles.cardTitle, color: COLORS.primary }}>
            {emoji} {name} 맞춤 리밸런싱 분석
          </h2>
          <p style={styles.paragraph}>
            <strong>총 자산:</strong> {formatMoney(data.total)} |
            <strong> 분석 기준일:</strong> 2026년 4월 |
            <strong> 투자자 유형:</strong> 20-30대 공격적 투자자
          </p>
        </div>

        {/* 현재 포트폴리오 */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📊 현재 포트폴리오 현황</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>계좌</th>
                  <th style={styles.th}>자산</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>금액</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>비중</th>
                </tr>
              </thead>
              <tbody>
                {data.portfolio.map((item, idx) => (
                  <tr key={idx}>
                    <td style={styles.td}><strong>{item.account}</strong></td>
                    <td style={styles.td}>{item.asset}</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>{formatMoney(item.amount)}</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>{item.ratio}%</td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: COLORS.background }}>
                  <td style={{ ...styles.td, fontWeight: 700 }} colSpan={2}>합계</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontWeight: 700 }}>{formatMoney(data.total)}</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontWeight: 700 }}>100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 목표 배분 vs 현재 비교 */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🎯 목표 배분 vs 현재 비교</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>자산군</th>
                  <th style={styles.th}>현재</th>
                  <th style={styles.th}>목표</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>괴리</th>
                  <th style={{ ...styles.th, minWidth: 120 }}>진행도</th>
                </tr>
              </thead>
              <tbody>
                {data.allocation.map((item, idx) => (
                  <tr key={idx}>
                    <td style={styles.td}><strong>{item.category}</strong></td>
                    <td style={styles.td}>{item.current}%</td>
                    <td style={styles.td}>{item.target}%</td>
                    <td style={{
                      ...styles.td,
                      textAlign: 'center',
                      color: item.gap > 0 ? '#FF6B6B' : item.gap < 0 ? COLORS.primary : COLORS.success,
                      fontWeight: 600
                    }}>
                      {item.gap > 0 ? '+' : ''}{item.gap}%
                    </td>
                    <td style={styles.td}>
                      {progressBar(item.current, item.target, item.gap > 0 ? '#FF6B6B' : COLORS.primary)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: COLORS.textSecondary }}>
              <span style={{ color: '#FF6B6B', fontWeight: 600 }}>●</span> 비중 과다 (매도 필요)
            </span>
            <span style={{ fontSize: 13, color: COLORS.textSecondary }}>
              <span style={{ color: COLORS.primary, fontWeight: 600 }}>●</span> 비중 부족 (매수 필요)
            </span>
          </div>
        </div>

        {/* 매도 권고 */}
        <div style={styles.card}>
          <h2 style={{ ...styles.cardTitle, color: '#FF6B6B' }}>📉 매도 권고 (Q2 2026)</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>종목</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>현재 금액</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>매도 금액</th>
                  <th style={styles.th}>이유</th>
                </tr>
              </thead>
              <tbody>
                {data.sellRecommend.map((item, idx) => (
                  <tr key={idx}>
                    <td style={styles.td}><strong>{item.asset}</strong></td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>{formatMoney(item.current)}</td>
                    <td style={{ ...styles.td, textAlign: 'right', color: '#FF6B6B', fontWeight: 600 }}>
                      -{formatMoney(item.sell)}
                    </td>
                    <td style={styles.td}>{item.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 매수 권고 */}
        <div style={styles.card}>
          <h2 style={{ ...styles.cardTitle, color: COLORS.success }}>📈 매수 권고 (Q2 2026)</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>종목</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>현재 보유</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>매수 금액</th>
                  <th style={styles.th}>이유</th>
                </tr>
              </thead>
              <tbody>
                {data.buyRecommend.map((item, idx) => (
                  <tr key={idx}>
                    <td style={styles.td}><strong>{item.asset}</strong></td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>{formatMoney(item.target)}</td>
                    <td style={{ ...styles.td, textAlign: 'right', color: COLORS.success, fontWeight: 600 }}>
                      +{formatMoney(item.buy)}
                    </td>
                    <td style={styles.td}>{item.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 상세 분석 */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📝 상세 분석 리포트</h2>

          {personalTab === 'haneul' ? (
            <>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.primary, marginBottom: 12 }}>
                  1. 현황 진단: 국내주식 편중과 분산 부족
                </h3>
                <p style={styles.paragraph}>
                  현재 하늘버핏의 포트폴리오를 분석한 결과, 가장 큰 문제점은 <strong>국내주식 비중이 43%로 과도하게 높다</strong>는 점입니다.
                  연금저축(31.4%)과 ISA(11.3%)에 집중된 KODEX 200, 코스닥150 ETF가 전체 자산의 상당 부분을 차지하고 있습니다.
                  한국 주식시장은 전 세계 시가총액의 약 1.5%에 불과하지만, 포트폴리오의 43%가 여기에 집중되어 있어
                  <strong>홈 바이어스(Home Bias)</strong> 현상이 심각합니다.
                </p>
                <p style={styles.paragraph}>
                  더불어 현금성 자산이 19%(CMA 13.8% + IRP 예수금 5.6%)로 젊은 투자자 기준으로는 지나치게 높습니다.
                  20-30대는 인적자본(향후 벌어들일 소득)이 채권과 유사한 안전자산 역할을 하므로, 금융자산은 더 공격적으로 운용해도 됩니다.
                  현금 19%는 기회비용이 크며, 특히 인플레이션을 고려하면 실질 가치가 감소하고 있습니다.
                </p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.primary, marginBottom: 12 }}>
                  2. 리스크 평가: 원화자산 집중 위험
                </h3>
                <p style={styles.paragraph}>
                  총 자산 443만원 중 해외주식은 약 25%에 불과합니다. 이는 <strong>환율 리스크 헤지 관점에서 매우 취약</strong>한 구조입니다.
                  한국 원화는 위기 시 달러 대비 급락하는 경향이 있어, 글로벌 금융위기나 지정학적 리스크 발생 시
                  원화 자산만 보유한 투자자는 이중 손실(자산가치 하락 + 원화 가치 하락)을 겪게 됩니다.
                </p>
                <p style={styles.paragraph}>
                  개별 종목 집중도 문제가 됩니다. 미래에셋 해외주식 계좌의 셰브론, 알파벳, 화이자는 각각 에너지, 기술, 헬스케어 섹터를 대표하지만,
                  3개 종목에 24.8%가 집중되어 있습니다. 개별 기업의 실적 부진이나 산업 특수 리스크에 노출될 수 있으므로,
                  <strong>ETF를 통한 분산투자로 전환</strong>하는 것이 바람직합니다.
                </p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.primary, marginBottom: 12 }}>
                  3. 세금 효율성 분석: 절세계좌 활용 우수
                </h3>
                <p style={styles.paragraph}>
                  긍정적인 점은 연금저축(31.4%)과 ISA(11.3%)의 비중이 높아 <strong>세제혜택을 적극 활용</strong>하고 있다는 것입니다.
                  연금저축은 연 600만원 한도 내에서 세액공제(13.2~16.5%)를 받을 수 있고,
                  ISA는 200만원까지 비과세, 초과분은 9.9% 분리과세로 일반 과세계좌 대비 유리합니다.
                </p>
                <p style={styles.paragraph}>
                  다만 IRP 25만원은 예수금으로 방치되어 있어 비효율적입니다. IRP는 연금저축과 합산 900만원까지 세액공제 가능하므로,
                  이 금액을 TIGER 미국S&P500 등 저비용 ETF에 투자하면 <strong>세액공제와 복리 효과를 동시에</strong> 누릴 수 있습니다.
                  특히 IRP 내 ETF 매매 시 양도소득세가 없으므로 리밸런싱에 유리합니다.
                </p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.primary, marginBottom: 12 }}>
                  4. 단계별 실행 계획: 3개월 분할 리밸런싱
                </h3>
                <p style={styles.paragraph}>
                  급격한 리밸런싱은 시장 타이밍 리스크와 거래비용 증가를 유발합니다. 따라서 <strong>3개월에 걸친 점진적 조정</strong>을 권장합니다.
                </p>
                <p style={styles.paragraph}>
                  <strong>4월:</strong> KODEX 200에서 17만원 매도 → TIGER 미국S&P500 17만원 매수 (연금저축 내)<br/>
                  <strong>5월:</strong> KODEX 200에서 17만원 매도 → TIGER 미국S&P500 17만원 매수 + CMA에서 10만원 출금 → 비트코인 매수<br/>
                  <strong>6월:</strong> KODEX 200에서 16만원 매도 → TIGER 미국S&P500 16만원 매수 + CMA에서 10만원 출금 → TIGER 미국채10년 매수<br/>
                </p>
                <p style={styles.paragraph}>
                  이렇게 하면 총 50만원의 국내주식을 해외주식으로 전환하고, 현금 20만원을 대체투자와 채권으로 분산할 수 있습니다.
                  연금저축 내 거래는 세금이 없으므로 자유롭게 리밸런싱이 가능하며,
                  CMA 출금은 가족여행 자금 31만원을 유지하면서도 투자 효율을 높이는 방안입니다.
                </p>
              </div>

              <div style={styles.tipBox('info')}>
                <div style={styles.tipTitle('info')}>💡 핵심 권고사항</div>
                <p style={styles.tipText}>
                  1. <strong>해외주식 비중을 50%까지 확대</strong>하여 글로벌 분산투자 실현<br/>
                  2. <strong>국내주식은 20%로 축소</strong>하여 홈 바이어스 해소<br/>
                  3. <strong>현금은 10%로 조정</strong>하여 투자 효율성 제고<br/>
                  4. <strong>비트코인 5% 편입</strong>으로 대체투자 분산 (단, 변동성 감안하여 분할 매수)
                </p>
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.primary, marginBottom: 12 }}>
                  1. 현황 진단: CMA 현금 과다와 기회비용 발생
                </h3>
                <p style={styles.paragraph}>
                  가윤달리오의 포트폴리오는 총 6,562만원으로 상당한 규모이며, 전반적인 자산배분 구조는 양호합니다.
                  그러나 가장 큰 문제점은 <strong>CMA에 1,403만원(21.4%)이라는 거대한 현금이 방치</strong>되어 있다는 점입니다.
                  발행어음 금리가 연 3% 수준이라 해도, S&P500의 장기 평균 수익률 10%와 비교하면 연간 약 100만원의 기회비용이 발생합니다.
                </p>
                <p style={styles.paragraph}>
                  물론 6월에 가족으로부터 2,000만원, 7월에 전세보증금 4,500만원을 수령할 예정이므로
                  어느 정도의 현금 버퍼는 필요합니다. 하지만 현재 CMA 금액은 과도하며,
                  최소 <strong>700만원은 즉시 투자로 전환</strong>해도 유동성에 문제가 없습니다.
                  추가로 유입될 자금까지 고려하면 현금 비중을 10%로 낮춰도 충분한 유동성이 확보됩니다.
                </p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.primary, marginBottom: 12 }}>
                  2. 리스크 평가: 해외주식 비중 양호, 분산 필요
                </h3>
                <p style={styles.paragraph}>
                  해외주식 비중이 42%로 목표(50%)에 근접해 있어 <strong>글로벌 분산투자 측면에서는 양호</strong>합니다.
                  VOO(S&P500)와 SCHD(배당주)의 조합은 성장성과 안정성을 균형있게 추구하는 합리적인 선택입니다.
                  특히 SCHD는 배당성장주에 투자하여 인플레이션 헤지와 현금흐름을 동시에 확보할 수 있습니다.
                </p>
                <p style={styles.paragraph}>
                  다만 <strong>아마존(AMZN) 단일 종목에 270만원(4.1%)이 집중</strong>된 것은 리스크입니다.
                  개별 종목은 시장 전체보다 변동성이 크고, 기업 특수 리스크(경쟁 심화, 규제, CEO 리스크 등)에 노출됩니다.
                  아마존이 우량 기업임은 분명하지만, 개별 종목 비중은 전체의 5% 이내로 제한하는 것이 바람직합니다.
                  장기적으로 이 자금을 VOO나 QQQ 같은 지수 ETF로 전환하는 것을 고려하세요.
                </p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.primary, marginBottom: 12 }}>
                  3. 세금 효율성 분석: ISA 완료, IRP 확대 필요
                </h3>
                <p style={styles.paragraph}>
                  ISA 2,000만원 한도를 거의 채운 것은 <strong>탁월한 절세 전략</strong>입니다.
                  ISA 내 자산 1,938만원에서 발생하는 수익은 200만원까지 비과세, 초과분은 9.9% 분리과세로
                  일반 계좌의 15.4%(배당소득세)나 22%(해외주식 양도세)보다 훨씬 유리합니다.
                </p>
                <p style={styles.paragraph}>
                  반면 <strong>IRP는 27만원에 불과하여 세제혜택을 거의 활용하지 못하고</strong> 있습니다.
                  IRP는 연금저축과 합산 900만원까지 세액공제(13.2~16.5%)를 받을 수 있으며,
                  운용 수익에 대한 과세도 연금 수령 시점까지 이연됩니다.
                  연금저축 600만원 한도를 채웠다면, IRP로 추가 300만원을 납입하여 약 40만원의 세금을 환급받을 수 있습니다.
                </p>
                <p style={styles.paragraph}>
                  TDF2025는 은퇴 시점에 맞춰 자산배분을 자동 조절하는 펀드이지만,
                  30대 초반인 가윤달리오에게 2025 빈티지는 너무 보수적입니다.
                  <strong>TDF2050이나 TIGER 나스닥100 같은 성장형 ETF로 교체</strong>하는 것이 더 적합합니다.
                </p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.primary, marginBottom: 12 }}>
                  4. 단계별 실행 계획: 월별 적립식 리밸런싱
                </h3>
                <p style={styles.paragraph}>
                  가윤달리오의 포트폴리오 규모가 크고, 추가 자금 유입이 예정되어 있으므로
                  <strong>월별 적립식으로 목표 배분에 점진적으로 접근</strong>하는 것이 좋습니다.
                </p>
                <p style={styles.paragraph}>
                  <strong>4월:</strong> CMA에서 200만원 출금 → VOO 100만원 + TIGER 미국채10년 100만원 매수<br/>
                  <strong>5월:</strong> CMA에서 200만원 출금 → VOO 100만원 + 비트코인 100만원 매수<br/>
                  <strong>6월:</strong> 가족 자금 2,000만원 수령 → VOO 200만원 + IRP(나스닥ETF) 100만원 + 비트코인 100만원 + 나머지 CMA 보관<br/>
                  <strong>7월:</strong> 전세보증금 4,500만원 수령 → 별도 자산배분 계획 수립 필요
                </p>
                <p style={styles.paragraph}>
                  연금저축 내 KODEX 200은 <strong>분기별로 50만원씩 TIGER 미국S&P500으로 교체</strong>하여
                  국내주식 비중을 점진적으로 15%까지 낮추세요. 연금계좌 내 거래는 세금이 없으므로 부담없이 리밸런싱할 수 있습니다.
                </p>
              </div>

              <div style={styles.tipBox('info')}>
                <div style={styles.tipTitle('info')}>💡 핵심 권고사항</div>
                <p style={styles.tipText}>
                  1. <strong>CMA 700만원을 투자자산으로 전환</strong>하여 현금 비중 10%로 조정<br/>
                  2. <strong>VOO 비중을 50%까지 확대</strong>하여 S&P500 기반 장기 성장 추구<br/>
                  3. <strong>IRP를 300만원까지 채워</strong> 연간 40만원 세액공제 확보<br/>
                  4. <strong>비트코인 5% 목표</strong>로 추가 매수하여 포트폴리오 분산<br/>
                  5. <strong>TDF2025 → 성장형 ETF로 교체</strong>하여 장기 수익률 극대화
                </p>
              </div>
            </>
          )}
        </div>

        {/* 가윤달리오 전용: 하늘버핏의 리밸런싱 의견 */}
        {personalTab === 'gayoon' && data.haneulOpinion && (
          <div style={{
            ...styles.card,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: COLORS.white,
          }}>
            <h2 style={{ ...styles.cardTitle, color: COLORS.white }}>
              🧠 {data.haneulOpinion.title}
            </h2>
            <p style={{ ...styles.paragraph, color: 'rgba(255,255,255,0.95)', fontSize: isMobile ? 14 : 16, lineHeight: 1.8 }}>
              {data.haneulOpinion.summary}
            </p>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: isMobile ? 16 : 20, marginBottom: 16 }}>
              <h3 style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, marginBottom: 12, color: '#FFD700' }}>
                [현재 상황 분석]
              </h3>
              {data.haneulOpinion.situation.map((item, idx) => (
                <p key={idx} style={{ fontSize: isMobile ? 13 : 14, marginBottom: 8, color: 'rgba(255,255,255,0.9)' }}>
                  • {item}
                </p>
              ))}
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: isMobile ? 16 : 20, marginBottom: 16 }}>
              <h3 style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, marginBottom: 12, color: '#90EE90' }}>
                [핵심 권고사항]
              </h3>
              {data.haneulOpinion.recommendations.map((item, idx) => (
                <p key={idx} style={{ fontSize: isMobile ? 13 : 14, marginBottom: 8, color: 'rgba(255,255,255,0.9)' }}>
                  {idx + 1}. {item}
                </p>
              ))}
            </div>

            {/* 분할 매수/매도 전략 */}
            {data.haneulOpinion.tradingStrategy && (
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: isMobile ? 16 : 20, border: '2px dashed rgba(255,255,255,0.4)' }}>
                <h3 style={{ fontSize: isMobile ? 14 : 16, fontWeight: 700, marginBottom: 16, color: '#FF69B4', display: 'flex', alignItems: 'center', gap: 8 }}>
                  ⚡ {data.haneulOpinion.tradingStrategy.title}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                  <div style={{ backgroundColor: 'rgba(255,107,107,0.3)', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: 12, color: '#FFB3B3', marginBottom: 4, fontWeight: 600 }}>📉 매도 타이밍</div>
                    <div style={{ fontSize: isMobile ? 13 : 14, color: COLORS.white, fontWeight: 500 }}>
                      {data.haneulOpinion.tradingStrategy.sellRule}
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'rgba(144,238,144,0.3)', borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: 12, color: '#90EE90', marginBottom: 4, fontWeight: 600 }}>📈 매수 방법</div>
                    <div style={{ fontSize: isMobile ? 13 : 14, color: COLORS.white, fontWeight: 500 }}>
                      {data.haneulOpinion.tradingStrategy.buyRule}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 가윤달리오 전용: 해외주식 전략 */}
        {personalTab === 'gayoon' && data.overseasStrategy && (
          <div style={{ ...styles.card, border: `2px solid ${COLORS.success}` }}>
            <h2 style={{ ...styles.cardTitle, color: COLORS.success }}>🌍 해외주식 전략 (VOO, SCHD, 아마존)</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              <span style={{ ...styles.badge(COLORS.success), fontSize: 14, padding: '8px 16px' }}>
                {data.overseasStrategy.action}
              </span>
            </div>
            <p style={styles.paragraph}>
              <strong>이유:</strong> {data.overseasStrategy.reason}
            </p>
            <div style={styles.tipBox('warning')}>
              <div style={styles.tipTitle('warning')}>손절 기준</div>
              <p style={styles.tipText}>{data.overseasStrategy.stopLoss}</p>
            </div>
          </div>
        )}

        {/* 가윤달리오 전용: ISA 리밸런싱 가이드 */}
        {personalTab === 'gayoon' && data.isaRebalance && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📋 ISA 리밸런싱 가이드 (삼성증권)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
              {/* 매도 */}
              <div style={{ backgroundColor: '#FFF5F5', borderRadius: 12, padding: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#FF6B6B', marginBottom: 12 }}>📉 매도</h3>
                <table style={{ ...styles.table, marginBottom: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ ...styles.th, backgroundColor: '#FFE4E4' }}>종목</th>
                      <th style={{ ...styles.th, backgroundColor: '#FFE4E4', textAlign: 'right' }}>금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.isaRebalance.sell.map((item, idx) => (
                      <tr key={idx}>
                        <td style={styles.td}>{item.asset}</td>
                        <td style={{ ...styles.td, textAlign: 'right', color: '#FF6B6B', fontWeight: 600 }}>
                          {formatMoney(item.amount)}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: '#FFE4E4' }}>
                      <td style={{ ...styles.td, fontWeight: 700 }}>합계</td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: 700, color: '#FF6B6B' }}>
                        {formatMoney(data.isaRebalance.sell.reduce((sum, i) => sum + i.amount, 0))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* 매수 */}
              <div style={{ backgroundColor: '#F0FFF4', borderRadius: 12, padding: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.success, marginBottom: 12 }}>📈 매수</h3>
                <table style={{ ...styles.table, marginBottom: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ ...styles.th, backgroundColor: '#DCFCE7' }}>종목</th>
                      <th style={{ ...styles.th, backgroundColor: '#DCFCE7', textAlign: 'right' }}>금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.isaRebalance.buy.map((item, idx) => (
                      <tr key={idx}>
                        <td style={styles.td}>{item.asset}</td>
                        <td style={{ ...styles.td, textAlign: 'right', color: COLORS.success, fontWeight: 600 }}>
                          {formatMoney(item.amount)}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: '#DCFCE7' }}>
                      <td style={{ ...styles.td, fontWeight: 700 }}>합계</td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: 700, color: COLORS.success }}>
                        {formatMoney(data.isaRebalance.buy.reduce((sum, i) => sum + i.amount, 0))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ ...styles.tipBox('info'), marginTop: 16, marginBottom: 0 }}>
              <div style={styles.tipTitle('info')}>💡 리밸런싱 이유</div>
              <p style={styles.tipText}>{data.isaRebalance.reason}</p>
            </div>

            {/* 분할 매도/매수 전략 */}
            {data.isaRebalance.sellStrategy && (
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#333', marginBottom: 16 }}>📊 분할 매도/매수 전략</h3>

                {/* 분할 매도 */}
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: '#FF6B6B', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    📉 분할 매도
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#888' }}>총 {formatMoney(data.isaRebalance.sellTotal)}</span>
                  </h4>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ ...styles.table, minWidth: 500 }}>
                      <thead>
                        <tr style={{ backgroundColor: '#FFF5F5' }}>
                          <th style={{ ...styles.th, textAlign: 'center', width: 50 }}>단계</th>
                          <th style={{ ...styles.th, textAlign: 'center', width: 60 }}>수익률</th>
                          <th style={{ ...styles.th, textAlign: 'right' }}>KODEX 200</th>
                          <th style={{ ...styles.th, textAlign: 'right' }}>S&P500</th>
                          <th style={{ ...styles.th, textAlign: 'right' }}>나스닥100</th>
                          <th style={{ ...styles.th, textAlign: 'right', fontWeight: 700 }}>합계</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.isaRebalance.sellStrategy.map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ ...styles.td, textAlign: 'center', fontWeight: 600 }}>{item.step}</td>
                            <td style={{ ...styles.td, textAlign: 'center', color: '#FF6B6B', fontWeight: 600 }}>{item.rate}</td>
                            <td style={{ ...styles.td, textAlign: 'right' }}>{formatMoney(item.items.find(i => i.name === 'KODEX 200')?.amount || 0)}</td>
                            <td style={{ ...styles.td, textAlign: 'right' }}>{formatMoney(item.items.find(i => i.name === 'S&P500')?.amount || 0)}</td>
                            <td style={{ ...styles.td, textAlign: 'right' }}>{formatMoney(item.items.find(i => i.name === '나스닥100')?.amount || 0)}</td>
                            <td style={{ ...styles.td, textAlign: 'right', fontWeight: 700, color: '#FF6B6B' }}>{formatMoney(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>⚠️ {data.isaRebalance.sellNote}</p>
                </div>

                {/* 분할 매수 */}
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: COLORS.success, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    📈 분할 매수
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#888' }}>총 {formatMoney(data.isaRebalance.buyTotal)}</span>
                  </h4>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ ...styles.table, minWidth: 700 }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F0FFF4' }}>
                          <th style={{ ...styles.th, textAlign: 'center', width: 50 }}>단계</th>
                          <th style={{ ...styles.th, textAlign: 'center', width: 60 }}>하락률</th>
                          <th style={{ ...styles.th, textAlign: 'right' }}>미국채10년</th>
                          <th style={{ ...styles.th, textAlign: 'right' }}>금액티브</th>
                          <th style={{ ...styles.th, textAlign: 'right' }}>SOFR달러</th>
                          <th style={{ ...styles.th, textAlign: 'right' }}>신흥국</th>
                          <th style={{ ...styles.th, textAlign: 'right' }}>코스닥150</th>
                          <th style={{ ...styles.th, textAlign: 'right', fontWeight: 700 }}>합계</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.isaRebalance.buyStrategy.map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ ...styles.td, textAlign: 'center', fontWeight: 600 }}>{item.step}</td>
                            <td style={{ ...styles.td, textAlign: 'center', color: COLORS.success, fontWeight: 600 }}>{item.rate}</td>
                            <td style={{ ...styles.td, textAlign: 'right' }}>{item.items.find(i => i.name === '미국채10년')?.amount ? formatMoney(item.items.find(i => i.name === '미국채10년').amount) : '-'}</td>
                            <td style={{ ...styles.td, textAlign: 'right' }}>{item.items.find(i => i.name === '금액티브')?.amount ? formatMoney(item.items.find(i => i.name === '금액티브').amount) : '-'}</td>
                            <td style={{ ...styles.td, textAlign: 'right' }}>{item.items.find(i => i.name === 'SOFR달러')?.amount ? formatMoney(item.items.find(i => i.name === 'SOFR달러').amount) : '-'}</td>
                            <td style={{ ...styles.td, textAlign: 'right' }}>{item.items.find(i => i.name === '신흥국')?.amount ? formatMoney(item.items.find(i => i.name === '신흥국').amount) : '-'}</td>
                            <td style={{ ...styles.td, textAlign: 'right' }}>{item.items.find(i => i.name === '코스닥150')?.amount ? formatMoney(item.items.find(i => i.name === '코스닥150').amount) : '-'}</td>
                            <td style={{ ...styles.td, textAlign: 'right', fontWeight: 700, color: COLORS.success }}>{formatMoney(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>💡 {data.isaRebalance.buyNote}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 가윤달리오 전용: 연금저축 리밸런싱 가이드 */}
        {personalTab === 'gayoon' && data.pensionRebalance && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📋 연금저축 리밸런싱 가이드 (미래에셋)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>
              {/* 매도 */}
              <div style={{ backgroundColor: '#FFF5F5', borderRadius: 12, padding: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#FF6B6B', marginBottom: 12 }}>📉 매도</h3>
                <table style={{ ...styles.table, marginBottom: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ ...styles.th, backgroundColor: '#FFE4E4' }}>종목</th>
                      <th style={{ ...styles.th, backgroundColor: '#FFE4E4', textAlign: 'right' }}>금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.pensionRebalance.sell.map((item, idx) => (
                      <tr key={idx}>
                        <td style={styles.td}>{item.asset}</td>
                        <td style={{ ...styles.td, textAlign: 'right', color: '#FF6B6B', fontWeight: 600 }}>
                          {formatMoney(item.amount)}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: '#FFE4E4' }}>
                      <td style={{ ...styles.td, fontWeight: 700 }}>합계</td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: 700, color: '#FF6B6B' }}>
                        {formatMoney(data.pensionRebalance.sell.reduce((sum, i) => sum + i.amount, 0))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* 매수 */}
              <div style={{ backgroundColor: '#F0FFF4', borderRadius: 12, padding: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.success, marginBottom: 12 }}>📈 매수</h3>
                <table style={{ ...styles.table, marginBottom: 0 }}>
                  <thead>
                    <tr>
                      <th style={{ ...styles.th, backgroundColor: '#DCFCE7' }}>종목</th>
                      <th style={{ ...styles.th, backgroundColor: '#DCFCE7', textAlign: 'right' }}>금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.pensionRebalance.buy.map((item, idx) => (
                      <tr key={idx}>
                        <td style={styles.td}>{item.asset}</td>
                        <td style={{ ...styles.td, textAlign: 'right', color: COLORS.success, fontWeight: 600 }}>
                          {formatMoney(item.amount)}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: '#DCFCE7' }}>
                      <td style={{ ...styles.td, fontWeight: 700 }}>합계</td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: 700, color: COLORS.success }}>
                        {formatMoney(data.pensionRebalance.buy.reduce((sum, i) => sum + i.amount, 0))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ ...styles.tipBox('info'), marginTop: 16, marginBottom: 0 }}>
              <div style={styles.tipTitle('info')}>💡 리밸런싱 이유</div>
              <p style={styles.tipText}>{data.pensionRebalance.reason}</p>
            </div>

            {/* 분할 매도/매수 전략 */}
            {data.pensionRebalance.sellStrategy && (
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#333', marginBottom: 16 }}>📊 분할 매도/매수 전략</h3>

                {/* 분할 매도 */}
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: '#FF6B6B', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    📉 분할 매도
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#888' }}>총 {formatMoney(data.pensionRebalance.sellTotal)}</span>
                  </h4>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ ...styles.table, minWidth: 400 }}>
                      <thead>
                        <tr style={{ backgroundColor: '#FFF5F5' }}>
                          <th style={{ ...styles.th, textAlign: 'center', width: 50 }}>단계</th>
                          <th style={{ ...styles.th, textAlign: 'center', width: 60 }}>수익률</th>
                          <th style={{ ...styles.th, textAlign: 'right' }}>KODEX 200</th>
                          <th style={{ ...styles.th, textAlign: 'right', fontWeight: 700 }}>합계</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.pensionRebalance.sellStrategy.map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ ...styles.td, textAlign: 'center', fontWeight: 600 }}>{item.step}</td>
                            <td style={{ ...styles.td, textAlign: 'center', color: '#FF6B6B', fontWeight: 600 }}>{item.rate}</td>
                            <td style={{ ...styles.td, textAlign: 'right' }}>{formatMoney(item.items[0]?.amount || 0)}</td>
                            <td style={{ ...styles.td, textAlign: 'right', fontWeight: 700, color: '#FF6B6B' }}>{formatMoney(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>⚠️ {data.pensionRebalance.sellNote}</p>
                </div>

                {/* 분할 매수 */}
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: COLORS.success, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    📈 분할 매수
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#888' }}>총 {formatMoney(data.pensionRebalance.buyTotal)}</span>
                  </h4>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ ...styles.table, minWidth: 700 }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F0FFF4' }}>
                          <th style={{ ...styles.th, textAlign: 'center', width: 50 }}>단계</th>
                          <th style={{ ...styles.th, textAlign: 'center', width: 60 }}>하락률</th>
                          <th style={{ ...styles.th, textAlign: 'right' }}>미국채10년</th>
                          <th style={{ ...styles.th, textAlign: 'right' }}>금액티브</th>
                          <th style={{ ...styles.th, textAlign: 'right' }}>SOFR달러</th>
                          <th style={{ ...styles.th, textAlign: 'right' }}>코스닥150</th>
                          <th style={{ ...styles.th, textAlign: 'right' }}>S&P500</th>
                          <th style={{ ...styles.th, textAlign: 'right' }}>나스닥100</th>
                          <th style={{ ...styles.th, textAlign: 'right', fontWeight: 700 }}>합계</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.pensionRebalance.buyStrategy.map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ ...styles.td, textAlign: 'center', fontWeight: 600 }}>{item.step}</td>
                            <td style={{ ...styles.td, textAlign: 'center', color: COLORS.success, fontWeight: 600 }}>{item.rate}</td>
                            <td style={{ ...styles.td, textAlign: 'right' }}>{item.items.find(i => i.name === '미국채10년')?.amount ? formatMoney(item.items.find(i => i.name === '미국채10년').amount) : '-'}</td>
                            <td style={{ ...styles.td, textAlign: 'right' }}>{item.items.find(i => i.name === '금액티브')?.amount ? formatMoney(item.items.find(i => i.name === '금액티브').amount) : '-'}</td>
                            <td style={{ ...styles.td, textAlign: 'right' }}>{item.items.find(i => i.name === 'SOFR달러')?.amount ? formatMoney(item.items.find(i => i.name === 'SOFR달러').amount) : '-'}</td>
                            <td style={{ ...styles.td, textAlign: 'right' }}>{item.items.find(i => i.name === '코스닥150')?.amount ? formatMoney(item.items.find(i => i.name === '코스닥150').amount) : '-'}</td>
                            <td style={{ ...styles.td, textAlign: 'right' }}>{item.items.find(i => i.name === 'S&P500')?.amount ? formatMoney(item.items.find(i => i.name === 'S&P500').amount) : '-'}</td>
                            <td style={{ ...styles.td, textAlign: 'right' }}>{item.items.find(i => i.name === '나스닥100')?.amount ? formatMoney(item.items.find(i => i.name === '나스닥100').amount) : '-'}</td>
                            <td style={{ ...styles.td, textAlign: 'right', fontWeight: 700, color: COLORS.success }}>{formatMoney(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p style={{ fontSize: 12, color: '#888', marginTop: 8 }}>💡 {data.pensionRebalance.buyNote}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 가윤달리오 전용: 월가 전설들 평가 */}
        {personalTab === 'gayoon' && data.legends && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🏛️ 월가 전설들의 평가</h2>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 24 }}>
              {data.legends.map((legend, idx) => (
                <div key={idx} style={{
                  backgroundColor: COLORS.background,
                  borderRadius: 12,
                  padding: 16,
                  borderLeft: `4px solid ${legend.color}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 24 }}>{legend.icon}</span>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.textPrimary }}>{legend.name}</div>
                        <div style={{ fontSize: 12, color: COLORS.textSecondary }}>{legend.style}</div>
                      </div>
                    </div>
                    <div style={{
                      backgroundColor: legend.color,
                      color: COLORS.white,
                      fontSize: 16,
                      fontWeight: 700,
                      padding: '6px 12px',
                      borderRadius: 8,
                    }}>
                      {legend.rating}
                    </div>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: COLORS.textPrimary, margin: 0 }}>
                    "{legend.comment}"
                  </p>
                </div>
              ))}
            </div>

            {/* 종합 평점 */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: 16,
              padding: isMobile ? 20 : 28,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>종합 평점</div>
              <div style={{
                fontSize: isMobile ? 48 : 64,
                fontWeight: 800,
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 12,
              }}>
                {data.overallGrade}
              </div>
              <p style={{ fontSize: isMobile ? 14 : 16, color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.6 }}>
                "{data.overallComment}"
              </p>
            </div>
          </div>
        )}

        {/* 가윤달리오 전용: 기회 매수 전략 */}
        {personalTab === 'gayoon' && data.opportunityBuy && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🎯 {data.opportunityBuy.title}</h2>

            {/* CMA 현금 확보 전략 */}
            <div style={{
              backgroundColor: '#FFF9E6',
              borderRadius: 12,
              padding: isMobile ? 16 : 20,
              marginBottom: 20,
              borderLeft: '4px solid #F59E0B',
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#B45309', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                💰 {data.opportunityBuy.cashStrategy.title}
              </h3>
              <p style={{ fontSize: isMobile ? 13 : 14, lineHeight: 1.7, color: COLORS.textPrimary, marginBottom: 8 }}>
                {data.opportunityBuy.cashStrategy.reason}
              </p>
              <span style={{
                display: 'inline-block',
                backgroundColor: '#F59E0B',
                color: COLORS.white,
                fontSize: 13,
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: 20,
              }}>
                {data.opportunityBuy.cashStrategy.status}
              </span>
            </div>

            {/* 월별 기회 매수 플랜 */}
            <div style={{
              backgroundColor: COLORS.primaryLight,
              borderRadius: 12,
              padding: isMobile ? 16 : 20,
              marginBottom: 20,
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.primary, marginBottom: 12 }}>
                📅 {data.opportunityBuy.monthlyPlan.title}
              </h3>
              <p style={{ fontSize: isMobile ? 13 : 14, lineHeight: 1.7, color: COLORS.textPrimary, marginBottom: 12 }}>
                {data.opportunityBuy.monthlyPlan.description}
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <span style={styles.badge(COLORS.primary)}>{data.opportunityBuy.monthlyPlan.frequency}</span>
                <span style={styles.badge(COLORS.success)}>{data.opportunityBuy.monthlyPlan.amount}</span>
              </div>
            </div>

            {/* 이번 달 추천 종목 */}
            <div style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              borderRadius: 16,
              padding: isMobile ? 20 : 24,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#FFD700', marginBottom: 20, textAlign: 'center' }}>
                ⭐ {data.opportunityBuy.thisMonth.title}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                {data.opportunityBuy.thisMonth.picks.map((pick, idx) => (
                  <div key={idx} style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    padding: 16,
                    borderTop: `4px solid ${pick.color}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.white }}>{pick.ticker}</div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{pick.name}</div>
                      </div>
                      <span style={{
                        backgroundColor: pick.color,
                        color: COLORS.white,
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '4px 8px',
                        borderRadius: 4,
                      }}>
                        {pick.sector}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                      {pick.reason}
                    </p>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 16, marginBottom: 0 }}>
                * 하락 시 분할 매수 권장 | 투자 전 본인의 판단 필요
              </p>
            </div>
          </div>
        )}

        {/* 실행 우선순위 */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🚀 실행 우선순위 (Q2 2026)</h2>

          <div style={styles.stepContainer}>
            <div style={styles.stepNumber}>1</div>
            <div style={styles.stepContent}>
              <h3 style={styles.stepTitle}>즉시 실행 (이번 주)</h3>
              <p style={{ ...styles.paragraph, marginBottom: 0 }}>
                {personalTab === 'haneul'
                  ? 'IRP 예수금 25만원 → TIGER 미국S&P500 매수'
                  : 'IRP TDF2025 매도 → TIGER 나스닥100 매수 + 월 100만원 IRP 추가 납입 시작'}
              </p>
            </div>
          </div>

          <div style={styles.stepContainer}>
            <div style={styles.stepNumber}>2</div>
            <div style={styles.stepContent}>
              <h3 style={styles.stepTitle}>단기 실행 (4월 중)</h3>
              <p style={{ ...styles.paragraph, marginBottom: 0 }}>
                {personalTab === 'haneul'
                  ? '연금저축 내 KODEX 200 → TIGER 미국S&P500 비중 전환 시작 (17만원)'
                  : 'CMA 700만원 중 200만원 → VOO + 채권 ETF 매수'}
              </p>
            </div>
          </div>

          <div style={styles.stepContainer}>
            <div style={styles.stepNumber}>3</div>
            <div style={styles.stepContent}>
              <h3 style={styles.stepTitle}>중기 실행 (5-6월)</h3>
              <p style={{ ...styles.paragraph, marginBottom: 0 }}>
                {personalTab === 'haneul'
                  ? 'CMA 20만원 출금 → 비트코인 10만원 + 채권 10만원 분할 매수'
                  : '비트코인 200만원 분할 매수 (월 100만원씩) + 연금저축 내 국내주식 비중 축소'}
              </p>
            </div>
          </div>
        </div>

        <div style={styles.tipBox('warning')}>
          <div style={styles.tipTitle('warning')}>⚠️ 주의사항</div>
          <p style={styles.tipText}>
            본 분석은 일반적인 투자 가이드라인을 기반으로 한 참고 자료입니다.
            실제 투자 결정 전 개인의 재무 상황, 위험 허용도, 투자 목표를 충분히 고려하세요.
            암호화폐는 높은 변동성이 있으므로 감당 가능한 금액만 투자하시기 바랍니다.
          </p>
        </div>
      </>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'personal': return renderPersonal()
      case 'overview': return renderOverview()
      case 'strategy': return renderStrategy()
      case 'allocation': return renderAllocation()
      case 'execution': return renderExecution()
      case 'tax': return renderTax()
      case 'lifecycle': return renderLifecycle()
      case 'mistakes': return renderMistakes()
      case 'glossary': return renderGlossary()
      default: return renderPersonal()
    }
  }

  return (
    <div style={styles.container}>
      {/* 히어로 섹션 */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>리밸런싱 가이드</h1>
        <p style={styles.heroSubtitle}>
          체계적인 포트폴리오 관리로 장기 투자 성과를 높이세요.
          <br />
          리스크 관리와 규율 있는 투자의 핵심 전략을 알려드립니다.
        </p>
      </div>

      {/* 탭 바 */}
      <div style={styles.tabsWrapper}>
        <div style={styles.tabsContainer} ref={tabsRef}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              data-tab={tab.id}
              style={styles.tab(activeTab === tab.id)}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div style={styles.content}>
        {renderContent()}
      </div>
    </div>
  )
}
