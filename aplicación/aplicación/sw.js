const CACHE_NAME = 'manaure-v7'; // Cambia el número si haces cambios grandes
const ASSETS = [
  './',
  './index.html',
  './programas.html',
  './micambio.html',
  './canales.html',
  './logo_v2.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// 1. INSTALACIÓN: Guarda los archivos básicos (HTML, CSS, Logos)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. ACTIVACIÓN: Borra cachés viejos para que la radio siempre esté actualizada
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// 3. ESTRATEGIA: Carga desde internet, pero si falla (sin señal), usa el caché
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // IMPORTANTE: NO intentar guardar el streaming (Zeno.fm) ni el Chat (Firebase)
  if (url.hostname.includes('zeno.fm') || url.hostname.includes('firebase')) {
    return; 
  }

  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});