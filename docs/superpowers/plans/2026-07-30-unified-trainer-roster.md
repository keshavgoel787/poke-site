# Unified Trainer Card and Pokémon Roster Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render the compact Trainer Card and interactive Experience/Projects Pokémon roster as one page, with route-driven Pokémon popups and a large synchronized four-frame Gengar companion.

**Architecture:** `TrainerProfile` becomes the single page composition and embeds a section-form `CareerPC`. Every supported portfolio route renders that composition; `CareerPC` continues to derive tab and dialog state from the URL. The trainer scene keeps isolated asset-failure handling while switching Gengar from a static SVG to a four-frame horizontal SVG sprite strip controlled by CSS.

**Tech Stack:** React, TypeScript, React Router, CSS, Vitest, Testing Library, Vite, PNG/SVG pixel assets.

## Global Constraints

- At viewport sizes of 1440 by 900 pixels or larger, the Trainer Card and active roster fit without vertical scrolling.
- Shorter desktops, tablets, and phones use normal scrolling rather than unreadably small content.
- Experience and Projects remain the only roster tabs.
- Existing route-driven dialogs, keyboard behavior, focus restoration, sound effects, reduced-motion behavior, and recovery messages remain functional.
- Preserve the approved blue Trainer Card and dark party-screen themes.
- Preserve nearest-neighbor pixel rendering and the existing trainer artwork.
- Do not add dependencies, roster entries, or tabs.
- Do not deploy the site or change DNS.
- Do not alter or stage the pre-existing uncommitted changes in `src/assets/sprites/remetra-a.svg`, `src/assets/sprites/remetra-b.svg`, `src/assets/sprites/revisedPalette.test.ts`, `src/assets/sprites/wps-data-lab-a.svg`, or `src/assets/sprites/wps-data-lab-b.svg`.

---

## File Structure

- Modify `src/app/App.tsx`: render the unified page for root and Pokémon routes.
- Modify `src/app/App.test.tsx`: verify that root, tab, and entry routes share one page.
- Modify `src/navigation/routes.ts`: treat an omitted tab on `/` as the valid default without masking invalid explicit tabs.
- Modify `src/navigation/routes.test.ts`: cover root-default and invalid-tab recovery.
- Modify `src/profile/TrainerProfile.tsx`: compose the Trainer Card and embedded roster.
- Modify `src/profile/TrainerProfile.test.tsx`: verify the always-visible roster and removal of the navigation card.
- Modify `src/pc/CareerPC.tsx`: convert the standalone `main` screen into an embeddable labeled section.
- Modify `src/pc/CareerPC.test.tsx`: update structural expectations while retaining interaction coverage.
- Create `public/gengar-walk.svg`: transparent four-frame right-facing Gengar sprite strip.
- Create `src/profile/gengarWalkAsset.test.ts`: verify frame geometry and the constrained sprite palette.
- Modify `src/profile/TrainerWalkScene.tsx`: crop and animate both horizontal sprite strips.
- Modify `src/profile/TrainerWalkScene.test.tsx`: verify sprite-strip structure, sources, and failure fallback.
- Modify `src/styles/global.css`: size the unified page, compact party cards, enlarge the trainer scene, animate Gengar, and preserve scrollable responsive layouts.
- Modify `src/styles/global.test.ts`: verify the unified selectors, desktop fit breakpoint, sprite-strip geometry, and reduced motion.

---

### Task 1: Unified Page Composition and Routing

**Files:**
- Modify: `src/navigation/routes.ts`
- Modify: `src/navigation/routes.test.ts`
- Modify: `src/app/App.tsx`
- Modify: `src/app/App.test.tsx`
- Modify: `src/profile/TrainerProfile.tsx`
- Modify: `src/profile/TrainerProfile.test.tsx`
- Modify: `src/pc/CareerPC.tsx`
- Modify: `src/pc/CareerPC.test.tsx`

**Interfaces:**
- Consumes: `resolvePokemonRoute(tab?: string, entryId?: string): PokemonRouteState`
- Produces: `TrainerProfile`, the sole page composition for `/` and `/pokemon/:tab/:entryId?`
- Produces: `CareerPC`, an embeddable `<section className="career-pc" data-booting>`
- Preserves: `pokemonPath(tab, entryId?)` and all existing roster interactions

