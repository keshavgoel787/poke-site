import { useEffect, useState } from 'react';

const SOUND_PREFERENCE_KEY = 'career-pc:sound';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function getStoredSoundPreference() {
  return window.localStorage.getItem(SOUND_PREFERENCE_KEY) === 'on';
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
    window.localStorage.setItem(SOUND_PREFERENCE_KEY, value ? 'on' : 'off');
  };

  return { soundEnabled, setSoundEnabled, reducedMotion };
}
