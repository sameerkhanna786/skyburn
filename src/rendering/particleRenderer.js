export class ParticleRenderer {
  constructor(ctx) {
    this.ctx = ctx;
  }

  draw(particle) {
    if (!particle.active) return;
    const ctx = this.ctx;
    ctx.globalAlpha = particle.alpha;
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 4;
    ctx.fillRect(
      particle.position.x - particle.size / 2,
      particle.position.y - particle.size / 2,
      particle.size,
      particle.size
    );
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}
