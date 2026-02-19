import { COLOR_OBSTACLE, COLOR_SHIELD, COLOR_MAGNET } from '../constants.js';

const OBSTACLE_COLORS = {
  terrain: '#ff0055',
  missile: '#ff3300',
  drone: '#ff00ff',
  laserGate: '#ff4444',
};

export class ObstacleRenderer {
  constructor(ctx) {
    this.ctx = ctx;
  }

  draw(obstacle) {
    if (!obstacle.active) return;
    const ctx = this.ctx;
    const color = OBSTACLE_COLORS[obstacle.type] || COLOR_OBSTACLE;

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;

    if (obstacle.type === 'missile') {
      // Draw as a pointed shape
      ctx.beginPath();
      ctx.moveTo(obstacle.position.x + obstacle.width, obstacle.position.y + obstacle.height / 2);
      ctx.lineTo(obstacle.position.x, obstacle.position.y);
      ctx.lineTo(obstacle.position.x + 5, obstacle.position.y + obstacle.height / 2);
      ctx.lineTo(obstacle.position.x, obstacle.position.y + obstacle.height);
      ctx.closePath();
      ctx.fill();
    } else if (obstacle.type === 'drone') {
      // Draw as diamond
      const cx = obstacle.position.x + obstacle.width / 2;
      const cy = obstacle.position.y + obstacle.height / 2;
      ctx.beginPath();
      ctx.moveTo(cx, obstacle.position.y);
      ctx.lineTo(obstacle.position.x + obstacle.width, cy);
      ctx.lineTo(cx, obstacle.position.y + obstacle.height);
      ctx.lineTo(obstacle.position.x, cy);
      ctx.closePath();
      ctx.fill();
    } else if (obstacle.type === 'laserGate') {
      // Draw as pulsing beam
      ctx.globalAlpha = 0.6 + 0.4 * Math.sin(Date.now() * 0.01);
      ctx.fillRect(obstacle.position.x, obstacle.position.y, obstacle.width, obstacle.height);
      ctx.globalAlpha = 1;
    } else {
      // terrain: solid neon rect
      ctx.fillRect(obstacle.position.x, obstacle.position.y, obstacle.width, obstacle.height);
    }
    ctx.shadowBlur = 0;
  }
}
