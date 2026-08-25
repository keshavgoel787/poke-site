# Interests Roster Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a third, non-interactive Interests roster containing six animated classic-style pixel mascots.

**Architecture:** Extend the existing typed roster and canonical route resolver with an `interests` tab. Reuse the current roster grid in a new informational rendering mode, while keeping Experience and Project entries interactive. Register six two-frame SVG pairs through the existing `PixelSprite` asset map.

**Tech Stack:** React 19, TypeScript, React Router, Vitest, Testing Library, CSS, rectangle-only SVG

**Spec:** `docs/superpowers/specs/2026-08-25-interests-roster-design.md`

## Global Constraints

- Interest detail popups, photos, external links, long-form descriptions, and music playback are out of scope.
- The roster contains exactly Bhangra, Sigma Beta Rho, Games & Collecting, Hiking, Music, and Food Explorer.
- Interest cards are informational and must not expose button, pressed, or dialog behavior.
- Every new sprite uses a `0 0 32 32` view box, `shape-rendering="crispEdges"`, rectangle-only even-numbered geometry, and the approved palette from `revisedPalette.test.ts`.
- Every sprite has two object-specific frames and honors the existing reduced-motion behavior.
- Preserve all Experience and Project routing, card interaction, sound, focus restoration, and popup behavior.
- Do not add dependencies.
- Leave `.DS_Store` untracked and uncommitted.

---

### Task 1: Add the typed Interests roster and canonical route

**Files:**
- Modify: `src/data/portfolioData.ts`
- Modify: `src/data/portfolioData.test.ts`
- Modify: `src/navigation/routes.ts`
- Modify: `src/navigation/routes.test.ts`

**Interfaces:**
- Produces: `RosterTab = 'experience' | 'projects' | 'interests'`
- Produces: `CareerEntry.category` accepting `'Interest'`
- Produces: `getRoster('interests')` with exactly six entries
- Produces: `pokemonPath('interests') === '/pokemon/interests'`
- Produces: `resolvePokemonRoute('interests', entryId)` recovering to the tab without retaining an entry ID

- [ ] **Step 1: Write failing data tests**

Update the approved-roster assertion and add an exact Interest-content assertion:

```ts
expect(rosterTabs.map((tab) => tab.id)).toEqual(['experience', 'projects', 'interests']);

const interests = rosterTabs[2].entries;
expect(interests.map(({ creatureName, role, cardMetadata, category, spriteId }) => ({
  creatureName,
  role,
  cardMetadata,
  category,
  spriteId,
}))).toEqual([
  { creatureName: 'Bhangra', role: 'Captain', cardMetadata: 'Dance · Performance', category: 'Interest', spriteId: 'bhangra' },
  { creatureName: 'Sigma Beta Rho', role: 'Fundraising & Academic Lead', cardMetadata: 'Leadership · Community', category: 'Interest', spriteId: 'sigma-beta-rho' },
  { creatureName: 'Games & Collecting', role: 'Pokémon · Destiny 2 · League', cardMetadata: 'Cards · Games', category: 'Interest', spriteId: 'games-collecting' },
  { creatureName: 'Hiking', role: 'Trails & outdoors', cardMetadata: 'Explore · Recharge', category: 'Interest', spriteId: 'hiking' },
  { creatureName: 'Music', role: 'House & R&B', cardMetadata: 'Listen · Discover', category: 'Interest', spriteId: 'music' },
  { creatureName: 'Food Explorer', role: 'Restaurants & cuisines', cardMetadata: 'Taste · Explore', category: 'Interest', spriteId: 'food-explorer' },
]);
```

Exclude Interest entries from the professional source-verification loop by deriving `professionalEntries` from the first two tabs rather than `visibleEntries()`.

- [ ] **Step 2: Write failing route tests**

```ts
expect(pokemonPath('interests')).toBe('/pokemon/interests');
expect(resolvePokemonRoute('interests')).toEqual({
  tab: 'interests',
  entryId: undefined,
  recovered: false,
});
expect(resolvePokemonRoute('interests', 'bhangra')).toEqual({
  tab: 'interests',
  entryId: undefined,
  recovered: true,
});
```

Keep `legacyPcPath('trainer', 'interests') === '/'`; this is a legacy trainer route, not the new canonical tab route.

- [ ] **Step 3: Run tests and verify RED**

Run:

```bash
npm test -- --run src/data/portfolioData.test.ts src/navigation/routes.test.ts
```

Expected: type-check/expectation failures because `interests` is not a roster tab and no Interest data exists.

- [ ] **Step 4: Implement the data model and roster**

Change the unions:

```ts
export type RosterTab = 'experience' | 'projects' | 'interests';

// Within CareerEntry
category: 'Experience' | 'Project' | 'Interest';
```

