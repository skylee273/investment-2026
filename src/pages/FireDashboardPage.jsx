import { useState, useEffect } from 'react'

// 마일스톤 정의
const MILESTONES = [
  { amount: 10000000, label: '1천만원', emoji: '🌱' },
  { amount: 30000000, label: '3천만원', emoji: '🌿' },
  { amount: 50000000, label: '5천만원', emoji: '🌳' },
  { amount: 100000000, label: '1억', emoji: '💰' },
  { amount: 300000000, label: '3억', emoji: '🏠' },
  { amount: 500000000, label: '5억', emoji: '🚀' },
  { amount: 1000000000, label: '10억', emoji: '🎉' },
]

// 기본 설정값
const DEFAULT_SETTINGS = {
  targetAmount: 1000000000,
  monthlyInvestment: 3000000,
  expectedReturn: 7,
  currentAssets: 153260000, // 1억 5,326만원
  milestones: {},
}

// 복리 계산 함수
const calculateFutureValue = (principal, monthlyContribution, annualRate, years) => {
  const monthlyRate = annualRate / 12 / 100
  const months = years * 12

  const principalFV = principal * Math.pow(1 + monthlyRate, months)
  const contributionFV = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)

  return principalFV + contributionFV
}

// 목표까지 남은 개월 수 계산
const calculateMonthsToGoal = (current, target, monthly, annualRate) => {
  const monthlyRate = annualRate / 12 / 100
  let months = 0
  let balance = current

  while (balance < target && months < 600) {
    balance = balance * (1 + monthlyRate) + monthly
    months++
  }
  return months
}

// 금액 포맷팅
const formatMoney = (amount) => {
  if (amount >= 100000000) {
    const uk = Math.floor(amount / 100000000)
    const man = Math.floor((amount % 100000000) / 10000)
    return man > 0 ? `${uk}억 ${man.toLocaleString()}만원` : `${uk}억원`
  } else if (amount >= 10000) {
    return `${Math.floor(amount / 10000).toLocaleString()}만원`
  }
  return `${amount.toLocaleString()}원`
}

