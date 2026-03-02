import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { path: '/', label: '하우가 패밀리', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { path: '/whales', label: '기관투자자', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { path: '/learn', label: '투자 학습', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { path: '/gayoon', label: '가윤 달리오', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
  { path: '/battle', label: '수익률 대결', icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z' },
  { path: '/tax', label: '절세 가이드', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
]

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
    left: 0,
    top: 0,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
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
    marginLeft: '240px',
    padding: '32px 40px',
    maxWidth: '1200px',
  },
}

export default function Layout() {
  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
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
