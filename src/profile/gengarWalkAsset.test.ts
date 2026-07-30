// @vitest-environment node

// @ts-expect-error Vitest provides this built-in; the app intentionally omits Node globals.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const asset: string = readFileSync(
  new URL('../../public/gengar-walk.svg', import.meta.url),
  'utf8',
);
const approvedColors = new Set([
  '#382650',
  '#7456a6',
  '#9475c7',
  '#d94545',
  '#f4f8f7',
  '#0c1720',
]);

describe('Gengar walk sprite', () => {
  it('contains four equal 32px frames in one horizontal strip', () => {
    expect(asset).toMatch(/viewBox="0 0 128 32"/);
    expect(asset.match(/data-frame="[1-4]"/g)).toHaveLength(4);
  });

  it('uses only the approved site palette', () => {
    const colors = asset.match(/#[0-9a-fA-F]{6}/g) ?? [];

    expect(colors.length).toBeGreaterThan(0);
    expect(colors.every((color) => approvedColors.has(color.toLowerCase()))).toBe(true);
  });
});
