import { Entity } from '../../src/core/entity.js';

describe('Entity', () => {
  test('constructor defaults', () => {
    const e = new Entity();
    expect(e.position.x).toBe(0);
    expect(e.position.y).toBe(0);
    expect(e.velocity.x).toBe(0);
    expect(e.velocity.y).toBe(0);
    expect(e.width).toBe(0);
    expect(e.height).toBe(0);
    expect(e.active).toBe(true);
  });

  test('constructor with parameters', () => {
    const e = new Entity(10, 20, 30, 40);
    expect(e.position.x).toBe(10);
    expect(e.position.y).toBe(20);
    expect(e.width).toBe(30);
    expect(e.height).toBe(40);
  });

  test('bounds returns correct Rect', () => {
    const e = new Entity(10, 20, 30, 40);
    const b = e.bounds;
    expect(b.x).toBe(10);
    expect(b.y).toBe(20);
    expect(b.width).toBe(30);
    expect(b.height).toBe(40);
  });

  test('bounds updates when position changes', () => {
    const e = new Entity(10, 20, 30, 40);
    e.position.set(100, 200);
    const b = e.bounds;
    expect(b.x).toBe(100);
    expect(b.y).toBe(200);
  });

  test('reset restores position and velocity', () => {
    const e = new Entity(10, 20, 30, 40);
    e.position.set(100, 200);
    e.velocity.set(50, 60);
    e.active = false;
    e.reset(10, 20);
    expect(e.position.x).toBe(10);
    expect(e.position.y).toBe(20);
    expect(e.velocity.x).toBe(0);
    expect(e.velocity.y).toBe(0);
    expect(e.active).toBe(true);
  });

  test('deactivate sets active to false', () => {
    const e = new Entity();
    expect(e.active).toBe(true);
    e.deactivate();
    expect(e.active).toBe(false);
  });
});
