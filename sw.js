const V='gp-v2', SHELL=['/','/index.html','/styles.css','/app.js','/manifest.webmanifest','/vendor/flatpickr.min.css','/vendor/flatpickr.min.js','/vendor/jspdf.umd.min.js','/assets/logo.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.allSettled(SHELL.map(u=>c.add(new Request(u,{cache:'reload'}))))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
const put=(r,x)=>{if(x&&x.ok){const c=x.clone();caches.open(V).then(h=>h.put(r,c));}return x;};
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.pathname.startsWith('/api/admin')||u.pathname==='/admin.html')return;
  // our own files and the portfolio list: network first, cached copy only when offline
  if(u.origin===location.origin){
    e.respondWith(fetch(r).then(x=>put(r,x)).catch(()=>caches.match(r).then(h=>h||caches.match('/index.html'))));return;
  }
  // photos on Blob storage: cache first
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(x=>put(r,x))));
});
