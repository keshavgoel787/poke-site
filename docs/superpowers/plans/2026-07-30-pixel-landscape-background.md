# Pixel Landscape Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the black page void with an original late-afternoon pixel landscape while preserving interface contrast and layout.

**Architecture:** Generate one static raster asset in `public/`, then layer it on the document background beneath a translucent dark-blue overlay. Keep the application panels unchanged and verify the background at the existing 1440 × 900 desktop target.

**Tech Stack:** Image generation, PNG, CSS, Vitest, Vite, browser QA

## Global Constraints

- Original 16-bit late-afternoon landscape with pale blue sky, warm-gold horizon, pixel clouds, dark-green hills, meadow, flowers, and winding path.
- No Pokémon, trainers, logos, text, buildings, or copied game assets.
- Full-page cover background with centered positioning and no tiling.
- Static artwork with no animation or parallax.
- Subtle dark-blue overlay maintains panel contrast.
- No horizontal or vertical page scrolling at `1440 × 900`.

---

### Task 1: Generate the Original Landscape Asset

**Files:**
- Create: `public/pixel-landscape-bg.png`

**Interfaces:**
- Produces: `/pixel-landscape-bg.png`, an opaque landscape raster suitable for `background-size: cover`.

- [ ] **Step 1: Generate the background**

Use the image generation skill with this exact art direction:

```text
Create an original 16-bit pixel-art landscape background for a professional portfolio website, 16:9 composition. Pale clear blue sky at the top transitions into warm golden late-afternoon light near the horizon. Broad blocky white and peach pixel clouds, layered dark forest-green hills, a bright grassy meadow with sparse tiny red and yellow flowers, and a winding pale cream path leading from the lower foreground toward the horizon. Keep the central region calm and low-detail so opaque interface panels remain dominant. Crisp hard pixel edges, limited cohesive palette, no antialiasing, no text, no UI, no characters, no creatures, no logos, no buildings, no game screenshots, and no copied franchise assets.
```

- [ ] **Step 2: Inspect the generated image**

Confirm the asset is landscape-oriented, visually original, contains every specified environmental layer, and has no prohibited content. Regenerate once if any requirement is visibly missed.

- [ ] **Step 3: Save the selected asset**

Store the selected image as:

```text
public/pixel-landscape-bg.png
```

- [ ] **Step 4: Commit**

```bash
git add public/pixel-landscape-bg.png
git commit -m "feat: add pixel landscape background asset"
```

### Task 2: Integrate the Background and Overlay

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/styles/global.test.ts`
- Test: `src/styles/global.test.ts`

**Interfaces:**
- Consumes: `/pixel-landscape-bg.png` from Task 1.
- Produces: document-level cover background and overlay beneath `#root`.

- [ ] **Step 1: Write the failing stylesheet regression test**

Assert `body` includes:

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

Also assert `#root` remains positioned above the background and does not add its own opaque full-page background.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npm test -- src/styles/global.test.ts
```

Expected: failure because the body still uses only `background: var(--ink)`.

- [ ] **Step 3: Add the document background**

Replace the body shorthand background with the exact layered background declarations from Step 1. Keep `html` and `:root` fallback colors as `var(--ink)`. Add:

```css
#root {
  position: relative;
  z-index: 1;
}
```

Do not alter panel backgrounds or dimensions.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run `npm test -- src/styles/global.test.ts`. Expected: pass.

- [ ] **Step 5: Run all automated checks**

```bash
npm test
npm run build
git diff --check
```

Expected: all tests pass, the build succeeds, and no whitespace errors appear.

- [ ] **Step 6: Verify in a browser**

At `1440 × 900`, verify:

- the artwork covers the viewport without tiling;
- sky, horizon, hills, and meadow remain recognizable around the panels;
- text and controls remain readable;
- both tabs have no page overflow;
- sprites animate;
- a project popup opens;
- console warnings and errors are empty.

- [ ] **Step 7: Commit**

```bash
git add src/styles/global.css src/styles/global.test.ts
git commit -m "feat: add pixel landscape page background"
```

