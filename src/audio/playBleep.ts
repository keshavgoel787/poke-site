type AudioContextWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

const BLEEP_DURATION_SECONDS = 0.07;

export function playBleep(): void {
  try {
    const audioWindow = window as AudioContextWindow;
    const AudioContextConstructor =
      audioWindow.AudioContext ?? audioWindow.webkitAudioContext;

    if (!AudioContextConstructor) {
      return;
    }

    const context = new AudioContextConstructor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const startAt = context.currentTime;
    const stopAt = startAt + BLEEP_DURATION_SECONDS;

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(680, startAt);
    gain.gain.setValueAtTime(0.035, startAt);
    gain.gain.exponentialRampToValueAtTime(0.0001, stopAt);
    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.addEventListener(
      'ended',
      () => {
        try {
          void context.close().catch(() => undefined);
        } catch {
          // Closing is best-effort in browsers with partial Web Audio support.
        }
      },
      { once: true },
    );

    if (context.state === 'suspended') {
      void context.resume().catch(() => undefined);
    }

    oscillator.start(startAt);
    oscillator.stop(stopAt);
  } catch {
    // Sound is optional and unsupported or blocked Web Audio must fail silently.
  }
}
