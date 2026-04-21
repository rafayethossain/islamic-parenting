document.addEventListener('DOMContentLoaded', () => {
    
    // 0. Save Language Preference
    localStorage.setItem('preferredLang', 'en');

    // 1. Reading Progress Bar & Back to Top
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.title = 'Back to Top';
    backToTopBtn.setAttribute('aria-label', 'Back to Top');
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
    hamburger.setAttribute('aria-label', 'Toggle Menu');
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
            // Correct path resolution for sw.js and version.json
            const depth = window.location.pathname.split('/').filter(p => p).length;
            let prefix = './';
            if (window.location.pathname.includes('/en/') || window.location.pathname.includes('/bn/')) {
                // If we are inside en/ or bn/
                const parts = window.location.pathname.split('/');
                const langIndex = parts.findIndex(p => p === 'en' || p === 'bn');
                const stepsBack = parts.length - langIndex - 1;
                prefix = '../'.repeat(stepsBack);
            }
            
            const swPath = prefix + 'sw.js';
            const versionPath = prefix + 'version.json';

            navigator.serviceWorker.register(swPath)
                .then(reg => {
                    console.log('SW Registered');
                    
                    // Check for updates on load
                    checkForUpdates(reg, versionPath);

                    // Check for updates every 1 hour
                    setInterval(() => {
                        reg.update();
                        checkForUpdates(reg, versionPath);
                    }, 3600000);

                    // Check for updates when coming back online
                    window.addEventListener('online', () => {
                        console.log('Online restored. Checking for updates...');
                        reg.update();
                        checkForUpdates(reg, versionPath);
                    });

                    reg.addEventListener('updatefound', () => {
                        const newWorker = reg.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showUpdateNotification();
                            }
                        });
                    });
                })
                .catch(err => console.log('SW Fail', err));
        });

        let refreshing;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            window.location.reload();
            refreshing = true;
        });
    }

    async function checkForUpdates(reg, versionPath) {
        try {
            const response = await fetch(`${versionPath}?v=${new Date().getTime()}`, { cache: 'no-store' });
            const remoteVersion = await response.json();
            const localVersion = localStorage.getItem('app_version');

            if (localVersion && remoteVersion.version !== localVersion) {
                console.log('New version detected:', remoteVersion.version);
                reg.update();
            }
            
            // Store current version if not set
            if (!localVersion) {
                localStorage.setItem('app_version', remoteVersion.version);
            }
        } catch (err) {
            console.warn('Version check failed', err);
        }
    }

    function showUpdateNotification() {
        const toast = document.createElement('div');
        toast.className = 'update-toast';
        const msg = 'New version available!';
        const btnTxt = 'Refresh Now';
        
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
