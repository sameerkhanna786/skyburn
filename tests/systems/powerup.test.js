import { PowerupSystem } from '../../src/systems/powerup.js';
import { SHIELD_DURATION, MAGNET_DURATION, AFTERBURNER_DURATION } from '../../src/constants.js';

describe('PowerupSystem', () => {
  let powerup;

  beforeEach(() => {
    powerup = new PowerupSystem();
  });

  test('no powerups active initially', () => {
    expect(powerup.isActive('shield')).toBe(false);
    expect(powerup.isActive('magnet')).toBe(false);
    expect(powerup.isActive('afterburner')).toBe(false);
  });

  test('activate shield', () => {
    powerup.activate('shield');
    expect(powerup.isActive('shield')).toBe(true);
    expect(powerup.getRemaining('shield')).toBe(SHIELD_DURATION);
  });

  test('activate magnet', () => {
    powerup.activate('magnet');
    expect(powerup.isActive('magnet')).toBe(true);
    expect(powerup.getRemaining('magnet')).toBe(MAGNET_DURATION);
  });

  test('activate afterburner', () => {
    powerup.activate('afterburner');
    expect(powerup.isActive('afterburner')).toBe(true);
  });

  test('powerup expires after duration', () => {
    powerup.activate('shield');
    powerup.update(SHIELD_DURATION + 0.1);
    expect(powerup.isActive('shield')).toBe(false);
  });

  test('multiple powerups can be active simultaneously', () => {
    powerup.activate('shield');
    powerup.activate('magnet');
    expect(powerup.isActive('shield')).toBe(true);
    expect(powerup.isActive('magnet')).toBe(true);
  });

  test('re-activation refreshes duration', () => {
    powerup.activate('shield');
    powerup.update(SHIELD_DURATION - 1);
    expect(powerup.getRemaining('shield')).toBeCloseTo(1);
    powerup.activate('shield');
    expect(powerup.getRemaining('shield')).toBe(SHIELD_DURATION);
  });

  test('getRemaining returns 0 for inactive', () => {
    expect(powerup.getRemaining('shield')).toBe(0);
  });

  test('reset clears all powerups', () => {
    powerup.activate('shield');
    powerup.activate('magnet');
    powerup.activate('afterburner');
    powerup.reset();
    expect(powerup.isActive('shield')).toBe(false);
    expect(powerup.isActive('magnet')).toBe(false);
    expect(powerup.isActive('afterburner')).toBe(false);
  });
});
