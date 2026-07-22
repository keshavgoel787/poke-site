import { playBleep } from '../audio/playBleep';
import { trainerProfile } from '../data/portfolioData';

const resumeHref = trainerProfile.links.find((link) => link.label === 'Résumé')?.href;
const contactHref = trainerProfile.links.find((link) => link.label === 'Email')?.href;

type QuickMenuProps = {
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
};

export function QuickMenu({ soundEnabled, setSoundEnabled }: QuickMenuProps) {
  const playEnabledBleep = () => {
    if (soundEnabled) {
      playBleep();
    }
  };

  const toggleSound = () => {
    const nextSoundEnabled = !soundEnabled;

    setSoundEnabled(nextSoundEnabled);
    if (nextSoundEnabled) {
      playBleep();
    }
  };

  return (
    <nav aria-label="Quick menu">
      <ul>
        <li>
          <a href="/" onClick={playEnabledBleep}>
            Profile
          </a>
        </li>
        <li>
          <a href={resumeHref} onClick={playEnabledBleep}>
            Résumé
          </a>
        </li>
        <li>
          <a href={contactHref} onClick={playEnabledBleep}>
            Contact
          </a>
        </li>
        <li>
          <a href="/" onClick={playEnabledBleep}>
            Exit PC
          </a>
        </li>
        <li>
          <button
            type="button"
            aria-pressed={soundEnabled}
            onClick={toggleSound}
          >
            Sound
          </button>
        </li>
      </ul>
    </nav>
  );
}
