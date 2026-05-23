import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function Header({ theme, setTheme, onOpenModal }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
    // Mark manual override so App.js doesn't automatically toggle on scroll
    window.isManualTheme = true
  }

  const handleNavClick = (anchorId) => {
    setIsMobileMenuOpen(false)
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
    <header id="header">
      <div className="nav-container">
        <Link to="/" className="logo-wrapper" id="navLogoLink" onClick={() => setIsMobileMenuOpen(false)}>
          <img src="/assets/logo.jpg" alt="Le Racine Logo" className="logo-img" />
          <span className="logo-text">LE RACINE</span>
        </Link>
        
        <nav>
          <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`} id="navLinks">
            <li>
              <a href="#experience" onClick={(e) => { e.preventDefault(); handleNavClick('#experience'); }}>
                L'Expérience
              </a>
            </li>
            <li>
              <Link to="/menu" onClick={() => setIsMobileMenuOpen(false)}>La Carte</Link>
            </li>
            <li>
              <Link to="/gallery" onClick={() => setIsMobileMenuOpen(false)}>Galerie</Link>
            </li>
            <li>
              <a href="#contact" onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}>
                Contact
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="nav-right">
          <button 
            className="theme-toggle-btn" 
            id="themeToggleBtn" 
            onClick={toggleTheme}
            aria-label="Changer le thème"
          >
            {/* Sun SVG icon (visible in dark mode) */}
            <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            {/* Moon SVG icon (visible in light mode) */}
            <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </button>
          
          <button className="btn btn-reserve" id="navReserveBtn" onClick={onOpenModal}>Réserver</button>
          
          <button 
            className="mobile-toggle" 
            id="mobileMenuToggle" 
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            aria-label="Ouvrir le menu"
          >
            <span style={{ transform: isMobileMenuOpen ? 'rotate(45deg) translate(6px, 6px)' : 'none' }}></span>
            <span style={{ opacity: isMobileMenuOpen ? '0' : '1' }}></span>
            <span style={{ transform: isMobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
