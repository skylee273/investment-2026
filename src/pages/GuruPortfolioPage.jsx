import { useState, useEffect } from 'react'

// 빌 애크먼 포트폴리오 (Pershing Square Q4 2025)
const ACKMAN_PORTFOLIO = {
  name: '빌 애크먼',
  fund: 'Pershing Square Capital',
  aum: '$15.5B',
  filingDate: '2026-02-17',
  description: '행동주의 투자의 대가. 집중 투자 전략으로 유명하며, 장기 복리 성장주에 집중.',
  style: '집중 투자 · 행동주의 · 장기 보유',
  holdings: [
    { ticker: 'BN', name: 'Brookfield Corp', weight: 18.15, change: 'hold', description: '글로벌 대체자산 운용사' },
    { ticker: 'UBER', name: 'Uber Technologies', weight: 15.90, change: 'trim', description: '글로벌 모빌리티 플랫폼' },
    { ticker: 'AMZN', name: 'Amazon.com', weight: 14.28, change: 'add', description: 'e커머스 · 클라우드 (AWS)', changeDetail: '+65%' },
    { ticker: 'GOOG', name: 'Alphabet (Class C)', weight: 12.46, change: 'hold', description: '검색 · 유튜브 · AI' },
    { ticker: 'META', name: 'Meta Platforms', weight: 11.37, change: 'new', description: 'SNS · 메타버스 · AI', changeDetail: '신규 매수' },
    { ticker: 'QSR', name: 'Restaurant Brands Intl', weight: 9.47, change: 'trim', description: '버거킹 · 팀홀튼 모회사' },
    { ticker: 'HHH', name: 'Howard Hughes Holdings', weight: 8.12, change: 'hold', description: '부동산 개발 (장기 보유)' },
    { ticker: 'HLT', name: 'Hilton Worldwide', weight: 0, change: 'sold', description: '호텔 체인', changeDetail: '전량 매도' },
    { ticker: 'CMG', name: 'Chipotle Mexican Grill', weight: 0, change: 'sold', description: '패스트캐주얼 레스토랑', changeDetail: '전량 매도' },
  ],
  keyMoves: [
    'META 신규 매수 (11.37%)',
    'AMZN 65% 증가',
    'HLT, CMG 전량 매도 (밸류에이션 이유)',
  ],
}

// 그렉 아벨 포트폴리오 (Berkshire Hathaway 2026)
const ABEL_PORTFOLIO = {
  id: 'abel',
  name: '그렉 아벨',
  fund: 'Berkshire Hathaway',
  aum: '$318B',
  filingDate: '2026-02-17',
  description: '워렌 버핏의 후계자. 2026년 1월부터 CEO. 핵심 보유주 장기 유지 전략.',
  style: '가치 투자 · 영구 보유 · 안전마진',
  emoji: '🎩',
  color: '#f5576c',
  holdings: [
    { ticker: 'AAPL', name: 'Apple', weight: 28.1, change: 'hold', description: '최대 포지션 (축소 후에도)', core: true },
    { ticker: 'AXP', name: 'American Express', weight: 16.2, change: 'hold', description: '프리미엄 카드 · 30년 보유', core: true },
    { ticker: 'BAC', name: 'Bank of America', weight: 11.8, change: 'hold', description: '미국 2위 은행', core: true },
    { ticker: 'KO', name: 'Coca-Cola', weight: 9.4, change: 'hold', description: '배당 귀족 · 36년 보유', core: true },
    { ticker: 'CVX', name: 'Chevron', weight: 6.3, change: 'hold', description: '통합 에너지 기업', core: true },
    { ticker: 'OXY', name: 'Occidental Petroleum', weight: 4.8, change: 'hold', description: '석유·가스 생산' },
    { ticker: 'MCO', name: "Moody's Corp", weight: 4.2, change: 'hold', description: '신용평가 기관' },
    { ticker: 'KHC', name: 'Kraft Heinz', weight: 3.8, change: 'sell', description: '식품 대기업', changeDetail: '매도 예정' },
    { ticker: 'SOGO', name: '일본 5대 상사', weight: 13.3, change: 'hold', description: '미쓰비시·이토추·미쓰이 등', core: true },
  ],
  keyMoves: [
    'Kraft Heinz 전량 매도 검토 중',
    '2026.03.05 자사주 매입 재개',
    '그렉 아벨 개인 $15M 매수',
  ],
}

