import { useState, useEffect, useMemo } from 'react'

// 미국 주식 데이터 (S&P 500 기반, 적자 기업 제외)
const US_STOCKS = [
  // 기술
  { ticker: 'AAPL', name: '애플', sector: '기술', per: 28.5, roe: 147.2, dividendYears: 12, pbr: 42.1 },
  { ticker: 'MSFT', name: '마이크로소프트', sector: '기술', per: 35.2, roe: 38.4, dividendYears: 21, pbr: 12.3 },
  { ticker: 'GOOG', name: '구글', sector: '기술', per: 23.1, roe: 25.2, dividendYears: 0, pbr: 5.8 },
  { ticker: 'META', name: '메타', sector: '기술', per: 26.8, roe: 28.1, dividendYears: 1, pbr: 7.2 },
  { ticker: 'CSCO', name: '시스코', sector: '기술', per: 15.2, roe: 28.5, dividendYears: 14, pbr: 4.5 },
  { ticker: 'IBM', name: 'IBM', sector: '기술', per: 21.3, roe: 32.1, dividendYears: 28, pbr: 6.8 },
  { ticker: 'INTC', name: '인텔', sector: '기술', per: 35.8, roe: 4.2, dividendYears: 10, pbr: 1.2 },
  { ticker: 'TXN', name: '텍사스 인스트루먼트', sector: '기술', per: 32.4, roe: 54.2, dividendYears: 20, pbr: 11.2 },
  // 금융
  { ticker: 'JPM', name: 'JP모건', sector: '금융', per: 11.2, roe: 15.8, dividendYears: 14, pbr: 1.7 },
  { ticker: 'BAC', name: '뱅크오브아메리카', sector: '금융', per: 12.5, roe: 10.2, dividendYears: 11, pbr: 1.1 },
  { ticker: 'WFC', name: '웰스파고', sector: '금융', per: 11.8, roe: 11.5, dividendYears: 13, pbr: 1.2 },
  { ticker: 'GS', name: '골드만삭스', sector: '금융', per: 14.2, roe: 12.1, dividendYears: 13, pbr: 1.3 },
  { ticker: 'MS', name: '모건스탠리', sector: '금융', per: 15.1, roe: 13.2, dividendYears: 12, pbr: 1.6 },
  { ticker: 'BLK', name: '블랙록', sector: '금융', per: 20.5, roe: 14.8, dividendYears: 15, pbr: 2.8 },
  { ticker: 'SCHW', name: '찰스슈왑', sector: '금융', per: 24.3, roe: 15.2, dividendYears: 8, pbr: 3.2 },
  // 헬스케어
  { ticker: 'JNJ', name: '존슨앤존슨', sector: '헬스케어', per: 15.8, roe: 21.2, dividendYears: 62, pbr: 5.2 },
  { ticker: 'UNH', name: '유나이티드헬스', sector: '헬스케어', per: 20.1, roe: 25.8, dividendYears: 15, pbr: 5.8 },
  { ticker: 'PFE', name: '화이자', sector: '헬스케어', per: 12.3, roe: 18.5, dividendYears: 14, pbr: 1.8 },
  { ticker: 'ABBV', name: '애브비', sector: '헬스케어', per: 14.5, roe: 62.1, dividendYears: 52, pbr: 18.2 },
  { ticker: 'MRK', name: '머크', sector: '헬스케어', per: 16.2, roe: 35.2, dividendYears: 13, pbr: 6.1 },
  { ticker: 'LLY', name: '일라이릴리', sector: '헬스케어', per: 78.5, roe: 58.2, dividendYears: 10, pbr: 45.2 },
  { ticker: 'BMY', name: '브리스톨마이어스', sector: '헬스케어', per: 8.2, roe: 21.5, dividendYears: 15, pbr: 3.2 },
  // 소비재
  { ticker: 'KO', name: '코카콜라', sector: '소비재', per: 24.5, roe: 42.8, dividendYears: 62, pbr: 10.5 },
  { ticker: 'PEP', name: '펩시코', sector: '소비재', per: 25.8, roe: 52.1, dividendYears: 52, pbr: 12.8 },
  { ticker: 'PG', name: 'P&G', sector: '소비재', per: 26.2, roe: 32.5, dividendYears: 68, pbr: 7.8 },
  { ticker: 'WMT', name: '월마트', sector: '소비재', per: 28.5, roe: 18.2, dividendYears: 51, pbr: 5.2 },
  { ticker: 'COST', name: '코스트코', sector: '소비재', per: 48.2, roe: 28.5, dividendYears: 20, pbr: 13.5 },
  { ticker: 'MCD', name: '맥도날드', sector: '소비재', per: 22.5, roe: 185.2, dividendYears: 48, pbr: 0 },
  { ticker: 'NKE', name: '나이키', sector: '소비재', per: 28.1, roe: 32.8, dividendYears: 23, pbr: 8.5 },
  // 산업재
  { ticker: 'CAT', name: '캐터필러', sector: '산업재', per: 16.2, roe: 52.8, dividendYears: 30, pbr: 8.2 },
  { ticker: 'HON', name: '하니웰', sector: '산업재', per: 22.5, roe: 32.1, dividendYears: 14, pbr: 7.5 },
  { ticker: 'UPS', name: 'UPS', sector: '산업재', per: 18.2, roe: 42.5, dividendYears: 15, pbr: 8.8 },
  { ticker: 'RTX', name: '레이시온', sector: '산업재', per: 32.5, roe: 8.2, dividendYears: 30, pbr: 2.1 },
  { ticker: 'DE', name: '디어앤컴퍼니', sector: '산업재', per: 12.8, roe: 35.2, dividendYears: 8, pbr: 5.2 },
  { ticker: 'LMT', name: '록히드마틴', sector: '산업재', per: 17.5, roe: 82.5, dividendYears: 21, pbr: 12.8 },
  { ticker: 'GE', name: 'GE 에어로스페이스', sector: '산업재', per: 38.2, roe: 18.5, dividendYears: 3, pbr: 8.2 },
  // 에너지
  { ticker: 'XOM', name: '엑슨모빌', sector: '에너지', per: 13.2, roe: 18.5, dividendYears: 42, pbr: 2.1 },
  { ticker: 'CVX', name: '쉐브론', sector: '에너지', per: 14.5, roe: 14.2, dividendYears: 37, pbr: 1.8 },
  { ticker: 'COP', name: '코노코필립스', sector: '에너지', per: 12.1, roe: 22.5, dividendYears: 8, pbr: 2.5 },
  { ticker: 'SLB', name: '슐룸버거', sector: '에너지', per: 15.8, roe: 21.8, dividendYears: 5, pbr: 3.2 },
  { ticker: 'EOG', name: 'EOG 리소시스', sector: '에너지', per: 10.5, roe: 28.2, dividendYears: 6, pbr: 2.8 },
  { ticker: 'PSX', name: '필립스66', sector: '에너지', per: 8.5, roe: 25.2, dividendYears: 12, pbr: 1.5 },
  // 통신
  { ticker: 'VZ', name: '버라이즌', sector: '통신', per: 9.2, roe: 18.5, dividendYears: 20, pbr: 1.8 },
  { ticker: 'T', name: 'AT&T', sector: '통신', per: 10.5, roe: 12.8, dividendYears: 40, pbr: 1.2 },
  { ticker: 'TMUS', name: 'T-모바일', sector: '통신', per: 22.8, roe: 12.5, dividendYears: 2, pbr: 2.8 },
  { ticker: 'CMCSA', name: '컴캐스트', sector: '통신', per: 10.8, roe: 15.2, dividendYears: 16, pbr: 1.8 },
  // 유틸리티
  { ticker: 'NEE', name: '넥스트에라에너지', sector: '유틸리티', per: 22.5, roe: 12.8, dividendYears: 29, pbr: 2.8 },
  { ticker: 'DUK', name: '듀크에너지', sector: '유틸리티', per: 18.2, roe: 8.5, dividendYears: 18, pbr: 1.5 },
  { ticker: 'SO', name: '서던컴퍼니', sector: '유틸리티', per: 20.5, roe: 12.1, dividendYears: 22, pbr: 2.2 },
  { ticker: 'D', name: '도미니언에너지', sector: '유틸리티', per: 16.8, roe: 10.2, dividendYears: 20, pbr: 1.8 },
  // 부동산
  { ticker: 'AMT', name: '아메리칸타워', sector: '부동산', per: 42.5, roe: 28.5, dividendYears: 14, pbr: 18.5 },
  { ticker: 'PLD', name: '프롤로지스', sector: '부동산', per: 38.2, roe: 5.8, dividendYears: 10, pbr: 2.1 },
  { ticker: 'EQIX', name: '에퀴닉스', sector: '부동산', per: 78.5, roe: 8.2, dividendYears: 8, pbr: 5.2 },
  { ticker: 'SPG', name: '사이먼프로퍼티', sector: '부동산', per: 18.5, roe: 52.8, dividendYears: 12, pbr: 12.5 },
  { ticker: 'O', name: '리얼티인컴', sector: '부동산', per: 45.2, roe: 3.2, dividendYears: 30, pbr: 1.2 },
  // 소재
  { ticker: 'LIN', name: '린데', sector: '소재', per: 32.5, roe: 15.8, dividendYears: 30, pbr: 4.8 },
  { ticker: 'APD', name: '에어프로덕츠', sector: '소재', per: 25.8, roe: 18.2, dividendYears: 42, pbr: 4.2 },
  { ticker: 'SHW', name: '셔윈윌리엄스', sector: '소재', per: 28.5, roe: 62.5, dividendYears: 45, pbr: 22.5 },
  { ticker: 'FCX', name: '프리포트맥모란', sector: '소재', per: 28.2, roe: 18.5, dividendYears: 3, pbr: 3.8 },
  { ticker: 'NEM', name: '뉴몬트', sector: '소재', per: 15.8, roe: 8.5, dividendYears: 8, pbr: 1.5 },
  { ticker: 'DD', name: '듀폰', sector: '소재', per: 22.5, roe: 5.2, dividendYears: 5, pbr: 1.8 },
]

