class SW_HELPER {
  constructor() {
    this.path = '/sw.js';
    this.scope = '/';
    this.registered = false;
    this.sw = navigator.serviceWorker;
    this.wrap = "";
    this.registerButton = "";
  }
  checkRegistration() {
    // Setup
    let regStatus = this.sw.getRegistration();
    let regResolved = registration => {
      if (registration) {
        console.log("Service Worker registered");
        this.registerButton.classList.add("sw-status__registered--true");
        this.registerButton.textContent = "Registered";
        this.registered = true;
      } else {
        console.log("Service Worker not registered");
        this.registerButton.classList.add("sw-status__registered--false");
        this.registerButton.textContent = "Unregistered";
        this.registered = false;
      }
    }
    let regRejected = reason => console.log('Registration rejected: '+reason);
    // Actions
    regStatus.then(regResolved,regRejected);
  }
  checkControl() {
    if (this.sw.controller) {
      this.wrap.classList.add("sw-controlled");
    }
  }
  register(unregister) {
    let registration = this.sw.register(this.path, {scope: this.scope});
    let regResolved = registration => {
      if (unregister) registration.unregister();
      location.reload();
    }
    let regRejected = reason => console.log('Registration rejected: '+reason);
    registration.then(regResolved,regRejected);
  }
  unregister() {
    this.register("unregister");
  }

} // End class
