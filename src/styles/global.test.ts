// @vitest-environment node

// @ts-expect-error Vitest provides this built-in; the app intentionally omits Node globals.
import { existsSync, readFileSync } from 'node:fs';

const globalStyles = readFileSync(new URL('./global.css', import.meta.url), 'utf8');
const tokens = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');
const mainSource = readFileSync(new URL('../main.tsx', import.meta.url), 'utf8');
const documentSource = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
const companionUrl = new URL('../../public/gengar-companion.svg', import.meta.url);
const companionSource = existsSync(companionUrl) ? readFileSync(companionUrl, 'utf8') : '';

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

  it('keeps the chibi scene compact, pixelated, layered, and facing right', () => {
    expect(globalStyles).toMatch(
      /\.trainer-walk-scene\s*{[^}]*width: 2rem;[^}]*height: 3rem;/,
    );
    expect(globalStyles).toMatch(
      /\.trainer-walk-strip\s*{[^}]*z-index: 2;[^}]*height: 3rem;[^}]*image-rendering: pixelated;[^}]*transform: scaleX\(1\);/,
    );
    expect(globalStyles).toMatch(
      /\.trainer-walk-companion\s*{[^}]*bottom: 0\.6rem;[^}]*z-index: 1;[^}]*width: 1\.75rem;[^}]*image-rendering: pixelated;[^}]*transform: scaleX\(1\);/,
    );
  });

  it('uses the repo-native crisp-edge block companion asset', () => {
    expect(companionSource).toContain('viewBox="0 0 32 32"');
    expect(companionSource).toContain('shape-rendering="crispEdges"');
    expect(companionSource).toContain('<rect');
    expect(companionSource).not.toMatch(/<(?:path|circle|ellipse|polygon|image)\b/);
  });

  it('uses contrast-safe text or complete outlines on blue surfaces', () => {
    expect(globalStyles).toMatch(
      /\.trainer-card\s*>\s*h1\s*{[^}]*color: var\(--ink\);/,
    );
    expect(globalStyles).toMatch(
      /main\[data-booting\]\s*>\s*h1\s*{[^}]*background: var\(--screen-blue\);[^}]*color: var\(--ink\);/,
    );
    expect(globalStyles).toMatch(
      /\.trainer-roster-card\s*{[^}]*background: var\(--steel-dark\);[^}]*color: var\(--screen-white\);/,
    );
    expect(globalStyles).toMatch(
      /\.trainer-roster-card:hover::after\s*{[^}]*color: var\(--ink\);/,
    );
    expect(globalStyles).toMatch(
      /\.pixel-sprite\s*\+\s*span\s*{[^}]*color: var\(--screen-white\);[^}]*-2px 0 var\(--ink\)[^}]*2px 0 var\(--ink\)[^}]*0 -2px var\(--ink\)[^}]*0 2px var\(--ink\)/,
    );
    expect(globalStyles).toMatch(
      /\.pokedex-entry__organization\s*{[^}]*color: var\(--ink\);/,
    );
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
    expect(globalStyles).toMatch(
      /prefers-reduced-motion:[\s\S]*\.trainer-walk-strip,[\s\S]*\.trainer-walk-companion[\s\S]*animation: none !important/,
    );
    expect(globalStyles).toMatch(
      /data-reduced-motion="true"[\s\S]*\.trainer-walk-strip,[\s\S]*\.trainer-walk-companion[\s\S]*animation: none !important/,
    );
  });

  it('supplies portfolio metadata without introducing an unapproved theme color', () => {
    expect(documentSource).toContain(
      'content="Software engineering and data science portfolio for Keshav Goel."',
    );
    expect(documentSource).toContain('name="theme-color" content="#5596df"');
  });
});
