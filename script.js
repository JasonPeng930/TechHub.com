/* =========================================================
   TechHub 主程式 - 依賴 config.js
   ========================================================= */

const CART_KEY = 'techhub_cart';
const FREE_SHIPPING = STORE_CONFIG.rules.freeShippingThreshold;
const SHIPPING_FEE = STORE_CONFIG.rules.shippingFee;
const FREE_ASSEMBLY = STORE_CONFIG.rules.freeAssemblyThreshold;
const MAX_QTY = STORE_CONFIG.rules.maxQuantityPerItem;

/* ---------- 工具 ---------- */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}
function fmt(n) {
  return `HK$ ${Number(n).toLocaleString('en-HK')}`;
}
function $(id) {
  return document.getElementById(id);
}

/* ---------- 商店資訊自動填入 ---------- */
function applyStoreConfig() {
  document.querySelectorAll('[data-brand-en]').forEach(el => el.textContent = STORE_CONFIG.brand.nameEn);
  document.querySelectorAll('[data-brand-zh]').forEach(el => el.textContent = STORE_CONFIG.brand.nameZh);
  document.querySelectorAll('[data-slogan]').forEach(el => el.textContent = STORE_CONFIG.brand.slogan);
  document.querySelectorAll('[data-subtitle]').forEach(el => el.textContent = STORE_CONFIG.brand.subtitle);
  document.querySelectorAll('[data-contact-email]').forEach(el => el.textContent = STORE_CONFIG.contact.email);
  document.querySelectorAll('[data-contact-phone]').forEach(el => el.textContent = STORE_CONFIG.contact.phone);
  document.querySelectorAll('[data-contact-address]').forEach(el => el.textContent = STORE_CONFIG.contact.address);
  document.querySelectorAll('[data-contact-hours]').forEach(el => el.textContent = STORE_CONFIG.contact.hours);
  document.querySelectorAll('[data-stat-customers]').forEach(el => el.textContent = STORE_CONFIG.stats.customers);
  document.querySelectorAll('[data-stat-brands]').forEach(el => el.textContent = STORE_CONFIG.stats.brands);
  document.querySelectorAll('[data-stat-builds]').forEach(el => el.textContent = STORE_CONFIG.stats.yearlyBuilds);
  document.querySelectorAll('[data-stat-satisfaction]').forEach(el => el.textContent = STORE_CONFIG.stats.satisfaction);
  document.querySelectorAll('[data-copyright-year]').forEach(el => el.textContent = STORE_CONFIG.footer.copyrightYear);
}

/* ---------- 分類導航自動生成 ---------- */
function renderCategoryBar(containerId) {
  const container = $(containerId);
  if (!container) return;
  container.innerHTML = CATEGORIES
    .filter(c => c.key !== 'all')
    .map(c => `<a href="products.html?category=${c.key}">${c.icon} ${escapeHTML(c.name)}</a>`)
    .join('');
}

/* ---------- 購物車存取 ---------- */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  renderCartPage();
}

/* ---------- 加入購物車 ---------- */
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    if (existing.qty >= MAX_QTY) { showToast(`⚠️ 單一商品最多 ${MAX_QTY} 件`); return; }
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, img: product.img, qty: 1 });
  }
  saveCart(cart);
  showToast(`✅ 已加入購物車：${product.name}`);
}

/* ---------- 購物車徽章 ---------- */
function updateCartBadge() {
  const badge = $('cartCount');
  if (!badge) return;
  const total = getCart().reduce((sum, i) => sum + i.qty, 0);
  badge.textContent = total;
  badge.style.display = total > 0 ? 'inline-block' : 'none';
}

