import { DifficultySystem } from '../../src/systems/difficulty.js';
import { Spawner } from '../../src/systems/spawner.js';
import { DIFFICULTY_LEVEL_INTERVAL } from '../../src/constants.js';

describe('Difficulty Progression Integration', () => {
  let difficulty;
  let spawner;

  beforeEach(() => {
    difficulty = new DifficultySystem();
    spawner = new Spawner();
  });

  test('difficulty unlocks types that spawner can use', () => {
    // Initially only terrain
    for (const type of difficulty.getUnlockedTypes()) {
      spawner.unlockType(type);
    }
    expect(spawner.unlockedTypes).toEqual(['terrain']);

    // After 2 levels, missile unlocks
    difficulty.update(DIFFICULTY_LEVEL_INTERVAL * 1.1);
    for (const type of difficulty.getUnlockedTypes()) {
      spawner.unlockType(type);
    }
    expect(spawner.unlockedTypes).toContain('missile');
  });

  test('scroll speed grows but stays playable', () => {
    const speeds = [];
    for (let t = 0; t < 120; t += 10) {
      difficulty.elapsed = t;
      speeds.push(difficulty.getScrollSpeed(200));
    }
    // Should always increase
    for (let i = 1; i < speeds.length; i++) {
      expect(speeds[i]).toBeGreaterThan(speeds[i - 1]);
    }
    // Should not grow insanely fast (less than 5x base after 2 minutes)
    expect(speeds[speeds.length - 1]).toBeLessThan(200 * 5);
  });

  test('density increases spawn rate', () => {
    difficulty.update(DIFFICULTY_LEVEL_INTERVAL * 5);
    spawner.setDensity(difficulty.getDensity());
    const interval = spawner.getInterval();
    expect(interval).toBeLessThan(1.5); // less than base interval
  });
});
