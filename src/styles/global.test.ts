// @vitest-environment node

// @ts-expect-error Vitest provides this built-in; the app intentionally omits Node globals.
import { readFileSync } from 'node:fs';
// @ts-expect-error Vitest provides this built-in; the app intentionally omits Node globals.
import { inflateSync } from 'node:zlib';

const globalStyles = readFileSync(new URL('./global.css', import.meta.url), 'utf8');
const tokens = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');
const mainSource = readFileSync(new URL('../main.tsx', import.meta.url), 'utf8');
const documentSource = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
const trainerStripSource = readFileSync(
  new URL('../../public/trainer-walk.png', import.meta.url),
);

function inspectRgbaPng(source: Uint8Array) {
  const view = new DataView(source.buffer, source.byteOffset, source.byteLength);
  const width = view.getUint32(16);
  const height = view.getUint32(20);
  const colorType = source[25];
  const idatChunks: Uint8Array[] = [];
  let offset = 8;

  while (offset < source.length) {
    const length = view.getUint32(offset);
    const type = String.fromCharCode(...source.subarray(offset + 4, offset + 8));

    if (type === 'IDAT') {
      idatChunks.push(source.subarray(offset + 8, offset + 8 + length));
    }

    offset += length + 12;
  }

  expect(colorType).toBe(6);
  const compressed = new Uint8Array(idatChunks.reduce((sum, chunk) => sum + chunk.length, 0));
  let compressedOffset = 0;

  for (const chunk of idatChunks) {
    compressed.set(chunk, compressedOffset);
    compressedOffset += chunk.length;
  }

  const pixels = inflateSync(compressed);
  const bytesPerPixel = 4;
  const stride = width * bytesPerPixel;
  let previous = new Uint8Array(stride);
  let pixelOffset = 0;
  const frameBounds = Array.from({ length: 3 }, () => ({ top: height, bottom: 0 }));
  let alphaTop = height;
  let alphaBottom = 0;

  const paeth = (left: number, above: number, upperLeft: number) => {
    const estimate = left + above - upperLeft;
    const leftDistance = Math.abs(estimate - left);
    const aboveDistance = Math.abs(estimate - above);
    const upperLeftDistance = Math.abs(estimate - upperLeft);

    return leftDistance <= aboveDistance && leftDistance <= upperLeftDistance
      ? left
      : aboveDistance <= upperLeftDistance
        ? above
        : upperLeft;
  };

  for (let y = 0; y < height; y += 1) {
    const filter = pixels[pixelOffset];
    pixelOffset += 1;
    const row = new Uint8Array(stride);

    for (let byteIndex = 0; byteIndex < stride; byteIndex += 1) {
      const raw = pixels[pixelOffset + byteIndex];
      const left = byteIndex >= bytesPerPixel ? row[byteIndex - bytesPerPixel] : 0;
      const above = previous[byteIndex];
      const upperLeft = byteIndex >= bytesPerPixel ? previous[byteIndex - bytesPerPixel] : 0;
      const predictor =
        filter === 1
          ? left
          : filter === 2
            ? above
            : filter === 3
              ? Math.floor((left + above) / 2)
              : filter === 4
                ? paeth(left, above, upperLeft)
                : 0;
      row[byteIndex] = (raw + predictor) & 255;
    }

    for (let x = 0; x < width; x += 1) {
      if (row[x * bytesPerPixel + 3] === 0) {
        continue;
      }

      alphaTop = Math.min(alphaTop, y);
      alphaBottom = Math.max(alphaBottom, y + 1);
      const frameIndex = Math.min(2, Math.floor(x / (width / 3)));
      frameBounds[frameIndex].top = Math.min(frameBounds[frameIndex].top, y);
      frameBounds[frameIndex].bottom = Math.max(frameBounds[frameIndex].bottom, y + 1);
    }

    pixelOffset += stride;
    previous = row;
  }

  return { width, height, alphaTop, alphaBottom, frameBounds };
}

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
    expect(globalStyles).toMatch(
      /:focus-visible\s*{[^}]*outline-offset: 3px;[^}]*box-shadow: 0 0 0 3px var\(--ink\) !important;/,
    );
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

  it('styles the unified Trainer Card and embedded career PC', () => {
    expect(globalStyles).toMatch(/\.trainer-card\s*{[\s\S]*?background: var\(--screen-blue\);/);
    expect(globalStyles).toMatch(
      /\.trainer-card__fields\s*>\s*div\s*{[\s\S]*?background: var\(--panel-cyan\);/,
    );
    expect(globalStyles).toMatch(
      /\.trainer-card__walk-viewport\s*{[\s\S]*?border: 0\.35rem solid var\(--steel-dark\);/,
    );
    expect(globalStyles).toMatch(
      /\.trainer-screen\s*{[^}]*display: grid;[^}]*gap:/,
    );
    expect(globalStyles).toMatch(
      /\.career-pc\s*{[^}]*overflow: hidden;[^}]*background: var\(--ink\);/,
    );
    expect(globalStyles).not.toMatch(/\.trainer-roster-card\s*{/);
    expect(globalStyles).toMatch(
      /@media \(min-width: 90rem\) and \(min-height: 56\.25rem\)\s*{[\s\S]*?\.trainer-screen\s*{[^}]*height: calc\(100dvh - 2rem\);[^}]*grid-template-rows: minmax\(0, 21\.5rem\) minmax\(0, 1fr\);/,
    );
    expect(globalStyles).toMatch(
      /@media \(min-width: 90rem\) and \(min-height: 56\.25rem\)[\s\S]*?\.career-pc[^}]*min-height: 0;/,
    );
    expect(globalStyles).toMatch(
      /@media \(min-width: 90rem\) and \(min-height: 56\.25rem\)[\s\S]*?\.career-pc [^{]*ul\[aria-label="Career entries"\]\s*{[^}]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/,
    );
    expect(globalStyles).toMatch(
      /@media \(min-width: 90rem\) and \(min-height: 56\.25rem\)[\s\S]*?\.career-pc [^{]*button\s*{[^}]*min-height: 0;[^}]*height: 6\.75rem;/,
    );
  });

  it('allocates enough desktop height to keep Trainer Card links inside the clipped card', () => {
    const desktopTrainerTrack = globalStyles.match(
      /@media \(min-width: 90rem\) and \(min-height: 56\.25rem\)[\s\S]*?\.trainer-screen\s*{[^}]*grid-template-rows: minmax\(0, ([\d.]+)rem\) minmax\(0, 1fr\);/,
    );

    expect(desktopTrainerTrack).not.toBeNull();
    expect(Number(desktopTrainerTrack?.[1])).toBeGreaterThanOrEqual(21.5);
  });

  it('compacts laptop-height desktops with targeted rules instead of scaling the interface', () => {
    const compactDesktopStart = globalStyles.indexOf(
      '@media (min-width: 64rem) and (max-height: 56.25rem)',
    );

    expect(compactDesktopStart).not.toBe(-1);

    const nextMediaStart = globalStyles.indexOf('@media', compactDesktopStart + 1);
    const compactDesktopStyles = globalStyles.slice(
      compactDesktopStart,
      nextMediaStart === -1 ? undefined : nextMediaStart,
    );

    expect(compactDesktopStyles).toMatch(/#root\s*{[^}]*padding: 0\.5rem;/);
    expect(compactDesktopStyles).toMatch(
      /\.trainer-screen\s*{[^}]*height: auto;[^}]*grid-template-rows: minmax\(0, 19rem\) auto;[^}]*align-content: start;[^}]*gap: 0\.4rem;/,
    );
    expect(compactDesktopStyles).not.toContain(
      'grid-template-rows: minmax(0, 19rem) minmax(0, 1fr)',
    );
    expect(compactDesktopStyles).toMatch(
      /\.trainer-card\s*{[^}]*padding: 0\.5rem 0\.75rem;/,
    );
    expect(compactDesktopStyles).toMatch(
      /\.trainer-card > h1\s*{[^}]*margin-bottom: 0\.25rem;/,
    );
    expect(compactDesktopStyles).toMatch(
      /\.trainer-card__body\s*{[^}]*gap: 0\.5rem;/,
    );
    expect(compactDesktopStyles).toMatch(
      /\.trainer-card__fields\s*{[^}]*gap: 0\.2rem;/,
    );
    expect(compactDesktopStyles).toMatch(
      /\.trainer-card__fields dt,\s*\.trainer-card__fields dd\s*{[^}]*padding: 0\.18rem 0\.4rem;/,
    );
    expect(compactDesktopStyles).toMatch(
      /\.trainer-card__walk-viewport\s*{[^}]*width: min\(100%, 10rem\);/,
    );
    expect(compactDesktopStyles).toMatch(
      /\.trainer-card nav\s*{[^}]*margin-top: 0\.3rem;[^}]*padding: 0\.2rem;/,
    );
    expect(compactDesktopStyles).toMatch(
      /\.career-pc__header > h2\s*{[^}]*padding: 0\.3rem 0\.6rem;/,
    );
    expect(compactDesktopStyles).toMatch(
      /\.career-pc > nav\[aria-label="Professional roster"\]\s*{[^}]*padding: 0\.2rem 0\.3rem 0;/,
    );
    expect(compactDesktopStyles).toMatch(
      /\[role="tablist"\]\s*{[^}]*gap: 0\.2rem;/,
    );
    expect(compactDesktopStyles).toMatch(
      /\[role="tablist"\] \[role="tab"\]\s*{[^}]*padding: 0\.2rem;/,
    );
    expect(compactDesktopStyles).toMatch(
      /\.career-pc > \[role="tabpanel"\]\s*{[^}]*padding: 0\.3rem;/,
    );
    expect(compactDesktopStyles).toMatch(
      /\.career-pc > \[role="tabpanel"\] > ul\[aria-label="Career entries"\]\s*{[^}]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);[^}]*gap: 0\.25rem;/,
    );
    expect(compactDesktopStyles).not.toContain(
      'grid-template-rows: repeat(3, minmax(0, 1fr))',
    );
    expect(compactDesktopStyles).toMatch(
      /\.career-pc > \[role="tabpanel"\] > ul\[aria-label="Career entries"\] button\s*{[^}]*min-height: 6rem;[^}]*padding: 0\.3rem;/,
    );
    expect(compactDesktopStyles).toMatch(
      /\.career-pc \.pixel-sprite\s*{[^}]*width: 3\.75rem;[^}]*height: 3\.75rem;/,
    );
    expect(compactDesktopStyles).not.toMatch(
      /transform:[^;{}]*scale(?:X|Y)?\s*\(/,
    );
    expect(compactDesktopStyles).not.toMatch(/\bzoom\s*:/);
  });

  it('keeps the trainer-only scene proportional, centered, pixelated, and facing right', () => {
    expect(globalStyles).toMatch(
      /\.trainer-card__walk-viewport\s*{[^}]*aspect-ratio: 1;/,
    );
    expect(globalStyles).toMatch(
      /\.trainer-walk-scene\s*{[^}]*overflow: hidden;/,
    );
    expect(globalStyles).toMatch(
      /\.trainer-walk-trainer\s*{[^}]*top: 0;[^}]*bottom: 0;[^}]*left: 50%;[^}]*z-index: 2;[^}]*width: 66\.6667%;[^}]*height: 100%;[^}]*overflow: hidden;[^}]*transform: translateX\(-50%\);/,
    );
    expect(globalStyles).toMatch(
      /\.trainer-walk-strip\s*{[^}]*width: 300%;[^}]*height: 100%;[^}]*image-rendering: pixelated;[^}]*transform: scaleX\(1\);/,
    );
    expect(globalStyles).not.toMatch(/trainer-walk-companion/);
    expect(globalStyles).not.toMatch(/gengar-walk-cycle/);
  });

  it('fills the square picture panel while preserving the trainer frame aspect ratio', () => {
    const sceneRule = globalStyles.match(/\.trainer-walk-scene\s*{([^}]*)}/)?.[1] ?? '';
    const trainerRule =
      globalStyles.match(/\.trainer-walk-trainer\s*{([^}]*)}/)?.[1] ?? '';
    const trainerWidth = trainerRule.match(/width:\s*([\d.]+)%/)?.[1];

    expect(sceneRule).toMatch(/width:\s*100%;/);
    expect(sceneRule).toMatch(/aspect-ratio:\s*1;/);
    expect(trainerWidth).toBeDefined();
    expect(Number(trainerWidth)).toBeCloseTo((2 / 3) * 100, 3);
  });

  it('normalizes three equal trainer frames to a 32-to-48-pixel visible chibi', () => {
    const strip = inspectRgbaPng(trainerStripSource);
    const visibleHeightAt48Pixels =
      ((strip.alphaBottom - strip.alphaTop) / strip.height) * 48;

    expect(strip.width % 3).toBe(0);
    expect(strip.frameBounds.every(({ bottom, top }) => bottom > top)).toBe(true);
    expect(new Set(strip.frameBounds.map(({ bottom }) => bottom)).size).toBe(1);
    expect(visibleHeightAt48Pixels).toBeGreaterThanOrEqual(32);
    expect(visibleHeightAt48Pixels).toBeLessThanOrEqual(48);
    expect(visibleHeightAt48Pixels).toBeCloseTo(40, 0);
  });

  it('uses contrast-safe text or complete outlines on blue surfaces', () => {
    expect(globalStyles).toMatch(
      /\.trainer-card\s*>\s*h1\s*{[^}]*color: var\(--ink\);/,
    );
    expect(globalStyles).toMatch(
      /\.career-pc__header\s*{[^}]*background: var\(--screen-blue\);/,
    );
    expect(globalStyles).toMatch(
      /\.career-pc__header\s*>\s*h2\s*{[^}]*color: var\(--ink\);/,
    );
    expect(globalStyles).toMatch(
      /\.party-card__name\s*{[^}]*color: var\(--screen-white\);[^}]*-2px 0 var\(--ink\)[^}]*2px 0 var\(--ink\)[^}]*0 -2px var\(--ink\)[^}]*0 2px var\(--ink\)/,
    );
    expect(globalStyles).toMatch(
      /\.pokedex-entry__organization\s*{[^}]*color: var\(--ink\);/,
    );
  });

  it('keeps concise metadata rows from overriding the compact completion indicator', () => {
    const metadataRule = globalStyles.match(
      /([^{}]*\.party-card__organization[^{}]*)\{([^{}]*background: var\(--screen-white\);[^{}]*)\}/,
    );
    const completionRule = globalStyles.match(
      /\.party-card__completion\s*\{([^}]*)\}/,
    );

    expect(metadataRule).not.toBeNull();
    expect(metadataRule?.[1]).toContain('.party-card__organization');
    expect(metadataRule?.[1]).toContain('.party-card__role');
    expect(metadataRule?.[1]).toContain('.party-card__metadata');
    expect(metadataRule?.[1]).not.toContain('.party-card__category');
    expect(metadataRule?.[2]).toMatch(/overflow:\s*hidden;/);
    expect(metadataRule?.[2]).toMatch(/text-overflow:\s*ellipsis;/);
    expect(metadataRule?.[2]).toMatch(/white-space:\s*nowrap;/);
    expect(metadataRule?.[1]).not.toContain('.party-card__completion');
    expect(completionRule?.[1]).toMatch(/position:\s*absolute;/);
    expect(completionRule?.[1]).toMatch(/color:\s*var\(--status-green\);/);
    expect(completionRule?.[1]).toMatch(/font-size:\s*0\.65rem;/);
    expect(completionRule?.[1]).toMatch(/line-height:\s*1;/);
  });

  it('gives sprite fallbacks a stable high-contrast backplate on every surface', () => {
    expect(globalStyles).toMatch(
      /\.pixel-sprite--fallback\s*{[^}]*background: var\(--screen-white\);[^}]*color: var\(--ink\);/,
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
      /prefers-reduced-motion:[\s\S]*\.trainer-walk-strip[\s\S]*animation: none !important/,
    );
    expect(globalStyles).toMatch(
      /data-reduced-motion="true"[\s\S]*\.trainer-walk-strip[\s\S]*animation: none !important/,
    );
  });

  it('supplies portfolio metadata without introducing an unapproved theme color', () => {
    expect(documentSource).toContain(
      'content="Software engineering and data science portfolio for Keshav Goel."',
    );
    expect(documentSource).toContain('name="theme-color" content="#5596df"');
  });
});
