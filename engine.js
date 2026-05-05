import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";


export class Engine {
  constructor({ clearColor = 0x202020 } = {}) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.xr.enabled = false;
    document.body.appendChild(this.renderer.domElement);

    this.scenes = new Map();
    this.activeScene = null;

    this.clock = new THREE.Clock();
    this.running = false;

    this.initCamera();
    this.renderer.setClearColor(clearColor);
    this.initResize();
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      90, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.set(5, 5, 0);
    this.camera.lookAt(0, 0, 0);
  }

  initResize() {
    window.addEventListener('resize', () => {
       if (this.renderer.xr && this.renderer.xr.isPresenting) return;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  addScene(id, scene) {
    this.scenes.set(id, scene);
    scene.engine = this;
    if (!this.activeScene) this.activeScene = scene;
  }

  removeScene(id) {
    if (this.scenes.has(id)) {
      if (this.activeScene === this.scenes.get(id)) this.activeScene = null;
      this.scenes.delete(id);
    }
  }

  setActiveScene(id) {
    this.activeScene = this.scenes.get(id) || null;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.clock.start();
    this._loop();
  }

  stop() {
    this.running = false;
  }

  _loop() {
    if (!this.running) return;
    requestAnimationFrame(() => this._loop());
    const dt = this.clock.getDelta();
    if (this.activeScene) {
      this.activeScene.update(dt);
      this.renderer.render(this.activeScene.threeScene, this.camera);
    }
  }
startXRLoop() {
  if (this.xrLoopActive) return;
  if (this._rafId) cancelAnimationFrame(this._rafId);
  this.running = false; // останавливаем старый цикл
  this.renderer.setAnimationLoop((time, frame) => {
    const dt = this.clock.getDelta();
    if (this.activeScene) {
      this.activeScene.update(dt);
      this.renderer.render(this.activeScene.threeScene, this.camera);
    }
  });
  this.xrLoopActive = true;
}

stopXRLoop() {
  if (!this.xrLoopActive) return;
  this.renderer.setAnimationLoop(null);
  this.xrLoopActive = false;
  this.running = true;
  this._loop(); // перезапускаем старый цикл
}
}
