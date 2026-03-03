import { useState, useEffect, useCallback } from 'react'
import { fetchPortfolioPrices, fetchMultipleStockPrices, fetchExchangeRate, clearPriceCache } from '../services/stockApi'

// 2026년 분기별 포트폴리오
// targetWeight: 목표비중(%), investedKRW: 투자원금(원), gainKRW: 현재 평가손익(원)
// per: 주가수익비율, pbr: 주가순자산비율 (2026.02 기준)
const TARGET_TOTAL = 1000000 // 목표 총 투자금액 100만원

// 2월 실현수익
const REALIZED_GAINS = {
  month: '2026-02',
  total: 2900,
  details: [
    { type: '판매수익', amount: 2828, percent: 2.0 },
    { type: '배당금', amount: 42 },
    { type: '계좌이자', amount: 30 },
  ]
}

// 토스증권 보유 종목 (소수점 주식)
const TOSS_HOLDINGS = [
  { ticker: 'ADA', name: '에이다 (카르다노)', shares: 0, currentKRW: 63529, gainKRW: 3452, gainPercent: 5.75, type: 'crypto' },
  { ticker: 'AMZN', name: '아마존', shares: 1.218978, currentKRW: 357500, gainKRW: -48109, gainPercent: -11.8 },
  { ticker: 'GOOG', name: '알파벳 C', shares: 0.141936, currentKRW: 61640, gainKRW: -2000, gainPercent: -3.1 },
  { ticker: 'MSFT', name: '마이크로소프트', shares: 0.076658, currentKRW: 42545, gainKRW: -5044, gainPercent: -10.5 },
  { ticker: 'CVX', name: '셰브론', shares: 0.104341, currentKRW: 28864, gainKRW: 2229, gainPercent: 8.3 },
  { ticker: 'META', name: '메타', shares: 0.024868, currentKRW: 22607, gainKRW: -1062, gainPercent: -4.4 },
  { ticker: 'AXP', name: '아메리칸 익스프레스', shares: 0.049313, currentKRW: 21474, gainKRW: -4117, gainPercent: -16.0 },
  { ticker: 'BAC', name: '뱅크오브아메리카', shares: 0.269012, currentKRW: 18877, gainKRW: -1824, gainPercent: -8.8 },
  { ticker: 'GOOGL', name: '알파벳 A', shares: 0.040947, currentKRW: 17793, gainKRW: -1933, gainPercent: -9.7 },
  { ticker: 'SPY', name: 'SPY', shares: 0.017702, currentKRW: 17155, gainKRW: -548, gainPercent: -3.0 },
  { ticker: 'MP', name: 'MP 머티리얼스', shares: 0.096771, currentKRW: 7964, gainKRW: -890, gainPercent: -10.0 },
  { ticker: 'ISRG', name: '인튜이티브 서지컬', shares: 0.010737, currentKRW: 7656, gainKRW: -225, gainPercent: -2.8 },
  { ticker: 'QCOM', name: '퀄컴', shares: 0.035814, currentKRW: 7193, gainKRW: -689, gainPercent: -8.7 },
  { ticker: 'PLTR', name: '팔란티어', shares: 0.015311, currentKRW: 3097, gainKRW: 127, gainPercent: 4.2 },
  { ticker: 'TSLA', name: '테슬라', shares: 0.004935, currentKRW: 2765, gainKRW: -203, gainPercent: -6.8 },
  { ticker: 'AVGO', name: '브로드컴', shares: 0.005936, currentKRW: 2640, gainKRW: -332, gainPercent: -11.1 },
  { ticker: 'VRT', name: '버티브 홀딩스', shares: 0.005514, currentKRW: 1933, gainKRW: -60, gainPercent: -3.0 },
  { ticker: 'VST', name: '비스트라 에너지', shares: 0.003951, currentKRW: 955, gainKRW: -30, gainPercent: -3.0 },
]

// 토스증권 ETF/채권 (미래에셋으로 이동됨)
const TOSS_ETFS = []

// 미래에셋증권 계좌별 보유 종목 (2026.03.02 기준)
const MIRAE_ACCOUNTS = [
  {
    id: 'pension',
    name: '연금저축계좌',
    accountNo: '010-8784-7546-2',
    icon: '🧓',
    totalKRW: 827010,
    gainKRW: 45340,
    gainPercent: 6.31,
    holdings: [
      { name: 'KODEX 200', shares: 7, currentKRW: 658840, investedKRW: 617700, gainKRW: 41140, gainPercent: 6.66 },
      { name: 'KODEX 코스닥150', shares: 5, currentKRW: 105500, investedKRW: 101300, gainKRW: 4200, gainPercent: 4.15 },
    ]
  },
  {
    id: 'isa',
    name: 'ISA (중개형)',
    accountNo: '660-9824-0136-0',
    icon: '📊',
    totalKRW: 504089,
    gainKRW: 4780,
    gainPercent: 0.96,
    holdings: [
      { name: 'KODEX 코스닥150', shares: 5, currentKRW: 105500, investedKRW: 101075, gainKRW: 4425, gainPercent: 4.38 },
      { name: 'TIGER 미국채10년선물', shares: 15, currentKRW: 199050, investedKRW: 198375, gainKRW: 675, gainPercent: 0.34 },
      { name: 'TIGER 미국S&P500', shares: 8, currentKRW: 196520, investedKRW: 196840, gainKRW: -320, gainPercent: -0.16 },
    ]
  },
  {
    id: 'cma-emergency',
    name: '비상금 CMA',
    accountNo: '690-6340-5654-1',
    icon: '💰',
    totalKRW: 600179,
    gainKRW: 147,
    gainPercent: 0.02,
    holdings: [
      { name: '발행어음CMA(개인)', shares: 0, currentKRW: 600179, investedKRW: 600032, gainKRW: 147, gainPercent: 0.02 },
    ]
  },
  {
    id: 'stock',
    name: '종합_주식',
    accountNo: '010-8784-7546-0',
    icon: '📈',
    totalKRW: 740637,
    gainKRW: -3838,
    gainPercent: -0.52,
    holdings: [
      { name: '알파벳 C', shares: 1, currentKRW: 443632, investedKRW: 442635, gainKRW: 997, gainPercent: 0.23 },
      { name: 'TIGER 미국S&P500', shares: 7, currentKRW: 171955, investedKRW: 174090, gainKRW: -2135, gainPercent: -1.23 },
      { name: '1Q 미국S&P500미국채혼합', shares: 10, currentKRW: 113550, investedKRW: 116250, gainKRW: -2700, gainPercent: -2.32 },
    ]
  },
  {
    id: 'cma-family',
    name: '하우가 가족여행 CMA',
    accountNo: '010-8784-7546-1',
    icon: '✈️',
    totalKRW: 410119,
    gainKRW: 119,
    gainPercent: 0.03,
    holdings: [
      { name: '발행어음CMA(개인)', shares: 0, currentKRW: 410119, investedKRW: 410000, gainKRW: 119, gainPercent: 0.03 },
    ]
  },
]

// 미래에셋 전체 보유 종목 (기존 코드 호환용)
const MIRAE_HOLDINGS = MIRAE_ACCOUNTS.flatMap(acc => acc.holdings)

// ===== 포트폴리오 구성 (가윤 달리오 스타일) =====

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
  '채권': '#6B7280',
  'ETF': '#3B82F6',
  '신흥국': '#10B981',
  '금': '#FBBF24',
}

// 토스증권 해외주식 포트폴리오 (카테고리별)
const TOSS_PORTFOLIO = [
  { ticker: 'AMZN', name: '아마존', category: 'Big Tech', targetWeight: 52, risk: 4 },
  { ticker: 'ADA', name: '에이다', category: '암호화폐', targetWeight: 9, risk: 5 },
  { ticker: 'GOOG', name: '알파벳 C', category: 'Big Tech', targetWeight: 9, risk: 3 },
  { ticker: 'MSFT', name: '마이크로소프트', category: 'Big Tech', targetWeight: 6, risk: 3 },
  { ticker: 'CVX', name: '셰브론', category: '에너지', targetWeight: 4, risk: 3 },
  { ticker: 'META', name: '메타', category: 'Big Tech', targetWeight: 3, risk: 4 },
  { ticker: 'GOOGL+BAC+AXP', name: '기타 (알파벳A, 금융)', category: '금융', targetWeight: 9, risk: 3 },
  { ticker: 'SPY+기타', name: 'ETF/기타', category: 'ETF', targetWeight: 8, risk: 2 },
]

// 연금저축 포트폴리오
const PENSION_PORTFOLIO = [
  { ticker: '069500', name: 'KODEX 코스피200', category: '국내대형', targetWeight: 80, risk: 2 },
  { ticker: '229200', name: 'KODEX 코스닥150', category: '국내중소', targetWeight: 20, risk: 3 },
]

// ISA 포트폴리오
const ISA_PORTFOLIO = [
  { ticker: '305080', name: 'TIGER 미국채10년선물', category: '채권', targetWeight: 40, risk: 1 },
  { ticker: '360750', name: 'TIGER 미국S&P500', category: 'S&P500', targetWeight: 39, risk: 3 },
  { ticker: '229200', name: 'KODEX 코스닥150', category: '국내중소', targetWeight: 21, risk: 3 },
]

