(function () {
  const CART_KEY = 'barrioos:huevos-leah-leo:cart';
  const CUSTOMER_KEY = 'barrioos:huevos-leah-leo:customer';
  const WHATSAPP_NUMBER = '56921750687';

  function money(value) {
    const number = Number(value || 0);
    if (number <= 0) return 'Consultar';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(number);
  }

  function readJson(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.warn('No se pudo leer localStorage', error);
      return fallback;
    }
  }

  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  const cart = {
    items: readJson(CART_KEY, []),
    listeners: [],
    subscribe(listener) {
      this.listeners.push(listener);
      listener(this.items);
    },
    notify() {
      saveJson(CART_KEY, this.items);
      this.listeners.forEach((listener) => listener(this.items));
    },
    add(product) {
      const existing = this.items.find((item) => item.id === product.id);
      if (existing) {
        existing.cantidad += 1;
      } else {
        this.items.push({
          id: product.id,
          nombre: product.nombre,
          precio: Number(product.precio || 0),
          unidad: product.unidad || 'Unidad',
          cantidad: 1
        });
      }
      this.notify();
    },
    remove(productId) {
      this.items = this.items.filter((item) => item.id !== productId);
      this.notify();
    },
    setQuantity(productId, quantity) {
      const item = this.items.find((entry) => entry.id === productId);
      if (!item) return;
      item.cantidad = Math.max(1, Number(quantity || 1));
      this.notify();
    },
    clear() {
      this.items = [];
      this.notify();
    },
    total() {
      return this.items.reduce((sum, item) => sum + (Number(item.precio || 0) * item.cantidad), 0);
    },
    count() {
      return this.items.reduce((sum, item) => sum + item.cantidad, 0);
    }
  };

  function buildWhatsAppMessage(customer) {
    const lines = [
      'Hola Huevos Leah y Leo 👋',
      'Quiero hacer este pedido:',
      ''
    ];

    cart.items.forEach((item, index) => {
      const subtotal = Number(item.precio || 0) * item.cantidad;
      const priceText = item.precio > 0 ? ` — ${money(subtotal)}` : ' — consultar precio';
      lines.push(`${index + 1}. ${item.cantidad} x ${item.nombre} (${item.unidad})${priceText}`);
    });

    lines.push('', `Total estimado: ${money(cart.total())}`, '');
    lines.push(`Nombre: ${customer.nombre || 'No indicado'}`);
    lines.push(`Dirección: ${customer.direccion || 'No indicada'}`);
    lines.push(`Referencia: ${customer.referencia || 'Sin referencia'}`);
    lines.push('', '¿Me confirman disponibilidad y total final?');

    return lines.join('\n');
  }

  function checkout(customer) {
    if (!cart.items.length) {
      alert('Agrega productos al carrito antes de enviar el pedido.');
      return;
    }
    saveJson(CUSTOMER_KEY, customer);
    const message = encodeURIComponent(buildWhatsAppMessage(customer));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank', 'noopener');
  }

  window.BarrioCart = {
    cart,
    money,
    checkout,
    readCustomer: () => readJson(CUSTOMER_KEY, { nombre: '', direccion: '', referencia: '' })
  };
}());
