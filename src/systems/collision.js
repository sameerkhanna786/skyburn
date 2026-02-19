import { NEAR_MISS_MARGIN } from '../constants.js';

export class CollisionSystem {
  constructor() {
    this._bucketSize = 100;
    this._buckets = new Map();
  }

  checkCollision(entityA, entityB) {
    if (!entityA.active || !entityB.active) return false;
    return entityA.bounds.overlaps(entityB.bounds);
  }

  checkNearMiss(player, obstacle) {
    if (!player.active || !obstacle.active) return false;
    const playerBounds = player.bounds;
    const obstacleBounds = obstacle.bounds;

    // Not a near miss if actually colliding
    if (playerBounds.overlaps(obstacleBounds)) return false;

    // Check if expanded bounds overlap
    const expandedObstacle = obstacleBounds.expand(NEAR_MISS_MARGIN);
    return playerBounds.overlaps(expandedObstacle);
  }

  _getBucketKey(x, y) {
    const bx = Math.floor(x / this._bucketSize);
    const by = Math.floor(y / this._bucketSize);
    return `${bx},${by}`;
  }

  buildSpatialIndex(entities) {
    this._buckets.clear();
    for (const entity of entities) {
      if (!entity.active) continue;
      const bounds = entity.bounds;
      const minBx = Math.floor(bounds.left / this._bucketSize);
      const maxBx = Math.floor(bounds.right / this._bucketSize);
      const minBy = Math.floor(bounds.top / this._bucketSize);
      const maxBy = Math.floor(bounds.bottom / this._bucketSize);

      for (let bx = minBx; bx <= maxBx; bx++) {
        for (let by = minBy; by <= maxBy; by++) {
          const key = `${bx},${by}`;
          if (!this._buckets.has(key)) {
            this._buckets.set(key, []);
          }
          this._buckets.get(key).push(entity);
        }
      }
    }
  }

  queryNearby(entity) {
    const bounds = entity.bounds;
    const minBx = Math.floor(bounds.left / this._bucketSize);
    const maxBx = Math.floor(bounds.right / this._bucketSize);
    const minBy = Math.floor(bounds.top / this._bucketSize);
    const maxBy = Math.floor(bounds.bottom / this._bucketSize);

    const result = new Set();
    for (let bx = minBx; bx <= maxBx; bx++) {
      for (let by = minBy; by <= maxBy; by++) {
        const key = `${bx},${by}`;
        const bucket = this._buckets.get(key);
        if (bucket) {
          for (const other of bucket) {
            if (other !== entity) {
              result.add(other);
            }
          }
        }
      }
    }
    return [...result];
  }
}
