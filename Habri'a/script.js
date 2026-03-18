function enterWorld() {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('main-world').classList.remove('hidden');
}

// 監聽滾動觸發墜落
window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    // 當滾動到最底部
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        triggerFall();
    }
});

function triggerFall() {
    document.body.classList.add('falling');
    document.getElementById('afterlife').classList.remove('hidden');
    
    // 震動效果或延遲處理
    setTimeout(() => {
        window.scrollTo(0, 0); // 重置滾動位子讓死後世界變成主視覺
    }, 1000);
}
