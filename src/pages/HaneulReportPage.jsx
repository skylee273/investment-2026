import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 실제 보유 종목 (2026.04.22 기준) - PortfolioPage와 동일
const ACTUAL_HOLDINGS = {
  pension: {
    investedKRW: 1662595,
    currentKRW: 1757300,
    gainKRW: 94705,
    gainPercent: 5.69,
    holdings: [
      { name: 'KODEX 200', investedKRW: 696430, currentKRW: 778400, gainKRW: 81970, gainPercent: 11.77 },
      { name: 'KODEX 코스닥150', investedKRW: 874005, currentKRW: 874280, gainKRW: 275, gainPercent: 0.03 },
      { name: 'KODEX 미국나스닥100', investedKRW: 92160, currentKRW: 104620, gainKRW: 12460, gainPercent: 13.52 },
    ],
  },
  isa: {
    investedKRW: 496290,
    currentKRW: 508635,
    gainKRW: 12345,
    gainPercent: 2.49,
    holdings: [
      { name: 'KODEX 코스닥150', investedKRW: 101075, currentKRW: 99350, gainKRW: -1725, gainPercent: -1.71 },
      { name: 'TIGER 미국채10년선물', investedKRW: 198375, currentKRW: 200925, gainKRW: 2550, gainPercent: 1.29 },
      { name: 'TIGER 미국S&P500', investedKRW: 196840, currentKRW: 208360, gainKRW: 11520, gainPercent: 5.85 },
    ],
  },
  stock: {
    investedKRW: 1542884,
    currentKRW: 1587887,
    gainKRW: 45003,
    gainPercent: 2.92,
    holdings: [
      { name: '1Q 미국S&P500미국채혼합', investedKRW: 116250, currentKRW: 119050, gainKRW: 2800, gainPercent: 2.41 },
      { name: 'TIGER 미국S&P500', investedKRW: 174090, currentKRW: 182315, gainKRW: 8225, gainPercent: 4.72 },
      { name: '미국달러', investedKRW: 12953, currentKRW: 12953, gainKRW: 0, gainPercent: 0.00 },
      { name: '셰브론 (CVX)', investedKRW: 555345, currentKRW: 555958, gainKRW: 613, gainPercent: 0.11 },
      { name: '알파벳 C (GOOG)', investedKRW: 457022, currentKRW: 490644, gainKRW: 33622, gainPercent: 7.36 },
      { name: '크래프트 하인즈 (KHC)', investedKRW: 227224, currentKRW: 226967, gainKRW: -257, gainPercent: -0.11 },
    ],
  },
  irp: {
    investedKRW: 250366,
    currentKRW: 263861,
    gainKRW: 13495,
    gainPercent: 5.40,
    holdings: [
      { name: 'TIGER 미국나스닥100', investedKRW: 160815, currentKRW: 173860, gainKRW: 13045, gainPercent: 8.11 },
      { name: 'KODEX 미국10년국채액티브(H)', investedKRW: 88875, currentKRW: 89325, gainKRW: 450, gainPercent: 0.51 },
      { name: '현금성자산', investedKRW: 0, currentKRW: 676, gainKRW: 0, gainPercent: 0.00 },
    ],
  },
}

