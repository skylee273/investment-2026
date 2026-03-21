import { useState, useEffect } from 'react'

// 투자 노트 데이터
const NOTES = [
  {
    id: 1,
    date: '2026-03-21',
    category: 'AI 인프라',
    title: '젠슨황의 AI 산업 5단 케이크론',
    source: '연합뉴스 TV (2026.01.22)',
    summary: 'NVIDIA CEO 젠슨황이 설명한 AI 산업 생태계 구조. 가장 초기를 담당하는 에너지/전력(1단계) 및 Chip(2단계)의 병목현상이 가장 크다.',
    content: [
      {
        type: 'pyramid',
        title: 'AI 산업 생태계 5단계',
        items: [
          { level: 5, name: '애플리케이션', desc: '최종 사용자 서비스', color: '#3182F6' },
          { level: 4, name: '플랫폼·클라우드', desc: 'AI모델 운용 소프트웨어', color: '#6366F1' },
          { level: 3, name: '네트워크·데이터센터', desc: '물리적 서버랙 및 광통신', color: '#8B5CF6' },
          { level: 2, name: '반도체·컴퓨팅', desc: 'GPU, HBM 등 연산지원', color: '#EC4899', highlight: true },
          { level: 1, name: '에너지·전력', desc: '데이터센터 가동을 위한 필수 인프라', color: '#F59E0B', highlight: true },
        ]
      }
    ],
    keyInsight: '에너지/전력(1단계)과 반도체(2단계)가 AI 산업의 핵심 병목 구간',
    relatedStocks: ['NVDA', 'VST', 'CEG', 'VRT'],
  },
  {
    id: 2,
    date: '2026-03-21',
    category: '전력 인프라',
    title: '전력 인프라 밸류체인 대표 기업',
    source: '삼성자산운용',
    summary: 'AI 데이터센터 전력 수요 급증에 따른 전력 인프라 밸류체인 핵심 기업 정리',
    content: [
      {
        type: 'valuechain',
        title: '전력 인프라 밸류체인',
        chains: [
          {
            stage: '전력 발전',
            color: '#3182F6',
            companies: [
              { name: 'Constellation', ticker: 'CEG', category: '원자력' },
              { name: 'Vistra', ticker: 'VST', category: '원자력' },
              { name: 'GE Vernova', ticker: 'GEV', category: '가스터빈' },
              { name: 'Bloom Energy', ticker: 'BE', category: '연료전지' },
            ]
          },
          {
            stage: '차세대 발전 기술',
            color: '#8B5CF6',
            companies: [
              { name: 'NuScale Power', ticker: 'SMR', category: 'SMR' },
              { name: 'OKLO', ticker: 'OKLO', category: 'SMR' },
            ]
          },
          {
            stage: '송전/배전',
            color: '#10B981',
            companies: [
              { name: 'Quanta Services', ticker: 'PWR', category: '송전/배전' },
            ]
          },
          {
            stage: '건설',
            color: '#F59E0B',
            companies: [
              { name: 'Sterling', ticker: 'STRL', category: '데이터센터 건설' },
            ]
          },
          {
            stage: '데이터센터/전력 효율화',
            color: '#EF4444',
            companies: [
              { name: 'Vertiv', ticker: 'VRT', category: '센터 냉각' },
              { name: 'Celestica', ticker: 'CLS', category: '데이터센터 솔루션' },
            ]
          },
        ]
      },
      {
        type: 'list',
        title: '국내 전력 인프라 기업',
        items: [
          { category: '송전', companies: 'GE버노바, 히타치 에너지, HD현대일렉트릭, 효성중공업(초고압 변압기), LS전선(HVDC 케이블)' },
          { category: '변전', companies: '지멘스 에너지, 이튼, 효성중공업, LS일렉트릭(가스절연개폐장치), HD현대일렉트릭(부하전압조정기)' },
          { category: '배전', companies: 'LS일렉트릭, 제룡전기(배전용 변압기), LS일렉트릭(배전반)' },
        ]
      }
    ],
    keyInsight: 'AI 데이터센터 → 전력 수요 폭증 → 전력 인프라 전체 밸류체인 수혜',
    relatedStocks: ['CEG', 'VST', 'GEV', 'VRT', 'PWR', 'STRL'],
  },
]

