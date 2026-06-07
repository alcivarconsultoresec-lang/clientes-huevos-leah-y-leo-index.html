# Huevos Leah y Leo · BarrioOS PWA

Progressive Web App liviana para el catálogo y pedidos por WhatsApp de **Huevos Leah y Leo**.

## Qué incluye

- Catálogo offline-first cargado desde `assets/productos.json`.
- Carrito con persistencia en `localStorage`.
- Checkout por WhatsApp al número oficial `+56 9 2175 0687`.
- Panel local de administración en `admin.html` para crear, editar, eliminar y marcar ofertas.
- Manifest y service worker para instalación como PWA en Android.
- Archivos estáticos compatibles con GitHub Pages, sin frameworks ni backend.

## Desarrollo local

```bash
python3 -m http.server 4173
```

Luego abre:

- Tienda: <http://127.0.0.1:4173/>
- Admin: <http://127.0.0.1:4173/admin.html>

## Datos locales

El catálogo inicial vive en `assets/productos.json`. Al abrir la app, se copia a `localStorage` para permitir cambios desde el panel admin sin backend. Para volver a la versión base, usa el botón **Restaurar catálogo** en el admin.
