# Roster Names, Animation, and Desktop Fit Design

## Goal

Make the single-page portfolio clearer and more compact by using real professional names, animating every roster sprite, and fitting the complete interface within a typical 14-inch MacBook Pro desktop viewport without page scrolling.

## Profile Card

- Rename the `Hometown` field label to `Current Location`.
- Keep the displayed value as `Boston, MA`.
- Preserve the existing trainer animation, professional links, colors, and visual style.

## Roster Naming

- Remove all fictional Pokémon-style names from experience and project entries.
- Experience entries use the company or organization name as their primary name.
- Project entries use the project name as their primary name.
- Update cards, accessible names, selected states, popup headings, popup labels, route reconstruction, and tests to use these real names consistently.
- Preserve the existing role, category, description, dates, links, sprites, and routes.

## Sprite Animation

- Every visible roster sprite receives the animated two-frame treatment.
- Animation must not depend on selection or keyboard focus.
- Selected-entry styling remains independent from sprite animation.
- Preserve the existing reduced-motion behavior: users requesting reduced motion receive a stable first frame.

## Desktop Viewport Fit

- Optimize for a 14-inch MacBook Pro browser viewport, using `1440 × 900` CSS pixels as the verification target.
- The trainer card and full active roster must fit on one screen without horizontal or vertical page scrolling.
- Achieve the fit through targeted reductions to outer padding, section gaps, card heights, typography, and sprite sizing.
- Do not apply a global transform or browser-like zoom that would blur pixels or reduce readability.
- Preserve the stacked trainer-card-above-roster layout and the existing popup behavior.

## Testing and Verification

- Update data and component tests for the new labels and real entry names.
- Add coverage proving every visible grid sprite is rendered with animation enabled.
- Add or update stylesheet checks for the compact desktop layout.
- Run the complete automated test suite and production build.
- Verify at `1440 × 900` in a real browser that the page has no overflow, every roster sprite animates, and a project popup still opens correctly.

