/**
 * Le Racine — Interactive Photo Album Engine
 * Coordinates 3D flipping on desktop and flat sliding on mobile for the Gallery.
 * Includes dynamic DOM rendering, category filtering, and image lazy loading.
 */
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const bookContainer = document.getElementById('bookContainer');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const tabs = document.querySelectorAll('#galleryCategoryTabs .book-tab');
    const mobileIndicators = document.getElementById('mobileIndicators');
    // State Variables
    let allImages = [];
    let filteredImages = [];
    let activePage = 0; // Current active page index (0 to totalPages-1)
    let currentSheet = 0; // Current desktop sheet (0 to totalSheets-1)
    let isMobile = window.innerWidth <= 768;
    let totalSheets = 0;
    let totalPages = 0;
    // Initialize from global window.galleryImages
    if (window.galleryImages && Array.isArray(window.galleryImages)) {
        allImages = window.galleryImages;
        switchCategory('all');
    } else {
        console.error('Failed to load gallery metadata: window.galleryImages is undefined or not an array');
        bookContainer.innerHTML = `
            <div class="gallery-error">
                <p>Une erreur est survenue lors du chargement de la galerie.</p>
            </div>
        `;
    }
    // Switch Category & Rebuild Book
    function switchCategory(category) {
        if (category === 'all') {
            filteredImages = [...allImages];
        } else {
            filteredImages = allImages.filter(img => img.category === category);
        }
        // Reset state
        activePage = 0;
        currentSheet = 0;
        // Build the Book DOM
        buildBookDOM(category);
        // Initialize indicators & update layout
        initMobileIndicators();
        updateBook();
    }
    // Build Book DOM elements dynamically
    function buildBookDOM(categoryName) {
        bookContainer.innerHTML = '';
        const N = filteredImages.length;
        if (N === 0) {
            bookContainer.innerHTML = '<div class="gallery-empty"><p>Aucune photo disponible dans cette catégorie.</p></div>';
            return;
        }
        // Determine total sheets and pages
        const isNEven = (N % 2 === 0);
        totalSheets = Math.floor(N / 2) + 2;
        totalPages = totalSheets * 2;
        let sheetHTML = '';
        // Category label helper
        const categoryLabels = {
            all: 'Collection Complète',
            ambiance: 'Ambiance & Décor',
            plats: 'Gastronomie & Plats',
            boissons: 'Bar & Boissons'
        };
        const activeLabel = categoryLabels[categoryName] || 'Galerie';
        for (let s = 0; s < totalSheets; s++) {
            let frontFaceHTML = '';
            let backFaceHTML = '';
            // --- SHEET 0: Cover & Page 1 ---
            if (s === 0) {
                // FRONT (Page 0): Album Front Cover
                frontFaceHTML = `
                    <div class="page-face front-face cover-front" id="page0">
                        <div class="cover-border">
                            <div class="cover-content">
                                <div class="cover-logo-wrapper">
                                    <img src="assets/logo.jpg" alt="Le Racine Logo" class="cover-logo">
                                </div>
                                <span class="cover-subtitle">ALBUM DE PRESTIGE</span>
                                <div class="gold-separator"></div>
                                <h1 class="cover-title">GALERIE</h1>
                                <span class="cover-category-badge">${activeLabel}</span>
                                <div class="gold-separator"></div>
                                <p class="cover-address">Le Racine · Casablanca</p>
                                <span class="cover-footer">Feuilleter l'album</span>
                                <div class="flip-hint-desktop">Cliquez pour ouvrir &rarr;</div>
                            </div>
                        </div>
                    </div>
                `;
                // BACK (Page 1): Image 1
                const img = filteredImages[0];
                backFaceHTML = createImagePageHTML(img, 1, 'back-face');
            }
            // --- LAST SHEET: Back Cover & Empty Behind ---
            else if (s === totalSheets - 1) {
                // FRONT (Page totalPages - 2): Album Back Cover (matching menu book style)
                frontFaceHTML = `
                    <div class="page-face front-face cover-back" id="page${totalPages - 2}">
                        <div class="cover-border">
                            <div class="cover-content">
                                <div class="cover-logo-wrapper">
                                    <img src="assets/logo.jpg" alt="Le Racine Logo" class="cover-logo">
                                </div>
                                <span class="cover-subtitle">Le Racine Casablanca</span>
                                <div class="gold-separator"></div>
                                
                                <p class="cover-back-info">
                                    <strong>Adresse :</strong> 52 Rue Oumayma Essayeh, Casablanca<br>
                                    <strong>Téléphone :</strong> +212 8 08 56 92 68<br>
                                    <strong>Instagram :</strong> @leracineofficial
                                </p>
                                
                                <div class="gold-separator"></div>
                                <p class="cover-back-thankyou">Merci pour votre visite et à très bientôt.</p>
                                
                                <a href="index.html" class="btn btn-primary" style="margin-top: 2rem;">Retour à l'Accueil</a>
                            </div>
                        </div>
                    </div>
                `;
                // BACK (Page totalPages - 1): Empty solid dark background (matching cover-back-behind)
                backFaceHTML = `
                    <div class="page-face back-face cover-back-behind" id="page${totalPages - 1}">
                        <div class="page-inner" style="background-color: #0c0908; border-color: transparent; margin: 0; height: 100%;">
                            <!-- Solid back edge -->
                        </div>
                    </div>
                `;
            }
            // --- SECOND-TO-LAST SHEET ---
            else if (s === totalSheets - 2) {
                // FRONT (Page 2*s): Image 2*s
                const frontPageIndex = 2 * s;
                const frontImgIndex = frontPageIndex - 1;
                const img = filteredImages[frontImgIndex];
                frontFaceHTML = createImagePageHTML(img, frontPageIndex, 'front-face');
                // BACK (Page 2*s + 1): Image N (if N is odd) or Blank Stamp Page (if N is even)
                const backPageIndex = 2 * s + 1;
                if (!isNEven) {
                    const imgBack = filteredImages[N - 1];
                    backFaceHTML = createImagePageHTML(imgBack, backPageIndex, 'back-face');
                } else {
                    // Blank stamp filler page
                    backFaceHTML = `
                        <div class="page-face back-face paper-texture" id="page${backPageIndex}">
                            <div class="page-inner blank-page">
                                <div class="blank-logo-stamp">
                                    <img src="assets/logo.jpg" alt="Le Racine Stamp">
                                </div>
                                <p class="blank-stamp-text">Le Racine Casablanca</p>
                                <span class="page-number">${backPageIndex}</span>
                            </div>
                        </div>
                    `;
                }
            }
            // --- INTERMEDIATE SHEETS ---
            else {
                // Front page index = 2 * s
                const frontPageIndex = 2 * s;
                const frontImg = filteredImages[frontPageIndex - 1];
                frontFaceHTML = createImagePageHTML(frontImg, frontPageIndex, 'front-face');
                // Back page index = 2 * s + 1
                const backPageIndex = 2 * s + 1;
                const backImg = filteredImages[backPageIndex - 1];
                backFaceHTML = createImagePageHTML(backImg, backPageIndex, 'back-face');
            }
            // Create sheet container
            const sheetDiv = document.createElement('div');
            sheetDiv.classList.add('book-sheet');
            sheetDiv.id = `sheet${s}`;
            // Set styles for desktop 3D stacking order
            sheetDiv.style.zIndex = totalSheets - s;
            sheetDiv.innerHTML = frontFaceHTML + backFaceHTML;
            bookContainer.appendChild(sheetDiv);
        }
        // Bind desktop click-to-flip events to the newly created sheets
        bindSheetClickEvents();
    }
    // Helper to generate the image page HTML
    function createImagePageHTML(imgData, pageNum, faceClass) {
        const categoriesFr = {
            ambiance: 'Cadre & Ambiance',
            plats: 'Saveurs Gastronomiques',
            boissons: 'Bar & Barista'
        };
        const cap = categoriesFr[imgData.category] || 'Collection Racine';
        return `
            <div class="page-face ${faceClass} paper-texture" id="page${pageNum}">
                <div class="page-inner gallery-page-inner">
                    <span class="gallery-page-header">Le Racine Casablanca</span>
                    
                    <div class="gallery-photo-frame">
                        <div class="photo-spinner"></div>
                        <img class="gallery-photo" data-src="${imgData.src}" alt="${cap}" onload="this.previousElementSibling.remove();">
                    </div>
                    
                    <div class="gallery-photo-caption">${cap}</div>
                    <span class="page-number">${pageNum}</span>
                </div>
            </div>
        `;
    }
    // Bind flip events to sheets (Desktop only)
    function bindSheetClickEvents() {
        const sheets = document.querySelectorAll('.book-sheet');
        sheets.forEach((sheet, idx) => {
            sheet.addEventListener('click', (e) => {
                // Ignore clicks on buttons/links
                if (e.target.closest('a') || e.target.closest('button')) return;
                if (isMobile) return;
                if (idx < currentSheet) {
                    // Clicked left side -> Flip backward
                    activePage = idx === 0 ? 0 : (idx - 1) * 2 + 1;
                    updateBook();
                } else if (idx === currentSheet) {
                    // Clicked right side -> Flip forward
                    activePage = idx * 2 + 1;
                    updateBook();
                }
            });
        });
    }
    // Initialize Mobile Navigation Dots
    function initMobileIndicators() {
        mobileIndicators.innerHTML = '';
        if (totalPages === 0) return;
        for (let i = 0; i < totalPages; i++) {
        // Loop up to totalPages - 2 (so that the empty back face page is excluded)
        for (let i = 0; i < totalPages - 1; i++) {
            const dot = document.createElement('div');
            dot.classList.add('indicator-dot');
            if (i === activePage) dot.classList.add('active');
        const sheets = document.querySelectorAll('.book-sheet');
        if (sheets.length === 0) return;
        // Double check bounds
        activePage = Math.max(0, Math.min(totalPages - 1, activePage));
        // Double check bounds (cap activePage at totalPages - 2, which is the Back Cover)
        activePage = Math.max(0, Math.min(totalPages - 2, activePage));
        currentSheet = getSheetForPage(activePage);
        // Update Lazy Loading first
        updateLazyLoading();
        if (isMobile) {
            // --- MOBILE FLAT CARD SLIDER ---
            sheets.forEach(sheet => {
                sheet.style.zIndex = '';
                sheet.classList.remove('flipped');
            });
            const pageFaces = document.querySelectorAll('.page-face');
            pageFaces.forEach((face) => {
                const faceIdStr = face.getAttribute('id');
                const idx = parseInt(faceIdStr.replace('page', ''), 10);
                face.style.transform = `translateX(${(idx - activePage) * 100}%)`;
            });
            // Update mobile indicators
            const dots = mobileIndicators.querySelectorAll('.indicator-dot');
            dots.forEach((dot, idx) => {
                if (idx === activePage) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            // Disable/enable arrows
            prevBtn.disabled = activePage === 0;
            nextBtn.disabled = activePage === totalPages - 1;
            nextBtn.disabled = activePage === totalPages - 2;
        } else {
            // --- DESKTOP 3D FLIPBOOK ---
            const pageFaces = document.querySelectorAll('.page-face');
            pageFaces.forEach(face => {
                face.style.transform = '';
            });
            sheets.forEach((sheet, idx) => {
                if (idx < currentSheet) {
                    sheet.classList.add('flipped');
                    sheet.style.zIndex = idx + 1;
                } else {
                    sheet.classList.remove('flipped');
                    sheet.style.zIndex = totalSheets - idx;
                }
            });
            prevBtn.disabled = currentSheet === 0;
            nextBtn.disabled = currentSheet === totalSheets - 1;
        }
    }
    // Navigation triggers
    function navigateNext() {
        if (isMobile) {
            if (activePage < totalPages - 1) {
            if (activePage < totalPages - 2) {
                activePage++;
                updateBook();
            }
        } else {
            if (currentSheet < totalSheets - 1) {
                currentSheet++;
                activePage = (currentSheet - 1) * 2 + 1;
                updateBook();
            }
        }
    }
    // Navigation triggers
    function navigatePrev() {
        if (isMobile) {
            if (activePage > 0) {
                activePage--;
                updateBook();
            }
        } else {
            if (currentSheet > 0) {
                currentSheet--;
                activePage = currentSheet === 0 ? 0 : (currentSheet - 1) * 2 + 1;
                updateBook();
            }
        }
    }
    // Event Listeners for Navigation Buttons
    nextBtn.addEventListener('click', navigateNext);
    prevBtn.addEventListener('click', navigatePrev);
    // Keyboard Event Listener
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            navigateNext();
        } else if (e.key === 'ArrowLeft') {
            navigatePrev();
        }
    });
    // Event Listeners for Category Tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('active')) return;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const category = tab.getAttribute('data-category');
            switchCategory(category);
            
            // Scroll active tab into view on mobile
            tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
    });
    // Swipe Gesture Support
    let touchStartX = 0;
    let touchEndX = 0;
    bookContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    bookContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    function handleSwipe() {
        const threshold = 55;
        if (touchEndX < touchStartX - threshold) {
            navigateNext();
        } else if (touchEndX > touchStartX + threshold) {
            navigatePrev();
        }
    }
    // Window Resize Handler
    window.addEventListener('resize', () => {
        const wasMobile = isMobile;
        isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== isMobile) {
            if (isMobile) {
                if (activePage === 0 && currentSheet > 0) {
                    activePage = (currentSheet - 1) * 2 + 1;
                }
            } else {
                currentSheet = getSheetForPage(activePage);
            }
            updateBook();
        }
    }); 
    // Get sheet index for a given page index
}}}});