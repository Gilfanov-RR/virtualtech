import * as THREE from 'three';

export class Scene {
  constructor(name = 'Scene') {
    this.name = name;
    this.threeScene = new THREE.Scene();
    this.entities = [];
    this.engine = null;
  }

  addEntity(entity) {
    entity.scene = this;
    this.entities.push(entity);
    if (entity.mesh) this.threeScene.add(entity.mesh);
  }

  removeEntity(entity) {
    const i = this.entities.indexOf(entity);
    if (i !== -1) {
      this.entities.splice(i, 1);
      if (entity.mesh) this.threeScene.remove(entity.mesh);
      entity.scene = null;
    }
  }

  update(dt) {
    for (const e of this.entities) e.update(dt);
  }
}
