import { useState, useEffect } from 'react'

// ===== 하늘 자산 (하우가 패밀리) =====
const HANEUL_ASSETS = [
  { id: 'toss', name: '토스증권 (소수점)', amount: 686187, icon: '📱', available: '즉시', note: '18개 종목' },
  { id: 'mirae-pension', name: '연금저축 (미래에셋)', amount: 827010, icon: '🧓', available: '55세 이후', note: '+6.31%' },
  { id: 'mirae-isa', name: 'ISA (미래에셋)', amount: 504089, icon: '📊', available: '3년 후', note: '+0.96%' },
  { id: 'mirae-stock', name: '종합주식 (미래에셋)', amount: 740637, icon: '📈', available: '즉시', note: '-0.52%' },
  { id: 'mirae-cma', name: 'CMA 비상금', amount: 600179, icon: '💰', available: '즉시', note: '미래에셋' },
  { id: 'mirae-trip', name: 'CMA 가족여행', amount: 410119, icon: '✈️', available: '즉시', note: '미래에셋' },
  { id: 'hanwha', name: '한화생명 저축보험', amount: 12390000, icon: '🛡️', available: '만기시', note: '59/144회 납입' },
  { id: 'housing', name: '청약저축', amount: 720000, icon: '🏠', available: '즉시', note: '1순위 달성' },
]

// ===== 가윤 자산 (가윤 달리오) =====
const GAYOON_ASSETS = [
  // 고정자산
  { id: 'youth', name: '청년도약계좌', amount: 16800000, icon: '🚀', available: '2030', note: '5년 만기', category: '고정' },
  { id: 'housing', name: '청약저축', amount: 6220000, icon: '🏠', available: '즉시', note: '1순위 충족', category: '고정' },
  { id: 'isa', name: 'ISA (삼성증권)', amount: 20041099, icon: '📊', available: '3년 후', note: '+0.21%', category: '고정' },
  { id: 'pension', name: '연금저축 (미래에셋)', amount: 3999404, icon: '🧓', available: '55세 이후', note: '-0.02%', category: '고정' },
  // 비변동성 자산
  { id: 'sp500', name: 'S&P500 + 배당주', amount: 24796498, icon: '📈', available: '즉시', note: '+8.96%', category: '투자' },
  { id: 'amazon', name: '아마존 (AMZN)', amount: 2638715, icon: '🛒', available: '즉시', note: '9주 · -5.15%', category: '투자' },
  { id: 'btc', name: '비트코인', amount: 990775, icon: '₿', available: '즉시', note: '0.0102 BTC', category: '투자' },
  { id: 'family', name: '가족 받을 돈', amount: 20000000, icon: '👨‍👩‍👧', available: '2026.06', note: '확정', category: '예정' },
  { id: 'deposit', name: '전세 보증금', amount: 45000000, icon: '🏢', available: '2026.07', note: '현재 거주 중', category: '예정' },
  // 변동성 자산
  { id: 'cma', name: 'CMA (삼성증권)', amount: 7738854, icon: '💵', available: '즉시', note: '+0.02%', category: '현금' },
  { id: 'savings', name: '자율적금', amount: 4500000, icon: '💰', available: '2026.09', note: '1년 만기', category: '현금' },
  { id: 'irp', name: 'IRP (삼성증권)', amount: 273323, icon: '🏦', available: '55세 이후', note: '+36.66%', category: '고정' },
]

// 합산 자산 (주택 구매용 - 즉시/2027년까지 활용 가능한 것만)
const HOUSE_FUND_SUMMARY = {
  haneul: {
    total: HANEUL_ASSETS.reduce((sum, a) => sum + a.amount, 0),
    available2027: HANEUL_ASSETS.filter(a =>
      a.available === '즉시' || a.available === '3년 후'
    ).reduce((sum, a) => sum + a.amount, 0),
  },
  gayoon: {
    total: GAYOON_ASSETS.reduce((sum, a) => sum + a.amount, 0),
    available2027: GAYOON_ASSETS.filter(a =>
      a.available === '즉시' || a.available === '2026.06' || a.available === '2026.07' || a.available === '2026.09' || a.available === '3년 후'
    ).reduce((sum, a) => sum + a.amount, 0),
  },
}

