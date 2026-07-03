---
import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function GET(context: any) {
  const concepts = await getCollection('concepts')
  const items = concepts
    .filter(c => (c.data as any).timestamp)
    .sort((a, b) => String((b.data as any).timestamp).localeCompare(String((a.data as any).timestamp)))
    .slice(0, 50)
    .map(c => {
      const d = c.data as any
      return {
        title: d.title || c.id,
        description: d.description || '',
        link: `/${c.id}`,
        pubDate: new Date(d.timestamp),
      }
    })

  return rss({
    title: 'knowledge.oriz.in',
    description: "Chirag's OKF knowledge bundle",
    site: context.site!.toString(),
    items,
  })
}
