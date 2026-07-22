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
      <p className="pokedex-entry__creature">Creature: {entry.creatureName}</p>
      <p>{entry.role}</p>
      {entry.dates ? <p>{entry.dates}</p> : null}
      {entry.location ? <p>{entry.location}</p> : null}
      <p>{entry.highlight}</p>

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
    </article>
  );
}
