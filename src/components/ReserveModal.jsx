import React, { useState, useEffect } from 'react'

function ReserveModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    area: 'salon'
  })
  const [isSuccess, setIsSuccess] = useState(false)
  const [minDate, setMinDate] = useState('')

  useEffect(() => {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0]
    setMinDate(today)
  }, [])

  useEffect(() => {
    if (!isOpen) {
      // Reset form on close after animation completes
      const timer = setTimeout(() => {
        setFormData({
          name: '',
          phone: '',
          date: '',
          time: '',
          guests: '2',
          area: 'salon'
        })
        setIsSuccess(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleInputChange = (e) => {
    const { id, value } = e.target
    // Map element IDs to form data keys
    const keyMap = {
      resName: 'name',
      resPhone: 'phone',
      resDate: 'date',
      resTime: 'time',
      resGuests: 'guests'
    }
    setFormData(prev => ({
      ...prev,
      [keyMap[id] || id]: value
    }))
  }

  const handleAreaSelect = (areaValue) => {
    setFormData(prev => ({ ...prev, area: areaValue }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Reservation Submitted:', formData)
    setIsSuccess(true)
  }

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} id="reserveModal" onClick={(e) => {
      if (e.target.id === 'reserveModal') onClose()
    }}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Fermer">&times;</button>
        
        {!isSuccess ? (
          <>
            <h3 className="modal-title">RÉSERVER UNE TABLE</h3>
            <form className="reserve-form" id="reserveForm" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="resName">Nom complet</label>
                  <input 
                    type="text" 
                    id="resName" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                    placeholder="Votre nom" 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="resPhone">Téléphone</label>
                  <input 
                    type="tel" 
                    id="resPhone" 
                    value={formData.phone}
                    onChange={handleInputChange}
                    required 
                    placeholder="+212 ..." 
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="resDate">Date</label>
                  <input 
                    type="date" 
                    id="resDate" 
                    min={minDate}
                    value={formData.date}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="resTime">Heure</label>
                  <select 
                    id="resTime" 
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Sélectionnez</option>
                    <option value="08:00">08:00 (Petit-déjeuner)</option>
                    <option value="10:00">10:00 (Matinée)</option>
                    <option value="12:30">12:30 (Déjeuner d'affaires)</option>
                    <option value="13:30">13:30 (Déjeuner)</option>
                    <option value="16:00">16:00 (Après-midi)</option>
                    <option value="19:30">19:30 (Dîner Lounge)</option>
                    <option value="20:30">20:30 (Dîner Lounge)</option>
                    <option value="21:30">21:30 (Soirée)</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group" style={{ gridColumn: 'span 1' }}>
                  <label htmlFor="resGuests">Personnes</label>
                  <select 
                    id="resGuests" 
                    value={formData.guests}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="1">1 Personne</option>
                    <option value="2">2 Personnes</option>
                    <option value="3">3 Personnes</option>
                    <option value="4">4 Personnes</option>
                    <option value="5">5 Personnes</option>
                    <option value="6">6+ Personnes</option>
                  </select>
                </div>
              </div>

              {/* Seating Choice Grid */}
              <div className="form-row" style={{ marginTop: '0.5rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label style={{ marginBottom: '0.8rem', display: 'block' }}>Espace Souhaité</label>
                  <div className="seating-selector-grid">
                    {/* Salon Card */}
                    <div 
                      className={`seating-card ${formData.area === 'salon' ? 'selected' : ''}`}
                      onClick={() => handleAreaSelect('salon')}
                      id="seatCardSalon"
                    >
                      <div className="seating-card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"></path>
                          <path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5H3v5z"></path>
                          <path d="M2 18v2M22 18v2M12 9v9"></path>
                        </svg>
                      </div>
                      <div className="seating-card-title">Salon Intérieur</div>
                      <div className="seating-card-desc">Velours chic, lumière dorée tamisée</div>
                    </div>
                    
                    {/* Terrasse Card */}
                    <div 
                      className={`seating-card ${formData.area === 'terrasse' ? 'selected' : ''}`}
                      onClick={() => handleAreaSelect('terrasse')}
                      id="seatCardTerrasse"
                    >
                      <div className="seating-card-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"></path>
                          <path d="M12 2v20M2 12h20M7 7l10 10M7 17L17 7"></path>
                        </svg>
                      </div>
                      <div className="seating-card-title">Terrasse Végétale</div>
                      <div className="seating-card-desc">Nature verdoyante, air frais, détente</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ marginTop: '1.5rem' }} 
                id="submitResBtn"
              >
                Confirmer la Réservation
              </button>
            </form>
          </>
        ) : (
          <div className="reserve-success" id="reserveSuccess" style={{ display: 'block' }}>
            <svg viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <h4>RÉSERVATION VALIDÉE</h4>
            <p>Merci pour votre réservation. Un SMS de confirmation vient de vous être envoyé. Nous serons ravis de vous accueillir chez <strong>Le Racine</strong>.</p>
            <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={onClose}>Fermer</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReserveModal
