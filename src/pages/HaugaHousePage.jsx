import { useState, useEffect } from 'react'

// 현재 자산 현황 (주택 구매용)
const HOUSE_FUND_ASSETS = [
  { id: 'deposit', name: '전세 보증금', amount: 45000000, icon: '🏢', available: '2026.07', note: '현재 거주 중' },
  { id: 'family', name: '가족 지원금', amount: 20000000, icon: '👨‍👩‍👧', available: '2026.06', note: '확정' },
  { id: 'savings', name: '청약저축', amount: 6220000, icon: '🏠', available: '즉시', note: '1순위 충족' },
  { id: 'youth', name: '청년도약계좌', amount: 16800000, icon: '🚀', available: '2030', note: '5년 만기' },
  { id: 'investment', name: '투자자산 (예상)', amount: 50000000, icon: '📈', available: '2027', note: 'ISA+연금저축+주식' },
  { id: 'cma', name: 'CMA 현금', amount: 7738854, icon: '💵', available: '즉시', note: '비상금' },
]

// 목표 주택 옵션
const TARGET_HOMES = [
  {
    id: 'apt-small',
    type: '아파트 (소형)',
    size: '59㎡ (24평)',
    priceRange: '4~6억',
    avgPrice: 500000000,
    regions: ['경기 외곽', '인천', '수원'],
    pros: ['관리 편리', '시세 차익 기대'],
    cons: ['높은 초기 비용', '대출 부담'],
  },
  {
    id: 'apt-medium',
    type: '아파트 (중형)',
    size: '84㎡ (34평)',
    priceRange: '6~9억',
    avgPrice: 750000000,
    regions: ['경기 수도권', '분당', '용인'],
    pros: ['가족 생활 적합', '학군 선택 가능'],
    cons: ['높은 가격', '경쟁 치열'],
  },
  {
    id: 'villa',
    type: '빌라/다세대',
    size: '66㎡ (20평)',
    priceRange: '2~4억',
    avgPrice: 300000000,
    regions: ['서울 외곽', '경기'],
    pros: ['낮은 가격', '즉시 입주'],
    cons: ['시세 상승 제한', '관리비 변동'],
  },
  {
    id: 'newtown',
    type: '신축 분양',
    size: '84㎡ (34평)',
    priceRange: '5~8억',
    avgPrice: 650000000,
    regions: ['GTX 역세권', '3기 신도시'],
    pros: ['청약 활용', '새 아파트'],
    cons: ['입주까지 2~3년', '분양가 상승'],
  },
]

// 청약 정보
const SUBSCRIPTION_INFO = {
  accountBalance: 6220000,
  monthlyDeposit: 100000,
  priority: '1순위',
  region: '수도권',
  familyCount: 2,
  isNewlywed: true,
  marriageDate: '2025.06',
  specialSupplyEligible: ['신혼부부', '생애최초'],
}

// 정부 지원 정책
const GOVERNMENT_POLICIES = [
  {
    id: 'newlywed-loan',
    name: '신혼부부 전용 버팀목대출',
    rate: '연 1.5~2.7%',
    limit: '4억원',
    condition: '혼인 7년 이내, 부부합산 소득 8,500만원 이하',
    note: '우대금리 적용 가능',
  },
  {
    id: 'firsthome-loan',
    name: '생애최초 주택구입 대출',
    rate: '연 2.2~3.0%',
    limit: '5억원',
    condition: '무주택자, 소득 9,000만원 이하',
    note: 'LTV 80%, DTI 60%',
  },
  {
    id: 'youth-loan',
    name: '청년 버팀목 전세대출',
    rate: '연 1.5~2.1%',
    limit: '2억원',
    condition: '만 19~34세, 소득 5,000만원 이하',
    note: '전세 보증금 지원',
  },
  {
    id: 'special-supply',
    name: '신혼부부 특별공급',
    rate: '-',
    limit: '전용 85㎡ 이하',
    condition: '혼인 7년 이내, 무주택',
    note: '일반공급 대비 경쟁률 낮음',
  },
]

