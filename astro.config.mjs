import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import siteShell from '@chirag127/site-shell/astro'

export default defineConfig({
  site: 'https://knowledge.oriz.in',
  output: 'static',
  vite: { plugins: [tailwindcss()] },
  integrations: [
    react(),
    mdx(),
    sitemap(),
    siteShell({
      name: 'knowledge',
      tagline: 'The library — 828 concept files',
      palette: {
        fg: '#1a1817',
        bg: '#f4f1ea',
        accent: '#b8860b',
        muted: '#7a736a',
        rule: '#e8e2d5',
      },
      fonts: { head: 'Charter', body: 'Inter Tight', mono: 'JetBrains Mono' },
      githubUrl: 'https://github.com/chirag127/knowledge-site',
    }),
  ],
  experimental: {},
})
