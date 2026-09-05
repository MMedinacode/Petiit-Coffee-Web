/* ============================================================
   PANTALLA DE CARGA — rápida a propósito (ver nota en styles.css)
   ============================================================ */
(function(){
  const el = document.getElementById('loadScreen');
  function hide(){ el.classList.add('hidden'); }
  window.addEventListener('load', () => setTimeout(hide, 200));
  setTimeout(hide, 700); // tope duro: nunca más de ~700ms visible
})();

/* ============================================================
   NAVEGACIÓN SPA POR PESTAÑAS
   ============================================================ */
const panels = document.querySelectorAll('.tab-panel');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.15 });

function goToTab(tabId) {
  panels.forEach(p => p.classList.toggle('active', p.dataset.tabPanel === tabId));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.tab === tabId));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('main-nav').classList.remove('open');
  const activePanel = document.querySelector('.tab-panel.active');
  if (activePanel) activePanel.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}
document.querySelectorAll('[data-tab]').forEach(el => {
  el.addEventListener('click', (e) => { e.preventDefault(); goToTab(el.dataset.tab); });
});
document.querySelectorAll('.tab-panel.active .reveal').forEach(el => revealObserver.observe(el));

document.getElementById('navToggle').addEventListener('click', () => {
  document.getElementById('main-nav').classList.toggle('open');
});

/* --------------------------------------------------------------
   CARTA REAL — precios del letrero/carta física de Petiit Coffee.
   Foto de categoría (Dulces): foto real de la vitrina del local.
-------------------------------------------------------------- */
const CATEGORIES = [
  { id: 'sinleche', label: 'Café sin leche' },
  { id: 'conleche', label: 'Café con leche' },
  { id: 'sincafe',  label: 'Sin café' },
  { id: 'sandwiches', label: 'Sandwiches' },
  { id: 'dulces', label: 'Dulces' },
];

const MENU = {
  sinleche: {
    groups: [
      { title: 'Café sin leche', items: [
        { n: 'Espresso', p: 2300 },
        { n: 'Americano', p: 2600 },
        { n: 'V60', p: 4000 },
        { n: 'Cold brew', p: 3500 },
        { n: 'Espresso Ginger/Tonic', p: 3900 },
        { n: 'Espresso naranja', p: 3900 },
        { n: 'Affogato', p: 3400 },
      ] },
      { title: 'Extras', items: [
        { n: 'Syrup', p: 0 },
        { n: 'Extra shot', p: 500 },
        { n: 'Descafeinado', p: 650 },
        { n: 'Bebida vegetal', p: 600 },
      ], note: 'Todas las bebidas frías: +$200' }
    ]
  },
  conleche: {
    groups: [
      { title: 'Café con leche', items: [
        { n: 'Macchiato', p: 2400 },
        { n: 'Flat White', p: 3100 },
        { n: 'Capuccino', p: 3200 },
        { n: 'Latte', p: 3400 },
        { n: 'Mocaccino', p: 3800 },
        { n: 'Dirty Chai', p: 3800 },
      ] },
      { title: 'Ice tea', items: [
        { n: 'Té negro canela berries', p: 3200 },
        { n: 'Té verde naranja jengibre', p: 3200 },
      ] }
    ]
  },
  sincafe: {
    groups: [
      { title: 'Bebestibles sin café', items: [
        { n: 'Té variedades', p: 2500 },
        { n: 'Golden milk', p: 3600 },
        { n: 'Chai latte', p: 3600 },
        { n: 'Chocolate caliente', p: 3800 },
        { n: 'Matcha latte', p: 3900 },
      ] },
      { title: 'Matcha especial', items: [
        { n: 'Matcha naranja / tonic', p: 4700 },
        { n: 'Matcha frambuesa', p: 4200 },
        { n: 'Jugo de naranja', p: 3500 },
        { n: 'Agua con/sin gas', p: 1400 },
      ] }
    ]
  },
  sandwiches: {
    groups: [
      { title: 'Sandwiches', items: [
        { n: 'Ciabatta jamón serrano, mantecoso, pesto, kale', p: 4500 },
        { n: 'Bagel jamón queso', p: 3400 },
        { n: 'Bagel salmón ahumado, queso crema, palta, alcaparra, kale', p: 5500 },
        { n: 'Molde huevo mayo', p: 3200 },
      ] }
    ]
  },
  dulces: {
    photo: 'fotos/vitrina.jpg',
    groups: [
      { title: 'Dulces de temporada', items: [
        { n: 'Cannelé', p: 2500 },
        { n: 'Rollito de canela', p: 2500 },
        { n: 'Brownie', p: 2500 },
        { n: 'Queque de limón', p: 2500 },
      ], note: 'La selección de dulces cambia según la temporada — siempre hay algo nuevo en la vitrina. :)' }
    ]
  }
};

