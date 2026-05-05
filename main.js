import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { VRButton } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/webxr/VRButton.js";

import { Engine } from './engine.js';
import { Scene } from './scene.js';
import { Entity } from './entity.js';
import { RotationComponent } from './components/RotationComponent.js';
import { PulseScaleComponent } from './components/PulseScaleComponent.js';

// --- Инициализация движка ---
const engine = new Engine({ clearColor: 0x111122 });
const mainScene = new Scene('MainScene');

// Устанавливаем фон с лёгким градиентом через текстуру? Просто цвет
mainScene.threeScene.background = new THREE.Color(0x111122);
mainScene.threeScene.fog = new THREE.FogExp2(0x111122, 0.03); // лёгкий туман для глубины

// --- Освещение (яркое, объёмное) ---
const ambientLight = new THREE.AmbientLight(0x404060, 0.7);
const mainLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
mainLight.position.set(5, 10, 3);
mainLight.castShadow = true;
mainLight.receiveShadow = true;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;

const fillLight = new THREE.PointLight(0x4466cc, 0.4);
fillLight.position.set(-2, 3, 4);

const backLight = new THREE.PointLight(0xffaa66, 0.3);
backLight.position.set(0, 2, -4);

mainScene.threeScene.add(ambientLight, mainLight, fillLight, backLight);

// --- Вспомогательная сетка на полу (необязательно, но красиво) ---
const gridHelper = new THREE.GridHelper(15, 20, 0x88aaff, 0x335588);
gridHelper.position.y = -0.01;
gridHelper.material.transparent = true;
gridHelper.material.opacity = 0.45;
mainScene.threeScene.add(gridHelper);

// === ПЛАТФОРМА «ПОД НОГАМИ» (круглая, с текстурой) ===
const platformGeometry = new THREE.CylinderGeometry(3.5, 3.5, 0.2, 32);
const platformMaterial = new THREE.MeshStandardMaterial({ color: 0x4a6c8f, roughness: 0.4, metalness: 0.1 });
const platform = new THREE.Mesh(platformGeometry, platformMaterial);
platform.position.set(0, -0.2, 0);
platform.receiveShadow = true;
platform.castShadow = true;
mainScene.threeScene.add(platform);

// Декоративный ободок платформы
const rimGeometry = new THREE.TorusGeometry(3.5, 0.08, 64, 200);
const rimMaterial = new THREE.MeshStandardMaterial({ color: 0xcceeff, emissive: 0x2266aa, emissiveIntensity: 0.3 });
const rim = new THREE.Mesh(rimGeometry, rimMaterial);
rim.rotation.x = Math.PI / 2;
rim.position.y = 0.05;
mainScene.threeScene.add(rim);

// Вторая платформа - прозрачная подложка для визуального ориентира
const glowRing = new THREE.Mesh(
  new THREE.RingGeometry(3.2, 3.7, 32),
  new THREE.MeshStandardMaterial({ color: 0x88aaff, side: THREE.DoubleSide, transparent: true, opacity: 0.3, emissive: 0x224466 })
);
glowRing.rotation.x = -Math.PI / 2;
glowRing.position.y = -0.05;
mainScene.threeScene.add(glowRing);

// === ОБЪЕКТЫ НА РАЗНОМ РАССТОЯНИИ ДЛЯ ОЩУЩЕНИЯ ГЛУБИНЫ ===
// Функция создания сущности с компонентом анимации (если нужно)
function createEntityWithMesh(geometry, color, x, y, z, name, addRotation = false, addPulse = false) {
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.2 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.origColor = new THREE.Color(color);
  mesh.userData.baseY = y;
  mesh.userData.name = name;
  
  const entity = new Entity({ mesh, name });
  if (addRotation) entity.addComponent(new RotationComponent({ axis: 'y', speed: 0.8 }));
  if (addPulse) entity.addComponent(new PulseScaleComponent({ speed: 2.5, amplitude: 0.12 }));
  mainScene.addEntity(entity);
  return entity;
}

// 1. Ближний объект (куб) - прямо перед камерой
createEntityWithMesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), 0xd94f6c, 1.2, 0.5, -1.2, 'Куб рубин', true, true);

// 2. Средний объект (сфера) - чуть дальше
const sphereEntity = createEntityWithMesh(new THREE.SphereGeometry(0.7, 32, 32), 0x4caf7f, -1.5, 0.6, -0.8, 'Изумрудная сфера', false, true);
sphereEntity.addComponent(new RotationComponent({ axis: 'x', speed: 0.5 }));

// 3. Дальний объект (цилиндр)
createEntityWithMesh(new THREE.CylinderGeometry(0.65, 0.65, 1.1, 32), 0xffaa44, 0, 0.6, -3.2, 'Золотой столб', true, false);