- [ ] **Step 1: Write failing route-resolution and unified-app tests**

Add route tests that distinguish an omitted root tab from an invalid explicit tab:

```ts
it('uses Experience without recovery when no tab is supplied for the root page', () => {
  expect(resolvePokemonRoute()).toEqual({
    tab: 'experience',
    entryId: undefined,
    recovered: false,
  });
});

it('recovers an explicitly invalid tab to Experience', () => {
  expect(resolvePokemonRoute('missing')).toEqual({
    tab: 'experience',
    entryId: undefined,
    recovered: true,
  });
});
```

Update `src/app/App.test.tsx` so the root assertion requires both sections and no navigation card:

```ts
it('renders the Trainer Card and Experience roster together on the root route', () => {
  renderApp('/');

  expect(screen.getByRole('heading', { name: 'Trainer Card' })).toBeVisible();
  expect(screen.getByRole('heading', { name: "Keshav's Pokémon" })).toBeVisible();
  expect(screen.getByRole('tab', { name: 'Experience' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  expect(screen.getByRole('button', { name: 'Draftion: DraftKings' })).toBeVisible();
  expect(screen.queryByRole('link', { name: "Keshav's Pokémon" })).not.toBeInTheDocument();
  expect(screen.getAllByRole('main')).toHaveLength(1);
  expect(screen.getByTestId('current-route')).toHaveTextContent(/^\\/$/);
});
```

Extend each direct-entry test to prove the Trainer Card remains behind the popup:

```ts
expect(screen.getByRole('heading', { name: 'Trainer Card', hidden: true })).toBeInTheDocument();
expect(screen.getByRole('heading', { name: "Keshav's Pokémon", hidden: true })).toBeInTheDocument();
```

Update `src/profile/TrainerProfile.test.tsx` to expect the roster heading and tabs instead of `.trainer-roster-card`.

Update the structural test in `src/pc/CareerPC.test.tsx`:

```ts
expect(screen.getByRole('region', { name: "Keshav's Pokémon", hidden: true }))
  .toHaveClass('career-pc');
expect(screen.queryByRole('link', { name: /back to trainer card/i }))
  .not.toBeInTheDocument();
expect(screen.getByRole('button', { name: /sound/i, hidden: true })).toBeVisible();
expect(screen.queryByRole('main')).not.toBeInTheDocument();
```

- [ ] **Step 2: Run the focused tests and verify they fail**

Run:

```bash
npm test -- src/navigation/routes.test.ts src/app/App.test.tsx src/profile/TrainerProfile.test.tsx src/pc/CareerPC.test.tsx
```

Expected: FAIL because `/` still omits the roster, Pokémon routes still render only `CareerPC`, and `CareerPC` is still a standalone `main`.

- [ ] **Step 3: Make omitted-tab recovery explicit**

Change the recovery expression in `resolvePokemonRoute`:

```ts
const hasExplicitTab = tab !== undefined;

return {
  tab: roster.id,
  entryId: entry?.id,
  recovered:
    hasExplicitTab && (roster.id !== tab || (!!entryId && !entry)),
};
```

This keeps `/` on `/`, while an explicit invalid Pokémon route still canonicalizes.

- [ ] **Step 4: Convert `CareerPC` into an embeddable section**

Replace its outer page markup with:

```tsx
<section
  className="career-pc"
  data-booting
  aria-labelledby="career-pc-title"
>
  <header className="career-pc__header">
    <h2 id="career-pc-title">Keshav&apos;s Pokémon</h2>
    <button type="button" aria-pressed={soundEnabled} onClick={toggleSound}>
      Sound
    </button>
  </header>
  {/* recovery status, roster tabs, active panel, and PokedexEntry stay here */}
</section>
```

Remove the standalone `Keshav's PC` heading, the “Back to Trainer Card” link, the outer `main`, and the redundant `data-reduced-motion` prop. Keep route recovery, sound behavior, tab refs, card refs, dialog selection, and focus restoration unchanged.

- [ ] **Step 5: Compose the roster under the Trainer Card**

In `TrainerProfile`, import and render `CareerPC` after the Trainer Card:

```tsx
import { CareerPC } from '../pc/CareerPC';

return (
  <main className="trainer-screen" data-reduced-motion={reducedMotion}>
    <section className="trainer-card" aria-labelledby="trainer-card-title">
      {/* existing Trainer Card content */}
    </section>
    <CareerPC />
  </main>
);
```

Remove the `pokemonPath` import and `.trainer-roster-card` anchor.

- [ ] **Step 6: Render `TrainerProfile` for every current portfolio route**

Change the two Pokémon routes in `App`:

```tsx
<Route path="/" element={<TrainerProfile />} />
<Route path="/pokemon/:tab" element={<TrainerProfile />} />
<Route path="/pokemon/:tab/:entryId" element={<TrainerProfile />} />
```

Remove the unused `CareerPC` import. Retain legacy redirects and the catch-all redirect.

- [ ] **Step 7: Run focused tests and verify they pass**

Run:

```bash
npm test -- src/navigation/routes.test.ts src/app/App.test.tsx src/profile/TrainerProfile.test.tsx src/pc/CareerPC.test.tsx
```

Expected: PASS, including root URL stability, direct popup reconstruction, invalid route recovery, keyboard navigation, sound, and focus restoration.

- [ ] **Step 8: Commit the unified page**

```bash
git add src/navigation/routes.ts src/navigation/routes.test.ts src/app/App.tsx src/app/App.test.tsx src/profile/TrainerProfile.tsx src/profile/TrainerProfile.test.tsx src/pc/CareerPC.tsx src/pc/CareerPC.test.tsx
git commit -m "feat: unify trainer card and pokemon roster"
```

---

### Task 2: Four-Frame Right-Facing Gengar Companion

**Files:**
- Create: `public/gengar-walk.svg`
- Create: `src/profile/gengarWalkAsset.test.ts`
- Modify: `src/profile/TrainerWalkScene.tsx`
- Modify: `src/profile/TrainerWalkScene.test.tsx`
- Modify: `src/styles/global.css`
- Modify: `src/styles/global.test.ts`

**Interfaces:**
- Consumes: `TrainerWalkSceneProps { trainerSrc: string; companionSrc: string; label: string }`
- Produces: `.trainer-walk-companion-frame`, a one-frame crop viewport
- Produces: `.trainer-walk-companion-strip`, a four-frame horizontal SVG strip
- Preserves: all-or-nothing accessible scene fallback

- [ ] **Step 1: Write failing component and CSS tests**

Update the component test to require a crop wrapper and new source:

```ts
expect(screen.getByTestId('trainer-companion').parentElement).toHaveClass(
  'trainer-walk-companion-frame',
);
expect(screen.getByTestId('trainer-companion')).toHaveClass(
  'trainer-walk-companion-strip',
);
expect(screen.getByTestId('trainer-companion')).toHaveAttribute(
  'src',
  '/gengar-walk.svg',
);
```

Update the Trainer Profile test to expect `/gengar-walk.svg`.

Create `src/profile/gengarWalkAsset.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const asset = readFileSync(
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
```

In `src/styles/global.test.ts`, require:

```ts
expect(globalStyles).toMatch(
  /\.trainer-walk-companion-frame\s*{[^}]*overflow: hidden;/,
);
expect(globalStyles).toMatch(
  /\.trainer-walk-companion-strip\s*{[^}]*width: 400%;[^}]*image-rendering: pixelated;[^}]*animation: gengar-walk-cycle 800ms steps\(4\) infinite;/,
);
expect(globalStyles).toMatch(
  /@keyframes gengar-walk-cycle\s*{[\s\S]*transform: translateX\(-100%\);/,
);
```

Keep the existing reduced-motion assertion but target `.trainer-walk-companion-strip`.

- [ ] **Step 2: Run focused tests and verify they fail**

Run:

```bash
npm test -- src/profile/gengarWalkAsset.test.ts src/profile/TrainerWalkScene.test.tsx src/profile/TrainerProfile.test.tsx src/styles/global.test.ts
```

Expected: FAIL because the companion is a static SVG without a crop wrapper or four-frame animation.

- [ ] **Step 3: Generate and inspect the Gengar sprite strip**

Use the image-generation skill with the user's approved reference image:

`/var/folders/bb/hsp4zv4n1j90qvy7v635c_m40000gn/T/TemporaryItems/NSIRD_screencaptureui_dc94sN/Screenshot 2026-07-30 at 11.47.34 AM.png`

