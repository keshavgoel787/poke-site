import { useEffect, useRef } from 'react';

export const backgroundTrack = {
  title: 'Littleroot Town - Pokémon Omega Ruby & Alpha Sapphire Music Extended HD',
  creator: 'Craig Maywell Vlogs',
  creatorUrl: 'https://www.youtube.com/@NewBrawlgamemusic2',
  sourceUrl: 'https://www.youtube.com/watch?v=zRGCzCn5azI&t=1s',
  audioUrl: 'https://d2y16y8vzs5mvx.cloudfront.net/music/littleroot.mp3',
} as const;

type BackgroundMusicProps = {
  enabled: boolean;
};

export function BackgroundMusic({ enabled }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const removeGestureRetry = () => {
      document.removeEventListener('pointerdown', retryAfterGesture, true);
      document.removeEventListener('keydown', retryAfterGesture, true);
    };

    const addGestureRetry = () => {
      document.addEventListener('pointerdown', retryAfterGesture, {
        capture: true,
        once: true,
      });
      document.addEventListener('keydown', retryAfterGesture, {
        capture: true,
        once: true,
      });
    };

    function retryAfterGesture() {
      removeGestureRetry();
      syncPlayback();
    }

    const syncPlayback = () => {
      const audio = audioRef.current;

      if (!audio) {
        return;
      }

      if (!enabled || document.hidden) {
        removeGestureRetry();
        audio.pause();
        return;
      }

      audio.volume = 0.18;
      try {
        const playback = audio.play();
        void playback?.then(removeGestureRetry).catch(addGestureRetry);
      } catch {
        addGestureRetry();
      }
    };

    syncPlayback();
    document.addEventListener('visibilitychange', syncPlayback);

    return () => {
      document.removeEventListener('visibilitychange', syncPlayback);
      removeGestureRetry();
      audioRef.current?.pause();
    };
  }, [enabled]);

  return (
    <audio
      ref={audioRef}
      data-testid="background-music"
      src={backgroundTrack.audioUrl}
      preload="auto"
      loop
      aria-hidden="true"
    />
  );
}
