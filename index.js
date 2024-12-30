import { DiceSet } from './dice.js';


const select = document.getElementById("game");
const rollButton = document.getElementById("roll");
let diceSet;

select.onchange = function() {
    diceSet = new DiceSet(select.value);
    const diceContainer = document.getElementById("diceList");
    diceContainer.innerHTML = ""; // Clear previous dice
    diceContainer.appendChild(diceSet.display());
}

rollButton.addEventListener("click", function() {
    let rolls = document.getElementById("rolls");
    rolls.innerHTML = "";

    for (const roll of diceSet.roll()) {
        rolls.appendChild(roll.display(diceSet.game));
    }
});