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

  return <img src={src} alt={`Pixel avatar of ${label}`} onError={() => setFailed(true)} />;
}
