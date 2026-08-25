import amazonA from './amazon-a.svg?raw';
import amazonB from './amazon-b.svg?raw';
import breatheEasyA from './breathe-easy-a.svg?raw';
import breatheEasyB from './breathe-easy-b.svg?raw';
import draftKingsA from './draftkings-a.svg?raw';
import draftKingsB from './draftkings-b.svg?raw';
import forgetMeNotA from './forget-me-not-a.svg?raw';
import forgetMeNotB from './forget-me-not-b.svg?raw';
import johnsonJohnsonA from './johnson-johnson-a.svg?raw';
import johnsonJohnsonB from './johnson-johnson-b.svg?raw';
import procureMateA from './procuremateai-a.svg?raw';
import procureMateB from './procuremateai-b.svg?raw';
import remetraA from './remetra-a.svg?raw';
import remetraB from './remetra-b.svg?raw';
import wpsDataLabA from './wps-data-lab-a.svg?raw';
import wpsDataLabB from './wps-data-lab-b.svg?raw';

const approvedPalette = new Set([
  '#172032',
  '#2877c8',
  '#35d34a',
  '#5596df',
  '#a9d8f3',
  '#c74632',
  '#f28c28',
  '#ffd56b',
  '#fff4da',
]);

const spritePairs = [
  { name: 'AWS', frameA: amazonA, frameB: amazonB },
  { name: 'DraftKings', frameA: draftKingsA, frameB: draftKingsB },
  { name: 'ProcureMate AI', frameA: procureMateA, frameB: procureMateB },
  { name: 'Johnson & Johnson', frameA: johnsonJohnsonA, frameB: johnsonJohnsonB },
  { name: 'WPS Data Lab', frameA: wpsDataLabA, frameB: wpsDataLabB },
  { name: 'Remetra', frameA: remetraA, frameB: remetraB },
  { name: 'ForgetMeNot', frameA: forgetMeNotA, frameB: forgetMeNotB },
  { name: 'BreatheEasy', frameA: breatheEasyA, frameB: breatheEasyB },
] as const;

const frames = spritePairs.flatMap(({ name, frameA, frameB }) => [
  { name: `${name} frame A`, svg: frameA },
  { name: `${name} frame B`, svg: frameB },
]);

describe('classic roster sprite style', () => {
  it.each([remetraA, remetraB])('Remetra depicts a simple apple mascot', (svg) => {
    expect(svg).toContain('<title>Apple mascot</title>');
  });

  it.each([forgetMeNotA, forgetMeNotB])('ForgetMeNot depicts a full five-petal flower', (svg) => {
    expect(svg).toContain('<title>Five-petal forget-me-not flower</title>');
  });

  it.each([forgetMeNotA, forgetMeNotB])('ForgetMeNot has a large readable face', (svg) => {
    expect(svg).toContain('<rect x="10" y="10" width="12" height="12"/>');
  });

  it('ForgetMeNot changes from a neutral mouth to a smile', () => {
    expect(forgetMeNotA).toContain('<rect x="14" y="18" width="4" height="2"/>');
    expect(forgetMeNotB).toContain('<rect x="12" y="18" width="2" height="2"/>');
    expect(forgetMeNotB).toContain('<rect x="14" y="20" width="4" height="2"/>');
    expect(forgetMeNotB).toContain('<rect x="18" y="18" width="2" height="2"/>');
  });

  it.each([draftKingsA, draftKingsB])('DraftKings wears three colored crown gems', (svg) => {
    expect(svg).toContain('<g fill="#2877c8"><rect x="10" y="12" width="2" height="2"/></g>');
    expect(svg).toContain('<g fill="#c74632"><rect x="16" y="12" width="2" height="2"/></g>');
    expect(svg).toContain('<g fill="#35d34a"><rect x="22" y="12" width="2" height="2"/></g>');
  });

  it.each(frames)('$name uses only the shared five-color palette', ({ svg }) => {
    const fills = Array.from(svg.matchAll(/\bfill="(#[0-9a-f]{6})"/gi), ([, fill]) =>
      fill.toLowerCase(),
    );

    expect(fills.length).toBeGreaterThan(0);
    expect(fills.every((fill) => approvedPalette.has(fill))).toBe(true);
  });

  it.each(frames)('$name uses rectangle-only two-pixel geometry', ({ svg }) => {
    expect(svg).toContain('viewBox="0 0 32 32"');
    expect(svg).toContain('shape-rendering="crispEdges"');
    expect(svg).not.toMatch(/<(?:path|polygon|polyline|circle|ellipse)\b/);

    const rects = Array.from(svg.matchAll(/<rect\b[^>]*\/>/g), ([rect]) => rect);
    expect(rects.length).toBeGreaterThan(0);

    for (const rect of rects) {
      const dimensions = Array.from(
        rect.matchAll(/\b(?:x|y|width|height)="([^"]+)"/g),
        ([, value]) => Number(value),
      );

      expect(dimensions).toHaveLength(4);
      expect(dimensions.every((value) => Number.isInteger(value) && value % 2 === 0)).toBe(true);
    }
  });

  it.each(spritePairs)('$name has a distinct object-specific animation frame', ({ frameA, frameB }) => {
    expect(frameA).not.toBe(frameB);
    expect(frameA).not.toContain('transform="translate');
    expect(frameB).not.toContain('transform="translate');
  });
});
