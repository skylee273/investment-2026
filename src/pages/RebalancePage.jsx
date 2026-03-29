import { useState, useEffect } from 'react'

// 카테고리별 색상
const CATEGORY_COLORS = {
  'Big Tech': '#3182F6',
  '빅테크': '#3182F6',
  'S&P500': '#6366F1',
  '금융': '#10B981',
  '에너지': '#F59E0B',
  '반도체': '#EC4899',
  '헬스케어': '#8B5CF6',
  'AI/SW': '#06B6D4',
  '암호화폐': '#F97316',
  '국내대형': '#EF4444',
  '국내중소': '#F97316',
  '국내주식': '#EF4444',
  '채권': '#6B7280',
  'ETF': '#3B82F6',
  '신흥국': '#10B981',
  '금': '#FBBF24',
  '해외주식': '#3182F6',
  '배당주': '#10B981',
  'CMA': '#8B95A1',
  '현금성': '#8B95A1',
  '퇴직연금': '#6366F1',
  '연금': '#6366F1',
  '나스닥': '#7C3AED',
}

// ========== 4인 전문가 패널 의견 생성 ==========
const getExpertOpinions = (category, action, diff) => {
  const isBuy = action.includes('매수')

  // 카테고리별 4인 의견
  const opinions = {
    'Big Tech': {
      buy: {
        buffett: { stance: '⚠️ 신중', opinion: '애플 P/E 33배에 매도했습니다. 지금 빅테크는 여전히 비쌉니다.' },
        ackman: { stance: '✅ 찬성', opinion: '아마존, 메타 추가 매수 중. AI 수혜주는 장기 보유 가치 있습니다.' },
        abel: { stance: '🔄 조건부', opinion: '분할 매수로 접근하세요. 한 번에 몰빵은 위험합니다.' },
        munger: { stance: '🤔 관망', opinion: '좋은 기업이지만 좋은 가격인지 확인하세요.' },
      },
      sell: {
        buffett: { stance: '✅ 찬성', opinion: '저도 애플 대량 매도했습니다. 이익 실현 타이밍입니다.' },
        ackman: { stance: '⚠️ 반대', opinion: '장기 성장주를 팔면 후회합니다. 보유하세요.' },
        abel: { stance: '🔄 일부만', opinion: '전량 매도보다 비중 조절이 현명합니다.' },
        munger: { stance: '🤔 상황별', opinion: '팔아야 할 이유가 명확한지 자문하세요.' },
      },
    },
    'S&P500': {
      buy: {
        buffett: { stance: '⚠️ 대기', opinion: 'S&P CAPE 39는 역사적 고점입니다. 서두르지 마세요.' },
        ackman: { stance: '🔄 조건부', opinion: '분할 매수는 괜찮지만 올인은 금물입니다.' },
        abel: { stance: '✅ 장기적', opinion: '10년 보유 관점이면 지금도 나쁘지 않습니다.' },
        munger: { stance: '🤔 인내', opinion: '더 좋은 가격이 올 수 있습니다. 기다리세요.' },
      },
      sell: {
        buffett: { stance: '✅ 찬성', opinion: '고평가 구간입니다. 현금 확보가 현명합니다.' },
        ackman: { stance: '⚠️ 반대', opinion: '인덱스는 장기 보유가 원칙입니다.' },
        abel: { stance: '🔄 일부만', opinion: '전량 매도는 극단적입니다. 10-20%만 조절하세요.' },
        munger: { stance: '🤔 냉정히', opinion: '공포에 팔지 마세요. 계획대로 행동하세요.' },
      },
    },
    '국내주식': {
      buy: {
        buffett: { stance: '🤔 관망', opinion: '한국 시장은 잘 모릅니다. 아는 것에 투자하세요.' },
        ackman: { stance: '⚠️ 신중', opinion: '신흥국 리스크가 있습니다. 미국 시장이 더 안전합니다.' },
        abel: { stance: '🔄 분산용', opinion: '글로벌 분산 차원에서 소량은 괜찮습니다.' },
        munger: { stance: '✅ 저평가', opinion: '한국 시장 PBR 1 미만은 역사적 저점입니다.' },
      },
      sell: {
        buffett: { stance: '🔄 중립', opinion: '홈 바이어스를 경계하세요. 글로벌 분산이 중요합니다.' },
        ackman: { stance: '✅ 찬성', opinion: '미국 시장에 집중하는 것이 효율적입니다.' },
        abel: { stance: '⚠️ 일부만', opinion: '완전 매도보다 비중 조절을 권합니다.' },
        munger: { stance: '🤔 재고', opinion: '싸게 팔면 후회합니다. 가치를 재평가하세요.' },
      },
    },
    '현금성': {
      buy: {
        buffett: { stance: '✅ 강력 찬성', opinion: '$3,730억 현금 보유 중. 현금은 기회의 총알입니다.' },
        ackman: { stance: '🔄 적정선', opinion: '20-30%면 충분합니다. 너무 많으면 기회비용.' },
        abel: { stance: '✅ 찬성', opinion: '드라이 파우더 전략. 하락장 대비 필수입니다.' },
        munger: { stance: '✅ 찬성', opinion: '현금은 어리석은 행동을 막아줍니다.' },
      },
      sell: {
        buffett: { stance: '⚠️ 신중', opinion: 'CAPE 39에서 현금 줄이기는 위험합니다.' },
        ackman: { stance: '🔄 선별적', opinion: '확신 있는 종목에만 투입하세요.' },
        abel: { stance: '⚠️ 천천히', opinion: '분할로 천천히 투입하세요. 급하지 않습니다.' },
        munger: { stance: '🤔 때를 봐서', opinion: '좋은 기회가 올 때까지 참으세요.' },
      },
    },
    '채권': {
      buy: {
        buffett: { stance: '✅ 찬성', opinion: '단기채 수익률 5%는 매력적입니다.' },
        ackman: { stance: '🔄 중립', opinion: '주식보다 낫지만 장기 수익은 제한적입니다.' },
        abel: { stance: '✅ 방어용', opinion: '포트폴리오 안정성을 위해 필요합니다.' },
        munger: { stance: '✅ 균형', opinion: '주식과 채권의 균형이 중요합니다.' },
      },
      sell: {
        buffett: { stance: '⚠️ 반대', opinion: '불확실한 시장에서 채권은 안전판입니다.' },
        ackman: { stance: '🔄 상황별', opinion: '금리 방향을 고려해 결정하세요.' },
        abel: { stance: '⚠️ 유지', opinion: '방어 자산을 줄이면 리스크가 커집니다.' },
        munger: { stance: '🤔 재고', opinion: '왜 팔려는지 이유를 명확히 하세요.' },
      },
    },
    '암호화폐': {
      buy: {
        buffett: { stance: '❌ 반대', opinion: '"쥐약의 제곱"입니다. 투자하지 않습니다.' },
        ackman: { stance: '⚠️ 극소량', opinion: '포트폴리오 1-2% 이하로만, 잃어도 괜찮은 돈만.' },
        abel: { stance: '❌ 회의적', opinion: '버크셔는 암호화폐에 투자하지 않습니다.' },
        munger: { stance: '❌ 강력 반대', opinion: '성병보다 나쁩니다. 피하세요.' },
      },
      sell: {
        buffett: { stance: '✅ 찬성', opinion: '애초에 보유하지 말았어야 합니다.' },
        ackman: { stance: '🔄 상황별', opinion: '이익이면 일부 실현, 손실이면 보유 고려.' },
        abel: { stance: '✅ 찬성', opinion: '변동성이 너무 큽니다. 줄이세요.' },
        munger: { stance: '✅ 즉시', opinion: '빨리 정리하고 잊어버리세요.' },
      },
    },
    '배당주': {
      buy: {
        buffett: { stance: '✅ 찬성', opinion: '코카콜라 배당으로 40년 복리 수익 중입니다.' },
        ackman: { stance: '🔄 선별적', opinion: '배당성장주가 단순 고배당주보다 좋습니다.' },
        abel: { stance: '✅ 안정적', opinion: '하락장에서 현금흐름은 든든합니다.' },
        munger: { stance: '✅ 좋은 선택', opinion: '복리의 마법을 믿으세요.' },
      },
      sell: {
        buffett: { stance: '⚠️ 반대', opinion: '좋은 배당주는 평생 보유합니다.' },
        ackman: { stance: '🔄 재평가', opinion: '배당 지속 가능성을 확인하세요.' },
        abel: { stance: '⚠️ 신중', opinion: '현금흐름 포기는 신중히 결정하세요.' },
        munger: { stance: '🤔 이유 확인', opinion: '왜 팔려는지 명확한 이유가 있나요?' },
      },
    },
    '에너지': {
      buy: {
        buffett: { stance: '✅ 찬성', opinion: '옥시덴탈 대량 보유 중. 에너지는 필수재입니다.' },
        ackman: { stance: '🔄 중립', opinion: 'ESG 트렌드와 상충되지만 단기 수익은 가능.' },
        abel: { stance: '✅ 인프라', opinion: '에너지 인프라 투자 15조원 계획 중입니다.' },
        munger: { stance: '🔄 사이클', opinion: '에너지는 사이클 산업입니다. 타이밍 중요.' },
      },
      sell: {
        buffett: { stance: '⚠️ 유지', opinion: '저는 계속 보유합니다. 배당이 좋습니다.' },
        ackman: { stance: '🔄 일부', opinion: '비중이 과하면 일부 차익실현.' },
        abel: { stance: '⚠️ 장기 보유', opinion: '에너지 수요는 계속됩니다.' },
        munger: { stance: '🤔 가격 확인', opinion: '유가 사이클 고점인지 확인하세요.' },
      },
    },
    '연금': {
      buy: {
        buffett: { stance: '✅ 무조건', opinion: '세금 절약은 확실한 수익입니다.' },
        ackman: { stance: '✅ 한도까지', opinion: '세제혜택 한도는 반드시 채우세요.' },
        abel: { stance: '✅ 필수', opinion: '장기 복리 + 절세 = 최강 조합.' },
        munger: { stance: '✅ 당연히', opinion: '세금 내고 투자하면 바보입니다.' },
      },
      sell: {
        buffett: { stance: '❌ 반대', opinion: '연금을 빼면 세금 폭탄입니다.' },
        ackman: { stance: '❌ 반대', opinion: '절대 중도 해지하지 마세요.' },
        abel: { stance: '❌ 불가', opinion: '장기 플랜을 유지하세요.' },
        munger: { stance: '❌ 어리석음', opinion: '가장 어리석은 결정입니다.' },
      },
    },
  }

  // 기본값
  const defaultOpinion = {
    buy: {
      buffett: { stance: '🤔 검토', opinion: '충분히 분석한 후 결정하세요.' },
      ackman: { stance: '🔄 분할', opinion: '분할 매수로 리스크를 줄이세요.' },
      abel: { stance: '🔄 신중', opinion: '시장 상황을 고려해 천천히.' },
      munger: { stance: '🤔 확신', opinion: '확신이 없으면 하지 마세요.' },
    },
    sell: {
      buffett: { stance: '🤔 재고', opinion: '팔아야 할 명확한 이유가 있나요?' },
      ackman: { stance: '🔄 일부만', opinion: '전량보다 일부 매도를 권합니다.' },
      abel: { stance: '🔄 점진적', opinion: '급하게 팔지 마세요.' },
      munger: { stance: '🤔 냉정', opinion: '감정적 결정은 피하세요.' },
    },
  }

  const categoryOpinions = opinions[category] || defaultOpinion
  return isBuy ? categoryOpinions.buy : categoryOpinions.sell
}

