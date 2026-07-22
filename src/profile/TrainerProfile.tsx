import type { JSX } from 'react';
import { trainerProfile } from '../data/portfolioData';
import { pokemonPath } from '../navigation/routes';

export function TrainerProfile(): JSX.Element {
  return (
    <>
      <header>
        <h1>{trainerProfile.name}</h1>
        <p>{trainerProfile.school}</p>
        <p>{trainerProfile.graduation}</p>
        <p>{trainerProfile.major}</p>
        <p>{trainerProfile.hometown}</p>
      </header>

      <main>
        <p>
          <a href={pokemonPath('experience')}>Open Keshav&apos;s PC</a>
        </p>

        <nav aria-label="Professional links">
          <ul>
            {trainerProfile.links.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </>
  );
}
