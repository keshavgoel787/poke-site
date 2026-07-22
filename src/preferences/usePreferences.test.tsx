import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePreferences } from './usePreferences';

describe('usePreferences', () => {
  let values: Map<string, string>;

  beforeEach(() => {
    values = new Map<string, string>();
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

  it('hydrates a stored enabled sound preference without changing storage', () => {
    values.set('career-pc:sound', 'on');
    const setItem = vi.spyOn(window.localStorage, 'setItem');

    const { result } = renderHook(() => usePreferences());

    expect(result.current.soundEnabled).toBe(true);
    expect(setItem).not.toHaveBeenCalled();
  });

  it('persists switching sound from on back to off', () => {
    values.set('career-pc:sound', 'on');
    const { result } = renderHook(() => usePreferences());

    act(() => result.current.setSoundEnabled(false));

    expect(window.localStorage.getItem('career-pc:sound')).toBe('off');
    expect(result.current.soundEnabled).toBe(false);
  });

  it('defaults sound off when storage reading throws', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new DOMException('Storage is unavailable', 'SecurityError');
      },
      setItem: vi.fn(),
    });

    const { result } = renderHook(() => usePreferences());

    expect(result.current.soundEnabled).toBe(false);
  });

  it('keeps rendering and updates sound when storage writing throws', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {
        throw new DOMException('Storage is full', 'QuotaExceededError');
      },
    });
    const { result } = renderHook(() => usePreferences());

    expect(() => {
      act(() => result.current.setSoundEnabled(true));
    }).not.toThrow();
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
