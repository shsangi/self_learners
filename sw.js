/* Self Learners Service Worker — enables PWA install + offline caching */
const CACHE_NAME = 'self-learners-v1';
const CORE_FILES = [
    './',
    './index.html',
    './page-edu.html',
    './page-schedule.html',
    './page-syllabus.html',
    './page-papers.html',
    './page-eligibility.html',
    './manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_FILES).catch(() => {}))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) =>
            Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Network-first for HTML and APIs, cache fallback for offline
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});