import { createContext, useContext, useState, useEffect } from 'react'
import { generateMassiveDataFromCore } from '../data/generateData'

const DataContext = createContext()

const STORAGE_KEYS = {
  news: 'investment-news',
  companies: 'investment-companies',
  reports: 'investment-reports',
  connections: 'investment-connections',
  portfolio: 'investment-portfolio',
  transactions: 'investment-transactions',
}

// 포트폴리오 기반 기업 데이터
const SAMPLE_COMPANIES = [
  // 빅테크
  { id: '1', name: '아마존', ticker: 'AMZN', sector: 'IT', description: 'e커머스, 클라우드(AWS), AI', color: '#FF9900' },
  { id: '2', name: '마이크로소프트', ticker: 'MSFT', sector: 'IT', description: 'Windows, Azure, AI/Copilot', color: '#00A4EF' },
  { id: '3', name: '알파벳 A', ticker: 'GOOGL', sector: 'IT', description: 'Google, YouTube, Cloud, AI', color: '#4285F4' },
  { id: '4', name: '알파벳 C', ticker: 'GOOG', sector: 'IT', description: 'Google, YouTube, Cloud, AI', color: '#34A853' },
  { id: '5', name: '메타', ticker: 'META', sector: 'IT', description: 'Facebook, Instagram, WhatsApp, VR', color: '#0668E1' },
  { id: '6', name: '애플', ticker: 'AAPL', sector: 'IT', description: 'iPhone, Mac, Services, Vision Pro', color: '#555555' },

  // 반도체
  { id: '7', name: 'TSMC', ticker: 'TSM', sector: 'IT', description: '파운드리 세계 1위, AI칩 생산', color: '#CC0000' },
  { id: '8', name: 'AMD', ticker: 'AMD', sector: 'IT', description: 'CPU, GPU, 데이터센터 칩', color: '#ED1C24' },
  { id: '9', name: '브로드컴', ticker: 'AVGO', sector: 'IT', description: '네트워크칩, 커스텀AI칩', color: '#CC092F' },
  { id: '10', name: '퀄컴', ticker: 'QCOM', sector: 'IT', description: '모바일AP, 5G모뎀, IoT', color: '#3253DC' },
  { id: '11', name: '마이크론', ticker: 'MU', sector: 'IT', description: 'DRAM, NAND, HBM', color: '#0071C5' },
  { id: '12', name: '암바렐라', ticker: 'AMBA', sector: 'IT', description: 'AI비전 프로세서, 자율주행', color: '#00AEEF' },

  // 소프트웨어/AI
  { id: '13', name: '팔란티어', ticker: 'PLTR', sector: 'IT', description: 'AI 데이터분석 플랫폼', color: '#101820' },
  { id: '14', name: '버티브 홀딩스', ticker: 'VRT', sector: '산업재', description: '데이터센터 인프라, 냉각시스템', color: '#00629B' },

  // 자동차/에너지
  { id: '15', name: '테슬라', ticker: 'TSLA', sector: '자동차', description: '전기차, 에너지, 자율주행', color: '#CC0000' },

  // 금융
  { id: '16', name: '아메리칸 익스프레스', ticker: 'AXP', sector: '금융', description: '프리미엄 카드, 여행서비스', color: '#016FD0' },
  { id: '17', name: '뱅크오브아메리카', ticker: 'BAC', sector: '금융', description: '미국 2위 은행, 투자은행', color: '#012169' },

  // 헬스케어
  { id: '18', name: '인튜이티브 서지컬', ticker: 'ISRG', sector: '헬스케어', description: '다빈치 로봇수술 시스템', color: '#00A651' },

  // 소비재
  { id: '19', name: '코카콜라', ticker: 'KO', sector: '소비재', description: '음료 세계 1위, 배당킹', color: '#F40009' },

  // 에너지
  { id: '20', name: '쉐브론', ticker: 'CVX', sector: '에너지', description: '정유, 천연가스, 배당귀족', color: '#0066B2' },
  { id: '21', name: '페트로브라스', ticker: 'PBR', sector: '에너지', description: '브라질 국영 정유사, 고배당', color: '#009639' },
  { id: '22', name: '비스트라 에너지', ticker: 'VST', sector: '유틸리티', description: '전력회사, 원자력, AI전력수혜', color: '#FF6600' },

  // 소재
  { id: '23', name: 'MP 머티리얼스', ticker: 'MP', sector: '소재', description: '희토류 생산, 전기차/방산 핵심소재', color: '#1E3A5F' },
  { id: '24', name: '뉴몬트', ticker: 'NEM', sector: '소재', description: '세계 최대 금광업체', color: '#C5A900' },

  // ETF
  { id: '25', name: 'SPY', ticker: 'SPY', sector: 'ETF', description: 'S&P500 추종 ETF', color: '#1A5276' },
  { id: '26', name: 'GLD', ticker: 'GLD', sector: 'ETF', description: '금 현물 ETF', color: '#FFD700' },
  { id: '27', name: 'TLT', ticker: 'TLT', sector: 'ETF', description: '미국 장기국채 20년+ ETF', color: '#2E86AB' },
  { id: '28', name: 'IEI', ticker: 'IEI', sector: 'ETF', description: '미국 중기국채 3-7년 ETF', color: '#5DADE2' },
  { id: '29', name: 'PDBC', ticker: 'PDBC', sector: 'ETF', description: '원자재 종합 ETF', color: '#784212' },
]

