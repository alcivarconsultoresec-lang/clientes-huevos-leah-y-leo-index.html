// Aplicación Principal - Huevos Leah y Leo

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la aplicación
    initApp();
});

function initApp() {
    renderProducts();
    renderOffers();
    setupFilters();
    setupSearch();
    setupCartModal();
    setupWhatsAppButtons();
    setupSmoothScroll();
}

// Renderizar productos en el grid
function renderProducts(filteredProducts = products) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) return;
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-light);">No se encontraron productos</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <p style="color: var(--text-light); font-size: 0.875rem; margin-bottom: 0.5rem;">${product.description}</p>
                <div class="product-price">${formatPrice(product.price)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                </button>
            </div>
        </div>
    `).join('');
}

// Renderizar ofertas destacadas
function renderOffers() {
    const offersGrid = document.getElementById('offersGrid');
    
    if (!offersGrid) return;
    
    const offers = products.filter(p => p.featured && p.originalPrice);
    
    if (offers.length === 0) {
        offersGrid.innerHTML = '<p style="text-align: center; color: var(--text-light);">No hay ofertas disponibles</p>';
        return;
    }
    
    offersGrid.innerHTML = offers.map(offer => {
        const discount = Math.round(((offer.originalPrice - offer.price) / offer.originalPrice) * 100);
        
        return `
            <div class="offer-card">
                <span class="offer-badge">-${discount}%</span>
                <div class="product-image" style="height: 150px; font-size: 2.5rem;">${offer.image}</div>
                <h3 style="margin: 1rem 0 0.5rem;">${offer.name}</h3>
                <p style="color: var(--text-light); font-size: 0.875rem; margin-bottom: 1rem;">${offer.description}</p>
                <div style="margin-bottom: 1rem;">
                    <span style="text-decoration: line-through; color: var(--text-light); margin-right: 0.5rem;">${formatPrice(offer.originalPrice)}</span>
                    <span style="font-size: 1.5rem; font-weight: 700; color: var(--accent-color);">${formatPrice(offer.price)}</span>
                </div>
                <button class="btn btn-primary btn-full" onclick="addToCart(${offer.id})">
                    <i class="fas fa-shopping-cart"></i> Agregar
                </button>
            </div>
        `;
    }).join('');
}

// Configurar filtros de categorías
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover clase active de todos
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Agregar clase active al actual
            btn.classList.add('active');
            
            // Filtrar productos
            const category = btn.dataset.category;
            
            if (category === 'all') {
                renderProducts(products);
            } else {
                const filtered = products.filter(p => p.category === category);
                renderProducts(filtered);
            }
        });
    });
}

// Configurar buscador
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            renderProducts(products);
            return;
        }
        
        const filtered = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm)
        );
        
        renderProducts(filtered);
    });
}

// Configurar modal del carrito
function setupCartModal() {
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            if (cartModal) cartModal.classList.add('active');
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            if (cartModal) cartModal.classList.remove('active');
        });
    }
    
    // Cerrar al hacer click fuera
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
            }
        });
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            checkoutWhatsApp();
        });
    }
}

// Configurar botones de WhatsApp
function setupWhatsAppButtons() {
    const whatsappNumber = storeConfig.whatsappNumber;
    const whatsappLinks = document.querySelectorAll('#whatsappFloat, #mainWhatsapp');
    
    whatsappLinks.forEach(link => {
        link.href = `https://wa.me/${whatsappNumber}`;
        link.target = '_blank';
    });
}

// Finalizar compra por WhatsApp
function checkoutWhatsApp() {
    const message = cart.generateWhatsAppMessage();
    
    if (!message) {
        cart.showNotification('Agrega productos al carrito primero');
        return;
    }
    
    const whatsappUrl = `https://wa.me/${storeConfig.whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Opcional: limpiar carrito después de enviar
    // cart.clearCart();
    // document.getElementById('cartModal').classList.remove('active');
}

// Agregar producto al carrito (función global)
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        cart.addItem(product);
    }
};

// Smooth scroll para navegación
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                
                const target = document.querySelector(href);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Cerrar modal si está abierto
                    const cartModal = document.getElementById('cartModal');
                    if (cartModal) cartModal.classList.remove('active');
                }
            }
        });
    });
}

// Actualizar información de la tienda en el DOM
function updateStoreInfo() {
    // Actualizar horarios si es necesario
    // Actualizar métodos de pago
    // etc.
}
