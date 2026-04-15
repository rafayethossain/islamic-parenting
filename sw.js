const CACHE_NAME = 'jannah-toolkit-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.webmanifest',
    './en/index.html',
    './bn/index.html',
    './en/assets/css/style.css',
    './bn/assets/css/style.css',
    './en/assets/js/main.js',
    './bn/assets/js/main.js'
];

// Pre-cache all chapters
const chapters = [
    'chapter-01.html', 'chapter-02.html', 'chapter-03.html', 
    'chapter-04.html', 'chapter-05.html', 'chapter-06.html', 
    'chapter-07.html', 'chapter-08.html', 'toolkit.html', 
    'troubleshooting.html', 'conclusion.html'
];

chapters.forEach(ch => {
    ASSETS.push(`./en/chapters/${ch}`);
    ASSETS.push(`./bn/chapters/${ch}`);
});

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
