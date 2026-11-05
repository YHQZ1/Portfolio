export type SoundName =
  | "tick"
  | "sweepUp"
  | "sweepDown"
  | "fail"
  | "recover"
  | "copy"
  | "success"
  | "enable";

export interface SoundOptions {
  level?: number;
}

interface Tone {
  frequency: number;
  endFrequency?: number;
  type?: OscillatorType;
  delay?: number;
  duration: number;
  gain: number;
}

const MASTER_GAIN = 0.8;
const TICK_INTERVAL = 45;

// Pentatonic notes (C5 D5 E5 G5 A5) so scrubbing across values always sounds
// pleasant, whatever order the days are visited in.
const TICK_NOTES = [523.25, 587.33, 659.25, 783.99, 880];

let context: AudioContext | null = null;
let master: GainNode | null = null;
let lastTick = 0;

function getContext(): AudioContext | null {
  // Browsers only allow audio after the person has interacted with the page.
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) {
    return null;
  }

  if (!context) {
    if (typeof AudioContext === "undefined") return null;
    context = new AudioContext();
    master = context.createGain();
    master.gain.value = MASTER_GAIN;
    master.connect(context.destination);
  }

  if (context.state === "suspended") void context.resume();
  return context;
}

export function unlockAudio() {
  getContext();
}

function playTone(audio: AudioContext, tone: Tone) {
  if (!master) return;

  const start = audio.currentTime + (tone.delay ?? 0);
  const end = start + tone.duration;
  const oscillator = audio.createOscillator();
  const envelope = audio.createGain();

  oscillator.type = tone.type ?? "sine";
  oscillator.frequency.setValueAtTime(tone.frequency, start);
  if (tone.endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(tone.endFrequency, end);
  }

  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(tone.gain, start + 0.006);
  envelope.gain.exponentialRampToValueAtTime(0.0001, end);

  oscillator.connect(envelope);
  envelope.connect(master);
  oscillator.start(start);
  oscillator.stop(end + 0.02);
}

const RECIPES: Record<Exclude<SoundName, "tick">, Tone[]> = {
  sweepUp: [{ frequency: 280, endFrequency: 880, duration: 0.32, gain: 0.05 }],
  sweepDown: [
    { frequency: 880, endFrequency: 280, duration: 0.32, gain: 0.05 },
  ],
  fail: [{ frequency: 150, endFrequency: 45, duration: 0.24, gain: 0.14 }],
  recover: [
    { frequency: 392, type: "triangle", duration: 0.11, gain: 0.06 },
    {
      frequency: 587.33,
      type: "triangle",
      delay: 0.09,
      duration: 0.2,
      gain: 0.06,
    },
  ],
  copy: [
    { frequency: 1200, duration: 0.04, gain: 0.05 },
    { frequency: 1600, delay: 0.045, duration: 0.05, gain: 0.05 },
  ],
  success: [
    { frequency: 523.25, type: "triangle", duration: 0.13, gain: 0.06 },
    {
      frequency: 659.25,
      type: "triangle",
      delay: 0.1,
      duration: 0.13,
      gain: 0.06,
    },
    {
      frequency: 783.99,
      type: "triangle",
      delay: 0.2,
      duration: 0.26,
      gain: 0.06,
    },
  ],
  enable: [
    { frequency: 660, type: "triangle", duration: 0.09, gain: 0.05 },
    {
      frequency: 880,
      type: "triangle",
      delay: 0.08,
      duration: 0.14,
      gain: 0.05,
    },
  ],
};

export function playSound(name: SoundName, options: SoundOptions = {}) {
  const audio = getContext();
  if (!audio) return;

  if (name === "tick") {
    const now = performance.now();
    if (now - lastTick < TICK_INTERVAL) return;
    lastTick = now;

    const level = Math.min(4, Math.max(0, options.level ?? 0));
    playTone(audio, {
      frequency: level === 0 ? 261.63 : TICK_NOTES[level],
      type: "triangle",
      duration: 0.07,
      gain: level === 0 ? 0.02 : 0.03 + level * 0.008,
    });
    return;
  }

  RECIPES[name].forEach((tone) => playTone(audio, tone));
}
