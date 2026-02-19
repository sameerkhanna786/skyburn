import {
  CANVAS_HEIGHT, SPAWN_BASE_INTERVAL, SPAWN_MIN_INTERVAL,
  SPAWN_SAFE_MARGIN, OBSTACLE_MIN_GAP
} from '../constants.js';

export class Spawner {
  constructor() {
    this.timer = 0;
    this.density = 1;
    this.unlockedTypes = ['terrain'];
    this.lastSpawnY = CANVAS_HEIGHT / 2;
  }

  getInterval() {
    const interval = SPAWN_BASE_INTERVAL / this.density;
    return Math.max(interval, SPAWN_MIN_INTERVAL);
  }

  update(dt) {
    this.timer += dt;
  }

  shouldSpawn() {
    return this.timer >= this.getInterval();
  }

  resetTimer() {
    this.timer = 0;
  }

  pickType() {
    const idx = Math.floor(Math.random() * this.unlockedTypes.length);
    return this.unlockedTypes[idx];
  }

  pickY(minGap = OBSTACLE_MIN_GAP) {
    const minY = SPAWN_SAFE_MARGIN;
    const maxY = CANVAS_HEIGHT - SPAWN_SAFE_MARGIN;

    let y;
    let attempts = 0;
    do {
      y = minY + Math.random() * (maxY - minY);
      attempts++;
    } while (Math.abs(y - this.lastSpawnY) < minGap && attempts < 10);

    this.lastSpawnY = y;
    return y;
  }

  unlockType(type) {
    if (!this.unlockedTypes.includes(type)) {
      this.unlockedTypes.push(type);
    }
  }

  setDensity(density) {
    this.density = density;
  }

  reset() {
    this.timer = 0;
    this.density = 1;
    this.unlockedTypes = ['terrain'];
    this.lastSpawnY = CANVAS_HEIGHT / 2;
  }
}
