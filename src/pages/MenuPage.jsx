import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

function MenuPage() {
  const [activePage, setActivePage] = useState(0) // 0 to 10
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const bookContainerRef = useRef(null)
  
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const totalSheets = 6 // 0 to 5

  // Calculate current desktop sheet based on activePage
  const currentSheet = activePage === 0 ? 0 : Math.floor((activePage - 1) / 2) + 1

  // Set programmatic SEO title & description
  useEffect(() => {
    document.title = "La Carte — Le Racine Casablanca"
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute("content", "Découvrez le menu complet de Le Racine Casablanca — Café, Restaurant & Brasserie. Feuilletez notre carte interactive comme un livre de luxe.")
    }
  }, [])

  // Handle resizing to detect mobile viewport
  useEffect(() => {
    const handleResize = () => {
      const wasMobile = isMobile
      const nowMobile = window.innerWidth <= 768
      setIsMobile(nowMobile)

      if (wasMobile !== nowMobile) {
        if (nowMobile) {
          // Sync active page from sheet
          if (activePage === 0 && currentSheet > 0) {
            setActivePage((currentSheet - 1) * 2 + 1)
          }
        } else {
          // Sync sheet from active page
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
      if (activePage < 10) {
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
  }, [isMobile, activePage, currentSheet])

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
    // Avoid flipping if user clicks on links/buttons
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

  // Helper to sync highlight classes for categories
  const isTabActive = (targetPage) => {
    if (isMobile) {
      return targetPage === activePage
    } else {
      if (currentSheet === 0) {
        return targetPage === 0
      } else {
        const leftPage = (currentSheet - 1) * 2 + 1
        const rightPage = leftPage + 1
        return targetPage === leftPage || targetPage === rightPage
      }
    }
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

  return (
    <div className="menu-page-body">
      {/* Header Navigation */}
      <header className="menu-header">
        <div className="nav-container">
          <Link to="/" className="logo-wrapper" id="menuLogoLink">
            <img src="/assets/logo.jpg" alt="Le Racine Logo" className="logo-img" />
            <span className="logo-text">LE RACINE</span>
          </Link>
          <Link to="/" className="btn btn-back-home" id="btnBackHome">
            Retour à l'Accueil
          </Link>
        </div>
      </header>

      {/* Category Tabs Navigation */}
      <nav className="menu-book-tabs" id="bookCategoryTabs">
        {[
          { label: 'Couverture', page: 0 },
          { label: 'Entrées & Salades', page: 1 },
          { label: 'Plats & Marocain', page: 2 },
          { label: 'Pâtes & Burgers', page: 3 },
          { label: 'Pizzas', page: 4 },
          { label: 'Crêpes & Desserts', page: 5 },
          { label: 'Boissons Chaudes', page: 6 },
          { label: 'Jus & Smoothies', page: 7 },
          { label: 'Cocktails & Détox', page: 8 },
          { label: 'Sodas & Eaux', page: 9 }
        ].map(tab => (
          <button 
            key={tab.page}
            className={`book-tab ${isTabActive(tab.page) ? 'active' : ''}`}
            onClick={() => setActivePage(tab.page)}
          >
            {tab.label}
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
        <div 
          className="book-container" 
          id="bookContainer"
          ref={bookContainerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          
          {/* SHEET 0 (Page 0: Cover / Page 1: Entrées & Salades) */}
          <div {...getSheetClassAndStyle(0)} onClick={(e) => handleSheetClick(0, e)}>
            {/* FRONT: Cover Page */}
            <div className="page-face front-face cover-front" id="page0" style={getFaceTransformStyle(0)}>
              <div className="cover-border">
                <div className="cover-content">
                  <div className="cover-logo-wrapper">
                    <img src="/assets/logo.jpg" alt="Le Racine Logo" className="cover-logo" />
                  </div>
                  <span className="cover-subtitle">Café · Restaurant · Brasserie</span>
                  <div className="gold-separator"></div>
                  <h1 className="cover-title">LA CARTE</h1>
                  <div className="gold-separator"></div>
                  <p className="cover-address">52 Rue Oumayma Essayeh, Casablanca</p>
                  <span className="cover-footer">Feuilletez le menu</span>
                  <div className="flip-hint-desktop">Cliquez pour ouvrir &rarr;</div>
                </div>
              </div>
            </div>

            {/* BACK: Page 1 - Entrées & Salades */}
            <div className="page-face back-face paper-texture" id="page1" style={getFaceTransformStyle(1)}>
              <div className="page-inner">
                <span className="page-header">Entrées & Salades</span>
                
                <div className="menu-book-grid">
                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Salade César</h3>
                      <span className="menu-book-item-price">60 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Salade romaine, volaille panée ou poulet grillé, copeaux de parmesan, tomates cerises, croûtons dorés, sauce César.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Salade Niçoise</h3>
                      <span className="menu-book-item-price">65 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Mesclun, thon à l'huile, œuf dur, pommes de terre, betterave, carottes râpées, haricots verts, concombre, tomates, oignons rouges, olives noires, vinaigrette à l'orange.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Chèvre Chaud Gourmand</h3>
                      <span className="menu-book-item-price">70 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Mesclun, pain doré, fromage de chèvre, thym, pomme, noix, tomates cerises, vinaigrette à l'orange, réduction de balsamique.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">César aux Gambas</h3>
                      <span className="menu-book-item-price">75 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Salade romaine, gambas grillées, copeaux de parmesan, tomates cerises, croutons dorés, sauce César.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Salade Fruits de Mer</h3>
                      <span className="menu-book-item-price">80 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Mesclun, gambas, calamars, crevettes roses, maïs, tomates cerises, duo de vinaigrette à l'orange et sauce pesto.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Délice Le Racine</h3>
                      <span className="menu-book-item-price">90 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Salade mixte, gambas, avocat, poulet, œufs de caille, jambon fumé, tomates cerises, vinaigrette maison.</p>
                  </div>

                  <div className="menu-book-section-divider">Entrées Chaudes</div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Gambas à l'Ail</h3>
                      <span className="menu-book-item-price">90 Dhs</span>
                    </div>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Gambas Pil-Pil</h3>
                      <span className="menu-book-item-price">90 Dhs</span>
                    </div>
                  </div>
                </div>
                
                <span className="page-number">1</span>
              </div>
            </div>
          </div>

          {/* SHEET 1 (Page 2: Plats & Cuisine Marocaine / Page 3: Pâtes & Burgers) */}
          <div {...getSheetClassAndStyle(1)} onClick={(e) => handleSheetClick(1, e)}>
            {/* FRONT: Page 2 - Plats & Cuisine Marocaine */}
            <div className="page-face front-face paper-texture" id="page2" style={getFaceTransformStyle(2)}>
              <div className="page-inner">
                <span className="page-header">Plats & Cuisine Marocaine</span>
                
                <div className="menu-book-grid">
                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Émincé de Poulet Crème</h3>
                      <span className="menu-book-item-price">75 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Sauce crème de champignons, servi avec 2 garnitures au choix (Frites, Légumes, Pâtes, Purée ou Riz).</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Escalope à la Milanaise</h3>
                      <span className="menu-book-item-price">85 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Poulet pané croustillant, servi avec pâtes sauce tomate.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Cordon Bleu</h3>
                      <span className="menu-book-item-price">85 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Poitrine de poulet panée farcie à l'emmental, Grana padano, charcuterie fumée, basilic. Garniture au choix.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Émincé de Bœuf Champignons</h3>
                      <span className="menu-book-item-price">95 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Servi avec 2 garnitures au choix (Frites, Légumes, Pâtes, Purée ou Riz).</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Belle Entrecôte Grillée</h3>
                      <span className="menu-book-item-price">150 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Accompagnée de poêlée de légumes, pommes potatoes, et sauce aux champignons.</p>
                  </div>

                  <div className="menu-book-section-divider">Kitchen Dari</div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Tajine Poulet Maslala</h3>
                      <span className="menu-book-item-price">75 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Poulet mijoté aux olives maslala et citron confit. Servi avec frites maison.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Tajine Boulettes Viande Hachée</h3>
                      <span className="menu-book-item-price">80 Dhs</span>
                    </div>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Tajine Viande Pruneaux & Abricots</h3>
                      <span className="menu-book-item-price">120 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Tajine de viande tendre parfumé, pruneaux, amandes effilées et abricots.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Rfissa Prestige (Mercredi)</h3>
                      <span className="menu-book-item-price">75 Dhs</span>
                    </div>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Couscous Poulet / Viande (Vendredi)</h3>
                      <span className="menu-book-item-price">80 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Couscous traditionnel du vendredi, servi avec son verre de lben (lait fermenté).</p>
                  </div>
                </div>
                
                <span className="page-number">2</span>
              </div>
            </div>

            {/* BACK: Page 3 - Pâtes, Sandwichs & Burgers */}
            <div className="page-face back-face paper-texture" id="page3" style={getFaceTransformStyle(3)}>
              <div className="page-inner">
                <span className="page-header">Pâtes, Sandwichs & Burgers</span>
                
                <div className="menu-book-grid">
                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Composez Vos Pâtes</h3>
                      <span className="menu-book-item-price">Dès 50 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc" style={{ fontStyle: 'italic' }}>Pâtes : Spaghetti, Penne ou Tagliatelle. Sauces : Blanche, Tomate, Rosée, Provençale Spéciale Maison.</p>
                    <div className="menu-book-sub-items">
                      <span>Arrabbiata (50 Dhs)</span> · 
                      <span> Poulet Champignons (65 Dhs)</span> · 
                      <span> Bolognaise (70 Dhs)</span> · 
                      <span> Quatre Fromages (70' Dhs)</span> · 
                      <span> Saumon & Épinards (85 Dhs)</span> · 
                      <span> Fruits de Mer (90 Dhs)</span>
                    </div>
                  </div>

                  <div className="menu-book-section-divider">Nos Sandwichs</div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Sandwich Poulet</h3>
                      <span className="menu-book-item-price">50 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Poulet mariné poêlé, tomates cerises, oignons et champignons sautés, cream cheese, sauce américaine.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Sandwich Poulet Panko</h3>
                      <span className="menu-book-item-price">60 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Poulet pané, salade mixte, tomate, oignon, cornichons, emmental, sauce mayonnaise et moutarde à l'ancienne.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Viande Hachée Italienne</h3>
                      <span className="menu-book-item-price">60 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Viande hachée, salade verte, tomate, oignon, olives, cornichons, mozzarella fondue, sauce spicy mayo.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Cheesesteak Sandwich</h3>
                      <span className="menu-book-item-price">75 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Émincé de bœuf, tomates cerises, champignons et oignons sautés, moutarde à l'ancienne, cheddar, sauce américaine.</p>
                  </div>

                  <div className="menu-book-section-divider">Nos Burgers</div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Burger Poulet César</h3>
                      <span className="menu-book-item-price">65 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Poulet croustillant pané, tomate, oignon cru, cornichons, iceberg, cheddar, sauce César.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Suprême Cheese Burger</h3>
                      <span className="menu-book-item-price">65 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Poulet mariné grillé, tomate, iceberg, cornichons, avocat, cheddar, sauce moutarde à l'ancienne.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Cheeseburger Classique</h3>
                      <span className="menu-book-item-price">70 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Viande hachée, tomate, oignon cru, cornichons, salade iceberg, cheddar fondant.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Hamburger Américain</h3>
                      <span className="menu-book-item-price">75 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Steak haché, tomate, oignons caramélisés, jambon fumé, cornichons, cheddar, iceberg, roquette, sauce américaine.</p>
                  </div>
                </div>
                
                <span className="page-number">3</span>
              </div>
            </div>
          </div>

          {/* SHEET 2 (Page 4: Pizzas & Kid's Menu / Page 5: Crêpes & Desserts) */}
          <div {...getSheetClassAndStyle(2)} onClick={(e) => handleSheetClick(2, e)}>
            {/* FRONT: Page 4 - Pizzas Artisanales & Menu Enfant */}
            <div className="page-face front-face paper-texture" id="page4" style={getFaceTransformStyle(4)}>
              <div className="page-inner">
                <span className="page-header">Nos Pizzas Artisanales</span>
                
                <div className="menu-book-grid">
                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Margherita</h3>
                      <span className="menu-book-item-price">50 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Sauce tomate maison, mozzarella fleur de lait, basilic frais.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">La Veggie</h3>
                      <span className="menu-book-item-price">55 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Sauce tomate, mozzarella, assortiment de légumes grillés de saison, tomates cerises, roquette, parmesan.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Al Pollo</h3>
                      <span className="menu-book-item-price">60 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Sauce blanche crémeuse, poulet grillé, tomates cerises, champignons, mozzarella, parmesan, roquette.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Al Tonno</h3>
                      <span className="menu-book-item-price">65 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Sauce tomate, mozzarella, thon à l'huile, poivrons grillés, champignons, basilic, olives noires.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Quatre Fromages</h3>
                      <span className="menu-book-item-price">65 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Sauce blanche, mozzarella, gorgonzola savoureux, copeaux de parmesan, emmental.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Delicata Bianca</h3>
                      <span className="menu-book-item-price">70 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Sauce blanche, mozzarella, fromage de chèvre crémeux, noix caramélisées, filet de miel.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Pizza Viande Hachée</h3>
                      <span className="menu-book-item-price">75 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Sauce tomate, mozzarella, viande hachée assaisonnée, champignons frais, tomates cerises, parmesan, roquette.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Pizza Fruits de Mer</h3>
                      <span className="menu-book-item-price">80 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Sauce tomate, mozzarella, gambas, calamars, crevettes roses, moules, basilic frais, parmesan.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Saumon Épinard</h3>
                      <span className="menu-book-item-price">85 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Sauce blanche, mozzarella, saumon fumé de qualité, crème de fromage, épinards, zeste de citron, jeunes pousses d'épinards.</p>
                  </div>

                  <div className="menu-book-section-divider">Menu Enfant</div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Menu P'tit Racine</h3>
                      <span className="menu-book-item-price">75 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc"><strong>Choix de plat :</strong> Pizza Margherita, Pâtes Sauce Fromage ou Cheeseburger + Frites.<br /><strong>Boisson :</strong> Boisson au choix.<br /><strong>Dessert :</strong> Panna cotta aux fruits rouges ou boule de glace.</p>
                  </div>
                </div>
                
                <span className="page-number">4</span>
              </div>
            </div>

            {/* BACK: Page 5 - Crêpes & Desserts */}
            <div className="page-face back-face paper-texture" id="page5" style={getFaceTransformStyle(5)}>
              <div className="page-inner">
                <span className="page-header">Crêpes & Douceurs</span>
                
                <div className="menu-book-grid">
                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Crêpe Nutella & Vanille</h3>
                      <span className="menu-book-item-price">45 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Nappée au Nutella, servie avec une boule de glace à la vanille.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Crêpe Banane & Nutella</h3>
                      <span className="menu-book-item-price">50 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Nutella, tranches de banane fraîche, éclats de noix caramélisées.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Crêpe Miel & Amandes</h3>
                      <span className="menu-book-item-price">60 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Miel pur, amandes effilées grillées, boule de glace vanille.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Crêpe Caramel & Banane</h3>
                      <span className="menu-book-item-price">65 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Nappage caramel au beurre salé maison, banane, amandes effilées.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Crêpe Tutti Frutti</h3>
                      <span className="menu-book-item-price">65 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Fruits frais de saison, panna cotta, coulis de fruits rouges, amandes effilées, crème de pistache.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Crêpe Spéculoos & Duo</h3>
                      <span className="menu-book-item-price">65 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Crêpe nappée de duo de chocolat, spéculoos brisés, pépites de chocolat, chantilly.</p>
                  </div>

                  <div className="menu-book-section-divider">Crêpes Salées (Sarrasin)</div>
                  <p className="section-subtitle-small" style={{ textAlign: 'center', marginTop: '-0.8rem', marginBottom: '0.8rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Servies avec un mélange de salade vinaigrée</p>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Galette Complète Jambon</h3>
                      <span className="menu-book-item-price">60 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Jambon fumé, cream cheese, emmental fondant, œuf, salade et tomate fraîche.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Galette Poulet & Mozzarella</h3>
                      <span className="menu-book-item-price">65 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Émincé de poulet, mozzarella fondante, champignons sautés.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Galette Saumon & Avocat</h3>
                      <span className="menu-book-item-price">80 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Saumon fumé de Norvège, mozzarella, avocat frais, touche de ciboulette.</p>
                  </div>

                  <div className="menu-book-section-divider">Les Douceurs de la Maison</div>

                  <div className="menu-book-sub-grid">
                    <div className="menu-book-sub-pair">
                      <span>Panna Cotta Fruits Rouges</span>
                      <strong>25 Dhs</strong>
                    </div>
                    <div className="menu-book-sub-pair">
                      <span>Crème Brûlée</span>
                      <strong>35 Dhs</strong>
                    </div>
                    <div className="menu-book-sub-pair">
                      <span>Banoffee Pie</span>
                      <strong>40 Dhs</strong>
                    </div>
                    <div className="menu-book-sub-pair">
                      <span>San Sebastian</span>
                      <strong>40 Dhs</strong>
                    </div>
                    <div className="menu-book-sub-pair">
                      <span>Tiramisu au Café</span>
                      <strong>45 Dhs</strong>
                    </div>
                    <div className="menu-book-sub-pair">
                      <span>Cheesecake Spéculoos</span>
                      <strong>45 Dhs</strong>
                    </div>
                    <div className="menu-book-sub-pair">
                      <span>Fondant Chocolat & Glace</span>
                      <strong>50 Dhs</strong>
                    </div>
                    <div className="menu-book-sub-pair">
                      <span>Brownie Maison</span>
                      <strong>55 Dhs</strong>
                    </div>
                  </div>
                </div>
                
                <span className="page-number">5</span>
              </div>
            </div>
          </div>

          {/* SHEET 3 (Page 6: Espace Barista & Thés / Page 7: Jus, Milkshakes & Smoothies) */}
          <div {...getSheetClassAndStyle(3)} onClick={(e) => handleSheetClick(3, e)}>
            {/* FRONT: Page 6 - Espace Barista & Thés */}
            <div className="page-face front-face paper-texture" id="page6" style={getFaceTransformStyle(6)}>
              <div className="page-inner">
                <span className="page-header">Espace Barista & Thés</span>
                
                <div className="menu-book-grid">
                  <div className="menu-book-section-divider" style={{ marginTop: 0 }}>Cafétéria</div>
                  
                  <div className="menu-book-list-container">
                    <div className="menu-list-row"><span>Espresso</span> <strong>23 Dhs</strong></div>
                    <div className="menu-list-row"><span>Double Espresso</span> <strong>27 Dhs</strong></div>
                    <div className="menu-list-row"><span>Espresso Aromatisé <small>(Vanille, Noisette, Caramel)</small></span> <strong>25 Dhs</strong></div>
                    <div className="menu-list-row"><span>Espresso Affogato <small>(Espresso + Glace Vanille)</small></span> <strong>35 Dhs</strong></div>
                    <div className="menu-list-row"><span>Café Crème</span> <strong>25 Dhs</strong></div>
                    <div className="menu-list-row"><span>Café Américain</span> <strong>25 Dhs</strong></div>
                    <div className="menu-list-row"><span>Café "Nes-Nes" <small>(Traditionnel au Lait)</small></span> <strong>25 Dhs</strong></div>
                    <div className="menu-list-row"><span>Cappuccino Italiano</span> <strong>28 Dhs</strong></div>
                    <div className="menu-list-row"><span>Latte Macchiato Aromatisé <small>(Vanille, Noisette, Caramel)</small></span> <strong>30 Dhs</strong></div>
                    <div className="menu-list-row"><span>Chocolat au Lait</span> <strong>25 Dhs</strong></div>
                    <div className="menu-list-row"><span>Chocolat à l'Ancienne</span> <strong>32 Dhs</strong></div>
                    <div className="menu-list-row"><span>Lait Chaud</span> <strong>20 Dhs</strong></div>
                    <div className="menu-list-row"><span>Capsule Illy</span> <strong>30 Dhs</strong></div>
                    <div className="menu-list-row"><span>Nespresso</span> <strong>30 Dhs</strong></div>
                  </div>

                  <div className="menu-book-section-divider">Thés & Infusions</div>
                  
                  <div className="menu-book-list-container">
                    <div className="menu-list-row"><span>Thé à la Menthe Traditionnel</span> <strong>25 Dhs</strong></div>
                    <div className="menu-list-row"><span>Thé Noir Lipton</span> <strong>25 Dhs</strong></div>
                    <div className="menu-list-row"><span>Thé aux Herbes</span> <strong>25 Dhs</strong></div>
                    <div className="menu-list-row"><span>Verveine au Lait</span> <strong>25 Dhs</strong></div>
                    <div className="menu-list-row"><span>Infusion Maison Speciale</span> <strong>30 Dhs</strong></div>
                  </div>

                  <div className="menu-book-section-divider">Boissons Glacées</div>
                  
                  <div className="menu-book-list-container">
                    <div className="menu-list-row"><span>Ice Coffee</span> <strong>32 Dhs</strong></div>
                    <div className="menu-list-row"><span>Ice Coffee Latte <small>(Chocolat, Caramel ou Vanille)</small></span> <strong>35 Dhs</strong></div>
                    <div className="menu-list-row"><span>Frappuccino Maison <small>(Chocolat, Caramel ou Vanille)</small></span> <strong>35 Dhs</strong></div>
                  </div>
                </div>
                
                <span className="page-number">6</span>
              </div>
            </div>

            {/* BACK: Page 7 - Jus, Milkshakes & Smoothies */}
            <div className="page-face back-face paper-texture" id="page7" style={getFaceTransformStyle(7)}>
              <div className="page-inner">
                <span className="page-header">Jus, Milkshakes & Smoothies</span>
                
                <div className="menu-book-grid">
                  <div className="menu-book-section-divider" style={{ marginTop: 0 }}>Jus Frais Pressés</div>
                  
                  <div className="menu-book-sub-grid" style={{ marginBottom: '1rem' }}>
                    <div className="menu-book-sub-pair"><span>Orange</span><strong>28 Dhs</strong></div>
                    <div className="menu-book-sub-pair"><span>Citron</span><strong>28 Dhs</strong></div>
                    <div className="menu-book-sub-pair"><span>Pomme</span><strong>30 Dhs</strong></div>
                    <div className="menu-book-sub-pair"><span>Banane</span><strong>30 Dhs</strong></div>
                    <div className="menu-book-sub-pair"><span>Carotte</span><strong>30 Dhs</strong></div>
                    <div className="menu-book-sub-pair"><span>Betterave</span><strong>30 Dhs</strong></div>
                    <div className="menu-book-sub-pair"><span>Citron-Gingembre</span><strong>35 Dhs</strong></div>
                    <div className="menu-book-sub-pair"><span>Ananas</span><strong>40 Dhs</strong></div>
                    <div className="menu-book-sub-pair"><span>Mangue</span><strong>40 Dhs</strong></div>
                    <div className="menu-book-sub-pair"><span>Kiwi</span><strong>40 Dhs</strong></div>
                    <div className="menu-book-sub-pair"><span>Fraise</span><strong>40 Dhs</strong></div>
                    <div className="menu-book-sub-pair"><span>Avocat</span><strong>40 Dhs</strong></div>
                  </div>

                  <div className="menu-book-section-divider">Milkshakes Onctueux</div>
                  <div className="menu-milkshake-list" style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.8 }}>
                    <strong>55 Dhs</strong><br />
                    <span style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>Fraise · Vanille · Chocolat · Caramel · Oreo</span>
                  </div>

                  <div className="menu-book-section-divider">Smoothies Signatures</div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Rubis Chic</h3>
                      <span className="menu-book-item-price">50 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Fraise, framboise, myrtille, banane, jus d'orange frais.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Mango Tango</h3>
                      <span className="menu-book-item-price">50 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Mangue, purée de fruit de la passion, jus d'orange frais.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Sahara</h3>
                      <span className="menu-book-item-price">55 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Avocat, dattes douces, éclats d'Oreo, lait.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Energetico</h3>
                      <span className="menu-book-item-price">55 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Avocat, dattes, noix, amandes, raisins secs, lait.</p>
                  </div>
                </div>
                
                <span className="page-number">7</span>
              </div>
            </div>
          </div>

          {/* SHEET 4 (Page 8: Cocktails, Détox & Mojitos / Page 9: Eaux & Sodas) */}
          <div {...getSheetClassAndStyle(4)} onClick={(e) => handleSheetClick(4, e)}>
            {/* FRONT: Page 8 - Cocktails, Détox & Mojitos */}
            <div className="page-face front-face paper-texture" id="page8" style={getFaceTransformStyle(8)}>
              <div className="page-inner">
                <span className="page-header">Cocktails, Détox & Mojitos</span>
                
                <div className="menu-book-grid">
                  <div className="menu-book-section-divider" style={{ marginTop: 0 }}>Cocktails (Jus Composés)</div>
                  
                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Tropical</h3>
                      <span className="menu-book-item-price">50 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Mangue, ananas, fraise, orange.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Exotique</h3>
                      <span className="menu-book-item-price">55 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Mangue, ananas, kiwi, orange.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Mango</h3>
                      <span className="menu-book-item-price">55 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Lait, orange, mangue, banane, amandes, sirop d'orgeat.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Costa Rica</h3>
                      <span className="menu-book-item-price">55 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Mangue, fraise, banane, orange.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Pina Colada Classique</h3>
                      <span className="menu-book-item-price">55 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Ananas pressé, lait de coco crémeux.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Pina Colada Blue</h3>
                      <span className="menu-book-item-price">55 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Ananas, lait de coco, sirop de curaçao bleu.</p>
                  </div>

                  <div className="menu-book-section-divider">Boissons Détox (45 Dhs)</div>
                  
                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Green Detox</h3>
                      <span className="menu-book-item-price">45 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Kiwi, épinard, concombre, céleri, orange, citron.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Vitamine</h3>
                      <span className="menu-book-item-price">45 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Ananas, carotte, gingembre, citron, orange.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Red Health</h3>
                      <span className="menu-book-item-price">45 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Pomme, carotte, betterave, citron, orange.</p>
                  </div>

                  <div className="menu-book-item">
                    <div className="menu-book-item-header">
                      <h3 className="menu-book-item-title">Ginger Lim</h3>
                      <span className="menu-book-item-price">45 Dhs</span>
                    </div>
                    <p className="menu-book-item-desc">Citron, gingembre, ananas, origan.</p>
                  </div>

                  <div className="menu-book-section-divider">Mojitos Rafraîchissants</div>
                  
                  <div className="menu-book-sub-grid">
                    <div className="menu-book-sub-pair">
                      <span>Classique <small>(Citron vert, menthe, Sprite, canne)</small></span>
                      <strong>40 Dhs</strong>
                    </div>
                    <div className="menu-book-sub-pair">
                      <span>Passion <small>(Fruit de la passion fresh)</small></span>
                      <strong>45 Dhs</strong>
                    </div>
                    <div className="menu-book-sub-pair">
                      <span>Fruits Rouges <small>(Coulis & fruits rouges)</small></span>
                      <strong>45 Dhs</strong>
                    </div>
                    <div className="menu-book-sub-pair">
                      <span>Blue Mojito <small>(Curaçao bleu)</small></span>
                      <strong>45 Dhs</strong>
                    </div>
                  </div>
                </div>
                
                <span className="page-number">8</span>
              </div>
            </div>

            {/* BACK: Page 9 - Eaux & Sodas */}
            <div className="page-face back-face paper-texture" id="page9" style={getFaceTransformStyle(9)}>
              <div className="page-inner">
                <span className="page-header">Eaux & Sodas</span>
                
                <div className="menu-book-grid" style={{ alignContent: 'center', height: '100%' }}>
                  <div className="menu-book-section-divider" style={{ marginTop: 0 }}>Boissons & Eaux</div>
                  
                  <div className="menu-book-list-container" style={{ maxWidth: '360px', margin: '0 auto' }}>
                    <div className="menu-list-row" style={{ fontSize: '1.05rem', padding: '0.8rem 0' }}>
                      <span>Soda <small>(Coca-Cola, Sprite, Fanta...)</small></span>
                      <strong>25 Dhs</strong>
                    </div>
                    <div className="menu-list-row" style={{ fontSize: '1.05rem', padding: '0.8rem 0' }}>
                      <span>Sidi Ali <small>(Eau Minérale 50cl)</small></span>
                      <strong>20 Dhs</strong>
                    </div>
                    <div className="menu-list-row" style={{ fontSize: '1.05rem', padding: '0.8rem 0' }}>
                      <span>Sidi Ali <small>(Eau Minérale 75cl)</small></span>
                      <strong>35 Dhs</strong>
                    </div>
                    <div className="menu-list-row" style={{ fontSize: '1.05rem', padding: '0.8rem 0' }}>
                      <span>Oulmès <small>(Eau Gazeuse 25cl)</small></span>
                      <strong>25 Dhs</strong>
                    </div>
                    <div className="menu-list-row" style={{ fontSize: '1.05rem', padding: '0.8rem 0' }}>
                      <span>Oulmès <small>(Eau Gazeuse 75cl)</small></span>
                      <strong>40 Dhs</strong>
                    </div>
                    <div className="menu-list-row" style={{ fontSize: '1.05rem', padding: '0.8rem 0' }}>
                      <span>Red Bull <small>(Boisson Énergisante)</small></span>
                      <strong>35 Dhs</strong>
                    </div>
                  </div>
                  
                  <div className="leaf-svg-container" style={{ width: '80px', height: '80px', margin: '2.5rem auto 0', color: 'var(--color-gold)' }}>
                    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5 }}>
                      <path d="M50 10 C25 35, 25 70, 50 90 C75 70, 75 35, 50 10 Z" />
                      <path d="M50 10 L50 90" />
                      <path d="M50 30 Q35 45, 30 65" />
                      <path d="M50 45 Q37 60, 35 80" />
                      <path d="M50 30 Q65 45, 70 65" />
                      <path d="M50 45 Q63 60, 65 80" />
                    </svg>
                  </div>
                </div>
                
                <span className="page-number">9</span>
              </div>
            </div>
          </div>

          {/* SHEET 5 (Page 10: Back Cover / Back Side empty) */}
          <div {...getSheetClassAndStyle(5)} onClick={(e) => handleSheetClick(5, e)}>
            {/* FRONT: Page 10 - Back Cover */}
            <div className="page-face front-face cover-back" id="page10" style={getFaceTransformStyle(10)}>
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

            {/* BACK: Empty / Behind the back cover */}
            <div className="page-face back-face cover-back-behind" style={getFaceTransformStyle(11)}>
              <div className="page-inner" style={{ backgroundColor: '#0c0908', borderColor: 'transparent', margin: 0, height: '100%' }}>
                {/* Solid back edge */}
              </div>
            </div>
          </div>

        </div>

        <button 
          className="book-nav-btn next-btn" 
          id="nextPageBtn" 
          aria-label="Page suivante"
          onClick={navigateNext}
          disabled={isMobile ? activePage === 10 : currentSheet === totalSheets - 1}
        >
          &#8250;
        </button>
      </main>

      {/* Mobile Nav Indicators (Dot bar) */}
      <div className="mobile-book-indicators" id="mobileIndicators">
        {Array.from({ length: 11 }).map((_, i) => (
          <div 
            key={i} 
            className={`indicator-dot ${i === activePage ? 'active' : ''}`}
            onClick={() => setActivePage(i)}
          />
        ))}
      </div>
    </div>
  )
}

export default MenuPage
