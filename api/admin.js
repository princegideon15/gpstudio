import { put, del } from '@vercel/blob';
export const config = { api: { bodyParser: { sizeLimit: '4mb' } } };
export default async function handler(req, res) {
  if ((req.headers['x-admin-password'] || '') !== process.env.ADMIN_PASSWORD || !process.env.ADMIN_PASSWORD)
    return res.status(401).json({ error: 'Wrong password' });
  try {
    if (req.method === 'POST') {
      const { category, image } = req.body || {};
      const w = Math.min(parseInt(req.body.w) || 4, 9999), h = Math.min(parseInt(req.body.h) || 5, 9999);
      const slug = String(category || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (!slug || !/^data:image\/jpeg;base64,/.test(image || '')) return res.status(400).json({ error: 'Invalid upload' });
      const buf = Buffer.from(image.split(',')[1], 'base64');
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const b = await put(`portfolio/${slug}/${id}_${w}x${h}.jpg`, buf, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: false });
      return res.status(200).json({ url: b.url, category: slug });
    }
    if (req.method === 'DELETE') {
      const { url } = req.body || {};
      if (!/blob\.vercel-storage\.com\/portfolio\//.test(url || '')) return res.status(400).json({ error: 'Invalid url' });
      await del(url); return res.status(200).json({ ok: true });
    }
    res.status(405).end();
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error: ' + (e.message || 'unknown') }); }
}
