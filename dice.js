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
        faceElement.style.width = "50px";
        faceElement.classList.add("face");
    
        if (!this.value) {
            faceElement.src = "static/img/dice/empty.webp";
            return faceElement;
        }
        
        faceElement.src = `static/img/dice/${game}/${this.value}.webp`;
        return faceElement;
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

    display(game) {
        const diceElement = document.createElement("div");
        diceElement.innerHTML = `<strong>${this.type}</strong>:`;
        diceElement.classList.add("dice");
        for (const face of this.faces) {
            diceElement.appendChild(face.display(game));
        }
        return diceElement;
    }
}

export class DiceSet {
    constructor(game) {
        this.game = game;
        this.dice = this.initDice(games[game]);
    }

    initDice(dice) {
        const diceSet = [];
        for (const [type, faces] of Object.entries(dice)) {
            diceSet.push(new Dice(type, faces));
        }
        return diceSet;
    }

    display() {
        const diceSet = document.createElement("div");
        diceSet.classList.add("diceSet");
        for (const dice of this.dice) {
            diceSet.appendChild(dice.display(this.game));
        }
        return diceSet;
    }

    roll() {
        const results = [];
        for (const dice of this.dice) {
            results.push(dice.roll());
        }
        return results;
    }
}