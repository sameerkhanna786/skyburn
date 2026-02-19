import { ObjectPool } from '../../src/core/objectPool.js';

describe('ObjectPool', () => {
  const factory = () => ({ active: false, value: 0 });

  test('pre-allocates initial size', () => {
    const pool = new ObjectPool(factory, 5);
    expect(pool.poolSize).toBe(5);
    expect(pool.activeCount).toBe(0);
    expect(pool.totalSize).toBe(5);
  });

  test('acquire returns an active object', () => {
    const pool = new ObjectPool(factory, 3);
    const obj = pool.acquire();
    expect(obj.active).toBe(true);
    expect(pool.activeCount).toBe(1);
    expect(pool.poolSize).toBe(2);
  });

  test('acquire creates new object if pool is empty', () => {
    const pool = new ObjectPool(factory, 0);
    const obj = pool.acquire();
    expect(obj.active).toBe(true);
    expect(pool.activeCount).toBe(1);
    expect(pool.totalSize).toBe(1);
  });

  test('release returns object to pool', () => {
    const pool = new ObjectPool(factory, 0);
    const obj = pool.acquire();
    pool.release(obj);
    expect(obj.active).toBe(false);
    expect(pool.activeCount).toBe(0);
    expect(pool.poolSize).toBe(1);
  });

  test('release ignores objects not in active list', () => {
    const pool = new ObjectPool(factory, 0);
    const stray = factory();
    pool.release(stray); // should not throw
    expect(pool.poolSize).toBe(1);
  });

  test('releaseAll returns everything to pool', () => {
    const pool = new ObjectPool(factory, 0);
    pool.acquire();
    pool.acquire();
    pool.acquire();
    expect(pool.activeCount).toBe(3);
    pool.releaseAll();
    expect(pool.activeCount).toBe(0);
    expect(pool.poolSize).toBe(3);
  });

  test('forEachActive iterates active objects', () => {
    const pool = new ObjectPool(factory, 0);
    const a = pool.acquire(); a.value = 1;
    const b = pool.acquire(); b.value = 2;
    const c = pool.acquire(); c.value = 3;

    const values = [];
    pool.forEachActive(obj => values.push(obj.value));
    expect(values.sort()).toEqual([1, 2, 3]);
  });

  test('forEachActive skips released objects', () => {
    const pool = new ObjectPool(factory, 0);
    const a = pool.acquire(); a.value = 1;
    const b = pool.acquire(); b.value = 2;
    pool.release(a);

    const values = [];
    pool.forEachActive(obj => values.push(obj.value));
    expect(values).toEqual([2]);
  });

  test('acquired objects are reused from pool', () => {
    const pool = new ObjectPool(factory, 0);
    const a = pool.acquire();
    a.value = 42;
    pool.release(a);
    const b = pool.acquire();
    expect(b).toBe(a); // same reference
    expect(b.value).toBe(42); // retains state until reset
  });
});
