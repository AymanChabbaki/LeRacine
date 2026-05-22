/* ==========================================================================
   LE RACINE — DYNAMIC INTERACTIVE CORE SCRIPT
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Page Load Animation
    const hero = document.getElementById('hero');
    if (hero) {
        setTimeout(() => {
            hero.classList.add('loaded');
        }, 150);
    }
    // 2. Mobile Menu Toggle (Traditional top menu fallback)
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            const spans = mobileToggle.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
    // 3. Floating Manual Theme Switcher & Scroll Toggle Override
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    let isManualTheme = false; // Flag to stop Intersection Observer overriding user's choice
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            isManualTheme = true; // User took manual control
            document.body.classList.toggle('theme-dark');
            console.log("Thème changé manuellement par l'utilisateur.");
        });
    }
    // 4. Scroll Progress Gold Line Tracing & Sticky Header
    const scrollLine = document.getElementById('scrollLine');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        if (scrollLine) {
            scrollLine.style.height = `${scrollPercent}%`;
        }
        
        const header = document.getElementById('header');
        if (header) {
            if (scrollTop > 50) {
                header.style.padding = '0.5rem 0';
                header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.08)';
            } else {
                header.style.padding = '1rem 0';
                header.style.boxShadow = 'none';
            }
        }
        // Sync Bottom Tab Bar Active State on scroll
        if (window.innerWidth <= 768) {
            syncBottomBarOnScroll();
        }
    });
    // 5. Intelligent Time-of-Day Welcome & Menu Highlight
    const timeGreetingWidget = document.getElementById('timeGreetingWidget');
    if (timeGreetingWidget) {
        const currentHour = new Date().getHours();
        let greetingText = "Bienvenue au Racine";
        let recommendationText = "Découvrez nos créations exclusives";
        let recommendedItemId = "";
        if (currentHour >= 7 && currentHour < 11.5) {
            // Morning
            greetingText = "Bon Matin";
            recommendationText = "Commencez la journée avec notre Pain Perdu de Luxe & Café de Spécialité";
            recommendedItemId = "menu-item-brioche";
        } else if (currentHour >= 11.5 && currentHour < 17.5) {
            // Afternoon / Power Lunch
            greetingText = "Bon Après-midi";
            recommendationText = "Pour votre déjeuner, nous vous conseillons notre Filet de Bœuf & Frites Maison";
            recommendedItemId = "menu-item-filet";
        } else if (currentHour >= 17.5 && currentHour < 23) {
            // Evening / Dinner Lounge
            greetingText = "Bonne Soirée";
            recommendationText = "Détendez-vous ce soir autour de notre Fondant au Chocolat & Glace Vanille";
            recommendedItemId = "menu-item-fondant";
        } else {
            // Late Night
            greetingText = "Bonne Nuit";
            recommendationText = "Réservez dès maintenant votre table pour demain matin";
            recommendedItemId = "menu-item-cafe";
        }
        // Update greeting text
        const textSpan = timeGreetingWidget.querySelector('.greeting-text');
        const recSpan = timeGreetingWidget.querySelector('.greeting-rec');
        if (textSpan) textSpan.innerText = greetingText;
        if (recSpan) recSpan.innerText = recommendationText;
        // Highlight recommended item in the menu
        if (recommendedItemId) {
            const item = document.getElementById(recommendedItemId);
            if (item) {
                item.classList.add('recommended');
            }
        }
    }
    // 6. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('active'));
    }
    // 7. Day / Night Theme Shift on Scroll (Automatic theme observer)
    const eveningSection = document.getElementById('eveningSection');
    
    if ('IntersectionObserver' in window && eveningSection) {
        const themeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Only shift automatically if the user hasn't toggled it manually
                if (!isManualTheme) {
                    if (entry.isIntersecting) {
                        document.body.classList.add('theme-dark');
                    } else {
                        const rect = entry.boundingClientRect;
                        if (rect.top > 0) {
                            document.body.classList.remove('theme-dark');
                        }
                    }
                }
            });
        }, {
            threshold: 0.25
        });
        
        themeObserver.observe(eveningSection);
    }
    // 8. Interactive Menu Filtering
    const menuTabButtons = document.querySelectorAll('.menu-tab-btn');
    const menuGrid = document.getElementById('menuGrid');
    const menuItems = document.querySelectorAll('.menu-item');
    if (menuTabButtons && menuGrid) {
        menuTabButtons.forEach(button => {
            button.addEventListener('click', () => {
                menuTabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const category = button.getAttribute('data-category');
                menuGrid.classList.add('fade-out');
                setTimeout(() => {
                    menuItems.forEach(item => {
                        const itemCategory = item.getAttribute('data-category');
                        if (category === 'all' || itemCategory === category) {
                            item.style.display = 'flex';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                    menuGrid.classList.remove('fade-out');
                }, 400);
            });
        });
    }
    // 9. Interactive Reservation Modal
    const reserveButtons = document.querySelectorAll('.btn-reserve');
    const reserveModal = document.getElementById('reserveModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const reserveForm = document.getElementById('reserveForm');
    const reserveSuccess = document.getElementById('reserveSuccess');
    const successCloseBtn = document.getElementById('successCloseBtn');
    // Set minimum date in form to today
    const dateInput = document.getElementById('resDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    const openModal = () => {
        if (reserveModal) {
            reserveModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Stop background scroll
        }
    };
    const closeModal = () => {
        if (reserveModal) {
            reserveModal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Resume scroll
            
            setTimeout(() => {
                if (reserveForm && reserveSuccess) {
                    reserveForm.style.display = 'flex';
                    reserveSuccess.style.display = 'none';
                    reserveForm.reset();
                    
                    // Reset seating visual selector to default "salon"
                    document.querySelectorAll('.seating-card').forEach(c => c.classList.remove('selected'));
                    const defaultCard = document.getElementById('seatCardSalon');
                    if (defaultCard) defaultCard.classList.add('selected');
                    const hiddenAreaInput = document.getElementById('resArea');
                    if (hiddenAreaInput) hiddenAreaInput.value = 'salon';
                }
            }, 500);
        }
    };
    if (reserveButtons) {
        reserveButtons.forEach(btn => btn.addEventListener('click', openModal));
    }
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', closeModal);
    }
    if (reserveModal) {
        reserveModal.addEventListener('click', (e) => {
            if (e.target === reserveModal) {
                closeModal();
            }
        });
    }
    // 10. Modern Visual Seating Selector Card Logic
    const seatingCards = document.querySelectorAll('.seating-card');
    const hiddenAreaInput = document.getElementById('resArea');
    if (seatingCards && hiddenAreaInput) {
        seatingCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove selection from all cards
                seatingCards.forEach(c => c.classList.remove('selected'));
                // Select clicked card
                card.classList.add('selected');
                // Update hidden input value
                const val = card.getAttribute('data-value');
                hiddenAreaInput.value = val;
                
                console.log("Espace de table sélectionné :", val);
            });
        });
    }
    // 11. Mobile Bottom Navigation Bar Action Hooks
    const bottomBarItems = document.querySelectorAll('.mobile-bottom-bar .bottom-bar-item');
    if (bottomBarItems) {
        bottomBarItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const href = item.getAttribute('href');
                // Special Case: "Réserver" button opens the modal instantly!
                if (href === '#reserve') {
                    e.preventDefault();
                    openModal();
                    return;
                }
                // Normal navigation tab highlight
                bottomBarItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }
    // Dynamically update bottom bar active status based on which section is scrolled into
    function syncBottomBarOnScroll() {
        const sections = [
            { id: 'hero', tabId: 'barHome' },
            { id: 'menu', tabId: 'barMenu' },
            { id: 'contact', tabId: 'barContact' }
        ];
        let currentActiveTab = 'barHome';
        const scrollPosition = window.scrollY + 200; // Offset for accuracy
        sections.forEach(section => {
            const element = document.getElementById(section.id);
            if (element) {
                const top = element.offsetTop;
                const height = element.offsetHeight;
                if (scrollPosition >= top && scrollPosition < top + height) {
                    currentActiveTab = section.tabId;
                }
            }
        });
        // Apply active class
        bottomBarItems.forEach(item => {
            if (item.id === currentActiveTab) {
                item.classList.add('active');
            } else if (item.id !== 'barReserve') { // Keep reserve circle unaffected
                item.classList.remove('active');
            }
        });
    }
    // 12. Handle Reservation Form Submission
    if (reserveForm && reserveSuccess) {
        reserveForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('resName').value;
            const phone = document.getElementById('resPhone').value;
            const date = document.getElementById('resDate').value;
            const time = document.getElementById('resTime').value;
            const guests = document.getElementById('resGuests').value;
            const area = document.getElementById('resArea').value;
            
            console.log('Submission Success:', { name, phone, date, time, guests, area });
 
            const submitBtn = reserveForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'TRAITEMENT EN COURS...';
            submitBtn.disabled = true;
 
            setTimeout(() => {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                
                reserveForm.style.display = 'none';
                reserveSuccess.style.display = 'block';
            }, 1200);
        });
    }
    // 13. Service Voiturier (Valet) Simulator Logic
    const btnGenerateTicket = document.getElementById('btnGenerateTicket');
    const btnRequestCar = document.getElementById('btnRequestCar');
    const valetCarModel = document.getElementById('valetCarModel');
    const valetCarColor = document.getElementById('valetCarColor');
    
    const ticketBodyInitial = document.getElementById('ticketBodyInitial');
    const ticketBodyActive = document.getElementById('ticketBodyActive');
    const valetTicketCard = document.getElementById('valetTicketCard');
    
    const ticketNumberDisplay = document.getElementById('ticketNumberDisplay');
    const ticketCarDisplay = document.getElementById('ticketCarDisplay');
    const ticketStatusBadge = document.getElementById('ticketStatusBadge');
    
    const ticketStatusAlert = document.getElementById('ticketStatusAlert');
    const ticketStatusDetails = document.getElementById('ticketStatusDetails');
    const ticketTimerSection = document.getElementById('ticketTimerSection');
    const timerCountdown = document.getElementById('timerCountdown');
    
    let countdownInterval = null;
    if (btnGenerateTicket && btnRequestCar) {
        btnGenerateTicket.addEventListener('click', () => {
            const carModelValue = valetCarModel.value.trim();
            if (!carModelValue) {
                valetCarModel.style.borderColor = '#4A0E17';
                valetCarModel.placeholder = 'Veuillez saisir votre véhicule !';
                setTimeout(() => {
                    valetCarModel.style.borderColor = '';
                }, 2000);
                return;
            }
            
            // Random ticket number & layout transition
            const randomId = Math.floor(1000 + Math.random() * 9000);
            const carColorValue = valetCarColor.value;
            
            ticketNumberDisplay.innerText = `#RAC-${randomId}`;
            ticketCarDisplay.innerText = `${carModelValue} (${carColorValue})`;
            
            // Update status badge to parked
            ticketStatusBadge.innerText = 'Stationné';
            ticketStatusBadge.className = 'ticket-status-badge status-parked';
            
            // Transition form to ticket face
            ticketBodyInitial.style.display = 'none';
            ticketBodyActive.style.display = 'flex';
            valetTicketCard.classList.add('active-glow');
            
            console.log('Valet Ticket generated:', { id: randomId, car: carModelValue, color: carColorValue });
        });
        
        btnRequestCar.addEventListener('click', () => {
            // Check if we are resetting the simulation (play again)
            if (btnRequestCar.classList.contains('btn-reset')) {
                // Reset card
                valetCarModel.value = '';
                valetCarColor.selectedIndex = 0;
                ticketBodyActive.style.display = 'none';
                ticketBodyInitial.style.display = 'flex';
                valetTicketCard.classList.remove('active-glow');
                valetTicketCard.style.boxShadow = '';
                valetTicketCard.style.borderColor = '';
                ticketTimerSection.style.display = 'none';
                
                ticketStatusBadge.innerText = 'En attente';
                ticketStatusBadge.className = 'ticket-status-badge status-waiting';
                
                // Reset button styles
                btnRequestCar.innerText = 'Demander mon véhicule en 1 clic';
                btnRequestCar.className = 'btn btn-gold';
                btnRequestCar.classList.remove('btn-reset');
                btnRequestCar.disabled = false;
                
                ticketStatusAlert.innerText = 'Véhicule Stationné';
                ticketStatusDetails.innerText = 'Emplacement Réservé A-14';
                return;
            }
            // Start countdown
            btnRequestCar.disabled = true;
            btnRequestCar.innerText = 'Restitution en cours...';
            
            ticketStatusBadge.innerText = 'En route';
            ticketStatusBadge.className = 'ticket-status-badge status-progress';
            
            ticketStatusAlert.innerText = 'Restitution initiée';
            ticketStatusDetails.innerText = 'Préparation du véhicule...';
            ticketTimerSection.style.display = 'flex';
            
            let timeLeft = 180; // 180 simulated seconds (3:00)
            timerCountdown.innerText = '03:00';
            
            if (countdownInterval) clearInterval(countdownInterval);
            
            // Accelerated speed: 1 simulated second = 100ms (10x speed, 18 real seconds total)
            countdownInterval = setInterval(() => {
                timeLeft--;
                
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerCountdown.innerText = `0${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
                
                // Dynamic phases based on time remaining
                if (timeLeft === 120) {
                    ticketStatusDetails.innerText = 'Restitution en cours...';
                    ticketStatusAlert.innerText = 'En mouvement';
                } else if (timeLeft === 60) {
                    ticketStatusDetails.innerText = 'Approche du hall d\'accueil...';
                    ticketStatusAlert.innerText = 'Arrivée imminente';
                } else if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    
                    // Final State: Vehicle Ready!
                    ticketStatusBadge.innerText = 'Prêt';
                    ticketStatusBadge.className = 'ticket-status-badge status-ready';
                    
                    ticketStatusAlert.innerText = 'Véhicule Prêt !';
                    ticketStatusDetails.innerText = 'Prêt à la dépose devant l\'entrée.';
                    
                    // Allow resetting the simulation
                    btnRequestCar.innerText = 'Recommencer la simulation';
                    btnRequestCar.className = 'btn btn-primary btn-reset';
                    btnRequestCar.disabled = false;
                    
                    // Visual pulse glow
                    valetTicketCard.style.boxShadow = '0 0 40px rgba(40, 167, 69, 0.4), 0 15px 35px rgba(0, 0, 0, 0.3)';
                    valetTicketCard.style.borderColor = '#28a745';
                    
                    // Play a soft vibration if supported
                    if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
                }
            }, 100);
        });
    }
});