import { useState, useEffect } from 'react'

export default function RebalancePage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div style={{
      width: '100%',
      height: '100%',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
    }}>
      <iframe
        src="/rebalance-guide.html"
        style={{
          width: '100%',
          height: isMobile ? 'calc(100vh - 60px)' : '100vh',
          border: 'none',
          display: 'block',
        }}
        title="리밸런싱 대시보드"
      />
    </div>
  )
}
