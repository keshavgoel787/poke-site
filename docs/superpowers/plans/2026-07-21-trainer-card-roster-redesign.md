# Trainer Card and Pokémon Roster Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the current career PC into a reference-matched three-screen flow with a Trainer Card landing page, two-tab professional creature roster, and route-driven detail dialog using the updated résumé.

**Architecture:** Preserve the existing React/TypeScript/Vite application, typed content model, sprite registry, sound preferences, and static deployment. Replace the current profile and PC presentation through focused component revisions; use URL state for roster tab and dialog selection, while presentation-only sound state stays local.

**Tech Stack:** React, TypeScript, Vite, React Router, Vitest, Testing Library, CSS, original pixel PNG/SVG assets, Web Audio

## Global Constraints

- The July 18, 2026 résumé at `/Users/keshavgoel/Downloads/Keshav_Goel_Resume.pdf` is authoritative when it conflicts with earlier site data.
- The Trainer Card fields are exactly: Keshav Goel; Northeastern University; May 2028; Data Science; Boston, MA.
- The visible roster has exactly two tabs: Experience and Projects.
- Experience entries are Amazon, DraftKings, ProcureMate AI, Johnson & Johnson, and WPS Data Lab.
- Project entries are Remetra, ForgetMeNot, and BreatheEasy.
- Preserve every existing sprite file, including sprites for entries removed from the visible roster.
- Preserve the existing original menu bleep system, sound-off default, safe storage, and reduced-motion behavior.
- Use a blue/cyan/charcoal/steel/green handheld palette closely matching the supplied references.
- Do not use extracted game assets, Poké Balls, badge art, icons, sounds, logos, or franchise trainer designs.
- All career-creature, trainer, icon, and audio assets must be original. The Trainer Card has one user-directed exception: a newly drawn, simplified Gengar companion based on Keshav's supplied reference, not an extracted sprite.
- No visible metric, technology, date, location, responsibility, or outcome may be invented.
- Interactive targets remain at least 44 by 44 pixels and the site must not overflow horizontally at 320 pixels.
- Do not deploy or change DNS without explicit production-release approval.

---

## File Map

- `src/data/portfolioData.ts`: updated résumé-derived profile, roster, metrics, moves, and links.
- `src/data/portfolioData.test.ts`: exact visible membership and content-contract tests.
- `src/navigation/routes.ts`: `/pokemon/...` builders/resolution plus legacy `/pc/...` translation.
- `src/navigation/routes.test.ts`: new, deep, invalid, and legacy route tests.
- `src/profile/TrainerProfile.tsx`: full Trainer Card and professional-link icons.
- `src/profile/TrainerProfile.test.tsx`: exact fields, links, walking scene, and separate roster-card tests.
- `src/profile/TrainerWalkScene.tsx`: accessible Keshav-and-Gengar walking viewport with readable asset fallback.
- `src/profile/TrainerWalkScene.test.tsx`: sprite contract and runtime-failure behavior.
- `src/pc/CareerPC.tsx`: two-tab roster shell, route recovery, dialog coordination, and sound.
- `src/pc/CreatureGrid.tsx`: party-style list with focusable roster cards.
- `src/pc/PokedexEntry.tsx`: accessible modal detail dialog.
- `src/pc/CareerPC.test.tsx`: tabs, dialog, focus, Escape, legacy route, and recovery behavior.
- `src/pc/PokedexEntry.test.tsx`: content and dialog semantics.
- `src/pc/PixelSprite.tsx`: preserved registry plus new WPS and Remetra entries.
- `src/pc/PixelSprite.test.tsx`: all visible and preserved IDs plus fallback behavior.
- `src/assets/sprites/wps-data-lab-*.svg`: original WPS two-frame sprite.
- `src/assets/sprites/remetra-*.svg`: original Remetra two-frame sprite.
- `public/trainer-walk.png`: transparent three-frame walking sheet containing the original Keshav trainer.
- `public/gengar-companion.png`: transparent companion art derived from Keshav's supplied Gengar reference.
- `public/resume.pdf`: byte-for-byte updated résumé.
- `src/styles/tokens.css`: revised handheld palette.
- `src/styles/global.css`: Trainer Card, roster, modal, responsive, focus, and motion styling.
- `src/app/App.tsx`: new routes and legacy redirects.
- `src/app/App.test.tsx`: route-level integration tests.
- `README.md`: updated route and content description.

