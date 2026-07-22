import type { CareerEntry } from '../data/portfolioData';
import { PixelSprite } from './PixelSprite';

type PokedexEntryProps = {
  entry: CareerEntry;
};

export function PokedexEntry({ entry }: PokedexEntryProps) {
  return (
    <article aria-live="polite" aria-atomic="true">
      <PixelSprite spriteId={entry.spriteId} label={entry.creatureName} animate />
      <h2>{entry.organization}</h2>
      <p>{entry.role}</p>
      <p>{entry.dates}</p>
      <p>{entry.impact}</p>

      <div aria-label="Types">
        {entry.types.map((type) => (
          <span key={type}>{type}</span>
        ))}
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
    </article>
  );
}