// 4. Объект слева, на среднем расстоянии (тор)
const torusEntity = createEntityWithMesh(new THREE.TorusGeometry(0.6, 0.15, 32, 64), 0xaa66ff, -2.2, 0.7, 1.5, 'Фиолетовый тор', true, false);
torusEntity.mesh.rotation.x = Math.PI / 2;

// 5. Объект справа, близко (пирамида из конуса)
const coneGeo = new THREE.ConeGeometry(0.65, 1.0, 32);
const coneEntity = createEntityWithMesh(coneGeo, 0x66ccff, 2.4, 0.5, 0.6, 'Ледяная пирамида', false, true);

// 6. Объект высоко и далеко (для контраста)
const distantEntity = createEntityWithMesh(new THREE.DodecahedronGeometry(0.55), 0xff8855, -1.8, 1.2, -3.8, 'Огненный додекаэдр', true, false);
distantEntity.mesh.material.metalness = 0.7;
distantEntity.mesh.material.roughness = 0.2;

// 7. Плавающий светящийся шар (эффект глубины)
const orbGeo = new THREE.SphereGeometry(0.4, 24, 24);
const orbMat = new THREE.MeshStandardMaterial({ color: 0xffaa88, emissive: 0x442200, emissiveIntensity: 0.5 });
const orbMesh = new THREE.Mesh(orbGeo, orbMat);
orbMesh.position.set(3.2, 1.0, -2.0);
orbMesh.castShadow = true;
const orbEntity = new Entity({ mesh: orbMesh, name: 'Светлячок' });
orbEntity.addComponent(new RotationComponent({ axis: 'y', speed: 1.2 }));
mainScene.addEntity(orbEntity);

// --- Небольшие декоративные элементы по краям платформы (столбики) ---
const pillarMat = new THREE.MeshStandardMaterial({ color: 0x99aacc, emissive: 0x224466, emissiveIntensity: 0.2 });
const positions = [
  [-2.5, 0.1, 2.5], [2.5, 0.1, 2.5], [-2.5, 0.1, -2.5], [2.5, 0.1, -2.5],
  [-3.0, 0.1, 0], [3.0, 0.1, 0], [0, 0.1, -3.0], [0, 0.1, 3.0]
];
positions.forEach(pos => {
  const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.4, 8), pillarMat);
  pillar.position.set(pos[0], pos[1], pos[2]);
  pillar.castShadow = true;
  mainScene.threeScene.add(pillar);
});

// --- Логика raycasting и выбора, как в оригинале, но с учётом VR ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let hovered = null;
let selected = null;
let jumpTime = 0;

// Функция обновления подсветки и прыжков
function updateHoverSelect(dt) {
  // Для VR мышь не используется, но оставим для десктопа
  if (!engine.renderer.xr.isPresenting) {
    raycaster.setFromCamera(mouse, engine.camera);
    const meshes = mainScene.entities.map(e => e.mesh);
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
  } else {
    // В VR режиме подсветка hover не нужна, но при желании можно добавить луч из контроллеров
    if (hovered) {
      hovered.material.color.copy(hovered.userData.origColor);
      hovered = null;
    }
  }
  
  // Анимация выбранного объекта (подпрыгивание)
  if (selected) {
    jumpTime += dt;
    const bounceY = selected.userData.baseY + Math.abs(Math.sin(jumpTime * 3)) * 0.35;
    selected.position.y = bounceY;
  }
}

// Переопределяем update сцены
mainScene.update = function(dt) {
  for (const e of this.entities) e.update(dt);
  updateHoverSelect(dt);
};

// Добавляем сцену в движок
engine.addScene('main', mainScene);
engine.setActiveScene('main');

// --- WEBXR: НАСТРОЙКА И КНОПКА ВХОДА ---
engine.renderer.xr.enabled = true; // включаем поддержку XR

// Функция для обновления UI статуса VR
function updateVRStatusUI(isVR) {
  const statusSpan = document.getElementById('vr-status');
  const vrBtn = document.getElementById('vr-btn');
  if (isVR) {
    statusSpan.innerHTML = '🥽 Режим: VR (immersive)';
    vrBtn.textContent = '🚪 Выйти из VR';
    vrBtn.classList.add('active');
    // Отключаем кнопку вращения камеры в VR (она не нужна, т.к. камера следует за головой)
    const rotateBtn = document.getElementById('rotate-btn');
    if (rotateBtn) rotateBtn.disabled = true;
  } else {
    statusSpan.innerHTML = '🖥️ Режим: Desktop';
    vrBtn.textContent = '🥽 Вход в VR';
    vrBtn.classList.remove('active');
    const rotateBtn = document.getElementById('rotate-btn');
    if (rotateBtn) rotateBtn.disabled = false;
  }
}

// Создаём и добавляем кнопку VR, но используем стилизованную поверх стандартной
const vrButtonContainer = document.getElementById('ui');
// Стандартный VRButton от Three.js добавляет свою кнопку, но мы хотим свою, с проверкой
// Поэтому создадим свою логику

