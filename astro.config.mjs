import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://knowledge.oriz.in',
  output: 'static',
  vite: { plugins: [tailwindcss()] },
  integrations: [react(), mdx(), sitemap()],
})
