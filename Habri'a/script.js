let hasBounced = false; 
let isEntered = false; 

// 1. 初始化書本高度 (高低差效果)
function initBookshelf() {
    const books = document.querySelectorAll('[data-h]');
    books.forEach(book => {
        const heightVal = book.getAttribute('data-h');
        if (heightVal) {
            book.style.height = `${heightVal}px`; 
        }
    });
}

// 2. 進入世界 (從開頭過渡到書櫃)
function showHub() {
    isEntered = true; 
    const intro = document.getElementById('intro-layer');
    const hub = document.getElementById('main-hub');
    
    if (!intro || !hub) return;

    intro.style.opacity = '0';
    initBookshelf(); // 預先計算書架高度

    setTimeout(() => {
        intro.style.display = 'none';
        hub.classList.add('active');
        
        // 切換滾動狀態
        document.body.classList.remove('is-locked');
        document.body.classList.add('is-unlocked');
    }, 1500);
}

// 3. 雙重滑動回彈與紙張觸發邏輯
window.addEventListener('scroll', () => {
    const afterlife = document.getElementById('afterlife-layer');
    // 如果還沒進入世界，或是正在閱讀書籍中，不執行滾動偵測
    if (!afterlife || !isEntered || document.body.classList.contains('is-locked')) return; 
    
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const afterlifeTop = afterlife.offsetTop;

    // --- 第一次滑動彈回邏輯 ---
    // 當使用者滑到「接近」死後世界邊緣 (剩餘 100px 時觸發)
    if (!hasBounced && (scrollPos + windowHeight > afterlifeTop + 50)) {
        hasBounced = true;
        window.scrollTo({
            top: afterlifeTop - windowHeight, 
            behavior: 'smooth'
        });
        return; // 彈回時中斷後續邏輯，不觸發紙張
    }

    // --- 紙張飄入觸發 (僅在彈回過一次後，或是滑得夠深才觸發) ---
    if (scrollPos + windowHeight > afterlifeTop + (windowHeight * 0.25)) {
        document.body.classList.add('in-afterlife');
    } else {
        document.body.classList.remove('in-afterlife');
    }
});

// 4. 同一頁閱讀邏輯 (Parchment Overlay)
function openBook(contentId) {
    const overlay = document.getElementById('reading-overlay');
    const article = document.getElementById('book-content');
    const depotContent = document.getElementById(`content-${contentId}`);

    if (!overlay || !article || !depotContent) {
        console.error("找不到內容倉庫或視窗，請檢查 ID 是否正確。");
        return;
    }

    // 1. 注入內容
    article.innerHTML = depotContent.innerHTML;

    // 2. 顯示視窗
    overlay.classList.remove('hidden');
    
    // 3. 鎖定背景滾動
    document.body.classList.replace('is-unlocked', 'is-locked');
    
    // 讓閱讀窗回到最頂部
    const parchment = overlay.querySelector('.parchment');
    if (parchment) parchment.scrollTop = 0;
}

function closeBook() {
    const overlay = document.getElementById('reading-overlay');
    if (!overlay) return;

    overlay.classList.add('hidden');
    
    // 4. 恢復背景滾動
    document.body.classList.replace('is-locked', 'is-unlocked');
}

// 針對行動裝置點擊與滾動的優化
document.addEventListener('touchstart', function() {}, {passive: true});
