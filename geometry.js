const size = 1.5; // Size of the dice

function createRoundedBoxGeometry(length, radius = 0.15, smoothness = 2) {
    const shape = new THREE.Shape();
    const eps = 0.00001;
    const radius0 = radius - eps;
    const l = length - radius * 2;

    shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
    shape.absarc(eps, l + eps, eps, Math.PI, Math.PI / 2, true);
    shape.absarc(l + eps, l + eps, eps, Math.PI / 2, 0, true);
    shape.absarc(l + eps, eps, eps, 0, -Math.PI / 2, true);

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: l,
        bevelEnabled: true,
        bevelSegments: smoothness * 2,
        steps: 1,
        bevelSize: radius0,
        bevelThickness: radius,
        curveSegments: smoothness,
    });

    geometry.center();
    return geometry;
}

export function createDice(scene, x, y, z, faces) {
    const loader = new THREE.TextureLoader();
    const textures = faces.map(face => loader.load(face));

    // Geometry for the dice with rounded edges
    const geometry = createRoundedBoxGeometry(size, 0.2, 3);

    // Use MeshStandardMaterial for realistic shading
    const materials = textures.map(texture =>
        new THREE.MeshStandardMaterial({
            map: texture,
            color: 0xffffff,
            roughness: 0.5,
            metalness: 0.2,
        })
    );

    const dice = new THREE.Mesh(geometry, materials);
    dice.castShadow = true;

    // Group allows returning a single object if extra decoration is needed
    const group = new THREE.Group();
    group.add(dice);

    // Subtle edges for a clean modern look
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0x333333 })
    );
    group.add(line);

    group.position.set(x, y, z);
    group.rotation.x = Math.PI / 5;
    group.rotation.y = Math.PI / 5;

    scene.add(group);
    return group;
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
