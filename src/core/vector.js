export class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return new Vector2D(this.x + other.x, this.y + other.y);
  }

  subtract(other) {
    return new Vector2D(this.x - other.x, this.y - other.y);
  }

  scale(scalar) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const mag = this.magnitude();
    if (mag === 0) return new Vector2D(0, 0);
    return new Vector2D(this.x / mag, this.y / mag);
  }

  clampMagnitude(max) {
    const mag = this.magnitude();
    if (mag <= max) return new Vector2D(this.x, this.y);
    const ratio = max / mag;
    return new Vector2D(this.x * ratio, this.y * ratio);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  clone() {
    return new Vector2D(this.x, this.y);
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
}
