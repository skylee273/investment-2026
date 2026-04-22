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

    // 하늘버핏 데이터 (2026.04.22 기준)
    const haneulData = {
      total: 4981364,
      portfolio: [
        { account: '연금저축', asset: 'KODEX 200, 코스닥150, 나스닥100', amount: 1757300, ratio: 35.3 },
        { account: 'ISA', asset: '코스닥150, 미국채, S&P500', amount: 508635, ratio: 10.2 },
        { account: '해외주식', asset: 'CVX, GOOG, KHC, S&P500', amount: 1587887, ratio: 31.9 },
        { account: 'IRP', asset: '나스닥100, 국채', amount: 263861, ratio: 5.3 },
        { account: 'CMA', asset: '발행어음', amount: 863681, ratio: 17.3 },
      ],
      // 연금저축 상세 (미래에셋)
      pensionHoldings: {
        total: 1757300,
        invested: 1662595,
        gain: 94705,
        gainPercent: 5.69,
        items: [
          { name: 'KODEX 200', currentKRW: 778400, investedKRW: 696430, gainPercent: 11.77 },
          { name: 'KODEX 코스닥150', currentKRW: 874280, investedKRW: 874005, gainPercent: 0.03 },
          { name: 'KODEX 미국나스닥100', currentKRW: 104620, investedKRW: 92160, gainPercent: 13.52 },
        ],
      },
      // ISA 상세 (미래에셋)
      isaHoldings: {
        total: 508635,
        invested: 496290,
        gain: 12345,
        gainPercent: 2.49,
        items: [
          { name: 'KODEX 코스닥150', currentKRW: 99350, investedKRW: 101075, gainPercent: -1.71 },
          { name: 'TIGER 미국채10년선물', currentKRW: 200925, investedKRW: 198375, gainPercent: 1.29 },
          { name: 'TIGER 미국S&P500', currentKRW: 208360, investedKRW: 196840, gainPercent: 5.85 },
        ],
      },
      // IRP 상세 (미래에셋)
      irpHoldings: {
        total: 263861,
        invested: 250366,
        gain: 13495,
        gainPercent: 5.40,
        items: [
          { name: 'TIGER 미국나스닥100', currentKRW: 173860, investedKRW: 160815, gainPercent: 8.11 },
          { name: 'KODEX 미국10년국채액티브(H)', currentKRW: 89325, investedKRW: 88875, gainPercent: 0.51 },
          { name: '현금성자산', currentKRW: 676, investedKRW: 0, gainPercent: 0 },
        ],
      },
      // 해외주식 상세 (미래에셋 종합)
      overseasHoldings: {
        total: 1587887,
        invested: 1542884,
        gain: 45003,
        gainPercent: 2.92,
        items: [
          { name: '셰브론 (CVX)', currentKRW: 555958, investedKRW: 555345, gainPercent: 0.11, type: '해외' },
          { name: '알파벳 C (GOOG)', currentKRW: 490644, investedKRW: 457022, gainPercent: 7.36, type: '해외' },
          { name: '크래프트 하인즈 (KHC)', currentKRW: 226967, investedKRW: 227224, gainPercent: -0.11, type: '해외' },
          { name: 'TIGER 미국S&P500', currentKRW: 182315, investedKRW: 174090, gainPercent: 4.72, type: 'ETF' },
          { name: '1Q 미국S&P500미국채혼합', currentKRW: 119050, investedKRW: 116250, gainPercent: 2.41, type: 'ETF' },
          { name: '미국달러', currentKRW: 12953, investedKRW: 12953, gainPercent: 0, type: '현금' },
        ],
      },
      allocation: [
        { category: '해외주식(S&P/나스닥)', current: 32, target: 50, gap: -18 },
        { category: '국내주식', current: 35, target: 20, gap: 15 },
        { category: '채권/금', current: 8, target: 10, gap: -2 },
        { category: '현금', current: 17, target: 10, gap: 7 },
        { category: '대체투자(암호화폐)', current: 0, target: 5, gap: -5 },
        { category: '개별종목', current: 8, target: 5, gap: 3 },
      ],
      sellRecommend: [
        { asset: 'KODEX 200', current: 778400, sell: 400000, reason: '국내주식 비중 축소' },
        { asset: 'KODEX 코스닥150', current: 973630, sell: 500000, reason: '국내주식 비중 축소' },
        { asset: 'CMA', current: 863681, sell: 300000, reason: '현금 과다 조정' },
      ],
      buyRecommend: [
        { asset: 'TIGER 미국S&P500', target: 390675, buy: 600000, reason: '해외주식 비중 50%까지 확대' },
        { asset: 'TIGER 미국채10년', target: 200925, buy: 200000, reason: '안전자산 확보' },
        { asset: '비트코인', target: 0, buy: 200000, reason: '대체투자 5% 분산' },
        { asset: 'KODEX 금액티브', target: 0, buy: 200000, reason: '인플레 헤지' },
      ],
      // 리밸런싱 전략
      rebalanceStrategy: {
        pension: {
          action: 'KODEX 200/코스닥150 → S&P500 전환',
          sell: [
            { asset: 'KODEX 200', amount: 400000, reason: '국내 비중 축소' },
            { asset: 'KODEX 코스닥150', amount: 400000, reason: '변동성 축소' },
          ],
          buy: [
            { asset: 'TIGER 미국S&P500', amount: 600000, reason: '해외주식 확대' },
            { asset: 'TIGER 미국채10년', amount: 200000, reason: '안정성 확보' },
          ],
        },
        isa: {
          action: '현재 배분 양호, 소폭 조정',
          note: '코스닥150을 S&P500으로 교체 권장',
          sell: [
            { asset: 'KODEX 코스닥150', amount: 99350, reason: '변동성 축소' },
          ],
          buy: [
            { asset: 'TIGER 미국S&P500', amount: 100000, reason: '해외주식 확대' },
          ],
        },
        irp: {
          action: '현재 배분 우수, 유지',
          note: '나스닥100 + 국채 조합 적절',
          additionalBuy: [
            { asset: 'KODEX 금액티브', amount: 50000, reason: '금 비중 추가' },
          ],
        },
        overseas: {
          action: 'Hold (계속 보유)',
          note: '개별주 CVX, GOOG, KHC는 배당/성장 목적 장기 보유',
          stopLoss: '-20% 이상 하락 시 재검토',
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
          comment: '셰브론(CVX)은 좋은 선택이에요! 배당 귀족주답게 꾸준히 배당금을 받을 수 있죠. 알파벳(GOOG)도 견조하고요. 다만 국내주식 비중(35%)이 높고, 개별종목 대신 S&P500 ETF에 더 집중하면 좋겠어요.',
        },
        {
          name: '레이 달리오',
          style: '올웨더',
          icon: '🌊',
          color: '#3182F6',
          rating: 'B',
          comment: '채권(8%)과 금(0%) 비중이 너무 낮아요. 올웨더 포트폴리오는 채권 55%, 금 7.5%를 권장하거든요. IRP에 국채 ETF가 있는 건 좋지만, 전체적으로 안전자산을 더 늘리세요.',
        },
        {
          name: '피터 린치',
          style: '성장주',
          icon: '📈',
          color: '#10B981',
          rating: 'A',
          comment: '오! 알파벳(+7.36%)과 셰브론으로 직접 투자하는 건 마음에 드네요! 하지만 크래프트 하인즈는 성장성이 낮아 보여요. 그 자금으로 테슬라나 아마존 같은 성장주를 고려해보세요.',
        },
        {
          name: '존 보글',
          style: '인덱스',
          icon: '📊',
          color: '#8B5CF6',
          rating: 'B+',
          comment: 'S&P500 ETF 보유는 좋습니다! 하지만 개별주식(CVX, GOOG, KHC)에 25%나 투자하고 있네요. 장기적으로는 인덱스 펀드에 집중하는 게 더 나을 수 있어요. 수수료도 낮고요.',
        },
        {
          name: '하워드 막스',
          style: '리스크',
          icon: '⚖️',
          color: '#EF4444',
          rating: 'B+',
          comment: '현금(17%)을 많이 들고 있어서 하락장에서 기회를 잡을 수 있겠네요! 다만 암호화폐가 없어서 리스크 분산이 조금 아쉬워요. 비트코인 5% 정도 추가하면 어떨까요?',
        },
        {
          name: '가윤달리오',
          style: '든든한 언니',
          icon: '👩‍💼',
          color: '#EC4899',
          rating: 'A',
          comment: '하늘아 포트폴리오 잘 구성했어! 셰브론이랑 알파벳 직접 산 거 대견하다~ 다만 국내주식이 좀 많으니까 S&P500으로 조금씩 바꿔가자! 그리고 비트코인도 조금 사보자 ㅋㅋ 나도 들고 있어~ 💪',
        },
      ],
      overallGrade: 'B+',
      overallComment: '세제혜택 계좌(연금저축, ISA, IRP) 활용 우수. 개별주식(CVX, GOOG, KHC) 직접 투자로 배당+성장 추구. 다만 국내주식 비중이 높고 암호화폐 없음. 해외주식 비중을 50%까지 확대 권장.',
    }

    // 가윤달리오 데이터 (2026.04.22 기준)
    const gayoonData = {
      total: 87450618,
      portfolio: [
        { account: '해외주식(삼성)', asset: 'VOO, SCHD, 케이뱅크', amount: 26399608, ratio: 30.2 },
        { account: 'ISA(삼성)', asset: 'S&P500, 나스닥, 신흥국, 채권, 금', amount: 21231426, ratio: 24.3 },
        { account: '연금저축(미래)', asset: 'KODEX200, 고배당, S&P500, 나스닥', amount: 15485830, ratio: 17.7 },
        { account: 'CMA(미래)', asset: '발행어음', amount: 10063001, ratio: 11.5 },
        { account: 'IRP(미래)', asset: '금, 신흥국, 나스닥, TDF', amount: 3312857, ratio: 3.8 },
        { account: '암호화폐', asset: 'BTC', amount: 1344337, ratio: 1.5 },
      ],
      // ISA 상세 (삼성증권)
      isaHoldings: {
        total: 21231426,
        invested: 20520572,
        gain: 710854,
        gainPercent: 3.46,
        items: [
          { name: 'TIGER 미국S&P500', currentKRW: 5156910, investedKRW: 4888810, gainPercent: 5.48 },
          { name: 'PLUS 신흥국MSCI(합성H)', currentKRW: 3101760, investedKRW: 3096180, gainPercent: 0.18 },
          { name: 'TIGER 미국나스닥100', currentKRW: 2966840, investedKRW: 2730767, gainPercent: 8.64 },
          { name: 'TIGER 미국채10년선물', currentKRW: 2451285, investedKRW: 2405385, gainPercent: 1.91 },
          { name: 'KODEX 금액티브', currentKRW: 2036880, investedKRW: 2133740, gainPercent: -4.54 },
          { name: 'KODEX 200', currentKRW: 1459500, investedKRW: 1243665, gainPercent: 17.35 },
          { name: 'TIGER 미국배당다우존스', currentKRW: 1416200, investedKRW: 1408020, gainPercent: 0.58 },
          { name: 'ACE 미국30년국채액티브(H)', currentKRW: 1079650, investedKRW: 1078935, gainPercent: 0.07 },
          { name: 'TIGER CD금리투자KIS', currentKRW: 1032930, investedKRW: 1032750, gainPercent: 0.02 },
          { name: 'KODEX 코스닥150', currentKRW: 516620, investedKRW: 502320, gainPercent: 2.85 },
          { name: 'ISA 예수금', currentKRW: 12851, investedKRW: 0, gainPercent: 0 },
        ],
      },
      // IRP 상세 (미래에셋)
      irpHoldings: {
        total: 3312857,
        invested: 3268547,
        gain: 44310,
        gainPercent: 1.36,
        items: [
          { name: 'KODEX 미국나스닥100', currentKRW: 1307750, investedKRW: 1268800, gainPercent: 3.07 },
          { name: 'IRP 현금성자산', currentKRW: 722371, investedKRW: 722371, gainPercent: 0 },
          { name: 'KODEX 금액티브', currentKRW: 590400, investedKRW: 595200, gainPercent: -0.81 },
          { name: 'PLUS 신흥국MSCI(합성H)', currentKRW: 416440, investedKRW: 414697, gainPercent: 0.42 },
          { name: '미래에셋TDF2025', currentKRW: 275896, investedKRW: 267479, gainPercent: 3.15 },
        ],
      },
      // 연금저축 상세 (미래에셋)
      pensionHoldings: {
        total: 15485830,
        invested: 15102380,
        gain: 383450,
        gainPercent: 2.54,
        items: [
          { name: 'TIGER 미국S&P500', currentKRW: 3542120, investedKRW: 3502680, gainPercent: 1.13 },
          { name: 'KODEX 200', currentKRW: 3210900, investedKRW: 2947335, gainPercent: 8.94 },
          { name: 'KODEX 코스닥150', currentKRW: 3099720, investedKRW: 3080430, gainPercent: 0.63 },
          { name: 'TIGER 미국나스닥100', currentKRW: 2268760, investedKRW: 2198010, gainPercent: 3.22 },
          { name: 'PLUS 고배당주', currentKRW: 1508650, investedKRW: 1514975, gainPercent: -0.42 },
          { name: 'KODEX 금액티브', currentKRW: 885600, investedKRW: 892800, gainPercent: -0.81 },
          { name: 'TIGER 미국배당다우존스', currentKRW: 511000, investedKRW: 507150, gainPercent: 0.76 },
          { name: 'TIGER CD금리투자KIS', currentKRW: 459080, investedKRW: 459000, gainPercent: 0.02 },
        ],
      },
      // 해외주식 상세 (삼성증권 + 미래에셋 종합)
      overseasHoldings: {
        total: 26399608,
        invested: 22841816,
        gain: 3557792,
        gainPercent: 15.58,
        etfItems: [
          { name: 'VOO (S&P500)', currentKRW: 21062208, investedKRW: 18034965, gainPercent: 16.79 },
          { name: 'VOO 소수점', currentKRW: 706131, investedKRW: 676691, gainPercent: 4.35 },
          { name: 'SCHD (배당)', currentKRW: 4567569, investedKRW: 4047160, gainPercent: 12.86 },
          { name: '케이뱅크', currentKRW: 63700, investedKRW: 83000, gainPercent: -23.25 },
        ],
      },
      // 개별주식 (미래에셋 종합)
      individualStocks: [
        { ticker: 'AMZN', name: '아마존', amount: 1854752, gainPercent: 16.22, type: '해외' },
        { ticker: 'CVX', name: '셰브론', amount: 1645472, gainPercent: 0.97, type: '해외' },
        { ticker: 'UNH', name: '유나이티드헬스', amount: 3592135, gainPercent: 9.16, type: '해외' },
        { ticker: 'KIA', name: '기아', amount: 480000, gainPercent: 1.14, type: '국내' },
        { ticker: 'SAMSUNG_FIRE', name: '삼성화재', amount: 923000, gainPercent: -2.12, type: '국내' },
        { ticker: 'SKT', name: 'SK텔레콤', amount: 401200, gainPercent: 1.21, type: '국내' },
        { ticker: 'HANA', name: '하나금융지주', amount: 717000, gainPercent: -3.55, type: '국내' },
      ],
      individualTotal: 9613559,
      allocation: [
        { category: '해외주식(S&P/배당)', current: 41, target: 50, gap: -9 },
        { category: '국내주식', current: 17, target: 15, gap: 2 },
        { category: '채권/금', current: 8, target: 10, gap: -2 },
        { category: '현금', current: 12, target: 10, gap: 2 },
        { category: '신흥국/대체', current: 5, target: 10, gap: -5 },
        { category: '암호화폐', current: 2, target: 5, gap: -3 },
      ],
      // 해외주식 전략
      overseasStrategy: {
        action: 'Hold (계속 보유)',
        reason: '올해 이미 250만원 수익 실현, 매도 시 세금 발생',
        stopLoss: '-20% 이상 하락 시 재검토',
      },
      // ISA 리밸런싱 (삼성증권) - 목표 비중 기반
      isaRebalance: {
        targetTotal: 20000000, // ISA 목표 2,000만원
        sell: [
          { asset: 'KODEX 200 전량', amount: 3000000 },
          { asset: 'PLUS 신흥국MSCI 전량', amount: 3000000 },
        ],
        buy: [
          { asset: 'TIGER 미국배당다우존스', amount: 4000000, ratio: 20 },
          { asset: 'TIGER S&P500', amount: 3000000, ratio: 15 },
          { asset: 'PLUS 고배당주', amount: 2000000, ratio: 10 },
          { asset: 'TIGER 미국채10년선물', amount: 2000000, ratio: 10 },
          { asset: 'KODEX 금액티브', amount: 2000000, ratio: 10 },
          { asset: 'TIGER CD금리액티브', amount: 2000000, ratio: 10 },
          { asset: 'TIGER 미국채30년선물', amount: 1600000, ratio: 8 },
          { asset: 'TIGER SOFR금리액티브', amount: 1400000, ratio: 7 },
          { asset: 'TIGER 나스닥100', amount: 1000000, ratio: 5 },
          { asset: 'KODEX 200', amount: 1000000, ratio: 5 },
        ],
        reason: '목표 포트폴리오 비중에 맞춰 리밸런싱 (배당주 30% + 안전자산 45% + 성장주 25%)',
      },
      // 연금저축 리밸런싱 (미래에셋) - 목표 비중 기반
      pensionRebalance: {
        targetTotal: 15000000, // 연금저축 목표 1,500만원
        sell: [
          { asset: 'KODEX 200 전량', amount: 2000000 },
        ],
        buy: [
          { asset: 'TIGER 미국배당다우존스', amount: 3000000, ratio: 20 },
          { asset: 'TIGER S&P500', amount: 2250000, ratio: 15 },
          { asset: 'PLUS 고배당주', amount: 1500000, ratio: 10 },
          { asset: 'TIGER 미국채10년선물', amount: 1500000, ratio: 10 },
          { asset: 'KODEX 금액티브', amount: 1500000, ratio: 10 },
          { asset: 'TIGER CD금리액티브', amount: 1500000, ratio: 10 },
          { asset: 'TIGER 미국채30년선물', amount: 1200000, ratio: 8 },
          { asset: 'TIGER SOFR금리액티브', amount: 1050000, ratio: 7 },
          { asset: 'TIGER 나스닥100', amount: 750000, ratio: 5 },
          { asset: 'KODEX 코스닥150', amount: 750000, ratio: 5 },
        ],
        reason: '목표 포트폴리오 비중에 맞춰 리밸런싱 (배당주 30% + 안전자산 45% + 성장주 25%)',
      },
      sellRecommend: [
        { asset: 'KODEX 200 (ISA)', current: 3000000, sell: 3000000, reason: '신흥국MSCI와 함께 매도 후 재편입' },
        { asset: 'PLUS 신흥국MSCI (ISA)', current: 3000000, sell: 3000000, reason: '목표 포트폴리오에 없음' },
        { asset: 'KODEX 200 (연금)', current: 2000000, sell: 2000000, reason: '코스닥150으로 전환' },
      ],
      buyRecommend: [
        { asset: 'TIGER 미국배당다우존스', target: 20, buy: 4000000, reason: '배당 수익 20%' },
        { asset: 'TIGER S&P500', target: 15, buy: 3000000, reason: '핵심 자산 15%' },
        { asset: 'PLUS 고배당주', target: 10, buy: 2000000, reason: '국내 배당 10%' },
        { asset: 'TIGER 미국채10년선물', target: 10, buy: 2000000, reason: '중기채 10%' },
        { asset: 'KODEX 금액티브', target: 10, buy: 2000000, reason: '인플레 헤지 10%' },
        { asset: 'TIGER CD금리액티브', target: 10, buy: 2000000, reason: '안전자산 10%' },
        { asset: 'TIGER 미국채30년선물', target: 8, buy: 1600000, reason: '장기채 8%' },
        { asset: 'TIGER SOFR금리액티브', target: 7, buy: 1400000, reason: '달러 안전자산 7%' },
        { asset: 'TIGER 나스닥100', target: 5, buy: 1000000, reason: '성장주 5%' },
        { asset: 'KODEX 200', target: 5, buy: 1000000, reason: '국내주식 5%' },
      ],
      // 하늘버핏의 리밸런싱 의견
      haneulOpinion: {
        title: '하늘버핏의 리밸런싱 의견',
        summary: '가윤님의 세제혜택 계좌(IRP+ISA+연금저축)를 목표 포트폴리오 비중에 맞춰 리밸런싱하세요. 배당주 30%, 해외성장주 20%, 안전자산 45%, 국내주식 5%의 균형잡힌 배분으로 안정성과 성장을 동시에 추구합니다.',
        situation: [
          '해외주식: +250만원 수익 중. 양도소득세 고려 시 계속 보유가 유리',
          'ISA/연금: KODEX 200, 신흥국MSCI → 목표 비중으로 전환 필요',
          '목표: 배당주 30% + S&P500 15% + 나스닥 5% + 채권 18% + 금 10% + CD/SOFR 17% + 국내 5%',
        ],
        recommendations: [
          '해외주식(VOO, SCHD, 아마존): Hold - 세금 효율성 우선',
          'ISA: KODEX 200, 신흥국 매도 → 목표 비중대로 재투자',
          '연금저축: KODEX 200 → KODEX 코스닥150으로 전환',
          '손절 기준: 개별 종목 -20% 도달 시 재검토',
        ],
        tradingStrategy: {
          title: '분할 매수/매도 전략',
          sellRule: '7~20% 수익 구간에서 차익 실현',
          buyRule: '한 번에 몰빵 금지! 4월 동안 일자를 나눠서, 내려갈 때 조금씩 더 사는 방식으로 분할 매수',
        },
        // 세제혜택 계좌 목표 포트폴리오 (IRP+ISA+연금저축 통합)
        targetPortfolio: {
          title: '세제혜택 계좌 목표 비중',
          subtitle: 'IRP + ISA + 연금저축 통합',
          items: [
            { name: 'TIGER 미국배당다우존스', ratio: 20 },
            { name: 'TIGER S&P500', ratio: 15 },
            { name: 'PLUS 고배당주', ratio: 10 },
            { name: 'TIGER 미국채10년선물', ratio: 10 },
            { name: 'KODEX 금액티브', ratio: 10 },
            { name: 'TIGER CD금리액티브', ratio: 10 },
            { name: 'TIGER 미국채30년선물', ratio: 8 },
            { name: 'TIGER SOFR금리액티브', ratio: 7 },
            { name: 'TIGER 나스닥100', ratio: 5 },
            { name: 'KODEX 200/코스닥150', ratio: 5 },
          ],
          summary: [
            { category: '배당주', ratio: 30, color: '#F59E0B' },
            { category: '해외성장주', ratio: 20, color: '#3182F6' },
            { category: '안전자산', ratio: 45, color: '#10B981' },
            { category: '국내주식', ratio: 5, color: '#8B5CF6' },
          ],
        },
      },
      // 월가 전설들 평가
      legends: [
        {
          name: '워렌 버핏',
          style: '가치투자',
          icon: '🎩',
          color: '#F59E0B',
          rating: 'A+',
          comment: '아마존, 셰브론, 유나이티드헬스 같은 우량 개별주를 직접 보유하고 있군요! 특히 셰브론은 배당 귀족주로 에너지 섹터의 안정성을 더해줍니다. VOO+SCHD로 기본을 다지고 개별주로 초과수익을 노리는 전략, 마음에 들어요.',
        },
        {
          name: '레이 달리오',
          style: '올웨더',
          icon: '🌊',
          color: '#3182F6',
          rating: 'A',
          comment: 'ISA와 IRP에 채권, 금, CD 등 안전자산을 배치한 건 좋습니다. 다만 개별주 비중(약 11%)이 있어서 순수 올웨더보다는 변동성이 높아요. 개별주 손실 시 채권/금이 완충 역할을 할 겁니다.',
        },
        {
          name: '피터 린치',
          style: '성장주',
          icon: '📈',
          color: '#10B981',
          rating: 'A+',
          comment: '드디어 제가 좋아하는 포트폴리오를 봤네요! 아마존(+16%), 유나이티드헬스(+9%)처럼 직접 발굴한 개별주가 있잖아요. 기아, 삼성화재 같은 한국 가치주도 포함되어 있고요. 이게 진정한 투자입니다!',
        },
        {
          name: '존 보글',
          style: '인덱스',
          icon: '📊',
          color: '#8B5CF6',
          rating: 'B+',
          comment: 'VOO, SCHD 중심의 인덱스 투자는 훌륭합니다. 다만 개별주(AMZN, CVX, UNH, 국내주식) 비중이 11%나 되네요. 수수료와 세금을 고려하면 장기적으로 인덱스만 하는 게 나을 수도 있어요.',
        },
        {
          name: '하워드 막스',
          style: '리스크',
          icon: '⚖️',
          color: '#EF4444',
          rating: 'A',
          comment: '개별주 7종목으로 섹터 분산(테크, 에너지, 헬스케어, 금융, 통신)이 잘 되어 있어요. 케이뱅크 손실(-23%)이 아프지만, 전체 포트폴리오에서 비중이 작아서 리스크 관리가 되고 있습니다.',
        },
        {
          name: '하늘버핏',
          style: '미래의 전설',
          icon: '🌤️',
          color: '#667EEA',
          rating: 'A+',
          comment: '가윤아 개별주 픽이 좋은데? 아마존 +16%, UNH +9%로 수익 잘 내고 있잖아! CVX는 배당도 나오고~ 다만 케이뱅크는 손절 고려해봐. 국내주식은 배당 받으면서 천천히 들고가자! 전체적으로 아주 잘하고 있어 👏',
        },
      ],
      overallGrade: 'A',
      overallComment: 'ETF(VOO, SCHD) 중심 + 개별주(AMZN, CVX, UNH, 국내주식) 병행 전략. 인덱스로 시장 수익률을 확보하면서 개별주로 알파 추구. 세제혜택 계좌(ISA, 연금저축, IRP)를 활용한 절세 전략도 훌륭함.',
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
              <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: isMobile ? 16 : 20, marginBottom: 16, border: '2px dashed rgba(255,255,255,0.4)' }}>
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

            {/* 세제혜택 계좌 목표 비중 (IRP+ISA+연금저축) */}
            {data.haneulOpinion.targetPortfolio && (
              <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: isMobile ? 16 : 20 }}>
                <h3 style={{ fontSize: isMobile ? 15 : 17, fontWeight: 700, marginBottom: 8, color: '#1E3A5F', display: 'flex', alignItems: 'center', gap: 8 }}>
                  🎯 {data.haneulOpinion.targetPortfolio.title}
                </h3>
                <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>
                  {data.haneulOpinion.targetPortfolio.subtitle} - 최종적으로 이 비중을 목표로 리밸런싱하세요
                </p>

                {/* 자산군별 요약 카드 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
                  {data.haneulOpinion.targetPortfolio.summary.map((item, idx) => (
                    <div key={idx} style={{
                      backgroundColor: item.color + '15',
                      borderRadius: 8,
                      padding: isMobile ? 10 : 12,
                      textAlign: 'center',
                      borderBottom: `3px solid ${item.color}`,
                    }}>
                      <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 800, color: item.color }}>
                        {item.ratio}%
                      </div>
                      <div style={{ fontSize: isMobile ? 11 : 12, color: '#666', marginTop: 2 }}>
                        {item.category}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 종목별 비중 */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 8 }}>
                  {data.haneulOpinion.targetPortfolio.items.map((item, idx) => (
                    <div key={idx} style={{
                      backgroundColor: '#F8FAFC',
                      borderRadius: 8,
                      padding: isMobile ? 10 : 12,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span style={{ fontSize: isMobile ? 11 : 12, color: '#333', fontWeight: 500 }}>
                        {item.name.replace('TIGER ', '')}
                      </span>
                      <span style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, color: '#3182F6' }}>
                        {item.ratio}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 가윤달리오 전용: 개별주식 현황 */}
        {personalTab === 'gayoon' && data.individualStocks && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📊 개별주식 현황 (미래에셋 종합)</h2>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>
              총 평가금액: <strong style={{ color: '#3182F6' }}>{formatMoney(data.individualTotal)}</strong>
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ ...styles.table, minWidth: 500 }}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, backgroundColor: '#F7F8FA' }}>종목</th>
                    <th style={{ ...styles.th, backgroundColor: '#F7F8FA', textAlign: 'center' }}>구분</th>
                    <th style={{ ...styles.th, backgroundColor: '#F7F8FA', textAlign: 'right' }}>평가금액</th>
                    <th style={{ ...styles.th, backgroundColor: '#F7F8FA', textAlign: 'right' }}>수익률</th>
                  </tr>
                </thead>
                <tbody>
                  {data.individualStocks.map((stock, idx) => (
                    <tr key={idx}>
                      <td style={styles.td}>
                        <div style={{ fontWeight: 600 }}>{stock.name}</div>
                        <div style={{ fontSize: 11, color: '#888' }}>{stock.ticker}</div>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          backgroundColor: stock.type === '해외' ? '#E8F3FF' : '#FFF4E6',
                          color: stock.type === '해외' ? '#3182F6' : '#F59E0B',
                        }}>
                          {stock.type}
                        </span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: 600 }}>
                        {formatMoney(stock.amount)}
                      </td>
                      <td style={{
                        ...styles.td,
                        textAlign: 'right',
                        fontWeight: 700,
                        color: stock.gainPercent >= 0 ? COLORS.success : '#FF6B6B',
                      }}>
                        {stock.gainPercent >= 0 ? '+' : ''}{stock.gainPercent.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ ...styles.tipBox('info'), marginTop: 16, marginBottom: 0 }}>
              <div style={styles.tipTitle('info')}>💡 개별주식 전략</div>
              <p style={styles.tipText}>
                해외 우량주(AMZN, CVX, UNH)는 장기 보유로 배당+성장 추구.
                국내 배당주(삼성화재, 하나금융, SKT, 기아)는 배당 수익 중심으로 관리.
              </p>
            </div>
          </div>
        )}

        {/* ISA 현황 */}
        {data.isaHoldings && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📊 ISA 현황 {personalTab === 'haneul' ? '(미래에셋)' : '(삼성증권)'}</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: '#666', margin: 0 }}>
                총 평가금액: <strong style={{ color: '#3182F6' }}>{formatMoney(data.isaHoldings.total)}</strong>
              </p>
              <span style={{
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                backgroundColor: data.isaHoldings.gainPercent >= 0 ? '#E6F7F1' : '#FFEBEE',
                color: data.isaHoldings.gainPercent >= 0 ? COLORS.success : '#FF6B6B',
              }}>
                {data.isaHoldings.gainPercent >= 0 ? '+' : ''}{data.isaHoldings.gainPercent.toFixed(2)}%
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ ...styles.table, minWidth: 400 }}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, backgroundColor: '#E8F3FF' }}>종목</th>
                    <th style={{ ...styles.th, backgroundColor: '#E8F3FF', textAlign: 'right' }}>평가금액</th>
                    <th style={{ ...styles.th, backgroundColor: '#E8F3FF', textAlign: 'right' }}>수익률</th>
                  </tr>
                </thead>
                <tbody>
                  {data.isaHoldings.items.map((item, idx) => (
                    <tr key={idx}>
                      <td style={styles.td}><strong>{item.name}</strong></td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>{formatMoney(item.currentKRW)}</td>
                      <td style={{
                        ...styles.td,
                        textAlign: 'right',
                        fontWeight: 600,
                        color: item.gainPercent >= 0 ? COLORS.success : '#FF6B6B',
                      }}>
                        {item.gainPercent >= 0 ? '+' : ''}{item.gainPercent.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* IRP 현황 */}
        {data.irpHoldings && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🏦 IRP 현황 (미래에셋)</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: '#666', margin: 0 }}>
                총 평가금액: <strong style={{ color: '#3182F6' }}>{formatMoney(data.irpHoldings.total)}</strong>
              </p>
              <span style={{
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                backgroundColor: data.irpHoldings.gainPercent >= 0 ? '#E6F7F1' : '#FFEBEE',
                color: data.irpHoldings.gainPercent >= 0 ? COLORS.success : '#FF6B6B',
              }}>
                {data.irpHoldings.gainPercent >= 0 ? '+' : ''}{data.irpHoldings.gainPercent.toFixed(2)}%
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ ...styles.table, minWidth: 400 }}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, backgroundColor: '#FFF4E6' }}>종목</th>
                    <th style={{ ...styles.th, backgroundColor: '#FFF4E6', textAlign: 'right' }}>평가금액</th>
                    <th style={{ ...styles.th, backgroundColor: '#FFF4E6', textAlign: 'right' }}>수익률</th>
                  </tr>
                </thead>
                <tbody>
                  {data.irpHoldings.items.map((item, idx) => (
                    <tr key={idx}>
                      <td style={styles.td}><strong>{item.name}</strong></td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>{formatMoney(item.currentKRW)}</td>
                      <td style={{
                        ...styles.td,
                        textAlign: 'right',
                        fontWeight: 600,
                        color: item.gainPercent >= 0 ? COLORS.success : '#FF6B6B',
                      }}>
                        {item.gainPercent >= 0 ? '+' : ''}{item.gainPercent.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 연금저축 현황 */}
        {data.pensionHoldings && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🧓 연금저축 현황 (미래에셋)</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: '#666', margin: 0 }}>
                총 평가금액: <strong style={{ color: '#3182F6' }}>{formatMoney(data.pensionHoldings.total)}</strong>
              </p>
              <span style={{
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                backgroundColor: data.pensionHoldings.gainPercent >= 0 ? '#E6F7F1' : '#FFEBEE',
                color: data.pensionHoldings.gainPercent >= 0 ? COLORS.success : '#FF6B6B',
              }}>
                {data.pensionHoldings.gainPercent >= 0 ? '+' : ''}{data.pensionHoldings.gainPercent.toFixed(2)}%
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ ...styles.table, minWidth: 400 }}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, backgroundColor: '#F3E8FF' }}>종목</th>
                    <th style={{ ...styles.th, backgroundColor: '#F3E8FF', textAlign: 'right' }}>평가금액</th>
                    <th style={{ ...styles.th, backgroundColor: '#F3E8FF', textAlign: 'right' }}>수익률</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pensionHoldings.items.map((item, idx) => (
                    <tr key={idx}>
                      <td style={styles.td}><strong>{item.name}</strong></td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>{formatMoney(item.currentKRW)}</td>
                      <td style={{
                        ...styles.td,
                        textAlign: 'right',
                        fontWeight: 600,
                        color: item.gainPercent >= 0 ? COLORS.success : '#FF6B6B',
                      }}>
                        {item.gainPercent >= 0 ? '+' : ''}{item.gainPercent.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 해외주식 현황 (하늘버핏 전용) */}
        {personalTab === 'haneul' && data.overseasHoldings && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🌍 해외주식 현황 (미래에셋 종합)</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: '#666', margin: 0 }}>
                총 평가금액: <strong style={{ color: '#3182F6' }}>{formatMoney(data.overseasHoldings.total)}</strong>
              </p>
              <span style={{
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                backgroundColor: data.overseasHoldings.gainPercent >= 0 ? '#E6F7F1' : '#FFEBEE',
                color: data.overseasHoldings.gainPercent >= 0 ? COLORS.success : '#FF6B6B',
              }}>
                {data.overseasHoldings.gainPercent >= 0 ? '+' : ''}{data.overseasHoldings.gainPercent.toFixed(2)}%
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ ...styles.table, minWidth: 400 }}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, backgroundColor: '#E6F7F1' }}>종목</th>
                    <th style={{ ...styles.th, backgroundColor: '#E6F7F1', textAlign: 'center' }}>구분</th>
                    <th style={{ ...styles.th, backgroundColor: '#E6F7F1', textAlign: 'right' }}>평가금액</th>
                    <th style={{ ...styles.th, backgroundColor: '#E6F7F1', textAlign: 'right' }}>수익률</th>
                  </tr>
                </thead>
                <tbody>
                  {data.overseasHoldings.items.map((item, idx) => (
                    <tr key={idx}>
                      <td style={styles.td}><strong>{item.name}</strong></td>
                      <td style={{ ...styles.td, textAlign: 'center' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          backgroundColor: item.type === '해외' ? '#E8F3FF' : item.type === 'ETF' ? '#F3E8FF' : '#F7F8FA',
                          color: item.type === '해외' ? '#3182F6' : item.type === 'ETF' ? '#8B5CF6' : '#666',
                        }}>
                          {item.type}
                        </span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>{formatMoney(item.currentKRW)}</td>
                      <td style={{
                        ...styles.td,
                        textAlign: 'right',
                        fontWeight: 600,
                        color: item.gainPercent >= 0 ? COLORS.success : '#FF6B6B',
                      }}>
                        {item.gainPercent >= 0 ? '+' : ''}{item.gainPercent.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.rebalanceStrategy?.overseas && (
              <div style={{ ...styles.tipBox('info'), marginTop: 16, marginBottom: 0 }}>
                <div style={styles.tipTitle('info')}>💡 해외주식 전략</div>
                <p style={styles.tipText}>
                  <strong>{data.rebalanceStrategy.overseas.action}</strong><br/>
                  {data.rebalanceStrategy.overseas.note}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 가윤달리오 전용: 해외주식(ETF) 현황 */}
        {personalTab === 'gayoon' && data.overseasHoldings && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🌍 해외주식(ETF) 현황 (삼성증권)</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: '#666', margin: 0 }}>
                총 평가금액: <strong style={{ color: '#3182F6' }}>{formatMoney(data.overseasHoldings.total)}</strong>
              </p>
              <span style={{
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                backgroundColor: data.overseasHoldings.gainPercent >= 0 ? '#E6F7F1' : '#FFEBEE',
                color: data.overseasHoldings.gainPercent >= 0 ? COLORS.success : '#FF6B6B',
              }}>
                {data.overseasHoldings.gainPercent >= 0 ? '+' : ''}{data.overseasHoldings.gainPercent.toFixed(2)}%
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ ...styles.table, minWidth: 400 }}>
                <thead>
                  <tr>
                    <th style={{ ...styles.th, backgroundColor: '#E6F7F1' }}>종목</th>
                    <th style={{ ...styles.th, backgroundColor: '#E6F7F1', textAlign: 'right' }}>평가금액</th>
                    <th style={{ ...styles.th, backgroundColor: '#E6F7F1', textAlign: 'right' }}>수익률</th>
                  </tr>
                </thead>
                <tbody>
                  {data.overseasHoldings.etfItems.map((item, idx) => (
                    <tr key={idx}>
                      <td style={styles.td}><strong>{item.name}</strong></td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>{formatMoney(item.currentKRW)}</td>
                      <td style={{
                        ...styles.td,
                        textAlign: 'right',
                        fontWeight: 600,
                        color: item.gainPercent >= 0 ? COLORS.success : '#FF6B6B',
                      }}>
                        {item.gainPercent >= 0 ? '+' : ''}{item.gainPercent.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 하늘버핏 전용: 월가 전설들 평가 */}
        {personalTab === 'haneul' && data.legends && (
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

        {/* 하늘버핏 전용: 리밸런싱 전략 */}
        {personalTab === 'haneul' && data.rebalanceStrategy && (
          <div style={{
            ...styles.card,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: COLORS.white,
          }}>
            <h2 style={{ ...styles.cardTitle, color: COLORS.white }}>🎯 계좌별 리밸런싱 전략</h2>

            {/* 연금저축 전략 */}
            {data.rebalanceStrategy.pension && (
              <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#FFD700' }}>
                  🧓 연금저축: {data.rebalanceStrategy.pension.action}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#FFB3B3', marginBottom: 8, fontWeight: 600 }}>📉 매도</div>
                    {data.rebalanceStrategy.pension.sell.map((item, idx) => (
                      <p key={idx} style={{ fontSize: 13, marginBottom: 4, color: 'rgba(255,255,255,0.9)' }}>
                        • {item.asset}: -{formatMoney(item.amount)}
                      </p>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#90EE90', marginBottom: 8, fontWeight: 600 }}>📈 매수</div>
                    {data.rebalanceStrategy.pension.buy.map((item, idx) => (
                      <p key={idx} style={{ fontSize: 13, marginBottom: 4, color: 'rgba(255,255,255,0.9)' }}>
                        • {item.asset}: +{formatMoney(item.amount)}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ISA 전략 */}
            {data.rebalanceStrategy.isa && (
              <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#90EE90' }}>
                  📊 ISA: {data.rebalanceStrategy.isa.action}
                </h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 12 }}>
                  {data.rebalanceStrategy.isa.note}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#FFB3B3', marginBottom: 8, fontWeight: 600 }}>📉 매도</div>
                    {data.rebalanceStrategy.isa.sell.map((item, idx) => (
                      <p key={idx} style={{ fontSize: 13, marginBottom: 4, color: 'rgba(255,255,255,0.9)' }}>
                        • {item.asset}: -{formatMoney(item.amount)}
                      </p>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#90EE90', marginBottom: 8, fontWeight: 600 }}>📈 매수</div>
                    {data.rebalanceStrategy.isa.buy.map((item, idx) => (
                      <p key={idx} style={{ fontSize: 13, marginBottom: 4, color: 'rgba(255,255,255,0.9)' }}>
                        • {item.asset}: +{formatMoney(item.amount)}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* IRP 전략 */}
            {data.rebalanceStrategy.irp && (
              <div style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#87CEEB' }}>
                  🏦 IRP: {data.rebalanceStrategy.irp.action}
                </h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 12 }}>
                  {data.rebalanceStrategy.irp.note}
                </p>
                {data.rebalanceStrategy.irp.additionalBuy && (
                  <div>
                    <div style={{ fontSize: 12, color: '#90EE90', marginBottom: 8, fontWeight: 600 }}>📈 추가 매수 권장</div>
                    {data.rebalanceStrategy.irp.additionalBuy.map((item, idx) => (
                      <p key={idx} style={{ fontSize: 13, marginBottom: 4, color: 'rgba(255,255,255,0.9)' }}>
                        • {item.asset}: +{formatMoney(item.amount)} ({item.reason})
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 가윤달리오 전용: 해외주식 전략 */}
        {personalTab === 'gayoon' && data.overseasStrategy && (
          <div style={{ ...styles.card, border: `2px solid ${COLORS.success}` }}>
            <h2 style={{ ...styles.cardTitle, color: COLORS.success }}>🌍 해외주식 전략 (VOO, SCHD)</h2>
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
