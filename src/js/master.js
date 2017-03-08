// Instantiate classes
let SWH   = new SW_HELPER;
let Cache = new CACHE;
let Ceelo = new CEELO;

// Once DOM has loaded
document.addEventListener("DOMContentLoaded", function(event) { 

  // Service Worker ///////////////////////////////////////////////
    if ('serviceWorker' in navigator) {

      // Setup
      SWH.register_button = document.querySelector(".sw-status__register-button");
      SWH.checkRegistration();
      SWH.checkControl();
      
      // Register / unregister service worker when button is clicked 
      SWH.register_button.addEventListener('click', function() {
        if (!SWH.registered) SWH.register();
        else SWH.unregister();
      }, false); // false disables default click behavior

    } else {
      alert("Service Workers not supported!");
    } // End if ('serviceWorker' in navigator)

  // Cache ////////////////////////////////////////////////////////
   
     // Setup
    Cache.install_button = document.querySelector(".cache-status__install-button");
    Cache.check();

    // Install service worker when button is clicked 
    Cache.install_button.addEventListener('click', function() {
      if (!Cache.cached) Cache.install();
      else Cache.delete();
    }, false); // false disables default click behavior

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
