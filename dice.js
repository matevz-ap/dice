import { createDice, rotateDice } from "./geometry.js";

export class Face {
    constructor(dice, value) {
        this.dice = dice;
        this.value = value;
    }

    texture() {
        console.log(this.value);
        if (!this.value) return null;
        else if (this.dice.diceSet.game == "custom") return `static/img/dice/custom/${this.value}.png`;
        return `static/img/dice/${this.dice.diceSet.game}/${this.value}.png`;
    }
}

export class Dice {
    constructor(diceSet, type, faces, color = 0xffffff) {
        this.diceSet = diceSet;
        this.type = type;
        this.mesh = null;
        this.color = color;
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
        this.mesh = createDice(this.diceSet.scene, -3 + index * 2, 0, 0, faces, this.color);
        return this.mesh;
    }
}

export class DiceSet {
    constructor(game, scene, dice, colors = {}) {
        this.game = game;
        this.scene = scene;
        this.diceMeshes = [];
        this.colors = colors;
        this.dice = this.initDice(dice);
    }

    initDice(dice) {
        const diceSet = [];
        for (const [type, faces] of Object.entries(dice)) {
            const color = this.colors[type] || 0xffffff;
            diceSet.push(new Dice(this, type, faces, color));
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