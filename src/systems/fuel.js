import { FUEL_MAX, FUEL_DRAIN_RATE, FUEL_SPEED_DRAIN_MULT, FUEL_PICKUP_RESTORE } from '../constants.js';

export class FuelSystem {
  constructor() {
    this.fuel = FUEL_MAX;
  }

  update(dt, speedMultiplier = 1) {
    const drain = FUEL_DRAIN_RATE + (speedMultiplier - 1) * FUEL_SPEED_DRAIN_MULT;
    this.fuel -= drain * dt;
    if (this.fuel < 0) this.fuel = 0;
  }

  addFuel(amount) {
    this.fuel = Math.min(this.fuel + amount, FUEL_MAX);
  }

  isEmpty() {
    return this.fuel <= 0;
  }

  getPercent() {
    return this.fuel / FUEL_MAX;
  }

  reset() {
    this.fuel = FUEL_MAX;
  }
}
