import { useState, useEffect, useCallback } from 'react'
import { fetchMultipleStockPrices, fetchExchangeRate } from '../services/stockApi'
import { useNavigate } from 'react-router-dom'

// 분기별 포트폴리오
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4']

const QUARTERLY_PORTFOLIOS = {
  'Q1': {
    label: '2026년 1분기',
    period: '2026.01 - 2026.03',
    portfolio: [
      { ticker: 'KODEX200', name: 'KODEX 200', type: 'ETF', investedKRW: 0, gainKRW: 0 },
      { ticker: 'TIGER S&P', name: 'TIGER 미국S&P500', type: 'ETF', investedKRW: 0, gainKRW: 0 },
    ]
  },
  'Q2': {
    label: '2026년 2분기',
    period: '2026.04 - 2026.06',
    portfolio: [
      { ticker: 'KODEX200', name: 'KODEX 200', type: 'ETF', investedKRW: 0, gainKRW: 0 },
      { ticker: 'TIGER S&P', name: 'TIGER 미국S&P500', type: 'ETF', investedKRW: 0, gainKRW: 0 },
    ]
  },
  'Q3': { label: '2026년 3분기', period: '2026.07 - 2026.09', portfolio: [] },
  'Q4': { label: '2026년 4분기', period: '2026.10 - 2026.12', portfolio: [] },
}

// 세제혜택 계좌 현황
const TAX_ACCOUNTS = [
  { id: 'pension', name: '연금저축', icon: '🧓', targetKRW: 15000000, currentKRW: 6000000, depositDay: 25, note: '세액공제 79.2만원 · 월 60만원', status: '진행중' },
  { id: 'irp', name: 'IRP', icon: '🏦', targetKRW: 3000000, currentKRW: 250000, depositDay: 25, note: '세액공제 39.6만원 · 월 25만원', status: '진행중' },
  { id: 'isa', name: 'ISA', icon: '📈', targetKRW: 20000000, currentKRW: 20000000, depositDay: null, note: '비과세 200만원', status: '완료' },
]

// ISA 포트폴리오 (2,000만원) - 하늘 버핏 추천
const ISA_PORTFOLIO = [
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
]

// 연금저축 포트폴리오 (1,500만원) - 하늘 버핏 추천
const PENSION_PORTFOLIO = [
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
]

// IRP 포트폴리오 (300만원) - 하늘 버핏 추천 (안전자산 30% 규정 준수)
const IRP_PORTFOLIO = [
  { ticker: '161510', name: 'PLUS 고배당주', category: '배당', targetWeight: 35, risk: 2 },
  { ticker: '458730', name: 'TIGER 미국배당다우존스', category: '배당', targetWeight: 35, risk: 2 },
  { ticker: '472150', name: 'KODEX 금액티브', category: '금', targetWeight: 10, risk: 1 },
  { ticker: '305080', name: 'TIGER 미국채10년선물', category: '채권', targetWeight: 10, risk: 1 },
  { ticker: '305090', name: 'TIGER 미국채30년선물', category: '채권', targetWeight: 10, risk: 1 },
]


// 실시간 추적 자산 (매입가 기준 수익률 계산) - 2026.04.22
const TRACKED_ASSETS = [
  {
    id: 'amazon',
    name: '아마존 (AMZN)',
    icon: '🛒',
    type: 'manual',
    shares: 5,
    investedKRW: 1595809,
    currentKRW: 1854752,
    gainKRW: 258943,
    gainPercent: 16.22,
    note: '미래에셋 · 5주',
  },
  {
    id: 'bitcoin',
    name: '비트코인 (BTC)',
    icon: '₿',
    type: 'crypto',
    btcAmount: 0.01076814,
    investedKRW: 1098351,
    currentKRW: 1344337,
    gainKRW: 245986,
    gainPercent: 22.40,
    note: '업비트 · 0.0108 BTC',
  },
]

// 1. 고정자산 (빼면 손해나는 자산) - 청년도약계좌, 청약저축, ISA, 연금저축 - 2026.04.22
const FIXED_ASSETS = [
  { id: 'youth-account', name: '청년 도약 계좌', icon: '🚀', currentKRW: 16800000, note: '5년 만기 · 6%+정부기여금' },
  { id: 'housing', name: '청약저축', icon: '🏠', currentKRW: 6220000, note: '1순위 충족 · 2.3%' },
  { id: 'isa', name: 'ISA', icon: '📈', currentKRW: 21231426, investedKRW: 20520572, gainKRW: 710854, gainPercent: 3.46, note: '삼성증권 · +3.46%' },
  { id: 'pension', name: '연금저축', icon: '🧓', currentKRW: 15485830, investedKRW: 15102380, gainKRW: 383450, gainPercent: 2.54, note: '미래에셋 · +2.54%' },
]

// 2. 비변동성 자산 (투자 중인 자산 + 받을 돈) - S&P500, 아마존, 비트코인, 가족받을돈, 전세보증금 - 2026.04.22
// 아마존은 TRACKED_ASSETS에서 실시간 추적 (중복 방지)
const STABLE_ASSETS = [
  { id: 'sp500-dividend', name: 'S&P500 + 배당주 + 케이뱅크', icon: '📈', currentKRW: 26399608, investedKRW: 22841816, gainKRW: 3557792, gainPercent: 15.58, note: '삼성증권 · +15.58%', type: 'stock' },
  { id: 'domestic-stocks', name: '국내주식 + 배당', icon: '🏢', currentKRW: 7758807, investedKRW: 7477697, gainKRW: 281110, gainPercent: 3.76, note: '미래에셋 · +3.76%', type: 'stock' },
  { id: 'family', name: '가족 받을 돈', icon: '👨‍👩‍👧', currentKRW: 20000000, note: '6월 수령 예정', type: 'receivable' },
  { id: 'deposit', name: '전세 보증금', icon: '🏢', currentKRW: 45000000, note: '7월 수령 예정', type: 'receivable' },
]

// 3. 변동성 자산 (언제든 쓸 수 있는 자산) - CMA, 자율적금, IRP - 2026.04.22
const LIQUID_ASSETS = [
  { id: 'cma', name: 'CMA (발행어음)', icon: '💵', currentKRW: 10063001, investedKRW: 10056989, gainKRW: 6012, gainPercent: 0.06, note: '미래에셋 · +0.06%' },
  { id: 'free-savings', name: '자율적금', icon: '💰', currentKRW: 4500000, note: '1년 만기 · 2026-09 · 3.3%' },
  { id: 'irp', name: 'IRP (퇴직연금)', icon: '🏦', currentKRW: 3312857, investedKRW: 3268547, gainKRW: 44310, gainPercent: 1.36, note: '미래에셋 · +1.36%' },
]