// 목표 포트폴리오 (가윤달리오와 동일)
const PORTFOLIOS = {
  pension: {
    id: 'pension',
    name: '연금저축',
    icon: '🧓',
    amount: 6000000,
    status: '진행중',
    taxBenefit: '세액공제 79.2만원',
    description: '배당+성장+안전자산 혼합',
    items: [
      { ticker: '458730', name: 'TIGER 미국배당다우존스', category: '배당', targetWeight: 20, risk: 2 },
      { ticker: '360750', name: 'TIGER S&P500', category: '해외주식', targetWeight: 15, risk: 3 },
      { ticker: '161510', name: 'PLUS 고배당주', category: '배당', targetWeight: 10, risk: 2 },
      { ticker: '305080', name: 'TIGER 미국채10년선물', category: '채권', targetWeight: 10, risk: 1 },
      { ticker: '472150', name: 'KODEX 금액티브', category: '금', targetWeight: 10, risk: 1 },
      { ticker: '357870', name: 'TIGER CD금리액티브', category: '현금성', targetWeight: 10, risk: 1 },
      { ticker: '305090', name: 'TIGER 미국채30년선물', category: '채권', targetWeight: 8, risk: 1 },
      { ticker: '456600', name: 'TIGER SOFR금리액티브', category: '달러', targetWeight: 7, risk: 1 },
      { ticker: '133690', name: 'TIGER 나스닥100', category: '해외주식', targetWeight: 5, risk: 4 },
      { ticker: '229200', name: 'KODEX 코스닥150', category: '국내주식', targetWeight: 5, risk: 3 },
    ],
  },
  isa: {
    id: 'isa',
    name: 'ISA',
    icon: '📊',
    amount: 20000000,
    status: '진행중',
    taxBenefit: '비과세 200만원 + 9.9% 분리과세',
    description: '배당+성장+안전자산 혼합',
    items: [
      { ticker: '458730', name: 'TIGER 미국배당다우존스', category: '배당', targetWeight: 20, risk: 2 },
      { ticker: '360750', name: 'TIGER S&P500', category: '해외주식', targetWeight: 15, risk: 3 },
      { ticker: '161510', name: 'PLUS 고배당주', category: '배당', targetWeight: 10, risk: 2 },
      { ticker: '305080', name: 'TIGER 미국채10년선물', category: '채권', targetWeight: 10, risk: 1 },
      { ticker: '472150', name: 'KODEX 금액티브', category: '금', targetWeight: 10, risk: 1 },
      { ticker: '357870', name: 'TIGER CD금리액티브', category: '현금성', targetWeight: 10, risk: 1 },
      { ticker: '305090', name: 'TIGER 미국채30년선물', category: '채권', targetWeight: 8, risk: 1 },
      { ticker: '456600', name: 'TIGER SOFR금리액티브', category: '달러', targetWeight: 7, risk: 1 },
      { ticker: '133690', name: 'TIGER 나스닥100', category: '해외주식', targetWeight: 5, risk: 4 },
      { ticker: '069500', name: 'KODEX 200', category: '국내주식', targetWeight: 5, risk: 2 },
    ],
  },
  irp: {
    id: 'irp',
    name: 'IRP',
    icon: '🏦',
    amount: 3000000,
    status: '진행중',
    taxBenefit: '세액공제 39.6만원',
    description: '배당 중심 + 안전자산 30%',
    items: [
      { ticker: '161510', name: 'PLUS 고배당주', category: '배당', targetWeight: 35, risk: 2 },
      { ticker: '458730', name: 'TIGER 미국배당다우존스', category: '배당', targetWeight: 35, risk: 2 },
      { ticker: '472150', name: 'KODEX 금액티브', category: '금', targetWeight: 10, risk: 1 },
      { ticker: '305080', name: 'TIGER 미국채10년선물', category: '채권', targetWeight: 10, risk: 1 },
      { ticker: '305090', name: 'TIGER 미국채30년선물', category: '채권', targetWeight: 10, risk: 1 },
    ],
  },
  stock: {
    id: 'stock',
    name: '해외주식',
    icon: '🌍',
    amount: 5000000,
    status: '진행중',
    taxBenefit: '양도세 250만원 비과세',
    description: '미국 배당주 + 가치주 중심',
    items: [
      { ticker: 'GOOG', name: '알파벳 C (구글)', category: '빅테크', targetWeight: 30, risk: 3 },
      { ticker: 'CVX', name: '셰브론', category: '에너지', targetWeight: 35, risk: 3 },
      { ticker: 'KHC', name: '크래프트 하인즈', category: '필수소비재', targetWeight: 15, risk: 2 },
      { ticker: '360750', name: 'TIGER S&P500', category: '해외주식', targetWeight: 10, risk: 3 },
      { ticker: 'USD', name: '미국달러', category: '현금성', targetWeight: 10, risk: 1 },
    ],
  },
}

