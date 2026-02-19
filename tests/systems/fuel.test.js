import { FuelSystem } from '../../src/systems/fuel.js';
import { FUEL_MAX, FUEL_DRAIN_RATE } from '../../src/constants.js';

describe('FuelSystem', () => {
  let fuel;

  beforeEach(() => {
    fuel = new FuelSystem();
  });

  test('starts at max', () => {
    expect(fuel.fuel).toBe(FUEL_MAX);
    expect(fuel.getPercent()).toBe(1.0);
  });

  test('drains over time', () => {
    fuel.update(1.0); // 1 second
    expect(fuel.fuel).toBeLessThan(FUEL_MAX);
  });

  test('drains faster at higher speed', () => {
    const f1 = new FuelSystem();
    const f2 = new FuelSystem();
    f1.update(1.0, 1.0);
    f2.update(1.0, 2.0);
    expect(f2.fuel).toBeLessThan(f1.fuel);
  });

  test('cannot go below 0', () => {
    fuel.update(1000);
    expect(fuel.fuel).toBe(0);
  });

  test('isEmpty when fuel is 0', () => {
    expect(fuel.isEmpty()).toBe(false);
    fuel.update(1000);
    expect(fuel.isEmpty()).toBe(true);
  });

  test('addFuel restores fuel', () => {
    fuel.fuel = 50; // set to half
    fuel.addFuel(25);
    expect(fuel.fuel).toBe(75);
  });

  test('addFuel caps at max', () => {
    fuel.addFuel(50);
    expect(fuel.fuel).toBe(FUEL_MAX);
  });

  test('getPercent reflects current level', () => {
    fuel.fuel = FUEL_MAX / 2;
    expect(fuel.getPercent()).toBeCloseTo(0.5);
  });

  test('reset restores to max', () => {
    fuel.update(5);
    fuel.reset();
    expect(fuel.fuel).toBe(FUEL_MAX);
  });
});
