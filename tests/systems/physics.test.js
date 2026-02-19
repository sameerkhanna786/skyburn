import { PhysicsSystem } from '../../src/systems/physics.js';
import { Entity } from '../../src/core/entity.js';
import { GRAVITY, LIFT_FORCE, MAX_CLIMB, MAX_FALL, CANVAS_HEIGHT } from '../../src/constants.js';

describe('PhysicsSystem', () => {
  let physics;
  let entity;

  beforeEach(() => {
    physics = new PhysicsSystem();
    entity = new Entity(100, 300, 40, 20);
  });

  test('gravity accelerates downward', () => {
    physics.update(entity, 1/60, false);
    expect(entity.velocity.y).toBeGreaterThan(0);
  });

  test('thrust counteracts gravity', () => {
    physics.update(entity, 1/60, true);
    // LIFT_FORCE > GRAVITY, so net acceleration should be upward
    expect(entity.velocity.y).toBeLessThan(0);
  });

  test('position integrates from velocity', () => {
    entity.velocity.y = 100;
    const startY = entity.position.y;
    physics.update(entity, 1/60, false);
    expect(entity.position.y).toBeGreaterThan(startY);
  });

  test('velocity clamped to MAX_FALL', () => {
    entity.velocity.y = 9999;
    physics.update(entity, 1/60, false);
    expect(entity.velocity.y).toBeLessThanOrEqual(MAX_FALL);
  });

  test('velocity clamped to MAX_CLIMB', () => {
    entity.velocity.y = -9999;
    physics.update(entity, 1/60, true);
    expect(entity.velocity.y).toBeGreaterThanOrEqual(MAX_CLIMB);
  });

  test('position clamped to top boundary', () => {
    entity.position.y = -100;
    entity.velocity.y = -500;
    physics.update(entity, 1/60, false);
    expect(entity.position.y).toBeGreaterThanOrEqual(0);
    expect(entity.velocity.y).toBe(0);
  });

  test('position clamped to bottom boundary', () => {
    entity.position.y = CANVAS_HEIGHT + 100;
    entity.velocity.y = 500;
    physics.update(entity, 1/60, false);
    expect(entity.position.y).toBeLessThanOrEqual(CANVAS_HEIGHT - entity.height);
    expect(entity.velocity.y).toBe(0);
  });

  test('drag reduces velocity over time', () => {
    entity.velocity.y = 200;
    physics.update(entity, 1/60, false);
    // After gravity + drag, velocity should be less than initial + pure gravity
    const pureGravity = 200 + GRAVITY * (1/60);
    expect(entity.velocity.y).toBeLessThan(pureGravity);
  });

  test('sustained thrust causes climb', () => {
    for (let i = 0; i < 60; i++) {
      physics.update(entity, 1/60, true);
    }
    // After 1 second of thrust, should be higher than start
    expect(entity.position.y).toBeLessThan(300);
  });

  test('no thrust causes fall', () => {
    for (let i = 0; i < 60; i++) {
      physics.update(entity, 1/60, false);
    }
    expect(entity.position.y).toBeGreaterThan(300);
  });
});
