import { useState, useEffect, useCallback } from 'react'

// localStorage 키
const STORAGE_KEY = 'daily_learn_data'

// 상세한 투자 용어 (초등학생도 이해할 수 있게)
const DETAILED_TERMS = [
  {
    id: 1,
    term: 'PER (주가수익비율)',
    shortName: 'PER',
    category: '밸류에이션',
    emoji: '💰',
    simpleExplanation: '회사가 1년에 버는 돈으로 주식 가격을 몇 년 만에 갚을 수 있는지 보여주는 숫자예요.',
    detailedExplanation: `
      <strong>PER = 주가 ÷ 주당순이익(EPS)</strong>

      쉽게 말하면, "이 회사를 사면 몇 년 만에 본전을 뽑을 수 있을까?"를 알려주는 숫자예요.

      예를 들어 과일가게를 산다고 생각해보세요:
      • 과일가게 가격: 1,000만원
      • 1년에 버는 돈: 100만원
      • PER = 1,000 ÷ 100 = 10

      즉, 10년이면 투자한 돈을 다 벌 수 있어요!
    `,
    realExample: {
      company: '삼성전자',
      price: '70,000원',
      eps: '5,000원',
      per: 14,
      explanation: '삼성전자의 PER이 14라는 건, 삼성전자가 지금처럼 계속 돈을 벌면 14년 후에 투자금을 회수할 수 있다는 뜻이에요.'
    },
    visualData: {
      type: 'comparison',
      items: [
        { label: 'PER 5 이하', color: '#00C471', status: '매우 저평가 (싸다!)' },
        { label: 'PER 10~15', color: '#4ADE80', status: '적정 (괜찮다)' },
        { label: 'PER 20~30', color: '#F59E0B', status: '고평가 (비싸다)' },
        { label: 'PER 50 이상', color: '#EF4444', status: '매우 고평가 (너무 비싸!)' },
      ]
    },
    tip: 'PER이 낮다고 무조건 좋은 건 아니에요! 회사가 힘들어서 이익이 줄어들 것 같으면 PER이 낮아도 위험할 수 있어요.',
    quiz: {
      question: 'A회사 주가 10,000원, 연간 이익 1,000원이면 PER은?',
      answer: '10배 (10,000 ÷ 1,000 = 10)'
    }
  },
  {
    id: 2,
    term: 'PBR (주가순자산비율)',
    shortName: 'PBR',
    category: '밸류에이션',
    emoji: '🏠',
    simpleExplanation: '회사가 가진 재산(건물, 기계, 돈)과 비교해서 주가가 비싼지 싼지 알려주는 숫자예요.',
    detailedExplanation: `
      <strong>PBR = 주가 ÷ 주당순자산(BPS)</strong>

      회사를 집에 비유해볼게요:
      • 집값: 5억원 (주가)
      • 집을 팔면 받을 수 있는 돈: 5억원 (순자산)
      • PBR = 5억 ÷ 5억 = 1

      PBR이 1이면, 회사 값과 실제 재산이 같다는 뜻이에요!
      PBR이 0.5면? 회사 재산의 절반 가격에 살 수 있다는 뜻! 🎉
    `,
    realExample: {
      company: 'KB금융',
      price: '50,000원',
      bps: '80,000원',
      pbr: 0.625,
      explanation: 'KB금융의 PBR이 0.625라는 건, 실제 재산 가치보다 37.5% 싸게 살 수 있다는 뜻이에요. 은행주는 보통 PBR이 낮아요.'
    },
    visualData: {
      type: 'gauge',
      value: 1,
      ranges: [
        { min: 0, max: 0.5, label: '청산가치 이하 (매우 싸다)', color: '#00C471' },
        { min: 0.5, max: 1, label: '저평가 (싸다)', color: '#4ADE80' },
        { min: 1, max: 3, label: '적정~고평가', color: '#F59E0B' },
        { min: 3, max: 10, label: '고평가 (비싸다)', color: '#EF4444' },
      ]
    },
    tip: 'PBR이 1보다 낮으면 "회사를 청산(다 팔아버리면)하면 이득"이라는 뜻인데, 현실에서는 그렇게 쉽지 않아요.',
    quiz: {
      question: 'B회사의 순자산이 100억원이고 시가총액이 50억원이면 PBR은?',
      answer: '0.5배 (50 ÷ 100 = 0.5, 절반 가격에 살 수 있다!)'
    }
  },
  {
    id: 3,
    term: 'ROE (자기자본이익률)',
    shortName: 'ROE',
    category: '수익성',
    emoji: '📈',
    simpleExplanation: '주주가 맡긴 돈으로 회사가 얼마나 잘 벌었는지 보여주는 성적표예요.',
    detailedExplanation: `
      <strong>ROE = 순이익 ÷ 자기자본 × 100%</strong>

      은행에 저금하면 이자를 주죠? ROE는 "회사가 주주 돈으로 얼마나 이자를 벌어줬나?"예요.

      예를 들어:
      • 친구에게 100만원 빌려줌
      • 친구가 1년 후 15만원 이익을 줌
      • ROE = 15 ÷ 100 × 100% = 15%

      은행 이자가 3%인데 회사가 15% 벌어주면? 5배나 좋은 거예요! 🚀
    `,
    realExample: {
      company: '애플',
      equity: '1,000억 달러',
      profit: '1,000억 달러',
      roe: 100,
      explanation: '애플의 ROE는 약 100%! 주주 돈 1달러로 1달러를 벌어준다는 뜻이에요. 엄청 잘 버는 회사예요.'
    },
    visualData: {
      type: 'thermometer',
      value: 15,
      ranges: [
        { min: 0, max: 5, label: '나쁨', color: '#EF4444' },
        { min: 5, max: 10, label: '보통', color: '#F59E0B' },
        { min: 10, max: 15, label: '좋음', color: '#4ADE80' },
        { min: 15, max: 100, label: '매우 좋음', color: '#00C471' },
      ]
    },
    tip: '워렌 버핏은 ROE가 15% 이상인 회사를 좋아해요. 꾸준히 높은 ROE를 유지하는 회사가 좋은 회사예요!',
    quiz: {
      question: '자기자본 50억, 순이익 10억이면 ROE는?',
      answer: '20% (10 ÷ 50 × 100 = 20%, 아주 좋은 회사!)'
    }
  },
  {
    id: 4,
    term: 'VIX (변동성 지수)',
    shortName: 'VIX',
    category: '시장심리',
    emoji: '😱',
    simpleExplanation: '주식 시장이 얼마나 무서워하고 있는지 보여주는 "공포 온도계"예요.',
    detailedExplanation: `
      <strong>VIX = 시장의 공포 지수</strong>

      놀이공원의 롤러코스터를 상상해보세요:
      • VIX 낮음 (10~15): 조용한 회전목마 🎠
      • VIX 보통 (15~20): 약간 무서운 바이킹 ⛵
      • VIX 높음 (20~30): 무서운 롤러코스터 🎢
      • VIX 매우 높음 (30+): 최고 무서운 자이로드롭 😱

      VIX가 높으면 사람들이 무서워서 주식을 팔고,
      VIX가 낮으면 사람들이 안심하고 주식을 사요.
    `,
    realExample: {
      event: '2020년 코로나 위기',
      vixPeak: 82.69,
      normalVix: 15,
      explanation: '코로나 때 VIX가 82까지 올랐어요! 평소의 5배 이상 무서웠다는 뜻이에요. 이때 용감하게 산 사람들은 큰 돈을 벌었어요.'
    },
    visualData: {
      type: 'fear-gauge',
      value: 22,
      ranges: [
        { min: 0, max: 12, label: '매우 평온', emoji: '😊', color: '#00C471' },
        { min: 12, max: 20, label: '평온', emoji: '🙂', color: '#4ADE80' },
        { min: 20, max: 30, label: '불안', emoji: '😟', color: '#F59E0B' },
        { min: 30, max: 50, label: '공포', emoji: '😰', color: '#F97316' },
        { min: 50, max: 100, label: '극단적 공포', emoji: '😱', color: '#EF4444' },
      ]
    },
    tip: '"다른 사람이 공포에 질릴 때 탐욕스러워라" - 워렌 버핏. VIX가 높을 때가 오히려 좋은 매수 기회일 수 있어요!',
    quiz: {
      question: 'VIX가 35면 시장 분위기는?',
      answer: '공포 상태! 사람들이 많이 무서워하고 있어요. 하지만 용감한 투자자에겐 기회일 수도!'
    }
  },
  {
    id: 5,
    term: '배당 (Dividend)',
    shortName: '배당',
    category: '수익',
    emoji: '💵',
    simpleExplanation: '회사가 번 돈의 일부를 주주에게 나눠주는 용돈이에요!',
    detailedExplanation: `
      <strong>배당 = 회사가 주주에게 주는 현금 선물</strong>

      피자 가게를 운영한다고 상상해보세요:
      • 1년에 100만원 벌었어요
      • 50만원은 가게 확장에 쓰고
      • 50만원은 가게 주인(주주)에게 나눠줘요

      이 50만원이 바로 "배당"이에요! 🍕

      주식을 갖고만 있어도 매년 용돈처럼 돈이 들어와요.
    `,
    realExample: {
      company: '삼성전자',
      dividend: '연간 1,444원',
      price: '70,000원',
      yield: '2.06%',
      explanation: '삼성전자 1주를 7만원에 샀다면, 매년 1,444원씩 받아요. 은행 이자보다 좋죠? 그리고 주가도 오를 수 있어요!'
    },
    visualData: {
      type: 'money-flow',
      items: [
        { step: 1, label: '회사가 돈을 번다', icon: '🏢💰' },
        { step: 2, label: '이익의 일부를 배당으로 결정', icon: '📊' },
        { step: 3, label: '주주에게 배당금 지급', icon: '💵➡️👤' },
        { step: 4, label: '내 통장에 입금!', icon: '🏦✨' },
      ]
    },
    tip: '배당을 많이 주는 회사를 "배당주"라고 해요. 매달 또는 매 분기 용돈이 들어오니 정기적인 수입이 필요한 분들에게 좋아요!',
    quiz: {
      question: '주가 10,000원인 주식이 연간 500원 배당하면 배당수익률은?',
      answer: '5% (500 ÷ 10,000 × 100 = 5%, 은행 이자보다 훨씬 높아요!)'
    }
  },
  {
    id: 6,
    term: '시가총액 (Market Cap)',
    shortName: '시총',
    category: '기본',
    emoji: '🏆',
    simpleExplanation: '회사 전체의 가격표예요. "이 회사를 통째로 사려면 얼마가 필요한가?"를 알려줘요.',
    detailedExplanation: `
      <strong>시가총액 = 주가 × 발행주식수</strong>

      레고 블록으로 설명해볼게요:
      • 레고 1개 = 1주
      • 레고 1개 가격 = 주가
      • 전체 레고 개수 = 발행주식수
      • 레고 전체 가격 = 시가총액

      예: 레고 1개 100원 × 10,000개 = 100만원(시총)

      시가총액이 크면 "대기업", 작으면 "중소기업"이에요!
    `,
    realExample: {
      company: '애플',
      marketCap: '약 3조 달러 (4,000조원)',
      comparison: '한국 GDP의 2배!',
      explanation: '애플의 시가총액은 세계 1위! 한국 경제 규모의 2배예요. 세상에서 가장 비싼 회사죠.'
    },
    visualData: {
      type: 'size-comparison',
      items: [
        { label: '대형주', size: '10조원+', emoji: '🐘', color: '#3182F6' },
        { label: '중형주', size: '1~10조원', emoji: '🦁', color: '#00C471' },
        { label: '소형주', size: '1조원 미만', emoji: '🐕', color: '#F59E0B' },
        { label: '코스닥', size: '수백억~수천억', emoji: '🐱', color: '#EF4444' },
      ]
    },
    tip: '시가총액이 큰 회사는 안정적이지만 성장이 느리고, 작은 회사는 위험하지만 빠르게 클 수 있어요!',
    quiz: {
      question: '주가 50,000원, 발행주식 1억주인 회사의 시가총액은?',
      answer: '5조원 (50,000 × 1억 = 5,000,000,000,000원)'
    }
  },
  {
    id: 7,
    term: 'EPS (주당순이익)',
    shortName: 'EPS',
    category: '수익성',
    emoji: '🎂',
    simpleExplanation: '회사가 번 돈을 주식 1개당 얼마씩 나눠가지면 되는지 보여주는 숫자예요.',
    detailedExplanation: `
      <strong>EPS = 순이익 ÷ 발행주식수</strong>

      생일 케이크로 설명해볼게요! 🎂
      • 케이크 크기 = 회사가 번 돈 (순이익)
      • 나눌 사람 수 = 주식 개수
      • 1인당 케이크 = EPS

      예: 케이크 1,000g ÷ 100명 = 1인당 10g

      EPS가 클수록 주주 1명당 몫이 커요!
    `,
    realExample: {
      company: '삼성전자',
      profit: '약 40조원',
      shares: '59.7억주',
      eps: '약 6,700원',
      explanation: '삼성전자의 EPS는 약 6,700원. 삼성전자 1주가 매년 6,700원씩 벌어준다는 뜻이에요!'
    },
    visualData: {
      type: 'pie-split',
      totalProfit: 1000,
      shares: 100,
      epsPerShare: 10,
    },
    tip: 'EPS가 매년 증가하는 회사가 좋아요! 케이크가 점점 커지는 것과 같으니까요.',
    quiz: {
      question: '순이익 100억원, 주식수 1,000만주면 EPS는?',
      answer: '1,000원 (100억 ÷ 1,000만 = 1,000원)'
    }
  },
  {
    id: 8,
    term: '매출액 (Revenue)',
    shortName: '매출',
    category: '기본',
    emoji: '🧾',
    simpleExplanation: '회사가 물건이나 서비스를 팔아서 번 총 금액이에요. 비용을 빼기 전이에요!',
    detailedExplanation: `
      <strong>매출액 = 판매한 것 전부의 금액 합계</strong>

      레모네이드 가게로 설명할게요! 🍋
      • 레모네이드 100잔 × 1,000원 = 10만원
      • 이 10만원이 "매출액"이에요

      하지만 여기서 비용을 빼야 해요:
      • 레몬 사는 비용: 3만원
      • 설탕, 컵 비용: 2만원
      • 남는 돈(이익): 5만원

      매출과 이익은 다른 거예요!
    `,
    realExample: {
      company: '현대자동차',
      revenue: '약 140조원',
      profit: '약 12조원',
      margin: '8.5%',
      explanation: '현대차는 140조원어치를 팔았지만, 차 만드는 비용을 빼면 실제 남는 돈은 12조원이에요.'
    },
    visualData: {
      type: 'funnel',
      items: [
        { label: '매출액', value: 100, color: '#3182F6' },
        { label: '매출원가 차감', value: -60, color: '#EF4444' },
        { label: '판관비 차감', value: -25, color: '#F97316' },
        { label: '영업이익', value: 15, color: '#00C471' },
      ]
    },
    tip: '매출이 커도 비용이 더 크면 적자예요! 매출보다는 이익이 중요해요.',
    quiz: {
      question: '매출 1,000억, 비용 900억이면 이익은?',
      answer: '100억원 (이익률 10%)'
    }
  },
  {
    id: 9,
    term: '손절 (Stop Loss)',
    shortName: '손절',
    category: '투자전략',
    emoji: '✂️',
    simpleExplanation: '주가가 내가 정한 선까지 떨어지면 더 손해보기 전에 파는 거예요.',
    detailedExplanation: `
      <strong>손절 = 손해를 확정하고 빠져나오기</strong>

      물에 빠진 사람 구하기로 비유할게요:
      • 물이 무릎까지: 괜찮아, 조금 젖었네
      • 물이 허리까지: 음... 좀 깊어졌네
      • 물이 목까지: 위험! 나가야 해!
      • 물이 머리 위로: 💀

      손절은 "목까지 왔을 때" 탈출하는 거예요.
      머리 위까지 기다리면 너무 늦어요!
    `,
    realExample: {
      scenario: '-10% 손절 규칙',
      buyPrice: '10,000원',
      stopPrice: '9,000원',
      explanation: '10,000원에 샀으면 9,000원(-10%)에 파는 규칙. 더 떨어져서 5,000원 되는 것보다 1,000원 손해가 나아요!'
    },
    visualData: {
      type: 'loss-scale',
      items: [
        { loss: -5, status: '관찰', color: '#4ADE80', action: '지켜보기' },
        { loss: -10, status: '주의', color: '#F59E0B', action: '손절 고려' },
        { loss: -15, status: '경고', color: '#F97316', action: '손절!' },
        { loss: -20, status: '위험', color: '#EF4444', action: '반드시 손절!' },
        { loss: -50, status: '재앙', color: '#7F1D1D', action: '이미 늦음...' },
      ]
    },
    tip: '"손절 안 하면 본전 온다"는 거짓말이에요! -50% 손실을 회복하려면 +100% 올라야 해요. 손절은 용기있는 행동이에요.',
    quiz: {
      question: '-30% 손실을 회복하려면 몇 % 올라야 할까요?',
      answer: '약 43% 올라야 해요! (70 × 1.43 = 100)'
    }
  },
  {
    id: 10,
    term: '분산투자 (Diversification)',
    shortName: '분산투자',
    category: '투자전략',
    emoji: '🥚',
    simpleExplanation: '계란을 한 바구니에 담지 않는 것처럼, 여러 곳에 나눠서 투자하는 거예요.',
    detailedExplanation: `
      <strong>분산투자 = 위험을 여러 곳에 나누기</strong>

      소풍 도시락으로 설명할게요! 🍱
      • 김밥만 싸면? → 김밥이 상하면 굶어요
      • 김밥 + 샌드위치 + 과일? → 하나 상해도 OK!

      투자도 마찬가지예요:
      • A회사만 투자? → A가 망하면 전부 잃어요
      • A + B + C + D에 투자? → 하나 망해도 괜찮아요

      이게 "계란을 한 바구니에 담지 마라"의 뜻이에요!
    `,
    realExample: {
      bad: '삼성전자에 100% 투자',
      good: '삼성 30% + 애플 30% + 채권 20% + 금 20%',
      explanation: '삼성만 갖고 있으면 삼성이 안 좋을 때 내 자산도 같이 떨어져요. 여러 곳에 나누면 서로 보완해줘요!'
    },
    visualData: {
      type: 'basket-comparison',
      items: [
        { label: '위험한 방법', baskets: 1, eggs: ['🥚🥚🥚🥚🥚'], broken: true },
        { label: '안전한 방법', baskets: 5, eggs: ['🥚', '🥚', '🥚', '🥚', '🥚'], broken: false },
      ]
    },
    tip: '하지만 너무 많이 분산하면 관리가 어려워요. 5~15개 정도가 적당해요!',
    quiz: {
      question: '주식 A가 -20%, B가 +20%면 총 수익률은? (50:50 투자)',
      answer: '0%! A의 손실을 B가 메꿔줬어요. 이게 분산의 힘!'
    }
  },
]

