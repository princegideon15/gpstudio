import { list } from '@vercel/blob';
export default async function handler(req, res) {
  try {
    const items = []; let cursor;
    do {
      const r = await list({ prefix: 'portfolio/', cursor, limit: 1000 });
      for (const b of r.blobs) {
        const [, category = 'other'] = b.pathname.split('/');
        items.push({ url: b.url, category, uploadedAt: b.uploadedAt });
      }
      cursor = r.hasMore ? r.cursor : undefined;
    } while (cursor);
    items.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=300');
    res.status(200).json({ items });
  } catch (e) { res.status(500).json({ error: 'Could not load portfolio', items: [] }); }
}
