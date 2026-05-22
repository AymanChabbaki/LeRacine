/**
 * Le Racine — Interactive Menu Book Engine
 * Coordinates 3D flipping on desktop and flat sliding on mobile.
 */
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const bookContainer = document.getElementById('bookContainer');
    const sheets = document.querySelectorAll('.book-sheet');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const tabs = document.querySelectorAll('.book-tab');
    const mobileIndicators = document.getElementById('mobileIndicators');
    // State Variables
    let activePage = 0; // Current active page index (0 to 10)
    let currentSheet = 0; // Current desktop sheet (0 to 5)
    let isMobile = window.innerWidth <= 768;
    // Initialize Mobile Dots
    function initMobileIndicators() {
        mobileIndicators.innerHTML = '';
        // Create a dot for each page (0 to 10)
        for (let i = 0; i <= 10; i++) {
            const dot = document.createElement('div');
            dot.classList.add('indicator-dot');
            if (i === activePage) dot.classList.add('active');
            dot.addEventListener('click', () => {
                activePage = i;
                updateBook();
            });
            mobileIndicators.appendChild(dot);
        }
    }
    // Map Page Index to Desktop Sheet Index
    function getSheetForPage(p) {
        if (p === 0) return 0;
        // Pages 1-2 -> Sheet 1, Pages 3-4 -> Sheet 2, etc.
        const sheet = Math.floor((p - 1) / 2) + 1;
        return Math.min(sheet, sheets.length - 1);
    }
    // Sync Header Category Tabs Highlight
    function updateTabsHighlight() {
        tabs.forEach(tab => {
            const targetPage = parseInt(tab.getAttribute('data-target-page'), 10);
            
            // Determine if this tab matches the current view
            let isActive = false;
            
            if (isMobile) {
                isActive = targetPage === activePage;
            } else {
                // On desktop, the spread shows Page (currentSheet-1)*2+1 and Page (currentSheet-1)*2+2
                if (currentSheet === 0) {
                    isActive = targetPage === 0;
                } else {
                    const leftPage = (currentSheet - 1) * 2 + 1;
                    const rightPage = leftPage + 1;
                    isActive = targetPage === leftPage || targetPage === rightPage;
                }
            }
            if (isActive) {
                tab.classList.add('active');
                // Scroll active tab into view on mobile
                tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            } else {
                tab.classList.remove('active');
            }
        });
    }
    // Main Update Function
    function updateBook() {
        // Double check bounds
        activePage = Math.max(0, Math.min(10, activePage));
        currentSheet = getSheetForPage(activePage);
        if (isMobile) {
            // --- MOBILE FLAT CARD SLIDER LOGIC ---
            // Enable horizontal transition for mobile layout
            sheets.forEach(sheet => {
                sheet.style.zIndex = '';
                sheet.classList.remove('flipped');
            });
            const pageFaces = document.querySelectorAll('.page-face');
            pageFaces.forEach((face, idx) => {
                // Position each face horizontally relative to activePage
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
            nextBtn.disabled = activePage === 10;
        } else {
            // --- DESKTOP 3D FLIPBOOK LOGIC ---
            // Clear any mobile inline transforms from page faces
            const pageFaces = document.querySelectorAll('.page-face');
            pageFaces.forEach(face => {
                face.style.transform = '';
            });
            // Update sheet rotations and Z-indexing
            sheets.forEach((sheet, idx) => {
                if (idx < currentSheet) {
                    // Flipped to the left
                    sheet.classList.add('flipped');
                    sheet.style.zIndex = idx + 1;
                } else {
                    // Flat on the right
                    sheet.classList.remove('flipped');
                    sheet.style.zIndex = sheets.length - idx;
                }
            });
            // Disable/enable arrows
            prevBtn.disabled = currentSheet === 0;
            nextBtn.disabled = currentSheet === sheets.length - 1;
        }
        updateTabsHighlight();
    }
    // Navigation triggers
    function navigateNext() {
        if (isMobile) {
            if (activePage < 10) {
                activePage++;
                updateBook();
            }
        } else {
            if (currentSheet < sheets.length - 1) {
                currentSheet++;
                // Set active page to the left-hand page of the new spread
                activePage = (currentSheet - 1) * 2 + 1;
                updateBook();
            }
        }
    }
    function navigatePrev() {
        if (isMobile) {
            if (activePage > 0) {
                activePage--;
                updateBook();
            }
        } else {
            if (currentSheet > 0) {
                currentSheet--;
                // Set active page to the left-hand page of the new spread (or 0 for front cover)
                activePage = currentSheet === 0 ? 0 : (currentSheet - 1) * 2 + 1;
                updateBook();
            }
        }
    }
    // Event Listeners for Nav Buttons
    nextBtn.addEventListener('click', navigateNext);
    prevBtn.addEventListener('click', navigatePrev);
    // Event Listeners for Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            navigateNext();
        } else if (e.key === 'ArrowLeft') {
            navigatePrev();
        }
    });
    // Event Listeners for Category Tabs Click
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = parseInt(tab.getAttribute('data-target-page'), 10);
            activePage = target;
            updateBook();
        });
    });
    // Desktop Click-to-Flip Pages
    sheets.forEach((sheet, idx) => {
        sheet.addEventListener('click', (e) => {
            // Do not flip if user is clicking on links or buttons
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
        const threshold = 55; // swipe sensitivity
        if (touchEndX < touchStartX - threshold) {
            // Swiped left -> next page
            navigateNext();
        } else if (touchEndX > touchStartX + threshold) {
            // Swiped right -> prev page
            navigatePrev();
        }
    }
    // Window Resize Handler
    window.addEventListener('resize', () => {
        const wasMobile = isMobile;
        isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== isMobile) {
            if (isMobile) {
                // Sync active page from sheet
                if (activePage === 0 && currentSheet > 0) {
                    activePage = (currentSheet - 1) * 2 + 1;
                }
            } else {
                // Sync sheet from active page
                currentSheet = getSheetForPage(activePage);
            }
            updateBook();
        }
    });
    // Initialization
    initMobileIndicators();
    updateBook();
});