---

### Task 1: Refresh Résumé Content and Route Contracts

**Files:**
- Modify: `src/data/portfolioData.ts`
- Modify: `src/data/portfolioData.test.ts`
- Modify: `src/navigation/routes.ts`
- Modify: `src/navigation/routes.test.ts`
- Modify: `src/app/App.tsx`
- Modify: `src/app/App.test.tsx`
- Replace: `public/resume.pdf`

**Interfaces:**
- Produces: `RosterTab = 'experience' | 'projects'`, updated `CareerEntry`, `rosterTabs`, `pokemonPath(tab, entryId?)`, `resolvePokemonRoute(tab?, entryId?)`, and `legacyPcPath(boxId?, entryId?)`.
- Consumes: existing React Router integration and static résumé link.

- [ ] **Step 1: Copy and verify the updated résumé**

Run:

```bash
cp /Users/keshavgoel/Downloads/Keshav_Goel_Resume.pdf public/resume.pdf
cmp /Users/keshavgoel/Downloads/Keshav_Goel_Resume.pdf public/resume.pdf
```

Expected: `cmp` exits 0 with no output.

- [ ] **Step 2: Write failing exact-membership and content tests**

```ts
expect(rosterTabs.map((tab) => tab.id)).toEqual(['experience', 'projects']);
expect(rosterTabs[0].entries.map((entry) => entry.organization)).toEqual([
  'Amazon', 'DraftKings', 'ProcureMate AI', 'Johnson & Johnson', 'WPS Data Lab'
]);
expect(rosterTabs[1].entries.map((entry) => entry.organization)).toEqual([
  'Remetra', 'ForgetMeNot', 'BreatheEasy'
]);
expect(trainerProfile).toMatchObject({
  name: 'Keshav Goel',
  school: 'Northeastern University',
  graduation: 'May 2028',
  major: 'Data Science',
  hometown: 'Boston, MA'
});
```

Also assert Generate and VDart are absent from `rosterTabs`, every visible entry has one `highlight`, one or more source-verified `moves`, and each Experience entry has nonempty `dates` and `location`.

- [ ] **Step 3: Run the data tests to verify RED**

Run: `npm test -- src/data/portfolioData.test.ts`

Expected: FAIL because the current model exposes three boxes and stale content.

- [ ] **Step 4: Implement the updated typed data model**

```ts
export type RosterTab = 'experience' | 'projects';
export type ProfessionalMove = { name: string; skill: string };
export type CareerEntry = {
  id: string;
  creatureName: string;
  organization: string;
  role: string;
  category: 'Experience' | 'Project';
  dates?: string;
  location?: string;
  highlight: string;
  professionalType: string;
  moves: ProfessionalMove[];
  spriteId: string;
  link?: { label: string; href: string };
};
export type Roster = { id: RosterTab; label: string; entries: CareerEntry[] };
```

Populate only the eight approved visible entries using the exact résumé mappings in the design spec. Keep links only when their URLs are already verified. Export `getRoster(tab)` and `getRosterEntry(tab, entryId)`.

- [ ] **Step 5: Write failing route tests**

```ts
expect(pokemonPath('experience', 'draftkings')).toBe('/pokemon/experience/draftkings');
expect(resolvePokemonRoute('projects', 'forgetmenot')).toEqual({ tab: 'projects', entryId: 'forgetmenot', recovered: false });
expect(resolvePokemonRoute('projects', 'missing')).toEqual({ tab: 'projects', entryId: undefined, recovered: true });
expect(legacyPcPath('experience', 'draftkings')).toBe('/pokemon/experience/draftkings');
expect(legacyPcPath('trainer', 'interests')).toBe('/');
```

- [ ] **Step 6: Implement new and legacy route helpers**

```ts
export const pokemonPath = (tab: RosterTab, entryId?: string) =>
  entryId ? `/pokemon/${tab}/${entryId}` : `/pokemon/${tab}`;

export function resolvePokemonRoute(tab?: string, entryId?: string): PokemonRouteState {
  const roster = rosterTabs.find((item) => item.id === tab) ?? rosterTabs[0];
  const entry = roster.entries.find((item) => item.id === entryId);
  return { tab: roster.id, entryId: entry?.id, recovered: roster.id !== tab || (!!entryId && !entry) };
}
```

