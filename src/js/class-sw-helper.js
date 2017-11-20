class SW_HELPER {
  constructor() {
    this.path = '/sw.js';
    this.scope = '/';
    this.registered = false;
    this.sw = navigator.serviceWorker;
    this.wrap = "";
    this.register_button = "";
  }
  isRegistered() {
    console.log("Service Worker registered");
    SWH.register_button.classList.add("sw-status__registered--true")
    SWH.register_button.textContent = "Registered";
    SWH.registered = true;
  }
  isNotRegistered() {
    console.log("Service Worker not registered");
    SWH.register_button.classList.add("sw-status__registered--false")
    SWH.register_button.textContent = "Unregistered";
    SWH.registered = false;
  }
  checkRegistration() {
    let getStatus = this.sw.getRegistration();
    let statusResolved = registration => {
      if (registration) this.isRegistered();
      else this.isNotRegistered();
    }
    let statusError = reason => {
      console.log('Check registration promise error: '+reason);
    }
    getStatus.then(statusResolved,statusError);
  }
  checkControl() {
    if (this.sw.controller) {
      this.wrap.classList.add("sw-controlled");
    }
  }
  register(unregister) {
    let registration = this.sw.register(this.path, {scope: this.scope});
    let registrationResolved = registration => {
      if (unregister) registration.unregister();
      location.reload();
    }
    let registrationError = reason => {
      console.log('Registration failed with: '+reason);
    }
    registration.then(registrationResolved,registrationError);
  }
  unregister() {
    this.register("unregister");
  }

} // End class