// 전체 보유 종목 통합 (실제 데이터 기반 - 2026.04.22)
const GAYOON_ALL_HOLDINGS = [
  // 삼성증권 - 해외주식 (S&P500 + 배당주 + 케이뱅크)
  {
    ticker: 'VOO',
    name: 'Vanguard S&P500 ETF',
    category: '해외주식',
    account: '해외주식',
    accountIcon: '📈',
    investedKRW: 18034965,
    currentKRW: 21062208,
    gainKRW: 3027243,
    gainPercent: 16.79,
    risk: 3,
  },
  {
    ticker: 'VOO(소)',
    name: 'Vanguard S&P500 ETF (소수점)',
    category: '해외주식',
    account: '해외주식',
    accountIcon: '📈',
    investedKRW: 676691,
    currentKRW: 706131,
    gainKRW: 29440,
    gainPercent: 4.35,
    risk: 3,
  },
  {
    ticker: 'SCHD',
    name: 'Schwab 미국 배당주 ETF',
    category: '해외주식',
    account: '해외주식',
    accountIcon: '📈',
    investedKRW: 4047160,
    currentKRW: 4567569,
    gainKRW: 520409,
    gainPercent: 12.86,
    risk: 2,
  },
  {
    ticker: 'KBANK',
    name: '케이뱅크',
    category: '국내주식',
    account: '해외주식',
    accountIcon: '📈',
    investedKRW: 83000,
    currentKRW: 63700,
    gainKRW: -19300,
    gainPercent: -23.25,
    risk: 4,
  },
  // 미래에셋 - 아마존 (종합)
  {
    ticker: 'AMZN',
    name: '아마존 (미래에셋)',
    category: '해외주식',
    account: '종합',
    accountIcon: '🌍',
    shares: 5,
    investedKRW: 1595809,
    currentKRW: 1854752,
    gainKRW: 258943,
    gainPercent: 16.22,
    risk: 4,
  },
  // 삼성증권 - ISA
  {
    ticker: 'KODEX200_ISA',
    name: 'KODEX 200',
    category: '국내대형',
    account: 'ISA',
    accountIcon: '📊',
    investedKRW: 1243665,
    currentKRW: 1459500,
    gainKRW: 215835,
    gainPercent: 17.35,
    risk: 2,
  },
  {
    ticker: 'TIGER나스닥_ISA',
    name: 'TIGER 미국나스닥100',
    category: '나스닥',
    account: 'ISA',
    accountIcon: '📊',
    investedKRW: 2730767,
    currentKRW: 2966840,
    gainKRW: 236073,
    gainPercent: 8.64,
    risk: 4,
  },
  {
    ticker: 'PLUS신흥국_ISA',
    name: 'PLUS 신흥국MSCI(합성H)',
    category: '신흥국',
    account: 'ISA',
    accountIcon: '📊',
    investedKRW: 3096180,
    currentKRW: 3101760,
    gainKRW: 5580,
    gainPercent: 0.18,
    risk: 4,
  },
  {
    ticker: 'KODEX코스닥_ISA',
    name: 'KODEX 코스닥150',
    category: '국내중소',
    account: 'ISA',
    accountIcon: '📊',
    investedKRW: 502320,
    currentKRW: 516620,
    gainKRW: 14300,
    gainPercent: 2.85,
    risk: 3,
  },
  {
    ticker: 'TIGER미국채_ISA',
    name: 'TIGER 미국채10년선물',
    category: '채권',
    account: 'ISA',
    accountIcon: '📊',
    investedKRW: 2405385,
    currentKRW: 2451285,
    gainKRW: 45900,
    gainPercent: 1.91,
    risk: 1,
  },
  {
    ticker: 'TIGERCD_ISA',
    name: 'TIGER CD금리투자KIS',
    category: '현금성',
    account: 'ISA',
    accountIcon: '📊',
    investedKRW: 1032750,
    currentKRW: 1032930,
    gainKRW: 180,
    gainPercent: 0.02,
    risk: 1,
  },
  {
    ticker: 'TIGER_SP_ISA',
    name: 'TIGER 미국S&P500',
    category: 'S&P500',
    account: 'ISA',
    accountIcon: '📊',
    investedKRW: 4888810,
    currentKRW: 5156910,
    gainKRW: 268100,
    gainPercent: 5.48,
    risk: 3,
  },
  {
    ticker: 'ACE미국채_ISA',
    name: 'ACE 미국30년국채액티브(H)',
    category: '채권',
    account: 'ISA',
    accountIcon: '📊',
    investedKRW: 1078935,
    currentKRW: 1079650,
    gainKRW: 715,
    gainPercent: 0.07,
    risk: 1,
  },
  {
    ticker: 'TIGER배당_ISA',
    name: 'TIGER 미국배당다우존스',
    category: '배당',
    account: 'ISA',
    accountIcon: '📊',
    investedKRW: 1408020,
    currentKRW: 1416200,
    gainKRW: 8180,
    gainPercent: 0.58,
    risk: 2,
  },
  {
    ticker: 'KODEX금_ISA',
    name: 'KODEX 금액티브',
    category: '금',
    account: 'ISA',
    accountIcon: '📊',
    investedKRW: 2133740,
    currentKRW: 2036880,
    gainKRW: -96860,
    gainPercent: -4.54,
    risk: 1,
  },
  {
    ticker: 'ISA_CASH',
    name: 'ISA 예수금',
    category: '현금',
    account: 'ISA',
    accountIcon: '📊',
    investedKRW: 0,
    currentKRW: 12851,
    gainKRW: 0,
    gainPercent: 0,
    risk: 1,
  },
  // 미래에셋 - IRP
  {
    ticker: 'KODEX금_IRP',
    name: 'KODEX 금액티브 (IRP)',
    category: '금',
    account: 'IRP',
    accountIcon: '🏦',
    investedKRW: 595200,
    currentKRW: 590400,
    gainKRW: -4800,
    gainPercent: -0.81,
    risk: 1,
  },
  {
    ticker: 'PLUS신흥국_IRP',
    name: 'PLUS 신흥국MSCI(합성H) (IRP)',
    category: '신흥국',
    account: 'IRP',
    accountIcon: '🏦',
    investedKRW: 414697,
    currentKRW: 416440,
    gainKRW: 1743,
    gainPercent: 0.42,
    risk: 4,
  },
  {
    ticker: 'KODEX나스닥_IRP',
    name: 'KODEX 미국나스닥100 (IRP)',
    category: '나스닥',
    account: 'IRP',
    accountIcon: '🏦',
    investedKRW: 1268800,
    currentKRW: 1307750,
    gainKRW: 38950,
    gainPercent: 3.07,
    risk: 4,
  },
  {
    ticker: 'TDF2025',
    name: '미래에셋TDF2025 (IRP)',
    category: '퇴직연금',
    account: 'IRP',
    accountIcon: '🏦',
    investedKRW: 267479,
    currentKRW: 275896,
    gainKRW: 8417,
    gainPercent: 3.15,
    risk: 2,
  },
  {
    ticker: 'IRP_CASH',
    name: 'IRP 현금성자산',
    category: '현금',
    account: 'IRP',
    accountIcon: '🏦',
    investedKRW: 722371,
    currentKRW: 722371,
    gainKRW: 0,
    gainPercent: 0,
    risk: 1,
  },
  // 미래에셋 - 연금저축
  {
    ticker: 'KODEX200_연금',
    name: 'KODEX 200 (연금)',
    category: '국내대형',
    account: '연금저축',
    accountIcon: '🧓',
    shares: 33,
    investedKRW: 2947335,
    currentKRW: 3210900,
    gainKRW: 263565,
    gainPercent: 8.94,
    risk: 2,
  },
  {
    ticker: 'PLUS고배당_연금',
    name: 'PLUS 고배당주 (연금)',
    category: '배당',
    account: '연금저축',
    accountIcon: '🧓',
    shares: 55,
    investedKRW: 1514975,
    currentKRW: 1508650,
    gainKRW: -6325,
    gainPercent: -0.42,
    risk: 2,
  },
  {
    ticker: 'KODEX코스닥_연금',
    name: 'KODEX 코스닥150 (연금)',
    category: '국내중소',
    account: '연금저축',
    accountIcon: '🧓',
    shares: 156,
    investedKRW: 3080430,
    currentKRW: 3099720,
    gainKRW: 19290,
    gainPercent: 0.63,
    risk: 3,
  },
  {
    ticker: 'TIGER나스닥_연금',
    name: 'TIGER 미국나스닥100 (연금)',
    category: '나스닥',
    account: '연금저축',
    accountIcon: '🧓',
    shares: 13,
    investedKRW: 2198010,
    currentKRW: 2268760,
    gainKRW: 70750,
    gainPercent: 3.22,
    risk: 4,
  },
  {
    ticker: 'TIGER_SP_연금',
    name: 'TIGER 미국S&P500 (연금)',
    category: 'S&P500',
    account: '연금저축',
    accountIcon: '🧓',
    shares: 136,
    investedKRW: 3502680,
    currentKRW: 3542120,
    gainKRW: 39440,
    gainPercent: 1.13,
    risk: 3,
  },
  {
    ticker: 'TIGER배당_연금',
    name: 'TIGER 미국배당다우존스 (연금)',
    category: '배당',
    account: '연금저축',
    accountIcon: '🧓',
    shares: 35,
    investedKRW: 507150,
    currentKRW: 511000,
    gainKRW: 3850,
    gainPercent: 0.76,
    risk: 2,
  },
  {
    ticker: 'KODEX금_연금',
    name: 'KODEX 금액티브 (연금)',
    category: '금',
    account: '연금저축',
    accountIcon: '🧓',
    shares: 60,
    investedKRW: 892800,
    currentKRW: 885600,
    gainKRW: -7200,
    gainPercent: -0.81,
    risk: 1,
  },
  {
    ticker: 'TIGERCD_연금',
    name: 'TIGER CD금리투자KIS (연금)',
    category: '현금성',
    account: '연금저축',
    accountIcon: '🧓',
    shares: 8,
    investedKRW: 459000,
    currentKRW: 459080,
    gainKRW: 80,
    gainPercent: 0.02,
    risk: 1,
  },
  // 미래에셋 - 종합 계좌 (국내주식)
  {
    ticker: 'KIA',
    name: '기아',
    category: '국내주식',
    account: '종합(미래에셋)',
    accountIcon: '🏢',
    shares: 3,
    investedKRW: 474600,
    currentKRW: 480000,
    gainKRW: 5400,
    gainPercent: 1.14,
    risk: 3,
  },
  {
    ticker: 'SAMSUNG_FIRE',
    name: '삼성화재',
    category: '국내주식',
    account: '종합(미래에셋)',
    accountIcon: '🏢',
    shares: 2,
    investedKRW: 943000,
    currentKRW: 923000,
    gainKRW: -20000,
    gainPercent: -2.12,
    risk: 2,
  },
  {
    ticker: 'SKT',
    name: 'SK텔레콤',
    category: '국내주식',
    account: '종합(미래에셋)',
    accountIcon: '🏢',
    shares: 4,
    investedKRW: 396400,
    currentKRW: 401200,
    gainKRW: 4800,
    gainPercent: 1.21,
    risk: 2,
  },
  {
    ticker: 'HANA',
    name: '하나금융지주',
    category: '국내주식',
    account: '종합(미래에셋)',
    accountIcon: '🏢',
    shares: 6,
    investedKRW: 743400,
    currentKRW: 717000,
    gainKRW: -26400,
    gainPercent: -3.55,
    risk: 3,
  },
  {
    ticker: 'CVX',
    name: '셰브론',
    category: '해외주식',
    account: '종합(미래에셋)',
    accountIcon: '🏢',
    shares: 6,
    investedKRW: 1629588,
    currentKRW: 1645472,
    gainKRW: 15884,
    gainPercent: 0.97,
    risk: 3,
  },
  {
    ticker: 'UNH',
    name: '유나이티드헬스',
    category: '해외주식',
    account: '종합(미래에셋)',
    accountIcon: '🏢',
    shares: 7,
    investedKRW: 3290709,
    currentKRW: 3592135,
    gainKRW: 301426,
    gainPercent: 9.16,
    risk: 3,
  },
  // 미래에셋 - CMA 발행어음
  {
    ticker: 'CMA',
    name: '발행어음CMA',
    category: 'CMA',
    account: 'CMA',
    accountIcon: '💵',
    investedKRW: 10056989,
    currentKRW: 10063001,
    gainKRW: 6012,
    gainPercent: 0.06,
    risk: 1,
  },
  // 업비트 - 암호화폐
  {
    ticker: 'BTC',
    name: '비트코인 (BTC)',
    category: '암호화폐',
    account: '암호화폐',
    accountIcon: '₿',
    btcAmount: 0.01076814,
    investedKRW: 1098351,
    currentKRW: 1344337,
    gainKRW: 245986,
    gainPercent: 22.40,
    risk: 5,
  },
]

