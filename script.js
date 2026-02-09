document.addEventListener('DOMContentLoaded', () => {
    // Check if user is owner
    if (window.T && window.T.config && window.T.config.ROLE === 'owner') {
        document.body.classList.add('is-owner');
    }
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    const icon = themeToggle ? themeToggle.querySelector('i') : null;

    if (themeToggle && icon) {
        // Function to update icon
        const updateIcon = (isDark) => {
            if (isDark) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        };

        // Check saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            updateIcon(true);
        }

        themeToggle.addEventListener('click', () => {
            const isDark = root.getAttribute('data-theme') === 'dark';
            if (isDark) {
                root.removeAttribute('data-theme');
                updateIcon(false);
                localStorage.setItem('theme', 'light');
            } else {
                root.setAttribute('data-theme', 'dark');
                updateIcon(true);
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // View Mode Toggle (List vs Gallery)
    const listBtn = document.querySelector('.list-view');
    const galleryBtn = document.querySelector('.gallery-view');
    const mainContent = document.getElementById('mainContent');

    if (listBtn && galleryBtn && mainContent) {
        listBtn.addEventListener('click', () => {
            mainContent.classList.remove('gallery-mode');
            listBtn.classList.add('active');
            galleryBtn.classList.remove('active');
            localStorage.setItem('viewMode', 'list');
        });

        galleryBtn.addEventListener('click', () => {
            mainContent.classList.add('gallery-mode');
            galleryBtn.classList.add('active');
            listBtn.classList.remove('active');
            localStorage.setItem('viewMode', 'gallery');
        });

        // Restore view mode
        const savedView = localStorage.getItem('viewMode');
        if (savedView === 'gallery') {
            galleryBtn.click();
        }
    }

    // Navigation Buttons (Browser History)
    const backBtn = document.querySelector('.nav-btn.back');
    const forwardBtn = document.querySelector('.nav-btn.forward');

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.history.back();
        });
    }

    if (forwardBtn) {
        forwardBtn.addEventListener('click', () => {
            window.history.forward();
        });
    }

    // Lazy Loading Images (Intersection Observer)
    const images = document.querySelectorAll('img');
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                observer.unobserve(img);
            }
        });
    }, observerOptions);

    images.forEach(img => {
        if (!img.dataset.src && img.src) {
            // If server didn't set data-src, we assume src is already there. 
            // In a real Tistory skin optimization, you might manipulate the DOM 
            // before this script runs or use Tistory's lazy loading if available.
        } else {
            imageObserver.observe(img);
        }
    });

    // Mobile Sidebar Toggle (Hamburger - simple implementation if added to HTML)
    // currently not explicitly in HTML but good to have prepared

    // Real-time Clock
    function updateClock() {
        const clockElement = document.getElementById('clock');
        if (clockElement) {
            const now = new Date();
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const day = days[now.getDay()];
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            // Format: Mon 14:05
            clockElement.textContent = `${day} ${hours}:${minutes}`;
        }
    }

    updateClock(); // Initial call
    setInterval(updateClock, 1000); // Update every second

    // Setup Sidebar Click to Update Title (for Demo / Immediate Feedback)
    const sidebarLinks = document.querySelectorAll('.sidebar-item a, .tt_category a');
    const currentPathElement = document.querySelector('.current-path');

    if (currentPathElement) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Get text without icons
                let text = link.innerText;
                // Clean up if needed
                text = text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim(); // Remove emojis
                // Remove count if present (e.g., "Category (5)")
                text = text.replace(/\(\d+\)$/, '').trim();

                if (text) {
                    currentPathElement.textContent = text;
                }
            });
        });
    }

    // Traffic Lights -> Home
    const trafficLights = document.querySelector('.traffic-lights');
    if (trafficLights) {
        trafficLights.addEventListener('click', () => {
            window.location.href = '/';
        });
    }

    // Pagination Active State (Tistory doesn't add 'selected' class automatically in s_paging_rep)
    const pageLinks = document.querySelectorAll('.pagination .page-num a');
    if (pageLinks.length > 0) {
        const urlParams = new URLSearchParams(window.location.search);
        let currentPage = urlParams.get('page');

        // If no page param, assume page 1
        if (!currentPage) {
            currentPage = '1';
        }

        pageLinks.forEach(link => {
            // Check if link text allows strict equality or contains
            if (link.textContent.trim() === currentPage) {
                link.classList.add('selected');
            }
        });
    }

    // Notice List vs Detail View Logic
    const path = window.location.pathname;
    // Check if we are on the main notice list page
    // Patterns: /notice, /notice/, /notice?page=...
    // But NOT /notice/123 (detail)
    // Tistory notice list usually has path '/notice'
    if (path === '/notice' ||
        (path.startsWith('/notice') && isNaN(path.split('/').pop())) ||
        path.includes('demo.html')) { // Allow testing in demo.html
        document.body.classList.add('notice-list-view');


    }
});
