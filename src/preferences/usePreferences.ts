import { useEffect, useState } from 'react';

const SOUND_PREFERENCE_KEY = 'career-pc:sound';
const MUSIC_PREFERENCE_KEY = 'career-pc:music';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function getStoredPreference(key: string, defaultValue = false): boolean {
  try {
    const storedValue = window.localStorage.getItem(key);

    return storedValue === null ? defaultValue : storedValue === 'on';
  } catch {
    return defaultValue;
  }
}

function storePreference(key: string, value: boolean): void {
  try {
    window.localStorage.setItem(key, value ? 'on' : 'off');
  } catch {
    // Preferences are optional; blocked or full storage must not break the UI.
  }
}

function getReducedMotionPreference() {
  return window.matchMedia?.(REDUCED_MOTION_QUERY).matches ?? false;
}

export function usePreferences() {
  const [soundEnabled, setSoundEnabledState] = useState(() =>
    getStoredPreference(SOUND_PREFERENCE_KEY, true),
  );
  const [musicEnabled, setMusicEnabledState] = useState(() =>
    getStoredPreference(MUSIC_PREFERENCE_KEY),
  );
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
    storePreference(SOUND_PREFERENCE_KEY, value);
  };

  const setMusicEnabled = (value: boolean) => {
    setMusicEnabledState(value);
    storePreference(MUSIC_PREFERENCE_KEY, value);
  };

  return {
    soundEnabled,
    setSoundEnabled,
    musicEnabled,
    setMusicEnabled,
    reducedMotion,
  };
}