// 기업 간 연결 관계 (증권의 사슬)
const SAMPLE_CONNECTIONS = [
  // 빅테크 - AI 경쟁
  { id: '1', sourceId: '2', targetId: '3', type: 'sector', label: 'AI/클라우드 경쟁', strength: 4 },
  { id: '2', sourceId: '2', targetId: '5', type: 'sector', label: 'AI 플랫폼 경쟁', strength: 4 },
  { id: '3', sourceId: '1', targetId: '2', type: 'sector', label: 'AWS vs Azure', strength: 5 },
  { id: '4', sourceId: '3', targetId: '5', type: 'sector', label: '광고 시장 경쟁', strength: 5 },

  // 반도체 공급망
  { id: '5', sourceId: '7', targetId: '8', type: 'supply_chain', label: 'AMD 칩 생산', strength: 5 },
  { id: '6', sourceId: '7', targetId: '6', type: 'supply_chain', label: 'Apple 칩 생산', strength: 5 },
  { id: '7', sourceId: '7', targetId: '9', type: 'supply_chain', label: '브로드컴 칩 생산', strength: 4 },
  { id: '8', sourceId: '7', targetId: '10', type: 'supply_chain', label: '퀄컴 칩 생산', strength: 5 },
  { id: '9', sourceId: '11', targetId: '8', type: 'supply_chain', label: 'HBM 공급', strength: 4 },

  // AI 데이터센터 생태계
  { id: '10', sourceId: '14', targetId: '2', type: 'supply_chain', label: 'DC 인프라 공급', strength: 4 },
  { id: '11', sourceId: '14', targetId: '1', type: 'supply_chain', label: 'AWS DC 장비', strength: 4 },
  { id: '12', sourceId: '22', targetId: '14', type: 'supply_chain', label: 'DC 전력 공급', strength: 3 },

  // 자율주행/전기차
  { id: '13', sourceId: '15', targetId: '12', type: 'supply_chain', label: 'AI비전 칩 후보', strength: 2 },
  { id: '14', sourceId: '23', targetId: '15', type: 'supply_chain', label: '희토류→모터', strength: 3 },

  // 금융 동종업계
  { id: '15', sourceId: '16', targetId: '17', type: 'sector', label: '금융 동종업계', strength: 3 },

  // AI 소프트웨어
  { id: '16', sourceId: '13', targetId: '2', type: 'partnership', label: 'Azure 협력', strength: 4 },
  { id: '17', sourceId: '13', targetId: '1', type: 'partnership', label: 'AWS 협력', strength: 3 },

  // 에너지 섹터
  { id: '18', sourceId: '20', targetId: '21', type: 'sector', label: '정유 동종업계', strength: 4 },

  // 방어자산 (ETF)
  { id: '19', sourceId: '26', targetId: '24', type: 'custom', label: '금 가격 연동', strength: 5 },
  { id: '20', sourceId: '27', targetId: '28', type: 'sector', label: '채권 ETF', strength: 5 },
]

// 뉴스 데이터
const SAMPLE_NEWS = [
  {
    id: '1',
    title: 'TSMC, AI 칩 수요 폭발로 2분기 매출 40% 성장 전망',
    summary: '엔비디아, AMD, 애플 등 주요 고객사의 AI칩 주문이 급증하며 TSMC 파운드리 가동률이 사상 최고치를 기록했다.',
    url: '',
    source: '한국경제',
    category: 'stock',
    isHighlight: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: '아마존 AWS, AI 인프라 투자에 1000억 달러 발표',
    summary: '아마존이 향후 5년간 AI 데이터센터 및 자체 칩 개발에 대규모 투자를 단행한다고 발표했다.',
    url: '',
    source: 'CNBC',
    category: 'stock',
    isHighlight: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    title: 'AMD, MI300X GPU 출하량 2배 증가... 엔비디아 추격',
    summary: 'AMD의 데이터센터용 AI 가속기 MI300X가 메타, 마이크로소프트 등 빅테크 기업에 대량 납품되고 있다.',
    url: '',
    source: '로이터',
    category: 'stock',
    isHighlight: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '4',
    title: '마이크론, HBM3E 양산 본격화... SK하이닉스와 경쟁 심화',
    summary: '마이크론이 HBM3E 양산을 시작하며 AI 메모리 시장 점유율 확대에 나섰다.',
    url: '',
    source: '블룸버그',
    category: 'stock',
    isHighlight: false,
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: '5',
    title: '버티브 홀딩스, AI 데이터센터 냉각 수요로 주가 신고가',
    summary: 'AI 데이터센터의 전력 소비 증가로 냉각 솔루션 수요가 급증하며 버티브 홀딩스가 주목받고 있다.',
    url: '',
    source: '바론스',
    category: 'stock',
    isHighlight: false,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: '6',
    title: '테슬라, 완전자율주행(FSD) V13 업데이트 배포 시작',
    summary: '테슬라가 FSD V13 베타를 배포하며 자율주행 기술 진전을 과시했다. 로보택시 출시 기대감 상승.',
    url: '',
    source: '일렉트렉',
    category: 'stock',
    isHighlight: false,
    createdAt: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: '7',
    title: '금값 사상 최고가 경신... 온스당 2,500달러 돌파',
    summary: '지정학적 리스크와 달러 약세로 금값이 사상 최고치를 경신했다. GLD ETF 자금 유입 급증.',
    url: '',
    source: '직접입력',
    category: 'macro',
    isHighlight: true,
    createdAt: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    id: '8',
    title: 'Fed 금리 인하 시사... 국채 ETF TLT 급등',
    summary: '연준 의장이 금리 인하 가능성을 시사하며 장기국채 가격이 급등했다.',
    url: '',
    source: 'WSJ',
    category: 'macro',
    isHighlight: false,
    createdAt: new Date(Date.now() - 25200000).toISOString(),
  },
  {
    id: '9',
    title: '코카콜라, 66년 연속 배당 인상... 배당킹 지위 유지',
    summary: '코카콜라가 연간 배당금을 4.5% 인상하며 배당킹 타이틀을 이어갔다.',
    url: '',
    source: '시킹알파',
    category: 'stock',
    isHighlight: false,
    createdAt: new Date(Date.now() - 28800000).toISOString(),
  },
  {
    id: '10',
    title: '희토류 가격 급등... MP 머티리얼스 수혜 전망',
    summary: '중국의 희토류 수출 규제 강화로 미국 유일의 희토류 생산업체인 MP 머티리얼스가 주목받고 있다.',
    url: '',
    source: '마켓워치',
    category: 'macro',
    isHighlight: false,
    createdAt: new Date(Date.now() - 32400000).toISOString(),
  },
  {
    id: '11',
    title: '팔란티어, 미 국방부와 5억 달러 AI 계약 체결',
    summary: '팔란티어가 미 국방부와 대규모 AI 분석 플랫폼 계약을 체결하며 정부 부문 매출 확대에 나섰다.',
    url: '',
    source: '디펜스뉴스',
    category: 'stock',
    isHighlight: false,
    createdAt: new Date(Date.now() - 36000000).toISOString(),
  },
  {
    id: '12',
    title: '인튜이티브 서지컬, 다빈치 5 로봇 FDA 승인',
    summary: '차세대 수술 로봇 다빈치 5가 FDA 승인을 받았다. 더 정밀한 수술과 빠른 회복이 기대된다.',
    url: '',
    source: '메드가젯',
    category: 'stock',
    isHighlight: false,
    createdAt: new Date(Date.now() - 39600000).toISOString(),
  },
]

