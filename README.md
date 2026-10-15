# Disney Character Explorer

A cinematic Disney character browser built with React, Vite, TypeScript, and TanStack Query. The app lets users search the public Disney API, explore character details, and save favorites locally for a polished portfolio-style browsing experience.

## Features

- Debounced character search against the Disney API
- Responsive character cards with keyboard and hover focus states
- Character detail pages for films, shows, games, and attractions
- Favorites saved in localStorage
- Loading, empty, and error states for a polished UX
- GitHub Pages compatible routing and asset base path

## Live demo

https://mpfranco10.github.io/marvel-hooks/

## Stack

- React 18
- Vite
- TypeScript
- TanStack Query
- React Router
- GitHub Pages

## Local setup

1. Install dependencies:
   npm install
2. Start the dev server:
   npm run dev

## API note

This project uses the public Disney API without any authentication, API key, hash, proxy, or environment variable configuration. The browser fetches data directly from the live Disney endpoint.

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — TypeScript check + production build
- `npm run lint` — run ESLint
- `npm run test` — run the Vitest suite
- `npm run deploy` — publish the `dist` build to GitHub Pages

## Deployment

The app is configured for the GitHub Pages subpath `/marvel-hooks/` using Vite's `base` option. The deployment script publishes the built `dist` folder to the `gh-pages` branch.

## Notes

The app intentionally avoids secret configuration and keeps the public Disney API contract simple and transparent for a beginner-friendly portfolio build.