// ========== 시장 상황별 현금 비중 (공격적 투자자, 연 15% 목표) ==========
const CASH_TARGETS = {
  normal: 5,    // 평시: CAPE < 25
  caution: 10,  // 경계: CAPE 25-35
  defense: 15,  // 방어: CAPE > 35 OR 전쟁
  crisis: 20,   // 위기: CAPE > 35 AND 전쟁
}

// 시장 상황명 (한글)
const MARKET_PHASE_NAMES = {
  normal: '평시',
  caution: '경계',
  defense: '방어',
  crisis: '위기',
}

// ========== 2026년 3월 시장 상황 (실시간 데이터 기반) ==========
const MARKET_CONTEXT = {
  // 기존 핵심 지표
  cape: 39.0,                    // 쉴러 P/E - 역대 2위 (닷컴버블 다음)
  sp500YTD: -11,                 // 2026년 YTD 수익률
  buffettCash: 3730,             // 버핏 현금 보유량 (억 달러)
  buffettAction: 'selling',      // 버핏이 주식 매도 중
  marketPhase: 'correction',     // 조정장
  valuationLevel: 'overvalued',  // 고평가
  fearGreed: 35,                 // 공포 구간

  // === 미국 경제 ===
  fedRate: '3.5-3.75%',          // Fed 기준금리 (동결)
  gdpGrowth: 2.4,                // GDP 성장률 %
  pceInflation: 2.7,             // PCE 인플레이션 (목표 2% 상회)
  unemployment: 4.1,             // 실업률 %

  // === 트럼프 관세 전쟁 ===
  tariffImpact: 1500,            // 가구당 연간 부담 $
  chinaTariff: 38.5,             // 중국 관세율 % (20%→38.5%)
  tariffNote: '1993년 이후 최대', // 역사적 의미

  // === 유가 / 에너지 ===
  wti: 99,                       // WTI 원유 $/배럴
  brent: 112,                    // 브렌트유 $/배럴
  oilChange: '+35%',             // 유가 상승률
  hormuzStatus: 'risk',          // 호르무즈 해협 상태 (봉쇄 위기)

  // === 달러 / 환율 ===
  dxy: 99.65,                    // 달러 인덱스 (2년래 최저)
  usdKrw: 1460,                  // 원달러 환율
  usdKrwRange: '1,425~1,500',    // 환율 변동 범위
  dollarTrend: 'weak',           // 달러 약세

  // === 지정학적 리스크: 이란 전쟁 ===
  iranWar: true,                 // 전쟁 발발 여부
  warStartDate: '2026-02-28',    // 전쟁 시작일
  warParties: '미국-이스라엘 vs 이란', // 전쟁 당사자
  sp500WarImpact: -2,            // 공습 당일 S&P 500 반응 %

  // === 한국 시장 ===
  kospiHigh: 3059.54,            // KOSPI 사상 최고 (2월)
  kospiCurrent: 2500,            // KOSPI 현재 수준
  kospiChange: -18,              // 고점 대비 %
  foreignSell: 9,                // 3월 외국인 순매도 (조원)
}

// 시장 상황을 고려한 냉철한 의견
const getSmartAdvice = (category, action, currentWeight, targetWeight) => {
  const { cape, sp500YTD, marketPhase, valuationLevel } = MARKET_CONTEXT
  const diff = targetWeight - currentWeight
  const isBuy = action.includes('매수')

  // 현금성 자산 특별 처리 - 버핏의 현재 전략 반영
  if (category === '현금성' || category === 'CMA') {
    if (isBuy) {
      return {
        advice: `버핏이 $3,730억 현금을 쌓은 이유가 있습니다. CAPE 39는 닷컴버블 이후 최고치입니다. 지금은 현금이 기회비용이 아니라 "옵션"입니다. 시장이 20-30% 더 빠지면 그때가 진짜 매수 타이밍입니다.`,
        urgency: 'high',
        buffettDoing: '현금 축적 중',
      }
    } else {
      return {
        advice: `현금 비중을 줄이라는 신호지만, 신중하세요. S&P 500이 YTD -11%인 지금도 CAPE 39는 역사적 고점입니다. 버핏은 여전히 "비싸다"고 판단해 매수하지 않고 있습니다. 급하게 투자하지 마세요.`,
        urgency: 'low',
        buffettDoing: '관망 중',
      }
    }
  }

  // 주식 카테고리 처리
  const stockCategories = ['Big Tech', 'S&P500', '나스닥', '반도체', '국내주식']
  if (stockCategories.includes(category)) {
    if (isBuy) {
      if (marketPhase === 'correction' && diff > 5) {
        return {
          advice: `목표 비중까지 ${diff.toFixed(1)}% 부족하지만, 한 번에 매수하지 마세요. 버핏은 애플을 $1,000억 넘게 매도했습니다. 시장은 아직 비쌉니다. 3-6개월에 걸쳐 분할 매수하고, 추가 하락 시 더 공격적으로 매수하세요.`,
          urgency: 'medium',
          buffettDoing: '주식 매도 중',
        }
      }
      return {
        advice: `조정장에서 우량주 비중 확대는 옳은 방향입니다. 단, CAPE 39는 경고 신호입니다. 분할 매수로 리스크를 분산하세요. "공포에 매수"하되, 공포가 극대화될 때까지 현금을 남겨두세요.`,
        urgency: 'medium',
        buffettDoing: '선별적 매수 검토',
      }
    } else {
      return {
        advice: `과도한 주식 비중은 위험합니다. 버핏이 애플, 뱅크오브아메리카를 대량 매도한 이유를 생각하세요. 시장이 더 빠지면 손실이 커집니다. 일부 이익 실현으로 현금을 확보하세요.`,
        urgency: 'high',
        buffettDoing: '대량 매도 완료',
      }
    }
  }

  // 방어적 자산 (채권, 금, 배당주)
  const defensiveCategories = ['채권', '금', '배당주']
  if (defensiveCategories.includes(category)) {
    if (isBuy) {
      return {
        advice: `불확실성이 높은 지금, 방어적 자산 확대는 현명합니다. 채권은 주식 폭락 시 포트폴리오를 보호하고, 금은 위기의 보험입니다. 배당주는 하락장에서 현금흐름을 제공합니다.`,
        urgency: 'medium',
        buffettDoing: '현금+단기채 선호',
      }
    } else {
      return {
        advice: `방어적 자산을 줄이기 전에 재고하세요. S&P 500이 -11%인 지금, 추가 하락 가능성이 있습니다. 방어적 자산은 폭풍우 속의 닻입니다. 시장이 안정될 때까지 유지하세요.`,
        urgency: 'low',
        buffettDoing: '방어적 포지션 유지',
      }
    }
  }

  // 고위험 자산 (암호화폐, 신흥국)
  const riskyCategories = ['암호화폐', '신흥국']
  if (riskyCategories.includes(category)) {
    if (isBuy) {
      return {
        advice: `고위험 자산은 포트폴리오의 3-5%를 넘지 마세요. 버핏은 암호화폐를 "쥐약의 제곱"이라 불렀습니다. 지금처럼 불확실한 시장에서 투기 자산을 늘리는 것은 위험합니다. 잃어도 괜찮은 금액만 투자하세요.`,
        urgency: 'low',
        buffettDoing: '암호화폐 투자 안 함',
      }
    } else {
      return {
        advice: `과도한 고위험 노출을 줄이는 것은 현명합니다. 시장 변동성이 클 때 고위험 자산은 가장 먼저 폭락합니다. 이익이 있다면 일부 실현하고, 안정적 자산으로 재배분하세요.`,
        urgency: 'high',
        buffettDoing: '위험자산 회피',
      }
    }
  }

  // 에너지
  if (category === '에너지') {
    if (isBuy) {
      return {
        advice: `에너지는 인플레이션 헤지와 배당 수익을 제공합니다. 버핏도 옥시덴탈 페트롤리엄을 대량 보유 중입니다. 다만 유가 변동성이 크니 분할 매수하세요.`,
        urgency: 'medium',
        buffettDoing: '에너지주 보유 유지',
      }
    } else {
      return {
        advice: `에너지 섹터 비중이 높다면 일부 차익 실현을 고려하세요. 경기 침체 우려 시 에너지 수요가 감소할 수 있습니다. 분산 투자 관점에서 조정이 필요합니다.`,
        urgency: 'medium',
        buffettDoing: '선별적 보유',
      }
    }
  }

  // 연금/세제혜택
  if (category === '연금' || category === 'IRP') {
    return {
      advice: `세제혜택 계좌는 시장 상황과 무관하게 한도까지 채우세요. 연 최대 900만원 세액공제(연금저축 600만+IRP 300만)는 확정 수익입니다. 시장이 불안할수록 절세가 중요합니다.`,
      urgency: 'high',
      buffettDoing: '세금 최적화 중시',
    }
  }

  // 기본값
  return {
    advice: `현재 CAPE 39는 시장이 고평가되어 있음을 의미합니다. 모든 투자 결정에서 "지금 사지 않으면 손해"라는 FOMO를 경계하세요. 버핏은 항상 말합니다: "다른 사람들이 탐욕스러울 때 두려워하라."`,
    urgency: 'medium',
    buffettDoing: '신중한 관망',
  }
}

// ========== 하우가 패밀리 목표 비중 (카테고리별, 평시 기준) ==========
const HAUGA_TARGET_WEIGHTS = {
  'Big Tech': 25,
  'S&P500': 15,
  '국내주식': 30,
  '에너지': 10,
  '반도체': 5,
  '헬스케어': 3,
  '금융': 2,
  '채권': 5,
  '암호화폐': 3,
  '현금성': 5,  // 평시 5% (시장 상황에 따라 자동 조정)
  '연금': 0, // IRP 예수금은 별도
}

