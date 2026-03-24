import { Engine } from './engine.js';

const app = new Engine();

//Свет
const sunLight = new THREE.DirectionalLight(0xffffff, 0.5);
const sunLight2 = new THREE.DirectionalLight(0xffffff, 0.7);
const sunLight3 = new THREE.DirectionalLight(0xffffff, 1);
const ambLight = new THREE.AmbientLight(0xffffff, 0.1);
sunLight.position.set(6, 12, 0);
sunLight2.position.set(-6, 12, -4);
sunLight3.position.set(3, 12, 12);
sunLight.castShadow = true;
sunLight2.castShadow = true;
sunLight3.castShadow = true;
app.scene.add( sunLight, sunLight2, sunLight3, ambLight);

//Пол
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshStandardMaterial({ color: 0xb0a9ab})
);
plane.castShadow = true;
plane.receiveShadow = true;
plane.rotation.x = -Math.PI / 2;
app.scene.add(plane);

//Куб
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x8a677e})
);
cube.castShadow = true;
cube.position.y = 2; 
app.scene.add(cube);

//Анимацию с передачей логики вращения
app.start(() => {
    cube.rotation.y += 0.005;
    cube.rotation.z += 0.005;
});