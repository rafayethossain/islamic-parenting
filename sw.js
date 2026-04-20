const CACHE_NAME = 'jannah-toolkit-v5';

const ASSETS = [
    './',
    './index.html',
    './manifest.webmanifest',
    './en/index.html',
    './bn/index.html',
    './en/parenting/index.html',
    './bn/parenting/index.html',
    './en/salat/index.html',
    './bn/salat/index.html',
    './en/assets/css/style.css',
    './bn/assets/css/style.css',
    './en/assets/js/main.js',
    './bn/assets/js/main.js',
    'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Playfair+Display:wght@700&family=Merriweather:ital,wght@0,400;1,400&display=swap',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@700&display=swap'
];

// Pre-cache all parenting chapters
const parentingChapters = [
    'chapter-01.html', 'chapter-02.html', 'chapter-03.html', 
    'chapter-04.html', 'chapter-05.html', 'chapter-06.html', 
    'chapter-07.html', 'chapter-08.html', 'toolkit.html', 
    'troubleshooting.html', 'conclusion.html'
];

parentingChapters.forEach(ch => {
    ASSETS.push(`./en/parenting/${ch}`);
    ASSETS.push(`./bn/parenting/${ch}`);
});

// Salat modules
const salatModules = [
    'module-01.html', 'module-02.html', 'module-03.html', 
    'module-04.html', 'module-05.html', 'module-06.html', 
    'module-07.html', 'module-08.html'
];

salatModules.forEach(mod => {
    ASSETS.push(`./en/salat/${mod}`);
    ASSETS.push(`./bn/salat/${mod}`);
});

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return Promise.all(
                    ASSETS.map(url => {
                        return cache.add(url).catch(err => console.warn('Failed to cache:', url));
                    })
                );
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

// Activate event to clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
});

self.addEventListener('message', event => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
