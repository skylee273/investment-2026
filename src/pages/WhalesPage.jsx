import { useState, useMemo } from 'react'
import { useData } from '../contexts/DataContext'

// 기관투자자 데이터 (16개 기관)
const INSTITUTIONS = {
  'BlackRock': { name: 'BlackRock', manager: '래리 핑크', style: 'Passive/Active', filingDate: '2026-02-09', quarter: 'Q4 2025', aum: '$5.92T', performance: '+12.3%' },
  'Vanguard': { name: 'Vanguard', manager: '팀 버클리', style: 'Index/Passive', filingDate: '2026-02-03', quarter: 'Q4 2025', aum: '$10.25T', performance: '+11.8%' },
  'State Street': { name: 'State Street', manager: '론 오핸리', style: 'ETF/Index', filingDate: '2026-02-13', quarter: 'Q4 2025', aum: '$2.98T', performance: '+10.5%' },
  'Berkshire': { name: 'Berkshire Hathaway', manager: '워렌 버핏', style: 'Long-Term Value', filingDate: '2025-11-14', quarter: 'Q3 2025', aum: '$267B', performance: '+15.2%' },
  'Renaissance': { name: 'Renaissance Tech', manager: '짐 사이먼스', style: 'Quant', filingDate: '2025-11-14', quarter: 'Q3 2025', aum: '$64B', performance: '+22.1%' },
  'Citadel': { name: 'Citadel Advisors', manager: '켄 그리핀', style: 'Multi-Strategy', filingDate: '2025-11-14', quarter: 'Q3 2025', aum: '$62B', performance: '+18.7%' },
  'Coatue': { name: 'Coatue Management', manager: '필립 라폰', style: 'Tech Growth', filingDate: '2026-02-14', quarter: 'Q4 2025', aum: '$48B', performance: '+25.3%' },
  'Tiger Global': { name: 'Tiger Global', manager: '체이스 콜먼', style: 'Tech/Growth', filingDate: '2025-11-14', quarter: 'Q3 2025', aum: '$50B', performance: '+8.2%' },
  'Appaloosa': { name: 'Appaloosa', manager: '데이비드 테퍼', style: 'Event-Driven', filingDate: '2025-11-14', quarter: 'Q3 2025', aum: '$7.4B', performance: '+19.5%' },
  'Scion': { name: 'Scion Asset', manager: '마이클 버리', style: 'Contrarian', filingDate: '2025-11-03', quarter: 'Q3 2025', aum: '$250M', performance: '+31.2%' },
  'Pershing': { name: 'Pershing Square', manager: '빌 애크먼', style: 'Activist', filingDate: '2025-11-14', quarter: 'Q3 2025', aum: '$14.6B', performance: '+16.8%' },
  'Duquesne': { name: 'Duquesne Family', manager: '드러켄밀러', style: 'Macro', filingDate: '2025-11-14', quarter: 'Q3 2025', aum: '$4.1B', performance: '+21.4%' },
  'Third Point': { name: 'Third Point', manager: '댄 로엡', style: 'Activist', filingDate: '2025-11-14', quarter: 'Q3 2025', aum: '$12B', performance: '+14.3%' },
  'Viking': { name: 'Viking Global', manager: '할보르센', style: 'Long/Short', filingDate: '2025-11-14', quarter: 'Q3 2025', aum: '$35B', performance: '+17.6%' },
  'Greenlight': { name: 'Greenlight Capital', manager: '데이비드 아인혼', style: 'Value', filingDate: '2025-11-14', quarter: 'Q3 2025', aum: '$2.5B', performance: '+12.1%' },
}

