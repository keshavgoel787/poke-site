import { useState, type JSX } from 'react';

type TrainerWalkSceneProps = {
  trainerSrc: string;
  companionSrc: string;
  label: string;
};

export function TrainerWalkScene({
  trainerSrc,
  companionSrc,
  label,
}: TrainerWalkSceneProps): JSX.Element {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div role="img" aria-label={`${label} unavailable`}>
        {label}
      </div>
    );
  }

  return (
    <div className="trainer-walk-scene" role="img" aria-label={label}>
      <img
        data-testid="trainer-companion"
        className="trainer-walk-companion"
        src={companionSrc}
        alt=""
        onError={() => setFailed(true)}
      />
      <img
        data-testid="trainer-walk-strip"
        className="trainer-walk-strip"
        src={trainerSrc}
        alt=""
        onError={() => setFailed(true)}
      />
    </div>
  );
}
