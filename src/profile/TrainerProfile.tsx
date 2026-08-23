import type { JSX } from 'react';
import { trainerProfile } from '../data/portfolioData';
import { CareerPC } from '../pc/CareerPC';
import { usePreferences } from '../preferences/usePreferences';
import { TrainerWalkScene } from './TrainerWalkScene';

const professionalLinkIcons: Record<string, string> = {
  Résumé: '▤',
  GitHub: '<>',
  LinkedIn: '↗',
  Email: '@',
};

export function TrainerProfile(): JSX.Element {
  const { reducedMotion } = usePreferences();

  return (
    <main className="trainer-screen" data-reduced-motion={reducedMotion}>
      <section className="trainer-card" aria-labelledby="trainer-card-title">
        <header className="trainer-card__header">
          <h1 id="trainer-card-title">Trainer Card</h1>
          <p>ID KESHAVGOEL787</p>
        </header>

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
              <dt>Current Location</dt>
              <dd>{trainerProfile.hometown}</dd>
            </div>
          </dl>

          <div className="trainer-card__walk-viewport">
            <TrainerWalkScene
              trainerSrc="/trainer-walk.png"
              label="Keshav walking"
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

      <CareerPC />
    </main>
  );
}
