import {
  GRAVITY, LIFT_FORCE, DRAG, MAX_CLIMB, MAX_FALL,
  CANVAS_HEIGHT, PLAYER_HEIGHT
} from '../constants.js';

export class PhysicsSystem {
  update(entity, dt, isThrusting) {
    // Apply gravity
    entity.velocity.y += GRAVITY * dt;

    // Apply lift if thrusting
    if (isThrusting) {
      entity.velocity.y -= LIFT_FORCE * dt;
    }

    // Apply drag
    entity.velocity.y *= (1 - DRAG * dt);

    // Clamp vertical velocity
    if (entity.velocity.y < MAX_CLIMB) {
      entity.velocity.y = MAX_CLIMB;
    }
    if (entity.velocity.y > MAX_FALL) {
      entity.velocity.y = MAX_FALL;
    }

    // Integrate position
    entity.position.y += entity.velocity.y * dt;

    // Boundary clamping
    if (entity.position.y < 0) {
      entity.position.y = 0;
      entity.velocity.y = 0;
    }
    const maxY = CANVAS_HEIGHT - entity.height;
    if (entity.position.y > maxY) {
      entity.position.y = maxY;
      entity.velocity.y = 0;
    }
  }
}
