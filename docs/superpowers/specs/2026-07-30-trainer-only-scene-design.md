# Trainer-Only Scene Design

## Goal

Remove Gengar from the Trainer Card animation so Keshav walks alone and fills the picture panel cleanly. Include the five pending sprite-palette corrections in the final verified push.

## Behavior

- The Trainer Card scene contains only Keshav's existing three-frame walking strip.
- The scene's accessible label becomes `Keshav walking`.
- Keshav remains right-facing, sharply pixelated, animated, and large within the square panel.
- Reduced-motion behavior freezes the trainer on a stable frame.
- A trainer asset failure continues to replace the scene with the accessible unavailable fallback.
- Pokémon roster tabs, cards, popups, routing, sound, profile content, and responsive page behavior do not change.

## Cleanup

Remove all companion-specific implementation:

- The `companionSrc` property and companion image markup in `TrainerWalkScene`.
- Companion crop and strip CSS, companion keyframes, and reduced-motion selectors.
- Companion-specific component and stylesheet assertions.
- The unused `public/gengar-walk.svg` asset and its dedicated asset test.

Update the trainer scene geometry so its single trainer frame is centered within the square scene without distortion or clipping.

## Palette Corrections

Include the existing changes in:

- `src/assets/sprites/remetra-a.svg`
- `src/assets/sprites/remetra-b.svg`
- `src/assets/sprites/revisedPalette.test.ts`
- `src/assets/sprites/wps-data-lab-a.svg`
- `src/assets/sprites/wps-data-lab-b.svg`

These corrections replace the legacy ink color with the approved `#0c1720` palette value and keep the palette test aligned.

## Verification

- Component tests verify the trainer-only source, label, structure, and fallback.
- Stylesheet tests verify centered, aspect-correct trainer geometry and no remaining companion rules.
- Palette tests verify the corrected project sprites.
- The full test suite and production build pass.
- Browser checks confirm the trainer fills the square panel at desktop and mobile sizes with no layout overflow or console errors.

## Delivery

Commit the trainer-only cleanup and palette corrections with Keshav Goel as the author, then push `main` to `origin/main`. Do not deploy or change DNS.
