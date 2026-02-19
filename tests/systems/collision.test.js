import { CollisionSystem } from '../../src/systems/collision.js';
import { Entity } from '../../src/core/entity.js';
import { NEAR_MISS_MARGIN } from '../../src/constants.js';

describe('CollisionSystem', () => {
  let collision;

  beforeEach(() => {
    collision = new CollisionSystem();
  });

  describe('checkCollision', () => {
    test('detects overlapping entities', () => {
      const a = new Entity(0, 0, 10, 10);
      const b = new Entity(5, 5, 10, 10);
      expect(collision.checkCollision(a, b)).toBe(true);
    });

    test('returns false for non-overlapping', () => {
      const a = new Entity(0, 0, 10, 10);
      const b = new Entity(20, 20, 10, 10);
      expect(collision.checkCollision(a, b)).toBe(false);
    });

    test('returns false if entity A is inactive', () => {
      const a = new Entity(0, 0, 10, 10);
      const b = new Entity(5, 5, 10, 10);
      a.active = false;
      expect(collision.checkCollision(a, b)).toBe(false);
    });

    test('returns false if entity B is inactive', () => {
      const a = new Entity(0, 0, 10, 10);
      const b = new Entity(5, 5, 10, 10);
      b.active = false;
      expect(collision.checkCollision(a, b)).toBe(false);
    });
  });

  describe('checkNearMiss', () => {
    test('detects near miss when close but not colliding', () => {
      const player = new Entity(0, 0, 10, 10);
      const obstacle = new Entity(10 + NEAR_MISS_MARGIN - 1, 0, 10, 10);
      expect(collision.checkNearMiss(player, obstacle)).toBe(true);
    });

    test('returns false when actually colliding', () => {
      const player = new Entity(0, 0, 10, 10);
      const obstacle = new Entity(5, 5, 10, 10);
      expect(collision.checkNearMiss(player, obstacle)).toBe(false);
    });

    test('returns false when too far away', () => {
      const player = new Entity(0, 0, 10, 10);
      const obstacle = new Entity(100, 100, 10, 10);
      expect(collision.checkNearMiss(player, obstacle)).toBe(false);
    });

    test('returns false for inactive entities', () => {
      const player = new Entity(0, 0, 10, 10);
      const obstacle = new Entity(11, 0, 10, 10);
      player.active = false;
      expect(collision.checkNearMiss(player, obstacle)).toBe(false);
    });
  });

  describe('spatial indexing', () => {
    test('queryNearby returns entities in same bucket', () => {
      const a = new Entity(50, 50, 10, 10);
      const b = new Entity(60, 60, 10, 10);
      const c = new Entity(500, 500, 10, 10);

      collision.buildSpatialIndex([a, b, c]);

      const nearA = collision.queryNearby(a);
      expect(nearA).toContain(b);
      expect(nearA).not.toContain(c);
    });

    test('queryNearby excludes self', () => {
      const a = new Entity(50, 50, 10, 10);
      collision.buildSpatialIndex([a]);

      const nearA = collision.queryNearby(a);
      expect(nearA).not.toContain(a);
    });

    test('buildSpatialIndex ignores inactive entities', () => {
      const a = new Entity(50, 50, 10, 10);
      const b = new Entity(60, 60, 10, 10);
      b.active = false;

      collision.buildSpatialIndex([a, b]);
      const nearA = collision.queryNearby(a);
      expect(nearA).not.toContain(b);
    });
  });
});
