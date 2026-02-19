import { PhysicsSystem } from './systems/physics.js';
import { CollisionSystem } from './systems/collision.js';
import { Spawner } from './systems/spawner.js';
import { ScoringSystem } from './systems/scoring.js';
import { FuelSystem } from './systems/fuel.js';
import { DifficultySystem } from './systems/difficulty.js';
import { PowerupSystem } from './systems/powerup.js';
import { Player } from './entities/player.js';
import { Obstacle } from './entities/obstacle.js';
import { Collectible } from './entities/collectible.js';
import { Particle } from './entities/particle.js';
import { ObjectPool } from './core/objectPool.js';
import { InputHandler } from './input/inputHandler.js';
import {
  CANVAS_WIDTH, CANVAS_HEIGHT, BASE_SCROLL_SPEED,
  STAR_SIZE, FUEL_CELL_SIZE, POWERUP_SIZE, MAGNET_RANGE
} from './constants.js';
import {
  createTerrain, createMissile, createDrone,
  createLaserGate, createLaserGateBottom
} from './entities/obstacle.js';

export const GameState = {
  TITLE: 'TITLE',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
};

export class Game {
  constructor() {
    this.state = GameState.TITLE;
    this.player = new Player();
    this.physics = new PhysicsSystem();
    this.collision = new CollisionSystem();
    this.spawner = new Spawner();
    this.scoring = new ScoringSystem();
    this.fuel = new FuelSystem();
    this.difficulty = new DifficultySystem();
    this.powerup = new PowerupSystem();
    this.input = new InputHandler();

    this.obstaclePool = new ObjectPool(() => new Obstacle(), 20);
    this.collectiblePool = new ObjectPool(() => new Collectible(), 15);
    this.particlePool = new ObjectPool(() => new Particle(), 50);

    this.scrollSpeed = BASE_SCROLL_SPEED;
    this.elapsed = 0;
    this.distanceTraveled = 0;

    // Callbacks for rendering effects (set by renderer)
    this.onNearMiss = null;
    this.onCollect = null;
    this.onDeath = null;
    this.onPowerup = null;
  }

  start() {
    this.state = GameState.PLAYING;
    this.resetAll();
  }

  pause() {
    if (this.state === GameState.PLAYING) {
      this.state = GameState.PAUSED;
    }
  }

  resume() {
    if (this.state === GameState.PAUSED) {
      this.state = GameState.PLAYING;
    }
  }

  togglePause() {
    if (this.state === GameState.PLAYING) {
      this.pause();
    } else if (this.state === GameState.PAUSED) {
      this.resume();
    }
  }

  update(dt) {
    if (this.state !== GameState.PLAYING) return;

    this.elapsed += dt;
    const distance = this.scrollSpeed * dt;
    this.distanceTraveled += distance;

    // Difficulty
    this.difficulty.update(dt);
    this.scrollSpeed = this.difficulty.getScrollSpeed(BASE_SCROLL_SPEED);
    this.spawner.setDensity(this.difficulty.getDensity());
    const unlocks = this.difficulty.getUnlockedTypes();
    for (const type of unlocks) {
      this.spawner.unlockType(type);
    }

    // Power-ups
    this.powerup.update(dt);
    this.player.shieldActive = this.powerup.isActive('shield');

    // Physics
    this.physics.update(this.player, dt, this.input.isThrusting());
    this.player.updateTilt();

    // Fuel
    this.fuel.update(dt, this.scrollSpeed / BASE_SCROLL_SPEED);
    if (this.fuel.isEmpty()) {
      this.die();
      return;
    }

    // Spawning
    this.spawner.update(dt);
    if (this.spawner.shouldSpawn()) {
      this.spawnObstacle();
      this.spawner.resetTimer();
    }

    // Spawn collectibles periodically
    this.maybeSpawnCollectible(dt);

    // Update obstacles
    this.obstaclePool.forEachActive((obs) => {
      obs.update(dt);
      if (!obs.active) {
        this.obstaclePool.release(obs);
      }
    });

    // Update collectibles (with magnet)
    const magnetActive = this.powerup.isActive('magnet');
    this.collectiblePool.forEachActive((col) => {
      if (magnetActive) {
        const pc = this.player.bounds.center();
        const dist = Math.sqrt(
          Math.pow(pc.x - col.position.x, 2) +
          Math.pow(pc.y - col.position.y, 2)
        );
        if (dist < MAGNET_RANGE) {
          col.attractTo(pc.x, pc.y, 400, dt);
        }
      }
      col.update(dt);
      if (!col.active) {
        this.collectiblePool.release(col);
      }
    });

    // Update particles
    this.particlePool.forEachActive((p) => {
      p.update(dt);
      if (!p.active) {
        this.particlePool.release(p);
      }
    });

    // Collision detection
    this.checkCollisions();

    // Score distance
    this.scoring.addDistance(distance);

    // Input state update (for justPressed tracking)
    this.input.update();
  }

