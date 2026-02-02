import { useState } from 'react'
import { Layout } from './components/Layout'

import SplashScreen from './pages/SplashScreen'
import MenuScreen from './pages/MenuScreen'
import RecordScreen from './pages/RecordScreen'
import HistoryScreen from './pages/HistoryScreen'
import AnalysisScreen from './pages/AnalysisScreen'
import ManagementScreen from './pages/ManagementScreen'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash')

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash': return <SplashScreen onNavigate={setCurrentScreen} />
      case 'menu': return <MenuScreen onNavigate={setCurrentScreen} />
      case 'record': return <RecordScreen onNavigate={setCurrentScreen} />
      case 'history': return <HistoryScreen onNavigate={setCurrentScreen} />
      case 'analysis': return <AnalysisScreen onNavigate={setCurrentScreen} />
      case 'management': return <ManagementScreen onNavigate={setCurrentScreen} />
      default: return <SplashScreen onNavigate={setCurrentScreen} />
    }
  }

  return (
    <Layout>
      {renderScreen()}
    </Layout>
  )
}
