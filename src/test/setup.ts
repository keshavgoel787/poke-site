import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

if (typeof HTMLMediaElement !== 'undefined') {
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
}
