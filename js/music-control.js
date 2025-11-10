document.addEventListener('DOMContentLoaded', () => {
    // 獲取音樂播放器和按鈕元素
    const music = document.getElementById('bgMusic');
    const toggleButton = document.getElementById('musicToggle');
    const toggleIcon = toggleButton ? toggleButton.querySelector('i') : null;
    
    // 如果元素不存在，則不執行後續邏輯
    if (!music || !toggleButton || !toggleIcon) {
        // console.warn("音樂播放器或按鈕未找到，跳過音樂控制初始化。");
        return;
    }

    // ⚡️ 第一次使用者互動時，嘗試播放音樂
    const tryPlayMusic = () => {
        music.play().then(() => {
            // 播放成功
            console.log('音樂開始播放');
            toggleIcon.className = 'bi bi-pause-fill'; // 切換為暫停圖示
        }).catch(error => {
            // 播放被阻止 (通常是瀏覽器限制)
            console.warn('音樂播放被瀏覽器阻止，等待使用者點擊按鈕。');
            music.pause(); 
            toggleIcon.className = 'bi bi-play-fill'; // 保持播放圖示
        });
        
        // 移除文檔級別的監聽，確保只在第一次互動時觸發
        document.removeEventListener('click', tryPlayMusic, { once: true });
    };

    // ⚡️ 監聽整個文檔的點擊作為第一次互動 (瀏覽器解鎖 autoplay 的關鍵)
    document.addEventListener('click', tryPlayMusic, { once: true });


    // ⚡️ 監聽音樂按鈕的點擊事件 (手動控制播放/暫停)
    toggleButton.addEventListener('click', () => {
        if (music.paused) {
            // 從暫停狀態切換到播放狀態
            music.play().then(() => {
                toggleIcon.className = 'bi bi-pause-fill';
            }).catch(error => {
                console.error("無法播放音樂:", error);
                toggleIcon.className = 'bi bi-play-fill';
            });
        } else {
            // 從播放狀態切換到暫停狀態
            music.pause();
            toggleIcon.className = 'bi bi-play-fill';
        }
    });
});
