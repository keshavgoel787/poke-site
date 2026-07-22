# Trainer Card and Pokémon Roster Redesign

## Objective

Reshape the existing portfolio into a faithful three-screen handheld-game flow: a Trainer Card landing page, a two-tab professional creature roster, and a compact detail popup. Preserve the original creature sprites, opt-in sound system, accessibility foundation, and static deployment model while refreshing all visible professional content from Keshav Goel's July 18, 2026 résumé.

The screenshots supplied by Keshav define the visual target. The implementation may closely emulate their palette, density, beveling, and screen hierarchy, but it must not copy Pokémon characters, Poké Balls, badge art, icons, sound recordings, logos, or extracted game assets. All trainer, creature, icon, and audio assets remain original.

## Authoritative Inputs

- Updated résumé: `/Users/keshavgoel/Downloads/Keshav_Goel_Resume.pdf`
- Trainer photo reference: `/Users/keshavgoel/Downloads/id_photo.png`
- Trainer Card reference: screenshot supplied July 21, 2026 at 10:29 PM.
- Party roster reference: screenshot supplied July 21, 2026 at 10:34 PM.
- Detail screen reference: screenshot supplied July 21, 2026 at 10:35 PM.

The updated résumé is authoritative when it conflicts with the earlier portfolio data.

## Experience Flow

### Screen 1: Trainer Card

The root route displays a full-screen blue Trainer Card. It contains:

- Name: Keshav Goel.
- School: Northeastern University.
- Graduation: May 2028.
- Major: Data Science.
- Hometown: Boston, MA.
- An original low-resolution trainer avatar based on Keshav's supplied photo, retaining recognizable dark wavy hair, black suit, and white shirt without tracing a franchise trainer.
- Original bottom-row icons linking to résumé, GitHub, LinkedIn, and email.
- One primary action below the card labeled **Keshav's Pokémon**.

The updated résumé PDF replaces the existing `public/resume.pdf` byte-for-byte.

### Screen 2: Professional Creature Roster

The primary action opens a party-style roster with exactly two tabs:

1. **Experience**
2. **Projects**

The Experience tab contains:

- Amazon — Incoming Software Engineering Intern, Aug 2026-Dec 2026, Seattle, WA.
- DraftKings — Software Engineering Intern, Jun 2026-Present, Boston, MA.
- ProcureMate AI — Software Development Engineering Intern, Jan 2026-May 2026, Boston, MA.
- Johnson & Johnson — Software Engineering Co-op, Jun 2025-Dec 2025, Raritan, NJ.
- WPS Data Lab — Data Science Research Assistant, Oct 2024-Present, Boston, MA.

The Projects tab contains:

- Remetra.
- ForgetMeNot.
- BreatheEasy.

Generate and VDart leave the visible roster because they are absent from the updated résumé. Their existing sprite files remain preserved in the repository. Existing sprites for matching entries remain unchanged. WPS Data Lab and Remetra receive original sprites in the same low-resolution style.

Roster cards use a two-column party layout on desktop and a one-column layout on small screens. Each card shows the original creature sprite and name, organization or project, a compact role or category label, and a decorative green completion bar. The bar does not encode an invented score or performance claim.

### Screen 3: Quick Detail Popup

Selecting a roster card opens a compact game-style dialog over the roster. It contains:

- Original creature name and sprite.
- Organization or project name.
- Role or project category.
- Dates and location for Experience entries; Project entries omit these fields.
- One professional type.
- The strongest truthful quantified résumé achievement.
- Source-verified technologies presented as moves.
- One verified project link where relevant.

Closing the popup returns focus to the selected roster card and preserves the active tab and scroll position. Escape closes it. Browser back closes it before leaving the roster.

## Visual System

The redesign replaces the previous Kanto-red palette with a later-handheld palette derived from the supplied references:

- Bright trainer-card blue.
- Pale cyan panels and highlights.
- Dark navy or charcoal roster background.
- Layered steel-gray borders.
- Bright green decorative status bars.
- White pixel labels with dark outlines.
- Restrained red and blue selection accents.

The interface uses chunky beveled frames, metallic strips, dense party cards, crisp low-resolution sprites, and large readable pixel labels. It must avoid generic modern cards, gradients unrelated to the reference treatment, excessive rounding, and pill-heavy controls.

Pixel labels remain secondary to legibility. Professional descriptions use a readable complementary typeface when needed. All text meets contrast requirements against its actual panel color.

## Original Artwork and Sound

