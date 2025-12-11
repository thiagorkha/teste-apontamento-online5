const CACHE_NAME = "producao-cache-v2"

// Updated to cache the SVG icon instead of PNGs that might be missing
const FILES_TO_CACHE = [
  "./", 
  "./index.html", 
  "./manifest.json", 
  "./db.js",
  "./icon.svg"
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Arquivos em cache para uso offline.')
      return cache.addAll(FILES_TO_CACHE)
    }).catch(error => {
        console.error('Service Worker: Falha ao adicionar arquivos ao cache. Verifique se todos os arquivos existem:', error)
    })
  )
})

self.addEventListener("activate", (event) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('Service Worker: Removendo cache antigo', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    }),
  )
})