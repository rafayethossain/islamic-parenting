const CACHE_NAME = 'jannah-toolkit-v2';
const REPO = '/islamic-parenting'; 

const ASSETS = [
    `${REPO}/`,
    `${REPO}/index.html`,
    `${REPO}/manifest.webmanifest`,
    `${REPO}/en/index.html`,
    `${REPO}/bn/index.html`,
    `${REPO}/en/assets/css/style.css`,
    `${REPO}/bn/assets/css/style.css`,
    `${REPO}/en/assets/js/main.js`,
    `${REPO}/bn/assets/js/main.js`
];

// Pre-cache all chapters
const chapters = [
    'chapter-01.html', 'chapter-02.html', 'chapter-03.html', 
    'chapter-04.html', 'chapter-05.html', 'chapter-06.html', 
    'chapter-07.html', 'chapter-08.html', 'toolkit.html', 
    'troubleshooting.html', 'conclusion.html'
];

chapters.forEach(ch => {
    ASSETS.push(`${REPO}/en/chapters/${ch}`);
    ASSETS.push(`${REPO}/bn/chapters/${ch}`);
});

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // Return a Promise that resolves even if some assets fail to cache
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
