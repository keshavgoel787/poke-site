# Pokémon DS Typography Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Pixelify Sans across the portfolio with the self-hosted Pokémon DS Webfont and tune the type treatment for faithful, readable DS-era interface text.

**Architecture:** The existing global stylesheet remains the single typography owner. It will load one native regular-weight font face, inherit it through controls, and express hierarchy with size, color, capitalization, spacing, and restrained heading shadows instead of synthetic weights.

**Tech Stack:** React, Vite, CSS, Vitest, Pokémon DS Webfont

## Global Constraints

- Self-host the Pokémon DS Webfont by Lewis Wright.
- Use WOFF2 as the primary source and WOFF as the fallback.
- Keep `"Courier New"`, Courier, and monospace as system fallbacks.
- Use the font's native regular weight rather than browser-generated bold.
- Keep normal body copy at a line height of at least `1.35`.
- Use a single dark one-pixel shadow only on major headings.
- Preserve the current layout, wording, palette, animation, sound effects, and responsive breakpoints.
- Keep the compact 14-inch MacBook Pro desktop viewport free of clipped labels and horizontal scrolling.

---

### Task 1: Self-Host the Pokémon DS Font

**Files:**
- Create: `public/fonts/pokemon_dppt-dppt.woff2`
- Create: `public/fonts/pokemon_dppt-dppt.woff`
- Create: `public/fonts/Pokemon-DS-NOTICE.txt`
- Delete: `public/fonts/PixelifySans-Variable.ttf`
- Delete: `public/fonts/OFL.txt`
- Modify: `src/styles/global.test.ts`

**Interfaces:**
- Consumes: The Pokémon DS archive published at `https://bouncebag.com/Downloads/Webfonts/PokemonDS.rar`.
- Produces: `/fonts/pokemon_dppt-dppt.woff2`, `/fonts/pokemon_dppt-dppt.woff`, and a repository-local attribution notice.

- [ ] **Step 1: Download and inspect the source archive**

Run:

```bash
curl -L https://bouncebag.com/Downloads/Webfonts/PokemonDS.rar \
  -o /tmp/PokemonDS.rar
bsdtar -tf /tmp/PokemonDS.rar
```

Expected: the archive lists `pokemon_dppt-dppt.woff2`,
`pokemon_dppt-dppt.woff`, and the publisher's bundled documentation or
stylesheet.

- [ ] **Step 2: Write the failing asset regression test**

Replace the Pixelify asset assertions in `src/styles/global.test.ts` with:

```ts
const pokemonDsWoff2 = readFileSync(
  new URL('../../public/fonts/pokemon_dppt-dppt.woff2', import.meta.url),
);
const pokemonDsWoff = readFileSync(
  new URL('../../public/fonts/pokemon_dppt-dppt.woff', import.meta.url),
);
const pokemonDsNotice = readFileSync(
  new URL('../../public/fonts/Pokemon-DS-NOTICE.txt', import.meta.url),
  'utf8',
);

it('delivers the self-hosted Pokemon DS font and attribution', () => {
  expect(pokemonDsWoff2.byteLength).toBeGreaterThan(0);
  expect(pokemonDsWoff.byteLength).toBeGreaterThan(0);
  expect(pokemonDsNotice).toContain('Pokemon DS Webfont');
  expect(pokemonDsNotice).toContain('Lewis Wright');
  expect(pokemonDsNotice).toContain('https://bouncebag.com/Downloads/Webfonts.html');
});
```

- [ ] **Step 3: Run the focused test and verify it fails**

Run:

```bash
npm test -- src/styles/global.test.ts
```

Expected: FAIL because the Pokémon DS files do not exist yet.

- [ ] **Step 4: Extract the approved formats and preserve attribution**

Run:

```bash
mkdir -p /tmp/PokemonDS
bsdtar -xf /tmp/PokemonDS.rar -C /tmp/PokemonDS
find /tmp/PokemonDS -type f -maxdepth 3 -print
```

Copy the exact WOFF2 and WOFF files into `public/fonts/`. Create
`public/fonts/Pokemon-DS-NOTICE.txt` with:

```text
Pokemon DS Webfont
By Lewis Wright
Based on the font from Pokemon Diamond, Pearl, and Platinum on Nintendo DS.
Created by Lewis Wright of https://bouncebag.com.
Source: https://bouncebag.com/Downloads/Webfonts.html
Self-hosted as requested by the font publisher.
```

Delete `public/fonts/PixelifySans-Variable.ttf` and `public/fonts/OFL.txt`
after confirming with:

```bash
rg -n "PixelifySans-Variable|OFL.txt" . \
  --glob '!docs/superpowers/**' --glob '!node_modules/**'
```

that only the stylesheet and regression test still reference Pixelify.

- [ ] **Step 5: Run the focused asset test**

Run:

```bash
npm test -- src/styles/global.test.ts
```

Expected: the new asset test passes; typography assertions may still fail only
after Task 2 introduces their new expectations.

- [ ] **Step 6: Commit the font assets**

```bash
git add public/fonts src/styles/global.test.ts
git commit -m "assets: add Pokemon DS webfont"
```

---