// 카테고리별 색상
const CATEGORY_COLORS = {
  'S&P500': '#3182F6',
  '나스닥': '#7C3AED',
  '신흥국': '#10B981',
  '금': '#F59E0B',
  '채권': '#6B7280',
  '국내대형': '#EF4444',
  '국내중소': '#F97316',
}

// 자산명 → 카테고리 매핑
const getAssetCategory = (name) => {
  if (name.includes('S&P') || name.includes('SPY')) return 'S&P500'
  if (name.includes('나스닥')) return '나스닥'
  if (name.includes('신흥국')) return '신흥국'
  if (name.includes('금')) return '금'
  if (name.includes('채권')) return '채권'
  if (name.includes('코스피') || name.includes('KODEX 200')) return '국내대형'
  if (name.includes('코스닥')) return '국내중소'
  return '기타'
}

// 안정자산 여부 판단 (금, 채권 = 안정자산)
const isSafeAsset = (name) => {
  return name.includes('금') || name.includes('골드') || name.includes('채권')
}

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
function PortfolioChart({ icon, title, subtitle, amount, status, statusColor, items, isMobile = false }) {
  // 안정자산 비율 계산 (risk <= 2: 안정, risk >= 3: 위험)
  const safeAssetWeight = items
    .filter(item => item.risk <= 2)
    .reduce((sum, item) => sum + item.targetWeight, 0)
  const riskAssetWeight = 100 - safeAssetWeight

  // 평균 위험도 계산
  const avgRisk = items.reduce((sum, item) => sum + (item.risk * item.targetWeight), 0) / 100

  return (
    <div style={{
      padding: isMobile ? '14px' : '20px',
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #E5E8EB',
    }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isMobile ? '10px' : '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: isMobile ? '18px' : '20px' }}>{icon}</span>
          <div>
            <div style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: '#191F28' }}>{title}</div>
            {subtitle && <div style={{ fontSize: '11px', color: '#3182F6', marginBottom: '2px' }}>{subtitle}</div>}
            <div style={{ fontSize: isMobile ? '11px' : '13px', color: '#8B95A1' }}>{amount > 0 ? `${(amount / 10000).toLocaleString()}만원` : '전략 포트폴리오'}</div>
          </div>
        </div>
        <div style={{
          padding: isMobile ? '3px 8px' : '4px 10px',
          backgroundColor: statusColor.bg,
          borderRadius: '6px',
          fontSize: isMobile ? '10px' : '11px',
          fontWeight: '600',
          color: statusColor.text,
        }}>
          {status}
        </div>
      </div>

      {/* 위험/안정 자산 비율 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isMobile ? '10px' : '12px',
        padding: isMobile ? '8px 10px' : '10px 12px',
        backgroundColor: '#F7F8FA',
        borderRadius: '8px',
      }}>
        <div style={{ display: 'flex', gap: isMobile ? '8px' : '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <span style={{ fontSize: isMobile ? '10px' : '12px', color: '#4E5968' }}>위험 {riskAssetWeight}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span style={{ fontSize: isMobile ? '10px' : '12px', color: '#4E5968' }}>안정 {safeAssetWeight}%</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: isMobile ? '9px' : '11px', color: '#8B95A1' }}>평균</span>
          <RiskStars risk={Math.round(avgRisk)} />
        </div>
      </div>

      {/* 스택 바 차트 */}
      <div style={{
        display: 'flex',
        height: isMobile ? '24px' : '28px',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: isMobile ? '10px' : '12px',
      }}>
        {items.map((item, index) => {
          const category = getAssetCategory(item.name)
          const color = CATEGORY_COLORS[category] || '#9CA3AF'
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
                fontSize: isMobile ? '9px' : '10px',
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

      {/* 자산별 상세 (종목코드, 금액, 위험도 포함) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '4px' : '6px' }}>
        {items.map(item => {
          const category = getAssetCategory(item.name)
          const color = CATEGORY_COLORS[category] || '#9CA3AF'
          const itemAmount = Math.round(amount * item.targetWeight / 100)
          const isSafe = item.risk <= 2
          return (
            <div key={item.ticker} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: isMobile ? '6px 8px' : '8px 10px',
              backgroundColor: isSafe ? '#F0FDF4' : '#FFFBEB',
              borderRadius: '8px',
              fontSize: isMobile ? '10px' : '11px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '8px', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '2px',
                  backgroundColor: color,
                  flexShrink: 0,
                }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '6px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#4E5968', fontWeight: '600', fontSize: isMobile ? '10px' : '11px' }}>
                      {item.name.replace('TIGER ', '').replace('KODEX ', '')}
                    </span>
                    <RiskStars risk={item.risk} />
                  </div>
                  <span style={{ color: '#8B95A1', fontSize: isMobile ? '8px' : '10px' }}>{item.ticker}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '10px', flexShrink: 0 }}>
                <span style={{ color: '#6B7684', fontSize: isMobile ? '10px' : '12px' }}>{item.targetWeight}%</span>
                <span style={{ color: '#191F28', fontWeight: '700', fontSize: isMobile ? '10px' : '12px', minWidth: isMobile ? '40px' : '50px', textAlign: 'right' }}>
                  {(itemAmount / 10000).toLocaleString()}만
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: '100%', overflowX: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#191F28', margin: 0 },
  subtitle: { fontSize: '14px', color: '#8B95A1', marginTop: '4px' },
  lastUpdate: { fontSize: '12px', color: '#8B95A1', marginTop: '8px', display: 'flex', alignItems: 'center' },
  statusDot: (isLive) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: isLive ? '#00C853' : '#F57F17',
    display: 'inline-block',
    marginRight: '8px',
  }),
  rulesCard: { backgroundColor: '#FFF9E6', borderRadius: '16px', padding: '20px', marginBottom: '24px', border: '1px solid #FFE082' },
  rulesTitle: { fontSize: '14px', fontWeight: '700', color: '#F57F17', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' },
  rulesList: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: '#5D4037' },
  ruleItem: { display: 'flex', alignItems: 'flex-start', gap: '8px' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  summaryCard: { backgroundColor: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #E5E8EB' },
  summaryLabel: { fontSize: '13px', color: '#8B95A1', marginBottom: '8px' },
  summaryValue: { fontSize: '24px', fontWeight: '700', color: '#191F28' },
}

export default function GayoonWealthPage() {
  const navigate = useNavigate()
  const [currentQuarter, setCurrentQuarter] = useState('Q2')

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

  // 보유 종목 필터 상태
  const [holdingsFilter, setHoldingsFilter] = useState({
    account: 'all', // all, ISA, 연금저축, IRP, 해외주식, 암호화폐
    sort: 'value', // value, gain, name, invested
    sortDir: 'desc', // asc, desc
  })

  // 정렬 토글 함수
  const toggleSort = (sortKey) => {
    if (holdingsFilter.sort === sortKey) {
      // 같은 컬럼 클릭 시 방향 토글
      setHoldingsFilter({
        ...holdingsFilter,
        sortDir: holdingsFilter.sortDir === 'desc' ? 'asc' : 'desc'
      })
    } else {
      // 다른 컬럼 클릭 시 해당 컬럼으로 변경 (기본 내림차순)
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

  // localStorage에서 캐시된 가격 불러오기
  const getCachedPrices = () => {
    try {
      const cached = localStorage.getItem('btcPrice')
      if (cached) {
        const { price, timestamp } = JSON.parse(cached)
        // 1시간 이내 캐시는 유효
        if (Date.now() - timestamp < 3600000) {
          return price
        }
      }
    } catch {}
    return 125000000 // 기본값 1.25억
  }

  const [prices, setPrices] = useState({ btc: getCachedPrices(), usdkrw: 1450, stocks: {} })
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)

  // 미국 주식 티커 목록
  const US_STOCK_TICKERS = ['VOO', 'SCHD', 'AMZN']

  // 실시간 시세 가져오기 (5분마다, 에러 방지)
  useEffect(() => {
    const fetchAllPrices = async () => {
      setLoading(true)
      try {
        // 1. 미국 주식 시세 (Yahoo Finance)
        const [stockPrices, exchangeRate] = await Promise.all([
          fetchMultipleStockPrices(US_STOCK_TICKERS),
          fetchExchangeRate()
        ])

        setPrices(prev => ({
          ...prev,
          stocks: stockPrices,
          usdkrw: exchangeRate
        }))

        // 2. BTC 가격 (CoinGecko) - 에러 시 캐시 사용
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5초 타임아웃

        const btcRes = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=krw',
          { signal: controller.signal }
        )
        clearTimeout(timeoutId)

        if (btcRes.ok) {
          const btcData = await btcRes.json()
          const btcPrice = btcData?.bitcoin?.krw

          if (btcPrice) {
            // localStorage에 캐시 저장
            localStorage.setItem('btcPrice', JSON.stringify({
              price: btcPrice,
              timestamp: Date.now()
            }))

            setPrices(prev => ({ ...prev, btc: btcPrice }))
          }
        }

        setLastUpdate(new Date())
      } catch (error) {
        // 에러 시 조용히 무시 (캐시된 값 사용)
        console.log('시세 조회 스킵:', error.name)
      } finally {
        setLoading(false)
      }
    }

    // 첫 로드 시 약간 지연 후 fetch (rate limit 방지)
    const initialDelay = setTimeout(fetchAllPrices, 1000)

    // 5분마다 갱신 (rate limit 방지)
    const interval = setInterval(fetchAllPrices, 300000)

    return () => {
      clearTimeout(initialDelay)
      clearInterval(interval)
    }
  }, [])

  // 실시간 자산 계산 (주식 + 비트코인)
  const trackedAssetsWithReturns = TRACKED_ASSETS.map(asset => {
    // 비트코인은 실시간 가격 사용
    if (asset.type === 'crypto' && prices.btc) {
      const currentValue = asset.btcAmount * prices.btc
      const gainKRW = currentValue - asset.investedKRW
      const returnRate = (gainKRW / asset.investedKRW) * 100
      return { ...asset, currentKRW: currentValue, gainKRW, returnRate }
    }
    // 아마존은 실시간 가격 사용
    if (asset.id === 'amazon' && prices.stocks?.AMZN) {
      const stockData = prices.stocks.AMZN
      const currentValue = asset.shares * stockData.price * prices.usdkrw
      const gainKRW = currentValue - asset.investedKRW
      const returnRate = (gainKRW / asset.investedKRW) * 100
      return { ...asset, currentKRW: Math.round(currentValue), gainKRW: Math.round(gainKRW), returnRate }
    }
    // 나머지는 기존 데이터 사용
    return { ...asset, returnRate: asset.gainPercent }
  })

  // STABLE_ASSETS 실시간 업데이트 (S&P500 + 배당주)
  const updatedStableAssets = STABLE_ASSETS.map(asset => {
    if (asset.id === 'sp500-dividend' && prices.stocks?.VOO && prices.stocks?.SCHD) {
      // VOO + SCHD 합산 (실시간)
      const vooData = prices.stocks.VOO
      const schdData = prices.stocks.SCHD
      // VOO: 약 32주, SCHD: 약 55주 (기존 데이터 기반 추정)
      const vooShares = 32
      const schdShares = 55
      const vooValue = vooShares * vooData.price * prices.usdkrw
      const schdValue = schdShares * schdData.price * prices.usdkrw
      const currentValue = vooValue + schdValue
      const gainKRW = currentValue - asset.investedKRW
      const gainPercent = (gainKRW / asset.investedKRW) * 100
      return {
        ...asset,
        currentKRW: Math.round(currentValue),
        gainKRW: Math.round(gainKRW),
        gainPercent: Math.round(gainPercent * 100) / 100,
        note: `삼성증권 · ${gainPercent >= 0 ? '+' : ''}${gainPercent.toFixed(2)}% (실시간)`,
      }
    }
    return asset
  })

  const quarterInfo = QUARTERLY_PORTFOLIOS[currentQuarter]
  const PORTFOLIO = quarterInfo?.portfolio || []
  const isLive = lastUpdate !== null

  // GAYOON_ALL_HOLDINGS 실시간 업데이트 (shares가 있는 종목만)
  const liveHoldings = GAYOON_ALL_HOLDINGS.map(item => {
    // AMZN - shares가 있음 (9주)
    if (item.ticker === 'AMZN' && item.shares && prices.stocks?.AMZN) {
      const stockData = prices.stocks.AMZN
      const currentKRW = item.shares * stockData.price * prices.usdkrw
      const gainKRW = currentKRW - item.investedKRW
      const gainPercent = (gainKRW / item.investedKRW) * 100
      return { ...item, currentKRW: Math.round(currentKRW), gainKRW: Math.round(gainKRW), gainPercent: Math.round(gainPercent * 100) / 100, isLive: true }
    }
    // BTC - btcAmount가 있음
    if (item.ticker === 'BTC' && item.btcAmount && prices.btc) {
      const currentKRW = item.btcAmount * prices.btc
      const gainKRW = currentKRW - item.investedKRW
      const gainPercent = (gainKRW / item.investedKRW) * 100
      return { ...item, currentKRW: Math.round(currentKRW), gainKRW: Math.round(gainKRW), gainPercent: Math.round(gainPercent * 100) / 100, isLive: true }
    }
    // VOO, SCHD 등은 shares 정보가 없으므로 원본 데이터 유지
    return item
  })

  // 총 투자 원금 계산
  const TOTAL_INVESTMENT = liveHoldings.reduce((sum, item) => sum + item.investedKRW, 0)

  // 총 자산 계산 (새 구조) - 실시간 반영
  const totalTracked = trackedAssetsWithReturns.reduce((sum, item) => sum + (item.currentKRW || 0), 0)
  const totalFixed = FIXED_ASSETS.reduce((sum, item) => sum + item.currentKRW, 0)
  const totalStable = updatedStableAssets.reduce((sum, item) => sum + item.currentKRW, 0) + totalTracked
  const totalLiquid = LIQUID_ASSETS.reduce((sum, item) => sum + item.currentKRW, 0)
  const totalReceivables = updatedStableAssets.filter(a => a.type === 'receivable').reduce((sum, item) => sum + item.currentKRW, 0)
  const totalCurrentAssets = totalFixed + totalStable + totalLiquid - totalReceivables // 받을돈 중복 제거

  // 총 손익 계산 (실시간)
  const totalGainHoldings = liveHoldings.reduce((sum, item) => sum + (item.gainKRW || 0), 0)
  const totalGainPercent = TOTAL_INVESTMENT > 0 ? (totalGainHoldings / TOTAL_INVESTMENT) * 100 : 0

  return (
    <div style={styles.container}>
      {/* 헤더 */}
      <div style={{
        ...styles.header,
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? '16px' : '0',
      }}>
        <div>
          <h1 style={{ ...styles.title, fontSize: isMobile ? '20px' : '24px' }}>🐰 가윤 달리오</h1>
          <p style={{ ...styles.subtitle, fontSize: isMobile ? '12px' : '14px' }}>
            {quarterInfo?.label} ({quarterInfo?.period}) · 투자 원금: ₩{TOTAL_INVESTMENT.toLocaleString()}
            <span style={{
              marginLeft: '8px',
              color: totalGainHoldings >= 0 ? '#00C853' : '#F04438',
              fontWeight: '600'
            }}>
              ({totalGainHoldings >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}%)
            </span>
          </p>
          <p style={{ ...styles.lastUpdate, fontSize: isMobile ? '11px' : '12px' }}>
            <span style={styles.statusDot(isLive)} />
            {isLive ? '실시간' : '데이터 로딩 중...'}
            {lastUpdate && ` · ${lastUpdate.toLocaleTimeString()}`}
            {prices.usdkrw && !isMobile && ` · 환율: $1 = ₩${prices.usdkrw.toLocaleString()}`}
          </p>
        </div>
        <button
          onClick={() => navigate('/gayoon/report')}
          style={{
            padding: isMobile ? '10px 16px' : '12px 20px',
            backgroundColor: '#3182F6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: isMobile ? '13px' : '14px',
            fontWeight: '600',
            cursor: 'pointer',
            width: isMobile ? '100%' : 'auto',
          }}
        >
          📊 상세 리포트
        </button>
      </div>

      {/* 분기 선택 탭 */}
      <div style={{
        display: 'flex',
        gap: isMobile ? '4px' : '8px',
        marginBottom: '24px',
        padding: '4px',
        backgroundColor: '#F2F4F6',
        borderRadius: '12px',
        width: isMobile ? '100%' : 'fit-content',
        overflowX: 'auto',
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
                padding: isMobile ? '8px 14px' : '10px 20px',
                borderRadius: '8px',
                border: isActive && isEmpty ? '1px solid #3182F6' : 'none',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: isActive ? 'white' : 'transparent',
                color: isActive ? '#3182F6' : isEmpty ? '#B0B8C1' : '#4E5968',
                boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                opacity: isEmpty && !isActive ? 0.6 : 1,
                flexShrink: 0,
              }}
            >
              {quarter}
              {isEmpty && <span style={{ marginLeft: '4px', fontSize: '10px' }}>예정</span>}
            </button>
          )
        })}
      </div>

      {/* 빈 포트폴리오 (Q2, Q3, Q4) */}
      {PORTFOLIO.length === 0 ? (
        <>
          {/* 경고 배너 */}
          <div style={{
            padding: isMobile ? '14px 16px' : '16px 20px',
            backgroundColor: '#FFF5F5',
            borderRadius: '12px',
            border: '1px solid #FFCDD2',
            marginBottom: '24px',
            textAlign: 'center',
            color: '#D32F2F',
            fontSize: isMobile ? '13px' : '14px',
            fontWeight: '500',
          }}>
            ⚠️ 이 분기의 포트폴리오가 아직 구성되지 않았습니다.
          </div>

          {/* 빈 상태 카드 */}
          <div style={{
            padding: isMobile ? '40px 24px' : '60px 40px',
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #E5E8EB',
            textAlign: 'center',
            marginBottom: '24px',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <h2 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '700', color: '#191F28', marginBottom: '8px' }}>
              {quarterInfo?.label} 포트폴리오
            </h2>
            <p style={{ fontSize: isMobile ? '13px' : '14px', color: '#8B95A1', marginBottom: '24px', lineHeight: '1.6' }}>
              아직 이 분기의 포트폴리오가 구성되지 않았습니다.<br />
              분기 시작 전에 리밸런싱 계획을 세워보세요.
            </p>
            <div style={{
              padding: '16px',
              backgroundColor: '#F7F8FA',
              borderRadius: '12px',
              fontSize: isMobile ? '12px' : '13px',
              color: '#4E5968',
            }}>
              💡 <strong>팁:</strong> 분기별로 포트폴리오를 재구성하면 시장 상황에 맞게 자산을 조정할 수 있습니다.
            </div>
          </div>
        </>
      ) : (
      <>
      {/* 시세 업데이트 안내 */}
      {lastUpdate && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
          fontSize: '11px',
          color: '#8B95A1',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00C853' }} />
          실시간 시세 · {lastUpdate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 업데이트
        </div>
      )}

      {/* 요약 카드 */}
      <div style={{
        ...styles.summaryGrid,
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? '12px' : '16px',
      }}>
        <div style={{ ...styles.summaryCard, padding: isMobile ? '14px' : '20px' }}>
          <div style={{ ...styles.summaryLabel, fontSize: isMobile ? '11px' : '13px' }}>총 자산 (현재)</div>
          <div style={{ ...styles.summaryValue, fontSize: isMobile ? '18px' : '24px' }}>₩{Math.round(totalCurrentAssets).toLocaleString()}</div>
          <div style={{ fontSize: isMobile ? '10px' : '12px', color: '#3182F6', marginTop: '4px' }}>
            {(totalCurrentAssets / 100000000).toFixed(2)}억
          </div>
        </div>
        <div style={{ ...styles.summaryCard, padding: isMobile ? '14px' : '20px' }}>
          <div style={{ ...styles.summaryLabel, fontSize: isMobile ? '11px' : '13px' }}>고정자산</div>
          <div style={{ ...styles.summaryValue, fontSize: isMobile ? '18px' : '24px' }}>₩{totalFixed.toLocaleString()}</div>
          <div style={{ fontSize: isMobile ? '10px' : '12px', color: '#8B95A1', marginTop: '4px' }}>
            빼면 손해
          </div>
        </div>
        <div style={{ ...styles.summaryCard, padding: isMobile ? '14px' : '20px' }}>
          <div style={{ ...styles.summaryLabel, fontSize: isMobile ? '11px' : '13px' }}>비변동성 자산</div>
          <div style={{ ...styles.summaryValue, fontSize: isMobile ? '18px' : '24px' }}>₩{Math.round(totalStable).toLocaleString()}</div>
          <div style={{ fontSize: isMobile ? '10px' : '12px', color: '#3182F6', marginTop: '4px' }}>
            투자 + 받을돈
          </div>
        </div>
        <div style={{ ...styles.summaryCard, padding: isMobile ? '14px' : '20px' }}>
          <div style={{ ...styles.summaryLabel, fontSize: isMobile ? '11px' : '13px' }}>변동성 자산</div>
          <div style={{ ...styles.summaryValue, fontSize: isMobile ? '18px' : '24px' }}>₩{totalLiquid.toLocaleString()}</div>
          <div style={{ fontSize: isMobile ? '10px' : '12px', color: '#00C853', marginTop: '4px' }}>
            언제든 사용
          </div>
        </div>
      </div>

      {/* 1. 고정자산 */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: '#191F28', marginBottom: '4px' }}>🔒 고정자산</h3>
        <p style={{ fontSize: isMobile ? '11px' : '12px', color: '#8B95A1', margin: 0 }}>빼면 손해나는 자산</p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? '10px' : '12px',
        marginBottom: '24px',
      }}>
        {FIXED_ASSETS.map(item => (
          <div key={item.id} style={{
            padding: isMobile ? '12px' : '16px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: `1px solid ${item.gainKRW > 0 ? '#E8F5E9' : item.gainKRW < 0 ? '#FFEBEE' : '#E5E8EB'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: isMobile ? '18px' : '20px' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '600', color: '#191F28' }}>{item.name}</div>
                  <div style={{ fontSize: isMobile ? '9px' : '10px', color: '#8B95A1' }}>{item.note}</div>
                </div>
              </div>
              {item.gainPercent !== undefined && (
                <div style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: isMobile ? '9px' : '10px',
                  fontWeight: '600',
                  backgroundColor: item.gainPercent >= 0 ? '#E8F5E9' : '#FFEBEE',
                  color: item.gainPercent >= 0 ? '#00C853' : '#F04438',
                }}>
                  {item.gainPercent >= 0 ? '+' : ''}{item.gainPercent.toFixed(2)}%
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#191F28' }}>
                ₩{item.currentKRW.toLocaleString()}
              </div>
              {item.gainKRW !== undefined && (
                <div style={{ fontSize: isMobile ? '10px' : '11px', color: item.gainKRW >= 0 ? '#00C853' : '#F04438', fontWeight: '600' }}>
                  {item.gainKRW >= 0 ? '+' : ''}₩{item.gainKRW.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 2. 비변동성 자산 */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: '#191F28', marginBottom: '4px' }}>📈 비변동성 자산</h3>
        <p style={{ fontSize: isMobile ? '11px' : '12px', color: '#8B95A1', margin: 0 }}>투자 중인 자산 + 받을 돈</p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? '10px' : '12px',
        marginBottom: '24px',
      }}>
        {/* S&P500 */}
        {STABLE_ASSETS.filter(a => a.type === 'stock').map(item => (
          <div key={item.id} style={{
            padding: isMobile ? '12px' : '16px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: `1px solid ${item.gainKRW >= 0 ? '#E8F5E9' : '#FFEBEE'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: isMobile ? '18px' : '20px' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '600', color: '#191F28' }}>{item.name}</div>
                  <div style={{ fontSize: isMobile ? '9px' : '10px', color: '#8B95A1' }}>{item.note}</div>
                </div>
              </div>
              {item.gainPercent !== undefined && (
                <div style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: isMobile ? '9px' : '10px',
                  fontWeight: '600',
                  backgroundColor: item.gainPercent >= 0 ? '#E8F5E9' : '#FFEBEE',
                  color: item.gainPercent >= 0 ? '#00C853' : '#F04438',
                }}>
                  {item.gainPercent >= 0 ? '+' : ''}{item.gainPercent.toFixed(2)}%
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: item.gainKRW >= 0 ? '#00C853' : '#F04438' }}>
                ₩{item.currentKRW.toLocaleString()}
              </div>
              {item.gainKRW !== undefined && (
                <div style={{ fontSize: isMobile ? '10px' : '11px', color: item.gainKRW >= 0 ? '#00C853' : '#F04438', fontWeight: '600' }}>
                  {item.gainKRW >= 0 ? '+' : ''}₩{item.gainKRW.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* 아마존, 비트코인 (실시간 추적) */}
        {trackedAssetsWithReturns.map(asset => (
          <div key={asset.id} style={{
            padding: isMobile ? '12px' : '16px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: `1px solid ${asset.returnRate >= 0 ? '#E8F5E9' : '#FFEBEE'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: isMobile ? '18px' : '20px' }}>{asset.icon}</span>
                <div>
                  <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '600', color: '#191F28' }}>{asset.name}</div>
                  <div style={{ fontSize: isMobile ? '9px' : '10px', color: '#8B95A1' }}>{asset.note}</div>
                </div>
              </div>
              <div style={{
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: isMobile ? '9px' : '10px',
                fontWeight: '600',
                backgroundColor: asset.returnRate >= 0 ? '#E8F5E9' : '#FFEBEE',
                color: asset.returnRate >= 0 ? '#00C853' : '#F04438',
              }}>
                {`${asset.returnRate >= 0 ? '+' : ''}${asset.returnRate.toFixed(1)}%`}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#191F28' }}>
                ₩{Math.round(asset.currentKRW).toLocaleString()}
              </div>
              <div style={{ fontSize: isMobile ? '9px' : '10px', color: '#8B95A1' }}>
                매입 ₩{asset.investedKRW.toLocaleString()}
              </div>
            </div>
            {asset.type === 'crypto' && prices.btc && (
              <div style={{ fontSize: isMobile ? '8px' : '9px', color: '#6B7684', marginTop: '4px' }}>
                BTC ₩{prices.btc.toLocaleString()}
              </div>
            )}
          </div>
        ))}

        {/* 받을 돈 */}
        {STABLE_ASSETS.filter(a => a.type === 'receivable').map(item => (
          <div key={item.id} style={{
            padding: isMobile ? '12px' : '16px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #F3E5F5',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: isMobile ? '18px' : '20px' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '600', color: '#191F28' }}>{item.name}</div>
                <div style={{ fontSize: isMobile ? '9px' : '10px', color: '#8B95A1' }}>{item.note}</div>
              </div>
            </div>
            <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#9C27B0' }}>
              ₩{item.currentKRW.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* 3. 변동성 자산 */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: '#191F28', marginBottom: '4px' }}>💧 변동성 자산</h3>
        <p style={{ fontSize: isMobile ? '11px' : '12px', color: '#8B95A1', margin: 0 }}>언제든 쓸 수 있는 자산</p>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? '10px' : '12px',
        marginBottom: '24px',
      }}>
        {LIQUID_ASSETS.map(item => (
          <div key={item.id} style={{
            padding: isMobile ? '12px' : '16px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: `1px solid ${item.gainKRW > 0 ? '#E8F5E9' : item.gainKRW < 0 ? '#FFEBEE' : '#E5E8EB'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: isMobile ? '18px' : '20px' }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: isMobile ? '13px' : '14px', fontWeight: '600', color: '#191F28' }}>{item.name}</div>
                  <div style={{ fontSize: isMobile ? '9px' : '10px', color: '#8B95A1' }}>{item.note}</div>
                </div>
              </div>
              {item.gainPercent !== undefined && (
                <div style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: isMobile ? '9px' : '10px',
                  fontWeight: '600',
                  backgroundColor: item.gainPercent >= 0 ? '#E8F5E9' : '#FFEBEE',
                  color: item.gainPercent >= 0 ? '#00C853' : '#F04438',
                }}>
                  {item.gainPercent >= 0 ? '+' : ''}{item.gainPercent.toFixed(2)}%
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#191F28' }}>
                ₩{item.currentKRW.toLocaleString()}
              </div>
              {item.gainKRW !== undefined && (
                <div style={{ fontSize: isMobile ? '10px' : '11px', color: item.gainKRW >= 0 ? '#00C853' : '#F04438', fontWeight: '600' }}>
                  {item.gainKRW >= 0 ? '+' : ''}₩{item.gainKRW.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ))}
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
        {/* ISA 포트폴리오 */}
        <PortfolioChart
          icon="📈"
          title="ISA"
          amount={20000000}
          status="완료"
          statusColor={{ bg: '#E8F5E9', text: '#2E7D32' }}
          items={ISA_PORTFOLIO}
          isMobile={isMobile}
        />

        {/* 연금저축 포트폴리오 */}
        <PortfolioChart
          icon="🧓"
          title="연금저축"
          amount={15000000}
          status="진행중"
          statusColor={{ bg: '#E8F3FF', text: '#3182F6' }}
          items={PENSION_PORTFOLIO}
          isMobile={isMobile}
        />

        {/* IRP 포트폴리오 */}
        <PortfolioChart
          icon="🏦"
          title="IRP"
          amount={3000000}
          status="진행중"
          statusColor={{ bg: '#E8F3FF', text: '#3182F6' }}
          items={IRP_PORTFOLIO}
          isMobile={isMobile}
        />

      </div>

      {/* 보유 종목 테이블 */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: '#191F28', marginBottom: '12px' }}>💼 보유 종목</h3>
      </div>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '1px solid #E5E8EB',
        overflow: 'hidden',
        marginBottom: '24px',
      }}>
        {/* 헤더 */}
        <div style={{
          padding: isMobile ? '12px 16px' : '16px 20px',
          borderBottom: '1px solid #E5E8EB',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? '4px' : '0',
        }}>
          <span style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: '#191F28' }}>전체 보유 종목</span>
          <span style={{ fontSize: '13px', color: '#8B95A1' }}>
            {liveHoldings.length}개 종목
            {isLive && <span style={{ marginLeft: '6px', color: '#00C853', fontSize: '11px' }}>● 실시간</span>}
          </span>
        </div>

        {/* 필터 */}
        <div style={{
          padding: isMobile ? '10px 16px' : '12px 20px',
          borderBottom: '1px solid #E5E8EB',
          display: 'flex',
          gap: isMobile ? '12px' : '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#8B95A1' }}>계좌:</span>
            {[
              { value: 'all', label: '전체' },
              { value: '해외주식', label: '해외주식' },
              { value: 'ISA', label: 'ISA' },
              { value: '연금저축', label: '연금저축' },
              { value: 'IRP', label: 'IRP' },
              { value: '종합(미래에셋)', label: '종합' },
              { value: 'CMA', label: 'CMA' },
              { value: '미래에셋', label: '미래에셋' },
              { value: '암호화폐', label: '암호화폐' },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setHoldingsFilter({ ...holdingsFilter, account: opt.value })}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  backgroundColor: holdingsFilter.account === opt.value ? '#3182F6' : '#F2F4F6',
                  color: holdingsFilter.account === opt.value ? 'white' : '#4E5968',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#8B95A1' }}>정렬:</span>
            <select
              value={holdingsFilter.sort}
              onChange={(e) => setHoldingsFilter({ ...holdingsFilter, sort: e.target.value, sortDir: 'desc' })}
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
              <option value="invested">매입금액순</option>
              <option value="gain">수익률순</option>
              <option value="gainKRW">손익금액순</option>
              <option value="name">이름순</option>
            </select>
            <button
              onClick={() => setHoldingsFilter({ ...holdingsFilter, sortDir: holdingsFilter.sortDir === 'desc' ? 'asc' : 'desc' })}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #E5E8EB',
                fontSize: '12px',
                color: '#4E5968',
                cursor: 'pointer',
                backgroundColor: 'white',
              }}
            >
              {holdingsFilter.sortDir === 'desc' ? '▼ 내림' : '▲ 오름'}
            </button>
          </div>
        </div>

        {/* 테이블 */}
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? '320px' : '900px', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                {!isMobile && <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#8B95A1', backgroundColor: '#F7F8FA', borderBottom: '1px solid #E5E8EB', width: '90px' }}>계좌</th>}
                <th
                  onClick={() => toggleSort('name')}
                  style={{ padding: isMobile ? '8px 4px 8px 8px' : '12px 16px', textAlign: 'left', fontSize: isMobile ? '10px' : '12px', fontWeight: '600', color: holdingsFilter.sort === 'name' ? '#3182F6' : '#8B95A1', backgroundColor: '#F7F8FA', borderBottom: '1px solid #E5E8EB', cursor: 'pointer', userSelect: 'none', width: isMobile ? 'auto' : '200px' }}
                >
                  종목명<SortArrow column="name" />
                </th>
                <th
                  onClick={() => toggleSort('invested')}
                  style={{ padding: isMobile ? '8px 2px' : '12px 16px', textAlign: 'right', fontSize: isMobile ? '10px' : '12px', fontWeight: '600', color: holdingsFilter.sort === 'invested' ? '#3182F6' : '#8B95A1', backgroundColor: '#F7F8FA', borderBottom: '1px solid #E5E8EB', cursor: 'pointer', userSelect: 'none', width: isMobile ? 'auto' : '130px' }}
                >
                  매입<SortArrow column="invested" />
                </th>
                <th
                  onClick={() => toggleSort('value')}
                  style={{ padding: isMobile ? '8px 2px' : '12px 16px', textAlign: 'right', fontSize: isMobile ? '10px' : '12px', fontWeight: '600', color: holdingsFilter.sort === 'value' ? '#3182F6' : '#8B95A1', backgroundColor: '#F7F8FA', borderBottom: '1px solid #E5E8EB', cursor: 'pointer', userSelect: 'none', width: isMobile ? 'auto' : '130px' }}
                >
                  평가<SortArrow column="value" />
                </th>
                {!isMobile && (
                  <th
                    onClick={() => toggleSort('gainKRW')}
                    style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: holdingsFilter.sort === 'gainKRW' ? '#3182F6' : '#8B95A1', backgroundColor: '#F7F8FA', borderBottom: '1px solid #E5E8EB', width: '130px', cursor: 'pointer', userSelect: 'none' }}
                  >
                    손익<SortArrow column="gainKRW" />
                  </th>
                )}
                <th
                  onClick={() => toggleSort('gain')}
                  style={{ padding: isMobile ? '8px 8px 8px 2px' : '12px 16px', textAlign: 'right', fontSize: isMobile ? '10px' : '12px', fontWeight: '600', color: holdingsFilter.sort === 'gain' ? '#3182F6' : '#8B95A1', backgroundColor: '#F7F8FA', borderBottom: '1px solid #E5E8EB', cursor: 'pointer', userSelect: 'none', width: isMobile ? 'auto' : '100px' }}
                >
                  수익률<SortArrow column="gain" />
                </th>
              </tr>
            </thead>
            <tbody>
              {liveHoldings
                // 필터 적용
                .filter(item => {
                  if (holdingsFilter.account !== 'all' && item.account !== holdingsFilter.account) return false
                  return true
                })
                // 정렬 적용
                .sort((a, b) => {
                  const dir = holdingsFilter.sortDir === 'desc' ? 1 : -1
                  if (holdingsFilter.sort === 'value') return (b.currentKRW - a.currentKRW) * dir
                  if (holdingsFilter.sort === 'invested') return (b.investedKRW - a.investedKRW) * dir
                  if (holdingsFilter.sort === 'gain') return (b.gainPercent - a.gainPercent) * dir
                  if (holdingsFilter.sort === 'gainKRW') return (b.gainKRW - a.gainKRW) * dir
                  if (holdingsFilter.sort === 'name') return a.name.localeCompare(b.name) * dir
                  return 0
                })
                .map((item, idx) => {
                  const gainPercent = item.gainPercent
                  return (
                    <tr key={`${item.account}-${item.ticker}-${idx}`}>
                      {/* 계좌 - PC만 */}
                      {!isMobile && (
                        <td style={{ padding: '14px 16px', fontSize: '14px', color: '#191F28', borderBottom: '1px solid #F2F4F6' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{item.accountIcon}</span>
                            <span style={{ fontSize: '12px', color: '#4E5968' }}>{item.account}</span>
                          </div>
                        </td>
                      )}
                      {/* 종목명 */}
                      <td style={{ padding: isMobile ? '8px 2px 8px 8px' : '14px 16px', fontSize: isMobile ? '11px' : '14px', color: '#191F28', borderBottom: '1px solid #F2F4F6' }}>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: isMobile ? '11px' : '13px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            {isMobile && <span style={{ fontSize: '10px' }}>{item.accountIcon}</span>}
                            {item.ticker}
                          </div>
                          <div style={{ fontSize: isMobile ? '9px' : '11px', color: '#8B95A1' }}>{item.name}</div>
                        </div>
                      </td>
                      {/* 매입금액 */}
                      <td style={{ padding: isMobile ? '8px 2px' : '14px 16px', fontSize: isMobile ? '10px' : '13px', color: '#8B95A1', borderBottom: '1px solid #F2F4F6', textAlign: 'right' }}>
                        {isMobile ? `${(item.investedKRW / 10000).toFixed(0)}만` : `₩${Math.round(item.investedKRW).toLocaleString()}`}
                      </td>
                      {/* 평가금액 */}
                      <td style={{ padding: isMobile ? '8px 2px' : '14px 16px', fontSize: isMobile ? '11px' : '14px', fontWeight: '600', color: '#191F28', borderBottom: '1px solid #F2F4F6', textAlign: 'right' }}>
                        {isMobile ? `${(item.currentKRW / 10000).toFixed(0)}만` : `₩${Math.round(item.currentKRW).toLocaleString()}`}
                      </td>
                      {/* 손익 - PC만 */}
                      {!isMobile && (
                        <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', borderBottom: '1px solid #F2F4F6', textAlign: 'right', color: item.gainKRW > 0 ? '#00C853' : item.gainKRW < 0 ? '#F04438' : '#8B95A1', whiteSpace: 'nowrap' }}>
                          {item.gainKRW >= 0 ? '+' : '-'}₩{Math.abs(Math.round(item.gainKRW)).toLocaleString()}
                        </td>
                      )}
                      {/* 수익률 */}
                      <td style={{ padding: isMobile ? '8px 8px 8px 2px' : '14px 16px', borderBottom: '1px solid #F2F4F6', textAlign: 'right' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: isMobile ? '2px 4px' : '4px 8px',
                          borderRadius: '6px',
                          fontSize: isMobile ? '10px' : '12px',
                          fontWeight: '600',
                          backgroundColor: gainPercent >= 5 ? '#E8F5E9' : gainPercent > 0 ? '#F0FFF4' : gainPercent <= -15 ? '#FFCDD2' : gainPercent <= -10 ? '#FFE0B2' : gainPercent < 0 ? '#FFEBEE' : '#F2F4F6',
                          color: gainPercent > 0 ? '#00C853' : gainPercent <= -15 ? '#D32F2F' : gainPercent <= -10 ? '#F57C00' : gainPercent < 0 ? '#F04438' : '#8B95A1',
                        }}>
                          {gainPercent >= 5 && '🔥'}
                          {gainPercent <= -15 && '🚨'}
                          {gainPercent > -15 && gainPercent <= -10 && '⚠️'}
                          {gainPercent > 0 ? '+' : ''}{gainPercent.toFixed(isMobile ? 1 : 2)}%
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
              .filter(item => holdingsFilter.account === 'all' || item.account === holdingsFilter.account)
              .length}개 종목)
          </span>
          <div style={{ display: 'flex', gap: isMobile ? '12px' : '24px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: isMobile ? '12px' : '14px', color: '#4E5968' }}>
              평가금액: <strong style={{ color: '#191F28' }}>
                ₩{Math.round(liveHoldings
                  .filter(item => holdingsFilter.account === 'all' || item.account === holdingsFilter.account)
                  .reduce((acc, item) => acc + item.currentKRW, 0)).toLocaleString()}
              </strong>
            </span>
            <span style={{ fontSize: isMobile ? '12px' : '14px', color: '#4E5968' }}>
              손익: {(() => {
                const totalGain = liveHoldings
                  .filter(item => holdingsFilter.account === 'all' || item.account === holdingsFilter.account)
                  .reduce((acc, item) => acc + item.gainKRW, 0)
                return (
                  <strong style={{ color: totalGain >= 0 ? '#00C853' : '#F04438' }}>
                    {totalGain >= 0 ? '+' : ''}₩{Math.round(totalGain).toLocaleString()}
                  </strong>
                )
              })()}
            </span>
            <span style={{ fontSize: isMobile ? '12px' : '14px', color: '#4E5968' }}>
              수익률: {(() => {
                const filtered = liveHoldings
                  .filter(item => holdingsFilter.account === 'all' || item.account === holdingsFilter.account)
                const totalInvested = filtered.reduce((acc, item) => acc + item.investedKRW, 0)
                const totalGain = filtered.reduce((acc, item) => acc + item.gainKRW, 0)
                const totalPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0
                return (
                  <strong style={{
                    color: totalPercent >= 0 ? '#00C853' : '#F04438',
                    padding: '2px 6px',
                    backgroundColor: totalPercent >= 0 ? '#E8F5E9' : '#FFEBEE',
                    borderRadius: '4px',
                    marginLeft: '4px',
                  }}>
                    {totalPercent >= 0 ? '+' : ''}{totalPercent.toFixed(2)}%
                  </strong>
                )
              })()}
            </span>
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
            flexDirection: isMobile ? 'column' : 'row',
            flexWrap: 'wrap',
            gap: isMobile ? '6px' : '16px',
            fontSize: isMobile ? '11px' : '12px',
            color: '#4E5968',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: isMobile ? '12px' : '14px' }}>🔥</span>
              <span>= +5% 이상</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: isMobile ? '12px' : '14px' }}>⚠️</span>
              <span>= -10% 이상</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: isMobile ? '12px' : '14px' }}>🚨</span>
              <span>= -15% 이상 (손절)</span>
            </span>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  )
}
