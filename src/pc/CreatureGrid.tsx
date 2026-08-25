import { useRef, type KeyboardEvent } from 'react';
import type { CareerEntry } from '../data/portfolioData';
import { PixelSprite } from './PixelSprite';

type CreatureGridProps = {
  entries: CareerEntry[];
  selectedId?: string;
  onSelect?: (entryId: string) => void;
  interactive?: boolean;
  ariaLabel?: string;
};

const previousKeys = new Set(['ArrowLeft', 'ArrowUp']);
const nextKeys = new Set(['ArrowRight', 'ArrowDown']);

function CardContents({ entry, showCompletion }: { entry: CareerEntry; showCompletion: boolean }) {
  const completionId = `party-card-${entry.id}-completion`;

  return (
    <>
      <PixelSprite spriteId={entry.spriteId} label={entry.creatureName} animate />
      <span className="party-card__name">{entry.creatureName}</span>
      {entry.organization !== entry.creatureName ? (
        <span className="party-card__organization">{entry.organization}</span>
      ) : null}
      <span className="party-card__role">{entry.role}</span>
      <span className="party-card__metadata">{entry.cardMetadata}</span>
      {showCompletion ? (
        <>
          <span className="party-card__completion" role="img" aria-label="Entry complete">
            <span aria-hidden="true">━━━━━━━━</span>
          </span>
          <span id={completionId} hidden>
            Entry complete
          </span>
        </>
      ) : null}
    </>
  );
}

export function CreatureGrid({
  entries,
  selectedId,
  onSelect,
  interactive = true,
  ariaLabel = 'Career entries',
}: CreatureGridProps) {
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const moveFocus = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const offset = previousKeys.has(event.key) ? -1 : nextKeys.has(event.key) ? 1 : 0;

    if (!offset || entries.length === 0) {
      return;
    }

    event.preventDefault();
    const nextIndex = (index + offset + entries.length) % entries.length;
    itemRefs.current[nextIndex]?.focus();
  };

  return (
    <ul className="party-grid" aria-label={ariaLabel}>
      {entries.map((entry, index) => {
        const selected = entry.id === selectedId;
        const completionId = `party-card-${entry.id}-completion`;

        if (!interactive) {
          return (
            <li key={entry.id}>
              <div className="party-card party-card--informational">
                <CardContents entry={entry} showCompletion={false} />
              </div>
            </li>
          );
        }

        return (
          <li key={entry.id}>
            <button
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              type="button"
              aria-label={entry.creatureName}
              aria-describedby={completionId}
              aria-pressed={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelect?.(entry.id)}
              onKeyDown={(event) => moveFocus(event, index)}
            >
              <CardContents entry={entry} showCompletion />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
