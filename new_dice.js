import { DiceSet } from './dice.js';

const dices = document.querySelector('#dice_set_form .dices');

function storeDiceSet(diceSetName, dice) {   
    let diceSets = JSON.parse(window.localStorage.getItem('dice_sets')) || {};
    diceSets[diceSetName] = dice;
    window.localStorage.setItem("dice_sets", JSON.stringify(diceSets));
}

export function loadDiceSets() {
    let diceSets = JSON.parse(window.localStorage.getItem('dice_sets')) || {};
    let select = document.getElementById('game');
    for (const diceSet in diceSets) {
        let option = document.createElement("option");
        option.text = diceSet;
        option.value = diceSet;
        select.add(option);
    }
}

export function loadDiceSet(diceSetName, scene) {
    let diceSets = JSON.parse(window.localStorage.getItem('dice_sets')) || {};
    if (diceSetName in diceSets) {
        return new DiceSet("custom", scene, diceSets[diceSetName]);
    }
}

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

    storeDiceSet(diceSetName, dice);
    return new DiceSet("custom", scene, dice);
}

export function addDice() {
    let diceForm = document.createElement("input");
    diceForm.classList = "input input-bordered w-full";
    diceForm.type = "number";
    diceForm.placeholder = "Number of faces";
    diceForm.id = `dice_${dices.children.length}`;
    dices.appendChild(diceForm);
}