// ========== 가윤 달리오 목표 비중 (카테고리별, 평시 기준) ==========
const GAYOON_TARGET_WEIGHTS = {
  'S&P500': 40,
  '배당주': 8,
  '국내주식': 18,
  '나스닥': 5,
  '신흥국': 4,
  '채권': 4,
  '금': 3,
  'Big Tech': 5,
  '암호화폐': 2,
  '현금성': 5,  // 평시 5% (시장 상황에 따라 자동 조정)
  '연금': 1,
}

// ========== 시장 상황 판단 함수 ==========
const getMarketPhase = () => {
  const { cape, iranWar, fearGreed } = MARKET_CONTEXT

  // 위기 모드: CAPE > 35 AND (전쟁 OR 극심한 공포)
  if (cape > 35 && (iranWar || fearGreed < 25)) {
    return 'crisis'
  }
  // 방어 모드: CAPE > 35 OR 전쟁
  if (cape > 35 || iranWar) {
    return 'defense'
  }
  // 경계 모드: CAPE 25-35
  if (cape >= 25) {
    return 'caution'
  }
  // 평시
  return 'normal'
}

// ========== 시장 상황 반영 목표 비중 (동일 기준 적용) ==========
const getMarketAdjustedTargets = (baseTargets) => {
  const { cape, iranWar, fearGreed } = MARKET_CONTEXT
  const phase = getMarketPhase()
  const targetCash = CASH_TARGETS[phase]
  const phaseName = MARKET_PHASE_NAMES[phase]

  // 방어/위기 모드 사유 수집
  const defenseModeReasons = []
  if (cape > 35) defenseModeReasons.push(`CAPE ${cape} (역사적 고평가)`)
  if (iranWar) defenseModeReasons.push('이란 전쟁 진행 중')
  if (fearGreed < 30) defenseModeReasons.push(`공포지수 ${fearGreed} (공포 구간)`)

  const isDefenseMode = phase === 'defense' || phase === 'crisis'

  if (!isDefenseMode) {
    return {
      adjusted: baseTargets,
      isDefenseMode: false,
      defenseModeReasons: [],
      phase,
      phaseName,
      targetCash: CASH_TARGETS.normal,
    }
  }

  const adjusted = { ...baseTargets }

  // 시장 상황에 따른 현금 비중 (절대값, 두 고객 동일)
  adjusted['현금성'] = targetCash

  // 현금 증가분만큼 주식에서 비례 감소
  const baseCash = baseTargets['현금성'] || 5
  const cashIncrease = adjusted['현금성'] - baseCash

  if (cashIncrease > 0) {
    const stockCats = ['S&P500', 'Big Tech', '나스닥', '국내주식', '신흥국']
    const totalStock = stockCats.reduce((sum, cat) => sum + (adjusted[cat] || 0), 0)

    stockCats.forEach(cat => {
      if (adjusted[cat] && totalStock > 0) {
        const ratio = adjusted[cat] / totalStock
        adjusted[cat] = Math.max(0, Math.round(adjusted[cat] - (cashIncrease * ratio)))
      }
    })
  }

  // 방어 자산 소폭 상향
  adjusted['채권'] = (baseTargets['채권'] || 0) + 2
  adjusted['금'] = (baseTargets['금'] || 0) + 1

  // 고위험 축소 (최대 1%)
  adjusted['암호화폐'] = Math.min(baseTargets['암호화폐'] || 0, 1)

  return {
    adjusted,
    isDefenseMode: true,
    defenseModeReasons,
    phase,
    phaseName,
    targetCash,
  }
}

// ========== 하우가 패밀리 전체 보유 종목 (2026.03.29 기준) ==========
const HAUGA_ALL_HOLDINGS = [
  // 토스증권 해외주식
  { name: '아마존', ticker: 'AMZN', currentKRW: 365295, category: 'Big Tech', account: '토스' },
  { name: '알파벳 C', ticker: 'GOOG', currentKRW: 58467, category: 'Big Tech', account: '토스' },
  { name: '마이크로소프트', ticker: 'MSFT', currentKRW: 41152, category: 'Big Tech', account: '토스' },
  { name: '메타', ticker: 'META', currentKRW: 19672, category: 'Big Tech', account: '토스' },
  { name: '뱅크오브아메리카', ticker: 'BAC', currentKRW: 19012, category: '금융', account: '토스' },
  { name: '알파벳 A', ticker: 'GOOGL', currentKRW: 16903, category: 'Big Tech', account: '토스' },
  { name: 'SPY', ticker: 'SPY', currentKRW: 16890, category: 'S&P500', account: '토스' },
  { name: '인튜이티브 서지컬', ticker: 'ISRG', currentKRW: 7313, category: '헬스케어', account: '토스' },
  { name: '퀄컴', ticker: 'QCOM', currentKRW: 6850, category: '반도체', account: '토스' },
  { name: '브로드컴', ticker: 'AVGO', currentKRW: 2686, category: '반도체', account: '토스' },
  { name: '테슬라', ticker: 'TSLA', currentKRW: 2687, category: 'Big Tech', account: '토스' },
  // 미래에셋 연금저축
  { name: 'KODEX 200', ticker: '069500', currentKRW: 1055925, category: '국내주식', account: '연금' },
  { name: 'KODEX 코스닥150', ticker: '229200', currentKRW: 337110, category: '국내주식', account: '연금' },
  // 미래에셋 ISA
  { name: 'KODEX 코스닥150', ticker: '229200_I', currentKRW: 99150, category: '국내주식', account: 'ISA' },
  { name: 'TIGER 미국채10년선물', ticker: '305080', currentKRW: 202875, category: '채권', account: 'ISA' },
  { name: 'TIGER 미국S&P500', ticker: '360750_I', currentKRW: 195360, category: 'S&P500', account: 'ISA' },
  // 미래에셋 종합 (해외주식)
  { name: '셰브론', ticker: 'CVX', currentKRW: 636068, category: '에너지', account: '종합' },
  { name: '알파벳 C', ticker: 'GOOG_M', currentKRW: 412337, category: 'Big Tech', account: '종합' },
  { name: 'TIGER 미국S&P500', ticker: '360750', currentKRW: 170940, category: 'S&P500', account: '종합' },
  { name: '1Q S&P500미국채혼합', ticker: '484790', currentKRW: 116200, category: 'S&P500', account: '종합' },
  { name: '화이자', ticker: 'PFE', currentKRW: 50000, category: '헬스케어', account: '종합' },
  // 미래에셋 IRP
  { name: 'IRP 예수금', ticker: 'IRP', currentKRW: 250069, category: '연금', account: 'IRP' },
  // 미래에셋 CMA
  { name: 'CMA (가족여행)', ticker: 'CMA', currentKRW: 610106, category: '현금성', account: 'CMA' },
  // 업비트 암호화폐
  { name: '비트코인', ticker: 'BTC', currentKRW: 165490, category: '암호화폐', account: '업비트' },
]

// ========== 가윤 달리오 전체 보유 종목 (2026.03.29 기준) ==========
const GAYOON_ALL_HOLDINGS = [
  // 삼성증권 해외주식
  { name: 'Vanguard S&P500', ticker: 'VOO', currentKRW: 19317195, category: 'S&P500', account: '삼성' },
  { name: 'VOO (소수점)', ticker: 'VOO_P', currentKRW: 647620, category: 'S&P500', account: '삼성' },
  { name: 'Schwab 배당주', ticker: 'SCHD', currentKRW: 4584872, category: '배당주', account: '삼성' },
  { name: '케이뱅크', ticker: 'KBANK', currentKRW: 62700, category: '국내주식', account: '삼성' },
  // 삼성증권 ISA
  { name: 'KODEX 200', ticker: 'KODEX200_ISA', currentKRW: 5117175, category: '국내주식', account: 'ISA' },
  { name: 'TIGER S&P500', ticker: 'TIGER_SP_ISA', currentKRW: 4835160, category: 'S&P500', account: 'ISA' },
  { name: 'TIGER 나스닥100', ticker: 'TIGER_NAS', currentKRW: 2857680, category: '나스닥', account: 'ISA' },
  { name: 'PLUS 신흥국MSCI', ticker: 'PLUS_EM', currentKRW: 2695055, category: '신흥국', account: 'ISA' },
  { name: 'TIGER 미국채10년', ticker: 'TIGER_BD', currentKRW: 2069325, category: '채권', account: 'ISA' },
  { name: 'KODEX 금액티브', ticker: 'KODEX_G', currentKRW: 1806720, category: '금', account: 'ISA' },
  // 한투 해외주식
  { name: '아마존', ticker: 'AMZN', currentKRW: 2702213, category: 'Big Tech', account: '한투' },
  // 미래에셋 연금저축
  { name: 'KODEX 200', ticker: 'KODEX200_P', currentKRW: 4467375, category: '국내주식', account: '연금' },
  { name: 'KODEX 코스닥150', ticker: 'KODEX150_P', currentKRW: 1070820, category: '국내주식', account: '연금' },
  // 미래에셋 CMA
  { name: '발행어음CMA', ticker: 'CMA', currentKRW: 14030691, category: '현금성', account: 'CMA' },
  // 미래에셋 IRP
  { name: 'TDF2025', ticker: 'TDF2025', currentKRW: 265937, category: '연금', account: 'IRP' },
  // 업비트 암호화폐
  { name: '비트코인', ticker: 'BTC', currentKRW: 1091846, category: '암호화폐', account: '업비트' },
]

