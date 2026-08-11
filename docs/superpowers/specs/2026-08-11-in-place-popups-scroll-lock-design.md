# In-Place Popups and Global Scroll Lock Design

## Goal

Open professional-entry details as true in-page popups without changing the
current URL, while keeping the full portfolio locked to a single desktop
viewport with no document scrolling.

## Entry Selection Model

- Add local selected-entry state to `CareerPC` for interactions launched from
  roster cards.
- Clicking, pressing Enter, or pressing Space on a card opens its details in
  the existing native `<dialog>` without calling React Router navigation.
- The active tab URL remains unchanged while the popup is open.
- Experience and Projects tabs remain route-backed so each roster is still
  directly linkable.
- Existing direct entry URLs remain supported. Loading a URL such as
  `/pokemon/projects/remetra` reconstructs the same dialog from the route.
- Route-derived selection is used only when an entry segment is present;
  otherwise local selection controls the popup.

## Closing and History Behavior

- Close, Escape, and clicking the dialog backdrop dismiss a locally launched
  popup by clearing local selection. They do not change the URL or browser
  history.
- Closing a popup reconstructed from a direct entry URL replaces the address
  with its active tab URL, preserving the current direct-link recovery
  behavior without adding another history entry.
- After any close method, focus returns to the card that launched or represents
  the selected entry.
- Clicking inside the dialog content must not trigger backdrop dismissal.

## Accessibility

- Continue using the native `<dialog>` element and `showModal()`.
- Preserve `aria-modal`, the labelled dialog title, focus trapping, and initial
  focus on Close.
- Keep the underlying roster panel inert and `aria-hidden` while either local
  or route-derived entry details are open.
- Keyboard selection and card `aria-pressed` state must reflect the displayed
  entry without relying on the URL.

## Global Scroll Lock

- Lock `html`, `body`, and `#root` to the viewport height using `100dvh`.
- Disable document scrolling with `overflow: hidden`.
- Keep the existing Trainer Card and roster stacked within the fixed viewport;
  preserve the current compact desktop breakpoints and visual styling.
- Allow `dialog.pokedex-entry[open]` to scroll internally when its content is
  taller than the available viewport.
- Do not introduce nested scrolling anywhere outside the dialog.

## Recovery and Edge Cases

- Invalid tab and entry routes continue recovering to a valid roster route and
  show the existing recovery message.
- Switching tabs clears local selection before showing the newly selected
  roster, so a popup from the previous tab cannot remain open.
- A route-derived entry that does not exist must never create an empty dialog.

## Verification

- Add component tests proving card clicks and keyboard selection open dialogs
  without changing the current path.
- Preserve tests proving direct entry URLs reconstruct dialogs and close back to
  the active tab route.
- Test Close, Escape, and backdrop dismissal for local selection and focus
  restoration.
- Add stylesheet regression coverage for viewport locking, document overflow
  suppression, and dialog-only internal scrolling.
- Run the complete unit suite and production build.
- At the compact 14-inch MacBook Pro desktop viewport, verify both tabs, local
  popups, direct-route popups, all closing methods, zero document scroll, no
  clipped content, and no console errors.