// 캐시 우드 포트폴리오 (ARK Invest Q1 2026)
const WOOD_PORTFOLIO = {
  id: 'wood',
  name: '캐시 우드',
  fund: 'ARK Invest',
  aum: '$14.2B',
  filingDate: '2026-02-14',
  description: '파괴적 혁신 기업에 집중 투자. AI, 로봇, 유전체 등 미래 기술 테마에 베팅.',
  style: '성장 투자 · 파괴적 혁신 · 고위험',
  emoji: '🚀',
  color: '#8B5CF6',
  holdings: [
    { ticker: 'TSLA', name: 'Tesla', weight: 11.2, change: 'hold', description: 'EV · 자율주행 · 로봇', core: true },
    { ticker: 'COIN', name: 'Coinbase', weight: 8.5, change: 'add', description: '암호화폐 거래소', changeDetail: '+15%' },
    { ticker: 'ROKU', name: 'Roku', weight: 7.8, change: 'hold', description: '스트리밍 플랫폼' },
    { ticker: 'SQ', name: 'Block (Square)', weight: 6.9, change: 'hold', description: '핀테크 · 비트코인' },
    { ticker: 'PLTR', name: 'Palantir', weight: 6.2, change: 'add', description: 'AI 데이터 분석', changeDetail: '+25%' },
    { ticker: 'PATH', name: 'UiPath', weight: 5.4, change: 'hold', description: 'RPA 자동화' },
    { ticker: 'CRSP', name: 'CRISPR Therapeutics', weight: 4.8, change: 'hold', description: '유전자 편집' },
    { ticker: 'HOOD', name: 'Robinhood', weight: 4.1, change: 'new', description: '리테일 증권', changeDetail: '신규 매수' },
  ],
  keyMoves: [
    'Palantir 25% 증가 (AI 수요)',
    'Robinhood 신규 매수',
    'NVIDIA 전량 매도 (밸류에이션)',
  ],
}

// 레이 달리오 포트폴리오 (Bridgewater Q1 2026)
const DALIO_PORTFOLIO = {
  id: 'dalio',
  name: '레이 달리오',
  fund: 'Bridgewater Associates',
  aum: '$124B',
  filingDate: '2026-02-15',
  description: '세계 최대 헤지펀드 창업자. 올웨더 전략으로 유명. 거시경제 분석의 대가.',
  style: '올웨더 · 리스크 패리티 · 분산투자',
  emoji: '🌊',
  color: '#3182F6',
  holdings: [
    { ticker: 'SPY', name: 'S&P 500 ETF', weight: 15.2, change: 'hold', description: '미국 대형주 인덱스', core: true },
    { ticker: 'VWO', name: 'Vanguard EM ETF', weight: 12.8, change: 'add', description: '신흥국 주식', changeDetail: '+20%' },
    { ticker: 'GLD', name: 'Gold ETF', weight: 11.5, change: 'hold', description: '인플레 헤지', core: true },
    { ticker: 'TLT', name: '20+ Year Treasury', weight: 10.3, change: 'hold', description: '장기 국채', core: true },
    { ticker: 'PG', name: 'Procter & Gamble', weight: 5.8, change: 'hold', description: '필수소비재' },
    { ticker: 'JNJ', name: 'Johnson & Johnson', weight: 5.2, change: 'hold', description: '헬스케어' },
    { ticker: 'BABA', name: 'Alibaba', weight: 4.8, change: 'add', description: '중국 이커머스', changeDetail: '+30%' },
    { ticker: 'WMT', name: 'Walmart', weight: 4.1, change: 'hold', description: '리테일' },
  ],
  keyMoves: [
    '신흥국 ETF 비중 확대',
    'Alibaba 30% 증가',
    '금 비중 유지 (인플레 대비)',
  ],
}

