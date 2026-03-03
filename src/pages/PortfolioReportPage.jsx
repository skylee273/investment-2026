import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 실제 보유 종목 (2026.03.02 기준)
const ACTUAL_HOLDINGS = {
  isa: {
    investedKRW: 6985235,  // PLUS신흥국 + TIGER미국채 + KODEX금
    currentKRW: 7026625,
    gainKRW: 41390,
    gainPercent: 0.59,
    holdings: [
      { name: 'PLUS 신흥국MSCI', investedKRW: 2997060, currentKRW: 2991835, gainKRW: -5225, gainPercent: -0.17 },
      { name: 'TIGER 미국채10년선물', investedKRW: 2003535, currentKRW: 2030310, gainKRW: 26775, gainPercent: 1.34 },
      { name: 'KODEX 금액티브', investedKRW: 1984640, currentKRW: 2004480, gainKRW: 19840, gainPercent: 1.00 },
    ],
  },
  pension: {
    investedKRW: 1977045,
    currentKRW: 1976520,
    gainKRW: -525,
    gainPercent: -0.03,
    holdings: [
      { name: 'KODEX 200', investedKRW: 1977045, currentKRW: 1976520, gainKRW: -525, gainPercent: -0.03 },
    ],
  },
  irp: {
    investedKRW: 200000,
    currentKRW: 273323,
    gainKRW: 73323,
    gainPercent: 36.66,
    holdings: [
      { name: 'IRP 투자상품', investedKRW: 200000, currentKRW: 273323, gainKRW: 73323, gainPercent: 36.66 },
    ],
  },
  pensionExtra: {
    investedKRW: 0,
    currentKRW: 0,
    gainKRW: 0,
    gainPercent: 0,
    holdings: [],
  },
}

// 포트폴리오 데이터 (GayoonWealthPage와 동일)
const PORTFOLIOS = {
  isa: {
    id: 'isa',
    name: 'ISA',
    icon: '📈',
    amount: 20000000,
    status: '완료',
    taxBenefit: '비과세 200만원 + 9.9% 분리과세',
    description: '해외주식 + 국내주식 분산 투자',
    items: [
      { ticker: '069500', name: 'KODEX 코스피200', category: '국내주식', targetWeight: 30, risk: 2 },
      { ticker: '360750', name: 'TIGER 미국S&P500', category: '해외주식', targetWeight: 20, risk: 3 },
      { ticker: '133690', name: 'TIGER 미국나스닥100', category: '해외주식', targetWeight: 15, risk: 4 },
      { ticker: '195980', name: 'TIGER MSCI신흥국', category: '해외주식', targetWeight: 15, risk: 5 },
      { ticker: '472150', name: 'KODEX 골드액티브', category: '금', targetWeight: 10, risk: 1 },
      { ticker: '305080', name: 'TIGER 미국채10년선물', category: '채권', targetWeight: 10, risk: 1 },
    ],
  },
  pension: {
    id: 'pension',
    name: '연금저축',
    icon: '🧓',
    amount: 6000000,
    status: '완료',
    taxBenefit: '세액공제 79.2만원',
    description: '국내주식 중심 + 세액공제',
    items: [
      { ticker: '069500', name: 'KODEX 코스피200', category: '국내주식', targetWeight: 70, risk: 2 },
      { ticker: '229200', name: 'KODEX 코스닥150', category: '국내주식', targetWeight: 30, risk: 3 },
    ],
  },
  irp: {
    id: 'irp',
    name: 'IRP',
    icon: '🏦',
    amount: 3000000,
    status: '진행중',
    taxBenefit: '세액공제 39.6만원',
    description: '위험자산 70% + 안전자산 30%',
    items: [
      { ticker: '133690', name: 'TIGER 미국나스닥100', category: '해외주식', targetWeight: 35, risk: 4 },
      { ticker: '360750', name: 'TIGER 미국S&P500', category: '해외주식', targetWeight: 21, risk: 3 },
      { ticker: '195980', name: 'TIGER MSCI신흥국', category: '해외주식', targetWeight: 14, risk: 5 },
      { ticker: '472150', name: 'KODEX 골드액티브', category: '금', targetWeight: 30, risk: 1 },
    ],
  },
  pensionExtra: {
    id: 'pensionExtra',
    name: '추가 연금저축',
    icon: '💰',
    amount: 9000000,
    status: '예정',
    taxBenefit: '과세이연 (세액공제 없음)',
    description: '해외+국내 분산 투자',
    items: [
      { ticker: '069500', name: 'KODEX 코스피200', category: '국내주식', targetWeight: 25, risk: 2 },
      { ticker: '360750', name: 'TIGER 미국S&P500', category: '해외주식', targetWeight: 20, risk: 3 },
      { ticker: '472150', name: 'KODEX 골드액티브', category: '금', targetWeight: 20, risk: 1 },
      { ticker: '133690', name: 'TIGER 미국나스닥100', category: '해외주식', targetWeight: 15, risk: 4 },
      { ticker: '195980', name: 'TIGER MSCI신흥국', category: '해외주식', targetWeight: 10, risk: 5 },
      { ticker: '229200', name: 'KODEX 코스닥150', category: '국내주식', targetWeight: 10, risk: 3 },
    ],
  },
}

