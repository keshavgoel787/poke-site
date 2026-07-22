# Pokémon-Inspired PC Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, accessible portfolio that opens with a recruiter-friendly Trainer Profile and transitions into an original Generation-I-inspired career PC.

**Architecture:** A React + TypeScript + Vite single-page application uses URL routes as shareable navigation state and a typed data module as the only source of portfolio content. Focused components render the profile, PC grid, concise entries, sprites, and quick menu; optional motion and sound remain progressive enhancements.

**Tech Stack:** React, TypeScript, Vite, React Router, Vitest, Testing Library, CSS, SVG pixel sprites

## Global Constraints

- Do not use Pokémon names, characters, sprites, logos, sound recordings, or proprietary interface artwork.
- Use one permanent palette: navy-black outlines/text, warm cream backgrounds, golden yellow highlights, and cartridge red accents.
- Every role and project must remain understandable without knowledge of Pokémon.
- The initial release includes exactly three boxes: Experience, Projects, and Trainer.
- Project entries in the initial release are Breathe Easy and ForgetMeNot.
- Creature entries contain a name, sprite, organization/project, role, dates, one impact statement, one or two skill types, four moves, and at most one relevant external link.
- Sound defaults to off and never autoplays.
- Reduced motion removes boot, cursor-hop, typing, and idle animation without hiding information.
- The app requires no backend and must support direct loading of `/pc/...` URLs.

---

## File Map

- `package.json`: scripts and runtime/test dependencies.
- `vite.config.ts`, `tsconfig*.json`, `index.html`: Vite and TypeScript setup.
- `src/main.tsx`: React entry point and router mount.
- `src/app/App.tsx`: route definitions and invalid-route recovery.
- `src/app/App.test.tsx`: end-to-end component routing tests.
- `src/data/portfolioData.ts`: typed professional and creature content.
- `src/data/portfolioData.test.ts`: content completeness and uniqueness tests.
- `src/navigation/routes.ts`: route parsing and route-building helpers.
- `src/navigation/routes.test.ts`: valid and invalid route tests.
- `src/profile/TrainerProfile.tsx`: immediately scannable landing screen.
- `src/profile/TrainerProfile.test.tsx`: professional-link and PC-entry tests.
- `src/pc/CareerPC.tsx`: active box and entry coordination.
- `src/pc/CreatureGrid.tsx`: keyboard- and pointer-selectable creature grid.
- `src/pc/PokedexEntry.tsx`: concise entry panel.
- `src/pc/QuickMenu.tsx`: profile, résumé, contact, sound, and exit controls.
- `src/pc/PixelSprite.tsx`: original sprite frame rendering.
- `src/pc/CareerPC.test.tsx`: box, selection, keyboard, and fallback tests.
- `src/preferences/usePreferences.ts`: persisted sound and reduced-motion state.
- `src/preferences/usePreferences.test.tsx`: default and persistence tests.
- `src/styles/tokens.css`: palette, typography, spacing, and motion tokens.
- `src/styles/global.css`: base, profile, PC, responsive, and focus styling.
- `public/resume.pdf`: current résumé copied from the approved source.
- `public/_redirects`: SPA fallback for hosts that support Netlify-style redirects.
- `vercel.json`: SPA fallback for Vercel.

---

### Task 1: Establish a Tested React Application

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/app/App.test.tsx`
- Create: `src/test/setup.ts`

**Interfaces:**
- Produces: `App(): JSX.Element`, mounted inside `BrowserRouter`.
- Consumes: none.

- [ ] **Step 1: Create the package manifest and test configuration**

```json
{
  "name": "keshav-career-pc",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "preview": "vite preview"
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "typescript": "latest",
    "react": "latest",
    "react-dom": "latest",
    "react-router-dom": "latest"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@testing-library/user-event": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "jsdom": "latest",
    "vitest": "latest"
  }
}
```

Configure `vite.config.ts` with `react()` and Vitest's `jsdom` environment, `globals: true`, and `setupFiles: './src/test/setup.ts'`. Import `@testing-library/jest-dom/vitest` in the setup file.

- [ ] **Step 2: Install dependencies and preserve the generated lockfile**

Run: `npm install`

Expected: exit code 0 and a new `package-lock.json`.

- [ ] **Step 3: Write the failing application smoke test**

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App } from './App';

it('renders Keshav identity on the root route', () => {
  render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: /keshav goel/i })).toBeVisible();
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npm test -- src/app/App.test.tsx`

