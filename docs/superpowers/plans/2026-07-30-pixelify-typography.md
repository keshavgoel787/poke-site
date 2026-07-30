# Pixelify Sans Typography Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Self-host Pixelify Sans and apply the selected treatment consistently across every visible interface surface.

**Architecture:** Store the official Google Fonts variable TTF and SIL Open Font License in `public/fonts/`. Define one variable `@font-face`, make it the document-wide inherited family, and assign the approved 400/600/700 hierarchy through existing semantic selectors without restructuring components.

**Tech Stack:** Pixelify Sans variable font, CSS, Vitest, Vite, browser QA

## Global Constraints

- Pixelify Sans is self-hosted; no runtime font CDN.
- Include the SIL Open Font License beside the font asset.
- Use `font-display: swap` and a monospace fallback.
- Weight 700 for headings, company/project names, tabs, buttons, and primary navigation.
- Weight 600 for field labels, card metadata, popup labels, and type tags.
- Weight 400 for roles, dates, locations, descriptions, and popup body content.
- Preserve existing uppercase hierarchy, responsive sizes, outlines, and contrast.
- No text clipping or page overflow at `1440 × 900`.

---

### Task 1: Add Official Local Font Assets

**Files:**
- Create: `public/fonts/PixelifySans-Variable.ttf`
- Create: `public/fonts/OFL.txt`

**Interfaces:**
- Produces: local URLs `/fonts/PixelifySans-Variable.ttf` and `/fonts/OFL.txt`.

- [ ] **Step 1: Download the official assets**

Download from the official Google Fonts repository:

```text
https://raw.githubusercontent.com/google/fonts/main/ofl/pixelifysans/PixelifySans%5Bwght%5D.ttf
https://raw.githubusercontent.com/google/fonts/main/ofl/pixelifysans/OFL.txt
```

Save them as:

```text
public/fonts/PixelifySans-Variable.ttf
public/fonts/OFL.txt
```

- [ ] **Step 2: Validate the assets**

Confirm the TTF is non-empty and recognized as TrueType, and the license begins with the Pixelify Sans copyright notice and SIL Open Font License text.

- [ ] **Step 3: Commit**

```bash
git add public/fonts/PixelifySans-Variable.ttf public/fonts/OFL.txt
git commit -m "feat: add Pixelify Sans font assets"
```

### Task 2: Apply the Global Typography System

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/styles/global.test.ts`
- Test: `src/styles/global.test.ts`

**Interfaces:**
- Consumes: `/fonts/PixelifySans-Variable.ttf`.
- Produces: document-wide `Pixelify Sans` inheritance with explicit semantic weight hierarchy.

- [ ] **Step 1: Write failing font-delivery tests**

Assert:

```css
@font-face {
  font-family: "Pixelify Sans";
  src: url("/fonts/PixelifySans-Variable.ttf") format("truetype");
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
}
```

Assert `body`, `button`, and `a` inherit:

```css
font-family: "Pixelify Sans", "Courier New", Courier, monospace;
```

- [ ] **Step 2: Write failing hierarchy tests**

Assert weight `700` for:

```text
h1, h2, h3
.trainer-card nav a
.career-pc__header > button
[role="tablist"] [role="tab"]
.party-card__name
dialog.pokedex-entry > button
```

Assert weight `600` for:

```text
.trainer-card__fields dt
.party-card__metadata
dialog.pokedex-entry > .pokedex-entry__category
dialog.pokedex-entry > .pokedex-entry__meta
dialog.pokedex-entry > div[aria-label="Types"] span
```

Assert weight `400` for:

```text
.trainer-card__fields dd
.party-card__role
dialog.pokedex-entry > .pokedex-entry__highlight
dialog.pokedex-entry > ul[aria-label="Moves"]
```

- [ ] **Step 3: Run the focused test and verify RED**

Run:

```bash
npm test -- src/styles/global.test.ts
```

Expected: failures report the missing local font face, old Courier stack, and incomplete weight hierarchy.

- [ ] **Step 4: Define and inherit Pixelify Sans**

Add the `@font-face` declaration at the top of `global.css`. Replace the body family with:

```css
font-family: "Pixelify Sans", "Courier New", Courier, monospace;
```

Change `button` to `font: inherit` and ensure links inherit the family rather than declaring a separate face.

- [ ] **Step 5: Apply the semantic weight hierarchy**

Add or adjust only the selectors listed in Step 2. Set major heading letter spacing to `-0.04em` where the current value is looser, and set text-heavy popup/body content line-height to at least `1.2`.

- [ ] **Step 6: Run the focused test and verify GREEN**

Run `npm test -- src/styles/global.test.ts`. Expected: pass.

- [ ] **Step 7: Run all automated checks**

```bash
npm test
npm run build
git diff --check
```

Expected: all tests pass, the build succeeds, and no whitespace errors appear.

- [ ] **Step 8: Verify in a browser**

At `1440 × 900`, verify:

- computed body family begins with `Pixelify Sans`;
- weights 400, 600, and 700 appear on the intended semantic elements;
- no clipped, wrapped, or overlapping labels;
- Experience and Projects remain free of page overflow;
- popup remains readable;
- sprites animate;
- font requests succeed without console errors or warnings.

- [ ] **Step 9: Commit**

```bash
git add src/styles/global.css src/styles/global.test.ts
git commit -m "feat: apply Pixelify Sans typography"
```

