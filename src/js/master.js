// Instantiate classes
let SWH   = new SW_HELPER;
let Cache = new CACHE;
let Ceelo = new CEELO;

function swButtonActions() {
  // Setup
  SWH.wrap = document.querySelector(".wrap");
  SWH.registerButton = document.querySelector(".sw-status__register-button");
  SWH.checkRegistration();
  SWH.checkControl();
  function clickEvent() {
    if (!SWH.registered) SWH.register();
    else SWH.unregister();
  }
  SWH.registerButton.addEventListener('click', clickEvent);
}
function cacheButtonActions() {
  // Setup
  let cacheButtonClass = ".cache-status__install-button";
  Cache.installButton = document.querySelector(cacheButtonClass);
  Cache.check();
  let clickEvent = function(){
    if (!Cache.cached) Cache.install();
    else Cache.delete(); 
  }
  // Actions
  Cache.installButton.addEventListener('click', clickEvent);
}
function showSupportWarnings() {
  //alert("Service Workers not supported!");
  let warningElement     = document.querySelector(".sw-warning");
  let swStatusElement    = document.querySelector(".sw-status");
  let cacheStatusElement = document.querySelector(".cache-status");
  warningElement.classList.add("sw-warning--triggered");
  swStatusElement.classList.add("sw-unsupported");
  cacheStatusElement.classList.add("cache-unsupported");
}
function ceeLo() {
  // Setup
  Ceelo.setPoint = document.querySelector(".set-point");
  Ceelo.dice     = document.querySelector(".dice");
  Ceelo.roll     = document.querySelector(".roll");

  Ceelo.createDice();

  Ceelo.allDice  = document.getElementsByClassName("dice__die");

  function rollDice() {
    Ceelo.rollResults          = Ceelo.rollDice();
    Ceelo.matches              = Ceelo.findMatches();
    Ceelo.setPoint.textContent = Ceelo.determineResults();
  }

  // Roll dice when button is clicked 
  Ceelo.roll.addEventListener('click', rollDice);
}

// Once DOM has loaded
document.addEventListener("DOMContentLoaded", function(){

  // If browser supports service workers
  if ('serviceWorker' in navigator) {
    swButtonActions();
    cacheButtonActions();
  } 
  else showSupportWarnings();

  // Add Cee-Lo game
  ceeLo();

}); // end DOMContentLoaded
