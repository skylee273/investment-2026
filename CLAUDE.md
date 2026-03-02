# 빠른 시작
```bash
npm run dev -- --port 1234 & sleep 2 && open http://localhost:1234
```
**포트: 1234 (고정)**

---

# 배포 정보

## 웹사이트
**https://investment-2026.vercel.app**

## GitHub
**https://github.com/skylee273/investment-2026**

## 배포 명령어
```bash
git add -A && git commit -m "업데이트" && git push
npx vercel --prod
```

---

# 프로젝트 메모리

## 프로젝트 개요
- **이름**: 투자 리서치 플랫폼
- **목적**: 개인 포트폴리오 기반 투자 리서치 도구

## 핵심 기능
1. **하우가 패밀리** (`/`) - 포트폴리오 관리
2. **기관투자자** (`/whales`) - 기관 동향 (13F 공시 기반)
3. **투자 학습** (`/learn`) - 학습 자료
4. **가윤 달리오** (`/gayoon`) - 자산현황 + 실시간 수익률
5. **수익률 대결** (`/battle`) - 하늘 vs 가윤 (2026.12.24까지)
6. **절세 가이드** (`/tax`) - 절세 마스터플랜 (HTML 브로셔)

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
├── pages/
│   ├── PortfolioPage.jsx    # 하우가 패밀리 (메인)
│   ├── WhalesPage.jsx       # 기관투자자
│   ├── LearnPage.jsx        # 투자 학습
│   ├── GayoonWealthPage.jsx # 가윤 달리오 (실시간 시세)
│   ├── PortfolioReportPage.jsx # 포트폴리오 리포트
│   ├── PortfolioBattlePage.jsx # 수익률 대결
│   └── TaxGuidePage.jsx     # 절세 가이드 (iframe)
├── components/
│   └── Layout/Layout.jsx    # 사이드바 네비게이션
└── public/
    └── tax-guide.html       # 절세 브로셔 원본 HTML
```

## 외부 데이터 소스
- `public/tax-guide.html` - 절세 마스터플랜 브로셔 (연봉 8,000만원 기준)