let currentSession = null;
const vrBtn = document.getElementById('vr-btn');

// Проверяем поддержку VR
async function checkVRSupport() {
  if ('xr' in navigator) {
    const supported = await navigator.xr.isSessionSupported('immersive-vr');
    if (supported) {
      vrBtn.disabled = false;
      vrBtn.classList.add('available');
      vrBtn.textContent = '🥽 Вход в VR';
    } else {
      vrBtn.disabled = true;
      vrBtn.textContent = '❌ VR не поддерживается';
    }
  } else {
    vrBtn.disabled = true;
    vrBtn.textContent = '❌ WebXR недоступен';
  }
}
checkVRSupport();

// Обработчик кнопки VR (вход/выход)
vrBtn.addEventListener('click', async () => {
  if (engine.renderer.xr.isPresenting) {
    await engine.renderer.xr.getSession()?.end();
    engine.stopXRLoop(); // возвращаем обычный цикл
  } else {
    try {
      const session = await navigator.xr.requestSession('immersive-vr', {
        optionalFeatures: ['local-floor'] // убрали bounded-floor
      });
      engine.renderer.xr.setSession(session);
      engine.startXRLoop(); // включаем XR-цикл
      updateVRStatusUI(true);
      
      // Принудительно устанавливаем фон и цвет очистки
      mainScene.threeScene.background = new THREE.Color(0x111122);
      engine.renderer.setClearColor(0x111122);
      
      session.addEventListener('end', () => {
        engine.renderer.xr.setSession(null);
        engine.stopXRLoop();
        updateVRStatusUI(false);
        // Сбрасываем камеру для десктопа
        engine.camera.position.set(4, 2, 5);
        engine.camera.lookAt(0, 1, 0);
      });
    } catch (err) {
      console.error('VR ошибка:', err);
      alert('Ошибка: ' + err.message);
    }
  }
});

// Слушаем изменения состояния презентации
engine.renderer.xr.addEventListener('sessionstart', () => updateVRStatusUI(true));
engine.renderer.xr.addEventListener('sessionend', () => updateVRStatusUI(false));

// --- Вспомогательная анимация вращения камеры на десктопе ---
const rotateBtnDesktop = document.getElementById('rotate-btn');
let rotateCameraFlag = false;
let cameraAngle = 0;
const camRadius = 5.5;

rotateBtnDesktop.addEventListener('click', () => {
  if (engine.renderer.xr.isPresenting) return;
  rotateCameraFlag = !rotateCameraFlag;
  if (!rotateCameraFlag) {
    // фиксируем позицию, чтобы не дёргалась
    engine.camera.position.set(camRadius * Math.cos(cameraAngle), 2.2, camRadius * Math.sin(cameraAngle));
    engine.camera.lookAt(0, 1, 0);
  }
});

// Функция обновления камеры для десктопа (вызывается независимо)
function animateDesktopCamera() {
  if (!engine.renderer.xr.isPresenting && rotateCameraFlag) {
    cameraAngle += 0.008;
    engine.camera.position.x = camRadius * Math.cos(cameraAngle);
    engine.camera.position.z = camRadius * Math.sin(cameraAngle);
    engine.camera.lookAt(0, 1.2, 0);
  }
  requestAnimationFrame(animateDesktopCamera);
}
animateDesktopCamera();

// --- Обработка мыши для raycasting (только десктоп) ---
window.addEventListener('mousemove', (ev) => {
  if (engine.renderer.xr.isPresenting) return;
  mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('click', (ev) => {
  if (engine.renderer.xr.isPresenting) return; // В VR выделение через контроллеры не реализовано, но можно
  if (!hovered) return;
  if (selected === hovered) {
    // снимаем выделение
    selected.position.y = selected.userData.baseY;
    selected = null;
    jumpTime = 0;
  } else {
    if (selected) selected.position.y = selected.userData.baseY;
    selected = hovered;
    jumpTime = 0;
  }
  const nameSpan = document.getElementById('obj-name');
  if (selected) {
    nameSpan.textContent = selected.userData.name || selected.name || 'Объект';
  } else {
    nameSpan.textContent = '—';
  }
});

// Дополнительно: добавим звёздный фон для атмосферы (частицы)
const starGeometry = new THREE.BufferGeometry();
const starCount = 800;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  starPositions[i*3] = (Math.random() - 0.5) * 200;
  starPositions[i*3+1] = (Math.random() - 0.5) * 80;
  starPositions[i*3+2] = (Math.random() - 0.5) * 80 - 40;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.6 });
const stars = new THREE.Points(starGeometry, starMaterial);
mainScene.threeScene.add(stars);

// Запускаем движок
engine.start();

// Небольшой лог в консоль
console.log('VR-Ready сцена загружена. Нажмите "Вход в VR" для использования гарнитуры.');