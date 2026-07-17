/**
 * DEMIAN MAX - MASTER EDITION (OTIMIZADO)
 * Webmaster Level Script - Integrado com MagicWebFX Locking
 * Wake Lock Triple Layer: Video + Silent Audio + Native API
 */

const WHATSAPP_NUMBER = "5511916684574";
const VIDEO_TV_1_URL = "https://youtu.be/Z0FNLVFJ7u8";
const VIDEO_TV_2_URL = "https://youtu.be/_DMpFkXgq84?t=21";
const VIDEO_TV_3_URL = "https://youtu.be/DjsEQ21bZ-M?t=24";

// Instância Global do NoSleep
let noSleep = null;
if (typeof NoSleep !== 'undefined') {
    noSleep = new NoSleep();
}

// Desativa a restauração automática de scroll do navegador para evitar o "pulo" ao recarregar
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
    // Garante que o site comece no topo ao recarregar, evitando o bug de cache de scroll
    window.scrollTo(0, 0);

    initHeader();
    initMobileMenu();
    initBriefingForm();
    initSmoothScroll();
    initMediaThumbnails();
    initCuboAutoUpdate();
    initDoubleTapUnlock();
    initImageProtection();
    initTripleWakeLock();
});

/**
 * DOUBLE TAP UNLOCK
 * Detecta 2 toques rápidos em "Demian Max" para destravar a carta
 * e mostra um ponto (.) após "O Artista"
 */
function initDoubleTapUnlock() {
    const demianLink = document.getElementById('demian-unlock');
    const unlockIndicator = document.getElementById('unlock-indicator');
    if (!demianLink) return;

    let lastTap = 0;
    const doubleTapDelay = 300; // 300ms entre toques

    demianLink.addEventListener('click', (e) => {
        const now = Date.now();
        if (now - lastTap < doubleTapDelay) {
            // Double tap detectado!
            
            // Destravamento via código puro para evitar qualquer movimento de scroll
            // Isso simula o efeito do link #unlock sem mudar a URL ou a posição da página
            if (typeof mwfx_unlock === 'function') {
                mwfx_unlock();
            } else {
                // Caso a função global não esteja disponível, usamos o método do hash silencioso
                const currentHash = window.location.hash;
                history.replaceState(null, null, '#unlock');
                window.dispatchEvent(new HashChangeEvent('hashchange'));
                // Volta o hash original sem disparar novo evento, mantendo a posição
                setTimeout(() => {
                    history.replaceState(null, null, currentHash || ' ');
                }, 10);
            }
            
            // Mostra o ponto indicador após "O Artista"
            if (unlockIndicator) {
                unlockIndicator.style.display = 'inline';
            }
            console.log("🔓 Dispositivo destravado com sucesso!");
        }
        lastTap = now;
    });
}

/**
 * TRIPLE WAKE LOCK STRATEGY
 * Camada 1: Native Wake Lock API
 * Camada 2: NoSleep.js (Invisible Video)
 * Camada 3: Silent Audio Loop
 */
function initTripleWakeLock() {
    const heroVideo = document.getElementById('heroVideo');
    const silentAudio = document.getElementById('silentAudio');
    let wakeLockSentinel = null;
    let isActivated = false;

    // Coordenadas para diferenciar toque de rolagem
    let touchStartX = 0;
    let touchStartY = 0;

    const activateAll = async () => {
        if (isActivated) return; // Evita re-ativação desnecessária se já estiver visualmente ativo
        
        console.log("🚀 Ativando Triple Wake Lock...");

        // 1. Native Wake Lock API
        if ('wakeLock' in navigator) {
            try {
                wakeLockSentinel = await navigator.wakeLock.request('screen');
                console.log("✅ Native Wake Lock Ativo");
            } catch (err) {
                console.warn("❌ Falha Native Wake Lock:", err);
            }
        }

        // 2. NoSleep.js (Vídeo Invisível)
        if (noSleep) {
            try {
                noSleep.enable();
                console.log("✅ NoSleep.js Ativo");
            } catch (err) {
                console.warn("❌ Falha NoSleep.js:", err);
            }
        }

        // 3. Silent Audio Loop
        if (silentAudio) {
            silentAudio.play().then(() => {
                console.log("✅ Silent Audio Ativo");
            }).catch(err => {
                console.warn("❌ Falha Silent Audio:", err);
            });
        }

        // 4. Hero Video (Reforço)
        if (heroVideo && heroVideo.paused) {
            heroVideo.play().catch(err => console.log("Hero Video aguardando...", err));
        }

        // 5. Sinal Visual (Terceira linha do menu)
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.classList.add('wake-lock-active');
            isActivated = true;
        }
    };

    // Lógica para detectar se foi um toque real ou apenas rolagem
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;

        // Calcula o deslocamento
        const diffX = Math.abs(touchEndX - touchStartX);
        const diffY = Math.abs(touchEndY - touchStartY);

        // Se o dedo se moveu menos de 10px, consideramos um "toque" e não uma "rolagem"
        if (diffX < 10 && diffY < 10) {
            activateAll();
        }
    }, { passive: true });

    // Cliques de mouse e teclado continuam ativando normalmente
    ["click", "keydown"].forEach(evt => {
        document.addEventListener(evt, activateAll);
    });

    // Reativa quando a página volta a ficar visível
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && isActivated) {
            activateAll();
        }
    });
}

