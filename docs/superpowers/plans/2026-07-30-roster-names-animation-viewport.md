# Roster Names, Animation, and Desktop Fit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Use real company/project names, animate every roster sprite, and fit the complete portfolio at 1440 × 900 without page scrolling.

**Architecture:** Keep the existing data-driven React structure. Normalize each entry's display name in `portfolioData`, make animation an unconditional grid concern in `CreatureGrid`, and add a targeted desktop media query that compacts the existing stacked layout without scaling the entire application.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite

## Global Constraints

- `Current Location` displays `Boston, MA`.
- Experience entries use their company or organization name; project entries use their project name.
- Every visible grid sprite animates unless reduced motion is enabled.
- The full active page fits at `1440 × 900` without horizontal or vertical scrolling.
- Preserve routes, popup behavior, existing content, pixel rendering, and the stacked layout.

---

### Task 1: Real Entry Names and Current Location

**Files:**
- Modify: `src/data/portfolioData.ts`
- Modify: `src/data/portfolioData.test.ts`
- Modify: `src/profile/TrainerProfile.tsx`
- Modify: `src/profile/TrainerProfile.test.tsx`
- Modify: `src/app/App.test.tsx`
- Modify: `src/pc/CareerPC.test.tsx`
- Modify: `src/pc/PokedexEntry.test.tsx`
- Test: `src/data/portfolioData.test.ts`
- Test: `src/profile/TrainerProfile.test.tsx`

**Interfaces:**
- Consumes: existing `CareerEntry.creatureName` and `TrainerProfile.hometown`.
- Produces: real-name `creatureName` values and visible label `Current Location`.

- [ ] **Step 1: Write failing tests for the real names and location label**

Update assertions so the experience names are `Amazon`, `DraftKings`, `ProcureMate AI`, `Johnson & Johnson`, and `WPS Data Lab`; project names are `Remetra`, `ForgetMeNot`, and `BreatheEasy`; and the profile exposes `Current Location` with `Boston, MA`. Update accessible button and dialog names to the single real name, such as `DraftKings` and `DraftKings details`.

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```bash
npm test -- src/data/portfolioData.test.ts src/profile/TrainerProfile.test.tsx src/app/App.test.tsx src/pc/CareerPC.test.tsx src/pc/PokedexEntry.test.tsx
```

Expected: failures show the old fictional names and `Hometown`.

- [ ] **Step 3: Implement the new names and label**

Set each `creatureName` equal to its existing real `organization` value in `portfolioData.ts`. Change only the rendered `<dt>` copy from `Hometown` to `Current Location`; retain `trainerProfile.hometown` and `Boston, MA`. In `CreatureGrid`, avoid duplicated accessible names by using `entry.creatureName` as the button label and remove the redundant organization line when it equals the primary name. In the popup, continue using the normalized primary name consistently.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run the focused command from Step 2. Expected: all selected tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/data/portfolioData.ts src/data/portfolioData.test.ts src/profile/TrainerProfile.tsx src/profile/TrainerProfile.test.tsx src/app/App.test.tsx src/pc/CreatureGrid.tsx src/pc/CareerPC.test.tsx src/pc/PokedexEntry.test.tsx
git commit -m "refactor: use professional roster names"
```

### Task 2: Animate Every Grid Sprite

**Files:**
- Modify: `src/pc/CreatureGrid.tsx`
- Modify: `src/pc/CareerPC.test.tsx`
- Test: `src/pc/CareerPC.test.tsx`

**Interfaces:**
- Consumes: `PixelSprite({ spriteId, label, animate })`.
- Produces: every visible grid `PixelSprite` with `animate={true}`.

- [ ] **Step 1: Write a failing animation test**

Render `CareerPC`, query every sprite inside `ul[aria-label="Career entries"]`, and assert each `.pixel-sprite` has `data-animate="true"` before and after selecting another entry.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- src/pc/CareerPC.test.tsx
```

Expected: non-selected roster sprites have `data-animate="false"`.

- [ ] **Step 3: Enable animation for every grid entry**

Change the grid call to:

```tsx
<PixelSprite spriteId={entry.spriteId} label={entry.creatureName} animate />
```

Leave reduced-motion CSS unchanged so the alternate frame remains disabled for reduced-motion users.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run `npm test -- src/pc/CareerPC.test.tsx`. Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add src/pc/CreatureGrid.tsx src/pc/CareerPC.test.tsx
git commit -m "fix: animate every roster sprite"
```

### Task 3: Compact 14-inch Desktop Layout

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/styles/global.test.ts`
- Test: `src/styles/global.test.ts`

**Interfaces:**
- Consumes: existing `.trainer-screen`, `.trainer-card`, `.career-pc`, and roster card selectors.
- Produces: targeted `@media (min-width: 64rem) and (max-height: 56.25rem)` desktop compaction.

- [ ] **Step 1: Write a failing stylesheet test**

Assert the desktop-height media query exists and contains compact rules for the outer screen gap, trainer padding/header, field spacing, walk viewport, roster header, tabs, roster panel, cards, and sprites. Assert no `transform: scale(...)` or `zoom:` is used for layout compaction.

- [ ] **Step 2: Run the stylesheet test and verify RED**

Run:

```bash
npm test -- src/styles/global.test.ts
```

Expected: failure because the compact desktop-height media query does not exist.

- [ ] **Step 3: Add targeted compact desktop rules**

Within `@media (min-width: 64rem) and (max-height: 56.25rem)`, reduce page padding, section gaps, trainer-card padding and title margin, field gaps and padding, walk viewport size, navigation spacing, roster header height, tab and panel padding, roster gaps, card minimum height/padding, and grid sprite size. Keep a two-column experience grid and preserve readable text. Do not use global scaling or zoom.

- [ ] **Step 4: Run the stylesheet test and verify GREEN**

Run `npm test -- src/styles/global.test.ts`. Expected: pass.

- [ ] **Step 5: Verify the real viewport**

Start Vite and inspect at `1440 × 900`. Confirm:

```js
document.documentElement.scrollWidth === innerWidth
document.documentElement.scrollHeight === innerHeight
```

Confirm all five experience entries, the trainer card, and roster controls are visible. Open Projects and a project popup to ensure interaction still works.

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css src/styles/global.test.ts
git commit -m "fix: fit portfolio on laptop viewport"
```

### Task 4: Full Verification

**Files:**
- Verify only.

**Interfaces:**
- Consumes: all prior task outputs.
- Produces: a clean, tested branch ready to push.

- [ ] **Step 1: Run all automated checks**

```bash
npm test
npm run build
git diff --check
```

Expected: all tests pass, the production build succeeds, and no whitespace errors are reported.

- [ ] **Step 2: Run final browser QA**

At `1440 × 900`, confirm no page overflow, real names throughout the roster and popup, `Current Location: Boston, MA`, and two-frame animation on every visible roster sprite. Confirm no browser console errors or warnings.

- [ ] **Step 3: Inspect repository state**

```bash
git status --short --branch
git log -5 --format='%h %an <%ae> %s'
```

Expected: clean worktree and commits authored by Keshav Goel.

