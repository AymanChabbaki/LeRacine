import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import GalleryPage from './pages/GalleryPage'
import Header from './components/Header'
import Footer from './components/Footer'
import MobileBottomNav from './components/MobileBottomNav'
import ReserveModal from './components/ReserveModal'
import './index.css'

function AppContent({ isModalOpen, setIsModalOpen, theme, setTheme }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      {isHome && (
        <Header theme={theme} setTheme={setTheme} onOpenModal={() => setIsModalOpen(true)} />
      )}
      <main style={{ minHeight: '80vh', paddingTop: isHome ? '80px' : '0px' }}>
        <Routes>
          <Route 
            path="/" 
            element={<HomePage theme={theme} setTheme={setTheme} onOpenModal={() => setIsModalOpen(true)} />} 
          />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
      </main>
      {isHome && <Footer />}
      {isHome && <MobileBottomNav onOpenModal={() => setIsModalOpen(true)} />}
      <ReserveModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('theme-dark');
    } else {
      document.body.classList.remove('theme-dark');
    }
  }, [theme]);

  return (
    <Router>
      <AppContent 
        isModalOpen={isModalOpen} 
        setIsModalOpen={setIsModalOpen} 
        theme={theme} 
        setTheme={setTheme} 
      />
    </Router>
  )
}

export default App
