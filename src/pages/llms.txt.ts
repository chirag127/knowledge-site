import { getCollection } from 'astro:content'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  const concepts = await getCollection('concepts')
  const lines: string[] = [
    `# knowledge.oriz.in — ${concepts.length} concept files`,
    '',
    `## About`,
    `Open Knowledge Format bundle. Every concept file has YAML frontmatter (type/title/description/tags) + markdown body.`,
    `Source: https://github.com/chirag127/workspace/tree/main/knowledge`,
    '',
    `## Concepts`,
    '',
  ]
  for (const c of concepts) {
    const d = c.data as any
    lines.push(`### ${d.title || c.id}`)
    lines.push('')
    if (d.description) lines.push(d.description)
    lines.push(`URL: https://knowledge.oriz.in/${c.id}`)
    lines.push(`Type: ${d.type || 'other'}${d.tags ? `  Tags: ${d.tags.join(', ')}` : ''}`)
    lines.push('')
  }
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
