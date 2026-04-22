# /battle-update - 수익률 대결 업데이트

## 목적
수익률 대결 페이지의 하늘/가윤 보유 종목 및 월별 수익률 데이터를 업데이트합니다.

## 대상 파일
**파일 경로**: `src/pages/PortfolioBattlePage.jsx`

---

## 데이터 구조

### BATTLE_INFO (대결 정보)
```javascript
const BATTLE_INFO = {
  startDate: '2026-02-22',    // 대결 시작일
  endDate: '2026-12-24',      // 대결 종료일
  prize: '치킨',              // 상품
  lastUpdate: '2026.03.29',   // 마지막 업데이트 날짜 ⬅️ 업데이트 필요
}
```

### HAUGA_HOLDINGS (하늘 보유 종목)
```javascript
{
  ticker: 'MSFT',          // 티커 (고유 식별자)
  name: '마이크로소프트',   // 종목명
  currentKRW: 41152,       // 현재 평가금액
  investedKRW: 47590,      // 매입금액
  gainPercent: -13.52      // 수익률
}
```

**포함 계좌**: 토스증권, 미래에셋 (연금, ISA, 해외주식, IRP, CMA)

### GAYOON_HOLDINGS (가윤 보유 종목)
```javascript
{
  ticker: 'VOO',
  name: 'Vanguard S&P500 ETF',
  currentKRW: 19317195,
  investedKRW: 18034965,
  gainPercent: 7.11
}
```

**포함 계좌**: 삼성증권 (해외주식, ISA, CMA), 한투, 미래에셋 (연금, IRP), 업비트

### MONTHLY_RECORDS (월별 수익률)
```javascript
const MONTHLY_RECORDS = {
  '2026-02': { haneul: -2.1, gayoon: -1.8 },
  '2026-03': { haneul: -3.2, gayoon: 0.4 },
  // 새 달 추가
}
```

---

## 실행 단계

### Step 1: 현재 데이터 확인
PortfolioPage.jsx와 GayoonWealthPage.jsx에서 최신 데이터 확인

### Step 2: 대결 종목 업데이트

#### 하늘 종목 매핑 (PortfolioPage.jsx → PortfolioBattlePage.jsx)
- `TOSS_HOLDINGS` → 토스 해외주식
- `MIRAE_ACCOUNTS[].holdings` → 미래에셋 각 계좌
- `CRYPTO_HOLDINGS` → 비트코인

#### 가윤 종목 매핑 (GayoonWealthPage.jsx → PortfolioBattlePage.jsx)
- `GAYOON_ALL_HOLDINGS` → 전체 종목
- `TRACKED_ASSETS` → 아마존, 비트코인

### Step 3: 티커 규칙
같은 종목이 여러 계좌에 있을 때 접미사 사용:
- `_P` = 연금저축 (Pension)
- `_I` = ISA
- `_M` = 미래에셋
- 없음 = 기본 계좌

예시:
```javascript
{ ticker: 'KODEX200', name: 'KODEX 200', ... }           // 기본
{ ticker: 'KODEX200_P', name: 'KODEX 200 (연금)', ... }  // 연금저축
{ ticker: 'KODEX200_ISA', name: 'KODEX 200 (ISA)', ... } // ISA
```

### Step 4: 월별 수익률 계산

월말 기준 총 수익률 계산:
```javascript
const totalCurrent = holdings.reduce((sum, h) => sum + h.currentKRW, 0)
const totalInvested = holdings.reduce((sum, h) => sum + h.investedKRW, 0)
const returnPercent = ((totalCurrent - totalInvested) / totalInvested) * 100
```

### Step 5: 변경 내역 제시

```markdown
## 수익률 대결 업데이트 (2026.04.10)

### 하늘버핏 변경사항
| 종목 | 기존 수익률 | 새 수익률 |
|------|------------|----------|
| 마이크로소프트 | -13.52% | -XX.XX% |

### 가윤달리오 변경사항
| 종목 | 기존 수익률 | 새 수익률 |
|------|------------|----------|
| VOO | +7.11% | +X.XX% |

### 월별 수익률 추가
| 월 | 하늘 | 가윤 |
|----|------|------|
| 2026-04 | -X.X% | +X.X% |
```

### Step 6: 파일 수정
- `BATTLE_INFO.lastUpdate` 업데이트
- `HAUGA_HOLDINGS` 업데이트
- `GAYOON_HOLDINGS` 업데이트
- `MONTHLY_RECORDS` 새 달 추가 (해당 시)

---

## 주의사항

1. **제외 종목**: CMA 예수금, IRP 현금성자산, 미국달러 잔액은 `compareHoldings()`에서 제외됨
2. **공통 종목**: 두 사람 모두 보유한 종목은 비교 테이블에 표시됨
3. **수익률 계산**: gainPercent = (gainKRW / investedKRW) × 100
4. **날짜 형식**: lastUpdate는 `'2026.MM.DD'` 형식

---

## 참고: 현재 대결 현황 계산 로직

```javascript
// PortfolioBattlePage.jsx에서 자동 계산됨
const haugaStats = calculatePortfolioStats(HAUGA_HOLDINGS)
const gayoonStats = calculatePortfolioStats(GAYOON_HOLDINGS)

// 승자 결정
const winner = haneulReturn > gayoonReturn ? 'haneul'
             : gayoonReturn > haneulReturn ? 'gayoon'
             : 'tie'
```
