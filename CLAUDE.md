# 빠른 시작
```bash
npm run dev -- --port 1234 & sleep 2 && open http://localhost:1234
```
**포트: 1234 (고정)**

---

# 프로젝트 메모리

## 프로젝트 개요
- **이름**: 투자 리서치 플랫폼
- **목적**: 개인 포트폴리오 기반 투자 리서치 도구

## 핵심 기능
1. **뉴스 대시보드** (`/`) - 증권/부동산 뉴스, 직접 추가 가능
2. **하우가 패밀리** (`/portfolio`) - 포트폴리오 관리
3. **관심 종목** (`/watchlist`) - 관심 종목 추적
4. **기관투자자** (`/whales`) - 기관 동향
5. **시장 심리** (`/sentiment`) - 시장 심리 지표
6. **투자 캘린더** (`/calendar`) - 일정 관리
7. **투자 일지** (`/journal`) - 투자 기록
8. **투자 학습** (`/learn`) - 학습 자료
9. **리포트** (`/reports`) - 마크다운 에디터로 작성/편집
10. **가윤 달리오** (`/gayoon`) - 포트폴리오 분석
11. **수익률 대결** (`/battle`) - 수익률 비교
12. **절세 가이드** (`/tax`) - 절세 마스터플랜 (HTML 브로셔)

## 기술 스택
- React + Vite
- react-router-dom (라우팅)
- @uiw/react-md-editor (마크다운)
- LocalStorage + Context API (데이터 저장)
- **Tailwind 사용 안함** - 렌더링 이슈로 인라인 스타일 사용

## UI/UX 결정사항
- **토스 스타일** UI (라이트 모드)
- 인라인 스타일 객체 방식 사용
- 한국어 UI

---

## 현재 투자 현황 (2026.03)

### 하우가 패밀리 (PortfolioPage)
| 계좌 | 금액 |
|------|------|
| 일반 주식 | 137만원 |
| CMA | 100만원 |
| 연금저축 | 827,010원 |
| ISA | 504,089원 |

### 가윤 달리오 (GayoonWealthPage)

#### 세제혜택 계좌 현황
| 계좌 | 목표 | 상태 | 세액공제 |
|------|------|------|----------|
| 연금저축 | 600만 | 완료 | 79.2만원 |
| IRP | 300만 | 완료 | 39.6만원 |
| ISA | 2,000만 | 완료 | 비과세 200만 |
| 추가 연금저축 | 900만 | 예정 | 없음 (과세이연) |

**총 세액공제: 118.8만원**

#### 포트폴리오 구성

**ISA (2,000만원)**
- S&P500 50% / 나스닥 15% / 신흥국 15% / 금 10% / 채권 10%

**연금저축 (600만원)**
- KODEX 200 70% / KODEX 코스닥150 30%

**IRP (300만원)** - 위험자산 70% + 안전자산 30%
- 나스닥 35% / S&P500 21% / 신흥국 14% / 금(KODEX 금액티브) 30%

**추가 연금저축 (900만원 예정)**
- S&P500 50% / 나스닥 15% / 신흥국 15% / 금(KODEX 금액티브) 20%

#### 투자 자산
- S&P500 + 배당주: 2,679.6만원
- 아마존 (AMZN): 300만원

---

## 파일 구조
```
src/
├── App.jsx                   # 라우터 설정
├── main.jsx
├── contexts/DataContext.jsx  # 전역 데이터 관리
├── data/
│   ├── sectors.js           # 섹터, 연결유형 정의
│   └── generateData.js      # 대량 데이터 생성기
├── pages/
│   ├── HomePage.jsx         # 뉴스 대시보드
│   ├── PortfolioPage.jsx    # 하우가 패밀리
│   ├── WatchlistPage.jsx    # 관심 종목
│   ├── WhalesPage.jsx       # 기관투자자
│   ├── MarketSentimentPage.jsx # 시장 심리
│   ├── CalendarPage.jsx     # 투자 캘린더
│   ├── JournalPage.jsx      # 투자 일지
│   ├── LearnPage.jsx        # 투자 학습
│   ├── ReportsPage.jsx      # 리포트 목록
│   ├── ReportDetailPage.jsx # 리포트 상세
│   ├── ReportEditorPage.jsx # 리포트 편집
│   ├── GayoonWealthPage.jsx # 가윤 달리오
│   ├── PortfolioReportPage.jsx # 포트폴리오 리포트
│   ├── PortfolioBattlePage.jsx # 수익률 대결
│   └── TaxGuidePage.jsx     # 절세 가이드 (iframe)
├── components/
│   ├── Layout/Layout.jsx    # 사이드바 네비게이션
│   ├── News/NewsCard.jsx, NewsForm.jsx
│   ├── Reports/ReportCard.jsx
│   └── Chain/NetworkGraph.jsx (미사용)
└── public/
    └── tax-guide.html       # 절세 브로셔 원본 HTML
```

## 외부 데이터 소스
- `public/tax-guide.html` - 절세 마스터플랜 브로셔 (연봉 8,000만원 기준)
