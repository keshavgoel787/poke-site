import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';
import { BackgroundMusic, backgroundTrack } from './BackgroundMusic';

const play = vi.fn(() => Promise.resolve());
const pause = vi.fn();

beforeEach(() => {
  play.mockClear();
  pause.mockClear();
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(play);
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(pause);
  Object.defineProperty(document, 'hidden', { configurable: true, value: false });
});

it('renders the credited CloudFront track as a looping background audio element', () => {
  render(<BackgroundMusic enabled={false} />);

  const audio = screen.getByTestId('background-music');
  expect(audio).toHaveAttribute('src', backgroundTrack.audioUrl);
  expect(audio).toHaveAttribute('loop');
  expect(audio).toHaveAttribute('preload', 'auto');
});

it('plays only while sound is enabled and the page is visible', () => {
  const { rerender } = render(<BackgroundMusic enabled={false} />);

  expect(play).not.toHaveBeenCalled();
  expect(pause).toHaveBeenCalled();

  rerender(<BackgroundMusic enabled />);
  expect(play).toHaveBeenCalledTimes(1);

  Object.defineProperty(document, 'hidden', { configurable: true, value: true });
  fireEvent(document, new Event('visibilitychange'));
  expect(pause).toHaveBeenCalledTimes(3);

  Object.defineProperty(document, 'hidden', { configurable: true, value: false });
  fireEvent(document, new Event('visibilitychange'));
  expect(play).toHaveBeenCalledTimes(2);
});

it('silently tolerates browser autoplay blocking', () => {
  play.mockRejectedValueOnce(new DOMException('Blocked', 'NotAllowedError'));

  expect(() => render(<BackgroundMusic enabled />)).not.toThrow();
});

it('retries blocked autoplay on the first user gesture', async () => {
  play
    .mockRejectedValueOnce(new DOMException('Blocked', 'NotAllowedError'))
    .mockResolvedValueOnce(undefined);

  render(<BackgroundMusic enabled />);

  await waitFor(() => expect(play).toHaveBeenCalledTimes(1));
  fireEvent.pointerDown(document.body);

  await waitFor(() => expect(play).toHaveBeenCalledTimes(2));

  fireEvent.pointerDown(document.body);
  expect(play).toHaveBeenCalledTimes(2);
});
