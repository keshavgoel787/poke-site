# Pixel Landscape Background Design

## Goal

Replace the plain dark page background with an original pixel-art landscape that adds atmosphere without competing with the portfolio interface.

## Art Direction

- Create an original 16-bit late-afternoon landscape.
- Use a pale blue upper sky transitioning to warm gold near the horizon.
- Include blocky pixel clouds, layered dark-green hills, a grassy meadow, small flowers, and a winding light-colored path.
- Keep the central composition visually quiet so the trainer and roster panels remain dominant.
- Do not include Pokémon, trainers, logos, text, buildings, or copied game assets.
- Match the portfolio's crisp pixel aesthetic and Kanto-inspired color character.

## Page Treatment

- Use the generated artwork as a full-page background.
- Render it with `background-size: cover` and a stable centered position.
- Add a subtle translucent dark-blue overlay between the artwork and the application panels to maintain contrast.
- Keep the artwork fixed and static; do not add parallax or animation.
- Preserve pixel sharpness and avoid blurred scaling where practical.

## Responsive Behavior

- Cover desktop screens without tiling or exposed fallback color.
- Preserve a recognizable sky, horizon, hills, and meadow at `1440 × 900`.
- Maintain current page dimensions and no-scroll behavior.
- Keep existing mobile behavior functional without adding horizontal overflow.

## Verification

- Add a stylesheet regression test for the background asset, cover sizing, positioning, non-repetition, and overlay.
- Run the complete automated test suite and production build.
- Verify both Experience and Projects at `1440 × 900`:
  - background fills the viewport;
  - panels remain readable;
  - no page overflow;
  - sprites still animate;
  - popup still opens;
  - no browser warnings or errors.

