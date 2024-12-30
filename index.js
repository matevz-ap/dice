import { roll } from './roll.js';
const games = {
    "legion": {
        "red_defence": ["-", "-", "shield", "shield", "surge"],
        "white_defence": ["-", "-", "-", "-", "shield", "surge"],
        "red_offence": ["-", "surge", "crit", "hit", "hit", "hit", "hit", "hit"],
        "white_offence": ["-", "-", "-", "-", "-", "surge", "crit", "hit"],
    }
}

const select = document.getElementById("game");
const rollButton = document.getElementById("roll");

select.onchange = function() {
    const dice = games[select.value];
    const diceContainer = document.getElementById("diceList");
    diceContainer.innerHTML = ""; // Clear previous dice

    for (const [type, faces] of Object.entries(dice)) {
        const diceElement = document.createElement("div");
        diceElement.classList.add("dice");
        diceElement.innerHTML = `<strong>${type}</strong>: ${faces.join(", ")}`;
        diceContainer.appendChild(diceElement);
    }
}

rollButton.addEventListener("click", function() {
    let rolls = [];
    for (const [type, faces] of Object.entries(games[select.value])) {
        rolls.push(roll(faces));
    }
    alert(`You rolled: ${rolls.join(", ")}`);
});