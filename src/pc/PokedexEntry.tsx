import { useEffect, useId, useRef, type KeyboardEvent, type MouseEvent } from 'react';
import type { CareerEntry } from '../data/portfolioData';
import { PixelSprite } from './PixelSprite';

type PokedexEntryProps = {
  entry: CareerEntry;
  onClose: () => void;
};

const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function PokedexEntry({ entry, onClose }: PokedexEntryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const displayedHighlight = entry.highlight.replace(/hours per week/gi, 'hrs/week');

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }

    closeRef.current?.focus({ preventScroll: true });

    return () => {
      if (dialog.open && typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
    };
  }, []);

  const closeFromBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const outside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;

    if (outside) {
      onClose();
    }
  };

  const containFocus = (event: KeyboardEvent<HTMLDialogElement>) => {
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
    <dialog
      ref={dialogRef}
      className="pokedex-entry"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={closeFromBackdrop}
      onKeyDown={containFocus}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <h2 id={titleId} className="pokedex-entry__creature">
        <span>{entry.creatureName}</span> details
      </h2>
      <PixelSprite spriteId={entry.spriteId} label={entry.creatureName} animate />
      <h3 className="pokedex-entry__organization">{entry.organization}</h3>
      <p className="pokedex-entry__category">{entry.category}</p>
      <p className="pokedex-entry__role">{entry.role}</p>
      {entry.category === 'Experience' && entry.dates ? (
        <p className="pokedex-entry__meta">{entry.dates}</p>
      ) : null}
      {entry.category === 'Experience' && entry.location ? (
        <p className="pokedex-entry__meta">{entry.location}</p>
      ) : null}
      <p className="pokedex-entry__highlight">{displayedHighlight}</p>

      <div aria-label="Types">
        <span>{entry.professionalType}</span>
      </div>

      <ul aria-label="Moves">
        {entry.moves.map((move, index) => (
          <li key={`${move.name}-${index}`} aria-label={`Move: ${move.name}`}>
            <strong>{move.name}</strong>
            {move.skill !== move.name ? <span>{move.skill}</span> : null}
          </li>
        ))}
      </ul>

      {entry.link ? <a href={entry.link.href}>{entry.link.label}</a> : null}
      <button ref={closeRef} type="button" onClick={onClose}>
        Close
      </button>
    </dialog>
  );
}
