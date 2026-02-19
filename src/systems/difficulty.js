import {
  DIFFICULTY_LEVEL_INTERVAL,
  DIFFICULTY_SPEED_BASE, DIFFICULTY_SPEED_LOG_SCALE, DIFFICULTY_TIME_SCALE
} from '../constants.js';

export class DifficultySystem {
  constructor() {
    this.elapsed = 0;
    this.level = 1;
  }

  update(dt) {
    this.elapsed += dt;
    this.level = 1 + Math.floor(this.elapsed / DIFFICULTY_LEVEL_INTERVAL);
  }

  getScrollSpeed(baseSpeed) {
    const multiplier = DIFFICULTY_SPEED_BASE + DIFFICULTY_SPEED_LOG_SCALE * Math.log(1 + this.elapsed / DIFFICULTY_TIME_SCALE);
    return baseSpeed * (multiplier / DIFFICULTY_SPEED_BASE);
  }

  getDensity() {
    return 1 + this.level * 0.2;
  }

  getUnlockedTypes() {
    const types = ['terrain'];
    if (this.level >= 2) types.push('missile');
    if (this.level >= 3) types.push('drone');
    if (this.level >= 4) types.push('laserGate');
    return types;
  }

  reset() {
    this.elapsed = 0;
    this.level = 1;
  }
}
