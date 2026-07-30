# Pixelify Sans Typography Design

## Goal

Apply the selected Pixelify Sans treatment consistently across the complete portfolio while preserving hierarchy, readability, and the trainer-card-inspired pixel aesthetic.

## Font Delivery

- Self-host Pixelify Sans as local webfont assets.
- Do not depend on Google Fonts or another font CDN at runtime.
- Include the font license alongside the font files.
- Use `font-display: swap` and a monospace fallback stack.

## Typography Hierarchy

- Use Pixelify Sans for all visible interface text.
- Weight `700`:
  - main section headings;
  - company and project names;
  - tabs;
  - buttons and primary navigation labels.
- Weight `600`:
  - trainer field labels;
  - card metadata;
  - popup labels and type tags.
- Weight `400`:
  - roles;
  - dates and locations;
  - descriptions;
  - popup body content.
- Preserve the existing uppercase hierarchy rather than converting all text to uppercase.

## Styling

- Slightly tighten major heading letter spacing to reproduce the compact blocky reference.
- Use comfortable body line-height so narrow pixel letterforms remain readable.
- Preserve current text shadows and outlines where they provide contrast on roster headings.
- Avoid adding new blur, antialiasing effects, or decorative gradients to text.
- Keep existing responsive font-size behavior unless the new font creates clipping.

## Scope

- Trainer card headings, labels, values, and professional links.
- Roster heading, sound control, tabs, company/project names, roles, dates, and project stack summaries.
- Popup headings, labels, descriptions, types, technology lists, links, and close button.
- Accessible hidden text inherits the family but requires no additional visual treatment.

## Verification

- Add tests for local `@font-face` declarations, weights, fallback stack, and application-wide inheritance.
- Run the complete automated test suite and production build.
- Verify at `1440 × 900`:
  - no clipped or overlapping text;
  - no page overflow on Experience or Projects;
  - popup remains readable;
  - sprites still animate;
  - background and panel contrast remain effective;
  - browser console has no font-loading errors or warnings.

