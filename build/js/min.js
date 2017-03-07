class CACHE {
  constructor() {
    this.path = '/sw.js';
    this.scope = '/';
    this.currentCache = "v1";
    this.swCache = false;
    this.swInstall = "";
  }
  installCache() {
    const filesToCache = ['/'];
    caches.open(Cache.currentCache).then(function (cache) {
      console.log("SW: Installing initial cache");
      return cache.addAll(filesToCache);
    });
  }
  checkCache() {
    caches.match('/').then(function (resp) {
      console.log(resp);
      if (resp) {
        console.log("Cache True");
        Cache.cache.textContent = "Cache: matched";
      } else {
        console.log("Cache False");
        Cache.cache.textContent = "Cache: false";
      }
    });
  }
  deleteCache() {
    console.log('Trying to delete cache');
    caches.open(Cache.currentCache).then(function (cache) {
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
    event.respondWith(caches.match(event.request).then(function (resp) {

      if (resp) console.log("SW: Resource loaded from cache");
      return resp || fetch(event.request).then(function (response) {
        console.log("SW: Requested resource not yet cached, caching now");
        return caches.open(currentCache).then(function (cache) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    }));
  }
}
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
    for (let index = 0; index < amount; index++) {
      const dieDiv = document.createElement("div");
      dieDiv.classList.add("dice__die");
      dieDiv.classList.add("dice__die-" + (index + 1));
      const placeholderContent = document.createTextNode("6");
      dieDiv.appendChild(placeholderContent);
      CL.dice.appendChild(dieDiv);
    }
  }
  rollDice() {
    console.log("rolling dice");

    let rollResults = [];
    Array.prototype.forEach.call(CL.allDice, function (die) {
      const rollResult = Math.floor(Math.random() * 6 + 1);
      die.textContent = rollResult;

      rollResults.push(rollResult);
    });
    return rollResults;
  }
  findMatches() {
    let sortedRolls = CL.rollResults.slice().sort();

    CL.potentialPoints = sortedRolls.slice();

    let matches = [];
    for (let i = 0; i < CL.rollResults.length - 1; i++) {
      if (sortedRolls[i] == sortedRolls[i + 1]) {
        matches.push(sortedRolls[i]);

        CL.potentialPoints.splice(i, 2);
      }
    }
    return matches;
  }
  determineResults() {
    const rolledDoubles = CL.matches[0];
    const rolledTriples = CL.matches[1];
    if (rolledTriples) {
      CL.dice.classList.add("dice--win");
    } else if (rolledDoubles) {
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
}
class SERVICEWORKER {
  constructor() {
    this.path = '/sw.js';
    this.scope = '/';
    this.swRegistered = false;
    this.swControlled = false;
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
}

let SW = new SERVICEWORKER();
let Cache = new CACHE();
let CL = new CEELO();

document.addEventListener("DOMContentLoaded", function (event) {

    if ('serviceWorker' in navigator) {
        SW.registered = document.querySelector(".sw-status__registered");
        SW.controlled = document.querySelector(".sw-status__controlled");
        SW.register = document.querySelector(".sw-status__register");
        SW.unregister = document.querySelector(".sw-status__unregister");

        SW.checkRegistration();
        console.log(SW.swRegistered);
        SW.controlled.textContent = "Controlled: " + navigator.serviceWorker.controller;

        SW.register.addEventListener('click', function () {
            SW.registerSW();
        }, false);
        SW.unregister.addEventListener('click', function () {
            SW.unregisterSW();
        }, false);
    } else {
        alert("Service Workers not supported!");
    }

    Cache.cache = document.querySelector(".cache-status__cache");
    Cache.install = document.querySelector(".cache-status__install");
    Cache.delete = document.querySelector(".cache-status__delete");

    Cache.checkCache();

    Cache.install.addEventListener('click', function () {
        Cache.installCache();
    }, false);
    Cache.delete.addEventListener('click', function () {
        Cache.deleteCache();
    }, false);
    CL.setPoint = document.querySelector(".set-point");
    CL.dice = document.querySelector(".dice");
    CL.roll = document.querySelector(".roll");

    CL.createDice();
    CL.allDice = document.getElementsByClassName("dice__die");

    CL.roll.addEventListener('click', function () {
        CL.rollResults = CL.rollDice();
        CL.matches = CL.findMatches();
        CL.setPoint.textContent = CL.determineResults();
    }, false);
});