Expected: FAIL because `App` does not exist.

- [ ] **Step 5: Implement the minimal root application**

```tsx
export function App() {
  return <main><h1>Keshav Goel</h1></main>;
}
```

Mount `<App />` inside `<BrowserRouter>` in `src/main.tsx` and provide a standard `#root` node in `index.html`.

- [ ] **Step 6: Verify test and production build**

Run: `npm test -- src/app/App.test.tsx && npm run build`

Expected: one passing test and a successful `dist/` build.

- [ ] **Step 7: Commit the foundation**

```bash
git add package.json package-lock.json index.html vite.config.ts tsconfig.json tsconfig.app.json src/main.tsx src/app/App.tsx src/app/App.test.tsx src/test/setup.ts
git commit -m "chore: establish tested portfolio app"
```

### Task 2: Define the Typed Portfolio Content Model

**Files:**
- Create: `src/data/portfolioData.ts`
- Create: `src/data/portfolioData.test.ts`

**Interfaces:**
- Produces: `BoxId`, `CareerEntry`, `CareerBox`, `trainerProfile`, `careerBoxes`, `getBox(boxId)`, and `getEntry(boxId, entryId)`.
- Consumes: none.

- [ ] **Step 1: Write failing content-contract tests**

```ts
import { careerBoxes, getEntry } from './portfolioData';

it('provides exactly the three approved boxes', () => {
  expect(careerBoxes.map((box) => box.id)).toEqual(['experience', 'projects', 'trainer']);
});

it('gives every entry four moves and a unique route id', () => {
  const entries = careerBoxes.flatMap((box) => box.entries);
  expect(new Set(entries.map((entry) => entry.id)).size).toBe(entries.length);
  expect(entries.every((entry) => entry.moves.length === 4)).toBe(true);
});

it('finds an entry by box and id', () => {
  expect(getEntry('experience', 'amazon')?.organization).toBe('Amazon');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/data/portfolioData.test.ts`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement exact types and approved entries**

```ts
export type BoxId = 'experience' | 'projects' | 'trainer';
export type Move = { name: string; skill: string };
export type CareerEntry = {
  id: string;
  creatureName: string;
  organization: string;
  role: string;
  dates: string;
  impact: string;
  types: [string] | [string, string];
  moves: [Move, Move, Move, Move];
  spriteId: string;
  link?: { label: string; href: string };
};
export type CareerBox = { id: BoxId; label: string; entries: CareerEntry[] };
```

Populate Experience with Amazon, DraftKings, ProcureMateAI, Generate, Johnson & Johnson, and VDart; Projects with Breathe Easy and ForgetMeNot; Trainer with Northeastern University, Bhangra, locations, and interests. Use only claims present on the current portfolio or supplied résumé. If dates or impact metrics are unavailable, use accurate qualitative copy rather than inventing values.

Export:

```ts
export const getBox = (boxId: BoxId) => careerBoxes.find((box) => box.id === boxId);
export const getEntry = (boxId: BoxId, entryId: string) =>
  getBox(boxId)?.entries.find((entry) => entry.id === entryId);
```

- [ ] **Step 4: Verify content contracts**

Run: `npm test -- src/data/portfolioData.test.ts`

Expected: all three tests PASS.

- [ ] **Step 5: Commit the content model**

```bash
git add src/data/portfolioData.ts src/data/portfolioData.test.ts
git commit -m "feat: add typed career creature content"
```

### Task 3: Implement Shareable Route State

