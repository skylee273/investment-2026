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

// ========== 2026년 3월 시장 상황 (실시간 데이터 기반) ==========
const MARKET_CONTEXT = {
  cape: 39.0,                    // 쉴러 P/E - 역대 2위 (닷컴버블 다음)
  sp500YTD: -11,                 // 2026년 YTD 수익률
  buffettCash: 3730,             // 버핏 현금 보유량 (억 달러)
  buffettAction: 'selling',      // 버핏이 주식 매도 중
  marketPhase: 'correction',     // 조정장
  valuationLevel: 'overvalued',  // 고평가
  fearGreed: 35,                 // 공포 구간
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

// ========== 하우가 패밀리 목표 비중 (카테고리별) ==========
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
  '현금성': 2,
  '연금': 0, // IRP 예수금은 별도
}

// ========== 가윤 달리오 목표 비중 (카테고리별) ==========
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
  '현금성': 10,
  '연금': 1,
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
  const targetWeights = mainTab === 'hauga' ? HAUGA_TARGET_WEIGHTS : GAYOON_TARGET_WEIGHTS
  const totalKRW = allHoldings.reduce((sum, h) => sum + h.currentKRW, 0)

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
      const diff = targetWeight - currentWeight
      const diffKRW = (diff / 100) * totalKRW

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
          .filter(r => r.action !== '유지')
          .map((rec, idx) => {
            const color = CATEGORY_COLORS[rec.category] || '#9CA3AF'
            const isBuy = rec.action.includes('매수')
            return (
              <div key={idx} style={{
                marginBottom: '16px',
                border: '1px solid #E5E8EB',
                borderRadius: '12px',
                overflow: 'hidden',
              }}>
                {/* 카테고리 헤더 */}
                <div style={{
                  padding: '16px',
                  backgroundColor: isBuy ? '#E8F5E9' : '#FFEBEE',
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
                      </div>
                      <div style={{ fontSize: '12px', color: '#6B7684', marginTop: '2px' }}>
                        현재 {rec.currentWeight.toFixed(1)}% → 목표 {rec.targetWeight.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      backgroundColor: isBuy ? '#2E7D32' : '#C62828',
                      color: 'white',
                      fontSize: '13px',
                      fontWeight: '600',
                    }}>
                      {rec.icon} {rec.action} {Math.abs(rec.diffKRW) >= 10000
                        ? `${(Math.abs(rec.diffKRW) / 10000).toFixed(0)}만원`
                        : `${Math.abs(rec.diffKRW).toLocaleString()}원`
                      }
                    </span>
                  </div>
                </div>

                {/* 시장 분석 기반 의견 */}
                {(() => {
                  const smartAdvice = getSmartAdvice(rec.category, rec.action, rec.currentWeight, rec.targetWeight)
                  const urgencyColors = {
                    high: { bg: '#FEE2E2', border: '#FECACA', text: '#991B1B', badge: '#DC2626' },
                    medium: { bg: '#FEF3C7', border: '#FDE68A', text: '#92400E', badge: '#D97706' },
                    low: { bg: '#DBEAFE', border: '#BFDBFE', text: '#1E40AF', badge: '#2563EB' },
                  }
                  const colors = urgencyColors[smartAdvice.urgency] || urgencyColors.medium
                  return (
                    <div style={{
                      padding: '14px 16px',
                      backgroundColor: colors.bg,
                      borderTop: `1px solid ${colors.border}`,
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}>
                          <span style={{ fontSize: '14px' }}>🎯</span>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            color: colors.badge,
                            textTransform: 'uppercase',
                          }}>
                            {smartAdvice.urgency === 'high' ? '중요' : smartAdvice.urgency === 'medium' ? '참고' : '낮음'}
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          backgroundColor: 'rgba(0,0,0,0.05)',
                          borderRadius: '4px',
                        }}>
                          <span style={{ fontSize: '11px' }}>👴</span>
                          <span style={{ fontSize: '10px', color: '#6B7280', fontWeight: '500' }}>
                            버핏: {smartAdvice.buffettDoing}
                          </span>
                        </div>
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: colors.text,
                        lineHeight: '1.6',
                      }}>
                        {smartAdvice.advice}
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

        {recommendations.filter(r => r.action !== '유지').length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#8B95A1' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
            <div>포트폴리오가 목표 비중과 잘 맞습니다!</div>
          </div>
        )}
      </div>

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
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
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
            📋 3인 패널 합의점
          </div>
          <div style={{ fontSize: '12px', color: '#E2E8F0', lineHeight: '1.6' }}>
            • <strong>공통:</strong> 시장은 고평가 상태, 조급함은 금물<br />
            • <strong>버핏:</strong> 현금 유지가 최선 (CAPE 39 = 닷컴버블급)<br />
            • <strong>애크먼:</strong> 확신 있는 AI 우량주는 분할 매수 가능<br />
            • <strong>아벨:</strong> 현금은 무기, 추가 하락 시 공격적 매수 준비
          </div>
        </div>
      </div>

      {/* 종합 의견 */}
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
          marginBottom: '20px',
        }}>
          <span style={{ fontSize: '24px' }}>🧠</span>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#191F28' }}>
              종합 의견
            </div>
            <div style={{ fontSize: '12px', color: '#8B95A1' }}>
              2026년 3월 시장 분석 · 냉철한 T의 시선
            </div>
          </div>
        </div>

        <div style={{
          fontSize: '14px',
          color: '#374151',
          lineHeight: '1.8',
          whiteSpace: 'pre-line',
        }}>
{`▎결론: 버핏(수비) + 애크먼(선별 공격) + 아벨(기회 대기) = 최적 전략

세 거장의 공통점은 "지금은 올인할 때가 아니다"입니다. 버핏은 역사상 최대 현금을 쌓았고, 애크먼은 -14% 손실에도 확신 있는 종목만 추가 매수하며, 아벨은 "드라이 파우더" 전략으로 기회를 노리고 있습니다.

▎당신의 전략 (3인 합성):
① 현금 20-30% 유지 - 버핏처럼 총알을 남겨두세요
② 확신 종목만 분할 매수 - 애크먼처럼 AI 빅테크 중 확신 있는 것만
③ 추가 하락 대비 - 아벨처럼 S&P -20~30%면 공격적 매수 준비
④ 감정 배제 - 세 거장 모두 FOMO에 흔들리지 않습니다

▎피해야 할 것:
✗ "바닥인 것 같다"는 희망적 사고
✗ 전문가도 모르는 타이밍 맞추기
✗ 하락장에서 패닉 셀링

지금 당신이 가진 현금은 "기회비용"이 아니라 "옵션"입니다. 시장이 더 빠지면 그 현금이 최고의 무기가 됩니다.`}
        </div>

        <div style={{
          marginTop: '20px',
          padding: '12px 16px',
          backgroundColor: '#F8FAFC',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <span style={{ fontSize: '20px' }}>💎</span>
          <div style={{
            fontSize: '13px',
            color: '#64748B',
            fontStyle: 'italic',
          }}>
            "시장에서 돈을 버는 것은 어렵지 않다. 어려운 것은 빠른 돈을 벌고 싶은 유혹을 이기는 것이다."
            <br />— 찰리 멍거
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
