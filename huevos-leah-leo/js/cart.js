// Sistema de Carrito de Compras

class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadCart();
    }

    // Agregar producto al carrito
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartUI();
        this.showNotification('Producto agregado');
    }

    // Remover producto del carrito
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    // Actualizar cantidad
    updateQuantity(productId, change) {
        const item = this.items.find(item => item.id === productId);
        
        if (item) {
            item.quantity += change;
            
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    // Obtener total del carrito
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Obtener cantidad total de items
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Guardar carrito en localStorage
    saveCart() {
        localStorage.setItem('leahLeoCart', JSON.stringify(this.items));
    }

    // Cargar carrito desde localStorage
    loadCart() {
        const savedCart = localStorage.getItem('leahLeoCart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.updateCartUI();
        }
    }

    // Limpiar carrito
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartUI();
    }

    // Generar mensaje de WhatsApp
    generateWhatsAppMessage() {
        if (this.items.length === 0) return '';

        let message = '*¡Hola! Quiero hacer el siguiente pedido:* 🛒\n\n';
        
        this.items.forEach(item => {
            const subtotal = item.price * item.quantity;
            message += `• ${item.quantity}x ${item.name} - ${formatPrice(subtotal)}\n`;
        });
        
        message += `\n*Total estimado: ${formatPrice(this.getTotal())}*`;
        message += `\n\n${storeConfig.deliveryMessage}`;
        message += `\nMétodos de pago: ${storeConfig.paymentMethods.join(', ')}`;
        
        return encodeURIComponent(message);
    }

    // Mostrar notificación
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-color);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Actualizar interfaz del carrito
    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        if (cartCount) {
            cartCount.textContent = this.getTotalItems();
        }
        
        if (cartItems) {
            if (this.items.length === 0) {
                cartItems.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 2rem;">Tu carrito está vacío</p>';
            } else {
                cartItems.innerHTML = this.items.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <span class="cart-item-price">${formatPrice(item.price)}</span>
                        </div>
                        <div class="cart-item-quantity">
                            <button class="qty-btn" onclick="cart.updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="cart.updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                `).join('');
            }
        }
        
        if (cartTotal) {
            cartTotal.textContent = formatPrice(this.getTotal());
        }
    }
}

// Crear instancia global del carrito
const cart = new ShoppingCart();

// Animaciones para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