export default function InvestmentNotesPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const categories = ['all', ...new Set(NOTES.map(n => n.category))]
  const filteredNotes = filterCategory === 'all'
    ? NOTES
    : NOTES.filter(n => n.category === filterCategory)

  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
    },
    header: {
      marginBottom: '24px',
    },
    title: {
      fontSize: isMobile ? '24px' : '28px',
      fontWeight: '700',
      color: '#191F28',
      margin: 0,
      marginBottom: '8px',
    },
    subtitle: {
      fontSize: '14px',
      color: '#8B95A1',
      margin: 0,
    },
    filterContainer: {
      display: 'flex',
      gap: '8px',
      marginBottom: '20px',
      flexWrap: 'wrap',
    },
    filterBtn: (isActive) => ({
      padding: '8px 16px',
      borderRadius: '20px',
      border: 'none',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      backgroundColor: isActive ? '#3182F6' : '#F2F4F6',
      color: isActive ? 'white' : '#4E5968',
      transition: 'all 0.2s',
    }),
    noteCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #E5E8EB',
      marginBottom: '16px',
      overflow: 'hidden',
    },
    noteHeader: {
      padding: '20px',
      borderBottom: '1px solid #F2F4F6',
      cursor: 'pointer',
    },
    noteTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#191F28',
      marginBottom: '8px',
    },
    noteMeta: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    badge: (color) => ({
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '600',
      backgroundColor: color || '#E8F3FF',
      color: color ? 'white' : '#3182F6',
    }),
    noteContent: {
      padding: '20px',
    },
    summary: {
      fontSize: '14px',
      color: '#4E5968',
      lineHeight: '1.6',
      marginBottom: '20px',
      padding: '16px',
      backgroundColor: '#F7F8FA',
      borderRadius: '12px',
    },
    sectionTitle: {
      fontSize: '14px',
      fontWeight: '700',
      color: '#191F28',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    pyramidContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '20px',
    },
    pyramidLevel: (width, color, highlight) => ({
      width: `${width}%`,
      padding: '12px 16px',
      backgroundColor: color,
      borderRadius: '8px',
      color: 'white',
      textAlign: 'center',
      border: highlight ? '3px solid #191F28' : 'none',
      boxShadow: highlight ? '0 4px 12px rgba(0,0,0,0.2)' : 'none',
    }),
    chainContainer: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: '12px',
      marginBottom: '20px',
      overflowX: 'auto',
    },
    chainStage: (color) => ({
      flex: isMobile ? 'none' : 1,
      minWidth: isMobile ? '100%' : '150px',
      padding: '16px',
      backgroundColor: '#F7F8FA',
      borderRadius: '12px',
      borderTop: `4px solid ${color}`,
    }),
    chainTitle: (color) => ({
      fontSize: '12px',
      fontWeight: '700',
      color: color,
      marginBottom: '12px',
    }),
    companyItem: {
      padding: '8px 10px',
      backgroundColor: 'white',
      borderRadius: '8px',
      marginBottom: '6px',
      border: '1px solid #E5E8EB',
    },
    companyName: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#191F28',
    },
    companyTicker: {
      fontSize: '11px',
      color: '#3182F6',
      fontWeight: '600',
    },
    keyInsight: {
      padding: '16px',
      backgroundColor: '#FFF9E6',
      borderRadius: '12px',
      borderLeft: '4px solid #F59E0B',
      marginBottom: '16px',
    },
    relatedStocks: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    stockTag: {
      padding: '6px 12px',
      backgroundColor: '#E8F3FF',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#3182F6',
    },
    listItem: {
      padding: '12px 16px',
      backgroundColor: '#F7F8FA',
      borderRadius: '8px',
      marginBottom: '8px',
    },
    listCategory: {
      fontSize: '12px',
      fontWeight: '700',
      color: '#3182F6',
      marginBottom: '4px',
    },
    listCompanies: {
      fontSize: '13px',
      color: '#4E5968',
      lineHeight: '1.5',
    },
  }

  const renderContent = (content) => {
    return content.map((section, idx) => {
      if (section.type === 'pyramid') {
        return (
          <div key={idx}>
            <div style={styles.sectionTitle}>
              <span>🎂</span>
              <span>{section.title}</span>
            </div>
            <div style={styles.pyramidContainer}>
              {section.items.map((item, i) => (
                <div
                  key={i}
                  style={styles.pyramidLevel(
                    40 + (5 - item.level) * 15,
                    item.color,
                    item.highlight
                  )}
                >
                  <div style={{ fontWeight: '700', marginBottom: '4px' }}>
                    {item.level}단계: {item.name}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )
      }

      if (section.type === 'valuechain') {
        return (
          <div key={idx}>
            <div style={styles.sectionTitle}>
              <span>🔗</span>
              <span>{section.title}</span>
            </div>
            <div style={styles.chainContainer}>
              {section.chains.map((chain, i) => (
                <div key={i} style={styles.chainStage(chain.color)}>
                  <div style={styles.chainTitle(chain.color)}>{chain.stage}</div>
                  {chain.companies.map((company, j) => (
                    <div key={j} style={styles.companyItem}>
                      <div style={styles.companyName}>{company.name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={styles.companyTicker}>{company.ticker}</span>
                        <span style={{ fontSize: '10px', color: '#8B95A1' }}>{company.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )
      }

      if (section.type === 'list') {
        return (
          <div key={idx}>
            <div style={styles.sectionTitle}>
              <span>📋</span>
              <span>{section.title}</span>
            </div>
            {section.items.map((item, i) => (
              <div key={i} style={styles.listItem}>
                <div style={styles.listCategory}>{item.category}</div>
                <div style={styles.listCompanies}>{item.companies}</div>
              </div>
            ))}
          </div>
        )
      }

      return null
    })
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📝 투자 노트</h1>
        <p style={styles.subtitle}>유튜브, 뉴스 등에서 배운 투자 인사이트 정리</p>
      </div>

      {/* 카테고리 필터 */}
      <div style={styles.filterContainer}>
        {categories.map(cat => (
          <button
            key={cat}
            style={styles.filterBtn(filterCategory === cat)}
            onClick={() => setFilterCategory(cat)}
          >
            {cat === 'all' ? '전체' : cat}
          </button>
        ))}
      </div>

      {/* 노트 목록 */}
      {filteredNotes.map(note => (
        <div key={note.id} style={styles.noteCard}>
          <div
            style={styles.noteHeader}
            onClick={() => setSelectedNote(selectedNote === note.id ? null : note.id)}
          >
            <div style={styles.noteTitle}>{note.title}</div>
            <div style={styles.noteMeta}>
              <span style={styles.badge()}>{note.category}</span>
              <span style={{ fontSize: '12px', color: '#8B95A1' }}>{note.date}</span>
              <span style={{ fontSize: '12px', color: '#8B95A1' }}>📰 {note.source}</span>
            </div>
          </div>

          {selectedNote === note.id && (
            <div style={styles.noteContent}>
              {/* 요약 */}
              <div style={styles.summary}>
                💡 {note.summary}
              </div>

              {/* 컨텐츠 렌더링 */}
              {renderContent(note.content)}

              {/* 핵심 인사이트 */}
              <div style={styles.keyInsight}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#F59E0B', marginBottom: '8px' }}>
                  🎯 핵심 인사이트
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#191F28' }}>
                  {note.keyInsight}
                </div>
              </div>

              {/* 관련 종목 */}
              <div>
                <div style={styles.sectionTitle}>
                  <span>📈</span>
                  <span>관련 종목</span>
                </div>
                <div style={styles.relatedStocks}>
                  {note.relatedStocks.map((stock, i) => (
                    <span key={i} style={styles.stockTag}>{stock}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* 빈 상태 */}
      {filteredNotes.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#8B95A1',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
          <div style={{ fontSize: '16px', fontWeight: '600' }}>해당 카테고리의 노트가 없습니다</div>
        </div>
      )}

      {/* 안내 */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#F7F8FA',
        borderRadius: '12px',
        fontSize: '13px',
        color: '#6B7684',
        textAlign: 'center',
      }}>
        💬 이미지를 공유하시면 투자 인사이트를 정리해 드립니다
      </div>
    </div>
  )
}
