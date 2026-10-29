const $ = id => document.getElementById(id), TABS = ['الكل', 'الجلد', 'التوست', 'الصندل'];
const esc = s => String(s).replace(/[&<>"']/g, c => '&#' + c.charCodeAt(0) + ';');
let cat = 'الكل', shown = [];

function render() {
  const q = $('search').value.trim().toLowerCase(), n = c => PRODUCTS.filter(p => c === 'الكل' || p.category === c).length;
  shown = PRODUCTS.filter(p => (cat === 'الكل' || p.category === cat) && p.name.toLowerCase().includes(q));
  $('tabs').innerHTML = TABS.map(t => `<button data-t="${t}" class="${t === cat ? 'on' : ''}"><b>${t === 'الكل' ? 'كل الموديلات' : 'قسم ' + t}</b><small>${n(t)} موديل</small></button>`).join('');
  $('title').textContent = cat === 'الكل' ? 'كل الموديلات' : 'قسم ' + cat;
  $('empty').hidden = shown.length > 0;
  $('grid').innerHTML = shown.map((p, i) => `<article class="card" data-i="${i}"><div class="photo">${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">` : 'لا توجد صورة'}</div><h3>${esc(p.name)}</h3><p>${esc(p.category)}</p></article>`).join('');
}

function view(p) {
  $('vimg').hidden = !p.image; $('vimg').src = p.image || ''; $('vname').textContent = p.name;
  $('viewer').hidden = false; document.body.style.overflow = 'hidden';
  $('viewer').requestFullscreen?.().catch(() => {});
}
function closeView() {
  if ($('viewer').hidden) return;
  $('viewer').hidden = true; document.body.style.overflow = '';
  document.fullscreenElement && document.exitFullscreen();
}

$('tabs').onclick = e => { const b = e.target.closest('[data-t]'); if (b) { cat = b.dataset.t; render(); } };
$('grid').onclick = e => { const c = e.target.closest('.photo,h3'); if (c) view(shown[c.closest('.card').dataset.i]); };
$('search').oninput = render;
$('viewer').onclick = closeView;
document.onkeydown = e => e.key === 'Escape' && closeView();
document.onfullscreenchange = () => document.fullscreenElement || closeView();
render();
