import { CANVAS_WIDTH, CANVAS_HEIGHT, COLOR_PLAYER } from '../constants.js';

export class GameOverScreen {
  constructor(ctx) {
    this.ctx = ctx;
    this.blink = 0;
  }

  update(dt) {
    this.blink += dt;
  }

  draw(score, highScore, isNewHigh) {
    const ctx = this.ctx;

    // Overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // GAME OVER
    ctx.fillStyle = '#ff0055';
    ctx.shadowColor = '#ff0055';
    ctx.shadowBlur = 15;
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);
    ctx.shadowBlur = 0;

    // Score
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px monospace';
    ctx.fillText(`SCORE: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

    // High score
    ctx.fillStyle = '#aaaaaa';
    ctx.font = '20px monospace';
    ctx.fillText(`HIGH SCORE: ${highScore}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 35);

    // New high score badge
    if (isNewHigh) {
      ctx.fillStyle = COLOR_PLAYER;
      ctx.shadowColor = COLOR_PLAYER;
      ctx.shadowBlur = 10;
      ctx.font = 'bold 22px monospace';
      ctx.fillText('★ NEW HIGH SCORE ★', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);
      ctx.shadowBlur = 0;
    }

    // Restart prompt
    if (Math.sin(this.blink * 3) > -0.3) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px monospace';
      ctx.fillText('PRESS SPACE OR TAP TO RESTART', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 110);
    }
  }
}
