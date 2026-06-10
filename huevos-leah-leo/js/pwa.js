// PWA (Progressive Web App) - Huevos Leah y Leo

// Registro del Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registrado:', registration.scope);
            })
            .catch(error => {
                console.log('Error al registrar Service Worker:', error);
            });
    });
}

// Manifest para PWA
const manifest = {
    "name": "Huevos Leah y Leo",
    "short_name": "Leah y Leo",
    "description": "Venta de huevos frescos y productos de almacén",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#FFF9F0",
    "theme_color": "#E6A13C",
    "orientation": "portrait-primary",
    "icons": [
        {
            "src": "assets/icons/icon-72x72.png",
            "sizes": "72x72",
            "type": "image/png"
        },
        {
            "src": "assets/icons/icon-96x96.png",
            "sizes": "96x96",
            "type": "image/png"
        },
        {
            "src": "assets/icons/icon-128x128.png",
            "sizes": "128x128",
            "type": "image/png"
        },
        {
            "src": "assets/icons/icon-144x144.png",
            "sizes": "144x144",
            "type": "image/png"
        },
        {
            "src": "assets/icons/icon-152x152.png",
            "sizes": "152x152",
            "type": "image/png"
        },
        {
            "src": "assets/icons/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any maskable"
        },
        {
            "src": "assets/icons/icon-384x384.png",
            "sizes": "384x384",
            "type": "image/png"
        },
        {
            "src": "assets/icons/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any maskable"
        }
    ]
};

// Crear archivo manifest.json dinámicamente
const manifestLink = document.querySelector('link[rel="manifest"]');
if (manifestLink) {
    const manifestBlob = new Blob([JSON.stringify(manifest)], {type: 'application/json'});
    const manifestURL = URL.createObjectURL(manifestBlob);
    manifestLink.href = manifestURL;
}

// Instalación de la PWA
let deferredPrompt;
const installButton = document.createElement('button');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Mostrar botón de instalación
    showInstallPromotion();
});

function showInstallPromotion() {
    // Crear banner de instalación
    const installBanner = document.createElement('div');
    installBanner.id = 'installBanner';
    installBanner.innerHTML = `
        <div style="position: fixed; bottom: 0; left: 0; right: 0; background: var(--white); padding: 1rem; box-shadow: 0 -2px 10px rgba(0,0,0,0.1); z-index: 1000; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>Instala nuestra app</strong>
                <p style="margin: 0; font-size: 0.875rem; color: var(--text-light);">Accede rápido a tus pedidos</p>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button id="installBtn" style="background: var(--primary-color); color: white; border: none; padding: 0.5rem 1rem; border-radius: 8px; font-weight: 600;">Instalar</button>
                <button id="dismissInstallBtn" style="background: transparent; color: var(--text-light); border: none; padding: 0.5rem; font-size: 1.25rem;">&times;</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(installBanner);
    
    document.getElementById('installBtn').addEventListener('click', installApp);
    document.getElementById('dismissInstallBtn').addEventListener('click', () => {
        installBanner.remove();
    });
}

async function installApp() {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
        console.log('Usuario aceptó instalar la app');
    }
    
    deferredPrompt = null;
    document.getElementById('installBanner').remove();
}

// Detectar si la app está instalada
window.addEventListener('appinstalled', () => {
    console.log('PWA instalada exitosamente');
    const banner = document.getElementById('installBanner');
    if (banner) banner.remove();
});

// Manejar modo offline
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
    const statusBanner = document.createElement('div');
    
    if (navigator.onLine) {
        // Online
        const existingBanner = document.getElementById('offlineBanner');
        if (existingBanner) existingBanner.remove();
    } else {
        // Offline
        statusBanner.id = 'offlineBanner';
        statusBanner.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; background: var(--primary-color); color: white; padding: 0.5rem; text-align: center; z-index: 3000; font-size: 0.875rem;">
                📡 Estás navegando sin conexión. Algunas funciones pueden no estar disponibles.
            </div>
        `;
        document.body.appendChild(statusBanner);
    }
}

// Verificar estado inicial
updateOnlineStatus();

console.log('PWA de Huevos Leah y Leo cargada');