Map legacy Experience and Projects identifiers when the entry still exists. Map removed or Trainer-only legacy routes to `/` or the nearest valid roster tab.

- [ ] **Step 7: Replace application routes and verify GREEN**

Define `/`, `/pokemon/:tab`, `/pokemon/:tab/:entryId`, `/pc/:boxId`, `/pc/:boxId/:entryId`, and catch-all routes. Legacy routes render `<Navigate replace>` to `legacyPcPath(...)`.

Run: `npm test -- src/data/portfolioData.test.ts src/navigation/routes.test.ts src/app/App.test.tsx`

Expected: all focused tests PASS.

- [ ] **Step 8: Commit the content and route foundation**

```bash
git add public/resume.pdf src/data src/navigation src/app/App.tsx src/app/App.test.tsx
git commit -m "feat: refresh roster content and routes"
```

### Task 2: Build the Trainer Card and Walking Companion Scene

**Files:**
- Create: `src/profile/TrainerWalkScene.tsx`
- Create: `src/profile/TrainerWalkScene.test.tsx`
- Modify: `src/profile/TrainerProfile.tsx`
- Modify: `src/profile/TrainerProfile.test.tsx`
- Create: `public/trainer-walk.png`
- Create: `public/gengar-companion.png`
- Remove: `src/profile/TrainerAvatar.tsx`
- Remove: `src/profile/TrainerAvatar.test.tsx`
- Remove: `public/trainer-avatar.png`

**Interfaces:**
- Consumes: `trainerProfile`, `pokemonPath('experience')`, `/resume.pdf`, Keshav's photo reference, and the supplied Gengar reference.
- Produces: `TrainerWalkScene({ trainerSrc, companionSrc, label })` and revised `TrainerProfile()`.

- [ ] **Step 1: Generate and inspect the walking sprite sheet**

Use the image generation skill with `/Users/keshavgoel/Downloads/id_photo.png` as the trainer reference and this exact art brief:

```text
Create a transparent horizontal three-frame overworld walking sprite sheet. In every equal-width frame, show the same compact side-facing young South Asian trainer based on the supplied photo: dark wavy hair, medium-brown skin, black suit, white dress shirt. Frame 1 is a left-foot pose, frame 2 a passing pose, and frame 3 a right-foot pose. Keep the trainer centered, walking in place, aligned to one shared baseline, and consistent in size and palette. Crisp hard-edged low-resolution pixel art, no antialiasing, no Poké Ball, cap, franchise trainer clothing, logos, badges, UI, text, scenery, other character, or copied game pose.
```

Inspect the sheet for three equal frames, Keshav's recognizable hair/suit/skin tone, legibility at card size, transparent corners, a consistent baseline, and absence of copied game UI or extracted sprites. Save it as `public/trainer-walk.png`. Because combined generation is rejected by the image service, crop the central companion from Keshav's supplied Gengar reference, remove only its flat light background with the image-generation skill's chroma helper, and save the resulting transparent art as `public/gengar-companion.png`. Preserve the supplied pixels; do not synthesize a replacement character.

- [ ] **Step 2: Write failing walking-scene and Trainer Card tests**

```tsx
expect(screen.getByRole('heading', { name: 'Trainer Card' })).toBeVisible();
expect(screen.getByText('Northeastern University')).toBeVisible();
expect(screen.getByText('May 2028')).toBeVisible();
expect(screen.getByText('Data Science')).toBeVisible();
expect(screen.getByText('Boston, MA')).toBeVisible();
expect(screen.getByRole('link', { name: "Keshav's Pokémon" })).toHaveAttribute('href', '/pokemon/experience');
expect(screen.getByRole('img', { name: 'Keshav walking with Gengar' })).toBeVisible();
expect(screen.getByTestId('trainer-walk-strip')).toHaveAttribute('src', '/trainer-walk.png');
expect(screen.getByTestId('trainer-companion')).toHaveAttribute('src', '/gengar-companion.png');
expect(screen.getByRole('link', { name: "Keshav's Pokémon" })).toHaveClass('trainer-roster-card');
```