// ATUALIZAÇÃO AUTOMÁTICA DO CUBO (Otimizado com compressão)
function initCuboAutoUpdate() {
    const cuboImg = document.getElementById('cubo-ranking-img');
    if (!cuboImg) return;

    const originalSrc = cuboImg.src;
    let lastImageData = null;
    let isProcessing = false;

    const updateImage = () => {
        if (isProcessing) return;
        isProcessing = true;
        const newImg = new Image();
        newImg.crossOrigin = "Anonymous";
        const newSrc = `${originalSrc.split('?')[0]}?photo=3886&t=${new Date().getTime()}`;
        
        newImg.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = newImg.width;
                canvas.height = newImg.height;
                ctx.drawImage(newImg, 0, 0);
                const currentData = canvas.toDataURL('image/webp', 0.1);
                
                if (lastImageData === null) {
                    lastImageData = currentData;
                    compressAndUpdateImage(canvas, cuboImg);
                } else if (lastImageData !== currentData) {
                    lastImageData = currentData;
                    compressAndUpdateImage(canvas, cuboImg);
                    const frase = document.getElementById('cubo-frase');
                    if (frase) {
                        setTimeout(() => {
                            frase.innerText = '"Todo mundo vê cores. Poucos percebem o caminho"';
                        }, 1000);
                    }
                }
            } catch (error) {
                console.error("Erro cubo:", error);
            } finally {
                isProcessing = false;
            }
        };
        newImg.onerror = () => { isProcessing = false; };
        newImg.src = newSrc;
    };

    function compressAndUpdateImage(canvas, imgElement) {
        const compressedData = canvas.toDataURL('image/webp', 0.65);
        imgElement.src = compressedData;
    }
    setInterval(updateImage, 2000);
}

function initHeader() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const links = document.querySelectorAll('.nav-link');
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : 'auto';
        });
        links.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === "#") return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const header = document.querySelector('.header');
                // Calcula a altura real do header no momento do clique para maior precisão
                const headerHeight = header ? header.offsetHeight : 70;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initMediaThumbnails() {
    console.log("Media thumbnails initialized.");
}

/**
 * PROTEÇÃO DE IMAGENS
 * Desativa menu de contexto e tenta mitigar recursos de pesquisa visual do navegador
 */
function initImageProtection() {
    // Desativa o menu de contexto em todas as imagens
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', e => e.preventDefault());
        img.setAttribute('draggable', 'false');
        // Atributo específico para o Pinterest e alguns outros motores
        img.setAttribute('nopin', 'nopin');
    });

    // Proteção adicional para a imagem da carta (MagicWebFX)
    const cardImg = document.querySelector('.mwfx');
    if (cardImg) {
        // Bloqueia interações que poderiam disparar o ícone de pesquisa visual
        cardImg.style.pointerEvents = 'none';
        // Envolve a imagem em uma div para manter o layout mas bloquear o acesso direto
        const wrapper = cardImg.parentElement;
        if (wrapper) {
            wrapper.style.position = 'relative';
            wrapper.style.overflow = 'hidden';
        }
    }
}

/**
 * ABERTURA DE VÍDEOS (TV & MÍDIA)
 * Abre vídeos do YouTube em modal
 */
function openTVVideo(programNumber) {
    const videoIds = {
        1: "Z0FNLVFJ7u8",
        2: "_DMpFkXgq84?t=21",
        3: "DjsEQ21bZ-M?t=24"
    };

    const videoId = videoIds[programNumber];
    if (!videoId) return;

    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        cursor: pointer;
    `;

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.style.cssText = `
        width: 90%;
        max-width: 900px;
        height: 90%;
        max-height: 600px;
        border: none;
        border-radius: 4px;
    `;
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;

    modal.appendChild(iframe);
    modal.addEventListener('click', () => modal.remove());
    document.body.appendChild(modal);
}

/**
 * FORMULÁRIO DE BRIEFING
 * Envia dados via WhatsApp
 */
function initBriefingForm() {
    const form = document.getElementById('briefingForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nome = form.querySelector('input[name="nome"]').value;
        const empresa = form.querySelector('input[name="empresa"]').value;
        const whatsapp = form.querySelector('input[name="whatsapp"]').value;
        const email = form.querySelector('input[name="email"]').value;
        const mensagem = form.querySelector('textarea[name="mensagem"]').value;

        const texto = `Olá! Meu nome é ${nome}. Empresa: ${empresa}. WhatsApp: ${whatsapp}. Email: ${email}. Mensagem: ${mensagem}`;
        const encodedText = encodeURIComponent(texto);
        const whatsappLink = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedText}`;

        window.open(whatsappLink, '_blank');
        form.reset();
    });
}
