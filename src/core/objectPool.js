export class ObjectPool {
  constructor(factory, initialSize = 0) {
    this._factory = factory;
    this._pool = [];
    this._active = [];

    for (let i = 0; i < initialSize; i++) {
      const obj = this._factory();
      obj.active = false;
      this._pool.push(obj);
    }
  }

  acquire() {
    let obj;
    if (this._pool.length > 0) {
      obj = this._pool.pop();
    } else {
      obj = this._factory();
    }
    obj.active = true;
    this._active.push(obj);
    return obj;
  }

  release(obj) {
    obj.active = false;
    const idx = this._active.indexOf(obj);
    if (idx !== -1) {
      this._active.splice(idx, 1);
    }
    this._pool.push(obj);
  }

  releaseAll() {
    while (this._active.length > 0) {
      const obj = this._active.pop();
      obj.active = false;
      this._pool.push(obj);
    }
  }

  forEachActive(callback) {
    for (let i = this._active.length - 1; i >= 0; i--) {
      callback(this._active[i], i);
    }
  }

  get activeCount() {
    return this._active.length;
  }

  get poolSize() {
    return this._pool.length;
  }

  get totalSize() {
    return this._pool.length + this._active.length;
  }
}
