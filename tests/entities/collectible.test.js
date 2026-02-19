import { Collectible } from '../../src/entities/collectible.js';

describe('Collectible', () => {
  test('init sets properties for star', () => {
    const col = new Collectible();
    col.init('star', 800, 300, 16, 200);
    expect(col.type).toBe('star');
    expect(col.value).toBe(100);
    expect(col.position.x).toBe(800);
    expect(col.active).toBe(true);
  });

  test('init sets properties for fuelCell', () => {
    const col = new Collectible();
    col.init('fuelCell', 800, 300, 18, 200);
    expect(col.type).toBe('fuelCell');
    expect(col.value).toBe(25);
  });

  test('update moves left', () => {
    const col = new Collectible();
    col.init('star', 800, 300, 16, 200);
    col.update(1/60);
    expect(col.position.x).toBeLessThan(800);
  });

  test('deactivates when off screen', () => {
    const col = new Collectible();
    col.init('star', -100, 300, 16, 200);
    col.update(1/60);
    expect(col.active).toBe(false);
  });

  test('attractTo moves toward target', () => {
    const col = new Collectible();
    col.init('star', 100, 100, 16, 0);
    col.attractTo(200, 100, 500, 1/60);
    expect(col.position.x).toBeGreaterThan(100);
  });
});
