// @vitest-environment node

// @ts-expect-error Vitest provides this built-in; the app intentionally omits Node globals.
import { readFileSync } from 'node:fs';

const globalStyles = readFileSync(new URL('./global.css', import.meta.url), 'utf8');
const tokens = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');
const mainSource = readFileSync(new URL('../main.tsx', import.meta.url), 'utf8');
const documentSource = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');

describe('Kanto-red visual system', () => {
  it('defines the exact approved shared palette and pixel border', () => {
    expect(tokens).toContain('--ink: #172032');
    expect(tokens).toContain('--cream: #fff4da');
    expect(tokens).toContain('--gold: #ffd56b');
    expect(tokens).toContain('--red: #d44532');
    expect(tokens).toContain('--focus: #2459c4');
    expect(tokens).toContain('--pixel-border: 3px');
  });

  it('wires the token and global styles through the application entry point', () => {
    expect(mainSource).toContain("import './styles/tokens.css'");
    expect(mainSource).toContain("import './styles/global.css'");
  });

  it('defines visible focus and semantic selected-state treatments', () => {
    expect(globalStyles).toMatch(/:focus-visible\s*{/);
    expect(globalStyles).toContain('outline: 4px solid var(--focus)');
    expect(globalStyles).toContain('[aria-pressed="true"]');
    expect(globalStyles).toContain('[aria-selected="true"]');
  });

  it('keeps small selected-control labels on the high-contrast ink/cream pair', () => {
    expect(globalStyles).toMatch(
      /button\[aria-pressed="true"\]\s*{\s*background: var\(--cream\);\s*color: var\(--ink\);/,
    );
    expect(globalStyles).toMatch(
      /\[role="tab"\]\[aria-selected="true"\]\s*{\s*background: var\(--cream\);\s*color: var\(--ink\);/,
    );
  });

  it('stacks mobile content grid-first and switches to two desktop columns', () => {
    expect(globalStyles).toContain('min-width: 44px');
    expect(globalStyles).toContain('min-height: 44px');
    expect(globalStyles).toMatch(/@media\s*\(min-width:\s*768px\)/);
    expect(globalStyles).toContain('grid-template-columns: minmax(0, 1fr) minmax(21rem, 1.08fr)');
  });

  it('uses pixel rendering and all four restrained motion treatments', () => {
    expect(globalStyles).toContain('image-rendering: pixelated');
    expect(globalStyles).toContain('@keyframes boot');
    expect(globalStyles).toContain('@keyframes cursor-hop');
    expect(globalStyles).toContain('@keyframes dialogue-reveal');
    expect(globalStyles).toContain('@keyframes sprite-frame-a');
    expect(globalStyles).toContain('@keyframes sprite-frame-b');
  });

  it('presents roster details as a fixed modal with a backdrop', () => {
    expect(globalStyles).toMatch(/dialog\.pokedex-entry\[open\]\s*{/);
    expect(globalStyles).toMatch(
      /dialog\.pokedex-entry\[open\][\s\S]*position: fixed;[\s\S]*max-height: calc\(100dvh - 2rem\);[\s\S]*overflow: auto;/,
    );
    expect(globalStyles).toMatch(/dialog\.pokedex-entry::backdrop\s*{/);
  });

  it('collapses motion for system and in-app reduced-motion preferences', () => {
    expect(globalStyles).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
    expect(globalStyles).toContain('[data-reduced-motion="true"]');
    expect(globalStyles).toContain('animation-duration: 0.01ms !important');
    expect(globalStyles).toContain('transition-duration: 0.01ms !important');
    expect(globalStyles).toMatch(
      /prefers-reduced-motion:[\s\S]*\.pokedex-entry__highlight[\s\S]*clip-path: inset\(0\) !important/,
    );
    expect(globalStyles).toMatch(
      /data-reduced-motion="true"[\s\S]*\.pokedex-entry__highlight[\s\S]*clip-path: inset\(0\) !important/,
    );
  });

  it('supplies portfolio metadata without introducing an unapproved theme color', () => {
    expect(documentSource).toContain(
      'content="Software engineering and data science portfolio for Keshav Goel."',
    );
    expect(documentSource).toContain('name="theme-color" content="#d44532"');
  });
});
