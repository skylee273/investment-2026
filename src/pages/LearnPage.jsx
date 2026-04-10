import { useState, useEffect, useMemo } from 'react'

// ============================================
// localStorage 키
// ============================================
const STORAGE_KEYS = {
  NOTES: 'invest_notes',
  REVIEW_QUEUE: 'review_queue',
  PROGRESS: 'learn_progress',
}

// ============================================
// 투자 명언
// ============================================
const WISE_QUOTES = [
  { quote: "다른 사람이 탐욕스러울 때 두려워하고, 두려워할 때 탐욕스러워라.", author: "워렌 버핏" },
  { quote: "주식시장은 인내심 없는 사람의 돈을 인내심 있는 사람에게 옮기는 장치다.", author: "워렌 버핏" },
  { quote: "10년간 보유할 주식이 아니면 10분도 보유하지 마라.", author: "워렌 버핏" },
  { quote: "복리는 세계 8번째 불가사의다. 이해하는 자는 벌고, 모르는 자는 지불한다.", author: "알베르트 아인슈타인" },
  { quote: "투자에서 가장 위험한 말은 '이번엔 다르다'이다.", author: "존 템플턴" },
  { quote: "시장은 단기적으로 투표기계지만, 장기적으로는 저울이다.", author: "벤저민 그레이엄" },
  { quote: "분산투자는 무지에 대한 보호다.", author: "워렌 버핏" },
  { quote: "위험은 자신이 무엇을 하고 있는지 모르는 데서 온다.", author: "워렌 버핏" },
  { quote: "좋은 기업을 적정 가격에 사는 것이 평범한 기업을 싸게 사는 것보다 낫다.", author: "워렌 버핏" },
  { quote: "투자의 제1원칙: 절대 돈을 잃지 마라. 제2원칙: 제1원칙을 잊지 마라.", author: "워렌 버핏" },
]

// ============================================
// 이달의 추천 도서 (2026년 4월)
// ============================================
const RECOMMENDED_BOOKS = {
  month: '2026년 4월',
  books: [
    {
      title: '돈의 심리학',
      author: '모건 하우절',
      category: '금융',
      color: '#3182F6',
      emoji: '🧠',
      description: '부의 축적은 지능이 아닌 행동에서 시작된다. 돈과 관련된 20가지 심리 법칙.',
      why: '투자 전 마인드셋을 잡아주는 필독서',
    },
    {
      title: '현명한 투자자',
      author: '벤저민 그레이엄',
      category: '주식',
      color: '#10B981',
      emoji: '📈',
      description: '가치투자의 아버지가 전하는 투자 철학. 워렌 버핏의 스승.',
      why: '주식 투자의 교과서, 평생 곁에 둘 책',
    },
    {
      title: '부자 아빠 가난한 아빠',
      author: '로버트 기요사키',
      category: '재테크',
      color: '#F59E0B',
      emoji: '💰',
      description: '자산과 부채의 차이, 현금흐름의 중요성을 깨닫게 해주는 책.',
      why: '재테크 입문자의 관점을 바꿔주는 책',
    },
    {
      title: '부동산 투자의 정석',
      author: '김학렬',
      category: '부동산',
      color: '#8B5CF6',
      emoji: '🏠',
      description: '부동산 투자의 기본 원리부터 실전 전략까지.',
      why: '내 집 마련 전 반드시 읽어야 할 책',
    },
    {
      title: '배당주 투자',
      author: '강환국',
      category: '배당',
      color: '#EF4444',
      emoji: '💵',
      description: '월급처럼 들어오는 배당금으로 경제적 자유를 향해.',
      why: 'SCHD 투자자라면 공감 100%',
    },
  ],
}

