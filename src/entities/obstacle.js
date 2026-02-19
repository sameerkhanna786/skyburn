import { Entity } from '../core/entity.js';

export class Obstacle extends Entity {
  constructor() {
    super(0, 0, 0, 0);
    this.type = 'terrain';
    this.scrollSpeed = 0;
    this.oscillateAmplitude = 0;
    this.oscillateFrequency = 0;
    this.oscillatePhase = 0;
    this.baseY = 0;
    this.elapsed = 0;
    this.paired = false; // for laser gate pairs
    this.gapY = 0;       // for laser gates: center of gap
    this.gapHeight = 0;  // for laser gates: gap size
  }

  init(type, x, y, width, height, scrollSpeed) {
    this.position.set(x, y);
    this.width = width;
    this.height = height;
    this.type = type;
    this.scrollSpeed = scrollSpeed;
    this.active = true;
    this.velocity.set(-scrollSpeed, 0);
    this.oscillateAmplitude = 0;
    this.oscillateFrequency = 0;
    this.oscillatePhase = 0;
    this.baseY = y;
    this.elapsed = 0;
    this.paired = false;
    this.gapY = 0;
    this.gapHeight = 0;
  }

  update(dt) {
    this.elapsed += dt;

    // Move left
    this.position.x += this.velocity.x * dt;

    // Oscillation for drones
    if (this.oscillateAmplitude > 0) {
      this.position.y = this.baseY + Math.sin(this.elapsed * this.oscillateFrequency * Math.PI * 2 + this.oscillatePhase) * this.oscillateAmplitude;
    }

    // Deactivate when off-screen left
    if (this.position.x + this.width < -50) {
      this.active = false;
    }
  }
}

export function createTerrain(obstacle, x, y, height, scrollSpeed) {
  obstacle.init('terrain', x, y, 40, height, scrollSpeed);
}

export function createMissile(obstacle, x, y, scrollSpeed) {
  obstacle.init('missile', x, y, 30, 10, scrollSpeed * 1.5);
}

export function createDrone(obstacle, x, y, scrollSpeed) {
  obstacle.init('drone', x, y, 25, 25, scrollSpeed);
  obstacle.oscillateAmplitude = 50;
  obstacle.oscillateFrequency = 1.5;
  obstacle.oscillatePhase = Math.random() * Math.PI * 2;
}

export function createLaserGate(obstacle, x, gapY, gapHeight, canvasHeight, scrollSpeed) {
  // Top beam
  obstacle.init('laserGate', x, 0, 15, gapY - gapHeight / 2, scrollSpeed);
  obstacle.paired = true;
  obstacle.gapY = gapY;
  obstacle.gapHeight = gapHeight;
  return obstacle;
}

export function createLaserGateBottom(obstacle, x, gapY, gapHeight, canvasHeight, scrollSpeed) {
  const topOfBottom = gapY + gapHeight / 2;
  obstacle.init('laserGate', x, topOfBottom, 15, canvasHeight - topOfBottom, scrollSpeed);
  obstacle.paired = true;
  obstacle.gapY = gapY;
  obstacle.gapHeight = gapHeight;
  return obstacle;
}
