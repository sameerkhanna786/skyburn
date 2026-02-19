import { Spawner } from '../../src/systems/spawner.js';
import { SPAWN_BASE_INTERVAL, SPAWN_MIN_INTERVAL, CANVAS_HEIGHT, SPAWN_SAFE_MARGIN } from '../../src/constants.js';

describe('Spawner', () => {
  let spawner;

  beforeEach(() => {
    spawner = new Spawner();
  });

  test('starts with timer at 0', () => {
    expect(spawner.timer).toBe(0);
    expect(spawner.shouldSpawn()).toBe(false);
  });

  test('shouldSpawn becomes true after interval', () => {
    spawner.update(SPAWN_BASE_INTERVAL + 0.01);
    expect(spawner.shouldSpawn()).toBe(true);
  });

  test('resetTimer resets spawn timer', () => {
    spawner.update(SPAWN_BASE_INTERVAL + 0.01);
    spawner.resetTimer();
    expect(spawner.shouldSpawn()).toBe(false);
  });

  test('higher density reduces interval', () => {
    spawner.setDensity(2);
    const interval = spawner.getInterval();
    expect(interval).toBeLessThan(SPAWN_BASE_INTERVAL);
  });

  test('interval never goes below minimum', () => {
    spawner.setDensity(100);
    expect(spawner.getInterval()).toBeGreaterThanOrEqual(SPAWN_MIN_INTERVAL);
  });

  test('pickType returns from unlocked types', () => {
    const type = spawner.pickType();
    expect(spawner.unlockedTypes).toContain(type);
  });

  test('unlockType adds new types', () => {
    spawner.unlockType('missile');
    expect(spawner.unlockedTypes).toContain('missile');
    expect(spawner.unlockedTypes).toContain('terrain');
  });

  test('unlockType does not duplicate', () => {
    spawner.unlockType('terrain');
    expect(spawner.unlockedTypes.filter(t => t === 'terrain').length).toBe(1);
  });

  test('pickY stays within safe margins', () => {
    for (let i = 0; i < 50; i++) {
      const y = spawner.pickY();
      expect(y).toBeGreaterThanOrEqual(SPAWN_SAFE_MARGIN);
      expect(y).toBeLessThanOrEqual(CANVAS_HEIGHT - SPAWN_SAFE_MARGIN);
    }
  });

  test('reset restores defaults', () => {
    spawner.setDensity(3);
    spawner.unlockType('missile');
    spawner.update(5);
    spawner.reset();
    expect(spawner.density).toBe(1);
    expect(spawner.unlockedTypes).toEqual(['terrain']);
    expect(spawner.timer).toBe(0);
  });
});
