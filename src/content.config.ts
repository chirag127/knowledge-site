import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'
import { okfSchema } from '@chirag127/site-shell/content-schema'

/**
 * Load OKF concept files from the workspace knowledge/ tree.
 *
 * Uses absolute glob path (env-configurable) so we don't need symlinks.
 * On CI: KNOWLEDGE_SRC=./content-fetched (populated by GHA checkout).
 */
const KNOWLEDGE_SRC = process.env.KNOWLEDGE_SRC || 'C:/d/oriz/knowledge'

const concepts = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: KNOWLEDGE_SRC,
    generateId: ({ entry }) => entry.replace(/\.md$/, '').replace(/\\/g, '/'),
  }),
  schema: okfSchema.extend({
    title: z.string().optional(),
  }),
})

export const collections = { concepts }
