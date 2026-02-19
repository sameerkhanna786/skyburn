import { Vector2D } from './vector.js';
import { Rect } from './rect.js';

export class Entity {
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.position = new Vector2D(x, y);
    this.velocity = new Vector2D(0, 0);
    this.width = width;
    this.height = height;
    this.active = true;
  }

  get bounds() {
    return new Rect(this.position.x, this.position.y, this.width, this.height);
  }

  reset(x, y) {
    this.position.set(x, y);
    this.velocity.set(0, 0);
    this.active = true;
  }

  deactivate() {
    this.active = false;
  }
}
