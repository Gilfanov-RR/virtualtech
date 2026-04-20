import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import { Engine } from './engine.js';
import { Scene } from './scene.js';
import { Entity } from './entity.js';
import { RotationComponent } from './components/RotationComponent.js';
import { PulseScaleComponent } from './components/PulseScaleComponent.js';

const engine = new Engine();
const scene = new Scene('MainScene');

scene.threeScene.background = new THREE.Color(0x202020);

const amb = new THREE.AmbientLight(0xffffff, 1);
const sun = new THREE.DirectionalLight(0xffffff, 0.5);
sun.position.set(0, 5, 0);
sun.castShadow = true;
scene.threeScene.add(amb, sun);

const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: 0xb0a9ab })
);
planeMesh.rotation.x = -Math.PI / 2;
planeMesh.receiveShadow = true;
scene.threeScene.add(planeMesh);

function createEntity(geom, color, x, y, z, name) {
  const mesh = new THREE.Mesh(geom, new THREE.MeshStandardMaterial({ color }));
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  const e = new Entity({ mesh, name });
  e.mesh.userData.origColor = new THREE.Color(color);
  e.mesh.userData.baseY = y;
  scene.addEntity(e);
  return e;
}

const cubeEntity = createEntity(new THREE.BoxGeometry(1,1,1), 0x8a677e, 0, 1, 0, 'Куб');
const cylEntity = createEntity(new THREE.CylinderGeometry(1,1,1), 0x8a674e, 3, 1, 0, 'Цилиндр');

cylEntity.addComponent(new RotationComponent({ axis: 'y', speed: 1 }));
cubeEntity.addComponent(new PulseScaleComponent({ speed: 3, amplitude: 0.15 }));

engine.addScene('main', scene);
engine.setActiveScene('main');

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hovered = null;
let selected = null;
let jumpTime = 0;

function updateHoverSelect(dt) {
  raycaster.setFromCamera(mouse, engine.camera);
  const meshes = scene.entities.map(e => e.mesh);
  const inters = raycaster.intersectObjects(meshes);
  if (inters.length > 0) {
    const obj = inters[0].object;
    if (hovered !== obj) {
      if (hovered) hovered.material.color.copy(hovered.userData.origColor);
      hovered = obj;
      hovered.material.color.set(0xffffff);
    }
  } else {
    if (hovered) hovered.material.color.copy(hovered.userData.origColor);
    hovered = null;
  }

  if (selected) {
    jumpTime += dt;
    selected.position.y = selected.userData.baseY + Math.abs(Math.cos(jumpTime)) * 0.5;
  }
}

scene.update = function(dt) {
  for (const e of this.entities) e.update(dt);
  updateHoverSelect(dt);
};

const rotateBtn = document.getElementById('rotate-btn');
let rotateFlag = false;
rotateBtn.addEventListener('click', () => rotateFlag = !rotateFlag);

let angle = 0;
const rad = 5;
engine.activeScene = scene;
engine.start();

function cameraUpdate() {
  if (rotateFlag) {
    angle += 0.01;
    engine.camera.position.x = rad * Math.cos(angle);
    engine.camera.position.z = rad * Math.sin(angle);
    engine.camera.lookAt(0, 0, 0);
  }
  requestAnimationFrame(cameraUpdate);
}
cameraUpdate();

window.addEventListener('mousemove', (ev) => {
  mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('click', () => {
  if (!hovered) return;
  if (selected && selected === hovered) {
    selected.position.y = selected.userData.baseY;
    selected = null;
  } else {
    if (selected && selected !== hovered) selected.position.y = selected.userData.baseY;
    selected = hovered;
    jumpTime = 0;
  }
  const nameEl = document.getElementById('obj-name');
  if (selected) nameEl.textContent = selected.name || selected.userData.name || '';
  else nameEl.textContent = '';
});
