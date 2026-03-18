function showHub() {
    const intro = document.getElementById('intro-layer');
    const hub = document.getElementById('main-hub');
    
    // 淡出開頭
    intro.style.opacity = '0';
    
    setTimeout(() => {
        intro.style.display = 'none';
        hub.classList.add('active');
        // 開放滾動
        document.body.style.overflowY = 'scroll';
    }, 1500);
}

// 監聽滾動，觸發死後世界的紙張
window.addEventListener('scroll', () => {
    const afterlifeSection = document.getElementById('afterlife-layer');
    const rect = afterlifeSection.getBoundingClientRect();

    // 當死後世界區塊頂部進入視窗一半時
    if (rect.top < window.innerHeight / 2) {
        document.body.classList.add('in-afterlife');
    } else {
        // 如果想重複動畫可以把下面這行打開
        // document.body.classList.remove('in-afterlife');
    }
});
