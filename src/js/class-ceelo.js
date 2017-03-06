class CEELO {
  constructor(){
    this.rollResults = "";
    this.matches = "";
    this.potentialPoints = "";
    this.dice = "";
    this.setPoint = "";
    this.roll = "";
    this.allDice = "";
  }
  createDice (amount = 3) {
    // Load placeholder dice into DOM
    for (let index = 0; index < amount; index++) {
      const dieDiv = document.createElement("div"); 
      dieDiv.classList.add("dice__die");
      dieDiv.classList.add("dice__die-"+(index+1)); // dice_die-1, etc
      const placeholderContent = document.createTextNode("6");
      dieDiv.appendChild(placeholderContent); 
      CL.dice.appendChild(dieDiv);
    }
  }
  rollDice() {
    console.log("rolling dice");
    // Roll each die and put the results into an array
    let rollResults = [];
    Array.prototype.forEach.call(CL.allDice, function(die) {
      const rollResult = Math.floor((Math.random() * 6) + 1);
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
    for (let i = 0; i < CL.rollResults.length-1; i++) {
      if (sortedRolls[i] == sortedRolls[i+1]) {
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
    }
    else if (rolledDoubles) {
      // the single will be the remaining potential point
      const single = CL.potentialPoints[0];
      CL.dice.classList.add("dice--pair");
      CL.dice.classList.remove("dice--win")
      return single;
    } else {
      CL.dice.classList.remove(["dice--pair"],["dice--win"]);
      const pointMax = Math.max.apply(null, CL.rollResults);
      return pointMax;
    }
  }
} // End class CEELO
