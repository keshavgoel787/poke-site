# Pokémon DS Typography Design

## Goal

Replace Pixelify Sans with a narrower Diamond/Pearl/Platinum-style bitmap
typeface that more closely matches the supplied trainer-card reference and is
easier to read throughout the portfolio.

## Typeface

- Self-host the Pokémon DS Webfont by Lewis Wright.
- Use the supplied WOFF2 format as the primary browser source and WOFF as a
  fallback when both are available.
- Keep `"Courier New"`, Courier, and monospace as system fallbacks.
- Preserve the font's original name and include any attribution or usage notice
  distributed with the download.
- Remove the unused Pixelify Sans font files and license only after confirming
  that no stylesheet references them.

## Global Treatment

- Apply the Pokémon DS typeface to body copy, navigation, buttons, labels,
  headings, roster cards, and popup content.
- Use the font's native regular weight rather than browser-generated bold.
- Create hierarchy through font size, color, capitalization, spacing, and a
  restrained one-pixel shadow on major headings.
- Keep normal body copy at a comfortable line height of at least `1.35`.
- Keep small roster metadata at or above its current rendered size, increasing
  it where the narrower glyphs otherwise become difficult to scan.
- Preserve the current layout, wording, palette, animation, sound effects, and
  responsive breakpoints.

## Readability and Fallbacks

- Do not apply letter spacing that causes bitmap glyphs to touch or break apart.
- Avoid outlines or multi-directional shadows on paragraph text.
- Use a single dark one-pixel shadow only where headings need separation from
  blue or light panels.
- Ensure unsupported glyphs fall back cleanly to the existing monospace stack.
- Keep text legible at the compact 14-inch MacBook Pro desktop viewport.

## Verification

- Add stylesheet regression coverage for the new `@font-face`, global font
  stack, regular-weight treatment, and removal of Pixelify Sans references.
- Run the complete unit test suite and production build.
- Check both roster tabs and a Pokémon detail popup at the compact desktop
  viewport.
- Confirm the font file loads successfully and that no console errors, clipped
  labels, overflowing text, or unexpected horizontal scrolling appear.
