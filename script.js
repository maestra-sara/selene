document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CONFIGURACIÓN GLOBAL ---
    // Centralizamos los datos para que cambiarlos sea instantáneo y no afecte el rastreo
    const CONFIG_WP = {
        phone: "50239424561",
        message: "¡Hola Sara! Necesito ayuda. ¿Podría asesorarme?"
    };

    // --- 2. ASIGNACIÓN AUTOMÁTICA DE ENLACES (Mejora para GTM) ---
    // Buscamos todos los elementos con la clase .whatsapp-link y les ponemos el link real.
    // Esto permite que GTM detecte un "Link Click" estándar, que es mucho más fiable.
    const assignWhatsAppLinks = () => {
        const wpButtons = document.querySelectorAll('.whatsapp-link');
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const baseUrl = isMobile ? "https://api.whatsapp.com/send" : "https://web.whatsapp.com/send";
        const finalUrl = `${baseUrl}?phone=${CONFIG_WP.phone}&text=${encodeURIComponent(CONFIG_WP.message)}`;

        wpButtons.forEach(btn => {
            btn.href = finalUrl;
            // Si el botón es el flotante o el del menú, que abra en pestaña nueva
            if (btn.classList.contains('whatsapp-floating') || btn.classList.contains('cta-nav')) {
                btn.target = "_blank";
                btn.rel = "noopener noreferrer";
            }
        });
    };
    assignWhatsAppLinks();

    // --- 3. MENÚ MÓVIL ---
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.checked = false;
            });
        });
    }

    // --- 4. SCROLL REVEAL (Optimizado) ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('section, .servicio, .testimonio-card, .img-unica-transformacion').forEach(el => {
        el.classList.add('fade-init');
        revealObserver.observe(el);
    });

    // --- 5. LAZY LOAD (Optimizado) ---
    const lazyImages = document.querySelectorAll('img.lazyload, img[data-src]');
    if (lazyImages.length > 0) {
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    imgObserver.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => imgObserver.observe(img));
    }
});
