const styles = {
  container: {
    marginLeft: '-40px',
    marginRight: '-40px',
    marginTop: '-32px',
    height: 'calc(100vh - 0px)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 40px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #E5E8EB',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  titleIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #3A5FFF, #2A4ACC)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  titleText: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '700',
    color: '#191F28',
  },
  badge: {
    padding: '6px 12px',
    backgroundColor: '#E8EEFF',
    color: '#3A5FFF',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '600',
  },
  iframe: {
    width: '100%',
    height: 'calc(100vh - 73px)',
    border: 'none',
  },
}

export default function RiaGuidePage() {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>
          <div style={styles.titleIcon}>🔄</div>
          <h1 style={styles.titleText}>RIA 가이드</h1>
        </div>
        <span style={styles.badge}>국내시장 복귀계좌</span>
      </div>
      <iframe
        src="/ria-guide.html"
        style={styles.iframe}
        title="RIA 가이드"
      />
    </div>
  )
}