In `TrainerWalkScene.test.tsx`, assert stable `trainer-walk-scene`, `trainer-walk-strip`, and `trainer-walk-companion` classes. Fire an error on either source and assert the single labeled fallback `Keshav walking with Gengar unavailable` replaces the scene.

- [ ] **Step 3: Run tests to verify RED**

Run: `npm test -- src/profile/TrainerWalkScene.test.tsx src/profile/TrainerProfile.test.tsx`

Expected: FAIL because the walking-scene component and separate roster-card contract do not exist.

- [ ] **Step 4: Implement the focused walking scene**

```tsx
export function TrainerWalkScene({ trainerSrc, companionSrc, label }: { trainerSrc: string; companionSrc: string; label: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div role="img" aria-label={`${label} unavailable`}>{label}</div>;
  return (
    <div className="trainer-walk-scene" role="img" aria-label={label}>
      <img data-testid="trainer-companion" className="trainer-walk-companion" src={companionSrc} alt="" onError={() => setFailed(true)} />
      <img data-testid="trainer-walk-strip" className="trainer-walk-strip" src={trainerSrc} alt="" onError={() => setFailed(true)} />
    </div>
  );
}
```

Style the trainer sheet as three equal horizontal frames using an overflow-hidden viewport and `animation-timing-function: steps(3)`. Layer the companion behind the trainer and animate it with a subtle CSS bob synchronized to the trainer loop. The pair remains centered and walks in place. Under `@media (prefers-reduced-motion: reduce)`, disable both animations and show the trainer's first frame. Do not add sound or a JavaScript animation loop.

- [ ] **Step 5: Implement semantic Trainer Card markup**

Use one `<main className="trainer-screen">`, a heading, definition list for the five exact fields, walking viewport, and original text/icon links for résumé/GitHub/LinkedIn/email. Render the `Keshav's Pokémon` link below and outside the Trainer Card as a separate raised rectangular `.trainer-roster-card` with visible focus and pressed hover/active states. No visible experience cards remain on the landing page.

- [ ] **Step 6: Verify and commit the Trainer Card**

Run: `npm test -- src/profile/TrainerWalkScene.test.tsx src/profile/TrainerProfile.test.tsx src/app/App.test.tsx`

Expected: all focused tests PASS.

```bash
git add public/trainer-walk.png public/gengar-companion.png src/profile src/styles/global.css
git commit -m "feat: add trainer walking scene"
```

### Task 3: Convert the PC Grid into the Two-Tab Party Roster

**Files:**
- Modify: `src/pc/CareerPC.tsx`
- Modify: `src/pc/CreatureGrid.tsx`
- Modify: `src/pc/CareerPC.test.tsx`

**Interfaces:**
- Consumes: `rosterTabs`, `pokemonPath`, `resolvePokemonRoute`, `PixelSprite`, `playBleep`.
- Produces: two-tab route-driven `CareerPC` and party-style `CreatureGrid`.

- [ ] **Step 1: Write failing roster tests**

```tsx
expect(screen.getAllByRole('tab')).toHaveLength(2);
expect(screen.getByRole('tab', { name: 'Experience' })).toHaveAttribute('aria-selected', 'true');
expect(screen.getByRole('button', { name: 'Draftion: DraftKings' })).toBeVisible();
expect(screen.queryByText('Generate')).not.toBeInTheDocument();
expect(screen.queryByText('VDart')).not.toBeInTheDocument();
```

Add a Projects-tab click test that verifies URL `/pokemon/projects` and visible Remetra, ForgetMeNot, and BreatheEasy cards. Preserve arrow-key roving focus, Enter/Space activation, sound-after-opt-in, and no-autoplay tests.

- [ ] **Step 2: Run tests to verify RED**

Run: `npm test -- src/pc/CareerPC.test.tsx`

Expected: FAIL because the current PC renders three boxes and old routes.

- [ ] **Step 3: Implement the two-tab roster shell**

Render exactly two route links with tab semantics and one persistent tabpanel. Remove the Quick Menu from the roster; retain a visible Back to Trainer Card link and Sound control. Reuse the route-safe recovery status region.

- [ ] **Step 4: Implement party-style roster cards**

Each button renders `PixelSprite`, creature name, organization/project, role/category, and a decorative bar labeled `Entry complete` for assistive technology. Do not expose HP, level, gender, or invented scores. Preserve the existing roving focus and route navigation.

- [ ] **Step 5: Verify and commit the roster**