// 한국 주식 데이터 (KOSPI/KOSDAQ 기반, 적자 기업 제외)
const KR_STOCKS = [
  // 기술/반도체
  { ticker: '005930', name: '삼성전자', sector: '기술', per: 32.5, roe: 8.2, dividendYears: 25, pbr: 1.3 },
  { ticker: '000660', name: 'SK하이닉스', sector: '기술', per: 8.5, roe: 18.5, dividendYears: 10, pbr: 1.8 },
  { ticker: '035420', name: '네이버', sector: '기술', per: 35.2, roe: 8.5, dividendYears: 5, pbr: 1.5 },
  { ticker: '035720', name: '카카오', sector: '기술', per: 42.5, roe: 4.2, dividendYears: 3, pbr: 1.2 },
  { ticker: '373220', name: 'LG에너지솔루션', sector: '기술', per: 125.8, roe: 5.8, dividendYears: 1, pbr: 4.5 },
  { ticker: '006400', name: '삼성SDI', sector: '기술', per: 28.5, roe: 12.5, dividendYears: 20, pbr: 2.1 },
  { ticker: '066570', name: 'LG전자', sector: '기술', per: 18.2, roe: 8.5, dividendYears: 15, pbr: 0.8 },
  { ticker: '051910', name: 'LG화학', sector: '기술', per: 45.2, roe: 5.2, dividendYears: 18, pbr: 1.2 },
  // 금융
  { ticker: '055550', name: '신한지주', sector: '금융', per: 5.8, roe: 9.2, dividendYears: 20, pbr: 0.5 },
  { ticker: '105560', name: 'KB금융', sector: '금융', per: 5.2, roe: 10.5, dividendYears: 15, pbr: 0.5 },
  { ticker: '086790', name: '하나금융지주', sector: '금융', per: 4.8, roe: 11.2, dividendYears: 12, pbr: 0.4 },
  { ticker: '316140', name: '우리금융지주', sector: '금융', per: 4.5, roe: 8.8, dividendYears: 5, pbr: 0.4 },
  { ticker: '138930', name: 'BNK금융지주', sector: '금융', per: 4.2, roe: 8.5, dividendYears: 10, pbr: 0.3 },
  { ticker: '024110', name: '기업은행', sector: '금융', per: 5.5, roe: 8.2, dividendYears: 18, pbr: 0.4 },
  { ticker: '000810', name: '삼성화재', sector: '금융', per: 8.5, roe: 12.8, dividendYears: 25, pbr: 0.8 },
  // 자동차
  { ticker: '005380', name: '현대차', sector: '자동차', per: 5.8, roe: 12.5, dividendYears: 20, pbr: 0.6 },
  { ticker: '000270', name: '기아', sector: '자동차', per: 5.2, roe: 18.2, dividendYears: 15, pbr: 0.8 },
  { ticker: '012330', name: '현대모비스', sector: '자동차', per: 6.8, roe: 8.5, dividendYears: 18, pbr: 0.5 },
  { ticker: '161390', name: '한국타이어앤테크놀로지', sector: '자동차', per: 8.2, roe: 10.2, dividendYears: 12, pbr: 0.7 },
  { ticker: '011210', name: '현대위아', sector: '자동차', per: 12.5, roe: 5.8, dividendYears: 8, pbr: 0.5 },
  // 철강/화학
  { ticker: '005490', name: 'POSCO홀딩스', sector: '철강', per: 8.5, roe: 5.2, dividendYears: 22, pbr: 0.4 },
  { ticker: '010130', name: '고려아연', sector: '철강', per: 12.5, roe: 8.8, dividendYears: 15, pbr: 1.2 },
  { ticker: '004020', name: '현대제철', sector: '철강', per: 6.2, roe: 4.5, dividendYears: 10, pbr: 0.3 },
  { ticker: '042670', name: '두산퓨얼셀', sector: '화학', per: 85.2, roe: 2.5, dividendYears: 0, pbr: 3.5 },
  { ticker: '011170', name: '롯데케미칼', sector: '화학', per: 18.5, roe: 3.2, dividendYears: 12, pbr: 0.5 },
  // 바이오/헬스케어
  { ticker: '207940', name: '삼성바이오로직스', sector: '바이오', per: 62.5, roe: 12.8, dividendYears: 2, pbr: 5.8 },
  { ticker: '068270', name: '셀트리온', sector: '바이오', per: 28.5, roe: 15.2, dividendYears: 5, pbr: 2.8 },
  { ticker: '128940', name: '한미약품', sector: '바이오', per: 35.2, roe: 8.5, dividendYears: 18, pbr: 2.5 },
  { ticker: '000100', name: '유한양행', sector: '바이오', per: 45.8, roe: 5.2, dividendYears: 25, pbr: 2.2 },
  { ticker: '006280', name: '녹십자', sector: '바이오', per: 22.5, roe: 6.8, dividendYears: 15, pbr: 1.2 },
  // 유통/소비재
  { ticker: '051900', name: 'LG생활건강', sector: '소비재', per: 28.5, roe: 12.5, dividendYears: 20, pbr: 2.8 },
  { ticker: '090430', name: '아모레퍼시픽', sector: '소비재', per: 45.2, roe: 5.8, dividendYears: 15, pbr: 1.5 },
  { ticker: '004170', name: '신세계', sector: '유통', per: 8.5, roe: 6.2, dividendYears: 18, pbr: 0.5 },
  { ticker: '139480', name: '이마트', sector: '유통', per: 12.8, roe: 3.5, dividendYears: 10, pbr: 0.3 },
  { ticker: '069960', name: '현대백화점', sector: '유통', per: 10.5, roe: 5.8, dividendYears: 15, pbr: 0.4 },
  { ticker: '027740', name: '마녀공장', sector: '소비재', per: 18.5, roe: 22.5, dividendYears: 3, pbr: 3.8 },
  // 건설
  { ticker: '000720', name: '현대건설', sector: '건설', per: 8.2, roe: 8.5, dividendYears: 12, pbr: 0.5 },
  { ticker: '028260', name: '삼성물산', sector: '건설', per: 15.8, roe: 6.2, dividendYears: 20, pbr: 0.8 },
  { ticker: '047040', name: '대우건설', sector: '건설', per: 5.5, roe: 12.5, dividendYears: 5, pbr: 0.5 },
  { ticker: '006360', name: 'GS건설', sector: '건설', per: 4.8, roe: 10.8, dividendYears: 8, pbr: 0.4 },
  { ticker: '000210', name: 'DL', sector: '건설', per: 6.2, roe: 8.2, dividendYears: 15, pbr: 0.3 },
  // 통신
  { ticker: '017670', name: 'SK텔레콤', sector: '통신', per: 10.5, roe: 12.8, dividendYears: 20, pbr: 0.9 },
  { ticker: '030200', name: 'KT', sector: '통신', per: 8.2, roe: 8.5, dividendYears: 18, pbr: 0.5 },
  { ticker: '032640', name: 'LG유플러스', sector: '통신', per: 8.8, roe: 9.2, dividendYears: 15, pbr: 0.5 },
  // 전력/가스
  { ticker: '015760', name: '한국전력', sector: '유틸리티', per: 5.2, roe: 4.5, dividendYears: 8, pbr: 0.2 },
  { ticker: '036460', name: '한국가스공사', sector: '유틸리티', per: 4.8, roe: 5.8, dividendYears: 15, pbr: 0.3 },
  // 기타
  { ticker: '034730', name: 'SK', sector: '지주', per: 12.5, roe: 5.2, dividendYears: 18, pbr: 0.5 },
  { ticker: '003550', name: 'LG', sector: '지주', per: 10.8, roe: 8.5, dividendYears: 20, pbr: 0.8 },
  { ticker: '018260', name: '삼성SDS', sector: '기술', per: 15.2, roe: 12.8, dividendYears: 10, pbr: 1.5 },
  { ticker: '032830', name: '삼성생명', sector: '금융', per: 8.5, roe: 6.8, dividendYears: 15, pbr: 0.4 },
  { ticker: '009150', name: '삼성전기', sector: '기술', per: 18.5, roe: 8.2, dividendYears: 12, pbr: 1.2 },
  { ticker: '096770', name: 'SK이노베이션', sector: '에너지', per: 15.8, roe: 5.5, dividendYears: 8, pbr: 0.6 },
  { ticker: '010950', name: 'S-Oil', sector: '에너지', per: 8.2, roe: 12.5, dividendYears: 20, pbr: 1.2 },
  { ticker: '078930', name: 'GS', sector: '에너지', per: 6.5, roe: 8.8, dividendYears: 15, pbr: 0.5 },
  { ticker: '267250', name: '현대일렉트릭', sector: '산업재', per: 22.5, roe: 18.5, dividendYears: 3, pbr: 3.2 },
  { ticker: '034020', name: '두산에너빌리티', sector: '산업재', per: 35.8, roe: 5.2, dividendYears: 2, pbr: 1.5 },
  { ticker: '042700', name: '한미반도체', sector: '기술', per: 28.5, roe: 25.8, dividendYears: 5, pbr: 8.5 },
  { ticker: '247540', name: '에코프로비엠', sector: '기술', per: 85.2, roe: 15.2, dividendYears: 1, pbr: 12.5 },
]

