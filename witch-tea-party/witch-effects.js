/**
 * 魔女名冊專用過場特效系統
 */
const WitchEffects = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,

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
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    // 1. 時之魔女：金色沙塵
    startSandEffect() {
        this.clear();
        for (let i = 0; i < 200; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
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
