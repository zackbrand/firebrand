class CEELO {
  constructor() {
    this.rollResults = "";
    this.matches = "";
    this.potentialPoints = "";
    this.dice = "";
    this.setPoint = "";
    this.roll = "";
    this.allDice = "";
  }
  createDice(amount = 3) {
    // Load placeholder dice into DOM
    for (let index = 0; index < amount; index++) {
      const dieDiv = document.createElement("div");
      dieDiv.classList.add("dice__die");
      dieDiv.classList.add("dice__die-" + (index + 1)); // dice_die-1, etc
      const placeholderContent = document.createTextNode("6");
      dieDiv.appendChild(placeholderContent);
      CL.dice.appendChild(dieDiv);
    }
  }
  rollDice() {
    console.log("rolling dice");
    // Roll each die and put the results into an array
    let rollResults = [];
    Array.prototype.forEach.call(CL.allDice, function (die) {
      const rollResult = Math.floor(Math.random() * 6 + 1);
      die.textContent = rollResult;
      // push each result to an array
      rollResults.push(rollResult);
    });
    return rollResults;
  }
  findMatches() {
    // Sort results so matches will be adjacent
    let sortedRolls = CL.rollResults.slice().sort();

    // Clone results into an array of potential set points
    CL.potentialPoints = sortedRolls.slice();

    // Find matches by comparing each result
    let matches = [];
    for (let i = 0; i < CL.rollResults.length - 1; i++) {
      if (sortedRolls[i] == sortedRolls[i + 1]) {
        // count each match by pushing it to the matches array
        matches.push(sortedRolls[i]);
        // exclude the match from potential set points
        CL.potentialPoints.splice(i, 2);
      }
    }
    return matches;
  }
  determineResults() {
    // Results from checking for matches
    const rolledDoubles = CL.matches[0];
    const rolledTriples = CL.matches[1];
    if (rolledTriples) {
      //alert("You Win!")
      CL.dice.classList.add("dice--win");
    } else if (rolledDoubles) {
      // the single will be the remaining potential point
      const single = CL.potentialPoints[0];
      CL.dice.classList.add("dice--pair");
      CL.dice.classList.remove("dice--win");
      return single;
    } else {
      CL.dice.classList.remove(["dice--pair"], ["dice--win"]);
      const pointMax = Math.max.apply(null, CL.rollResults);
      return pointMax;
    }
  }
} // End class CEELO
class SERVICEWORKER {
  constructor() {
    this.path = '/sw.js';
    this.scope = '/';
    this.currentCache = "v1";
    this.swRegistered = false;
    this.swCache = false;
    this.swControlled = false;
    this.swInstall = "";
  }
  registerSW() {
    navigator.serviceWorker.register(SW.path, { scope: SW.scope }).then(function (sw) {
      console.log('Registration succeeded. Scope is ' + sw.scope);
    }).catch(function (error) {
      console.log('Registration failed with ' + error);
    });
  }
  checkRegistration() {
    navigator.serviceWorker.getRegistration().then(function (reg) {
      if (reg) {
        console.log('Service worker registration confirmed');
        SW.swRegistered = true;
      } else {
        console.log('No service worker registered');
        SW.swRegistered = false;
      }
      SW.registered.textContent = "Registered: " + SW.swRegistered;
    }).catch(function (error) {
      console.log('Check registration promise error: ' + error);
    });
  }
  unregisterSW() {
    navigator.serviceWorker.register(SW.path, { scope: SW.scope }).then(function (sw) {
      sw.unregister().then(function () {
        console.log('Service Worker unregistered');
      });
    }).catch(function (error) {
      console.log('Registration failed with ' + error);
    });
  }
  installCache() {
    const filesToCache = ['/'];
    caches.open(SW.currentCache).then(function (cache) {
      console.log("SW: Installing initial cache");
      return cache.addAll(filesToCache);
    });
  }
  checkCache() {
    // Check against cache first
    caches.match('/').then(function (resp) {
      console.log(resp);
      if (resp) {
        console.log("Cache True");
        SW.cache.textContent = "Cache: matched";
      } else {
        console.log("Cache False");
        SW.cache.textContent = "Cache: false";
      }
    });
  }
  deleteCache() {
    console.log('Trying to delete cache');
    caches.open(SW.currentCache).then(function (cache) {
      cache.delete('/').then(function (response) {
        console.log('Cache deleted');
      });
    }).catch(function (error) {
      console.log('Cache delete failed' + error);
    });
  }
  cleanCache() {
    const cacheWhitelist = [currentCache];
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log("SW: Deleting old cache");
          return caches.delete(key);
        }
      }));
    });
  }
  fetchCache() {
    // Intercept asset requests
    event.respondWith(

    // Check against cache first
    caches.match(event.request).then(function (resp) {

      if (resp) console.log("SW: Resource loaded from cache");
      return resp || // If that isnt truthy 

      // Then fetch from the network
      fetch(event.request).then(function (response) {
        console.log("SW: Requested resource not yet cached, caching now");
        return caches.open(currentCache).then(function (cache) {
          // Add newly found content to the cache
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })); // End respondWith    
  }
} // End class

// Instantiate classes
let SW = new SERVICEWORKER();
let CL = new CEELO();

// Once DOM has loaded
document.addEventListener("DOMContentLoaded", function (event) {

  // SW Status ///////////////////////////////////////////////

  if ('serviceWorker' in navigator) {

    // Setup
    SW.registered = document.querySelector(".sw-status__registered");
    SW.cache = document.querySelector(".sw-status__cache");
    SW.controlled = document.querySelector(".sw-status__controlled");
    SW.register = document.querySelector(".sw-status__register");
    SW.unregister = document.querySelector(".sw-status__unregister");
    SW.install = document.querySelector(".sw-status__install");
    SW.delete = document.querySelector(".sw-status__delete");

    SW.checkRegistration();
    console.log(SW.swRegistered);
    SW.controlled.textContent = "Controlled: " + navigator.serviceWorker.controller;

    SW.checkCache();

    // Install service worker when button is clicked 
    SW.register.addEventListener('click', function () {
      SW.registerSW();
    }, false); // false disables default click behavior

    // Install service worker when button is clicked 
    SW.unregister.addEventListener('click', function () {
      SW.unregisterSW();
    }, false); // false disables default click behavior

    // Install service worker when button is clicked 
    SW.install.addEventListener('click', function () {
      SW.installCache();
    }, false); // false disables default click behavior

    // Install service worker when button is clicked 
    SW.delete.addEventListener('click', function () {
      SW.deleteCache();
    }, false); // false disables default click behavior
  } else {
    alert("Service Workers not supported!");
  } // End if ('serviceWorker' in navigator)

  ////////////////////////////////////////////////////////////

  // Cee-lo //////////////////////////////////////////////////
  // Setup
  CL.setPoint = document.querySelector(".set-point");
  CL.dice = document.querySelector(".dice");
  CL.roll = document.querySelector(".roll");

  CL.createDice();
  CL.allDice = document.getElementsByClassName("dice__die");

  // Roll dice when button is clicked 
  CL.roll.addEventListener('click', function () {
    CL.rollResults = CL.rollDice();
    CL.matches = CL.findMatches();
    CL.setPoint.textContent = CL.determineResults();
  }, false); // false disables default click behavior
  ////////////////////////////////////////////////////////////
});
