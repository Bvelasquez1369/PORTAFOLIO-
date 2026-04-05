
(function() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: null, y: null, radius: isMobile ? 0 : 150 };

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.baseX = x;
            this.baseY = y;
            this.size = Math.random() * 2 + 0.5;
            this.density = Math.random() * 20 + 10;
            this.color = Math.random() > 0.5 ? '#6366F1' : '#A78BFA';
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        update() {
            if (!isMobile && mouse.x && mouse.y) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    this.x -= Math.cos(angle) * force * this.density * 0.6;
                    this.y -= Math.sin(angle) * force * this.density * 0.6;
                } else {
                    this.x += (this.baseX - this.x) * 0.02;
                    this.y += (this.baseY - this.y) * 0.02;
                }
            } else {
                this.x += (this.baseX - this.x) * 0.02;
                this.y += (this.baseY - this.y) * 0.02;
            }
        }
    }

    function initParticles() {
        particles = [];
        const factor = isMobile ? 15000 : 9000;
        const num = Math.floor((width * height) / factor);
        for (let i = 0; i < num; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            particles.push(new Particle(x, y));
        }
    }

    function drawLines() {
        if (isMobile) return;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        drawLines();
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    if (!isMobile) {
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
})();

// 2. MENÚ HAMBURGUESA Y NAVEGACIÓN ACTIVA
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (hamburger) hamburger.classList.remove('active');
        if (navLinks) navLinks.classList.remove('active');
    });
});

// Resaltar sección activa al hacer scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// 3. PROYECTOS DESTACADOS (5 proyectos curados)
const proyectos = [
    {
        titulo: "LUMI STORE - E-commerce de Lujo",
        descripcion: "Plataforma completa para joyería y perfumería con autenticación, carrito de compras, pasarela PayPal y panel administrativo. Desplegada en Azure con SQL Server. Rol: desarrollador full stack. Desafío: integración de pagos y despliegue en la nube.",
        tecnologias: ["C#", "ASP.NET Core MVC", "SQL Server", "Azure", "PayPal", "Bootstrap"],
        icono: "icono-code",
        imagen: "assets\images\image.png",
        url: "https://lumi-tienda-fqb0hhe5hna0fqd7.canadacentral-01.azurewebsites.net"
    },
    {
        titulo: "SGI - Gestión de Inventario con IA Predictiva",
        descripcion: "Aplicación web para control de stock y predicción de demanda usando regresión lineal. Desplegada en Render con Flask y PostgreSQL. Rol: creador del modelo y backend. Desafío: integrar scikit-learn con Flask y manejar sesiones.",
        tecnologias: ["Python", "Flask", "PostgreSQL", "Scikit-learn", "Bootstrap", "Render"],
        icono: "icono-datos",
        imagen: "assets\images\Captura de pantalla 2026-03-14 230813.png",
        url: "https://sig-6cr9.onrender.com"
    },
    {
        titulo: "Predicción de Trends con IA (TikTok)",
        descripcion: "Análisis de datos de TikTok para predecir tendencias musicales usando redes neuronales (TensorFlow/Keras). Rol: científico de datos. Desafío: limpieza de datos masivos y entrenamiento del modelo con recursos limitados.",
        tecnologias: ["Python", "TensorFlow", "Keras", "Pandas", "NumPy", "Matplotlib"],
        icono: "icono-datos",
        imagen: "assets\images\Captura de pantalla 2026-03-14 230028.png",
        url: "https://github.com/Bvelasquez1369/tiktok-trends-ia"  // Cambiar por tu repo real
    },
    {
        titulo: "API REST de Gestión de Tareas",
        descripcion: "API CRUD con ASP.NET Core Web API, DTOs, y pruebas con Postman. Consumo desde cliente front-end con jQuery y AJAX. Rol: backend developer. Desafío: implementar validaciones robustas y documentación Swagger.",
        tecnologias: ["C#", "ASP.NET Core Web API", "Postman", "jQuery", "AJAX"],
        icono: "icono-code",
        imagen: "assets/images/api-tareas.png",
        url: "https://github.com/Bvelasquez1369/tasks-api"  // Cambiar por tu repo real
    },
    {
        titulo: "Dashboard de KPIs Operativos (Power BI)",
        descripcion: "Panel interactivo para seguimiento de indicadores clave de desempeño a partir de datos de Excel. Rol: analista de datos. Desafío: transformación de datos y diseño visual efectivo para toma de decisiones.",
        tecnologias: ["Power BI", "DAX", "Excel"],
        icono: "icono-datos",
        imagen: "assets/images/dashboard-kpi.png",
        url: "https://github.com/Bvelasquez1369/dashboard-kpi"  // Cambiar por tu repo real
    }
];

function cargarProyectos() {
    const container = document.getElementById('proyectos-container');
    if (!container) return;
    
    container.innerHTML = proyectos.map(proj => {
        const imagenHtml = proj.imagen ? 
            `<div class="card-image"><img src="${proj.imagen}" alt="${proj.titulo}" loading="lazy"></div>` : '';
        return `
            <div class="proyecto-card">
                ${imagenHtml}
                <div class="card-content">
                    <div class="card-header">
                        <div class="card-icon ${proj.icono}"></div>
                        <h3 class="card-title">${proj.titulo}</h3>
                    </div>
                    <p class="card-desc">${proj.descripcion}</p>
                    <div class="card-tech">
                        ${proj.tecnologias.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <a href="${proj.url}" target="_blank" rel="noopener noreferrer" class="card-link">Ver proyecto →</a>
                </div>
            </div>
        `;
    }).join('');
}

// 4. TERMINAL DINÁMICA (mensajes cambiantes)
const estados = [
    "online · abierto a oportunidades laborales",
    "explorando .NET 8 y Azure",
    "bootcamp IA completado (159h)",
    "disponible para colaboraciones en análisis de datos",
    "último proyecto: LUMI STORE en Azure"
];
let idx = 0;
setInterval(() => {
    const resp = document.querySelector('.respuesta');
    if (resp) {
        idx = (idx + 1) % estados.length;
        resp.textContent = `>> ${estados[idx]}`;
    }
}, 5000);

// 5. INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    cargarProyectos();
});