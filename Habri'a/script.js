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

let currentCharIndex = 1;
const totalChars = 3; // 總共有三位角色

function changeChar(direction) {
    // 移除當前頁面的 active 狀態
    document.getElementById(`char-${currentCharIndex}`).classList.remove('active');
    
    // 計算下一頁索引
    currentCharIndex += direction;
    
    // 循環邏輯：第一頁往回走變最後一頁，最後一頁往後走變第一頁
    if (currentCharIndex > totalChars) currentCharIndex = 1;
    if (currentCharIndex < 1) currentCharIndex = totalChars;
    
    // 顯示新頁面並更新下方數字提示
    document.getElementById(`char-${currentCharIndex}`).classList.add('active');
    document.getElementById('page-indicator').innerText = `${currentCharIndex} / ${totalChars}`;
}

function initFireflies() {
    const backContainer = document.getElementById('firefly-back');
    const frontContainer = document.getElementById('firefly-front');
    if (!backContainer || !frontContainer) return;

    backContainer.innerHTML = '';
    frontContainer.innerHTML = '';

    const totalCount = 45; 
    for (let i = 0; i < totalCount; i++) {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';
        
        const isFront = Math.random() > 0.7; 
        const targetContainer = isFront ? frontContainer : backContainer;
        
        firefly.style.left = Math.random() * 100 + '%';
        firefly.style.top = Math.random() * 100 + '%';
        
        // 隨機大小與速度
        const size = Math.random() * 4 + 2;
        firefly.style.width = size + 'px';
        firefly.style.height = size + 'px';
        firefly.style.animationDuration = (Math.random() * 15 + 10) + 's, ' + (Math.random() * 3 + 2) + 's';
        firefly.style.animationDelay = (Math.random() * 10) + 's';
        
        targetContainer.appendChild(firefly);
    }
}
