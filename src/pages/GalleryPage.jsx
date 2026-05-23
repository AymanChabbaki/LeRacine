import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { galleryImages } from '../data/galleryImages'

function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activePage, setActivePage] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const bookContainerRef = useRef(null)
  
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // 1. Set programmatic SEO title & description
  useEffect(() => {
    document.title = "Galerie Photos — Le Racine Casablanca"
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute("content", "Feuilletez notre album photo interactif et découvrez le cadre élégant, les plats savoureux et l'ambiance chaleureuse de Le Racine Casablanca.")
    }
  }, [])

  // Filter images based on category
  const filtered = activeCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeCategory)

  const N = filtered.length
  const totalSheets = N === 0 ? 0 : Math.floor(N / 2) + 2
  const totalPages = totalSheets * 2

  // Calculate current desktop sheet based on activePage
  const currentSheet = activePage === 0 ? 0 : Math.floor((activePage - 1) / 2) + 1

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    setActivePage(0)
  }

  // Handle resizing to detect mobile viewport
  useEffect(() => {
    const handleResize = () => {
      const wasMobile = isMobile
      const nowMobile = window.innerWidth <= 768
      setIsMobile(nowMobile)

      if (wasMobile !== nowMobile) {
        if (nowMobile) {
          if (activePage === 0 && currentSheet > 0) {
            setActivePage((currentSheet - 1) * 2 + 1)
          }
        } else {
          const targetSheet = activePage === 0 ? 0 : Math.floor((activePage - 1) / 2) + 1
          setActivePage(targetSheet === 0 ? 0 : (targetSheet - 1) * 2 + 1)
        }
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobile, activePage, currentSheet])

  // Navigation Logic
  const navigateNext = () => {
    if (isMobile) {
      if (activePage < totalPages - 2) {
        setActivePage(prev => prev + 1)
      }
    } else {
      if (currentSheet < totalSheets - 1) {
        const nextSheet = currentSheet + 1
        setActivePage((nextSheet - 1) * 2 + 1)
      }
    }
  }

  const navigatePrev = () => {
    if (isMobile) {
      if (activePage > 0) {
        setActivePage(prev => prev - 1)
      }
    } else {
      if (currentSheet > 0) {
        const prevSheet = currentSheet - 1
        setActivePage(prevSheet === 0 ? 0 : (prevSheet - 1) * 2 + 1)
      }
    }
  }

  // Keyboard navigation listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        navigateNext()
      } else if (e.key === 'ArrowLeft') {
        navigatePrev()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMobile, activePage, currentSheet, totalSheets, totalPages])

  // Swipe gesture listeners
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX
  }

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX
    const threshold = 55
    if (touchEndX.current < touchStartX.current - threshold) {
      navigateNext()
    } else if (touchEndX.current > touchStartX.current + threshold) {
      navigatePrev()
    }
  }

  // Handle click-to-flip on desktop
  const handleSheetClick = (idx, e) => {
    if (e.target.closest('a') || e.target.closest('button')) return
    if (isMobile) return

    if (idx < currentSheet) {
      // Flip backward
      setActivePage(idx === 0 ? 0 : (idx - 1) * 2 + 1)
    } else if (idx === currentSheet) {
      // Flip forward
      setActivePage(idx * 2 + 1)
    }
  }

  // Get French label for categories
  const getCategoryLabelFr = (cat) => {
    const categoriesFr = {
      ambiance: 'Cadre & Ambiance',
      plats: 'Saveurs Gastronomiques',
      boissons: 'Bar & Barista'
    }
    return categoriesFr[cat] || 'Collection Le Racine'
  }

  // Render inline transform style for page faces on mobile
  const getFaceTransformStyle = (faceIdx) => {
    if (isMobile) {
      return { transform: `translateX(${(faceIdx - activePage) * 100}%)` }
    }
    return {}
  }

  // Render sheet flipping classes and stacking order for desktop
  const getSheetClassAndStyle = (idx) => {
    if (isMobile) {
      return { className: 'book-sheet', style: {} }
    }
    
    const isFlipped = idx < currentSheet
    const zIndex = isFlipped ? idx + 1 : totalSheets - idx
    return {
      className: `book-sheet ${isFlipped ? 'flipped' : ''}`,
      style: { zIndex }
    }
  }

  // Categories definition
  const categoryLabels = {
    all: 'Collection Complète',
    ambiance: 'Ambiance & Décor',
    plats: 'Gastronomie & Plats',
    boissons: 'Bar & Boissons'
  }

  // Dynamic Image Page Component to handle spinner loader
  const ImagePage = ({ image, pageNum, faceClass }) => {
    const [loaded, setLoaded] = useState(false)
    const cap = getCategoryLabelFr(image.category)
    return (
      <div className={`page-face ${faceClass} paper-texture`} id={`page${pageNum}`} style={getFaceTransformStyle(pageNum)}>
        <div className="page-inner gallery-page-inner">
          <span className="gallery-page-header">Le Racine Casablanca</span>
          
          <div className="gallery-photo-frame">
            {!loaded && <div className="photo-spinner"></div>}
            <img 
              className="gallery-photo" 
              src={image.src} 
              alt={cap} 
              onLoad={() => setLoaded(true)}
              style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
            />
          </div>
          
          <div className="gallery-photo-caption">{cap}</div>
          <span className="page-number">{pageNum}</span>
        </div>
      </div>
    )
  }

  // Construct dynamic sheets array
  const sheetsList = []
  for (let s = 0; s < totalSheets; s++) {
    let frontFace = null
    let backFace = null

    if (s === 0) {
      // Cover Page Front
      frontFace = (
        <div className="page-face front-face cover-front" id="page0" style={getFaceTransformStyle(0)}>
          <div className="cover-border">
            <div className="cover-content">
              <div className="cover-logo-wrapper">
                <img src="/assets/logo.jpg" alt="Le Racine Logo" className="cover-logo" />
              </div>
              <span className="cover-subtitle">ALBUM DE PRESTIGE</span>
              <div className="gold-separator"></div>
              <h1 className="cover-title">GALERIE</h1>
              <span className="cover-category-badge">{categoryLabels[activeCategory]}</span>
              <div className="gold-separator"></div>
              <p className="cover-address">Le Racine · Casablanca</p>
              <span className="cover-footer">Feuilleter l'album</span>
              <div className="flip-hint-desktop">Cliquez pour ouvrir &rarr;</div>
            </div>
          </div>
        </div>
      )

      // Cover Page Back (Page 1 -> Image 0)
      if (N > 0) {
        backFace = <ImagePage image={filtered[0]} pageNum={1} faceClass="back-face" />
      }
    } else if (s === totalSheets - 1) {
      // Last Sheet: Back Cover (Page totalPages - 2)
      frontFace = (
        <div className="page-face front-face cover-back" id={`page${totalPages - 2}`} style={getFaceTransformStyle(totalPages - 2)}>
          <div className="cover-border">
            <div className="cover-content">
              <div className="cover-logo-wrapper">
                <img src="/assets/logo.jpg" alt="Le Racine Logo" className="cover-logo" />
              </div>
              <span className="cover-subtitle">Le Racine Casablanca</span>
              <div className="gold-separator"></div>
              <p className="cover-back-info" style={{ fontSize: '0.85rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                <strong>Adresse :</strong> 52 Rue Oumayma Essayeh, Casablanca<br />
                <strong>Téléphone :</strong> +212 8 08 56 92 68<br />
                <strong>Instagram :</strong> @leracineofficial
              </p>
              <div className="gold-separator"></div>
              <p className="cover-back-thankyou" style={{ fontStyle: 'italic', color: 'var(--color-gold)' }}>Merci pour votre visite et à très bientôt.</p>
              <Link to="/" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>Retour à l'Accueil</Link>
            </div>
          </div>
        </div>
      )

      // Behind Back Cover (Page totalPages - 1)
      backFace = (
        <div className="page-face back-face cover-back-behind" id={`page${totalPages - 1}`} style={getFaceTransformStyle(totalPages - 1)}>
          <div className="page-inner" style={{ backgroundColor: '#0c0908', borderColor: 'transparent', margin: 0, height: '100%' }}>
            {/* Solid back edge */}
          </div>
        </div>
      )
    } else if (s === totalSheets - 2) {
      // Second to last sheet
      const frontPageIndex = 2 * s
      const frontImgIndex = frontPageIndex - 1
      frontFace = <ImagePage image={filtered[frontImgIndex]} pageNum={frontPageIndex} faceClass="front-face" />

      const backPageIndex = 2 * s + 1
      if (N % 2 !== 0) {
        // N is odd, last image is on the back
        backFace = <ImagePage image={filtered[N - 1]} pageNum={backPageIndex} faceClass="back-face" />
      } else {
        // N is even, blank stamp filler page
        backFace = (
          <div className="page-face back-face paper-texture" id={`page${backPageIndex}`} style={getFaceTransformStyle(backPageIndex)}>
            <div className="page-inner blank-page">
              <div className="blank-logo-stamp">
                <img src="/assets/logo.jpg" alt="Le Racine Stamp" />
              </div>
              <p className="blank-stamp-text">Le Racine Casablanca</p>
              <span className="page-number">{backPageIndex}</span>
            </div>
          </div>
        )
      }
    } else {
      // Intermediate sheet
      const frontPageIndex = 2 * s
      const frontImgIndex = frontPageIndex - 1
      frontFace = <ImagePage image={filtered[frontImgIndex]} pageNum={frontPageIndex} faceClass="front-face" />

      const backPageIndex = 2 * s + 1
      const backImgIndex = backPageIndex - 1
      backFace = <ImagePage image={filtered[backImgIndex]} pageNum={backPageIndex} faceClass="back-face" />
    }

    sheetsList.push({
      sheetIndex: s,
      front: frontFace,
      back: backFace
    })
  }

  return (
    <div className="menu-page-body">
      {/* Header Navigation */}
      <header className="menu-header">
        <div className="nav-container">
          <Link to="/" className="logo-wrapper" id="galleryLogoLink">
            <div className="logo-cradle">
              <svg viewBox="0 0 210 58" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
                {/* Cup shape root supporting the logo image (center of logo is at x=29, y=29) */}
                <path d="M 6 29 C 6 48, 52 48, 52 29" strokeWidth="1.5" />
                {/* Little leaf extending off the left side of the cup */}
                <path d="M 12 21 C 4 19, 2 11, 10 15 C 8 19, 10 20, 12 21 Z" fill="currentColor" fillOpacity="0.25" />
                <path d="M 12 21 L 10 15" strokeWidth="0.8" />
                
                {/* Main horizontal holding root running underneath the text */}
                <path d="M 42 41 C 72 45, 110 39, 204 39" strokeWidth="1.4" />
                {/* Sub-branch below the main one */}
                <path d="M 70 42 C 100 46, 130 45, 170 41" strokeWidth="0.8" />
                
                {/* Leaf branch 1 supporting the letter 'R' / 'A' (around x=95) */}
                <path d="M 75 42 C 82 28, 100 27, 106 39 C 95 40, 85 41, 75 42 Z" fill="currentColor" fillOpacity="0.25" />
                <path d="M 75 42 L 106 39" strokeWidth="0.8" />
                
                {/* Leaf branch 2 supporting the letter 'I' / 'N' (around x=145) */}
                <path d="M 135 40 C 143 27, 160 26, 166 38 C 155 39, 145 39, 135 40 Z" fill="currentColor" fillOpacity="0.25" />
                <path d="M 135 40 L 166 38" strokeWidth="0.8" />
              </svg>
            </div>
            <img src="/assets/logo.jpg" alt="Le Racine Logo" className="logo-img" />
            <span className="logo-text">LE RACINE</span>
          </Link>
          <Link to="/" className="btn btn-back-home" id="btnBackHome">
            Retour à l'Accueil
          </Link>
        </div>
      </header>

      {/* Category Tabs Navigation */}
      <nav className="menu-book-tabs" id="galleryCategoryTabs">
        {Object.entries(categoryLabels).map(([catKey, catLabel]) => (
          <button 
            key={catKey}
            className={`book-tab ${activeCategory === catKey ? 'active' : ''}`}
            onClick={() => handleCategoryChange(catKey)}
          >
            {catLabel}
          </button>
        ))}
      </nav>

      {/* Main Book Screen Wrapper */}
      <main className="book-wrapper">
        <button 
          className="book-nav-btn prev-btn" 
          id="prevPageBtn" 
          aria-label="Page précédente"
          onClick={navigatePrev}
          disabled={isMobile ? activePage === 0 : currentSheet === 0}
        >
          &#8249;
        </button>

        {/* 3D Book Container */}
        {N === 0 ? (
          <div className="book-container">
            <div className="gallery-empty" style={{ color: 'var(--text-secondary)', textAlign: 'center', width: '100%', padding: '2rem' }}>
              <p>Aucune photo disponible dans cette catégorie.</p>
            </div>
          </div>
        ) : (
          <div 
            className="book-container" 
            id="bookContainer"
            ref={bookContainerRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {sheetsList.map(sheet => (
              <div 
                key={sheet.sheetIndex}
                {...getSheetClassAndStyle(sheet.sheetIndex)}
                onClick={(e) => handleSheetClick(sheet.sheetIndex, e)}
              >
                {sheet.front}
                {sheet.back}
              </div>
            ))}
          </div>
        )}

        <button 
          className="book-nav-btn next-btn" 
          id="nextPageBtn" 
          aria-label="Page suivante"
          onClick={navigateNext}
          disabled={N === 0 || (isMobile ? activePage === totalPages - 2 : currentSheet === totalSheets - 1)}
        >
          &#8250;
        </button>
      </main>

      {/* Mobile Swipe Hint */}
      {totalPages > 1 && (
        <div className="mobile-swipe-hint">
          <svg className="swipe-hand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12h20" />
            <path d="m5 9-3 3 3 3" />
            <path d="m19 9 3 3-3 3" />
            <path d="M12 18a1.5 1.5 0 0 0 1.5-1.5V10h-3v6.5A1.5 1.5 0 0 0 12 18z" fill="currentColor" fillOpacity="0.15" />
          </svg>
          <span>Glissez pour feuilleter</span>
        </div>
      )}

      {/* Mobile Nav Indicators (Dot bar) */}
      {totalPages > 0 && (
        <div className="mobile-book-indicators" id="mobileIndicators">
          {Array.from({ length: totalPages - 1 }).map((_, i) => (
            <div 
              key={i} 
              className={`indicator-dot ${i === activePage ? 'active' : ''}`}
              onClick={() => setActivePage(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default GalleryPage
