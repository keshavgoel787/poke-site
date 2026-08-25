# Interests Roster Design

## Goal

Add a third Pokémon PC roster tab that introduces Keshav's interests through six concise cards and matching animated pixel sprites. This phase establishes the tab, data, routing, layout, and artwork only. Interest detail popups, photos, and external links are intentionally deferred.

## User Experience

The existing roster gains an **Interests** tab beside **Experience** and **Projects**. Selecting it opens `/pokemon/interests` and displays six cards in the existing two-column, three-row PC layout:

1. **Bhangra** — Captain
2. **Sigma Beta Rho** — Fundraising & Academic Lead
3. **Games & Collecting** — Pokémon · Destiny 2 · League
4. **Hiking** — Trails & outdoors
5. **Music** — House · R&B
6. **Food Explorer** — Restaurants & cuisines

The cards are informational in this phase. They do not open the professional Pokédex dialog and must not appear interactive to pointer, keyboard, or assistive-technology users. Tab selection retains the existing link behavior, keyboard navigation, focus treatment, and optional bleep sound.

## Data and Components

- Extend `RosterTab` with `interests` and add an Interest category to the roster-entry model.
- Add the six entries to `rosterTabs` using short card metadata only.
- Update route resolution and legacy-route expectations so `/pokemon/interests` is a valid canonical roster URL.
- Allow `CreatureGrid` to render an informational mode for the Interests roster. Experience and Project behavior remains unchanged.
- Do not route an Interest entry ID or render `PokedexEntry` for Interest cards in this phase.

## Sprite Direction

Each interest receives a distinct two-frame 32×32 SVG sprite:

- **Bhangra:** dancer alternating arm positions
- **Sigma Beta Rho:** king cobra with a subtle sway
- **Games & Collecting:** trading-card and controller-inspired mascot
- **Hiking:** hiking boot or mountain mascot with a walking/outdoor motion
- **Music:** headphones or equalizer mascot with changing levels
- **Food Explorer:** cheerful food bowl mascot with a small steam animation

All sprites use rectangle-only, even-numbered geometry, `shape-rendering="crispEdges"`, and the site's approved shared palette. Animation must be object-specific rather than applying the same bounce to every sprite.

## Layout and Styling

The tablist expands from two to three equal columns. The six Interest cards reuse the current roster-card visual system and fit in three rows at the supported desktop viewport. Existing smaller-screen scrolling remains unchanged. Informational cards retain the same artwork, typography, borders, and selected-tab palette but omit pointer/pressed affordances.

## Accessibility

- The Interests tab participates in the current ARIA tablist and arrow-key navigation.
- Interest cards render as non-interactive list content until popups exist.
- Every sprite keeps a meaningful accessible label.
- Reduced-motion behavior continues to stop frame animation.

## Testing

- Data tests cover the third roster and its exact six entries.
- Route tests cover canonical and recovered Interest routes.
- Component tests verify the Interests tab, six cards, and absence of dialog/button behavior.
- Sprite tests cover two-frame animation, approved palette, and strict pixel geometry.
- Existing Experience and Project interaction tests remain green.

## Out of Scope

- Interest popups or modal routing
- Photo galleries
- Instagram, playlist, trail, or restaurant links
- Long-form personal descriptions
- New audio or music playback
