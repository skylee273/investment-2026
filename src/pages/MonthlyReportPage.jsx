import { useState, useEffect } from 'react'

// ========== 월간 리포트 데이터 ==========
const MONTHLY_REPORT_DATA = {
  hauga: {
    '2026-02': {
      period: '2026.02.01 ~ 02.28',
      summary: '기술주 약세 속 에너지 섹터가 버팀목 역할',
      monthReturn: 1.2,
      cumulative: 1.2,
      alpha: 2.7,
      volatility: 12.5,
      mdd: -8.2,
      totalAsset: 4150000,
      totalInvested: 4100000,
      topStocks: [
        { ticker: 'CVX', name: '셰브론', return: 11.84, reason: '에너지 가격 상승' },
        { ticker: 'TIGER_BOND', name: 'TIGER 미국채10년', return: 2.27, reason: '금리 인하 기대' },
        { ticker: 'CMA', name: 'CMA', return: 0.02, reason: '안정적 이자 수익' },
      ],
      bottomStocks: [
        { ticker: 'META', name: '메타', return: -16.88, reason: 'AI 투자 우려' },
        { ticker: 'GOOGL', name: '알파벳 A', return: -14.31, reason: '반독점 이슈' },
        { ticker: 'MSFT', name: '마이크로소프트', return: -13.52, reason: '클라우드 성장 둔화' },
      ],
      sectorContribution: [
        { sector: '에너지', contribution: 2.1, weight: 16 },
        { sector: '채권', contribution: 0.3, weight: 5 },
        { sector: 'S&P500', contribution: -0.5, weight: 12 },
        { sector: 'Big Tech', contribution: -1.8, weight: 23 },
      ],
      marketEnvironment: {
        sp500: { value: 5954, change: -1.4 },
        kospi: { value: 2566, change: -2.1 },
        usdkrw: { value: 1435, change: 1.2 },
        btc: { value: 96500000, change: -5.3 },
        events: [
          { date: '02.05', event: 'FOMC 의사록 공개' },
          { date: '02.12', event: 'CPI 발표 (3.0% YoY)' },
          { date: '02.21', event: 'NVIDIA 실적 발표' },
        ],
      },
      keyFactors: [
        '트럼프 관세 정책 불확실성으로 기술주 변동성 확대',
        '에너지 섹터는 유가 강세와 배당 매력으로 아웃퍼폼',
        '채권은 금리 인하 기대감으로 소폭 플러스',
      ],
      nextMonthOutlook: '3월은 분기말 리밸런싱과 FOMC 회의가 핵심. 관세 정책 실행 여부에 따라 시장 방향 결정. 에너지/방어주 비중 유지 권고.',
      riskChecklist: [
        { risk: '미중 관세 갈등 심화', level: 'high', status: 'monitoring' },
        { risk: 'Big Tech 실적 둔화', level: 'medium', status: 'occurred' },
        { risk: '원/달러 환율 급등', level: 'medium', status: 'monitoring' },
        { risk: '비트코인 변동성', level: 'low', status: 'resolved' },
      ],
    },
    '2026-03': {
      period: '2026.03.01 ~ 03.29',
      summary: '관세 쇼크로 전 섹터 하락, 셰브론만 플러스',
      monthReturn: -3.8,
      cumulative: -2.6,
      alpha: 1.5,
      volatility: 18.2,
      mdd: -12.5,
      totalAsset: 3858585,
      totalInvested: 4034177,
      topStocks: [
        { ticker: 'CVX', name: '셰브론', return: 11.84, reason: '에너지 섹터 강세 지속' },
        { ticker: 'TIGER_BOND', name: 'TIGER 미국채10년', return: 2.27, reason: '안전자산 선호' },
        { ticker: 'CMA', name: 'CMA', return: 0.00, reason: '안정적 현금성 자산' },
      ],
      bottomStocks: [
        { ticker: 'META', name: '메타', return: -16.88, reason: '광고 시장 둔화 우려' },
        { ticker: 'GOOGL', name: '알파벳 A', return: -14.31, reason: '반독점 규제 강화' },
        { ticker: 'MSFT', name: '마이크로소프트', return: -13.52, reason: 'AI 투자 대비 수익화 지연' },
      ],
      sectorContribution: [
        { sector: '에너지', contribution: 1.8, weight: 18 },
        { sector: '채권', contribution: 0.2, weight: 6 },
        { sector: '국내주식', contribution: -1.2, weight: 40 },
        { sector: 'Big Tech', contribution: -3.5, weight: 25 },
      ],
      marketEnvironment: {
        sp500: { value: 5611, change: -5.8 },
        kospi: { value: 2481, change: -3.3 },
        usdkrw: { value: 1472, change: 2.6 },
        btc: { value: 107000000, change: 10.9 },
        events: [
          { date: '03.04', event: '트럼프 관세 발표 (캐나다/멕시코 25%)' },
          { date: '03.12', event: 'CPI 발표 (2.8% YoY)' },
          { date: '03.19', event: 'FOMC 금리 동결' },
          { date: '03.26', event: 'EU 보복관세 발표' },
        ],
      },
      keyFactors: [
        '트럼프 관세 정책으로 글로벌 교역 불확실성 급증',
        '기술주 전반 약세, 특히 빅테크 타격 심각',
        '에너지/채권만 플러스, 방어적 포지션 유효',
      ],
      nextMonthOutlook: '4월은 1분기 실적 시즌 시작. 관세 영향이 실적에 반영되기 시작할 것. 변동성 대비해 현금 비중 확대 검토. 기술주 저점 매수 기회 모색.',
      riskChecklist: [
        { risk: '무역전쟁 확대', level: 'high', status: 'occurred' },
        { risk: 'Big Tech 추가 하락', level: 'high', status: 'monitoring' },
        { risk: '원/달러 1,500원 돌파', level: 'medium', status: 'monitoring' },
        { risk: '국내증시 2,400선 붕괴', level: 'medium', status: 'monitoring' },
      ],
    },
    '2026-04': {
      period: '2026.04.01 ~ 04.22',
      summary: '관세 완화 기대감에 기술주 반등, 에너지 강세 지속',
      monthReturn: 3.44,
      cumulative: 3.44,
      alpha: 5.1,
      volatility: 14.8,
      mdd: -6.2,
      totalAsset: 4981364,
      totalInvested: 4815580,
      topStocks: [
        { ticker: 'CVX', name: '셰브론', return: 15.2, reason: '에너지 섹터 강세 지속' },
        { ticker: 'KODEX_NAS', name: 'KODEX 나스닥100', return: 8.5, reason: '기술주 반등' },
        { ticker: 'TIGER_SP', name: 'TIGER S&P500', return: 6.2, reason: '미국증시 회복' },
      ],
      bottomStocks: [
        { ticker: 'KHC', name: '크래프트 하인즈', return: -5.2, reason: '소비재 약세' },
        { ticker: 'KODEX200', name: 'KODEX 200', return: -2.1, reason: '국내증시 부진' },
        { ticker: 'GOOGL', name: '알파벳', return: -1.8, reason: '반독점 이슈 지속' },
      ],
      sectorContribution: [
        { sector: '에너지', contribution: 2.5, weight: 18 },
        { sector: '해외지수', contribution: 1.8, weight: 35 },
        { sector: '채권', contribution: 0.3, weight: 8 },
        { sector: '국내주식', contribution: -0.5, weight: 32 },
      ],
      marketEnvironment: {
        sp500: { value: 5450, change: 4.2 },
        kospi: { value: 2520, change: 1.6 },
        usdkrw: { value: 1420, change: -3.5 },
        btc: { value: 125000000, change: 16.8 },
        events: [
          { date: '04.02', event: '트럼프 관세 90일 유예 발표' },
          { date: '04.10', event: 'CPI 발표 (2.6% YoY)' },
          { date: '04.15', event: 'NVIDIA 실적 발표' },
          { date: '04.18', event: 'FOMC 금리 동결 (5.25%)' },
        ],
      },
      keyFactors: [
        '트럼프 관세 90일 유예로 시장 안정, 기술주 반등',
        '에너지 섹터 꾸준한 강세, 배당 수익 확보',
        '국내주식 상대적 약세로 리밸런싱 필요성 대두',
      ],
      nextMonthOutlook: '5월은 관세 협상 결과와 2분기 실적에 주목. 기술주 추가 반등 가능성 높으나 변동성 주의. 국내주식 비중 축소 검토.',
      riskChecklist: [
        { risk: '관세 협상 결렬', level: 'medium', status: 'monitoring' },
        { risk: '기술주 과열', level: 'low', status: 'monitoring' },
        { risk: '원화 강세 지속', level: 'low', status: 'resolved' },
        { risk: '국내증시 추가 하락', level: 'medium', status: 'monitoring' },
      ],
    },
  },
  gayoon: {
    '2026-02': {
      period: '2026.02.01 ~ 02.28',
      summary: 'S&P500 중심 포트폴리오, 안정적 성과 유지',
      monthReturn: 2.3,
      cumulative: 5.5,
      alpha: 3.8,
      volatility: 10.2,
      mdd: -5.8,
      totalAsset: 66500000,
      totalInvested: 63000000,
      topStocks: [
        { ticker: 'SCHD', name: 'Schwab 배당주', return: 13.29, reason: '배당 안정성 부각' },
        { ticker: 'VOO', name: 'Vanguard S&P500', return: 7.11, reason: '지수 추종 효과' },
        { ticker: 'TIGER_BD', name: 'TIGER 미국채10년', return: 3.28, reason: '금리 하락 수혜' },
      ],
      bottomStocks: [
        { ticker: 'KBANK', name: '케이뱅크', return: -24.46, reason: 'IPO 후 조정' },
        { ticker: 'PLUS_EM', name: 'PLUS 신흥국MSCI', return: -10.08, reason: '신흥국 약세' },
        { ticker: 'KODEX_G', name: 'KODEX 금액티브', return: -8.96, reason: '금 가격 조정' },
      ],
      sectorContribution: [
        { sector: 'S&P500', contribution: 2.8, weight: 38 },
        { sector: '배당주', contribution: 1.2, weight: 7 },
        { sector: '채권', contribution: 0.4, weight: 3 },
        { sector: '국내주식', contribution: -1.5, weight: 17 },
      ],
      marketEnvironment: {
        sp500: { value: 5954, change: -1.4 },
        kospi: { value: 2566, change: -2.1 },
        usdkrw: { value: 1435, change: 1.2 },
        btc: { value: 96500000, change: -5.3 },
        events: [
          { date: '02.05', event: 'FOMC 의사록 공개' },
          { date: '02.12', event: 'CPI 발표 (3.0% YoY)' },
          { date: '02.21', event: 'NVIDIA 실적 발표' },
        ],
      },
      keyFactors: [
        'S&P500 중심 포트폴리오로 시장 대비 안정적 성과',
        '배당주(SCHD) 비중이 하방 방어에 기여',
        '신흥국/금 ETF 약세가 수익률 제한',
      ],
      nextMonthOutlook: '3월은 관세 정책 영향 주시 필요. S&P500 비중 유지하되 변동성 대비. 배당주 비중 추가 확대 검토.',
      riskChecklist: [
        { risk: '미중 관세 갈등', level: 'medium', status: 'monitoring' },
        { risk: '신흥국 ETF 추가 하락', level: 'medium', status: 'occurred' },
        { risk: '환율 상승 리스크', level: 'low', status: 'resolved' },
        { risk: 'IPO 종목 변동성', level: 'high', status: 'occurred' },
      ],
    },
    '2026-03': {
      period: '2026.03.01 ~ 03.29',
      summary: '관세 충격에도 S&P500 중심 전략 유효',
      monthReturn: -1.2,
      cumulative: 4.3,
      alpha: 4.6,
      volatility: 14.5,
      mdd: -8.2,
      totalAsset: 67622384,
      totalInvested: 65240260,
      topStocks: [
        { ticker: 'SCHD', name: 'Schwab 배당주', return: 13.29, reason: '방어적 섹터 강세' },
        { ticker: 'VOO', name: 'Vanguard S&P500', return: 7.11, reason: '분산 투자 효과' },
        { ticker: 'TIGER_BD', name: 'TIGER 미국채10년', return: 3.28, reason: '안전자산 선호' },
      ],
      bottomStocks: [
        { ticker: 'KBANK', name: '케이뱅크', return: -24.46, reason: '지속적 하락세' },
        { ticker: 'PLUS_EM', name: 'PLUS 신흥국MSCI', return: -10.08, reason: '관세 영향권' },
        { ticker: 'KODEX200_P', name: 'KODEX 200 (연금)', return: -9.06, reason: '코스피 약세' },
      ],
      sectorContribution: [
        { sector: 'S&P500', contribution: 2.1, weight: 37 },
        { sector: '배당주', contribution: 1.0, weight: 7 },
        { sector: '채권', contribution: 0.3, weight: 3 },
        { sector: '국내주식', contribution: -2.8, weight: 18 },
      ],
      marketEnvironment: {
        sp500: { value: 5611, change: -5.8 },
        kospi: { value: 2481, change: -3.3 },
        usdkrw: { value: 1472, change: 2.6 },
        btc: { value: 107000000, change: 10.9 },
        events: [
          { date: '03.04', event: '트럼프 관세 발표' },
          { date: '03.12', event: 'CPI 2.8% 발표' },
          { date: '03.19', event: 'FOMC 금리 동결' },
          { date: '03.26', event: 'EU 보복관세 발표' },
        ],
      },
      keyFactors: [
        '관세 충격에도 시장 대비 선방 (알파 +4.6%)',
        'S&P500/배당주 중심 전략이 하방 방어',
        '국내주식(KODEX) 비중이 수익률 제한 요인',
      ],
      nextMonthOutlook: '4월 실적 시즌 대비 현금 비중 확보 필요. 국내주식 비중 축소 검토. S&P500 추가 하락 시 분할 매수 기회.',
      riskChecklist: [
        { risk: '무역전쟁 장기화', level: 'high', status: 'occurred' },
        { risk: '원화 약세 지속', level: 'medium', status: 'monitoring' },
        { risk: '국내 ETF 손실 확대', level: 'medium', status: 'occurred' },
        { risk: '케이뱅크 추가 하락', level: 'high', status: 'monitoring' },
      ],
    },
    '2026-04': {
      period: '2026.04.01 ~ 04.22',
      summary: '관세 완화 기대감에 S&P500 중심 포트폴리오 반등',
      monthReturn: 6.70,
      cumulative: 6.70,
      alpha: 7.2,
      volatility: 12.5,
      mdd: -4.8,
      totalAsset: 87450618,
      totalInvested: 81962161,
      topStocks: [
        { ticker: 'BTC', name: '비트코인', return: 22.40, reason: '암호화폐 강세' },
        { ticker: 'VOO', name: 'Vanguard S&P500', return: 15.58, reason: '미국증시 반등' },
        { ticker: 'SCHD', name: 'Schwab 배당주', return: 14.2, reason: '배당주 안정적 상승' },
      ],
      bottomStocks: [
        { ticker: 'KBANK', name: '케이뱅크', return: -18.5, reason: '지속적 하락세' },
        { ticker: 'PLUS_EM', name: 'PLUS 신흥국MSCI', return: -8.2, reason: '신흥국 약세 지속' },
        { ticker: 'KODEX200', name: 'KODEX 200', return: -3.5, reason: '국내증시 부진' },
      ],
      sectorContribution: [
        { sector: 'S&P500', contribution: 3.8, weight: 30 },
        { sector: '배당주', contribution: 1.5, weight: 8 },
        { sector: '채권/금', contribution: 0.8, weight: 10 },
        { sector: '국내주식', contribution: -1.2, weight: 17 },
        { sector: '암호화폐', contribution: 0.4, weight: 2 },
      ],
      marketEnvironment: {
        sp500: { value: 5450, change: 4.2 },
        kospi: { value: 2520, change: 1.6 },
        usdkrw: { value: 1420, change: -3.5 },
        btc: { value: 125000000, change: 16.8 },
        events: [
          { date: '04.02', event: '트럼프 관세 90일 유예 발표' },
          { date: '04.10', event: 'CPI 발표 (2.6% YoY)' },
          { date: '04.15', event: 'NVIDIA 실적 발표' },
          { date: '04.18', event: 'FOMC 금리 동결 (5.25%)' },
        ],
      },
      keyFactors: [
        '관세 유예로 S&P500 중심 포트폴리오 강세',
        '비트코인 급등으로 대체투자 수익 기여',
        '국내주식/신흥국 비중이 수익률 제한 요인',
      ],
      nextMonthOutlook: '5월은 관세 협상과 2분기 실적 시즌 주목. S&P500 비중 유지하며 배당주 추가 매수 검토. 케이뱅크 손절 고려.',
      riskChecklist: [
        { risk: '관세 협상 결렬', level: 'medium', status: 'monitoring' },
        { risk: '케이뱅크 추가 하락', level: 'high', status: 'monitoring' },
        { risk: '암호화폐 변동성', level: 'medium', status: 'monitoring' },
        { risk: '국내증시 추가 약세', level: 'low', status: 'resolved' },
      ],
    },
  },
}

