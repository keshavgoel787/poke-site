import { describe, expect, it } from 'vitest';
import { legacyPcPath, pokemonPath, resolvePokemonRoute } from './routes';

describe('pokemonPath', () => {
  it('builds roster and entry routes', () => {
    expect(pokemonPath('experience')).toBe('/pokemon/experience');
    expect(pokemonPath('experience', 'draftkings')).toBe(
      '/pokemon/experience/draftkings',
    );
  });
});

describe('resolvePokemonRoute', () => {
  it('accepts a known entry in its roster tab', () => {
    expect(resolvePokemonRoute('projects', 'forgetmenot')).toEqual({
      tab: 'projects',
      entryId: 'forgetmenot',
      recovered: false,
    });
  });

  it('recovers an unknown entry to its valid roster tab', () => {
    expect(resolvePokemonRoute('projects', 'missing')).toEqual({
      tab: 'projects',
      entryId: undefined,
      recovered: true,
    });
  });

  it('recovers an unknown tab to the first available roster tab', () => {
    expect(resolvePokemonRoute('trainer', 'interests')).toEqual({
      tab: 'experience',
      entryId: undefined,
      recovered: true,
    });
  });
});

describe('legacyPcPath', () => {
  it('maps a retained legacy entry to its new route', () => {
    expect(legacyPcPath('experience', 'draftkings')).toBe(
      '/pokemon/experience/draftkings',
    );
    expect(legacyPcPath('projects', 'forgetmenot')).toBe(
      '/pokemon/projects/forgetmenot',
    );
  });

  it('maps removed entries to the nearest valid roster tab', () => {
    expect(legacyPcPath('experience', 'generate')).toBe('/pokemon/experience');
    expect(legacyPcPath('experience', 'vdart')).toBe('/pokemon/experience');
    expect(legacyPcPath('projects', 'missing')).toBe('/pokemon/projects');
  });

  it('maps trainer-only and unknown legacy routes to the trainer card', () => {
    expect(legacyPcPath('trainer', 'interests')).toBe('/');
    expect(legacyPcPath('unknown', 'missing')).toBe('/');
  });
});