// 매수 데이터 (상세 정보 포함)
const BUYING_DATA = [
  { ticker: 'NVDA', name: '엔비디아', institutions: ['State Street', 'Coatue', 'Scion', 'Appaloosa'], amount: '+$5.6B', weight: '6.2%', shares: '12.5M', isNew: false, sector: 'AI반도체', quarter: 'Q4 2025' },
  { ticker: 'AAPL', name: '애플', institutions: ['BlackRock', 'Vanguard', 'Berkshire', 'Third Point'], amount: '+$12.3B', weight: '6.1%', shares: '52M', isNew: false, sector: '빅테크', quarter: 'Q4 2025' },
  { ticker: 'MSFT', name: '마이크로소프트', institutions: ['BlackRock', 'Vanguard', 'State Street', 'Coatue', 'Third Point'], amount: '+$13.5B', weight: '5.9%', shares: '32M', isNew: false, sector: '빅테크', quarter: 'Q4 2025' },
  { ticker: 'META', name: '메타', institutions: ['Vanguard', 'State Street', 'Appaloosa', 'Citadel'], amount: '+$9.3B', weight: '4.8%', shares: '15M', isNew: false, sector: '빅테크', quarter: 'Q4 2025' },
  { ticker: 'TSLA', name: '테슬라', institutions: ['State Street'], amount: '+$1.78B', weight: '5.5%', shares: '4.2M', isNew: false, sector: '자동차', quarter: 'Q4 2025' },
  { ticker: 'AVGO', name: '브로드컴', institutions: ['State Street', 'Coatue'], amount: '+$2.4B', weight: '5.0%', shares: '1.1M', isNew: false, sector: '반도체', quarter: 'Q4 2025' },
  { ticker: 'PLTR', name: '팔란티어', institutions: ['Scion', 'Renaissance'], amount: '+$1.4B', weight: '2.4%', shares: '8.8M', isNew: false, sector: 'AI/소프트웨어', quarter: 'Q3 2025' },
  { ticker: 'GEV', name: 'GE 버노바', institutions: ['Coatue'], amount: '+$686M', weight: '5.5%', shares: '2.1M', isNew: true, sector: '에너지', quarter: 'Q4 2025' },
  { ticker: 'SNOW', name: '스노우플레이크', institutions: ['Coatue'], amount: '+$441M', weight: '3.2%', shares: '2.8M', isNew: false, sector: 'AI/소프트웨어', quarter: 'Q4 2025' },
  { ticker: 'SE', name: '씨리미티드', institutions: ['Tiger Global'], amount: '+$242M', weight: '8.9%', shares: '2.4M', isNew: false, sector: '이커머스', quarter: 'Q3 2025' },
  { ticker: 'MDB', name: '몽고DB', institutions: ['Tiger Global'], amount: '+$105M', weight: '4.2%', shares: '380K', isNew: false, sector: 'AI/소프트웨어', quarter: 'Q3 2025' },
  { ticker: 'BRK', name: '버크셔', institutions: ['BlackRock', 'Vanguard'], amount: '+$10.6B', weight: '6.3%', shares: '15M', isNew: false, sector: '금융', quarter: 'Q4 2025' },
  { ticker: 'TSM', name: 'TSMC', institutions: ['Coatue'], amount: '+$580M', weight: '5.5%', shares: '2.8M', isNew: false, sector: '반도체', quarter: 'Q4 2025' },
  { ticker: 'AMZN', name: '아마존', institutions: ['Third Point', 'Citadel'], amount: '+$2.0B', weight: '6.9%', shares: '8.5M', isNew: false, sector: '빅테크', quarter: 'Q3 2025' },
  { ticker: 'VST', name: '비스트라', institutions: ['Appaloosa'], amount: '+$142M', weight: '2.1%', shares: '890K', isNew: false, sector: '유틸리티', quarter: 'Q3 2025' },
  { ticker: 'NAMS', name: '뉴암스테르담', institutions: ['Duquesne'], amount: 'New', weight: '3.8%', shares: '1.2M', isNew: true, sector: '헬스케어', quarter: 'Q3 2025' },
  { ticker: 'INSM', name: '인스메드', institutions: ['Duquesne'], amount: 'New', weight: '2.9%', shares: '850K', isNew: true, sector: '헬스케어', quarter: 'Q3 2025' },
]

