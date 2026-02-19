export class AudioManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.engineOsc = null;
    this.engineGain = null;
  }

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.setupEngine();
    } catch (e) {
      this.enabled = false;
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setupEngine() {
    if (!this.ctx) return;
    this.engineOsc = this.ctx.createOscillator();
    this.engineGain = this.ctx.createGain();
    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.value = 80;
    this.engineGain.gain.value = 0;
    this.engineOsc.connect(this.engineGain);
    this.engineGain.connect(this.ctx.destination);
    this.engineOsc.start();
  }

  updateEngine(isThrusting) {
    if (!this.enabled || !this.engineGain) return;
    const target = isThrusting ? 0.06 : 0.02;
    this.engineGain.gain.linearRampToValueAtTime(target, this.ctx.currentTime + 0.05);
    if (this.engineOsc) {
      this.engineOsc.frequency.linearRampToValueAtTime(
        isThrusting ? 140 : 80,
        this.ctx.currentTime + 0.05
      );
    }
  }

  playPickup() {
    this._playTone(880, 0.1, 0.15, 'sine');
  }

  playNearMiss() {
    this._playTone(660, 0.08, 0.1, 'triangle');
  }

  playExplosion() {
    if (!this.enabled || !this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.value = 0.3;
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
    source.connect(gain);
    gain.connect(this.ctx.destination);
    source.start();
  }

  playPowerup() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(880, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playCombo() {
    this._playTone(1100, 0.06, 0.08, 'sine');
  }

  _playTone(freq, volume, duration, type) {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  stopEngine() {
    if (this.engineGain) {
      this.engineGain.gain.value = 0;
    }
  }
}
