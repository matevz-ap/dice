const radius = 1.5; // Size of the dice

export function createDice(scene, x, y, z, faces) {
    let textures = [];
    for (const face of faces) {
        textures.push(new THREE.TextureLoader().load(face));
    }
    // Geometry for the dice (cube)
    const geometry = new THREE.BoxGeometry(radius, radius, radius);

    // Create an array of materials from the loaded textures. MeshStandardMaterial
    // allows lighting to have an effect on the dice, giving it a more
    // realistic appearance compared to MeshBasicMaterial.
    const materials = textures.map(
        texture => new THREE.MeshStandardMaterial({ map: texture })
    );

    // Wrap the dice mesh in a group so we can add decorative edges while still
    // returning a single object that can be rotated by the rest of the code.
    const dice = new THREE.Mesh(geometry, materials);
    const diceGroup = new THREE.Group();
    diceGroup.add(dice);

    // Add black edges to make the dice stand out a little more.
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0x000000 })
    );
    diceGroup.add(line);

    // Set the position of the dice based on the passed x, y, z
    diceGroup.position.set(x, y, z);
    diceGroup.rotation.x = Math.PI / 5;
    diceGroup.rotation.y = Math.PI / 5;

    // Add the dice to the scene
    scene.add(diceGroup);
    return diceGroup;
}

export function rotateDice(dice) {
    const rotations = [
        [0, 0, 0],              // Front face
        [Math.PI, 0, 0],        // Back face
        [0, Math.PI / 2, 0],    // Right face
        [0, -Math.PI / 2, 0],   // Left face
        [Math.PI / 2, 0, 0],    // Top face
        [-Math.PI / 2, 0, 0]    // Bottom face
      ];

    // Randomly pick one of the rotations
    const random = Math.floor(Math.random() * rotations.length);
    const [x, y, z] = rotations[random];

    dice.rotation.set(x, y, z);
}
