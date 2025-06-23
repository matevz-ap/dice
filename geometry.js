const size = 1.5; // Size of the dice

export function createDice(scene, x, y, z, faces, diceColor = 0xffffff) {
    const loader = new THREE.TextureLoader();
    
    const materials = [];
    for (let i = 0; i < 6; i++) {
        const face = faces[i] || "";
        
        if (face && face !== "" && face.includes('.') && (face.includes('.png') || face.includes('.jpg') || face.includes('.jpeg') || face.includes('.webp'))) {
            const texture = loader.load(face);
            
            const material = new THREE.MeshStandardMaterial({
                color: 0xC1C1C1,
                map: texture,
                transparent: true,
            });
            materials.push(material);
        } else {
            const materialColor = face === "" ? 0xffffff : diceColor;
            const material = new THREE.MeshBasicMaterial({
                color: materialColor,
            });
            materials.push(material);
        }
    }
    
    // Use BoxGeometry with more segments for subtle rounded edges
    const geometry = new THREE.BoxGeometry(size, size, size, 3, 3, 3);

    const dice = new THREE.Mesh(geometry, materials);
    dice.castShadow = true;

    const group = new THREE.Group();
    group.add(dice);

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
