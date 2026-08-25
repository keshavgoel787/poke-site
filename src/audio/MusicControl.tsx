import { BackgroundMusic } from './BackgroundMusic';

type MusicControlProps = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
};

export function MusicControl({ enabled, setEnabled }: MusicControlProps) {
  const label = enabled ? 'Pause background music' : 'Play background music';

  return (
    <div className="music-control">
      <BackgroundMusic enabled={enabled} />
      <button
        type="button"
        aria-label={label}
        aria-pressed={enabled}
        onClick={() => setEnabled(!enabled)}
      >
        <span aria-hidden="true">{enabled ? 'Ⅱ' : '▶'}</span>
        <span>Music</span>
      </button>
    </div>
  );
}
