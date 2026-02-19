import { Entity } from '../core/entity.js';
import {
  PLAYER_START_X, PLAYER_START_Y,
  PLAYER_WIDTH, PLAYER_HEIGHT
} from '../constants.js';

export class Player extends Entity {
  constructor() {
    super(PLAYER_START_X, PLAYER_START_Y, PLAYER_WIDTH, PLAYER_HEIGHT);
    this.shieldActive = false;
    this.alive = true;
    this.tiltAngle = 0;
  }

  updateTilt() {
    // Tilt based on vertical velocity: positive = nose down, negative = nose up
    this.tiltAngle = Math.atan2(this.velocity.y, 300) ;
  }

  takeDamage() {
    if (this.shieldActive) {
      this.shieldActive = false;
      return false; // survived
    }
    this.alive = false;
    this.deactivate();
    return true; // died
  }

  reset() {
    super.reset(PLAYER_START_X, PLAYER_START_Y);
    this.shieldActive = false;
    this.alive = true;
    this.tiltAngle = 0;
  }
}
