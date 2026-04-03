let hasBounced = false; 
let isEntered = false; 
let currentChar = 1; // 宣告全域變數供人物誌使用

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

// 5. 【整合後的唯一 openBook 函式】
function openBook(contentId) {
    const overlay = document.getElementById('reading-overlay');
    const article = document.getElementById('book-content');
    const depotContent = document.getElementById(`content-${contentId}`);
    
    if (!overlay || !article || !depotContent) return;

    // A. 基礎功能：搬運內容並顯示
    article.innerHTML = depotContent.innerHTML;
    overlay.classList.remove('hidden');
    document.body.classList.replace('is-unlocked', 'is-locked');

    // B. 人物誌專屬邏輯 (初始化頁碼)
    if (contentId === 'characters') {
        currentChar = 1; // 重置為第一頁
        updateCharDisplay();
    }

    // C. 神話專屬邏輯 (啟動文字浮現動畫)
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

// 6. 基礎功能：關閉書本
function closeBook() {
    const overlay = document.getElementById('reading-overlay');
    if (!overlay) return;
    overlay.classList.add('hidden');
    document.body.classList.replace('is-locked', 'is-unlocked');
}

// 7. 人物誌分頁功能
function changeChar(dir) {
    const pages = document.querySelectorAll('#book-content .char-page');
    const total = pages.length; 
    if (total === 0) return;

    pages[currentChar - 1].classList.remove('active');

    currentChar += dir;
    if (currentChar < 1) currentChar = total;
    if (currentChar > total) currentChar = 1;

    pages[currentChar - 1].classList.add('active');
    
    const indicator = document.querySelector('#book-content #page-indicator');
    if (indicator) {
        indicator.innerText = `${currentChar} / ${total}`;
    }
}

function updateCharDisplay() {
    const pages

