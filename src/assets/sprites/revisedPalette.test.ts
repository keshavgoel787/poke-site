import remetraA from './remetra-a.svg?raw';
import remetraB from './remetra-b.svg?raw';
import wpsDataLabA from './wps-data-lab-a.svg?raw';
import wpsDataLabB from './wps-data-lab-b.svg?raw';

const approvedPalette = new Set([
  '#0c1720',
  '#5596df',
  '#2877c8',
  '#a9d8f3',
  '#35d34a',
  '#f4f8f7',
]);

const spritePairs = [
  { name: 'WPS Data Lab', frameA: wpsDataLabA, frameB: wpsDataLabB },
  { name: 'Remetra', frameA: remetraA, frameB: remetraB },
];

const frames = spritePairs.flatMap(({ name, frameA, frameB }) => [
  { name: `${name} frame A`, svg: frameA },
  { name: `${name} frame B`, svg: frameB },
]);

function withoutFills(svg: string) {
  return svg.replace(/\sfill="#[0-9a-f]{6}"/gi, '');
}

describe('revised roster sprite palette', () => {
  it.each(frames)('$name uses only approved colors', ({ svg }) => {
    const fills = Array.from(svg.matchAll(/\bfill="(#[0-9a-f]{6})"/gi), ([, fill]) =>
      fill.toLowerCase(),
    );

    expect(fills.length).toBeGreaterThan(0);
    expect(fills.every((fill) => approvedPalette.has(fill))).toBe(true);
  });

  it.each(frames)('$name keeps crisp integer rectangle geometry', ({ svg }) => {
    expect(svg).toContain('shape-rendering="crispEdges"');

    for (const [rect] of svg.matchAll(/<rect\b[^>]*\/>/g)) {
      const dimensions = Array.from(
        rect.matchAll(/\b(?:x|y|width|height)="([^"]+)"/g),
        ([, value]) => Number(value),
      );

      expect(dimensions).toHaveLength(4);
      expect(dimensions.every(Number.isInteger)).toBe(true);
    }
  });

  it.each(spritePairs)('$name preserves distinct geometric animation frames', ({ frameA, frameB }) => {
    expect(withoutFills(frameA)).not.toBe(withoutFills(frameB));
  });
});
