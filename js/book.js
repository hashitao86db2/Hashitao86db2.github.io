document.addEventListener('DOMContentLoaded', () => {
    // 獲取所有元素
    const emojiCards = document.querySelectorAll('.interactive-gallery .emoji-card');
    const contentArea = document.getElementById('expanded-content-area');

    // ⚡️ 【核心定義】故事與章節的映射關係 (請務必與 HTML 模板 ID 一致)
    const storyMap = [
        { id: 'story1', chapters: ['chapter1-1'] },
        { id: 'story2', chapters: ['chapter2-1', 'chapter2-2'] },
        { id: 'story3', chapters: ['chapter3-1'] },
        { id: 'story4', chapters: ['chapter4-1'] },
        { id: 'story5', chapters: ['chapter5-1'] },
        { id: 'story6', chapters: ['chapter6-1'] },
        { id: 'story7', chapters: ['chapter7-1'] },
        { id: 'story8', chapters: ['chapter8-1'] },
        { id: 'story9', chapters: ['chapter9-1'] },
        // 確保這裡的 ID 和章節數量與您的 HTML 模板完全對應
    ];

    // -----------------------------------------------------
    // A. 內容顯示主函數 (核心替換邏輯)
    // -----------------------------------------------------

    const displayContent = (templateId, currentStoryId) => {
        const templateContent = document.getElementById(templateId);
        if (!templateContent) {
            contentArea.innerHTML = '<div class="content-box" style="text-align:center; color:red;"><p>錯誤: 內容模板 ID "' + templateId + '" 未找到，請檢查 ID 是否正確。</p></div>';
            return;
        }

        contentArea.innerHTML = ''; // 清空展示區
        
        // 複製模板內容並將其標記為當前故事 ID
        const newContent = templateContent.cloneNode(true);
        newContent.removeAttribute('id');
        newContent.dataset.currentStoryId = currentStoryId; 

        // 如果是最終的書本內容，創建導航按鈕
        if (newContent.classList.contains('book-content')) {
            const navContainer = newContent.querySelector('.chapter-nav');
            if (navContainer) {
                const navButtons = createNavButtons(templateId, currentStoryId);
                navContainer.innerHTML = '';
                navContainer.appendChild(navButtons);
            }
        }
        
        // 插入內容並動畫
        newContent.style.opacity = 0; 
        contentArea.appendChild(newContent);
        newContent.scrollIntoView({ behavior: 'smooth', block: 'start' });

        setTimeout(() => {
            newContent.style.opacity = 1;
        }, 50);
        
        return true;
    };


    // -----------------------------------------------------
    // B. 創建導航按鈕函數 (單獨且完整)
    // -----------------------------------------------------
    const createNavButtons = (currentChapterId, storyId) => {
        let story = storyMap.find(s => s.id === storyId);
        if (!story) return document.createElement('div');

        const currentIndex = story.chapters.indexOf(currentChapterId);
        const container = document.createElement('div');
        container.classList.add('chapter-nav-buttons'); 

        // 1. 返回目錄按鈕
        const backToMenuBtn = document.createElement('button');
        backToMenuBtn.textContent = '返回目錄';
        backToMenuBtn.classList.add('cute-nav-btn', 'back-to-menu');
        
        // 插入左箭頭圖示
        backToMenuBtn.innerHTML = '<i class="bi bi-caret-left-fill"></i>' + backToMenuBtn.textContent;
        
        backToMenuBtn.addEventListener('click', () => {
            // 顯示目錄 (目錄的 ID 就是 storyId)
            displayContent(storyId, storyId); 
            // 重新激活上方標籤的 active 狀態
            document.querySelector(`.emoji-card[data-content-id="${storyId}"]`).classList.add('active');
        });
        container.appendChild(backToMenuBtn);


        // 2. 下一章按鈕 / 完結標記
        if (currentIndex < story.chapters.length - 1) {
            const nextChapterId = story.chapters[currentIndex + 1];
            const nextBtn = document.createElement('button');
            nextBtn.textContent = '下一章';
            nextBtn.classList.add('cute-nav-btn', 'next-chapter');
            
            // 插入右箭頭圖示
            nextBtn.innerHTML = nextBtn.textContent + '<i class="bi bi-caret-right-fill"></i>';
            
            nextBtn.addEventListener('click', () => {
                displayContent(nextChapterId, storyId);
            });
            container.appendChild(nextBtn);
        } else {
            // 結尾標記
            const endMarker = document.createElement('span');
            endMarker.textContent = '書已經翻到末頁...'; 
            container.appendChild(endMarker);
        }
        
        return container;
    };

    // -----------------------------------------------------
    // C. 事件監聽主邏輯 (兩層級)
    // -----------------------------------------------------

    // 1. 監聽上方標籤的點擊 (第一層：切換目錄)
    emojiCards.forEach(card => {
        const summary = card.querySelector('summary');
        
        summary.addEventListener('click', (event) => {
            event.preventDefault(); 
            
            const storyId = card.getAttribute('data-content-id'); 
            const isActive = card.classList.contains('active');

            // 1. 清除所有活動狀態 (單選機制)
            emojiCards.forEach(c => c.classList.remove('active'));
            
            if (!isActive) {
                // 點擊卡片時，顯示對應的故事目錄 (目錄的 ID 就是 storyId)
                if (displayContent(storyId, storyId)) { 
                    card.classList.add('active');
                }
            } else {
                // 如果是活動狀態，再次點擊則關閉內容
                contentArea.innerHTML = '';
            }
        });
    });

    // 2. 監聽內容區內的所有點擊事件 (第二層：切換章節)
    contentArea.addEventListener('click', (e) => {
        const chapterItem = e.target.closest('li[data-target-id]'); // 目標是目錄列表項
        
        if (chapterItem) {
            const targetId = chapterItem.dataset.targetId; 
            const templateBox = e.target.closest('.template-box');

            // 確保找到 currentStoryId
            if (templateBox) {
                const currentStoryId = templateBox.dataset.currentStoryId; 

                // 移除上方標籤的 active 狀態 (因為已經從目錄切換到書本內容)
                document.querySelector(`.emoji-card[data-content-id="${currentStoryId}"]`).classList.remove('active');
                
                // 顯示最終的書本內容 (替換目錄)
                displayContent(targetId, currentStoryId);
            }
        }
    });

});
