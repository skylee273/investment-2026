import { useState, useEffect } from 'react'

// 점수 계산 함수들
const calculateROEScore = (roe) => {
  if (roe >= 20) return 30
  if (roe >= 15) return 25
  if (roe >= 10) return 18
  if (roe >= 5) return 10
  return 0
}

const calculatePERScore = (per) => {
  if (per <= 10) return 20
  if (per <= 15) return 15
  if (per <= 20) return 10
  if (per <= 25) return 5
  return 0
}

const calculatePBRScore = (pbr) => {
  if (pbr <= 1) return 15
  if (pbr <= 1.5) return 12
  if (pbr <= 2) return 8
  if (pbr <= 3) return 4
  return 0
}

const calculateDividendScore = (years) => {
  if (years >= 25) return 20
  if (years >= 10) return 15
  if (years >= 5) return 10
  if (years >= 1) return 5
  return 0
}

const calculateEPSScore = (epsGrowth) => {
  if (epsGrowth >= 15) return 15
  if (epsGrowth >= 10) return 12
  if (epsGrowth >= 5) return 8
  if (epsGrowth >= 0) return 4
  return 0
}

export default function StockScorePage() {
  const [isMobile, setIsMobile] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [roe, setROE] = useState('')
  const [per, setPER] = useState('')
  const [pbr, setPBR] = useState('')
  const [dividendYears, setDividendYears] = useState('')
  const [epsGrowth, setEPSGrowth] = useState('')
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [showCriteria, setShowCriteria] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // localStorage에서 기록 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('buffett-score-history')
    if (saved) {
      setHistory(JSON.parse(saved))
    }
  }, [])

  const saveToHistory = (newResult) => {
    const newHistory = [newResult, ...history].slice(0, 10) // 최근 10개만 유지
    setHistory(newHistory)
    localStorage.setItem('buffett-score-history', JSON.stringify(newHistory))
  }

  const handleCalculate = () => {
    if (!companyName.trim()) {
      alert('기업명을 입력해주세요.')
      return
    }

    const roeVal = parseFloat(roe) || 0
    const perVal = parseFloat(per) || 0
    const pbrVal = parseFloat(pbr) || 0
    const divYears = parseInt(dividendYears) || 0
    const epsVal = parseFloat(epsGrowth) || 0

    const roeScore = calculateROEScore(roeVal)
    const perScore = calculatePERScore(perVal)
    const pbrScore = calculatePBRScore(pbrVal)
    const divScore = calculateDividendScore(divYears)
    const epsScore = calculateEPSScore(epsVal)
    const totalScore = roeScore + perScore + pbrScore + divScore + epsScore

    const newResult = {
      id: Date.now(),
      companyName: companyName.trim(),
      date: new Date().toLocaleDateString('ko-KR'),
      inputs: { roe: roeVal, per: perVal, pbr: pbrVal, dividendYears: divYears, epsGrowth: epsVal },
      scores: { roe: roeScore, per: perScore, pbr: pbrScore, dividend: divScore, eps: epsScore },
      totalScore,
      passed: totalScore >= 70,
    }

    setResult(newResult)
    saveToHistory(newResult)
  }

  const handleReset = () => {
    setCompanyName('')
    setROE('')
    setPER('')
    setPBR('')
    setDividendYears('')
    setEPSGrowth('')
    setResult(null)
  }

  const handleClearHistory = () => {
    if (confirm('계산 기록을 모두 삭제하시겠습니까?')) {
      setHistory([])
      localStorage.removeItem('buffett-score-history')
    }
  }

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
    },
    header: {
      marginBottom: '32px',
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
      color: '#6B7684',
      margin: 0,
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: isMobile ? '20px' : '28px',
      marginBottom: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#191F28',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    inputGroup: {
      marginBottom: '16px',
    },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '500',
      color: '#4E5968',
      marginBottom: '6px',
    },
    input: {
      width: '100%',
      padding: '12px 14px',
      border: '1px solid #E5E8EB',
      borderRadius: '10px',
      fontSize: '15px',
      color: '#191F28',
      backgroundColor: '#FAFBFC',
      outline: 'none',
      boxSizing: 'border-box',
    },
    inputRow: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: '16px',
    },
    buttonRow: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px',
    },
    primaryBtn: {
      flex: 1,
      padding: '14px 24px',
      backgroundColor: '#3182F6',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    secondaryBtn: {
      padding: '14px 24px',
      backgroundColor: '#F2F4F6',
      color: '#4E5968',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    resultCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      padding: isMobile ? '20px' : '28px',
      marginBottom: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    },
    resultHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    companyName: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#191F28',
    },
    badge: (passed) => ({
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600',
      backgroundColor: passed ? '#E8F5E9' : '#FFEBEE',
      color: passed ? '#2E7D32' : '#C62828',
    }),
    totalScore: (passed) => ({
      fontSize: '48px',
      fontWeight: '700',
      color: passed ? '#2E7D32' : '#C62828',
      textAlign: 'center',
      margin: '20px 0',
    }),
    scoreLabel: {
      fontSize: '14px',
      color: '#6B7684',
      textAlign: 'center',
      marginBottom: '24px',
    },
    scoreGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(5, 1fr)',
      gap: '12px',
    },
    scoreItem: {
      padding: '16px',
      backgroundColor: '#F7F8FA',
      borderRadius: '12px',
      textAlign: 'center',
    },
    scoreItemLabel: {
      fontSize: '12px',
      color: '#6B7684',
      marginBottom: '4px',
    },
    scoreItemValue: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#191F28',
    },
    scoreItemMax: {
      fontSize: '12px',
      color: '#8B95A1',
    },
    criteriaToggle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 0',
      borderTop: '1px solid #F2F4F6',
      cursor: 'pointer',
    },
    criteriaTable: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '16px',
      fontSize: '13px',
    },
    th: {
      padding: '10px 8px',
      backgroundColor: '#F7F8FA',
      textAlign: 'left',
      fontWeight: '600',
      color: '#4E5968',
      borderBottom: '1px solid #E5E8EB',
    },
    td: {
      padding: '10px 8px',
      borderBottom: '1px solid #F2F4F6',
      color: '#191F28',
    },
    historyItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 0',
      borderBottom: '1px solid #F2F4F6',
    },
    historyLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    historyName: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#191F28',
    },
    historyDate: {
      fontSize: '12px',
      color: '#8B95A1',
    },
    historyScore: (passed) => ({
      fontSize: '16px',
      fontWeight: '700',
      color: passed ? '#2E7D32' : '#C62828',
    }),
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#8B95A1',
    },
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>버핏 점수 계산기</h1>
        <p style={styles.subtitle}>워렌 버핏 스타일 가치투자 점수 (100점 만점, 70점 이상 합격)</p>
      </header>

      {/* 입력 폼 */}
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3182F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          재무지표 입력
        </h2>

        <div style={styles.inputGroup}>
          <label style={styles.label}>기업명 *</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="예: 삼성전자, Apple"
            style={styles.input}
          />
        </div>

        <div style={styles.inputRow}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>ROE (%) - 자기자본이익률</label>
            <input
              type="number"
              value={roe}
              onChange={(e) => setROE(e.target.value)}
              placeholder="예: 15"
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>PER - 주가수익비율</label>
            <input
              type="number"
              value={per}
              onChange={(e) => setPER(e.target.value)}
              placeholder="예: 12"
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.inputRow}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>PBR - 주가순자산비율</label>
            <input
              type="number"
              step="0.1"
              value={pbr}
              onChange={(e) => setPBR(e.target.value)}
              placeholder="예: 1.2"
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>배당 연속 년수</label>
            <input
              type="number"
              value={dividendYears}
              onChange={(e) => setDividendYears(e.target.value)}
              placeholder="예: 10"
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>EPS 성장률 (%) - 주당순이익 성장률</label>
          <input
            type="number"
            value={epsGrowth}
            onChange={(e) => setEPSGrowth(e.target.value)}
            placeholder="예: 8"
            style={styles.input}
          />
        </div>

        <div style={styles.buttonRow}>
          <button style={styles.primaryBtn} onClick={handleCalculate}>
            점수 계산하기
          </button>
          <button style={styles.secondaryBtn} onClick={handleReset}>
            초기화
          </button>
        </div>
      </div>

      {/* 결과 표시 */}
      {result && (
        <div style={styles.resultCard}>
          <div style={styles.resultHeader}>
            <span style={styles.companyName}>{result.companyName}</span>
            <span style={styles.badge(result.passed)}>
              {result.passed ? '투자 적합' : '재검토 필요'}
            </span>
          </div>

          <div style={styles.totalScore(result.passed)}>
            {result.totalScore}점
          </div>
          <div style={styles.scoreLabel}>
            합격 기준: 70점 이상 / 현재: {result.passed ? '합격' : '미달'}
          </div>

          <div style={styles.scoreGrid}>
            <div style={styles.scoreItem}>
              <div style={styles.scoreItemLabel}>ROE</div>
              <div style={styles.scoreItemValue}>{result.scores.roe}</div>
              <div style={styles.scoreItemMax}>/ 30점</div>
            </div>
            <div style={styles.scoreItem}>
              <div style={styles.scoreItemLabel}>PER</div>
              <div style={styles.scoreItemValue}>{result.scores.per}</div>
              <div style={styles.scoreItemMax}>/ 20점</div>
            </div>
            <div style={styles.scoreItem}>
              <div style={styles.scoreItemLabel}>PBR</div>
              <div style={styles.scoreItemValue}>{result.scores.pbr}</div>
              <div style={styles.scoreItemMax}>/ 15점</div>
            </div>
            <div style={styles.scoreItem}>
              <div style={styles.scoreItemLabel}>배당</div>
              <div style={styles.scoreItemValue}>{result.scores.dividend}</div>
              <div style={styles.scoreItemMax}>/ 20점</div>
            </div>
            <div style={styles.scoreItem}>
              <div style={styles.scoreItemLabel}>EPS</div>
              <div style={styles.scoreItemValue}>{result.scores.eps}</div>
              <div style={styles.scoreItemMax}>/ 15점</div>
            </div>
          </div>

          <div style={{ marginTop: '16px', fontSize: '13px', color: '#6B7684' }}>
            입력값: ROE {result.inputs.roe}% / PER {result.inputs.per} / PBR {result.inputs.pbr} / 배당 {result.inputs.dividendYears}년 / EPS {result.inputs.epsGrowth}%
          </div>
        </div>
      )}

      {/* 점수 기준표 */}
      <div style={styles.card}>
        <div
          style={styles.criteriaToggle}
          onClick={() => setShowCriteria(!showCriteria)}
        >
          <span style={{ fontSize: '15px', fontWeight: '600', color: '#191F28' }}>
            점수 산정 기준표
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6B7684"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: showCriteria ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {showCriteria && (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.criteriaTable}>
              <thead>
                <tr>
                  <th style={styles.th}>지표</th>
                  <th style={styles.th}>배점</th>
                  <th style={styles.th}>기준</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.td}><strong>ROE</strong></td>
                  <td style={styles.td}>30점</td>
                  <td style={styles.td}>20%↑=30 / 15-20%=25 / 10-15%=18 / 5-10%=10 / 5%↓=0</td>
                </tr>
                <tr>
                  <td style={styles.td}><strong>PER</strong></td>
                  <td style={styles.td}>20점</td>
                  <td style={styles.td}>10↓=20 / 10-15=15 / 15-20=10 / 20-25=5 / 25↑=0</td>
                </tr>
                <tr>
                  <td style={styles.td}><strong>PBR</strong></td>
                  <td style={styles.td}>15점</td>
                  <td style={styles.td}>1↓=15 / 1-1.5=12 / 1.5-2=8 / 2-3=4 / 3↑=0</td>
                </tr>
                <tr>
                  <td style={styles.td}><strong>배당 연속성</strong></td>
                  <td style={styles.td}>20점</td>
                  <td style={styles.td}>25년↑=20 / 10-25년=15 / 5-10년=10 / 1-5년=5 / 0년=0</td>
                </tr>
                <tr>
                  <td style={styles.td}><strong>EPS 성장률</strong></td>
                  <td style={styles.td}>15점</td>
                  <td style={styles.td}>15%↑=15 / 10-15%=12 / 5-10%=8 / 0-5%=4 / 마이너스=0</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 계산 기록 */}
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ ...styles.sectionTitle, marginBottom: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3182F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            계산 기록
          </h2>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              style={{ ...styles.secondaryBtn, padding: '8px 12px', fontSize: '12px' }}
            >
              기록 삭제
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div style={styles.emptyState}>
            <p>아직 계산 기록이 없습니다.</p>
            <p>기업 정보를 입력하고 점수를 계산해보세요.</p>
          </div>
        ) : (
          <div>
            {history.map((item) => (
              <div key={item.id} style={styles.historyItem}>
                <div style={styles.historyLeft}>
                  <span style={styles.badge(item.passed)}>
                    {item.passed ? '합격' : '미달'}
                  </span>
                  <div>
                    <div style={styles.historyName}>{item.companyName}</div>
                    <div style={styles.historyDate}>{item.date}</div>
                  </div>
                </div>
                <span style={styles.historyScore(item.passed)}>
                  {item.totalScore}점
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
