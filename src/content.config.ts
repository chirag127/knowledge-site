import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'
import { pathToFileURL } from 'node:url'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * OKF v0.2 frontmatter schema (inline astro:content Zod).
 */
const stringOrArray = z.preprocess(
  v => {
    if (v == null) return undefined
    if (typeof v === 'string') return [v]
    if (Array.isArray(v)) return v.map(x => String(x))
    return undefined
  },
  z.array(z.string()).optional()
)

const looseString = z.preprocess(v => v == null ? undefined : String(v), z.string().optional())

const okfSchema = z.object({
  type: z.preprocess(v => v == null ? 'other' : String(v), z.string().default('other')),
  title: looseString,
  description: looseString,
  resource: looseString,
  tags: stringOrArray,
  timestamp: z.preprocess(v => v == null ? undefined : (v instanceof Date ? v.toISOString() : String(v)), z.string().optional()),
  format_version: looseString,
  status: looseString,
  confidence: looseString,
  durability: looseString,
  supersedes: stringOrArray,
  superseded_by: stringOrArray,
  related: stringOrArray,
}).passthrough()

const CANDIDATES = [
  process.env.KNOWLEDGE_SRC,
  'C:/d/oriz/knowledge',
  resolve(process.cwd(), '../../../knowledge'),
].filter(Boolean) as string[]
const KNOWLEDGE_SRC = CANDIDATES.find(p => existsSync(p)) || CANDIDATES[0]
const baseUrl = pathToFileURL(KNOWLEDGE_SRC + '/').toString()

const concepts = defineCollection({
  loader: glob({
    pattern: ['**/*.md', '!_*.md', '!_*/**', '!**/_*.md'],
    base: baseUrl,
    generateId: ({ entry }) => entry.replace(/\.md$/, '').replace(/\\/g, '/'),
  }),
  schema: okfSchema,
})

export const collections = { concepts }
