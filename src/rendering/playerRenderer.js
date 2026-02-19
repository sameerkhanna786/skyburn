import { COLOR_PLAYER, COLOR_SHIELD } from '../constants.js';

export class PlayerRenderer {
  constructor(ctx) {
    this.ctx = ctx;
  }

  draw(player) {
    if (!player.active) return;
    const ctx = this.ctx;
    const cx = player.position.x + player.width / 2;
    const cy = player.position.y + player.height / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(player.tiltAngle);

    // Neon triangle jet
    ctx.beginPath();
    ctx.moveTo(player.width / 2, 0);
    ctx.lineTo(-player.width / 2, -player.height / 2);
    ctx.lineTo(-player.width / 3, 0);
    ctx.lineTo(-player.width / 2, player.height / 2);
    ctx.closePath();

    ctx.fillStyle = COLOR_PLAYER;
    ctx.fill();
    ctx.shadowColor = COLOR_PLAYER;
    ctx.shadowBlur = 15;
    ctx.strokeStyle = COLOR_PLAYER;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.restore();

    // Shield bubble
    if (player.shieldActive) {
      ctx.beginPath();
      ctx.arc(cx, cy, player.width * 0.7, 0, Math.PI * 2);
      ctx.strokeStyle = COLOR_SHIELD;
      ctx.lineWidth = 2;
      ctx.shadowColor = COLOR_SHIELD;
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }
}
