import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePreferences } from './usePreferences';

describe('usePreferences', () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    });
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  it('defaults sound off and persists an enabled preference', () => {
    const { result } = renderHook(() => usePreferences());

    expect(result.current.soundEnabled).toBe(false);

    act(() => result.current.setSoundEnabled(true));

    expect(window.localStorage.getItem('career-pc:sound')).toBe('on');
    expect(result.current.soundEnabled).toBe(true);
  });

  it('reads the active reduced-motion system preference', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => usePreferences());

    expect(result.current.reducedMotion).toBe(true);
  });

  it('updates reduced motion changes and cleans up its media-query listener', () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();
    let changeListener: ((event: MediaQueryListEvent) => void) | undefined;

    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
      matches: false,
      addEventListener: (type: string, listener: (event: MediaQueryListEvent) => void) => {
        addEventListener(type, listener);
        changeListener = listener;
      },
      removeEventListener,
    }));

    const { result, unmount } = renderHook(() => usePreferences());

    act(() => changeListener?.({ matches: true } as MediaQueryListEvent));

    expect(result.current.reducedMotion).toBe(true);
    unmount();
    expect(removeEventListener).toHaveBeenCalledWith('change', changeListener);
  });
});
