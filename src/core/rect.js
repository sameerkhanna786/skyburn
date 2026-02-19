export class Rect {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get left() { return this.x; }
  get right() { return this.x + this.width; }
  get top() { return this.y; }
  get bottom() { return this.y + this.height; }

  center() {
    return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
  }

  overlaps(other) {
    return (
      this.left < other.right &&
      this.right > other.left &&
      this.top < other.bottom &&
      this.bottom > other.top
    );
  }

  containsPoint(px, py) {
    return px >= this.left && px <= this.right && py >= this.top && py <= this.bottom;
  }

  expand(amount) {
    return new Rect(
      this.x - amount,
      this.y - amount,
      this.width + amount * 2,
      this.height + amount * 2
    );
  }

  gapTo(other) {
    const dx = Math.max(0, Math.max(other.left - this.right, this.left - other.right));
    const dy = Math.max(0, Math.max(other.top - this.bottom, this.top - other.bottom));
    return Math.sqrt(dx * dx + dy * dy);
  }

  clone() {
    return new Rect(this.x, this.y, this.width, this.height);
  }

  set(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    return this;
  }
}
