import {
  CANVAS_WIDTH, CANVAS_HEIGHT,
  COLOR_BACKGROUND, COLOR_HUD
} from '../constants.js';

export class Renderer {
  constructor(ctx) {
    this.ctx = ctx;
  }

  clear() {
    this.ctx.fillStyle = COLOR_BACKGROUND;
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}
