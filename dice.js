import { createDice, rotateDice } from "./geometry.js";

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

export class Face {
    constructor(dice, value) {
        this.dice = dice;
        this.value = value;
    }

    display(game) {
        const faceElement = document.createElement("img");
        faceElement.style.width = "40px";
        faceElement.classList.add("face");
    
        if (!this.value) {
            faceElement.src = "static/img/dice/empty.jpeg";
            return faceElement;
        }
        
        faceElement.src = `static/img/dice/${game}/${this.value}.webp`;
        return faceElement;
    }

    texture() {
        if (!this.value) return  "static/img/dice/empty.jpeg";
        return `static/img/dice/${this.dice.diceSet.game}/${this.value}.webp`;
    }
}

export class Dice {
    constructor(diceSet, type, faces) {
        this.diceSet = diceSet;
        this.type = type;
        this.mesh = null;
        this.faces = this.initFaces(faces);  
    }

    initFaces(faces) {
        const faceSet = [];
        for (const face of faces) {
            faceSet.push(new Face(this, face));
        }
        return faceSet;
    }

    roll() {
        rotateDice(this.mesh);
    }

    display(index) {
        let faces = [];
        for (const face of this.faces) {
            faces.push(face.texture());
        }
        this.mesh = createDice(this.diceSet.scene, -3 + index * 2, 0, 0, faces);
        return this.mesh;
    }
}

export class DiceSet {
    constructor(game, scene) {
        this.game = game;
        this.scene = scene;
        this.diceMeshes = [];
        this.dice = this.initDice();
    }

    initDice() {
        const diceSet = [];
        for (const [type, faces] of Object.entries(games[this.game])) {
            diceSet.push(new Dice(this, type, faces));
        }
        return diceSet;
    }

    display() {
        for (let i = 0; i < this.dice.length; i++) {
            let diceMesh = this.dice[i].display(i);
            this.diceMeshes.push(diceMesh);
        }
    }

    roll() {
        for (const dice of this.dice) {
            dice.roll();
        }
    }
}