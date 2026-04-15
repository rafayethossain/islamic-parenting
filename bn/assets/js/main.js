document.addEventListener('DOMContentLoaded', () => {
    
    // 0. Save Language Preference
    localStorage.setItem('preferredLang', 'bn');

    // 1. Reading Progress Bar & Back to Top
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.title = 'উপরে যান';
    backToTopBtn.setAttribute('aria-label', 'উপরে যান');
    document.body.appendChild(backToTopBtn);

    window.onscroll = function() { 
        updateProgressBar();
        toggleBackToTop();
    };

    function updateProgressBar() {
        var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var scrolled = (winScroll / height) * 100;
        document.getElementById("progress-bar").style.width = scrolled + "%";
    }

    function toggleBackToTop() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
    }

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 2. Dark Mode Toggle
    const themeBtn = document.getElementById('theme-btn');
    const currentTheme = localStorage.getItem('theme');

    // 2.5 Hamburger Menu Toggle
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '<span>☰</span>'; // Simple hamburger icon
    hamburger.setAttribute('aria-label', 'মেনু খুলুন/বন্ধ করুন');
    document.body.appendChild(hamburger);

    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    // 2.6 Active Link ARIA
    const activeLink = document.querySelector('.sidebar-nav a.active');
    if (activeLink) {
        activeLink.setAttribute('aria-current', 'page');
    }

    if (currentTheme === 'dark') {
        enableDarkMode();
    }

    themeBtn.addEventListener('click', () => {
        let theme = localStorage.getItem('theme');
        if (theme !== 'dark') {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    });

    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    }

    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }

    // 3. Simple Bookmark (Save Scroll Position)
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('scrollPos_' + window.location.pathname, window.scrollY);
    });

    const savedPos = localStorage.getItem('scrollPos_' + window.location.pathname);
    if (savedPos) {
        window.scrollTo(0, parseInt(savedPos));
    }

    // 4. PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            const swPath = window.location.pathname.includes('/chapters/') ? '../../sw.js' : '../sw.js';
            navigator.serviceWorker.register(swPath)
                .then(reg => {
                    console.log('SW Registered');
                    
                    reg.addEventListener('updatefound', () => {
                        const newWorker = reg.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch(err => console.log('SW Fail'));
        });

        let refreshing;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            window.location.reload();
            refreshing = true;
        });
    }

    function showUpdateNotification() {
        const toast = document.createElement('div');
        toast.className = 'update-toast';
        const msg = 'নতুন ভার্সন পাওয়া গেছে!';
        const btnTxt = 'রিফ্রেশ করুন';
        
        toast.innerHTML = `
            <span>${msg}</span>
            <button id="update-btn">${btnTxt}</button>
        `;
        document.body.appendChild(toast);

        document.getElementById('update-btn').addEventListener('click', () => {
            navigator.serviceWorker.getRegistration().then(reg => {
                if (reg && reg.waiting) {
                    reg.waiting.postMessage('skipWaiting');
                }
            });
        });
    }
});