// 종합_주식 포트폴리오
const STOCK_PORTFOLIO = [
  { ticker: 'GOOG', name: '알파벳 C', category: 'Big Tech', targetWeight: 60, risk: 3 },
  { ticker: '360750', name: 'TIGER 미국S&P500', category: 'S&P500', targetWeight: 23, risk: 3 },
  { ticker: '484790', name: '1Q 미국S&P500미국채혼합', category: 'ETF', targetWeight: 15, risk: 2 },
]

// IRP 포트폴리오 (25만원) - 위험자산 70% + 안전자산 30%
const IRP_PORTFOLIO = [
  { ticker: '133690', name: 'TIGER 미국나스닥100', category: 'S&P500', targetWeight: 35, risk: 4 },
  { ticker: '360750', name: 'TIGER 미국S&P500', category: 'S&P500', targetWeight: 21, risk: 3 },
  { ticker: '195980', name: 'TIGER MSCI신흥국', category: '신흥국', targetWeight: 14, risk: 5 },
  { ticker: '472150', name: 'KODEX 골드액티브', category: '금', targetWeight: 30, risk: 1 },
]

// 추가 연금저축 포트폴리오 (900만원 목표)
const PENSION_EXTRA_PORTFOLIO = [
  { ticker: '069500', name: 'KODEX 코스피200', category: '국내대형', targetWeight: 25, risk: 2 },
  { ticker: '360750', name: 'TIGER 미국S&P500', category: 'S&P500', targetWeight: 20, risk: 3 },
  { ticker: '472150', name: 'KODEX 골드액티브', category: '금', targetWeight: 20, risk: 1 },
  { ticker: '133690', name: 'TIGER 미국나스닥100', category: 'S&P500', targetWeight: 15, risk: 4 },
  { ticker: '195980', name: 'TIGER MSCI신흥국', category: '신흥국', targetWeight: 10, risk: 5 },
  { ticker: '229200', name: 'KODEX 코스닥150', category: '국내중소', targetWeight: 10, risk: 3 },
]

// 별 5개 위험도 표시
const RiskStars = ({ risk }) => {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: i <= risk ? '#F59E0B' : '#E5E8EB', fontSize: '10px' }}>★</span>
    )
  }
  return <span style={{ display: 'inline-flex', gap: '1px' }}>{stars}</span>
}