// ETF 상세 정보
const ETF_DETAILS = {
  '458730': {
    fullName: 'TIGER 미국배당다우존스',
    benchmark: 'Dow Jones US Dividend 100',
    expense: '0.01%',
    description: '미국 배당 성장주 100개에 분산 투자하는 고배당 ETF',
    holdings: ['브로드컴 4.2%', '애브비 4.1%', '쉐브론 3.9%', '화이자 3.8%', 'JP모건 3.5%'],
    sectors: [
      { name: '금융', weight: 22.5, color: '#00C853' },
      { name: '헬스케어', weight: 16.8, color: '#FF5722' },
      { name: 'IT', weight: 15.2, color: '#3182F6' },
      { name: '에너지', weight: 12.1, color: '#795548' },
      { name: '기타', weight: 33.4, color: '#B0BEC5' },
    ],
    performance: { ytd: '+6.2%', oneYear: '+15.3%', threeYear: '+8.5%' },
    pros: ['초저보수 0.01%', '월배당 3%+', '변동성 낮음'],
    cons: ['성장주 대비 수익률 낮음', '금융섹터 편중', '금리 인상시 민감'],
    verdict: '안정적인 배당 수익이 목표라면 최적의 선택.',
    grade: 'A+',
  },
  '360750': {
    fullName: 'TIGER 미국S&P500',
    benchmark: 'S&P 500 Index',
    expense: '0.07%',
    description: '미국 대형주 500개 기업에 분산 투자하는 대표 지수 ETF',
    holdings: ['애플 7.1%', '마이크로소프트 6.8%', '엔비디아 6.2%', '아마존 3.8%', '메타 2.5%'],
    sectors: [
      { name: 'IT', weight: 31.5, color: '#3182F6' },
      { name: '금융', weight: 13.2, color: '#00C853' },
      { name: '헬스케어', weight: 12.1, color: '#FF5722' },
      { name: '소비재', weight: 10.5, color: '#9C27B0' },
      { name: '기타', weight: 32.7, color: '#B0BEC5' },
    ],
    performance: { ytd: '+8.2%', oneYear: '+26.3%', threeYear: '+10.1%' },
    pros: ['세계 최대 규모 ETF', '연평균 10%+ 역사적 수익률', '달러 자산으로 원화 헤지'],
    cons: ['미국 경제 100% 의존', '빅테크 편중 35%', '환율 변동 리스크'],
    verdict: '장기 투자의 정석. 10년 이상 묻어두면 거의 확실한 수익.',
    grade: 'A+',
  },
  '161510': {
    fullName: 'PLUS 고배당주',
    benchmark: 'FnGuide 고배당주 지수',
    expense: '0.25%',
    description: '국내 고배당 우량주에 투자하는 배당 ETF',
    holdings: ['삼성전자우 8.5%', '하나금융 6.2%', 'KB금융 5.8%', 'POSCO 5.1%', 'KT&G 4.8%'],
    sectors: [
      { name: '금융', weight: 35.2, color: '#00C853' },
      { name: '철강/소재', weight: 18.5, color: '#795548' },
      { name: 'IT', weight: 15.3, color: '#3182F6' },
      { name: '통신', weight: 12.1, color: '#FF9800' },
      { name: '기타', weight: 18.9, color: '#B0BEC5' },
    ],
    performance: { ytd: '+4.5%', oneYear: '+12.8%', threeYear: '+5.2%' },
    pros: ['연 4%+ 배당수익률', '국내 우량주 분산', '분기배당'],
    cons: ['금융섹터 편중 35%', '코리아 디스카운트', '성장성 제한'],
    verdict: '안정적인 국내 배당 투자. IRP 안전자산으로 적합.',
    grade: 'A-',
  },
  '305080': {
    fullName: 'TIGER 미국채10년선물',
    benchmark: 'US Treasury 10Y Futures',
    expense: '0.09%',
    description: '미국 10년 국채 선물에 투자하여 금리 변동에 따른 수익 추구',
    holdings: ['미국채 10년 선물 98%', '현금/단기채 2%'],
    sectors: [
      { name: '미국 국채', weight: 98, color: '#10B981' },
      { name: '현금성', weight: 2, color: '#B0BEC5' },
    ],
    performance: { ytd: '-2.1%', oneYear: '+1.5%', threeYear: '-8.2%' },
    pros: ['주식과 음의 상관관계', '금리 인하 시 수익', '포트폴리오 변동성 감소'],
    cons: ['금리 상승 시 손실', '롤오버 비용', '현재 고금리 환경 불리'],
    verdict: '금리 인하 사이클 시작 시 큰 수익 가능.',
    grade: 'B',
  },
  '472150': {
    fullName: 'KODEX 금액티브',
    benchmark: 'S&P GSCI Gold Index',
    expense: '0.39%',
    description: '금 선물에 투자하며 액티브 운용으로 벤치마크 초과 수익 추구',
    holdings: ['금 선물 (COMEX) 95%', '현금/단기채 5%'],
    sectors: [
      { name: '금 선물', weight: 95, color: '#F59E0B' },
      { name: '현금성', weight: 5, color: '#B0BEC5' },
    ],
    performance: { ytd: '+12.5%', oneYear: '+18.2%', threeYear: '+8.5%' },
    pros: ['인플레이션 헤지', '주식과 낮은 상관관계', '액티브 롤오버 최적화'],
    cons: ['이자/배당 없음', '금리 상승 시 기회비용', '선물 롤오버 비용'],
    verdict: '주식 하락 시 방어 역할. 안전판으로 적합.',
    grade: 'A-',
  },
  '357870': {
    fullName: 'TIGER CD금리액티브',
    benchmark: 'KOFIA 91일 CD 금리',
    expense: '0.05%',
    description: 'CD 금리에 연동되는 초안전 자산. 원금 보장에 가까움',
    holdings: ['CD 91일물 95%', '현금 5%'],
    sectors: [
      { name: 'CD/단기채', weight: 95, color: '#10B981' },
      { name: '현금', weight: 5, color: '#B0BEC5' },
    ],
    performance: { ytd: '+1.2%', oneYear: '+3.5%', threeYear: '+2.8%' },
    pros: ['원금 보장에 가까움', '변동성 거의 없음', '금리 상승 수혜'],
    cons: ['수익률 낮음', '인플레이션 헤지 불가', '장기 성장 한계'],
    verdict: '현금 대기자금 관리용. 안전자산 필수.',
    grade: 'A',
  },
  '305090': {
    fullName: 'TIGER 미국채30년선물',
    benchmark: 'US Treasury 30Y Futures',
    expense: '0.09%',
    description: '미국 30년 국채 선물에 투자. 10년물 대비 금리 민감도 높음',
    holdings: ['미국채 30년 선물 98%', '현금/단기채 2%'],
    sectors: [
      { name: '미국 장기국채', weight: 98, color: '#6366F1' },
      { name: '현금성', weight: 2, color: '#B0BEC5' },
    ],
    performance: { ytd: '-5.2%', oneYear: '-2.1%', threeYear: '-15.5%' },
    pros: ['금리 인하 시 큰 수익', '주식 급락 시 방어', '듀레이션 레버리지'],
    cons: ['금리 상승 시 큰 손실', '변동성 높음', '최근 성과 부진'],
    verdict: '공격적 채권 투자. 금리 피벗 확신 시 비중 확대.',
    grade: 'B-',
  },
  '456600': {
    fullName: 'TIGER SOFR금리액티브',
    benchmark: 'SOFR (Secured Overnight Financing Rate)',
    expense: '0.05%',
    description: '미국 단기 금리(SOFR)에 연동. 달러 자산 + 금리 수익',
    holdings: ['SOFR 연동 채권 95%', '현금 5%'],
    sectors: [
      { name: 'SOFR 채권', weight: 95, color: '#3182F6' },
      { name: '현금', weight: 5, color: '#B0BEC5' },
    ],
    performance: { ytd: '+2.8%', oneYear: '+5.2%', threeYear: '+4.1%' },
    pros: ['달러 자산으로 환헤지', '미국 금리 수혜', '변동성 낮음'],
    cons: ['환율 하락 시 손실', '금리 인하 시 수익 감소', '성장성 제한'],
    verdict: '달러 현금 대기자금으로 최적. 환율+금리 이중 수익.',
    grade: 'A',
  },
  '133690': {
    fullName: 'TIGER 나스닥100',
    benchmark: 'NASDAQ-100 Index',
    expense: '0.07%',
    description: '미국 나스닥 상장 비금융 대형주 100개에 투자',
    holdings: ['애플 8.9%', '마이크로소프트 8.5%', '엔비디아 7.8%', '아마존 5.2%', '브로드컴 4.1%'],
    sectors: [
      { name: 'IT', weight: 51.8, color: '#3182F6' },
      { name: '통신', weight: 15.2, color: '#FF9800' },
      { name: '소비재', weight: 14.5, color: '#9C27B0' },
      { name: '헬스케어', weight: 6.8, color: '#FF5722' },
      { name: '기타', weight: 11.7, color: '#B0BEC5' },
    ],
    performance: { ytd: '+10.5%', oneYear: '+32.1%', threeYear: '+12.3%' },
    pros: ['AI, 클라우드 성장 수혜', 'S&P500 대비 높은 성장성', '혁신 기업 집중'],
    cons: ['IT 섹터 편중 52%', '변동성 1.5배', '금리 인상에 취약'],
    verdict: 'S&P500보다 공격적. 기술주 강세장에서 큰 수익 가능.',
    grade: 'A',
  },
  '229200': {
    fullName: 'KODEX 코스닥150',
    benchmark: 'KOSDAQ 150 Index',
    expense: '0.019%',
    description: '코스닥 시가총액 상위 150개 중소형 성장주에 투자',
    holdings: ['에코프로비엠 9.2%', '에코프로 7.5%', '엘앤에프 4.8%', '알테오젠 4.2%', 'HLB 3.8%'],
    sectors: [
      { name: '배터리/소재', weight: 28.5, color: '#10B981' },
      { name: '바이오', weight: 25.2, color: '#9C27B0' },
      { name: 'IT/SW', weight: 18.3, color: '#3182F6' },
      { name: '게임/엔터', weight: 8.5, color: '#FF5722' },
      { name: '기타', weight: 19.5, color: '#B0BEC5' },
    ],
    performance: { ytd: '-8.5%', oneYear: '-12.3%', threeYear: '-15.2%' },
    pros: ['높은 성장 잠재력', '2차전지, 바이오', '저점 매수 기회'],
    cons: ['변동성 1.5배', '최근 3년 급락', '테마주 편중'],
    verdict: '고위험 고수익. 변동성 감내 필요.',
    grade: 'B+',
  },
  '069500': {
    fullName: 'KODEX 200',
    benchmark: 'KOSPI 200 Index',
    expense: '0.015%',
    description: '코스피 시가총액 상위 200개 대형주에 투자',
    holdings: ['삼성전자 26.8%', 'SK하이닉스 8.2%', '현대차 3.1%', '삼성바이오 2.9%', 'LG에너지솔루션 2.8%'],
    sectors: [
      { name: '반도체/IT', weight: 38.5, color: '#3182F6' },
      { name: '금융', weight: 11.2, color: '#00C853' },
      { name: '자동차', weight: 8.2, color: '#FF5722' },
      { name: '바이오', weight: 7.8, color: '#9C27B0' },
      { name: '기타', weight: 34.3, color: '#B0BEC5' },
    ],
    performance: { ytd: '+5.8%', oneYear: '+8.2%', threeYear: '-3.5%' },
    pros: ['국내 최저 보수 0.015%', '배당 수익 1.5~2%', '양도세 면제'],
    cons: ['삼성전자 편중 27%', '코리아 디스카운트', '인구 감소 리스크'],
    verdict: '국내 대형주 투자의 정석. 연금저축에 적합.',
    grade: 'A',
  },
  'GOOG': {
    fullName: '알파벳 C (구글)',
    benchmark: '-',
    expense: '-',
    description: '세계 최대 검색엔진 구글, 유튜브, 클라우드 운영',
    holdings: ['검색 광고 58%', '유튜브 10%', '클라우드 11%', '기타 21%'],
    sectors: [
      { name: '검색 광고', weight: 58, color: '#4285F4' },
      { name: '유튜브', weight: 10, color: '#FF0000' },
      { name: '클라우드', weight: 11, color: '#3182F6' },
      { name: '기타', weight: 21, color: '#B0BEC5' },
    ],
    performance: { ytd: '+12.5%', oneYear: '+28.3%', threeYear: '+15.2%' },
    pros: ['검색 시장 독점 92%', 'AI/클라우드 성장', '현금 보유 1,100억 달러'],
    cons: ['광고 의존 80%', '규제 리스크', 'AI 경쟁 심화'],
    verdict: '빅테크 중 가장 저평가. PER 23배로 매력적.',
    grade: 'A',
  },
  'CVX': {
    fullName: '셰브론',
    benchmark: '-',
    expense: '-',
    description: '미국 2위 석유 메이저. 배당 37년 연속 증가',
    holdings: ['석유/가스 생산 55%', '정유 25%', '화학 12%', '기타 8%'],
    sectors: [
      { name: '석유/가스', weight: 55, color: '#795548' },
      { name: '정유', weight: 25, color: '#FF5722' },
      { name: '화학', weight: 12, color: '#9C27B0' },
      { name: '기타', weight: 8, color: '#B0BEC5' },
    ],
    performance: { ytd: '+5.2%', oneYear: '+12.1%', threeYear: '+8.5%' },
    pros: ['배당수익률 4.2%', '37년 연속 배당 증가', '저유가에도 수익성'],
    cons: ['유가 변동 영향', 'ESG 리스크', '에너지 전환 압박'],
    verdict: '안정적 배당 수익. 에너지 섹터 필수 종목.',
    grade: 'A-',
  },
  'KHC': {
    fullName: '크래프트 하인즈',
    benchmark: '-',
    expense: '-',
    description: '버핏이 사랑한 식품 대기업. 케첩, 치즈, 커피 등',
    holdings: ['소스/양념 35%', '치즈/유제품 25%', '음료 20%', '기타 20%'],
    sectors: [
      { name: '소스', weight: 35, color: '#F44336' },
      { name: '치즈', weight: 25, color: '#FFC107' },
      { name: '음료', weight: 20, color: '#795548' },
      { name: '기타', weight: 20, color: '#B0BEC5' },
    ],
    performance: { ytd: '-2.1%', oneYear: '+5.2%', threeYear: '+2.1%' },
    pros: ['배당수익률 4.5%', '경기 방어주', '브랜드 파워'],
    cons: ['성장성 한계', '원자재 비용 상승', '소비 트렌드 변화'],
    verdict: '고배당 방어주. 불확실성 시기 안전 투자.',
    grade: 'B+',
  },
  'USD': {
    fullName: '미국달러',
    benchmark: '-',
    expense: '-',
    description: '세계 기축통화. 환율 변동에 따른 수익/손실',
    holdings: ['현금 100%'],
    sectors: [
      { name: '현금', weight: 100, color: '#10B981' },
    ],
    performance: { ytd: '+2.1%', oneYear: '+5.5%', threeYear: '+8.2%' },
    pros: ['안전자산', '원화 약세 시 수익', '유동성 최고'],
    cons: ['이자 수익 없음', '원화 강세 시 손실', '기회비용'],
    verdict: '대기 자금 관리용. 환율 헤지 효과.',
    grade: 'B',
  },
}

