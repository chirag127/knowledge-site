# oriz-knowledge-site

[![Live](https://img.shields.io/badge/live-knowledge.oriz.in-c59f5f)](https://knowledge.oriz.in)
[![Stars](https://img.shields.io/github/stars/chirag127/oriz-knowledge-site?style=flat)](https://github.com/chirag127/oriz-knowledge-site/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Astro source for [knowledge.oriz.in](https://knowledge.oriz.in) — an OKF knowledge base rendered as **The Card Catalogue**: one index card per concept, each with a call number, a heading, and cross-references.

## Stack

- **Astro 5** — static generation (983 pages)
- **Tailwind v4** — utility CSS
- **React 19** islands — search, Clerk account, "file on shelf"
- **FlexSearch** — client-side look-up over titles + descriptions + tags
- **Clerk** — auth; gates ONLY the personal shelf, never public content
- **Firebase (Firestore only)** — per-user shelf, keyed by Clerk user id
- **Content**: absolute glob at `KNOWLEDGE_SRC` (defaults to `C:/d/oriz/knowledge`)

## Design — The Card Catalogue

Reading-room-after-hours: deep spruce dark (`#141d18`) with aged-manila index cards, oxidized-brass call numbers (`#c59f5f`), and oxblood date-stamps (`#c46a5a`). Type trio: **Fraunces** display, **Hanken Grotesk** body, **Spline Sans Mono** for call numbers and catalogue slips. Signature: the punch-holed index card threaded on a brass rod; hero is a drawer face with a brass pull. Light mode = "the reading lamp is on." Reduced-motion respected.

## Dev

```bash
npm install
KNOWLEDGE_SRC=/absolute/path/to/knowledge npm run dev
```

Copy `.env.example` → `.env` for Clerk + Firebase (all `PUBLIC_*`, browser-safe).

## Deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name knowledge-oriz-in --branch main --commit-dirty=true
```

## License

MIT.
