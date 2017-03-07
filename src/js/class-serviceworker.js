class SERVICEWORKER {
  constructor() {
    this.path = '/sw.js';
    this.scope = '/';
    this.swRegistered = false;
    this.swControlled = false;
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
} // End class
