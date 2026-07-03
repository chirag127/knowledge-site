# knowledge-site

Astro source for [knowledge.oriz.in](https://knowledge.oriz.in) — 828 OKF concept files rendered as a warm-paper reader.

## Stack

- **Astro 5** — static-site generation
- **Tailwind v4** — utility CSS
- **React 19** — islands (search, theme toggle)
- **FlexSearch** — client-side search over titles + descriptions + tags
- **[@chirag127/site-shell](https://github.com/chirag127/site-shell)** — shared wordmark, footer, OKF Zod schema, Bunny Fonts loader
- **Content**: absolute glob at `C:/d/oriz/knowledge` (env: `KNOWLEDGE_SRC`)

## Design

Palette: warm paper (`#f4f1ea` / `#1a1817`) with an ochre accent (`#b8860b`). Serif headlines (Charter), grotesque body (Inter Tight), monospace for OKF frontmatter blocks. Dark mode swaps to oled-black.

Per [`per-app-distinctive-frontend-design`](https://knowledge.oriz.in/rules/design/per-app-distinctive-frontend-design.html).

## Dev

```bash
pnpm install
KNOWLEDGE_SRC=/absolute/path/to/knowledge pnpm dev
```

## Deploy

```bash
pnpm deploy   # astro build + wrangler pages deploy dist
```

## License

MIT.