// 리스크 레벨 색상
const RISK_COLORS = {
  high: { bg: '#FEE2E2', text: '#DC2626', label: '높음' },
  medium: { bg: '#FEF3C7', text: '#D97706', label: '보통' },
  low: { bg: '#DCFCE7', text: '#16A34A', label: '낮음' },
}

// 리스크 상태
const RISK_STATUS = {
  monitoring: { icon: '👀', label: '모니터링' },
  occurred: { icon: '⚠️', label: '발생' },
  resolved: { icon: '✅', label: '해소' },
}

export default function MonthlyReportPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [mainTab, setMainTab] = useState('hauga')
  const [selectedMonth, setSelectedMonth] = useState('2026-04')

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 현재 선택된 데이터
  const reportData = MONTHLY_REPORT_DATA[mainTab]?.[selectedMonth]
  const availableMonths = ['2026-02', '2026-03', '2026-04']

  // 총 자산 계산 (탭 선택용)
  const haugaTotal = MONTHLY_REPORT_DATA.hauga['2026-04']?.totalAsset || 0
  const gayoonTotal = MONTHLY_REPORT_DATA.gayoon['2026-04']?.totalAsset || 0

  const styles = {
    container: {
      maxWidth: '1000px',
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
      marginBottom: '8px',
    },
    subtitle: {
      fontSize: '14px',
      color: '#8B95A1',
      margin: 0,
    },
    mainTabs: {
      display: 'flex',
      gap: '12px',
      marginBottom: '20px',
    },
    mainTab: (isActive) => ({
      flex: 1,
      padding: '16px',
      borderRadius: '16px',
      border: isActive ? '2px solid #3182F6' : '1px solid #E5E8EB',
      backgroundColor: isActive ? '#E8F3FF' : 'white',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'all 0.2s',
    }),
    mainTabEmoji: {
      fontSize: '28px',
      marginBottom: '8px',
    },
    mainTabName: (isActive) => ({
      fontSize: '16px',
      fontWeight: '700',
      color: isActive ? '#3182F6' : '#191F28',
    }),
    mainTabSub: {
      fontSize: '12px',
      color: '#8B95A1',
      marginTop: '4px',
    },
    monthSelector: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '24px',
    },
    select: {
      padding: '12px 16px',
      borderRadius: '12px',
      border: '1px solid #E5E8EB',
      backgroundColor: 'white',
      fontSize: '14px',
      fontWeight: '600',
      color: '#191F28',
      cursor: 'pointer',
      minWidth: '150px',
    },

    // Section 1: Hero Card
    heroCard: {
      background: 'linear-gradient(135deg, #3182F6 0%, #1E6FD9 100%)',
      borderRadius: '20px',
      padding: isMobile ? '24px' : '32px',
      marginBottom: '24px',
      color: 'white',
    },
    heroPeriod: {
      fontSize: '13px',
      opacity: 0.8,
      marginBottom: '8px',
    },
    heroTitle: {
      fontSize: isMobile ? '18px' : '20px',
      fontWeight: '600',
      marginBottom: '20px',
      lineHeight: 1.4,
    },
    heroMainReturn: {
      fontSize: isMobile ? '48px' : '64px',
      fontWeight: '800',
      marginBottom: '8px',
      letterSpacing: '-2px',
    },
    heroLabel: {
      fontSize: '14px',
      opacity: 0.8,
      marginBottom: '24px',
    },
    heroStats: {
      display: 'flex',
      gap: isMobile ? '16px' : '32px',
      flexWrap: 'wrap',
    },
    heroStat: {
      minWidth: isMobile ? '80px' : '100px',
    },
    heroStatValue: {
      fontSize: isMobile ? '18px' : '22px',
      fontWeight: '700',
      marginBottom: '4px',
    },
    heroStatLabel: {
      fontSize: '12px',
      opacity: 0.7,
    },

    // Section cards
    section: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: isMobile ? '20px' : '24px',
      border: '1px solid #E5E8EB',
      marginBottom: '20px',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#191F28',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    sectionNumber: {
      width: '28px',
      height: '28px',
      borderRadius: '8px',
      backgroundColor: '#3182F6',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '700',
    },

    // Table styles
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      textAlign: 'left',
      padding: '12px 8px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#8B95A1',
      borderBottom: '1px solid #E5E8EB',
    },
    td: {
      padding: '12px 8px',
      fontSize: '14px',
      color: '#191F28',
      borderBottom: '1px solid #F2F4F6',
    },

    // Stock card
    stockGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: '16px',
    },
    stockCard: (isTop) => ({
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: isTop ? '#E8F5E9' : '#FFEBEE',
    }),
    stockHeader: (isTop) => ({
      fontSize: '13px',
      fontWeight: '600',
      color: isTop ? '#2E7D32' : '#C62828',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    }),
    stockItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid rgba(0,0,0,0.05)',
    },
    stockName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#191F28',
    },
    stockReason: {
      fontSize: '11px',
      color: '#8B95A1',
      marginTop: '2px',
    },
    stockReturn: (isPositive) => ({
      fontSize: '14px',
      fontWeight: '700',
      color: isPositive ? '#2E7D32' : '#C62828',
    }),

    // Market indicator
    marketGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
      gap: '12px',
      marginBottom: '20px',
    },
    marketCard: {
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: '#F7F8FA',
      textAlign: 'center',
    },
    marketLabel: {
      fontSize: '12px',
      color: '#8B95A1',
      marginBottom: '8px',
    },
    marketValue: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#191F28',
      marginBottom: '4px',
    },
    marketChange: (isPositive) => ({
      fontSize: '13px',
      fontWeight: '600',
      color: isPositive ? '#2E7D32' : '#C62828',
    }),

    // Timeline
    timeline: {
      borderLeft: '2px solid #E5E8EB',
      marginLeft: '8px',
      paddingLeft: '20px',
    },
    timelineItem: {
      position: 'relative',
      paddingBottom: '16px',
    },
    timelineDot: {
      position: 'absolute',
      left: '-26px',
      top: '4px',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: '#3182F6',
    },
    timelineDate: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#3182F6',
      marginBottom: '4px',
    },
    timelineEvent: {
      fontSize: '14px',
      color: '#191F28',
    },

    // Risk checklist
    riskItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px',
      borderRadius: '10px',
      backgroundColor: '#F7F8FA',
      marginBottom: '8px',
    },
    riskLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    riskBadge: (level) => ({
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '600',
      backgroundColor: RISK_COLORS[level]?.bg || '#F7F8FA',
      color: RISK_COLORS[level]?.text || '#8B95A1',
    }),
    riskName: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#191F28',
    },
    riskStatus: {
      fontSize: '12px',
      color: '#8B95A1',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },

    // Outlook box
    outlookBox: {
      padding: '20px',
      borderRadius: '12px',
      backgroundColor: '#F0F9FF',
      border: '1px solid #BAE6FD',
      marginBottom: '20px',
    },
    outlookTitle: {
      fontSize: '14px',
      fontWeight: '700',
      color: '#0369A1',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    outlookText: {
      fontSize: '14px',
      color: '#191F28',
      lineHeight: 1.6,
    },

    // Key factors
    factorList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    factorItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '12px 0',
      borderBottom: '1px solid #F2F4F6',
    },
    factorIcon: {
      fontSize: '16px',
      marginTop: '2px',
    },
    factorText: {
      fontSize: '14px',
      color: '#191F28',
      lineHeight: 1.5,
    },

    // Empty state
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#8B95A1',
    },
    emptyIcon: {
      fontSize: '48px',
      marginBottom: '16px',
    },
  }

  // 숫자 포맷팅
  const formatNumber = (num) => {
    if (num >= 100000000) return `${(num / 100000000).toFixed(1)}억`
    if (num >= 10000) return `${(num / 10000).toFixed(0)}만`
    return num?.toLocaleString() || '-'
  }

  const formatReturn = (val) => {
    if (val === null || val === undefined) return '-'
    const sign = val >= 0 ? '+' : ''
    return `${sign}${val.toFixed(2)}%`
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>월간 리포트</h1>
        <p style={styles.subtitle}>포트폴리오 성과 분석 및 시장 리뷰</p>
      </div>

      {/* 메인 탭 */}
      <div style={styles.mainTabs}>
        <div
          style={styles.mainTab(mainTab === 'hauga')}
          onClick={() => setMainTab('hauga')}
        >
          <div style={styles.mainTabEmoji}>☁️</div>
          <div style={styles.mainTabName(mainTab === 'hauga')}>하늘버핏</div>
          <div style={styles.mainTabSub}>총 {formatNumber(haugaTotal)}</div>
        </div>
        <div
          style={styles.mainTab(mainTab === 'gayoon')}
          onClick={() => setMainTab('gayoon')}
        >
          <div style={styles.mainTabEmoji}>🐰</div>
          <div style={styles.mainTabName(mainTab === 'gayoon')}>가윤달리오</div>
          <div style={styles.mainTabSub}>총 {formatNumber(gayoonTotal)}</div>
        </div>
      </div>

      {/* 월 선택 */}
      <div style={styles.monthSelector}>
        <select
          style={styles.select}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {availableMonths.map(month => (
            <option key={month} value={month}>
              {month.replace('-', '년 ')}월 리포트
            </option>
          ))}
        </select>
      </div>

      {!reportData ? (
        <div style={styles.section}>
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <p>이 달의 리포트가 없습니다</p>
          </div>
        </div>
      ) : (
        <>
          {/* ========== Section 1: 이달의 요약 (Hero Card) ========== */}
          <div style={styles.heroCard}>
            <div style={styles.heroPeriod}>{reportData.period}</div>
            <div style={styles.heroTitle}>"{reportData.summary}"</div>
            <div style={styles.heroMainReturn}>
              {formatReturn(reportData.monthReturn)}
            </div>
            <div style={styles.heroLabel}>이달 수익률</div>
            <div style={styles.heroStats}>
              <div style={styles.heroStat}>
                <div style={styles.heroStatValue}>{formatReturn(reportData.cumulative)}</div>
                <div style={styles.heroStatLabel}>누적 수익률</div>
              </div>
              <div style={styles.heroStat}>
                <div style={styles.heroStatValue}>{formatReturn(reportData.alpha)}</div>
                <div style={styles.heroStatLabel}>벤치마크 대비 알파</div>
              </div>
              <div style={styles.heroStat}>
                <div style={styles.heroStatValue}>{formatNumber(reportData.totalAsset)}</div>
                <div style={styles.heroStatLabel}>총 자산</div>
              </div>
            </div>
          </div>

          {/* ========== Section 2: 포트폴리오 성과 분석 ========== */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <div style={styles.sectionNumber}>2</div>
              포트폴리오 성과 분석
            </div>

            {/* 성과 대시보드 */}
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>지표</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>수치</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.td}>이달 수익률</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontWeight: '700', color: reportData.monthReturn >= 0 ? '#2E7D32' : '#C62828' }}>
                    {formatReturn(reportData.monthReturn)}
                  </td>
                </tr>
                <tr>
                  <td style={styles.td}>누적 수익률</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600' }}>
                    {formatReturn(reportData.cumulative)}
                  </td>
                </tr>
                <tr>
                  <td style={styles.td}>벤치마크 대비 알파</td>
                  <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600', color: '#3182F6' }}>
                    {formatReturn(reportData.alpha)}
                  </td>
                </tr>
                <tr>
                  <td style={styles.td}>변동성 (Volatility)</td>
                  <td style={{ ...styles.td, textAlign: 'right' }}>{reportData.volatility}%</td>
                </tr>
                <tr>
                  <td style={styles.td}>최대 낙폭 (MDD)</td>
                  <td style={{ ...styles.td, textAlign: 'right', color: '#C62828' }}>{reportData.mdd}%</td>
                </tr>
              </tbody>
            </table>

            {/* 카테고리별 기여도 */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#191F28', marginBottom: '12px' }}>
                섹터별 기여도
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>섹터</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>비중</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>기여도</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.sectorContribution.map((sector, idx) => (
                    <tr key={idx}>
                      <td style={styles.td}>{sector.sector}</td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>{sector.weight}%</td>
                      <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600', color: sector.contribution >= 0 ? '#2E7D32' : '#C62828' }}>
                        {sector.contribution >= 0 ? '+' : ''}{sector.contribution.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ========== Section 3: 시장 환경 리뷰 ========== */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <div style={styles.sectionNumber}>3</div>
              시장 환경 리뷰
            </div>

            {/* 매크로 지표 */}
            <div style={styles.marketGrid}>
              <div style={styles.marketCard}>
                <div style={styles.marketLabel}>S&P500</div>
                <div style={styles.marketValue}>{reportData.marketEnvironment.sp500.value.toLocaleString()}</div>
                <div style={styles.marketChange(reportData.marketEnvironment.sp500.change >= 0)}>
                  {formatReturn(reportData.marketEnvironment.sp500.change)}
                </div>
              </div>
              <div style={styles.marketCard}>
                <div style={styles.marketLabel}>KOSPI</div>
                <div style={styles.marketValue}>{reportData.marketEnvironment.kospi.value.toLocaleString()}</div>
                <div style={styles.marketChange(reportData.marketEnvironment.kospi.change >= 0)}>
                  {formatReturn(reportData.marketEnvironment.kospi.change)}
                </div>
              </div>
              <div style={styles.marketCard}>
                <div style={styles.marketLabel}>USD/KRW</div>
                <div style={styles.marketValue}>{reportData.marketEnvironment.usdkrw.value.toLocaleString()}</div>
                <div style={styles.marketChange(reportData.marketEnvironment.usdkrw.change >= 0)}>
                  {formatReturn(reportData.marketEnvironment.usdkrw.change)}
                </div>
              </div>
              <div style={styles.marketCard}>
                <div style={styles.marketLabel}>BTC (KRW)</div>
                <div style={styles.marketValue}>{(reportData.marketEnvironment.btc.value / 1000000).toFixed(0)}백만</div>
                <div style={styles.marketChange(reportData.marketEnvironment.btc.change >= 0)}>
                  {formatReturn(reportData.marketEnvironment.btc.change)}
                </div>
              </div>
            </div>

            {/* 핵심 이벤트 타임라인 */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#191F28', marginBottom: '16px' }}>
                이달의 핵심 이벤트
              </div>
              <div style={styles.timeline}>
                {reportData.marketEnvironment.events.map((evt, idx) => (
                  <div key={idx} style={styles.timelineItem}>
                    <div style={styles.timelineDot} />
                    <div style={styles.timelineDate}>{evt.date}</div>
                    <div style={styles.timelineEvent}>{evt.event}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========== Section 4: 투자 활동 기록 ========== */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <div style={styles.sectionNumber}>4</div>
              투자 활동 기록
            </div>

            {/* Top/Bottom 종목 */}
            <div style={styles.stockGrid}>
              <div style={styles.stockCard(true)}>
                <div style={styles.stockHeader(true)}>
                  <span>🏆</span> Top 3 종목
                </div>
                {reportData.topStocks.map((stock, idx) => (
                  <div key={idx} style={styles.stockItem}>
                    <div>
                      <div style={styles.stockName}>{stock.name}</div>
                      <div style={styles.stockReason}>{stock.reason}</div>
                    </div>
                    <div style={styles.stockReturn(true)}>{formatReturn(stock.return)}</div>
                  </div>
                ))}
              </div>
              <div style={styles.stockCard(false)}>
                <div style={styles.stockHeader(false)}>
                  <span>📉</span> Bottom 3 종목
                </div>
                {reportData.bottomStocks.map((stock, idx) => (
                  <div key={idx} style={styles.stockItem}>
                    <div>
                      <div style={styles.stockName}>{stock.name}</div>
                      <div style={styles.stockReason}>{stock.reason}</div>
                    </div>
                    <div style={styles.stockReturn(false)}>{formatReturn(stock.return)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 핵심 요인 분석 */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#191F28', marginBottom: '12px' }}>
                핵심 요인 분석
              </div>
              <ul style={styles.factorList}>
                {reportData.keyFactors.map((factor, idx) => (
                  <li key={idx} style={styles.factorItem}>
                    <span style={styles.factorIcon}>•</span>
                    <span style={styles.factorText}>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ========== Section 5: 다음 달 전망 & 리스크 점검 ========== */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <div style={styles.sectionNumber}>5</div>
              다음 달 전망 & 리스크 점검
            </div>

            {/* 전망 박스 */}
            <div style={styles.outlookBox}>
              <div style={styles.outlookTitle}>
                <span>🔭</span> 관전 포인트
              </div>
              <div style={styles.outlookText}>{reportData.nextMonthOutlook}</div>
            </div>

            {/* 리스크 체크리스트 */}
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#191F28', marginBottom: '12px' }}>
              리스크 체크리스트
            </div>
            {reportData.riskChecklist.map((risk, idx) => (
              <div key={idx} style={styles.riskItem}>
                <div style={styles.riskLeft}>
                  <div style={styles.riskBadge(risk.level)}>
                    {RISK_COLORS[risk.level]?.label || '보통'}
                  </div>
                  <div style={styles.riskName}>{risk.risk}</div>
                </div>
                <div style={styles.riskStatus}>
                  <span>{RISK_STATUS[risk.status]?.icon}</span>
                  <span>{RISK_STATUS[risk.status]?.label}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
