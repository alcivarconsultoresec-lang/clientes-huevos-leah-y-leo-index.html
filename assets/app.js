const CATALOG_KEY = 'barrioos:huevos-leah-leo:products';
const CATEGORY_LABELS = {
  todos: 'Todos',
  ofertas: 'Ofertas',
  huevos: 'Huevos',
  quesos: 'Quesos',
  cecinas: 'Cecinas',
  vienesas: 'Vienesas',
  congelados: 'Congelados',
  abarrotes: 'Abarrotes',
  bebidas: 'Bebidas',
  mascotas: 'Mascotas'
};

let products = [];
let activeCategory = 'todos';
let searchTerm = '';

const productGrid = document.querySelector('#productGrid');
const categoryFilter = document.querySelector('#categoryFilter');
const searchInput = document.querySelector('#searchInput');
const emptyState = document.querySelector('#emptyState');
const cartItems = document.querySelector('#cartItems');
const cartEmpty = document.querySelector('#cartEmpty');
const cartTotal = document.querySelector('#cartTotal');
const floatingCartCount = document.querySelector('#floatingCartCount');
const offersStrip = document.querySelector('#offersStrip');

async function loadProducts() {
  const cached = localStorage.getItem(CATALOG_KEY);
  if (cached) {
    products = JSON.parse(cached);
    return;
  }

  const response = await fetch('assets/productos.json');
  products = await response.json();
  localStorage.setItem(CATALOG_KEY, JSON.stringify(products));
}

function productMatches(product) {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const matchesSearch = !normalizedSearch || [product.nombre, product.descripcion, product.unidad, product.categoria]
    .join(' ')
    .toLowerCase()
    .includes(normalizedSearch);
  const matchesCategory = activeCategory === 'todos'
    || product.categoria === activeCategory
    || (activeCategory === 'ofertas' && product.oferta);
  return matchesSearch && matchesCategory;
}

function renderCategories() {
  const categories = ['todos', 'ofertas', ...new Set(products.map((product) => product.categoria))];
  categoryFilter.innerHTML = categories.map((category) => {
    const label = CATEGORY_LABELS[category] || category;
    return `<option value="${category}">${label}</option>`;
  }).join('');
}

function renderOffers() {
  const offers = products.filter((product) => product.oferta).slice(0, 6);
  offersStrip.innerHTML = offers.map((product) => `
    <button class="offer-pill" type="button" data-offer-id="${product.id}">
      <span>Oferta</span>${product.nombre} · ${BarrioCart.money(product.precio)}
    </button>
  `).join('');
}

function productImage(product) {
  if (!product.imagen) return '<span aria-hidden="true">🛒</span>';
  if (product.imagen.startsWith('http') || product.imagen.startsWith('assets/')) {
    return `<img src="${product.imagen}" alt="${product.nombre}" loading="lazy">`;
  }
  return `<span aria-hidden="true">${product.imagen}</span>`;
}

function renderProducts() {
  const visible = products.filter(productMatches);
  productGrid.innerHTML = visible.map((product) => `
    <article class="product-card">
      <div class="product-card__image">${productImage(product)}</div>
      <div class="product-card__content">
        <div class="product-card__meta">
          <span>${CATEGORY_LABELS[product.categoria] || product.categoria}</span>
          ${product.oferta ? '<strong>Oferta</strong>' : ''}
        </div>
        <h3>${product.nombre}</h3>
        <p>${product.descripcion || ''}</p>
        <div class="product-card__bottom">
          <div><strong>${BarrioCart.money(product.precio)}</strong><small>${product.unidad || 'Unidad'}</small></div>
          <button class="btn btn--small" type="button" data-add-id="${product.id}">Agregar</button>
        </div>
      </div>
    </article>
  `).join('');
  emptyState.hidden = visible.length > 0;
}

function renderCart(items) {
  cartEmpty.hidden = items.length > 0;
  cartItems.innerHTML = items.map((item) => `
    <article class="cart-item">
      <div>
        <strong>${item.nombre}</strong>
        <small>${item.unidad} · ${BarrioCart.money(item.precio)}</small>
      </div>
      <div class="quantity-control">
        <button type="button" data-qty-id="${item.id}" data-delta="-1">−</button>
        <input type="number" min="1" value="${item.cantidad}" data-quantity-id="${item.id}" aria-label="Cantidad de ${item.nombre}">
        <button type="button" data-qty-id="${item.id}" data-delta="1">+</button>
      </div>
      <button class="icon-btn" type="button" data-remove-id="${item.id}" aria-label="Quitar ${item.nombre}">✕</button>
    </article>
  `).join('');
  cartTotal.textContent = BarrioCart.money(BarrioCart.cart.total());
  floatingCartCount.textContent = BarrioCart.cart.count();
}

function bindEvents() {
  searchInput.addEventListener('input', (event) => {
    searchTerm = event.target.value;
    renderProducts();
  });

  categoryFilter.addEventListener('change', (event) => {
    activeCategory = event.target.value;
    renderProducts();
  });

  document.addEventListener('click', (event) => {
    const addButton = event.target.closest('[data-add-id]');
    const removeButton = event.target.closest('[data-remove-id]');
    const qtyButton = event.target.closest('[data-qty-id]');
    const offerButton = event.target.closest('[data-offer-id]');

    if (addButton) {
      const product = products.find((entry) => entry.id === Number(addButton.dataset.addId));
      if (product) BarrioCart.cart.add(product);
    }

    if (removeButton) BarrioCart.cart.remove(Number(removeButton.dataset.removeId));

    if (qtyButton) {
      const item = BarrioCart.cart.items.find((entry) => entry.id === Number(qtyButton.dataset.qtyId));
      if (item) BarrioCart.cart.setQuantity(item.id, item.cantidad + Number(qtyButton.dataset.delta));
    }

    if (offerButton) {
      const product = products.find((entry) => entry.id === Number(offerButton.dataset.offerId));
      if (product) BarrioCart.cart.add(product);
    }
  });

  cartItems.addEventListener('change', (event) => {
    const input = event.target.closest('[data-quantity-id]');
    if (input) BarrioCart.cart.setQuantity(Number(input.dataset.quantityId), input.value);
  });

  document.querySelector('#clearCartBtn').addEventListener('click', () => BarrioCart.cart.clear());
  document.querySelector('#floatingCartBtn').addEventListener('click', () => {
    document.querySelector('.cart-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const customer = BarrioCart.readCustomer();
  document.querySelector('#customerName').value = customer.nombre || '';
  document.querySelector('#customerAddress').value = customer.direccion || '';
  document.querySelector('#customerReference').value = customer.referencia || '';

  document.querySelector('#checkoutForm').addEventListener('submit', (event) => {
    event.preventDefault();
    BarrioCart.checkout({
      nombre: document.querySelector('#customerName').value.trim(),
      direccion: document.querySelector('#customerAddress').value.trim(),
      referencia: document.querySelector('#customerReference').value.trim()
    });
  });
}

async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('sw.js');
    } catch (error) {
      console.warn('No se pudo registrar el service worker', error);
    }
  }
}

loadProducts()
  .then(() => {
    renderCategories();
    renderOffers();
    renderProducts();
    bindEvents();
    BarrioCart.cart.subscribe(renderCart);
    registerServiceWorker();
  })
  .catch((error) => {
    console.error('No se pudo cargar el catálogo', error);
    emptyState.hidden = false;
    emptyState.textContent = 'No se pudo cargar el catálogo. Revisa la conexión o el archivo productos.json.';
  });
