let hasBounced = false; 
let isEntered = false; 

// 1. 初始化書本高度
function initBookshelf() {
    const books = document.querySelectorAll('[data-h]');
    books.forEach(book => {
        const heightVal = book.getAttribute('data-h');
        if (heightVal) book.style.height = `${heightVal}px`; 
    });
}

// 2. 初始化螢火蟲
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
        const size = isFront ? (Math.random() * 3 + 5) : (Math.random() * 2 + 3);
        firefly.style.width = size + 'px';
        firefly.style.height = size + 'px';
        firefly.style.animationDuration = (Math.random() * 10 + 10) + 's';
        firefly.style.animationDelay = (Math.random() * 8) + 's';
        targetContainer.appendChild(firefly);
    }
}

// 3. 進入世界
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

// 4. 滾動邏輯
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

// 5. 書本功能
function openBook(contentId) {
    const overlay = document.getElementById('reading-overlay');
    const article = document.getElementById('book-content');
    const depotContent = document.getElementById(`content-${contentId}`);
    if (!overlay || !article || !depotContent) return;

    // 1. 搬運內容
    article.innerHTML = depotContent.innerHTML;
    overlay.classList.remove('hidden');
    document.body.classList.replace('is-unlocked', 'is-locked');

    // 2. 如果打開的是人物誌，初始化分頁
    if (contentId === 'characters') {
        currentChar = 1; 
        const pages = article.querySelectorAll('.char-page');
        pages.forEach(p => p.classList.remove('active'));
        if (pages[0]) pages[0].classList.add('active');
        
        const indicator = article.querySelector('#page-indicator');
        if (indicator) indicator.innerText = `1 / ${pages.length}`;
    }

    // 3. 如果打開的是神話，啟動動畫觀察器
    if (contentId === 'myth') {
        const lines = article.querySelectorAll('.myth-line');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = Array.from(lines).indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, index * 300); 
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        lines.forEach(line => observer.observe(line));
    }
}

function closeBook() {
    const overlay = document.getElementById('reading-overlay');
    if (!overlay) return;
    overlay.classList.add('hidden');
    document.body.classList.replace('is-locked', 'is-unlocked');
}

// 6. 人物誌切換
// 宣告全域變數
let currentChar = 1;



function changeChar(dir) {
    const pages = document.querySelectorAll('#book-content .char-page');
    const total = pages.length; // 自動抓取正確的總頁數

    // 隱藏當前頁
    pages[currentChar - 1].classList.remove('active');

    // 計算下一頁
    currentChar += dir;
    if (currentChar < 1) currentChar = total;
    if (currentChar > total) currentChar = 1;

    // 顯示新頁面
    pages[currentChar - 1].classList.add('active');
    
    // 更新頁碼文字
    const indicator = document.querySelector('#book-content #page-indicator');
    if (indicator) {
        indicator.innerText = `${currentChar} / ${total}`;
    }
}

// 輔助函式：確保打開時頁碼正確
function updateCharDisplay() {
    const pages = document.querySelectorAll('#book-content .char-page');
    const indicator = document.querySelector('#book-content #page-indicator');
    if (indicator) {
        indicator.innerText = `1 / ${pages.length}`;
    }
}


// 7. 地圖動畫
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

function unlockBook(element, url) {
    if (element.classList.contains('is-opening')) return;
    element.classList.add('is-opening');
    setTimeout(() => {
        window.open(url, '_blank');
        setTimeout(() => element.classList.remove('is-opening'), 500);
    }, 600); 
}

// 啟動螢火蟲
document.addEventListener('DOMContentLoaded', initFireflies);



