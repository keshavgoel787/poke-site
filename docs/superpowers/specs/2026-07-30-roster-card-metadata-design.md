# Roster Card Metadata Design

## Goal

Replace the generic category row on each roster card with useful professional context while preserving the compact one-screen layout.

## Experience Cards

- Replace the visible `Experience` row with the entry's existing date range.
- Display:
  - Amazon: `Aug 2026 - Dec 2026`
  - DraftKings: `Jun 2026 - Present`
  - ProcureMate AI: `Jan 2026 - May 2026`
  - Johnson & Johnson: `Jun 2025 - Dec 2025`
  - WPS Data Lab: `Oct 2024 - Present`
- Keep `Experience` as the entry category in data and popup content.

## Project Cards

- Replace the visible `Project` row with three curated technologies:
  - Remetra: `React · Supabase · FastAPI`
  - ForgetMeNot: `FastAPI · Gemini · OpenCV`
  - BreatheEasy: `Flutter · Dart · Google Maps`
- Keep the complete technology list in each project popup.
- Keep `Project` as the entry category in data and popup content.

## Presentation

- Use the existing metadata-row visual treatment.
- Keep metadata on one line at the 1440 × 900 desktop target.
- Prevent long metadata from expanding card height or causing page overflow.
- Preserve card selection, animation, accessibility, routes, and popup behavior.

## Verification

- Add tests for the experience date rows and curated project technology rows.
- Confirm generic `Experience` and `Project` category text is no longer rendered as the card metadata row.
- Run the complete test suite and production build.
- Verify at 1440 × 900 that both tabs fit without page scrolling and project popups retain the complete technology list.

