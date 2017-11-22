class CACHE {
  constructor() {
    this.cacheVersion = "v1";
    this.cached  = false;
    this.installButton = "";
    this.installClass = "cache-status__install--true";
    this.installText = "Cached";
    this.uninstallClass = "cache-status__install--false";
    this.uninstallText = "Uncached";
  }
  check () {
    // Check against cache first
    let checkCache = caches.match('/');
    let resolved = response => {
      if (response) {
        this.installButton.classList.add(this.installClass);
        this.installButton.textContent = this.installText;
        this.cached = true;
      } else {  
        this.installButton.classList.add(this.uninstallClass);
        this.installButton.textContent = this.uninstallText;
        this.cached = false;
      }
    }
    let rejected = reason => {
      console.log('Cache promise error: '+reason);
    }
    checkCache.then(resolved, rejected);
  }
  install() {
    const filesToCache = ['/'];
    let openCache = caches.open(this.cacheVersion);
    let resolved = cache => {
      cache.addAll(filesToCache).then(location.reload());
    }
    let rejected = reason => console.log('Cache open error: '+reason);
    openCache.then(resolved, rejected);
  }
  delete() {
    let openCache = caches.open(this.cacheVersion);
    let deleteCache = cache => {
      let getCacheKeys = cache.keys();
      let deleteKey = key => cache.delete(key);
      let deleteKeys = keys => keys.forEach(deleteKey);
      getCacheKeys.then(deleteKeys);
      location.reload();
    }
    openCache.then(deleteCache);
  }
  clean() {
    const cacheWhitelist = [cacheVersion];
    let getCacheKeys = cache.keys();
    let deleteKey = key => {
      if (cacheWhitelist.indexOf(key) === -1) {
        console.log("SW: Deleting old cache");
        return caches.delete(key);
      }
    }
    let deleteKeys = keylist => {
      return Promise.all(keyList.map(deleteKey));
    }
    getCacheKeys.then(deleteKeys);
  }

} // End class
