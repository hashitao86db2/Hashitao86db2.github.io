let hasBounced = false; 
let isEntered = false; // 紀錄是否進入 HUB

// 1. 初始化書本高度 (高低差效果)
function initBookshelf() {
    // 讀取所有帶有 data-h 的元素 (主角書與雜書)
    const books = document.querySelectorAll('[data-h]');
    books.forEach(book => {
        const heightVal = book.getAttribute('data-h');
        if (heightVal) {
            book.style.height = `${heightVal}px`; // 動態設定高度
        }
    });
}

function showHub() {
    isEntered = true; // 設置已進入
    const intro = document.getElementById('intro-layer');
    const hub = document.getElementById('main-hub');
    intro.style.opacity = '0';
    
    initBookshelf(); // 初始化高度

    setTimeout(() => {
        intro.style.display = 'none';
        hub.classList.add('active');
        document.body.classList.remove('is-locked');
        document.body.classList.add('is-unlocked');
    }, 1500);
}

// --- 雙重滑動回彈與紙張觸發邏輯 ---
window.addEventListener('scroll', () => {
    const afterlife = document.getElementById('afterlife-layer');
    if (!afterlife || !isEntered) return; // 沒進入前不觸發
    
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const afterlifeTop = afterlife.offsetTop;

    // 第一次滑動回彈邏輯
    if (!hasBounced && scrollPos + windowHeight > afterlifeTop + 50) {
        hasBounced = true;
        window.scrollTo({ top: afterlifeTop - windowHeight, behavior: 'smooth' });
        return; 
    }

    // 觸發紙張飄入
    if (scrollPos + windowHeight > afterlifeTop + (windowHeight * 0.2)) {
        document.body.classList.add('in-afterlife');
    } else {
        document.body.classList.remove('in-afterlife');
    }
});

// --- 同一頁閱讀邏輯 (`#reading-overlay`) ---

function openBook(contentId) {
    const overlay = document.getElementById('reading-overlay');
    const article = document.getElementById('book-content');
    const depotContent = document.getElementById(`content-${contentId}`);

    if (!overlay || !article || !depotContent) return;

    // 1. 從內容倉庫複製內容
    article.innerHTML = depotContent.innerHTML;

    // 2. 顯示閱讀視窗 (移除隱藏)
    overlay.classList.remove('hidden');
    // 鎖定 body 滾動，避免背景捲動
    document.body.classList.add('is-locked');
}

function closeBook() {
    const overlay = document.getElementById('reading-overlay');
    if (!overlay) return;

    // 1. 隱藏視窗
    overlay.classList.add('hidden');
    // 解鎖 body 滾動
    if(isEntered){ // 進入 HUB 後解鎖
        document.body.classList.remove('is-locked');
        document.body.classList.add('is-unlocked');
    }
}



// 針對平板/手機點擊最佳化
document.addEventListener('touchstart', function() {}, {passive: true});