// 데이터 로드/저장
const loadDailyData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

const saveDailyData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// 오늘 날짜 문자열
const getTodayString = () => new Date().toISOString().split('T')[0]

export default function LearnPage() {
  const [currentTerm, setCurrentTerm] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  // 초기 로드
  useEffect(() => {
    const saved = loadDailyData()
    const today = getTodayString()

    if (saved && saved.date === today) {
      // 오늘 이미 본 용어가 있으면 그것 표시
      const term = DETAILED_TERMS.find(t => t.id === saved.termId)
      if (term) {
        setCurrentTerm(term)
        setLastUpdated(new Date(saved.updatedAt))
        return
      }
    }

    // 없으면 랜덤 선택
    pickRandomTerm()
  }, [])

  // 랜덤 용어 선택
  const pickRandomTerm = () => {
    const randomIndex = Math.floor(Math.random() * DETAILED_TERMS.length)
    const term = DETAILED_TERMS[randomIndex]
    const now = new Date()

    setCurrentTerm(term)
    setLastUpdated(now)
    setShowAnswer(false)

    saveDailyData({
      date: getTodayString(),
      termId: term.id,
      updatedAt: now.toISOString(),
    })
  }

  if (!currentTerm) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>로딩 중...</div>
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#191F28', margin: 0 }}>
            오늘의 투자 용어
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7684', marginTop: '8px' }}>
            매일 하나씩, 초등학생도 이해할 수 있게!
          </p>
          {lastUpdated && (
            <p style={{ fontSize: '12px', color: '#8B95A1', marginTop: '4px' }}>
              마지막 업데이트: {lastUpdated.toLocaleString('ko-KR')}
            </p>
          )}
        </div>
        <button
          onClick={pickRandomTerm}
          style={{
            padding: '12px 20px',
            backgroundColor: '#3182F6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🔄 다른 용어 보기
        </button>
      </div>

      {/* 메인 카드 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        border: '1px solid #E5E8EB',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}>
        {/* 용어 헤더 */}
        <div style={{
          padding: '32px',
          background: 'linear-gradient(135deg, #3182F6 0%, #6366F1 100%)',
          color: 'white',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>{currentTerm.emoji}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{
              padding: '6px 12px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
            }}>
              {currentTerm.category}
            </span>
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '800', margin: 0 }}>{currentTerm.term}</h2>
          <p style={{ fontSize: '18px', marginTop: '12px', opacity: 0.9, lineHeight: '1.6' }}>
            {currentTerm.simpleExplanation}
          </p>
        </div>

        {/* 상세 설명 */}
        <div style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#191F28', marginBottom: '16px' }}>
            📚 자세히 알아보기
          </h3>
          <div
            style={{
              fontSize: '15px',
              color: '#4E5968',
              lineHeight: '1.8',
              whiteSpace: 'pre-line',
              padding: '20px',
              backgroundColor: '#F8F9FA',
              borderRadius: '12px',
            }}
            dangerouslySetInnerHTML={{ __html: currentTerm.detailedExplanation.trim() }}
          />
        </div>

        {/* 시각화 */}
        <div style={{ padding: '0 32px 32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#191F28', marginBottom: '16px' }}>
            📊 한눈에 보기
          </h3>

          {currentTerm.visualData.type === 'comparison' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {currentTerm.visualData.items.map((item, idx) => (
                <div key={idx} style={{
                  padding: '16px',
                  backgroundColor: item.color + '15',
                  borderLeft: `4px solid ${item.color}`,
                  borderRadius: '8px',
                }}>
                  <div style={{ fontWeight: '700', color: item.color, marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '13px', color: '#4E5968' }}>{item.status}</div>
                </div>
              ))}
            </div>
          )}

          {currentTerm.visualData.type === 'fear-gauge' && (
            <div>
              <div style={{
                height: '40px',
                borderRadius: '20px',
                background: 'linear-gradient(to right, #00C471, #4ADE80, #F59E0B, #F97316, #EF4444)',
                position: 'relative',
                marginBottom: '16px',
              }}>
                <div style={{
                  position: 'absolute',
                  left: `${currentTerm.visualData.value}%`,
                  top: '-8px',
                  transform: 'translateX(-50%)',
                  width: '4px',
                  height: '56px',
                  backgroundColor: '#191F28',
                  borderRadius: '2px',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7684' }}>
                {currentTerm.visualData.ranges.map((r, idx) => (
                  <span key={idx}>{r.emoji} {r.label}</span>
                ))}
              </div>
            </div>
          )}

          {currentTerm.visualData.type === 'money-flow' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {currentTerm.visualData.items.map((item, idx) => (
                <div key={idx} style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{item.icon}</div>
                  <div style={{ fontSize: '12px', color: '#4E5968' }}>{item.label}</div>
                  {idx < currentTerm.visualData.items.length - 1 && (
                    <span style={{ position: 'absolute', fontSize: '24px' }}>→</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {currentTerm.visualData.type === 'size-comparison' && (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {currentTerm.visualData.items.map((item, idx) => (
                <div key={idx} style={{
                  textAlign: 'center',
                  padding: '20px',
                  backgroundColor: item.color + '15',
                  borderRadius: '12px',
                  flex: 1,
                }}>
                  <div style={{ fontSize: '40px', marginBottom: '8px' }}>{item.emoji}</div>
                  <div style={{ fontWeight: '700', color: item.color }}>{item.label}</div>
                  <div style={{ fontSize: '12px', color: '#6B7684', marginTop: '4px' }}>{item.size}</div>
                </div>
              ))}
            </div>
          )}

          {currentTerm.visualData.type === 'loss-scale' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentTerm.visualData.items.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: item.color + '15',
                  borderRadius: '8px',
                  gap: '16px',
                }}>
                  <span style={{ width: '60px', fontWeight: '700', color: item.color }}>{item.loss}%</span>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: item.color,
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}>{item.status}</span>
                  <span style={{ fontSize: '13px', color: '#4E5968' }}>{item.action}</span>
                </div>
              ))}
            </div>
          )}

          {currentTerm.visualData.type === 'basket-comparison' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {currentTerm.visualData.items.map((item, idx) => (
                <div key={idx} style={{
                  padding: '24px',
                  backgroundColor: item.broken ? '#FFEBEE' : '#E8F5E9',
                  borderRadius: '16px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                    {item.broken ? '🧺💥' : '🧺🧺🧺🧺🧺'}
                  </div>
                  <div style={{
                    fontWeight: '700',
                    color: item.broken ? '#F04438' : '#00C471',
                    marginBottom: '8px',
                  }}>{item.label}</div>
                  <div style={{ fontSize: '24px' }}>
                    {item.eggs.join(' ')}
                  </div>
                  {item.broken && <div style={{ color: '#F04438', marginTop: '8px' }}>바구니 떨어지면 전부 깨짐!</div>}
                </div>
              ))}
            </div>
          )}

          {(currentTerm.visualData.type === 'gauge' ||
            currentTerm.visualData.type === 'thermometer' ||
            currentTerm.visualData.type === 'pie-split' ||
            currentTerm.visualData.type === 'funnel') && (
            <div style={{
              padding: '24px',
              backgroundColor: '#F8F9FA',
              borderRadius: '12px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '14px', color: '#6B7684' }}>
                {currentTerm.visualData.ranges?.map((r, idx) => (
                  <div key={idx} style={{ display: 'inline-block', margin: '4px 8px' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '12px',
                      height: '12px',
                      backgroundColor: r.color,
                      borderRadius: '3px',
                      marginRight: '6px',
                    }} />
                    {r.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 실제 예시 */}
        <div style={{ padding: '0 32px 32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#191F28', marginBottom: '16px' }}>
            🏢 실제 예시
          </h3>
          <div style={{
            padding: '20px',
            backgroundColor: '#E8F3FF',
            borderRadius: '12px',
            border: '1px solid #3182F6',
          }}>
            {currentTerm.realExample.company && (
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#3182F6', marginBottom: '12px' }}>
                {currentTerm.realExample.company}
              </div>
            )}
            {currentTerm.realExample.event && (
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#3182F6', marginBottom: '12px' }}>
                {currentTerm.realExample.event}
              </div>
            )}
            <div style={{ fontSize: '14px', color: '#4E5968', lineHeight: '1.8' }}>
              {currentTerm.realExample.explanation}
            </div>
          </div>
        </div>

        {/* 팁 */}
        <div style={{ padding: '0 32px 32px' }}>
          <div style={{
            padding: '20px',
            backgroundColor: '#FFF9E6',
            borderRadius: '12px',
            border: '1px solid #FFE066',
          }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#856404', marginBottom: '8px' }}>
              💡 투자 팁
            </div>
            <div style={{ fontSize: '14px', color: '#856404', lineHeight: '1.6' }}>
              {currentTerm.tip}
            </div>
          </div>
        </div>

        {/* 퀴즈 */}
        <div style={{
          padding: '32px',
          backgroundColor: '#F8F9FA',
          borderTop: '1px solid #E5E8EB',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#191F28', marginBottom: '16px' }}>
            🎯 퀴즈 타임!
          </h3>
          <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #E5E8EB',
          }}>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#191F28', marginBottom: '16px' }}>
              Q. {currentTerm.quiz.question}
            </div>
            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3182F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                정답 보기
              </button>
            ) : (
              <div style={{
                padding: '16px',
                backgroundColor: '#E8F5E9',
                borderRadius: '8px',
                color: '#00C471',
                fontWeight: '600',
              }}>
                A. {currentTerm.quiz.answer}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 진행 상황 */}
      <div style={{
        marginTop: '24px',
        padding: '16px 20px',
        backgroundColor: '#F8F9FA',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '13px', color: '#6B7684' }}>
          📖 총 {DETAILED_TERMS.length}개의 용어 중 오늘의 용어
        </span>
        <span style={{ fontSize: '13px', color: '#3182F6', fontWeight: '600' }}>
          #{currentTerm.id} {currentTerm.shortName}
        </span>
      </div>
    </div>
  )
}
