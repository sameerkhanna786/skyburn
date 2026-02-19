import { SHIELD_DURATION, MAGNET_DURATION, AFTERBURNER_DURATION } from '../constants.js';

const DURATIONS = {
  shield: SHIELD_DURATION,
  magnet: MAGNET_DURATION,
  afterburner: AFTERBURNER_DURATION,
};

export class PowerupSystem {
  constructor() {
    this.timers = {
      shield: 0,
      magnet: 0,
      afterburner: 0,
    };
  }

  activate(type) {
    if (DURATIONS[type] !== undefined) {
      this.timers[type] = DURATIONS[type];
    }
  }

  isActive(type) {
    return this.timers[type] > 0;
  }

  getRemaining(type) {
    return Math.max(0, this.timers[type]);
  }

  update(dt) {
    for (const type of Object.keys(this.timers)) {
      if (this.timers[type] > 0) {
        this.timers[type] -= dt;
        if (this.timers[type] < 0) {
          this.timers[type] = 0;
        }
      }
    }
  }

  reset() {
    this.timers.shield = 0;
    this.timers.magnet = 0;
    this.timers.afterburner = 0;
  }
}
