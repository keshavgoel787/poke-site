import type { JSX } from 'react';
import { trainerProfile } from '../data/portfolioData';
import { pcPath } from '../navigation/routes';

export function TrainerProfile(): JSX.Element {
  return (
    <>
      <header>
        <h1>{trainerProfile.name}</h1>
        <p>{trainerProfile.positioning}</p>
        <p>{trainerProfile.education}</p>
      </header>

      <main>
        <section aria-labelledby="experience-heading">
          <h2 id="experience-heading">Experience</h2>
          <ul>
            {trainerProfile.highlights.map((highlight) => (
              <li key={highlight.organization}>
                <article>
                  <h3>{highlight.organization}</h3>
                  <p>{highlight.role}</p>
                  <p>{highlight.dates}</p>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <p>
          <a href={pcPath('experience')}>Open Keshav&apos;s PC</a>
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
