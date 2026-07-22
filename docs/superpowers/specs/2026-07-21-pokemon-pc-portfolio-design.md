# Pokémon-Inspired PC Portfolio Design

## Objective

Rebuild Keshav Goel's professional portfolio as a personal, game-like experience inspired by the interaction and visual constraints of Pokémon Red. The site must remain immediately useful to technical recruiters and engineers while providing a memorable interactive layer.

The design will not use Pokémon names, characters, sprites, logos, or other franchise assets. Every career creature, name, silhouette, and graphic will be original.

## Audience and Success Criteria

The site serves technical recruiters and engineers or hiring managers equally.

Within the first 30 seconds, a visitor must be able to identify Keshav's professional focus, see his highest-signal experience, open his résumé, reach GitHub or LinkedIn, and contact him. Visitors who choose to explore further should understand the relationship between each original creature and the role or project it represents.

The redesign succeeds when:

- The landing screen communicates Keshav's profile without requiring game interaction.
- The PC interface feels cohesive and meaningfully connected to Keshav's work.
- Every role and project remains understandable without knowledge of Pokémon.
- Keyboard, touch, reduced-motion, and small-screen use remain first-class.
- The production site is static, fast, directly linkable, and resilient when optional visuals or effects fail.

## Experience Structure

The site has two connected states: the Trainer Profile and Keshav's PC.

### Trainer Profile

The default landing screen contains:

- Keshav Goel's name.
- A short positioning line covering software, data, machine learning, and AI.
- A compact selection of current or highest-signal roles.
- Direct links to résumé, GitHub, LinkedIn, and email.
- A prominent **Open Keshav's PC** action.

The screen uses the shared pixel-art visual system but preserves the hierarchy and scanability of a professional homepage.

### Keshav's PC

Opening the PC transitions to a dedicated game interface with three boxes:

1. **Experience Box:** Amazon, DraftKings, ProcureMateAI, Generate, Johnson & Johnson, and VDart.
2. **Projects Box:** Breathe Easy and ForgetMeNot. Additional projects are outside the initial release and can be added through the same data model later.
3. **Trainer Box:** Northeastern University, Bhangra, locations, interests, and personal details.

Each role or project is represented by one original pixel creature. The role or project's skills become the creature's types, moves, and stats.

A persistent quick menu exposes Profile, Résumé, Contact, Sound, and Exit PC. Visitors can always leave the game interface, and browser back and forward navigation must work between states.

## Creature Entries

Creature entries stay deliberately short. Selecting a creature opens a Pokédex-style panel containing:

- Original creature name and sprite.
- Organization or project name.
- Role and dates.
- One compact impact statement.
- One or two professional skill types.
- Four named skill moves.
- One external link when relevant.

There are no long case-study pages in the initial release. Entries use plain professional language alongside the game labels so their meaning is never hidden by the metaphor.

## Visual System

The site follows Generation I pixel-art constraints without copying franchise artwork.

### Palette

The permanent Kanto-red-inspired palette consists of:

- Navy-black for outlines and primary text.
- Warm cream for primary backgrounds.
- Golden yellow for selected slots and highlights.
- Cartridge red for actions, focus, and limited accents.

The same palette applies across every creature and screen. Creature types do not change the global color system.

### Illustration and Typography

- Original creatures use a strict low-resolution pixel grid, hard edges, heavy outlines, and no anti-aliasing.
- Sprites may use two frames for idle animation.
- Pixel typography is used for labels, menus, and dialogue.
- Longer professional text uses a complementary readable typeface where pixel text would reduce legibility.
- Dialogue boxes, selection arrows, box tabs, skill meters, and move lists evoke an early handheld interface without reproducing proprietary layouts exactly.

## Interaction and Motion

- Opening the PC plays a short boot-up transition.
- The selection cursor moves between creature slots with keyboard, pointer, or touch input.
- Selected creatures may use a restrained two-frame idle animation.
- Dialogue can appear with a typing effect, but visitors can reveal it immediately.
- Sound never autoplays. A small explicit toggle enables optional menu bleeps.
- Reduced-motion preferences disable boot, cursor-hop, typing, and idle animations without removing information.

On desktop, the PC resembles an expanded handheld-game screen. On mobile, the layout becomes a portrait interface with the creature grid first, the selected entry below it, and touch targets sized for thumb use.

## Technical Architecture

Build the new site as a static React application using TypeScript and Vite. It requires no backend.

Primary modules:

- `portfolioData`: typed roles, projects, creature metadata, moves, links, and personal content.
- `TrainerProfile`: professional landing state.
- `CareerPC`: PC layout, active box, and selected entry coordination.
- `CreatureGrid`: selectable creature slots.
- `PokedexEntry`: concise details for the selected item.
- `QuickMenu`: profile, résumé, contact, sound, and exit actions.
- `PixelSprite`: original sprite rendering and optional two-frame animation.
- `useGameNavigation`: URL, keyboard, selection, and transition state.

Content and presentation remain separate so résumé changes do not require editing component logic.

## Navigation and Data Flow

The URL is the shareable source of navigation state. Routes follow this structure:

- `/` for the Trainer Profile.
- `/pc/:box` for an open PC box.
- `/pc/:box/:entry` for a selected creature entry.

Opening the PC updates the URL and initializes the selected box. Selecting a box or creature updates both local interface state and the URL. Loading a valid deep link reconstructs the same visible state. Unknown boxes or entries return to the nearest valid PC state and display a short in-world message rather than a blank screen.

The optional sound preference is stored locally and defaults to off. It is not encoded in the URL.

## Resilience and Accessibility

- The initial document exposes Keshav's identity, positioning, résumé, and contact links before optional game interactions finish loading.
- Missing sprite assets fall back to a labeled pixel placeholder and never hide the associated professional entry.
- External links use descriptive labels and visible focus styles.
- All PC navigation is keyboard-accessible and follows native tab order.
- Selected state is communicated by text or shape as well as color.
- Text contrast, touch target size, focus visibility, and reduced-motion behavior meet common accessibility expectations.
- Pixel-art rendering is decorative; professional meaning is always available as text.

## Testing and Verification

Verification includes:

- Unit tests for typed portfolio content, route parsing, and navigation-state transitions.
- Interaction tests for opening the PC, switching boxes, selecting entries, using the quick menu, and exiting.
- Keyboard tests for grid movement, activation, escape behavior, and focus return.
- Reduced-motion and sound-default checks.
- Responsive checks at representative mobile, tablet, and desktop widths.
- Production build, direct-route loading, and broken-link checks.
- A visual review of the Trainer Profile and every creature entry in both desktop and mobile layouts.

## Initial Scope Boundaries

The initial release includes the Trainer Profile, three PC boxes, concise creature entries, original static or two-frame sprites, responsive behavior, optional sound, and the navigation model described above.

It does not include combat, a world map, accounts, saved progress, a backend, procedural creatures, long case studies, or copyrighted Pokémon assets. These exclusions keep the portfolio fast, understandable, and achievable as one implementation project.

## Deployment

The application produces static assets and can deploy to the service currently backing `keshavgoel.dev` or another static host. The chosen host must rewrite unknown application paths such as `/pc/experience/amazon` to `index.html`, allowing the client router to reconstruct the requested state.
