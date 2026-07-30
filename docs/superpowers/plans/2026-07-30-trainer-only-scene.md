# Trainer-Only Scene Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove Gengar from the Trainer Card, center and enlarge Keshav's walking sprite, verify the pending palette corrections, and push the completed `main` branch.

**Architecture:** Simplify `TrainerWalkScene` to one required trainer asset and one failure path. Remove all companion-only assets and CSS, then adjust the trainer crop geometry within the existing square scene. Preserve the unified page, roster, routes, popups, sound, and responsive layout.

**Tech Stack:** React, TypeScript, CSS, Vitest, Testing Library, Vite, SVG/PNG pixel assets.

## Global Constraints

- The scene accessible label is exactly `Keshav walking`.
- Preserve the existing three-frame trainer strip, right-facing orientation, pixel rendering, animation, and reduced-motion behavior.
- Remove every Gengar asset, prop, markup node, animation rule, keyframe, and test.
- Preserve the 1440×900 no-scroll desktop layout and scrollable tablet/mobile layouts.
- Include only the five existing palette corrections plus trainer-only implementation files.
- All commits must retain Keshav Goel as author.
- Do not deploy or change DNS.

---

### Task 1: Trainer-Only Scene and Companion Cleanup

**Files:**
- Modify: `src/profile/TrainerWalkScene.tsx`
- Modify: `src/profile/TrainerWalkScene.test.tsx`
- Modify: `src/profile/TrainerProfile.tsx`
- Modify: `src/profile/TrainerProfile.test.tsx`
- Modify: `src/styles/global.css`
- Modify: `src/styles/global.test.ts`
- Delete: `public/gengar-walk.svg`
- Delete: `src/profile/gengarWalkAsset.test.ts`

**Interfaces:**
- Produces: `TrainerWalkScene({ trainerSrc, label })`
- Removes: `companionSrc`
- Preserves: accessible all-or-nothing trainer failure fallback

- [ ] **Step 1: Write failing trainer-only tests**

Update the scene helper:

```tsx
const renderScene = () =>
  render(
    <TrainerWalkScene
      trainerSrc="/trainer-walk.png"
      label="Keshav walking"
    />,
  );
```

Assert the trainer exists and the companion does not:

```ts
expect(screen.getByRole('img', { name: 'Keshav walking' })).toBeVisible();
expect(screen.getByTestId('trainer-walk-strip')).toHaveAttribute(
  'src',
  '/trainer-walk.png',
);
expect(screen.queryByTestId('trainer-companion')).not.toBeInTheDocument();
```

Retain the trainer-source error test and expect `Keshav walking unavailable`.

Update `TrainerProfile.test.tsx` to require the new label and absence of `trainer-companion`.

In `global.test.ts`, assert:

```ts
expect(globalStyles).not.toMatch(/trainer-walk-companion/);
expect(globalStyles).not.toMatch(/gengar-walk-cycle/);
expect(globalStyles).toMatch(
  /\.trainer-walk-trainer\s*{[^}]*left: 50%;[^}]*width: 66\.6667%;[^}]*transform: translateX\(-50%\);/,
);
```

Remove the obsolete Gengar asset test.

- [ ] **Step 2: Run tests and verify RED**

```bash
npm test -- src/profile/TrainerWalkScene.test.tsx src/profile/TrainerProfile.test.tsx src/styles/global.test.ts
```

Expected: FAIL because the companion prop, markup, label, and CSS still exist.

- [ ] **Step 3: Simplify the component**

Change the prop type and markup:

```tsx
type TrainerWalkSceneProps = {
  trainerSrc: string;
  label: string;
};

export function TrainerWalkScene({
  trainerSrc,
  label,
}: TrainerWalkSceneProps): JSX.Element {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div role="img" aria-label={`${label} unavailable`}>
        {label}
      </div>
    );
  }

  return (
    <div className="trainer-walk-scene" role="img" aria-label={label}>
      <div className="trainer-walk-trainer">
        <img
          data-testid="trainer-walk-strip"
          className="trainer-walk-strip"
          src={trainerSrc}
          alt=""
          onError={() => setFailed(true)}
        />
      </div>
    </div>
  );
}
```

