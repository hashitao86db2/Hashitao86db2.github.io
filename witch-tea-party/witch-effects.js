/**
 * 魔女名冊專用過場特效系統 v2.0
 * 升級版：時之沙堆積與吹散、草藥尖葉
 */
const WitchEffects = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,
    
    // 用於時之沙的狀態控制
    sandState: {
        phase: 'off', // off, filling, full, blowing
        startTime: 0,
    },

    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'transition-canvas';
        this.canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    clear() {
        this.particles = [];
        this.sandState.phase = 'off';
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    // 1. 時之魔女：金色沙塵 (升級版：堆積 -> 吹散)
    startSandEffect() {
        this.clear();
        this.sandState.phase = 'filling';
        this.sandState.startTime = Date.now();
        
        // 建立大量細小的沙粒
        const pCount = 2500; // 需要大量粒子才能填滿
        for (let i = 0; i < pCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -Math.random() * this.canvas.height, // 從畫面上方不同高度落下
                targetY: Math.random() * this.canvas.height, // 堆積的目標高度
                size: Math.random() * 2 + 0.5,
                speedY: Math.random() * 10 + 5,
                speedX: (Math.random() - 0.5) * 1,
                color: Math.random() > 0.3 ? '#d4af37' : '#aa8a2e', // 主要是金色，帶點暗金
                phase: 'falling', // falling, settled, blowing
                
                // 吹散時的參數
                blowDelay: 0, // 由 animate 根據 X 軸計算
                blown: false
            });
        }
        this.animate('sand');
    },

    // 2. 深海魔女：浮動泡泡
    startBubbleEffect() {
        this.clear();
        for (let i = 0; i < 40; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height + 20,
                r: Math.random() * 15 + 5,
                speedY: Math.random() * 4 + 2,
                drift: (Math.random() - 0.5) * 2,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        this.animate('bubble');
    },

    // 3. 記憶魔女：糖果雨
    startCandyEffect() {
        this.clear();
        const colors = ['#ff99cc', '#99ccff', '#ffff99', '#cc99ff', '#ffcc99'];
        for (let i = 0; i < 80; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -Math.random() * 500,
                size: Math.random() * 10 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 8 + 6,
                rotation: Math.random() * 360,
                rotSpeed: Math.random() * 10 - 5
            });
        }
        this.animate('candy');
    },

    // 4. 草藥魔法師：落葉 (升級版：尖葉)
    startLeafEffect() {
        this.clear();
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -100,
                size: Math.random() * 15 + 10,
                speedY: Math.random() * 3 + 2,
                speedX: Math.random() * 4 - 2,
                angle: Math.random() * Math.PI * 2,
                swing: Math.random() * 0.05 + 0.02,
                color: '#4a7c59'
            });
        }
        this.animate('leaf');
    },

    animate(type) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let stillRunning = false;
        const now = Date.now();

        // 1. 時之沙 複雜邏輯
        if (type === 'sand') {
            let settledCount = 0;
            const fillingDuration = 1000; // 填滿所需時間
            const fullWaitDuration = 200;  // 填滿後等待時間

            this.particles.forEach(p => {
                if (p.phase === 'falling') {
                    p.y += p.speedY; p.x += p.speedX;
                    // 如果快到達堆積點，就停下來
                    if (p.y >= p.targetY) {
                        p.y = p.targetY;
                        p.phase = 'settled';
                    }
                    stillRunning = true;
                } 
                else if (p.phase === 'settled') {
                    settledCount++;
                    // 檢查是否該進入吹散階段
                    if (this.sandState.phase === 'blowing') {
                        // 根據 X 軸位置給予不同的延遲，形成左到右吹散
                        // 越靠左的沙子越早吹走
                        p.blowDelay = p.x * 0.5; // 調整這個係數可以控制吹散的速度感
                        p.phase = 'waitingToBlow';
                    }
                    stillRunning = true;
                }
                else if (p.phase === 'waitingToBlow') {
                    // 等待自己的吹散時間到達
                    const timeSinceBlowingStarted = now - this.sandState.blowStartTime;
                    if (timeSinceBlowingStarted > p.blowDelay) {
                        p.phase = 'blowing';
                        p.speedX = Math.random() * 20 + 15; // 向右的高速
                        p.speedY = (Math.random() - 0.5) * 5; // 有點上下浮動
                    }
                    stillRunning = true;
                }
                else if (p.phase === 'blowing') {
                    p.x += p.speedX; p.y += p.speedY;
                    p.speedX *= 0.98; // 慢慢減速
                    // 如果吹出螢幕，標記為結束
                    if (p.x < this.canvas.width + 50) {
                        stillRunning = true;
                    }
                }

                // 繪制沙粒
                this.ctx.fillStyle = p.color;
                this.ctx.fillRect(p.x, p.y, p.size, p.size);
            });

            // 狀態機器邏輯：控制何時開始吹散
            if (this.sandState.phase === 'filling' && (now - this.sandState.startTime > fillingDuration)) {
                this.sandState.phase = 'full';
                this.sandState.fullTime = now;
            }
            if (this.sandState.phase === 'full' && (now - this.sandState.fullTime > fullWaitDuration)) {
                this.sandState.phase = 'blowing';
                this.sandState.blowStartTime = now;
            }
        } 
        
        // 2. 深海泡泡
        else if (type === 'bubble') {
            this.particles.forEach(p => {
                p.y -= p.speedY; p.x += Math.sin(p.y/50) * p.drift;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity})`;
                this.ctx.stroke();
                if (p.y + p.r > 0) stillRunning = true;
            });
        }
        
        // 3. 記憶糖果
        else if (type === 'candy') {
            this.particles.forEach(p => {
                p.y += p.speedY; p.rotation += p.rotSpeed;
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.rotation * Math.PI / 180);
                this.ctx.fillStyle = p.color;
                this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size); // 簡單的正方形糖果
                this.ctx.restore();
                if (p.y < this.canvas.height + 50) stillRunning = true;
            });
        }
        
        // 4. 草藥落葉 (升級版：尖葉)
        else if (type === 'leaf') {
            this.particles.forEach(p => {
                p.y += p.speedY; p.x += Math.sin(p.y * p.swing) * 3;
                
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(Math.sin(p.y*0.05) + Math.PI/4); // 基礎旋轉加上擺動
                this.ctx.fillStyle = p.color;
                
                // 繪制尖葉 (使用 Bezier 曲線)
                this.ctx.beginPath();
                // 葉子頂點
                this.ctx.moveTo(0, -p.size); 
                // 左側曲線 (尖 -> 寬 -> 尖)
                this.ctx.bezierCurveTo(-p.size/2, -p.size/2, -p.size/2, p.size/2, 0, p.size);
                // 右側曲線 (尖 -> 寬 -> 尖)
                this.ctx.bezierCurveTo(p.size/2, p.size/2, p.size/2, -p.size/2, 0, -p.size);
                this.ctx.closePath();
                this.ctx.fill();
                
                this.ctx.restore();
                
                if (p.y < this.canvas.height + 100) stillRunning = true;
            });
        }

        if (stillRunning) {
            this.animationId = requestAnimationFrame(() => this.animate(type));
        } else {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => WitchEffects.init());
                y: -20,
                size: Math.random() * 3 + 1,
                speedY: Math.random() * 15 + 10,
                speedX: (Math.random() - 0.5) * 5,
                color: Math.random() > 0.5 ? '#d4af37' : '#aa8a2e',
                life: 1
            });
        }
        this.animate('sand');
    },

    // 2. 深海魔女：浮動泡泡
    startBubbleEffect() {
        this.clear();
        for (let i = 0; i < 40; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height + 20,
                r: Math.random() * 15 + 5,
                speedY: Math.random() * 4 + 2,
                drift: (Math.random() - 0.5) * 2,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        this.animate('bubble');
    },

    // 3. 記憶魔女：糖果雨
    startCandyEffect() {
        this.clear();
        const colors = ['#ff99cc', '#99ccff', '#ffff99', '#cc99ff', '#ffcc99'];
        for (let i = 0; i < 80; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -Math.random() * 500,
                size: Math.random() * 10 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 8 + 6,
                rotation: Math.random() * 360,
                rotSpeed: Math.random() * 10 - 5
            });
        }
        this.animate('candy');
    },

    // 4. 草藥魔法師：落葉
    startLeafEffect() {
        this.clear();
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -50,
                size: Math.random() * 15 + 10,
                speedY: Math.random() * 3 + 2,
                speedX: Math.random() * 4 - 2,
                angle: Math.random() * Math.PI * 2,
                swing: Math.random() * 0.05 + 0.02
            });
        }
        this.animate('leaf');
    },

    animate(type) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let stillRunning = false;

        this.particles.forEach(p => {
            if (type === 'sand') {
                p.y += p.speedY; p.x += p.speedX;
                this.ctx.fillStyle = p.color;
                this.ctx.fillRect(p.x, p.y, p.size, p.size);
                if (p.y < this.canvas.height) stillRunning = true;
            } 
            else if (type === 'bubble') {
                p.y -= p.speedY; p.x += Math.sin(p.y/50) * p.drift;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity})`;
                this.ctx.stroke();
                if (p.y + p.r > 0) stillRunning = true;
            }
            else if (type === 'candy') {
                p.y += p.speedY; p.rotation += p.rotSpeed;
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.rotation * Math.PI / 180);
                this.ctx.fillStyle = p.color;
                this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size); // 簡單的正方形糖果
                this.ctx.restore();
                if (p.y < this.canvas.height + 50) stillRunning = true;
            }
            else if (type === 'leaf') {
                p.y += p.speedY; p.x += Math.sin(p.y * p.swing) * 3;
                this.ctx.fillStyle = '#4a7c59';
                this.ctx.beginPath();
                this.ctx.ellipse(p.x, p.y, p.size, p.size/2, Math.sin(p.y*0.05), 0, Math.PI*2);
                this.ctx.fill();
                if (p.y < this.canvas.height + 50) stillRunning = true;
            }
        });

        if (stillRunning) {
            this.animationId = requestAnimationFrame(() => this.animate(type));
        } else {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => WitchEffects.init());
