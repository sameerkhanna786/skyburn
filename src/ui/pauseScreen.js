import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants.js';

export class PauseScreen {
  constructor(ctx) {
    this.ctx = ctx;
  }

  draw() {
    const ctx = this.ctx;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);

    ctx.font = '16px monospace';
    ctx.fillStyle = '#aaaaaa';
    ctx.fillText('PRESS P TO RESUME', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
  }
}
