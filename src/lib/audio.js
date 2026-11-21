// Synthesized sound effects with the Web Audio API. No audio files are bundled.
let ctx = null;
let muted = false;

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

export function beep({ freq = 440, endFreq = null, duration = 0.12, type = 'square', volume = 0.12 } = {}) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, c.currentTime + duration);
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration);
}

export const sfx = {
  eat: () => beep({ freq: 660, endFreq: 990, duration: 0.1 }),
  shoot: () => beep({ freq: 900, endFreq: 200, duration: 0.15, type: 'sawtooth' }),
  hit: () => beep({ freq: 220, endFreq: 110, duration: 0.2, type: 'triangle' }),
  bounce: () => beep({ freq: 330, duration: 0.05 }),
  flip: () => beep({ freq: 520, endFreq: 700, duration: 0.07, type: 'triangle' }),
  match: () => beep({ freq: 780, endFreq: 1200, duration: 0.2, type: 'sine' }),
  win: () => beep({ freq: 523, endFreq: 1046, duration: 0.4, type: 'triangle' }),
  lose: () => beep({ freq: 300, endFreq: 80, duration: 0.5, type: 'sawtooth' }),
  click: () => beep({ freq: 1000, duration: 0.03, volume: 0.05 }),
};