- Preserve all existing creature sprite files, including creatures no longer displayed.
- Preserve the existing original menu bleep system and opt-in preference behavior.
- Create an original trainer sprite from Keshav's photo reference.
- Create original WPS Data Lab and Remetra sprites.
- Create original trainer-card navigation icons.
- Do not use copied franchise artwork, icons, sounds, names, ball motifs, or logos.
- Missing or failed artwork falls back to a labeled pixel placeholder.

## Content Mapping

Résumé bullets are condensed for popup use; wording must remain truthful. Each entry uses its strongest quantified result and source-verified technologies. No metric, technology, date, location, responsibility, or outcome may be invented.

Detailed mappings:

- Amazon: incoming identity-synchronization and telemetry pipeline scope across AWS, Azure, and Google Cloud.
- DraftKings: production LangGraph FinOps agent; 20+ hours per week eliminated; production service used by 30 financial analysts; Kubernetes, Terraform, DynamoDB, and Datadog.
- ProcureMate AI: dental-supply computer vision across 20+ offices; 15+ hours per week eliminated per office; Node.js, S3, Vercel, Roboflow, and Claude API.
- Johnson & Johnson: GPT-4o/LangChain paper summarization from two hours to 30 minutes; Neo4j GraphRAG; Streamlit/FastAPI MLOps; 42% infrastructure-cost reduction.
- WPS Data Lab: 257K EPA violations and 100K+ federal spending records; 12 significant drivers; Python, PostgreSQL, and hierarchical REML.
- Remetra: cross-platform autoimmune symptom tracking used by 250 users with 10K+ entries; React, Supabase, FastAPI, Ollama, and Neo4j.
- ForgetMeNot: second at HackRU among 300 teams; FastAPI, Gemini, ElevenLabs, OpenCV, Next.js, and Snowflake.
- BreatheEasy: first at CSBase Hacks among 250 teams; Flutter, Dart, Google Maps API, Shelf, and Docker.

## Architecture and Routes

Preserve React, TypeScript, Vite, React Router, Vitest, Testing Library, static hosting, and the existing focused component boundaries.

Component changes:

- `TrainerProfile` becomes the full Trainer Card.
- `CareerPC` becomes the two-tab roster shell.
- `CreatureGrid` becomes the party-style roster.
- `PokedexEntry` becomes the accessible detail dialog.
- `portfolioData` is refreshed from the updated résumé.
- `PixelSprite` and sound preference/playback modules remain in place.
- Add a focused trainer-avatar component or sprite registry entry rather than embedding avatar logic in the page component.

Routes:

- `/` — Trainer Card.
- `/pokemon/experience` — Experience roster.
- `/pokemon/projects` — Projects roster.
- `/pokemon/:tab/:entry` — Roster with the selected detail popup open.

Old `/pc/...` URLs redirect to their nearest equivalent `/pokemon/...` route so existing shared links do not become dead ends. Unknown entries recover to their valid roster tab with a concise status message.

The URL is the source of truth for the active tab and popup. Presentation-only state such as sound preference remains local.

## Accessibility and Resilience

- Use native dialog semantics with an accessible name.
- Trap focus while the popup is open, close on Escape, and restore focus to its launching roster card.
- Support native keyboard, pointer, and touch activation.
- Maintain at least 44-by-44-pixel interactive targets.
- Preserve sound-off default, explicit opt-in, safe storage, and fail-silent Web Audio behavior.
- Reduced motion removes card transitions, popup animation, sprite animation, and dialogue effects without hiding content.
- Missing avatar or creature art uses a readable labeled fallback.
- Mobile roster order, popup content, professional links, and Trainer Card fields remain complete without horizontal scrolling at 320 pixels.

## Testing and Verification

Automated verification includes:

- Exact Trainer Card fields and links.
- Updated résumé data, visible roster membership, and removal of stale entries.
- Exactly two roster tabs.
- Roster tab routing and legacy `/pc/...` redirects.
- Dialog open, close, Escape, focus trap, focus restoration, direct-link reconstruction, and invalid-entry recovery.
- Updated and newly added sprite resolution plus runtime image fallbacks.
- Sound preference, opt-in playback, safe storage, and reduced-motion state.
- Mobile/desktop structure and required accessible relationships.
- Production build and static-host route fallbacks.

Final browser verification covers phone, tablet, and desktop widths; Trainer Card links; both roster tabs; every visible creature; popup keyboard behavior; sound opt-in; direct and legacy routes; console errors; and horizontal overflow.

## Scope Boundaries

The revision does not add battles, HP calculations, character statistics, accounts, saved progress, a world map, copied Pokémon assets, or long case-study pages. It does not deploy or alter DNS until Keshav explicitly approves a production release.
