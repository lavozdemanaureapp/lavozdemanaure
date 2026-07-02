// ============================================================================
// 1. IMPORTACIONES DE FIREBASE PARA NOTIFICACIONES EN SEGUNDO PLANO
// ============================================================================
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBtkKwQlTzDgQwP_RpDPnX7WJqoyg1turk",
  projectId: "radiomanaure",
  messagingSenderId: "302935331677",
  appId: "1:302935331677:web:73419d363115ad1ff7ceb4"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Mensaje recibido con la App cerrada: ', payload);
  
  const notificationTitle = payload.notification.title || '📻 ¡Nuevo mensaje en cabina!';
  const notificationOptions = {
    body: payload.notification.body,
    icon: './logo_v2.png',
    badge: './logo_v2.png',
    vibrate: [200, 100, 200, 100, 200, 100, 200]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});


// ============================================================================
// 2. TU LÓGICA ORIGINAL DE CACHÉ Y PWA (Intacta)
// ============================================================================
const CACHE_NAME = 'manaure-v8'; // Subimos a v8 por la integración de Firebase
const ASSETS = [
  './',
  './index.html',
  './programas.html',
  './micambio.html',
  './canales.html',
  './logo_v2.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// INSTALACIÓN: Guarda los archivos básicos
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// ACTIVACIÓN: Borra cachés viejos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// ESTRATEGIA: Carga desde internet, si falla usa caché
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // IMPORTANTE: NO intentar guardar el streaming ni el Chat
  if (url.hostname.includes('zeno.fm') || url.hostname.includes('firebase') || url.hostname.includes('firestore')) {
    return; 
  }

  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