// 가산점 계산 함수
function calculateScore(stocks) {
  // 적자 기업 제외 (PER이 없거나 음수)
  const validStocks = stocks.filter(s => s.per > 0 && s.roe > 0)

  // 각 지표별 순위 계산
  const perRank = [...validStocks].sort((a, b) => a.per - b.per) // 낮을수록 좋음
  const roeRank = [...validStocks].sort((a, b) => b.roe - a.roe) // 높을수록 좋음
  const divRank = [...validStocks].sort((a, b) => b.dividendYears - a.dividendYears) // 많을수록 좋음
  const pbrRank = [...validStocks].sort((a, b) => (a.pbr || 999) - (b.pbr || 999)) // 낮을수록 좋음

  const scored = validStocks.map(stock => {
    const perScore = (1 - perRank.findIndex(s => s.ticker === stock.ticker) / perRank.length) * 5
    const roeScore = (1 - roeRank.findIndex(s => s.ticker === stock.ticker) / roeRank.length) * 4
    const divScore = (1 - divRank.findIndex(s => s.ticker === stock.ticker) / divRank.length) * 3
    const pbrScore = (1 - pbrRank.findIndex(s => s.ticker === stock.ticker) / pbrRank.length) * 2

    return {
      ...stock,
      perScore: perScore.toFixed(2),
      roeScore: roeScore.toFixed(2),
      divScore: divScore.toFixed(2),
      pbrScore: pbrScore.toFixed(2),
      totalScore: (perScore + roeScore + divScore + pbrScore).toFixed(2),
    }
  })

  // 총점 기준 정렬
  scored.sort((a, b) => parseFloat(b.totalScore) - parseFloat(a.totalScore))

  // 섹터별 최대 5개 제한
  const sectorCount = {}
  const filtered = scored.filter(stock => {
    const count = sectorCount[stock.sector] || 0
    if (count >= 5) return false
    sectorCount[stock.sector] = count + 1
    return true
  })

  return filtered.slice(0, 50)
}