**Files:**
- Create: `src/navigation/routes.ts`
- Create: `src/navigation/routes.test.ts`
- Modify: `src/app/App.tsx`

**Interfaces:**
- Consumes: `BoxId`, `getBox`, and `getEntry` from `portfolioData`.
- Produces: `pcPath(boxId: BoxId, entryId?: string): string` and `resolvePcRoute(boxId?: string, entryId?: string): PcRouteState`.

- [ ] **Step 1: Write failing route tests**

```ts
expect(pcPath('experience', 'amazon')).toBe('/pc/experience/amazon');
expect(resolvePcRoute('bad-box', 'missing')).toEqual({ boxId: 'experience', entryId: undefined, recovered: true });
expect(resolvePcRoute('projects', 'forgetmenot')).toEqual({ boxId: 'projects', entryId: 'forgetmenot', recovered: false });
```

- [ ] **Step 2: Run the route tests to verify failure**

Run: `npm test -- src/navigation/routes.test.ts`

Expected: FAIL because route helpers do not exist.

- [ ] **Step 3: Implement route construction and nearest-valid recovery**

```ts
export type PcRouteState = { boxId: BoxId; entryId?: string; recovered: boolean };

export const pcPath = (boxId: BoxId, entryId?: string) =>
  entryId ? `/pc/${boxId}/${entryId}` : `/pc/${boxId}`;

export function resolvePcRoute(boxId?: string, entryId?: string): PcRouteState {
  const box = careerBoxes.find((item) => item.id === boxId) ?? careerBoxes[0];
  const entry = box.entries.find((item) => item.id === entryId);
  return { boxId: box.id, entryId: entry?.id, recovered: box.id !== boxId || (!!entryId && !entry) };
}
```

- [ ] **Step 4: Define application routes**

Use `<Routes>` with `/`, `/pc/:boxId`, `/pc/:boxId/:entryId`, and a catch-all route that redirects to `/`. The PC route renders `CareerPC` in Task 5; use an explicit temporary `<div>Keshav's PC</div>` until then.

- [ ] **Step 5: Verify routes and commit**

Run: `npm test -- src/navigation/routes.test.ts src/app/App.test.tsx`

Expected: all route and smoke tests PASS.

```bash
git add src/navigation/routes.ts src/navigation/routes.test.ts src/app/App.tsx src/app/App.test.tsx
git commit -m "feat: add shareable portfolio routes"
```

### Task 4: Build the Recruiter-Friendly Trainer Profile

**Files:**
- Create: `src/profile/TrainerProfile.tsx`
- Create: `src/profile/TrainerProfile.test.tsx`
- Modify: `src/app/App.tsx`

**Interfaces:**
- Consumes: `trainerProfile` and `pcPath('experience')`.
- Produces: `TrainerProfile(): JSX.Element`.

- [ ] **Step 1: Write the failing profile test**

```tsx
render(<MemoryRouter><TrainerProfile /></MemoryRouter>);
expect(screen.getByText(/data, ml, and ai/i)).toBeVisible();
expect(screen.getByRole('link', { name: /résumé/i })).toHaveAttribute('href', '/resume.pdf');
expect(screen.getByRole('link', { name: /open keshav's pc/i })).toHaveAttribute('href', '/pc/experience');
expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute('href', expect.stringContaining('github.com'));
```

- [ ] **Step 2: Verify the test fails**

Run: `npm test -- src/profile/TrainerProfile.test.tsx`

Expected: FAIL because `TrainerProfile` does not exist.

- [ ] **Step 3: Implement semantic profile markup**

Use `<header>`, `<main>`, `<nav aria-label="Professional links">`, and descriptive links. Show the positioning statement and a compact list of highest-signal roles before the PC action. Do not gate résumé, contact, GitHub, or LinkedIn behind JavaScript-only controls.

- [ ] **Step 4: Replace the root placeholder and verify**

Run: `npm test -- src/profile/TrainerProfile.test.tsx src/app/App.test.tsx`

Expected: all profile and application tests PASS.

- [ ] **Step 5: Commit the profile**

