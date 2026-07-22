import amazonA from '../assets/sprites/amazon-a.svg';
import amazonB from '../assets/sprites/amazon-b.svg';
import bhangraA from '../assets/sprites/bhangra-a.svg';
import bhangraB from '../assets/sprites/bhangra-b.svg';
import breatheEasyA from '../assets/sprites/breathe-easy-a.svg';
import breatheEasyB from '../assets/sprites/breathe-easy-b.svg';
import draftKingsA from '../assets/sprites/draftkings-a.svg';
import draftKingsB from '../assets/sprites/draftkings-b.svg';
import forgetMeNotA from '../assets/sprites/forget-me-not-a.svg';
import forgetMeNotB from '../assets/sprites/forget-me-not-b.svg';
import generateA from '../assets/sprites/generate-a.svg';
import generateB from '../assets/sprites/generate-b.svg';
import interestsA from '../assets/sprites/interests-a.svg';
import interestsB from '../assets/sprites/interests-b.svg';
import johnsonJohnsonA from '../assets/sprites/johnson-johnson-a.svg';
import johnsonJohnsonB from '../assets/sprites/johnson-johnson-b.svg';
import locationsA from '../assets/sprites/locations-a.svg';
import locationsB from '../assets/sprites/locations-b.svg';
import northeasternUniversityA from '../assets/sprites/northeastern-university-a.svg';
import northeasternUniversityB from '../assets/sprites/northeastern-university-b.svg';
import procureMateAiA from '../assets/sprites/procuremateai-a.svg';
import procureMateAiB from '../assets/sprites/procuremateai-b.svg';
import vdartA from '../assets/sprites/vdart-a.svg';
import vdartB from '../assets/sprites/vdart-b.svg';

type PixelSpriteProps = {
  spriteId: string;
  label: string;
  animate: boolean;
};

type SpriteFrames = {
  frameA: string;
  frameB?: string;
};

const sprites: Record<string, SpriteFrames> = {
  amazon: { frameA: amazonA, frameB: amazonB },
  bhangra: { frameA: bhangraA, frameB: bhangraB },
  'breathe-easy': { frameA: breatheEasyA, frameB: breatheEasyB },
  draftkings: { frameA: draftKingsA, frameB: draftKingsB },
  'forget-me-not': { frameA: forgetMeNotA, frameB: forgetMeNotB },
  generate: { frameA: generateA, frameB: generateB },
  interests: { frameA: interestsA, frameB: interestsB },
  'johnson-johnson': { frameA: johnsonJohnsonA, frameB: johnsonJohnsonB },
  locations: { frameA: locationsA, frameB: locationsB },
  'northeastern-university': {
    frameA: northeasternUniversityA,
    frameB: northeasternUniversityB,
  },
  procuremateai: { frameA: procureMateAiA, frameB: procureMateAiB },
  vdart: { frameA: vdartA, frameB: vdartB },
};

export function PixelSprite({ spriteId, label, animate }: PixelSpriteProps) {
  const sprite = sprites[spriteId];

  if (!sprite) {
    return (
      <span
        className="pixel-sprite pixel-sprite--fallback"
        role="img"
        aria-label={label}
        style={{ border: '3px solid #172032' }}
      >
        <span aria-hidden="true">?</span>
        <span>{label}</span>
      </span>
    );
  }

  return (
    <span
      className="pixel-sprite"
      role="img"
      aria-label={label}
      data-animate={animate ? 'true' : 'false'}
    >
      <img className="pixel-sprite__frame pixel-sprite__frame--a" src={sprite.frameA} alt="" />
      {animate && sprite.frameB ? (
        <img
          className="pixel-sprite__frame pixel-sprite__frame--b"
          src={sprite.frameB}
          alt=""
        />
      ) : null}
    </span>
  );
}