Append this roster to `rosterTabs`, using `moves: []`, concise non-academic copy, and no `dates`, `location`, or `link`:

```ts
{
  id: 'interests',
  label: 'Interests',
  entries: [
    { id: 'bhangra', creatureName: 'Bhangra', organization: 'Bhangra', role: 'Captain', category: 'Interest', cardMetadata: 'Dance · Performance', highlight: '', professionalType: 'Interest', moves: [], spriteId: 'bhangra' },
    { id: 'sigma-beta-rho', creatureName: 'Sigma Beta Rho', organization: 'Sigma Beta Rho', role: 'Fundraising & Academic Lead', category: 'Interest', cardMetadata: 'Leadership · Community', highlight: '', professionalType: 'Interest', moves: [], spriteId: 'sigma-beta-rho' },
    { id: 'games-collecting', creatureName: 'Games & Collecting', organization: 'Games & Collecting', role: 'Pokémon · Destiny 2 · League', category: 'Interest', cardMetadata: 'Cards · Games', highlight: '', professionalType: 'Interest', moves: [], spriteId: 'games-collecting' },
    { id: 'hiking', creatureName: 'Hiking', organization: 'Hiking', role: 'Trails & outdoors', category: 'Interest', cardMetadata: 'Explore · Recharge', highlight: '', professionalType: 'Interest', moves: [], spriteId: 'hiking' },
    { id: 'music', creatureName: 'Music', organization: 'Music', role: 'House & R&B', category: 'Interest', cardMetadata: 'Listen · Discover', highlight: '', professionalType: 'Interest', moves: [], spriteId: 'music' },
    { id: 'food-explorer', creatureName: 'Food Explorer', organization: 'Food Explorer', role: 'Restaurants & cuisines', category: 'Interest', cardMetadata: 'Taste · Explore', highlight: '', professionalType: 'Interest', moves: [], spriteId: 'food-explorer' },
  ],
}
```

In `resolvePokemonRoute`, prevent Interest detail routes from resolving an entry:

```ts
const entry = roster.id === 'interests'
  ? undefined
  : roster.entries.find((item) => item.id === entryId);
```

- [ ] **Step 5: Run tests and verify GREEN**

Run:

```bash
npm test -- --run src/data/portfolioData.test.ts src/navigation/routes.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/data/portfolioData.ts src/data/portfolioData.test.ts src/navigation/routes.ts src/navigation/routes.test.ts
git commit -m "feat: add interests roster data"
```

---

### Task 2: Render Interest cards as non-interactive roster content

**Files:**
- Modify: `src/pc/CreatureGrid.tsx`
- Modify: `src/pc/CareerPC.tsx`
- Modify: `src/pc/CareerPC.test.tsx`

**Interfaces:**
- Consumes: `CareerEntry.category === 'Interest'`
- Produces: `CreatureGrid` prop `interactive?: boolean`, defaulting to `true`
- Produces: six Interest list items with animated sprites and no buttons

- [ ] **Step 1: Write the failing component test**

```ts
it('shows six informational Interest cards without opening professional dialogs', async () => {
  const user = userEvent.setup();
  renderCareerPC('/pokemon/experience');

  expect(screen.getAllByRole('tab')).toHaveLength(3);
  await user.click(screen.getByRole('tab', { name: 'Interests' }));

  expect(screen.getByTestId('current-route')).toHaveTextContent('/pokemon/interests');
  const list = screen.getByRole('list', { name: 'Interest entries' });
  expect(within(list).getAllByRole('listitem')).toHaveLength(6);
  expect(within(list).queryByRole('button')).not.toBeInTheDocument();
  expect(screen.getByText('Fundraising & Academic Lead')).toBeVisible();
  expect(screen.getByText('Pokémon · Destiny 2 · League')).toBeVisible();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
```

Update tab-navigation expectations so `End` focuses Interests, `ArrowLeft` from Experience wraps to Interests, and `ArrowRight` from Interests wraps to Experience.

- [ ] **Step 2: Run the test and verify RED**

```bash
npm test -- --run src/pc/CareerPC.test.tsx
```

Expected: FAIL because the tab and informational rendering mode do not exist.

- [ ] **Step 3: Implement informational rendering**

Change the props:

```ts
type CreatureGridProps = {
  entries: CareerEntry[];
  selectedId?: string;
  onSelect?: (entryId: string) => void;
  interactive?: boolean;
  ariaLabel?: string;
};
```

For `interactive === false`, render each card body in a `<div className="party-card party-card--informational">` inside its `<li>` and omit `aria-pressed`, `tabIndex`, click handlers, completion affordance, and hidden completion description. Extract the repeated sprite/name/role/metadata markup into a local `CardContents` function so professional buttons retain identical output.