In `TrainerProfile`, pass only:

```tsx
<TrainerWalkScene
  trainerSrc="/trainer-walk.png"
  label="Keshav walking"
/>
```

- [ ] **Step 4: Remove companion assets and center the trainer**

Delete `public/gengar-walk.svg` and `src/profile/gengarWalkAsset.test.ts`.

Remove `.trainer-walk-companion-frame`, `.trainer-walk-companion-strip`, `@keyframes gengar-walk-cycle`, and every companion entry in reduced-motion selectors.

Center the aspect-correct trainer crop:

```css
.trainer-walk-trainer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  z-index: 2;
  width: 66.6667%;
  height: 100%;
  overflow: hidden;
  transform: translateX(-50%);
}
```

Keep `.trainer-walk-scene` square and full width. Keep `.trainer-walk-strip` at `width: 300%`, `height: 100%`, `image-rendering: pixelated`, and `trainer-walk-cycle 900ms steps(3) infinite`.

- [ ] **Step 5: Run focused and full verification**

```bash
npm test -- src/profile/TrainerWalkScene.test.tsx src/profile/TrainerProfile.test.tsx src/styles/global.test.ts
npm test
npm run build
```

Expected: focused tests pass; full suite passes; production build succeeds.

- [ ] **Step 6: Commit trainer cleanup**

```bash
git add src/profile/TrainerWalkScene.tsx src/profile/TrainerWalkScene.test.tsx src/profile/TrainerProfile.tsx src/profile/TrainerProfile.test.tsx src/styles/global.css src/styles/global.test.ts public/gengar-walk.svg src/profile/gengarWalkAsset.test.ts
git commit -m "refactor: remove trainer companion"
```

---

### Task 2: Palette Verification, Browser QA, and Push

**Files:**
- Commit existing modifications:
  - `src/assets/sprites/remetra-a.svg`
  - `src/assets/sprites/remetra-b.svg`
  - `src/assets/sprites/revisedPalette.test.ts`
  - `src/assets/sprites/wps-data-lab-a.svg`
  - `src/assets/sprites/wps-data-lab-b.svg`

**Interfaces:**
- Preserves: approved sprite palette with `#0c1720` ink
- Delivers: verified local `main` pushed to `origin/main`

- [ ] **Step 1: Inspect and test the palette corrections**

```bash
git diff -- src/assets/sprites/remetra-a.svg src/assets/sprites/remetra-b.svg src/assets/sprites/revisedPalette.test.ts src/assets/sprites/wps-data-lab-a.svg src/assets/sprites/wps-data-lab-b.svg
npm test -- src/assets/sprites/revisedPalette.test.ts
```

Expected: only legacy ink replacement/removal appears; palette tests pass.

- [ ] **Step 2: Commit the palette correction**

```bash
git add src/assets/sprites/remetra-a.svg src/assets/sprites/remetra-b.svg src/assets/sprites/revisedPalette.test.ts src/assets/sprites/wps-data-lab-a.svg src/assets/sprites/wps-data-lab-b.svg
git commit -m "fix: align project sprite palette"
```

- [ ] **Step 3: Run fresh final verification**

```bash
npm test
npm run build
git diff --check
git status --short --branch
```

Expected: all tests and build pass; worktree is clean; `main` is ahead of `origin/main`.

- [ ] **Step 4: Perform browser QA**

At 1440×900 and 320×568:

- Confirm Keshav appears alone, centered, undistorted, and sharply pixelated.
- Confirm the scene occupies most of the picture panel.
- Confirm desktop has no vertical or horizontal overflow.
- Confirm mobile scrolls vertically without horizontal overflow.
- Confirm roster tabs and a Pokémon popup still work.
- Confirm the console has no warnings or errors.

- [ ] **Step 5: Push**

```bash
git push origin main
```

Expected: `origin/main` advances to the verified local `main` commit.
