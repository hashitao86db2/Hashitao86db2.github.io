function showHub() {
    const intro = document.getElementById('intro-layer');
    const hub = document.getElementById('main-hub');
    
    // 1. 開始淡出動畫
    intro.style.opacity = '0';
    intro.style.pointerEvents = 'none'; // 重要：防止透明層擋住下方的點擊與滾動

    setTimeout(() => {
        // 2. 徹底移除開頭層
        intro.style.display = 'none';
        
        // 3. 顯示主頁面並啟動淡入
        hub.classList.add('active');
        
        // 4. 強制恢復滾動權限
        document.documentElement.style.overflowY = 'auto'; 
        document.body.style.overflowY = 'auto';
        
        // 針對 iOS Safari 的特殊處理
        document.body.style.position = 'static'; 
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
