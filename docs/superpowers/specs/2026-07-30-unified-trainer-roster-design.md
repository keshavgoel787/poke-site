# Unified Trainer Card and Pokémon Roster Design

## Goal

Turn the portfolio into one continuous page: a compact Trainer Card followed immediately by Keshav's Pokémon roster. On standard desktop screens, the complete Trainer Card and active six-entry roster should fit within one viewport. Tablets, phones, and shorter desktop windows may scroll normally.

## Page Architecture

The root page owns the complete experience:

1. A compact Trainer Card.
2. An always-visible Keshav's Pokémon section.
3. A route-driven Pokémon detail dialog rendered over that page.

The existing standalone roster screen is removed as a separate visual destination. Its roster, tabs, keyboard behavior, sound controls, and dialog behavior are reused inside the unified page.

The following URLs all render the same unified page:

- `/` shows the Experience roster with no dialog.
- `/pokemon/experience` shows the Experience roster.
- `/pokemon/projects` shows the Projects roster.
- `/pokemon/:tab/:entryId` selects the requested roster and opens that Pokémon's detail dialog.

Invalid roster or entry URLs recover to the existing safe default and retain an accessible status message. Closing a dialog returns to the selected roster URL and restores focus to the card that opened it.

## Desktop Layout

At viewport sizes of 1440 by 900 pixels or larger, the Trainer Card and active roster fit without vertical scrolling.

The Trainer Card uses approximately 35–40 percent of the viewport height. It keeps the current blue Pokémon interface, pixel borders, profile fields, and professional links, but reduces title size, row height, gaps, and padding. The profile fields remain on the left and the square trainer scene remains on the right.

The Keshav's Pokémon section sits directly beneath the Trainer Card. Its name is a section heading rather than a link or expandable control. Experience and Projects tabs appear at the top of the section. The active roster uses the existing party-screen treatment and displays six compact entries as two columns by three rows.

Shorter desktops use normal page scrolling rather than reducing text or controls below readable sizes.

## Responsive Layout

Tablets and phones retain the same content order:

1. Trainer Card.
2. Keshav's Pokémon heading and tabs.
3. Active roster.

They scroll vertically. Existing responsive behavior may stack profile fields, the trainer scene, links, and roster cards as needed. No mobile no-scroll requirement applies.

## Trainer and Gengar Scene

The trainer scene fills its square picture panel instead of displaying as a small icon in the center. The combined trainer and companion artwork occupies about 80 percent of the panel while preserving nearest-neighbor pixel rendering and its original proportions.

Keshav continues walking to the right. Gengar follows immediately behind, faces right, and uses a new four-frame pixel-art walking or bobbing loop based on the approved reference. The sprite uses the site's constrained purple palette, low side-facing silhouette, red eye, visible grin, and chibi proportions. Gengar's animation is synchronized visually with the trainer loop.

When reduced motion is enabled, both sprites display a stable representative frame without bobbing or frame cycling. If either sprite cannot load, the scene displays the existing accessible text fallback.

## Interaction and Accessibility

- Experience and Projects remain keyboard-operable tabs.
- Pokémon cards remain keyboard-operable and retain their sound effect when sound is enabled.
- Selecting a Pokémon updates the URL and opens its detail dialog over the unified page.
- The background Trainer Card and roster are not interactive while the dialog is open.
- Closing the dialog restores focus to its originating Pokémon card.
- Direct entry URLs open the appropriate tab and dialog on initial load.
- Existing sound and reduced-motion preferences remain functional.
- Pixel artwork remains decorative within a single labeled trainer scene.

## Component Boundaries

- `TrainerProfile` becomes the unified page composition and renders both primary sections.
- `CareerPC` is adapted into an embeddable roster section rather than rendering its own page landmark and return navigation.
- `TrainerWalkScene` continues to own sprite loading, animation markup, accessible labeling, and fallback state.
- Routing continues to resolve tab and entry state from the URL, but every portfolio route renders the unified composition.
- Existing portfolio data and roster components remain the source of profile, experience, project, and popup content.

These changes should avoid duplicating roster state or maintaining separate root and Pokémon-page variants.

## Verification

Automated coverage must verify:

- Root and Pokémon URLs render the same unified page.
- Route-selected tabs and entry dialogs open correctly.
- Dialog closing preserves the selected tab and restores focus.
- Invalid routes recover accessibly.
- Both roster tabs remain keyboard operable.
- The standalone Keshav's Pokémon navigation card is absent.
- The trainer scene uses the larger composition and four-frame Gengar animation.
- Reduced motion freezes both character animations.
- New sprite colors satisfy the project's palette restrictions.
- Desktop CSS supports a complete 1440-by-900 layout without forced page overflow.
- Mobile and short viewports retain readable, scrollable layouts.

The full existing test suite and production build must continue to pass. Final browser verification covers desktop, tablet, and phone layouts, dialog interactions, keyboard focus, animation, and console errors.

## Out of Scope

- Rewriting resume or portfolio content.
- Changing the approved blue Trainer Card and dark party-screen visual themes.
- Adding new roster entries or tabs.
- Deploying the site or changing DNS.
