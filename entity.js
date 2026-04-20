export class Entity {
  constructor({ mesh = null, name = 'Entity' } = {}) {
    this.mesh = mesh;
    this.name = name;
    this.components = [];
    this.scene = null;
    this.userData = {};
  }

  addComponent(component) {
    component.entity = this;
    this.components.push(component);
    if (component.onAttach) component.onAttach();
    return component;
  }

  removeComponent(component) {
    const i = this.components.indexOf(component);
    if (i !== -1) {
      if (component.onDetach) component.onDetach();
      component.entity = null;
      this.components.splice(i, 1);
    }
  }

  getComponent(cls) {
    return this.components.find(c => c instanceof cls) || null;
  }

  update(dt) {
    for (const c of this.components) {
      if (c.update) c.update(dt, this);
    }
  }
}
