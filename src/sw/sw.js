// Use unique cache name to allow for graceful updating
const currentCache = "v1";

this.addEventListener('install', function(event) {
  event.waitUntil(initialCache());
});

this.addEventListener('activate', function(event) {
  event.waitUntil(cleanCache());
});

this.addEventListener('fetch', function(event) {

  // Intercept asset requests
    event.respondWith(

      // Check against cache first
      caches.match(event.request).then(function(resp) {
        console.log("fetching from cache"); 
        return resp;

      || // If that isnt truthy 

      // Then fetch from the network
        fetch(event.request).then(function(response) {
          console.log("caching found content");
          return caches.open(currentCache).then(function(cache) {
            // Add newly found content to the cache
            cache.put(event.request, response.clone());
            return response;
          });  
        });
      })

    ); // End respondWith

});

function initialCache() {
  caches.open(currentCache).then(function(cache) {
    console.log("initial caching");
    return cache.addAll(['/']);
  })
}

function cleanCache() {
  const cacheWhitelist = [currentCache];
  caches.keys().then(function(keyList) {
    return Promise.all(keyList.map(function(key) {
      if (cacheWhitelist.indexOf(key) === -1) {
        console.log("deleting old cache");
        return caches.delete(key);
      }
    }));
  })
}