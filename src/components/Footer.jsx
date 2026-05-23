import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function Footer() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavClick = (anchorId) => {
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
    <footer id="contact">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-info-col">
            <div className="footer-info-logo">
              <img src="/assets/logo.jpg" alt="Le Racine Logo" />
              <span>LE RACINE</span>
            </div>
            <p>Une brasserie moderne haut de gamme dans le quartier chic de Gauthier/Racine à Casablanca. L'adresse idéale des professionnels et amateurs de raffinement.</p>
            <p>
              <strong>Adresse :</strong> 52 Rue Oumayma Essayeh, Casablanca 20250<br />
              <strong>Tél :</strong> +212 8 08 56 92 68<br />
              <strong>Instagram :</strong> <a href="https://www.instagram.com/leracineofficial/" target="_blank" rel="noopener noreferrer" id="instaLink" style={{ color: 'var(--color-gold)' }}>@leracineofficial</a>
            </p>
          </div>
          
          <div className="footer-links-col">
            <h4>Navigation</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} id="footLnkHome">
                  Accueil
                </Link>
              </li>
              <li>
                <a href="#experience" onClick={(e) => { e.preventDefault(); handleNavClick('#experience'); }} id="footLnkExp">
                  L'Expérience
                </a>
              </li>
              <li>
                <Link to="/menu" id="footLnkMenu">Notre Carte</Link>
              </li>
              <li>
                <a href="#ambiance" onClick={(e) => { e.preventDefault(); handleNavClick('#ambiance'); }} id="footLnkAmbiance">
                  Heures & Ambiances
                </a>
              </li>
              <li>
                <Link to="/gallery" id="footLnkGal">Galerie Photos</Link>
              </li>
            </ul>
          </div>
          
          <div className="footer-map-col">
            <h4>Localisation</h4>
            <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.8rem' }}>Retrouvez-nous facilement au cœur du triangle d'or de Casablanca.</p>
            <div className="footer-map-container">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.834444583196!2d-7.6410203847972745!3d33.588458080734066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d37a12137183%3A0xd00a5758a847e75b!2sLe%20Racine!5e0!3m2!1sfr!2sma!4v1680000000000!5m2!1sfr!2sma" 
                allowFullScreen="" 
                loading="lazy" 
                title="Google Maps Location"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0, width: '100%', height: '100%' }}>
              </iframe>
            </div>
          </div>
          
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 Le Racine Casablanca. Tous droits réservés. Affilié au groupe Le Beaubourg.</p>
          <div className="footer-socials">
            <a href="https://www.instagram.com/leracineofficial/" target="_blank" rel="noopener noreferrer" id="footInstaBtn">Instagram</a>
            <span>·</span>
            <a href="https://maps.google.com/?q=Le+Racine+Casablanca" target="_blank" rel="noopener noreferrer" id="footMapsBtn">Google Maps</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
