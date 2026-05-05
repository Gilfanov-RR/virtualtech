export class RotationComponent {
  constructor({ axis = 'y', speed = 1 } = {}) {
    this.axis = axis;
    this.speed = speed;
  }

  update(dt, entity) {
    if (!entity.mesh) return;
    entity.mesh.rotation[this.axis] += this.speed * dt;
  }
}