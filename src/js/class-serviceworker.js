class SERVICEWORKER {
  constructor() {
    this.path = '/sw.js';
    this.scope = '/';
    this.registered = false;
    this.register_button = "";
  }
  checkRegistration() {
    navigator.serviceWorker.getRegistration().then(function(reg){
      if (reg) {
        SW.register_button.classList.add("sw-status__registered--true")
        SW.register_button.textContent = "Registered";
        SW.registered = true;
      } else {
        SW.register_button.classList.add("sw-status__registered--false")
        SW.register_button.textContent = "Unregistered";
        SW.registered = false;
      }
    }).catch(function(error) {
      console.log('Check registration promise error: ' + error);
    });
  }
  checkControl() {
    if (navigator.serviceWorker.controller) {
      document.querySelector("body").classList.add("sw-controlled");
    }
  }
  register() {
    navigator.serviceWorker.register(SW.path, {scope: SW.scope}).then(function(sw){
      console.log('Registration succeeded. Scope is ' + sw.scope);
      location.reload();
    }).catch(function(error) {
      console.log('Registration failed with ' + error);
    });
  }
  unregister() {
    navigator.serviceWorker.register(SW.path,{scope: SW.scope}).then(function(sw){
      sw.unregister().then(function(){
        console.log('Service Worker unregistered');
        location.reload();
      });
    }).catch(function(error) {
        console.log('Registration failed with ' + error);
    });
  }
} // End class
