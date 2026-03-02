# 투자 리서치 플랫폼

## 프로젝트 개요
나만의 투자 정보 분석 및 시각화 플랫폼. 뉴스, 기업 리포트, 종목 간 연관성을 통합 관리.

---

## 핵심 기능

### 1. 메인 페이지 (뉴스 대시보드)
- **자동 뉴스 수집**: 네이버 증권, 한경 등 RSS 피드 연동
- **직접 뉴스 추가**: 중요한 소식 직접 입력
- **오늘의 하이라이트**: 핵심 뉴스 상단 노출
- **카테고리**: 증권, 부동산, 경제, 글로벌

### 2. 기업 리포트
- **리포트 목록**: 분석한 기업 카드 형태로 표시
- **리포트 상세**: 자유 형식 (마크다운, 이미지, 링크)
- **리포트 작성**: WYSIWYG 에디터
- **태그/카테고리**: 섹터, 투자 등급 등

### 3. 증권의 사슬 (Network Graph)
- **노드**: 기업/종목
- **엣지 (연결선)**:
  - 🏭 산업/섹터 (같은 업종)
  - 🔗 공급망/거래관계 (납품, 고객)
  - ✏️ 직접 연결 (내가 판단한 연관성)
- **인터랙티브**: 드래그, 줌, 클릭 시 상세 정보

---

## 페이지 구조

```
/                   → 메인 (뉴스 대시보드)
/reports            → 기업 리포트 목록
/reports/:id        → 리포트 상세
/reports/new        → 리포트 작성
/chain              → 증권의 사슬 (네트워크 그래프)
/companies          → 기업 관리 (노드 추가/편집)
```

---

## 데이터 구조

### News (뉴스)
```javascript
{
  id: string,
  title: string,
  summary: string,
  url: string,
  source: string,        // '네이버증권', '한경', '직접입력'
  category: string,      // 'stock', 'realestate', 'economy', 'global'
  isHighlight: boolean,  // 하이라이트 여부
  createdAt: Date,
}
```

### Company (기업)
```javascript
{
  id: string,
  name: string,
  ticker: string,
  sector: string,
  description: string,
  tags: string[],
  color: string,         // 노드 색상
}
```

### Report (리포트)
```javascript
{
  id: string,
  companyId: string,
  title: string,
  content: string,       // 마크다운
  rating: string,        // 'strong_buy', 'buy', 'hold', 'sell'
  targetPrice: number,
  tags: string[],
  createdAt: Date,
  updatedAt: Date,
}
```

### Connection (연결)
```javascript
{
  id: string,
  sourceId: string,      // 기업 ID
  targetId: string,      // 기업 ID
  type: string,          // 'sector', 'supply_chain', 'custom'
  label: string,         // 연결 설명
  strength: number,      // 1-5 연관 강도
}
```

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | React + Vite |
| 스타일링 | Tailwind CSS (토스 스타일) |
| 네트워크 그래프 | react-force-graph-2d |
| 마크다운 에디터 | @uiw/react-md-editor |
| RSS 파싱 | rss-parser (via proxy) |
| 저장 | LocalStorage |

---

## 개발 순서

### Phase 1: 기본 구조
1. 라우팅 설정 (react-router-dom)
2. 레이아웃 컴포넌트
3. 데이터 스토어 (Context + LocalStorage)

### Phase 2: 메인 페이지
4. 뉴스 카드 컴포넌트
5. RSS 피드 연동
6. 뉴스 직접 추가 기능

### Phase 3: 기업 리포트
7. 리포트 목록 페이지
8. 리포트 상세 페이지
9. 리포트 작성/편집 페이지

### Phase 4: 증권의 사슬
10. 기업 관리 페이지
11. 연결 관리 기능
12. 네트워크 그래프 시각화

---

## UI 컨셉

- **토스 스타일** 유지
- **다크 모드** 지원 (그래프 시각화에 적합)
- **모바일 반응형**