// 지역별 시세 (2026년 3월 기준 예상)
const REGIONAL_PRICES = [
  { region: '서울 강남', apt84: 20, apt59: 15, change: '+2.1%' },
  { region: '서울 강북', apt84: 10, apt59: 7, change: '+1.5%' },
  { region: '경기 성남/분당', apt84: 12, apt59: 9, change: '+1.8%' },
  { region: '경기 수원/용인', apt84: 7, apt59: 5, change: '+1.2%' },
  { region: '경기 외곽', apt84: 5, apt59: 3.5, change: '+0.8%' },
  { region: '인천', apt84: 5, apt59: 3.5, change: '+1.0%' },
]

export default function HaugaHousePage() {
  const [isMobile, setIsMobile] = useState(false)
  const [selectedHome, setSelectedHome] = useState(TARGET_HOMES[0])
  const [loanAmount, setLoanAmount] = useState(300000000)
  const [loanRate, setLoanRate] = useState(3.5)
  const [loanYears, setLoanYears] = useState(30)
  const [downPayment, setDownPayment] = useState(200000000)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 총 자산 계산
  const totalAssets = HOUSE_FUND_ASSETS.reduce((sum, a) => sum + a.amount, 0)
  const availableNow = HOUSE_FUND_ASSETS
    .filter(a => a.available === '즉시' || a.available === '2026.06' || a.available === '2026.07')
    .reduce((sum, a) => sum + a.amount, 0)

  // 월 상환액 계산 (원리금균등상환)
  const calculateMonthlyPayment = (principal, annualRate, years) => {
    const monthlyRate = annualRate / 100 / 12
    const numPayments = years * 12
    if (monthlyRate === 0) return principal / numPayments
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    return Math.round(payment)
  }

  const monthlyPayment = calculateMonthlyPayment(loanAmount, loanRate, loanYears)
  const totalPayment = monthlyPayment * loanYears * 12
  const totalInterest = totalPayment - loanAmount

  // 목표 주택 구매 가능성 분석
  const targetPrice = selectedHome.avgPrice
  const requiredDownPayment = targetPrice * 0.2 // 20% 자기자본
  const maxLoan = targetPrice * 0.8 // LTV 80%
  const affordabilityPercent = Math.min(100, Math.round((availableNow / requiredDownPayment) * 100))

  const styles = {
    container: {
      padding: isMobile ? '0' : '0',
    },
    header: {
      marginBottom: isMobile ? '20px' : '32px',
    },
    title: {
      fontSize: isMobile ? '22px' : '28px',
      fontWeight: '700',
      color: '#191F28',
      marginBottom: '8px',
    },
    subtitle: {
      fontSize: isMobile ? '13px' : '14px',
      color: '#8B95A1',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: isMobile ? '16px' : '20px',
      marginBottom: isMobile ? '20px' : '24px',
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: isMobile ? '16px' : '24px',
      border: '1px solid #E5E8EB',
    },
    cardTitle: {
      fontSize: isMobile ? '15px' : '17px',
      fontWeight: '700',
      color: '#191F28',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    assetItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid #F2F4F6',
    },
    assetName: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    assetIcon: {
      fontSize: isMobile ? '18px' : '22px',
    },
    assetLabel: {
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '500',
      color: '#191F28',
    },
    assetNote: {
      fontSize: isMobile ? '10px' : '11px',
      color: '#8B95A1',
    },
    assetAmount: {
      fontSize: isMobile ? '14px' : '15px',
      fontWeight: '600',
      color: '#191F28',
    },
    totalBox: {
      marginTop: '16px',
      padding: '16px',
      backgroundColor: '#F7F8FA',
      borderRadius: '12px',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
    },
    totalLabel: {
      fontSize: isMobile ? '13px' : '14px',
      color: '#4E5968',
    },
    totalAmount: {
      fontSize: isMobile ? '18px' : '22px',
      fontWeight: '700',
      color: '#3182F6',
    },
    homeOption: (isSelected) => ({
      padding: isMobile ? '14px' : '16px',
      borderRadius: '12px',
      border: `2px solid ${isSelected ? '#3182F6' : '#E5E8EB'}`,
      backgroundColor: isSelected ? '#F0F7FF' : '#FFFFFF',
      cursor: 'pointer',
      marginBottom: '12px',
      transition: 'all 0.2s',
    }),
    homeType: {
      fontSize: isMobile ? '14px' : '16px',
      fontWeight: '600',
      color: '#191F28',
      marginBottom: '4px',
    },
    homeSize: {
      fontSize: isMobile ? '12px' : '13px',
      color: '#8B95A1',
    },
    homePrice: {
      fontSize: isMobile ? '16px' : '18px',
      fontWeight: '700',
      color: '#3182F6',
      marginTop: '8px',
    },
    slider: {
      width: '100%',
      marginTop: '8px',
      accentColor: '#3182F6',
    },
    inputGroup: {
      marginBottom: '20px',
    },
    inputLabel: {
      fontSize: isMobile ? '13px' : '14px',
      fontWeight: '500',
      color: '#4E5968',
      marginBottom: '8px',
      display: 'block',
    },
    inputValue: {
      fontSize: isMobile ? '16px' : '18px',
      fontWeight: '700',
      color: '#191F28',
    },
    resultBox: {
      padding: '20px',
      backgroundColor: '#3182F6',
      borderRadius: '12px',
      color: 'white',
    },
    resultLabel: {
      fontSize: isMobile ? '12px' : '13px',
      opacity: 0.8,
      marginBottom: '4px',
    },
    resultValue: {
      fontSize: isMobile ? '24px' : '28px',
      fontWeight: '700',
    },
    policyCard: {
      padding: isMobile ? '14px' : '16px',
      backgroundColor: '#F7F8FA',
      borderRadius: '12px',
      marginBottom: '12px',
    },
    policyName: {
      fontSize: isMobile ? '14px' : '15px',
      fontWeight: '600',
      color: '#191F28',
      marginBottom: '8px',
    },
    policyDetail: {
      fontSize: isMobile ? '12px' : '13px',
      color: '#4E5968',
      marginBottom: '4px',
    },
    policyHighlight: {
      color: '#3182F6',
      fontWeight: '600',
    },
    progressBar: {
      width: '100%',
      height: '12px',
      backgroundColor: '#E5E8EB',
      borderRadius: '6px',
      overflow: 'hidden',
      marginTop: '12px',
    },
    progressFill: (percent) => ({
      width: `${Math.min(100, percent)}%`,
      height: '100%',
      backgroundColor: percent >= 100 ? '#00C853' : percent >= 70 ? '#FF9800' : '#F04438',
      borderRadius: '6px',
      transition: 'width 0.3s',
    }),
    badge: (color) => ({
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: isMobile ? '10px' : '11px',
      fontWeight: '600',
      backgroundColor: color === 'blue' ? '#E8F3FF' : color === 'green' ? '#E8F5E9' : '#FFF3E0',
      color: color === 'blue' ? '#3182F6' : color === 'green' ? '#00C853' : '#FF9800',
      marginRight: '6px',
    }),
    timelineItem: {
      display: 'flex',
      gap: '16px',
      marginBottom: '20px',
    },
    timelineDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: '#3182F6',
      marginTop: '4px',
      flexShrink: 0,
    },
    timelineContent: {
      flex: 1,
    },
    timelineDate: {
      fontSize: isMobile ? '12px' : '13px',
      color: '#3182F6',
      fontWeight: '600',
      marginBottom: '4px',
    },
    timelineTitle: {
      fontSize: isMobile ? '14px' : '15px',
      fontWeight: '600',
      color: '#191F28',
      marginBottom: '4px',
    },
    timelineDesc: {
      fontSize: isMobile ? '12px' : '13px',
      color: '#8B95A1',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: isMobile ? '12px' : '13px',
    },
    th: {
      padding: '12px 8px',
      textAlign: 'left',
      borderBottom: '2px solid #E5E8EB',
      fontWeight: '600',
      color: '#4E5968',
      backgroundColor: '#F7F8FA',
    },
    td: {
      padding: '12px 8px',
      borderBottom: '1px solid #F2F4F6',
      color: '#191F28',
    },
    fullWidth: {
      gridColumn: isMobile ? '1' : '1 / -1',
    },
  }

  return (
    <div style={styles.container}>
      {/* 헤더 */}
      <div style={styles.header}>
        <h1 style={styles.title}>하우가 하우스</h1>
        <p style={styles.subtitle}>
          하늘 & 가윤의 내 집 마련 프로젝트 | 목표: 2027~2028년
        </p>
      </div>

      {/* 상단 요약 카드 */}
      <div style={{
        ...styles.card,
        background: 'linear-gradient(135deg, #3182F6 0%, #6366F1 100%)',
        color: 'white',
        marginBottom: isMobile ? '20px' : '24px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? '16px' : '24px',
        }}>
          <div>
            <div style={{ fontSize: isMobile ? '11px' : '12px', opacity: 0.8, marginBottom: '4px' }}>총 자산</div>
            <div style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: '700' }}>
              {(totalAssets / 100000000).toFixed(2)}억
            </div>
          </div>
          <div>
            <div style={{ fontSize: isMobile ? '11px' : '12px', opacity: 0.8, marginBottom: '4px' }}>2027년 활용가능</div>
            <div style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: '700' }}>
              {(availableNow / 100000000).toFixed(2)}억
            </div>
          </div>
          <div>
            <div style={{ fontSize: isMobile ? '11px' : '12px', opacity: 0.8, marginBottom: '4px' }}>목표 주택</div>
            <div style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: '700' }}>
              {selectedHome.priceRange}
            </div>
          </div>
          <div>
            <div style={{ fontSize: isMobile ? '11px' : '12px', opacity: 0.8, marginBottom: '4px' }}>달성률</div>
            <div style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: '700' }}>
              {affordabilityPercent}%
            </div>
          </div>
        </div>
      </div>

      <div style={styles.grid}>
        {/* 주택 구매 자금 현황 */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span>💰</span> 주택 구매 자금
          </div>
          {HOUSE_FUND_ASSETS.map(asset => (
            <div key={asset.id} style={styles.assetItem}>
              <div style={styles.assetName}>
                <span style={styles.assetIcon}>{asset.icon}</span>
                <div>
                  <div style={styles.assetLabel}>{asset.name}</div>
                  <div style={styles.assetNote}>{asset.note} · {asset.available}</div>
                </div>
              </div>
              <div style={styles.assetAmount}>
                ₩{asset.amount.toLocaleString()}
              </div>
            </div>
          ))}
          <div style={styles.totalBox}>
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>총 자산</span>
              <span style={styles.totalAmount}>₩{totalAssets.toLocaleString()}</span>
            </div>
            <div style={{ ...styles.totalRow, marginBottom: 0 }}>
              <span style={styles.totalLabel}>2027년 활용 가능</span>
              <span style={{ ...styles.totalAmount, fontSize: isMobile ? '16px' : '18px', color: '#00C853' }}>
                ₩{availableNow.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 목표 주택 선택 */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span>🏠</span> 목표 주택 유형
          </div>
          {TARGET_HOMES.map(home => (
            <div
              key={home.id}
              style={styles.homeOption(selectedHome.id === home.id)}
              onClick={() => setSelectedHome(home)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={styles.homeType}>{home.type}</div>
                  <div style={styles.homeSize}>{home.size}</div>
                </div>
                <div style={styles.homePrice}>{home.priceRange}</div>
              </div>
              {selectedHome.id === home.id && (
                <div style={{ marginTop: '12px', fontSize: isMobile ? '11px' : '12px' }}>
                  <div style={{ color: '#4E5968', marginBottom: '4px' }}>
                    추천 지역: {home.regions.join(', ')}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {home.pros.map((pro, i) => (
                      <span key={i} style={styles.badge('green')}>✓ {pro}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 대출 시뮬레이터 */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span>🏦</span> 대출 시뮬레이터
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>
              대출금액: <span style={styles.inputValue}>{(loanAmount / 100000000).toFixed(1)}억원</span>
            </label>
            <input
              type="range"
              min="100000000"
              max="600000000"
              step="10000000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              style={styles.slider}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>
              금리: <span style={styles.inputValue}>{loanRate}%</span>
            </label>
            <input
              type="range"
              min="2.0"
              max="6.0"
              step="0.1"
              value={loanRate}
              onChange={(e) => setLoanRate(Number(e.target.value))}
              style={styles.slider}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>
              상환기간: <span style={styles.inputValue}>{loanYears}년</span>
            </label>
            <input
              type="range"
              min="10"
              max="40"
              step="5"
              value={loanYears}
              onChange={(e) => setLoanYears(Number(e.target.value))}
              style={styles.slider}
            />
          </div>

          <div style={styles.resultBox}>
            <div style={styles.resultLabel}>월 상환액</div>
            <div style={styles.resultValue}>₩{monthlyPayment.toLocaleString()}</div>
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '11px' : '12px', opacity: 0.9 }}>
              <span>총 상환액: ₩{(totalPayment / 100000000).toFixed(2)}억</span>
              <span>총 이자: ₩{(totalInterest / 100000000).toFixed(2)}억</span>
            </div>
          </div>
        </div>

        {/* 구매 가능성 분석 */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span>📊</span> 구매 가능성 분석
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: isMobile ? '13px' : '14px', color: '#4E5968' }}>목표 주택가</span>
              <span style={{ fontSize: isMobile ? '15px' : '16px', fontWeight: '600', color: '#191F28' }}>
                ₩{targetPrice.toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: isMobile ? '13px' : '14px', color: '#4E5968' }}>필요 자기자본 (20%)</span>
              <span style={{ fontSize: isMobile ? '15px' : '16px', fontWeight: '600', color: '#191F28' }}>
                ₩{requiredDownPayment.toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: isMobile ? '13px' : '14px', color: '#4E5968' }}>현재 보유 자금</span>
              <span style={{ fontSize: isMobile ? '15px' : '16px', fontWeight: '600', color: '#3182F6' }}>
                ₩{availableNow.toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: isMobile ? '13px' : '14px', color: '#4E5968' }}>부족 금액</span>
              <span style={{
                fontSize: isMobile ? '15px' : '16px',
                fontWeight: '600',
                color: requiredDownPayment > availableNow ? '#F04438' : '#00C853'
              }}>
                {requiredDownPayment > availableNow
                  ? `₩${(requiredDownPayment - availableNow).toLocaleString()}`
                  : '충분!'}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '600', color: '#191F28' }}>
              자기자본 달성률
            </span>
            <span style={{
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: '700',
              color: affordabilityPercent >= 100 ? '#00C853' : affordabilityPercent >= 70 ? '#FF9800' : '#F04438',
            }}>
              {affordabilityPercent}%
            </span>
          </div>
          <div style={styles.progressBar}>
            <div style={styles.progressFill(affordabilityPercent)} />
          </div>

          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#F7F8FA', borderRadius: '8px' }}>
            <div style={{ fontSize: isMobile ? '12px' : '13px', color: '#4E5968' }}>
              {affordabilityPercent >= 100
                ? '✅ 자기자본 조건을 충족합니다! 대출 신청이 가능합니다.'
                : affordabilityPercent >= 70
                ? '⚠️ 목표의 70% 이상 달성! 조금만 더 모으면 됩니다.'
                : '💪 꾸준히 저축하면 목표 달성 가능합니다.'}
            </div>
          </div>
        </div>

        {/* 정부 지원 정책 */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span>🏛️</span> 정부 지원 정책
          </div>
          {GOVERNMENT_POLICIES.map(policy => (
            <div key={policy.id} style={styles.policyCard}>
              <div style={styles.policyName}>{policy.name}</div>
              <div style={styles.policyDetail}>
                금리: <span style={styles.policyHighlight}>{policy.rate}</span> · 한도: <span style={styles.policyHighlight}>{policy.limit}</span>
              </div>
              <div style={styles.policyDetail}>조건: {policy.condition}</div>
              <div style={{ ...styles.policyDetail, color: '#3182F6', marginTop: '4px' }}>💡 {policy.note}</div>
            </div>
          ))}
        </div>

        {/* 청약 현황 */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span>🎯</span> 청약 현황
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: '#E8F3FF', borderRadius: '8px' }}>
              <div style={{ fontSize: isMobile ? '11px' : '12px', color: '#3182F6', marginBottom: '4px' }}>청약저축 잔액</div>
              <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#191F28' }}>
                ₩{SUBSCRIPTION_INFO.accountBalance.toLocaleString()}
              </div>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#E8F5E9', borderRadius: '8px' }}>
              <div style={{ fontSize: isMobile ? '11px' : '12px', color: '#00C853', marginBottom: '4px' }}>청약 순위</div>
              <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#191F28' }}>
                {SUBSCRIPTION_INFO.priority}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '600', color: '#191F28', marginBottom: '8px' }}>
              특별공급 자격
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {SUBSCRIPTION_INFO.specialSupplyEligible.map((type, i) => (
                <span key={i} style={styles.badge('blue')}>{type}</span>
              ))}
              {SUBSCRIPTION_INFO.isNewlywed && (
                <span style={styles.badge('green')}>신혼부부 (혼인 {SUBSCRIPTION_INFO.marriageDate})</span>
              )}
            </div>
          </div>

          <div style={{ padding: '12px', backgroundColor: '#FFF3E0', borderRadius: '8px' }}>
            <div style={{ fontSize: isMobile ? '12px' : '13px', color: '#E65100' }}>
              💡 신혼부부 특별공급은 일반공급 대비 경쟁률이 낮아 당첨 확률이 높습니다.
              혼인신고 후 7년 이내에 신청하세요!
            </div>
          </div>
        </div>

        {/* 로드맵 */}
        <div style={{ ...styles.card, ...styles.fullWidth }}>
          <div style={styles.cardTitle}>
            <span>🗺️</span> 내 집 마련 로드맵
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '20px' }}>
            <div>
              <div style={styles.timelineItem}>
                <div style={styles.timelineDot} />
                <div style={styles.timelineContent}>
                  <div style={styles.timelineDate}>2026.06</div>
                  <div style={styles.timelineTitle}>가족 지원금 수령</div>
                  <div style={styles.timelineDesc}>2,000만원 확보</div>
                </div>
              </div>
              <div style={styles.timelineItem}>
                <div style={styles.timelineDot} />
                <div style={styles.timelineContent}>
                  <div style={styles.timelineDate}>2026.07</div>
                  <div style={styles.timelineTitle}>전세 보증금 회수</div>
                  <div style={styles.timelineDesc}>4,500만원 확보 (임시 거주지 필요)</div>
                </div>
              </div>
              <div style={styles.timelineItem}>
                <div style={styles.timelineDot} />
                <div style={styles.timelineContent}>
                  <div style={styles.timelineDate}>2026.하반기</div>
                  <div style={styles.timelineTitle}>청약 신청 시작</div>
                  <div style={styles.timelineDesc}>3기 신도시, GTX 역세권 위주</div>
                </div>
              </div>
            </div>
            <div>
              <div style={styles.timelineItem}>
                <div style={{ ...styles.timelineDot, backgroundColor: '#00C853' }} />
                <div style={styles.timelineContent}>
                  <div style={{ ...styles.timelineDate, color: '#00C853' }}>2027.상반기</div>
                  <div style={styles.timelineTitle}>투자자산 정리</div>
                  <div style={styles.timelineDesc}>ISA, 주식 일부 매도 (약 5,000만원)</div>
                </div>
              </div>
              <div style={styles.timelineItem}>
                <div style={{ ...styles.timelineDot, backgroundColor: '#00C853' }} />
                <div style={styles.timelineContent}>
                  <div style={{ ...styles.timelineDate, color: '#00C853' }}>2027~2028</div>
                  <div style={styles.timelineTitle}>주택 계약 & 입주</div>
                  <div style={styles.timelineDesc}>청약 당첨 또는 매매 계약</div>
                </div>
              </div>
              <div style={styles.timelineItem}>
                <div style={{ ...styles.timelineDot, backgroundColor: '#9C27B0' }} />
                <div style={styles.timelineContent}>
                  <div style={{ ...styles.timelineDate, color: '#9C27B0' }}>2030</div>
                  <div style={styles.timelineTitle}>청년도약계좌 만기</div>
                  <div style={styles.timelineDesc}>약 2,000만원+ 추가 확보 (중도상환용)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 지역별 시세 */}
        <div style={{ ...styles.card, ...styles.fullWidth }}>
          <div style={styles.cardTitle}>
            <span>📍</span> 지역별 아파트 시세 (2026년 3월 기준)
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>지역</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>84㎡ (억)</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>59㎡ (억)</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>전월대비</th>
                </tr>
              </thead>
              <tbody>
                {REGIONAL_PRICES.map((item, idx) => (
                  <tr key={idx}>
                    <td style={styles.td}>{item.region}</td>
                    <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600' }}>{item.apt84}억</td>
                    <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600' }}>{item.apt59}억</td>
                    <td style={{
                      ...styles.td,
                      textAlign: 'right',
                      color: item.change.startsWith('+') ? '#00C853' : '#F04438',
                      fontWeight: '600',
                    }}>
                      {item.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '12px', fontSize: isMobile ? '11px' : '12px', color: '#8B95A1' }}>
            * 실거래가 기준 평균값이며, 실제 거래 시 변동될 수 있습니다.
          </div>
        </div>
      </div>
    </div>
  )
}
