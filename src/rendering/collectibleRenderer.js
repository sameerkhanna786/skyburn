import { COLOR_STAR, COLOR_FUEL, COLOR_SHIELD, COLOR_MAGNET, COLOR_AFTERBURNER } from '../constants.js';

const COLLECTIBLE_COLORS = {
  star: COLOR_STAR,
  fuelCell: COLOR_FUEL,
  powerup_shield: COLOR_SHIELD,
  powerup_magnet: COLOR_MAGNET,
  powerup_afterburner: COLOR_AFTERBURNER,
};

export class CollectibleRenderer {
  constructor(ctx) {
    this.ctx = ctx;
  }

  draw(collectible) {
    if (!collectible.active) return;
    const ctx = this.ctx;
    const color = COLLECTIBLE_COLORS[collectible.type] || COLOR_STAR;
    const cx = collectible.position.x + collectible.width / 2;
    const cy = collectible.position.y + collectible.height / 2;
    const r = collectible.width / 2;

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;

    if (collectible.type === 'star') {
      this.drawStar(cx, cy, r, 5);
    } else if (collectible.type === 'fuelCell') {
      // Draw as glowing circle
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = `bold ${r}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('F', cx, cy);
    } else {
      // Power-up: hexagon
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      // Label
      ctx.fillStyle = '#000';
      ctx.font = `bold ${r * 0.8}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label = collectible.type === 'powerup_shield' ? 'S' :
                     collectible.type === 'powerup_magnet' ? 'M' : 'A';
      ctx.fillText(label, cx, cy);
    }

    ctx.shadowBlur = 0;
  }

  drawStar(cx, cy, r, points) {
    const ctx = this.ctx;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const angle = (Math.PI / points) * i - Math.PI / 2;
      const radius = i % 2 === 0 ? r : r * 0.4;
      const px = cx + radius * Math.cos(angle);
      const py = cy + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }
}
