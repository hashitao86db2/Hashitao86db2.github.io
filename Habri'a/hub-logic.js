function showHub() {
    const intro = document.getElementById('intro-layer');
    const hub = document.getElementById('main-hub');
    
    intro.style.opacity = '0';
    setTimeout(() => {
        intro.classList.add('hidden');
        hub.classList.remove('hidden');
        document.body.style.overflowY = 'scroll'; // 允許滾動
    }, 2000);
}

// 偵測滾動位置來啟動死後世界動畫
window.addEventListener('scroll', () => {
    const afterlifeSection = document.getElementById('afterlife-layer');
    const rect = afterlifeSection.getBoundingClientRect();

    // 如果死後世界區塊進入畫面超過一半
    if (rect.top < window.innerHeight / 2) {
        document.body.classList.add('in-afterlife');
    } else {
        document.body.classList.remove('in-afterlife');
    }
});
