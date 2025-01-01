import { createDice } from "./geometry.js";

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
    constructor(value) {
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

    texture(game) {
        if (!this.value) return  "static/img/dice/empty.jpeg";
        return `static/img/dice/${game}/${this.value}.webp`;
    }
}

export class Dice {
    constructor(type, faces, game) {
        this.game = game;
        this.type = type;
        this.faces = this.initFaces(faces);  
    }

    initFaces(faces) {
        const faceSet = [];
        for (const face of faces) {
            faceSet.push(new Face(face));
        }
        return faceSet;
    }

    roll() {
        return this.faces[Math.floor(Math.random() * this.faces.length)];
    }

    display(scene, index, game) {
        let faces = [];
        for (const face of this.faces) {
            faces.push(face.texture(game));
        }
        return createDice(scene, -3 + index * 2, 0, 0, faces);
    }
}

export class DiceSet {
    constructor(game) {
        this.game = game;
        this.dice = this.initDice(games[game]);
        this.diceMeshes = [];
    }

    initDice(dice) {
        const diceSet = [];
        for (const [type, faces] of Object.entries(dice)) {
            diceSet.push(new Dice(type, faces));
        }
        return diceSet;
    }

    display(scene) {
        for (let i = 0; i < this.dice.length; i++) {
            let diceMesh = this.dice[i].display(scene, i, this.game);
            this.diceMeshes.push(diceMesh);
        }
    }

    roll() {
        const results = [];
        for (const dice of this.dice) {
            results.push(dice.roll());
        }
        return results;
    }
}