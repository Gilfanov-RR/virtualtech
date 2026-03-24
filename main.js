import { Engine } from './engine.js';

const app = new Engine();

//Свет
const sunLight = new THREE.DirectionalLight(0xffffff, 0.5);
const sunLight2 = new THREE.DirectionalLight(0xffffff, 0.7);
const sunLight3 = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(1, 10, 7.5);
sunLight2.position.set(-3, 15, 3);
sunLight3.position.set(0, 0, 12);
app.scene.add( sunLight, sunLight2, sunLight3);

//Пол
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshStandardMaterial({ color: 0xb0a9ab})
);
plane.rotation.x = -Math.PI / 2;
app.scene.add(plane);

//Куб
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x8a677e})
);
cube.position.y = 2; 
app.scene.add(cube);

//Анимацию с передачей логики вращения
app.start(() => {
    cube.rotation.y += 0.005;
    cube.rotation.z += 0.005;
});