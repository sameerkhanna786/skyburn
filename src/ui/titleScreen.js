import { CANVAS_WIDTH, CANVAS_HEIGHT, COLOR_PLAYER } from '../constants.js';

export class TitleScreen {
  constructor(ctx) {
    this.ctx = ctx;
    this.blink = 0;
  }

  update(dt) {
    this.blink += dt;
  }

  draw() {
    const ctx = this.ctx;

    // Title
    ctx.fillStyle = COLOR_PLAYER;
    ctx.shadowColor = COLOR_PLAYER;
    ctx.shadowBlur = 20;
    ctx.font = 'bold 64px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SKYBURN', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);
    ctx.shadowBlur = 0;

    // Subtitle
    ctx.fillStyle = '#ff0055';
    ctx.font = '16px monospace';
    ctx.fillText('ENDLESS FLIGHT ARCADE', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);

    // Instructions (blinking)
    if (Math.sin(this.blink * 3) > -0.3) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '18px monospace';
      ctx.fillText('PRESS SPACE OR TAP TO START', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
    }

    // Controls
    ctx.fillStyle = '#666';
    ctx.font = '13px monospace';
    ctx.fillText('HOLD SPACE/UP/TAP = CLIMB  |  RELEASE = DIVE  |  P = PAUSE', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 90);
    ctx.fillText('DODGE OBSTACLES  •  CHAIN NEAR-MISSES  •  COLLECT STARS & FUEL', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 115);
  }
}
