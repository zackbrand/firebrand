// Instantiate classes
let SW    = new SERVICEWORKER;
let Cache = new CACHE;
let CL    = new CEELO;

// Once DOM has loaded
document.addEventListener("DOMContentLoaded", function(event) { 

  // Service Worker ///////////////////////////////////////////////
    if ('serviceWorker' in navigator) {

      // Setup
      SW.register_button = document.querySelector(".sw-status__register-button");
      SW.checkRegistration();
      SW.checkControl();
      
      // Register / unregister service worker when button is clicked 
      SW.register_button.addEventListener('click', function() {
        if (!SW.registered) SW.register();
        else SW.unregister();
      }, false); // false disables default click behavior

    } else {
      alert("Service Workers not supported!");
    } // End if ('serviceWorker' in navigator)

  // Cache ////////////////////////////////////////////////////////
    
    // Setup
    Cache.install_button = document.querySelector(".cache-status__install-button");
    Cache.checkCache();

    // Install service worker when button is clicked 
    Cache.install_button.addEventListener('click', function() {
      if (!Cache.cached) Cache.installCache();
      else Cache.deleteCache();
    }, false); // false disables default click behavior

  // Cee-lo ///////////////////////////////////////////////////////

    // Setup
    CL.setPoint = document.querySelector(".set-point");
    CL.dice     = document.querySelector(".dice");
    CL.roll     = document.querySelector(".roll");

    CL.createDice();
    CL.allDice  = document.getElementsByClassName("dice__die");

    // Roll dice when button is clicked 
    CL.roll.addEventListener('click', function() {
      CL.rollResults          = CL.rollDice();
      CL.matches              = CL.findMatches();
      CL.setPoint.textContent = CL.determineResults();
    }, false); // false disables default click behavior

});