export default function FireDashboardPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [tempSettings, setTempSettings] = useState(DEFAULT_SETTINGS)

  // 화면 크기 감지
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // LocalStorage에서 설정 로드
  useEffect(() => {
    const saved = localStorage.getItem('fire-settings')
    if (saved) {
      setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) })
    }
  }, [])

  // 설정 저장
  const saveSettings = () => {
    const newSettings = { ...tempSettings }
    localStorage.setItem('fire-settings', JSON.stringify(newSettings))
    setSettings(newSettings)
    setShowSettingsModal(false)
  }

  // 계산값들
  const progressPercent = (settings.currentAssets / settings.targetAmount) * 100
  const remainingAmount = settings.targetAmount - settings.currentAssets
  const monthsToGoal = calculateMonthsToGoal(
    settings.currentAssets,
    settings.targetAmount,
    settings.monthlyInvestment,
    settings.expectedReturn
  )
  const yearsToGoal = Math.floor(monthsToGoal / 12)
  const remainingMonths = monthsToGoal % 12

  // 예상 자산 테이블 데이터
  const projections = [1, 3, 5, 10, 15, 20].map(year => {
    const futureValue = calculateFutureValue(
      settings.currentAssets,
      settings.monthlyInvestment,
      settings.expectedReturn,
      year
    )
    const totalContributed = settings.currentAssets + (settings.monthlyInvestment * 12 * year)
    const gains = futureValue - totalContributed
    return { year, futureValue, gains }
  })

  // 마일스톤 상태 계산
  const getMilestoneStatus = (milestone) => {
    const achieved = settings.currentAssets >= milestone.amount
    const achievedDate = settings.milestones?.[milestone.amount]

    if (achieved) {
      return { achieved: true, date: achievedDate || '달성' }
    }

    const monthsToMilestone = calculateMonthsToGoal(
      settings.currentAssets,
      milestone.amount,
      settings.monthlyInvestment,
      settings.expectedReturn
    )
    const expectedDate = new Date()
    expectedDate.setMonth(expectedDate.getMonth() + monthsToMilestone)

    return {
      achieved: false,
      expectedDate: `${expectedDate.getFullYear()}.${String(expectedDate.getMonth() + 1).padStart(2, '0')}`,
      daysRemaining: Math.ceil(monthsToMilestone * 30.44)
    }
  }

  const styles = {
    container: {
      maxWidth: '900px',
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
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    subtitle: {
      fontSize: '14px',
      color: '#8B95A1',
      marginTop: '8px',
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: isMobile ? '20px' : '24px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
    },
    heroCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: isMobile ? '24px' : '32px',
      marginBottom: '16px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
    },
    heroHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    },
    heroTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#191F28',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    settingsBtn: {
      padding: '8px 16px',
      backgroundColor: '#F2F4F6',
      border: 'none',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: '500',
      color: '#4E5968',
      cursor: 'pointer',
    },
    currentAmount: {
      fontSize: isMobile ? '32px' : '40px',
      fontWeight: '700',
      color: '#191F28',
      textAlign: 'center',
      marginBottom: '16px',
    },
    progressContainer: {
      marginBottom: '16px',
    },
    progressBar: {
      height: '12px',
      backgroundColor: '#E5E8EB',
      borderRadius: '6px',
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#3182F6',
      borderRadius: '6px',
      transition: 'width 0.5s ease',
    },
    progressLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '8px',
      fontSize: '13px',
      color: '#8B95A1',
    },
    heroStats: {
      display: 'flex',
      justifyContent: 'center',
      gap: isMobile ? '16px' : '32px',
      marginTop: '24px',
      flexWrap: 'wrap',
    },
    stat: {
      textAlign: 'center',
    },
    statLabel: {
      fontSize: '12px',
      color: '#8B95A1',
      marginBottom: '4px',
    },
    statValue: {
      fontSize: isMobile ? '16px' : '18px',
      fontWeight: '600',
      color: '#191F28',
    },
    dday: {
      fontSize: isMobile ? '24px' : '28px',
      fontWeight: '700',
      color: '#3182F6',
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#191F28',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    inputGroup: {
      marginBottom: '16px',
    },
    inputLabel: {
      fontSize: '13px',
      color: '#6B7684',
      marginBottom: '6px',
      display: 'block',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '15px',
      border: '1px solid #E5E8EB',
      borderRadius: '10px',
      outline: 'none',
      boxSizing: 'border-box',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '12px 8px',
      textAlign: 'left',
      fontSize: '13px',
      fontWeight: '500',
      color: '#8B95A1',
      borderBottom: '1px solid #E5E8EB',
    },
    td: {
      padding: '14px 8px',
      fontSize: '14px',
      color: '#191F28',
      borderBottom: '1px solid #F2F4F6',
    },
    milestone: {
      display: 'flex',
      alignItems: 'center',
      padding: '14px 16px',
      backgroundColor: '#F7F8FA',
      borderRadius: '12px',
      marginBottom: '8px',
    },
    milestoneAchieved: {
      display: 'flex',
      alignItems: 'center',
      padding: '14px 16px',
      backgroundColor: '#E8F3FF',
      borderRadius: '12px',
      marginBottom: '8px',
    },
    milestoneEmoji: {
      fontSize: '24px',
      marginRight: '12px',
    },
    milestoneInfo: {
      flex: 1,
    },
    milestoneLabel: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#191F28',
    },
    milestoneDate: {
      fontSize: '13px',
      color: '#8B95A1',
      marginTop: '2px',
    },
    milestoneBadge: {
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
    },
    badgeAchieved: {
      backgroundColor: '#E8F3FF',
      color: '#3182F6',
    },
    badgePending: {
      backgroundColor: '#F2F4F6',
      color: '#6B7684',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '16px',
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: '24px',
      width: '100%',
      maxWidth: '400px',
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#191F28',
      marginBottom: '20px',
    },
    modalButtons: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px',
    },
    cancelBtn: {
      flex: 1,
      padding: '14px',
      backgroundColor: '#F2F4F6',
      border: 'none',
      borderRadius: '10px',
      fontSize: '15px',
      fontWeight: '500',
      color: '#4E5968',
      cursor: 'pointer',
    },
    saveBtn: {
      flex: 1,
      padding: '14px',
      backgroundColor: '#3182F6',
      border: 'none',
      borderRadius: '10px',
      fontSize: '15px',
      fontWeight: '500',
      color: '#FFFFFF',
      cursor: 'pointer',
    },
    gainText: {
      color: '#F04452',
      fontWeight: '500',
    },
  }

  return (
    <div style={styles.container}>
      {/* 헤더 */}
      <div style={styles.header}>
        <h1 style={styles.title}>FIRE 대시보드</h1>
        <p style={styles.subtitle}>Financial Independence, Retire Early</p>
      </div>

      {/* Hero Card */}
      <div style={styles.heroCard}>
        <div style={styles.heroHeader}>
          <span style={styles.heroTitle}>목표 달성 현황</span>
          <button
            style={styles.settingsBtn}
            onClick={() => {
              setTempSettings(settings)
              setShowSettingsModal(true)
            }}
          >
            목표 설정
          </button>
        </div>

        <div style={styles.currentAmount}>
          현재 자산: {formatMoney(settings.currentAssets)}
        </div>

        <div style={styles.progressContainer}>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${Math.min(progressPercent, 100)}%`,
              }}
            />
          </div>
          <div style={styles.progressLabel}>
            <span>{progressPercent.toFixed(1)}% 달성</span>
            <span>목표: {formatMoney(settings.targetAmount)}</span>
          </div>
        </div>

        <div style={styles.heroStats}>
          <div style={styles.stat}>
            <div style={styles.statLabel}>남은 금액</div>
            <div style={styles.statValue}>{formatMoney(remainingAmount)}</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statLabel}>예상 달성일</div>
            <div style={styles.dday}>
              D-{Math.ceil(monthsToGoal * 30.44).toLocaleString()}
            </div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statLabel}>남은 기간</div>
            <div style={styles.statValue}>
              약 {yearsToGoal}년 {remainingMonths > 0 ? `${remainingMonths}개월` : ''} 후
            </div>
          </div>
        </div>
      </div>

      {/* 복리 계산기 */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>복리 계산기</div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>월 저축액</label>
            <input
              type="text"
              style={styles.input}
              value={`${(settings.monthlyInvestment / 10000).toLocaleString()}만원`}
              readOnly
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>예상 연 수익률</label>
            <input
              type="text"
              style={styles.input}
              value={`${settings.expectedReturn}%`}
              readOnly
            />
          </div>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>기간</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>예상 자산</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>수익금</th>
            </tr>
          </thead>
          <tbody>
            {projections.map(({ year, futureValue, gains }) => (
              <tr key={year}>
                <td style={styles.td}>{year}년 후</td>
                <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600' }}>
                  {formatMoney(futureValue)}
                </td>
                <td style={{ ...styles.td, textAlign: 'right', ...styles.gainText }}>
                  +{formatMoney(gains)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 마일스톤 트래커 */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>마일스톤 트래커</div>

        {MILESTONES.map((milestone) => {
          const status = getMilestoneStatus(milestone)
          return (
            <div
              key={milestone.amount}
              style={status.achieved ? styles.milestoneAchieved : styles.milestone}
            >
              <span style={styles.milestoneEmoji}>{milestone.emoji}</span>
              <div style={styles.milestoneInfo}>
                <div style={styles.milestoneLabel}>{milestone.label}</div>
                <div style={styles.milestoneDate}>
                  {status.achieved
                    ? `${status.date} 달성`
                    : `예상: ${status.expectedDate} (D-${status.daysRemaining?.toLocaleString()})`}
                </div>
              </div>
              <span
                style={{
                  ...styles.milestoneBadge,
                  ...(status.achieved ? styles.badgeAchieved : styles.badgePending),
                }}
              >
                {status.achieved ? '달성' : '진행중'}
              </span>
            </div>
          )
        })}
      </div>

      {/* 설정 모달 */}
      {showSettingsModal && (
        <div style={styles.modal} onClick={() => setShowSettingsModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>목표 설정</div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>현재 자산 (원)</label>
              <input
                type="number"
                style={styles.input}
                value={tempSettings.currentAssets}
                onChange={(e) =>
                  setTempSettings({ ...tempSettings, currentAssets: Number(e.target.value) })
                }
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>목표 금액 (원)</label>
              <input
                type="number"
                style={styles.input}
                value={tempSettings.targetAmount}
                onChange={(e) =>
                  setTempSettings({ ...tempSettings, targetAmount: Number(e.target.value) })
                }
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>월 저축액 (원)</label>
              <input
                type="number"
                style={styles.input}
                value={tempSettings.monthlyInvestment}
                onChange={(e) =>
                  setTempSettings({ ...tempSettings, monthlyInvestment: Number(e.target.value) })
                }
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>예상 연 수익률 (%)</label>
              <input
                type="number"
                style={styles.input}
                value={tempSettings.expectedReturn}
                onChange={(e) =>
                  setTempSettings({ ...tempSettings, expectedReturn: Number(e.target.value) })
                }
              />
            </div>

            <div style={styles.modalButtons}>
              <button style={styles.cancelBtn} onClick={() => setShowSettingsModal(false)}>
                취소
              </button>
              <button style={styles.saveBtn} onClick={saveSettings}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
