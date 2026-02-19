export class InputHandler {
  constructor() {
    this._keys = {};
    this._previousKeys = {};
    this._touching = false;
    this._boundKeyDown = null;
    this._boundKeyUp = null;
    this._boundTouchStart = null;
    this._boundTouchEnd = null;
  }

  attach(target) {
    this._boundKeyDown = (e) => {
      this._keys[e.code] = true;
    };
    this._boundKeyUp = (e) => {
      this._keys[e.code] = false;
    };
    this._boundTouchStart = (e) => {
      e.preventDefault();
      this._touching = true;
    };
    this._boundTouchEnd = (e) => {
      this._touching = false;
    };

    target.addEventListener('keydown', this._boundKeyDown);
    target.addEventListener('keyup', this._boundKeyUp);
    if (target.addEventListener) {
      target.addEventListener('touchstart', this._boundTouchStart, { passive: false });
      target.addEventListener('touchend', this._boundTouchEnd);
    }
  }

  detach(target) {
    if (this._boundKeyDown) {
      target.removeEventListener('keydown', this._boundKeyDown);
      target.removeEventListener('keyup', this._boundKeyUp);
      target.removeEventListener('touchstart', this._boundTouchStart);
      target.removeEventListener('touchend', this._boundTouchEnd);
    }
  }

  update() {
    this._previousKeys = { ...this._keys };
  }

  isThrusting() {
    return this._keys['ArrowUp'] || this._keys['Space'] || this._touching;
  }

  justPressed(code) {
    return !!this._keys[code] && !this._previousKeys[code];
  }

  isDown(code) {
    return !!this._keys[code];
  }

  // For testing: simulate key state
  simulateKeyDown(code) {
    this._keys[code] = true;
  }

  simulateKeyUp(code) {
    this._keys[code] = false;
  }

  simulateTouchStart() {
    this._touching = true;
  }

  simulateTouchEnd() {
    this._touching = false;
  }

  reset() {
    this._keys = {};
    this._previousKeys = {};
    this._touching = false;
  }
}