Generate a concept sheet with exactly four equal square frames in a single horizontal row. Each frame shows the same chibi, right-facing Gengar advancing through a low walking/bobbing loop. Use transparent surroundings and the established site colors `#382650`, `#7456a6`, `#9475c7`, `#d94545`, `#f4f8f7`, and `#0c1720`. No labels, shadows, background, interpolation, added characters, or frame dividers.

Inspect the selected output, then reproduce its approved silhouettes as crisp SVG rectangles in `public/gengar-walk.svg`. Use `viewBox="0 0 128 32"` and four groups marked `data-frame="1"` through `data-frame="4"`, positioned at x offsets 0, 32, 64, and 96. Use only the six approved colors and transparent unpainted space.

Visually inspect the SVG and confirm all four 32-by-32 frames face right consistently.

- [ ] **Step 4: Add the companion crop wrapper**

Change the companion markup:

```tsx
<div className="trainer-walk-companion-frame">
  <img
    data-testid="trainer-companion"
    className="trainer-walk-companion-strip"
    src={companionSrc}
    alt=""
    onError={() => setFailed(true)}
  />
</div>
```

Change `TrainerProfile` to pass `companionSrc="/gengar-walk.svg"`.

- [ ] **Step 5: Implement synchronized four-frame animation**

Replace the static companion rules with:

```css
.trainer-walk-companion-frame {
  position: absolute;
  left: 4%;
  bottom: 12%;
  z-index: 1;
  width: 42%;
  aspect-ratio: 1;
  overflow: hidden;
}

.trainer-walk-companion-strip {
  position: absolute;
  inset: 0 auto 0 0;
  display: block;
  width: 400%;
  max-width: none;
  height: 100%;
  image-rendering: pixelated;
  animation: gengar-walk-cycle 800ms steps(4) infinite;
}

@keyframes gengar-walk-cycle {
  to {
    transform: translateX(-100%);
  }
}
```

Tune only the frame wrapper’s percentage position and size during browser verification; do not stretch individual frames.

Update both reduced-motion blocks so `.trainer-walk-companion-strip` has `animation: none !important` and `transform: none !important`.

- [ ] **Step 6: Run focused tests and verify they pass**

Run:

```bash
npm test -- src/profile/gengarWalkAsset.test.ts src/profile/TrainerWalkScene.test.tsx src/profile/TrainerProfile.test.tsx src/styles/global.test.ts
```

Expected: PASS, including asset failure fallback and reduced-motion selectors.

- [ ] **Step 7: Commit the companion animation**

```bash
git add public/gengar-walk.svg src/profile/gengarWalkAsset.test.ts src/profile/TrainerWalkScene.tsx src/profile/TrainerWalkScene.test.tsx src/profile/TrainerProfile.tsx src/profile/TrainerProfile.test.tsx src/styles/global.css src/styles/global.test.ts
git commit -m "feat: animate gengar walking companion"
```

---

### Task 3: Compact One-Viewport Desktop Layout

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/styles/global.test.ts`

**Interfaces:**
- Consumes: `.trainer-screen`, `.trainer-card`, `.career-pc`, existing tab and party-card markup
- Produces: desktop-fit breakpoint at `min-width: 90rem` and `min-height: 56.25rem`
- Preserves: natural document scrolling outside that breakpoint

- [ ] **Step 1: Write failing layout-contract tests**

Replace tests for `.trainer-roster-card` and standalone `#root > main[data-booting]` selectors with:

```ts
expect(globalStyles).toMatch(
  /\.trainer-screen\s*{[^}]*display: grid;[^}]*gap:/,
);
expect(globalStyles).toMatch(
  /\.career-pc\s*{[^}]*overflow: hidden;[^}]*background: var\(--ink\);/,
);
expect(globalStyles).not.toMatch(/\.trainer-roster-card\s*{/);
expect(globalStyles).toMatch(
  /@media \(min-width: 90rem\) and \(min-height: 56\.25rem\)\s*{[\s\S]*?\.trainer-screen\s*{[^}]*height: calc\(100dvh - 2rem\);[^}]*grid-template-rows: minmax\(0, 19rem\) minmax\(0, 1fr\);/,
);
expect(globalStyles).toMatch(
  /@media \(min-width: 90rem\) and \(min-height: 56\.25rem\)[\s\S]*?\.career-pc[^}]*min-height: 0;/,
);
```