// ============================================
// 학습 카드 데이터 (Level 1~5)
// ============================================
const LEARNING_CARDS = [
  // Level 1: 입문
  {
    id: 'L1-001', level: 1, category: '투자 기초', title: '복리의 마법',
    tags: ['복리', '기초', '시간'],
    summary: '시간이 돈을 벌어주는 원리',
    content: `복리란 이자에 이자가 붙는 것입니다.

**단리 vs 복리**
- 단리: 원금 100만원 × 10% = 매년 10만원
- 복리: 1년차 110만원 → 2년차 121만원 → 3년차 133만원...

**72의 법칙**
72 ÷ 수익률 = 원금이 2배가 되는 기간
- 연 10% → 7.2년에 2배
- 연 7% → 약 10년에 2배`,
    formula: '미래가치 = 현재가치 × (1 + 수익률)^기간',
    practicalTip: 'S&P500 연평균 10% 복리 → 7년마다 자산 2배',
    quiz: { question: '100만원을 연 10% 복리로 3년 투자하면?', options: ['130만원', '133.1만원', '131만원', '135만원'], answer: 1 },
  },
  {
    id: 'L1-002', level: 1, category: '투자 기초', title: '주식이란?',
    tags: ['주식', '기초', '소유권'],
    summary: '회사의 작은 조각을 사는 것',
    content: `주식은 회사의 소유권 일부입니다.

**주식을 사면?**
- 회사의 주인(주주)이 됩니다
- 회사가 돈을 벌면 배당금을 받습니다
- 주가가 오르면 시세차익을 얻습니다

**예시**
삼성전자 1주 = 삼성전자의 약 59억분의 1 소유`,
    formula: '주식 가치 = 회사 가치 ÷ 발행 주식 수',
    practicalTip: '좋은 기업의 주식은 장기적으로 우상향하는 경향',
    quiz: { question: '주식을 사면 무엇이 되나요?', options: ['채권자', '직원', '주주(소유자)', '고객'], answer: 2 },
  },
  {
    id: 'L1-003', level: 1, category: '투자 기초', title: 'ETF란?',
    tags: ['ETF', '분산투자', '펀드'],
    summary: '여러 주식을 한 번에 사는 바구니',
    content: `ETF = Exchange Traded Fund (상장지수펀드)

**ETF의 장점**
- 분산투자: 하나 사면 수십~수백 종목 투자
- 낮은 비용: 펀드보다 수수료 저렴
- 쉬운 거래: 주식처럼 실시간 매매

**대표 ETF**
- VOO: S&P500 추종 (미국 대형주 500개)
- QQQ: 나스닥100 추종 (기술주 중심)
- SCHD: 배당주 ETF`,
    formula: 'ETF 가격 = 보유 종목들의 가치 합계 ÷ ETF 수량',
    practicalTip: 'VOO 하나로 미국 대형주 500개에 분산투자 가능',
    quiz: { question: 'ETF의 가장 큰 장점은?', options: ['높은 수익률 보장', '분산투자', '무위험', '세금 면제'], answer: 1 },
  },
  {
    id: 'L1-004', level: 1, category: '투자 기초', title: '채권이란?',
    tags: ['채권', '안전자산', '이자'],
    summary: '돈을 빌려주고 이자 받는 것',
    content: `채권 = 정부나 기업에 돈을 빌려주는 것

**채권의 특징**
- 만기에 원금 상환
- 정해진 이자(쿠폰) 지급
- 주식보다 변동성 낮음

**채권 종류**
- 국채: 정부 발행 (가장 안전)
- 회사채: 기업 발행 (리스크에 따라 금리 차등)`,
    formula: '채권 가격 ↔ 금리 (반비례)',
    practicalTip: '금리 인상기에는 채권 가격 하락, 인하기에는 상승',
    quiz: { question: '금리가 오르면 채권 가격은?', options: ['오른다', '내린다', '변함없다', '예측불가'], answer: 1 },
  },
  {
    id: 'L1-005', level: 1, category: '투자 기초', title: '배당이란?',
    tags: ['배당', '수익', '현금흐름'],
    summary: '회사가 주주에게 나눠주는 이익',
    content: `배당 = 회사 이익의 일부를 주주에게 분배

**배당의 형태**
- 현금배당: 돈으로 지급 (가장 일반적)
- 주식배당: 주식으로 지급

**배당수익률**
연간 배당금 ÷ 주가 × 100%
예: 1,000원 배당 ÷ 50,000원 주가 = 2%`,
    formula: '배당수익률 = 연간 배당금 ÷ 현재 주가 × 100%',
    practicalTip: '배당주 ETF(SCHD 등)로 안정적인 현금흐름 확보',
    quiz: { question: '주가 10만원, 연배당 5천원이면 배당수익률은?', options: ['2%', '5%', '10%', '50%'], answer: 1 },
  },
  {
    id: 'L1-006', level: 1, category: '밸류에이션', title: 'PER (주가수익비율)',
    tags: ['PER', '밸류에이션', '기초'],
    summary: '주가가 이익 대비 몇 배인지',
    content: `PER = Price to Earnings Ratio

**계산법**
PER = 주가 ÷ 주당순이익(EPS)

**해석**
- PER 10 = 현재 이익으로 10년이면 투자금 회수
- PER 낮으면 저평가 가능성
- 업종별로 적정 PER 다름 (IT > 은행)`,
    formula: 'PER = 주가 ÷ EPS',
    practicalTip: 'S&P500 평균 PER은 약 15~20배',
    quiz: { question: '주가 10만원, EPS 5천원이면 PER은?', options: ['10배', '15배', '20배', '25배'], answer: 2 },
  },
  {
    id: 'L1-007', level: 1, category: '밸류에이션', title: 'PBR (주가순자산비율)',
    tags: ['PBR', '밸류에이션', '자산'],
    summary: '주가가 순자산 대비 몇 배인지',
    content: `PBR = Price to Book Ratio

**계산법**
PBR = 주가 ÷ 주당순자산(BPS)

**해석**
- PBR 1 = 주가와 순자산이 같음
- PBR < 1 = 청산가치보다 싸게 거래
- 금융주는 PBR 낮고, 기술주는 높음`,
    formula: 'PBR = 주가 ÷ BPS',
    practicalTip: 'PBR이 낮다고 무조건 좋은 건 아님 (성장성 고려)',
    quiz: { question: 'PBR 0.5는 무엇을 의미?', options: ['고평가', '순자산의 절반 가격', '2배 가격', '적정가'], answer: 1 },
  },
  {
    id: 'L1-008', level: 1, category: '투자 기초', title: '시가총액',
    tags: ['시총', '기업규모', '기초'],
    summary: '회사 전체의 시장 가격',
    content: `시가총액 = 주가 × 발행주식수

**규모별 분류**
- 대형주: 시총 10조원 이상
- 중형주: 1~10조원
- 소형주: 1조원 미만

**예시**
애플 시총 약 3조 달러 = 세계 최대`,
    formula: '시가총액 = 주가 × 총 발행주식수',
    practicalTip: '시총 큰 기업일수록 안정적, 작을수록 변동성 큼',
    quiz: { question: '주가 5만원, 발행주식 1억주면 시총은?', options: ['5조원', '50조원', '500억원', '5000억원'], answer: 0 },
  },
  {
    id: 'L1-009', level: 1, category: '투자전략', title: '분산투자',
    tags: ['분산', '리스크', '전략'],
    summary: '계란을 한 바구니에 담지 않기',
    content: `분산투자 = 여러 자산에 나눠 투자

**분산의 종류**
- 종목 분산: 여러 회사에 투자
- 자산 분산: 주식+채권+금+부동산
- 지역 분산: 미국+한국+신흥국

**효과**
한 종목이 -50%여도 전체 영향 최소화`,
    formula: '포트폴리오 리스크 < 개별 종목 리스크의 합',
    practicalTip: '10~20개 종목이면 충분한 분산효과',
    quiz: { question: '분산투자의 목적은?', options: ['수익 극대화', '리스크 감소', '세금 절약', '거래비용 절감'], answer: 1 },
  },
  {
    id: 'L1-010', level: 1, category: '투자전략', title: '리스크란?',
    tags: ['리스크', '변동성', '손실'],
    summary: '투자에서 손실 가능성',
    content: `리스크 = 예상과 다른 결과가 나올 가능성

**리스크의 종류**
- 시장 리스크: 전체 시장 하락
- 개별 리스크: 특정 기업 문제
- 환율 리스크: 환율 변동 손실

**리스크와 수익**
높은 리스크 → 높은 기대수익 (일반적으로)`,
    formula: '리스크 ∝ 변동성(표준편차)',
    practicalTip: '감당할 수 있는 만큼만 리스크 감수',
    quiz: { question: '일반적으로 리스크가 높으면?', options: ['수익 낮음', '기대수익 높음', '무관함', '손실 확정'], answer: 1 },
  },

  // Level 2: 기초
  {
    id: 'L2-001', level: 2, category: '자산배분', title: '자산배분이란?',
    tags: ['자산배분', '포트폴리오', '전략'],
    summary: '전체 자산을 어떻게 나눌 것인가',
    content: `자산배분 = 주식/채권/현금 등의 비율 결정

**왜 중요한가?**
투자 성과의 90% 이상이 자산배분에서 결정

**대표적 배분**
- 60/40: 주식 60% + 채권 40%
- 올웨더: 주식 30% + 채권 55% + 금 7.5% + 원자재 7.5%`,
    formula: '포트폴리오 수익 = Σ(자산비중 × 자산수익)',
    practicalTip: '나이가 들수록 채권 비중 높이는 것이 일반적',
    quiz: { question: '투자 성과에서 자산배분의 영향은?', options: ['10%', '50%', '90% 이상', '무관'], answer: 2 },
  },
  {
    id: 'L2-002', level: 2, category: '수익성', title: 'ROE (자기자본이익률)',
    tags: ['ROE', '수익성', '효율성'],
    summary: '주주 자본으로 얼마나 벌었나',
    content: `ROE = Return on Equity

**계산법**
ROE = 순이익 ÷ 자기자본 × 100%

**해석**
- ROE 15% 이상 = 우수한 기업
- 지속적으로 높은 ROE = 경쟁우위 보유
- 워렌 버핏이 중시하는 지표`,
    formula: 'ROE = 순이익 ÷ 자기자본 × 100%',
    practicalTip: '부채로 ROE 높이는 기업 주의 (재무레버리지)',
    quiz: { question: '자기자본 100억, 순이익 20억이면 ROE는?', options: ['10%', '20%', '5%', '40%'], answer: 1 },
  },
  {
    id: 'L2-003', level: 2, category: '수익성', title: 'EPS (주당순이익)',
    tags: ['EPS', '이익', '주당'],
    summary: '주식 1주당 벌어들인 이익',
    content: `EPS = Earnings Per Share

**계산법**
EPS = 순이익 ÷ 발행주식수

**중요성**
- PER 계산의 기초
- EPS 성장 = 기업 성장
- 분기별 EPS 발표 → 주가에 큰 영향`,
    formula: 'EPS = 순이익 ÷ 총 발행주식수',
    practicalTip: 'EPS가 꾸준히 증가하는 기업이 좋은 기업',
    quiz: { question: '순이익 1조원, 발행주식 1억주면 EPS는?', options: ['1만원', '100원', '1천원', '10만원'], answer: 0 },
  },
  {
    id: 'L2-004', level: 2, category: '배당', title: '배당수익률',
    tags: ['배당', '수익률', '인컴'],
    summary: '주가 대비 배당금의 비율',
    content: `배당수익률 = 연간 배당금 ÷ 현재 주가

**참고 기준**
- 2% 이하: 낮음
- 2~4%: 보통
- 4% 이상: 높음 (고배당주)

**주의점**
너무 높은 배당수익률 = 주가 하락 또는 지속불가능`,
    formula: '배당수익률 = 연간 배당금 ÷ 주가 × 100%',
    practicalTip: '배당성장률도 함께 체크 (매년 배당 증가 여부)',
    quiz: { question: '배당수익률 8%가 항상 좋은가?', options: ['네, 높을수록 좋음', '아니오, 지속가능성 확인 필요', '배당은 중요하지 않음', '8%는 낮은 편'], answer: 1 },
  },
  {
    id: 'L2-005', level: 2, category: '시장지표', title: '변동성 (Volatility)',
    tags: ['변동성', '리스크', '표준편차'],
    summary: '가격이 얼마나 출렁이는가',
    content: `변동성 = 가격 변동의 정도 (표준편차로 측정)

**특징**
- 변동성 높음 = 리스크 높음
- VIX 지수로 시장 변동성 측정
- 옵션 가격 결정에 핵심 요소`,
    formula: '변동성 = 수익률의 표준편차',
    practicalTip: 'VIX 30 이상 = 공포 구간, 매수 기회일 수 있음',
    quiz: { question: '변동성이 높으면 일반적으로?', options: ['안전하다', '리스크가 크다', '수익이 확정된다', '거래가 불가'], answer: 1 },
  },
  {
    id: 'L2-006', level: 2, category: '전략', title: '리밸런싱',
    tags: ['리밸런싱', '자산배분', '관리'],
    summary: '목표 비중으로 되돌리기',
    content: `리밸런싱 = 자산 비중을 원래대로 조정

**예시**
목표: 주식 60%, 채권 40%
→ 주식 상승으로 70:30이 됨
→ 주식 일부 매도, 채권 매수로 60:40 복원

**주기**
- 연 1~2회 또는
- 비중 5% 이상 벗어날 때`,
    formula: '매매금액 = (현재비중 - 목표비중) × 총자산',
    practicalTip: '기계적으로 리밸런싱하면 "비쌀 때 팔고, 쌀 때 사는" 효과',
    quiz: { question: '리밸런싱의 효과는?', options: ['수익 극대화', '자동으로 저가매수/고가매도', '세금 회피', '복잡성 증가'], answer: 1 },
  },
  {
    id: 'L2-007', level: 2, category: '펀드', title: '인덱스펀드 vs 액티브펀드',
    tags: ['인덱스', '액티브', '펀드'],
    summary: '시장을 따라갈 것인가, 이길 것인가',
    content: `**인덱스펀드 (패시브)**
- 지수를 그대로 추종 (S&P500 등)
- 낮은 수수료 (0.03%~0.2%)
- 장기적으로 대부분 액티브펀드 이김

**액티브펀드**
- 펀드매니저가 종목 선정
- 높은 수수료 (1~2%)
- 80% 이상이 인덱스 수익률 하회`,
    formula: '실질수익 = 총수익 - 수수료',
    practicalTip: '워렌 버핏도 일반인에게 S&P500 인덱스펀드 추천',
    quiz: { question: '장기적으로 인덱스펀드를 이기는 액티브펀드 비율은?', options: ['80%', '50%', '20% 미만', '100%'], answer: 2 },
  },
  {
    id: 'L2-008', level: 2, category: '성과측정', title: '벤치마크란?',
    tags: ['벤치마크', '비교', '성과'],
    summary: '내 수익률을 비교할 기준',
    content: `벤치마크 = 투자 성과를 평가하는 기준점

**대표 벤치마크**
- 미국 주식: S&P500
- 한국 주식: KOSPI
- 글로벌 주식: MSCI World

**활용**
내 포트폴리오 +15%, 벤치마크 +20%
→ 사실상 -5%의 초과손실`,
    formula: '초과수익(알파) = 포트폴리오 수익 - 벤치마크 수익',
    practicalTip: '적절한 벤치마크 선정이 중요 (미국주식인데 KOSPI 비교는 무의미)',
    quiz: { question: '미국 대형주 투자의 적절한 벤치마크는?', options: ['KOSPI', 'S&P500', '비트코인', '금'], answer: 1 },
  },
  {
    id: 'L2-009', level: 2, category: '성과측정', title: '알파 (Alpha)',
    tags: ['알파', '초과수익', '실력'],
    summary: '벤치마크 대비 초과 수익',
    content: `알파 = 시장 대비 추가로 벌어들인 수익

**해석**
- 알파 > 0: 시장을 이김 (실력 or 운)
- 알파 < 0: 시장에 짐
- 알파 = 0: 시장과 동일

**현실**
지속적인 양의 알파 창출은 매우 어려움`,
    formula: '알파 = 실제수익률 - (무위험수익률 + 베타 × 시장초과수익률)',
    practicalTip: '알파 추구보다 베타(시장수익) 확보가 현실적',
    quiz: { question: '알파가 2%라면?', options: ['2% 손실', '시장 대비 2% 초과수익', '절대수익 2%', '변동성 2%'], answer: 1 },
  },
  {
    id: 'L2-010', level: 2, category: '리스크', title: '베타 (Beta)',
    tags: ['베타', '시장민감도', '리스크'],
    summary: '시장 대비 얼마나 출렁이나',
    content: `베타 = 시장 변동에 대한 민감도

**해석**
- 베타 1.0: 시장과 동일하게 움직임
- 베타 1.5: 시장이 10% 오르면 15% 오름
- 베타 0.5: 시장이 10% 오르면 5% 오름

**특징**
- 기술주: 높은 베타 (1.2~1.5)
- 유틸리티: 낮은 베타 (0.5~0.8)`,
    formula: '베타 = Cov(주식, 시장) / Var(시장)',
    practicalTip: '하락장 대비 시 저베타 주식으로 방어',
    quiz: { question: '베타 2인 주식, 시장이 -10%면?', options: ['-5%', '-10%', '-20%', '-2%'], answer: 2 },
  },

  // Level 3: 중급
  {
    id: 'L3-001', level: 3, category: '성과측정', title: '샤프지수 (Sharpe Ratio)',
    tags: ['샤프', '위험조정수익', '성과'],
    summary: '위험 대비 수익의 효율성',
    content: `샤프지수 = (수익률 - 무위험수익률) / 변동성

**해석**
- 1 이상: 양호
- 2 이상: 우수
- 3 이상: 매우 우수

**의미**
같은 수익이라면 변동성이 낮을수록 좋음`,
    formula: 'Sharpe = (Rp - Rf) / σp',
    practicalTip: '헤지펀드 평가의 핵심 지표',
    quiz: { question: '수익률 15%, 무위험 3%, 변동성 12%면 샤프지수는?', options: ['0.5', '1.0', '1.5', '2.0'], answer: 1 },
  },
  {
    id: 'L3-002', level: 3, category: '성과측정', title: '소르티노 비율',
    tags: ['소르티노', '하방리스크', '성과'],
    summary: '하락 위험 대비 수익',
    content: `소르티노 = (수익률 - 무위험수익률) / 하방변동성

**샤프 vs 소르티노**
- 샤프: 전체 변동성 사용
- 소르티노: 하락 변동성만 사용

**장점**
상승 변동성은 좋은 것이므로 제외하고 평가`,
    formula: 'Sortino = (Rp - Rf) / σdownside',
    practicalTip: '손실 회피 성향 투자자에게 더 유용한 지표',
    quiz: { question: '소르티노가 샤프보다 높다면?', options: ['하락보다 상승 변동성이 큼', '손실이 큼', '거래량 많음', '유동성 좋음'], answer: 0 },
  },
  {
    id: 'L3-003', level: 3, category: '리스크', title: 'MDD (최대낙폭)',
    tags: ['MDD', '낙폭', '리스크'],
    summary: '고점에서 저점까지 최대 손실',
    content: `MDD = Maximum Drawdown

**계산**
고점 대비 저점까지의 최대 하락폭

**예시**
- 100 → 60 → 80: MDD = -40%
- S&P500 역사상 최대 MDD: -57% (2008년)`,
    formula: 'MDD = (저점 - 직전고점) / 직전고점',
    practicalTip: 'MDD -20% 이상 견딜 수 있는지 자문해보기',
    quiz: { question: '100에서 40까지 하락 후 70 회복, MDD는?', options: ['-30%', '-40%', '-60%', '-70%'], answer: 2 },
  },
  {
    id: 'L3-004', level: 3, category: '성과측정', title: 'CAGR (연평균성장률)',
    tags: ['CAGR', '복리수익', '성장'],
    summary: '복리로 환산한 연간 수익률',
    content: `CAGR = Compound Annual Growth Rate

**왜 필요한가?**
- 단순평균은 오해 유발
- 예: +100%, -50% → 단순평균 +25%, 실제 0%

**계산**
(최종값/초기값)^(1/기간) - 1`,
    formula: 'CAGR = (종료가치/시작가치)^(1/n) - 1',
    practicalTip: 'S&P500 장기 CAGR 약 10% (배당 재투자 포함)',
    quiz: { question: '100만원이 5년 후 200만원이면 CAGR은 약?', options: ['10%', '15%', '20%', '100%'], answer: 1 },
  },
  {
    id: 'L3-005', level: 3, category: '성과측정', title: 'TWR vs MWR',
    tags: ['TWR', 'MWR', '수익률계산'],
    summary: '시간가중 vs 금액가중 수익률',
    content: `**TWR (Time-Weighted Return)**
- 입출금 영향 제거
- 펀드매니저 실력 평가에 적합

**MWR (Money-Weighted Return)**
- 입출금 시점 반영 (IRR과 유사)
- 개인 투자자 실제 성과 측정에 적합`,
    formula: 'TWR = Π(1+Ri) - 1 (각 기간 수익률의 곱)',
    practicalTip: '내 계좌는 MWR, 펀드 비교는 TWR로',
    quiz: { question: '펀드매니저 실력 평가에 적합한 것은?', options: ['TWR', 'MWR', 'IRR', 'NPV'], answer: 0 },
  },
  {
    id: 'L3-006', level: 3, category: '채권', title: '듀레이션',
    tags: ['듀레이션', '채권', '금리민감도'],
    summary: '금리 변화에 대한 채권 가격 민감도',
    content: `듀레이션 = 금리 1% 변화 시 채권 가격 변화율

**예시**
듀레이션 5년 채권
→ 금리 1% 상승 시 가격 약 5% 하락

**특징**
- 만기 길수록 듀레이션 큼
- 쿠폰 낮을수록 듀레이션 큼`,
    formula: '가격변화율 ≈ -듀레이션 × 금리변화',
    practicalTip: '금리 상승 예상 시 단기채(낮은 듀레이션) 선호',
    quiz: { question: '듀레이션 7년 채권, 금리 2% 상승 시 가격은?', options: ['+14%', '-14%', '+7%', '-7%'], answer: 1 },
  },
  {
    id: 'L3-007', level: 3, category: '파생상품', title: '옵션 기초',
    tags: ['옵션', '콜', '풋', '파생'],
    summary: '살 권리(콜)와 팔 권리(풋)',
    content: `**콜옵션 (Call)**
- 특정 가격에 살 수 있는 권리
- 주가 상승 시 이익

**풋옵션 (Put)**
- 특정 가격에 팔 수 있는 권리
- 주가 하락 시 이익 (헤지 용도)

**프리미엄**
옵션을 사기 위해 지불하는 가격`,
    formula: '옵션 가치 = 내재가치 + 시간가치',
    practicalTip: '초보자는 옵션 매수만, 매도는 위험',
    quiz: { question: '주가 하락에 대비하려면?', options: ['콜옵션 매수', '풋옵션 매수', '콜옵션 매도', '주식 추가 매수'], answer: 1 },
  },
  {
    id: 'L3-008', level: 3, category: '파생상품', title: '선물 기초',
    tags: ['선물', '헤지', '레버리지'],
    summary: '미래에 거래할 것을 지금 약속',
    content: `선물 = 미래 특정 시점에 정해진 가격으로 사고팔기로 한 계약

**특징**
- 레버리지 (증거금으로 큰 금액 거래)
- 만기 존재
- 헤지 또는 투기 용도

**대표 선물**
S&P500 선물, 원유 선물, 금 선물`,
    formula: '선물가격 ≈ 현물가격 × (1 + 금리 - 배당)^T',
    practicalTip: '레버리지는 양날의 검, 손실도 배로',
    quiz: { question: '선물의 특징이 아닌 것은?', options: ['레버리지', '만기 존재', '원금 보장', '헤지 가능'], answer: 2 },
  },
  {
    id: 'L3-009', level: 3, category: 'ETF', title: '레버리지/인버스 ETF',
    tags: ['레버리지', '인버스', 'ETF'],
    summary: '2배 추종 vs 반대로 추종',
    content: `**레버리지 ETF**
- 지수의 2배(또는 3배) 추종
- 예: TQQQ (나스닥100 3배)

**인버스 ETF**
- 지수의 반대 방향 추종
- 예: SH (S&P500 인버스)

**주의**
일간 수익률 추종 → 장기보유 시 복리 효과로 괴리 발생`,
    formula: '레버리지 ETF 장기수익 ≠ 지수수익 × 배수',
    practicalTip: '단기 트레이딩 용도, 장기보유 부적합',
    quiz: { question: '레버리지 ETF를 장기보유하면?', options: ['복리로 더 이득', '괴리 발생 가능', '배수만큼 정확히 수익', '손실 불가'], answer: 1 },
  },
  {
    id: 'L3-010', level: 3, category: '시장심리', title: 'VIX (공포지수)',
    tags: ['VIX', '변동성', '심리'],
    summary: '시장의 공포와 탐욕 측정',
    content: `VIX = S&P500 옵션의 내재변동성 지수

**해석**
- VIX < 15: 낙관 (탐욕)
- VIX 15~25: 보통
- VIX 25~35: 불안
- VIX > 35: 공포

**역사적 고점**
2008년: 80, 2020년 코로나: 82`,
    formula: 'VIX = 30일 옵션 내재변동성 × 100',
    practicalTip: '극단적 VIX 상승 시 역발상 매수 기회 탐색',
    quiz: { question: 'VIX가 50이면 시장 상황은?', options: ['매우 평온', '약간 불안', '극도의 공포', '축제 분위기'], answer: 2 },
  },

  // Level 4: 고급
  {
    id: 'L4-001', level: 4, category: '밸류에이션', title: 'DCF 밸류에이션',
    tags: ['DCF', '현금흐름', '가치평가'],
    summary: '미래 현금흐름의 현재 가치',
    content: `DCF = Discounted Cash Flow

**원리**
미래에 받을 돈을 현재 가치로 할인

**계산 단계**
1. 미래 현금흐름 추정
2. 할인율(WACC) 결정
3. 현재가치 합산
4. 순부채 차감 → 주주가치`,
    formula: '기업가치 = Σ FCF_t / (1+r)^t + 터미널가치',
    practicalTip: '가정에 따라 결과가 크게 달라짐, 민감도 분석 필수',
    quiz: { question: 'DCF에서 할인율이 높아지면 기업가치는?', options: ['증가', '감소', '불변', '예측불가'], answer: 1 },
  },
  {
    id: 'L4-002', level: 4, category: '밸류에이션', title: '멀티플 분석',
    tags: ['멀티플', 'Peer', '비교분석'],
    summary: '동종업계 비교를 통한 가치평가',
    content: `멀티플 = 가격 / 기준치 (PER, PBR, EV/EBITDA 등)

**방법**
1. 비교 가능한 기업군 선정
2. 멀티플 계산
3. 평균/중앙값 대비 평가

**대표 멀티플**
- PER, PBR: 주가 기준
- EV/EBITDA: 기업가치 기준`,
    formula: '적정주가 = 업계 평균 PER × 자사 EPS',
    practicalTip: '성장률 차이를 반영한 PEG도 함께 검토',
    quiz: { question: 'EV/EBITDA가 낮으면?', options: ['고평가', '저평가 가능', '성장주', '배당주'], answer: 1 },
  },
  {
    id: 'L4-003', level: 4, category: '매크로', title: '경기사이클',
    tags: ['경기', '사이클', '매크로'],
    summary: '확장-정점-수축-저점의 순환',
    content: `경기사이클 = 경제의 확장과 수축 반복

**4단계**
1. 회복기: 저점에서 상승
2. 확장기: 성장 가속
3. 후퇴기: 성장 둔화
4. 침체기: 마이너스 성장

**투자 전략**
각 단계별 유망 섹터가 다름`,
    formula: '경기선행지수, PMI 등으로 사이클 위치 파악',
    practicalTip: '침체기에 주식 매수 → 회복기에 수익 극대화',
    quiz: { question: '경기 침체기에 유리한 섹터는?', options: ['기술주', '경기방어주', '금융주', '건설주'], answer: 1 },
  },
  {
    id: 'L4-004', level: 4, category: '전략', title: '섹터 로테이션',
    tags: ['섹터', '로테이션', '순환'],
    summary: '경기 국면별 유망 섹터 이동',
    content: `섹터 로테이션 = 경기 사이클에 따라 섹터 비중 조절

**경기별 유망 섹터**
- 회복기: 금융, 산업재
- 확장기: 기술, 소비재
- 후퇴기: 에너지, 소재
- 침체기: 헬스케어, 유틸리티, 필수소비재`,
    formula: '섹터 수익률 = 시장 수익률 + 섹터별 알파',
    practicalTip: '타이밍보다 장기 우량 섹터 비중이 더 중요할 수 있음',
    quiz: { question: '경기 확장기에 유망한 섹터는?', options: ['유틸리티', '필수소비재', '기술주', '헬스케어'], answer: 2 },
  },
  {
    id: 'L4-005', level: 4, category: '전략', title: '팩터투자',
    tags: ['팩터', '스마트베타', '퀀트'],
    summary: '초과수익 요인에 집중 투자',
    content: `팩터 = 초과수익을 설명하는 특성

**대표 팩터**
- 가치(Value): 저평가 종목
- 모멘텀(Momentum): 상승 추세 종목
- 퀄리티(Quality): 우량 기업
- 사이즈(Size): 소형주
- 저변동성(Low Vol): 안정적 종목`,
    formula: '수익률 = 시장 + Σ(팩터 노출 × 팩터 프리미엄)',
    practicalTip: '팩터 ETF로 쉽게 투자 가능 (QUAL, MTUM, VTV 등)',
    quiz: { question: '가치 팩터에 해당하는 것은?', options: ['고PER 종목', '저PBR 종목', '고변동성 종목', '대형주'], answer: 1 },
  },
  {
    id: 'L4-006', level: 4, category: '전략', title: '모멘텀 투자',
    tags: ['모멘텀', '추세', '전략'],
    summary: '오르는 것은 계속 오른다',
    content: `모멘텀 = 과거 수익률이 높은 종목이 계속 상승하는 경향

**유형**
- 가격 모멘텀: 최근 상승 종목 매수
- 이익 모멘텀: 실적 상향 종목 매수

**주의점**
급격한 반전(모멘텀 크래시) 위험 존재`,
    formula: '모멘텀 점수 = 최근 12개월 수익률 - 최근 1개월 수익률',
    practicalTip: '200일 이동평균선 위 종목 = 상승 추세',
    quiz: { question: '모멘텀 전략의 핵심은?', options: ['저평가 매수', '추세 추종', '배당 수취', '공매도'], answer: 1 },
  },
  {
    id: 'L4-007', level: 4, category: '전략', title: '가치투자',
    tags: ['가치', '버핏', '그레이엄'],
    summary: '내재가치보다 싸게 사기',
    content: `가치투자 = 시장가격 < 내재가치 종목 매수

**핵심 원칙**
- 안전마진 확보 (내재가치의 70% 이하에 매수)
- 장기 보유
- 철저한 기업 분석

**대표 지표**
저PER, 저PBR, 고배당수익률`,
    formula: '안전마진 = (내재가치 - 시장가격) / 내재가치',
    practicalTip: '가치 함정(Value Trap) 주의: 싼 데는 이유가 있을 수 있음',
    quiz: { question: '가치투자의 핵심 개념은?', options: ['모멘텀', '안전마진', '레버리지', '단기매매'], answer: 1 },
  },
  {
    id: 'L4-008', level: 4, category: '전략', title: '성장투자',
    tags: ['성장', '그로스', 'GARP'],
    summary: '높은 성장률에 베팅',
    content: `성장투자 = 매출/이익 성장률이 높은 기업 투자

**특징**
- 높은 PER 감수 (미래 성장 반영)
- 배당보다 재투자
- 기술/혁신 기업 선호

**GARP**
Growth At Reasonable Price
= 성장주 + 가치투자 결합`,
    formula: 'PEG = PER / EPS 성장률 (1 이하면 매력적)',
    practicalTip: 'PEG 1 이하 = 성장 대비 저평가 가능성',
    quiz: { question: 'PEG가 0.5라면?', options: ['고평가', '성장 대비 저평가', '배당주', '침체기 종목'], answer: 1 },
  },
  {
    id: 'L4-009', level: 4, category: '자산배분', title: '리스크 패리티',
    tags: ['리스크패리티', '올웨더', '배분'],
    summary: '리스크 기여도를 균등하게',
    content: `리스크 패리티 = 각 자산의 리스크 기여도 동일하게 배분

**기존 60/40과 차이**
- 60/40: 리스크의 90%가 주식에서
- 리스크 패리티: 주식/채권/원자재 등 리스크 균등

**레이 달리오의 올웨더**
대표적인 리스크 패리티 전략`,
    formula: '리스크 기여도 = 비중 × 변동성 × 상관관계',
    practicalTip: '채권 비중 높이고 레버리지로 수익 보완',
    quiz: { question: '리스크 패리티의 목표는?', options: ['수익 극대화', '리스크 기여도 균등화', '세금 최소화', '거래 최소화'], answer: 1 },
  },
  {
    id: 'L4-010', level: 4, category: '자산배분', title: '올웨더 포트폴리오',
    tags: ['올웨더', '달리오', '사계절'],
    summary: '어떤 경제 환경에서도 안정적',
    content: `올웨더 = 4가지 경제 환경에 대비

**4가지 시나리오**
1. 성장 상승 + 물가 상승: 주식, 원자재
2. 성장 상승 + 물가 하락: 주식, 채권
3. 성장 하락 + 물가 상승: 금, 원자재
4. 성장 하락 + 물가 하락: 채권

**전통적 배분**
주식 30%, 장기채 40%, 중기채 15%, 금 7.5%, 원자재 7.5%`,
    formula: '포트폴리오 = 경제 시나리오별 자산 균형',
    practicalTip: '한국에서는 환헤지 여부도 고려 필요',
    quiz: { question: '올웨더에서 채권 비중이 높은 이유는?', options: ['수익 극대화', '리스크 균형', '배당 수취', '세금 절약'], answer: 1 },
  },

  // Level 5: 전문
  {
    id: 'L5-001', level: 5, category: '매크로', title: '매크로 분석 기초',
    tags: ['매크로', 'GDP', '지표'],
    summary: '거시경제 지표로 투자 판단',
    content: `매크로 분석 = 경제 전체 흐름 파악

**핵심 지표**
- GDP 성장률: 경제 성장 속도
- 실업률: 고용 시장 건전성
- 인플레이션(CPI): 물가 상승률
- PMI: 제조업/서비스업 경기

**활용**
지표 → 통화정책 예측 → 자산 배분`,
    formula: 'GDP = C + I + G + (X - M)',
    practicalTip: 'ISM PMI 50 이상 = 확장, 이하 = 수축',
    quiz: { question: 'PMI 45는 무엇을 의미?', options: ['강한 확장', '약한 확장', '수축', '중립'], answer: 2 },
  },
  {
    id: 'L5-002', level: 5, category: '매크로', title: '통화정책과 투자',
    tags: ['연준', '금리', '양적완화'],
    summary: '중앙은행 정책이 자산에 미치는 영향',
    content: `**연준(Fed)의 도구**
1. 기준금리: 경제 속도 조절
2. 양적완화(QE): 유동성 공급
3. 양적긴축(QT): 유동성 회수

**자산별 영향**
- 금리 인하: 주식↑, 채권가격↑, 달러↓
- 금리 인상: 주식↓, 채권가격↓, 달러↑`,
    formula: '연준 정책 → 금리 → 할인율 → 자산가치',
    practicalTip: '연준과 싸우지 마라 (Don\'t fight the Fed)',
    quiz: { question: '금리 인상 시 일반적으로 주가는?', options: ['상승', '하락', '무관', '급등'], answer: 1 },
  },
  {
    id: 'L5-003', level: 5, category: '채권', title: '금리 스프레드',
    tags: ['스프레드', '장단기', '신용'],
    summary: '금리 차이가 말해주는 것',
    content: `**장단기 스프레드**
- 장기금리 - 단기금리
- 역전(마이너스) = 경기침체 신호

**신용 스프레드**
- 회사채 금리 - 국채 금리
- 확대 = 위험 회피, 축소 = 위험 선호`,
    formula: '스프레드 = 금리A - 금리B',
    practicalTip: '10년-2년 금리 역전 후 12~18개월 내 침체 확률 높음',
    quiz: { question: '장단기 금리 역전의 의미는?', options: ['경기 호황', '경기침체 신호', '인플레이션', '디플레이션'], answer: 1 },
  },
  {
    id: 'L5-004', level: 5, category: '채권', title: '신용 스프레드 분석',
    tags: ['신용', '하이일드', '위험'],
    summary: '신용 위험의 가격',
    content: `신용 스프레드 = 회사채 금리 - 무위험 금리

**등급별**
- 투자등급(IG): BBB- 이상
- 투기등급(HY): BB+ 이하 (정크본드)

**해석**
스프레드 확대 = 시장 불안, 위험 회피
스프레드 축소 = 낙관, 위험 선호`,
    formula: 'HY 스프레드 = 하이일드 채권 금리 - 국채 금리',
    practicalTip: 'HY 스프레드 500bp 이상 = 매수 기회 탐색',
    quiz: { question: '신용 스프레드 확대 시 의미는?', options: ['위험 선호', '위험 회피', '경기 호황', '금리 하락'], answer: 1 },
  },
  {
    id: 'L5-005', level: 5, category: '시장심리', title: 'VIX 고급 활용',
    tags: ['VIX', '내재변동성', '트레이딩'],
    summary: 'VIX 파생상품과 전략',
    content: `**VIX 구조**
- 현물 VIX: 30일 내재변동성
- VIX 선물: 만기별 거래
- 콘탱고/백워데이션: 선물 vs 현물 가격 관계

**VIX ETF 특성**
UVXY, VXX: 콘탱고로 장기 손실
SVXY: 역VIX, 변동성 매도`,
    formula: 'VIX 선물 = 예상 미래 변동성 + 기간 프리미엄',
    practicalTip: 'VIX ETF는 헤지용 단기 보유만, 장기보유 금지',
    quiz: { question: 'VIX 선물 콘탱고란?', options: ['현물 > 선물', '선물 > 현물', '현물 = 선물', '변동성 0'], answer: 1 },
  },
  {
    id: 'L5-006', level: 5, category: '파생상품', title: '옵션 그릭스',
    tags: ['그릭스', '델타', '감마', '옵션'],
    summary: '옵션 가격 민감도 지표',
    content: `**주요 그릭스**
- 델타(Δ): 기초자산 가격 변화 민감도
- 감마(Γ): 델타의 변화율
- 세타(Θ): 시간가치 소멸
- 베가(V): 변동성 민감도

**활용**
델타 헤지, 감마 스캘핑 등 정교한 전략`,
    formula: '옵션가격 변화 ≈ Δ×dS + ½Γ×dS² + Θ×dt + V×dσ',
    practicalTip: '옵션 매도자는 세타(시간가치 소멸)로 수익',
    quiz: { question: '시간이 지나면 옵션 가치가 줄어드는 것을 나타내는 것은?', options: ['델타', '감마', '세타', '베가'], answer: 2 },
  },
  {
    id: 'L5-007', level: 5, category: '성과분석', title: '알파 귀인 분석',
    tags: ['귀인', '알파', '성과분석'],
    summary: '초과수익의 원천 분석',
    content: `귀인 분석 = 수익의 원천을 분해

**수익 분해**
1. 자산배분 효과: 어떤 자산군에 투자했나
2. 종목선택 효과: 어떤 종목을 골랐나
3. 타이밍 효과: 언제 사고팔았나
4. 환 효과: 환율 변동의 영향`,
    formula: '총수익 = 자산배분 + 종목선택 + 타이밍 + 환효과 + 잔차',
    practicalTip: '대부분의 알파는 운(잔차)인 경우가 많음',
    quiz: { question: '귀인 분석의 목적은?', options: ['세금 계산', '수익 원천 파악', '리스크 제거', '레버리지 계산'], answer: 1 },
  },
  {
    id: 'L5-008', level: 5, category: '절세', title: '세금 최적화 전략',
    tags: ['세금', '절세', '손익통산'],
    summary: '합법적으로 세금 줄이기',
    content: `**주요 전략**
1. 손익통산: 이익과 손실 상계
2. Tax Loss Harvesting: 손실 종목 매도로 세금 이연
3. 장기보유: 양도세 감면 (국내주식)
4. 절세계좌: ISA, 연금저축, IRP 활용

**계좌별 과세**
- ISA: 200만원까지 비과세
- 연금저축/IRP: 인출 시 저율 과세`,
    formula: '실질수익 = 세전수익 × (1 - 세율)',
    practicalTip: '해외주식 250만원 공제 활용, 손실 종목 연말 정리',
    quiz: { question: 'Tax Loss Harvesting이란?', options: ['이익 실현', '손실 실현으로 세금 이연', '배당 수취', '환헤지'], answer: 1 },
  },
  {
    id: 'L5-009', level: 5, category: '절세', title: 'Tax Location 전략',
    tags: ['Tax Location', '계좌배치', '절세'],
    summary: '자산을 어떤 계좌에 담을까',
    content: `Tax Location = 자산별로 최적의 계좌 배치

**원칙**
- 과세이연 계좌(연금): 채권, 리츠, 고배당주
- 일반계좌: 성장주, 인덱스펀드

**이유**
- 채권이자: 매년 과세 → 과세이연이 유리
- 성장주: 매도 전까지 과세 없음 → 일반계좌 OK`,
    formula: '세후수익 최적화 = 자산 × 적합계좌 매칭',
    practicalTip: 'IRP/연금저축에 채권형, ISA에 주식형 배치',
    quiz: { question: '채권 ETF를 담기 좋은 계좌는?', options: ['일반계좌', '연금저축', '둘 다 같음', '해외계좌'], answer: 1 },
  },
  {
    id: 'L5-010', level: 5, category: '심리', title: '행동재무학',
    tags: ['행동재무', '편향', '심리'],
    summary: '투자자의 심리적 편향',
    content: `**주요 편향**
- 손실회피: 손실의 고통 > 이익의 기쁨
- 확증편향: 내 생각에 맞는 정보만 수용
- 앵커링: 처음 본 가격에 고정
- 과잉확신: 내 실력 과대평가
- FOMO: 놓칠까 두려움

**극복법**
규칙 기반 투자, 자동화, 투자일지 작성`,
    formula: '합리적 투자 = 편향 인식 + 시스템 구축',
    practicalTip: '매수/매도 이유를 미리 적어두고 따르기',
    quiz: { question: '손실회피 편향이란?', options: ['손실 추구', '손실의 고통을 더 크게 느낌', '이익만 추구', '손실 무시'], answer: 1 },
  },
]