Run: `npm test -- src/pc/CareerPC.test.tsx src/pc/PixelSprite.test.tsx`

Expected: all focused tests PASS.

```bash
git add src/pc/CareerPC.tsx src/pc/CreatureGrid.tsx src/pc/CareerPC.test.tsx
git commit -m "feat: add two-tab professional roster"
```

### Task 4: Convert the Entry Panel into a Route-Driven Dialog

**Files:**
- Modify: `src/pc/PokedexEntry.tsx`
- Modify: `src/pc/PokedexEntry.test.tsx`
- Modify: `src/pc/CareerPC.tsx`
- Modify: `src/pc/CareerPC.test.tsx`

**Interfaces:**
- Consumes: selected `CareerEntry`, `pokemonPath(tab)`, current launching card ref.
- Produces: `PokedexEntry({ entry, onClose }): JSX.Element` with dialog semantics and focus management.

- [ ] **Step 1: Write failing dialog tests**

```tsx
expect(screen.getByRole('dialog', { name: 'Draftion details' })).toBeVisible();
expect(screen.getByRole('heading', { name: 'DraftKings' })).toBeVisible();
expect(screen.getByText('Jun 2026 - Present')).toBeVisible();
expect(screen.getByText('Boston, MA')).toBeVisible();
expect(screen.getByText(/20\+ hrs\/week/i)).toBeVisible();
```

Add tests for Escape close to `/pokemon/experience`, close-button focus restoration to `Draftion: DraftKings`, Tab/Shift+Tab focus wrapping inside the dialog, direct URL reconstruction, and invalid-entry recovery to the correct tab.

- [ ] **Step 2: Run tests to verify RED**

Run: `npm test -- src/pc/PokedexEntry.test.tsx src/pc/CareerPC.test.tsx`

Expected: FAIL because the entry is currently an inline article.

- [ ] **Step 3: Implement semantic dialog content**

Use `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`. Render visible creature name, sprite, organization/project heading, role/category, Experience dates/location only, professional type, highlight, source-verified move list, optional external link, and Close button.

- [ ] **Step 4: Implement focus and route behavior**

On open, focus the Close button. Capture Tab and Shift+Tab to wrap through the dialog's focusable elements. Escape navigates with `replace` to `pokemonPath(tab)`. On close, restore focus to the launching card by stable entry ID after the route updates. Browser Back naturally removes the `entryId` segment.

- [ ] **Step 5: Verify and commit the dialog**

Run: `npm test -- src/pc/PokedexEntry.test.tsx src/pc/CareerPC.test.tsx src/app/App.test.tsx`

Expected: all dialog and route tests PASS.

```bash
git add src/pc/PokedexEntry.tsx src/pc/PokedexEntry.test.tsx src/pc/CareerPC.tsx src/pc/CareerPC.test.tsx
git commit -m "feat: add route-driven roster details dialog"
```

### Task 5: Add WPS and Remetra Sprites without Removing Existing Art

**Files:**
- Create: `src/assets/sprites/wps-data-lab-a.svg`
- Create: `src/assets/sprites/wps-data-lab-b.svg`
- Create: `src/assets/sprites/remetra-a.svg`
- Create: `src/assets/sprites/remetra-b.svg`
- Modify: `src/pc/PixelSprite.tsx`
- Modify: `src/pc/PixelSprite.test.tsx`

**Interfaces:**
- Consumes: updated `spriteId` values from visible entries.
- Produces: closed registry entries for `wps-data-lab` and `remetra`, while preserving all existing registry imports/files.

- [ ] **Step 1: Write failing preservation and resolution tests**

```tsx
for (const spriteId of ['wps-data-lab', 'remetra']) {
  render(<PixelSprite spriteId={spriteId} label={spriteId} animate />);
  expect(screen.getByRole('img', { name: spriteId })).toBeVisible();
}
```

Also assert preserved old IDs `generex` and `dartbyte` still resolve without fallback, even though they are absent from the visible roster.

- [ ] **Step 2: Run the sprite tests to verify RED**

Run: `npm test -- src/pc/PixelSprite.test.tsx`

Expected: FAIL for the two new IDs.

- [ ] **Step 3: Draw original two-frame SVGs**

