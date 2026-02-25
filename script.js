const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        this.x += this.directionX;
        this.y += this.directionY;
        
        this.draw();
    }
}

class GradientParticle {
    constructor(x, y, directionX, directionY, size) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
    }

    draw() {
        ctx.beginPath();
        let gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, 'rgba(255, 0, 0, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fill();
    }

    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
    }
}

function init() {
    particlesArray = [];
    gradientParticlesArray = [];

    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = '#ffffff';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }

    let numberOfGradientParticles = 15;
    for (let i = 0; i < numberOfGradientParticles; i++) {
        let size = (Math.random() * 100) + 50;
        let x = Math.random() * innerWidth;
        let y = Math.random() * innerHeight;
        let directionX = (Math.random() * 0.2) - 0.1;
        let directionY = (Math.random() * 0.2) - 0.1;

        gradientParticlesArray.push(new GradientParticle(x, y, directionX, directionY, size));
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
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < gradientParticlesArray.length; i++) {
        gradientParticlesArray[i].update();
    }

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = 150;
    init();
});

init();
animate();
