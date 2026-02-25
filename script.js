const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
}
resizeCanvas();

let particlesArray;
let gradientParticlesArray;

let mouse = {
    x: null,
    y: null,
    radius: 150
}

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('mouseout', function() {
    mouse.x = undefined;
    mouse.y = undefined;
});

window.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        if (this.x > window.innerWidth || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > window.innerHeight || this.y < 0) {
            this.directionY = -this.directionY;
        }

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        
        this.x += this.directionX;
        this.y += this.directionY;
        
        this.draw();
    }
}

class RisingParticle {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = window.innerHeight + Math.random() * 100;
        this.size = Math.random() * 5 + 1;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.opacity = 0;
        this.maxOpacity = Math.random() * 0.3 + 0.1;
        this.fadeState = 'in';
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(255, 0, 0, ' + this.opacity + ')';
        ctx.fill();
    }

    update() {
        this.y -= this.speedY;

        if (this.fadeState === 'in') {
            if (this.opacity < this.maxOpacity) {
                this.opacity += 0.01;
            } else {
                this.fadeState = 'out';
            }
        } else {
            if (this.y < window.innerHeight * 0.3) {
                this.opacity -= 0.005;
            }
        }

        if (this.y < -50 || (this.fadeState === 'out' && this.opacity <= 0)) {
            this.y = window.innerHeight + Math.random() * 100;
            this.x = Math.random() * window.innerWidth;
            this.opacity = 0;
            this.fadeState = 'in';
        }

        this.draw();
    }
}

function init() {
    particlesArray = [];
    gradientParticlesArray = [];

    let numberOfParticles = (window.innerHeight * window.innerWidth) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = '#ffffff';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }

    let numberOfRisingParticles = 50;
    for (let i = 0; i < numberOfRisingParticles; i++) {
        gradientParticlesArray.push(new RisingParticle());
    }
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        let dx_mouse = mouse.x - particlesArray[a].x;
        let dy_mouse = mouse.y - particlesArray[a].y;
        let distance_mouse = Math.sqrt(dx_mouse*dx_mouse + dy_mouse*dy_mouse);

        if (distance_mouse < mouse.radius) {
            opacityValue = 1 - (distance_mouse / mouse.radius);
            ctx.strokeStyle = 'rgba(255, 0, 0,' + opacityValue + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = 0; i < gradientParticlesArray.length; i++) {
        gradientParticlesArray[i].update();
    }

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

window.addEventListener('resize', function() {
    resizeCanvas();
    mouse.radius = 150;
    init();
});

document.addEventListener('DOMContentLoaded', () => {
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        const scrollToTop = () => {
            const c = document.documentElement.scrollTop || document.body.scrollTop;
            if (c > 0) {
                window.requestAnimationFrame(scrollToTop);
                window.scrollTo(0, c - c / 20);
            }
        };
        scrollToTop();
    });

    const faviconImg = new Image();
    faviconImg.crossOrigin = "Anonymous";
    faviconImg.src = "https://github.com/marwannull.png";
    faviconImg.onload = () => {
        const favCanvas = document.createElement('canvas');
        favCanvas.width = 64;
        favCanvas.height = 64;
        const favCtx = favCanvas.getContext('2d');
        
        favCtx.beginPath();
        favCtx.arc(32, 32, 32, 0, 2 * Math.PI);
        favCtx.closePath();
        favCtx.clip();
        
        favCtx.drawImage(faviconImg, 0, 0, 64, 64);
        
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/png';
        link.rel = 'icon';
        link.href = favCanvas.toDataURL();
        document.getElementsByTagName('head')[0].appendChild(link);
    };
});

init();
animate();
