export class PulseScaleComponent {
  constructor({ speed = 2, amplitude = 0.1 } = {}) {
    this.speed = speed;
    this.amplitude = amplitude;
    this.time = 0;
    this.originalScale = null;
  }

  onAttach() {
    if (this.entity && this.entity.mesh) {
      this.originalScale = this.entity.mesh.scale.clone();
    }
  }

  update(dt, entity) {
    if (!entity.mesh) return;
    if (!this.originalScale) this.originalScale = entity.mesh.scale.clone();
    this.time += dt;
    const factor = 1 + Math.sin(this.time * this.speed) * this.amplitude;
    entity.mesh.scale.set(
      this.originalScale.x * factor,
      this.originalScale.y * factor,
      this.originalScale.z * factor
    );
  }
}