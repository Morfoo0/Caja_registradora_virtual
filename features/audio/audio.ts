let audioContext: AudioContext | null = null;
let muted = false;

export function setMuted(value: boolean): void {
  muted = value;
}

export function isMuted(): boolean {
  return muted;
}

type AudioContextCtor = typeof AudioContext;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    if (!audioContext) {
      const Ctor = (window.AudioContext ??
        (window as unknown as { webkitAudioContext?: AudioContextCtor })
          .webkitAudioContext) as AudioContextCtor | undefined;
      if (!Ctor) {
        return null;
      }
      audioContext = new Ctor();
    }
    if (audioContext.state === "suspended") {
      void audioContext.resume();
    }
    return audioContext;
  } catch {
    return null;
  }
}

function tone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.12,
  delay = 0,
): void {
  const ctx = getContext();
  if (!ctx) {
    return;
  }
  try {
    const start = ctx.currentTime + delay;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
  } catch {
    // El audio nunca debe bloquear la aplicación.
  }
}

/** Sonido suave al pulsar una tecla. */
export function playKeyClick(): void {
  if (muted) {
    return;
  }
  tone(1000, 0.05, "triangle", 0.06);
}

/** Sonido al añadir un producto. */
export function playAddProduct(): void {
  if (muted) {
    return;
  }
  tone(660, 0.09, "triangle", 0.09);
  tone(880, 0.12, "triangle", 0.09, 0.08);
}

/** Sonido de finalización de cobro ("cha-ching"). */
export function playChaChing(): void {
  if (muted) {
    return;
  }
  const notes = [1046.5, 1318.5, 1568.0];
  notes.forEach((frequency, index) =>
    tone(frequency, 0.18, "triangle", 0.1, index * 0.07),
  );
}

/** Sonido de lectura de tarjeta ficticia. */
export function playCardSwipe(): void {
  if (muted) {
    return;
  }
  tone(300, 0.08, "sawtooth", 0.05);
  tone(900, 0.08, "sawtooth", 0.05, 0.06);
}