```bash
git add src/profile/TrainerProfile.tsx src/profile/TrainerProfile.test.tsx src/app/App.tsx
git commit -m "feat: add trainer profile landing screen"
```

### Task 5: Build the Career PC, Grid, and Concise Entry

**Files:**
- Create: `src/pc/CareerPC.tsx`
- Create: `src/pc/CreatureGrid.tsx`
- Create: `src/pc/PokedexEntry.tsx`
- Create: `src/pc/CareerPC.test.tsx`
- Modify: `src/app/App.tsx`

**Interfaces:**
- Consumes: `CareerBox`, `CareerEntry`, `resolvePcRoute`, `pcPath`.
- Produces: `CareerPC()`, `CreatureGrid({ entries, selectedId, onSelect })`, and `PokedexEntry({ entry })`.

- [ ] **Step 1: Write failing PC interaction tests**

```tsx
render(<MemoryRouter initialEntries={['/pc/experience/amazon']}><Routes><Route path="/pc/:boxId/:entryId" element={<CareerPC />} /></Routes></MemoryRouter>);
expect(screen.getByRole('tab', { name: /experience/i })).toHaveAttribute('aria-selected', 'true');
expect(screen.getByRole('heading', { name: /amazon/i })).toBeVisible();
expect(screen.getAllByRole('listitem', { name: /move:/i })).toHaveLength(4);
```

Add a second test that clicks the Projects tab and expects the route to become `/pc/projects`, plus a keyboard test that focuses a grid item, presses `ArrowRight`, and verifies focus moves to the next item.

- [ ] **Step 2: Verify the tests fail**

Run: `npm test -- src/pc/CareerPC.test.tsx`

Expected: FAIL because the PC components do not exist.

- [ ] **Step 3: Implement the concise entry panel**

Render organization/project as the heading, then role, dates, impact, type labels, and exactly four moves. Render the optional external link only when `entry.link` exists. Give the entry panel `aria-live="polite"` so pointer selection changes are announced.

- [ ] **Step 4: Implement an accessible selectable grid**

Use native `<button>` elements in a list. Apply roving `tabIndex` (`0` for selected, `-1` for peers), `aria-pressed`, and `aria-label={`${entry.creatureName}: ${entry.organization}`}`. Arrow keys move within the grid; Enter or Space navigates to `pcPath(boxId, entry.id)`.

- [ ] **Step 5: Implement box tabs and route recovery**

Use links with `role="tab"`, `aria-selected`, and routes generated by `pcPath`. When `resolvePcRoute` returns `recovered: true`, navigate with `replace: true` to the returned valid route and render the message `That PC entry could not be found. Showing Box 1.` in a status region.

- [ ] **Step 6: Verify PC behavior**

Run: `npm test -- src/pc/CareerPC.test.tsx src/navigation/routes.test.ts`

Expected: all PC and navigation tests PASS.

- [ ] **Step 7: Commit the playable information architecture**

```bash
git add src/pc src/app/App.tsx
git commit -m "feat: add interactive career pc"
```

### Task 6: Add Quick Menu, Preferences, and Motion Controls

**Files:**
- Create: `src/pc/QuickMenu.tsx`
- Create: `src/preferences/usePreferences.ts`
- Create: `src/preferences/usePreferences.test.tsx`
- Modify: `src/pc/CareerPC.tsx`
- Modify: `src/pc/CareerPC.test.tsx`

**Interfaces:**
- Produces: `usePreferences(): { soundEnabled: boolean; setSoundEnabled(value: boolean): void; reducedMotion: boolean }`.
- Consumes: `usePreferences` in `CareerPC` and `QuickMenu`.

- [ ] **Step 1: Write failing preference tests**

```tsx
const { result } = renderHook(() => usePreferences());
expect(result.current.soundEnabled).toBe(false);
act(() => result.current.setSoundEnabled(true));
expect(localStorage.getItem('career-pc:sound')).toBe('on');
```

