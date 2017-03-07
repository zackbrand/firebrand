class CACHE {
  constructor() {
    this.path = '/sw.js';
    this.scope = '/';
    this.currentCache = "v1";
    this.swCache      = false;
    this.swInstall    = "";
  }
  installCache() {
    const filesToCache = [
      '/'
    ]
    caches.open(Cache.currentCache).then(function(cache) {
      console.log("SW: Installing initial cache");
      return cache.addAll(filesToCache);
    })
  }
  checkCache () {
    // Check against cache first
    caches.match('/').then(function(resp) {
      console.log(resp);
      if (resp) {
        console.log("Cache True");
        Cache.cache.textContent = "Cache: matched";
      } else {
        console.log("Cache False");
        Cache.cache.textContent = "Cache: false";   
      }

    })
  }
  deleteCache() {
    console.log('Trying to delete cache');
    caches.open(Cache.currentCache).then(function(cache) {
      cache.delete('/').then(function(response) {
        console.log('Cache deleted');
      });
    }).catch(function(error) {
      console.log('Cache delete failed' + error);
    });
  }
  cleanCache() {
    const cacheWhitelist = [currentCache];
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log("SW: Deleting old cache");
          return caches.delete(key);
        }
      }));
    })
  }
  fetchCache() {
    // Intercept asset requests
    event.respondWith(

      // Check against cache first
      caches.match(event.request).then(function(resp) {
 
        if (resp) console.log("SW: Resource loaded from cache"); 
        return resp

      || // If that isnt truthy 

      // Then fetch from the network
        fetch(event.request).then(function(response) {
          console.log("SW: Requested resource not yet cached, caching now");
          return caches.open(currentCache).then(function(cache) {
            // Add newly found content to the cache
            cache.put(event.request, response.clone());
            return response;
          });  
        });
      })

    ); // End respondWith    
  }
} // End class
