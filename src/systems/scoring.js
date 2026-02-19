import {
  STAR_BASE_POINTS, NEAR_MISS_POINTS, POINTS_PER_DISTANCE,
  COMBO_MULTIPLIER_STEP, COMBO_MAX_MULTIPLIER, COMBO_DECAY_TIME
} from '../constants.js';

export class ScoringSystem {
  constructor() {
    this.score = 0;
    this.highScore = 0;
    this.combo = 0;
    this.multiplier = 1.0;
    this.comboTimer = 0;
    this._distanceAccum = 0;
  }

  addDistance(pixels) {
    this._distanceAccum += pixels;
    while (this._distanceAccum >= 10) {
      this.score += POINTS_PER_DISTANCE;
      this._distanceAccum -= 10;
    }
  }

  collectStar() {
    this.score += Math.floor(STAR_BASE_POINTS * this.multiplier);
  }

  nearMiss() {
    this.combo++;
    this.comboTimer = COMBO_DECAY_TIME;
    this.multiplier = Math.min(
      1.0 + this.combo * COMBO_MULTIPLIER_STEP,
      COMBO_MAX_MULTIPLIER
    );
    this.score += Math.floor(NEAR_MISS_POINTS * this.multiplier);
  }

  update(dt) {
    if (this.combo > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.combo = 0;
        this.multiplier = 1.0;
        this.comboTimer = 0;
      }
    }
  }

  finalize() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
  }

  reset() {
    this.score = 0;
    this.combo = 0;
    this.multiplier = 1.0;
    this.comboTimer = 0;
    this._distanceAccum = 0;
  }
}