/* ---------- Toast ---------- */
function showToast(msg) {
  let toast = $('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ---------- 商品卡 HTML ---------- */
function cardHTML(p) {
  return `
    <img src="${escapeHTML(p.img)}" alt="${escapeHTML(p.name)}" loading="lazy">
    <div class="info">
      <h3>${escapeHTML(p.name)}</h3>
      <p class="spec">${escapeHTML(p.spec)}</p>
      <p class="price">${fmt(p.price)}</p>
      <button class="btn buy-btn" data-id="${p.id}">加入購物車</button>
    </div>
  `;
}

/* ---------- 渲染商品卡（首頁用）---------- */
function renderProducts(containerId, filterIds) {
  const container = $(containerId);
  if (!container) return;
  const list = filterIds ? PRODUCTS.filter(p => filterIds.includes(p.id)) : PRODUCTS;
  container.innerHTML = list.map(p => `<div class="card">${cardHTML(p)}</div>`).join('');
  bindBuyEvents(container);
}

function bindBuyEvents(container) {
  if (container._buyBound) return;
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.buy-btn');
    if (btn) addToCart(btn.dataset.id);
  });
  container._buyBound = true;
}

/* ---------- 購物車頁面 ---------- */
function renderCartPage() {
  const listEl = $('cartList');
  if (!listEl) return;
  const cart = getCart();

  if (cart.length === 0) {
    listEl.innerHTML = `
      <div class="cart-empty">
        🛒 您的購物車是空的<br>
        <a href="index.html" class="btn" style="margin-top:16px;">前往選購</a>
      </div>`;
    const summary = $('cartSummary');
    if (summary) summary.remove();
    return;
  }

  listEl.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${escapeHTML(item.img)}" alt="${escapeHTML(item.name)}" loading="lazy">
      <span class="item-name">${escapeHTML(item.name)}</span>
      <span class="item-price">${fmt(item.price)}</span>
      <div class="qty-control">
        <button class="qty-minus" aria-label="減少數量">−</button>
        <span>${item.qty}</span>
        <button class="qty-plus" aria-label="增加數量">+</button>
      </div>
      <span class="item-subtotal" style="color:#ff9f1c;font-weight:bold;min-width:110px;text-align:right;">
        ${fmt(item.price * item.qty)}
      </span>
      <button class="btn btn-sm btn-danger remove-btn">刪除</button>
    </div>`).join('');

  renderSummary(cart);

  if (!listEl._bound) {
    listEl.addEventListener('click', (e) => {
      const itemEl = e.target.closest('.cart-item');
      if (!itemEl) return;
      const id = itemEl.dataset.id;
      const cart = getCart();
      const item = cart.find(i => i.id === id);
      if (!item) return;

      if (e.target.classList.contains('qty-plus')) {
        if (item.qty >= MAX_QTY) { showToast(`⚠️ 單一商品最多 ${MAX_QTY} 件`); return; }
        item.qty += 1; saveCart(cart);
      } else if (e.target.classList.contains('qty-minus')) {
        item.qty -= 1;
        if (item.qty <= 0) cart.splice(cart.findIndex(i => i.id === id), 1);
        saveCart(cart);
      } else if (e.target.classList.contains('remove-btn')) {
        cart.splice(cart.findIndex(i => i.id === id), 1);
        saveCart(cart);
      }
    });
    listEl._bound = true;
  }
}

/* ---------- 總計區 ---------- */
function renderSummary(cart) {
  let summary = $('cartSummary');
  if (!summary) {
    summary = document.createElement('div');
    summary.id = 'cartSummary';
    summary.className = 'cart-summary';
    $('cartList').insertAdjacentElement('afterend', summary);
  }
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
  const grandTotal = subtotal + shipping;
  const assemblyNote = grandTotal >= FREE_ASSEMBLY
    ? `<div class="row" style="color:#00b4d8;font-weight:bold;">🔧 免費專業組裝服務已解鎖</div>`
    : `<div class="row" style="color:#8fa9b8;">💡 再加 ${fmt(FREE_ASSEMBLY - grandTotal)} 享免費組裝</div>`;

  summary.innerHTML = `
    <div class="row"><span>商品小計</span><span>${fmt(subtotal)}</span></div>
    <div class="row"><span>運費</span><span>${shipping === 0 ? '免費' : fmt(shipping)}</span></div>
    ${assemblyNote}
    <div class="row total"><span>總計</span><span>${fmt(grandTotal)}</span></div>
    <button class="btn" id="checkoutBtn" style="width:100%;margin-top:16px;">前往結帳</button>
    <button class="btn btn-outline" id="clearCartBtn" style="width:100%;margin-top:10px;">清空購物車</button>`;

  $('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) return;
    showToast(`🎉 訂單已送出！總額 ${fmt(grandTotal)}`);
    setTimeout(() => { localStorage.removeItem(CART_KEY); saveCart([]); }, 1200);
  });
  $('clearCartBtn').addEventListener('click', () => {
    if (confirm('確定要清空購物車嗎？')) { saveCart([]); showToast('🗑️ 購物車已清空'); }
  });
}

/* ---------- 單品快速計算 ---------- */
function calculateTotal() {
  const nameInput = $('customerName');
  const selectEl  = $('productSelect');
  const qtyInput  = $('quantity');
  const resultBox = $('resultBox');
  if (!nameInput || !selectEl || !qtyInput || !resultBox) return;

  const customerName = nameInput.value.trim();
  const product = PRODUCTS.find(p => p.id === selectEl.value);
  const qty = parseInt(qtyInput.value, 10);

  if (!customerName) { resultBox.innerHTML = '<p class="error">⚠️ 請先輸入您的姓名。</p>'; nameInput.focus(); return; }
  if (!product) { resultBox.innerHTML = '<p class="error">⚠️ 請選擇硬件。</p>'; return; }
  if (isNaN(qty) || qty < 1) { resultBox.innerHTML = '<p class="error">⚠️ 數量必須為 1 或以上的整數。</p>'; qtyInput.focus(); return; }
  if (qty > MAX_QTY) { resultBox.innerHTML = `<p class="error">⚠️ 單次訂購數量不可超過 ${MAX_QTY} 件。</p>`; return; }

  const subtotal = product.price * qty;
  const shipping = subtotal >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
  const grandTotal = subtotal + shipping;
  const assemblyNote = grandTotal >= FREE_ASSEMBLY
    ? '<p class="bonus">🔧 恭喜！本單可享免費專業組裝服務。</p>'
    : `<p class="bonus">💡 再加 ${fmt(FREE_ASSEMBLY - grandTotal)} 即可享免費專業組裝服務。</p>`;

  resultBox.innerHTML = `
    <p>${escapeHTML(customerName)} 您好，您的訂單詳情如下：</p>
    <p style="margin-top:10px;">${escapeHTML(product.name)} × ${qty}　=　${fmt(subtotal)}</p>
    <p>運費：${shipping === 0 ? `免費（滿 ${fmt(FREE_SHIPPING)}）` : fmt(shipping)}</p>
    <div class="amount">總額：${fmt(grandTotal)}</div>
    ${assemblyNote}`;
}

/* ---------- 回首頁 ---------- */
function initBackTop() {
  const btn = $('backTop');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    btn.style.display = window.scrollY > 300 ? 'block' : 'none';
  }, { passive: true });
}

/* ---------- 初始化 ---------- */
document.addEventListener('DOMContentLoaded', () => {
  applyStoreConfig();
  updateCartBadge();
  initBackTop();


  if ($('homeHotGrid'))     renderProducts('homeHotGrid', ['gpu-4070', 'cpu-i7', 'ram-ddr5-32']);
  if ($('homeCategoryBar')) renderCategoryBar('homeCategoryBar');
  if ($('productGrid'))     renderProducts('productGrid');
  if ($('cartList'))        renderCartPage();


  const selectEl = $('productSelect');
  if (selectEl) {
    selectEl.innerHTML = PRODUCTS
      .map(p => `<option value="${p.id}">${escapeHTML(p.name)} - ${fmt(p.price)}</option>`)
      .join('');
  }
  const calcBtn = $('calcBtn');
  if (calcBtn) calcBtn.addEventListener('click', calculateTotal);
});