  spawnObstacle() {
    const type = this.spawner.pickType();
    const x = CANVAS_WIDTH + 50;

    if (type === 'laserGate') {
      const gapY = this.spawner.pickY(0);
      const gapHeight = 130;
      const top = this.obstaclePool.acquire();
      createLaserGate(top, x, gapY, gapHeight, CANVAS_HEIGHT, this.scrollSpeed);
      const bottom = this.obstaclePool.acquire();
      createLaserGateBottom(bottom, x, gapY, gapHeight, CANVAS_HEIGHT, this.scrollSpeed);
    } else {
      const obs = this.obstaclePool.acquire();
      const y = this.spawner.pickY();
      switch (type) {
        case 'terrain':
          createTerrain(obs, x, y, 60 + Math.random() * 80, this.scrollSpeed);
          break;
        case 'missile':
          createMissile(obs, x, y, this.scrollSpeed);
          break;
        case 'drone':
          createDrone(obs, x, y, this.scrollSpeed);
          break;
      }
    }
  }

  _collectibleTimer = 0;
  maybeSpawnCollectible(dt) {
    this._collectibleTimer += dt;
    if (this._collectibleTimer < 2.0) return;
    this._collectibleTimer = 0;

    const x = CANVAS_WIDTH + 20;
    const y = 50 + Math.random() * (CANVAS_HEIGHT - 100);
    const roll = Math.random();

    const col = this.collectiblePool.acquire();
    if (roll < 0.5) {
      col.init('star', x, y, STAR_SIZE, this.scrollSpeed);
    } else if (roll < 0.75) {
      col.init('fuelCell', x, y, FUEL_CELL_SIZE, this.scrollSpeed);
    } else {
      const powerTypes = ['powerup_shield', 'powerup_magnet', 'powerup_afterburner'];
      const pt = powerTypes[Math.floor(Math.random() * powerTypes.length)];
      col.init(pt, x, y, POWERUP_SIZE, this.scrollSpeed);
    }
  }

  checkCollisions() {
    // Build spatial index for obstacles
    const obstacles = [];
    this.obstaclePool.forEachActive(obs => obstacles.push(obs));
    this.collision.buildSpatialIndex(obstacles);

    // Check player vs obstacles
    const nearby = this.collision.queryNearby(this.player);
    for (const obs of nearby) {
      if (this.collision.checkCollision(this.player, obs)) {
        const died = this.player.takeDamage();
        obs.deactivate();
        if (died) {
          this.die();
          return;
        }
      } else if (this.collision.checkNearMiss(this.player, obs) && !obs._nearMissed) {
        obs._nearMissed = true;
        this.scoring.nearMiss();
        if (this.onNearMiss) this.onNearMiss();
      }
    }

    // Check player vs collectibles
    this.collectiblePool.forEachActive((col) => {
      if (this.collision.checkCollision(this.player, col)) {
        this.collectItem(col);
        col.deactivate();
      }
    });
  }

  collectItem(col) {
    switch (col.type) {
      case 'star':
        this.scoring.collectStar();
        break;
      case 'fuelCell':
        this.fuel.addFuel(col.value);
        break;
      case 'powerup_shield':
        this.powerup.activate('shield');
        if (this.onPowerup) this.onPowerup('shield');
        break;
      case 'powerup_magnet':
        this.powerup.activate('magnet');
        if (this.onPowerup) this.onPowerup('magnet');
        break;
      case 'powerup_afterburner':
        this.powerup.activate('afterburner');
        if (this.onPowerup) this.onPowerup('afterburner');
        break;
    }
    if (this.onCollect) this.onCollect(col.type);
  }

  die() {
    this.state = GameState.GAME_OVER;
    this.player.alive = false;
    this.player.deactivate();
    if (this.onDeath) this.onDeath();
  }

  resetAll() {
    this.player.reset();
    this.obstaclePool.releaseAll();
    this.collectiblePool.releaseAll();
    this.particlePool.releaseAll();
    this.spawner.reset();
    this.scoring.reset();
    this.fuel.reset();
    this.difficulty.reset();
    this.powerup.reset();
    this.scrollSpeed = BASE_SCROLL_SPEED;
    this.elapsed = 0;
    this.distanceTraveled = 0;
    this._collectibleTimer = 0;
  }

  getScore() {
    return this.scoring.score;
  }

  getHighScore() {
    return this.scoring.highScore;
  }

  isNewHighScore() {
    return this.scoring.score > 0 && this.scoring.score >= this.scoring.highScore;
  }
}
