import { DiceSet } from './dice.js';

const dices = document.querySelector('#dice_set_form .dices');

export function addDiceSet(scene) {
    let dice = {};
    let diceSetName = document.getElementById('dice_set_name').value;
    let diceForms = document.querySelectorAll('#dice_set_form .dices input');

    if (diceSetName == "") {
        return;
    }

    if (diceForms.length == 0) {
        return;
    }

    diceForms.forEach(diceForm => {
        dice[diceForm.id] = new Array(parseInt(diceForm.value)).fill(0).map((_, i) => i + 1);    
    });

    return new DiceSet("custom", scene, dice);
    // window.localStorage.setItem(diceSetName, JSON.stringify(dice));
}

export function addDice() {
    let diceForm = document.createElement("input");
    diceForm.classList = "input input-bordered w-full";
    diceForm.type = "number";
    diceForm.placeholder = "Number of faces";
    diceForm.id = `dice_${dices.children.length}`;
    dices.appendChild(diceForm);
}