Create 32-by-32, rectangle-only, integer-coordinate SVGs with `shape-rendering="crispEdges"`. WPS should suggest data research through an original abstract document-and-signal silhouette; Remetra should suggest symptom tracking through an original abstract calendar-and-connection silhouette. Use the revised visual palette only, and avoid balls, franchise creatures, logos, or copied silhouettes.

- [ ] **Step 4: Register the new frames and verify preservation**

Import and register both A/B frame pairs in the closed registry. Do not delete or rename any prior import or file.

Run: `npm test -- src/pc/PixelSprite.test.tsx src/data/portfolioData.test.ts`

Expected: all sprite and data tests PASS.

- [ ] **Step 5: Commit the additive sprite update**

```bash
git add src/assets/sprites src/pc/PixelSprite.tsx src/pc/PixelSprite.test.tsx
git commit -m "feat: add updated roster sprites"
```

### Task 6: Match the Supplied Handheld References Responsively

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/global.css`
- Modify: `src/profile/TrainerProfile.tsx`
- Modify: `src/profile/TrainerProfile.test.tsx`
- Modify: `src/profile/TrainerWalkScene.test.tsx`
- Replace: `public/trainer-walk.png`
- Replace: `public/gengar-companion.png`
- Modify: `index.html`

**Interfaces:**
- Consumes: Trainer Card, roster, dialog, sprite, focus, sound, and reduced-motion hooks.
- Produces: the approved reference-matched presentation and compact chibi walking scene at mobile, tablet, and desktop sizes.

- [ ] **Step 1: Replace the palette tokens**

Define one consistent theme using values sampled from the references:

```css
:root {
  --ink: #0c1720;
  --screen-blue: #5596df;
  --panel-cyan: #a9d8f3;
  --steel-dark: #596875;
  --steel-light: #cbd4d8;
  --status-green: #35d34a;
  --screen-white: #f4f8f7;
  --select-red: #d94545;
  --select-blue: #2877c8;
  --focus: #ffd84d;
}
```

Do not add unapproved decorative colors.

- [ ] **Step 2: Style the Trainer Card**

Create a blue full-width card with a thick layered steel frame, cyan field rows, right-side avatar panel, large pixel title, original bottom icon strip, and primary roster button below. Preserve normal document flow and semantic headings; do not render copied badge shapes.

- [ ] **Step 3: Write failing chibi-scene contract tests**

```tsx
expect(screen.getByTestId('trainer-walk-strip')).toHaveAttribute('src', '/trainer-walk.png');
expect(screen.getByTestId('trainer-companion')).toHaveAttribute('src', '/gengar-companion.png');
expect(screen.getByTestId('trainer-walk-strip')).toHaveClass('trainer-walk-strip');
expect(screen.getByTestId('trainer-companion')).toHaveClass('trainer-walk-companion');
expect(screen.getByRole('main')).toHaveAttribute('data-reduced-motion');
```

Extend the style contract to require `image-rendering: pixelated`, a 32-to-48-pixel trainer display height, a smaller companion, right-facing same-direction transforms, companion placement behind and slightly above the trainer, and applicable selectors for both `@media (prefers-reduced-motion: reduce)` and `[data-reduced-motion="true"]` on the Trainer route.

- [ ] **Step 4: Run the new contracts to verify RED**

Run: `npm test -- src/profile/TrainerWalkScene.test.tsx src/profile/TrainerProfile.test.tsx src/styles/global.test.ts`

Expected: FAIL because the current portrait-proportioned assets and Trainer route data-reduced-motion hook do not meet the approved chibi contract.

- [ ] **Step 5: Replace the scene with compact chibi assets**

Generate a transparent three-frame strip from `/Users/keshavgoel/Downloads/id_photo.png`: an original right-facing chibi Keshav approximately two heads tall, oversized dark wavy hair, medium-brown skin, compact black suit and white shirt, tiny left/neutral/right walking poses, equal frame widths and baseline. Use a flat `#00ff00` background and the image-generation skill's chroma helper. Replace `public/trainer-walk.png`.

Transform the user-supplied Gengar reference at `/var/folders/bb/hsp4zv4n1j90qvy7v635c_m40000gn/T/codex-clipboard-e16bb6fc-bf6a-4b5c-b83b-b37cc0f7bb02.png` into a compact right-facing mini companion on a flat removable background. Preserve the recognizable purple silhouette, red eyes, and grin while redrawing it at the trainer's chibi pixel scale; do not use an extracted game sprite. Replace `public/gengar-companion.png`. If combined image generation is rejected, process the trainer and companion in separate image-generation calls.

