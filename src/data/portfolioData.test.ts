import { careerBoxes, getEntry } from './portfolioData';

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
