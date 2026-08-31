/**
 * =========================================================================
 * CONTROLADOR PRINCIPAL - MAESTRA SELENE
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initGlobalWhatsApp();
    initLiveSocialProof();
    initTestimonialLightbox();
    initMobileNav();
    initUrgencyCounter();
});

/* -------------------------------------------------------------------------
   1. ASIGNACIÓN GLOBAL DE ENLACES DE WHATSAPP (CON SOPORTE GTM)
   ------------------------------------------------------------------------- */
function initGlobalWhatsApp() {
    document.querySelectorAll('.whatsapp-link').forEach(link => {
        let msg = link.getAttribute('data-wa-msg') || (SITE_CONFIG.whatsapp && SITE_CONFIG.whatsapp.defaultMessage);
        
        // Si es el botón de la barra de urgencia
        if (link.classList.contains('urgency-link')) {
            msg = SITE_CONFIG.whatsapp.urgencyMessage;
        }

        link.href = getWhatsAppUrl(msg);
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.dataLayer) {
                window.dataLayer.push({
                    'event': 'whatsapp_click',
                    'wa_message': msg
                });
            }
            openWhatsApp(msg);
        });
    });
}

/* -------------------------------------------------------------------------
   2. PRUEBA SOCIAL EN VIVO PARA EUROPA
   ------------------------------------------------------------------------- */
function initLiveSocialProof() {
    const toast = document.getElementById('social-proof-toast');
    if (!toast || !SITE_CONFIG.liveActivity || SITE_CONFIG.liveActivity.length === 0) return;

    let index = 0;

    function showToast() {
        const item = SITE_CONFIG.liveActivity[index];
        toast.innerHTML = `
            <div class="toast-avatar">
                <i class="fas fa-shield-halved"></i>
            </div>
            <div class="toast-content">
                <span class="toast-name"><strong>${item.name}</strong> (${item.city})</span>
                <span class="toast-action">Solicitó: <em>${item.service}</em></span>
                <span class="toast-time"><i class="fas fa-clock"></i> ${item.time}</span>
            </div>
            <button class="toast-close" aria-label="Cerrar"><i class="fas fa-times"></i></button>
        `;

        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toast.classList.remove('show');
            });
        }

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);

        index = (index + 1) % SITE_CONFIG.liveActivity.length;
    }

    // Iniciar a los 3.5 segundos, luego cada 15 segundos
    setTimeout(() => {
        showToast();
        setInterval(showToast, 15000);
    }, 3500);
}

/* -------------------------------------------------------------------------
   3. LIGHTBOX PARA TESTIMONIOS
   ------------------------------------------------------------------------- */
function initTestimonialLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');

    if (!modal || !modalImg) return;

    document.querySelectorAll('.testimonio-card img').forEach(img => {
        img.addEventListener('click', () => {
            modalImg.src = img.src;
            modal.classList.add('open');
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    }
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            modal.classList.remove('open');
        }
    });
}

/* -------------------------------------------------------------------------
   4. MENÚ MÓVIL
   ------------------------------------------------------------------------- */
function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.checked = false;
            });
        });
    }
}

/* -------------------------------------------------------------------------
   5. CONTADOR DE URGENCIA DINÁMICO
   ------------------------------------------------------------------------- */
function initUrgencyCounter() {
    const cuposEl = document.getElementById('cupos-count');
    if (cuposEl) {
        const hours = new Date().getHours();
        const available = hours > 18 ? 2 : (hours > 12 ? 3 : 4);
        cuposEl.textContent = `${available} cupos`;
    }
}
