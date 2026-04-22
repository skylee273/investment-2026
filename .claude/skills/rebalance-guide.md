# /rebalance-guide - 리밸런싱 가이드 작성

## 목적
RebalancePage의 맞춤 분석 탭을 업데이트하고, 월가 전설들의 관점에서 포트폴리오를 평가합니다.

## 대상 파일
**파일 경로**: `src/pages/RebalancePage.jsx`
**대상 함수**: `renderPersonal()` 내부의 `haneulData`, `gayoonData`

---

## 데이터 구조

### haneulData (하늘버핏)
```javascript
const haneulData = {
  total: 4430000,  // 총 투자금액
  portfolio: [
    { account: '연금저축', asset: 'KODEX 200, 코스닥150', amount: 1390000, ratio: 31.4 },
    { account: 'ISA', asset: '코스닥150, 미국채, S&P500', amount: 500000, ratio: 11.3 },
    { account: '해외주식(미래)', asset: '셰브론, 알파벳, 화이자', amount: 1100000, ratio: 24.8 },
    { account: '해외주식(토스)', asset: '아마존, MSFT, META 등', amount: 560000, ratio: 12.6 },
    { account: 'IRP', asset: '예수금', amount: 250000, ratio: 5.6 },
    { account: 'CMA', asset: '가족여행', amount: 610000, ratio: 13.8 },
    { account: '비트코인', asset: 'BTC', amount: 20000, ratio: 0.5 },
  ],
  analysis: '분석 내용 (AI 작성)',
  recommendation: '권고사항 (AI 작성)',
  buyList: [
    { action: '매수', asset: '종목명', amount: '금액', reason: '이유' },
  ],
  sellList: [
    { action: '매도', asset: '종목명', amount: '금액', reason: '이유' },
  ],
  legends: [ /* 월가 전설들 평가 */ ],
  overallGrade: 'B+',
}
```

### gayoonData (가윤달리오)
```javascript
const gayoonData = {
  total: 65620000,
  portfolio: [
    { account: '해외주식(삼성)', asset: 'VOO, SCHD, 케이뱅크', amount: 24610000, ratio: 37.5 },
    { account: '한투', asset: '아마존', amount: 2700000, ratio: 4.1 },
    { account: 'ISA(삼성)', asset: '코스피, 나스닥, 신흥국, 채권, 금', amount: 19380000, ratio: 29.5 },
    { account: '연금저축(미래)', asset: '코스피200, 코스닥150', amount: 5540000, ratio: 8.4 },
    { account: 'CMA', asset: '현금성', amount: 14030000, ratio: 21.4 },
    { account: 'IRP', asset: 'TDF2025', amount: 270000, ratio: 0.4 },
    { account: '비트코인', asset: 'BTC', amount: 1090000, ratio: 1.7 },
  ],
  analysis: '...',
  recommendation: '...',
  buyList: [...],
  sellList: [...],
  legends: [...],
  overallGrade: 'A-',
}
```

---

## 가윤달리오 섹션 특별 기능

### 1. 하늘버핏의 리밸런싱 의견 (AI 작성)

**어조**: 전문 투자 분석가, 친근하면서도 신뢰감 있는 톤
**구성**:
1. 현재 포트폴리오 요약 (강점/약점)
2. 시장 상황 고려한 분석
3. 구체적 개선 방향

**예시**:
```
가윤님의 포트폴리오는 전형적인 '코어-위성' 전략을 따르고 있습니다.
VOO와 SCHD가 핵심 자산(37.5%)을 구성하고, ISA 내 분산투자가 안정성을 더합니다.

[강점]
- S&P500 + 배당 ETF 조합으로 안정적 성장 추구
- ISA 내 6개 자산군 분산으로 리스크 관리 양호

[개선점]
- CMA 비중(21.4%)이 높아 기회비용 발생
- 신흥국 비중(-10% 손실) 재검토 필요
```

### 2. 매수/매도 표 (사용자 직접 작성)

사용자가 결정한 리밸런싱 내용을 구조화:

```javascript
buyList: [
  { action: '매수', asset: 'TIGER 미국S&P500', amount: '50만원', reason: 'ISA 위험자산 비중 확대' },
  { action: '매수', asset: 'KODEX 골드액티브', amount: '30만원', reason: '금 비중 10% 목표' },
],
sellList: [
  { action: '매도', asset: 'PLUS 신흥국MSCI', amount: '일부', reason: '손실 축소, 비중 조정' },
]
```

### 3. 월가 전설들 평가 (AI 작성)

5명의 투자 대가 관점에서 포트폴리오 평가:

```javascript
legends: [
  {
    name: '워렌 버핏',
    icon: '🎩',
    color: '#F59E0B',  // 노란색
    perspective: '가치투자, 경제적 해자',
    rating: 'B+',
    comment: 'S&P500 ETF 보유는 좋지만, 개별 기업의 본질적 가치를 파악하기 어려운 구조입니다. "모르는 것에 투자하지 말라"는 원칙에서 암호화폐 비중은 우려됩니다.',
  },
  {
    name: '레이 달리오',
    icon: '🌊',
    color: '#3182F6',  // 파란색
    perspective: '올웨더 포트폴리오, 자산배분',
    rating: 'A-',
    comment: '주식, 채권, 금, 현금의 분산이 양호합니다. 다만 올웨더 기준 채권 비중이 낮고, 원자재 노출이 금에만 국한되어 있습니다.',
  },
  {
    name: '피터 린치',
    icon: '📈',
    color: '#10B981',  // 초록색
    perspective: '성장주 투자, PEG',
    rating: 'B',
    comment: '나스닥100을 통한 성장주 노출은 좋지만, 개별 성장주 발굴 기회가 제한적입니다. "10루타 종목"을 찾을 여지가 없네요.',
  },
  {
    name: '존 보글',
    icon: '📊',
    color: '#8B5CF6',  // 보라색
    perspective: '인덱스 투자, 비용 최소화',
    rating: 'A',
    comment: '저비용 인덱스 ETF 중심의 포트폴리오는 제가 평생 주장한 방식과 일치합니다. VOO, SCHD 같은 ETF는 훌륭한 선택입니다.',
  },
  {
    name: '하워드 막스',
    icon: '⚖️',
    color: '#EF4444',  // 빨간색
    perspective: '리스크 관리, 시장 사이클',
    rating: 'B+',
    comment: 'CMA 현금 보유는 "2차 사고"를 할 수 있는 여유를 제공합니다. 다만 신흥국 손실을 보면서도 보유하는 것은 "떨어지는 칼날"을 잡는 것일 수 있습니다.',
  },
]
```

### 4. 종합 평점

| 등급 | 설명 |
|------|------|
| A+ | 탁월함 - 장기 투자에 최적화 |
| A | 우수함 - 균형 잡힌 포트폴리오 |
| A- | 양호함 - 약간의 개선 여지 |
| B+ | 괜찮음 - 몇 가지 조정 권장 |
| B | 보통 - 리밸런싱 필요 |
| B- | 미흡함 - 상당한 개선 필요 |
| C | 부족함 - 구조적 문제 있음 |

---

## 실행 단계

### Step 1: 최신 데이터 수집
PortfolioPage.jsx, GayoonWealthPage.jsx에서 최신 보유 현황 확인

### Step 2: 포트폴리오 요약 업데이트
```javascript
haneulData.portfolio = [
  { account: '계좌명', asset: '보유종목', amount: 금액, ratio: 비율 },
  ...
]
```

### Step 3: 하늘버핏의 리밸런싱 의견 작성
- 현재 시장 상황 고려
- 포트폴리오 강점/약점 분석
- 구체적 개선안 제시

### Step 4: 매수/매도 표 작성 (사용자 입력)
사용자에게 질문:
"어떤 종목을 매수/매도하실 계획인가요?"

### Step 5: 월가 전설들 평가 작성
5명 각각의 관점에서 평가 및 코멘트

### Step 6: 종합 평점 산정
전설들 평점 평균 + 전체적 균형 고려

### Step 7: 파일 수정
renderPersonal() 함수 내 haneulData, gayoonData 업데이트

---

## 주의사항

1. **객관성 유지**: 평가는 중립적이고 건설적으로
2. **구체성**: "좋다/나쁘다" 대신 구체적 수치와 이유 제시
3. **일관성**: 5명 전설들의 투자 철학에 충실한 평가
4. **실용성**: 실제로 실행 가능한 매수/매도 권고

---

## 월가 전설들 투자 철학 요약

| 전설 | 핵심 철학 | 긍정 시그널 | 부정 시그널 |
|------|----------|------------|------------|
| 워렌 버핏 | 경쟁우위 기업 장기보유 | 우량 배당주, 낮은 회전율 | 투기성 자산, 이해 못하는 투자 |
| 레이 달리오 | 자산배분, 리스크 패리티 | 다양한 자산군 분산 | 단일 자산 집중 |
| 피터 린치 | 성장주 발굴, PEG | 성장잠재력 종목 | 고평가 종목, 모르는 산업 |
| 존 보글 | 저비용 인덱스 | 저비용 ETF, 장기보유 | 고비용, 잦은 매매 |
| 하워드 막스 | 리스크 관리, 현금 확보 | 현금 비중, 하방 보호 | 레버리지, 추세추종 |