// ETF 상세 정보
const ETF_DETAILS = {
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
  '133690': {
    fullName: 'TIGER 미국나스닥100',
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
  '195980': {
    fullName: 'TIGER MSCI신흥국',
    benchmark: 'MSCI Emerging Markets Index',
    expense: '0.19%',
    description: '중국, 대만, 인도, 한국 등 신흥국 대형주에 분산 투자',
    holdings: ['TSMC 9.8%', '텐센트 4.2%', '삼성전자 3.9%', '알리바바 2.5%', '릴라이언스 1.8%'],
    sectors: [
      { name: 'IT/반도체', weight: 25.3, color: '#3182F6' },
      { name: '금융', weight: 21.5, color: '#00C853' },
      { name: '소비재', weight: 13.8, color: '#9C27B0' },
      { name: '통신', weight: 9.2, color: '#FF9800' },
      { name: '기타', weight: 30.2, color: '#B0BEC5' },
    ],
    performance: { ytd: '+4.2%', oneYear: '+12.8%', threeYear: '-2.1%' },
    pros: ['높은 성장 잠재력', 'TSMC, 삼성 포함', '저평가 구간 PER 14배'],
    cons: ['중국 정치 리스크', '환율 변동성', '최근 10년 성과 부진'],
    verdict: '지역 분산 + 성장 잠재력. 신흥국 성장 수혜.',
    grade: 'B+',
  },
  '472150': {
    fullName: 'KODEX 골드액티브',
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
  '069500': {
    fullName: 'KODEX 코스피200',
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
}

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

const getAssetCategory = (name) => {
  if (name.includes('S&P')) return 'S&P500'
  if (name.includes('나스닥')) return '나스닥'
  if (name.includes('신흥국')) return '신흥국'
  if (name.includes('골드') || name.includes('금')) return '금'
  if (name.includes('채권')) return '채권'
  if (name.includes('코스피') || name.includes('200')) return '국내대형'
  if (name.includes('코스닥')) return '국내중소'
  return '기타'
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

export default function PortfolioReportPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('isa')

  const portfolio = PORTFOLIOS[activeTab]
  const actual = ACTUAL_HOLDINGS[activeTab]
  const safeWeight = portfolio.items.filter(i => i.risk <= 2).reduce((s, i) => s + i.targetWeight, 0)
  const riskWeight = 100 - safeWeight
  const avgRisk = portfolio.items.reduce((s, i) => s + (i.risk * i.targetWeight), 0) / 100

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate('/gayoon')}>
        ← 가윤 달리오로 돌아가기
      </button>

      <div style={styles.header}>
        <h1 style={styles.title}>📊 포트폴리오 상세 리포트</h1>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
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
        }}>
          <div style={{ display: 'flex', gap: '24px' }}>
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
            const category = getAssetCategory(item.name)
            const color = CATEGORY_COLORS[category] || '#9CA3AF'
            return (
              <div key={item.ticker} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: color }} />
                <span style={{ color: '#4E5968' }}>{item.name.replace('TIGER ', '').replace('KODEX ', '')}</span>
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
                }}>
                  <span style={{ fontSize: '13px', fontWeight: '500', color: '#191F28' }}>{h.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
          const category = getAssetCategory(item.name)
          const color = CATEGORY_COLORS[category] || '#9CA3AF'
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
                  }}>
                    {item.targetWeight}%
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
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
                <div style={{ display: 'flex', gap: '16px' }}>
                  {[
                    { label: 'YTD', value: etf.performance.ytd },
                    { label: '1년', value: etf.performance.oneYear },
                    { label: '3년(연)', value: etf.performance.threeYear },
                    { label: '보수', value: etf.expense },
                  ].map(stat => (
                    <div key={stat.label} style={{
                      flex: 1,
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ padding: '12px', backgroundColor: '#E8F5E9', borderRadius: '10px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#2E7D32', marginBottom: '8px' }}>✅ 장점</div>
                    {etf.pros.map((pro, idx) => (
                      <div key={idx} style={{ fontSize: '12px', color: '#4E5968', padding: '3px 0' }}>• {pro}</div>
                    ))}
                  </div>
                  <div style={{ padding: '12px', backgroundColor: '#FFF5F5', borderRadius: '10px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#C62828', marginBottom: '8px' }}>⚠️ 리스크</div>
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
                • <strong style={{ color: 'white' }}>{item.name.replace('TIGER ', '').replace('KODEX ', '')} ({item.targetWeight}%)</strong>
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
