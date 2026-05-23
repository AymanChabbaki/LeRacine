import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function MobileBottomNav({ onOpenModal }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('barHome')

  useEffect(() => {
    if (location.pathname === '/') {
      setActiveTab('barHome')
    } else if (location.pathname === '/menu') {
      setActiveTab('barMenu')
    } else if (location.pathname === '/gallery') {
      setActiveTab('barGallery')
    }
  }, [location.pathname])

  const handleNavClick = (anchorId, tabId) => {
    setActiveTab(tabId)
    if (location.pathname !== '/') {
      navigate('/' + anchorId)
    } else {
      const el = document.querySelector(anchorId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <nav className="mobile-bottom-bar" id="mobileBottomBar">
      <Link 
        to="/" 
        className={`bottom-bar-item ${activeTab === 'barHome' ? 'active' : ''}`} 
        id="barHome"
        onClick={() => {
          setActiveTab('barHome')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>Accueil</span>
      </Link>
      
      <Link 
        to="/menu" 
        className={`bottom-bar-item ${activeTab === 'barMenu' ? 'active' : ''}`} 
        id="barMenu"
        onClick={() => setActiveTab('barMenu')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <span>La Carte</span>
      </Link>
      
      {/* Circular Reserve Action Button */}
      <a 
        href="#reserve" 
        className="bottom-bar-item bar-reserve-center" 
        id="barReserve"
        onClick={(e) => {
          e.preventDefault()
          onOpenModal()
        }}
      >
        <div className="reserve-circle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <span>Réserver</span>
      </a>
      
      <a 
        href="#contact" 
        className={`bottom-bar-item ${activeTab === 'barContact' ? 'active' : ''}`} 
        id="barContact"
        onClick={(e) => {
          e.preventDefault()
          handleNavClick('#contact', 'barContact')
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span>Contact</span>
      </a>
    </nav>
  )
}

export default MobileBottomNav