const money = n => n === 0 ? 'Gratis' : '$' + n.toLocaleString('es-CL');

const tabsEl = document.getElementById('menuTabs');
const panelsEl = document.getElementById('menuPanels');

CATEGORIES.forEach((cat, i) => {
  const tab = document.createElement('button');
  tab.className = 'menu-tab' + (i === 0 ? ' active' : '');
  tab.textContent = cat.label;
  tab.dataset.key = cat.id;
  tab.addEventListener('click', () => showMenuTab(cat.id));
  tabsEl.appendChild(tab);

  const data = MENU[cat.id];
  const panel = document.createElement('div');
  panel.className = 'menu-panel' + (i === 0 ? ' active' : '');
  panel.id = 'panel-' + cat.id;
  if (data.photo) {
    const img = document.createElement('img');
    img.src = data.photo; img.alt = cat.label; img.className = 'menu-cat-photo';
    panel.appendChild(img);
  }
  const grid = document.createElement('div');
  grid.className = 'menu-grid';
  data.groups.forEach(group => {
    const catBlock = document.createElement('div');
    catBlock.className = 'menu-cat';
    const h = document.createElement('h3');
    h.textContent = group.title;
    catBlock.appendChild(h);
    group.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'menu-item';
      row.innerHTML = `<span class="name">${item.n}</span><span class="price">${money(item.p)}</span>`;
      row.addEventListener('click', () => openModal(item));
      catBlock.appendChild(row);
    });
    if (group.note) {
      const note = document.createElement('p');
      note.className = 'menu-note';
      note.textContent = group.note;
      catBlock.appendChild(note);
    }
    grid.appendChild(catBlock);
  });
  panel.appendChild(grid);
  panelsEl.appendChild(panel);
});

