class CACHE {
  constructor() {
    this.cacheVersion = "v1";
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
    caches.open(Cache.cacheVersion).then(function(cache) {
      cache.addAll(filesToCache).then(function() {
      location.reload();
      });
    })
  }
  delete() {
    caches.open(Cache.cacheVersion).then(function(cache) {
      cache.keys().then(function(keys) {
        keys.forEach(function(request, index, array) {
          cache.delete(request);
        });
      });
      location.reload();
    })
  }
  clean() {
    const cacheWhitelist = [cacheVersion];
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          //console.log("SW: Deleting old cache");
          return caches.delete(key);
        }
      }));
    })
  }
} // End class
