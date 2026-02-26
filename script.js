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
        this.size = Math.random() * 4.5 + 0.5;
        this.speedY = Math.random() * 0.8 + 0.3;
        this.color1 = this.getRandomColor();
        this.color2 = this.getRandomColor();
        this.opacity = 0;
        this.maxOpacity = Math.random() * 0.5 + 0.2; 
        this.fadeState = 'in'; 
    }

    getRandomColor() {
        const colors = [
            '255, 50, 50',
            '180, 50, 255',
            '100, 100, 255'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        ctx.beginPath();
        let gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, 'rgba(' + this.color1 + ',' + this.opacity + ')');
        gradient.addColorStop(1, 'rgba(' + this.color2 + ', 0)');
        
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2, false);
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
        } 
        
        if (this.y < window.innerHeight * 0.5) {
             this.opacity -= 0.003;
        }

        if (this.y < -50 || this.opacity <= 0) {
            this.y = window.innerHeight + Math.random() * 100;
            this.x = Math.random() * window.innerWidth;
            this.opacity = 0;
            this.fadeState = 'in';
            this.color1 = this.getRandomColor();
            this.color2 = this.getRandomColor();
        }

        this.draw();
    }
}

function init() {
    particlesArray = [];
    gradientParticlesArray = [];

    let numberOfParticles = (window.innerHeight * window.innerWidth) / 25000; 
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 1.5) + 1;
        let x = (Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.2) - 0.1; 
        let directionY = (Math.random() * 0.2) - 0.1;
        let color = 'rgba(180, 180, 180, 0.4)';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }

    let numberOfRisingParticles = 20;
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
            ctx.strokeStyle = 'rgba(255, 50, 50,' + (opacityValue * 0.8) + ')';
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

document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for Fade In Animations
    const fadeElements = document.querySelectorAll('.fade-in, .scroll-animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    const modal = document.getElementById('pluginModal');
    const openModalBtns = document.querySelectorAll('.open-modal');
    const closeModalBtn = document.querySelector('.close-modal');

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        });
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    });
});
