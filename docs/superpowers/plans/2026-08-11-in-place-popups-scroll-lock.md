# In-Place Popups and Global Scroll Lock Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Open roster details as local in-page dialogs without changing the active roster URL and lock the portfolio document to one viewport while retaining direct detail links.

**Architecture:** `CareerPC` will combine route-derived selection for direct URLs with local selection for card interactions. `PokedexEntry` remains the accessible modal boundary and gains backdrop detection, while global CSS owns document scroll locking and leaves overflow only inside the dialog.

**Tech Stack:** React, React Router, TypeScript, native HTML `<dialog>`, CSS, Vitest, Testing Library

## Global Constraints

- Card clicks, Enter, and Space must open details without changing the current URL.
- Experience and Projects tabs remain route-backed and directly linkable.
- Direct entry URLs continue reconstructing the matching popup.
- Close, Escape, and backdrop dismissal restore focus to the selected card.
- Clicking inside dialog content must not dismiss the popup.
- Lock `html`, `body`, and `#root` to `100dvh` with document scrolling disabled.
- Only `dialog.pokedex-entry[open]` may scroll internally.
- Preserve the current layout, visual styling, animations, sound, and invalid-route recovery.

---

### Task 1: Decouple Interactive Popup Selection from Routing

**Files:**
- Modify: `src/pc/CareerPC.tsx`
- Modify: `src/pc/CareerPC.test.tsx`
- Modify: `src/app/App.test.tsx`

**Interfaces:**
- Consumes: `resolvedRoute.entryId`, the active `box.entries`, and `CreatureGrid.onSelect(entryId)`.
- Produces: `localSelectedEntryId: string | null`, a unified `selectedEntry`, and close behavior that distinguishes local selection from direct-route selection.

- [ ] **Step 1: Replace route-change expectations with local-popup expectations**

Update card click and keyboard tests in `src/pc/CareerPC.test.tsx` so the current
path stays at its active tab while the dialog opens:

```ts
await user.click(screen.getByRole('button', { name: 'DraftKings' }));

expect(screen.getByTestId('current-route')).toHaveTextContent(
  /^\/pokemon\/experience$/,
);
expect(
  screen.getByRole('dialog', { name: 'DraftKings details' }),
).toBeVisible();
```

Apply the same unchanged-route assertion to Enter and Space selection. Keep the
existing direct-route reconstruction assertions unchanged. Update any app-level
test that assumes an interactive card click creates an entry URL.

- [ ] **Step 2: Add local close and tab-change regression tests**

Add tests proving local popup state clears without history mutation and restores
focus:

```ts
const launcher = screen.getByRole('button', { name: 'DraftKings' });
await user.click(launcher);
await user.click(screen.getByRole('button', { name: 'Close' }));

expect(screen.getByTestId('current-route')).toHaveTextContent(
  /^\/pokemon\/experience$/,
);
expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
expect(launcher).toHaveFocus();
```

Add a programmatic tab-route test that opens a local entry, navigates to
`/pokemon/projects`, and confirms no dialog remains. Preserve the direct-route
close test proving `/pokemon/projects/remetra` replaces to `/pokemon/projects`.

- [ ] **Step 3: Run the component tests and verify they fail**

Run:

```bash
npm test -- src/pc/CareerPC.test.tsx src/app/App.test.tsx
```

Expected: FAIL because `selectEntry()` still navigates to an entry route.

- [ ] **Step 4: Introduce local selection and unify displayed entry state**

In `CareerPC`, derive route selection separately and add local state:

```ts
const routeSelectedEntry = box.entries.find(
  (entry) => entry.id === resolvedRoute.entryId,
);
const [localSelectedEntryId, setLocalSelectedEntryId] = useState<string | null>(
  null,
);
const localSelectedEntry = box.entries.find(
  (entry) => entry.id === localSelectedEntryId,
);
const selectedEntry = routeSelectedEntry ?? localSelectedEntry;
```

Change `selectEntry()` to retain its launcher/focus bookkeeping and sound, then
replace navigation with:

```ts
setLocalSelectedEntryId(selectedId);
```

In the existing `box.id` effect, also clear local selection:

```ts
setLocalSelectedEntryId(null);
```

- [ ] **Step 5: Make closing and focus restoration selection-source aware**

Replace `previousEntryIdRef` with a ref tracking `selectedEntry?.id`, and make its
focus-restoration effect depend on `selectedEntry?.id`. When a selected ID
disappears, locate and focus the matching card using the existing
`aria-describedby` contract.

Implement close behavior as:

```ts
const closeEntry = () => {
  if (routeSelectedEntry) {
    navigate(pokemonPath(resolvedRoute.tab), { replace: true });
    return;
  }

  setLocalSelectedEntryId(null);
};
```

Use the unified `selectedEntry` for `selectedCardId`, panel inertness,
`aria-hidden`, and `PokedexEntry` rendering.

- [ ] **Step 6: Run the focused tests and commit**

Run:

```bash
npm test -- src/pc/CareerPC.test.tsx src/app/App.test.tsx
```

Expected: all focused tests pass.

Commit:

```bash
git add src/pc/CareerPC.tsx src/pc/CareerPC.test.tsx src/app/App.test.tsx
git commit -m "feat: open career details without navigation"
```

---

### Task 2: Add Backdrop Dismissal Without Breaking Dialog Content

**Files:**
- Modify: `src/pc/PokedexEntry.tsx`
- Modify: `src/pc/PokedexEntry.test.tsx`

**Interfaces:**
- Consumes: `PokedexEntry.onClose` and pointer coordinates from a dialog click.
- Produces: Backdrop-only dismissal while preserving all content interactions.

- [ ] **Step 1: Add failing backdrop and content-click tests**

Add to `src/pc/PokedexEntry.test.tsx`:

```ts
it('requests close only when a click lands outside the dialog bounds', () => {
  const onClose = vi.fn();
  render(<PokedexEntry entry={amazon} onClose={onClose} />);
  const dialog = screen.getByRole('dialog', { name: 'Amazon details' });

  vi.spyOn(dialog, 'getBoundingClientRect').mockReturnValue({
    left: 100,
    right: 500,
    top: 100,
    bottom: 500,
    width: 400,
    height: 400,
    x: 100,
    y: 100,
    toJSON: () => ({}),
  });

  fireEvent.click(dialog, { clientX: 50, clientY: 50 });
  expect(onClose).toHaveBeenCalledTimes(1);
});
```

Add a second test clicking the visible highlight paragraph at coordinates inside
the mocked rectangle and assert `onClose` is not called.

- [ ] **Step 2: Run the dialog tests and verify they fail**

Run:

```bash
npm test -- src/pc/PokedexEntry.test.tsx
```

Expected: FAIL because the dialog has no click-boundary handler.

- [ ] **Step 3: Implement coordinate-based backdrop detection**

Import `MouseEvent` from React and add:

```ts
const closeFromBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
  if (event.target !== event.currentTarget) {
    return;
  }

  const bounds = event.currentTarget.getBoundingClientRect();
  const outside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (outside) {
    onClose();
  }
};
```

Attach `onClick={closeFromBackdrop}` to the `<dialog>`. Keep the existing Cancel
and Escape handlers unchanged.

- [ ] **Step 4: Run focused tests and commit**

Run:

```bash
npm test -- src/pc/PokedexEntry.test.tsx src/pc/CareerPC.test.tsx
```

Expected: all focused dialog and integration tests pass.

Commit:

```bash
git add src/pc/PokedexEntry.tsx src/pc/PokedexEntry.test.tsx
git commit -m "feat: close detail popup from backdrop"
```

---

