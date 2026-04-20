import { Component } from '../component.js';

export class RotationComponent extends Component {
  constructor({ axis = 'y', speed = 1 } = {}) {
    super();
    this.axis = axis;
    this.speed = speed;
  }

  update(dt, entity) {
    if (!entity.mesh) return;
    const s = this.speed * dt;
    if (this.axis === 'x') entity.mesh.rotation.x += s;
    if (this.axis === 'y') entity.mesh.rotation.y += s;
    if (this.axis === 'z') entity.mesh.rotation.z += s;
  }
}
