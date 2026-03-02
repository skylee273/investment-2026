export const SECTORS = [
  { id: 'IT', name: 'IT/빅테크', color: '#3182F6' },
  { id: '반도체', name: '반도체', color: '#8B5CF6' },
  { id: '자동차', name: '자동차/EV', color: '#F59E0B' },
  { id: '금융', name: '금융', color: '#06B6D4' },
  { id: '헬스케어', name: '헬스케어', color: '#F45452' },
  { id: '소비재', name: '소비재', color: '#EC4899' },
  { id: '에너지', name: '에너지', color: '#84CC16' },
  { id: '유틸리티', name: '유틸리티', color: '#FF6600' },
  { id: '소재', name: '소재', color: '#C5A900' },
  { id: '산업재', name: '산업재', color: '#00629B' },
  { id: 'ETF', name: 'ETF', color: '#1A5276' },
  { id: 'other', name: '기타', color: '#6B7684' },
]

export const CONNECTION_TYPES = [
  // 경쟁 관계
  { id: 'sector', name: '동종업계', color: '#3182F6', description: '같은 업종/섹터에서 경쟁' },
  { id: 'direct_competitor', name: '직접 경쟁', color: '#1E40AF', description: '동일 시장에서 직접 경쟁' },

  // 공급망 관계
  { id: 'supply_chain', name: '공급망', color: '#00C471', description: '납품/고객 관계' },
  { id: 'supplier', name: '공급업체', color: '#059669', description: '부품/소재/서비스 공급' },
  { id: 'customer', name: '고객사', color: '#10B981', description: '제품/서비스 구매' },
  { id: 'distributor', name: '유통', color: '#34D399', description: '유통/판매 채널' },

  // 투자/지분 관계
  { id: 'investment', name: '투자', color: '#8B5CF6', description: '투자/지분 관계' },
  { id: 'subsidiary', name: '자회사', color: '#7C3AED', description: '모회사-자회사 관계' },
  { id: 'joint_venture', name: '합작투자', color: '#A78BFA', description: '조인트벤처/합작사' },
  { id: 'major_shareholder', name: '대주주', color: '#6D28D9', description: '주요 지분 보유' },

  // 협력 관계
  { id: 'partnership', name: '파트너십', color: '#F59E0B', description: '전략적 제휴/협력' },
  { id: 'technology', name: '기술협력', color: '#D97706', description: '기술 라이선스/공동개발' },
  { id: 'platform', name: '플랫폼', color: '#FBBF24', description: '플랫폼/생태계 참여' },

  // 특수 관계
  { id: 'spin_off', name: '스핀오프', color: '#EC4899', description: '분사/독립 기업' },
  { id: 'merger_target', name: 'M&A', color: '#DB2777', description: '인수합병 대상/관련' },
  { id: 'index', name: '지수편입', color: '#06B6D4', description: '동일 지수/ETF 편입' },

  // 사용자 정의
  { id: 'custom', name: '직접 연결', color: '#F45452', description: '사용자 정의 연결' },
]

export const INVESTMENT_GRADES = [
  { id: 'strong_buy', name: '적극 매수', color: '#00C471' },
  { id: 'buy', name: '매수', color: '#3182F6' },
  { id: 'hold', name: '보유', color: '#F59E0B' },
  { id: 'sell', name: '매도', color: '#F45452' },
  { id: 'strong_sell', name: '적극 매도', color: '#DC2626' },
]

export const NEWS_CATEGORIES = [
  { id: 'stock', name: '증권', color: '#3182F6' },
  { id: 'macro', name: '매크로', color: '#8B5CF6' },
  { id: 'realestate', name: '부동산', color: '#00C471' },
  { id: 'economy', name: '경제', color: '#F59E0B' },
  { id: 'global', name: '해외', color: '#EC4899' },
]
