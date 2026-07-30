# Roster Card Metadata Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace generic card category labels with experience dates and curated project technology summaries.

**Architecture:** Add an explicit `cardMetadata` field to each data entry so card copy stays data-driven and popup data remains unchanged. `CreatureGrid` renders that field in the existing semantic metadata row, while CSS constrains it to a single compact line.

**Tech Stack:** React 19, TypeScript, CSS, Vitest, Testing Library, Vite

## Global Constraints

- Experience cards display their existing date ranges.
- Project cards display exactly three curated technologies.
- Remetra displays `React · Supabase · FastAPI`.
- ForgetMeNot displays `FastAPI · Gemini · OpenCV`.
- BreatheEasy displays `Flutter · Dart · Google Maps`.
- Popup categories and complete technology lists remain unchanged.
- The page continues to fit at `1440 × 900` without horizontal or vertical scrolling.

---

### Task 1: Data-Driven Card Metadata

**Files:**
- Modify: `src/data/portfolioData.ts`
- Modify: `src/data/portfolioData.test.ts`
- Modify: `src/pc/CreatureGrid.tsx`
- Modify: `src/pc/CareerPC.test.tsx`
- Modify: `src/styles/global.css`
- Modify: `src/styles/global.test.ts`
- Test: `src/data/portfolioData.test.ts`
- Test: `src/pc/CareerPC.test.tsx`
- Test: `src/styles/global.test.ts`

**Interfaces:**
- Consumes: existing `CareerEntry.dates`, `CareerEntry.moves`, and `.party-card__category` presentation.
- Produces: required `CareerEntry.cardMetadata: string` and `.party-card__metadata`.

- [ ] **Step 1: Write failing data and component tests**

Add assertions that every experience entry's `cardMetadata` equals its `dates`, and project metadata equals the three exact approved strings. Update the career-grid test to expect `Jun 2026 - Present` for DraftKings rather than visible `Experience`. Switch to Projects and assert the three curated strings are visible while the generic `Project` row is absent.

- [ ] **Step 2: Write a failing stylesheet regression test**

Assert `.party-card__metadata` is part of the semantic metadata-row selector and has:

```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

Assert `.party-card__category` is no longer the grid-card metadata selector.

- [ ] **Step 3: Run focused tests and verify RED**

Run:

```bash
npm test -- src/data/portfolioData.test.ts src/pc/CareerPC.test.tsx src/styles/global.test.ts
```

Expected: failures report missing `cardMetadata`, old category copy, and missing metadata CSS.

- [ ] **Step 4: Add exact metadata to the data model**

Add:

```ts
cardMetadata: string;
```

to `CareerEntry`. For experience entries, set `cardMetadata` to the same exact string as `dates`. For projects, set:

```ts
cardMetadata: 'React · Supabase · FastAPI'
cardMetadata: 'FastAPI · Gemini · OpenCV'
cardMetadata: 'Flutter · Dart · Google Maps'
```

Do not remove or shorten `moves`.

- [ ] **Step 5: Render the new semantic metadata field**

Replace:

```tsx
<span className="party-card__category">{entry.category}</span>
```

with:

```tsx
<span className="party-card__metadata">{entry.cardMetadata}</span>
```

Leave popup rendering unchanged.

- [ ] **Step 6: Constrain the metadata row**

Replace `.party-card__category` in the roster-card metadata CSS selector with `.party-card__metadata`. Add single-line overflow rules to `.party-card__metadata` without changing popup category styles.

- [ ] **Step 7: Run focused tests and verify GREEN**

Run the focused command from Step 3. Expected: all selected tests pass.

- [ ] **Step 8: Run full verification**

```bash
npm test
npm run build
git diff --check
```

Expected: all tests pass, build succeeds, and no whitespace errors appear.

- [ ] **Step 9: Verify the browser**

At `1440 × 900`, confirm both tabs fit without scrolling, experience dates and curated project stacks render, all sprites still animate, and a project popup still contains its full moves list.

- [ ] **Step 10: Commit**

```bash
git add src/data/portfolioData.ts src/data/portfolioData.test.ts src/pc/CreatureGrid.tsx src/pc/CareerPC.test.tsx src/styles/global.css src/styles/global.test.ts
git commit -m "feat: show useful roster metadata"
```

