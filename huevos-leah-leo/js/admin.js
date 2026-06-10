/**
 * Sistema de Administración para Huevos Leah y Leo
 * Gestiona el catálogo de productos con autenticación simple.
 * 
 * NOTA DE SEGURIDAD: 
 * En una aplicación real de producción, la autenticación debe hacerse 
 * en el servidor (backend). Este sistema es solo para demostración frontend
 * y uso en entornos controlados o personales.
 */

// Configuración
const ADMIN_PASSWORD = "leahyleo2024"; // Contraseña maestra (cambiar en producción)
const STORAGE_KEY = "huevos_leah_leo_products";

// Elementos del DOM
const loginSection = document.getElementById('login-section');
const adminPanel = document.getElementById('admin-panel');
const loginForm = document.getElementById('login-form');
const passwordInput = document.getElementById('admin-password');
const errorMsg = document.getElementById('login-error');
const productForm = document.getElementById('product-form');
const productsListEl = document.getElementById('admin-products-list');

// Estado
let products = [];
let isEditing = false;
let editingId = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    loadProducts();
});

// --- Autenticación ---

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = passwordInput.value;

    if (password === ADMIN_PASSWORD) {
        // Login exitoso
        localStorage.setItem('admin_session', 'true');
        showAdminPanel();
    } else {
        // Error
        errorMsg.style.display = 'block';
        passwordInput.value = '';
        passwordInput.focus();
        
        // Animación de error
        passwordInput.style.borderColor = '#e74c3c';
        setTimeout(() => {
            passwordInput.style.borderColor = '#eee';
        }, 2000);
    }
});

function checkSession() {
    const session = localStorage.getItem('admin_session');
    if (session === 'true') {
        showAdminPanel();
    } else {
        showLogin();
    }
}

function showLogin() {
    loginSection.style.display = 'block';
    adminPanel.style.display = 'none';
}

function showAdminPanel() {
    loginSection.style.display = 'none';
    adminPanel.style.display = 'block';
    renderProductList();
}

function logout() {
    localStorage.removeItem('admin_session');
    passwordInput.value = '';
    errorMsg.style.display = 'none';
    showLogin();
}

// --- Gestión de Productos ---

function loadProducts() {
    // Intentar cargar desde localStorage primero (para persistencia de cambios)
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
        products = JSON.parse(stored);
    } else {
        // Si no hay nada guardado, usar los productos por defecto del archivo products.js
        // Asumimos que window.productsData existe si se cargó products.js
        if (typeof window.productsData !== 'undefined') {
            products = [...window.productsData];
            saveProducts(); // Guardar copia local
        } else {
            products = [];
        }
    }
}

function saveProducts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    renderProductList();
}

function renderProductList() {
    productsListEl.innerHTML = '';

    if (products.length === 0) {
        productsListEl.innerHTML = '<p style="text-align:center; color:#999; padding:2rem;">No hay productos en el catálogo.</p>';
        return;
    }

    products.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card-admin';
        
        const priceFormatted = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(prod.price);
        
        card.innerHTML = `
            <div style="display:flex; align-items:center; gap:15px;">
                <div style="width:60px; height:60px; background:#f0f0f0; border-radius:8px; display:flex; align-items:center; justify-content:center; overflow:hidden; flex-shrink:0;">
                    ${prod.image ? `<img src="${prod.image}" alt="${prod.name}" style="width:100%; height:100%; object-fit:cover;">` : '📦'}
                </div>
                <div>
                    <h4 style="margin:0; color:#2c3e50;">${prod.name}</h4>
                    <p style="margin:4px 0 0 0; font-size:0.85rem; color:#7f8c8d;">
                        <span style="background:#eee; padding:2px 6px; border-radius:4px; margin-right:5px;">${prod.category}</span>
                        ${prod.description || ''}
                    </p>
                    <strong style="color:#E6A13C;">${priceFormatted}</strong>
                </div>
            </div>
            <div>
                <button class="btn-edit" onclick="editProduct(${prod.id})">Editar</button>
                <button class="btn-delete" onclick="deleteProduct(${prod.id})">Eliminar</button>
            </div>
        `;
        
        productsListEl.appendChild(card);
    });
}

// --- Formulario Agregar/Editar ---

productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('prod-name').value;
    const price = parseFloat(document.getElementById('prod-price').value);
    const category = document.getElementById('prod-category').value;
    const image = document.getElementById('prod-image').value;
    const description = document.getElementById('prod-desc').value;

    if (isEditing && editingId !== null) {
        // Actualizar existente
        const index = products.findIndex(p => p.id === editingId);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                price,
                category,
                image,
                description
            };
        }
        isEditing = false;
        editingId = null;
        document.getElementById('form-title').textContent = 'Agregar Nuevo Producto';
        document.getElementById('btn-save-action').textContent = 'Guardar Producto';
    } else {
        // Crear nuevo
        const newProduct = {
            id: Date.now(), // ID único basado en timestamp
            name,
            price,
            category,
            image,
            description
        };
        products.push(newProduct);
    }

    saveProducts();
    resetForm();
    alert(isEditing ? 'Producto actualizado correctamente' : 'Producto agregado correctamente');
});

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    isEditing = true;
    editingId = id;

    document.getElementById('prod-id').value = product.id;
    document.getElementById('prod-name').value = product.name;
    document.getElementById('prod-price').value = product.price;
    document.getElementById('prod-category').value = product.category;
    document.getElementById('prod-image').value = product.image || '';
    document.getElementById('prod-desc').value = product.description || '';

    document.getElementById('form-title').textContent = 'Editar Producto';
    document.getElementById('btn-save-action').textContent = 'Actualizar Producto';
    
    // Scroll al formulario
    document.querySelector('.form-add-product').scrollIntoView({ behavior: 'smooth' });
}

function deleteProduct(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        
        // Si estábamos editando el producto eliminado, resetear form
        if (isEditing && editingId === id) {
            resetForm();
        }
    }
}

function resetForm() {
    productForm.reset();
    isEditing = false;
    editingId = null;
    document.getElementById('form-title').textContent = 'Agregar Nuevo Producto';
    document.getElementById('btn-save-action').textContent = 'Guardar Producto';
}

// Hacer funciones globales para acceder desde HTML
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.resetForm = resetForm;
window.logout = logout;
