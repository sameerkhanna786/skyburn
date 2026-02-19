import { Rect } from '../../src/core/rect.js';

describe('Rect', () => {
  test('constructor sets properties', () => {
    const r = new Rect(10, 20, 30, 40);
    expect(r.x).toBe(10);
    expect(r.y).toBe(20);
    expect(r.width).toBe(30);
    expect(r.height).toBe(40);
  });

  test('edge getters', () => {
    const r = new Rect(10, 20, 30, 40);
    expect(r.left).toBe(10);
    expect(r.right).toBe(40);
    expect(r.top).toBe(20);
    expect(r.bottom).toBe(60);
  });

  test('center calculation', () => {
    const r = new Rect(10, 20, 30, 40);
    const c = r.center();
    expect(c.x).toBe(25);
    expect(c.y).toBe(40);
  });

  test('overlaps detects intersection', () => {
    const a = new Rect(0, 0, 10, 10);
    const b = new Rect(5, 5, 10, 10);
    expect(a.overlaps(b)).toBe(true);
    expect(b.overlaps(a)).toBe(true);
  });

  test('overlaps returns false for non-overlapping', () => {
    const a = new Rect(0, 0, 10, 10);
    const b = new Rect(20, 20, 10, 10);
    expect(a.overlaps(b)).toBe(false);
  });

  test('overlaps returns false for touching edges', () => {
    const a = new Rect(0, 0, 10, 10);
    const b = new Rect(10, 0, 10, 10);
    expect(a.overlaps(b)).toBe(false);
  });

  test('overlaps returns false for adjacent rects (horizontal)', () => {
    const a = new Rect(0, 0, 10, 10);
    const b = new Rect(0, 10, 10, 10);
    expect(a.overlaps(b)).toBe(false);
  });

  test('containsPoint inside', () => {
    const r = new Rect(10, 10, 20, 20);
    expect(r.containsPoint(15, 15)).toBe(true);
  });

  test('containsPoint on edge', () => {
    const r = new Rect(10, 10, 20, 20);
    expect(r.containsPoint(10, 10)).toBe(true);
    expect(r.containsPoint(30, 30)).toBe(true);
  });

  test('containsPoint outside', () => {
    const r = new Rect(10, 10, 20, 20);
    expect(r.containsPoint(5, 5)).toBe(false);
    expect(r.containsPoint(35, 35)).toBe(false);
  });

  test('expand creates larger rect', () => {
    const r = new Rect(10, 10, 20, 20);
    const e = r.expand(5);
    expect(e.x).toBe(5);
    expect(e.y).toBe(5);
    expect(e.width).toBe(30);
    expect(e.height).toBe(30);
  });

  test('expand does not mutate original', () => {
    const r = new Rect(10, 10, 20, 20);
    r.expand(5);
    expect(r.x).toBe(10);
    expect(r.width).toBe(20);
  });

  test('gapTo for separated rects', () => {
    const a = new Rect(0, 0, 10, 10);
    const b = new Rect(13, 14, 10, 10);
    // dx = 13-10 = 3, dy = 14-10 = 4, gap = 5
    expect(a.gapTo(b)).toBeCloseTo(5);
  });

  test('gapTo for overlapping rects is 0', () => {
    const a = new Rect(0, 0, 10, 10);
    const b = new Rect(5, 5, 10, 10);
    expect(a.gapTo(b)).toBe(0);
  });

  test('gapTo for horizontal separation only', () => {
    const a = new Rect(0, 0, 10, 10);
    const b = new Rect(15, 0, 10, 10);
    expect(a.gapTo(b)).toBe(5);
  });

  test('clone creates independent copy', () => {
    const r = new Rect(1, 2, 3, 4);
    const c = r.clone();
    c.x = 99;
    expect(r.x).toBe(1);
    expect(c.x).toBe(99);
  });

  test('set mutates in place', () => {
    const r = new Rect(0, 0, 0, 0);
    r.set(1, 2, 3, 4);
    expect(r.x).toBe(1);
    expect(r.y).toBe(2);
    expect(r.width).toBe(3);
    expect(r.height).toBe(4);
  });
});
