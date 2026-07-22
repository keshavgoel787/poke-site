import { useRef, type KeyboardEvent } from 'react';
import type { CareerEntry } from '../data/portfolioData';

type CreatureGridProps = {
  entries: CareerEntry[];
  selectedId: string;
  onSelect: (entryId: string) => void;
};

const previousKeys = new Set(['ArrowLeft', 'ArrowUp']);
const nextKeys = new Set(['ArrowRight', 'ArrowDown']);

export function CreatureGrid({ entries, selectedId, onSelect }: CreatureGridProps) {
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
    <ul aria-label="Career entries">
      {entries.map((entry, index) => {
        const selected = entry.id === selectedId;

        return (
          <li key={entry.id}>
            <button
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              type="button"
              aria-label={`${entry.creatureName}: ${entry.organization}`}
              aria-pressed={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelect(entry.id)}
              onKeyDown={(event) => moveFocus(event, index)}
            >
              <span>{entry.creatureName}</span>
              <span>{entry.organization}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