Style the trainer at 32 to 48 pixels tall on screen with nearest-neighbor rendering. Style Gengar slightly smaller, behind and slightly above Keshav, and facing right. Keep the pair centered and walking in place.

- [ ] **Step 6: Style the roster and modal**

Use charcoal screen background, two-column party cards at 768 pixels and above, one column below, layered metallic borders, white outlined labels, green decorative bars, and crisp enlarged sprites. The dialog overlays the roster with blue/steel panels and remains within the viewport at 320 pixels.

- [ ] **Step 7: Preserve accessibility, contrast, and reduced motion**

All links/buttons maintain 44-pixel targets. Focus uses `--focus` independently of selected state. Put `data-reduced-motion` on the Trainer route's `<main>` using the same preferences hook as the roster so its selectors actually apply. Under system or data-attribute reduced motion, disable Trainer Card entrance, chibi walking/floating, roster movement, dialog transition, and two-frame sprites while leaving all content visible.

Replace white-on-`--screen-blue` and white-on-`--select-blue` text treatments that measure below WCAG thresholds. Use `--ink` on pale/bright blue fields, a darker blue backplate, or a complete four-direction high-contrast outline. Verify body/small text reaches 4.5:1 and large text reaches 3:1 against its actual rendered surface.

- [ ] **Step 8: Run automated and static responsive checks**

Run: `npm test && npm run build`

Expected: all tests PASS and production build succeeds.

Statically verify no horizontal overflow assumptions at 320 pixels, roster one-column source order, dialog width constraints, and two-column roster at 768 and 1440 pixels.

- [ ] **Step 9: Commit the reference-matched visual system**

```bash
git add public/trainer-walk.png public/gengar-companion.png src/profile src/styles index.html
git commit -m "feat: match handheld portfolio references"
```

### Task 7: Complete Browser Verification, Documentation, and Push Readiness

**Files:**
- Modify: `README.md`
- Modify: `src/app/App.test.tsx`

**Interfaces:**
- Consumes: completed Trainer Card, roster, dialog, routes, assets, résumé, sound, and styles.
- Produces: verified deployable build and updated project documentation.

- [ ] **Step 1: Add final route-level integration tests**

Test root Trainer Card fields; `/pokemon/experience/draftkings` dialog reconstruction; `/pokemon/projects/remetra`; legacy `/pc/experience/draftkings` redirect; invalid project recovery; and catch-all redirect.

- [ ] **Step 2: Update README**

Describe the three-screen flow, two roster tabs, updated résumé source, original artwork policy, local commands, direct-route rewrite requirement, and that deployment/DNS changes require explicit approval.

- [ ] **Step 3: Run fresh release verification**

Run:

```bash
npm test
npm run build
git diff --check
cmp /Users/keshavgoel/Downloads/Keshav_Goel_Resume.pdf public/resume.pdf
```

Expected: all tests pass, build exits 0, diff check is clean, and résumé comparison exits 0.

- [ ] **Step 4: Run live browser verification**

At 320, 768, and 1440 pixels verify:

- Trainer Card fields, avatar, links, and no horizontal overflow.
- Keshav's Pokémon opens Experience.
- Exactly two tabs and correct visible entries.
- Every one of the eight roster cards opens the matching dialog.
- Escape, Close, browser Back, focus trap, and focus restoration work.
- Direct and legacy routes recover correctly.
- Sound defaults off, plays only after opt-in, and console remains clean.
- Reduced-motion behavior is verified when browser emulation supports it; otherwise record automated and CSS evidence.

- [ ] **Step 5: Commit final documentation and integration tests**

```bash
git add README.md src/app/App.test.tsx
git commit -m "test: verify trainer roster redesign"
```

- [ ] **Step 6: Confirm push scope without deploying**

Run: `git status -sb && git log --format='%an <%ae>' origin/main..HEAD | sort -u`

Expected: clean `main` ahead of `origin/main`; only `Keshav Goel <141261924+keshavgoel787@users.noreply.github.com>` appears. Push only after the complete review gate; do not deploy or modify DNS.