// 매도 데이터
const SELLING_DATA = [
  { ticker: 'AAPL', name: '애플', institutions: ['BlackRock', 'Berkshire'], amount: '-$16.5B', weight: '-2.1%', shares: '-68M', sector: '빅테크', quarter: 'Q4 2025' },
  { ticker: 'AVGO', name: '브로드컴', institutions: ['BlackRock'], amount: '-$2.63B', weight: '-1.2%', shares: '-1.5M', sector: '반도체', quarter: 'Q4 2025' },
  { ticker: 'JPM', name: 'JP모건', institutions: ['Vanguard'], amount: '-$2.85B', weight: '-0.8%', shares: '-12M', sector: '금융', quarter: 'Q4 2025' },
  { ticker: 'MSFT', name: '마이크로소프트', institutions: ['Vanguard'], amount: '-$2.83B', weight: '-0.5%', shares: '-6.5M', sector: '빅테크', quarter: 'Q4 2025' },
  { ticker: 'DD', name: '듀폰', institutions: ['BlackRock', 'State Street'], amount: '-$2.82B', weight: '-1.5%', shares: '-32M', sector: '소재', quarter: 'Q4 2025' },
  { ticker: 'K', name: '켈라노바', institutions: ['State Street'], amount: '-$1.14B', weight: '-0.9%', shares: '-14M', sector: '소비재', quarter: 'Q4 2025' },
  { ticker: 'META', name: '메타', institutions: ['Renaissance', 'Scion'], amount: '-$820M', weight: '-1.1%', shares: '-1.4M', sector: '빅테크', quarter: 'Q3 2025' },
  { ticker: 'UNH', name: '유나이티드헬스', institutions: ['Appaloosa'], amount: '-$775M', weight: '-2.3%', shares: '-1.2M', sector: '헬스케어', quarter: 'Q3 2025' },
  { ticker: 'NVDA', name: '엔비디아', institutions: ['Coatue', 'Scion'], amount: '-$1.77B', weight: '-1.8%', shares: '-1.1M', sector: 'AI반도체', quarter: 'Q4 2025' },
  { ticker: 'TSM', name: 'TSMC', institutions: ['Coatue'], amount: '-$336M', weight: '-0.6%', shares: '-1.8M', sector: '반도체', quarter: 'Q4 2025' },
  { ticker: 'BIDU', name: '바이두', institutions: ['Appaloosa'], amount: '-$205M', weight: '-1.4%', shares: '-2.1M', sector: '빅테크', quarter: 'Q3 2025' },
  { ticker: 'LLY', name: '일라이 릴리', institutions: ['Duquesne'], amount: '-$80M', weight: '-0.8%', shares: '-95K', sector: '헬스케어', quarter: 'Q3 2025' },
  { ticker: 'MBLY', name: '모빌아이', institutions: ['Tiger Global'], amount: '-$303M', weight: '-2.8%', shares: '-15M', sector: '자동차', quarter: 'Q3 2025' },
]

// 섹터별 자금 흐름 계산
const SECTOR_FLOWS = {
  '빅테크': { inflow: 25.1, outflow: 22.98, net: 2.12, color: '#3182F6' },
  'AI반도체': { inflow: 5.6, outflow: 1.77, net: 3.83, color: '#00C471' },
  '반도체': { inflow: 2.98, outflow: 2.96, net: 0.02, color: '#6366F1' },
  '금융': { inflow: 10.6, outflow: 2.85, net: 7.75, color: '#F59E0B' },
  'AI/소프트웨어': { inflow: 2.35, outflow: 0, net: 2.35, color: '#8B5CF6' },
  '헬스케어': { inflow: 0.12, outflow: 0.86, net: -0.74, color: '#EF4444' },
  '에너지': { inflow: 0.83, outflow: 0, net: 0.83, color: '#10B981' },
  '소재': { inflow: 0, outflow: 2.82, net: -2.82, color: '#6B7280' },
  '자동차': { inflow: 1.78, outflow: 0.30, net: 1.48, color: '#EC4899' },
  '소비재': { inflow: 0, outflow: 1.14, net: -1.14, color: '#F97316' },
}

