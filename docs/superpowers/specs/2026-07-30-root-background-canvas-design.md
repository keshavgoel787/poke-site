# Root Background Canvas Design

## Problem

The pixel landscape is painted only on `body`, while the root `html` canvas uses
the solid ink color. On browsers with elastic overscroll, scrolling beyond the
document edge can expose that root canvas and briefly show a black background.

## Design

- Move the existing layered pixel-landscape background to `html`.
- Keep the same dark overlay, centered positioning, no-repeat behavior, cover
  sizing, and fixed attachment.
- Make `body` transparent so there is a single background owner and no seams or
  mismatched image crops.
- Preserve the existing foreground stacking and all layout behavior.

## Verification

- Add a stylesheet regression test asserting that `html` owns the complete
  background and `body` is transparent.
- Run the complete test suite and production build.
- Check a short desktop viewport at the bottom of the page and confirm the root
  canvas still displays the pixel landscape.
