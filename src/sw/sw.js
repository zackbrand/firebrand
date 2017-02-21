// Use unique cache name to allow for graceful updating
const cacheVersion = "v1";

// Install default cached files
this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheVersion).then(function(cache) {
      return cache.addAll([
        '/'
      ]);
    })
  );
});

// Cleanup old cache after new SW is activated
this.addEventListener('activate', function(event) {
  const cacheWhitelist = [cacheVersion];
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

// Intercept asset requests, check cache first, then check network
this.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request).then(function(response) {
        return caches.open(cacheVersion).then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });  
      });
    })
  );
});