Mock `matchMedia('(prefers-reduced-motion: reduce)')` and assert `reducedMotion` is true in a separate test.

- [ ] **Step 2: Verify preference tests fail**

Run: `npm test -- src/preferences/usePreferences.test.tsx`

Expected: FAIL because the hook does not exist.

- [ ] **Step 3: Implement preferences**

Initialize sound from `localStorage`, defaulting to false. Read reduced motion from `window.matchMedia` and subscribe to its `change` event. Store only `on` or `off`; do not store navigation progress.

- [ ] **Step 4: Add and test the quick menu**

Render native links for Profile (`/`), Résumé (`/resume.pdf`), Contact (`mailto:`), and Exit PC (`/`). Render sound as a button with `aria-pressed={soundEnabled}`. Add an interaction test proving Sound begins off and changes to on only after a click.

- [ ] **Step 5: Add progressive motion classes**

Set `data-reduced-motion={reducedMotion}` and `data-booting` on the PC root. CSS in Task 8 will animate only when reduced motion is false. Dialogue content must be present in the DOM immediately even if a visual reveal effect is active.

- [ ] **Step 6: Verify and commit**

Run: `npm test -- src/preferences/usePreferences.test.tsx src/pc/CareerPC.test.tsx`

Expected: all preference and menu tests PASS.

```bash
git add src/preferences src/pc/QuickMenu.tsx src/pc/CareerPC.tsx src/pc/CareerPC.test.tsx
git commit -m "feat: add pc quick menu and preferences"
```

### Task 7: Create Original Pixel Sprites with Fallbacks

**Files:**
- Create: `src/pc/PixelSprite.tsx`
- Create: `src/pc/PixelSprite.test.tsx`
- Create: `src/assets/sprites/*.svg`
- Modify: `src/pc/CreatureGrid.tsx`
- Modify: `src/pc/PokedexEntry.tsx`

**Interfaces:**
- Produces: `PixelSprite({ spriteId, label, animate }): JSX.Element`.
- Consumes: `spriteId` from `CareerEntry`.

- [ ] **Step 1: Write failing sprite and fallback tests**

```tsx
render(<PixelSprite spriteId="bytebolt" label="Bytebolt" animate />);
expect(screen.getByRole('img', { name: 'Bytebolt' })).toBeVisible();

render(<PixelSprite spriteId="missing" label="Unknown creature" animate={false} />);
expect(screen.getByText('Unknown creature')).toBeVisible();
```

- [ ] **Step 2: Verify sprite tests fail**

Run: `npm test -- src/pc/PixelSprite.test.tsx`

Expected: FAIL because `PixelSprite` does not exist.

- [ ] **Step 3: Implement a closed sprite registry**

```ts
const sprites: Record<string, { frameA: string; frameB?: string }> = {
  bytebolt: { frameA: byteboltA, frameB: byteboltB }
};
```

Use imported local SVGs only. If the key is absent, render a bordered pixel placeholder containing the readable label. Do not form an asset URL from unchecked input.

- [ ] **Step 4: Draw and integrate original sprite assets**

Create one or two crisp-edged SVG frames for every entry in `careerBoxes`. Use only the four global palette colors, integer coordinates, and `shape-rendering="crispEdges"`. Confirm every silhouette is original and contains no franchise marks.

- [ ] **Step 5: Verify all data sprite IDs resolve**

Add a parameterized test that iterates through every `careerBoxes` entry and asserts its sprite renders without the fallback label.

Run: `npm test -- src/pc/PixelSprite.test.tsx src/data/portfolioData.test.ts`

Expected: all sprite and content tests PASS.

- [ ] **Step 6: Commit original artwork**

```bash
git add src/pc/PixelSprite.tsx src/pc/PixelSprite.test.tsx src/pc/CreatureGrid.tsx src/pc/PokedexEntry.tsx src/assets/sprites
git commit -m "feat: add original career creature sprites"
```

### Task 8: Apply the Kanto-Red Responsive Visual System

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Modify: `src/main.tsx`
- Modify: `index.html`

