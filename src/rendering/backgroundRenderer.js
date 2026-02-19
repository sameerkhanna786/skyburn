import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants.js';

export class BackgroundRenderer {
  constructor(ctx) {
    this.ctx = ctx;
    this.stars = [];
    this.offset = 0;

    // Generate starfield
    for (let i = 0; i < 80; i++) {
      this.stars.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * CANVAS_HEIGHT,
        size: 0.5 + Math.random() * 1.5,
        speed: 20 + Math.random() * 80,
        brightness: 0.3 + Math.random() * 0.7,
      });
    }
  }

  update(dt, scrollSpeed) {
    for (const star of this.stars) {
      star.x -= star.speed * (scrollSpeed / 200) * dt;
      if (star.x < 0) {
        star.x = CANVAS_WIDTH;
        star.y = Math.random() * CANVAS_HEIGHT;
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    for (const star of this.stars) {
      ctx.globalAlpha = star.brightness;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
    ctx.globalAlpha = 1;
  }
}
