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

let currentCharIndex = 1;
const totalChars = 3; // 如果你加了更多人，記得改這個數字

function changeChar(direction) {
    // 隱藏當前頁面
    document.getElementById(`char-${currentCharIndex}`).classList.remove('active');
    
    // 計算下一頁索引
    currentCharIndex += direction;
    
    // 循環判斷
    if (currentCharIndex > totalChars) currentCharIndex = 1;
    if (currentCharIndex < 1) currentCharIndex = totalChars;
    
    // 顯示新頁面
    document.getElementById(`char-${currentCharIndex}`).classList.add('active');
    
    // 更新頁碼指示器
    document.getElementById('page-indicator').innerText = `${currentCharIndex} / ${totalChars}`;
    
    // 讓滾動條回到頂部（如果內容很長）
    document.querySelector('.parchment').scrollTop = 0;
}
function unlockBook(element, url) {
    // 1. 防止重複點擊
    if (element.classList.contains('is-opening')) return;

    // 2. 加入動畫 Class
    element.classList.add('is-opening');

    // 3. 等待動畫完成 (0.6秒) 後跳轉
    setTimeout(() => {
        window.open(url, '_blank');
        
        // 跳轉後移除 class，這樣回來時束帶又是關著的
        setTimeout(() => {
            element.classList.remove('is-opening');
        }, 500);
    }, 600); 
}
function initFireflies() {
    console.log("螢火蟲初始化啟動..."); // 可以在瀏覽器 F12 檢查是否有跑這行
    const backContainer = document.getElementById('firefly-back');
    const frontContainer = document.getElementById('firefly-front');
    
    if (!backContainer || !frontContainer) {
        console.error("找不到粒子容器！");
        return;
    }

    const totalCount = 40; 

    for (let i = 0; i < totalCount; i++) {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';
        
        // 隨機分配層次
        const isFront = Math.random() > 0.7;
        const targetContainer = isFront ? frontContainer : backContainer;
        
        firefly.style.left = Math.random() * 100 + '%';
        firefly.style.top = Math.random() * 100 + '%';
        
        const size = isFront ? (Math.random() * 4 + 5) : (Math.random() * 2 + 3);
        firefly.style.width = size + 'px';
        firefly.style.height = size + 'px';
        
        firefly.style.animationDuration = (Math.random() * 8 + 8) + 's';
        firefly.style.animationDelay = (Math.random() * 10) + 's';
        
        targetContainer.appendChild(firefly);
    }
}
function initFireflies() {
    const backContainer = document.getElementById('firefly-back');
    const frontContainer = document.getElementById('firefly-front');
    if (!backContainer || !frontContainer) return;

    const totalCount = 40; // 總數增加一點，因為分兩層了

    for (let i = 0; i < totalCount; i++) {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';
        
        // 隨機決定要放前面還是後面 (50% 機率)
        const targetContainer = Math.random() > 0.5 ? frontContainer : backContainer;
        
        firefly.style.left = Math.random() * 100 + '%';
        firefly.style.top = Math.random() * 100 + '%';
        
        // 前面的粒子可以稍微大一點點
        const isFront = targetContainer === frontContainer;
        const size = isFront ? (Math.random() * 5 + 5) : (Math.random() * 3 + 3);
        
        firefly.style.width = size + 'px';
        firefly.style.height = size + 'px';
        
        firefly.style.animationDuration = (Math.random() * 10 + 10) + 's';
        firefly.style.animationDelay = (Math.random() * 10) + 's';
        
        targetContainer.appendChild(firefly);
    }
}

// 確保在所有資源（包含圖片）載入後再跑一次，或是 DOM 好了就跑
if (document.readyState === "complete" || document.readyState === "interactive") {
    initFireflies();
} else {
    document.addEventListener('DOMContentLoaded', initFireflies);
}

// 修正：將變色偵測與你原本的 scroll 邏輯合併
window.addEventListener('scroll', () => {
    const afterlife = document.getElementById('afterlife-layer');
    if (!afterlife || !isEntered) return; 

    const scrollPos = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const afterlifeTop = afterlife.offsetTop;

    // 當畫面進入死後世界區域時變色
    if (scrollPos + (windowHeight / 2) > afterlifeTop) {
        document.body.classList.add('in-afterlife');
    } else {
        document.body.classList.remove('in-afterlife');
    }
    
    // 你原本的 hasBounced 邏輯可以繼續寫在下面...

});



// 確保在頁面載入後執行
document.addEventListener('DOMContentLoaded', initFireflies);