// 목표 주택 옵션
const TARGET_HOMES = [
  {
    id: 'apt-target',
    type: '목표 아파트 (6~7억)',
    size: '59~84㎡ (24~34평)',
    priceRange: '6~7억',
    avgPrice: 650000000,
    regions: ['경기 수도권', '인천 송도', '수원/용인', '3기 신도시'],
    pros: ['청약 활용 가능', '신혼부부 특별공급', '적정 가격대'],
    cons: ['경쟁률 높음', '입주까지 대기'],
    recommended: true,
  },
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
    priceRange: '7~9억',
    avgPrice: 800000000,
    regions: ['경기 수도권', '분당', '용인'],
    pros: ['가족 생활 적합', '학군 선택 가능'],
    cons: ['높은 가격', '경쟁 치열'],
  },
  {
    id: 'newtown',
    type: '신축 분양 (청약)',
    size: '84㎡ (34평)',
    priceRange: '5~8억',
    avgPrice: 650000000,
    regions: ['GTX 역세권', '3기 신도시'],
    pros: ['청약 활용', '새 아파트', '분양가 상한제'],
    cons: ['입주까지 2~3년', '당첨 경쟁'],
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

// 정부 지원 정책 (2026년 기준, 출처 포함)
const GOVERNMENT_POLICIES = [
  {
    id: 'didimdol',
    name: '내집마련 디딤돌대출',
    rate: '연 2.0~3.3% (우대 시 최저 1.2%)',
    limit: '일반 2억, 신혼가구 3.2억',
    condition: '무주택 세대주, 신혼 연소득 8,500만원 이하',
    note: '생애최초 LTV 80%, 담보주택 6억원 이하',
    source: '한국주택금융공사 (hf.go.kr)',
  },
  {
    id: 'newlywed-lease',
    name: '신혼가구 전용 버팀목 전세대출',
    rate: '연 1.9~3.3% (우대 시 최저 1.0%)',
    limit: '최대 2.4억 (보증금 80%)',
    condition: '혼인 7년 이내 또는 3개월 내 결혼예정',
    note: '전세보증금 5억원까지 (수도권)',
    source: '마이홈포털 (myhome.go.kr)',
  },
  {
    id: 'newbaby',
    name: '신생아 특례 대출 (디딤돌/버팀목)',
    rate: '연 1.3~4.3%',
    limit: '주택구입 최대 4억 / 전세 최대 2.4억',
    condition: '2년 내 출산(입양), 소득 1.3억 이하',
    note: 'LTV 70%, 생애최초 일부 구간 예외',
    source: '뱅크샐러드 (banksalad.com)',
  },
  {
    id: 'special-supply',
    name: '신혼부부 특별공급',
    rate: '-',
    limit: '전용 85㎡ 이하',
    condition: '혼인 7년 이내, 무주택',
    note: '일반공급 대비 경쟁률 낮음',
    source: '국토교통부 청약홈 (applyhome.co.kr)',
  },
]

// 2025~2026 주요 부동산 정책 (출처 포함)
const RECENT_POLICIES = [
  {
    id: 'policy-627',
    date: '2025.06.27',
    name: '6·27 부동산 대책',
    content: '수도권/규제지역 주담대 한도 6억원 제한, LTV·DSR 규제 강화',
    impact: '실수요자 대출 접근성 감소',
    source: '금융위원회',
    sourceUrl: 'https://www.fsc.go.kr',
  },
  {
    id: 'policy-1015',
    date: '2025.10.15',
    name: '10·15 부동산 대책',
    content: '시가 15억 초과 주택 최대 4억, 25억 초과 최대 2억 대출한도, 스트레스 금리 3.0%',
    impact: '고가주택 대출 문턱 상승, 15억 이하 실수요자 영향 제한적',
    source: '나무위키 (namu.wiki)',
    sourceUrl: 'https://namu.wiki/w/10.15%20부동산%20대책',
  },
  {
    id: 'policy-2026-lease',
    date: '2026.04 예정',
    name: '전세대출 규제',
    content: '전세대출 한도 2억원 일원화, 보증료 차등 적용',
    impact: '고가 전세 대출 어려움',
    source: '금융위원회',
    sourceUrl: 'https://www.fsc.go.kr',
  },
  {
    id: 'policy-basic-housing',
    date: '2026.상반기',
    name: '기본주택 시범단지 입주자 모집',
    content: '무주택자 대상 30년 이상 평생거주 공공임대, 소득/자산 무관',
    impact: '청년/신혼부부 주거안정 기대',
    source: '대한민국 정책브리핑 (korea.kr)',
    sourceUrl: 'https://www.korea.kr',
  },
  {
    id: 'policy-youth-housing',
    date: '2026년',
    name: '청년·신혼부부 공공임대 확대',
    content: '청년 3.5만가구(+8천), 신혼 3.1만가구(+3천) 공급 확대',
    impact: '공공임대 물량 증가',
    source: '토스뱅크 (tossbank.com)',
    sourceUrl: 'https://www.tossbank.com/articles/youth-2026',
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

  // 총 자산 계산 (하늘 + 가윤 합산)
  const haneulTotal = HOUSE_FUND_SUMMARY.haneul.total
  const gayoonTotal = HOUSE_FUND_SUMMARY.gayoon.total
  const totalAssets = haneulTotal + gayoonTotal
  const haneulAvailable = HOUSE_FUND_SUMMARY.haneul.available2027
  const gayoonAvailable = HOUSE_FUND_SUMMARY.gayoon.available2027
  const availableNow = haneulAvailable + gayoonAvailable

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
          하늘 & 가윤의 내 집 마련 프로젝트 | 2027 전세 → 2028 청약 매수 (6~7억)
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
        {/* 하늘 자산 현황 */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span>☀️</span> 하늘 자산 (하우가 패밀리)
          </div>
          {HANEUL_ASSETS.map(asset => (
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
              <span style={styles.totalLabel}>하늘 총 자산</span>
              <span style={{ ...styles.totalAmount, color: '#FF6B35' }}>₩{haneulTotal.toLocaleString()}</span>
            </div>
            <div style={{ ...styles.totalRow, marginBottom: 0 }}>
              <span style={styles.totalLabel}>2027년 활용 가능</span>
              <span style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '600', color: '#00C853' }}>
                ₩{haneulAvailable.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 가윤 자산 현황 */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span>💜</span> 가윤 자산 (가윤 달리오)
          </div>
          {GAYOON_ASSETS.map(asset => (
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
              <span style={styles.totalLabel}>가윤 총 자산</span>
              <span style={{ ...styles.totalAmount, color: '#9C27B0' }}>₩{gayoonTotal.toLocaleString()}</span>
            </div>
            <div style={{ ...styles.totalRow, marginBottom: 0 }}>
              <span style={styles.totalLabel}>2027년 활용 가능</span>
              <span style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '600', color: '#00C853' }}>
                ₩{gayoonAvailable.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 합산 요약 카드 */}
        <div style={{ ...styles.card, ...styles.fullWidth, backgroundColor: '#F0F7FF', border: '2px solid #3182F6' }}>
          <div style={styles.cardTitle}>
            <span>🏠</span> 하우가 합산 자산
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: '16px',
          }}>
            <div style={{ textAlign: 'center', padding: '12px' }}>
              <div style={{ fontSize: '12px', color: '#4E5968', marginBottom: '4px' }}>하늘</div>
              <div style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: '700', color: '#FF6B35' }}>
                {(haneulTotal / 100000000).toFixed(2)}억
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px' }}>
              <div style={{ fontSize: '12px', color: '#4E5968', marginBottom: '4px' }}>가윤</div>
              <div style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: '700', color: '#9C27B0' }}>
                {(gayoonTotal / 100000000).toFixed(2)}억
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px' }}>
              <div style={{ fontSize: '12px', color: '#4E5968', marginBottom: '4px' }}>합계</div>
              <div style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: '700', color: '#3182F6' }}>
                {(totalAssets / 100000000).toFixed(2)}억
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#E8F5E9', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#00C853', marginBottom: '4px' }}>2027년 활용 가능</div>
              <div style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: '700', color: '#00C853' }}>
                {(availableNow / 100000000).toFixed(2)}억
              </div>
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

        {/* 정부 지원 정책 (출처 포함) */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span>🏛️</span> 정부 지원 정책 (2026년 기준)
          </div>
          {GOVERNMENT_POLICIES.map(policy => (
            <div key={policy.id} style={styles.policyCard}>
              <div style={styles.policyName}>{policy.name}</div>
              <div style={styles.policyDetail}>
                금리: <span style={styles.policyHighlight}>{policy.rate}</span> · 한도: <span style={styles.policyHighlight}>{policy.limit}</span>
              </div>
              <div style={styles.policyDetail}>조건: {policy.condition}</div>
              <div style={{ ...styles.policyDetail, color: '#3182F6', marginTop: '4px' }}>💡 {policy.note}</div>
              <div style={{ fontSize: isMobile ? '10px' : '11px', color: '#8B95A1', marginTop: '6px' }}>
                📎 출처: {policy.source}
              </div>
            </div>
          ))}
          <div style={{ fontSize: isMobile ? '10px' : '11px', color: '#8B95A1', marginTop: '8px', padding: '8px', backgroundColor: '#F7F8FA', borderRadius: '6px' }}>
            ⚠️ 정책 내용은 수시로 변경될 수 있습니다. 최신 정보는 각 기관 공식 사이트에서 확인하세요.
          </div>
        </div>

        {/* 2025~2026 주요 부동산 정책 */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span>📋</span> 최근 부동산 정책 (2025~2026)
          </div>
          {RECENT_POLICIES.map(policy => (
            <div key={policy.id} style={{ ...styles.policyCard, borderLeft: '3px solid #3182F6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: isMobile ? '11px' : '12px', color: '#3182F6', fontWeight: '600' }}>{policy.date}</span>
                <span style={styles.badge(policy.impact.includes('감소') || policy.impact.includes('어려움') ? 'orange' : 'green')}>
                  {policy.impact.includes('감소') || policy.impact.includes('어려움') ? '주의' : '긍정'}
                </span>
              </div>
              <div style={styles.policyName}>{policy.name}</div>
              <div style={styles.policyDetail}>{policy.content}</div>
              <div style={{ fontSize: isMobile ? '11px' : '12px', color: '#4E5968', marginTop: '4px' }}>
                📌 영향: {policy.impact}
              </div>
              <div style={{ fontSize: isMobile ? '10px' : '11px', color: '#8B95A1', marginTop: '4px' }}>
                📎 출처: {policy.source}
              </div>
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
            <span>🗺️</span> 내 집 마련 로드맵 (2027 전세 → 2028 매수)
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
                  <div style={styles.timelineTitle}>현 전세 만기 → 신규 전세 이동</div>
                  <div style={styles.timelineDesc}>보증금 4,500만원 활용, 2~3억 전세 이동</div>
                </div>
              </div>
              <div style={styles.timelineItem}>
                <div style={styles.timelineDot} />
                <div style={styles.timelineContent}>
                  <div style={styles.timelineDate}>2026.하반기</div>
                  <div style={styles.timelineTitle}>청약 신청 시작</div>
                  <div style={styles.timelineDesc}>3기 신도시, GTX 역세권 (6~7억대)</div>
                </div>
              </div>
              <div style={styles.timelineItem}>
                <div style={{ ...styles.timelineDot, backgroundColor: '#FF9800' }} />
                <div style={styles.timelineContent}>
                  <div style={{ ...styles.timelineDate, color: '#FF9800' }}>2027년</div>
                  <div style={styles.timelineTitle}>전세 생활 + 자금 축적</div>
                  <div style={styles.timelineDesc}>청약 지속 신청, 투자자산 수익 확보</div>
                </div>
              </div>
            </div>
            <div>
              <div style={styles.timelineItem}>
                <div style={{ ...styles.timelineDot, backgroundColor: '#00C853' }} />
                <div style={styles.timelineContent}>
                  <div style={{ ...styles.timelineDate, color: '#00C853' }}>2028년 목표</div>
                  <div style={styles.timelineTitle}>청약 당첨 또는 매수</div>
                  <div style={styles.timelineDesc}>6~7억 아파트 계약 (자기자본 1.3~1.5억 + 대출)</div>
                </div>
              </div>
              <div style={styles.timelineItem}>
                <div style={{ ...styles.timelineDot, backgroundColor: '#00C853' }} />
                <div style={styles.timelineContent}>
                  <div style={{ ...styles.timelineDate, color: '#00C853' }}>2028~2029</div>
                  <div style={styles.timelineTitle}>입주 준비</div>
                  <div style={styles.timelineDesc}>잔금 납부, ISA/연금저축 일부 해지 검토</div>
                </div>
              </div>
              <div style={styles.timelineItem}>
                <div style={{ ...styles.timelineDot, backgroundColor: '#9C27B0' }} />
                <div style={styles.timelineContent}>
                  <div style={{ ...styles.timelineDate, color: '#9C27B0' }}>2030</div>
                  <div style={styles.timelineTitle}>청년도약계좌 만기</div>
                  <div style={styles.timelineDesc}>약 2,000만원+ 확보 (대출 중도상환)</div>
                </div>
              </div>
            </div>
          </div>
          {/* 목표 요약 */}
          <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#E8F3FF', borderRadius: '12px', border: '1px solid #3182F6' }}>
            <div style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: '#3182F6', marginBottom: '8px' }}>
              🎯 2028년 목표: 6~7억 아파트 매수
            </div>
            <div style={{ fontSize: isMobile ? '12px' : '13px', color: '#4E5968' }}>
              • 필요 자기자본 (20%): 1.2~1.4억원<br/>
              • 예상 대출 (LTV 80%): 4.8~5.6억원<br/>
              • 월 상환액 (30년, 3.5%): 약 215~250만원<br/>
              • 신혼부부 특별공급 + 생애최초 LTV 우대 활용
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