// 마이클 버리 포트폴리오 (Scion Q1 2026)
const BURRY_PORTFOLIO = {
  id: 'burry',
  name: '마이클 버리',
  fund: 'Scion Asset Management',
  aum: '$230M',
  filingDate: '2026-02-14',
  description: '빅쇼트의 주인공. 역발상 투자와 가치투자의 결합. 시장 거품 경고로 유명.',
  style: '역발상 · 가치 투자 · 집중 투자',
  emoji: '🔮',
  color: '#EF4444',
  holdings: [
    { ticker: 'BABA', name: 'Alibaba', weight: 22.5, change: 'hold', description: '중국 이커머스 (저평가)', core: true },
    { ticker: 'JD', name: 'JD.com', weight: 15.8, change: 'add', description: '중국 이커머스', changeDetail: '+40%' },
    { ticker: 'BIDU', name: 'Baidu', weight: 12.3, change: 'hold', description: '중국 검색/AI' },
    { ticker: 'GEO', name: 'GEO Group', weight: 8.5, change: 'new', description: '교정시설 리츠', changeDetail: '신규 매수' },
    { ticker: 'REAL', name: 'RealReal', weight: 6.2, change: 'hold', description: '중고 명품 플랫폼' },
    { ticker: 'SIRI', name: 'Sirius XM', weight: 5.1, change: 'add', description: '위성 라디오', changeDetail: '+25%' },
  ],
  keyMoves: [
    '중국 주식 비중 50% 이상',
    'JD.com 40% 증가',
    'GEO Group 신규 매수',
  ],
}

// 스탠리 드러켄밀러 포트폴리오 (Duquesne Q1 2026)
const DRUCKENMILLER_PORTFOLIO = {
  id: 'druckenmiller',
  name: '스탠리 드러켄밀러',
  fund: 'Duquesne Family Office',
  aum: '$4.8B',
  filingDate: '2026-02-14',
  description: '조지 소로스의 오른팔 출신. 30년간 연평균 30% 수익률. 매크로 투자의 전설.',
  style: '매크로 · 모멘텀 · 집중 투자',
  emoji: '🦅',
  color: '#10B981',
  holdings: [
    { ticker: 'NVDA', name: 'NVIDIA', weight: 18.5, change: 'hold', description: 'AI 반도체', core: true },
    { ticker: 'MSFT', name: 'Microsoft', weight: 12.3, change: 'hold', description: 'AI · 클라우드', core: true },
    { ticker: 'GOOGL', name: 'Alphabet', weight: 9.8, change: 'add', description: '검색 · AI', changeDetail: '+15%' },
    { ticker: 'AMZN', name: 'Amazon', weight: 8.5, change: 'hold', description: 'AWS · 이커머스' },
    { ticker: 'META', name: 'Meta', weight: 7.2, change: 'hold', description: 'AI · SNS' },
    { ticker: 'CRM', name: 'Salesforce', weight: 5.8, change: 'new', description: 'AI 엔터프라이즈', changeDetail: '신규 매수' },
    { ticker: 'COPPER', name: 'Copper Futures', weight: 4.5, change: 'hold', description: '구리 선물' },
  ],
  keyMoves: [
    'AI 관련주 비중 50% 이상',
    'Salesforce 신규 매수',
    'Alphabet 15% 증가',
  ],
}