**Interfaces:**
- Consumes: component class names and PC state data attributes.
- Produces: responsive profile/PC layout, focus states, pixel rendering, and motion rules.

- [ ] **Step 1: Add exact shared tokens**

```css
:root {
  --ink: #172032;
  --cream: #fff4da;
  --gold: #ffd56b;
  --red: #d44532;
  --focus: #2459c4;
  --pixel-border: 3px;
  color: var(--ink);
  background: var(--cream);
}
```

Use `image-rendering: pixelated` on sprites. Keep body copy at or above `16px`; pixel labels may be smaller only when they remain legible.

- [ ] **Step 2: Style visible focus and selected states**

Use a high-contrast focus outline independent of the red selected state. Never remove native focus without supplying a stronger replacement. Pair selected color with cursor shape, `aria-pressed`, and visible text.

- [ ] **Step 3: Implement desktop and mobile composition**

At `min-width: 768px`, place the creature grid and entry panel in adjacent columns. Below `768px`, stack the grid above the entry and keep every interactive target at least `44px` in each dimension. Avoid horizontal scrolling at `320px` width.

- [ ] **Step 4: Implement restrained animation and reduced-motion overrides**

Define boot, cursor-hop, dialogue-reveal, and two-frame sprite animations. Under `@media (prefers-reduced-motion: reduce)` and `[data-reduced-motion="true"]`, set animation and transition durations to `0.01ms` and show complete dialogue immediately.

- [ ] **Step 5: Verify build and keyboard flow**

Run: `npm test && npm run build`

Expected: all tests PASS and TypeScript/Vite build succeeds.

Manually verify at widths 320, 768, and 1440 pixels: no clipped controls; profile links are visible; PC grid precedes details on mobile; focus is visible throughout.

- [ ] **Step 6: Commit the visual system**

```bash
git add src/styles src/main.tsx index.html
git commit -m "feat: apply responsive gen one visual system"
```

### Task 9: Configure Static Deployment and Final Verification

**Files:**
- Create: `public/_redirects`
- Create: `vercel.json`
- Create: `public/resume.pdf`
- Modify: `src/app/App.test.tsx`
- Create: `README.md`

**Interfaces:**
- Consumes: built SPA routes and approved résumé artifact.
- Produces: direct-route hosting fallback and deployment documentation.

- [ ] **Step 1: Add direct-route configuration**

`public/_redirects`:

```text
/* /index.html 200
```

`vercel.json`:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

- [ ] **Step 2: Add a valid deep-link application test**

Render `App` at `/pc/projects/forgetmenot`; assert the Projects tab is selected and the ForgetMeNot entry is visible. Render at `/pc/projects/missing`; assert the recovery message and Projects box are visible.

- [ ] **Step 3: Add the approved résumé and verify all links**

Copy the current résumé to `public/resume.pdf`. Check every external URL and email from `portfolioData` with a script or manual HEAD request; correct redirects or dead links before committing. Do not infer or invent replacement destinations.

- [ ] **Step 4: Document local and deployment commands**

README must include:

```text
npm install
npm run dev
npm test
npm run build
npm run preview
```

State that the host must rewrite application routes to `/index.html` and that DNS for `keshavgoel.dev` is changed only during the deployment step approved by the user.

- [ ] **Step 5: Run final automated verification**

Run: `npm test && npm run build`

Expected: all tests PASS, TypeScript reports no errors, and `dist/` contains `index.html`, `_redirects`, and `resume.pdf`.

- [ ] **Step 6: Run final manual verification**

Verify root and deep-link loads, keyboard-only navigation, sound default off, sound persistence after opt-in, reduced-motion behavior, 320/768/1440 layouts, missing-sprite fallback, résumé download, email link, GitHub, LinkedIn, and every creature entry.

- [ ] **Step 7: Commit the deployable portfolio**

```bash
git add public/_redirects public/resume.pdf vercel.json src/app/App.test.tsx README.md
git commit -m "chore: prepare portfolio deployment"
```
