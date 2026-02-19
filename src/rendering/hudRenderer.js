import {
  CANVAS_WIDTH, COLOR_HUD, COLOR_COMBO,
  COLOR_FUEL, COLOR_SHIELD, COLOR_MAGNET, COLOR_AFTERBURNER,
  FUEL_MAX
} from '../constants.js';

export class HudRenderer {
  constructor(ctx) {
    this.ctx = ctx;
  }

  draw(game) {
    const ctx = this.ctx;

    // Score
    ctx.fillStyle = COLOR_HUD;
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${game.getScore()}`, 15, 30);

    // Level
    ctx.font = '14px monospace';
    ctx.fillText(`LVL ${game.difficulty.level}`, 15, 50);

    // Combo/multiplier
    if (game.scoring.combo > 0) {
      ctx.fillStyle = COLOR_COMBO;
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        `x${game.scoring.multiplier.toFixed(1)} COMBO ${game.scoring.combo}`,
        CANVAS_WIDTH / 2, 30
      );
    }

    // Fuel gauge
    this.drawFuelGauge(game.fuel);

    // Power-up indicators
    this.drawPowerups(game.powerup);
  }

  drawFuelGauge(fuel) {
    const ctx = this.ctx;
    const barWidth = 150;
    const barHeight = 12;
    const x = CANVAS_WIDTH - barWidth - 15;
    const y = 15;
    const pct = fuel.getPercent();

    // Background
    ctx.fillStyle = '#333';
    ctx.fillRect(x, y, barWidth, barHeight);

    // Fill
    const fillColor = pct > 0.3 ? COLOR_FUEL : (pct > 0.15 ? '#ffaa00' : '#ff0000');
    ctx.fillStyle = fillColor;
    ctx.shadowColor = fillColor;
    ctx.shadowBlur = pct < 0.3 ? 8 : 0;
    ctx.fillRect(x, y, barWidth * pct, barHeight);
    ctx.shadowBlur = 0;

    // Label
    ctx.fillStyle = COLOR_HUD;
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('FUEL', x - 5, y + 10);
  }

  drawPowerups(powerup) {
    const ctx = this.ctx;
    const indicators = [];
    if (powerup.isActive('shield')) indicators.push({ name: 'SHD', color: COLOR_SHIELD, time: powerup.getRemaining('shield') });
    if (powerup.isActive('magnet')) indicators.push({ name: 'MAG', color: COLOR_MAGNET, time: powerup.getRemaining('magnet') });
    if (powerup.isActive('afterburner')) indicators.push({ name: 'AFT', color: COLOR_AFTERBURNER, time: powerup.getRemaining('afterburner') });

    ctx.textAlign = 'right';
    indicators.forEach((ind, i) => {
      const y = 45 + i * 18;
      ctx.fillStyle = ind.color;
      ctx.font = 'bold 12px monospace';
      ctx.shadowColor = ind.color;
      ctx.shadowBlur = 6;
      ctx.fillText(`${ind.name} ${ind.time.toFixed(1)}s`, CANVAS_WIDTH - 15, y);
      ctx.shadowBlur = 0;
    });
  }
}
