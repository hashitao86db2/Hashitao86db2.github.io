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
function showHub()
