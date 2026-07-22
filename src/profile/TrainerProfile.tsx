import type { JSX } from 'react';
import { trainerProfile } from '../data/portfolioData';
import { pokemonPath } from '../navigation/routes';
import { TrainerWalkScene } from './TrainerWalkScene';

const professionalLinkIcons: Record<string, string> = {
  Résumé: '▤',
  GitHub: '<>',
  LinkedIn: '↗',
  Email: '@',
};

export function TrainerProfile(): JSX.Element {
  return (
    <main className="trainer-screen">
      <section className="trainer-card" aria-labelledby="trainer-card-title">
        <h1 id="trainer-card-title">Trainer Card</h1>

        <div className="trainer-card__body">
          <dl className="trainer-card__fields">
            <div>
              <dt>Name</dt>
              <dd>
                <h2>{trainerProfile.name}</h2>
              </dd>
            </div>
            <div>
              <dt>School</dt>
              <dd>{trainerProfile.school}</dd>
            </div>
            <div>
              <dt>Graduation</dt>
              <dd>{trainerProfile.graduation}</dd>
            </div>
            <div>
              <dt>Major</dt>
              <dd>{trainerProfile.major}</dd>
            </div>
            <div>
              <dt>Hometown</dt>
              <dd>{trainerProfile.hometown}</dd>
            </div>
          </dl>

          <div className="trainer-card__walk-viewport">
            <TrainerWalkScene
              trainerSrc="/trainer-walk.png"
              companionSrc="/gengar-companion.png"
              label="Keshav walking with Gengar"
            />
          </div>
        </div>

        <nav aria-label="Professional links">
          <ul>
            {trainerProfile.links.map((link) => (
              <li key={link.label}>
                <a href={link.href}>
                  <span className="trainer-card__link-icon" aria-hidden="true">
                    {professionalLinkIcons[link.label] ?? '↗'}
                  </span>
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <a className="trainer-roster-card" href={pokemonPath('experience')}>
        Keshav&apos;s Pokémon
      </a>
    </main>
  );
}