// 포트폴리오 차트 컴포넌트
function PortfolioChart({ icon, title, amount, gainKRW, gainPercent, status, statusColor, items }) {
  // 안정자산 비율 계산 (risk <= 2: 안정, risk >= 3: 위험)
  const safeAssetWeight = items
    .filter(item => item.risk <= 2)
    .reduce((sum, item) => sum + item.targetWeight, 0)
  const riskAssetWeight = 100 - safeAssetWeight

  // 평균 위험도 계산
  const avgRisk = items.reduce((sum, item) => sum + (item.risk * item.targetWeight), 0) / 100

  return (
    <div style={{
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #E5E8EB',
    }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>{icon}</span>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#191F28' }}>{title}</div>
            <div style={{ fontSize: '13px', color: '#8B95A1' }}>{(amount / 10000).toLocaleString()}만원</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          {gainKRW !== undefined && (
            <div style={{
              fontSize: '13px',
              fontWeight: '600',
              color: gainKRW >= 0 ? '#00C853' : '#F04438',
            }}>
              {gainKRW >= 0 ? '+' : ''}{gainKRW.toLocaleString()}원 ({gainPercent >= 0 ? '+' : ''}{gainPercent.toFixed(2)}%)
            </div>
          )}
          {status && (
            <div style={{
              display: 'inline-block',
              padding: '4px 10px',
              backgroundColor: statusColor?.bg || '#F2F4F6',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '600',
              color: statusColor?.text || '#4E5968',
              marginTop: '4px',
            }}>
              {status}
            </div>
          )}
        </div>
      </div>

      {/* 위험/안정 자산 비율 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        padding: '10px 12px',
        backgroundColor: '#F7F8FA',
        borderRadius: '8px',
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <span style={{ fontSize: '12px', color: '#4E5968' }}>위험 {riskAssetWeight}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span style={{ fontSize: '12px', color: '#4E5968' }}>안정 {safeAssetWeight}%</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: '#8B95A1' }}>평균</span>
          <RiskStars risk={Math.round(avgRisk)} />
        </div>
      </div>

      {/* 스택 바 차트 */}
      <div style={{
        display: 'flex',
        height: '28px',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '12px',
      }}>
        {items.map((item, index) => {
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
                fontSize: '10px',
                fontWeight: '600',
                borderRight: index < items.length - 1 ? '1px solid rgba(255,255,255,0.3)' : 'none',
              }}
              title={`${item.name}: ${item.targetWeight}%`}
            >
              {item.targetWeight >= 10 ? `${item.targetWeight}%` : item.targetWeight}
            </div>
          )
        })}
      </div>

      {/* 자산별 상세 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map(item => {
          const color = CATEGORY_COLORS[item.category] || '#9CA3AF'
          const itemAmount = Math.round(amount * item.targetWeight / 100)
          const isSafe = item.risk <= 2
          return (
            <div key={item.ticker} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              backgroundColor: isSafe ? '#F0FDF4' : '#FFFBEB',
              borderRadius: '8px',
              fontSize: '11px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '2px',
                  backgroundColor: color,
                  flexShrink: 0,
                }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#4E5968', fontWeight: '600' }}>
                      {item.name.replace('TIGER ', '').replace('KODEX ', '')}
                    </span>
                    <RiskStars risk={item.risk} />
                  </div>
                  <span style={{ color: '#8B95A1', fontSize: '10px' }}>{item.category}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <span style={{ color: '#6B7684', fontSize: '12px' }}>{item.targetWeight}%</span>
                <span style={{ color: '#191F28', fontWeight: '700', fontSize: '12px', minWidth: '50px', textAlign: 'right' }}>
                  {(itemAmount / 10000).toFixed(1)}만
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// 전체 보유 종목 통합 (토스 + 미래에셋)
const ALL_HOLDINGS = [
  // 토스증권
  ...TOSS_HOLDINGS.map(h => ({
    ...h,
    broker: '토스증권',
    account: '해외주식',
    accountIcon: '🇺🇸',
  })),
  // 미래에셋증권 (계좌별)
  ...MIRAE_ACCOUNTS.flatMap(acc =>
    acc.holdings.map(h => ({
      ...h,
      broker: '미래에셋',
      account: acc.name,
      accountIcon: acc.icon,
      ticker: h.name, // 미래에셋은 name을 ticker로 사용
    }))
  ),
]

// 매도 예정/완료 종목 (비중 미포함)
const PENDING_SALES = []

// 비상금/현금 계좌 (매월 25일 입금)
const CASH_ACCOUNTS = [
  { id: 'parking', name: '파킹계좌', icon: '🅿️', targetKRW: 900000, currentKRW: 0, depositDay: 25, note: '비상금 (언제든 출금 가능)' },
  { id: 'cma-trip', name: 'CMA (가족여행)', icon: '✈️', targetKRW: 0, currentKRW: 400000, depositDay: null, note: '하우가 가족여행' },
  { id: 'cma-emergency', name: 'CMA (비상금)', icon: '💳', targetKRW: 1000000, currentKRW: 600000, depositDay: 25, note: '비상금 (증권사 CMA)' },
  { id: 'hanwha-insurance', name: '한화생명보험저축', icon: '🛡️', targetKRW: 30240000, currentKRW: 12390000, depositDay: null, monthlyDeposit: 210000, depositCount: 59, targetCount: 144, note: '월 21만원 × 59/144회 납입' },
  { id: 'housing', name: '청약저축', icon: '🏠', targetKRW: 3000000, currentKRW: 720000, depositDay: 25, monthlyDeposit: 20000, depositCount: 36, targetCount: 24, note: '1순위 달성 (36회 납입)' },
  { id: 'pension', name: '연금저축 ETF', icon: '🧓', targetKRW: 6000000, currentKRW: 827010, depositDay: 25, monthlyDeposit: 500000, note: '세액공제 연 600만원 한도' },
  { id: 'isa', name: 'ISA', icon: '📈', targetKRW: 20000000, currentKRW: 504089, depositDay: 25, monthlyDeposit: 0, note: '비과세 200만원 한도 (3년 유지 필수)' },
  { id: 'irp', name: 'IRP', icon: '🏦', targetKRW: 3000000, currentKRW: 250000, depositDay: 25, monthlyDeposit: 0, note: '세액공제 300만원 한도' },
  { id: 'pension-extra', name: '추가 연금저축', icon: '🧓', targetKRW: 9000000, currentKRW: 0, depositDay: null, monthlyDeposit: 0, note: '과세이연 (일반주식 오르면 이동 예정)' },
  { id: 'stocks', name: '일반 주식', icon: '📊', targetKRW: 0, currentKRW: 1370000, depositDay: null, note: '일반 증권계좌' },
]

// 공모주 청약 일정
const IPO_SUBSCRIPTIONS = [
  {
    id: 1,
    name: '케이뱅크',
    code: '279570',
    subscriptionStart: '2026-02-24',
    subscriptionEnd: '2026-02-25',
    refundDate: '2026-02-27',
    listingDate: '2026-03-06',
    priceRange: '9,500 ~ 12,000원',
    finalPrice: null,
    competition: null,
    subscriptionAmount: 0,
    allocated: 0,
    status: 'failed',
    broker: '미래에셋증권, KB증권, NH투자증권',
    note: '탈락',
  },
  {
    id: 2,
    name: '액스비스',
    code: '',
    subscriptionStart: '2026-02',
    subscriptionEnd: '2026-02',
    refundDate: null,
    listingDate: null,
    priceRange: '',
    finalPrice: null,
    competition: null,
    subscriptionAmount: 0,
    allocated: 1,
    status: 'allocated',
    broker: '',
    note: '1주 배정',
  },
]

const QUARTERLY_PORTFOLIOS = {
  'Q1': {
    label: '2026년 1분기',
    period: '2026.01 - 2026.03',
    portfolio: [
      { ticker: '069500.KS', displayTicker: 'KODEX200', name: 'KODEX 200', type: 'ETF', currency: 'KRW', targetWeight: 30, investedKRW: 0, gainKRW: 0, per: null, pbr: null },
      { ticker: '360750.KS', displayTicker: 'TIGER S&P', name: 'Tiger S&P 500', type: 'ETF', currency: 'KRW', targetWeight: 10, investedKRW: 0, gainKRW: 0, per: null, pbr: null },
      { ticker: '472160.KS', displayTicker: 'TIGER혼합50', name: 'TIGER 미국S&P500채권혼합50액티브', type: 'ETF', currency: 'KRW', targetWeight: 10, investedKRW: 0, gainKRW: 0, per: null, pbr: null },
      { ticker: 'CVX', displayTicker: 'CVX', name: '셰브론', type: 'Stock', currency: 'USD', targetWeight: 10, investedKRW: 0, gainKRW: 0, per: null, pbr: null },
      { ticker: 'AMZN', displayTicker: 'AMZN', name: '아마존', type: 'Stock', currency: 'USD', targetWeight: 10, investedKRW: 0, gainKRW: 0, per: null, pbr: null },
      { ticker: 'GOOG', displayTicker: 'GOOG', name: '알파벳 C (A+C 합산)', type: 'Stock', currency: 'USD', targetWeight: 12, investedKRW: 0, gainKRW: 0, per: null, pbr: null },
      { ticker: '229200.KS', displayTicker: 'KODEX코스닥150', name: 'KODEX 코스닥150', type: 'ETF', currency: 'KRW', targetWeight: 13, investedKRW: 0, gainKRW: 0, per: null, pbr: null },
      { ticker: 'ADA-USD', displayTicker: 'ADA', name: '에이다 (카르다노)', type: 'Crypto', currency: 'USD', targetWeight: 5, investedKRW: 0, gainKRW: 0, per: null, pbr: null },
    ]
  },
  'Q2': {
    label: '2026년 2분기',
    period: '2026.04 - 2026.06',
    portfolio: [] // 나중에 리밸런싱
  },
  'Q3': {
    label: '2026년 3분기',
    period: '2026.07 - 2026.09',
    portfolio: [] // 나중에 리밸런싱
  },
  'Q4': {
    label: '2026년 4분기',
    period: '2026.10 - 2026.12',
    portfolio: [] // 나중에 리밸런싱
  },
}

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4']

// localStorage 키
const STORAGE_KEY = 'portfolio_tracking_data'

// 추적 데이터 로드 (매수가, 매수 후 고점)
const loadTrackingData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

// 추적 데이터 저장
const saveTrackingData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// 총 투자금액은 포트폴리오에서 동적으로 계산

const SECTOR_COLORS = {
  '069500.KS': '#3182F6',
  '360750.KS': '#6366F1',
  '472160.KS': '#8B5CF6',
  '484790.KS': '#06B6D4',
  '229200.KS': '#E91E63', // KODEX 코스닥150
  'CVX': '#795548',
  'AMZN': '#FF9900',
  'GOOG': '#34A853',
  'BAC': '#012169',
  'MSFT': '#00A4EF',
  'TSM': '#C6011F',
  'ADA-USD': '#0033AD', // 카르다노 (에이다)
}

const styles = {
  container: {
    maxWidth: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#191F28',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: '#8B95A1',
    marginTop: '4px',
  },
  refreshButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#3182F6',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  lastUpdate: {
    fontSize: '12px',
    color: '#8B95A1',
    marginTop: '8px',
  },
  rulesCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '24px',
    border: '1px solid #FFE082',
  },
  rulesTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#F57F17',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  rulesList: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    fontSize: '13px',
    color: '#5D4037',
  },
  ruleItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #E5E8EB',
  },
  summaryLabel: {
    fontSize: '13px',
    color: '#8B95A1',
    marginBottom: '8px',
  },
  summaryValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#191F28',
  },
  mainGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  tableCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    border: '1px solid #E5E8EB',
    overflow: 'hidden',
  },
  tableHeader: {
    padding: '20px',
    borderBottom: '1px solid #E5E8EB',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#191F28',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#8B95A1',
    backgroundColor: '#F7F8FA',
    borderBottom: '1px solid #E5E8EB',
  },
  thRight: {
    padding: '12px 16px',
    textAlign: 'right',
    fontSize: '12px',
    fontWeight: '600',
    color: '#8B95A1',
    backgroundColor: '#F7F8FA',
    borderBottom: '1px solid #E5E8EB',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#191F28',
    borderBottom: '1px solid #F2F4F6',
  },
  tdRight: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#191F28',
    borderBottom: '1px solid #F2F4F6',
    textAlign: 'right',
  },
  tickerCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  tickerDot: (color) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: color,
    flexShrink: 0,
  }),
  tickerInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  tickerSymbol: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#191F28',
  },
  tickerName: {
    fontSize: '11px',
    color: '#8B95A1',
  },
  alertBadge: (type) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    backgroundColor: type === 'danger' ? '#FFEBEE' : type === 'warning' ? '#FFF8E1' : '#E8F5E9',
    color: type === 'danger' ? '#F04438' : type === 'warning' ? '#F57F17' : '#00C853',
  }),
  priceCell: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  priceValue: {
    fontWeight: '600',
  },
  priceChange: (isPositive) => ({
    fontSize: '11px',
    color: isPositive ? '#00C853' : '#F04438',
  }),
  chartCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #E5E8EB',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '40px',
  },
  chartTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#191F28',
    marginBottom: '20px',
  },
  pieContainer: {
    position: 'relative',
    width: '200px',
    height: '200px',
    flexShrink: 0,
  },
  pieCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    backgroundColor: 'white',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieCenterValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#191F28',
  },
  pieCenterLabel: {
    fontSize: '12px',
    color: '#8B95A1',
  },
  legendList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    flex: 1,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '13px',
  },
  legendLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  legendDot: (color) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: color,
  }),
  legendName: {
    color: '#4E5968',
  },
  legendValue: {
    fontWeight: '600',
    color: '#191F28',
  },
  metricBadge: {
    display: 'inline-block',
    padding: '2px 6px',
    backgroundColor: '#F2F4F6',
    borderRadius: '4px',
    fontSize: '11px',
    color: '#4E5968',
  },
  warningRow: (type) => ({
    backgroundColor: type === 'danger' ? '#FFF5F5' : type === 'warning' ? '#FFFBEB' : 'transparent',
  }),
  statusDot: (isLive) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: isLive ? '#00C853' : '#F57F17',
    display: 'inline-block',
    marginRight: '8px',
  }),
}

// CSS for pie chart (목표 비중 기반)
const getPieChartStyle = (portfolio) => {
  let accumulated = 0
  const gradientParts = portfolio.map((item) => {
    const start = accumulated
    accumulated += item.targetWeight
    return `${SECTOR_COLORS[item.ticker] || '#8B95A1'} ${start}% ${accumulated}%`
  })

  return {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: `conic-gradient(${gradientParts.join(', ')})`,
  }
}

export default function PortfolioPage() {
  const [currentQuarter, setCurrentQuarter] = useState('Q1')
  const [data, setData] = useState({})
  const [lastUpdate, setLastUpdate] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const [error, setError] = useState(null)
  const [exchangeRate, setExchangeRate] = useState(1450)
  const [trackingData, setTrackingData] = useState(() => loadTrackingData())
  // trackingData 구조: { [quarter]: { [ticker]: { avgPrice, highSinceBuy, buyDate } } }

  // 토스 보유종목 실시간 시세 (ADA 제외, 미국 주식만)
  const [tossPrices, setTossPrices] = useState({})

  // 모바일 감지
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 필터 상태
  const [filter, setFilter] = useState({
    status: 'all', // all, invested, notInvested, needBuy, overBuy
    alert: 'all',  // all, danger, warning, caution, profit
    sort: 'weight', // weight, name, gain, per
  })

  // 보유 종목 필터 상태
  const [holdingsFilter, setHoldingsFilter] = useState({
    broker: 'all', // all, 토스증권, 미래에셋
    account: 'all', // all, 해외주식, 연금저축계좌, ISA (중개형), etc.
    sort: 'value', // value, gain, name, invested
    sortDir: 'desc', // asc, desc
  })

  // 정렬 토글 함수
  const toggleSort = (sortKey) => {
    if (holdingsFilter.sort === sortKey) {
      setHoldingsFilter({
        ...holdingsFilter,
        sortDir: holdingsFilter.sortDir === 'desc' ? 'asc' : 'desc'
      })
    } else {
      setHoldingsFilter({
        ...holdingsFilter,
        sort: sortKey,
        sortDir: 'desc'
      })
    }
  }

  // 정렬 화살표 표시
  const SortArrow = ({ column }) => {
    if (holdingsFilter.sort !== column) return null
    return (
      <span style={{ marginLeft: '4px', fontSize: '10px' }}>
        {holdingsFilter.sortDir === 'desc' ? '▼' : '▲'}
      </span>
    )
  }

  // 현재 분기 포트폴리오
  const PORTFOLIO = QUARTERLY_PORTFOLIOS[currentQuarter]?.portfolio || []
  const quarterInfo = QUARTERLY_PORTFOLIOS[currentQuarter]

  const refreshData = useCallback(async (forceRefresh = false) => {
    if (PORTFOLIO.length === 0) {
      setError('이 분기의 포트폴리오가 아직 구성되지 않았습니다.')
      return
    }

    setIsRefreshing(true)
    setError(null)

    try {
      if (forceRefresh) {
        clearPriceCache()
      }

      const tickers = PORTFOLIO.map(item => item.ticker)
      const result = await fetchPortfolioPrices(tickers)

      // API 결과를 state 형식으로 변환
      const newData = {}
      for (const item of PORTFOLIO) {
        const priceData = result.prices[item.ticker.toUpperCase()]
        if (priceData) {
          newData[item.ticker] = {
            price: priceData.price,
            prevClose: priceData.previousClose,
            change: priceData.changePercent,
            high3y: priceData.high3y || priceData.price,
            high52w: priceData.fiftyTwoWeekHigh,
            low52w: priceData.fiftyTwoWeekLow,
            // PER/PBR (API에서 가져온 실제 데이터)
            per: priceData.per,
            pbr: priceData.pbr,
            // 추가 지표
            forwardPE: priceData.forwardPE,
            roe: priceData.roe,
            dividendYield: priceData.dividendYield,
            targetPrice: priceData.targetPrice,
            marketState: priceData.marketState,
            currency: priceData.currency,
          }
        }
      }

      setData(newData)
      setExchangeRate(result.exchangeRate)
      setLastUpdate(new Date())
      setIsLive(true)

      // 추적 데이터 업데이트 (분기별로 관리)
      const updatedTracking = { ...trackingData }
      if (!updatedTracking[currentQuarter]) {
        updatedTracking[currentQuarter] = {}
      }
      let trackingChanged = false

      for (const item of PORTFOLIO) {
        const priceData = result.prices[item.ticker.toUpperCase()]
        if (priceData?.price) {
          const currentPrice = priceData.price
          const existing = updatedTracking[currentQuarter][item.ticker]

          if (!existing) {
            // 첫 기록: 오늘 매수로 간주 (매수가 = 현재가, 고점 = 현재가)
            updatedTracking[currentQuarter][item.ticker] = {
              avgPrice: currentPrice,
              highSinceBuy: currentPrice,
              buyDate: new Date().toISOString().split('T')[0],
            }
            trackingChanged = true
          } else if (currentPrice > existing.highSinceBuy) {
            // 새 고점 갱신
            updatedTracking[currentQuarter][item.ticker] = {
              ...existing,
              highSinceBuy: currentPrice,
            }
            trackingChanged = true
          }
        }
      }

      if (trackingChanged) {
        setTrackingData(updatedTracking)
        saveTrackingData(updatedTracking)
      }
    } catch (err) {
      console.error('데이터 로딩 오류:', err)
      setError('데이터를 불러오는데 실패했습니다.')
      setIsLive(false)
    } finally {
      setIsRefreshing(false)
    }
  }, [currentQuarter, PORTFOLIO])

  // 초기 로드 및 분기 변경시 새로고침
  useEffect(() => {
    refreshData()
  }, [currentQuarter])

  // 자동 새로고침 (60초마다)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData()
    }, 60000)
    return () => clearInterval(interval)
  }, [refreshData])

  // 토스 보유종목 실시간 시세 가져오기 (미국 주식만)
  const fetchTossPrices = useCallback(async () => {
    try {
      // 미국 주식 티커만 추출 (ADA 암호화폐 제외)
      const usTickers = TOSS_HOLDINGS
        .filter(h => h.type !== 'crypto')
        .map(h => h.ticker)

      if (usTickers.length === 0) return

      const [prices, rate] = await Promise.all([
        fetchMultipleStockPrices(usTickers),
        fetchExchangeRate()
      ])

      setTossPrices(prices)
      setExchangeRate(rate)
      console.log('[PortfolioPage] TOSS prices updated:', Object.keys(prices).length, 'stocks')
    } catch (err) {
      console.error('[PortfolioPage] TOSS prices fetch error:', err)
    }
  }, [])

  // 토스 시세 초기 로드 + 자동 새로고침 (60초)
  useEffect(() => {
    fetchTossPrices()
    const interval = setInterval(fetchTossPrices, 60000)
    return () => clearInterval(interval)
  }, [fetchTossPrices])

  // 실시간 보유 종목 계산 (TOSS_HOLDINGS에 실시간 시세 반영)
  const liveHoldings = ALL_HOLDINGS.map(item => {
    // 토스증권 미국 주식만 실시간 시세 적용
    if (item.broker === '토스증권' && item.type !== 'crypto' && tossPrices[item.ticker]) {
      const priceData = tossPrices[item.ticker]
      const investedKRW = item.currentKRW - item.gainKRW // 원래 투자금 (원본 데이터 기준)
      const currentKRW = item.shares * priceData.price * exchangeRate
      const gainKRW = currentKRW - investedKRW
      const gainPercent = investedKRW > 0 ? (gainKRW / investedKRW) * 100 : 0
      return {
        ...item,
        currentKRW: Math.round(currentKRW),
        gainKRW: Math.round(gainKRW),
        gainPercent: Math.round(gainPercent * 100) / 100,
        isLive: true
      }
    }
    return item
  })

  // 매수 후 고점 대비 하락률 계산 (분기별)
  const getDropFromHigh = (ticker) => {
    const stockData = data[ticker]
    const quarterTracking = trackingData[currentQuarter] || {}
    const tracking = quarterTracking[ticker]
    if (!stockData?.price || !tracking?.highSinceBuy) return 0
    return ((stockData.price - tracking.highSinceBuy) / tracking.highSinceBuy) * 100
  }

  // 매수 후 고점 가져오기 (분기별)
  const getHighSinceBuy = (ticker) => {
    const quarterTracking = trackingData[currentQuarter] || {}
    return quarterTracking[ticker]?.highSinceBuy || null
  }

  // 알림 타입 결정 (고점 대비)
  const getAlertType = (dropPercent) => {
    if (dropPercent <= -15) return 'danger'
    if (dropPercent <= -10) return 'warning'
    if (dropPercent <= -5) return 'caution'
    return 'normal'
  }

  // 상태 아이콘 반환
  const getStatusIcon = (dropPercent, gainPercent) => {
    if (dropPercent <= -15) return { icon: '🚨', label: '-15% 손절', color: '#F04438' }
    if (dropPercent <= -10) return { icon: '⚠️', label: '-10% 주의', color: '#F57F17' }
    if (dropPercent <= -5) return { icon: '📉', label: '-5% 관찰', color: '#FF9800' }
    if (gainPercent >= 10) return { icon: '🔥🔥', label: '+10%↑', color: '#00C853' }
    if (gainPercent >= 5) return { icon: '🔥', label: '+5%↑', color: '#00C853' }
    return null
  }

  // 매수가 역산 (현재가와 손익률로 계산)
  const getPurchasePrice = (item, currentPrice) => {
    if (!item.investedKRW || item.investedKRW === 0) return null
    const gainPercent = item.gainKRW / item.investedKRW
    return currentPrice / (1 + gainPercent)
  }

  // 고점대비 하락률 계산 (매수가 기준, 손익률 활용)
  const getDropFromHighByItem = (item, stockData) => {
    if (!item.investedKRW || item.investedKRW === 0 || !stockData?.price) return 0
    const currentPrice = stockData.price
    const purchasePrice = getPurchasePrice(item, currentPrice)
    const quarterTracking = trackingData[currentQuarter] || {}
    const tracking = quarterTracking[item.ticker]

    // 고점: 저장된 고점 vs 매수가 중 큰 값
    const highSinceBuy = tracking?.highSinceBuy || purchasePrice
    const actualHigh = Math.max(highSinceBuy, purchasePrice)

    if (!actualHigh || actualHigh === 0) return 0
    return ((currentPrice - actualHigh) / actualHigh) * 100
  }

  // 매수후 고점 가져오기 (매수가 포함)
  const getHighSinceBuyByItem = (item, stockData) => {
    if (!item.investedKRW || item.investedKRW === 0 || !stockData?.price) return null
    const currentPrice = stockData.price
    const purchasePrice = getPurchasePrice(item, currentPrice)
    const quarterTracking = trackingData[currentQuarter] || {}
    const tracking = quarterTracking[item.ticker]

    const highSinceBuy = tracking?.highSinceBuy || purchasePrice
    return Math.max(highSinceBuy, purchasePrice, currentPrice)
  }

  // 내 수익률 계산 (매수가 대비, 분기별)
  const getMyGainPercent = (ticker) => {
    const stockData = data[ticker]
    const quarterTracking = trackingData[currentQuarter] || {}
    const tracking = quarterTracking[ticker]
    if (!stockData?.price || !tracking?.avgPrice) return 0
    return ((stockData.price - tracking.avgPrice) / tracking.avgPrice) * 100
  }

  // 포트폴리오 가치 계산 (전체 자산 포함)
  const calculatePortfolioValue = () => {
    let totalCost = 0 // 총 투자원금
    let totalGain = 0 // 총 수익금

    // PORTFOLIO (기존 목표 포트폴리오)
    PORTFOLIO.forEach(item => {
      totalCost += item.investedKRW || 0
      totalGain += item.gainKRW || 0
    })

    // 토스증권 보유 종목
    TOSS_HOLDINGS.forEach(item => {
      const invested = item.currentKRW - item.gainKRW
      totalCost += invested
      totalGain += item.gainKRW || 0
    })

    // 미래에셋증권 계좌별
    MIRAE_ACCOUNTS.forEach(acc => {
      acc.holdings.forEach(item => {
        totalCost += item.investedKRW || 0
        totalGain += item.gainKRW || 0
      })
    })

    const totalValue = totalCost + totalGain
    const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0
    return { totalCost, totalValue, totalGain, totalGainPercent }
  }

  // 총 투자금액 계산
  const TOTAL_INVESTMENT = PORTFOLIO.reduce((sum, item) => sum + (item.investedKRW || 0), 0)
    + TOSS_HOLDINGS.reduce((sum, h) => sum + (h.currentKRW - h.gainKRW), 0)
    + MIRAE_ACCOUNTS.reduce((sum, acc) => sum + acc.holdings.reduce((s, h) => s + h.investedKRW, 0), 0)

  const portfolioStats = calculatePortfolioValue()

  // 위험 종목 수 (고점 대비 -10% 이상 하락)
  const warningCount = TOSS_HOLDINGS.filter(item => item.gainPercent <= -10 && item.gainPercent > -15).length
  const dangerCount = TOSS_HOLDINGS.filter(item => item.gainPercent <= -15).length

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{
        ...styles.header,
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? '16px' : '0',
      }}>
        <div>
          <h1 style={{ ...styles.title, fontSize: isMobile ? '20px' : '24px' }}>🏠 하우가 패밀리</h1>
          <p style={{ ...styles.subtitle, fontSize: isMobile ? '12px' : '14px' }}>
            {quarterInfo?.label} ({quarterInfo?.period}) · 투자 원금: ₩{TOTAL_INVESTMENT.toLocaleString()}
          </p>
          <p style={styles.lastUpdate}>
            <span style={styles.statusDot(isLive)} />
            {isLive ? '실시간' : '데이터 로딩 중...'}
            {lastUpdate && ` · ${lastUpdate.toLocaleTimeString()}`}
            {exchangeRate && !isMobile && ` · 환율: $1 = ₩${exchangeRate.toLocaleString()}`}
          </p>
        </div>
        <button
          style={{
            ...styles.refreshButton,
            opacity: isRefreshing ? 0.7 : 1,
            width: isMobile ? '100%' : 'auto',
            justifyContent: 'center',
            padding: isMobile ? '10px 16px' : '12px 20px',
            fontSize: isMobile ? '13px' : '14px',
          }}
          onClick={() => refreshData(true)}
          disabled={isRefreshing}
        >
          <span style={isRefreshing ? { animation: 'spin 1s linear infinite', display: 'inline-block' } : {}}>↻</span>
          {isRefreshing ? '새로고침 중...' : '새로고침'}
        </button>
      </div>

      {/* 분기 선택 탭 */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        padding: '4px',
        backgroundColor: '#F2F4F6',
        borderRadius: '12px',
        width: 'fit-content',
      }}>
        {QUARTERS.map(quarter => {
          const info = QUARTERLY_PORTFOLIOS[quarter]
          const isActive = currentQuarter === quarter
          const isEmpty = info.portfolio.length === 0
          return (
            <button
              key={quarter}
              onClick={() => setCurrentQuarter(quarter)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isEmpty ? 'not-allowed' : 'pointer',
                backgroundColor: isActive ? 'white' : 'transparent',
                color: isActive ? '#3182F6' : isEmpty ? '#B0B8C1' : '#4E5968',
                boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s',
                opacity: isEmpty ? 0.6 : 1,
              }}
            >
              {quarter}
              {isEmpty && <span style={{ marginLeft: '4px', fontSize: '10px' }}>예정</span>}
            </button>
          )
        })}
      </div>

      {/* 에러 표시 */}
      {error && (
        <div style={{
          padding: '16px 20px',
          backgroundColor: '#FFF5F5',
          borderRadius: '12px',
          border: '1px solid #FFCDD2',
          marginBottom: '20px',
          color: '#F04438',
          fontSize: '14px',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* 빈 포트폴리오 */}
      {PORTFOLIO.length === 0 ? (
        <div style={{
          padding: '60px 40px',
          backgroundColor: 'white',
          borderRadius: '16px',
          border: '1px solid #E5E8EB',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#191F28', marginBottom: '8px' }}>
            {quarterInfo?.label} 포트폴리오
          </h2>
          <p style={{ fontSize: '14px', color: '#8B95A1', marginBottom: '24px' }}>
            아직 이 분기의 포트폴리오가 구성되지 않았습니다.<br />
            분기 시작 전에 리밸런싱 계획을 세워보세요.
          </p>
          <div style={{
            padding: '16px',
            backgroundColor: '#F7F8FA',
            borderRadius: '12px',
            fontSize: '13px',
            color: '#4E5968',
          }}>
            💡 <strong>팁:</strong> 분기별로 포트폴리오를 재구성하면 시장 상황에 맞게 자산을 조정할 수 있습니다.
          </div>
        </div>
      ) : (
      <>
      {/* 투자 원칙 */}
      <div style={{ ...styles.rulesCard, padding: isMobile ? '16px' : '20px' }}>
        <div style={styles.rulesTitle}>
          <span>📋</span> 나의 투자 원칙
        </div>
        <div style={{
          ...styles.rulesList,
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '8px' : '12px',
        }}>
          <div style={styles.ruleItem}>
            <span>🔴</span>
            <span><strong>손절:</strong> -15% 고려, -20% 무조건 실행 (무서워하면 안 된다)</span>
          </div>
          <div style={styles.ruleItem}>
            <span>🟢</span>
            <span><strong>익절:</strong> 최고가 대비 -10% 하락 시 매도</span>
          </div>
          <div style={styles.ruleItem}>
            <span>📈</span>
            <span><strong>원칙:</strong> 오르는 주식은 팔지 않는다</span>
          </div>
          <div style={styles.ruleItem}>
            <span>🎯</span>
            <span><strong>전략:</strong> 무릎에 사서 어깨에 판다</span>
          </div>
        </div>
      </div>

      {/* 요약 카드 */}
      <div style={{
        ...styles.summaryGrid,
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? '12px' : '16px',
      }}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>총 평가금액</div>
          <div style={styles.summaryValue}>₩{Math.round(portfolioStats.totalValue).toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#8B95A1', marginTop: '4px' }}>
            투자원금: ₩{Math.round(portfolioStats.totalCost).toLocaleString()}
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>총 수익</div>
          <div style={{ ...styles.summaryValue, color: portfolioStats.totalGain >= 0 ? '#00C853' : '#F04438' }}>
            {portfolioStats.totalGain >= 0 ? '+' : ''}₩{Math.round(portfolioStats.totalGain).toLocaleString()}
          </div>
          <div style={{ fontSize: '13px', color: portfolioStats.totalGainPercent >= 0 ? '#00C853' : '#F04438', marginTop: '4px' }}>
            {portfolioStats.totalGainPercent >= 0 ? '+' : ''}{portfolioStats.totalGainPercent.toFixed(2)}%
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>주의 종목 (고점 -10%)</div>
          <div style={{ ...styles.summaryValue, color: warningCount > 0 ? '#F57F17' : '#00C853' }}>{warningCount}</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>위험 종목 (고점 -15%)</div>
          <div style={{ ...styles.summaryValue, color: dangerCount > 0 ? '#F04438' : '#00C853' }}>{dangerCount}</div>
        </div>
      </div>

      {/* 비상금/현금 계좌 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? '12px' : '16px',
        marginBottom: '24px',
      }}>
        {CASH_ACCOUNTS.map(account => {
          const progress = account.currentKRW / account.targetKRW * 100
          const remaining = account.targetKRW - account.currentKRW
          const today = new Date().getDate()
          const daysUntilDeposit = account.depositDay >= today
            ? account.depositDay - today
            : (new Date(new Date().getFullYear(), new Date().getMonth() + 1, account.depositDay).getDate() - today + 30) % 30

          return (
            <div key={account.id} style={{
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '16px',
              border: '1px solid #E5E8EB',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{account.icon}</span>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#191F28' }}>{account.name}</div>
                    <div style={{ fontSize: '11px', color: '#8B95A1' }}>{account.note}</div>
                  </div>
                </div>
                <div style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  backgroundColor: daysUntilDeposit <= 3 ? '#FFEBEE' : '#E8F3FF',
                  color: daysUntilDeposit <= 3 ? '#F04438' : '#3182F6',
                }}>
                  {daysUntilDeposit === 0 ? '오늘 입금!' : `D-${daysUntilDeposit}`}
                </div>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', color: '#6B7684' }}>현재</span>
                  <span style={{ fontSize: '13px', color: '#6B7684' }}>목표</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '20px', fontWeight: '700', color: '#191F28' }}>
                    ₩{account.currentKRW.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '14px', color: '#8B95A1' }}>
                    ₩{account.targetKRW.toLocaleString()}
                  </span>
                </div>
              </div>

              <div style={{
                height: '8px',
                backgroundColor: '#F2F4F6',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '8px',
              }}>
                <div style={{
                  width: `${Math.min(progress, 100)}%`,
                  height: '100%',
                  backgroundColor: progress >= 100 ? '#00C853' : '#3182F6',
                  borderRadius: '4px',
                  transition: 'width 0.3s',
                }} />
              </div>

              <div style={{ fontSize: '12px', color: remaining > 0 ? '#F57F17' : '#00C853' }}>
                {remaining > 0
                  ? `⏳ ₩${remaining.toLocaleString()} 더 필요 ${account.depositDay ? `(매월 ${account.depositDay}일 입금)` : '(여유될 때마다)'}`
                  : '✓ 목표 달성!'}
              </div>
            </div>
          )
        })}
      </div>

      {/* 2월 실현수익 */}
      <div style={{
        padding: '20px',
        backgroundColor: '#E8F5E9',
        borderRadius: '16px',
        border: '1px solid #A5D6A7',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>💰</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#2E7D32' }}>2월 실현수익</span>
          </div>
          <span style={{ fontSize: '24px', fontWeight: '700', color: '#00C853' }}>
            +{REALIZED_GAINS.total.toLocaleString()}원
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '8px' : '12px' }}>
          {REALIZED_GAINS.details.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: isMobile ? '12px' : '13px' }}>
              <span style={{ color: '#4E5968' }}>{item.type}</span>
              <span style={{ color: '#00C853', fontWeight: '600' }}>
                +{item.amount.toLocaleString()}원
                {item.percent && ` (${item.percent}%)`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 포트폴리오 구성 */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: '#191F28', marginBottom: '12px' }}>📊 포트폴리오 구성</h3>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? '12px' : '16px',
        marginBottom: '24px',
      }}>
        {/* 토스증권 해외주식 */}
        <PortfolioChart
          icon="📱"
          title="토스증권 해외주식"
          amount={TOSS_HOLDINGS.reduce((sum, h) => sum + h.currentKRW, 0)}
          gainKRW={TOSS_HOLDINGS.reduce((sum, h) => sum + h.gainKRW, 0)}
          gainPercent={(() => {
            const totalInvested = TOSS_HOLDINGS.reduce((sum, h) => sum + (h.currentKRW - h.gainKRW), 0)
            const totalGain = TOSS_HOLDINGS.reduce((sum, h) => sum + h.gainKRW, 0)
            return totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0
          })()}
          items={TOSS_PORTFOLIO}
        />

        {/* 연금저축 */}
        <PortfolioChart
          icon="🧓"
          title="연금저축계좌"
          amount={MIRAE_ACCOUNTS.find(a => a.id === 'pension')?.totalKRW || 0}
          gainKRW={MIRAE_ACCOUNTS.find(a => a.id === 'pension')?.gainKRW || 0}
          gainPercent={MIRAE_ACCOUNTS.find(a => a.id === 'pension')?.gainPercent || 0}
          items={PENSION_PORTFOLIO}
        />

        {/* ISA */}
        <PortfolioChart
          icon="📊"
          title="ISA (중개형)"
          amount={MIRAE_ACCOUNTS.find(a => a.id === 'isa')?.totalKRW || 0}
          gainKRW={MIRAE_ACCOUNTS.find(a => a.id === 'isa')?.gainKRW || 0}
          gainPercent={MIRAE_ACCOUNTS.find(a => a.id === 'isa')?.gainPercent || 0}
          items={ISA_PORTFOLIO}
        />

        {/* 종합_주식 */}
        <PortfolioChart
          icon="📈"
          title="종합_주식"
          amount={MIRAE_ACCOUNTS.find(a => a.id === 'stock')?.totalKRW || 0}
          gainKRW={MIRAE_ACCOUNTS.find(a => a.id === 'stock')?.gainKRW || 0}
          gainPercent={MIRAE_ACCOUNTS.find(a => a.id === 'stock')?.gainPercent || 0}
          items={STOCK_PORTFOLIO}
        />

        {/* IRP */}
        <PortfolioChart
          icon="🏦"
          title="IRP"
          amount={250000}
          gainKRW={0}
          gainPercent={0}
          status="진행중"
          statusColor={{ bg: '#E8F3FF', text: '#3182F6' }}
          items={IRP_PORTFOLIO}
        />

        {/* 추가 연금저축 */}
        <PortfolioChart
          icon="💰"
          title="추가 연금저축"
          amount={9000000}
          status="예정"
          statusColor={{ bg: '#FFF3E0', text: '#E65100' }}
          items={PENSION_EXTRA_PORTFOLIO}
        />
      </div>

      {/* 공모주 청약 */}
      <div style={{
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #E5E8EB',
        marginBottom: '24px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🎯</span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#191F28' }}>공모주 청약</span>
          </div>
          <a
            href="https://www.38.co.kr/html/fund/index.htm?o=k"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '6px 12px',
              backgroundColor: '#F2F4F6',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#4E5968',
              textDecoration: 'none',
            }}
          >
            📅 청약일정 보기 →
          </a>
        </div>

        {IPO_SUBSCRIPTIONS.length === 0 ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: '#8B95A1',
            backgroundColor: '#F8F9FA',
            borderRadius: '12px',
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📋</div>
            <div style={{ fontSize: '14px', marginBottom: '8px' }}>현재 예정된 청약이 없습니다</div>
            <div style={{ fontSize: '12px', color: '#B0B8C1' }}>
              청약 일정이 생기면 여기에 추가됩니다
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {IPO_SUBSCRIPTIONS.map(ipo => {
              const today = new Date().toISOString().split('T')[0]
              const isSubscribing = today >= ipo.subscriptionStart && today <= ipo.subscriptionEnd
              const isPast = today > ipo.listingDate

              const statusColors = {
                upcoming: { bg: '#E8F3FF', color: '#3182F6', label: '청약예정' },
                subscribing: { bg: '#FFF3E0', color: '#F57C00', label: '청약중' },
                waiting: { bg: '#F3E5F5', color: '#9C27B0', label: '배정대기' },
                listed: { bg: '#E8F5E9', color: '#00C853', label: '상장완료' },
                missed: { bg: '#F5F5F5', color: '#9E9E9E', label: '미참여' },
              }
              const status = statusColors[ipo.status] || statusColors.upcoming

              return (
                <div key={ipo.id} style={{
                  padding: '16px',
                  backgroundColor: '#F8F9FA',
                  borderRadius: '12px',
                  border: isSubscribing ? '2px solid #F57C00' : '1px solid #E5E8EB',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#191F28' }}>
                        {ipo.name}
                        <span style={{ fontSize: '12px', fontWeight: '400', color: '#8B95A1', marginLeft: '8px' }}>
                          {ipo.code}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#6B7684', marginTop: '4px' }}>
                        {ipo.broker}
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backgroundColor: status.bg,
                      color: status.color,
                    }}>
                      {status.label}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', fontSize: '12px' }}>
                    <div>
                      <div style={{ color: '#8B95A1', marginBottom: '2px' }}>청약일</div>
                      <div style={{ color: '#191F28', fontWeight: '500' }}>
                        {ipo.subscriptionStart.slice(5)} ~ {ipo.subscriptionEnd.slice(5)}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#8B95A1', marginBottom: '2px' }}>공모가</div>
                      <div style={{ color: '#191F28', fontWeight: '500' }}>
                        {ipo.finalPrice ? `${ipo.finalPrice.toLocaleString()}원` : ipo.priceRange}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#8B95A1', marginBottom: '2px' }}>경쟁률</div>
                      <div style={{ color: ipo.competition ? '#3182F6' : '#8B95A1', fontWeight: '500' }}>
                        {ipo.competition ? `${ipo.competition}:1` : '-'}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: '#8B95A1', marginBottom: '2px' }}>배정</div>
                      <div style={{ color: ipo.allocated ? '#00C853' : '#8B95A1', fontWeight: '600' }}>
                        {ipo.allocated ? `${ipo.allocated}주` : '-'}
                      </div>
                    </div>
                  </div>

                  {ipo.subscriptionAmount > 0 && (
                    <div style={{
                      marginTop: '12px',
                      padding: '8px 12px',
                      backgroundColor: '#E8F3FF',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#3182F6',
                    }}>
                      💰 청약 증거금: ₩{ipo.subscriptionAmount.toLocaleString()}
                      {ipo.refundDate && ` · 환불일: ${ipo.refundDate.slice(5)}`}
                    </div>
                  )}

                  {ipo.note && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#6B7684' }}>
                      📝 {ipo.note}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div style={styles.mainGrid}>
        {/* 보유 종목 테이블 (토스 + 미래에셋 통합) */}
        <div style={styles.tableCard}>
          <div style={{
            ...styles.tableHeader,
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? '8px' : '0',
            padding: isMobile ? '16px' : '20px',
          }}>
            <span style={{ ...styles.tableTitle, fontSize: isMobile ? '14px' : '16px' }}>보유 종목</span>
            <span style={{ fontSize: isMobile ? '11px' : '13px', color: '#8B95A1' }}>
              {liveHoldings.length}개 종목 · 토스 {TOSS_HOLDINGS.length}개 + 미래에셋 {MIRAE_ACCOUNTS.reduce((acc, a) => acc + a.holdings.length, 0)}개
              {Object.keys(tossPrices).length > 0 && (
                <span style={{ marginLeft: '8px', color: '#00C853', fontWeight: '500' }}>
                  🔴 라이브
                </span>
              )}
            </span>
          </div>

          {/* 필터 */}
          <div style={{
            padding: '12px 20px',
            borderBottom: '1px solid #E5E8EB',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#8B95A1' }}>증권사:</span>
              {[
                { value: 'all', label: '전체' },
                { value: '토스증권', label: '토스증권' },
                { value: '미래에셋', label: '미래에셋' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setHoldingsFilter({ ...holdingsFilter, broker: opt.value })}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    backgroundColor: holdingsFilter.broker === opt.value ? '#3182F6' : '#F2F4F6',
                    color: holdingsFilter.broker === opt.value ? 'white' : '#4E5968',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#8B95A1' }}>계좌:</span>
              <select
                value={holdingsFilter.account}
                onChange={(e) => setHoldingsFilter({ ...holdingsFilter, account: e.target.value })}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #E5E8EB',
                  fontSize: '12px',
                  color: '#4E5968',
                  cursor: 'pointer',
                }}
              >
                <option value="all">전체</option>
                <option value="해외주식">해외주식 (토스)</option>
                <option value="연금저축계좌">연금저축 (미래)</option>
                <option value="ISA (중개형)">ISA (미래)</option>
                <option value="종합_주식">종합_주식 (미래)</option>
                <option value="비상금 CMA">비상금 CMA</option>
                <option value="하우가 가족여행 CMA">가족여행 CMA</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#8B95A1' }}>정렬:</span>
              <select
                value={holdingsFilter.sort}
                onChange={(e) => setHoldingsFilter({ ...holdingsFilter, sort: e.target.value })}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #E5E8EB',
                  fontSize: '12px',
                  color: '#4E5968',
                  cursor: 'pointer',
                }}
              >
                <option value="value">평가금액순</option>
                <option value="gain">수익률순</option>
                <option value="name">이름순</option>
              </select>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ ...styles.table, tableLayout: 'fixed', minWidth: '900px' }}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, width: '120px' }}>증권사/계좌</th>
                  <th
                    style={{ ...styles.th, width: '130px', cursor: 'pointer' }}
                    onClick={() => toggleSort('name')}
                  >
                    종목명<SortArrow column="name" />
                  </th>
                  <th style={{ ...styles.thRight, width: '60px' }}>수량</th>
                  <th
                    style={{ ...styles.thRight, width: '95px', cursor: 'pointer' }}
                    onClick={() => toggleSort('invested')}
                  >
                    매입금액<SortArrow column="invested" />
                  </th>
                  <th
                    style={{ ...styles.thRight, width: '110px', cursor: 'pointer' }}
                    onClick={() => toggleSort('value')}
                  >
                    평가금액<SortArrow column="value" />
                  </th>
                  <th
                    style={{ ...styles.thRight, width: '115px', cursor: 'pointer' }}
                    onClick={() => toggleSort('gainKRW')}
                  >
                    손익<SortArrow column="gainKRW" />
                  </th>
                  <th
                    style={{ ...styles.thRight, width: '90px', cursor: 'pointer' }}
                    onClick={() => toggleSort('gain')}
                  >
                    수익률<SortArrow column="gain" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {liveHoldings
                  // 필터 적용
                  .filter(item => {
                    if (holdingsFilter.broker !== 'all' && item.broker !== holdingsFilter.broker) return false
                    if (holdingsFilter.account !== 'all' && item.account !== holdingsFilter.account) return false
                    return true
                  })
                  // 정렬 적용
                  .sort((a, b) => {
                    const dir = holdingsFilter.sortDir === 'desc' ? 1 : -1
                    const aInvested = a.investedKRW !== undefined ? a.investedKRW : (a.currentKRW - a.gainKRW)
                    const bInvested = b.investedKRW !== undefined ? b.investedKRW : (b.currentKRW - b.gainKRW)
                    if (holdingsFilter.sort === 'value') return (b.currentKRW - a.currentKRW) * dir
                    if (holdingsFilter.sort === 'gain') return (b.gainPercent - a.gainPercent) * dir
                    if (holdingsFilter.sort === 'gainKRW') return (b.gainKRW - a.gainKRW) * dir
                    if (holdingsFilter.sort === 'invested') return (bInvested - aInvested) * dir
                    if (holdingsFilter.sort === 'name') return a.name.localeCompare(b.name) * dir
                    return 0
                  })
                  .map((item, idx) => {
                    const gainPercent = item.gainPercent
                    // 매입금액 계산 (토스: currentKRW - gainKRW, 미래에셋: investedKRW)
                    const investedAmount = item.investedKRW !== undefined ? item.investedKRW : (item.currentKRW - item.gainKRW)
                    return (
                      <tr key={`${item.broker}-${item.account}-${item.name}-${idx}`}>
                        {/* 증권사/계좌 */}
                        <td style={styles.td}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: item.broker === '토스증권' ? '#3182F6' : '#FF6B35',
                            }}>
                              {item.broker}
                            </span>
                            <span style={{ fontSize: '11px', color: '#8B95A1' }}>
                              {item.accountIcon} {item.account}
                            </span>
                          </div>
                        </td>
                        {/* 종목명 */}
                        <td style={styles.td}>
                          <div style={styles.tickerCell}>
                            <div style={styles.tickerInfo}>
                              <span style={styles.tickerSymbol}>
                                {item.ticker || item.name}
                                {item.isLive && (
                                  <span style={{
                                    marginLeft: '6px',
                                    fontSize: '9px',
                                    color: '#00C853',
                                    fontWeight: '500'
                                  }}>●</span>
                                )}
                              </span>
                              <span style={styles.tickerName}>
                                {item.ticker && item.ticker !== item.name ? item.name : ''}
                                {item.type === 'crypto' && ' (암호화폐)'}
                              </span>
                            </div>
                          </div>
                        </td>
                        {/* 수량 */}
                        <td style={styles.tdRight}>
                          {item.shares > 0 ? (
                            <span style={{ fontWeight: '500', fontSize: '13px' }}>
                              {item.shares < 1 ? item.shares.toFixed(4) : item.shares.toLocaleString()}
                            </span>
                          ) : '-'}
                        </td>
                        {/* 매입금액 */}
                        <td style={styles.tdRight}>
                          <span style={{ color: '#8B95A1', fontSize: '13px' }}>
                            ₩{Math.round(investedAmount).toLocaleString()}
                          </span>
                        </td>
                        {/* 평가금액 */}
                        <td style={styles.tdRight}>
                          <span style={{ fontWeight: '600' }}>
                            ₩{Math.round(item.currentKRW).toLocaleString()}
                          </span>
                        </td>
                        {/* 손익 */}
                        <td style={styles.tdRight}>
                          <span style={{
                            color: item.gainKRW > 0 ? '#00C853' : item.gainKRW < 0 ? '#F04438' : '#8B95A1',
                            fontWeight: '600',
                            fontSize: '13px',
                          }}>
                            {item.gainKRW >= 0 ? '+' : '-'}₩{Math.abs(Math.round(item.gainKRW)).toLocaleString()}
                          </span>
                        </td>
                        {/* 수익률 */}
                        <td style={styles.tdRight}>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: gainPercent >= 5 ? '#E8F5E9' : gainPercent > 0 ? '#F0FFF4' : gainPercent < 0 ? '#FFEBEE' : '#F2F4F6',
                            color: gainPercent > 0 ? '#00C853' : gainPercent < 0 ? '#F04438' : '#8B95A1',
                          }}>
                            {gainPercent >= 5 && '🔥 '}
                            {gainPercent > 0 ? '+' : ''}{gainPercent.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
          {/* 합계 */}
          <div style={{
            padding: isMobile ? '12px 16px' : '16px 20px',
            borderTop: '1px solid #E5E8EB',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? '8px' : '0',
            backgroundColor: '#F7F8FA',
          }}>
            <span style={{ fontSize: isMobile ? '12px' : '14px', fontWeight: '600', color: '#191F28' }}>
              합계 ({liveHoldings
                .filter(item => {
                  if (holdingsFilter.broker !== 'all' && item.broker !== holdingsFilter.broker) return false
                  if (holdingsFilter.account !== 'all' && item.account !== holdingsFilter.account) return false
                  return true
                }).length}개 종목)
            </span>
            <div style={{ display: 'flex', gap: isMobile ? '12px' : '24px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: isMobile ? '12px' : '14px', color: '#4E5968' }}>
                평가금액: <strong style={{ color: '#191F28' }}>
                  ₩{Math.round(liveHoldings
                    .filter(item => {
                      if (holdingsFilter.broker !== 'all' && item.broker !== holdingsFilter.broker) return false
                      if (holdingsFilter.account !== 'all' && item.account !== holdingsFilter.account) return false
                      return true
                    })
                    .reduce((acc, item) => acc + item.currentKRW, 0)).toLocaleString()}
                </strong>
              </span>
              <span style={{ fontSize: isMobile ? '12px' : '14px', color: '#4E5968' }}>
                손익: <strong style={{
                  color: liveHoldings
                    .filter(item => {
                      if (holdingsFilter.broker !== 'all' && item.broker !== holdingsFilter.broker) return false
                      if (holdingsFilter.account !== 'all' && item.account !== holdingsFilter.account) return false
                      return true
                    })
                    .reduce((acc, item) => acc + item.gainKRW, 0) >= 0 ? '#00C853' : '#F04438'
                }}>
                  {liveHoldings
                    .filter(item => {
                      if (holdingsFilter.broker !== 'all' && item.broker !== holdingsFilter.broker) return false
                      if (holdingsFilter.account !== 'all' && item.account !== holdingsFilter.account) return false
                      return true
                    })
                    .reduce((acc, item) => acc + item.gainKRW, 0) >= 0 ? '+' : ''}
                  ₩{Math.round(liveHoldings
                    .filter(item => {
                      if (holdingsFilter.broker !== 'all' && item.broker !== holdingsFilter.broker) return false
                      if (holdingsFilter.account !== 'all' && item.account !== holdingsFilter.account) return false
                      return true
                    })
                    .reduce((acc, item) => acc + item.gainKRW, 0)).toLocaleString()}
                </strong>
              </span>
              {/* 총 수익률 */}
              {(() => {
                const filtered = liveHoldings.filter(item => {
                  if (holdingsFilter.broker !== 'all' && item.broker !== holdingsFilter.broker) return false
                  if (holdingsFilter.account !== 'all' && item.account !== holdingsFilter.account) return false
                  return true
                })
                const totalInvested = filtered.reduce((acc, item) => {
                  const invested = item.investedKRW !== undefined ? item.investedKRW : (item.currentKRW - item.gainKRW)
                  return acc + invested
                }, 0)
                const totalGain = filtered.reduce((acc, item) => acc + item.gainKRW, 0)
                const totalPercent = totalInvested > 0 ? (totalGain / totalInvested * 100) : 0
                return (
                  <span style={{
                    fontSize: isMobile ? '12px' : '14px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    backgroundColor: totalPercent >= 0 ? '#E8F5E9' : '#FFEBEE',
                    color: totalPercent >= 0 ? '#00C853' : '#F04438',
                  }}>
                    {totalPercent >= 0 ? '+' : ''}{totalPercent.toFixed(2)}%
                  </span>
                )
              })()}
            </div>
          </div>
          {/* 범례 */}
          <div style={{
            padding: isMobile ? '12px 16px' : '16px 20px',
            borderTop: '1px solid #E5E8EB',
            backgroundColor: '#FAFAFA',
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: isMobile ? '10px' : '16px',
              fontSize: isMobile ? '11px' : '12px',
              color: '#4E5968',
            }}>
              <span><strong style={{ color: '#00C853' }}>🔥</strong> = 내 수익 +5% 이상</span>
              <span><strong style={{ color: '#F57F17' }}>⚠️</strong> = 매수후고점 대비 -10% 이상</span>
              <span><strong style={{ color: '#F04438' }}>🚨</strong> = 매수후고점 대비 -15% 이상 (손절 고려)</span>
              <span><strong>PER</strong> = 주가수익비율</span>
              <span><strong>PBR</strong> = 주가순자산비율</span>
              <span><strong>ROE</strong> = 자기자본이익률 (15%+ 우량)</span>
            </div>
          </div>
        </div>

        {/* 비중 차트 */}
        <div style={{
          ...styles.chartCard,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '20px' : '40px',
          padding: isMobile ? '16px' : '24px',
        }}>
          <div style={{ width: isMobile ? '100%' : 'auto', display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'flex-start' }}>
            <div style={styles.chartTitle}>목표 포트폴리오 비중</div>
            <div style={{ ...styles.pieContainer, width: isMobile ? '160px' : '200px', height: isMobile ? '160px' : '200px' }}>
              <div style={getPieChartStyle(PORTFOLIO)} />
              <div style={{ ...styles.pieCenter, width: isMobile ? '80px' : '100px', height: isMobile ? '80px' : '100px' }}>
                <div style={{ ...styles.pieCenterValue, fontSize: isMobile ? '14px' : '16px' }}>₩{(TARGET_TOTAL / 10000).toFixed(0)}만</div>
                <div style={styles.pieCenterLabel}>목표 투자금</div>
              </div>
            </div>
          </div>

          <div style={{
            ...styles.legendList,
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '8px' : '12px',
          }}>
            {PORTFOLIO
              .sort((a, b) => b.targetWeight - a.targetWeight)
              .map(item => {
                const isInvested = item.investedKRW > 0
                return (
                  <div key={item.ticker} style={{
                    ...styles.legendItem,
                    opacity: isInvested ? 1 : 0.6,
                  }}>
                    <div style={styles.legendLeft}>
                      <div style={styles.legendDot(SECTOR_COLORS[item.ticker] || '#8B95A1')} />
                      <span style={{
                        ...styles.legendName,
                        fontWeight: isInvested ? 'normal' : '500',
                        color: isInvested ? '#4E5968' : '#F57F17',
                      }}>
                        {item.name}
                        {!isInvested && ' ⏳'}
                      </span>
                    </div>
                    <span style={styles.legendValue}>{item.targetWeight}%</span>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* 알림 섹션 */}
      {(dangerCount > 0 || warningCount > 0) && (
        <div style={{
          marginTop: '24px',
          padding: '20px',
          backgroundColor: dangerCount > 0 ? '#FFF5F5' : '#FFFBEB',
          borderRadius: '16px',
          border: `1px solid ${dangerCount > 0 ? '#FFCDD2' : '#FFE082'}`
        }}>
          <div style={{
            fontSize: '16px',
            fontWeight: '700',
            color: dangerCount > 0 ? '#F04438' : '#F57F17',
            marginBottom: '12px'
          }}>
            {dangerCount > 0 ? '🚨 손절 검토 필요' : '⚠️ 주의 종목 발생'}
          </div>
          <div style={{ fontSize: '14px', color: '#4E5968', lineHeight: '1.8' }}>
            {PORTFOLIO.filter(item => {
              const drop = getDropFromHigh(item.ticker)
              return drop <= -10
            }).map(item => {
              const drop = getDropFromHigh(item.ticker)
              const alertType = getAlertType(drop)
              return (
                <div key={item.ticker} style={{ marginBottom: '8px' }}>
                  <strong>{item.name} ({item.displayTicker})</strong>:
                  고점 대비 <span style={{
                    color: alertType === 'danger' ? '#F04438' : '#F57F17',
                    fontWeight: '600'
                  }}>{drop.toFixed(1)}%</span>
                  {alertType === 'danger' && (
                    <span style={{ marginLeft: '8px', color: '#F04438' }}>
                      → 원칙: -15% 손절 고려, -20% 무조건
                    </span>
                  )}
                  {alertType === 'warning' && (
                    <span style={{ marginLeft: '8px', color: '#F57F17' }}>
                      → 모니터링 필요
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 매도 예정 종목 (기타) */}
      {PENDING_SALES.length > 0 && (
        <div style={{
          marginTop: '24px',
          padding: '20px',
          backgroundColor: '#FFF9E6',
          borderRadius: '16px',
          border: '1px solid #FFE082',
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#F57F17',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            📦 기타 (매도 예정 종목)
            <span style={{ fontSize: '12px', fontWeight: '500', color: '#856404' }}>
              · 비중 미포함 · 매도 후 금액 기록 예정
            </span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #FFE082' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '12px', color: '#856404' }}>종목</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: '12px', color: '#856404' }}>투자원금</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: '12px', color: '#856404' }}>평가손익</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: '12px', color: '#856404' }}>상태</th>
                <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: '12px', color: '#856404' }}>매도금액</th>
              </tr>
            </thead>
            <tbody>
              {PENDING_SALES.map(item => (
                <tr key={item.ticker}>
                  <td style={{ padding: '10px 12px', fontSize: '13px' }}>
                    <span style={{ fontWeight: '600' }}>{item.displayTicker}</span>
                    <span style={{ marginLeft: '8px', color: '#856404' }}>{item.name}</span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '13px' }}>
                    ₩{item.investedKRW.toLocaleString()}
                  </td>
                  <td style={{
                    padding: '10px 12px',
                    textAlign: 'right',
                    fontSize: '13px',
                    color: item.gainKRW >= 0 ? '#00C853' : '#F04438',
                    fontWeight: '600',
                  }}>
                    {item.gainKRW >= 0 ? '+' : ''}₩{item.gainKRW.toLocaleString()}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backgroundColor: item.status === '매도예정' ? '#FFF3E0' : '#E8F5E9',
                      color: item.status === '매도예정' ? '#F57C00' : '#00C853',
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '13px', color: '#856404' }}>
                    {item.soldKRW ? `₩${item.soldKRW.toLocaleString()}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '1px solid #FFE082' }}>
                <td style={{ padding: '10px 12px', fontSize: '13px', fontWeight: '600' }}>합계</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: '13px', fontWeight: '600' }}>
                  ₩{PENDING_SALES.reduce((sum, item) => sum + item.investedKRW, 0).toLocaleString()}
                </td>
                <td style={{
                  padding: '10px 12px',
                  textAlign: 'right',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: PENDING_SALES.reduce((sum, item) => sum + item.gainKRW, 0) >= 0 ? '#00C853' : '#F04438',
                }}>
                  {PENDING_SALES.reduce((sum, item) => sum + item.gainKRW, 0) >= 0 ? '+' : ''}
                  ₩{PENDING_SALES.reduce((sum, item) => sum + item.gainKRW, 0).toLocaleString()}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* 범례 설명 */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#F7F8FA',
        borderRadius: '12px',
        fontSize: '12px',
        color: '#8B95A1',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <span><strong>범례:</strong></span>
        <span>🔥 = 내 수익 +5% 이상</span>
        <span>⚠️ = 매수후고점 대비 -10% 이상</span>
        <span>🚨 = 매수후고점 대비 -15% 이상 (손절 고려)</span>
        <span>PER = 주가수익비율</span>
        <span>PBR = 주가순자산비율</span>
        <span>ROE = 자기자본이익률 (15%+ 우량)</span>
      </div>
      </>
      )}
    </div>
  )
}