// 데이비드 테퍼 포트폴리오 (Appaloosa Q1 2026)
const TEPPER_PORTFOLIO = {
  id: 'tepper',
  name: '데이비드 테퍼',
  fund: 'Appaloosa Management',
  aum: '$6.2B',
  filingDate: '2026-02-14',
  description: '위기 투자의 대가. 2008년 금융위기 때 $7B 수익. 과감한 베팅으로 유명.',
  style: '이벤트 드리븐 · 딥밸류 · 고위험',
  emoji: '🎰',
  color: '#F59E0B',
  holdings: [
    { ticker: 'META', name: 'Meta Platforms', weight: 16.8, change: 'hold', description: 'AI · 메타버스', core: true },
    { ticker: 'GOOGL', name: 'Alphabet', weight: 14.2, change: 'hold', description: '검색 · 유튜브', core: true },
    { ticker: 'AMZN', name: 'Amazon', weight: 12.5, change: 'hold', description: 'AWS' },
    { ticker: 'UBER', name: 'Uber', weight: 8.3, change: 'add', description: '모빌리티', changeDetail: '+20%' },
    { ticker: 'BABA', name: 'Alibaba', weight: 7.5, change: 'add', description: '중국 이커머스', changeDetail: '+35%' },
    { ticker: 'AMD', name: 'AMD', weight: 6.1, change: 'hold', description: 'AI 반도체' },
    { ticker: 'NFLX', name: 'Netflix', weight: 5.2, change: 'new', description: '스트리밍', changeDetail: '신규 매수' },
  ],
  keyMoves: [
    'Alibaba 35% 증가 (중국 반등 베팅)',
    'Netflix 신규 매수',
    'Uber 20% 증가',
  ],
}

// 칼 아이칸 포트폴리오 (Icahn Q1 2026)
const ICAHN_PORTFOLIO = {
  id: 'icahn',
  name: '칼 아이칸',
  fund: 'Icahn Enterprises',
  aum: '$17.5B',
  filingDate: '2026-02-15',
  description: '행동주의 투자의 원조. 기업 경영진 압박으로 가치 실현. 88세 현역 투자자.',
  style: '행동주의 · 딥밸류 · 경영 개입',
  emoji: '⚔️',
  color: '#6366F1',
  holdings: [
    { ticker: 'IEP', name: 'Icahn Enterprises', weight: 45.2, change: 'hold', description: '자사 지주회사', core: true },
    { ticker: 'CVR', name: 'CVR Energy', weight: 18.5, change: 'hold', description: '정유 · 비료', core: true },
    { ticker: 'SWX', name: 'Southwest Gas', weight: 8.3, change: 'hold', description: '가스 유틸리티' },
    { ticker: 'CVI', name: 'CVR Partners', weight: 6.8, change: 'hold', description: '질소비료' },
    { ticker: 'LUMN', name: 'Lumen Technologies', weight: 5.2, change: 'add', description: '통신', changeDetail: '+50%' },
    { ticker: 'XRX', name: 'Xerox', weight: 4.1, change: 'hold', description: '문서 솔루션' },
  ],
  keyMoves: [
    'Lumen Technologies 50% 증가',
    'CVR Energy 배당 수익 확보',
    '자사 지분 유지 (45%)',
  ],
}

// 세스 클라만 포트폴리오 (Baupost Q1 2026)
const KLARMAN_PORTFOLIO = {
  id: 'klarman',
  name: '세스 클라만',
  fund: 'Baupost Group',
  aum: '$27B',
  filingDate: '2026-02-14',
  description: '안전마진의 저자. 극도로 보수적인 가치투자. 현금 비중을 높게 유지.',
  style: '딥밸류 · 안전마진 · 현금 선호',
  emoji: '🛡️',
  color: '#059669',
  holdings: [
    { ticker: 'LBTYA', name: 'Liberty Global', weight: 12.5, change: 'hold', description: '유럽 통신', core: true },
    { ticker: 'QRTEA', name: 'Qurate Retail', weight: 9.8, change: 'add', description: 'TV 홈쇼핑', changeDetail: '+30%' },
    { ticker: 'ELAN', name: 'Elanco Animal Health', weight: 8.2, change: 'hold', description: '동물 의약품' },
    { ticker: 'VSAT', name: 'Viasat', weight: 7.5, change: 'hold', description: '위성 통신' },
    { ticker: 'EBAY', name: 'eBay', weight: 6.8, change: 'hold', description: '이커머스' },
    { ticker: 'CASH', name: '현금 및 현금성', weight: 35.0, change: 'hold', description: '기회 대기', core: true },
  ],
  keyMoves: [
    '현금 비중 35% 유지',
    'Qurate Retail 30% 증가',
    '신규 포지션 진입 신중',
  ],
}

