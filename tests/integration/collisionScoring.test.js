import { CollisionSystem } from '../../src/systems/collision.js';
import { ScoringSystem } from '../../src/systems/scoring.js';
import { Player } from '../../src/entities/player.js';
import { Obstacle } from '../../src/entities/obstacle.js';
import { NEAR_MISS_MARGIN } from '../../src/constants.js';

describe('Collision + Scoring Integration', () => {
  let collision;
  let scoring;
  let player;

  beforeEach(() => {
    collision = new CollisionSystem();
    scoring = new ScoringSystem();
    player = new Player();
  });

  test('collision causes damage to player', () => {
    const obs = new Obstacle();
    obs.init('terrain', player.position.x, player.position.y, 40, 40, 200);

    if (collision.checkCollision(player, obs)) {
      player.takeDamage();
    }
    expect(player.alive).toBe(false);
  });

  test('near miss awards points and combo', () => {
    const obs = new Obstacle();
    // Place obstacle just outside player bounds but within near-miss zone
    obs.init('terrain', player.position.x + player.width + NEAR_MISS_MARGIN - 5, player.position.y, 20, 20, 200);

    if (collision.checkNearMiss(player, obs)) {
      scoring.nearMiss();
    }
    expect(scoring.combo).toBe(1);
    expect(scoring.score).toBeGreaterThan(0);
  });

  test('shield absorbs collision', () => {
    player.shieldActive = true;
    const obs = new Obstacle();
    obs.init('terrain', player.position.x, player.position.y, 40, 40, 200);

    if (collision.checkCollision(player, obs)) {
      player.takeDamage();
    }
    expect(player.alive).toBe(true);
    expect(player.shieldActive).toBe(false);
  });
});
