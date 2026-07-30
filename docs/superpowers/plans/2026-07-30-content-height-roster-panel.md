# Content-Height Roster Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the compact desktop roster panel end after its final card row instead of filling the remaining viewport.

**Architecture:** Adjust only the existing compact-desktop grid sizing. The trainer track remains fixed at its current compact height while the roster track becomes content-sized, allowing `.career-pc` and its border to shrink naturally.

**Tech Stack:** CSS, Vitest, Vite, browser QA

## Global Constraints

- Cards remain directly beneath the roster tabs.
- The dark panel and border end shortly after the final card row.
- Experience and Projects both use content-height sizing.
- Preserve the two-column grid, card sizes, animations, popup behavior, and trainer card.
- The page remains free of horizontal and vertical scrolling at `1440 × 900`.
- Do not use global scale or zoom.

---

### Task 1: Content-Height Compact Desktop Grid

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/styles/global.test.ts`
- Test: `src/styles/global.test.ts`

**Interfaces:**
- Consumes: compact desktop media query `@media (min-width: 64rem) and (max-height: 56.25rem)`.
- Produces: `.trainer-screen` grid with a fixed trainer row and content-sized roster row.

- [ ] **Step 1: Write the failing stylesheet regression test**

Update the compact desktop test to require:

```css
.trainer-screen {
  height: auto;
  grid-template-rows: minmax(0, 19rem) auto;
  align-content: start;
}
```

Assert the compact query does not contain `grid-template-rows: minmax(0, 19rem) minmax(0, 1fr)`.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- src/styles/global.test.ts
```

Expected: failure because the current compact grid uses full viewport height and a flexible second track.

- [ ] **Step 3: Implement content-height sizing**

Within the existing compact desktop media query, change only `.trainer-screen`:

```css
.trainer-screen {
  height: auto;
  grid-template-rows: minmax(0, 19rem) auto;
  align-content: start;
  gap: 0.4rem;
}
```

Keep all card, sprite, tab, trainer, and popup rules unchanged.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run `npm test -- src/styles/global.test.ts`. Expected: pass.

- [ ] **Step 5: Run all automated checks**

```bash
npm test
npm run build
git diff --check
```

Expected: all tests pass, the build succeeds, and no whitespace errors appear.

- [ ] **Step 6: Verify both tabs in a browser**

At `1440 × 900`, confirm:

- document scroll width and height equal the viewport;
- the Experience panel ends below its third card row;
- the Projects panel ends below its second card row;
- card grids remain top-aligned;
- all sprites still animate;
- a project popup opens.

- [ ] **Step 7: Commit**

```bash
git add src/styles/global.css src/styles/global.test.ts
git commit -m "fix: shrink roster panel to content"
```