In `CareerPC`:

```tsx
const interestsActive = box.id === 'interests';

<CreatureGrid
  entries={box.entries}
  selectedId={interestsActive ? undefined : selectedCardId}
  onSelect={interestsActive ? undefined : selectEntry}
  interactive={!interestsActive}
  ariaLabel={interestsActive ? 'Interest entries' : 'Career entries'}
/>
```

Also ensure `selectedEntry` is always undefined for Interests and no default Interest card is treated as selected.

- [ ] **Step 4: Run tests and verify GREEN**

```bash
npm test -- --run src/pc/CareerPC.test.tsx
```

Expected: PASS, including all existing professional popup and focus tests.

- [ ] **Step 5: Commit**

```bash
git add src/pc/CreatureGrid.tsx src/pc/CareerPC.tsx src/pc/CareerPC.test.tsx
git commit -m "feat: render informational interest cards"
```

---

### Task 3: Create and register the six animated sprite pairs

**Files:**
- Create: `src/assets/sprites/sigma-beta-rho-a.svg`
- Create: `src/assets/sprites/sigma-beta-rho-b.svg`
- Create: `src/assets/sprites/games-collecting-a.svg`
- Create: `src/assets/sprites/games-collecting-b.svg`
- Create: `src/assets/sprites/hiking-a.svg`
- Create: `src/assets/sprites/hiking-b.svg`
- Create: `src/assets/sprites/music-a.svg`
- Create: `src/assets/sprites/music-b.svg`
- Create: `src/assets/sprites/food-explorer-a.svg`
- Create: `src/assets/sprites/food-explorer-b.svg`
- Modify: `src/assets/sprites/bhangra-a.svg`
- Modify: `src/assets/sprites/bhangra-b.svg`
- Modify: `src/assets/sprites/revisedPalette.test.ts`
- Modify: `src/pc/PixelSprite.tsx`
- Modify: `src/pc/PixelSprite.test.tsx`

**Interfaces:**
- Consumes: sprite IDs from Task 1
- Produces: registered frame pairs for `bhangra`, `sigma-beta-rho`, `games-collecting`, `hiking`, `music`, and `food-explorer`

- [ ] **Step 1: Write failing sprite registration tests**

Add all six sprite IDs to the `PixelSprite` test table and assert each renders two images when `animate` is true:

```ts
it.each(['bhangra', 'sigma-beta-rho', 'games-collecting', 'hiking', 'music', 'food-explorer'])(
  'renders two animation frames for %s',
  (spriteId) => {
    render(<PixelSprite spriteId={spriteId} label={spriteId} animate />);
    expect(screen.getByRole('img', { name: spriteId }).querySelectorAll('img')).toHaveLength(2);
  },
);
```

Extend `spritePairs` in `revisedPalette.test.ts` with the six Interest pairs so the existing palette, geometry, and distinct-frame tests exercise every new SVG.

- [ ] **Step 2: Run tests and verify RED**

```bash
npm test -- --run src/pc/PixelSprite.test.tsx src/assets/sprites/revisedPalette.test.ts
```

Expected: missing-module or fallback/frame-count failures for the five new sprite IDs.

- [ ] **Step 3: Draw the two-frame sprites**

Use the shared SVG shell:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">
  <!-- rectangle groups only; every x/y/width/height value is an even integer -->
</svg>
```

Implement these explicit silhouettes and frame changes:

| Sprite | Frame A silhouette | Frame B change | Main colors |
|---|---|---|---|
| Bhangra | head at `(12,4,8,8)`, torso `(10,12,12,10)`, arms raised left/lowered right, legs `(10,22,4,6)` and `(18,22,4,6)` | swap arm heights | `#172032`, `#c74632`, `#ffd56b`, `#fff4da` |
| King cobra | hood `(6,8,20,12)`, face `(10,8,12,10)`, coiled body `(10,20,12,8)`, two dot eyes and forked tongue | hood narrows to `(8,8,16,12)` and tongue retracts | `#172032`, `#35d34a`, `#ffd56b`, `#c74632` |
| Games & Collecting | card body `(6,6,12,20)`, controller/body `(16,12,12,12)`, dot eyes, two controller buttons | card tilts by stepping top/bottom rectangles right 2px and controller buttons swap colors | `#172032`, `#2877c8`, `#c74632`, `#ffd56b`, `#fff4da` |
| Hiking | boot sole `(6,24,22,4)`, boot body stepped from `(8,8)` to `(20,24)`, lace pixels | heel lifts 2px and toe extends 2px | `#172032`, `#c74632`, `#ffd56b`, `#fff4da` |
| Music | headphones arch built from `(6,6,20,4)`, side cups, face/body `(10,10,12,14)`, three equalizer bars | equalizer bar heights change rather than translating the mascot | `#172032`, `#2877c8`, `#5596df`, `#c74632`, `#fff4da` |
| Food Explorer | bowl rim `(6,14,20,4)`, stepped bowl `(8,18,16,8)`, face, two steam columns | steam columns change height/position while bowl remains fixed | `#172032`, `#c74632`, `#f28c28`, `#ffd56b`, `#fff4da` |

