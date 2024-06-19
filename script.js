// script.js
document.addEventListener('DOMContentLoaded', () => {
    const textElements = document.querySelectorAll('.text, .title');
    const options = {
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, options);
    textElements.forEach(text => {
        observer.observe(text);
    });
});

// Background particles
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');

let particlesArray;

const mouse = {
    x: null,
    y: null,
    radius: 150
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
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
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
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
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 10;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 10;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 10;
            }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    const colors = ['#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#dc3545', '#fd7e14', '#ffc107', '#28a745', '#20c997', '#17a2b8'];
    for (let i = 0; i < numberOfParticles * 2; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 2) - 1.5;
        let directionY = (Math.random() * 2) - 1.5;
        let color = colors[Math.floor(Math.random() * colors.length)];

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
}

init();
animate();

window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = ((canvas.height / 80) * (canvas.height / 80));
    init();
});

canvas.width = innerWidth;
canvas.height = innerHeight;
mouse.radius = ((canvas.height / 80) * (canvas.height / 80));