// ============================================
// 레벨 정보
// ============================================
const LEVEL_INFO = {
  1: { name: '입문', color: '#10B981', description: '투자의 기본 개념' },
  2: { name: '기초', color: '#3182F6', description: '핵심 지표와 전략' },
  3: { name: '중급', color: '#8B5CF6', description: '성과측정과 파생상품' },
  4: { name: '고급', color: '#F59E0B', description: '밸류에이션과 전략' },
  5: { name: '전문', color: '#EF4444', description: '매크로와 최적화' },
}

// ============================================
// 노트 템플릿
// ============================================
const NOTE_TEMPLATES = {
  free: { label: '자유 노트', emoji: '📝', color: '#6B7684' },
  stock: { label: '종목 분석', emoji: '🔍', color: '#3182F6' },
  trade: { label: '매매 일지', emoji: '💰', color: '#10B981' },
  wrong: { label: '오답 노트', emoji: '❌', color: '#EF4444' },
  idea: { label: '아이디어', emoji: '💡', color: '#F59E0B' },
  monthly: { label: '월간 리포트', emoji: '📊', color: '#8B5CF6' },
}

// ============================================
// localStorage 유틸리티
// ============================================
const loadFromStorage = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : defaultValue
  } catch {
    return defaultValue
  }
}

