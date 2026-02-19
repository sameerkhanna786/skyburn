import { Particle } from '../../src/entities/particle.js';

describe('Particle', () => {
  test('init sets properties', () => {
    const p = new Particle();
    p.init(100, 200, -50, 10, 0.8, '#ff0000', 3);
    expect(p.position.x).toBe(100);
    expect(p.position.y).toBe(200);
    expect(p.lifetime).toBe(0.8);
    expect(p.alpha).toBe(1);
    expect(p.color).toBe('#ff0000');
    expect(p.size).toBe(3);
    expect(p.active).toBe(true);
  });

  test('update moves and fades', () => {
    const p = new Particle();
    p.init(100, 200, -60, 0, 1.0, '#ff0000', 2);
    p.update(0.5);
    expect(p.position.x).toBe(70);
    expect(p.alpha).toBeCloseTo(0.5);
    expect(p.lifetime).toBeCloseTo(0.5);
    expect(p.active).toBe(true);
  });

  test('deactivates when lifetime expires', () => {
    const p = new Particle();
    p.init(100, 200, 0, 0, 0.5, '#ff0000', 2);
    p.update(0.6);
    expect(p.active).toBe(false);
  });
});
