// @vitest-environment node

// @ts-expect-error Vitest provides this built-in; the app intentionally omits Node globals.
import { readFileSync } from 'node:fs';

const globalStyles = readFileSync(new URL('./global.css', import.meta.url), 'utf8');
const tokens = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');
const mainSource = readFileSync(new URL('../main.tsx', import.meta.url), 'utf8');
const documentSource = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');

describe('handheld reference visual system', () => {
  it('defines the exact approved shared palette and pixel border', () => {
    expect(tokens).toContain('--ink: #0c1720');
    expect(tokens).toContain('--screen-blue: #5596df');
    expect(tokens).toContain('--panel-cyan: #a9d8f3');
    expect(tokens).toContain('--steel-dark: #596875');
    expect(tokens).toContain('--steel-light: #cbd4d8');
    expect(tokens).toContain('--status-green: #35d34a');
    expect(tokens).toContain('--screen-white: #f4f8f7');
    expect(tokens).toContain('--select-red: #d94545');
    expect(tokens).toContain('--select-blue: #2877c8');
    expect(tokens).toContain('--focus: #ffd84d');
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

  it('keeps small selected-control labels on a high-contrast steel/white pair', () => {
    expect(globalStyles).toMatch(
      /button\[aria-pressed="true"\]\s*{[^}]*background: var\(--steel-dark\);[^}]*color: var\(--screen-white\);/,
    );
    expect(globalStyles).toMatch(
      /\[role="tab"\]\[aria-selected="true"\]\s*{[^}]*background: var\(--steel-dark\);[^}]*color: var\(--screen-white\);/,
    );
    expect(globalStyles).toMatch(
      /div\[aria-label="Types"\]\s*span\s*{[^}]*background: var\(--screen-white\);[^}]*color: var\(--ink\);/,
    );
  });

  it('styles the framed Trainer Card, cyan field rows, avatar panel, and roster control', () => {
    expect(globalStyles).toMatch(/\.trainer-card\s*{[\s\S]*?background: var\(--screen-blue\);/);
    expect(globalStyles).toMatch(
      /\.trainer-card__fields\s*>\s*div\s*{[\s\S]*?background: var\(--panel-cyan\);/,
    );
    expect(globalStyles).toMatch(
      /\.trainer-card__walk-viewport\s*{[\s\S]*?border: 0\.35rem solid var\(--steel-dark\);/,
    );
    expect(globalStyles).toMatch(/\.trainer-roster-card\s*{[\s\S]*?display: flex;/);
  });

  it('uses one roster column by default and two columns from 768 pixels', () => {
    expect(globalStyles).toContain('min-width: 44px');
    expect(globalStyles).toContain('min-height: 44px');
    expect(globalStyles).toMatch(
      /ul\[aria-label="Career entries"\]\s*{[\s\S]*?grid-template-columns: minmax\(0, 1fr\);/,
    );
    expect(globalStyles).toMatch(/@media\s*\(min-width:\s*768px\)/);
    expect(globalStyles).toMatch(
      /@media\s*\(min-width:\s*768px\)[\s\S]*?ul\[aria-label="Career entries"\][\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/,
    );
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
      /dialog\.pokedex-entry\[open\][\s\S]*position: fixed;[\s\S]*width: min\(calc\(100% - 1rem\), 48rem\);[\s\S]*max-height: calc\(100dvh - 1rem\);[\s\S]*overflow: auto;/,
    );
    expect(globalStyles).toMatch(/dialog\.pokedex-entry::backdrop\s*{/);
    expect(globalStyles).toMatch(
      /dialog\.pokedex-entry\[open\][\s\S]*?background: var\(--screen-blue\);/,
    );
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
    expect(globalStyles).toMatch(
      /prefers-reduced-motion:[\s\S]*\.pixel-sprite__frame--b[\s\S]*opacity: 0 !important/,
    );
    expect(globalStyles).toMatch(
      /data-reduced-motion="true"[\s\S]*\.pixel-sprite__frame--b[\s\S]*opacity: 0 !important/,
    );
  });

  it('supplies portfolio metadata without introducing an unapproved theme color', () => {
    expect(documentSource).toContain(
      'content="Software engineering and data science portfolio for Keshav Goel."',
    );
    expect(documentSource).toContain('name="theme-color" content="#5596df"');
  });
});
