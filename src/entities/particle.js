import { Entity } from '../core/entity.js';

export class Particle extends Entity {
  constructor() {
    super(0, 0, 0, 0);
    this.lifetime = 0;
    this.maxLifetime = 0;
    this.alpha = 1;
    this.color = '#ffffff';
    this.size = 2;
  }

  init(x, y, vx, vy, lifetime, color, size) {
    this.position.set(x, y);
    this.velocity.set(vx, vy);
    this.lifetime = lifetime;
    this.maxLifetime = lifetime;
    this.alpha = 1;
    this.color = color;
    this.size = size || 2;
    this.active = true;
  }

  update(dt) {
    this.lifetime -= dt;
    if (this.lifetime <= 0) {
      this.active = false;
      return;
    }
    this.alpha = this.lifetime / this.maxLifetime;
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
  }
}
