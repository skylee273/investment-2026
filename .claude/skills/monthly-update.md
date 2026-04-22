# /monthly-update - 월간 데이터 업데이트

## 목적
증권사 스크린샷을 분석하여 하늘버핏/가윤달리오 페이지의 투자 데이터를 **1원의 오차 없이** 정확하게 업데이트합니다.

## 대상 파일 및 데이터 구조

### 1. 하늘버핏 (PortfolioPage.jsx)
**파일 경로**: `src/pages/PortfolioPage.jsx`

#### MIRAE_ACCOUNTS (미래에셋 계좌별)
```javascript
{
  id: 'pension',           // 계좌 ID
  name: '연금저축계좌',    // 계좌명
  accountNo: '010-xxxx',   // 계좌번호
  icon: '🧓',
  totalKRW: 1393035,       // 총 평가금액
  gainKRW: -83440,         // 총 손익
  gainPercent: -5.65,      // 총 수익률
  holdings: [
    { name: '종목명', shares: 13, currentKRW: 0, investedKRW: 0, gainKRW: 0, gainPercent: 0 }
  ]
}
```

#### TOSS_HOLDINGS (토스증권 해외주식)
```javascript
{ name: '종목명 (티커)', currentKRW: 0, investedKRW: 0, gainKRW: 0, gainPercent: 0 }
```

#### CRYPTO_HOLDINGS (업비트 암호화폐)
```javascript
{ name: '비트코인 (BTC)', currentKRW: 0, investedKRW: 0, gainKRW: 0, gainPercent: 0 }
```

---

### 2. 가윤달리오 (GayoonWealthPage.jsx)
**파일 경로**: `src/pages/GayoonWealthPage.jsx`

#### FIXED_ASSETS (고정자산)
```javascript
{ id: 'isa', name: 'ISA', icon: '📈', currentKRW: 0, investedKRW: 0, gainKRW: 0, gainPercent: 0, note: '증권사 · 수익률%' }
```

#### STABLE_ASSETS (비변동성 자산)
```javascript
{ id: 'sp500-dividend', name: 'S&P500 + 배당주', icon: '📈', currentKRW: 0, investedKRW: 0, gainKRW: 0, gainPercent: 0, note: '증권사 · +수익률%', type: 'stock' }
```

#### LIQUID_ASSETS (변동성 자산)
```javascript
{ id: 'cma', name: 'CMA', icon: '💵', currentKRW: 0, investedKRW: 0, gainKRW: 0, gainPercent: 0, note: '증권사 · +수익률%' }
```

#### GAYOON_ALL_HOLDINGS (전체 보유 종목)
```javascript
{
  ticker: 'VOO',
  name: 'Vanguard S&P500 ETF',
  category: '해외주식',
  account: '해외주식',       // 계좌명
  accountIcon: '📈',
  investedKRW: 0,           // 매입금액
  currentKRW: 0,            // 평가금액
  gainKRW: 0,               // 손익
  gainPercent: 0,           // 수익률
  risk: 3,                  // 위험도 1-5
}
```

#### TRACKED_ASSETS (실시간 추적 자산)
```javascript
{
  id: 'amazon',
  name: '아마존 (AMZN)',
  icon: '🛒',
  type: 'manual',
  shares: 9,               // 보유수량
  investedKRW: 0,
  currentKRW: 0,
  gainKRW: 0,
  gainPercent: 0,
  note: '한투 · 9주',
}
```

---

## 실행 단계

### Step 1: 스크린샷 분석
1. 사용자가 제공한 스크린샷 확인
2. 증권사/계좌 구분 (미래에셋, 토스, 삼성, 한투, 업비트)
3. 각 종목별 데이터 추출:
   - 종목명
   - 보유수량 (해당시)
   - 매입금액 (investedKRW)
   - 평가금액 (currentKRW)
   - 손익 (gainKRW)
   - 수익률 (gainPercent)

### Step 2: 계산 검증 (필수!)
각 종목에 대해 반드시 검증:
```
gainKRW = currentKRW - investedKRW
gainPercent = (gainKRW / investedKRW) × 100
```

**소수점 처리**:
- gainPercent: 소수점 둘째자리까지 (예: -5.65)
- 금액: 정수 (원 단위)

### Step 3: 변경 내역 제시
사용자에게 변경 내역을 표로 제시:

| 구분 | 종목 | 기존 평가금액 | 새 평가금액 | 기존 수익률 | 새 수익률 |
|------|------|--------------|------------|------------|----------|
| 하늘 | KODEX 200 | 1,055,925 | X,XXX,XXX | -6.70% | -X.XX% |

### Step 4: 사용자 승인
"위 내용으로 업데이트해도 될까요?" 확인

### Step 5: 파일 수정
승인 후 해당 파일의 상수 업데이트

### Step 6: 날짜 업데이트
파일 상단 주석의 날짜 업데이트:
```javascript
// 2026.XX.XX 기준
```

---

## 주의사항

1. **정확도 100%**: 스크린샷의 숫자를 그대로 입력. 반올림/추정 금지
2. **계산 불일치 시**: 스크린샷 값 우선 사용, 불일치 사항 사용자에게 알림
3. **누락 종목**: 새 종목 추가 시 기존 구조 따라 작성
4. **삭제 종목**: 사용자 확인 후 제거
5. **증권사 구분**: 하늘(미래에셋, 토스, 업비트) / 가윤(삼성, 한투, 미래에셋, 업비트)

---

## 예시 출력

```
## 스크린샷 분석 결과

### 미래에셋 연금저축 (2026.04.10)
| 종목 | 수량 | 매입금액 | 평가금액 | 손익 | 수익률 |
|------|------|----------|----------|------|--------|
| KODEX 200 | 13주 | 1,131,700 | 1,055,925 | -75,775 | -6.70% |
| KODEX 코스닥150 | 17주 | 344,775 | 337,110 | -7,665 | -2.22% |
| **합계** | - | 1,476,475 | 1,393,035 | -83,440 | -5.65% |

✅ 계산 검증 완료
위 내용으로 PortfolioPage.jsx를 업데이트할까요?
```
