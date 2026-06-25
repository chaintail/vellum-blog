import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://blog.vellum.network';

export const GET: APIRoute = async () => {
  const posts = await getCollection('posts');
  const urls = [
    { loc: `${SITE}/` },
    { loc: `${SITE}/team/` },
    ...posts.map((p) => ({
      loc: `${SITE}/posts/${p.id}/`,
      lastmod: p.data.pubDate.toISOString(),
    })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc>${'lastmod' in u && u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`
  )
  .join('\n')}
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
