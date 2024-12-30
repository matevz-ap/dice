export function displayFace(face, game) {
    const faceElement = document.createElement("img");
    faceElement.style.width = "50px";
    faceElement.classList.add("face");

    if (!face) {
        faceElement.src = "static/img/dice/empty.png";
        return faceElement;
    }
    
    faceElement.src = `static/img/dice/${game}/${face}.webp`;
    return faceElement;
}

export function displayDice(type, faces, game) {
    const diceElement = document.createElement("div");
    diceElement.innerHTML = `<strong>${type}</strong>:`;
    diceElement.classList.add("dice");
    for (const face of faces) {
        diceElement.appendChild(displayFace(face, game));
    }
    return diceElement;
}