// ========== 종합 시장 분석 대시보드 컴포넌트 ==========
function MarketAnalysisDashboard({ isMobile, customerName }) {
  const [activeTab, setActiveTab] = useState('economy')

  const tabs = [
    { id: 'economy', icon: '🇺🇸', label: '경제' },
    { id: 'geopolitics', icon: '⚔️', label: '지정학' },
    { id: 'tariff', icon: '📦', label: '관세' },
    { id: 'dollar', icon: '💵', label: '달러' },
    { id: 'korea', icon: '🇰🇷', label: '한국' },
  ]

  const tabContent = {
    economy: {
      title: '미국 경제 현황',
      subtitle: 'Fed는 인플레이션이 완전히 잡히지 않아 금리 인하를 서두르지 않습니다.',
      metrics: [
        { label: 'Fed 기준금리', value: MARKET_CONTEXT.fedRate, status: '동결', color: '#3B82F6' },
        { label: 'GDP 성장률', value: `${MARKET_CONTEXT.gdpGrowth}%`, status: '양호', color: '#10B981' },
        { label: 'PCE 인플레이션', value: `${MARKET_CONTEXT.pceInflation}%`, status: '목표 상회', color: '#F59E0B' },
        { label: '실업률', value: `${MARKET_CONTEXT.unemployment}%`, status: '양호', color: '#10B981' },
      ],
      insight: '경제는 안정적이나 인플레이션 우려로 추가 금리 인하는 기대하기 어렵습니다.',
    },
    geopolitics: {
      title: '지정학적 리스크: 이란 전쟁',
      subtitle: '2026년 2월 28일 미국-이스라엘 연합군 이란 공습 개시',
      metrics: [
        { label: '전쟁 시작', value: '2/28', status: '진행 중', color: '#EF4444' },
        { label: '유가 반응', value: MARKET_CONTEXT.oilChange, status: '급등', color: '#EF4444' },
        { label: '브렌트유', value: `$${MARKET_CONTEXT.brent}`, status: '/배럴', color: '#F59E0B' },
        { label: 'S&P 반응', value: `${MARKET_CONTEXT.sp500WarImpact}%`, status: '공습일', color: '#EF4444' },
      ],
      insight: '호르무즈 해협 봉쇄 위기 - 세계 석유의 20%가 통과하는 전략적 요충지입니다.',
      alert: true,
    },
    tariff: {
      title: '트럼프 관세 전쟁',
      subtitle: '1993년 이후 최대 규모의 세금 인상',
      metrics: [
        { label: '중국 관세율', value: `${MARKET_CONTEXT.chinaTariff}%`, status: '20%→38.5%', color: '#EF4444' },
        { label: '가계 부담', value: `$${MARKET_CONTEXT.tariffImpact}`, status: '연간/가구', color: '#F59E0B' },
        { label: '역사적 규모', value: '최대', status: "'93년 이후", color: '#8B5CF6' },
        { label: '타격층', value: '저소득', status: '가장 큰 영향', color: '#EF4444' },
      ],
      insight: '관세 인상은 인플레이션 압력으로 작용하고, 소비 심리를 위축시킬 수 있습니다.',
    },
    dollar: {
      title: '달러 / 환율 동향',
      subtitle: '달러 약세 → 원자재 가격 상승 압력',
      metrics: [
        { label: '달러 인덱스', value: MARKET_CONTEXT.dxy, status: '2년래 최저', color: '#F59E0B' },
        { label: 'USD/KRW', value: MARKET_CONTEXT.usdKrwRange, status: '변동성↑', color: '#3B82F6' },
        { label: '달러 추세', value: '약세', status: '약세 지속', color: '#F59E0B' },
        { label: '영향', value: '원자재↑', status: '수입물가↑', color: '#EF4444' },
      ],
      insight: '달러 약세는 원자재 가격 상승과 수입 물가 인상 요인입니다.',
    },
    korea: {
      title: '한국 증시 현황',
      subtitle: '외국인 대규모 자금 이탈 진행 중',
      metrics: [
        { label: 'KOSPI 고점', value: MARKET_CONTEXT.kospiHigh.toLocaleString(), status: '2월 사상최고', color: '#10B981' },
        { label: 'KOSPI 현재', value: `~${MARKET_CONTEXT.kospiCurrent}`, status: '조정 중', color: '#F59E0B' },
        { label: '고점 대비', value: `${MARKET_CONTEXT.kospiChange}%`, status: '하락', color: '#EF4444' },
        { label: '외국인 매도', value: `${MARKET_CONTEXT.foreignSell}조`, status: '3월 순매도', color: '#EF4444' },
      ],
      insight: '반도체 수출 둔화 우려와 외국인 자금 이탈이 한국 증시에 부담입니다.',
    },
  }

  const content = tabContent[activeTab]

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '2px solid #E5E8EB',
      marginBottom: '24px',
      overflow: 'hidden',
    }}>
      {/* 헤더 */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #E5E8EB',
        backgroundColor: '#F8FAFC',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '24px' }}>📊</span>
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#191F28' }}>
            2026년 3월 시장 종합 분석
          </span>
        </div>
        <div style={{ fontSize: '13px', color: '#6B7684' }}>
          "{customerName} 고객님, 지금 시장에서 무슨 일이 일어나고 있나요?"
        </div>
      </div>

      {/* 탭 */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #E5E8EB',
        backgroundColor: '#F8FAFC',
        overflowX: 'auto',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: isMobile ? 'none' : 1,
              padding: isMobile ? '12px 16px' : '14px 20px',
              border: 'none',
              backgroundColor: activeTab === tab.id ? 'white' : 'transparent',
              borderBottom: activeTab === tab.id ? '2px solid #3182F6' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '16px' }}>{tab.icon}</span>
            <span style={{
              fontSize: '13px',
              fontWeight: activeTab === tab.id ? '700' : '500',
              color: activeTab === tab.id ? '#3182F6' : '#6B7684',
            }}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      <div style={{ padding: '20px' }}>
        {/* 경고 배너 (지정학 탭) */}
        {content.alert && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#FEF2F2',
            borderRadius: '10px',
            border: '1px solid #FECACA',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <div style={{ fontSize: '13px', color: '#991B1B', fontWeight: '600' }}>
              이란 전쟁 발발 (2026.02.28~) - 호르무즈 해협 봉쇄 위기
            </div>
          </div>
        )}

        {/* 제목 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#191F28', marginBottom: '4px' }}>
            {content.title}
          </div>
          <div style={{ fontSize: '12px', color: '#8B95A1' }}>
            {content.subtitle}
          </div>
        </div>

        {/* 메트릭 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '16px',
        }}>
          {content.metrics.map((metric, idx) => (
            <div key={idx} style={{
              padding: '16px',
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              textAlign: 'center',
              borderTop: `3px solid ${metric.color}`,
            }}>
              <div style={{ fontSize: '11px', color: '#8B95A1', marginBottom: '6px' }}>
                {metric.label}
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#191F28',
                marginBottom: '4px',
              }}>
                {metric.value}
              </div>
              <div style={{
                fontSize: '10px',
                color: metric.color,
                fontWeight: '600',
              }}>
                {metric.status}
              </div>
            </div>
          ))}
        </div>

        {/* 인사이트 */}
        <div style={{
          padding: '14px 16px',
          backgroundColor: '#FFFBEB',
          borderRadius: '10px',
          borderLeft: '3px solid #F59E0B',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ fontSize: '16px' }}>💡</span>
            <div style={{ fontSize: '13px', color: '#92400E', lineHeight: '1.5' }}>
              {content.insight}
            </div>
          </div>
        </div>
      </div>

      {/* 종합 결론 */}
      <div style={{
        padding: '20px',
        backgroundColor: '#0F172A',
        color: 'white',
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '700',
          color: '#F59E0B',
          marginBottom: '12px',
        }}>
          🎯 {customerName} 고객님을 위한 종합 결론
        </div>
        <div style={{
          fontSize: '13px',
          color: '#E2E8F0',
          lineHeight: '1.7',
          marginBottom: '16px',
        }}>
          지금 시장은 <strong style={{ color: '#F87171' }}>6가지 리스크 요인</strong>이 겹쳐 있습니다:
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: '10px',
          marginBottom: '16px',
        }}>
          {[
            { icon: '📊', text: 'CAPE 39', sub: '역사상 2위 고평가' },
            { icon: '⚔️', text: '이란 전쟁', sub: '유가 35% 급등' },
            { icon: '📦', text: '관세 전쟁', sub: '인플레 압력' },
            { icon: '💵', text: '달러 약세', sub: '2년래 최저' },
            { icon: '🏃', text: '외국인 9조 매도', sub: '한국 자금 이탈' },
            { icon: '👴', text: '버핏 $3,730억', sub: '역대 최대 현금' },
          ].map((item, idx) => (
            <div key={idx} style={{
              padding: '10px',
              backgroundColor: '#1E293B',
              borderRadius: '8px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '16px', marginBottom: '4px' }}>{item.icon}</div>
              <div style={{ fontSize: '12px', fontWeight: '600' }}>{item.text}</div>
              <div style={{ fontSize: '10px', color: '#94A3B8' }}>{item.sub}</div>
            </div>
          ))}
        </div>
        <div style={{
          padding: '14px',
          backgroundColor: '#1E293B',
          borderRadius: '10px',
          borderLeft: '3px solid #10B981',
          fontSize: '14px',
          fontWeight: '600',
          color: '#10B981',
        }}>
          👉 결론: 버핏조차 역대 최대 현금을 쌓고 기다리고 있습니다.
          지금은 <span style={{ color: '#F87171' }}>70% 수비</span>,
          <span style={{ color: '#34D399' }}> 30% 선별 공격</span>이 정답입니다.
        </div>
      </div>
    </div>
  )
}

