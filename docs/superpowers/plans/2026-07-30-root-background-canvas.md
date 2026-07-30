# Root Background Canvas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent elastic overscroll from exposing the black root canvas beneath the pixel landscape.

**Architecture:** The `html` element becomes the sole owner of the existing fixed, covered background layers. The `body` remains the layout container but uses a transparent background so the root canvas stays visible at every scroll position.

**Tech Stack:** React, Vite, CSS, Vitest

## Global Constraints

- Preserve the existing pixel-landscape asset and dark overlay.
- Preserve foreground stacking and desktop layout behavior.
- Do not duplicate the background across multiple elements.

---

### Task 1: Move the Page Background to the Root Canvas

**Files:**
- Modify: `src/styles/global.test.ts`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `/pixel-landscape-bg.png` and the existing `--ink` token.
- Produces: A fixed, covered `html` background with a transparent `body`.

- [ ] **Step 1: Write the failing stylesheet regression test**

Update the existing background test to require the full background declaration
inside `html` and a transparent body:

```ts
expect(globalStyles).toMatch(
  /html\s*{[^}]*background-color: var\(--ink\);[^}]*background-image:[^}]*url\("\/pixel-landscape-bg\.png"\);[^}]*background-size: cover;[^}]*background-attachment: fixed;/,
);
expect(declarationsFor('body')).toMatch(/background:\s*transparent;/);
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- src/styles/global.test.ts`

Expected: FAIL because `body`, rather than `html`, still owns the image.

- [ ] **Step 3: Implement the single root background**

Move these declarations from `body` to `html` without changing their values:

```css
background-color: var(--ink);
background-image:
  linear-gradient(rgba(12, 23, 32, 0.28), rgba(12, 23, 32, 0.28)),
  url("/pixel-landscape-bg.png");
background-position: center center;
background-repeat: no-repeat;
background-size: cover;
background-attachment: fixed;
```

Replace the removed body background declarations with:

```css
background: transparent;
```

- [ ] **Step 4: Run focused and complete verification**

Run: `npm test -- src/styles/global.test.ts`

Expected: PASS.

Run: `npm test`

Expected: all tests pass.

Run: `npm run build`

Expected: production build completes successfully.

- [ ] **Step 5: Verify the rendered root canvas**

At a short desktop viewport, scroll to the bottom and confirm:

```js
getComputedStyle(document.documentElement).backgroundImage.includes(
  "pixel-landscape-bg.png",
)
```

returns `true`, `getComputedStyle(document.body).backgroundColor` is
`rgba(0, 0, 0, 0)`, and no black strip is visible below the content.

- [ ] **Step 6: Commit the fix**

```bash
git add src/styles/global.css src/styles/global.test.ts \
  docs/superpowers/specs/2026-07-30-root-background-canvas-design.md \
  docs/superpowers/plans/2026-07-30-root-background-canvas.md
git commit -m "fix: keep pixel background visible during overscroll"
```