export default function ValueStocksPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState('us') // 'us' or 'kr'

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const usStocks = useMemo(() => calculateScore(US_STOCKS), [])
  const krStocks = useMemo(() => calculateScore(KR_STOCKS), [])
  const stocks = activeTab === 'us' ? usStocks : krStocks

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#F7F8FA',
      paddingBottom: isMobile ? 80 : 40,
    },
    hero: {
      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      padding: isMobile ? '32px 20px' : '48px 40px',
      color: '#FFFFFF',
      marginBottom: '24px',
      borderRadius: '16px',
    },
    heroTitle: {
      fontSize: isMobile ? 28 : 36,
      fontWeight: 700,
      marginBottom: 12,
    },
    heroSubtitle: {
      fontSize: isMobile ? 14 : 16,
      opacity: 0.9,
      lineHeight: 1.6,
    },
    tabs: {
      display: 'flex',
      gap: '8px',
      marginBottom: '20px',
    },
    tab: (isActive) => ({
      padding: isMobile ? '10px 20px' : '12px 32px',
      borderRadius: '12px',
      border: 'none',
      fontSize: isMobile ? 14 : 15,
      fontWeight: 600,
      cursor: 'pointer',
      backgroundColor: isActive ? '#10B981' : '#FFFFFF',
      color: isActive ? '#FFFFFF' : '#4E5968',
      boxShadow: isActive ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
      transition: 'all 0.2s',
    }),
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: isMobile ? '16px' : '24px',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    },
    cardTitle: {
      fontSize: isMobile ? 16 : 18,
      fontWeight: 700,
      color: '#191F28',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    scoreInfo: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
      gap: '12px',
      marginBottom: '20px',
    },
    scoreItem: (color) => ({
      padding: '12px',
      borderRadius: '12px',
      backgroundColor: color + '15',
      border: `1px solid ${color}30`,
    }),
    scoreLabel: {
      fontSize: 12,
      color: '#8B95A1',
      marginBottom: '4px',
    },
    scoreValue: (color) => ({
      fontSize: 18,
      fontWeight: 700,
      color: color,
    }),
    tableWrapper: {
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: isMobile ? '600px' : '100%',
    },
    th: {
      padding: isMobile ? '10px 8px' : '14px 16px',
      textAlign: 'left',
      fontSize: isMobile ? 11 : 13,
      fontWeight: 600,
      color: '#8B95A1',
      backgroundColor: '#F7F8FA',
      borderBottom: '2px solid #E5E8EB',
      whiteSpace: 'nowrap',
    },
    thRight: {
      padding: isMobile ? '10px 8px' : '14px 16px',
      textAlign: 'right',
      fontSize: isMobile ? 11 : 13,
      fontWeight: 600,
      color: '#8B95A1',
      backgroundColor: '#F7F8FA',
      borderBottom: '2px solid #E5E8EB',
      whiteSpace: 'nowrap',
    },
    td: {
      padding: isMobile ? '12px 8px' : '14px 16px',
      fontSize: isMobile ? 12 : 14,
      color: '#191F28',
      borderBottom: '1px solid #E5E8EB',
    },
    tdRight: {
      padding: isMobile ? '12px 8px' : '14px 16px',
      fontSize: isMobile ? 12 : 14,
      color: '#191F28',
      borderBottom: '1px solid #E5E8EB',
      textAlign: 'right',
    },
    rank: (rank) => ({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: isMobile ? '24px' : '28px',
      height: isMobile ? '24px' : '28px',
      borderRadius: '8px',
      fontSize: isMobile ? 11 : 13,
      fontWeight: 700,
      backgroundColor: rank <= 3 ? '#10B981' : rank <= 10 ? '#3182F6' : '#F2F4F6',
      color: rank <= 10 ? '#FFFFFF' : '#4E5968',
    }),
    ticker: {
      fontSize: isMobile ? 10 : 11,
      color: '#8B95A1',
      marginTop: '2px',
    },
    sector: {
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: isMobile ? 10 : 11,
      backgroundColor: '#F2F4F6',
      color: '#4E5968',
    },
    totalScore: {
      fontSize: isMobile ? 14 : 16,
      fontWeight: 700,
      color: '#10B981',
    },
    metric: (value, isGood) => ({
      color: isGood ? '#10B981' : '#4E5968',
      fontWeight: isGood ? 600 : 400,
    }),
  }

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>가치주 찾기</h1>
        <p style={styles.heroSubtitle}>
          PER, ROE, 배당 연속 수, PBR을 기반으로 가산점을 매겨 가치주를 선별합니다.<br/>
          적자 기업 제외 / 섹터별 최대 5개로 분산
        </p>
      </div>

      <div style={styles.tabs}>
        <button style={styles.tab(activeTab === 'us')} onClick={() => setActiveTab('us')}>
          미국 주식
        </button>
        <button style={styles.tab(activeTab === 'kr')} onClick={() => setActiveTab('kr')}>
          한국 주식
        </button>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>가산점 체계</h2>
        <div style={styles.scoreInfo}>
          <div style={styles.scoreItem('#3182F6')}>
            <div style={styles.scoreLabel}>PER (낮을수록)</div>
            <div style={styles.scoreValue('#3182F6')}>5점</div>
          </div>
          <div style={styles.scoreItem('#10B981')}>
            <div style={styles.scoreLabel}>ROE (높을수록)</div>
            <div style={styles.scoreValue('#10B981')}>4점</div>
          </div>
          <div style={styles.scoreItem('#F59E0B')}>
            <div style={styles.scoreLabel}>배당 연속 (년)</div>
            <div style={styles.scoreValue('#F59E0B')}>3점</div>
          </div>
          <div style={styles.scoreItem('#8B5CF6')}>
            <div style={styles.scoreLabel}>PBR (낮을수록)</div>
            <div style={styles.scoreValue('#8B5CF6')}>2점</div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>
          {activeTab === 'us' ? '미국 가치주 TOP 50' : '한국 가치주 TOP 50'}
        </h2>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>종목</th>
                <th style={styles.th}>섹터</th>
                <th style={styles.thRight}>PER</th>
                <th style={styles.thRight}>ROE</th>
                <th style={styles.thRight}>배당</th>
                <th style={styles.thRight}>PBR</th>
                <th style={styles.thRight}>총점</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock, index) => (
                <tr key={stock.ticker}>
                  <td style={styles.td}>
                    <span style={styles.rank(index + 1)}>{index + 1}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ fontWeight: 600 }}>{stock.name}</div>
                    <div style={styles.ticker}>{stock.ticker}</div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.sector}>{stock.sector}</span>
                  </td>
                  <td style={styles.tdRight}>
                    <span style={styles.metric(stock.per, stock.per < 15)}>
                      {stock.per.toFixed(1)}
                    </span>
                  </td>
                  <td style={styles.tdRight}>
                    <span style={styles.metric(stock.roe, stock.roe > 15)}>
                      {stock.roe.toFixed(1)}%
                    </span>
                  </td>
                  <td style={styles.tdRight}>
                    <span style={styles.metric(stock.dividendYears, stock.dividendYears >= 10)}>
                      {stock.dividendYears}년
                    </span>
                  </td>
                  <td style={styles.tdRight}>
                    <span style={styles.metric(stock.pbr, stock.pbr < 2)}>
                      {stock.pbr.toFixed(1)}
                    </span>
                  </td>
                  <td style={styles.tdRight}>
                    <span style={styles.totalScore}>{stock.totalScore}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>주의사항</h2>
        <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: 1.8, color: '#4E5968', fontSize: isMobile ? 13 : 14 }}>
          <li>본 데이터는 참고용이며 투자 권유가 아닙니다</li>
          <li>실시간 데이터가 아닌 기준일 데이터입니다</li>
          <li>PER/PBR 음수(적자) 기업은 제외되었습니다</li>
          <li>섹터별 최대 5개로 제한하여 분산 효과를 고려했습니다</li>
          <li>가산점은 상대 순위 기반으로 계산됩니다</li>
        </ul>
      </div>
    </div>
  )
}
