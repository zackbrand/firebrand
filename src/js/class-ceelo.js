class CEELO {
  constructor(){
    this.rollResults     = "";
    this.matches         = "";
    this.potentialPoints = "";
    this.dice            = "";
    this.setPoint        = "";
    this.roll            = "";
    this.allDice         = "";
  }
  createDice (amount = 3) {
    // Load placeholder dice into DOM
    for (let index = 0; index < amount; index++) {
      const dieDiv = document.createElement("div"); 
      dieDiv.classList.add("dice__die");
      dieDiv.classList.add("dice__die-"+(index+1)); // dice_die-1, etc
      const placeholderContent = document.createTextNode("6");
      dieDiv.appendChild(placeholderContent); 
      this.dice.appendChild(dieDiv);
    }
  }
  rollDice() {
    console.log("rolling dice");
    // Roll each die and put the results into an array
    let rollResults = [];
    function roll(die) {
      const rollResult = Math.floor((Math.random() * 6) + 1);
      die.textContent = rollResult;
      // push each result to an array
      rollResults.push(rollResult);
    }
    Array.prototype.forEach.call(this.allDice, roll);
    return rollResults;
  }
  findMatches() {
    // Sort results so matches will be adjacent
    let sortedRolls = this.rollResults.slice().sort();
    
    // Clone results into an array of potential set points
    this.potentialPoints = sortedRolls.slice();
    
    // Find matches by comparing each result
    let matches = [];
    for (let i = 0; i < this.rollResults.length-1; i++) {
      if (sortedRolls[i] == sortedRolls[i+1]) {
        // count each match by pushing it to the matches array
        matches.push(sortedRolls[i]);
        // exclude the match from potential set points
        this.potentialPoints.splice(i, 2);
      }
    }
    return matches;
  }
  determineResults() {
    // Results from checking for matches
    const rolledDoubles = this.matches[0];
    const rolledTriples = this.matches[1];
    if (rolledTriples) {
      //alert("You Win!")
      this.dice.classList.add("dice--win");
    }
    else if (rolledDoubles) {
      // the single will be the remaining potential point
      const single = this.potentialPoints[0];
      this.dice.classList.add("dice--pair");
      this.dice.classList.remove("dice--win")
      return single;
    } else {
      this.dice.classList.remove(["dice--pair"],["dice--win"]);
      const pointMax = Math.max.apply(null, this.rollResults);
      return pointMax;
    }
  }
} // End class CEELO