Add assertions that desktop party cards remain two columns by three rows and use a compact height:

```ts
expect(globalStyles).toMatch(
  /@media \(min-width: 90rem\) and \(min-height: 56\.25rem\)[\s\S]*?\.career-pc [^{]*ul\[aria-label="Career entries"\]\s*{[^}]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/,
);
expect(globalStyles).toMatch(
  /@media \(min-width: 90rem\) and \(min-height: 56\.25rem\)[\s\S]*?\.career-pc [^{]*button\s*{[^}]*min-height: 0;[^}]*height: 6\.75rem;/,
);
```

- [ ] **Step 2: Run the CSS test and verify it fails**

Run:

```bash
npm test -- src/styles/global.test.ts
```

Expected: FAIL because the stylesheet still targets two separate page layouts and has no 1440-by-900 fit contract.

- [ ] **Step 3: Scope party-screen selectors to `.career-pc`**

Mechanically replace structural selectors beginning with `#root > main[data-booting]` with `.career-pc`, then adjust direct-child selectors for the new header:

```css
.career-pc {
  width: 100%;
  min-width: 0;
  overflow: hidden;
  border: 0.5rem solid var(--steel-dark);
  background: var(--ink);
  color: var(--screen-white);
  box-shadow:
    inset 0 0 0 0.25rem var(--steel-light),
    0 0 0 0.25rem var(--steel-light);
  animation: boot 320ms steps(4, end) both;
}

.career-pc__header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  border-bottom: 0.35rem solid var(--steel-dark);
  background: var(--screen-blue);
}
```

Style the `<h2>` as the former party-screen title and style the Sound button as a compact game control. Remove every `.trainer-roster-card` rule.

- [ ] **Step 4: Enlarge the trainer scene inside its square panel**

Use proportional scene geometry:

```css
.trainer-card__walk-viewport {
  aspect-ratio: 1;
}

.trainer-walk-scene {
  position: relative;
  width: 88%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--panel-cyan);
}

.trainer-walk-trainer {
  top: 0;
  right: 2%;
  bottom: 0;
  width: 50%;
  height: 100%;
}

.trainer-walk-strip {
  width: 300%;
  height: 100%;
}
```

Keep Gengar behind the trainer using the Task 2 wrapper and `z-index: 1`; keep the trainer at `z-index: 2`.

- [ ] **Step 5: Add the desktop-fit breakpoint**

Add the exact fit contract:

```css
@media (min-width: 90rem) and (min-height: 56.25rem) {
  #root {
    padding: 1rem;
  }

  .trainer-screen {
    width: min(100%, 78rem);
    height: calc(100dvh - 2rem);
    grid-template-rows: minmax(0, 19rem) minmax(0, 1fr);
    gap: 0.65rem;
  }

  .trainer-card {
    min-height: 0;
    padding: 0.75rem 1rem;
    border-width: 0.4rem;
  }

  .trainer-card > h1 {
    margin-bottom: 0.45rem;
    font-size: 2.25rem;
  }

  .trainer-card__body {
    grid-template-columns: minmax(0, 1fr) 12rem;
    gap: 0.75rem;
  }

  .trainer-card__fields {
    gap: 0.25rem;
  }

  .trainer-card__fields dt,
  .trainer-card__fields dd {
    padding: 0.24rem 0.45rem;
  }

  .trainer-card nav {
    margin-top: 0.45rem;
  }

  .career-pc {
    min-height: 0;
  }

  .career-pc > nav[aria-label="Professional roster"] {
    padding: 0.3rem 0.4rem 0;
  }

  .career-pc > [role="tabpanel"] {
    min-height: 0;
    padding: 0.4rem;
  }

  .career-pc > [role="tabpanel"] > ul[aria-label="Career entries"] {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: repeat(3, minmax(0, 1fr));
    gap: 0.35rem;
    min-height: 0;
  }

  .career-pc
    > [role="tabpanel"]
    > ul[aria-label="Career entries"]
    button {
    min-height: 0;
    height: 6.75rem;
    grid-template-columns: 4.75rem minmax(0, 1fr);
    padding: 0.35rem;
  }

  .career-pc .pixel-sprite {
    width: 4.5rem;
    height: 4.5rem;
  }
}
```

