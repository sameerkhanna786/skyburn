import { Obstacle, createTerrain, createMissile, createDrone, createLaserGate, createLaserGateBottom } from '../../src/entities/obstacle.js';
import { CANVAS_HEIGHT } from '../../src/constants.js';

describe('Obstacle', () => {
  test('init sets properties correctly', () => {
    const obs = new Obstacle();
    obs.init('terrain', 100, 200, 40, 80, 200);
    expect(obs.position.x).toBe(100);
    expect(obs.position.y).toBe(200);
    expect(obs.width).toBe(40);
    expect(obs.height).toBe(80);
    expect(obs.type).toBe('terrain');
    expect(obs.active).toBe(true);
    expect(obs.velocity.x).toBe(-200);
  });

  test('update moves obstacle left', () => {
    const obs = new Obstacle();
    obs.init('terrain', 100, 200, 40, 80, 200);
    obs.update(1/60);
    expect(obs.position.x).toBeLessThan(100);
  });

  test('deactivates when off screen', () => {
    const obs = new Obstacle();
    obs.init('terrain', -100, 200, 40, 80, 200);
    obs.update(1/60);
    expect(obs.active).toBe(false);
  });

  test('drone oscillates vertically', () => {
    const obs = new Obstacle();
    createDrone(obs, 100, 300, 200);
    expect(obs.oscillateAmplitude).toBe(50);

    const startY = obs.position.y;
    // Run a bunch of frames
    for (let i = 0; i < 60; i++) obs.update(1/60);
    // Y should have changed from oscillation
    expect(obs.position.y).not.toBe(startY);
  });
});

describe('Obstacle factories', () => {
  test('createTerrain sets terrain type', () => {
    const obs = new Obstacle();
    createTerrain(obs, 800, 300, 100, 200);
    expect(obs.type).toBe('terrain');
    expect(obs.height).toBe(100);
  });

  test('createMissile moves faster than scroll', () => {
    const obs = new Obstacle();
    createMissile(obs, 800, 300, 200);
    expect(obs.type).toBe('missile');
    expect(Math.abs(obs.velocity.x)).toBeGreaterThan(200);
  });

  test('createDrone has oscillation', () => {
    const obs = new Obstacle();
    createDrone(obs, 800, 300, 200);
    expect(obs.type).toBe('drone');
    expect(obs.oscillateAmplitude).toBeGreaterThan(0);
  });

  test('createLaserGate creates top beam', () => {
    const obs = new Obstacle();
    createLaserGate(obs, 800, 300, 130, CANVAS_HEIGHT, 200);
    expect(obs.type).toBe('laserGate');
    expect(obs.position.y).toBe(0);
    expect(obs.height).toBe(300 - 65); // gapY - gapHeight/2
    expect(obs.paired).toBe(true);
  });

  test('createLaserGateBottom creates bottom beam', () => {
    const obs = new Obstacle();
    createLaserGateBottom(obs, 800, 300, 130, CANVAS_HEIGHT, 200);
    expect(obs.type).toBe('laserGate');
    expect(obs.position.y).toBe(365); // gapY + gapHeight/2
    expect(obs.height).toBe(CANVAS_HEIGHT - 365);
  });
});
