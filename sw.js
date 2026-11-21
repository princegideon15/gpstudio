const V='gp-v1', SHELL=['/','/index.html','/styles.css','/app.js','/manifest.webmanifest','/vendor/flatpickr.min.css','/vendor/flatpickr.min.js','/vendor/jspdf.umd.min.js','/assets/logo.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.allSettled(SHELL.map(u=>c.add(u)))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.pathname.startsWith('/api/admin')||u.pathname==='/admin.html')return;
  // portfolio list: network first, cache fallback
  if(u.pathname==='/api/portfolio'){
    e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(h=>h.put(r,c));return x;}).catch(()=>caches.match(r)));return;
  }
  // everything else (incl. blob images): cache first, refresh in background
  e.respondWith(caches.match(r).then(hit=>{
    const net=fetch(r).then(x=>{if(x.ok&&(u.origin===location.origin||u.hostname.endsWith('blob.vercel-storage.com'))){const c=x.clone();caches.open(V).then(h=>h.put(r,c));}return x;}).catch(()=>hit);
    return hit||net;
  }));
});
