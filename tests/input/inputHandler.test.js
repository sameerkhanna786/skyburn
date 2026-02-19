import { InputHandler } from '../../src/input/inputHandler.js';

describe('InputHandler', () => {
  let input;

  beforeEach(() => {
    input = new InputHandler();
  });

  test('isThrusting false by default', () => {
    expect(input.isThrusting()).toBe(false);
  });

  test('isThrusting true when ArrowUp pressed', () => {
    input.simulateKeyDown('ArrowUp');
    expect(input.isThrusting()).toBe(true);
  });

  test('isThrusting true when Space pressed', () => {
    input.simulateKeyDown('Space');
    expect(input.isThrusting()).toBe(true);
  });

  test('isThrusting false after key released', () => {
    input.simulateKeyDown('ArrowUp');
    input.simulateKeyUp('ArrowUp');
    expect(input.isThrusting()).toBe(false);
  });

  test('isThrusting true when touching', () => {
    input.simulateTouchStart();
    expect(input.isThrusting()).toBe(true);
  });

  test('isThrusting false after touch end', () => {
    input.simulateTouchStart();
    input.simulateTouchEnd();
    expect(input.isThrusting()).toBe(false);
  });

  test('justPressed detects new press', () => {
    input.update(); // save empty previous state
    input.simulateKeyDown('KeyP');
    expect(input.justPressed('KeyP')).toBe(true);
  });

  test('justPressed false for held key', () => {
    input.simulateKeyDown('KeyP');
    input.update(); // now previous has KeyP
    expect(input.justPressed('KeyP')).toBe(false);
  });

  test('justPressed false for unpressed key', () => {
    input.update();
    expect(input.justPressed('KeyP')).toBe(false);
  });

  test('isDown returns key state', () => {
    expect(input.isDown('KeyA')).toBe(false);
    input.simulateKeyDown('KeyA');
    expect(input.isDown('KeyA')).toBe(true);
  });

  test('reset clears all state', () => {
    input.simulateKeyDown('ArrowUp');
    input.simulateTouchStart();
    input.reset();
    expect(input.isThrusting()).toBe(false);
    expect(input.isDown('ArrowUp')).toBe(false);
  });
});
