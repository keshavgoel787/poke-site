import { careerBoxes, getEntry, trainerProfile } from './portfolioData';

it('provides exactly the three approved boxes', () => {
  expect(careerBoxes.map((box) => box.id)).toEqual(['experience', 'projects', 'trainer']);
});

it('gives every entry four moves and a unique route id', () => {
  const entries = careerBoxes.flatMap((box) => box.entries);
  expect(new Set(entries.map((entry) => entry.id)).size).toBe(entries.length);
  expect(entries.every((entry) => entry.moves.length === 4)).toBe(true);
});

it('finds an entry by box and id', () => {
  expect(getEntry('experience', 'amazon')?.organization).toBe('Amazon');
});

it('finds ForgetMeNot by its shareable route id', () => {
  expect(getEntry('projects', 'forgetmenot')?.organization).toBe('ForgetMeNot');
});

it('uses professional areas instead of game-element types', () => {
  const gameElementTypes = new Set([
    'Steel',
    'Electric',
    'Fire',
    'Psychic',
    'Normal',
    'Flying',
    'Grass',
    'Fairy',
    'Fighting',
    'Ground',
  ]);
  const entries = careerBoxes.flatMap((box) => box.entries);

  expect(entries.every((entry) => entry.types.every((type) => !gameElementTypes.has(type)))).toBe(true);
});

it('provides verified professional links for the trainer profile', () => {
  const links = Object.fromEntries(trainerProfile.links.map((link) => [link.label, link.href]));

  expect(links['Résumé']).toBe('/resume.pdf');
  expect(links.GitHub).toBe('https://github.com/keshavgoel787');
  expect(links.LinkedIn).toBe('https://www.linkedin.com/in/goel-keshav');
  expect(links.Email).toBe('mailto:kgoel9657@gmail.com');
});