const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

// SM-2 알고리즘
const calculateNextReview = (card, grade) => {
  // grade: 0=완전틀림, 1=틀림, 2=어려움, 3=보통, 4=쉬움, 5=완벽
  let { interval = 1, easeFactor = 2.5, repetitions = 0 } = card

  if (grade >= 3) {
    if (repetitions === 0) interval = 1
    else if (repetitions === 1) interval = 6
    else interval = Math.round(interval * easeFactor)
    repetitions += 1
  } else {
    repetitions = 0
    interval = 1
  }

  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))

  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + interval)

  return {
    ...card,
    interval,
    easeFactor,
    repetitions,
    lastGrade: grade,
    dueDate: dueDate.toISOString().split('T')[0],
  }
}

// ============================================
// 메인 컴포넌트
// ============================================
export default function LearnPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState('home')

  // 데이터 상태
  const [notes, setNotes] = useState([])
  const [reviewQueue, setReviewQueue] = useState([])
  const [progress, setProgress] = useState({
    completedCards: [],
    streak: 0,
    lastStudyDate: null,
    totalStudyMinutes: 0,
    quizHistory: [],
  })

  // UI 상태
  const [selectedCard, setSelectedCard] = useState(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswer, setQuizAnswer] = useState(null)
  const [selectedNote, setSelectedNote] = useState(null)
  const [noteModalOpen, setNoteModalOpen] = useState(false)
  const [noteFilter, setNoteFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [reviewCard, setReviewCard] = useState(null)
  const [showReviewAnswer, setShowReviewAnswer] = useState(false)
  const [expandedLevel, setExpandedLevel] = useState(1)

  // 반응형
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 데이터 로드
  useEffect(() => {
    setNotes(loadFromStorage(STORAGE_KEYS.NOTES, []))
    setReviewQueue(loadFromStorage(STORAGE_KEYS.REVIEW_QUEUE, []))
    setProgress(loadFromStorage(STORAGE_KEYS.PROGRESS, {
      completedCards: [],
      streak: 0,
      lastStudyDate: null,
      totalStudyMinutes: 0,
      quizHistory: [],
    }))
  }, [])

  // 스트릭 체크
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    if (progress.lastStudyDate && progress.lastStudyDate !== today && progress.lastStudyDate !== yesterday) {
      // 스트릭 리셋
      const newProgress = { ...progress, streak: 0 }
      setProgress(newProgress)
      saveToStorage(STORAGE_KEYS.PROGRESS, newProgress)
    }
  }, [progress.lastStudyDate])

  // 오늘의 명언
  const todayQuote = useMemo(() => {
    const today = new Date().getDate()
    return WISE_QUOTES[today % WISE_QUOTES.length]
  }, [])

  // 오늘 복습할 카드
  const todayReviewCards = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return reviewQueue.filter(q => q.dueDate <= today)
  }, [reviewQueue])

  // 학습 완료 처리
  const completeCard = (cardId) => {
    const today = new Date().toISOString().split('T')[0]
    let newStreak = progress.streak

    if (progress.lastStudyDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      newStreak = progress.lastStudyDate === yesterday ? progress.streak + 1 : 1
    }

    const newProgress = {
      ...progress,
      completedCards: [...new Set([...progress.completedCards, cardId])],
      streak: newStreak,
      lastStudyDate: today,
    }
    setProgress(newProgress)
    saveToStorage(STORAGE_KEYS.PROGRESS, newProgress)

    // 복습 큐에 추가
    if (!reviewQueue.find(q => q.cardId === cardId)) {
      const newQueue = [...reviewQueue, calculateNextReview({ cardId }, 4)]
      setReviewQueue(newQueue)
      saveToStorage(STORAGE_KEYS.REVIEW_QUEUE, newQueue)
    }
  }

  // 퀴즈 정답 처리
  const handleQuizAnswer = (cardId, answerIdx, correctIdx) => {
    setQuizAnswer(answerIdx)
    const isCorrect = answerIdx === correctIdx
    const today = new Date().toISOString().split('T')[0]

    const newProgress = {
      ...progress,
      quizHistory: [...progress.quizHistory, { cardId, correct: isCorrect, date: today }],
    }
    setProgress(newProgress)
    saveToStorage(STORAGE_KEYS.PROGRESS, newProgress)

    if (isCorrect) {
      setTimeout(() => completeCard(cardId), 1000)
    }
  }

  // 복습 채점
  const gradeReview = (cardId, grade) => {
    const card = reviewQueue.find(q => q.cardId === cardId)
    if (!card) return

    const updated = calculateNextReview(card, grade)
    const newQueue = reviewQueue.map(q => q.cardId === cardId ? updated : q)
    setReviewQueue(newQueue)
    saveToStorage(STORAGE_KEYS.REVIEW_QUEUE, newQueue)

    setReviewCard(null)
    setShowReviewAnswer(false)
  }

  // 노트 저장
  const saveNote = (note) => {
    const newNotes = note.id
      ? notes.map(n => n.id === note.id ? { ...note, updatedAt: new Date().toISOString() } : n)
      : [...notes, { ...note, id: `note-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]
    setNotes(newNotes)
    saveToStorage(STORAGE_KEYS.NOTES, newNotes)
    setNoteModalOpen(false)
    setSelectedNote(null)
  }

  // 노트 삭제
  const deleteNote = (noteId) => {
    const newNotes = notes.filter(n => n.id !== noteId)
    setNotes(newNotes)
    saveToStorage(STORAGE_KEYS.NOTES, newNotes)
  }

  // 필터링된 노트
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      if (noteFilter !== 'all' && note.type !== noteFilter) return false
      if (searchQuery && !note.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !note.content?.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  }, [notes, noteFilter, searchQuery])

  // 통계 계산
  const stats = useMemo(() => {
    const total = LEARNING_CARDS.length
    const completed = progress.completedCards.length
    const byLevel = {}
    for (let i = 1; i <= 5; i++) {
      const levelCards = LEARNING_CARDS.filter(c => c.level === i)
      const levelCompleted = levelCards.filter(c => progress.completedCards.includes(c.id))
      byLevel[i] = { total: levelCards.length, completed: levelCompleted.length }
    }

    const recentQuizzes = progress.quizHistory.slice(-30)
    const quizAccuracy = recentQuizzes.length > 0
      ? Math.round(recentQuizzes.filter(q => q.correct).length / recentQuizzes.length * 100)
      : 0

    return { total, completed, byLevel, quizAccuracy, noteCount: notes.length }
  }, [progress, notes])

  // 스타일
  const styles = {
    container: { maxWidth: '1000px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    title: { fontSize: isMobile ? '24px' : '28px', fontWeight: '700', color: '#191F28', margin: 0 },
    subtitle: { fontSize: '14px', color: '#8B95A1', marginTop: '8px' },
    tabs: {
      display: 'flex', gap: '4px', padding: '4px', backgroundColor: '#F2F4F6',
      borderRadius: '12px', marginBottom: '24px', overflowX: 'auto',
    },
    tab: (isActive) => ({
      flex: isMobile ? 'none' : 1, padding: isMobile ? '10px 16px' : '12px 20px',
      borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: '600',
      cursor: 'pointer', whiteSpace: 'nowrap',
      backgroundColor: isActive ? 'white' : 'transparent',
      color: isActive ? '#3182F6' : '#6B7684',
      boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
      transition: 'all 0.2s',
    }),
    card: {
      backgroundColor: 'white', borderRadius: '16px', border: '1px solid #E5E8EB',
      padding: '20px', marginBottom: '16px',
    },
    cardTitle: { fontSize: '16px', fontWeight: '700', color: '#191F28', marginBottom: '8px' },
    badge: (color) => ({
      display: 'inline-block', padding: '4px 10px', borderRadius: '6px',
      fontSize: '12px', fontWeight: '600', backgroundColor: color + '20', color: color,
    }),
    button: (variant = 'primary') => ({
      padding: '12px 20px', borderRadius: '10px', border: 'none',
      fontSize: '14px', fontWeight: '600', cursor: 'pointer',
      backgroundColor: variant === 'primary' ? '#3182F6' : '#F2F4F6',
      color: variant === 'primary' ? 'white' : '#4E5968',
      transition: 'all 0.2s',
    }),
    input: {
      width: '100%', padding: '12px 16px', borderRadius: '10px',
      border: '1px solid #E5E8EB', fontSize: '14px', outline: 'none',
    },
    modal: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px',
    },
    modalContent: {
      backgroundColor: 'white', borderRadius: '20px', width: '100%',
      maxWidth: '600px', maxHeight: '90vh', overflow: 'auto',
    },
  }

  // 탭 정의
  const TABS = [
    { id: 'home', label: '홈', emoji: '🏠' },
    { id: 'learn', label: '학습', emoji: '📚' },
    { id: 'notes', label: '노트', emoji: '📝' },
    { id: 'review', label: '복습', emoji: '🔄' },
    { id: 'stats', label: '통계', emoji: '📊' },
  ]

  return (
    <div style={styles.container}>
      {/* 헤더 */}
      <div style={styles.header}>
        <h1 style={styles.title}>학습 & 노트</h1>
        <p style={styles.subtitle}>투자 지식을 쌓고, 생각을 기록하세요</p>
      </div>

      {/* 탭 네비게이션 */}
      <div style={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            style={styles.tab(activeTab === tab.id)}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>

      {/* 홈 탭 */}
      {activeTab === 'home' && (
        <div>
          {/* 스트릭 & 요약 */}
          <div style={{ ...styles.card, background: 'linear-gradient(135deg, #3182F6 0%, #6366F1 100%)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>학습 스트릭</div>
                <div style={{ fontSize: '36px', fontWeight: '800' }}>
                  🔥 {progress.streak}일 연속
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>오늘 복습</div>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>
                  {todayReviewCards.length}장 대기
                </div>
              </div>
            </div>
          </div>

          {/* 오늘의 명언 */}
          <div style={{ ...styles.card, backgroundColor: '#FFF9E6', border: '1px solid #FFE066' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#B8860B', marginBottom: '8px' }}>
              💬 오늘의 명언
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#191F28', lineHeight: '1.6' }}>
              "{todayQuote.quote}"
            </div>
            <div style={{ fontSize: '13px', color: '#6B7684', marginTop: '8px' }}>
              - {todayQuote.author}
            </div>
          </div>

          {/* 빠른 액션 */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <button style={{ ...styles.card, cursor: 'pointer', textAlign: 'center' }} onClick={() => setActiveTab('learn')}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📚</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#191F28' }}>학습하기</div>
              <div style={{ fontSize: '12px', color: '#8B95A1' }}>{stats.completed}/{stats.total} 완료</div>
            </button>
            <button style={{ ...styles.card, cursor: 'pointer', textAlign: 'center' }} onClick={() => setActiveTab('review')}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔄</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#191F28' }}>복습하기</div>
              <div style={{ fontSize: '12px', color: '#8B95A1' }}>{todayReviewCards.length}장 대기</div>
            </button>
            <button style={{ ...styles.card, cursor: 'pointer', textAlign: 'center' }} onClick={() => { setNoteModalOpen(true); setSelectedNote(null) }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>✏️</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#191F28' }}>노트 작성</div>
              <div style={{ fontSize: '12px', color: '#8B95A1' }}>새 노트</div>
            </button>
            <button style={{ ...styles.card, cursor: 'pointer', textAlign: 'center' }} onClick={() => setActiveTab('stats')}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📊</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#191F28' }}>통계</div>
              <div style={{ fontSize: '12px', color: '#8B95A1' }}>진도 확인</div>
            </button>
          </div>

          {/* 최근 노트 */}
          {notes.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#191F28', marginBottom: '12px' }}>
                📝 최근 노트
              </div>
              {notes.slice(0, 3).map(note => (
                <div key={note.id} style={{ ...styles.card, cursor: 'pointer' }} onClick={() => { setSelectedNote(note); setNoteModalOpen(true) }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{NOTE_TEMPLATES[note.type]?.emoji || '📝'}</span>
                    <span style={{ fontWeight: '600', color: '#191F28' }}>{note.title}</span>
                    <span style={styles.badge(NOTE_TEMPLATES[note.type]?.color || '#6B7684')}>
                      {NOTE_TEMPLATES[note.type]?.label || '노트'}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#8B95A1', marginTop: '8px' }}>
                    {new Date(note.updatedAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 이달의 추천 도서 */}
          <div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#191F28', marginBottom: '4px' }}>
              📚 이달의 추천 도서
            </div>
            <div style={{ fontSize: '13px', color: '#8B95A1', marginBottom: '16px' }}>
              {RECOMMENDED_BOOKS.month} | 금융 · 주식 · 부동산
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
              {RECOMMENDED_BOOKS.books.map((book, idx) => (
                <div
                  key={idx}
                  style={{
                    ...styles.card,
                    borderLeft: `4px solid ${book.color}`,
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: book.color + '20',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0,
                  }}>
                    {book.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '700', color: '#191F28', fontSize: '15px' }}>{book.title}</span>
                      <span style={styles.badge(book.color)}>{book.category}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B7684', marginBottom: '4px' }}>
                      {book.author}
                    </div>
                    <div style={{ fontSize: '13px', color: '#4E5968', lineHeight: '1.5', marginBottom: '8px' }}>
                      {book.description}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: book.color,
                      fontWeight: '600',
                      backgroundColor: book.color + '15',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      display: 'inline-block',
                    }}>
                      💡 {book.why}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 학습 탭 */}
      {activeTab === 'learn' && (
        <div>
          {/* 레벨별 진도 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '8px' }}>
            {Object.entries(LEVEL_INFO).map(([level, info]) => (
              <button
                key={level}
                style={{
                  ...styles.badge(expandedLevel === Number(level) ? info.color : '#6B7684'),
                  cursor: 'pointer', border: 'none', padding: '8px 16px',
                  backgroundColor: expandedLevel === Number(level) ? info.color : '#F2F4F6',
                  color: expandedLevel === Number(level) ? 'white' : '#4E5968',
                }}
                onClick={() => setExpandedLevel(Number(level))}
              >
                Lv.{level} {info.name} ({stats.byLevel[level]?.completed || 0}/{stats.byLevel[level]?.total || 0})
              </button>
            ))}
          </div>

          {/* 카드 목록 */}
          <div style={{ display: 'grid', gap: '12px' }}>
            {LEARNING_CARDS.filter(c => c.level === expandedLevel).map(card => {
              const isCompleted = progress.completedCards.includes(card.id)
              return (
                <div
                  key={card.id}
                  style={{
                    ...styles.card,
                    cursor: 'pointer',
                    borderLeft: `4px solid ${LEVEL_INFO[card.level].color}`,
                    opacity: isCompleted ? 0.7 : 1,
                  }}
                  onClick={() => { setSelectedCard(card); setShowQuiz(false); setQuizAnswer(null) }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        {isCompleted && <span>✅</span>}
                        <span style={styles.badge(LEVEL_INFO[card.level].color)}>{card.category}</span>
                      </div>
                      <div style={styles.cardTitle}>{card.title}</div>
                      <div style={{ fontSize: '13px', color: '#6B7684' }}>{card.summary}</div>
                    </div>
                    <div style={{ fontSize: '20px' }}>→</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 노트 탭 */}
      {activeTab === 'notes' && (
        <div>
          {/* 필터 & 검색 */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="검색..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ ...styles.input, flex: 1, minWidth: '200px' }}
            />
            <button style={styles.button('primary')} onClick={() => { setNoteModalOpen(true); setSelectedNote(null) }}>
              + 새 노트
            </button>
          </div>

          {/* 유형 필터 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '8px' }}>
            <button
              style={{ ...styles.badge(noteFilter === 'all' ? '#3182F6' : '#6B7684'), cursor: 'pointer', border: 'none' }}
              onClick={() => setNoteFilter('all')}
            >
              전체
            </button>
            {Object.entries(NOTE_TEMPLATES).map(([type, info]) => (
              <button
                key={type}
                style={{ ...styles.badge(noteFilter === type ? info.color : '#6B7684'), cursor: 'pointer', border: 'none' }}
                onClick={() => setNoteFilter(type)}
              >
                {info.emoji} {info.label}
              </button>
            ))}
          </div>

          {/* 노트 목록 */}
          {filteredNotes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8B95A1' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>노트가 없습니다</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>새 노트를 작성해보세요!</div>
            </div>
          ) : (
            filteredNotes.map(note => (
              <div
                key={note.id}
                style={{ ...styles.card, cursor: 'pointer' }}
                onClick={() => { setSelectedNote(note); setNoteModalOpen(true) }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={styles.badge(NOTE_TEMPLATES[note.type]?.color || '#6B7684')}>
                        {NOTE_TEMPLATES[note.type]?.emoji} {NOTE_TEMPLATES[note.type]?.label}
                      </span>
                    </div>
                    <div style={styles.cardTitle}>{note.title}</div>
                    {note.content && (
                      <div style={{ fontSize: '13px', color: '#6B7684', marginTop: '4px' }}>
                        {note.content.slice(0, 100)}...
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#8B95A1' }}>
                    {new Date(note.updatedAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 복습 탭 */}
      {activeTab === 'review' && (
        <div>
          {todayReviewCards.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8B95A1' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#191F28' }}>오늘 복습 완료!</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>모든 카드를 복습했습니다</div>
            </div>
          ) : reviewCard ? (
            <div>
              {/* 플래시카드 */}
              <div
                style={{
                  ...styles.card,
                  minHeight: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: showReviewAnswer
                    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #3182F6 0%, #6366F1 100%)',
                  color: 'white',
                }}
                onClick={() => setShowReviewAnswer(!showReviewAnswer)}
              >
                {!showReviewAnswer ? (
                  <>
                    <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '16px' }}>
                      {LEARNING_CARDS.find(c => c.id === reviewCard.cardId)?.category}
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '700' }}>
                      {LEARNING_CARDS.find(c => c.id === reviewCard.cardId)?.title}
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '24px' }}>
                      탭하여 정답 확인
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '16px', lineHeight: '1.8', whiteSpace: 'pre-line', padding: '0 20px' }}>
                      {LEARNING_CARDS.find(c => c.id === reviewCard.cardId)?.summary}
                    </div>
                    <div style={{ marginTop: '20px', padding: '12px 20px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px' }}>
                      <strong>공식:</strong> {LEARNING_CARDS.find(c => c.id === reviewCard.cardId)?.formula}
                    </div>
                  </>
                )}
              </div>

              {/* 채점 버튼 */}
              {showReviewAnswer && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '20px' }}>
                  <button style={{ ...styles.button('secondary'), backgroundColor: '#FEE2E2', color: '#DC2626' }} onClick={() => gradeReview(reviewCard.cardId, 1)}>
                    😓 어려움
                  </button>
                  <button style={{ ...styles.button('secondary'), backgroundColor: '#FEF3C7', color: '#D97706' }} onClick={() => gradeReview(reviewCard.cardId, 3)}>
                    🤔 보통
                  </button>
                  <button style={{ ...styles.button('secondary'), backgroundColor: '#D1FAE5', color: '#059669' }} onClick={() => gradeReview(reviewCard.cardId, 5)}>
                    😊 쉬움
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#191F28', marginBottom: '16px' }}>
                오늘 복습할 카드 ({todayReviewCards.length}장)
              </div>
              {todayReviewCards.map(item => {
                const card = LEARNING_CARDS.find(c => c.id === item.cardId)
                if (!card) return null
                return (
                  <div
                    key={item.cardId}
                    style={{ ...styles.card, cursor: 'pointer' }}
                    onClick={() => { setReviewCard(item); setShowReviewAnswer(false) }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={styles.badge(LEVEL_INFO[card.level].color)}>{card.category}</span>
                        <div style={{ fontWeight: '600', color: '#191F28', marginTop: '4px' }}>{card.title}</div>
                      </div>
                      <div style={{ fontSize: '24px' }}>→</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* 통계 탭 */}
      {activeTab === 'stats' && (
        <div>
          {/* 요약 카드 */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <div style={styles.card}>
              <div style={{ fontSize: '13px', color: '#6B7684' }}>학습 스트릭</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#3182F6' }}>🔥 {progress.streak}일</div>
            </div>
            <div style={styles.card}>
              <div style={{ fontSize: '13px', color: '#6B7684' }}>완료 카드</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#10B981' }}>{stats.completed}/{stats.total}</div>
            </div>
            <div style={styles.card}>
              <div style={{ fontSize: '13px', color: '#6B7684' }}>퀴즈 정답률</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#F59E0B' }}>{stats.quizAccuracy}%</div>
            </div>
            <div style={styles.card}>
              <div style={{ fontSize: '13px', color: '#6B7684' }}>작성 노트</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#8B5CF6' }}>{stats.noteCount}개</div>
            </div>
          </div>

          {/* 레벨별 진도 */}
          <div style={styles.card}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#191F28', marginBottom: '16px' }}>
              📈 레벨별 진도
            </div>
            {Object.entries(LEVEL_INFO).map(([level, info]) => {
              const levelStats = stats.byLevel[level] || { total: 0, completed: 0 }
              const percentage = levelStats.total > 0 ? Math.round(levelStats.completed / levelStats.total * 100) : 0
              return (
                <div key={level} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600', color: info.color }}>Lv.{level} {info.name}</span>
                    <span style={{ fontSize: '13px', color: '#6B7684' }}>{levelStats.completed}/{levelStats.total} ({percentage}%)</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#F2F4F6', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${percentage}%`, backgroundColor: info.color, borderRadius: '4px', transition: 'width 0.3s' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 학습 카드 모달 */}
      {selectedCard && (
        <div style={styles.modal} onClick={() => setSelectedCard(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            {/* 헤더 */}
            <div style={{ padding: '24px', background: `linear-gradient(135deg, ${LEVEL_INFO[selectedCard.level].color} 0%, ${LEVEL_INFO[selectedCard.level].color}dd 100%)`, color: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ padding: '4px 10px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '6px', fontSize: '12px' }}>
                    Lv.{selectedCard.level} {selectedCard.category}
                  </span>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '12px 0 0' }}>{selectedCard.title}</h2>
                </div>
                <button style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }} onClick={() => setSelectedCard(null)}>×</button>
              </div>
              <p style={{ marginTop: '12px', opacity: 0.9 }}>{selectedCard.summary}</p>
            </div>

            {/* 내용 */}
            <div style={{ padding: '24px' }}>
              <div style={{ fontSize: '14px', color: '#4E5968', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {selectedCard.content}
              </div>

              {/* 공식 */}
              <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#F0FDF4', borderRadius: '12px', border: '1px solid #86EFAC' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#16A34A', marginBottom: '8px' }}>📐 핵심 공식</div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#166534', fontFamily: 'monospace' }}>{selectedCard.formula}</div>
              </div>

              {/* 실전 팁 */}
              <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#FEF3C7', borderRadius: '12px', border: '1px solid #FCD34D' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#B45309', marginBottom: '8px' }}>💡 실전 팁</div>
                <div style={{ fontSize: '14px', color: '#92400E' }}>{selectedCard.practicalTip}</div>
              </div>

              {/* 퀴즈 */}
              <div style={{ marginTop: '24px' }}>
                <button
                  style={{ ...styles.button(showQuiz ? 'secondary' : 'primary'), width: '100%' }}
                  onClick={() => setShowQuiz(!showQuiz)}
                >
                  {showQuiz ? '퀴즈 닫기' : '🎯 퀴즈 풀기'}
                </button>

                {showQuiz && (
                  <div style={{ marginTop: '16px', padding: '20px', backgroundColor: '#F8F9FA', borderRadius: '12px' }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#191F28', marginBottom: '16px' }}>
                      Q. {selectedCard.quiz.question}
                    </div>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {selectedCard.quiz.options.map((opt, idx) => {
                        const isCorrect = idx === selectedCard.quiz.answer
                        const isSelected = quizAnswer === idx
                        let bgColor = '#F2F4F6'
                        let textColor = '#4E5968'
                        if (quizAnswer !== null) {
                          if (isCorrect) { bgColor = '#D1FAE5'; textColor = '#059669' }
                          else if (isSelected) { bgColor = '#FEE2E2'; textColor = '#DC2626' }
                        }
                        return (
                          <button
                            key={idx}
                            style={{ padding: '12px 16px', borderRadius: '10px', border: 'none', fontSize: '14px', textAlign: 'left', cursor: quizAnswer === null ? 'pointer' : 'default', backgroundColor: bgColor, color: textColor, fontWeight: isCorrect && quizAnswer !== null ? '600' : '400' }}
                            onClick={() => quizAnswer === null && handleQuizAnswer(selectedCard.id, idx, selectedCard.quiz.answer)}
                            disabled={quizAnswer !== null}
                          >
                            {idx + 1}. {opt} {quizAnswer !== null && isCorrect && '✓'}
                          </button>
                        )
                      })}
                    </div>
                    {quizAnswer !== null && (
                      <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', backgroundColor: quizAnswer === selectedCard.quiz.answer ? '#D1FAE5' : '#FEE2E2', color: quizAnswer === selectedCard.quiz.answer ? '#059669' : '#DC2626', fontWeight: '600', textAlign: 'center' }}>
                        {quizAnswer === selectedCard.quiz.answer ? '🎉 정답입니다!' : '❌ 틀렸습니다. 다시 학습해보세요.'}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 완료 버튼 */}
              {!progress.completedCards.includes(selectedCard.id) && (
                <button
                  style={{ ...styles.button('primary'), width: '100%', marginTop: '16px' }}
                  onClick={() => { completeCard(selectedCard.id); setSelectedCard(null) }}
                >
                  ✓ 학습 완료
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 노트 모달 */}
      {noteModalOpen && (
        <NoteModal
          note={selectedNote}
          onSave={saveNote}
          onDelete={deleteNote}
          onClose={() => { setNoteModalOpen(false); setSelectedNote(null) }}
          isMobile={isMobile}
        />
      )}
    </div>
  )
}

// ============================================
// 노트 모달 컴포넌트
// ============================================
function NoteModal({ note, onSave, onDelete, onClose, isMobile }) {
  const [type, setType] = useState(note?.type || 'free')
  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')
  const [ticker, setTicker] = useState(note?.ticker || '')

  const handleSave = () => {
    if (!title.trim()) return alert('제목을 입력해주세요')
    onSave({ ...note, type, title, content, ticker })
  }

  const styles = {
    modal: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px',
    },
    modalContent: {
      backgroundColor: 'white', borderRadius: '20px', width: '100%',
      maxWidth: '600px', maxHeight: '90vh', overflow: 'auto',
    },
    header: {
      padding: '20px', borderBottom: '1px solid #E5E8EB',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    body: { padding: '20px' },
    footer: {
      padding: '20px', borderTop: '1px solid #E5E8EB',
      display: 'flex', gap: '12px', justifyContent: 'flex-end',
    },
    input: {
      width: '100%', padding: '12px 16px', borderRadius: '10px',
      border: '1px solid #E5E8EB', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    },
    textarea: {
      width: '100%', padding: '12px 16px', borderRadius: '10px',
      border: '1px solid #E5E8EB', fontSize: '14px', outline: 'none',
      minHeight: '200px', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box',
    },
    button: (variant) => ({
      padding: '12px 20px', borderRadius: '10px', border: 'none',
      fontSize: '14px', fontWeight: '600', cursor: 'pointer',
      backgroundColor: variant === 'primary' ? '#3182F6' : variant === 'danger' ? '#EF4444' : '#F2F4F6',
      color: variant === 'primary' || variant === 'danger' ? 'white' : '#4E5968',
    }),
    badge: (isActive, color) => ({
      padding: '8px 14px', borderRadius: '8px', border: 'none',
      fontSize: '13px', fontWeight: '600', cursor: 'pointer',
      backgroundColor: isActive ? color : '#F2F4F6',
      color: isActive ? 'white' : '#4E5968',
    }),
  }

  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
            {note ? '노트 편집' : '새 노트'}
          </h3>
          <button style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6B7684' }} onClick={onClose}>×</button>
        </div>

        <div style={styles.body}>
          {/* 유형 선택 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#6B7684', display: 'block', marginBottom: '8px' }}>노트 유형</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Object.entries(NOTE_TEMPLATES).map(([key, info]) => (
                <button
                  key={key}
                  style={styles.badge(type === key, info.color)}
                  onClick={() => setType(key)}
                >
                  {info.emoji} {info.label}
                </button>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#6B7684', display: 'block', marginBottom: '8px' }}>제목</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="노트 제목"
              style={styles.input}
            />
          </div>

          {/* 종목 (종목분석/매매일지) */}
          {(type === 'stock' || type === 'trade') && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#6B7684', display: 'block', marginBottom: '8px' }}>종목/티커</label>
              <input
                type="text"
                value={ticker}
                onChange={e => setTicker(e.target.value)}
                placeholder="예: AAPL, 삼성전자"
                style={styles.input}
              />
            </div>
          )}

          {/* 내용 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#6B7684', display: 'block', marginBottom: '8px' }}>내용</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="내용을 작성하세요..."
              style={styles.textarea}
            />
          </div>
        </div>

        <div style={styles.footer}>
          {note && (
            <button style={styles.button('danger')} onClick={() => { onDelete(note.id); onClose() }}>삭제</button>
          )}
          <div style={{ flex: 1 }} />
          <button style={styles.button('secondary')} onClick={onClose}>취소</button>
          <button style={styles.button('primary')} onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  )
}
