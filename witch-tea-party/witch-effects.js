/**
 * 魔女名冊專用過場特效系統 v2.0
 * 修正版：包含時之沙堆積吹散、深海泡泡、糖果雨、草藥尖葉
 */
const WitchEffects = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,
    
    sandState: {
        phase: 'off', 
        startTime: 0,
        fullTime: 0,
        blowStartTime: 0
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
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    clear() {
        this.particles = [];
        this.sandState.phase = 'off';
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    // 1. 時之魔女：金色沙塵 (堆積 -> 左到右吹散)
    startSandEffect() {
        this.clear();
        this.sandState.phase = 'filling';
        this.sandState.startTime = Date.now();
        
        const pCount = 2000; 
        for (let i = 0; i < pCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -Math.random() * 500, 
                targetY: Math.random() * this.canvas.height, 
                size: Math.random() * 2 + 1,
                speedY: Math.random() * 8 + 4,
                speedX: (Math.random() - 0.5) * 1,
                color: Math.random() > 0.3 ? '#d4af37' : '#aa8a2e',
                phase: 'falling',
                blowDelay: 0
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

    // 3. 記憶魔女：糖果驚嚇箱 (中心炸裂)
    startCandyEffect() {
        this.clear();
        const colors = ['#ff99cc', '#99ccff', '#ffff99', '#cc99ff', '#ffcc99'];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        for (let i = 0; i < 100; i++) {
            // 隨機角度 (0 到 360度)
            const angle = Math.random() * Math.PI * 2;
            // 隨機爆炸力道
            const force = Math.random() * 15 + 10;
            
            this.particles.push({
                x: centerX,
                y: centerY,
                size: Math.random() * 12 + 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedX: Math.cos(angle) * force, // 根據角度計算 X 分力
                speedY: Math.sin(angle) * force, // 根據角度計算 Y 分力
                gravity: 0.15, // 給一點重力感，讓糖果炸開後稍微往下墜
                rotation: Math.random() * 360,
                rotSpeed: Math.random() * 20 - 10,
                opacity: 1
            });
        }
        this.animate('candy');
    },


    // 4. 草藥魔法師：尖葉
    startLeafEffect() {
        this.clear();
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -100,
                size: Math.random() * 15 + 10,
                speedY: Math.random() * 3 + 2,
                speedX: Math.random() * 4 - 2,
                color: '#4a7c59',
                swing: Math.random() * 0.05 + 0.02
            });
        }
        this.animate('leaf');
    },

    animate(type) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let stillRunning = false;
        const now = Date.now();

        if (type === 'sand') {
            this.particles.forEach(p => {
                if (p.phase === 'falling') {
                    p.y += p.speedY; p.x += p.speedX;
                    if (p.y >= p.targetY) { p.y = p.targetY; p.phase = 'settled'; }
                    stillRunning = true;
                } 
                else if (p.phase === 'settled') {
                    if (this.sandState.phase === 'blowing') {
                        p.blowDelay = p.x * 0.8; // 左到右的吹散延遲
                        p.phase = 'waitingToBlow';
                    }
                    stillRunning = true;
                }
                else if (p.phase === 'waitingToBlow') {
                    if ((now - this.sandState.blowStartTime) > p.blowDelay) {
                        p.phase = 'blowing';
                        p.speedX = Math.random() * 25 + 20; 
                        p.speedY = (Math.random() - 0.5) * 8;
                    }
                    stillRunning = true;
                }
                else if (p.phase === 'blowing') {
                    p.x += p.speedX; p.y += p.speedY;
                    if (p.x < this.canvas.width + 100) stillRunning = true;
                }
                this.ctx.fillStyle = p.color;
                this.ctx.fillRect(p.x, p.y, p.size, p.size);
            });

            if (this.sandState.phase === 'filling' && (now - this.sandState.startTime > 1200)) {
                this.sandState.phase = 'full';
                this.sandState.fullTime = now;
            }
            if (this.sandState.phase === 'full' && (now - this.sandState.fullTime > 300)) {
                this.sandState.phase = 'blowing';
                this.sandState.blowStartTime = now;
            }
        } 
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
                    else if (type === 'candy') {
                p.x += p.speedX;
                p.y += p.speedY;
                p.speedY += p.gravity; // 加入重力
                p.rotation += p.rotSpeed;
                p.opacity -= 0.005; // 慢慢淡出

                this.ctx.save();
                this.ctx.globalAlpha = Math.max(0, p.opacity);
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.rotation * Math.PI / 180);
                this.ctx.fillStyle = p.color;
                
                // 畫出不同形狀的糖果（小方形或長方形）
                this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
                this.ctx.restore();

                // 如果糖果還在畫面內且還沒透明，就繼續跑
                if (p.y < this.canvas.height + 50 && p.opacity > 0) stillRunning = true;
                });
    }

        else if (type === 'leaf') {
            this.particles.forEach(p => {
                p.y += p.speedY; p.x += Math.sin(p.y * p.swing) * 3;
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(Math.sin(p.y*0.05) + Math.PI/4);
                this.ctx.fillStyle = p.color;
                this.ctx.beginPath();
                this.ctx.moveTo(0, -p.size); 
                this.ctx.bezierCurveTo(-p.size/2, -p.size/2, -p.size/2, p.size/2, 0, p.size);
                this.ctx.bezierCurveTo(p.size/2, p.size/2, p.size/2, -p.size/2, 0, -p.size);
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

document.addEventListener('DOMContentLoaded', () => WitchEffects.init());
