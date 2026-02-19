import { Entity } from '../core/entity.js';

export class Collectible extends Entity {
  constructor() {
    super(0, 0, 0, 0);
    this.type = 'star';
    this.scrollSpeed = 0;
    this.value = 0;
    this.magnetizable = true;
  }

  init(type, x, y, size, scrollSpeed) {
    this.position.set(x, y);
    this.width = size;
    this.height = size;
    this.type = type;
    this.scrollSpeed = scrollSpeed;
    this.active = true;
    this.velocity.set(-scrollSpeed, 0);
    this.magnetizable = true;

    switch (type) {
      case 'star':
        this.value = 100;
        break;
      case 'fuelCell':
        this.value = 25;
        break;
      case 'powerup_shield':
      case 'powerup_magnet':
      case 'powerup_afterburner':
        this.value = 0;
        break;
    }
  }

  update(dt) {
    this.position.x += this.velocity.x * dt;

    if (this.position.x + this.width < -50) {
      this.active = false;
    }
  }

  attractTo(targetX, targetY, strength, dt) {
    if (!this.magnetizable) return;
    const dx = targetX - this.position.x;
    const dy = targetY - this.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1) return;
    this.position.x += (dx / dist) * strength * dt;
    this.position.y += (dy / dist) * strength * dt;
  }
}