// 카테고리별 색상
const CATEGORY_COLORS = {
  '배당': '#10B981',
  '해외주식': '#3182F6',
  '채권': '#6B7280',
  '금': '#F59E0B',
  '현금성': '#10B981',
  '달러': '#3182F6',
  '국내주식': '#EF4444',
  '빅테크': '#7C3AED',
  '에너지': '#795548',
  '필수소비재': '#FF5722',
}

// 별 5개 위험도 표시
const RiskStars = ({ risk, size = 12 }) => {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: i <= risk ? '#F59E0B' : '#E5E8EB', fontSize: `${size}px` }}>★</span>
    )
  }
  return <span style={{ display: 'inline-flex', gap: '1px' }}>{stars}</span>
}

const styles = {
  container: { maxWidth: '100%' },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '1px solid #E5E8EB',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#4E5968',
    cursor: 'pointer',
    marginBottom: '16px',
  },
  header: { marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#191F28', margin: 0 },
  subtitle: { fontSize: '14px', color: '#8B95A1', marginTop: '4px' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  tab: (active) => ({
    padding: '10px 20px',
    backgroundColor: active ? '#3182F6' : 'white',
    color: active ? 'white' : '#4E5968',
    border: active ? 'none' : '1px solid #E5E8EB',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  }),
}

export default function HaneulReportPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pension')

  const portfolio = PORTFOLIOS[activeTab]
  const actual = ACTUAL_HOLDINGS[activeTab]
  const safeWeight = portfolio.items.filter(i => i.risk <= 2).reduce((s, i) => s + i.targetWeight, 0)
  const riskWeight = 100 - safeWeight
  const avgRisk = portfolio.items.reduce((s, i) => s + (i.risk * i.targetWeight), 0) / 100

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate('/')}>
        ← 하늘 버핏으로 돌아가기
      </button>

      <div style={styles.header}>
        <h1 style={styles.title}>📊 하늘버핏 포트폴리오 상세 리포트</h1>
        <p style={styles.subtitle}>각 계좌별 ETF 구성, 위험도, 성과 분석</p>
      </div>

      {/* 탭 */}
      <div style={styles.tabs}>
        {Object.values(PORTFOLIOS).map(p => {
          const a = ACTUAL_HOLDINGS[p.id]
          return (
            <button
              key={p.id}
              style={styles.tab(activeTab === p.id)}
              onClick={() => setActiveTab(p.id)}
            >
              {p.icon} {p.name}
              {a.currentKRW > 0 && (
                <span style={{
                  marginLeft: '6px',
                  color: activeTab === p.id
                    ? (a.gainPercent >= 0 ? '#B2FF59' : '#FF8A80')
                    : (a.gainPercent >= 0 ? '#00C853' : '#F04438'),
                  fontWeight: '700',
                }}>
                  {a.gainPercent >= 0 ? '+' : ''}{a.gainPercent.toFixed(1)}%
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* 포트폴리오 요약 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #E5E8EB',
        padding: '24px',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#191F28', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{portfolio.icon}</span>
              <span>{portfolio.name}</span>
              <span style={{
                padding: '4px 10px',
                backgroundColor: portfolio.status === '완료' ? '#E8F5E9' : portfolio.status === '진행중' ? '#E8F3FF' : '#FFF3E0',
                color: portfolio.status === '완료' ? '#2E7D32' : portfolio.status === '진행중' ? '#3182F6' : '#E65100',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
              }}>
                {portfolio.status}
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#8B95A1', marginTop: '4px' }}>{portfolio.description}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#191F28' }}>
              ₩{actual.currentKRW.toLocaleString()}
            </div>
            {actual.currentKRW > 0 && (
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: actual.gainKRW >= 0 ? '#00C853' : '#F04438',
                marginTop: '4px',
              }}>
                {actual.gainKRW >= 0 ? '+' : '-'}₩{Math.abs(actual.gainKRW).toLocaleString()} ({actual.gainPercent >= 0 ? '+' : ''}{actual.gainPercent.toFixed(2)}%)
              </div>
            )}
            <div style={{ fontSize: '11px', color: '#8B95A1', marginTop: '4px' }}>
              매입 ₩{actual.investedKRW.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#3182F6', marginTop: '4px' }}>{portfolio.taxBenefit}</div>
          </div>
        </div>

        {/* 위험/안정 비율 + 평균 위험도 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          backgroundColor: '#F7F8FA',
          borderRadius: '12px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <span style={{ fontSize: '14px', color: '#4E5968' }}>위험자산 <strong>{riskWeight}%</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span style={{ fontSize: '14px', color: '#4E5968' }}>안정자산 <strong>{safeWeight}%</strong></span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#8B95A1' }}>평균 위험도</span>
            <RiskStars risk={Math.round(avgRisk)} size={14} />
          </div>
        </div>

        {/* 스택 바 차트 */}
        <div style={{
          display: 'flex',
          height: '40px',
          borderRadius: '10px',
          overflow: 'hidden',
          marginBottom: '16px',
        }}>
          {portfolio.items.map((item, idx) => {
            const color = CATEGORY_COLORS[item.category] || '#9CA3AF'
            return (
              <div
                key={item.ticker}
                style={{
                  width: `${item.targetWeight}%`,
                  backgroundColor: color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600',
                  borderRight: idx < portfolio.items.length - 1 ? '2px solid white' : 'none',
                }}
              >
                {item.targetWeight >= 15 ? `${item.targetWeight}%` : ''}
              </div>
            )
          })}
        </div>

        {/* 범례 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {portfolio.items.map(item => {
            const color = CATEGORY_COLORS[item.category] || '#9CA3AF'
            return (
              <div key={item.ticker} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: color }} />
                <span style={{ color: '#4E5968' }}>{item.name.replace('TIGER ', '').replace('KODEX ', '').replace('PLUS ', '')}</span>
                <span style={{ color: '#8B95A1' }}>{item.targetWeight}%</span>
              </div>
            )
          })}
        </div>

        {/* 실제 보유 종목 */}
        {actual.holdings.length > 0 && (
          <div style={{ marginTop: '20px', borderTop: '1px solid #E5E8EB', paddingTop: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#191F28', marginBottom: '12px' }}>
              📊 실제 보유 종목
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {actual.holdings.map((h, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: '#F7F8FA',
                  borderRadius: '10px',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: '#191F28' }}>{h.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', color: '#8B95A1' }}>
                      ₩{h.currentKRW.toLocaleString()}
                    </span>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: h.gainKRW >= 0 ? '#00C853' : '#F04438',
                      minWidth: '80px',
                      textAlign: 'right',
                    }}>
                      {h.gainKRW >= 0 ? '+' : '-'}₩{Math.abs(h.gainKRW).toLocaleString()}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      backgroundColor: h.gainPercent >= 0 ? '#E8F5E9' : '#FFEBEE',
                      color: h.gainPercent >= 0 ? '#00C853' : '#F04438',
                      minWidth: '60px',
                      textAlign: 'center',
                    }}>
                      {h.gainPercent >= 0 ? '+' : ''}{h.gainPercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ETF 상세 카드 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {portfolio.items.map(item => {
          const etf = ETF_DETAILS[item.ticker]
          const color = CATEGORY_COLORS[item.category] || '#9CA3AF'
          const itemAmount = Math.round(portfolio.amount * item.targetWeight / 100)

          if (!etf) return null

          return (
            <div key={item.ticker} style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              border: '1px solid #E5E8EB',
              overflow: 'hidden',
            }}>
              {/* ETF 헤더 */}
              <div style={{
                padding: '20px',
                borderBottom: '1px solid #F2F4F6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '16px',
              }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    backgroundColor: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '14px',
                    flexShrink: 0,
                  }}>
                    {item.targetWeight}%
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: '#191F28' }}>{etf.fullName}</span>
                      <RiskStars risk={item.risk} size={12} />
                    </div>
                    <div style={{ fontSize: '13px', color: '#8B95A1', marginBottom: '4px' }}>
                      종목코드: <strong>{item.ticker}</strong> · {etf.benchmark}
                    </div>
                    <div style={{ fontSize: '13px', color: '#4E5968' }}>{etf.description}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#191F28' }}>
                    {(itemAmount / 10000).toLocaleString()}만원
                  </div>
                  <div style={{
                    marginTop: '8px',
                    padding: '4px 12px',
                    backgroundColor: etf.grade.startsWith('A') ? '#E8F5E9' : '#FFF8E1',
                    color: etf.grade.startsWith('A') ? '#2E7D32' : '#F57F17',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '700',
                    display: 'inline-block',
                  }}>
                    등급 {etf.grade}
                  </div>
                </div>
              </div>

              {/* 성과 */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F2F4F6' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#191F28', marginBottom: '12px' }}>수익률</div>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {[
                    { label: 'YTD', value: etf.performance.ytd },
                    { label: '1년', value: etf.performance.oneYear },
                    { label: '3년(연)', value: etf.performance.threeYear },
                    { label: '보수', value: etf.expense },
                  ].map(stat => (
                    <div key={stat.label} style={{
                      flex: '1 1 80px',
                      padding: '12px',
                      backgroundColor: '#F7F8FA',
                      borderRadius: '8px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '11px', color: '#8B95A1', marginBottom: '4px' }}>{stat.label}</div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: stat.value.startsWith('+') ? '#00C853' : stat.value.startsWith('-') ? '#F44336' : '#191F28',
                      }}>
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 섹터 구성 */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F2F4F6' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#191F28', marginBottom: '12px' }}>섹터 구성</div>
                <div style={{
                  display: 'flex',
                  height: '20px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  marginBottom: '8px',
                }}>
                  {etf.sectors.map((sector, idx) => (
                    <div
                      key={idx}
                      style={{ width: `${sector.weight}%`, backgroundColor: sector.color }}
                      title={`${sector.name}: ${sector.weight}%`}
                    />
                  ))}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {etf.sectors.map((sector, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: sector.color }} />
                      <span style={{ color: '#4E5968' }}>{sector.name}</span>
                      <span style={{ color: '#8B95A1' }}>{sector.weight}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 상위 종목 */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F2F4F6' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#191F28', marginBottom: '12px' }}>상위 보유 종목</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {etf.holdings.map((h, idx) => (
                    <span key={idx} style={{
                      padding: '6px 10px',
                      backgroundColor: '#F7F8FA',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#4E5968',
                    }}>
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* 장단점 */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F2F4F6' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div style={{ padding: '12px', backgroundColor: '#E8F5E9', borderRadius: '10px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#2E7D32', marginBottom: '8px' }}>장점</div>
                    {etf.pros.map((pro, idx) => (
                      <div key={idx} style={{ fontSize: '12px', color: '#4E5968', padding: '3px 0' }}>• {pro}</div>
                    ))}
                  </div>
                  <div style={{ padding: '12px', backgroundColor: '#FFF5F5', borderRadius: '10px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#C62828', marginBottom: '8px' }}>리스크</div>
                    {etf.cons.map((con, idx) => (
                      <div key={idx} style={{ fontSize: '12px', color: '#4E5968', padding: '3px 0' }}>• {con}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 투자 의견 */}
              <div style={{ padding: '16px 20px', backgroundColor: '#F0F7FF' }}>
                <div style={{ fontSize: '13px', color: '#3182F6', fontWeight: '500' }}>
                  💡 <strong>투자 의견:</strong> {etf.verdict}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 종합 의견 */}
      <div style={{
        backgroundColor: '#1A1A2E',
        borderRadius: '16px',
        padding: '24px',
        marginTop: '24px',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white', margin: 0, marginBottom: '16px' }}>
          🎯 {portfolio.name} 포트폴리오 종합
        </h3>
        <div style={{ color: '#B0BEC5', fontSize: '14px', lineHeight: '1.8' }}>
          {portfolio.items.map(item => {
            const etf = ETF_DETAILS[item.ticker]
            return (
              <p key={item.ticker} style={{ marginBottom: '8px' }}>
                • <strong style={{ color: 'white' }}>{item.name.replace('TIGER ', '').replace('KODEX ', '').replace('PLUS ', '')} ({item.targetWeight}%)</strong>
                <span style={{ marginLeft: '8px' }}><RiskStars risk={item.risk} size={10} /></span>
                <span style={{ marginLeft: '8px', color: '#8B95A1' }}>종목코드 {item.ticker}</span>
              </p>
            )
          })}
          <p style={{ marginTop: '16px', color: '#81C784' }}>
            → {portfolio.taxBenefit}
          </p>
        </div>
      </div>
    </div>
  )
}
