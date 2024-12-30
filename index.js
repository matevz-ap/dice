import { displayDice } from './display.js';
import { roll } from './roll.js';
const games = {
    "legion": {
        "red_defence": ["", "", "block", "block", "defSurge"],
        "white_defence": ["", "", "", "", "block", "defSurge"],
        "red_offence": ["", "atkSurge", "crit", "hit", "hit", "hit", "hit", "hit"],
        "white_offence": ["", "", "", "", "", "atkSurge", "crit", "hit"],
    },
    "armada": {
        "red": ["", "", "hit", "hit", "hit", "accuracy", "crit", "crit"],
        "blue": ["hit", "hit", "hit", "accuracy", "accuracy", "crit", "crit", "crit"],
        "black": ["", "", "hit", "hit", "crit", "crit", "crit", "crit"],
    },
}

const select = document.getElementById("game");
const rollButton = document.getElementById("roll");

select.onchange = function() {
    const dice = games[select.value];
    const diceContainer = document.getElementById("diceList");
    diceContainer.innerHTML = ""; // Clear previous dice
    
    for (const [type, faces] of Object.entries(dice)) {
        diceContainer.appendChild(displayDice(type, faces, select.value));
    }
}

rollButton.addEventListener("click", function() {
    let rolls = document.getElementById("rolls");
    rolls.innerHTML = "";

    for (const [type, faces] of Object.entries(games[select.value])) {
        const rollElement = document.createElement("img");
        rollElement.src = `static/img/dice/${select.value}/${roll(faces)}.webp`;
        rolls.appendChild(rollElement);
    }
});