import { trainerProfile } from '../data/portfolioData';
import { usePreferences } from '../preferences/usePreferences';

const resumeHref = trainerProfile.links.find((link) => link.label === 'Résumé')?.href;
const contactHref = trainerProfile.links.find((link) => link.label === 'Email')?.href;

export function QuickMenu() {
  const { soundEnabled, setSoundEnabled } = usePreferences();

  return (
    <nav aria-label="Quick menu">
      <ul>
        <li>
          <a href="/">Profile</a>
        </li>
        <li>
          <a href={resumeHref}>Résumé</a>
        </li>
        <li>
          <a href={contactHref}>Contact</a>
        </li>
        <li>
          <a href="/">Exit PC</a>
        </li>
        <li>
          <button
            type="button"
            aria-pressed={soundEnabled}
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            Sound
          </button>
        </li>
      </ul>
    </nav>
  );
}
