import { Component } from '../component.js';

export class PulseScaleComponent extends Component {
  constructor({ speed = 2, amplitude = 0.2 } = {}) {
    super();
    this.speed = speed;
    this.amplitude = amplitude;
    this.time = 0;
    this.baseScale = null;
  }

  onAttach() {
    if (this.entity && this.entity.mesh) {
      const m = this.entity.mesh;
      this.baseScale = m.scale.clone();
    }
  }

  update(dt, entity) {
    if (!entity.mesh) return;
    this.time += dt;
    const s = 1 + Math.sin(this.time * this.speed) * this.amplitude;
    entity.mesh.scale.set(
      this.baseScale.x * s,
      this.baseScale.y * s,
      this.baseScale.z * s
    );
  }
}
