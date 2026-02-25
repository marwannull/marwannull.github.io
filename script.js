const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// High DPI Canvas Setup
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
        
        // Interaction logic
        this.x += this.directionX;
        this.y += this.directionY;
        
        this.draw();
    }
}

class RisingParticle {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = window.innerHeight + Math.random() * 100;
        this.size = Math.random() * 2 + 0.5; // Smaller size
        this.speedY = Math.random() * 0.8 + 0.3; // Slightly faster
        this.color1 = this.getRandomColor();
        this.color2 = this.getRandomColor();
        this.opacity = 0;
        this.maxOpacity = Math.random() * 0.5 + 0.2; 
        this.fadeState = 'in'; 
    }

    getRandomColor() {
        const colors = [
            '255, 50, 50', // Red
            '180, 50, 255', // Purple
            '100, 100, 255'  // Blueish
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        ctx.beginPath();
        // Gradient effect for particle
        let gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, 'rgba(' + this.color1 + ',' + this.opacity + ')');
        gradient.addColorStop(1, 'rgba(' + this.color2 + ', 0)');
        
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2, false); // Draw slightly larger to see gradient
        ctx.fill();
    }

    update() {
        this.y -= this.speedY;

        // Fade in
        if (this.fadeState === 'in') {
            if (this.opacity < this.maxOpacity) {
                this.opacity += 0.01;
            } else {
                this.fadeState = 'out';
            }
        } 
        
        // Fade out as it goes up
        if (this.y < window.innerHeight * 0.5) {
             this.opacity -= 0.003;
        }

        // Reset
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

    // Fewer white particles, grey-white color
    // Reduced density significantly
    let numberOfParticles = (window.innerHeight * window.innerWidth) / 25000; 
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 1) + 0.5; // Smaller: 0.5 to 1.5
        let x = (Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.2) - 0.1; 
        let directionY = (Math.random() * 0.2) - 0.1;
        let color = 'rgba(150, 150, 150, 0.2)'; // More grey and transparent

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }

    // Gradient rising particles
    let numberOfRisingParticles = 20; // Reduced from 30
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
            ctx.strokeStyle = 'rgba(255, 0, 0,' + (opacityValue * 0.5) + ')'; // Lower opacity line
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

// Back to Top & Circular Favicon Logic
document.addEventListener('DOMContentLoaded', () => {
    const backToTopBtn = document.getElementById('backToTop');
    
    // Scroll Logic
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        // Custom smooth scroll - faster and prevents locking
        const startPosition = window.pageYOffset;
        const targetPosition = 0;
        const distance = targetPosition - startPosition;
        const duration = 800; // 0.8s for the whole scroll
        let start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            
            // Ease out cubic function
            const ease = 1 - Math.pow(1 - percentage, 3);
            
            window.scrollTo(0, startPosition + distance * ease);

            if (progress < duration) {
                requestAnimationFrame(step);
            }
        }
        
        requestAnimationFrame(step);
    });

    // Circular Favicon
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
