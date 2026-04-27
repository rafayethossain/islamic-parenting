document.addEventListener('DOMContentLoaded', () => {
    
    // --- Phase 1: Interactive Foundation ---
    
    const ProgressManager = {
        totalSteps: 28, // 8 Parenting + 10 Salat + 10 Siyam
        
        init() {
            if (!localStorage.getItem('user_progress')) {
                localStorage.setItem('user_progress', JSON.stringify({
                    completed: [],
                    milestones: []
                }));
            }
            this.renderMilestoneRing();
            this.trackCompletion();
            this.checkAndAwardInitial();
        },

        save(id) {
            let progress = JSON.parse(localStorage.getItem('user_progress'));
            if (!progress.completed.includes(id)) {
                progress.completed.push(id);
                localStorage.setItem('user_progress', JSON.stringify(progress));
                this.renderMilestoneRing();
                this.checkMilestones(progress);
                this.showCompletionToast(id);
            }
        },

        renderMilestoneRing() {
            const sidebar = document.querySelector('.sidebar');
            if (!sidebar) return;

            let progress = JSON.parse(localStorage.getItem('user_progress'));
            const percent = Math.round((progress.completed.length / this.totalSteps) * 100);
            
            let ringContainer = document.querySelector('.milestone-container');
            if (!ringContainer) {
                ringContainer = document.createElement('div');
                ringContainer.className = 'milestone-container';
                sidebar.prepend(ringContainer);
            }

            const radius = 36;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (percent / 100) * circumference;

            ringContainer.innerHTML = `
                <div class="progress-ring-wrapper">
                    <svg class="progress-ring" width="80" height="80">
                        <circle class="progress-ring__background" stroke-width="4" fill="transparent" r="${radius}" cx="40" cy="40"/>
                        <circle class="progress-ring__circle" stroke-width="4" stroke-dasharray="${circumference} ${circumference}" style="stroke-dashoffset: ${offset}" fill="transparent" r="${radius}" cx="40" cy="40"/>
                    </svg>
                    <div class="progress-text">${percent}%</div>
                </div>
                <div class="milestone-label">Nuur Milestones</div>
            `;
        },

        trackCompletion() {
            // Auto-track based on URL
            const path = window.location.pathname;
            let id = "";
            if (path.includes('chapter-')) id = "parenting-" + path.split('chapter-')[1].split('.html')[0];
            if (path.includes('module-')) {
                const modType = path.includes('salat') ? 'salat' : 'siyam';
                id = modType + "-" + path.split('module-')[1].split('.html')[0];
            }

            if (id) {
                // If user scrolls to bottom, mark as complete
                const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        this.save(id);
                        observer.disconnect();
                    }
                }, { threshold: 0.5 });

                const footer = document.querySelector('.nav-footer');
                if (footer) observer.observe(footer);
            }
        },

        checkMilestones(progress) {
            const milestones = [
                { id: 'sidq', name: 'The Truth-Teller (Sidq)', condition: () => progress.completed.includes('parenting-01') },
                { id: 'salat-guard', name: 'Guardian of Prayer', condition: () => progress.completed.includes('salat-04') },
                { id: 'crescent', name: 'Crescent Climber', condition: () => progress.completed.includes('siyam-02') }
            ];

            milestones.forEach(m => {
                if (m.condition() && !progress.milestones.includes(m.id)) {
                    progress.milestones.push(m.id);
                    localStorage.setItem('user_progress', JSON.stringify(progress));
                    this.showMilestoneBadge(m.name);
                }
            });
        },

        showMilestoneBadge(name) {
            const badge = document.createElement('div');
            badge.className = 'update-toast'; // Reusing style for now
            badge.style.background = 'var(--accent-gold)';
            badge.innerHTML = `<span>🏅 Milestone Achieved: <strong>${name}</strong></span>`;
            document.body.appendChild(badge);
            setTimeout(() => badge.remove(), 5000);
            
            if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
        },

        showCompletionToast(id) {
            console.log("Completed:", id);
            if (window.navigator.vibrate) window.navigator.vibrate(50);
        },

        checkAndAwardInitial() {
            // Check milestones on page load
            const progress = JSON.parse(localStorage.getItem('user_progress'));
            this.checkMilestones(progress);
        }
    };

    const SwipeNavigator = {
        startX: 0,
        endX: 0,
        
        init() {
            document.addEventListener('touchstart', (e) => this.startX = e.touches[0].clientX);
            document.addEventListener('touchend', (e) => {
                this.endX = e.changedTouches[0].clientX;
                this.handleSwipe();
            });
        },

        handleSwipe() {
            const diff = this.startX - this.endX;
            const threshold = 100;
            const footer = document.querySelector('.nav-footer');
            if (!footer) return;

            const nextBtn = footer.querySelector('a:last-child');
            const prevBtn = footer.querySelector('a:first-child');

            if (diff > threshold && nextBtn && nextBtn.innerText.includes('→')) {
                // Swipe Left -> Next
                nextBtn.click();
            } else if (diff < -threshold && prevBtn && prevBtn.innerText.includes('←')) {
                // Swipe Right -> Prev
                prevBtn.click();
            }
        }
    };

    ProgressManager.init();
    SwipeNavigator.init();

    // --- Phase 2: Engagement ---

    const SanctuaryMode = {
        init() {
            const toggle = document.createElement('button');
            toggle.className = 'sanctuary-toggle';
            toggle.innerHTML = '✨ Sanctuary Mode';
            toggle.title = 'Hide interface for deep reading';
            document.body.appendChild(toggle);

            if (localStorage.getItem('sanctuary_mode') === 'active') {
                this.enable();
            }

            toggle.addEventListener('click', () => {
                if (document.body.classList.contains('sanctuary-mode')) {
                    this.disable();
                } else {
                    this.enable();
                }
            });
        },

        enable() {
            document.body.classList.add('sanctuary-mode');
            localStorage.setItem('sanctuary_mode', 'active');
            document.querySelector('.sanctuary-toggle').innerHTML = '👁️ Show Interface';
            if (window.navigator.vibrate) window.navigator.vibrate(10);
        },

        disable() {
            document.body.classList.remove('sanctuary-mode');
            localStorage.setItem('sanctuary_mode', 'inactive');
            document.querySelector('.sanctuary-toggle').innerHTML = '✨ Sanctuary Mode';
        }
    };

    const QuizEngine = {
        data: {
            'parenting-01': {
                question: 'Your child has broken a glass and says out of fear that they didn\'t do it. As a "Shepherd" (parent), what should be your first step?',
                options: [
                    { text: 'Scold them so they don\'t lie again.', correct: false, feedback: 'Fear gives birth to lies. Scolding will make them tell bigger lies in the future.' },
                    { text: 'Say calmly: "I know you are afraid, but I love your truthfulness more than the glass."', correct: true, feedback: 'Excellent! Making truthfulness safe is the first step in building a Fortress of Truth (Sidq).' },
                    { text: 'Tell them that Allah will punish them for lying.', correct: false, feedback: 'Encourage them to speak the truth out of love for Allah, not just fear of punishment.' }
                ]
            }
        },

        init() {
            const path = window.location.pathname;
            let id = "";
            if (path.includes('chapter-')) id = "parenting-" + path.split('chapter-')[1].split('.html')[0];
            
            if (this.data[id]) {
                this.render(id);
            }
        },

        render(id) {
            const quiz = this.data[id];
            const footer = document.querySelector('.nav-footer');
            if (!footer) return;

            const container = document.createElement('div');
            container.className = 'quiz-container';
            container.id = 'reflective-quiz';
            
            container.innerHTML = `
                <div class="quiz-header">
                    <span>🤔 Reflective Checkpoint</span>
                </div>
                <div class="quiz-question">${quiz.question}</div>
                <div class="quiz-options">
                    ${quiz.options.map((opt, index) => `
                        <button class="quiz-option" data-index="${index}">${opt.text}</button>
                    `).join('')}
                </div>
                <div class="quiz-feedback" id="quiz-feedback"></div>
            `;

            footer.parentNode.insertBefore(container, footer);

            container.querySelectorAll('.quiz-option').forEach(btn => {
                btn.addEventListener('click', (e) => this.handleAnswer(e, id));
            });
        },

        handleAnswer(e, id) {
            const index = e.target.dataset.index;
            const option = this.data[id].options[index];
            const feedbackEl = document.getElementById('quiz-feedback');
            
            // Clear previous states
            document.querySelectorAll('.quiz-option').forEach(b => {
                b.classList.remove('correct', 'incorrect');
                b.disabled = true;
            });

            if (option.correct) {
                e.target.classList.add('correct');
                feedbackEl.style.display = 'block';
                feedbackEl.style.borderLeftColor = 'var(--accent-green)';
                feedbackEl.innerHTML = `<strong>Excellent!</strong><br>${option.feedback}`;
                if (window.navigator.vibrate) window.navigator.vibrate([50, 30, 50]);
                
                // Mark chapter as fully "interactively" complete
                ProgressManager.save(id + '-quiz');
            } else {
                e.target.classList.add('incorrect');
                feedbackEl.style.display = 'block';
                feedbackEl.style.borderLeftColor = '#e57373';
                feedbackEl.innerHTML = `<strong>Think again...</strong><br>${option.feedback}<br><br><button onclick="location.reload()" style="background:none; border:none; color:var(--accent-gold); cursor:pointer; font-weight:700; text-decoration:underline;">Try Again</button>`;
                if (window.navigator.vibrate) window.navigator.vibrate(200);
            }
        }
    };

    SanctuaryMode.init();
    QuizEngine.init();

    // --- Phase 3: The Barakah Loop ---

    const HabitTracker = {
        init() {
            const sidebar = document.querySelector('.sidebar');
            if (!sidebar) return;

            let habits = JSON.parse(localStorage.getItem('habit_streaks')) || {};
            const today = new Date().toISOString().split('T')[0];

            const container = document.createElement('div');
            container.className = 'habit-tracker-container';
            container.innerHTML = `
                <div class="habit-header">
                    <h4>Barakah Tracker</h4>
                    <span id="streak-count">🔥 ${this.getStreak(habits)}</span>
                </div>
                <div class="habit-grid" id="habit-grid"></div>
            `;
            sidebar.appendChild(container);

            this.renderGrid(habits);
        },

        renderGrid(habits) {
            const grid = document.getElementById('habit-grid');
            const today = new Date();
            
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(today.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                
                const dayEl = document.createElement('div');
                dayEl.className = `habit-day ${habits[dateStr] ? 'active' : ''} ${i === 0 ? 'today' : ''}`;
                dayEl.innerHTML = date.getDate();
                dayEl.title = dateStr;
                
                if (i === 0) {
                    dayEl.addEventListener('click', () => this.toggleToday(dateStr));
                }
                grid.appendChild(dayEl);
            }
        },

        toggleToday(dateStr) {
            let habits = JSON.parse(localStorage.getItem('habit_streaks')) || {};
            habits[dateStr] = !habits[dateStr];
            localStorage.setItem('habit_streaks', JSON.stringify(habits));
            
            // Refresh UI
            document.getElementById('habit-grid').innerHTML = '';
            this.renderGrid(habits);
            document.getElementById('streak-count').innerHTML = `🔥 ${this.getStreak(habits)}`;
            
            if (habits[dateStr]) {
                ParticleEffect.burst(window.innerWidth / 2, window.innerHeight / 2);
                if (window.navigator.vibrate) window.navigator.vibrate([50, 30, 50]);
            }
        },

        getStreak(habits) {
            let streak = 0;
            let date = new Date();
            while (true) {
                const dateStr = date.toISOString().split('T')[0];
                if (habits[dateStr]) {
                    streak++;
                    date.setDate(date.getDate() - 1);
                } else {
                    break;
                }
            }
            return streak;
        }
    };

    const ParticleEffect = {
        burst(x, y) {
            for (let i = 0; i < 20; i++) {
                const p = document.createElement('div');
                p.className = 'particle';
                const size = Math.random() * 8 + 4;
                p.style.width = size + 'px';
                p.style.height = size + 'px';
                p.style.left = x + 'px';
                p.style.top = y + 'px';
                
                const tx = (Math.random() - 0.5) * 200;
                const ty = (Math.random() - 0.5) * 200;
                p.style.setProperty('--x', tx + 'px');
                p.style.setProperty('--y', ty + 'px');
                
                p.style.animation = `particle-fade ${Math.random() * 1 + 0.5}s forwards`;
                document.body.appendChild(p);
                setTimeout(() => p.remove(), 1500);
            }
        }
    };

    HabitTracker.init();

    // Overriding ProgressManager.showMilestoneBadge to include particles
    const oldShowBadge = ProgressManager.showMilestoneBadge;
    ProgressManager.showMilestoneBadge = function(name) {
        oldShowBadge.call(this, name);
        ParticleEffect.burst(window.innerWidth / 2, window.innerHeight / 2);
    };

    // --- End Phase 3 ---

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

    // 4. PWA Service Worker Registration & Installation
    let deferredPrompt;
    const installBtn = document.getElementById('install-pwa');

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI to notify the user they can add to home screen
        if (installBtn) {
            installBtn.style.display = 'inline-flex';
        }
    });

    if (installBtn) {
        installBtn.addEventListener('click', (e) => {
            // hide our user interface that shows our A2HS button
            installBtn.style.display = 'none';
            // Show the prompt
            if (deferredPrompt) {
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the A2HS prompt');
                    } else {
                        console.log('User dismissed the A2HS prompt');
                    }
                    deferredPrompt = null;
                });
            }
        });
    }

    // Hide install button if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
        if (installBtn) installBtn.style.display = 'none';
    }

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
