// =========================================
//  NŌVA — script.js  (Portfolio Demo)
// =========================================

// ── LAYOUT LOADER ─────────────────────────
async function loadLayout() {
  try {
    const [headerRes, footerRes] = await Promise.all([
      fetch('header-e-comm.html'),
      fetch('footer-e-comm.html')
    ]);
    document.getElementById('header-placeholder').innerHTML = await headerRes.text();
    document.getElementById('footer-placeholder').innerHTML = await footerRes.text();
    setupMobileMenu();
    setupSmoothScroll();
  } catch(e) { console.error('Layout load error:', e); }
}

function setupMobileMenu() {
  const toggle = document.getElementById('mobile-menu');
  const menu   = document.getElementById('nav-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    menu.classList.toggle('is-open');
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      menu.classList.remove('is-open');
    });
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', loadLayout);


  const PRODUCTS = [
  { id:0, name:'Aura Oversized Coat',  price:320, cat:'fashion',      color:'#c9a84c', image:'images/product1.jpg' },
  { id:1, name:'Cobalt Mini Bag',      price:185, cat:'accessories',  color:'#a0a0ff', image:'images/product2.jpg' },
  { id:2, name:'Ember Ceramic Vase',   price:95,  cat:'home',         color:'#ff9070', image:'images/product3.jpg' },
  { id:3, name:'Sage Table Lamp',      price:240, cat:'home',         color:'#70d0a0', image:'images/product4.jpg' },
  { id:4, name:'Dusk Wrist Watch',     price:420, cat:'accessories',  color:'#d080c0', image:'images/product5.jpg' },
  { id:5, name:'Mist Silk Dress',      price:155, cat:'fashion',      color:'#80c0e0', image:'images/product6.jpg' },
    ];


let cart = [];

// ── CART TOGGLE ───────────────────────────
function toggleCart() {
  document.getElementById('cart-overlay').classList.toggle('open');
  document.getElementById('cart-sidebar').classList.toggle('open');
}

// ── ADD TO CART ───────────────────────────
function addToCart(productId) {
  const product  = PRODUCTS[productId];
  const existing = cart.find(i => i.id === productId);
  if (existing) { existing.qty++; } else { cart.push({ ...product, qty:1 }); }

  renderCart();
  showToast(product.name + ' προστέθηκε στο καλάθι');

  const btn = document.querySelectorAll('.product-card')[productId]?.querySelector('.overlay-btn:not(.wish)');
  if (btn) {
    const orig = btn.textContent;
    btn.textContent = '✓ Added';
    btn.style.cssText = 'background:#4ade80;color:#000';
    setTimeout(() => { btn.textContent = orig; btn.style.cssText = ''; }, 1200);
  }
}

// ── REMOVE / QTY ─────────────────────────
function removeFromCart(idx) { cart.splice(idx,1); renderCart(); }
function changeQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx,1);
  renderCart();
}

