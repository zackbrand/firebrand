class SERVICEWORKER {
  constructor() {
    this.path = '/sw.js';
    this.scope = '/';
    this.currentCache = "v1";
    this.swRegistered = false;
    this.swCache      = false;
    this.swControlled = false;
    this.swInstall    = "";
  }
  registerSW() {
    navigator.serviceWorker.register(SW.path, {scope: SW.scope}).then(function(sw){
      console.log('Registration succeeded. Scope is ' + sw.scope);
    }).catch(function(error) {
      console.log('Registration failed with ' + error);
    });
  }
  checkRegistration() {
    navigator.serviceWorker.getRegistration().then(function(reg){
      if (reg) {
        console.log('Service worker registration confirmed');
        SW.swRegistered = true;
      } else {
        console.log('No service worker registered');
        SW.swRegistered = false;
      }
      SW.registered.textContent = "Registered: "+SW.swRegistered;
    }).catch(function(error) {
      console.log('Check registration promise error: ' + error);
    });
  }
  unregisterSW() {
    navigator.serviceWorker.register(SW.path,{scope: SW.scope}).then(function(sw){
      sw.unregister().then(function(){
        console.log('Service Worker unregistered');
      });
    }).catch(function(error) {
        console.log('Registration failed with ' + error);
    });
  }
  installCache() {
    const filesToCache = [
      '/'
    ]
    caches.open(SW.currentCache).then(function(cache) {
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
        SW.cache.textContent = "Cache: matched";
      } else {
        console.log("Cache False");
        SW.cache.textContent = "Cache: false";   
      }

    })
  }
  deleteCache() {
    console.log('Trying to delete cache');
    caches.open(SW.currentCache).then(function(cache) {
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
