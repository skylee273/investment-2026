import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DataProvider } from './contexts/DataContext'
import Layout from './components/Layout/Layout'
import PortfolioPage from './pages/PortfolioPage'
import LearnPage from './pages/LearnPage'
import GayoonWealthPage from './pages/GayoonWealthPage'
import PortfolioBattlePage from './pages/PortfolioBattlePage'
import PortfolioReportPage from './pages/PortfolioReportPage'
import TaxGuidePage from './pages/TaxGuidePage'
import RiaGuidePage from './pages/RiaGuidePage'
import HaugaHousePage from './pages/HaugaHousePage'
import RebalancePage from './pages/RebalancePage'
import MonthlyReportPage from './pages/MonthlyReportPage'
import GuruPortfolioPage from './pages/GuruPortfolioPage'
import InvestmentNotesPage from './pages/InvestmentNotesPage'

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<PortfolioPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="learn" element={<LearnPage />} />
            <Route path="gayoon" element={<GayoonWealthPage />} />
            <Route path="gayoon/report" element={<PortfolioReportPage />} />
            <Route path="battle" element={<PortfolioBattlePage />} />
            <Route path="tax" element={<TaxGuidePage />} />
            <Route path="ria" element={<RiaGuidePage />} />
            <Route path="house" element={<HaugaHousePage />} />
            <Route path="rebalance" element={<RebalancePage />} />
            <Route path="monthly" element={<MonthlyReportPage />} />
            <Route path="gurus" element={<GuruPortfolioPage />} />
            <Route path="notes" element={<InvestmentNotesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  )
}

export default App
