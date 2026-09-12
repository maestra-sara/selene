/**
 * =========================================================================
 * CONTROLADOR PRINCIPAL - MAESTRA SELENE
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initGlobalWhatsApp();
    initLiveSocialProof();
    initTestimonialLightbox();
    initAudioTestimonials();
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
        cuposEl.textContent = "Consultas abiertas";
    }
}

/* -------------------------------------------------------------------------
   6. REPRODUCTOR DE NOTAS DE VOZ (TESTIMONIOS REALES)
   ------------------------------------------------------------------------- */
function initAudioTestimonials() {
    const cards = document.querySelectorAll('.audio-note-card');
    if (!cards.length) return;

    let currentAudio = null;
    let currentActiveBtn = null;
    let currentActiveCard = null;

    function formatTime(seconds) {
        if (isNaN(seconds) || seconds === Infinity) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function playWhatsAppChime() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.14);
        } catch (e) {
            // AudioContext bloqueado o no soportado
        }
    }

    function stopCurrentAudio() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }
        if (currentActiveBtn) {
            currentActiveBtn.innerHTML = '<i class="fas fa-play"></i>';
            currentActiveBtn.classList.remove('playing');
            currentActiveBtn = null;
        }
        if (currentActiveCard) {
            const bar = currentActiveCard.querySelector('.audio-progress-bar');
            if (bar) bar.style.width = '0%';
            currentActiveCard = null;
        }
    }

    cards.forEach(card => {
        const audioSrc = card.getAttribute('data-audio');
        const playBtn = card.querySelector('.audio-play-btn');
        const progressBar = card.querySelector('.audio-progress-bar');
        const track = card.querySelector('.audio-track');
        const timeDisplay = card.querySelector('.audio-time');

        if (!audioSrc || !playBtn) return;

        const audio = new Audio(audioSrc);
        audio.preload = 'metadata';

        audio.addEventListener('loadedmetadata', () => {
            if (timeDisplay && audio.duration && !isNaN(audio.duration)) {
                timeDisplay.textContent = formatTime(audio.duration);
            }
        });

        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            // Si este mismo audio ya está en reproducción
            if (currentAudio === audio && currentActiveCard === card) {
                if (!currentAudio.paused) {
                    currentAudio.pause();
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                    playBtn.classList.remove('playing');
                    return;
                } else {
                    currentAudio.play();
                    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    playBtn.classList.add('playing');
                    return;
                }
            }

            // Si hay otro audio activo, detenerlo
            stopCurrentAudio();
            playWhatsAppChime();

            // Asignar el nuevo audio activo
            currentAudio = audio;
            currentActiveBtn = playBtn;
            currentActiveCard = card;

            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playBtn.classList.add('playing');

            audio.play().catch(err => {
                console.warn('Error al reproducir audio:', err);
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                playBtn.classList.remove('playing');
            });
        });

        // Actualizar progreso
        audio.addEventListener('timeupdate', () => {
            if (currentAudio === audio && audio.duration) {
                const pct = (audio.currentTime / audio.duration) * 100;
                if (progressBar) progressBar.style.width = `${pct}%`;
                if (timeDisplay) {
                    timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
                }
            }
        });

        // Al finalizar
        audio.addEventListener('ended', () => {
            if (currentActiveBtn) {
                currentActiveBtn.innerHTML = '<i class="fas fa-play"></i>';
                currentActiveBtn.classList.remove('playing');
            }
            if (progressBar) progressBar.style.width = '0%';
            if (timeDisplay && audio.duration) {
                timeDisplay.textContent = formatTime(audio.duration);
            }
            currentAudio = null;
            currentActiveBtn = null;
            currentActiveCard = null;
        });

        // Permitir click en la pista para avanzar/retroceder
        if (track) {
            track.addEventListener('click', (e) => {
                if (audio.duration && !isNaN(audio.duration)) {
                    const rect = track.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const pct = Math.max(0, Math.min(1, clickX / rect.width));
                    audio.currentTime = pct * audio.duration;
                    if (progressBar) progressBar.style.width = `${pct * 100}%`;
                }
            });
        }
    });
}
