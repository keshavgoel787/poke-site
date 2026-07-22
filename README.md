# Keshav's Career PC

A Pokémon PC-inspired portfolio built with React, TypeScript, and Vite.

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

## Deployment

Deploy the generated `dist/` directory as a static site. The host must rewrite application routes to `/index.html` so direct links such as `/pc/projects/forgetmenot` load the application. Netlify-compatible hosts can use `public/_redirects`; Vercel can use `vercel.json`.

DNS for `keshavgoel.dev` is changed only during a deployment step explicitly approved by the user.
