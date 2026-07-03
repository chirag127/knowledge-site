import { getCollection } from 'astro:content'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  const concepts = await getCollection('concepts')
  const docs = concepts.map(c => {
    const d = c.data as any
    return {
      slug: c.id,
      title: d.title || c.id.split('/').pop(),
      description: d.description || '',
      tags: (d.tags || []).join(' '),
      type: d.type || 'other',
    }
  })
  return new Response(JSON.stringify(docs), {
    headers: { 'content-type': 'application/json' },
  })
}
