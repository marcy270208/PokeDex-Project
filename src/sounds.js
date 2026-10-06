import { CRY_BASE_URL } from "./config.js";

let audioCtx = null;
const cryCache = new Map();
let lastCryAt = 0;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function tone({
  freq,
  endFreq = freq,
  duration = 0.12,
  type = "sine",
  volume = 0.18,
  delay = 0,
}) {
  const ctx = getCtx();
  const start = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  osc.frequency.exponentialRampToValueAtTime(endFreq, start + duration);

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

export function playUiSound(kind) {
  try {
    switch (kind) {
      case "search":
        tone({ freq: 523, endFreq: 1046, duration: 0.18, type: "triangle" });
        tone({ freq: 784, endFreq: 1568, duration: 0.16, type: "sine", delay: 0.09 });
        break;
      case "select":
        tone({ freq: 988, duration: 0.07, type: "square", volume: 0.08 });
        tone({ freq: 1319, duration: 0.16, type: "square", volume: 0.08, delay: 0.07 });
        break;
      case "click":
        tone({ freq: 660, endFreq: 990, duration: 0.09, type: "triangle" });
        break;
      case "back":
        tone({ freq: 880, endFreq: 440, duration: 0.16, type: "triangle" });
        break;
      case "error":
        tone({ freq: 220, endFreq: 110, duration: 0.28, type: "sawtooth", volume: 0.12 });
        tone({ freq: 165, endFreq: 82, duration: 0.28, type: "square", volume: 0.06, delay: 0.02 });
        break;
      default:
        tone({ freq: 440, duration: 0.08 });
    }
  } catch {
    // audio is a nice-to-have; never let it break the UI
  }
}

export function playCry(id) {
  if (Date.now() - lastCryAt < 300) return;
  try {
    let cry = cryCache.get(id);
    if (!cry) {
      cry = new Audio(`${CRY_BASE_URL}/${id}.ogg`);
      cry.volume = 0.7;
      cryCache.set(id, cry);
    }
    cry.currentTime = 0;
    cry.play().then(() => {
      lastCryAt = Date.now();
    }).catch(() => {
      // blocked before first user interaction or unsupported format
    });
  } catch {
    // audio is a nice-to-have; never let it break the UI
  }
}
