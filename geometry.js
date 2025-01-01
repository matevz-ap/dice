const radius = 1; // Size of the dice

export function createDice(scene, x, y, z, faces) {
    let textures = [];
    for (const face of faces) {
        textures.push(new THREE.TextureLoader().load(face));
    }
    // Geometry for the dice (cube)
    const geometry = new THREE.BoxGeometry(radius, radius, radius);

    // Create an array of materials from the loaded textures
    const materials = textures.map(texture => new THREE.MeshBasicMaterial({ map: texture }));

    // Create the dice mesh
    const dice = new THREE.Mesh(geometry, materials);

    // Set the position of the dice based on the passed x, y, z
    dice.position.set(x, y, z);
    dice.rotation.x = Math.PI / 5;
    dice.rotation.y = Math.PI / 5;

    // Add the dice to the scene
    scene.add(dice);
    return dice;  
}