const CATALOG_KEY = 'barrioos:huevos-leah-leo:products';
const CATEGORIES = ['huevos', 'quesos', 'cecinas', 'vienesas', 'ofertas', 'congelados', 'abarrotes', 'bebidas', 'mascotas'];
const CATEGORY_LABELS = {
  huevos: 'Huevos',
  quesos: 'Quesos',
  cecinas: 'Cecinas',
  vienesas: 'Vienesas',
  ofertas: 'Ofertas',
  congelados: 'Congelados',
  abarrotes: 'Abarrotes',
  bebidas: 'Bebidas',
  mascotas: 'Mascotas'
};

let products = [];
let searchTerm = '';

const form = document.querySelector('#productForm');
const productId = document.querySelector('#productId');
const productName = document.querySelector('#productName');
const productCategory = document.querySelector('#productCategory');
const productPrice = document.querySelector('#productPrice');
const productUnit = document.querySelector('#productUnit');
const productDescription = document.querySelector('#productDescription');
const productImage = document.querySelector('#productImage');
const productOffer = document.querySelector('#productOffer');
const productList = document.querySelector('#adminProductList');
const formMode = document.querySelector('#formMode');

function money(value) {
  const number = Number(value || 0);
  if (number <= 0) return 'Consultar';
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(number);
}

function saveProducts() {
  localStorage.setItem(CATALOG_KEY, JSON.stringify(products));
}

async function loadProducts(forceJson = false) {
  const stored = localStorage.getItem(CATALOG_KEY);
  if (stored && !forceJson) {
    products = JSON.parse(stored);
    return;
  }
  const response = await fetch('assets/productos.json');
  products = await response.json();
  saveProducts();
}

function renderCategoryOptions() {
  productCategory.innerHTML = CATEGORIES.map((category) => `<option value="${category}">${CATEGORY_LABELS[category]}</option>`).join('');
}

function resetForm() {
  form.reset();
  productId.value = '';
  productImage.value = '🛒';
  formMode.textContent = 'Crear producto';
}

function renderProducts() {
  const query = searchTerm.trim().toLowerCase();
  const visible = products.filter((product) => !query || [product.nombre, product.descripcion, product.categoria, product.unidad]
    .join(' ')
    .toLowerCase()
    .includes(query));

  productList.innerHTML = visible.map((product) => `
    <article class="admin-product">
      <div class="admin-product__emoji">${product.imagen || '🛒'}</div>
      <div>
        <div class="product-card__meta">
          <span>${CATEGORY_LABELS[product.categoria] || product.categoria}</span>
          ${product.oferta ? '<strong>Oferta</strong>' : ''}
        </div>
        <h3>${product.nombre}</h3>
        <p>${product.descripcion || ''}</p>
        <strong>${money(product.precio)}</strong> <small>${product.unidad || 'Unidad'}</small>
      </div>
      <div class="admin-product__actions">
        <button class="btn btn--small" type="button" data-edit-id="${product.id}">Editar</button>
        <button class="btn btn--danger btn--small" type="button" data-delete-id="${product.id}">Eliminar</button>
      </div>
    </article>
  `).join('');

  if (!visible.length) {
    productList.innerHTML = '<p class="empty-state">No hay productos para mostrar.</p>';
  }
}

function fillForm(product) {
  productId.value = product.id;
  productName.value = product.nombre;
  productCategory.value = product.categoria;
  productPrice.value = product.precio;
  productUnit.value = product.unidad || '';
  productDescription.value = product.descripcion || '';
  productImage.value = product.imagen || '🛒';
  productOffer.checked = Boolean(product.oferta);
  formMode.textContent = 'Editar producto';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextId() {
  return products.length ? Math.max(...products.map((product) => Number(product.id))) + 1 : 1;
}

function bindEvents() {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const id = productId.value ? Number(productId.value) : nextId();
    const product = {
      id,
      nombre: productName.value.trim(),
      categoria: productCategory.value,
      precio: Number(productPrice.value || 0),
      unidad: productUnit.value.trim() || 'Unidad',
      descripcion: productDescription.value.trim(),
      imagen: productImage.value.trim() || '🛒',
      oferta: productOffer.checked || productCategory.value === 'ofertas'
    };

    const existingIndex = products.findIndex((entry) => entry.id === id);
    if (existingIndex >= 0) {
      products[existingIndex] = product;
    } else {
      products.unshift(product);
    }

    saveProducts();
    resetForm();
    renderProducts();
  });

  productList.addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-edit-id]');
    const deleteButton = event.target.closest('[data-delete-id]');

    if (editButton) {
      const product = products.find((entry) => entry.id === Number(editButton.dataset.editId));
      if (product) fillForm(product);
    }

    if (deleteButton) {
      const id = Number(deleteButton.dataset.deleteId);
      const product = products.find((entry) => entry.id === id);
      if (product && confirm(`¿Eliminar ${product.nombre}?`)) {
        products = products.filter((entry) => entry.id !== id);
        saveProducts();
        renderProducts();
      }
    }
  });

  document.querySelector('#cancelEditBtn').addEventListener('click', resetForm);
  document.querySelector('#adminSearch').addEventListener('input', (event) => {
    searchTerm = event.target.value;
    renderProducts();
  });

  document.querySelector('#resetCatalogBtn').addEventListener('click', async () => {
    if (!confirm('¿Restaurar el catálogo inicial? Se perderán los cambios locales.')) return;
    await loadProducts(true);
    resetForm();
    renderProducts();
  });

  document.querySelector('#exportBtn').addEventListener('click', async () => {
    const json = JSON.stringify(products, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      alert('Catálogo copiado al portapapeles como JSON.');
    } catch (error) {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'productos-huevos-leah-y-leo.json';
      link.click();
      URL.revokeObjectURL(url);
    }
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
    renderCategoryOptions();
    resetForm();
    renderProducts();
    bindEvents();
    registerServiceWorker();
  })
  .catch((error) => {
    console.error('No se pudo cargar el catálogo', error);
    productList.innerHTML = '<p class="empty-state">No se pudo cargar el catálogo.</p>';
  });
