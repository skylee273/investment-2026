import { useState, useEffect } from 'react'

// 배당 데이터 (정적)
const DIVIDEND_DATA = {
  VOO: { name: 'Vanguard S&P500', frequency: 'quarterly', months: [3, 6, 9, 12], yield: 1.3, lastAmount: 1.77, shares: 0 },
  SCHD: { name: 'Schwab 배당주', frequency: 'quarterly', months: [3, 6, 9, 12], yield: 3.5, lastAmount: 0.75, shares: 0 },
  AMZN: { name: '아마존', frequency: 'none', yield: 0, shares: 1.218978 },
  GOOG: { name: '알파벳 C', frequency: 'none', yield: 0, shares: 0.141936 },
  MSFT: { name: '마이크로소프트', frequency: 'quarterly', months: [3, 6, 9, 12], yield: 0.8, lastAmount: 0.75, shares: 0.076658 },
  CVX: { name: '셰브론', frequency: 'quarterly', months: [3, 6, 9, 12], yield: 4.2, lastAmount: 1.63, shares: 0.104341 },
  META: { name: '메타', frequency: 'quarterly', months: [3, 6, 9, 12], yield: 0.3, lastAmount: 0.50, shares: 0.024868 },
  AXP: { name: '아메리칸 익스프레스', frequency: 'quarterly', months: [1, 4, 7, 10], yield: 1.0, lastAmount: 0.70, shares: 0.049313 },
  BAC: { name: '뱅크오브아메리카', frequency: 'quarterly', months: [3, 6, 9, 12], yield: 2.4, lastAmount: 0.26, shares: 0.269012 },
  SPY: { name: 'S&P500 ETF', frequency: 'quarterly', months: [3, 6, 9, 12], yield: 1.2, lastAmount: 1.82, shares: 0.017702 },
  'KODEX 200': { name: 'KODEX 200', frequency: 'annually', months: [4], yield: 1.8, lastAmount: 1700, shares: 7 },
  'KODEX 코스닥150': { name: 'KODEX 코스닥150', frequency: 'annually', months: [4], yield: 0.5, lastAmount: 100, shares: 10 },
  'TIGER 미국채10년선물': { name: 'TIGER 미국채10년선물', frequency: 'none', yield: 0, shares: 15 },
  'TIGER 미국S&P500': { name: 'TIGER 미국S&P500', frequency: 'quarterly', months: [1, 4, 7, 10], yield: 1.1, lastAmount: 25, shares: 15 },
}

// 가윤 달리오 보유 종목 (배당 계산용)
const GAYOON_HOLDINGS = {
  VOO: { shares: 4.1, currentKRW: 19577473 + 656352 },
  SCHD: { shares: 51.2, currentKRW: 4562673 },
  AMZN: { shares: 9, currentKRW: 2638715 },
}

// 환율
const USD_KRW = 1450

// 월 이름
const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

// 월별 배당 계산
const calculateMonthlyDividends = () => {
  const monthlyData = Array(12).fill(null).map(() => [])

  Object.entries(DIVIDEND_DATA).forEach(([ticker, data]) => {
    if (data.frequency === 'none' || !data.months) return

    const shares = data.shares || GAYOON_HOLDINGS[ticker]?.shares || 0
    if (shares === 0) return

    const isKRW = ticker.startsWith('KODEX') || ticker.startsWith('TIGER')
    const dividendAmount = data.lastAmount * shares
    const dividendKRW = isKRW ? dividendAmount : dividendAmount * USD_KRW

    data.months.forEach(month => {
      monthlyData[month - 1].push({
        ticker,
        name: data.name,
        shares,
        dividendAmount: Math.round(dividendKRW),
        isKRW,
        yield: data.yield,
      })
    })
  })

  return monthlyData
}

