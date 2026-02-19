// ─── Canvas / World ───
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

// ─── Player ───
export const PLAYER_START_X = 150;
export const PLAYER_START_Y = 300;
export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 20;

// ─── Flight Physics ───
export const GRAVITY = 800;        // px/s² downward
export const LIFT_FORCE = 1400;    // px/s² upward when thrusting
export const DRAG = 2.0;           // velocity damping factor
export const MAX_CLIMB = -600;     // max upward velocity (negative = up)
export const MAX_FALL = 500;       // max downward velocity
export const BASE_SCROLL_SPEED = 200; // px/s leftward

// ─── Obstacles ───
export const OBSTACLE_MIN_GAP = 120;   // min vertical gap between obstacles
export const NEAR_MISS_MARGIN = 25;    // px expansion for near-miss detection
export const OBSTACLE_TYPES = ['terrain', 'missile', 'drone', 'laserGate'];

// ─── Spawning ───
export const SPAWN_BASE_INTERVAL = 1.5;  // seconds between spawns at density 1
export const SPAWN_MIN_INTERVAL = 0.4;
export const SPAWN_SAFE_MARGIN = 60;     // px from top/bottom for spawn positions

// ─── Scoring ───
export const POINTS_PER_DISTANCE = 1;    // per 10px scrolled
export const STAR_BASE_POINTS = 100;
export const NEAR_MISS_POINTS = 25;
export const COMBO_MULTIPLIER_STEP = 0.5;
export const COMBO_MAX_MULTIPLIER = 5.0;
export const COMBO_DECAY_TIME = 2.0;     // seconds before combo resets

// ─── Fuel ───
export const FUEL_MAX = 100;
export const FUEL_DRAIN_RATE = 3;        // per second base
export const FUEL_SPEED_DRAIN_MULT = 0.5; // extra drain per speed unit
export const FUEL_PICKUP_RESTORE = 25;    // percent restored

// ─── Power-ups ───
export const SHIELD_DURATION = 5.0;
export const MAGNET_DURATION = 7.0;
export const AFTERBURNER_DURATION = 3.0;
export const MAGNET_RANGE = 150;         // px attraction radius
export const AFTERBURNER_SPEED_MULT = 2.0;

// ─── Difficulty ───
export const DIFFICULTY_LEVEL_INTERVAL = 15; // seconds per level
export const DIFFICULTY_SPEED_BASE = 3;
export const DIFFICULTY_SPEED_LOG_SCALE = 2;
export const DIFFICULTY_TIME_SCALE = 30;

// ─── Particles ───
export const EXHAUST_RATE = 30;          // particles per second
export const EXPLOSION_COUNT = 20;
export const SPARKLE_COUNT = 5;
export const PARTICLE_LIFETIME = 0.8;    // seconds

// ─── Collectibles ───
export const STAR_SIZE = 16;
export const FUEL_CELL_SIZE = 18;
export const POWERUP_SIZE = 22;

// ─── Colors (neon retro) ───
export const COLOR_BACKGROUND = '#0a0a1a';
export const COLOR_PLAYER = '#00ffcc';
export const COLOR_OBSTACLE = '#ff0055';
export const COLOR_STAR = '#ffff00';
export const COLOR_FUEL = '#00ff44';
export const COLOR_SHIELD = '#4488ff';
export const COLOR_MAGNET = '#ff44ff';
export const COLOR_AFTERBURNER = '#ff8800';
export const COLOR_EXHAUST = '#ff6600';
export const COLOR_HUD = '#ffffff';
export const COLOR_COMBO = '#ffcc00';
