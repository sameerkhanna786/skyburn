import { Vector2D } from '../../src/core/vector.js';

describe('Vector2D', () => {
  test('constructor defaults to (0,0)', () => {
    const v = new Vector2D();
    expect(v.x).toBe(0);
    expect(v.y).toBe(0);
  });

  test('constructor accepts x and y', () => {
    const v = new Vector2D(3, 4);
    expect(v.x).toBe(3);
    expect(v.y).toBe(4);
  });

  test('add returns sum vector', () => {
    const a = new Vector2D(1, 2);
    const b = new Vector2D(3, 4);
    const result = a.add(b);
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });

  test('add does not mutate originals', () => {
    const a = new Vector2D(1, 2);
    const b = new Vector2D(3, 4);
    a.add(b);
    expect(a.x).toBe(1);
    expect(a.y).toBe(2);
  });

  test('subtract returns difference vector', () => {
    const a = new Vector2D(5, 7);
    const b = new Vector2D(2, 3);
    const result = a.subtract(b);
    expect(result.x).toBe(3);
    expect(result.y).toBe(4);
  });

  test('scale multiplies both components', () => {
    const v = new Vector2D(3, 4);
    const result = v.scale(2);
    expect(result.x).toBe(6);
    expect(result.y).toBe(8);
  });

  test('scale by zero returns zero vector', () => {
    const v = new Vector2D(3, 4);
    const result = v.scale(0);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });

  test('magnitude of (3,4) is 5', () => {
    const v = new Vector2D(3, 4);
    expect(v.magnitude()).toBe(5);
  });

  test('magnitude of zero vector is 0', () => {
    const v = new Vector2D(0, 0);
    expect(v.magnitude()).toBe(0);
  });

  test('normalize produces unit vector', () => {
    const v = new Vector2D(3, 4);
    const n = v.normalize();
    expect(n.x).toBeCloseTo(0.6);
    expect(n.y).toBeCloseTo(0.8);
    expect(n.magnitude()).toBeCloseTo(1);
  });

  test('normalize zero vector returns zero', () => {
    const v = new Vector2D(0, 0);
    const n = v.normalize();
    expect(n.x).toBe(0);
    expect(n.y).toBe(0);
  });

  test('clampMagnitude does nothing when under max', () => {
    const v = new Vector2D(3, 4); // mag 5
    const c = v.clampMagnitude(10);
    expect(c.x).toBe(3);
    expect(c.y).toBe(4);
  });

  test('clampMagnitude clamps when over max', () => {
    const v = new Vector2D(6, 8); // mag 10
    const c = v.clampMagnitude(5);
    expect(c.magnitude()).toBeCloseTo(5);
    expect(c.x).toBeCloseTo(3);
    expect(c.y).toBeCloseTo(4);
  });

  test('dot product', () => {
    const a = new Vector2D(1, 2);
    const b = new Vector2D(3, 4);
    expect(a.dot(b)).toBe(11);
  });

  test('dot product of perpendicular vectors is 0', () => {
    const a = new Vector2D(1, 0);
    const b = new Vector2D(0, 1);
    expect(a.dot(b)).toBe(0);
  });

  test('clone creates independent copy', () => {
    const v = new Vector2D(1, 2);
    const c = v.clone();
    c.x = 99;
    expect(v.x).toBe(1);
    expect(c.x).toBe(99);
  });

  test('set mutates in place and returns this', () => {
    const v = new Vector2D(1, 2);
    const ret = v.set(5, 6);
    expect(v.x).toBe(5);
    expect(v.y).toBe(6);
    expect(ret).toBe(v);
  });
});