// 댄 로엡 포트폴리오 (Third Point Q1 2026)
const LOEB_PORTFOLIO = {
  id: 'loeb',
  name: '댄 로엡',
  fund: 'Third Point',
  aum: '$12.8B',
  filingDate: '2026-02-14',
  description: '행동주의 헤지펀드 매니저. 공개 서한으로 경영진 압박. 기술주 선호.',
  style: '행동주의 · 이벤트 · 기술주',
  emoji: '📝',
  color: '#EC4899',
  holdings: [
    { ticker: 'AMZN', name: 'Amazon', weight: 14.5, change: 'hold', description: 'AWS · 이커머스', core: true },
    { ticker: 'MSFT', name: 'Microsoft', weight: 11.2, change: 'hold', description: '클라우드 · AI', core: true },
    { ticker: 'INTC', name: 'Intel', weight: 9.8, change: 'add', description: '반도체 턴어라운드', changeDetail: '+45%' },
    { ticker: 'DIS', name: 'Disney', weight: 8.5, change: 'hold', description: '엔터테인먼트' },
    { ticker: 'PYPL', name: 'PayPal', weight: 7.2, change: 'new', description: '핀테크', changeDetail: '신규 매수' },
    { ticker: 'SONY', name: 'Sony Group', weight: 6.8, change: 'hold', description: '게임 · 엔터' },
    { ticker: 'UBER', name: 'Uber', weight: 5.5, change: 'hold', description: '모빌리티' },
  ],
  keyMoves: [
    'Intel 45% 증가 (턴어라운드 베팅)',
    'PayPal 신규 매수',
    'Disney 경영진 압박 중',
  ],
}

// 전체 구루 목록
const ALL_GURUS = [
  { ...ACKMAN_PORTFOLIO, id: 'ackman', emoji: '🎯', color: '#667eea' },
  ABEL_PORTFOLIO,
  WOOD_PORTFOLIO,
  DALIO_PORTFOLIO,
  BURRY_PORTFOLIO,
  DRUCKENMILLER_PORTFOLIO,
  TEPPER_PORTFOLIO,
  ICAHN_PORTFOLIO,
  KLARMAN_PORTFOLIO,
  LOEB_PORTFOLIO,
]

