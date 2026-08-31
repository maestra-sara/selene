/**
 * =========================================================================
 * MÓDULO INTERACTIVO DE TAROT 3D - REVELACIÓN EN CASCADA AUTOMÁTICA
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initTarotOracle();
});

function initTarotOracle() {
    const container = document.getElementById('oracle-cards-container');
    const resultBox = document.getElementById('oracle-result');
    const drawnSpan = document.getElementById('oracle-drawn-names');
    const summaryP = document.getElementById('oracle-summary');
    const waBtn = document.getElementById('oracle-wa-btn');
    const shuffleBtn = document.getElementById('oracle-shuffle-btn');

    if (!container) return;

    let drawn = [];
    let flippedCount = 0;
    let isRevealing = false;

    const positions = [
        { label: "1. Pasado & Raíz" },
        { label: "2. Presente Oculto" },
        { label: "3. Futuro & Destino" }
    ];

    function pickCards() {
        const pool = [...(SITE_CONFIG.oracleCards || [])];
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        return pool.slice(0, 3);
    }

    function renderCards() {
        container.innerHTML = '';
        drawn = pickCards();
        flippedCount = 0;
        isRevealing = false;
        if (resultBox) resultBox.classList.remove('active');

        positions.forEach((pos, idx) => {
            const card = drawn[idx];
            const wrap = document.createElement('div');
            wrap.className = 'oracle-card-wrapper';
            wrap.innerHTML = `
                <span class="card-pos-tag">${pos.label}</span>
                <div class="oracle-card-3d" id="tarot-card-${idx}">
                    <div class="oracle-card-inner">
                        <div class="oracle-face oracle-back">
                            <span><i class="fas fa-sparkles"></i> Toca para Revelar</span>
                        </div>
                        <div class="oracle-face oracle-front">
                            <img src="${card.image}" alt="${card.name}" loading="lazy">
                            <div class="oracle-card-name">${card.name}</div>
                        </div>
                    </div>
                </div>
            `;

            const cardEl = wrap.querySelector('.oracle-card-3d');
            cardEl.addEventListener('click', () => {
                if (!cardEl.classList.contains('flipped')) {
                    revealAllCardsInCascade();
                }
            });

            container.appendChild(wrap);
        });
    }

    // Efecto de apertura automática en cascada
    function revealAllCardsInCascade() {
        if (isRevealing || flippedCount === 3) return;
        isRevealing = true;

        const allWrappers = container.querySelectorAll('.oracle-card-wrapper');
        allWrappers.forEach((wrapperEl, index) => {
            const cardEl = wrapperEl.querySelector('.oracle-card-3d');
            setTimeout(() => {
                if (cardEl && !cardEl.classList.contains('flipped')) {
                    // Auto-scroll suave guiando la vista hacia la carta que se está revelando
                    wrapperEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    cardEl.classList.add('flipped');
                    triggerCardParticles(cardEl);
                    playFlipChime();
                    flippedCount++;

                    if (flippedCount === 3) {
                        setTimeout(() => {
                            showResult();
                            isRevealing = false;
                        }, 500);
                    }
                }
            }, index * 650);
        });
    }

    function triggerCardParticles(element) {
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 12; i++) {
            const spark = document.createElement('div');
            spark.className = 'oracle-spark';
            const x = (Math.random() - 0.5) * 120;
            const y = (Math.random() - 0.5) * 120;
            spark.style.setProperty('--tx', `${x}px`);
            spark.style.setProperty('--ty', `${y}px`);
            spark.style.left = `${rect.width / 2}px`;
            spark.style.top = `${rect.height / 2}px`;
            element.appendChild(spark);
            setTimeout(() => spark.remove(), 800);
        }
    }

    function playFlipChime() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(540, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(920, ctx.currentTime + 0.12);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.12);
        } catch (e) {
            // AudioContext bloqueado
        }
    }

    function showResult() {
        if (!resultBox) return;
        const names = drawn.map(c => c.name).join(' · ');
        if (drawnSpan) drawnSpan.textContent = names;
        if (summaryP) {
            summaryP.innerHTML = `
                Tus cartas revelan una fuerte oportunidad de transformación: <strong>${drawn[0].name}</strong> en tu pasado, 
                <strong>${drawn[1].name}</strong> actuando en tu presente y <strong>${drawn[2].name}</strong> abriendo tu camino hacia la victoria.
            `;
        }
        if (waBtn) {
            const msg = SITE_CONFIG.whatsapp.oracleMessage(names);
            waBtn.href = getWhatsAppUrl(msg);
            waBtn.onclick = (e) => {
                e.preventDefault();
                openWhatsApp(msg);
            };
        }
        resultBox.classList.add('active');
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
            renderCards();
        });
    }

    renderCards();
}
