import { Player } from '../../src/entities/player.js';
import { PLAYER_START_X, PLAYER_START_Y, PLAYER_WIDTH, PLAYER_HEIGHT } from '../../src/constants.js';

describe('Player', () => {
  let player;

  beforeEach(() => {
    player = new Player();
  });

  test('starts at correct position', () => {
    expect(player.position.x).toBe(PLAYER_START_X);
    expect(player.position.y).toBe(PLAYER_START_Y);
  });

  test('has correct dimensions', () => {
    expect(player.width).toBe(PLAYER_WIDTH);
    expect(player.height).toBe(PLAYER_HEIGHT);
  });

  test('starts alive and active', () => {
    expect(player.alive).toBe(true);
    expect(player.active).toBe(true);
  });

  test('starts without shield', () => {
    expect(player.shieldActive).toBe(false);
  });

  test('takeDamage without shield kills player', () => {
    const died = player.takeDamage();
    expect(died).toBe(true);
    expect(player.alive).toBe(false);
    expect(player.active).toBe(false);
  });

  test('takeDamage with shield consumes shield', () => {
    player.shieldActive = true;
    const died = player.takeDamage();
    expect(died).toBe(false);
    expect(player.alive).toBe(true);
    expect(player.shieldActive).toBe(false);
  });

  test('second hit after shield kills player', () => {
    player.shieldActive = true;
    player.takeDamage();
    const died = player.takeDamage();
    expect(died).toBe(true);
    expect(player.alive).toBe(false);
  });

  test('updateTilt sets angle based on velocity', () => {
    player.velocity.y = 0;
    player.updateTilt();
    expect(player.tiltAngle).toBeCloseTo(0);

    player.velocity.y = 300;
    player.updateTilt();
    expect(player.tiltAngle).toBeGreaterThan(0);

    player.velocity.y = -300;
    player.updateTilt();
    expect(player.tiltAngle).toBeLessThan(0);
  });

  test('reset restores all state', () => {
    player.position.set(500, 500);
    player.velocity.set(100, 200);
    player.shieldActive = true;
    player.alive = false;
    player.active = false;
    player.tiltAngle = 1.5;

    player.reset();

    expect(player.position.x).toBe(PLAYER_START_X);
    expect(player.position.y).toBe(PLAYER_START_Y);
    expect(player.velocity.x).toBe(0);
    expect(player.velocity.y).toBe(0);
    expect(player.alive).toBe(true);
    expect(player.active).toBe(true);
    expect(player.shieldActive).toBe(false);
    expect(player.tiltAngle).toBe(0);
  });
});
