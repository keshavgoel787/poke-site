import { describe, expect, it } from 'vitest';
import { pcPath, resolvePcRoute } from './routes';

describe('pcPath', () => {
  it('builds an entry route', () => {
    expect(pcPath('experience', 'amazon')).toBe('/pc/experience/amazon');
  });
});

describe('resolvePcRoute', () => {
  it('recovers an unknown box to the first available box', () => {
    expect(resolvePcRoute('bad-box', 'missing')).toEqual({
      boxId: 'experience',
      entryId: undefined,
      recovered: true,
    });
  });

  it('accepts a known entry in its box', () => {
    expect(resolvePcRoute('projects', 'forgetmenot')).toEqual({
      boxId: 'projects',
      entryId: 'forgetmenot',
      recovered: false,
    });
  });
});