export default function GuruPortfolioPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [selectedGuru, setSelectedGuru] = useState('ackman')

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const portfolio = ALL_GURUS.find(g => g.id === selectedGuru) || ALL_GURUS[0]

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
    tabContainer: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
    },
    tab: (isActive) => ({
      flex: 1,
      padding: '16px 20px',
      borderRadius: '16px',
      border: isActive ? '2px solid #3182F6' : '1px solid #E5E8EB',
      backgroundColor: isActive ? '#E8F3FF' : 'white',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }),
    tabName: (isActive) => ({
      fontSize: '16px',
      fontWeight: '700',
      color: isActive ? '#3182F6' : '#191F28',
      marginBottom: '4px',
    }),
    tabFund: {
      fontSize: '12px',
      color: '#8B95A1',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid #E5E8EB',
      marginBottom: '20px',
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#191F28',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    profileSection: {
      display: 'flex',
      gap: '20px',
      alignItems: isMobile ? 'flex-start' : 'center',
      flexDirection: isMobile ? 'column' : 'row',
    },
    avatar: {
      width: '80px',
      height: '80px',
      borderRadius: '20px',
      background: selectedGuru === 'ackman'
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      color: 'white',
      fontWeight: '700',
      flexShrink: 0,
    },
    profileInfo: {
      flex: 1,
    },
    guruName: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#191F28',
      marginBottom: '4px',
    },
    fundName: {
      fontSize: '14px',
      color: '#3182F6',
      fontWeight: '600',
      marginBottom: '8px',
    },
    description: {
      fontSize: '13px',
      color: '#6B7684',
      lineHeight: '1.5',
      marginBottom: '12px',
    },
    statRow: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
    },
    stat: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    statLabel: {
      fontSize: '12px',
      color: '#8B95A1',
    },
    statValue: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#191F28',
    },
    styleBadge: {
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: '8px',
      backgroundColor: '#F2F4F6',
      fontSize: '12px',
      color: '#4E5968',
      marginTop: '8px',
    },
    holdingItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 16px',
      backgroundColor: '#F7F8FA',
      borderRadius: '12px',
      marginBottom: '8px',
    },
    holdingLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flex: 1,
    },
    tickerBadge: {
      padding: '8px 12px',
      borderRadius: '10px',
      backgroundColor: '#191F28',
      color: 'white',
      fontSize: '13px',
      fontWeight: '700',
      minWidth: '60px',
      textAlign: 'center',
    },
    holdingInfo: {
      flex: 1,
    },
    holdingName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#191F28',
      marginBottom: '2px',
    },
    holdingDesc: {
      fontSize: '12px',
      color: '#8B95A1',
    },
    holdingRight: {
      textAlign: 'right',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    weight: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#191F28',
    },
    changeBadge: (type) => {
      const colors = {
        new: { bg: '#E8F5E9', color: '#2E7D32' },
        add: { bg: '#E3F2FD', color: '#1565C0' },
        hold: { bg: '#F2F4F6', color: '#6B7684' },
        trim: { bg: '#FFF3E0', color: '#E65100' },
        sell: { bg: '#FFEBEE', color: '#C62828' },
        sold: { bg: '#FFCDD2', color: '#B71C1C' },
      }
      const c = colors[type] || colors.hold
      return {
        padding: '4px 8px',
        borderRadius: '6px',
        backgroundColor: c.bg,
        color: c.color,
        fontSize: '11px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
      }
    },
    coreBadge: {
      padding: '2px 6px',
      borderRadius: '4px',
      backgroundColor: '#3182F6',
      color: 'white',
      fontSize: '10px',
      fontWeight: '600',
      marginLeft: '6px',
    },
    keyMoveItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '12px 0',
      borderBottom: '1px solid #F2F4F6',
    },
    keyMoveIcon: {
      width: '24px',
      height: '24px',
      borderRadius: '6px',
      backgroundColor: '#E8F3FF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      flexShrink: 0,
    },
    keyMoveText: {
      fontSize: '14px',
      color: '#191F28',
      lineHeight: '1.4',
    },
    soldItem: {
      opacity: 0.5,
      textDecoration: 'line-through',
    },
    disclaimer: {
      fontSize: '11px',
      color: '#8B95A1',
      textAlign: 'center',
      padding: '16px',
      borderTop: '1px solid #E5E8EB',
      marginTop: '20px',
    },
  }

  const getChangeLabel = (change) => {
    const labels = {
      new: '신규',
      add: '증가',
      hold: '유지',
      trim: '축소',
      sell: '매도예정',
      sold: '매도완료',
    }
    return labels[change] || change
  }

  const activeHoldings = portfolio.holdings.filter(h => h.weight > 0)
  const soldHoldings = portfolio.holdings.filter(h => h.weight === 0)

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>구루 포트폴리오</h1>
        <p style={styles.subtitle}>월가 전설들의 최신 13F 포트폴리오 (Q1 2026)</p>
      </div>

      {/* 구루 선택 탭 - 가로 스크롤 */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '24px',
        overflowX: 'auto',
        paddingBottom: '8px',
        WebkitOverflowScrolling: 'touch',
      }}>
        {ALL_GURUS.map(guru => (
          <div
            key={guru.id}
            style={{
              minWidth: isMobile ? '140px' : '160px',
              padding: '14px 16px',
              borderRadius: '14px',
              border: selectedGuru === guru.id ? `2px solid ${guru.color}` : '1px solid #E5E8EB',
              backgroundColor: selectedGuru === guru.id ? guru.color + '15' : 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
            onClick={() => setSelectedGuru(guru.id)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '20px' }}>{guru.emoji}</span>
              <span style={{
                fontSize: '14px',
                fontWeight: '700',
                color: selectedGuru === guru.id ? guru.color : '#191F28',
              }}>
                {guru.name}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#8B95A1' }}>
              {guru.aum}
            </div>
          </div>
        ))}
      </div>

      {/* 프로필 카드 */}
      <div style={styles.card}>
        <div style={styles.profileSection}>
          <div style={{
            ...styles.avatar,
            background: `linear-gradient(135deg, ${portfolio.color} 0%, ${portfolio.color}99 100%)`,
          }}>
            {portfolio.emoji}
          </div>
          <div style={styles.profileInfo}>
            <div style={styles.guruName}>{portfolio.name}</div>
            <div style={styles.fundName}>{portfolio.fund}</div>
            <div style={styles.description}>{portfolio.description}</div>
            <div style={styles.statRow}>
              <div style={styles.stat}>
                <span style={styles.statLabel}>운용자산</span>
                <span style={styles.statValue}>{portfolio.aum}</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statLabel}>공시일</span>
                <span style={styles.statValue}>{portfolio.filingDate}</span>
              </div>
            </div>
            <div style={styles.styleBadge}>{portfolio.style}</div>
          </div>
        </div>
      </div>

      {/* 주요 변동 */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <span>🔔</span>
          <span>Q4 2025 주요 변동</span>
        </div>
        {portfolio.keyMoves.map((move, idx) => (
          <div key={idx} style={styles.keyMoveItem}>
            <div style={styles.keyMoveIcon}>📌</div>
            <div style={styles.keyMoveText}>{move}</div>
          </div>
        ))}
      </div>

      {/* 포트폴리오 보유 종목 */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <span>📊</span>
          <span>포트폴리오 ({activeHoldings.length}개 종목)</span>
        </div>
        {activeHoldings.map((holding, idx) => (
          <div key={idx} style={styles.holdingItem}>
            <div style={styles.holdingLeft}>
              <div style={styles.tickerBadge}>{holding.ticker}</div>
              <div style={styles.holdingInfo}>
                <div style={styles.holdingName}>
                  {holding.name}
                  {holding.core && <span style={styles.coreBadge}>CORE</span>}
                </div>
                <div style={styles.holdingDesc}>{holding.description}</div>
              </div>
            </div>
            <div style={styles.holdingRight}>
              <span style={styles.changeBadge(holding.change)}>
                {getChangeLabel(holding.change)}
                {holding.changeDetail && ` ${holding.changeDetail}`}
              </span>
              <span style={styles.weight}>{holding.weight}%</span>
            </div>
          </div>
        ))}

        {/* 매도한 종목 */}
        {soldHoldings.length > 0 && (
          <>
            <div style={{ ...styles.cardTitle, marginTop: '24px', color: '#8B95A1' }}>
              <span>📤</span>
              <span>매도 완료</span>
            </div>
            {soldHoldings.map((holding, idx) => (
              <div key={idx} style={{ ...styles.holdingItem, opacity: 0.6 }}>
                <div style={styles.holdingLeft}>
                  <div style={{ ...styles.tickerBadge, backgroundColor: '#8B95A1' }}>{holding.ticker}</div>
                  <div style={styles.holdingInfo}>
                    <div style={{ ...styles.holdingName, textDecoration: 'line-through' }}>{holding.name}</div>
                    <div style={styles.holdingDesc}>{holding.description}</div>
                  </div>
                </div>
                <div style={styles.holdingRight}>
                  <span style={styles.changeBadge(holding.change)}>
                    {holding.changeDetail || '전량 매도'}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div style={styles.disclaimer}>
        * 데이터 출처: SEC 13F Filing (Q4 2025) · 실제 투자 전 추가 검토 필요
      </div>
    </div>
  )
}
