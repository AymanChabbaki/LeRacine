import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

function HomePage({ theme, setTheme, onOpenModal }) {
  const [activeMenuTab, setActiveMenuTab] = useState('all')
  const [greeting, setGreeting] = useState({ text: '', rec: '', itemId: '' })
  const [valetStep, setValetStep] = useState('form') // 'form' | 'ticket' | 'countdown' | 'ready'
  const [valetCar, setValetCar] = useState({ model: '', color: 'Noir' })
  const [ticketNum, setTicketNum] = useState('')
  const [timer, setTimer] = useState(180) // 3 minutes = 180s
  const [valetStatus, setValetStatus] = useState({ alert: 'Véhicule Stationné (A-14)', details: 'Votre véhicule est garé en toute sécurité dans notre parking sous surveillance.' })
  const eveningRef = useRef(null)
  const timerInterval = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleBadgeMouseMove = (e) => {
    const card = e.currentTarget
    const box = card.getBoundingClientRect()
    const x = e.clientX - box.left - box.width / 2
    const y = e.clientY - box.top - box.height / 2
    
    // Max 15 degrees tilt
    const rX = (y / (box.height / 2)) * -15
    const rY = (x / (box.width / 2)) * 15
    
    setTilt({ x: rX, y: rY })
  }

  const handleBadgeMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  // 1. Time-of-day greeting widget
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 7 && hour < 11.5) {
      setGreeting({
        text: 'Bon Matin',
        rec: 'Commencez la journée avec notre Pain Perdu de Luxe & Café de Spécialité',
        itemId: 'menu-item-brioche'
      })
    } else if (hour >= 11.5 && hour < 17.5) {
      setGreeting({
        text: 'Bon Après-midi',
        rec: 'Pour votre déjeuner, nous vous conseillons notre Filet de Bœuf & Frites Maison',
        itemId: 'menu-item-filet'
      })
    } else if (hour >= 17.5 && hour < 23) {
      setGreeting({
        text: 'Bonne Soirée',
        rec: 'Détendez-vous ce soir autour de notre Fondant au Chocolat & Glace Vanille',
        itemId: 'menu-item-fondant'
      })
    } else {
      setGreeting({
        text: 'Bonne Nuit',
        rec: 'Réservez dès maintenant votre table pour demain matin',
        itemId: 'menu-item-cafe'
      })
    }
  }, [])

  // 2. Scroll theme switcher observer
  useEffect(() => {
    const handleScroll = () => {
      // Only switch automatically if the user hasn't overridden theme manually
      if (window.isManualTheme) return

      if (eveningRef.current) {
        const rect = eveningRef.current.getBoundingClientRect()
        const isEveningVisible = rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4
        
        if (isEveningVisible) {
          setTheme('dark')
        } else {
          setTheme('light')
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [setTheme])

  // 3. Scroll vertical line tracker
  useEffect(() => {
    const scrollLine = document.getElementById('scrollLine')
    const handleLineScroll = () => {
      if (!scrollLine) return
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const percent = (scrollTop / docHeight) * 100
      scrollLine.style.height = `${percent}%`
    }
    window.addEventListener('scroll', handleLineScroll)
    return () => window.removeEventListener('scroll', handleLineScroll)
  }, [])

  // 4. Valet Simulation
  const handleValetSubmit = (e) => {
    e.preventDefault()
    if (!valetCar.model) return
    const num = `#RAC-${Math.floor(1000 + Math.random() * 9000)}`
    setTicketNum(num)
    setValetStep('ticket')
    setValetStatus({
      alert: 'Véhicule Stationné (A-14)',
      details: 'Votre véhicule est garé en toute sécurité dans notre parking sous surveillance.'
    })
  }

  const startValetRecovery = () => {
    setValetStep('countdown')
    setTimer(180)
    
    // 10x accelerated countdown (decrements 10s of display timer per real-life 1s)
    timerInterval.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 10) {
          clearInterval(timerInterval.current)
          setValetStep('ready')
          setValetStatus({
            alert: 'Véhicule Prêt à la dépose !',
            details: 'Votre véhicule vous attend devant l\'entrée principale. Restitution complétée.'
          })
          return 0
        }
        
        const nextVal = prev - 10
        // Update states dynamically depending on remaining time
        if (nextVal <= 60) {
          setValetStatus({
            alert: 'Restitution en cours...',
            details: 'Le voiturier amène votre véhicule au point de dépose.'
          })
        } else {
          setValetStatus({
            alert: 'Préparation du véhicule...',
            details: 'Votre clé a été transmise. Le voiturier récupère votre véhicule.'
          })
        }
        return nextVal
      })
    }, 1000)
  }

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  useEffect(() => {
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current)
    }
  }, [])

  const menuItems = [
    {
      id: 'menu-item-salade',
      category: 'entrees',
      name: 'Salade Le Racine',
      price: '110 MAD',
      desc: 'Une présentation signature composée de tranches fines d\'avocat, chèvre chaud au miel, noix caramélisées, figues fraîches et une émulsion balsamique maison.',
      image: '/assets/images/leracine_1.jpg',
      tags: ['Signature', 'Végétarien']
    },
    {
      id: 'menu-item-carpaccio',
      category: 'entrees',
      name: 'Carpaccio de Bœuf',
      price: '120 MAD',
      desc: 'Un classique incontournable coupé extra-fin, accompagné de copeaux de Parmigiano-Reggiano vieilli, de câpres croquantes, de roquette sauvage et d\'un filet d\'huile de truffe blanche.',
      image: '/assets/images/leracine_2.jpg',
      tags: []
    },
    {
      id: 'menu-item-burrata',
      category: 'entrees',
      name: 'Burrata & Tomates Cerises',
      price: '130 MAD',
      desc: 'Burrata italienne crémeuse, assortiment de tomates cerises anciennes, pesto de basilic frais à la fleur de sel de Guérande, pignons de pin torréfiés.',
      image: '/assets/images/leracine_3.jpg',
      tags: ['Végétarien']
    },
    {
      id: 'menu-item-filet',
      category: 'plats',
      name: 'Filet de Bœuf & Frites Maison',
      price: '220 MAD',
      desc: 'Le classique absolu des déjeuners d\'affaires. Cœur de filet de bœuf tendre, sauce onctueuse au poivre vert de Madagascar, frites fraîches croustillantes parfumées à la truffe.',
      image: '/assets/images/leracine_15.jpg',
      tags: ['Signature']
    },
    {
      id: 'menu-item-saumon',
      category: 'plats',
      name: 'Saumon Grillé & Légumes',
      price: '180 MAD',
      desc: 'Pavé de saumon frais de l\'Atlantique grillé à l\'unilatérale, accompagné de légumes croquants de saison et d\'une sauce veloutée au beurre blanc citronné.',
      image: '/assets/images/leracine_25.jpg',
      tags: []
    },
    {
      id: 'menu-item-pates',
      category: 'plats',
      name: 'Pâtes aux Fruits de Mer',
      price: '195 MAD',
      desc: 'Linguines fraîches sautées à l\'ail et piment doux, palourdes grises, calamars tendres, crevettes sauvages et tomates cerises confites au basilic.',
      image: '/assets/images/leracine_35.jpg',
      tags: []
    },
    {
      id: 'menu-item-cafe',
      category: 'boissons',
      name: 'Café de Spécialité',
      price: '35 MAD',
      desc: 'Espressos et lattes préparés par nos baristas à partir de grains de café d\'exception rigoureusement sélectionnés. Latte art de précision.',
      image: '/assets/images/leracine_10.jpg',
      tags: []
    },
    {
      id: 'menu-item-fondant',
      category: 'desserts',
      name: 'Fondant au Chocolat',
      price: '65 MAD',
      desc: 'Cœur coulant au chocolat noir de plantation 72%, servi chaud et accompagné d\'une boule de glace artisanale à la vanille de Bourbon.',
      image: '/assets/images/leracine_8.jpg',
      tags: []
    },
    {
      id: 'menu-item-brioche',
      category: 'desserts',
      name: 'Pain Perdu de Luxe',
      price: '75 MAD',
      desc: 'Brioche dorée et moelleuse imbibée d\'une crème parfumée à la vanille, caramélisée au sucre roux, nappée de caramel au beurre salé et fruits rouges.',
      image: '/assets/images/leracine_16.jpg',
      tags: ['Signature']
    }
  ]

  const filteredMenuItems = activeMenuTab === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeMenuTab)

  return (
    <>
      {/* 1. Scroll Vertical Line */}
      <div className="scroll-line-container">
        <div className="scroll-line" id="scrollLine"></div>
      </div>

      {/* 2. Hero Section */}
      <section id="hero" className="hero loaded">
        <div 
          className="hero-bg" 
          id="heroBg" 
          style={{ backgroundImage: "url('/assets/images/545987648_750421697863706_289076069569542233_n.jpg')" }}
        ></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          
          <div className="time-greeting-widget" id="timeGreetingWidget">
            <span className="greeting-text">{greeting.text}</span>
            <span className="greeting-rec">{greeting.rec}</span>
          </div>

          {/* Interactive 3D Brand Badge */}
          <div className="hero-3d-badge-container">
            <div 
              className="hero-3d-badge" 
              id="hero3dBadge"
              onMouseMove={handleBadgeMouseMove}
              onMouseLeave={handleBadgeMouseLeave}
              style={{
                '--rx': `${tilt.x}deg`,
                '--ry': `${tilt.y}deg`
              }}
            >
              <div className="hero-badge-bg-grid"></div>
              
              {/* Outer text: circular text path */}
              <div className="hero-badge-outer-text">
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                  <path 
                    id="badgeTextPath" 
                    d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" 
                    fill="none"
                  />
                  <text fontFamily="Cinzel" fontSize="6.3" fontWeight="600" fill="currentColor">
                    <textPath href="#badgeTextPath" startOffset="0%">
                      LE RACINE • CASABLANCA • 33°35'24&quot;N 7°38'12&quot;W •
                    </textPath>
                  </text>
                </svg>
              </div>

              {/* Inner gold root-leaf crest */}
              <div className="hero-badge-inner-crest">
                <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%' }}>
                  {/* Central shield/crest circle */}
                  <circle cx="30" cy="30" r="22" strokeDasharray="3 3" strokeWidth="0.8" />
                  {/* A vertical root growing from the bottom, splitting into an elegant branch with leaves */}
                  <path d="M 30 50 C 30 42, 28 38, 30 32" strokeWidth="2" />
                  <path d="M 30 50 C 26 51, 23 52, 20 54" strokeWidth="1" />
                  <path d="M 30 50 C 34 51, 37 52, 40 54" strokeWidth="1" />
                  <path d="M 30 32 C 26 26, 18 24, 16 16 C 24 18, 26 26, 30 32 Z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M 30 32 C 34 26, 42 24, 44 16 C 36 18, 34 26, 30 32 Z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M 30 32 C 29 25, 30 20, 30 12 C 31 20, 31 25, 30 32 Z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M 30 32 L 30 12" strokeWidth="1.5" />
                  
                  {/* Stars on sides */}
                  <path d="M 18 30 L 19 32 L 21 32 L 19.5 33 L 20 35 L 18 34 L 16 35 L 16.5 33 L 15 32 L 17 32 Z" fill="currentColor" />
                  <path d="M 42 30 L 43 32 L 45 32 L 43.5 33 L 44 35 L 42 34 L 40 35 L 40.5 33 L 39 32 L 41 32 Z" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>

          <span className="hero-tagline">Brasserie · Café · Lounge</span>
          <h1 className="hero-title">LE RACINE</h1>
          <p className="hero-meta">Un sanctuaire culinaire au cœur de Casablanca</p>
          <button className="btn btn-primary" onClick={onOpenModal}>Réserver une Table</button>
        </div>
      </section>

      {/* 3. L'Expérience Section */}
      <section id="experience">
        {/* Roots Backdrop: Core Trunk & Spreading branches */}
        <div className="section-roots" style={{ top: '-300px', height: 'calc(100% + 300px)' }}>
          <svg className="roots-svg" viewBox="0 0 1000 1100" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M500,800 C500,600 480,500 450,450 C420,400 380,350 350,300 C300,230 250,180 200,150" />
            <path d="M500,800 C500,620 520,530 550,470 C580,410 630,360 670,300 C720,230 780,180 800,150" />
            <path d="M500,800 C500,650 500,550 500,450 C500,380 480,320 460,250 C440,180 450,120 420,50" strokeWidth="2.5" />
            <path d="M500,800 C500,650 500,550 500,450 C500,380 520,320 540,250 C560,180 550,120 580,50" strokeWidth="2.5" />
            
            <path d="M420,50 C410,40 380,30 350,35 C320,40 290,60 260,80" />
            <path d="M580,50 C590,40 620,30 650,35 C680,40 710,60 740,80" />
            <path d="M460,250 C420,240 370,220 330,180 C290,140 280,90 290,50" />
            <path d="M540,250 C580,240 630,220 670,180 C710,140 720,90 710,50" />
            <path d="M350,300 C310,290 260,270 210,220 C160,170 140,110 150,50" className="accent" />
            <path d="M670,300 C710,290 760,270 810,220 C860,170 880,110 870,50" className="accent" />
            
            <path d="M500,800 C470,820 430,850 400,880 C360,920 340,960 320,1000" />
            <path d="M500,800 C530,820 570,850 600,880 C640,920 660,960 680,1000" />
            <path d="M500,800 C500,830 490,880 470,920 C450,960 460,990 440,1050" strokeWidth="2" />
            <path d="M500,800 C500,830 510,880 530,920 C550,960 540,990 560,1050" strokeWidth="2" />
            <path d="M500,800 C460,830 400,870 350,910 C300,950 280,980 250,1050" className="accent" />
            <path d="M500,800 C540,830 600,870 650,910 C700,950 720,980 750,1050" className="accent" />
          </svg>
        </div>
        <div className="container">
          <div className="concept-grid">
            <div className="concept-text">
              <span className="italic-subtitle">L'Équilibre Parfait</span>
              <h2 className="section-title">L'Expérience Le Racine</h2>
              <p>Mêlant l'élégance contemporaine de Casablanca au charme intemporel des brasseries parisiennes, Le Racine est le lieu de rencontre des épicuriens. Notre palette sensorielle est dominée par des notes chaudes de bois sombre, des textures en velours rouge profond et des reflets dorés haut de gamme.</p>
              <p>Chaque plat raconte une histoire de fraîcheur, d'ingrédients locaux d'exception, et de savoir-faire rigoureux élaboré par nos chefs passionnés.</p>
              <button className="btn btn-green" onClick={onOpenModal}>Notre Table d'Hôtes</button>
            </div>
            <div className="concept-image-frame">
              <img 
                src="/assets/images/546277442_748113931427816_1789949569599807529_n.jpg" 
                alt="Intérieur élégant du Racine" 
                className="concept-image" 
              />
              <div className="leaf-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '32px', color: '#F9F6F0' }}>
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"></path>
                  <path d="M12 6a6 6 0 0 0-6 6M12 18a6 6 0 0 0 6-6"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Showcase Vibe Panels */}
      <section className="vibe-showcase" id="ambiance">
        <div className="vibe-panels">
          <div className="vibe-panel" onClick={() => handleNavClick('#menu', 'barMenu')}>
            <div className="vibe-panel-bg" style={{ backgroundImage: "url('/assets/images/leracine_10.jpg')" }}></div>
            <div className="vibe-panel-overlay"></div>
            <div className="vibe-panel-header">Matin & Déjeuner</div>
            <h3 className="vibe-panel-title">L'Énergie Lumineuse</h3>
            <p className="vibe-panel-desc">Des rendez-vous d'affaires stimulants aux pauses baristas ensoleillées sur notre terrasse végétale.</p>
          </div>
          <div className="vibe-panel" onClick={() => handleNavClick('#eveningSection', 'barHome')}>
            <div className="vibe-panel-bg" style={{ backgroundImage: "url('/assets/images/leracine_20.jpg')" }}></div>
            <div className="vibe-panel-overlay"></div>
            <div className="vibe-panel-header">Dîner & Lounge</div>
            <h3 className="vibe-panel-title">L'Ambiance Feutrée</h3>
            <p className="vibe-panel-desc">Sous nos suspensions dorées tridimensionnelles, la nuit s'installe au rythme de mélodies lounge sensuelles.</p>
          </div>
        </div>
      </section>

      {/* 5. Interactive Menu Section */}
      <section id="menu" className="menu-section">
        {/* Roots Backdrop: Central winding roots */}
        <div className="section-roots">
          <svg className="roots-svg" viewBox="0 0 1000 1200" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M500,0 C490,100 450,200 460,350 C470,500 530,650 510,800 C490,950 450,1100 450,1200" strokeWidth="2.5" />
            <path d="M500,0 C510,100 550,200 540,350 C530,500 470,650 490,800 C510,950 550,1100 550,1200" strokeWidth="2.5" />
            
            <path d="M460,350 C400,400 300,450 200,480 C100,510 50,550 20,600" />
            <path d="M540,350 C600,400 700,450 800,480 C900,510 950,550 980,600" />
            <path d="M510,800 C450,850 350,900 250,950 C150,1000 80,1050 50,1150" className="accent" />
            <path d="M490,800 C550,850 650,900 750,950 C850,1000 920,1050 950,1150" className="accent" />
            
            <path d="M465,150 C410,220 320,280 220,310 C120,340 60,380 30,450" />
            <path d="M535,150 C590,220 680,280 780,310 C880,340 940,380 970,450" />
          </svg>
        </div>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="italic-subtitle">Une Carte de Saison</span>
            <h2 className="section-title">Nos Signatures</h2>
          </div>

          <div className="menu-tabs">
            {['all', 'entrees', 'plats', 'desserts', 'boissons'].map(tab => (
              <button 
                key={tab}
                className={`menu-tab-btn ${activeMenuTab === tab ? 'active' : ''}`}
                onClick={() => setActiveMenuTab(tab)}
              >
                {tab === 'all' ? 'Tout' : tab === 'entrees' ? 'Entrées' : tab === 'plats' ? 'Plats' : tab === 'desserts' ? 'Desserts' : 'Boissons'}
              </button>
            ))}
          </div>

          <div className="menu-container" id="menuGrid">
            {filteredMenuItems.map(item => (
              <div 
                key={item.id}
                className={`menu-item ${greeting.itemId === item.id ? 'recommended' : ''}`}
                id={item.id}
              >
                <img src={item.image} alt={item.name} className="menu-item-img" />
                <div className="menu-item-info">
                  <div className="menu-item-header">
                    <h4 className="menu-item-name">{item.name}</h4>
                    <span className="menu-item-price">{item.price}</span>
                  </div>
                  <p className="menu-item-desc">{item.desc}</p>
                  {item.tags.length > 0 && (
                    <div className="menu-item-tags">
                      {item.tags.map(tag => (
                        <span 
                          key={tag}
                          className={`menu-tag ${tag === 'Signature' ? 'menu-tag-signature' : 'menu-tag-veg'}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="menu-book-cta" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <span className="italic-subtitle" style={{ display: 'block', marginBottom: '0.8rem' }}>Découvrez notre Menu en 3D</span>
            <Link to="/menu" className="btn btn-primary" id="viewBookMenuBtn" style={{ fontSize: '0.9rem', padding: '1rem 2.5rem' }}>
              Feuilleter la Carte Interactive
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Evening Dining Section */}
      <section id="eveningSection" className="evening-dining" ref={eveningRef}>
        {/* Roots Backdrop: Winding roots */}
        <div className="section-roots">
          <svg className="roots-svg" viewBox="0 0 1000 1000" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M450,0 C450,150 520,300 520,450 C520,600 470,750 480,900 C480,940 490,970 500,1000" strokeWidth="2.5" />
            <path d="M550,0 C550,150 480,300 480,450 C480,600 530,750 520,900 C520,940 510,970 500,1000" strokeWidth="2.5" />
            
            <path d="M520,450 C580,500 680,550 780,570 C880,590 940,650 970,750" />
            <path d="M480,450 C420,500 320,550 220,570 C120,590 60,650 30,750" />
            
            <path d="M495,200 C420,250 300,320 200,380 C100,440 50,520 20,600" className="accent" />
            <path d="M505,200 C580,250 700,320 800,380 C900,440 950,520 980,600" className="accent" />
          </svg>
        </div>
        <div className="container">
          <div className="evening-grid">
            <div className="evening-images">
              <div className="evening-img-col">
                <img src="/assets/images/leracine_93.jpg" alt="Lounge Soirée" className="evening-photo" />
                <img src="/assets/images/leracine_55.jpg" alt="Service Prestige" className="evening-photo" />
              </div>
              <div className="evening-img-col">
                <img src="/assets/images/leracine_23.jpg" alt="Menu du soir" className="evening-photo" />
                <img src="/assets/images/leracine_83.jpg" alt="Clientèle chic" className="evening-photo" />
              </div>
            </div>
            <div className="evening-text">
              <span className="italic-subtitle">Atmosphère Lounge</span>
              <h2 className="section-title">Les Soirées du Racine</h2>
              <p>Au crépuscule, Le Racine s'habille de lumières tamisées dorées. Notre programmation musicale accompagne avec élégance vos dîners tardifs et moments de partage.</p>
              <p>Profitez de nos cocktails créations revisitant de grands classiques sous l'inspiration locale de fruits frais et épices fines de Casablanca.</p>
              <button className="btn btn-gold" onClick={onOpenModal}>Réserver une Table ce Soir</button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Valet Service Simulator Section */}
      <section className="valet-section" id="valet">
        {/* Roots Backdrop: Deep root anchors */}
        <div className="section-roots">
          <svg className="roots-svg" viewBox="0 0 1000 800" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M500,0 C500,100 470,200 420,300 C370,400 300,480 200,550 C100,620 30,700 0,800" strokeWidth="3" />
            <path d="M500,0 C500,100 530,200 580,300 C630,400 700,480 800,550 C900,620 970,700 1000,800" strokeWidth="3" />
            
            <path d="M500,0 C490,150 490,300 460,420 C430,540 350,650 250,750" strokeWidth="2" />
            <path d="M500,0 C510,150 510,300 540,420 C570,540 650,650 750,750" strokeWidth="2" />
            
            <path d="M480,250 C410,320 300,400 200,480 C100,560 50,680 20,800" className="accent" />
            <path d="M520,250 C590,320 700,400 800,480 C900,560 950,680 980,800" className="accent" />
          </svg>
        </div>
        <div className="container">
          <div className="valet-grid">
            <div className="valet-text">
              <span className="italic-subtitle">Service Privé Exclusive</span>
              <h2 className="section-title">Voituriere de Prestige</h2>
              <p>Afin de vous garantir une arrivée paisible et un confort optimal au cœur du quartier Gauthier, Le Racine propose un service de voiturier haut de gamme gratuit pour l'ensemble de notre clientèle.</p>
              <p>Faites l'expérience de notre <strong>Ticket de Restitution Digital</strong> : enregistrez votre voiture dès votre arrivée, et demandez sa restitution en un clic directement depuis votre table.</p>
            </div>
            
            <div className="valet-ticket-card-wrapper">
              <div className="valet-ticket-card" id="valetTicketCard">
                
                {valetStep === 'form' && (
                  <form id="valetRegisterForm" onSubmit={handleValetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <h3 className="ticket-title" style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-heading)', fontSize: '1.1rem', letterSpacing: '0.1em', textAlign: 'center', marginBottom: '0.5rem' }}>
                      VOITURIER DIGITAL
                    </h3>
                    
                    <div className="valet-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-gold)', letterSpacing: '0.05em' }}>Marque & Modèle du véhicule</label>
                      <input 
                        type="text" 
                        id="valetCarModel"
                        value={valetCar.model}
                        onChange={(e) => setValetCar(prev => ({ ...prev, model: e.target.value }))}
                        required 
                        placeholder="Ex: Porsche 911, Audi Q8..." 
                        style={{ background: 'rgba(18, 14, 13, 0.4)', border: '1px solid rgba(197, 160, 89, 0.2)', padding: '0.8rem', color: '#F9F6F0' }}
                      />
                    </div>
                    
                    <div className="valet-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-gold)', letterSpacing: '0.05em' }}>Couleur du véhicule</label>
                      <select 
                        id="valetCarColor"
                        value={valetCar.color}
                        onChange={(e) => setValetCar(prev => ({ ...prev, color: e.target.value }))}
                        style={{ background: 'rgba(18, 14, 13, 0.4)', border: '1px solid rgba(197, 160, 89, 0.2)', padding: '0.8rem', color: '#F9F6F0' }}
                      >
                        <option value="Noir">Noir</option>
                        <option value="Blanc">Blanc</option>
                        <option value="Gris Métallisé">Gris Métallisé</option>
                        <option value="Bleu Nuit">Bleu Nuit</option>
                        <option value="Rouge Cherry">Rouge Cherry</option>
                      </select>
                    </div>
                    
                    <button type="submit" className="btn btn-gold" id="btnGenerateTicket" style={{ marginTop: '0.8rem' }}>Générer mon Ticket Digital</button>
                  </form>
                )}

                {valetStep !== 'form' && (
                  <div id="valetActiveTicket" style={{ display: 'block' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                      <span className="ticket-badge-gold">TICKET VOITURIER</span>
                      <span className="ticket-code-display" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold)', fontWeight: 600 }}>
                        {ticketNum}
                      </span>
                    </div>
                    
                    <div className="ticket-divider-line"></div>
                    
                    <div className="ticket-details">
                      <div className="ticket-detail-item">
                        <span>VÉHICULE</span>
                        <strong>{valetCar.model} ({valetCar.color})</strong>
                      </div>
                      <div className="ticket-detail-item">
                        <span>SERVICE</span>
                        <strong>PRESTIGE LOUNGE</strong>
                      </div>
                      <div className="ticket-detail-item">
                        <span>TARIF</span>
                        <strong>GRATUIT CLIENT</strong>
                      </div>
                    </div>
                    
                    <div className="ticket-divider-line"></div>
                    
                    <div className="ticket-qr-section">
                      <div className="ticket-qr-code">
                        <svg className="qr-svg" viewBox="0 0 100 100" stroke="#C5A059" strokeWidth="4">
                          <rect x="10" y="10" width="20" height="20" fill="none" />
                          <rect x="70" y="10" width="20" height="20" fill="none" />
                          <rect x="10" y="70" width="20" height="20" fill="none" />
                          <rect x="17" y="17" width="6" height="6" fill="#C5A059" />
                          <rect x="77" y="17" width="6" height="6" fill="#C5A059" />
                          <rect x="17" y="77" width="6" height="6" fill="#C5A059" />
                          <line x1="40" y1="20" x2="60" y2="20" strokeDasharray="5,5" />
                          <line x1="20" y1="40" x2="20" y2="60" strokeDasharray="5,5" />
                          <line x1="50" y1="40" x2="80" y2="40" strokeDasharray="5,5" />
                          <line x1="50" y1="60" x2="50" y2="90" strokeDasharray="5,5" />
                          <rect x="75" y="75" width="10" height="10" fill="#C5A059" />
                        </svg>
                      </div>
                      <div className="ticket-qr-info">
                        <p className="status-alert" id="valetStatusAlert">{valetStatus.alert}</p>
                        <p className="status-details" id="valetStatusDetails">{valetStatus.details}</p>
                      </div>
                    </div>

                    {valetStep === 'countdown' && (
                      <>
                        <div className="ticket-divider-line"></div>
                        <div className="ticket-timer-section">
                          <p className="timer-label">TEMPS D'ATTENTE ESTIMÉ</p>
                          <p className="timer-countdown" id="valetTimer">{formatTimer(timer)}</p>
                        </div>
                      </>
                    )}
                    
                    <button 
                      className="btn btn-gold-outline" 
                      id="btnRequestCar" 
                      onClick={valetStep === 'ready' ? () => setValetStep('form') : startValetRecovery}
                      disabled={valetStep === 'countdown'}
                      style={{ width: '100%', marginTop: '1.2rem', opacity: valetStep === 'countdown' ? 0.6 : 1 }}
                    >
                      {valetStep === 'ticket' ? 'Demander mon véhicule en 1 clic' : valetStep === 'countdown' ? 'Récupération en cours...' : 'Nouvel Enregistrement Voiturier'}
                    </button>
                  </div>
                )}
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Photo Gallery CTA */}
      <section style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)', padding: '6rem 2rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="italic-subtitle">Immersion Visuelle</span>
          <h2 className="section-title" style={{ marginBottom: '2.5rem' }}>Galerie de Photos</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 3rem', color: 'var(--text-secondary)' }}>Parcourez les moments précieux capturés dans notre restaurant : de la finesse des assiettes dressées avec précision aux décors majestueux de notre salle lounge.</p>
          <Link to="/gallery" className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '1rem 2.5rem' }}>
            Feuilleter la Galerie Interactive
          </Link>
        </div>
      </section>
    </>
  )
}

export default HomePage
