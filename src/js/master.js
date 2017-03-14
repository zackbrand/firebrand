// Instantiate classes
let SWH   = new SW_HELPER;
let Cache = new CACHE;
let Ceelo = new CEELO;

// Once DOM has loaded
document.addEventListener("DOMContentLoaded", function(event) { 

  // If browser supports service workers
  if ('serviceWorker' in navigator) {
  
    // Service Worker ///////////////////////////////////////////////

      // Setup
      SWH.register_button = document.querySelector(".sw-status__register-button");
      SWH.checkRegistration();
      SWH.checkControl();
      
      // Register / unregister service worker when button is clicked 
      SWH.register_button.addEventListener('click', function() {
        if (!SWH.registered) SWH.register();
        else SWH.unregister();
      }, false); // false disables default click behavior

    // Cache ////////////////////////////////////////////////////////
       
       // Setup
      Cache.install_button = document.querySelector(".cache-status__install-button");
      Cache.check();

      // Install service worker when button is clicked 
      Cache.install_button.addEventListener('click', function() {
        if (!Cache.cached) Cache.install();
        else Cache.delete();
      }, false); // false disables default click behavior

  } else { // If browser does not support service workers
    //alert("Service Workers not supported!");
    document.querySelector(".sw-warning").classList.add("sw-warning--triggered");
    document.querySelector(".sw-status").classList.add("sw-unsupported");
    document.querySelector(".cache-status").classList.add("sw-unsupported");
  } // End if ('serviceWorker' in navigator)

  // Cee-lo ///////////////////////////////////////////////////////

    // Setup
    Ceelo.setPoint = document.querySelector(".set-point");
    Ceelo.dice     = document.querySelector(".dice");
    Ceelo.roll     = document.querySelector(".roll");

    Ceelo.createDice();
    Ceelo.allDice  = document.getElementsByClassName("dice__die");

    // Roll dice when button is clicked 
    Ceelo.roll.addEventListener('click', function() {
      Ceelo.rollResults          = Ceelo.rollDice();
      Ceelo.matches              = Ceelo.findMatches();
      Ceelo.setPoint.textContent = Ceelo.determineResults();
    }, false); // false disables default click behavior

});
