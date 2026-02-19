import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants.js';

export class ScreenEffects {
  constructor(ctx) {
    this.ctx = ctx;
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
    this.shakeTimer = 0;
    this.flashColor = null;
    this.flashAlpha = 0;
  }

  shake(intensity, duration) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
    this.shakeTimer = duration;
  }

  flash(color, duration) {
    this.flashColor = color;
    this.flashAlpha = 0.4;
    this.flashDuration = duration;
    this.flashTimer = duration;
  }

  update(dt) {
    if (this.shakeTimer > 0) {
      this.shakeTimer -= dt;
    }
    if (this.flashAlpha > 0) {
      this.flashAlpha -= dt / (this.flashDuration || 0.3);
      if (this.flashAlpha < 0) this.flashAlpha = 0;
    }
  }

  applyShake() {
    if (this.shakeTimer > 0) {
      const dx = (Math.random() - 0.5) * this.shakeIntensity * 2;
      const dy = (Math.random() - 0.5) * this.shakeIntensity * 2;
      this.ctx.translate(dx, dy);
      return true;
    }
    return false;
  }

  drawFlash() {
    if (this.flashAlpha > 0 && this.flashColor) {
      this.ctx.globalAlpha = this.flashAlpha;
      this.ctx.fillStyle = this.flashColor;
      this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      this.ctx.globalAlpha = 1;
    }
  }

  drawVignette() {
    const ctx = this.ctx;
    const gradient = ctx.createRadialGradient(
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_HEIGHT * 0.3,
      CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_HEIGHT * 0.8
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.4)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}
