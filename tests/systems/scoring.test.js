import { ScoringSystem } from '../../src/systems/scoring.js';
import {
  STAR_BASE_POINTS, NEAR_MISS_POINTS,
  COMBO_MAX_MULTIPLIER, COMBO_DECAY_TIME
} from '../../src/constants.js';

describe('ScoringSystem', () => {
  let scoring;

  beforeEach(() => {
    scoring = new ScoringSystem();
  });

  test('starts at 0', () => {
    expect(scoring.score).toBe(0);
    expect(scoring.combo).toBe(0);
    expect(scoring.multiplier).toBe(1.0);
  });

  test('addDistance scores per 10px', () => {
    scoring.addDistance(30);
    expect(scoring.score).toBe(3);
  });

  test('addDistance accumulates partial distances', () => {
    scoring.addDistance(5);
    expect(scoring.score).toBe(0);
    scoring.addDistance(5);
    expect(scoring.score).toBe(1);
  });

  test('collectStar adds base points with multiplier', () => {
    scoring.collectStar();
    expect(scoring.score).toBe(STAR_BASE_POINTS);
  });

  test('collectStar scales with multiplier', () => {
    scoring.multiplier = 2.0;
    scoring.collectStar();
    expect(scoring.score).toBe(STAR_BASE_POINTS * 2);
  });

  test('nearMiss increases combo and multiplier', () => {
    scoring.nearMiss();
    expect(scoring.combo).toBe(1);
    expect(scoring.multiplier).toBe(1.5);
    expect(scoring.score).toBe(Math.floor(NEAR_MISS_POINTS * 1.5));
  });

  test('consecutive near misses increase multiplier', () => {
    scoring.nearMiss();
    scoring.nearMiss();
    expect(scoring.combo).toBe(2);
    expect(scoring.multiplier).toBe(2.0);
  });

  test('multiplier caps at max', () => {
    for (let i = 0; i < 20; i++) scoring.nearMiss();
    expect(scoring.multiplier).toBe(COMBO_MAX_MULTIPLIER);
  });

  test('combo decays after timeout', () => {
    scoring.nearMiss();
    expect(scoring.combo).toBe(1);
    scoring.update(COMBO_DECAY_TIME + 0.1);
    expect(scoring.combo).toBe(0);
    expect(scoring.multiplier).toBe(1.0);
  });

  test('combo timer resets on new near miss', () => {
    scoring.nearMiss();
    scoring.update(COMBO_DECAY_TIME - 0.1);
    scoring.nearMiss();
    expect(scoring.combo).toBe(2);
    expect(scoring.comboTimer).toBe(COMBO_DECAY_TIME);
  });

  test('finalize updates high score', () => {
    scoring.score = 500;
    scoring.finalize();
    expect(scoring.highScore).toBe(500);
  });

  test('finalize preserves higher high score', () => {
    scoring.highScore = 1000;
    scoring.score = 500;
    scoring.finalize();
    expect(scoring.highScore).toBe(1000);
  });

  test('reset clears score but not high score', () => {
    scoring.score = 500;
    scoring.highScore = 1000;
    scoring.nearMiss();
    scoring.reset();
    expect(scoring.score).toBe(0);
    expect(scoring.combo).toBe(0);
    expect(scoring.multiplier).toBe(1.0);
    // high score persists
    expect(scoring.highScore).toBe(1000);
  });
});
