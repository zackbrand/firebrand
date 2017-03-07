class CACHE {
  constructor() {
    this.currentCache = "v1";
    this.cached  = false;
    this.install_button = "";
  }
  check () {
    // Check against cache first
    caches.match('/').then(function(resp) {
      if (resp) {
        Cache.install_button.classList.add("cache-status__install--true")
        Cache.install_button.textContent = "Cached";
        Cache.cached = true;
      } else {  
        Cache.install_button.classList.add("cache-status__install--false")
        Cache.install_button.textContent = "Uncached";
        Cache.cached = false;
      }
    })
  }
  install() {
    const filesToCache = [
      '/'
    ]
    caches.open(Cache.currentCache).then(function(cache) {
      cache.addAll(filesToCache).then(function() {
      location.reload();
      });
    })
  }
  delete() {
    caches.open(Cache.currentCache).then(function(cache) {
      cache.delete('/').then(function(response) {
        location.reload();
      });
    }).catch(function(error) {
      console.log('Cache delete failed' + error);
    });
  }
  clean() {
    const cacheWhitelist = [currentCache];
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          //console.log("SW: Deleting old cache");
          return caches.delete(key);
        }
      }));
    })
  }
  fetch() {
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
