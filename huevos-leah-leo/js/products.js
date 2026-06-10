// Configuración de productos - FÁCIL DE EDITAR
// Para agregar nuevos productos, simplemente copia un objeto y modifica los valores

const products = [
    // HUEVOS
    {
        id: 1,
        name: "Huevos AA",
        category: "huevos",
        price: 3500,
        image: "🥚",
        description: "Huevos frescos categoría AA",
        featured: true
    },
    {
        id: 2,
        name: "Huevos A",
        category: "huevos",
        price: 3200,
        image: "🥚",
        description: "Huevos frescos categoría A",
        featured: true
    },
    
    // QUESOS
    {
        id: 3,
        name: "Queso Gauda La Vaquita",
        category: "quesos",
        price: 4500,
        image: "🧀",
        description: "Queso gauda tradicional",
        featured: false
    },
    {
        id: 4,
        name: "Queso Gauda Corrales de Valdivia",
        category: "quesos",
        price: 5200,
        image: "🧀",
        description: "Queso gauda premium del sur",
        featured: false
    },
    {
        id: 5,
        name: "Queso Frutillar",
        category: "quesos",
        price: 4800,
        image: "🧀",
        description: "Queso ahumado tradicional",
        featured: false
    },
    {
        id: 6,
        name: "Queso Soprole",
        category: "quesos",
        price: 3900,
        image: "🧀",
        description: "Queso fresco familiar",
        featured: false
    },
    
    // CECINAS
    {
        id: 7,
        name: "Jamón de Pavo Soprole",
        category: "cecinas",
        price: 5500,
        image: "🍖",
        description: "Jamón de pavo en rebanadas",
        featured: false
    },
    {
        id: 8,
        name: "Pechuga de Pavo Soprole",
        category: "cecinas",
        price: 5800,
        image: "🍖",
        description: "Pechuga de pavo seleccionada",
        featured: false
    },
    {
        id: 9,
        name: "Vienesas PF",
        category: "cecinas",
        price: 2500,
        image: "🌭",
        description: "Vienesas tradicionales pack",
        featured: false
    },
    {
        id: 10,
        name: "Vienesas San Jorge",
        category: "cecinas",
        price: 2800,
        image: "🌭",
        description: "Vienesas premium",
        featured: false
    },
    {
        id: 11,
        name: "Vienesas Montina",
        category: "cecinas",
        price: 2600,
        image: "🌭",
        description: "Vienesas de campo",
        featured: false
    },
    
    // PACKS
    {
        id: 12,
        name: "Pack Quesos Mix",
        category: "ofertas",
        price: 12000,
        image: "🎁",
        description: "Selección de quesos variados",
        featured: true,
        originalPrice: 14500
    },
    {
        id: 13,
        name: "Pack Desayuno",
        category: "ofertas",
        price: 15000,
        image: "🎁",
        description: "Huevos + Queso + Cecinas",
        featured: true,
        originalPrice: 18000
    }
];

// Configuración de la tienda - FÁCIL DE EDITAR
const storeConfig = {
    whatsappNumber: "56921750687",
    currency: "$",
    minOrder: 5000,
    deliveryMessage: "Consulta por tu dirección para despacho",
    paymentMethods: ["Efectivo", "Transferencia"],
    businessHours: {
        weekdays: "Lunes a Sábado: 9:00 - 20:00",
        weekend: "Domingo: 10:00 - 14:00"
    },
    coverage: "Despachos locales en el sector"
};

// Función para formatear precio
function formatPrice(price) {
    return `${storeConfig.currency}${price.toLocaleString('es-CL')}`;
}

// Exportar para usar en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { products, storeConfig, formatPrice };
}
