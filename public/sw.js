// Service worker de Modo Adulto: hace que la app abra y funcione sin conexión.
// Los archivos propios se piden primero a la red, así que los cambios llegan solos.
// Sube CACHE_VERSION solo si cambias la lista APP_SHELL o la forma de cachear.
const CACHE_VERSION = 'v2';
const APP_CACHE = `modo-adulto-app-${CACHE_VERSION}`;
const FONT_CACHE = `modo-adulto-fonts-${CACHE_VERSION}`;

const APP_SHELL = [
    '/',
    '/index.html',
    '/css/tailwind.css',
    '/vendor/lucide.min.js',
    '/fonts/nunito-latin-wght-normal.woff2',
    '/fonts/atkinson-hyperlegible-latin-400-normal.woff2',
    '/fonts/atkinson-hyperlegible-latin-700-normal.woff2',
    '/manifest.webmanifest',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/icons/apple-touch-icon.png',
    '/icons/favicon.png',
];

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(APP_CACHE)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    const keep = [APP_CACHE, FONT_CACHE];
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);

    // Navegación: primero la red para recibir actualizaciones; sin conexión, la copia guardada.
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(APP_CACHE).then((cache) => cache.put('/index.html', copy));
                    return response;
                })
                .catch(() => caches.match('/index.html'))
        );
        return;
    }

    // Archivos propios: primero la red, y la caché como respaldo.
    if (url.origin === self.location.origin) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.ok) {
                        const copy = response.clone();
                        caches.open(APP_CACHE).then((cache) => cache.put(request, copy));
                    }
                    return response;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // Fuentes de Google: se sirven de la caché y se actualizan en segundo plano.
    if (FONT_HOSTS.includes(url.hostname)) {
        event.respondWith(
            caches.open(FONT_CACHE).then((cache) =>
                cache.match(request).then((cached) => {
                    const network = fetch(request)
                        .then((response) => {
                            cache.put(request, response.clone());
                            return response;
                        })
                        .catch(() => cached);
                    return cached || network;
                })
            )
        );
    }
    // Todo lo demás (por ejemplo, el clima de Open-Meteo) va directo a la red.
});
