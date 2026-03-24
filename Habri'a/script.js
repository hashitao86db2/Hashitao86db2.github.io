let hasBounced = false; 
let isEntered = false; 

function initBookshelf() {
    const books = document.querySelectorAll('[data-h]');
    books.forEach(book => {
        const heightVal = book.getAttribute('data-h');
        if (heightVal) book.style.height = `${heightVal}px`; 
    });
}

function showHub() {
    isEntered = true; 
    const intro = document.getElementById('intro-layer');
    const hub = document.getElementById('main-hub');
    if (!intro || !hub) return;
    intro.style.opacity = '0';
    initBookshelf();
    setTimeout(() => {
        intro.style.display = 'none';
        hub.classList.add('active');
        document.body.classList.replace('is-locked', 'is-unlocked');
    }, 1500);
}

window.addEventListener('scroll', () => {
    const afterlife = document.getElementById('afterlife-layer');
    if (!afterlife || !isEntered || document.body.classList.contains('is-locked')) return; 
    const scrollPos = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const afterlifeTop = afterlife.offsetTop;
    if (!hasBounced && (scrollPos + windowHeight > afterlifeTop + 50)) {
        hasBounced = true;
        window.scrollTo({ top: afterlifeTop - windowHeight, behavior: 'smooth' });
        return; 
    }
    if (scrollPos + (windowHeight / 2) > afterlifeTop) {
        document.body.classList.add('in-afterlife');
    } else {
        document.body.classList.remove('in-afterlife');
    }
});

function openBook(contentId) {
    const overlay = document.getElementById('reading-overlay');
    const article = document.getElementById('book-content');
    const depotContent = document.getElementById(`content-${contentId}`);
    if (!overlay || !article || !depotContent) return;
    article.innerHTML = depotContent.innerHTML;
    overlay.classList.remove('hidden');
    document.body.classList.replace('is-unlocked', 'is-locked');
}

function closeBook() {
    const overlay = document.getElementById('reading-overlay');
    if (!overlay) return;
    overlay.classList.add('hidden');
    document.body.classList.replace('is-locked', 'is-unlocked');
}

// --- 地圖動畫 (修正版) ---
function animateMapUnfold(element) {
    const overlay = document.getElementById('actual-map');
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    overlay.style.transformOrigin = `${x}px ${y}px`;
    element.style.opacity = '0';
    overlay.classList.add('unfolded');
    document.body.classList.replace('is-unlocked', 'is-locked');
}

function animateMapFold() {
    const overlay = document.getElementById('actual-map');
    const trigger = document.querySelector('.map-trigger-scrap');
    overlay.classList.remove('unfolded');
    setTimeout(() => {
        if(trigger) trigger.style.opacity = '1';
        document.body.classList.replace('is-locked', 'is-unlocked');
    }, 800);
}

// 束帶鎖邏輯保持原樣...
function unlockBook(element, url) {
    if (element.classList.contains('is-opening')) return;
    element.classList.add('is-opening');
    setTimeout(() => {
        window.open(url, '_blank');
        setTimeout(() => element.classList.remove('is-opening'), 500);
    }, 600); 
}
