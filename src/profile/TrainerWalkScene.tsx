import { useState, type JSX } from 'react';

type TrainerWalkSceneProps = {
  trainerSrc: string;
  label: string;
};

export function TrainerWalkScene({
  trainerSrc,
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
      <div className="trainer-walk-trainer">
        <img
          data-testid="trainer-walk-strip"
          className="trainer-walk-strip"
          src={trainerSrc}
          alt=""
          onError={() => setFailed(true)}
        />
      </div>
    </div>
  );
}