// 리포트 데이터
const SAMPLE_REPORTS = [
  {
    id: 'gayoon-portfolio-2026',
    companyName: '가윤 달리오 포트폴리오',
    title: '2026년 공격적 포트폴리오 (목표 연 15%)',
    summary: 'ISA 주식 90% (나스닥 35 + S&P 30 + 신흥국 15 + 반도체 10) / 금 10%. 연금저축은 KODEX 국내 ETF 7:3 배분.',
    content: `## 핵심 전략: 세금 최적화 자산배분

### 왜 이 전략인가?
- **ISA**: 비과세 200만원 + 초과분 9.9% 분리과세 → **해외주식 집중**
- **연금저축**: 세액공제 79만원 + 과세이연 → **국내주식 OK** (어차피 양도세 없음)

---

## ISA 포트폴리오 (목표 2,000만원) - 🔥 공격적 15%

| 종목 | 비중 | 금액 | 선택 이유 |
|------|------|------|-----------|
| **TIGER 미국나스닥100** | 35% | 700만원 | 핵심 성장 엔진, AI/빅테크 수혜, 연 17%+ |
| **S&P500 ETF** | 30% | 600만원 | 안정적 기반, 미국 500대 기업 |
| **TIGER MSCI신흥국** | 15% | 300만원 | 지역 분산, TSMC/삼성 포함 |
| **TIGER 미국필라델피아반도체** | 10% | 200만원 | AI 슈퍼사이클 부스터, 연 22%+ |
| **KODEX 금액티브** | 10% | 200만원 | 유일한 방어 자산, 주식 급락 시 완충 |

### 🔥 공격적 포트폴리오 리스크
- **예상 변동성**: 연 ±25~30%
- **최대 손실 가능**: -40% (2022년 나스닥 급락 수준)
- **권장 투자기간**: 최소 3년, 권장 5년 이상
- **멘탈 필수**: 하락장에 패닉셀 금지!

### ISA 세제 혜택 상세
1. **비과세 한도 200만원**: 해외주식 양도세 22% → 0%
2. **초과분 9.9% 분리과세**: 일반 22% 대비 절반!
3. **손익통산**: 수익과 손실 합산 후 과세
4. **의무 보유기간**: 3년
5. **15% 수익 시**: 300만원 이익 → 세금 약 10만원 절약

### 왜 해외주식을 ISA에?
- 국내주식: 양도세 **없음** (소액주주 기준)
- 해외주식: 양도세 **22%** (250만원 초과분)
- → 해외주식을 ISA에 넣어야 세금 혜택 극대화!

---

## 연금저축 포트폴리오 (목표 600만원)

| 종목 | 비중 | 금액 | 선택 이유 |
|------|------|------|-----------|
| **KODEX 200** | 70% | 420만원 | 코스피 대형주 200개, 안정적 |
| **KODEX 코스닥150** | 30% | 180만원 | 성장주 중심, 코스피 대비 변동성 |

### 연금저축 세제 혜택 상세
1. **세액공제**: 600만원 × 13.2% = **79.2만원 환급**
2. **과세이연**: 매매 차익 비과세로 복리 효과
3. **연금 수령 시**: 55세 이후 3.3~5.5% 저율 과세

### 왜 국내주식을 연금저축에?
- 국내주식은 어차피 양도세 없음
- 연금저축 안에서 매매해도 세금 안 냄 → 복리 효과 극대화
- 과세이연으로 수십 년간 세금 없이 굴리기 가능

---

## ETF 상세 분석

### S&P500 ETF (ISA 50%)
- **구성**: 애플, 마이크로소프트, 아마존, 엔비디아 등 미국 대형주 500개
- **장점**: 세계 최대 시장, 검증된 장기 수익률, 달러 자산
- **주의**: 환율 변동 리스크, 미국 경기 의존

### TIGER 미국나스닥100 (ISA 10%)
- **구성**: 애플, 마이크로소프트, 엔비디아, 테슬라 등 기술주 100개
- **장점**: AI 수혜, 고성장, S&P보다 상승 시 더 높은 수익
- **주의**: 하락장에서 S&P보다 더 많이 빠짐

### TIGER MSCI신흥국 (ISA 15%)
- **구성**: 중국(텐센트, 알리바바), 대만(TSMC), 인도(릴라이언스), 한국(삼성) 등
- **장점**: 선진국 대비 높은 성장 잠재력, 지역 분산
- **주의**: 신흥국 특유의 정치/환율 리스크

### TIGER 미국필라델피아반도체 (ISA 10%) 🔥
- **구성**: 엔비디아(12.5%), 브로드컴, AMD, 퀄컴 등 미국 반도체 30개
- **장점**: AI 슈퍼사이클 최대 수혜, 연평균 22.5% 수익률 (10년)
- **주의**: 변동성 매우 높음 (베타 1.45), 2022년 -45% 급락

### KODEX 금액티브 (ISA 10%)
- **구성**: 금 선물 + 액티브 운용 (삼성자산운용)
- **장점**: 유일한 방어 자산, 주식 급락 시 완충 역할
- **주의**: 수익률 기여 낮음, 방어 목적으로만

> ⚠️ **채권 0%**: 공격적 15% 목표를 위해 채권 제외. 금만 10% 유지.

---

## 리밸런싱 전략

### 주기
- **6개월 ~ 1년에 한 번**
- 급등/급락 시 수시 리밸런싱 가능

### 방법
1. 목표 비중 대비 **±5% 이상 벗어나면** 조정
2. **많이 오른 자산 팔고 → 많이 내린 자산 사기**
3. ISA/연금저축 내 매매는 **세금 없음** → 부담 없이 리밸런싱

### 리밸런싱 체크리스트
| 날짜 | ISA | 연금저축 | 메모 |
|------|-----|----------|------|
| 2026년 8월 | ☐ | ☐ | 첫 리밸런싱 |
| 2027년 2월 | ☐ | ☐ | 1년 수익 인증! 🎉 |
| 2027년 8월 | ☐ | ☐ | |
| 2028년 2월 | ☐ | ☐ | |

---

## 연간 예상 수익률 (공격적 15% 목표)

### 🚀 낙관 시나리오 (연 25%)
- ISA 2,000만원 → 2,500만원 (+500만원)
- 연금저축 600만원 → 750만원 (+150만원)
- **세금 절약**: 약 110만원 (비과세 혜택)
- AI 슈퍼사이클 + 금리 인하 시

### 🎯 목표 시나리오 (연 15%)
- ISA 2,000만원 → 2,300만원 (+300만원)
- 연금저축 600만원 → 690만원 (+90만원)
- **세금 절약**: 약 66만원 (비과세 혜택)

### ⚠️ 보수 시나리오 (연 5%)
- ISA 2,000만원 → 2,100만원 (+100만원)
- 연금저축 600만원 → 630만원 (+30만원)
- 시장 횡보 시

### 🔴 비관 시나리오 (연 -25%)
- ISA 2,000만원 → 1,500만원 (-500만원)
- 연금저축 600만원 → 450만원 (-150만원)
- **금 10%로 방어 제한적** - 하락장 버티기 필수
- 2022년 수준 급락 시

---

## 워렌 버핏의 조언

> "우리가 가장 좋아하는 보유 기간은 영원히다."

1. **꾸준히 적립**: 시장 타이밍보다 시간이 더 중요
2. **분산투자**: 하나에 몰빵하지 말 것
3. **비용 최소화**: 저비용 ETF 선택
4. **감정 배제**: 하락장에 패닉셀 금지
5. **장기 관점**: 10년 이상 묻어두기

---

## 액션 아이템

### 즉시 실행
- [ ] ISA 계좌 개설 (3년 의무 보유)
- [ ] 연금저축 계좌 개설

### 6월 (가족 2,000만원 수령 후)
- [ ] 연금저축 600만원 일시 납입 (세액공제)
- [ ] ISA 1,000만원 납입

### 7월 (전세 4,500만원 수령 후)
- [ ] ISA 추가 1,000만원 납입 (연간 한도 2,000만원)
- [ ] 나머지 S&P500 분할 매수

### 9월 (자율적금 만기 후)
- [ ] 450만원 S&P500 또는 ISA 추가`,
    investmentGrade: 'strong_buy',
    targetPrice: null,
    tags: ['포트폴리오', 'ISA', '연금저축', '세금최적화', 'ETF', '자산배분'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '1',
    companyName: 'TSMC',
    title: 'AI 반도체 슈퍼사이클의 최대 수혜주',
    summary: 'AI 칩 수요 폭발로 TSMC의 파운드리 독점력이 더욱 강화되고 있다. 3nm 이하 첨단공정에서 경쟁사 대비 2년 이상 기술격차를 유지 중.',
    content: `## 투자 포인트

### 1. AI 칩 수요 폭발
- 엔비디아 H100/H200, AMD MI300X 등 AI 가속기 수요 급증
- 애플 M시리즈, 퀄컴 스냅드래곤 등 모바일 AP 수요 지속
- 2024년 매출 성장률 25% 이상 전망

### 2. 첨단공정 기술 리더십
- 3nm 양산 본격화, 2nm 개발 순조로운 진행
- 인텔, 삼성 대비 2년 이상 기술 격차 유지
- CoWoS 등 첨단 패키징 기술 독점

### 3. 지정학적 리스크 관리
- 미국 애리조나, 일본 구마모토 공장 건설 진행
- 지역 다변화로 대만 리스크 완화 노력

## 리스크 요인
- 대만해협 지정학적 리스크
- 미중 반도체 규제 심화 가능성
- 전력 수급 문제

## 밸류에이션
- 2024E PER 25배, 역사적 평균 대비 프리미엄 정당화
- AI 슈퍼사이클로 실적 상향 여력 존재`,
    investmentGrade: 'strong_buy',
    targetPrice: 250,
    tags: ['반도체', 'AI', '파운드리', '3nm'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    companyName: '아마존',
    title: 'AWS 성장 재가속 + AI 투자 본격화',
    summary: 'AWS 성장률이 다시 20%대로 회복되고 있으며, 자체 AI칩 Trainium/Inferentia로 경쟁력 강화 중.',
    content: `## 투자 포인트

### 1. AWS 성장 재가속
- 2024년 AWS 매출 성장률 20% 이상 회복 전망
- 기업들의 클라우드 마이그레이션 지속
- AI 워크로드 증가로 프리미엄 인스턴스 수요 급증

### 2. 자체 AI칩 개발
- Trainium2: AI 학습용 칩, 엔비디아 대비 비용 40% 절감
- Inferentia2: AI 추론용 칩, 대규모 배포 시작
- Anthropic 투자로 AI 모델 파트너십 확보

### 3. e커머스 마진 개선
- 물류 효율화로 북미 소매 마진 개선 지속
- 광고 사업 고성장 (연 25%+)
- Prime 구독자 수 꾸준한 증가

## 리스크 요인
- AI 경쟁 심화 (MS Azure, Google Cloud)
- FTC 반독점 소송
- 경기 침체 시 클라우드 지출 감소 우려

## 밸류에이션
- 2024E PER 45배, AWS 가치만으로 정당화
- Sum-of-parts로 커머스/광고 가치 추가 업사이드`,
    investmentGrade: 'buy',
    targetPrice: 230,
    tags: ['빅테크', 'AWS', 'AI', '클라우드'],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '3',
    companyName: '버티브 홀딩스',
    title: 'AI 데이터센터 인프라의 숨은 강자',
    summary: 'AI 데이터센터 전력/냉각 수요 급증으로 버티브가 핵심 수혜주로 부상. 수주잔고 사상 최대 기록 중.',
    content: `## 투자 포인트

### 1. AI 데이터센터 냉각 수요 폭발
- AI 서버는 기존 서버 대비 3-5배 전력/냉각 필요
- 액체냉각(Liquid Cooling) 솔루션 수요 급증
- 2024-2027년 데이터센터 냉각 시장 CAGR 20%+

### 2. 수주잔고 사상 최대
- 백로그 $6B 이상, 전년대비 30%+ 증가
- 마이크로소프트, 아마존 등 하이퍼스케일러 수주 확대
- 장기 서비스 계약으로 안정적 수익 기반

### 3. 마진 개선 스토리
- 가격 인상 + 운영효율화로 마진 확대
- 2024년 영업마진 15% 이상 목표
- 프리캐시플로우 급증 전망

## 리스크 요인
- 데이터센터 투자 사이클 둔화 가능성
- 원자재(구리, 알루미늄) 가격 변동
- 경쟁 심화 (슈나이더, 이튼 등)

## 밸류에이션
- 2024E PER 30배, AI 인프라 성장 프리미엄
- 피어그룹 대비 할인, 업사이드 여력`,
    investmentGrade: 'buy',
    targetPrice: 130,
    tags: ['데이터센터', 'AI인프라', '냉각', '전력'],
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: '4',
    companyName: '코카콜라',
    title: '66년 배당킹, 불확실성 시대의 안전자산',
    summary: '66년 연속 배당 인상 기록의 배당킹. 경기 방어적 특성과 글로벌 브랜드 파워로 포트폴리오 안정화에 기여.',
    content: `## 투자 포인트

### 1. 66년 연속 배당 인상
- 배당킹(50년 이상 연속 인상) 중에서도 최상위권
- 현재 배당수익률 약 3%
- 배당성장률 연평균 4-5%

### 2. 불황에 강한 방어주
- 음료 소비는 경기와 무관하게 안정적
- 글로벌 200개국 이상 판매 네트워크
- 가격 인상 능력 (인플레 헤지)

### 3. 제로슈거 라인업 성장
- 건강 트렌드에 맞춘 무설탕 제품 확대
- 코카콜라 제로, 스프라이트 제로 등 고성장
- 마진율 높은 프리미엄 제품 비중 확대

## 리스크 요인
- 설탕세 등 규제 강화
- 이머징마켓 환율 변동
- 저성장 우려 (매출 성장률 한 자릿수)

## 밸류에이션
- 2024E PER 24배, 방어주 프리미엄 반영
- 안정적 배당과 낮은 변동성 매력`,
    investmentGrade: 'hold',
    targetPrice: 65,
    tags: ['배당주', '소비재', '방어주', '배당킹'],
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: '5',
    companyName: 'MP 머티리얼스',
    title: '미국 유일의 희토류 생산... 국가 안보 자산',
    summary: '미국 내 유일한 희토류 생산업체로 전략적 가치 높음. 전기차/풍력/방산 수요 증가로 장기 성장 기대.',
    content: `## 투자 포인트

### 1. 미국 유일 희토류 생산
- 마운틴패스 광산, 미국 내 유일한 희토류 생산시설
- 중국 의존도 낮추려는 미국 정책의 핵심 수혜
- IRA 보조금 및 국방부 지원 대상

### 2. 전기차/풍력 핵심 소재
- 영구자석 모터에 필수적인 네오디뮴, 프라세오디뮴
- 전기차 1대당 희토류 약 2kg 사용
- 풍력 터빈도 대량의 희토류 필요

### 3. 수직계열화 진행
- 현재: 채굴 → 정광 생산
- 확장: 산화물 분리 → 금속/자석 생산
- 2025년까지 완전 수직계열화 목표

## 리스크 요인
- 희토류 가격 변동성 높음
- 중국의 덤핑 가능성
- 수직계열화 지연 리스크

## 밸류에이션
- 2024E PER 적자 전환 예상
- 장기 성장 스토리에 투자, 단기 변동성 감내 필요`,
    investmentGrade: 'buy',
    targetPrice: 25,
    tags: ['희토류', '전기차', '국가안보', '소재'],
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: '6',
    companyName: '팔란티어',
    title: 'AI 시대의 정부/기업 데이터 플랫폼',
    summary: '정부와 기업의 빅데이터 분석 플랫폼. AIP(AI Platform) 출시로 상업 부문 성장 가속화.',
    content: `## 투자 포인트

### 1. AI 플랫폼(AIP) 출시 효과
- 기존 데이터 분석에 생성형 AI 통합
- 기업 고객 도입 가속화 중
- 상업 부문 매출 성장률 40%+ 전망

### 2. 정부 계약 안정성
- 미 국방부, CIA 등 핵심 고객
- 장기 계약 기반 안정적 매출
- NATO 등 동맹국으로 확장 중

### 3. Rule of 40 달성
- 매출 성장률 + 영업마진 = 40% 이상
- SaaS 기업 중 프리미엄 밸류에이션 정당화
- 흑자 전환 및 FCF 양전환

## 리스크 요인
- 높은 밸류에이션 (PER 100배+)
- CEO 등 내부자 주식 매도
- 상업 부문 성장 지속성 불확실

## 밸류에이션
- 2024E PER 100배+, AI 프리미엄
- 고성장 기대 반영, 실망 시 하락 폭 클 수 있음`,
    investmentGrade: 'hold',
    targetPrice: 30,
    tags: ['AI', '빅데이터', '국방', 'SaaS'],
    createdAt: new Date(Date.now() - 518400000).toISOString(),
    updatedAt: new Date(Date.now() - 518400000).toISOString(),
  },
]

// 실제 포트폴리오 데이터 (사용자 보유 종목)
const SAMPLE_PORTFOLIO = [
  // 빅테크
  { id: '1', ticker: 'AMZN', shares: 1.184164, avgPrice: 198.00, currency: 'USD', createdAt: '2024-06-01' },
  { id: '2', ticker: 'MSFT', shares: 0.076658, avgPrice: 420.00, currency: 'USD', createdAt: '2024-06-01' },
  { id: '3', ticker: 'AAPL', shares: 0.042058, avgPrice: 225.00, currency: 'USD', createdAt: '2024-06-01' },
  { id: '4', ticker: 'META', shares: 0.018516, avgPrice: 600.00, currency: 'USD', createdAt: '2024-06-01' },
  { id: '5', ticker: 'GOOGL', shares: 0.040947, avgPrice: 175.00, currency: 'USD', createdAt: '2024-06-01' },
  { id: '6', ticker: 'GOOG', shares: 0.040868, avgPrice: 175.00, currency: 'USD', createdAt: '2024-06-01' },
  // 반도체
  { id: '7', ticker: 'TSM', shares: 0.036198, avgPrice: 165.00, currency: 'USD', createdAt: '2024-06-01' },
  { id: '8', ticker: 'AMD', shares: 0.022338, avgPrice: 155.00, currency: 'USD', createdAt: '2024-06-01' },
  { id: '9', ticker: 'AVGO', shares: 0.005936, avgPrice: 200.00, currency: 'USD', createdAt: '2024-06-01' },
  { id: '10', ticker: 'QCOM', shares: 0.035814, avgPrice: 155.00, currency: 'USD', createdAt: '2024-06-01' },
  { id: '11', ticker: 'MU', shares: 0.012903, avgPrice: 95.00, currency: 'USD', createdAt: '2024-06-01' },
  { id: '12', ticker: 'AMBA', shares: 0.083561, avgPrice: 62.00, currency: 'USD', createdAt: '2024-06-01' },
  // AI/데이터센터
  { id: '13', ticker: 'VRT', shares: 0.005514, avgPrice: 115.00, currency: 'USD', createdAt: '2024-06-01' },
  { id: '14', ticker: 'PLTR', shares: 0.00512, avgPrice: 25.00, currency: 'USD', createdAt: '2024-06-01' },
  // 자동차
  { id: '15', ticker: 'TSLA', shares: 0.001598, avgPrice: 250.00, currency: 'USD', createdAt: '2024-06-01' },
  // 금융
  { id: '16', ticker: 'AXP', shares: 0.049313, avgPrice: 280.00, currency: 'USD', createdAt: '2024-06-01' },
  { id: '17', ticker: 'BAC', shares: 0.216515, avgPrice: 42.00, currency: 'USD', createdAt: '2024-06-01' },
  // 헬스케어
  { id: '18', ticker: 'ISRG', shares: 0.010737, avgPrice: 520.00, currency: 'USD', createdAt: '2024-06-01' },
  // 소비재
  { id: '19', ticker: 'KO', shares: 0.157392, avgPrice: 63.00, currency: 'USD', createdAt: '2024-06-01' },
  // 에너지/유틸리티
  { id: '20', ticker: 'CVX', shares: 0.067548, avgPrice: 155.00, currency: 'USD', createdAt: '2024-06-01' },
  { id: '21', ticker: 'PBR', shares: 0.404282, avgPrice: 14.50, currency: 'USD', createdAt: '2024-06-01' },
  { id: '22', ticker: 'VST', shares: 0.008345, avgPrice: 85.00, currency: 'USD', createdAt: '2024-06-01' },
  // 소재
  { id: '23', ticker: 'MP', shares: 0.096771, avgPrice: 18.00, currency: 'USD', createdAt: '2024-06-01' },
  { id: '24', ticker: 'NEM', shares: 0.050266, avgPrice: 42.00, currency: 'USD', createdAt: '2024-06-01' },
  // ETF
  { id: '25', ticker: 'SPY', shares: 0.017702, avgPrice: 580.00, currency: 'USD', createdAt: '2024-06-01' },
  { id: '26', ticker: 'GLD', shares: 0.0264, avgPrice: 245.00, currency: 'USD', createdAt: '2024-06-01' },
  { id: '27', ticker: 'TLT', shares: 0.062517, avgPrice: 92.00, currency: 'USD', createdAt: '2024-06-01' },
  { id: '28', ticker: 'IEI', shares: 0.04585, avgPrice: 118.00, currency: 'USD', createdAt: '2024-06-01' },
  { id: '29', ticker: 'PDBC', shares: 0.375961, avgPrice: 14.00, currency: 'USD', createdAt: '2024-06-01' },
]

const SAMPLE_TRANSACTIONS = [
  { id: '1', type: 'buy', ticker: 'AMZN', shares: 1.184164, price: 198.00, total: 234.46, fee: 0, date: '2024-06-01', note: '분할매수' },
  { id: '2', type: 'buy', ticker: 'MSFT', shares: 0.076658, price: 420.00, total: 32.20, fee: 0, date: '2024-06-01', note: '' },
  { id: '3', type: 'buy', ticker: 'TSM', shares: 0.036198, price: 165.00, total: 5.97, fee: 0, date: '2024-06-01', note: 'AI 반도체' },
  { id: '4', type: 'buy', ticker: 'KO', shares: 0.157392, price: 63.00, total: 9.92, fee: 0, date: '2024-06-01', note: '배당주' },
]

export function DataProvider({ children }) {
  const [news, setNews] = useState(SAMPLE_NEWS)
  const [companies, setCompanies] = useState(SAMPLE_COMPANIES)
  const [reports, setReports] = useState(SAMPLE_REPORTS)
  const [connections, setConnections] = useState(SAMPLE_CONNECTIONS)
  const [portfolio, setPortfolio] = useState(SAMPLE_PORTFOLIO)
  const [transactions, setTransactions] = useState(SAMPLE_TRANSACTIONS)

  // 초기 로드
  useEffect(() => {
    const savedNews = localStorage.getItem(STORAGE_KEYS.news)
    const savedCompanies = localStorage.getItem(STORAGE_KEYS.companies)
    const savedReports = localStorage.getItem(STORAGE_KEYS.reports)
    const savedConnections = localStorage.getItem(STORAGE_KEYS.connections)

    // 뉴스 로드
    if (savedNews) {
      setNews(JSON.parse(savedNews))
    } else {
      setNews(SAMPLE_NEWS)
    }

    // 리포트 로드
    if (savedReports) {
      const parsed = JSON.parse(savedReports)
      setReports(parsed.length === 0 ? SAMPLE_REPORTS : parsed)
    } else {
      setReports(SAMPLE_REPORTS)
    }

    // 강제 재생성 (기존 데이터 무시하고 10,000개 생성)
    console.log('🚀 자동 생성 시작: 포트폴리오 기업 기반 10,000개 연관 기업...')
    localStorage.removeItem(STORAGE_KEYS.companies)
    localStorage.removeItem(STORAGE_KEYS.connections)

    const result = generateMassiveDataFromCore(SAMPLE_COMPANIES, 10000)
    console.log(`✅ 생성 완료: 기업 ${result.companies.length}개, 연결 ${result.connections.length}개`)

    setCompanies(result.companies)
    setConnections(result.connections)

    // 포트폴리오 강제 재로드 (최신 데이터 반영)
    console.log('📊 포트폴리오 데이터 로드: 29개 종목')
    localStorage.removeItem(STORAGE_KEYS.portfolio)
    localStorage.removeItem(STORAGE_KEYS.transactions)
    setPortfolio(SAMPLE_PORTFOLIO)
    setTransactions(SAMPLE_TRANSACTIONS)
  }, [])

  // 저장
  useEffect(() => {
    if (news.length > 0) localStorage.setItem(STORAGE_KEYS.news, JSON.stringify(news))
  }, [news])

  useEffect(() => {
    if (companies.length > 0) localStorage.setItem(STORAGE_KEYS.companies, JSON.stringify(companies))
  }, [companies])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.reports, JSON.stringify(reports))
  }, [reports])

  useEffect(() => {
    if (connections.length > 0) localStorage.setItem(STORAGE_KEYS.connections, JSON.stringify(connections))
  }, [connections])

  useEffect(() => {
    if (portfolio.length > 0) localStorage.setItem(STORAGE_KEYS.portfolio, JSON.stringify(portfolio))
  }, [portfolio])

  useEffect(() => {
    if (transactions.length > 0) localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions))
  }, [transactions])

  // News 함수
  const addNews = (item) => {
    setNews(prev => [{ ...item, id: Date.now().toString(), createdAt: new Date().toISOString() }, ...prev])
  }

  const updateNews = (id, updates) => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n))
  }

  const deleteNews = (id) => {
    setNews(prev => prev.filter(n => n.id !== id))
  }

  // Company 함수
  const addCompany = (company) => {
    setCompanies(prev => [...prev, { ...company, id: Date.now().toString() }])
  }

  const updateCompany = (id, updates) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }

  const deleteCompany = (id) => {
    setCompanies(prev => prev.filter(c => c.id !== id))
    setConnections(prev => prev.filter(c => c.sourceId !== id && c.targetId !== id))
  }

  // Report 함수
  const addReport = (report) => {
    const newReport = {
      ...report,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setReports(prev => [newReport, ...prev])
    return newReport
  }

  const updateReport = (id, updates) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r))
  }

  const deleteReport = (id) => {
    setReports(prev => prev.filter(r => r.id !== id))
  }

  // Connection 함수
  const addConnection = (connection) => {
    setConnections(prev => [...prev, { ...connection, id: Date.now().toString() }])
  }

  const updateConnection = (id, updates) => {
    setConnections(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c))
  }

  const deleteConnection = (id) => {
    setConnections(prev => prev.filter(c => c.id !== id))
  }

  // Portfolio 함수
  const addHolding = (holding) => {
    const newHolding = {
      ...holding,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    }
    setPortfolio(prev => [...prev, newHolding])
    return newHolding
  }

  const updateHolding = (id, updates) => {
    setPortfolio(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h))
  }

  const deleteHolding = (id) => {
    setPortfolio(prev => prev.filter(h => h.id !== id))
  }

  // Transaction 함수
  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: transaction.date || new Date().toISOString().split('T')[0],
    }
    setTransactions(prev => [newTransaction, ...prev])

    // 매수/매도에 따라 포트폴리오 자동 업데이트
    const existingHolding = portfolio.find(h => h.ticker === transaction.ticker)

    if (transaction.type === 'buy') {
      if (existingHolding) {
        // 평균 단가 재계산
        const totalShares = existingHolding.shares + transaction.shares
        const totalCost = (existingHolding.shares * existingHolding.avgPrice) +
                         (transaction.shares * transaction.price)
        const newAvgPrice = totalCost / totalShares

        updateHolding(existingHolding.id, {
          shares: totalShares,
          avgPrice: Math.round(newAvgPrice * 100) / 100,
        })
      } else {
        // 새 종목 추가
        const company = companies.find(c => c.ticker === transaction.ticker)
        addHolding({
          companyId: company?.id || '',
          ticker: transaction.ticker,
          shares: transaction.shares,
          avgPrice: transaction.price,
          currency: 'USD',
        })
      }
    } else if (transaction.type === 'sell' && existingHolding) {
      const remainingShares = existingHolding.shares - transaction.shares
      if (remainingShares <= 0) {
        deleteHolding(existingHolding.id)
      } else {
        updateHolding(existingHolding.id, { shares: remainingShares })
      }
    }

    return newTransaction
  }

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  // 데이터 리셋 (새 샘플 데이터로 초기화)
  const resetToSampleData = () => {
    localStorage.removeItem(STORAGE_KEYS.news)
    localStorage.removeItem(STORAGE_KEYS.companies)
    localStorage.removeItem(STORAGE_KEYS.reports)
    localStorage.removeItem(STORAGE_KEYS.connections)
    setNews(SAMPLE_NEWS)
    setCompanies(SAMPLE_COMPANIES)
    setReports(SAMPLE_REPORTS)
    setConnections(SAMPLE_CONNECTIONS)
  }

  // 대량 데이터 생성 (기존 포트폴리오 기업 기반 100,000개)
  const generateMassiveData = (count = 100000) => {
    // 현재 등록된 기업들을 핵심 기업으로 사용
    const coreCompanies = companies.length > 0 ? companies : SAMPLE_COMPANIES
    const result = generateMassiveDataFromCore(coreCompanies, count)
    setCompanies(result.companies)
    setConnections(result.connections)
    return { companies: result.companies.length, connections: result.connections.length }
  }

  const value = {
    news, addNews, updateNews, deleteNews,
    companies, addCompany, updateCompany, deleteCompany,
    reports, addReport, updateReport, deleteReport,
    connections, addConnection, updateConnection, deleteConnection,
    portfolio, addHolding, updateHolding, deleteHolding,
    transactions, addTransaction, deleteTransaction,
    resetToSampleData,
    generateMassiveData,
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}

export default DataContext
