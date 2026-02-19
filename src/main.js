import { Game, GameState } from './game.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLOR_EXHAUST, COLOR_PLAYER, COLOR_STAR, COLOR_AFTERBURNER } from './constants.js';
import { Renderer } from './rendering/renderer.js';
import { PlayerRenderer } from './rendering/playerRenderer.js';
import { ObstacleRenderer } from './rendering/obstacleRenderer.js';
import { ParticleRenderer } from './rendering/particleRenderer.js';
import { HudRenderer } from './rendering/hudRenderer.js';
import { BackgroundRenderer } from './rendering/backgroundRenderer.js';
import { CollectibleRenderer } from './rendering/collectibleRenderer.js';
import { ScreenEffects } from './rendering/screenEffects.js';
import { AudioManager } from './audio/audioManager.js';
import { TitleScreen } from './ui/titleScreen.js';
import { GameOverScreen } from './ui/gameOverScreen.js';
import { PauseScreen } from './ui/pauseScreen.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const game = new Game();
const renderer = new Renderer(ctx);
const playerRenderer = new PlayerRenderer(ctx);
const obstacleRenderer = new ObstacleRenderer(ctx);
const particleRenderer = new ParticleRenderer(ctx);
const hudRenderer = new HudRenderer(ctx);
const bgRenderer = new BackgroundRenderer(ctx);
const collectibleRenderer = new CollectibleRenderer(ctx);
const screenEffects = new ScreenEffects(ctx);
const audio = new AudioManager();
const titleScreen = new TitleScreen(ctx);
const gameOverScreen = new GameOverScreen(ctx);
const pauseScreen = new PauseScreen(ctx);

// Load high score from localStorage
try {
  const saved = localStorage.getItem('skyburn_highscore');
  if (saved) game.scoring.highScore = parseInt(saved, 10);
} catch (e) {}

// Particle spawning helpers
function spawnExhaust() {
  const p = game.particlePool.acquire();
  const px = game.player.position.x - 5;
  const py = game.player.position.y + game.player.height / 2 + (Math.random() - 0.5) * 8;
  p.init(px, py, -80 - Math.random() * 60, (Math.random() - 0.5) * 40, 0.3 + Math.random() * 0.3, COLOR_EXHAUST, 2 + Math.random() * 2);
}

function spawnExplosion(x, y) {
  for (let i = 0; i < 20; i++) {
    const p = game.particlePool.acquire();
    const angle = Math.random() * Math.PI * 2;
    const speed = 50 + Math.random() * 200;
    p.init(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, 0.5 + Math.random() * 0.5, '#ff' + ['0055', '3300', '6600', 'ff00'][Math.floor(Math.random() * 4)], 2 + Math.random() * 3);
  }
}

function spawnSparkle(x, y, color) {
  for (let i = 0; i < 5; i++) {
    const p = game.particlePool.acquire();
    const angle = Math.random() * Math.PI * 2;
    const speed = 30 + Math.random() * 80;
    p.init(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, 0.3 + Math.random() * 0.3, color, 1 + Math.random() * 2);
  }
}

// Game event callbacks
game.onNearMiss = () => {
  screenEffects.shake(3, 0.15);
  audio.playNearMiss();
  audio.playCombo();
  const pc = game.player.bounds.center();
  spawnSparkle(pc.x, pc.y, COLOR_PLAYER);
};

game.onCollect = (type) => {
  audio.playPickup();
  const pc = game.player.bounds.center();
  const color = type === 'star' ? COLOR_STAR : type === 'fuelCell' ? '#00ff44' : '#ffffff';
  spawnSparkle(pc.x, pc.y, color);
};

game.onDeath = () => {
  screenEffects.shake(10, 0.4);
  audio.playExplosion();
  audio.stopEngine();
  game.scoring.finalize();
  try {
    localStorage.setItem('skyburn_highscore', game.scoring.highScore.toString());
  } catch (e) {}
  const pc = game.player.bounds.center();
  spawnExplosion(pc.x, pc.y);
};

