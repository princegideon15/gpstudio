(() => {
  const LABELS = { birthday:'Birthday', wedding:'Wedding', christening:'Christening', portrait:'Portrait', product:'Product', debut:'Debut', maternity:'Maternity', anniversary:'Anniversary', other:'Other' };
  const label = s => LABELS[s] || s.charAt(0).toUpperCase() + s.slice(1);
  const g = document.getElementById('gallery'), f = document.getElementById('filters');
  if (!g || !f) return;
  let items = [], shown = [], cur = 0, active = 'all';
  const lb = document.getElementById('lb'), fig = document.getElementById('lb-fig');

  function render() {
    shown = active === 'all' ? items : items.filter(i => i.category === active);
    g.innerHTML = '';
    if (!shown.length) { g.innerHTML = '<p class="sub">No photos here yet. Check back soon.</p>'; return; }
    shown.forEach((it, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'tile';
      b.style.cssText = 'display:block;width:100%;margin:0 0 10px;padding:0;border:0;background:none;break-inside:avoid;cursor:zoom-in';
      b.innerHTML = `<img loading="lazy" decoding="async" alt="${label(it.category)} photo" src="${it.url}" style="width:100%;display:block;border-radius:10px">`;
      b.onclick = () => open(i); g.appendChild(b);
    });
  }
  function chips() {
    const cats = [...new Set(items.map(i => i.category))];
    f.innerHTML = '';
    ['all', ...cats].forEach(c => {
      const b = document.createElement('button'); b.type = 'button';
      b.className = 'chip' + (c === active ? ' on active' : ''); b.textContent = c === 'all' ? 'All' : label(c);
      b.onclick = () => { active = c; chips(); render(); }; f.appendChild(b);
    });
  }
  function open(i) { cur = i; fig.innerHTML = `<img src="${shown[i].url}" alt="" style="max-width:100%;max-height:85vh;display:block;margin:auto">`; if (!lb.open) lb.showModal(); }
  const step = d => open((cur + d + shown.length) % shown.length);
  document.getElementById('lb-x').onclick = () => lb.close();
  document.getElementById('lb-prev').onclick = () => step(-1);
  document.getElementById('lb-next').onclick = () => step(1);
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  addEventListener('keydown', e => { if (!lb.open) return; if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1); });

  fetch('/api/portfolio').then(r => r.json()).then(d => { items = d.items || []; chips(); render(); })
    .catch(() => { g.innerHTML = '<p class="sub">Portfolio is unavailable offline.</p>'; });
})();
