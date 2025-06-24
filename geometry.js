// Dice size is a bit larger on desktop screens
function getDiceSize() {
    return window.innerWidth < 768 ? 1.5 : 2;
}

// Create a box geometry with slightly rounded edges by adjusting the vertices
// of a regular BoxGeometry. "radius" controls how far the corners are rounded
// and "smoothness" controls the number of segments along each axis.
function createRoundedBoxGeometry(size, radius = 0.2, smoothness = 3) {
    const geometry = new THREE.BoxGeometry(
        size,
        size,
        size,
        smoothness,
        smoothness,
        smoothness,
    );

    const position = geometry.attributes.position;
    const vertex = new THREE.Vector3();
    const halfSize = size / 2;

    for (let i = 0; i < position.count; i++) {
        vertex.fromBufferAttribute(position, i);

        const sign = new THREE.Vector3(
            Math.sign(vertex.x),
            Math.sign(vertex.y),
            Math.sign(vertex.z),
        );

        const inner = new THREE.Vector3(
            sign.x * (halfSize - radius),
            sign.y * (halfSize - radius),
            sign.z * (halfSize - radius),
        );

        vertex.sub(inner).normalize().multiplyScalar(radius).add(inner);

        position.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    geometry.computeVertexNormals();
    return geometry;
}

export function createDice(scene, x, y, z, faces, diceColor = 0xffffff) {
    const loader = new THREE.TextureLoader();

    // Build a geometry with rounded edges so the dice look more realistic
    const size = getDiceSize();
    const baseGeometry = createRoundedBoxGeometry(size, size * 0.15, 3);

    // Base cube material represents the edges of the dice
    const baseMaterial = new THREE.MeshStandardMaterial({
        color: diceColor,
    });

    const diceBase = new THREE.Mesh(baseGeometry, baseMaterial);
    diceBase.castShadow = true;

    const group = new THREE.Group();
    group.add(diceBase);

    const faceSize = size * 0.9; // Slightly smaller so edges remain visible
    const planeGeom = new THREE.PlaneGeometry(faceSize, faceSize);

    const transforms = [
        { pos: [0, 0, size / 2 + 0.01], rot: [0, 0, 0] },                // Front
        { pos: [0, 0, -size / 2 - 0.01], rot: [0, Math.PI, 0] },         // Back
        { pos: [size / 2 + 0.01, 0, 0], rot: [0, -Math.PI / 2, 0] },     // Right
        { pos: [-size / 2 - 0.01, 0, 0], rot: [0, Math.PI / 2, 0] },     // Left
        { pos: [0, size / 2 + 0.01, 0], rot: [-Math.PI / 2, 0, 0] },     // Top
        { pos: [0, -size / 2 - 0.01, 0], rot: [Math.PI / 2, 0, 0] },     // Bottom
    ];

    for (let i = 0; i < 6; i++) {
        const face = faces[i] || "";
        let material;

        if (
            face &&
            face !== "" &&
            face.includes(".") &&
            (face.includes(".png") || face.includes(".jpg") || face.includes(".jpeg") || face.includes(".webp"))
        ) {
            const texture = loader.load(face);
            material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                map: texture,
                transparent: true,
            });
        } else {
            const materialColor = face === "" ? 0xffffff : diceColor;
            material = new THREE.MeshBasicMaterial({
                color: materialColor,
            });
        }

        const plane = new THREE.Mesh(planeGeom.clone(), material);
        plane.position.set(...transforms[i].pos);
        plane.rotation.set(...transforms[i].rot);
        group.add(plane);
    }

    group.position.set(x, y, z);
    group.rotation.x = Math.PI / 5;
    group.rotation.y = Math.PI / 5;

    scene.add(group);
    return group;
}

export const animations = [];

export function rotateDice(dice) {
    const rotations = [
        [0, 0, 0],              // Front face
        [Math.PI, 0, 0],        // Back face
        [0, Math.PI / 2, 0],    // Right face
        [0, -Math.PI / 2, 0],   // Left face
        [Math.PI / 2, 0, 0],    // Top face
        [-Math.PI / 2, 0, 0]    // Bottom face
    ];

    const random = Math.floor(Math.random() * rotations.length);
    const [x, y, z] = rotations[random];

    const start = dice.quaternion.clone();
    const end = new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z));

    if (start.angleTo(end) < 0.0001) {
        animations.push({
            mesh: dice,
            start,
            axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
            angle: Math.PI * 2,
            startTime: performance.now(),
            duration: 300
        });
    } else {
        animations.push({
            mesh: dice,
            start,
            end,
            startTime: performance.now(),
            duration: 300
        });
    }
}

export function updateAnimations(time) {
    for (let i = animations.length - 1; i >= 0; i--) {
        const anim = animations[i];
        const t = Math.min(1, (time - anim.startTime) / anim.duration);
        if (anim.axis) {
            anim.mesh.quaternion.copy(anim.start);
            const q = new THREE.Quaternion().setFromAxisAngle(anim.axis, anim.angle * t);
            anim.mesh.quaternion.multiply(q);
        } else {
            const qm = new THREE.Quaternion();
            qm.slerpQuaternions(anim.start, anim.end, t);
            anim.mesh.quaternion.copy(qm);
        }
        if (t >= 1) {
            animations.splice(i, 1);
        }
    }
}
