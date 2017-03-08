class SW_HELPER {
  constructor() {
    this.path = '/sw.js';
    this.scope = '/';
    this.registered = false;
    this.register_button = "";
  }
  checkRegistration() {
    navigator.serviceWorker.getRegistration().then(function(reg){
      if (reg) {
        SWH.register_button.classList.add("sw-status__registered--true")
        SWH.register_button.textContent = "Registered";
        SWH.registered = true;
      } else {
        SWH.register_button.classList.add("sw-status__registered--false")
        SWH.register_button.textContent = "Unregistered";
        SWH.registered = false;
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
    navigator.serviceWorker.register(this.path, {scope: this.scope}).then(function(sw){
      location.reload();
    }).catch(function(error) {
      console.log('Registration failed with ' + error);
    });
  }
  unregister() {
    navigator.serviceWorker.register(this.path,{scope: this.scope}).then(function(sw){
      sw.unregister().then(function(){
        location.reload();
      });
    }).catch(function(error) {
      console.log('Registration failed with ' + error);
    });
  }
} // End class
