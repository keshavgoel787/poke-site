import { useEffect, useId, useRef, type KeyboardEvent } from 'react';
import type { CareerEntry } from '../data/portfolioData';
import { PixelSprite } from './PixelSprite';

type PokedexEntryProps = {
  entry: CareerEntry;
  onClose: () => void;
};

const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function PokedexEntry({ entry, onClose }: PokedexEntryProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const displayedHighlight = entry.highlight.replace(/hours per week/gi, 'hrs/week');

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, []);

  const containFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
    );
    const first = focusableElements[0];
    const last = focusableElements.at(-1);

    if (!first || !last) {
      return;
    }

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onKeyDown={containFocus}
    >
      <h2 id={titleId}>
        <span>{entry.creatureName}</span> details
      </h2>
      <PixelSprite spriteId={entry.spriteId} label={entry.creatureName} animate />
      <h3>{entry.organization}</h3>
      <p>{entry.category}</p>
      <p>{entry.role}</p>
      {entry.category === 'Experience' && entry.dates ? <p>{entry.dates}</p> : null}
      {entry.category === 'Experience' && entry.location ? <p>{entry.location}</p> : null}
      <p>{displayedHighlight}</p>

      <div aria-label="Types">
        <span>{entry.professionalType}</span>
      </div>

      <ul aria-label="Moves">
        {entry.moves.map((move, index) => (
          <li key={`${move.name}-${index}`} aria-label={`Move: ${move.name}`}>
            <strong>{move.name}</strong>
            <span>{move.skill}</span>
          </li>
        ))}
      </ul>

      {entry.link ? <a href={entry.link.href}>{entry.link.label}</a> : null}
      <button ref={closeRef} type="button" onClick={onClose}>
        Close
      </button>
    </div>
  );
}
