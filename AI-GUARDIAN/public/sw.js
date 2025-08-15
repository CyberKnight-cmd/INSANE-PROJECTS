// Service Worker for AI Guardian background operation
const CACHE_NAME = 'ai-guardian-v1';
const DISTRESS_PHRASES = ['help me', 'emergency', 'danger'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll([
          '/',
          '/index.html',
          '/manifest.json'
        ]);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data.type === 'AUDIO_DATA') {
    // Process audio data in background
    const audioData = event.data.payload;
    // Here you would send to your distress detection API
    // For now we'll just check for distress phrases
    const transcript = audioData.transcript.toLowerCase();
    
    if (DISTRESS_PHRASES.some(phrase => transcript.includes(phrase))) {
      self.registration.showNotification('Distress Detected!', {
        body: 'Emergency protocols activated',
        icon: '/icons/emergency.png',
        vibrate: [200, 100, 200],
        data: { url: '/emergency' }
      });
      
      // Send message back to main thread
      event.source.postMessage({
        type: 'DISTRESS_DETECTED',
        payload: { phrase: transcript }
      });
    }
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});