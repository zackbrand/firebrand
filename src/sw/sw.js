// Setup /////////////////////////

  // Use unique cache name to allow for graceful updating
  const cacheVersion = "v1";

// Install ///////////////////////
  this.addEventListener('install', function(event) {
    console.log("SW: 'install' event fired");
    // delay treating the worker as installed until initial caching is done
    //event.waitUntil(initialCache());
  });

// Activate //////////////////////
  this.addEventListener('activate', function(event) {
    console.log("SW: 'activate' event fired");
    //event.waitUntil(cleanCache());
  });

// Fetch /////////////////////////
  this.addEventListener('fetch', function(event) {
    console.log("SW: 'fetch' event fired");
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
          return caches.open(cacheVersion).then(function(cache) {
            // Add newly found content to the cache
            cache.put(event.request, response.clone());
            return response;
          });  
        });
      })
    ); // End respondWith    
  });

