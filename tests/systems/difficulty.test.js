import { DifficultySystem } from '../../src/systems/difficulty.js';
import { DIFFICULTY_LEVEL_INTERVAL } from '../../src/constants.js';

describe('DifficultySystem', () => {
  let difficulty;

  beforeEach(() => {
    difficulty = new DifficultySystem();
  });

  test('starts at level 1', () => {
    expect(difficulty.level).toBe(1);
  });

  test('level increases every interval', () => {
    difficulty.update(DIFFICULTY_LEVEL_INTERVAL + 0.1);
    expect(difficulty.level).toBe(2);

    difficulty.update(DIFFICULTY_LEVEL_INTERVAL);
    expect(difficulty.level).toBe(3);
  });

  test('scroll speed increases over time', () => {
    const speed0 = difficulty.getScrollSpeed(200);
    difficulty.update(30);
    const speed30 = difficulty.getScrollSpeed(200);
    expect(speed30).toBeGreaterThan(speed0);
  });

  test('scroll speed grows logarithmically (diminishing returns)', () => {
    difficulty.update(30);
    const speed30 = difficulty.getScrollSpeed(200);
    difficulty.update(30);
    const speed60 = difficulty.getScrollSpeed(200);
    const gain1 = speed30 - 200;
    const gain2 = speed60 - speed30;
    expect(gain2).toBeLessThan(gain1); // diminishing returns
  });

  test('density increases with level', () => {
    const d1 = difficulty.getDensity();
    difficulty.update(DIFFICULTY_LEVEL_INTERVAL * 3);
    const d4 = difficulty.getDensity();
    expect(d4).toBeGreaterThan(d1);
  });

  test('types unlock progressively', () => {
    expect(difficulty.getUnlockedTypes()).toEqual(['terrain']);

    difficulty.update(DIFFICULTY_LEVEL_INTERVAL + 0.1); // level 2
    expect(difficulty.getUnlockedTypes()).toContain('missile');

    difficulty.update(DIFFICULTY_LEVEL_INTERVAL); // level 3
    expect(difficulty.getUnlockedTypes()).toContain('drone');

    difficulty.update(DIFFICULTY_LEVEL_INTERVAL); // level 4
    expect(difficulty.getUnlockedTypes()).toContain('laserGate');
  });

  test('reset restores defaults', () => {
    difficulty.update(100);
    difficulty.reset();
    expect(difficulty.level).toBe(1);
    expect(difficulty.elapsed).toBe(0);
  });
});