### Task 2: Apply the Native Regular-Weight Typography

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/styles/global.test.ts`

**Interfaces:**
- Consumes: `/fonts/pokemon_dppt-dppt.woff2` and `/fonts/pokemon_dppt-dppt.woff` from Task 1.
- Produces: The global `"Pokemon DPPT"` font family and the approved readability treatment.

- [ ] **Step 1: Replace the typography regression expectations**

Update `src/styles/global.test.ts` to assert:

```ts
expect(globalStyles).toMatch(
  /@font-face\s*{[^}]*font-family:\s*"Pokemon DPPT";[^}]*src:\s*url\("\/fonts\/pokemon_dppt-dppt\.woff2"\)\s*format\("woff2"\),\s*url\("\/fonts\/pokemon_dppt-dppt\.woff"\)\s*format\("woff"\);[^}]*font-style:\s*normal;[^}]*font-weight:\s*400;[^}]*font-display:\s*swap;/,
);
expect(declarationsFor('body')).toContain(
  'font-family: "Pokemon DPPT", "Courier New", Courier, monospace;',
);
expect(declarationsFor('body')).toMatch(/line-height:\s*(?:1\.3[5-9]|1\.[4-9]|[2-9]);/);
expect(globalStyles).not.toContain('Pixelify Sans');
```

Replace the semantic weight test with a scan of all declared weights:

```ts
const declaredWeights = [...globalStyles.matchAll(/font-weight:\s*(\d+);/g)]
  .map((match) => match[1]);
expect(new Set(declaredWeights)).toEqual(new Set(['400']));
```

Assert that `h1`, `h2`, `h3`, and `.career-pc__header > h2` have no negative
letter spacing and that only those major heading selectors receive:

```css
text-shadow: 1px 1px 0 var(--steel-dark);
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npm test -- src/styles/global.test.ts
```

Expected: FAIL because the stylesheet still declares Pixelify Sans and
synthetic weights.

- [ ] **Step 3: Implement the DS font face and global stack**

Replace the existing `@font-face` with:

```css
@font-face {
  font-family: "Pokemon DPPT";
  src:
    url("/fonts/pokemon_dppt-dppt.woff2") format("woff2"),
    url("/fonts/pokemon_dppt-dppt.woff") format("woff");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}
```

Set the body stack to:

```css
font-family: "Pokemon DPPT", "Courier New", Courier, monospace;
font-size: 1rem;
line-height: 1.4;
```

- [ ] **Step 4: Replace synthetic hierarchy with DS-style hierarchy**

Change every numeric `font-weight` declaration in `src/styles/global.css` to
`400`. Remove negative `letter-spacing` from headings. Remove the existing
four-direction `text-shadow` from `.party-card__name`, then apply exactly:

```css
h1,
h2,
h3,
.career-pc__header > h2 {
  text-shadow: 1px 1px 0 var(--steel-dark);
}
```

Keep paragraph text and roster metadata free of text shadows. Increase any
roster metadata rule below `0.7rem` to `0.7rem`, except decorative completion
labels that are not content-bearing.

- [ ] **Step 5: Run the focused test and verify it passes**

Run:

```bash
npm test -- src/styles/global.test.ts
```

Expected: all stylesheet tests pass.

- [ ] **Step 6: Commit the typography change**

```bash
git add src/styles/global.css src/styles/global.test.ts
git commit -m "style: apply Pokemon DS typography"
```

---

### Task 3: Verify Readability and Compact Desktop Fit

**Files:**
- Modify if browser evidence requires a correction: `src/styles/global.css`
- Modify with any corrective regression: `src/styles/global.test.ts`

**Interfaces:**
- Consumes: The completed global typography from Task 2.
- Produces: Verified trainer card, both roster tabs, and popup typography at `1512 × 982`.

- [ ] **Step 1: Run complete automated verification**

Run:

```bash
npm test
npm run build
git diff --check
```

Expected: 118 or more tests pass, the production build succeeds, and no
whitespace errors are reported.

- [ ] **Step 2: Start the local site**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

Expected: Vite reports a local URL.

- [ ] **Step 3: Verify the trainer card and Experience tab**

At a `1512 × 982` viewport, confirm:

- `document.fonts.check('16px "Pokemon DPPT"')` returns `true`.
- `document.documentElement.scrollWidth === window.innerWidth`.
- No trainer-card field, navigation label, role, company name, or date is
  clipped or ellipsized.
- The site retains the current single-page stacked layout.

- [ ] **Step 4: Verify Projects and a detail popup**

Open the Projects tab and one project popup. Confirm:

- Project names, summaries, and technology stacks remain readable.
- Popup headings, type labels, highlight text, moves, and controls do not
  overflow their panels.
- Paragraph and metadata text have no text shadow.
- The page console contains no font-loading or rendering errors.

- [ ] **Step 5: Correct only evidence-backed typography issues**

If a label clips, adjust only its existing `font-size`, `line-height`, or panel
padding rule. Add a matching assertion to `src/styles/global.test.ts`, rerun the
focused test, and repeat the affected browser check. Do not change layout
structure or responsive breakpoints.

- [ ] **Step 6: Run final verification and commit any corrections**

Run:

```bash
npm test
npm run build
git diff --check
```

Expected: all checks pass.

If Task 3 changed tracked files:

```bash
git add src/styles/global.css src/styles/global.test.ts
git commit -m "fix: tune Pokemon DS text readability"
```