Use layering order—outline first, fills second, face/details last—to keep silhouettes clean. Do not use paths, transforms, curves, strokes, odd coordinates, or CSS animation inside the SVG.

- [ ] **Step 4: Register the assets**

Import each new pair in `PixelSprite.tsx` and add exact map entries:

```ts
'sigma-beta-rho': { frameA: sigmaBetaRhoA, frameB: sigmaBetaRhoB },
'games-collecting': { frameA: gamesCollectingA, frameB: gamesCollectingB },
hiking: { frameA: hikingA, frameB: hikingB },
music: { frameA: musicA, frameB: musicB },
'food-explorer': { frameA: foodExplorerA, frameB: foodExplorerB },
```

Keep the existing `bhangra` registration and replace its legacy frame artwork with the new dancer geometry.

- [ ] **Step 5: Run sprite tests and verify GREEN**

```bash
npm test -- --run src/pc/PixelSprite.test.tsx src/assets/sprites/revisedPalette.test.ts
```

Expected: PASS with distinct two-frame, palette-safe, even-grid assets.

- [ ] **Step 6: Commit**

```bash
git add src/assets/sprites src/pc/PixelSprite.tsx src/pc/PixelSprite.test.tsx
git commit -m "feat: add animated interest sprites"
```

---

### Task 4: Fit the third tab and informational cards into the visual system

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/styles/global.test.ts`

**Interfaces:**
- Consumes: `.party-card--informational` from Task 2
- Produces: three equal-width roster tabs and informational cards matching professional-card geometry

- [ ] **Step 1: Write failing style-contract tests**

Add assertions that the stylesheet contains:

```ts
expect(globalCss).toMatch(/\[role="tablist"\][\s\S]*grid-template-columns:\s*repeat\(3,/);
expect(globalCss).toContain('.party-card--informational');
expect(globalCss).toMatch(/\.party-card--informational[\s\S]*cursor:\s*default/);
```

- [ ] **Step 2: Run the test and verify RED**

```bash
npm test -- --run src/styles/global.test.ts
```

Expected: FAIL because the tablist still uses two columns and the informational class has no rules.

- [ ] **Step 3: Implement the CSS**

Change the desktop and compact tablist declarations from `repeat(2, minmax(0, 1fr))` to `repeat(3, minmax(0, 1fr))`.

Make the informational wrapper participate in the same existing card layout selectors as the button. Add only these behavior overrides:

```css
.party-card--informational {
  cursor: default;
}

.party-card--informational:hover,
.party-card--informational:focus-within {
  transform: none;
}
```

Do not add a completion bar or selected-card arrow to informational entries.

- [ ] **Step 4: Run the style and component tests**

```bash
npm test -- --run src/styles/global.test.ts src/pc/CareerPC.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css src/styles/global.test.ts
git commit -m "style: fit interests into roster layout"
```

---

### Task 5: Complete regression and visual verification

**Files:**
- Modify only files from Tasks 1–4 if verification reveals a scoped defect

**Interfaces:**
- Verifies the complete Interests roster without broadening scope

- [ ] **Step 1: Run the complete automated suite**

```bash
npm test -- --run
npm run build
git diff --check
```

Expected: all tests pass, Vite production build succeeds, and no whitespace errors are reported.

- [ ] **Step 2: Run the local site and verify desktop behavior**

```bash
npm run dev -- --host 127.0.0.1
```

Using the in-app browser at the emitted local URL, verify:

1. Experience, Projects, and Interests tabs are equal-width and remain within the PC border.
2. Interests shows six cards in two columns and three rows without desktop scrolling at the supported viewport.
3. All six sprites animate with distinct motions and retain crisp nearest-neighbor pixels.
4. Interest cards show no pointer cursor, pressed state, selection arrow, completion bar, or dialog on click.
5. Experience and Project cards still open same-screen dialogs.
6. Arrow, Home, End, Space, and Enter behavior remains correct across all three tabs.
7. Reduced-motion mode shows one stable frame.

- [ ] **Step 3: Verify the small-screen fallback**

At a viewport below `1440×900`, verify that the existing page scrolling remains enabled and no content is clipped horizontally.

- [ ] **Step 4: Inspect the final worktree**

```bash
git status --short
git log --oneline -5
```

Expected: only `.DS_Store` may remain untracked; implementation files are committed in the four scoped commits above.

