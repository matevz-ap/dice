import { DiceSet } from './dice.js';
import { addDiceSet, addDice, loadDiceSets, loadDiceSet } from './new_dice.js';

const select = document.getElementById("game");
const rollButton = document.getElementById("roll");
let diceSet;

// Setting up the Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("diceCanvas") });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera position
camera.position.z = 10;

// Rotation variables
let rotationX = 0;
let rotationY = 0;
let isTouching = false;
let lastX = 0;
let lastY = 0;
let lastRotationX = 0;
let lastRotationY = 0;

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

// Function to animate the scene (without automatic rotation)
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}


function rotateDiceSet(event) {
    if (!isTouching || event.touches.length !== 1) return; // Only one finger

    const x = event.touches[0].clientX;
    const y = event.touches[0].clientY;

    // Calculate the change in position since the last touch
    const dx = x - lastX;
    const dy = y - lastY;

    // Update rotation based on finger movement
    rotationX = lastRotationX + dy * 0.005;
    rotationY = lastRotationY + dx * 0.005;

    // Apply rotation to all dice objects in the scene
    diceSet.diceMeshes.forEach(dice => {
        dice.rotation.x = rotationX;
        dice.rotation.y = rotationY;
    });

    // Update the last positions
    lastX = x;
    lastY = y;
    lastRotationX = rotationX;
    lastRotationY = rotationY;
}

// Handle touch events to rotate the dice
function onTouchMove(event) {
    rotateDiceSet(event);
}

// Start touch interaction
document.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) { // Only respond to one finger
        isTouching = true;
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        lastRotationX = rotationX;
        lastRotationY = rotationY;
    }
});

// End touch interaction
document.addEventListener('touchend', () => {
    isTouching = false;
});

// Move touch interaction
document.addEventListener('touchmove', onTouchMove);

// Handle mouse events for desktop
document.addEventListener('mousedown', (e) => {
    isTouching = true;
    lastX = e.clientX;
    lastY = e.clientY;
    lastRotationX = rotationX;
    lastRotationY = rotationY;
});

document.addEventListener('mouseup', () => {
    isTouching = false;
});

document.addEventListener('mousemove', (e) => {
    if (!isTouching || diceSet == undefined) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;

    // Update rotation based on mouse movement
    rotationX = lastRotationX + dy * 0.005;
    rotationY = lastRotationY + dx * 0.005;

    // Apply rotation to all dice objects in the scene
    diceSet.diceMeshes.forEach(dice => {
        dice.rotation.x = rotationX;
        dice.rotation.y = rotationY;
    });

    lastX = e.clientX;
    lastY = e.clientY;
    lastRotationX = rotationX;
    lastRotationY = rotationY;
});

// Adjust the canvas size when the window is resized
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// // Add another dice when the button is clicked
// document.getElementById('addDiceButton').addEventListener('click', () => {
//     createDice(Math.random() * 5 - 2.5, Math.random() * 5 - 2.5, Math.random() * 5 - 2.5);
// });

// Start animation (without automatic rotation)
animate();



select.onchange = function() {
    scene.clear();
    if (games[select.value] == undefined) {
        diceSet = loadDiceSet(select.value, scene);
    } else {
        diceSet = new DiceSet(select.value, scene, games[select.value]);
    }
    diceSet.display()
}

rollButton.addEventListener("click", function() {
    diceSet.roll();
});

document.querySelector('#create_dice_set').addEventListener('click', () => {
    scene.clear();
    diceSet = addDiceSet(scene);
    diceSet.display();
    add_dice_modal.close();
});
document.querySelector('#add_dice').addEventListener('click', addDice);

document.onreadystatechange = function() {
    if (document.readyState === 'complete') {
        loadDiceSets();
    }
}