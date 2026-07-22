import { useEffect, useState } from 'react';

const SOUND_PREFERENCE_KEY = 'career-pc:sound';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function getStoredSoundPreference(): boolean {
  try {
    return window.localStorage.getItem(SOUND_PREFERENCE_KEY) === 'on';
  } catch {
    return false;
  }
}

function storeSoundPreference(value: boolean): void {
  try {
    window.localStorage.setItem(SOUND_PREFERENCE_KEY, value ? 'on' : 'off');
  } catch {
    // Preferences are optional; blocked or full storage must not break the UI.
  }
}

function getReducedMotionPreference() {
  return window.matchMedia?.(REDUCED_MOTION_QUERY).matches ?? false;
}

export function usePreferences() {
  const [soundEnabled, setSoundEnabledState] = useState(getStoredSoundPreference);
  const [reducedMotion, setReducedMotion] = useState(getReducedMotionPreference);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.(REDUCED_MOTION_QUERY);

    if (!mediaQuery) {
      return;
    }

    const handleChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setSoundEnabled = (value: boolean) => {
    setSoundEnabledState(value);
    storeSoundPreference(value);
  };

  return { soundEnabled, setSoundEnabled, reducedMotion };
}
