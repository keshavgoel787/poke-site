# Keshav's Career PC

A Pokémon PC-inspired portfolio built with React, TypeScript, and Vite.

## Experience

The portfolio has a three-screen flow:

1. The **Trainer Card** introduces Keshav, shows the chibi trainer scene, links to the
   résumé and professional profiles, and provides a separate **Keshav's Pokémon** card.
2. **Keshav's PC** contains exactly two roster tabs. **Experience** lists AWS,
   DraftKings, ProcureMate AI, Johnson & Johnson, and WPS Data Lab; **Projects** lists
   Remetra, ForgetMeNot, and BreatheEasy.
3. Selecting any roster card opens its route-driven Pokédex-style detail dialog. A
   detail can also be opened directly at `/pokemon/:tab/:entryId`.

The published résumé at `public/resume.pdf` is sourced from the updated
`/Users/keshavgoel/Downloads/KeshavGoel.pdf` file and is checked byte-for-byte
as part of release verification.

## Local development

```sh
npm install
npm run dev
```

## Verification and preview

```sh
npm test
npm run build
npm run preview
```

`npm run dev` starts the Vite development server. `npm test` runs the Vitest suite,
`npm run build` produces the static `dist/` output, and `npm run preview` serves that
output for a local release check.

## Deployment

Deploy the generated `dist/` directory as a static site. The host must rewrite every
application route to `/index.html` so direct links such as
`/pokemon/projects/remetra` and retained legacy links such as
`/pc/experience/draftkings` load the application. Netlify-compatible hosts can use
`public/_redirects`; Vercel can use `vercel.json`.

Deployment and DNS changes, including changes for `keshavgoel.dev`, require explicit
user approval. This repository's verification workflow does not deploy or modify DNS.
