/**
 * =========================================================================
 * CONFIGURACIÓN CENTRALIZADA - MAESTRA SELENE (ESPAÑA)
 * =========================================================================
 */

const SITE_CONFIG = {
    master: {
        name: "Maestra Selene",
        title: "Guía Espiritual & Custodia de la Alta Magia",
        subtitle: "Tradición Ancestral & Santuario de Poder para España",
        experienceYears: "+25 años de experiencia",
        location: "Madrid · Barcelona · Toda España",
        rating: "4.99",
        reviewsCount: "+1,480 Casos Resueltos en España"
    },

    whatsapp: {
        phone: "50239424561",
        defaultMessage: "¡Hola Maestra Selene! Necesito una consulta espiritual urgente y confidencial desde España. ¿Podría asesorarme?",
        urgencyMessage: "Hola Maestra Selene, veo que quedan pocos cupos prioritarios para hoy en España. Deseo apartar mi consulta de inmediato.",
        serviceMessage: (serviceName) => `Hola Maestra Selene, solicito información y consulta urgente sobre el ritual: "${serviceName}".`,
        oracleMessage: (cardNames) => `Hola Maestra Selene, realicé la tirada del Tarot en tu página y me salieron las cartas: [${cardNames}]. Deseo mi interpretación completa.`,
        diagMessage: (area, symptom) => `Hola Maestra Selene, realicé el test espiritual sobre ${area || 'mi caso'} con síntoma de ${symptom || 'bloqueo'}. Deseo consultar con usted.`,
        testimonialMessage: "Hola Maestra Selene, vi los casos de éxito resueltos en España y deseo una ayuda y resultado similar para mi caso."
    },

    // Notificaciones de Prueba Social en Vivo (España)
    liveActivity: [
        { name: "Elena M.", city: "Madrid", service: "Amarre de Retorno de Pareja", time: "hace 2 minutos" },
        { name: "Carlos B.", city: "Barcelona", service: "Apertura de Caminos & Loterías", time: "hace 5 minutos" },
        { name: "Valeria S.", city: "Valencia", service: "Pasión & Endulzamiento", time: "hace 8 minutos" },
        { name: "Andrés G.", city: "Sevilla", service: "Limpieza Espiritual & Destrabe", time: "hace 12 minutos" },
        { name: "Fernando T.", city: "Málaga", service: "Dinero, Trabajo y Bienestar", time: "hace 15 minutos" },
        { name: "Roberto V.", city: "Bilbao", service: "Sellos y Protección Áurica", time: "hace 19 minutos" },
        { name: "Beatriz C.", city: "Zaragoza", service: "Lectura de Tarot de Amor", time: "hace 23 minutos" },
        { name: "Daniel M.", city: "Alicante", service: "Retiro de Terceras Personas", time: "hace 28 minutos" },
        { name: "Carmen R.", city: "Palma de Mallorca", service: "Recupera a tu Ex", time: "hace 33 minutos" },
        { name: "Javier S.", city: "Murcia", service: "Magia Roja & Fidelidad", time: "hace 38 minutos" },
        { name: "Lucía P.", city: "Vigo", service: "Endulzamiento y Dominio", time: "hace 42 minutos" },
        { name: "Gonzalo F.", city: "Valladolid", service: "Limpieza de Mal de Ojo", time: "hace 47 minutos" }
    ],

    // Cartas de Tarot para el Módulo Interactivo
    oracleCards: [
        { id: "sol", name: "El Sol", image: "assets/tarot/tarot-sol.jpg", tag: "Éxito & Unión" },
        { id: "amantes", name: "Los Enamorados", image: "assets/tarot/tarot-amantes.jpg", tag: "Amor & Pasión" },
        { id: "rueda", name: "La Rueda de la Fortuna", image: "assets/tarot/tarot-rueda.jpg", tag: "Giro de Destino" },
        { id: "mago", name: "El Mago", image: "assets/tarot/tarot-mago.jpg", tag: "Poder de Inicio" },
        { id: "estrella", name: "La Estrella", image: "assets/tarot/tarot-estrella.jpg", tag: "Esperanza & Luz" },
        { id: "luna", name: "La Luna", image: "assets/tarot/tarot-luna.jpg", tag: "Secretos Ocultos" },
        { id: "mundo", name: "El Mundo", image: "assets/tarot/tarot-mundo.jpg", tag: "Triunfo Total" },
        { id: "carro", name: "El Carro", image: "assets/tarot/tarot-carro.jpg", tag: "Victoria Rápida" }
    ]
};

// Generador universal de enlace WhatsApp
function getWhatsAppUrl(customMessage) {
    const rawPhone = (window.SITE_CONFIG && window.SITE_CONFIG.whatsapp && window.SITE_CONFIG.whatsapp.phone)
        ? window.SITE_CONFIG.whatsapp.phone
        : (SITE_CONFIG.whatsapp.phone || '50239424561');
    const cleanPhone = String(rawPhone).replace(/[^0-9]/g, '');
    const msg = customMessage || (SITE_CONFIG.whatsapp && SITE_CONFIG.whatsapp.defaultMessage) || 'Hola Maestra Selene, deseo una consulta espiritual.';
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
}

function openWhatsApp(customMessage) {
    const url = getWhatsAppUrl(customMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
}

window.SITE_CONFIG = SITE_CONFIG;
window.getWhatsAppUrl = getWhatsAppUrl;
window.openWhatsApp = openWhatsApp;
