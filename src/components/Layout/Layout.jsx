import { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  // 메인 (순서 1~5)
  { path: '/', label: '하늘 버핏', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  { path: '/gayoon', label: '가윤 달리오', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { path: '/battle', label: '수익률 대결', icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z' },
  { path: '/rebalance', label: '리밸런싱', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
  { path: '/fire', label: 'FIRE 대시보드', icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z' },
  { path: '/monthly', label: '월간 리포트', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  // 나머지
  { path: '/learn', label: '학습 & 노트', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { path: '/gurus', label: '구루 포트폴리오', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { path: '/value', label: '가치주 찾기', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { path: '/tax', label: '절세 가이드', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { path: '/ria', label: 'RIA 가이드', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  { path: '/house', label: '하우가 하우스', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
]

export default function Layout() {
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // 화면 크기 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 페이지 이동 시 사이드바 닫기
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#F7F8FA',
    },
    sidebar: {
      width: '240px',
      backgroundColor: '#FFFFFF',
      borderRight: '1px solid #E5E8EB',
      position: 'fixed',
      left: isMobile ? (sidebarOpen ? 0 : '-240px') : 0,
      top: 0,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      transition: 'left 0.3s ease',
    },
    overlay: {
      display: isMobile && sidebarOpen ? 'block' : 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 999,
    },
    logo: {
      padding: '24px 20px',
      borderBottom: '1px solid #F2F4F6',
    },
    logoInner: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    logoIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #3182F6 0%, #6366F1 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#191F28',
      margin: 0,
    },
    logoSub: {
      fontSize: '12px',
      color: '#8B95A1',
      margin: 0,
    },
    nav: {
      flex: 1,
      padding: '12px',
    },
    navList: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },
    navItem: {
      marginBottom: '4px',
    },
    navLink: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '500',
      color: isActive ? '#3182F6' : '#4E5968',
      backgroundColor: isActive ? '#E8F3FF' : 'transparent',
      textDecoration: 'none',
      transition: 'all 0.2s',
    }),
    main: {
      flex: 1,
      marginLeft: isMobile ? 0 : '240px',
      padding: isMobile ? '16px' : '32px 40px',
      paddingTop: isMobile ? '70px' : '32px',
      maxWidth: '1200px',
      width: '100%',
    },
    mobileHeader: {
      display: isMobile ? 'flex' : 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '56px',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E5E8EB',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      zIndex: 998,
    },
    hamburger: {
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    },
    mobileTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#191F28',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    closeBtn: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      width: '32px',
      height: '32px',
      display: isMobile ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F2F4F6',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    },
  }

  return (
    <div style={styles.container}>
      {/* 모바일 헤더 */}
      <div style={styles.mobileHeader}>
        <button style={styles.hamburger} onClick={() => setSidebarOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#191F28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <span style={styles.mobileTitle}>
          <span style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #3182F6 0%, #6366F1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
              <polyline points="16 7 22 7 22 13"/>
            </svg>
          </span>
          투자 리서치
        </span>
        <div style={{ width: '40px' }} /> {/* 균형용 빈 공간 */}
      </div>

      {/* 오버레이 */}
      <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />

      {/* 사이드바 */}
      <aside style={styles.sidebar}>
        <button style={styles.closeBtn} onClick={() => setSidebarOpen(false)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4E5968" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div style={styles.logo}>
          <div style={styles.logoInner}>
            <div style={styles.logoIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                <polyline points="16 7 22 7 22 13"/>
              </svg>
            </div>
            <div>
              <h1 style={styles.logoTitle}>투자 리서치</h1>
              <p style={styles.logoSub}>Research Platform</p>
            </div>
          </div>
        </div>

        <nav style={styles.nav}>
          <ul style={styles.navList}>
            {navItems.map((item) => (
              <li key={item.path} style={styles.navItem}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  style={({ isActive }) => styles.navLink(isActive)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