If measured browser overflow remains, reduce internal gaps and decorative padding before changing the 19rem/remaining-row allocation or font sizes.

- [ ] **Step 6: Preserve readable scrolling below the desktop-fit threshold**

Keep `.trainer-screen` height automatic by default. At the existing tablet breakpoint, preserve the two-column roster. At phone widths, preserve the one-column roster and allow the Trainer Card fields, scene, and links to stack. Do not apply `overflow: hidden` to `html`, `body`, `#root`, or `.trainer-screen`.

Remove `.trainer-roster-card` from reduced-motion selector groups and ensure `.career-pc` retains the existing boot-animation opt-out.

- [ ] **Step 7: Run CSS and component tests**

Run:

```bash
npm test -- src/styles/global.test.ts src/profile/TrainerProfile.test.tsx src/pc/CareerPC.test.tsx
```

Expected: PASS.

- [ ] **Step 8: Commit the compact layout**

```bash
git add src/styles/global.css src/styles/global.test.ts
git commit -m "style: fit unified portfolio on desktop"
```

---

### Task 4: Integration Verification and Browser QA

**Files:**
- Modify only if verification exposes a defect in files already listed above.

**Interfaces:**
- Verifies: unified routing, popup behavior, animation, accessibility, responsiveness, and build output

- [ ] **Step 1: Run the complete automated suite**

Run:

```bash
npm test
```

Expected: all tests pass with zero failures.

- [ ] **Step 2: Run the production build**

Run:

```bash
npm run build
```

Expected: TypeScript and Vite complete successfully with exit code 0.

- [ ] **Step 3: Start the local site for browser verification**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

Use the reported local port. Keep the process running only for the QA steps.

- [ ] **Step 4: Verify the 1440-by-900 desktop contract**

At exactly 1440 by 900:

- Open `/`.
- Confirm the page has no vertical scrollbar.
- Confirm the entire Trainer Card, roster heading, tabs, and all six Experience cards are visible.
- Confirm the trainer and Gengar pair occupy most of the square picture panel without clipping.
- Confirm both sprites face right and animate smoothly as a coordinated walk.
- Confirm Gengar remains behind the trainer.

- [ ] **Step 5: Verify unified routes and popup behavior**

At desktop size:

- Select Projects and confirm the URL becomes `/pokemon/projects`.
- Open Remetra and confirm `/pokemon/projects/remetra`.
- Confirm the Trainer Card and roster remain visibly behind the modal backdrop.
- Close with Escape and verify focus returns to Remetra.
- Open `/pokemon/experience/draftkings` directly and verify the unified page and DraftKings popup both reconstruct.
- Open `/pokemon/projects/missing` and verify recovery to `/pokemon/projects` with the accessible status message.
- Confirm Browser Back removes an opened entry segment naturally.

- [ ] **Step 6: Verify keyboard, sound, and reduced motion**

- Navigate both tabs with Left, Right, Home, End, Space, and Enter.
- Navigate party cards with arrow keys and open one with Enter.
- Enable Sound, trigger a tab and card action, and confirm the existing bleeps play.
- Emulate `prefers-reduced-motion: reduce`; confirm trainer, Gengar, party sprites, and entrance animations stop on stable frames.
- Confirm the browser console contains no errors or accessibility warnings.

- [ ] **Step 7: Verify scrolling responsive layouts**

At 768 by 1024 and 320 by 568:

- Confirm normal vertical scrolling is available.
- Confirm the Trainer Card appears before the roster.
- Confirm no horizontal overflow.
- Confirm text, tabs, links, cards, and popup controls remain readable and operable.
- Confirm the trainer and Gengar remain large, pixelated, and contained in their panel.

- [ ] **Step 8: Re-run verification after any QA fix**

If QA required a code change, first add a failing regression test, make the smallest fix, and rerun:

```bash
npm test
npm run build
```

Expected: both commands pass.

- [ ] **Step 9: Commit only verified QA fixes**

If files changed during QA:

```bash
git add <only-the-files-changed-for-the-QA-fix>
git commit -m "fix: polish unified portfolio layout"
```

If no files changed, do not create an empty commit.
