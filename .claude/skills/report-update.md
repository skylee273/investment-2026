# /report-update - 월간 리포트 업데이트

## 목적
세제혜택 계좌(ISA, 연금저축, IRP, 추가연금저축)의 실제 보유 종목 데이터를 업데이트합니다.

## 대상 파일
**파일 경로**: `src/pages/PortfolioReportPage.jsx`

---

## 데이터 구조

### ACTUAL_HOLDINGS (실제 보유 종목)

```javascript
const ACTUAL_HOLDINGS = {
  isa: {
    investedKRW: 19988835,    // 총 매입금액
    currentKRW: 19381115,     // 총 평가금액
    gainKRW: -607720,         // 총 손익
    gainPercent: -3.04,       // 총 수익률
    holdings: [
      {
        name: 'KODEX 200',
        investedKRW: 5223390,
        currentKRW: 5117175,
        gainKRW: -106215,
        gainPercent: -2.03
      },
      // ... 더 많은 종목
    ],
  },
  pension: { ... },
  irp: { ... },
  pensionExtra: { ... },
}
```

---

## 계좌별 상세

### ISA (Individual Savings Account)
- **목표 금액**: 2,000만원
- **기대 종목**: KODEX 200, TIGER 미국S&P500, TIGER 미국나스닥100, PLUS 신흥국MSCI, TIGER 미국채10년선물, KODEX 금액티브

### 연금저축 (pension)
- **목표 금액**: 600만원
- **기대 종목**: KODEX 200, KODEX 코스닥150

### IRP (Individual Retirement Pension)
- **목표 금액**: 300만원
- **기대 종목**: TDF2025 또는 기타 적격 투자상품

### 추가 연금저축 (pensionExtra)
- **목표 금액**: 900만원
- **상태**: 예정 (현재 0원)

---

## 실행 단계

### Step 1: 스크린샷/데이터 확인
가윤달리오(GayoonWealthPage.jsx)의 최신 데이터 기준으로 업데이트

### Step 2: 계좌별 종목 추출

**ISA 종목 (삼성증권)**:
- GAYOON_ALL_HOLDINGS에서 account === 'ISA'인 종목

**연금저축 종목 (미래에셋)**:
- GAYOON_ALL_HOLDINGS에서 account === '연금저축'인 종목

**IRP 종목 (미래에셋)**:
- GAYOON_ALL_HOLDINGS에서 account === 'IRP'인 종목

### Step 3: 합계 계산

```javascript
// 각 계좌별 합계
const total = {
  investedKRW: holdings.reduce((sum, h) => sum + h.investedKRW, 0),
  currentKRW: holdings.reduce((sum, h) => sum + h.currentKRW, 0),
}
total.gainKRW = total.currentKRW - total.investedKRW
total.gainPercent = (total.gainKRW / total.investedKRW) * 100
```

### Step 4: 변경 내역 제시

```markdown
## 월간 리포트 업데이트 (2026.04.10)

### ISA 계좌
| 종목 | 매입금액 | 평가금액 | 손익 | 수익률 |
|------|----------|----------|------|--------|
| KODEX 200 | 5,223,390 | 5,117,175 | -106,215 | -2.03% |
| ... | ... | ... | ... | ... |
| **합계** | 19,988,835 | 19,381,115 | -607,720 | -3.04% |

### 연금저축 계좌
| 종목 | 매입금액 | 평가금액 | 손익 | 수익률 |
...

### IRP 계좌
| 종목 | 매입금액 | 평가금액 | 손익 | 수익률 |
...
```

### Step 5: 파일 수정
ACTUAL_HOLDINGS 상수 업데이트

---

## 데이터 소스 매핑

| 리포트 계좌 | GayoonWealthPage 소스 |
|------------|----------------------|
| isa | GAYOON_ALL_HOLDINGS (account: 'ISA') |
| pension | GAYOON_ALL_HOLDINGS (account: '연금저축') |
| irp | GAYOON_ALL_HOLDINGS (account: 'IRP') |
| pensionExtra | GAYOON_ALL_HOLDINGS (account: '추가연금저축') |

---

## 주의사항

1. **GayoonWealthPage와 동기화**: 월간 리포트는 가윤달리오 데이터 기반
2. **예수금 포함 여부**: ISA/IRP 예수금은 별도 표시 또는 합계에 포함
3. **계산 검증**: gainKRW = currentKRW - investedKRW
4. **날짜 주석**: 파일 상단에 기준 날짜 주석 업데이트

---

## 참고: PORTFOLIOS 구조 (목표 포트폴리오)

PORTFOLIOS는 **목표 자산배분**을 정의하며, ACTUAL_HOLDINGS와 별개입니다.
- PORTFOLIOS: "이렇게 투자하려고 계획함"
- ACTUAL_HOLDINGS: "실제로 이만큼 보유 중"

두 데이터를 비교하여 리밸런싱 필요성을 파악할 수 있습니다.