### Task 3: Lock the Document and Keep Dialog Overflow Accessible

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/styles/global.test.ts`

**Interfaces:**
- Consumes: the existing root, trainer-screen, and dialog layout rules.
- Produces: one fixed `100dvh` page canvas and dialog-only overflow scrolling.

- [ ] **Step 1: Add failing viewport-lock regression assertions**

Add to `src/styles/global.test.ts`:

```ts
it('locks the site to one viewport and reserves overflow for dialogs', () => {
  expect(declarationsFor('html:root')).toMatch(/height:\s*100dvh;/);
  expect(declarationsFor('html:root')).toMatch(/overflow:\s*hidden;/);
  expect(declarationsFor('body')).toMatch(/height:\s*100dvh;/);
  expect(declarationsFor('body')).toMatch(/overflow:\s*hidden;/);
  expect(declarationsFor('#root')).toMatch(/height:\s*100dvh;/);
  expect(declarationsFor('#root')).toMatch(/overflow:\s*hidden;/);
  expect(declarationsFor('dialog.pokedex-entry[open]')).toMatch(
    /max-height:\s*calc\(100dvh - 1rem\);/,
  );
  expect(declarationsFor('dialog.pokedex-entry[open]')).toMatch(
    /overflow:\s*auto;/,
  );
});
```

- [ ] **Step 2: Run the stylesheet test and verify it fails**

Run:

```bash
npm test -- src/styles/global.test.ts
```

Expected: FAIL because the document elements are not all viewport-locked.

- [ ] **Step 3: Implement the global scroll lock**

Update the existing rules without adding a new scroll container:

```css
html:root {
  width: 100%;
  height: 100dvh;
  overflow: hidden;
}

body {
  width: 100%;
  height: 100dvh;
  min-height: 0;
  overflow: hidden;
}

#root {
  height: 100dvh;
  overflow: hidden;
}
```

Keep `dialog.pokedex-entry[open]` at `max-height: calc(100dvh - 1rem)` and
`overflow: auto`. Do not add overflow to `.trainer-screen`, `.trainer-card`,
`.career-pc`, or the tab panel.

- [ ] **Step 4: Run focused tests and commit**

Run:

```bash
npm test -- src/styles/global.test.ts
```

Expected: all stylesheet tests pass.

Commit:

```bash
git add src/styles/global.css src/styles/global.test.ts
git commit -m "style: lock portfolio to viewport"
```

---

### Task 4: Verify the Complete Interaction and Viewport

**Files:**
- Modify only if evidence requires correction: `src/pc/CareerPC.tsx`
- Modify only if evidence requires correction: `src/pc/PokedexEntry.tsx`
- Modify only if evidence requires correction: `src/styles/global.css`
- Add a matching regression to the corresponding test file for every correction.

**Interfaces:**
- Consumes: Tasks 1–3.
- Produces: verified local and direct-route popups with a non-scrolling page at `1512 × 982`.

- [ ] **Step 1: Run complete automated verification**

Run:

```bash
npm test
npm run build
git diff --check
```

Expected: all tests pass, the production build succeeds, and no whitespace
errors are reported.

- [ ] **Step 2: Start the site and verify local popup behavior**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

At `1512 × 982`, click a card in each tab and confirm:

- The pathname does not change when the dialog opens.
- Close, Escape, and backdrop click dismiss the dialog.
- Clicking inside dialog content leaves it open.
- Focus returns to the launching card.
- The roster panel is inert while the dialog is open.

- [ ] **Step 3: Verify direct-route compatibility and scroll locking**

Open `/pokemon/projects/remetra` directly and confirm the dialog reconstructs.
Close it and confirm the path becomes `/pokemon/projects` via replacement.

On the root route, both tab routes, and while each popup is open, confirm:

```js
document.documentElement.scrollHeight === window.innerHeight &&
document.body.scrollHeight === window.innerHeight &&
document.documentElement.scrollWidth === window.innerWidth
```

Confirm an intentionally short viewport keeps the document fixed while an
oversized dialog remains internally scrollable.

- [ ] **Step 4: Verify visual and runtime quality**

Confirm the Trainer Card and roster remain fully visible, no labels clip, no
unexpected nested scrollbar appears, and the console contains no errors.

- [ ] **Step 5: Run final verification and commit evidence-backed corrections**

If browser verification required changes, add the corresponding regression and
commit only those corrections. Then run:

```bash
npm test
npm run build
git diff --check
```

Expected: all checks pass.
