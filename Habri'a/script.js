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

// 2. 初始化螢火蟲 (雙層分配)
function initFireflies() {
    console.log("螢火蟲初始化啟動...");
    const backContainer = document.getElementById('firefly-back');
    const frontContainer = document.getElementById('firefly-front');
    if (!backContainer || !frontContainer) return;

    // 清空舊的內容，避免重複產生
    backContainer.innerHTML = '';
    frontContainer.innerHTML = '';

    const totalCount = 45; 
    for (let i = 0; i < totalCount; i++) {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';
        
        const isFront = Math.random() > 0.7; // 30% 在前面
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
        document.body.classList.remove('is-locked');
        document.body.classList.add('is-unlocked');
    }, 1500);
}

// 4. 合併後的滾動邏輯 (變色 + 回彈 + 紙張)
window.addEventListener('scroll', () => {
    const afterlife = document.getElementById('afterlife-layer');
    if (!afterlife || !isEntered || document.body.classList.contains('is-locked')) return; 
    
    const scrollPos = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const afterlifeTop = afterlife.offsetTop;

    // A. 處理第一次滑動回彈
    if (!hasBounced && (scrollPos + windowHeight > afterlifeTop + 50)) {
        hasBounced = true;
        window.scrollTo({ top: afterlifeTop - windowHeight, behavior: 'smooth' });
        return; 
    }

    // B. 處理變色與紙張飄入
    // 只要滑到一半接近死後世界，就觸發 body class
    if (scrollPos + (windowHeight / 2) > afterlifeTop) {
        document.body.classList.add('in-afterlife');
    } else {
        document.body.classList.remove('in-afterlife');
    }
});

// --- 其他功能 (閱讀、切換角色、束帶動畫) ---

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

let currentCharIndex = 1;
const totalChars = 3; 
function changeChar(direction) {
    document.getElementById(`char-${currentCharIndex}`).classList.remove('active');
    currentCharIndex += direction;
    if (currentCharIndex > totalChars) currentCharIndex = 1;
    if (currentCharIndex < 1) currentCharIndex = totalChars;
    document.getElementById(`char-${currentCharIndex}`).classList.add('active');
    document.getElementById('page-indicator').innerText = `${currentCharIndex} / ${totalChars}`;
}

function unlockBook(element, url) {
    if (element.classList.contains('is-opening')) return;
    element.classList.add('is-opening');
    setTimeout(() => {
        window.open(url, '_blank');
        setTimeout(() => element.classList.remove('is-opening'), 500);
    }, 600); 
}

// --- 地圖展開動畫控制 ---
function animateMapUnfold() {
    const trigger = document.querySelector('.map-trigger');
    const actualMap = document.getElementById('actual-map');
    
    // 1. 儀式感第一步：讓折紙圖示快速淡出
    trigger.style.opacity = '0';
    trigger.style.transition = 'opacity 0.3s ease';
    
    // 延遲一小段時間後讓它徹底消失，防止擋到地圖
    setTimeout(() => {
        trigger.classList.add('hidden');
    }, 300);

    // 2. 計算動畫起點 (Transform Origin)
    // 我們需要地圖從折紙圖示所在的「左上角」攤開
    const parchment = document.querySelector('.parchment');
    const parchmentRect = parchment.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    
    // 計算折紙圖示相對於羊皮紙容器的中心點百分比
    const originX = ((triggerRect.left + triggerRect.width / 2) - parchmentRect.left) / parchmentRect.width * 100;
    const originY = ((triggerRect.top + triggerRect.height / 2) - parchmentRect.top) / parchmentRect.height * 100;
    
    // 動態設定地圖的動畫起點
    actualMap.style.transformOrigin = `${originX}% ${originY}%`;

    // 3. 儀式感第二步：觸發 CSS 動畫 (攤平)
    // 加上一個極短的延遲，確保 transform-origin 先生效
    requestAnimationFrame(() => {
        actualMap.classList.remove('hidden-map'); // 確保 display 不是 none
        
        // 加上一點點延遲讓 CSS 動畫能順利執行
        setTimeout(() => {
            actualMap.classList.add('unfolded');
        }, 50);
    });
}

// 啟動！
document.addEventListener('DOMContentLoaded', () => {
    initFireflies();
    // 再次確認載入完成
    window.onload = initFireflies;
});