// ── RENDER CART ───────────────────────────
function renderCart() {
  const container = document.getElementById('cart-items');
  const footer    = document.getElementById('cart-footer');
  const countEl   = document.getElementById('cart-count');
  const totalEl   = document.getElementById('cart-total');

  const totalQty = cart.reduce((s,i) => s + i.qty, 0);
  countEl.textContent = totalQty;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">◯</div>
        <p>Το καλάθι σας είναι κενό</p>
      </div>`;
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';
  let html = '', total = 0;

  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    html += `
      <div class="cart-item">
        <div class="cart-item-img">
           <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-details">
          <div class="cart-item-cat">NŌVA Collection</div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">€${item.price}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${idx},-1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${idx},1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${idx})">✕</button>
      </div>`;
  });

  container.innerHTML = html;
  totalEl.textContent = '€' + total;
}

// ── CHECKOUT DEMO ─────────────────────────
function checkout() {
  if (cart.length === 0) return;

  const btn = document.getElementById('checkout-btn');
  btn.textContent = 'Επεξεργασία...';
  btn.disabled = true;

  setTimeout(() => {
    showCheckoutModal();
    btn.textContent = 'Ολοκλήρωση Αγοράς →';
    btn.disabled = false;
  }, 1500);
}

// ── CHECKOUT MODAL ────────────────────────
function showCheckoutModal() {
  const total     = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const itemsList = cart.map(i =>
    `<li>${i.name} × ${i.qty} — <strong>€${i.price * i.qty}</strong></li>`
  ).join('');

  const modal = document.createElement('div');
  modal.id = 'checkout-modal';
  modal.style.cssText = `
    position:fixed;inset:0;z-index:500;
    display:flex;align-items:center;justify-content:center;
    background:rgba(0,0,0,0.85);backdrop-filter:blur(8px);
    animation:fadeIn 0.3s ease;
  `;

  modal.innerHTML = `
    <div style="
      background:#111110;border:1px solid rgba(201,168,76,0.3);
      max-width:480px;width:90%;padding:3rem;
      font-family:'DM Sans',sans-serif;
      animation:slideUp 0.4s cubic-bezier(0.4,0,0.2,1);
    ">
      <div style="text-align:center;margin-bottom:2rem">
        <div style="font-size:2.5rem;margin-bottom:1rem;color:#c9a84c">✦</div>
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:300;color:#f5f0e8;margin-bottom:0.5rem">
          Παραγγελία Demo
        </h2>
        <p style="font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase;color:#6b6b60">
          Portfolio Demonstration
        </p>
      </div>

      <div style="border-top:1px solid rgba(201,168,76,0.15);border-bottom:1px solid rgba(201,168,76,0.15);padding:1.5rem 0;margin-bottom:1.5rem">
        <ul style="list-style:none;display:flex;flex-direction:column;gap:0.75rem">
          ${itemsList}
        </ul>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem">
        <span style="font-size:0.72rem;letter-spacing:0.15em;text-transform:uppercase;color:#6b6b60">Σύνολο</span>
        <span style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;color:#c9a84c">€${total}</span>
      </div>

      <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);padding:1rem;margin-bottom:1.5rem;text-align:center">
        <p style="font-size:0.78rem;color:#c9a84c;letter-spacing:0.05em;line-height:1.6">
          ✦ Αυτό είναι demo για portfolio.<br>
          Σε πραγματικό store θα γινόσουν<br>
          redirect στο Stripe Checkout.
        </p>
      </div>

      <div style="display:flex;gap:0.75rem">
        <button onclick="closeCheckoutModal()" style="
          flex:1;background:#c9a84c;color:#0a0a08;padding:1rem;
          border:none;cursor:pointer;font-family:'DM Sans',sans-serif;
          font-size:0.78rem;letter-spacing:0.2em;text-transform:uppercase;font-weight:500;
        ">Εντάξει</button>
        <button onclick="closeCheckoutModal(true)" style="
          flex:1;background:none;color:#6b6b60;padding:1rem;
          border:1px solid rgba(201,168,76,0.15);cursor:pointer;
          font-family:'DM Sans',sans-serif;font-size:0.78rem;
          letter-spacing:0.12em;text-transform:uppercase;
        ">Άδειασμα Cart</button>
      </div>
    </div>`;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
}

function closeCheckoutModal(clearCart = false) {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.remove();
  document.body.style.overflow = '';
  if (clearCart) { cart = []; renderCart(); toggleCart(); }
}

// ── WISHLIST ──────────────────────────────
function toggleWish(btn) {
  btn.classList.toggle('active');
  btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
  showToast(btn.classList.contains('active') ? 'Προστέθηκε στα αγαπημένα' : 'Αφαιρέθηκε από τα αγαπημένα');
}

// ── FILTER ────────────────────────────────
function filterProducts(cat, btn) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.product-card').forEach(card => {
    card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
  });
}

// ── SORT ──────────────────────────────────
function sortProducts(val) {
  const grid  = document.getElementById('products-grid');
  const cards = [...grid.querySelectorAll('.product-card')];
  if (val.includes('Χαμηλή'))     cards.sort((a,b) => +a.dataset.price - +b.dataset.price);
  else if (val.includes('Υψηλή')) cards.sort((a,b) => +b.dataset.price - +a.dataset.price);
  cards.forEach(c => grid.appendChild(c));
}

// ── TOAST ─────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ── SCROLL ANIMATIONS ─────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── MODAL ANIMATIONS (inject) ─────────────
const modalStyle = document.createElement('style');
modalStyle.textContent = `
  @keyframes fadeIn  { from{opacity:0}              to{opacity:1} }
  @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  #checkout-modal li     { font-size:0.9rem; color:#f5f0e8; }
  #checkout-modal strong { color:#c9a84c; }
`;
document.head.appendChild(modalStyle);