game.onPowerup = (type) => {
  const colors = { shield: '#4488ff', magnet: '#ff44ff', afterburner: '#ff8800' };
  screenEffects.flash(colors[type] || '#ffffff', 0.3);
  audio.playPowerup();
};

// Input
game.input.attach(document);

// Handle start/restart via direct key listener (works in all states)
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    if (game.state === GameState.TITLE || game.state === GameState.GAME_OVER) {
      e.preventDefault();
      audio.init();
      audio.resume();
      game.start();
    }
  }
  if (e.code === 'KeyP') {
    if (game.state === GameState.PLAYING || game.state === GameState.PAUSED) {
      game.togglePause();
      if (game.state === GameState.PAUSED) {
        audio.stopEngine();
      }
    }
  }
});

// Touch start/restart
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (game.state === GameState.TITLE || game.state === GameState.GAME_OVER) {
    audio.init();
    audio.resume();
    game.start();
  }
}, { passive: false });

// Exhaust timer
let exhaustAccum = 0;

// Frame counter for performance
let frameCount = 0;
let fpsTimer = 0;
let currentFps = 0;

// Game loop
let lastTime = performance.now();

function gameLoop(now) {
  const rawDt = (now - lastTime) / 1000;
  lastTime = now;
  // Cap dt to prevent spiral of death
  const dt = Math.min(rawDt, 1 / 20);

  // FPS counter
  frameCount++;
  fpsTimer += dt;
  if (fpsTimer >= 1) {
    currentFps = frameCount;
    frameCount = 0;
    fpsTimer = 0;
  }

  // Update
  if (game.state === GameState.TITLE) {
    titleScreen.update(dt);
    bgRenderer.update(dt, 100);
  } else if (game.state === GameState.PLAYING) {
    game.update(dt);
    bgRenderer.update(dt, game.scrollSpeed);
    screenEffects.update(dt);
    game.scoring.update(dt);
    audio.updateEngine(game.input.isThrusting());

    // Exhaust particles
    if (game.player.alive) {
      exhaustAccum += dt;
      const interval = 1 / (game.input.isThrusting() ? 50 : 20);
      while (exhaustAccum >= interval) {
        spawnExhaust();
        exhaustAccum -= interval;
      }
    }
  } else if (game.state === GameState.GAME_OVER) {
    gameOverScreen.update(dt);
    screenEffects.update(dt);
    // Keep updating particles for death explosion
    game.particlePool.forEachActive((p) => {
      p.update(dt);
      if (!p.active) game.particlePool.release(p);
    });
  }

  // Render
  ctx.save();
  renderer.clear();

  // Apply screen shake
  screenEffects.applyShake();

  // Background (all states)
  bgRenderer.draw();

  if (game.state === GameState.TITLE) {
    titleScreen.draw();
  } else if (game.state === GameState.PLAYING || game.state === GameState.PAUSED) {
    // Obstacles
    game.obstaclePool.forEachActive(obs => obstacleRenderer.draw(obs));

    // Collectibles
    game.collectiblePool.forEachActive(col => collectibleRenderer.draw(col));

    // Particles
    game.particlePool.forEachActive(p => particleRenderer.draw(p));

    // Player
    playerRenderer.draw(game.player);

    // Screen effects
    screenEffects.drawFlash();
    screenEffects.drawVignette();

    // HUD
    hudRenderer.draw(game);

    // Pause overlay
    if (game.state === GameState.PAUSED) {
      pauseScreen.draw();
    }
  } else if (game.state === GameState.GAME_OVER) {
    // Still render game world behind overlay
    game.obstaclePool.forEachActive(obs => obstacleRenderer.draw(obs));
    game.particlePool.forEachActive(p => particleRenderer.draw(p));
    screenEffects.drawFlash();

    gameOverScreen.draw(game.getScore(), game.getHighScore(), game.isNewHighScore());
  }

  // FPS display
  ctx.fillStyle = '#444';
  ctx.font = '10px monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`${currentFps} FPS`, CANVAS_WIDTH - 5, CANVAS_HEIGHT - 5);

  ctx.restore();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
