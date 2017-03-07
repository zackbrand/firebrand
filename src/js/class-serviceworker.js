class SERVICEWORKER {
  constructor() {
    this.path = '/sw.js';
    this.scope = '/';
    this.registered = false;
    this.swControlled = false;
  }
  checkRegistration() {
    navigator.serviceWorker.getRegistration().then(function(reg){
      if (reg) {
        console.log('Service worker registration confirmed');
        SW.register_button.classList.add("sw-status__registered--true")
        SW.register_button.textContent = "Registered";
        SW.registered = true;
      } else {
        console.log('No service worker registered');
        SW.register_button.classList.add("sw-status__registered--false")
        SW.register_button.textContent = "Unregistered";
        SW.registered = false;
      }
    }).catch(function(error) {
      console.log('Check registration promise error: ' + error);
    });
  }
  registerSW() {
    navigator.serviceWorker.register(SW.path, {scope: SW.scope}).then(function(sw){
      console.log('Registration succeeded. Scope is ' + sw.scope);
    }).catch(function(error) {
      console.log('Registration failed with ' + error);
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
