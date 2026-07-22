import { useState, type JSX } from 'react';

type TrainerAvatarProps = {
  src: string;
  label: string;
};

export function TrainerAvatar({ src, label }: TrainerAvatarProps): JSX.Element {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div role="img" aria-label={`${label} avatar unavailable`}>
        {label}
      </div>
    );
  }

  return (
    <img
      className="trainer-card__avatar-image"
      src={src}
      alt={`Pixel avatar of ${label}`}
      width="320"
      height="534"
      onError={() => setFailed(true)}
    />
  );
}