export default function DividendsPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const monthlyDividends = calculateMonthlyDividends()

  // 이번 달 배당
  const currentMonth = new Date().getMonth()
  const thisMonthTotal = monthlyDividends[currentMonth].reduce((sum, d) => sum + d.dividendAmount, 0)

  // 이번 분기 배당
  const currentQuarter = Math.floor(currentMonth / 3)
  const quarterMonths = [currentQuarter * 3, currentQuarter * 3 + 1, currentQuarter * 3 + 2]
  const thisQuarterTotal = quarterMonths.reduce((sum, m) =>
    sum + monthlyDividends[m].reduce((s, d) => s + d.dividendAmount, 0), 0
  )

  // 연간 예상 배당
  const yearTotal = monthlyDividends.reduce((sum, month) =>
    sum + month.reduce((s, d) => s + d.dividendAmount, 0), 0
  )

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
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: '16px',
      marginBottom: '24px',
    },
    summaryCard: (highlight) => ({
      backgroundColor: highlight ? '#3182F6' : 'white',
      borderRadius: '16px',
      padding: '20px',
      border: highlight ? 'none' : '1px solid #E5E8EB',
    }),
    summaryLabel: (highlight) => ({
      fontSize: '13px',
      color: highlight ? 'rgba(255,255,255,0.8)' : '#8B95A1',
      marginBottom: '8px',
    }),
    summaryValue: (highlight) => ({
      fontSize: '24px',
      fontWeight: '700',
      color: highlight ? 'white' : '#191F28',
    }),
    summarySubtext: (highlight) => ({
      fontSize: '12px',
      color: highlight ? 'rgba(255,255,255,0.7)' : '#8B95A1',
      marginTop: '4px',
    }),
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '20px',
      border: '1px solid #E5E8EB',
      marginBottom: '20px',
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#191F28',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
      gap: '12px',
    },
    monthCell: (isSelected, hasDividends) => ({
      padding: '16px',
      borderRadius: '12px',
      border: isSelected ? '2px solid #3182F6' : '1px solid #E5E8EB',
      backgroundColor: isSelected ? '#E8F3FF' : hasDividends ? '#F7F8FA' : 'white',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }),
    monthName: (isSelected) => ({
      fontSize: '14px',
      fontWeight: '600',
      color: isSelected ? '#3182F6' : '#191F28',
      marginBottom: '8px',
    }),
    monthAmount: (hasDividends) => ({
      fontSize: '13px',
      fontWeight: '700',
      color: hasDividends ? '#2E7D32' : '#8B95A1',
    }),
    monthCount: {
      fontSize: '11px',
      color: '#8B95A1',
      marginTop: '4px',
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      textAlign: 'left',
      padding: '12px 8px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#8B95A1',
      borderBottom: '1px solid #E5E8EB',
      whiteSpace: 'nowrap',
    },
    td: {
      padding: '14px 8px',
      fontSize: '13px',
      color: '#191F28',
      borderBottom: '1px solid #F2F4F6',
    },
    badge: (frequency) => ({
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '600',
      backgroundColor: frequency === 'quarterly' ? '#E3F2FD' : frequency === 'annually' ? '#FFF3E0' : '#F2F4F6',
      color: frequency === 'quarterly' ? '#1565C0' : frequency === 'annually' ? '#E65100' : '#6B7684',
    }),
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#8B95A1',
    },
    dividendItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      backgroundColor: '#F7F8FA',
      borderRadius: '12px',
      marginBottom: '8px',
    },
    stockInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    stockIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      backgroundColor: '#E8F5E9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
    },
  }

  // 종목별 배당 정보 테이블 데이터
  const dividendStocks = Object.entries(DIVIDEND_DATA)
    .filter(([_, data]) => data.frequency !== 'none')
    .map(([ticker, data]) => {
      const shares = data.shares || GAYOON_HOLDINGS[ticker]?.shares || 0
      const isKRW = ticker.startsWith('KODEX') || ticker.startsWith('TIGER')
      const dividendAmount = data.lastAmount * shares
      const dividendKRW = isKRW ? dividendAmount : dividendAmount * USD_KRW
      const nextMonth = data.months?.find(m => m > currentMonth + 1) || data.months?.[0]

      return {
        ticker,
        name: data.name,
        frequency: data.frequency,
        yield: data.yield,
        nextMonth,
        shares,
        dividendKRW: Math.round(dividendKRW),
      }
    })
    .filter(s => s.shares > 0)
    .sort((a, b) => b.dividendKRW - a.dividendKRW)

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📅 배당 캘린더</h1>
        <p style={styles.subtitle}>보유 종목의 배당 일정 및 예상 배당금을 확인하세요</p>
      </div>

      {/* 예상 배당금 요약 */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard(false)}>
          <div style={styles.summaryLabel(false)}>이번 달 ({MONTH_NAMES[currentMonth]})</div>
          <div style={styles.summaryValue(false)}>
            {thisMonthTotal > 0 ? `₩${thisMonthTotal.toLocaleString()}` : '-'}
          </div>
          <div style={styles.summarySubtext(false)}>
            {monthlyDividends[currentMonth].length}개 종목 배당
          </div>
        </div>
        <div style={styles.summaryCard(false)}>
          <div style={styles.summaryLabel(false)}>이번 분기</div>
          <div style={styles.summaryValue(false)}>₩{thisQuarterTotal.toLocaleString()}</div>
          <div style={styles.summarySubtext(false)}>
            Q{currentQuarter + 1} ({MONTH_NAMES[quarterMonths[0]]}~{MONTH_NAMES[quarterMonths[2]]})
          </div>
        </div>
        <div style={styles.summaryCard(true)}>
          <div style={styles.summaryLabel(true)}>연간 예상 배당</div>
          <div style={styles.summaryValue(true)}>₩{yearTotal.toLocaleString()}</div>
          <div style={styles.summarySubtext(true)}>
            월 평균 ₩{Math.round(yearTotal / 12).toLocaleString()}
          </div>
        </div>
      </div>

      {/* 월별 캘린더 */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <span>📆</span>
          <span>월별 배당 일정</span>
        </div>
        <div style={styles.calendarGrid}>
          {monthlyDividends.map((dividends, idx) => {
            const monthTotal = dividends.reduce((sum, d) => sum + d.dividendAmount, 0)
            const hasDividends = dividends.length > 0
            const isSelected = selectedMonth === idx
            const isPast = idx < currentMonth

            return (
              <div
                key={idx}
                style={{
                  ...styles.monthCell(isSelected, hasDividends),
                  opacity: isPast ? 0.5 : 1,
                }}
                onClick={() => setSelectedMonth(idx)}
              >
                <div style={styles.monthName(isSelected)}>{MONTH_NAMES[idx]}</div>
                <div style={styles.monthAmount(hasDividends)}>
                  {hasDividends ? `₩${monthTotal.toLocaleString()}` : '-'}
                </div>
                {hasDividends && (
                  <div style={styles.monthCount}>{dividends.length}개 종목</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 선택된 월의 배당 상세 */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <span>💰</span>
          <span>{MONTH_NAMES[selectedMonth]} 배당 내역</span>
        </div>
        {monthlyDividends[selectedMonth].length === 0 ? (
          <div style={styles.emptyState}>
            <p>📭 이 달에는 배당이 없습니다</p>
          </div>
        ) : (
          <div>
            {monthlyDividends[selectedMonth].map((dividend, idx) => (
              <div key={idx} style={styles.dividendItem}>
                <div style={styles.stockInfo}>
                  <div style={styles.stockIcon}>💵</div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#191F28' }}>{dividend.name}</div>
                    <div style={{ fontSize: '12px', color: '#8B95A1' }}>
                      {dividend.ticker} · {dividend.shares.toFixed(2)}주
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '700', color: '#2E7D32' }}>
                    +₩{dividend.dividendAmount.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#8B95A1' }}>
                    배당률 {dividend.yield}%
                  </div>
                </div>
              </div>
            ))}
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              backgroundColor: '#E8F5E9',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{ fontWeight: '600', color: '#2E7D32' }}>총 예상 배당금</span>
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#2E7D32' }}>
                +₩{monthlyDividends[selectedMonth].reduce((sum, d) => sum + d.dividendAmount, 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 종목별 배당 정보 */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>
          <span>📊</span>
          <span>종목별 배당 정보</span>
        </div>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>종목</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>배당 주기</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>배당률</th>
                <th style={{ ...styles.th, textAlign: 'center' }}>다음 배당</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>예상 금액 (분기)</th>
              </tr>
            </thead>
            <tbody>
              {dividendStocks.map((stock, idx) => (
                <tr key={idx}>
                  <td style={styles.td}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{stock.name}</div>
                      <div style={{ fontSize: '11px', color: '#8B95A1' }}>
                        {stock.ticker} · {stock.shares.toFixed(2)}주
                      </div>
                    </div>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    <span style={styles.badge(stock.frequency)}>
                      {stock.frequency === 'quarterly' ? '분기' : stock.frequency === 'annually' ? '연간' : '-'}
                    </span>
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    {stock.yield}%
                  </td>
                  <td style={{ ...styles.td, textAlign: 'center' }}>
                    {stock.nextMonth ? MONTH_NAMES[stock.nextMonth - 1] : '-'}
                  </td>
                  <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600', color: '#2E7D32' }}>
                    +₩{stock.dividendKRW.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
