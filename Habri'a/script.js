let hasBounced = false; // 紀錄是否已經彈回過一次

function showHub() {
    const intro = document.getElementById('intro-layer');
    const hub = document.getElementById('main-hub');
    
    intro.style.opacity = '0';
    setTimeout(() => {
        intro.style.display = 'none';
        hub.classList.add('active');
        // 解鎖 body 捲動
        document.body.classList.remove('is-locked');
        document.body.classList.add('is-unlocked');
    }, 1500);
}

// 監聽捲動邏輯
window.addEventListener('scroll', () => {
    const afterlife = document.getElementById('afterlife-layer');
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const afterlifeTop = afterlife.offsetTop;

    // --- 第一次滑動彈回邏輯 ---
    // 當使用者滑到靠近死後世界 (觸發點在 afterlife 頂部上方 50px)
    if (!hasBounced && scrollPos + windowHeight > afterlifeTop + 50) {
        hasBounced = true;
        // 強制彈回主頁面底部
        window.scrollTo({
            top: afterlifeTop - windowHeight,
            behavior: 'smooth'
        });
        return; 
    }

    // --- 紙張飄落與背景變色觸發 ---
    // 當死後世界進入畫面超過 20% 時
    if (scrollPos + windowHeight > afterlifeTop + (windowHeight * 0.2)) {
        document.body.classList.add('in-afterlife');
    } else {
        document.body.classList.remove('in-afterlife');
    }
});

// 針對平板/手機點擊最佳化
document.addEventListener('touchstart', function() {}, {passive: true});
