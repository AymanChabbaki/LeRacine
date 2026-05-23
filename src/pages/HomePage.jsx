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

          <span className="hero-tagline">Brasserie · Café · Lounge</span>
          <h1 className="hero-title">LE RACINE</h1>
          <p className="hero-meta">Un sanctuaire culinaire au cœur de Casablanca</p>
          <button className="btn btn-primary" onClick={onOpenModal}>Réserver une Table</button>
        </div>
      </section>

      {/* 3. L'Expérience Section */}
      <section id="experience">
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