const styles = {
  container: { maxWidth: '1400px' },
  header: { marginBottom: '24px' },
  title: { fontSize: '24px', fontWeight: '700', color: '#191F28', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' },
  subtitle: { fontSize: '14px', color: '#6B7684', marginTop: '8px' },
  quarterBadge: { display: 'inline-block', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', backgroundColor: '#E8F3FF', color: '#3182F6' },
  liveBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', backgroundColor: '#E8F5E9', color: '#00C471' },
  tabs: { display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' },
  tab: (isActive) => ({ padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', backgroundColor: isActive ? '#3182F6' : '#F4F5F7', color: isActive ? '#FFFFFF' : '#6B7684', border: 'none', cursor: 'pointer' }),
  section: { marginBottom: '28px' },
  sectionTitle: { fontSize: '16px', fontWeight: '700', color: '#191F28', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' },
  badge: (type) => ({ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', backgroundColor: type === 'buy' ? '#E8F5E9' : '#FFEBEE', color: type === 'buy' ? '#00C471' : '#F45452' }),
  newBadge: { padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '600', backgroundColor: '#FFF3CD', color: '#856404', marginLeft: '6px' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#FFFFFF', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
  th: { padding: '12px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6B7684', backgroundColor: '#F8F9FA', borderBottom: '1px solid #E5E8EB' },
  td: { padding: '12px 14px', fontSize: '13px', color: '#191F28', borderBottom: '1px solid #F2F4F6' },
  tickerCell: { display: 'flex', alignItems: 'center', gap: '6px' },
  star: { color: '#FFB800', fontSize: '14px' },
  ticker: { fontWeight: '700', color: '#191F28' },
  name: { fontSize: '11px', color: '#8B95A1' },
  institutionTag: { display: 'inline-flex', flexDirection: 'column', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '500', backgroundColor: '#F4F5F7', color: '#4E5968', marginRight: '4px', marginBottom: '4px' },
  managerName: { fontSize: '9px', color: '#8B95A1', marginTop: '1px' },
  amount: (isBuy) => ({ fontWeight: '600', color: isBuy ? '#00C471' : '#F45452' }),
  sectorTag: { display: 'inline-block', padding: '3px 6px', borderRadius: '4px', fontSize: '10px', backgroundColor: '#E8F3FF', color: '#3182F6' },

  // 섹터 히트맵
  heatmapContainer: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '24px' },
  heatmapCard: (net) => ({ padding: '14px', borderRadius: '10px', backgroundColor: net > 0 ? `rgba(0, 196, 113, ${Math.min(Math.abs(net) / 10, 0.3)})` : `rgba(244, 84, 82, ${Math.min(Math.abs(net) / 10, 0.3)})`, border: `1px solid ${net > 0 ? '#00C471' : '#F45452'}20` }),
  heatmapSector: { fontSize: '12px', fontWeight: '600', color: '#191F28', marginBottom: '6px' },
  heatmapNet: (net) => ({ fontSize: '16px', fontWeight: '700', color: net > 0 ? '#00C471' : '#F45452' }),
  heatmapDetail: { fontSize: '10px', color: '#6B7684', marginTop: '4px' },

  // 스마트머니 지수
  smartMoneyContainer: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '24px' },
  smartMoneyCard: { padding: '14px', borderRadius: '10px', backgroundColor: '#FFFFFF', border: '1px solid #E5E8EB' },
  smartMoneyRank: { fontSize: '10px', fontWeight: '600', color: '#8B95A1', marginBottom: '4px' },
  smartMoneyTicker: { fontSize: '16px', fontWeight: '700', color: '#191F28' },
  smartMoneyName: { fontSize: '11px', color: '#6B7684', marginTop: '2px' },
  smartMoneyScore: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' },
  smartMoneyBar: (score) => ({ flex: 1, height: '6px', borderRadius: '3px', backgroundColor: '#E5E8EB', overflow: 'hidden' }),
  smartMoneyFill: (score) => ({ width: `${score}%`, height: '100%', backgroundColor: score > 70 ? '#00C471' : score > 40 ? '#F59E0B' : '#F45452', borderRadius: '3px' }),
  smartMoneyValue: { fontSize: '12px', fontWeight: '600', color: '#191F28' },

  // 기관 카드
  institutionCards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px', marginBottom: '24px' },
  institutionCard: { padding: '14px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E5E8EB' },
  institutionName: { fontSize: '13px', fontWeight: '600', color: '#191F28' },
  institutionManager: { fontSize: '12px', color: '#3182F6', fontWeight: '500', marginTop: '2px' },
  institutionMeta: { display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' },
  institutionStyle: { padding: '3px 6px', borderRadius: '4px', fontSize: '10px', backgroundColor: '#F4F5F7', color: '#4E5968' },
  institutionAum: { padding: '3px 6px', borderRadius: '4px', fontSize: '10px', backgroundColor: '#E8F3FF', color: '#3182F6' },
  institutionPerf: (perf) => ({ padding: '3px 6px', borderRadius: '4px', fontSize: '10px', backgroundColor: perf.startsWith('+') ? '#E8F5E9' : '#FFEBEE', color: perf.startsWith('+') ? '#00C471' : '#F45452' }),

  // 공통 섹션
  commonSection: { padding: '16px', backgroundColor: '#FFF9E6', borderRadius: '10px', marginBottom: '20px', border: '1px solid #FFE066' },
  commonTitle: { fontSize: '14px', fontWeight: '700', color: '#191F28', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' },
  commonGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' },
  commonCard: { padding: '10px 12px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #FFE066' },
  commonTicker: { fontWeight: '700', fontSize: '14px', color: '#191F28' },
  commonName: { fontSize: '11px', color: '#6B7684', marginTop: '2px' },
  commonCount: { fontSize: '10px', color: '#8B95A1', marginTop: '4px' },

  // 내 포트폴리오 비교
  compareSection: { padding: '16px', backgroundColor: '#E8F3FF', borderRadius: '10px', marginBottom: '20px', border: '1px solid #3182F6' },
  compareTitle: { fontSize: '14px', fontWeight: '700', color: '#191F28', marginBottom: '10px' },
  compareGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' },
  compareCard: (match) => ({ padding: '10px', backgroundColor: match ? '#E8F5E9' : '#FFFFFF', borderRadius: '8px', border: match ? '1px solid #00C471' : '1px solid #E5E8EB' }),

  filterRow: { display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' },
  filterButton: (isActive) => ({ padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '500', backgroundColor: isActive ? '#191F28' : '#F4F5F7', color: isActive ? '#FFFFFF' : '#6B7684', border: 'none', cursor: 'pointer' }),

  notice: { padding: '10px 14px', backgroundColor: '#FFF3CD', borderRadius: '8px', marginBottom: '16px', fontSize: '12px', color: '#856404', display: 'flex', alignItems: 'center', gap: '6px' },
}

// 기관 태그
function InstitutionTag({ instKey }) {
  const inst = INSTITUTIONS[instKey]
  if (!inst) return <span style={styles.institutionTag}>{instKey}</span>
  return (
    <span style={styles.institutionTag}>
      <span>{instKey}</span>
      <span style={styles.managerName}>{inst.manager}</span>
    </span>
  )
}

// 스마트머니 지수 계산
function calculateSmartMoneyScore(ticker) {
  const buyingItem = BUYING_DATA.find(b => b.ticker === ticker)
  if (!buyingItem) return 0

  const institutionCount = buyingItem.institutions.length
  const hasTopInvestor = buyingItem.institutions.some(i =>
    ['Berkshire', 'Renaissance', 'Scion', 'Duquesne'].includes(i)
  )
  const isNew = buyingItem.isNew

  let score = institutionCount * 15
  if (hasTopInvestor) score += 25
  if (isNew) score += 10

  return Math.min(score, 100)
}

export default function WhalesPage() {
  const { portfolio } = useData()
  const [activeTab, setActiveTab] = useState('overview')
  const [sectorFilter, setSectorFilter] = useState('all')

  const sectors = ['all', 'AI반도체', '빅테크', '금융', '헬스케어', '에너지', '반도체', 'AI/소프트웨어']

  // 내 포트폴리오와 기관 매수 종목 비교
  const myTickers = portfolio.map(p => p.ticker)
  const matchingBuys = BUYING_DATA.filter(b => myTickers.includes(b.ticker))
  const matchingSells = SELLING_DATA.filter(s => myTickers.includes(s.ticker))

  // 필터링
  const filteredBuying = useMemo(() => {
    if (sectorFilter === 'all') return BUYING_DATA
    return BUYING_DATA.filter(item => item.sector === sectorFilter)
  }, [sectorFilter])

  const filteredSelling = useMemo(() => {
    if (sectorFilter === 'all') return SELLING_DATA
    return SELLING_DATA.filter(item => item.sector === sectorFilter)
  }, [sectorFilter])

  // 공통 매수 (2개 이상 기관)
  const commonBuying = BUYING_DATA.filter(item => item.institutions.length >= 2)
    .sort((a, b) => b.institutions.length - a.institutions.length)

  // 스마트머니 TOP 10
  const smartMoneyTop = [...BUYING_DATA]
    .map(item => ({ ...item, score: calculateSmartMoneyScore(item.ticker) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          기관투자자 추적
          <span style={styles.quarterBadge}>Q4 2025</span>
          <span style={styles.liveBadge}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00C471' }}></span>
            Live
          </span>
        </h1>
        <p style={styles.subtitle}>
          16개 기관의 13F 공시 기반 • 총 운용자산 $20T+ • 실시간 업데이트
        </p>
      </div>

      {/* 탭 */}
      <div style={styles.tabs}>
        <button onClick={() => setActiveTab('overview')} style={styles.tab(activeTab === 'overview')}>전체 현황</button>
        <button onClick={() => setActiveTab('heatmap')} style={styles.tab(activeTab === 'heatmap')}>섹터 히트맵</button>
        <button onClick={() => setActiveTab('smartmoney')} style={styles.tab(activeTab === 'smartmoney')}>스마트머니 지수</button>
        <button onClick={() => setActiveTab('buying')} style={styles.tab(activeTab === 'buying')}>📈 매수</button>
        <button onClick={() => setActiveTab('selling')} style={styles.tab(activeTab === 'selling')}>📉 매도</button>
        <button onClick={() => setActiveTab('compare')} style={styles.tab(activeTab === 'compare')}>내 포트폴리오 비교</button>
        <button onClick={() => setActiveTab('institutions')} style={styles.tab(activeTab === 'institutions')}>기관 목록</button>
      </div>

      {/* 전체 현황 */}
      {activeTab === 'overview' && (
        <>
          {/* 공통 매수 종목 */}
          <div style={styles.commonSection}>
            <div style={styles.commonTitle}>
              <span style={styles.star}>⭐</span>
              여러 기관이 함께 매수 (TOP 10)
            </div>
            <div style={styles.commonGrid}>
              {commonBuying.slice(0, 10).map(item => (
                <div key={item.ticker} style={styles.commonCard}>
                  <div style={styles.commonTicker}>
                    {item.ticker}
                    {item.isNew && <span style={styles.newBadge}>NEW</span>}
                  </div>
                  <div style={styles.commonName}>{item.name}</div>
                  <div style={styles.commonCount}>{item.institutions.length}개 기관 매수</div>
                </div>
              ))}
            </div>
          </div>

          {/* 섹터 필터 */}
          <div style={styles.filterRow}>
            {sectors.map(sector => (
              <button key={sector} onClick={() => setSectorFilter(sector)} style={styles.filterButton(sectorFilter === sector)}>
                {sector === 'all' ? '전체' : sector}
              </button>
            ))}
          </div>

          {/* 매수 테이블 */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span style={styles.badge('buy')}>매수</span>
              포지션 증가
            </div>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>종목</th>
                  <th style={styles.th}>매수 기관</th>
                  <th style={styles.th}>비중</th>
                  <th style={styles.th}>섹터</th>
                  <th style={styles.th}>금액</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuying.slice(0, 12).map(item => (
                  <tr key={item.ticker}>
                    <td style={styles.td}>
                      <div style={styles.tickerCell}>
                        {item.institutions.length >= 2 && <span style={styles.star}>⭐</span>}
                        <div>
                          <div style={styles.ticker}>
                            {item.ticker}
                            {item.isNew && <span style={styles.newBadge}>NEW</span>}
                          </div>
                          <div style={styles.name}>{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      {item.institutions.slice(0, 3).map(inst => <InstitutionTag key={inst} instKey={inst} />)}
                      {item.institutions.length > 3 && <span style={styles.institutionTag}>+{item.institutions.length - 3}</span>}
                    </td>
                    <td style={styles.td}>{item.weight}</td>
                    <td style={styles.td}><span style={styles.sectorTag}>{item.sector}</span></td>
                    <td style={styles.td}><span style={styles.amount(true)}>{item.amount}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 매도 테이블 */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span style={styles.badge('sell')}>매도</span>
              포지션 감소
            </div>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>종목</th>
                  <th style={styles.th}>매도 기관</th>
                  <th style={styles.th}>비중 변화</th>
                  <th style={styles.th}>섹터</th>
                  <th style={styles.th}>금액</th>
                </tr>
              </thead>
              <tbody>
                {filteredSelling.slice(0, 10).map((item, idx) => (
                  <tr key={`${item.ticker}-${idx}`}>
                    <td style={styles.td}>
                      <div style={styles.tickerCell}>
                        <div>
                          <div style={styles.ticker}>{item.ticker}</div>
                          <div style={styles.name}>{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      {item.institutions.map(inst => <InstitutionTag key={inst} instKey={inst} />)}
                    </td>
                    <td style={styles.td}>{item.weight}</td>
                    <td style={styles.td}><span style={styles.sectorTag}>{item.sector}</span></td>
                    <td style={styles.td}><span style={styles.amount(false)}>{item.amount}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* 섹터 히트맵 */}
      {activeTab === 'heatmap' && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>섹터별 자금 흐름 (단위: $B)</div>
          <div style={styles.heatmapContainer}>
            {Object.entries(SECTOR_FLOWS)
              .sort((a, b) => b[1].net - a[1].net)
              .map(([sector, data]) => (
              <div key={sector} style={styles.heatmapCard(data.net)}>
                <div style={styles.heatmapSector}>{sector}</div>
                <div style={styles.heatmapNet(data.net)}>
                  {data.net > 0 ? '+' : ''}{data.net.toFixed(2)}B
                </div>
                <div style={styles.heatmapDetail}>
                  유입 ${data.inflow.toFixed(1)}B / 유출 ${data.outflow.toFixed(1)}B
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 스마트머니 지수 */}
      {activeTab === 'smartmoney' && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>스마트머니 지수 TOP 10</div>
          <p style={{ fontSize: '12px', color: '#6B7684', marginBottom: '16px' }}>
            기관 수, 탑티어 투자자 포함 여부, 신규 진입 등을 종합한 점수
          </p>
          <div style={styles.smartMoneyContainer}>
            {smartMoneyTop.map((item, idx) => (
              <div key={item.ticker} style={styles.smartMoneyCard}>
                <div style={styles.smartMoneyRank}>#{idx + 1}</div>
                <div style={styles.smartMoneyTicker}>
                  {item.ticker}
                  {item.isNew && <span style={styles.newBadge}>NEW</span>}
                </div>
                <div style={styles.smartMoneyName}>{item.name}</div>
                <div style={styles.smartMoneyScore}>
                  <div style={styles.smartMoneyBar(item.score)}>
                    <div style={styles.smartMoneyFill(item.score)}></div>
                  </div>
                  <span style={styles.smartMoneyValue}>{item.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 매수 전체 */}
      {activeTab === 'buying' && (
        <div style={styles.section}>
          <div style={styles.filterRow}>
            {sectors.map(sector => (
              <button key={sector} onClick={() => setSectorFilter(sector)} style={styles.filterButton(sectorFilter === sector)}>
                {sector === 'all' ? '전체' : sector}
              </button>
            ))}
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>종목</th>
                <th style={styles.th}>매수 기관</th>
                <th style={styles.th}>비중</th>
                <th style={styles.th}>주식수</th>
                <th style={styles.th}>섹터</th>
                <th style={styles.th}>금액</th>
              </tr>
            </thead>
            <tbody>
              {filteredBuying.map(item => (
                <tr key={item.ticker}>
                  <td style={styles.td}>
                    <div style={styles.tickerCell}>
                      {item.institutions.length >= 2 && <span style={styles.star}>⭐</span>}
                      <div>
                        <div style={styles.ticker}>
                          {item.ticker}
                          {item.isNew && <span style={styles.newBadge}>NEW</span>}
                        </div>
                        <div style={styles.name}>{item.name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>
                    {item.institutions.map(inst => <InstitutionTag key={inst} instKey={inst} />)}
                  </td>
                  <td style={styles.td}>{item.weight}</td>
                  <td style={styles.td}>{item.shares}</td>
                  <td style={styles.td}><span style={styles.sectorTag}>{item.sector}</span></td>
                  <td style={styles.td}><span style={styles.amount(true)}>{item.amount}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 매도 전체 */}
      {activeTab === 'selling' && (
        <div style={styles.section}>
          <div style={styles.filterRow}>
            {sectors.map(sector => (
              <button key={sector} onClick={() => setSectorFilter(sector)} style={styles.filterButton(sectorFilter === sector)}>
                {sector === 'all' ? '전체' : sector}
              </button>
            ))}
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>종목</th>
                <th style={styles.th}>매도 기관</th>
                <th style={styles.th}>비중 변화</th>
                <th style={styles.th}>주식수</th>
                <th style={styles.th}>섹터</th>
                <th style={styles.th}>금액</th>
              </tr>
            </thead>
            <tbody>
              {filteredSelling.map((item, idx) => (
                <tr key={`${item.ticker}-${idx}`}>
                  <td style={styles.td}>
                    <div style={styles.tickerCell}>
                      <div>
                        <div style={styles.ticker}>{item.ticker}</div>
                        <div style={styles.name}>{item.name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={styles.td}>
                    {item.institutions.map(inst => <InstitutionTag key={inst} instKey={inst} />)}
                  </td>
                  <td style={styles.td}>{item.weight}</td>
                  <td style={styles.td}>{item.shares}</td>
                  <td style={styles.td}><span style={styles.sectorTag}>{item.sector}</span></td>
                  <td style={styles.td}><span style={styles.amount(false)}>{item.amount}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 내 포트폴리오 비교 */}
      {activeTab === 'compare' && (
        <div style={styles.section}>
          <div style={styles.compareSection}>
            <div style={styles.compareTitle}>
              ✅ 기관과 같이 보유 중 ({matchingBuys.length}개)
            </div>
            {matchingBuys.length > 0 ? (
              <div style={styles.compareGrid}>
                {matchingBuys.map(item => (
                  <div key={item.ticker} style={styles.compareCard(true)}>
                    <div style={styles.commonTicker}>{item.ticker}</div>
                    <div style={styles.commonName}>{item.name}</div>
                    <div style={styles.commonCount}>{item.institutions.length}개 기관도 매수</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: '#6B7684' }}>
                포트폴리오에 종목을 추가하면 기관 매수 종목과 비교할 수 있습니다.
              </p>
            )}
          </div>

          {matchingSells.length > 0 && (
            <div style={{ ...styles.compareSection, backgroundColor: '#FFEBEE', borderColor: '#F45452' }}>
              <div style={styles.compareTitle}>
                ⚠️ 기관이 매도 중인 내 종목 ({matchingSells.length}개)
              </div>
              <div style={styles.compareGrid}>
                {matchingSells.map(item => (
                  <div key={item.ticker} style={styles.compareCard(false)}>
                    <div style={styles.commonTicker}>{item.ticker}</div>
                    <div style={styles.commonName}>{item.name}</div>
                    <div style={{ ...styles.commonCount, color: '#F45452' }}>
                      {item.institutions.join(', ')} 매도
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 기관 목록 */}
      {activeTab === 'institutions' && (
        <div style={styles.institutionCards}>
          {Object.entries(INSTITUTIONS)
            .sort((a, b) => {
              const aumA = parseFloat(a[1].aum.replace(/[$T B]/g, '')) * (a[1].aum.includes('T') ? 1000 : 1)
              const aumB = parseFloat(b[1].aum.replace(/[$T B]/g, '')) * (b[1].aum.includes('T') ? 1000 : 1)
              return aumB - aumA
            })
            .map(([key, inst]) => (
            <div key={key} style={styles.institutionCard}>
              <div style={styles.institutionName}>{inst.name}</div>
              <div style={styles.institutionManager}>{inst.manager}</div>
              <div style={styles.institutionMeta}>
                <span style={styles.institutionStyle}>{inst.style}</span>
                <span style={styles.institutionAum}>{inst.aum}</span>
                <span style={styles.institutionPerf(inst.performance)}>{inst.performance}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
