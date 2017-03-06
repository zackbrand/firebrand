//////////////////////////////////
// Setup /////////////////////////

// Use unique cache name to allow for graceful updating
const currentCache = "v1";

//////////////////////////////////
// Install ///////////////////////

this.addEventListener('install', function(event) {
  console.log("SW: 'install' event fired");
  // delay treating the worker as installed until initial caching is done
  //event.waitUntil(initialCache());
});

//////////////////////////////////
// Activate //////////////////////

this.addEventListener('activate', function(event) {
  console.log("SW: 'activate' event fired");
  //event.waitUntil(cleanCache());
});

//////////////////////////////////
// Fetch ////////////////////////

this.addEventListener('fetch', function(event) {
  console.log("SW: 'fetch' event fired");

});

