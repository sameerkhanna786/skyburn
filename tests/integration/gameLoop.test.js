import { Game, GameState } from '../../src/game.js';

describe('Game Loop Integration', () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  test('starts in TITLE state', () => {
    expect(game.state).toBe(GameState.TITLE);
  });

  test('start transitions to PLAYING', () => {
    game.start();
    expect(game.state).toBe(GameState.PLAYING);
    expect(game.player.alive).toBe(true);
  });

  test('update does nothing in TITLE state', () => {
    game.update(1/60);
    expect(game.elapsed).toBe(0);
  });

  test('update advances elapsed in PLAYING state', () => {
    game.start();
    game.update(1/60);
    expect(game.elapsed).toBeGreaterThan(0);
  });

  test('pause and resume toggle', () => {
    game.start();
    game.togglePause();
    expect(game.state).toBe(GameState.PAUSED);
    game.togglePause();
    expect(game.state).toBe(GameState.PLAYING);
  });

  test('update does nothing in PAUSED state', () => {
    game.start();
    game.update(1/60);
    const elapsed = game.elapsed;
    game.pause();
    game.update(1/60);
    expect(game.elapsed).toBe(elapsed);
  });

  test('player physics work during play', () => {
    game.start();
    const startY = game.player.position.y;
    // No thrust — gravity should pull down
    for (let i = 0; i < 30; i++) game.update(1/60);
    expect(game.player.position.y).toBeGreaterThan(startY);
  });

  test('obstacles spawn over time', () => {
    game.start();
    // Run several seconds of game time
    for (let i = 0; i < 300; i++) game.update(1/60);
    expect(game.obstaclePool.activeCount).toBeGreaterThan(0);
  });

  test('score increases with distance', () => {
    game.start();
    for (let i = 0; i < 60; i++) game.update(1/60);
    expect(game.getScore()).toBeGreaterThan(0);
  });

  test('restart resets everything', () => {
    game.start();
    for (let i = 0; i < 300; i++) game.update(1/60);
    const oldScore = game.getScore();
    game.start(); // restart
    expect(game.getScore()).toBe(0);
    expect(game.player.alive).toBe(true);
    expect(game.state).toBe(GameState.PLAYING);
  });
});
