import { createDice, rotateDice } from "./geometry.js";

export class Face {
    constructor(dice, value) {
        this.dice = dice;
        this.value = value;
    }

    texture() {
        if (!this.value) return  "static/img/dice/empty.jpeg";
        else if (this.dice.diceSet.game == "custom") return `static/img/dice/custom/${this.value}.png`;
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
    constructor(game, scene, dice) {
        this.game = game;
        this.scene = scene;
        this.diceMeshes = [];
        this.dice = this.initDice(dice);
    }

    initDice(dice) {
        const diceSet = [];
        for (const [type, faces] of Object.entries(dice)) {
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