export default function RebalancePage() {
  const [isMobile, setIsMobile] = useState(false)
  const [mainTab, setMainTab] = useState('hauga') // 'hauga' or 'gayoon'
  const [sortBy, setSortBy] = useState('amount') // 'amount', 'weight', 'category'
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 전체 보유 종목
  const allHoldings = mainTab === 'hauga' ? HAUGA_ALL_HOLDINGS : GAYOON_ALL_HOLDINGS
  const baseTargetWeights = mainTab === 'hauga' ? HAUGA_TARGET_WEIGHTS : GAYOON_TARGET_WEIGHTS
  const totalKRW = allHoldings.reduce((sum, h) => sum + h.currentKRW, 0)

  // 시장 상황 반영 목표 비중 (두 고객 동일 기준 적용)
  const { adjusted: targetWeights, isDefenseMode, defenseModeReasons, phase, phaseName, targetCash } = getMarketAdjustedTargets(
    baseTargetWeights
  )

  // 비중 계산된 종목 리스트
  const holdingsWithWeight = allHoldings.map(h => ({
    ...h,
    weight: (h.currentKRW / totalKRW) * 100
  }))

  // 카테고리별 합계
  const categoryTotals = allHoldings.reduce((acc, h) => {
    const cat = h.category || '기타'
    acc[cat] = (acc[cat] || 0) + h.currentKRW
    return acc
  }, {})

  // 카테고리별 종목 그룹핑
  const categoryHoldings = allHoldings.reduce((acc, h) => {
    const cat = h.category || '기타'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(h.name)
    return acc
  }, {})

  // 리밸런싱 의견 계산
  const getRebalanceRecommendations = () => {
    const recommendations = []

    Object.entries(categoryTotals).forEach(([cat, amount]) => {
      const currentWeight = (amount / totalKRW) * 100
      const targetWeight = targetWeights[cat] || 0
      const baseTarget = baseTargetWeights[cat] || 0
      const diff = targetWeight - currentWeight
      const diffKRW = (diff / 100) * totalKRW

      // 평시 목표와 현재 목표 차이 확인 (방어 모드로 조정되었는지)
      const isTargetAdjusted = isDefenseMode && Math.abs(targetWeight - baseTarget) > 0.1
      const targetAdjustmentDirection = targetWeight > baseTarget ? '상향' : '하향'

      let action = '유지'
      let actionColor = '#8B95A1'
      let icon = '⚪'

      if (diff > 2) {
        action = '매수'
        actionColor = '#2E7D32'
        icon = '🟢'
      } else if (diff < -2) {
        action = '매도'
        actionColor = '#C62828'
        icon = '🔴'
      } else if (diff > 0.5) {
        action = '소량 매수'
        actionColor = '#66BB6A'
        icon = '🟡'
      } else if (diff < -0.5) {
        action = '소량 매도'
        actionColor = '#EF5350'
        icon = '🟡'
      }

      // 종목별 상세 의견 계산
      const holdingsInCategory = allHoldings.filter(h => h.category === cat)
      const stockRecommendations = []

      if (diff > 0.5) {
        // 매수 의견: 현재 보유 종목 중 비중이 작은 것 우선 매수
        const sorted = [...holdingsInCategory].sort((a, b) => a.currentKRW - b.currentKRW)
        const perStock = Math.abs(diffKRW) / Math.max(sorted.length, 1)
        sorted.forEach(h => {
          stockRecommendations.push({
            name: h.name,
            ticker: h.ticker,
            account: h.account,
            currentKRW: h.currentKRW,
            adjustKRW: Math.round(perStock),
            action: '매수',
          })
        })
      } else if (diff < -0.5) {
        // 매도 의견: 현재 보유 종목 중 비중이 큰 것 우선 매도
        const sorted = [...holdingsInCategory].sort((a, b) => b.currentKRW - a.currentKRW)
        let remaining = Math.abs(diffKRW)
        sorted.forEach(h => {
          if (remaining <= 0) return
          const sellAmount = Math.min(remaining, h.currentKRW * 0.5) // 최대 50%까지만 매도 권장
          stockRecommendations.push({
            name: h.name,
            ticker: h.ticker,
            account: h.account,
            currentKRW: h.currentKRW,
            adjustKRW: -Math.round(sellAmount),
            action: '매도',
          })
          remaining -= sellAmount
        })
      }

      recommendations.push({
        category: cat,
        currentWeight,
        targetWeight,
        baseTarget,
        isTargetAdjusted,
        targetAdjustmentDirection,
        diff,
        diffKRW,
        action,
        actionColor,
        icon,
        holdings: categoryHoldings[cat] || [],
        stockRecommendations,
      })
    })

    // 목표에 있지만 현재 보유하지 않은 카테고리
    Object.entries(targetWeights).forEach(([cat, target]) => {
      if (!categoryTotals[cat] && target > 0) {
        recommendations.push({
          category: cat,
          currentWeight: 0,
          targetWeight: target,
          diff: target,
          diffKRW: (target / 100) * totalKRW,
          action: '신규 매수',
          actionColor: '#1565C0',
          icon: '🔵',
          holdings: [],
        })
      }
    })

    return recommendations.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
  }

  const recommendations = getRebalanceRecommendations()

  // 정렬
  const sortedHoldings = [...holdingsWithWeight].sort((a, b) => {
    if (sortBy === 'amount') return b.currentKRW - a.currentKRW
    if (sortBy === 'weight') return b.weight - a.weight
    if (sortBy === 'category') return (a.category || '').localeCompare(b.category || '')
    return 0
  })

  // 필터링
  const filteredHoldings = filterCategory === 'all'
    ? sortedHoldings
    : sortedHoldings.filter(h => h.category === filterCategory)

  // 카테고리 목록
  const categories = Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a])

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
    filterRow: {
      display: 'flex',
      gap: '12px',
      marginBottom: '24px',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    select: {
      padding: '10px 14px',
      borderRadius: '10px',
      border: '1px solid #E5E8EB',
      backgroundColor: 'white',
      fontSize: '13px',
      fontWeight: '500',
      color: '#191F28',
      cursor: 'pointer',
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '24px',
    },
    summaryCard: (highlight) => ({
      backgroundColor: highlight ? '#3182F6' : 'white',
      borderRadius: '16px',
      padding: '20px',
      border: highlight ? 'none' : '1px solid #E5E8EB',
    }),
    summaryLabel: (highlight) => ({
      fontSize: '12px',
      color: highlight ? 'rgba(255,255,255,0.8)' : '#8B95A1',
      marginBottom: '8px',
    }),
    summaryValue: (highlight) => ({
      fontSize: isMobile ? '18px' : '22px',
      fontWeight: '700',
      color: highlight ? 'white' : '#191F28',
    }),
    summarySubtext: (highlight) => ({
      fontSize: '11px',
      color: highlight ? 'rgba(255,255,255,0.7)' : '#8B95A1',
      marginTop: '4px',
    }),
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
    tableWrapper: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: (clickable) => ({
      textAlign: 'left',
      padding: '12px 8px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#8B95A1',
      borderBottom: '1px solid #E5E8EB',
      whiteSpace: 'nowrap',
      cursor: clickable ? 'pointer' : 'default',
    }),
    td: {
      padding: '14px 8px',
      fontSize: '13px',
      color: '#191F28',
      borderBottom: '1px solid #F2F4F6',
    },
    accountBadge: {
      display: 'inline-block',
      padding: '3px 8px',
      borderRadius: '4px',
      fontSize: '10px',
      fontWeight: '600',
      backgroundColor: '#F2F4F6',
      color: '#6B7684',
    },
    barWrapper: {
      width: '100%',
      height: '6px',
      backgroundColor: '#F2F4F6',
      borderRadius: '3px',
      overflow: 'hidden',
    },
    barFill: (color, width) => ({
      height: '100%',
      width: `${width}%`,
      backgroundColor: color,
      borderRadius: '3px',
    }),
    colorDot: (color) => ({
      width: '10px',
      height: '10px',
      borderRadius: '3px',
      backgroundColor: color,
      flexShrink: 0,
    }),
    categoryBar: {
      display: 'flex',
      height: '24px',
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '16px',
    },
    categorySegment: (color, width) => ({
      width: `${width}%`,
      backgroundColor: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '10px',
      fontWeight: '600',
    }),
    categoryList: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: '12px',
    },
    categoryItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '12px',
      backgroundColor: '#F7F8FA',
      borderRadius: '10px',
    },
    categoryDot: (color) => ({
      width: '12px',
      height: '12px',
      borderRadius: '4px',
      backgroundColor: color,
      marginTop: '2px',
    }),
    holdingTag: {
      display: 'inline-block',
      padding: '3px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: '500',
      backgroundColor: '#E5E8EB',
      color: '#4E5968',
      marginRight: '4px',
      marginTop: '4px',
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>⚖️ 리밸런싱</h1>
        <p style={styles.subtitle}>전체 보유 종목의 현재 비중을 확인하세요</p>
      </div>

      {/* 메인 탭: 하우가 패밀리 vs 가윤 달리오 */}
      <div style={styles.mainTabs}>
        <div
          style={styles.mainTab(mainTab === 'hauga')}
          onClick={() => setMainTab('hauga')}
        >
          <div style={styles.mainTabEmoji}>☁️</div>
          <div style={styles.mainTabName(mainTab === 'hauga')}>하우가 패밀리</div>
          <div style={styles.mainTabSub}>{allHoldings.length}개 종목</div>
        </div>
        <div
          style={styles.mainTab(mainTab === 'gayoon')}
          onClick={() => setMainTab('gayoon')}
        >
          <div style={styles.mainTabEmoji}>🐰</div>
          <div style={styles.mainTabName(mainTab === 'gayoon')}>가윤 달리오</div>
          <div style={styles.mainTabSub}>{GAYOON_ALL_HOLDINGS.length}개 종목</div>
        </div>
      </div>

      {/* 시장 모드 배지 + 기준 테이블 */}
      {isDefenseMode && (
        <div style={{
          backgroundColor: phase === 'crisis' ? '#FEF2F2' : '#FEF9C3',
          borderRadius: '16px',
          border: `2px solid ${phase === 'crisis' ? '#FECACA' : '#FDE047'}`,
          marginBottom: '20px',
          overflow: 'hidden',
        }}>
          {/* 상단: 현재 모드 표시 */}
          <div style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: `1px solid ${phase === 'crisis' ? '#FECACA' : '#FDE047'}`,
          }}>
            <span style={{ fontSize: '28px' }}>{phase === 'crisis' ? '🚨' : '🛡️'}</span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '700',
                color: phase === 'crisis' ? '#991B1B' : '#92400E',
              }}>
                현재: {phaseName} 모드 | 현금 목표 {targetCash}% (두 고객 동일 기준)
              </div>
              <div style={{ fontSize: '12px', color: phase === 'crisis' ? '#B91C1C' : '#A16207', marginTop: '2px' }}>
                {defenseModeReasons.join(' · ')}
              </div>
            </div>
          </div>

          {/* 기준 테이블 */}
          <div style={{ padding: '16px 20px', backgroundColor: 'white' }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#191F28',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span>📊</span>
              시장 상황 기반 현금 비중 기준 (연 15% 목표, 공격적 투자자)
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
              gap: '8px',
            }}>
              {[
                { id: 'normal', label: '평시', condition: 'CAPE < 25', cash: '5%' },
                { id: 'caution', label: '경계', condition: 'CAPE 25-35', cash: '10%' },
                { id: 'defense', label: '방어', condition: 'CAPE > 35 OR 전쟁', cash: '15%' },
                { id: 'crisis', label: '위기', condition: 'CAPE > 35 + 전쟁', cash: '20%' },
              ].map(item => (
                <div
                  key={item.id}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: phase === item.id ? (phase === 'crisis' ? '#FEE2E2' : '#FEF3C7') : '#F8FAFC',
                    border: phase === item.id ? `2px solid ${phase === 'crisis' ? '#EF4444' : '#F59E0B'}` : '1px solid #E5E8EB',
                    position: 'relative',
                  }}
                >
                  {phase === item.id && (
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '8px',
                      backgroundColor: phase === 'crisis' ? '#EF4444' : '#F59E0B',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: '700',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}>
                      현재
                    </div>
                  )}
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: phase === item.id ? (phase === 'crisis' ? '#991B1B' : '#92400E') : '#4B5563',
                    marginBottom: '4px',
                  }}>
                    {item.label}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#6B7684',
                    marginBottom: '6px',
                  }}>
                    {item.condition}
                  </div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '800',
                    color: phase === item.id ? (phase === 'crisis' ? '#DC2626' : '#D97706') : '#374151',
                  }}>
                    {item.cash}
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: '12px',
              padding: '10px 14px',
              backgroundColor: '#F0FDF4',
              borderRadius: '8px',
              borderLeft: '3px solid #10B981',
              fontSize: '12px',
              color: '#166534',
            }}>
              <strong>현재:</strong> CAPE {MARKET_CONTEXT.cape} + 이란 전쟁 = {phaseName} 모드 → 하늘, 가윤 모두 현금 목표 {targetCash}%
            </div>
          </div>
        </div>
      )}

      {/* 시장 상황 요약 */}
      <div style={{
        backgroundColor: '#1E293B',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        color: 'white',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}>
          <span style={{ fontSize: '18px' }}>📊</span>
          <span style={{ fontSize: '15px', fontWeight: '700' }}>2026년 3월 시장 상황</span>
          <span style={{
            marginLeft: 'auto',
            padding: '4px 10px',
            backgroundColor: '#EF4444',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '600',
          }}>고평가 구간</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: '16px',
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '4px' }}>CAPE (쉴러 P/E)</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#F87171' }}>39.0</div>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>역대 2위 (닷컴버블 다음)</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '4px' }}>S&P 500 YTD</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#F87171' }}>-11%</div>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>조정장 진행 중</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '4px' }}>버핏 현금</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#34D399' }}>$3,730억</div>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>역대 최대 현금 보유</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '4px' }}>버핏 행동</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#FBBF24' }}>매도</div>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>애플, BoA 대량 매도</div>
          </div>
        </div>

        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: 'rgba(251, 191, 36, 0.1)',
          borderRadius: '8px',
          borderLeft: '3px solid #FBBF24',
        }}>
          <div style={{ fontSize: '12px', color: '#FDE68A', lineHeight: '1.5' }}>
            💡 <strong>버핏의 메시지:</strong> "다른 사람들이 탐욕스러울 때 두려워하고, 다른 사람들이 두려워할 때 탐욕스러워라." 지금은 아직 완전한 공포 구간이 아닙니다. 현금을 무기로 남겨두세요.
          </div>
        </div>
      </div>

      {/* 종합 시장 분석 대시보드 */}
      <MarketAnalysisDashboard isMobile={isMobile} customerName={mainTab === 'gayoon' ? '가윤' : '하늘'} />

      {/* 요약 카드 */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard(false)}>
          <div style={styles.summaryLabel(false)}>총 자산</div>
          <div style={styles.summaryValue(false)}>{(totalKRW / 10000).toFixed(0)}만</div>
          <div style={styles.summarySubtext(false)}>₩{totalKRW.toLocaleString()}</div>
        </div>
        <div style={styles.summaryCard(false)}>
          <div style={styles.summaryLabel(false)}>보유 종목</div>
          <div style={styles.summaryValue(false)}>{allHoldings.length}개</div>
          <div style={styles.summarySubtext(false)}>{categories.length}개 카테고리</div>
        </div>
        <div style={styles.summaryCard(true)}>
          <div style={styles.summaryLabel(true)}>조정 필요</div>
          <div style={styles.summaryValue(true)}>
            {recommendations.filter(r => r.action !== '유지').length}건
          </div>
          <div style={styles.summarySubtext(true)}>
            매수 {recommendations.filter(r => r.action.includes('매수')).length} /
            매도 {recommendations.filter(r => r.action.includes('매도')).length}
          </div>
        </div>
        <div style={styles.summaryCard(false)}>
          <div style={styles.summaryLabel(false)}>카테고리</div>
          <div style={styles.summaryValue(false)}>{categories.length}개</div>
          <div style={styles.summarySubtext(false)}>분산투자</div>
        </div>
      </div>

      {/* 카테고리별 비중 */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <span>📊</span>
          <span>카테고리별 비중</span>
        </div>

        <div style={styles.categoryBar}>
          {Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, amount]) => {
              const percent = (amount / totalKRW) * 100
              const color = CATEGORY_COLORS[cat] || '#9CA3AF'
              return (
                <div
                  key={cat}
                  style={styles.categorySegment(color, percent)}
                  title={`${cat}: ${percent.toFixed(1)}%`}
                >
                  {percent >= 8 ? `${percent.toFixed(0)}%` : ''}
                </div>
              )
            })}
        </div>

        <div style={styles.categoryList}>
          {Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, amount]) => {
              const percent = (amount / totalKRW) * 100
              const color = CATEGORY_COLORS[cat] || '#9CA3AF'
              const holdings = categoryHoldings[cat] || []
              return (
                <div key={cat} style={styles.categoryItem}>
                  <div style={styles.categoryDot(color)} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#191F28' }}>{cat}</div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#191F28' }}>
                        {percent.toFixed(1)}%
                      </div>
                    </div>
                    <div style={{ fontSize: '11px', color: '#8B95A1', marginTop: '2px' }}>
                      {(amount / 10000).toFixed(0)}만원
                    </div>
                    <div style={{ marginTop: '6px' }}>
                      {holdings.map((name, idx) => (
                        <span key={idx} style={styles.holdingTag}>{name}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {/* 리밸런싱 의견 */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <span>💡</span>
          <span>리밸런싱 의견</span>
        </div>

        {recommendations
          .filter(r => {
            // 방어 모드에서 조정된 카테고리는 "유지"도 표시 (왜 유지인지 설명 필요)
            if (isDefenseMode && r.isTargetAdjusted) return true
            // 기본: 유지가 아닌 것만 표시
            return r.action !== '유지'
          })
          .map((rec, idx) => {
            const color = CATEGORY_COLORS[rec.category] || '#9CA3AF'
            const isBuy = rec.action.includes('매수')
            const isHold = rec.action === '유지'
            const headerBgColor = isHold ? '#F0F9FF' : (isBuy ? '#E8F5E9' : '#FFEBEE')
            const actionBgColor = isHold ? '#3B82F6' : (isBuy ? '#2E7D32' : '#C62828')
            return (
              <div key={idx} style={{
                marginBottom: '16px',
                border: isHold && isDefenseMode ? '2px solid #3B82F6' : '1px solid #E5E8EB',
                borderRadius: '12px',
                overflow: 'hidden',
              }}>
                {/* 카테고리 헤더 */}
                <div style={{
                  padding: '16px',
                  backgroundColor: headerBgColor,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      ...styles.colorDot(color),
                      width: '14px',
                      height: '14px',
                    }} />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '15px', color: '#191F28' }}>
                        {rec.category}
                        {isDefenseMode && rec.isTargetAdjusted && (
                          <span style={{
                            marginLeft: '8px',
                            padding: '2px 6px',
                            backgroundColor: rec.targetAdjustmentDirection === '상향' ? '#DCFCE7' : '#FEE2E2',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '600',
                            color: rec.targetAdjustmentDirection === '상향' ? '#166534' : '#991B1B',
                          }}>
                            🛡️ {rec.targetAdjustmentDirection}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6B7684', marginTop: '2px' }}>
                        현재 {rec.currentWeight.toFixed(1)}% → 목표 {rec.targetWeight.toFixed(1)}%
                        {rec.isTargetAdjusted && (
                          <span style={{ color: '#8B95A1' }}> (평시 {rec.baseTarget}%)</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      backgroundColor: actionBgColor,
                      color: 'white',
                      fontSize: '13px',
                      fontWeight: '600',
                    }}>
                      {rec.icon} {rec.action} {isHold ? '(목표 범위 내)' : (
                        Math.abs(rec.diffKRW) >= 10000
                          ? `${(Math.abs(rec.diffKRW) / 10000).toFixed(0)}만원`
                          : `${Math.abs(rec.diffKRW).toLocaleString()}원`
                      )}
                    </span>
                  </div>
                </div>

                {/* 왜 이 액션인가요? */}
                {isDefenseMode && rec.isTargetAdjusted && (
                  <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#FFFBEB',
                    borderBottom: '1px solid #FDE68A',
                  }}>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#92400E',
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}>
                      📌 왜 {rec.action}인가요?
                    </div>
                    <div style={{ fontSize: '11px', color: '#78350F', lineHeight: '1.6' }}>
                      {rec.category === '현금성' || rec.category === 'CMA' ? (
                        <>
                          평시 목표는 5%지만, <strong>{phaseName} 모드</strong>에서는 {targetCash}%로 상향됩니다 (두 고객 동일 기준).
                          {rec.action === '유지' ? (
                            <> 현재 {rec.currentWeight.toFixed(1)}%로 목표 범위 내이므로 <strong>유지</strong>가 적절합니다.</>
                          ) : rec.action.includes('매수') ? (
                            <> 현재 {rec.currentWeight.toFixed(1)}%로 목표에 미달하므로 <strong>추가 확보</strong>를 권장합니다.</>
                          ) : (
                            <> 현재 {rec.currentWeight.toFixed(1)}%로 목표보다 많습니다만, {phaseName} 모드에서 현금은 무기입니다.</>
                          )}
                          <br />• {defenseModeReasons.join(' · ')}
                          <br />• 버핏: $3,730억 현금 보유 중
                        </>
                      ) : rec.targetAdjustmentDirection === '하향' ? (
                        <>
                          {phaseName} 모드에서 주식 비중 목표가 평시 {rec.baseTarget}% → {rec.targetWeight}%로 하향 조정됩니다.
                          {rec.action === '유지' ? (
                            <> 현재 {rec.currentWeight.toFixed(1)}%로 조정된 목표 범위 내입니다. <strong>추가 매수 보류</strong>를 권장합니다.</>
                          ) : rec.action.includes('매도') ? (
                            <> 추가 하락 가능성에 대비해 비중을 줄이는 것이 안전합니다.</>
                          ) : (
                            <> 신중한 분할 매수를 권장합니다.</>
                          )}
                        </>
                      ) : (
                        <>
                          방어 자산 목표가 평시 {rec.baseTarget}% → {rec.targetWeight}%로 상향 조정됩니다.
                          {rec.action === '유지' ? (
                            <> 현재 {rec.currentWeight.toFixed(1)}%로 목표 범위 내입니다.</>
                          ) : (
                            <> 불확실성이 높은 시장에서 방어 자산을 확대하세요.</>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* 4인 전문가 패널 의견 */}
                {(() => {
                  const expertOpinions = getExpertOpinions(rec.category, rec.action, rec.diff)
                  const experts = [
                    { key: 'buffett', name: '버핏', icon: '👴', color: '#EF4444' },
                    { key: 'ackman', name: '애크먼', icon: '🦅', color: '#F59E0B' },
                    { key: 'abel', name: '아벨', icon: '🏛️', color: '#10B981' },
                    { key: 'munger', name: '멍거', icon: '🦉', color: '#8B5CF6' },
                  ]
                  return (
                    <div style={{
                      padding: '16px',
                      backgroundColor: '#F8FAFC',
                      borderTop: '1px solid #E2E8F0',
                    }}>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#475569',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}>
                        <span>👔</span> 4인 전문가 의견
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                        gap: '10px',
                      }}>
                        {experts.map(expert => {
                          const opinion = expertOpinions[expert.key]
                          return (
                            <div key={expert.key} style={{
                              padding: '12px',
                              backgroundColor: 'white',
                              borderRadius: '8px',
                              borderLeft: `3px solid ${expert.color}`,
                            }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '6px',
                              }}>
                                <span style={{ fontSize: '16px' }}>{expert.icon}</span>
                                <span style={{ fontWeight: '700', fontSize: '12px', color: '#1E293B' }}>
                                  {expert.name}
                                </span>
                                <span style={{
                                  marginLeft: 'auto',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  color: expert.color,
                                }}>
                                  {opinion.stance}
                                </span>
                              </div>
                              <div style={{
                                fontSize: '11px',
                                color: '#64748B',
                                lineHeight: '1.5',
                              }}>
                                "{opinion.opinion}"
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })()}

                {/* 종목별 상세 */}
                {rec.stockRecommendations && rec.stockRecommendations.length > 0 && (
                  <div style={{ padding: '12px 16px' }}>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#8B95A1',
                      marginBottom: '10px',
                      textTransform: 'uppercase',
                    }}>
                      종목별 상세
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                      gap: '8px',
                    }}>
                      {rec.stockRecommendations.map((stock, sIdx) => (
                        <div key={sIdx} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 12px',
                          backgroundColor: '#F7F8FA',
                          borderRadius: '8px',
                        }}>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '13px', color: '#191F28' }}>
                              {stock.name}
                            </div>
                            <div style={{ fontSize: '11px', color: '#8B95A1', marginTop: '2px' }}>
                              {stock.account} · 현재 {stock.currentKRW >= 10000
                                ? `${(stock.currentKRW / 10000).toFixed(0)}만`
                                : `${stock.currentKRW.toLocaleString()}원`
                              }
                            </div>
                          </div>
                          <div style={{
                            fontWeight: '700',
                            fontSize: '13px',
                            color: stock.adjustKRW > 0 ? '#2E7D32' : '#C62828',
                          }}>
                            {stock.adjustKRW > 0 ? '+' : ''}
                            {Math.abs(stock.adjustKRW) >= 10000
                              ? `${(stock.adjustKRW / 10000).toFixed(0)}만`
                              : `${stock.adjustKRW.toLocaleString()}원`
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 신규 매수인 경우 */}
                {rec.action === '신규 매수' && (
                  <div style={{ padding: '12px 16px', color: '#6B7684', fontSize: '12px' }}>
                    💡 이 카테고리에 새로운 종목을 추가하세요
                  </div>
                )}
              </div>
            )
          })}

        {recommendations.filter(r => {
          if (isDefenseMode && r.isTargetAdjusted) return true
          return r.action !== '유지'
        }).length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#8B95A1' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
            <div>포트폴리오가 목표 비중과 잘 맞습니다!</div>
          </div>
        )}
      </div>

      {/* 고객님 맞춤 최종 가이드 */}
      {isDefenseMode && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '3px solid #1E293B',
          marginBottom: '20px',
          overflow: 'hidden',
        }}>
          {/* 헤더 */}
          <div style={{
            padding: '20px',
            backgroundColor: '#0F172A',
            color: 'white',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px',
            }}>
              <span style={{ fontSize: '28px' }}>📋</span>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '700' }}>
                  {mainTab === 'gayoon' ? '가윤' : '하늘'}님 맞춤 최종 가이드
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                  전문가 합의 + 시장 상황 반영
                </div>
              </div>
              <div style={{
                marginLeft: 'auto',
                padding: '8px 16px',
                backgroundColor: phase === 'crisis' ? '#EF4444' : '#F59E0B',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '14px',
              }}>
                {phase === 'crisis' ? '🚨' : '🛡️'} {phaseName} 모드
              </div>
            </div>
          </div>

          {/* 본문 */}
          <div style={{ padding: '20px' }}>
            {/* 현재 상황 요약 */}
            <div style={{
              padding: '16px',
              backgroundColor: '#FEF2F2',
              borderRadius: '12px',
              borderLeft: '4px solid #EF4444',
              marginBottom: '20px',
            }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#991B1B', marginBottom: '8px' }}>
                현재 상황: 위험 구간
              </div>
              <div style={{ fontSize: '12px', color: '#7F1D1D', lineHeight: '1.6' }}>
                {defenseModeReasons.map((reason, idx) => (
                  <span key={idx}>• {reason}<br /></span>
                ))}
                • 버핏 $3,730억 현금 보유 (역대 최대)
              </div>
            </div>

            {/* 핵심 액션 3가지 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: '16px',
              marginBottom: '20px',
            }}>
              {/* 액션 1: 현금 유지 */}
              <div style={{
                padding: '16px',
                backgroundColor: '#ECFDF5',
                borderRadius: '12px',
                border: '1px solid #A7F3D0',
              }}>
                <div style={{
                  fontSize: '20px',
                  marginBottom: '8px',
                }}>✅</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#065F46', marginBottom: '6px' }}>
                  현금 {targetCash}% 유지 (두 고객 동일)
                </div>
                <div style={{ fontSize: '11px', color: '#047857', lineHeight: '1.5' }}>
                  {phaseName} 모드: CAPE {MARKET_CONTEXT.cape} + 전쟁
                  <br />
                  하늘, 가윤 모두 동일 기준 적용
                </div>
              </div>

              {/* 액션 2: 주식 비중 유지 */}
              <div style={{
                padding: '16px',
                backgroundColor: '#FEF3C7',
                borderRadius: '12px',
                border: '1px solid #FDE68A',
              }}>
                <div style={{
                  fontSize: '20px',
                  marginBottom: '8px',
                }}>⏸️</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#92400E', marginBottom: '6px' }}>
                  주식 비중 조절 보류
                </div>
                <div style={{ fontSize: '11px', color: '#B45309', lineHeight: '1.5' }}>
                  추가 하락 가능성 있음
                  <br />
                  현금을 무기로 보유
                </div>
              </div>

              {/* 액션 3: 분할 매수 */}
              <div style={{
                padding: '16px',
                backgroundColor: '#E0F2FE',
                borderRadius: '12px',
                border: '1px solid #BAE6FD',
              }}>
                <div style={{
                  fontSize: '20px',
                  marginBottom: '8px',
                }}>📅</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#075985', marginBottom: '6px' }}>
                  분할 매수만 (월 1-2회)
                </div>
                <div style={{ fontSize: '11px', color: '#0369A1', lineHeight: '1.5' }}>
                  바닥 확인 전 올인 금지
                  <br />
                  확신 종목만 소량 매수
                </div>
              </div>
            </div>

            {/* 최종 결론 */}
            <div style={{
              padding: '16px 20px',
              backgroundColor: '#F0FDF4',
              borderRadius: '12px',
              border: '2px solid #86EFAC',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}>
              <span style={{ fontSize: '32px' }}>💡</span>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#166534', marginBottom: '4px' }}>
                  지금 당장 바꿀 것 없습니다
                </div>
                <div style={{ fontSize: '13px', color: '#15803D' }}>
                  현금을 들고 기다리세요. 전문가 4인이 모두 "신중히, 인내심을 가지세요"라고 말합니다.
                </div>
              </div>
            </div>

            {/* 전문가 합의 배지 */}
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              backgroundColor: '#1E293B',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>전문가 합의:</span>
              {['👴 버핏: 현금 유지', '🦅 애크먼: 선별 매수', '🏛️ 아벨: 기회 대기', '🦉 멍거: 덜 행동'].map((expert, idx) => (
                <span key={idx} style={{
                  padding: '4px 10px',
                  backgroundColor: '#334155',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#E2E8F0',
                }}>
                  {expert}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 전문가 패널 */}
      <div style={{
        backgroundColor: '#0F172A',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        color: 'white',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '24px',
        }}>
          <span style={{ fontSize: '24px' }}>👔</span>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700' }}>
              전문가 패널 의견
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>
              월가 3인방의 냉철한 시장 분석 · 2026년 3월
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: '16px',
        }}>
          {/* 워렌 버핏 */}
          <div style={{
            backgroundColor: '#1E293B',
            borderRadius: '12px',
            padding: '20px',
            borderTop: '3px solid #EF4444',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#374151',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}>👴</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>워렌 버핏</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>버크셔 해서웨이 회장</div>
              </div>
            </div>
            <div style={{
              padding: '8px 12px',
              backgroundColor: '#EF4444',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '12px',
              textAlign: 'center',
            }}>
              🔴 극도로 보수적
            </div>
            <div style={{ fontSize: '12px', color: '#E2E8F0', lineHeight: '1.6', marginBottom: '12px' }}>
              "나는 $3,730억 현금을 들고 있습니다. 애플과 BoA를 대량 매도했습니다. 시장이 비쌉니다. 지금은 사지 않는 것이 최선입니다."
            </div>
            <div style={{
              fontSize: '11px',
              color: '#94A3B8',
              padding: '8px',
              backgroundColor: '#0F172A',
              borderRadius: '6px',
            }}>
              <strong>핵심:</strong> 현금 보유, 인내심, 기회 대기
            </div>
          </div>

          {/* 빌 애크먼 */}
          <div style={{
            backgroundColor: '#1E293B',
            borderRadius: '12px',
            padding: '20px',
            borderTop: '3px solid #F59E0B',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#374151',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}>🦅</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>빌 애크먼</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>퍼싱스퀘어 CEO</div>
              </div>
            </div>
            <div style={{
              padding: '8px 12px',
              backgroundColor: '#F59E0B',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '12px',
              textAlign: 'center',
              color: '#0F172A',
            }}>
              🟡 선별적 공격
            </div>
            <div style={{ fontSize: '12px', color: '#E2E8F0', lineHeight: '1.6', marginBottom: '12px' }}>
              "YTD -13.9%지만 후회 없습니다. AI 빅테크(아마존, 메타, 알파벳)에 집중 베팅 중입니다. 하락은 좋은 기업을 싸게 살 기회입니다."
            </div>
            <div style={{
              fontSize: '11px',
              color: '#94A3B8',
              padding: '8px',
              backgroundColor: '#0F172A',
              borderRadius: '6px',
            }}>
              <strong>핵심:</strong> 확신 있으면 하락 시 추가 매수
            </div>
          </div>

          {/* 그렉 아벨 */}
          <div style={{
            backgroundColor: '#1E293B',
            borderRadius: '12px',
            padding: '20px',
            borderTop: '3px solid #10B981',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#374151',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}>🏛️</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>그렉 아벨</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>버크셔 해서웨이 CEO</div>
              </div>
            </div>
            <div style={{
              padding: '8px 12px',
              backgroundColor: '#10B981',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '12px',
              textAlign: 'center',
              color: 'white',
            }}>
              🟢 전략적 대기
            </div>
            <div style={{ fontSize: '12px', color: '#E2E8F0', lineHeight: '1.6', marginBottom: '12px' }}>
              "현금은 '기회비용'이 아니라 '드라이 파우더'입니다. 밸런스 시트는 적절한 순간에 배치될 전략적 자산입니다. 3월 자사주 매입 재개했습니다."
            </div>
            <div style={{
              fontSize: '11px',
              color: '#94A3B8',
              padding: '8px',
              backgroundColor: '#0F172A',
              borderRadius: '6px',
            }}>
              <strong>핵심:</strong> 버핏보다 공격적, 기회 포착 준비
            </div>
          </div>

          {/* 찰리 멍거 */}
          <div style={{
            backgroundColor: '#1E293B',
            borderRadius: '12px',
            padding: '20px',
            borderTop: '3px solid #8B5CF6',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '12px',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#374151',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}>🦉</div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px' }}>찰리 멍거</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>버크셔 부회장 (1924-2023)</div>
              </div>
            </div>
            <div style={{
              padding: '8px 12px',
              backgroundColor: '#8B5CF6',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '12px',
              textAlign: 'center',
              color: 'white',
            }}>
              🟣 현자의 지혜
            </div>
            <div style={{ fontSize: '12px', color: '#E2E8F0', lineHeight: '1.6', marginBottom: '12px' }}>
              "대부분의 투자자 문제는 너무 자주 행동한다는 것입니다. 아무것도 하지 않는 것이 최선일 때가 많습니다. 어리석은 일을 피하는 것이 영리해지려는 것보다 중요합니다."
            </div>
            <div style={{
              fontSize: '11px',
              color: '#94A3B8',
              padding: '8px',
              backgroundColor: '#0F172A',
              borderRadius: '6px',
            }}>
              <strong>핵심:</strong> 덜 행동하기, 어리석음 회피
            </div>
          </div>
        </div>

        {/* 패널 합의 */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#1E293B',
          borderRadius: '12px',
          border: '1px solid #334155',
        }}>
          <div style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#F59E0B',
            marginBottom: '8px',
          }}>
            📋 4인 패널 합의점
          </div>
          <div style={{ fontSize: '12px', color: '#E2E8F0', lineHeight: '1.6' }}>
            • <strong>공통:</strong> 시장은 고평가 상태, 조급함은 금물<br />
            • <strong>버핏:</strong> 현금 유지가 최선 (CAPE 39 = 닷컴버블급)<br />
            • <strong>애크먼:</strong> 확신 있는 AI 우량주는 분할 매수 가능<br />
            • <strong>아벨:</strong> 현금은 무기, 추가 하락 시 공격적 매수 준비<br />
            • <strong>멍거:</strong> 아무것도 안 하는 것이 최선일 때가 있다
          </div>
        </div>
      </div>

      {/* 종합 의견 - 그래서 어떻게 해야 하나요? */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '2px solid #1E293B',
        marginBottom: '20px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '24px',
        }}>
          <span style={{ fontSize: '28px' }}>❓</span>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#191F28' }}>
              그래서 어떻게 해야 하나요?
            </div>
            <div style={{ fontSize: '12px', color: '#8B95A1' }}>
              4인 전문가 패널의 합의를 바탕으로 한 실행 가이드
            </div>
          </div>
        </div>

        {/* 핵심 답변 */}
        <div style={{
          padding: '20px',
          backgroundColor: '#0F172A',
          borderRadius: '12px',
          marginBottom: '20px',
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#F59E0B',
            marginBottom: '12px',
          }}>
            📌 한 줄 답변
          </div>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'white',
            lineHeight: '1.6',
          }}>
            "지금은 <span style={{ color: '#EF4444' }}>70% 수비</span> + <span style={{ color: '#10B981' }}>30% 선별 공격</span>으로 가세요.
            현금을 무기로 남기고, 확신 있는 종목만 분할 매수하세요."
          </div>
        </div>

        {/* 구체적 액션 플랜 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: '16px',
          marginBottom: '20px',
        }}>
          {/* 이번 주 할 일 */}
          <div style={{
            padding: '16px',
            backgroundColor: '#ECFDF5',
            borderRadius: '12px',
            border: '1px solid #A7F3D0',
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#065F46',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              ✅ 이번 주 할 일
            </div>
            <div style={{ fontSize: '13px', color: '#047857', lineHeight: '1.8' }}>
              <div style={{ marginBottom: '6px' }}>1. 현금 비중 확인 (목표: 20-30%)</div>
              <div style={{ marginBottom: '6px' }}>2. 연금저축/IRP 한도 채우기</div>
              <div style={{ marginBottom: '6px' }}>3. 고위험 자산 5% 이하로 조절</div>
              <div>4. 분할 매수 일정 세우기 (월 1-2회)</div>
            </div>
          </div>

          {/* 이번 주 하지 말 일 */}
          <div style={{
            padding: '16px',
            backgroundColor: '#FEF2F2',
            borderRadius: '12px',
            border: '1px solid #FECACA',
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#991B1B',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              ❌ 이번 주 하지 말 일
            </div>
            <div style={{ fontSize: '13px', color: '#B91C1C', lineHeight: '1.8' }}>
              <div style={{ marginBottom: '6px' }}>1. 현금 전액 주식 투자</div>
              <div style={{ marginBottom: '6px' }}>2. "바닥이다" 확신하고 몰빵</div>
              <div style={{ marginBottom: '6px' }}>3. 레버리지/신용 사용</div>
              <div>4. 패닉에 손절</div>
            </div>
          </div>
        </div>

        {/* 시나리오별 대응 */}
        <div style={{
          padding: '16px',
          backgroundColor: '#F8FAFC',
          borderRadius: '12px',
          marginBottom: '20px',
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#334155',
            marginBottom: '12px',
          }}>
            🎯 시나리오별 대응 전략
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '12px',
          }}>
            <div style={{
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '8px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>S&P 500 횡보 시</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#334155' }}>현 비중 유지</div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>분할 매수 계속</div>
            </div>
            <div style={{
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '8px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>S&P -10~20% 추가 하락</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#F59E0B' }}>매수 비중 ↑</div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>현금 30→20%로</div>
            </div>
            <div style={{
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '8px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>S&P -30% 이상 폭락</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#10B981' }}>공격적 매수</div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>현금 대부분 투입</div>
            </div>
          </div>
        </div>

        {/* 4인 요약 */}
        <div style={{
          padding: '16px',
          backgroundColor: '#1E293B',
          borderRadius: '12px',
          marginBottom: '16px',
        }}>
          <div style={{
            fontSize: '13px',
            fontWeight: '700',
            color: '#F59E0B',
            marginBottom: '10px',
          }}>
            🎓 4인 거장의 핵심 교훈
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: '12px',
            fontSize: '12px',
            color: '#E2E8F0',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>👴</div>
              <div style={{ fontWeight: '600' }}>버핏</div>
              <div style={{ color: '#94A3B8', fontSize: '11px' }}>"현금이 왕이다"</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🦅</div>
              <div style={{ fontWeight: '600' }}>애크먼</div>
              <div style={{ color: '#94A3B8', fontSize: '11px' }}>"확신에 베팅"</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🏛️</div>
              <div style={{ fontWeight: '600' }}>아벨</div>
              <div style={{ color: '#94A3B8', fontSize: '11px' }}>"기회를 기다려"</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🦉</div>
              <div style={{ fontWeight: '600' }}>멍거</div>
              <div style={{ color: '#94A3B8', fontSize: '11px' }}>"덜 행동하라"</div>
            </div>
          </div>
        </div>

        <div style={{
          padding: '12px 16px',
          backgroundColor: '#FFFBEB',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderLeft: '3px solid #F59E0B',
        }}>
          <span style={{ fontSize: '20px' }}>💎</span>
          <div style={{
            fontSize: '13px',
            color: '#92400E',
            fontStyle: 'italic',
          }}>
            "주식시장은 인내심 없는 사람의 돈을 인내심 있는 사람에게 이전하는 장치다."
            <br />— 워렌 버핏
          </div>
        </div>
      </div>

      {/* 전체 종목 테이블 */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <span>📋</span>
          <span>전체 보유 종목</span>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th(true)} onClick={() => setSortBy('category')}>
                  종목 {sortBy === 'category' && '▼'}
                </th>
                <th style={{ ...styles.th(false), textAlign: 'center' }}>계좌</th>
                <th style={{ ...styles.th(true), textAlign: 'right' }} onClick={() => setSortBy('amount')}>
                  금액 {sortBy === 'amount' && '▼'}
                </th>
                <th style={{ ...styles.th(true), textAlign: 'right' }} onClick={() => setSortBy('weight')}>
                  비중 {sortBy === 'weight' && '▼'}
                </th>
                <th style={styles.th(false)}>비중 바</th>
              </tr>
            </thead>
            <tbody>
              {filteredHoldings.map((item, idx) => {
                const color = CATEGORY_COLORS[item.category] || '#9CA3AF'
                const maxWeight = sortedHoldings[0]?.weight || 1

                return (
                  <tr key={idx}>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={styles.colorDot(color)} />
                        <div>
                          <div style={{ fontWeight: '600' }}>{item.name}</div>
                          <div style={{ fontSize: '11px', color: '#8B95A1' }}>{item.category}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <span style={styles.accountBadge}>{item.account}</span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600' }}>
                      {item.currentKRW >= 10000
                        ? `${(item.currentKRW / 10000).toFixed(0)}만`
                        : `${item.currentKRW.toLocaleString()}원`
                      }
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600' }}>
                      {item.weight.toFixed(1)}%
                    </td>
                    <td style={{ ...styles.td, width: '100px' }}>
                      <div style={styles.barWrapper}>
                        <div style={styles.barFill(color, (item.weight / maxWeight) * 100)} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