function showMenuTab(key) {
  document.querySelectorAll('.menu-tab').forEach(t => t.classList.toggle('active', t.dataset.key === key));
  document.querySelectorAll('.menu-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + key));
}

/* --------------------------------------------------------------
   MODAL PRODUCTO
-------------------------------------------------------------- */
const modal = document.getElementById('modalOverlay');
let currentItem = null;
function openModal(item) {
  if (item.p === 0) return; // "Syrup" gratis, no se agrega al pedido
  currentItem = item;
  document.getElementById('modalName').textContent = item.n;
  document.getElementById('modalPrice').textContent = money(item.p);
  document.getElementById('modalDesc').textContent = 'Preparado del día en Petiit Coffee.';
  toggleModal(true);
}
function toggleModal(open) { modal.classList.toggle('open', open); }
document.getElementById('modalCloseBtn').addEventListener('click', () => toggleModal(false));
document.getElementById('modalAddBtn').addEventListener('click', () => {
  if (currentItem) { addToCart(currentItem); toggleModal(false); toggleCart(true); }
});

/* --------------------------------------------------------------
   CARRITO
-------------------------------------------------------------- */
let cart = [];
// Teléfono real confirmado en Google Maps (móvil) — no se confirmó si
// tiene WhatsApp activo, ver nota en Visítanos y en el carrito.
const PHONE_NUMBER = '56989935719';

function addToCart(item) {
  const existing = cart.find(c => c.n === item.n);
  if (existing) { existing.qty++; } else { cart.push({ ...item, qty: 1 }); }
  renderCart();
}
function changeQty(name, delta) {
  const line = cart.find(c => c.n === name);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) cart = cart.filter(c => c.n !== name);
  renderCart();
}
function renderCart() {
  const linesEl = document.getElementById('cartLines');
  const count = cart.reduce((a, c) => a + c.qty, 0);
  document.getElementById('cartCount').textContent = count;
  if (cart.length === 0) {
    linesEl.innerHTML = '<p class="cart-empty">Todavía no agregaste nada.</p>';
  } else {
    linesEl.innerHTML = cart.map(c => `
      <div class="cart-line">
        <div>
          <div class="name">${c.n}</div>
          <div class="qty-ctrl">
            <button class="qty-btn" onclick="changeQty('${c.n.replace(/'/g, "\\'")}', -1)">–</button>
            <span>${c.qty}</span>
            <button class="qty-btn" onclick="changeQty('${c.n.replace(/'/g, "\\'")}', 1)">+</button>
          </div>
        </div>
        <div>${money(c.p * c.qty)}</div>
      </div>`).join('');
  }
  const total = cart.reduce((a, c) => a + c.p * c.qty, 0);
  document.getElementById('cartTotal').textContent = money(total);
  updateCheckoutLink(total);
}
function updateCheckoutLink(total) {
  let msg = 'Hola Petiit! Quisiera hacer el siguiente pedido:%0A%0A';
  if (cart.length === 0) {
    msg += '(Aún sin productos seleccionados)%0A%0A';
  } else {
    cart.forEach(c => { msg += `• ${c.qty}x ${c.n} — ${money(c.p * c.qty)}%0A`; });
    msg += `%0ATotal: ${money(total)}`;
  }
  document.getElementById('checkoutBtn').href = `https://wa.me/${PHONE_NUMBER}?text=${msg}`;
}
function toggleCart(open) { document.getElementById('cartOverlay').classList.toggle('open', open); }
document.getElementById('cartFab').addEventListener('click', () => toggleCart(true));
document.getElementById('cartBtn').addEventListener('click', () => toggleCart(true));
document.getElementById('cartCloseBtn').addEventListener('click', () => toggleCart(false));
document.getElementById('cartOverlay').addEventListener('click', (e) => { if (e.target.id === 'cartOverlay') toggleCart(false); });
renderCart();

/* --------------------------------------------------------------
   ESTADO ABIERTO / CERRADO — horario real confirmado en Google Maps
   el 04-09-2026: Lun-Mié 7:30-18:00, Jue-Vie 7:30-19:00,
   Sáb 10:00-14:00, Dom cerrado.
-------------------------------------------------------------- */
function updateOpenStatus() {
  let day, minutes;
  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Santiago', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(now);
    const map = {}; parts.forEach(p => map[p.type] = p.value);
    const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    day = weekdayMap[map.weekday];
    minutes = parseInt(map.hour) * 60 + parseInt(map.minute);
  } catch (e) {
    const now = new Date(); day = now.getDay(); minutes = now.getHours() * 60 + now.getMinutes();
  }

  let range = null;
  if (day >= 1 && day <= 3) range = [7 * 60 + 30, 18 * 60];       // Lun-Mié
  else if (day === 4 || day === 5) range = [7 * 60 + 30, 19 * 60]; // Jue-Vie
  else if (day === 6) range = [10 * 60, 14 * 60];                  // Sáb
  // Domingo (0): range queda null -> cerrado

  const isOpen = range ? (minutes >= range[0] && minutes < range[1]) : false;
  const label = isOpen ? 'Abierto ahora' : 'Cerrado ahora';

  const navDot = document.getElementById('statusDot');
  const navText = document.getElementById('statusText');
  const visitLine = document.getElementById('visitStatusLine');
  navDot.classList.toggle('closed', !isOpen);
  navText.textContent = label;
  if (visitLine) {
    visitLine.textContent = label;
    visitLine.style.cssText = 'font-weight:700; color:' + (isOpen ? '#7bc47f' : 'var(--gold)') + ';';
  }
}
updateOpenStatus();
setInterval(updateOpenStatus, 60000);
