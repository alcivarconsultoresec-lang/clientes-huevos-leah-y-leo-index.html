# README - Huevos Leah y Leo

## 🥚 Sitio Web Especializado en Venta de Huevos

Sitio web progresivo (PWA) desarrollado bajo el protocolo **NOX FORGE** para la venta de huevos y productos de almacén.

---

## 🚀 Características Principales

### Diagnóstico Comercial
- **Enfoque**: Venta especializada en huevos con catálogo complementario
- **Público**: Vecinos y familias del sector
- **Canal principal**: WhatsApp (+56 9 2175 0687)
- **Objetivo**: Generar pedidos en menos de 3 minutos

### Concepto Visual
- Diseño limpio y familiar
- Colores cálidos (amarillo huevo, tonos tierra)
- Iconografía intuitiva
- Animaciones sutiles

### Arquitectura UX
- Navegación móvil primero
- Filtros por categoría
- Buscador integrado
- Carrito persistente (localStorage)

### Interfaz Premium
- Tipografía Poppins
- Gradientes modernos
- Tarjetas con sombras
- Botones redondeados

### Movimiento
- Animación flotante del huevo
- Transiciones suaves
- Notificaciones deslizantes
- Smooth scroll

---

## 📁 Estructura del Proyecto

```
huevos-leah-leo/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos completos
├── js/
│   ├── products.js     # Catálogo de productos (FÁCIL DE EDITAR)
│   ├── cart.js         # Sistema de carrito
│   ├── app.js          # Lógica principal
│   └── pwa.js          # Funcionalidades PWA
├── sw.js               # Service Worker
├── assets/
│   ├── img/            # Imágenes (pendientes)
│   └── icons/          # Iconos PWA (pendientes)
└── README.md           # Este archivo
```

---

## 🛒 Funcionalidades

### Para el Cliente
- ✅ Catálogo filtrable por categorías
- ✅ Buscador de productos
- ✅ Carrito de compras
- ✅ Pedido automático por WhatsApp
- ✅ Ofertas destacadas
- ✅ Botón flotante de WhatsApp
- ✅ PWA instalable
- ✅ Funcionamiento offline parcial

### Para el Administrador
- ✅ Productos editables en `js/products.js`
- ✅ Precios fácilmente modificables
- ✅ Agregar nuevos productos sin tocar código
- ✅ Configuración centralizada en `storeConfig`

---

## 🔧 Cómo Editar Productos

Abrir `js/products.js` y modificar el array `products`:

```javascript
{
    id: 14,                    // ID único
    name: "Nombre del producto",
    category: "huevos",        // huevos|quesos|cecinas|ofertas
    price: 3500,               // Precio en pesos chilenos
    image: "🥚",               // Emoji o URL de imagen
    description: "Descripción breve",
    featured: true,            // Si aparece en ofertas
    originalPrice: 4000        // Solo si es oferta (opcional)
}
```

### Configurar Tienda

En `js/products.js`, editar `storeConfig`:

```javascript
const storeConfig = {
    whatsappNumber: "56921750687",  // Número de WhatsApp
    currency: "$",                   // Símbolo de moneda
    minOrder: 5000,                  // Pedido mínimo
    // ... más configuraciones
};
```

---

## 🌐 Instalación y Uso

### Opción 1: Servidor Local
```bash
cd huevos-leah-leo
python3 -m http.server 8000
# Abrir http://localhost:8000
```

### Opción 2: GitHub Pages
1. Subir el repositorio a GitHub
2. Activar GitHub Pages en Settings
3. El sitio estará disponible en `https://usuario.github.io/huevos-leah-leo`

### Opción 3: Netlify/Vercel
1. Conectar repositorio
2. Deploy automático
3. Dominio personalizado opcional

---

## 📱 PWA (Progressive Web App)

El sitio es instalable como aplicación móvil:

1. Abrir en Chrome/Safari móvil
2. Tocar "Agregar a pantalla de inicio"
3. Acceder como app nativa

### Requisitos para PWA completa
- [ ] Generar iconos en `assets/icons/`
- [ ] Usar HTTPS en producción
- [ ] Configurar manifest.json estático

---

## 🎨 Personalización

### Cambiar Colores
Editar `css/styles.css`, variables `:root`:

```css
:root {
    --primary-color: #E6A13C;      /* Color principal */
    --secondary-color: #2C3E50;    /* Color secundario */
    --accent-color: #27AE60;       /* Color de énfasis */
    --whatsapp-color: #25D366;     /* Color WhatsApp */
}
```

### Agregar Imágenes Reales
Reemplazar emojis por imágenes en `products.js`:

```javascript
image: "assets/img/huevos-aa.jpg"  // En lugar de "🥚"
```

---

## 📊 SEO Local

Optimizado para búsqueda local:

- Meta descripción incluida
- Título optimizado
- Estructura semántica HTML5
- Schema.org pendiente de implementar

---

## 🔐 Seguridad

- Sin backend (solo frontend)
- Datos persistentes en localStorage
- WhatsApp usa API oficial segura
- No se almacenan datos sensibles

---

## 📞 Soporte

Para cambios o soporte:
- WhatsApp: +56 9 2175 0687
- Email: [pendiente]

---

## 📝 Licencia

Propiedad de Huevos Leah y Leo.
Desarrollado bajo protocolo NOX FORGE.

---

## 🚀 Próximas Mejoras

- [ ] Panel de administración web
- [ ] Subida de imágenes desde admin
- [ ] Historial de pedidos
- [ ] Integración con Google Business
- [ ] Testimonios de clientes
- [ ] Mapa de cobertura
- [ ] Sistema de puntos/fidelización

---

**¡Listo para vender!** 🥚✨
