class CACHE {
  constructor() {
    this.currentCache = "v1";
    this.cached = false;
  }
  checkCache() {
    caches.match('/').then(function (resp) {
      if (resp) {
        Cache.install_button.classList.add("cache-status__install--true");
        Cache.install_button.textContent = "Cached";
        Cache.cached = true;
      } else {
        Cache.install_button.classList.add("cache-status__install--false");
        Cache.install_button.textContent = "Uncached";
        Cache.cached = false;
      }
    });
  }
  installCache() {
    const filesToCache = ['/'];
    caches.open(Cache.currentCache).then(function (cache) {
      console.log("SW: Installing initial cache");
      cache.addAll(filesToCache);
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
    this.registered = false;
  }
  checkRegistration() {
    navigator.serviceWorker.getRegistration().then(function (reg) {
      if (reg) {
        console.log('Service worker registration confirmed');
        SW.register_button.classList.add("sw-status__registered--true");
        SW.register_button.textContent = "Registered";
        SW.registered = true;
      } else {
        console.log('No service worker registered');
        SW.register_button.classList.add("sw-status__registered--false");
        SW.register_button.textContent = "Unregistered";
        SW.registered = false;
      }
    }).catch(function (error) {
      console.log('Check registration promise error: ' + error);
    });
  }
  registerSW() {
    navigator.serviceWorker.register(SW.path, { scope: SW.scope }).then(function (sw) {
      console.log('Registration succeeded. Scope is ' + sw.scope);
    }).catch(function (error) {
      console.log('Registration failed with ' + error);
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
  checkControl() {
    if (navigator.serviceWorker.controller) {
      document.querySelector("body").classList.add("sw-controlled");
    }
  }
}

let SW = new SERVICEWORKER();
let Cache = new CACHE();
let CL = new CEELO();

document.addEventListener("DOMContentLoaded", function (event) {

  if ('serviceWorker' in navigator) {

    SW.register_button = document.querySelector(".sw-status__register-button");
    SW.checkRegistration();
    SW.checkControl();

    SW.register_button.addEventListener('click', function () {
      if (!SW.registered) {
        SW.registerSW();
      } else {
        SW.unregisterSW();
      }
      setTimeout(function () {
        location.reload();
      }, 200);
    }, false);
  } else {
    alert("Service Workers not supported!");
  }

  Cache.install_button = document.querySelector(".cache-status__install-button");

  Cache.checkCache();

  Cache.install_button.addEventListener('click', function () {
    if (!Cache.cached) {
      Cache.installCache();
    } else {
      Cache.deleteCache();
    }
    setTimeout(function () {
      location.reload();
    }, 200);
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
