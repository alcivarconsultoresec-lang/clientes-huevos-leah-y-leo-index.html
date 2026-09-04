# Tap-Board · Live Sports Capture

Consola táctil para registrar eventos de baloncesto en tiempo real. Incluye botones grandes para ambos equipos, marcador de sesión, reproductor de capacitación, feed de última acción y confirmación por voz mediante la Web Speech API (`en-US`).

## Requisitos

- Node.js 20 o superior.
- Un navegador moderno con Web Speech API para la locución.

## Desarrollo local

```bash
npm install
npm run dev
```

## Despliegue en Vercel CLI

Ejecuta estos comandos desde la carpeta del proyecto:

```bash
# 1. Inicializar el repositorio Git local (si todavía no existe).
git init
git add .
git commit -m "feat: create Tap-Board sports capture console"

# 2. Autenticarse en Vercel.
npx vercel login

# 3. Desplegar a producción. Vercel devolverá una URL .vercel.app.
npx vercel --prod
```

La regla SPA de `vercel.json` hace que cualquier ruta sea atendida por `index.html`.
