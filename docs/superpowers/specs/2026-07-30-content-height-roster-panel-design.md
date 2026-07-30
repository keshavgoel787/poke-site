# Content-Height Roster Panel Design

## Goal

Remove the large unused black area beneath the Experience and Projects cards while preserving the compact stacked portfolio layout.

## Layout

- On compact desktop viewports, allow the Pokémon roster panel to size itself to its active content rather than fill all remaining viewport height.
- Keep the tab controls and card grid aligned at the top of the panel.
- End the dark panel background and outer pixel border shortly after the final card row.
- Apply the behavior consistently to both Experience and Projects.
- Preserve the existing two-column card grid, card dimensions, trainer card, navigation, animation, and popup behavior.

## Responsive Behavior

- Target the existing compact desktop breakpoint used for 14-inch laptop layouts.
- Do not globally scale or zoom the interface.
- Preserve the current mobile and taller-desktop behavior unless the same content-height sizing is already natural there.
- Keep the complete page within `1440 × 900` without horizontal or vertical scrolling.

## Verification

- Add a stylesheet regression test proving the compact desktop layout no longer forces the roster panel into a flexible remaining-height track.
- Run the complete automated test suite and production build.
- Verify Experience and Projects at `1440 × 900` in a browser:
  - no page overflow;
  - panel ends after the final card row;
  - cards remain top-aligned;
  - sprites still animate;
  - project popup still opens.

