const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Cursor personalizado (solo desktop)
if (!esMovil) {
    const cursor = document.querySelector('.cursor');
    const seguidor = document.querySelector('.cursor-follower');
    if (cursor && seguidor) {
        document.addEventListener('mousemove', e => {
            cursor.style.transform = `translate(${e.clientX-4}px, ${e.clientY-4}px)`;
            seguidor.style.transform = `translate(${e.clientX-16}px, ${e.clientY-16}px)`;
        });
        const hoverElements = document.querySelectorAll('a, button, .btn-cv, .card-link, .habilidad-tag, .herramienta-tag');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                seguidor.style.transform = `scale(1.5)`;
                seguidor.style.borderColor = '#fff';
            });
            el.addEventListener('mouseleave', () => {
                seguidor.style.transform = `scale(1)`;
                seguidor.style.borderColor = '#A78BFA';
            });
        });
    }
}

// Fondo de partículas + estrellas fugaces + rayos + explosiones
(function() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;
    let particles = [];
    let stars = [];
    let shapes = [];
    let meteoros = [];
    let rayos = [];
    let explosiones = [];
    let mouse = { x: null, y: null, radius: esMovil ? 0 : 160 };
    let lastTimestamp = 0;
    const frameInterval = 1000 / 30; // limitar a 30 FPS para rendimiento
    
    // ESTRELLAS FIJAS
    function createStars() {
        const count = esMovil ? 150 : 300;
        for (let i = 0; i < count; i++) {
            stars.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.5 + 0.5, b: Math.random() * 0.5 + 0.3 });
        }
    }
    function drawStars() {
        for (let s of stars) {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
            ctx.fillStyle = `rgba(255,255,255,${s.b*0.6})`;
            ctx.fill();
        }
    }
    
    // FORMAS GEOMÉTRICAS FLOTANTES
    class Shape {
        constructor(x,y) {
            this.x = x; this.y = y; this.baseX = x; this.baseY = y;
            this.type = Math.floor(Math.random() * 3);
            this.size = Math.random() * 8 + 4;
            this.angle = Math.random() * Math.PI * 2;
            this.vAngle = (Math.random() - 0.5) * 0.02;
            this.color = `rgba(99,102,241,${Math.random() * 0.3 + 0.1})`;
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.beginPath();
            if (this.type === 0) {
                ctx.moveTo(0, -this.size);
                ctx.lineTo(this.size, 0);
                ctx.lineTo(0, this.size);
                ctx.lineTo(-this.size, 0);
                ctx.closePath();
            } else if (this.type === 1) {
                ctx.rect(-this.size/2, -this.size/2, this.size, this.size);
            } else {
                const h = this.size * Math.sqrt(3) / 2;
                ctx.moveTo(0, -h/1.5);
                ctx.lineTo(this.size/2, h/3);
                ctx.lineTo(-this.size/2, h/3);
                ctx.closePath();
            }
            ctx.fillStyle = this.color;
            ctx.strokeStyle = `rgba(167,139,250,0.4)`;
            ctx.lineWidth = 0.8;
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
        update() {
            this.x += (this.baseX - this.x) * 0.008;
            this.y += (this.baseY - this.y) * 0.008;
            this.angle += this.vAngle;
            this.baseX += (Math.random() - 0.5) * 0.3;
            this.baseY += (Math.random() - 0.5) * 0.3;
            this.baseX = Math.min(Math.max(this.baseX, 20), w - 20);
            this.baseY = Math.min(Math.max(this.baseY, 20), h - 20);
        }
    }
    function initShapes() {
        shapes = [];
        const count = esMovil ? 20 : 40;
        for (let i = 0; i < count; i++) shapes.push(new Shape(Math.random()*w, Math.random()*h));
    }
    
    // PARTÍCULAS NEURONALES
    class Particle {
        constructor(x,y) {
            this.x = x; this.y = y; this.baseX = x; this.baseY = y;
            this.size = Math.random() * 5 + 3;
            this.density = Math.random() * 18 + 8;
            const colors = ['#6366F1','#A78BFA','#38BDF8','#818CF8'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size+1.5, 0, Math.PI*2);
            ctx.fillStyle = `${this.color}20`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size*0.5, 0, Math.PI*2);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x-1, this.y-1, this.size*0.25, 0, Math.PI*2);
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.fill();
        }
        update() {
            if (!esMovil && mouse.x && mouse.y) {
                const dx = mouse.x - this.x, dy = mouse.y - this.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const ang = Math.atan2(dy, dx);
                    this.x -= Math.cos(ang) * force * this.density * 0.35;
                    this.y -= Math.sin(ang) * force * this.density * 0.35;
                } else { this.x += (this.baseX - this.x) * 0.015; this.y += (this.baseY - this.y) * 0.015; }
            } else { this.x += (this.baseX - this.x) * 0.015; this.y += (this.baseY - this.y) * 0.015; }
        }
    }
    function initParticles() {
        particles = [];
        const count = esMovil ? 40 : 80;
        for (let i = 0; i < count; i++) particles.push(new Particle(Math.random()*w, Math.random()*h));
    }
    
    // CONEXIONES NEURONALES
    function drawConnections() {
        if (esMovil) return;
        const maxDist = 160;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i+1; j < particles.length; j++) {
                const p1 = particles[i], p2 = particles[j];
                const dx = p1.x - p2.x, dy = p1.y - p2.y;
                const dist = Math.hypot(dx, dy);
                if (dist < maxDist) {
                    let intensity = 1 - (dist / maxDist);
                    intensity = Math.pow(intensity, 1.5);
                    const opacity = Math.min(0.25, intensity * 0.35);
                    const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
                    grad.addColorStop(0, p1.color);
                    grad.addColorStop(1, p2.color);
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 0.6;
                    ctx.lineCap = 'round';
                    ctx.shadowBlur = 2;
                    ctx.shadowColor = p1.color;
                    ctx.globalAlpha = opacity;
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
    
    // TRIÁNGULOS ENTRE PARTÍCULAS CERCANAS
    function drawTriangles() {
        if (esMovil) return;
        const maxDist = 130;
        for (let i = 0; i < particles.length-2; i++) {
            for (let j = i+1; j < particles.length-1; j++) {
                for (let k = j+1; k < particles.length; k++) {
                    const p1 = particles[i], p2 = particles[j], p3 = particles[k];
                    const d12 = Math.hypot(p1.x-p2.x, p1.y-p2.y);
                    const d23 = Math.hypot(p2.x-p3.x, p2.y-p3.y);
                    const d31 = Math.hypot(p3.x-p1.x, p3.y-p1.y);
                    if (d12 < maxDist && d23 < maxDist && d31 < maxDist) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.lineTo(p3.x, p3.y);
                        ctx.closePath();
                        ctx.strokeStyle = `rgba(167, 139, 250, 0.15)`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
        }
    }
    
    // NEBULOSA
    function drawNebula() {
        const grad = ctx.createRadialGradient(w*0.5, h*0.5, 50, w*0.5, h*0.5, w*0.6);
        grad.addColorStop(0, 'rgba(35,20,70,0.2)');
        grad.addColorStop(1, 'rgba(10,10,30,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
    }
    
    // METEOROS
    class Meteoro {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * w;
            this.y = 0;
            this.vx = (Math.random() * 3 + 1) * (Math.random() > 0.5 ? 1 : -1);
            this.vy = Math.random() * 3 + 2;
            this.tamano = Math.random() * 2 + 1;
            this.alpha = 0.8;
            this.active = true;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < -50 || this.x > w+50 || this.y > h+100) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.vx * 8, this.y - this.vy * 8);
            ctx.lineWidth = this.tamano;
            ctx.strokeStyle = `rgba(255, 220, 150, ${this.alpha})`;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.tamano, 0, Math.PI*2);
            ctx.fillStyle = `rgba(255, 200, 100, ${this.alpha})`;
            ctx.fill();
        }
    }
    function initMeteoros() {
        const count = esMovil ? 2 : 4;
        for (let i = 0; i < count; i++) meteoros.push(new Meteoro());
    }
    
    // RAYOS ALEATORIOS
    function generarRayos() {
        if (particles.length < 3) return;
        const a = Math.floor(Math.random() * particles.length);
        const b = Math.floor(Math.random() * particles.length);
        if (a === b) return;
        const p1 = particles[a], p2 = particles[b];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist < 250) {
            rayos.push({
                x1: p1.x, y1: p1.y,
                x2: p2.x, y2: p2.y,
                vida: 8,
                maxVida: 8
            });
        }
    }
    function dibujarRayos() {
        for (let i = rayos.length-1; i >= 0; i--) {
            const r = rayos[i];
            const intensidad = r.vida / r.maxVida;
            ctx.beginPath();
            ctx.moveTo(r.x1, r.y1);
            ctx.lineTo(r.x2, r.y2);
            ctx.strokeStyle = `rgba(255, 200, 100, ${intensidad * 0.9})`;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ffaa44';
            ctx.stroke();
            r.vida--;
            if (r.vida <= 0) rayos.splice(i,1);
        }
        ctx.shadowBlur = 0;
    }
    
    // EXPLOSIONES PEQUEÑAS
    function generarExplosion() {
        if (particles.length === 0) return;
        const p = particles[Math.floor(Math.random() * particles.length)];
        const numChispas = 6;
        for (let i = 0; i < numChispas; i++) {
            explosiones.push({
                x: p.x + (Math.random() - 0.5) * 20,
                y: p.y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                vida: 20,
                size: Math.random() * 2 + 1,
                color: `hsl(${Math.random() * 60 + 30}, 100%, 60%)`
            });
        }
    }
    function dibujarExplosiones() {
        for (let i = explosiones.length-1; i >= 0; i--) {
            const e = explosiones[i];
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.size, 0, Math.PI*2);
            ctx.fillStyle = e.color;
            ctx.fill();
            e.x += e.vx;
            e.y += e.vy;
            e.vx *= 0.98;
            e.vy *= 0.98;
            e.vida--;
            if (e.vida <= 0) explosiones.splice(i,1);
        }
    }
    
    // REDIMENSIONAR Y REINICIAR
    function resize() {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
        stars = [];
        createStars();
        initParticles();
        initShapes();
        meteoros = [];
        initMeteoros();
        rayos = [];
        explosiones = [];
    }
    
    // Generación periódica de rayos y explosiones
    setInterval(() => {
        if (!esMovil && particles.length > 0) {
            if (Math.random() < 0.3) generarRayos();
            if (Math.random() < 0.1) generarExplosion();
        }
    }, 2500);
    
    let lastFrame = 0;
    function animate(now) {
        requestAnimationFrame(animate);
        if (now - lastFrame < frameInterval) return;
        lastFrame = now;
        
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#0A0A0A';
        ctx.fillRect(0, 0, w, h);
        drawNebula();
        drawStars();
        for (let m of meteoros) { m.update(); m.draw(); }
        drawConnections();
        drawTriangles();
        for (let p of particles) { p.update(); p.draw(); }
        for (let s of shapes) { s.update(); s.draw(); }
        dibujarRayos();
        dibujarExplosiones();
    }
    
    if (!esMovil) window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(animate);
})();

// Drawer y navegación
const menuToggle = document.getElementById('menuToggle');
const drawer = document.getElementById('drawer');
const closeDrawer = document.getElementById('closeDrawer');
if (menuToggle && drawer && closeDrawer) {
    menuToggle.addEventListener('click', () => drawer.classList.add('open'));
    closeDrawer.addEventListener('click', () => drawer.classList.remove('open'));
    document.querySelectorAll('.drawer-link').forEach(link => {
        link.addEventListener('click', () => drawer.classList.remove('open'));
    });
}

// Resaltado de sección activa en el drawer
window.addEventListener('scroll', () => {
    let current = '';
    document.querySelectorAll('.section').forEach(section => {
        const top = section.offsetTop - 120;
        const height = section.clientHeight;
        if (window.scrollY >= top && window.scrollY < top + height) current = section.id;
    });
    document.querySelectorAll('.drawer-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
});

// Animación de aparición al scroll
const observer = new IntersectionObserver(entries => { entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); }); }, { threshold: 0.2 });
document.querySelectorAll('.section').forEach(s => observer.observe(s));

// Efecto typing
const typedTitles = ["⚡ Arquitecto de Escalas: ingeniero de mundos digitales ♾️","🧠 Reprogramo mi mente con cada línea de código · el error es un feedback, no un fracaso 🧠","🌀 No persigo la perfección, persigo la fluidez · el universo responde a mi constancia ✨","🔭 Visualizo mi éxito antes de escribirlo · mis pensamientos crean mi realidad 🎯","🧘 De la adversidad militar nació mi disciplina · hoy escribo mi destino con lógica y fe 🌌","💎 Escucho el silencio entre los datos · allí donde la intuición y la lógica se abrazan 🔍","🔥 Fracasar rápido es pulirme · cada error me acerca a mi versión más elevada 💡","✨ No soy un desarrollador, soy un canal · la tecnología fluye a través de mí para transformar 📈"];
let idx = 0, charIdx = 0, deleting = false, currentText = '';
const typedEl = document.getElementById('typed-title');
function type() {
    if (!typedEl) return;
    const full = typedTitles[idx];
    currentText = deleting ? full.substring(0, charIdx-1) : full.substring(0, charIdx+1);
    charIdx = deleting ? charIdx-1 : charIdx+1;
    typedEl.innerHTML = currentText + '<span class="typed-cursor">|</span>';
    if (!deleting && charIdx === full.length) { deleting = true; setTimeout(type, 2000); }
    else if (deleting && charIdx === 0) { deleting = false; idx = (idx+1)%typedTitles.length; setTimeout(type, 300); }
    else setTimeout(type, deleting ? 60 : 120);
}
type();

// PROYECTOS (7 proyectos, con coma corregida)
const projects = [
    { titulo: "LUMI STORE - E-commerce de Lujo", descripcion: "Plataforma completa para joyería y perfumería. Autenticación, carrito, PayPal y despliegue en Azure.", tecnologias: ["C#","ASP.NET Core MVC","SQL Server","Azure","PayPal"], icono: "icono-code", imagen: "assets/images/lumi.png", url: "#" },
    { titulo: "SGI - Gestión de Inventario con IA Predictiva", descripcion: "Control de stock y predicción de demanda con regresión lineal. Flask + PostgreSQL en Render.", tecnologias: ["Python","Flask","PostgreSQL","Scikit-learn"], icono: "icono-datos", imagen: "assets/images/sgi.png", url: "https://sig-6cr9.onrender.com" },
    { titulo: "Predicción de Trends con IA (TikTok)", descripcion: "Red neuronal con TensorFlow/Keras para predecir tendencias musicales.", tecnologias: ["Python","TensorFlow","Keras","Pandas"], icono: "icono-datos", imagen: "assets/images/limpieza_data.png", url: "#" },
    { titulo: "Crypto Herramientas - Accesorios", descripcion: "Tienda virtual de productos físicos para criptomonedas. Carrito con LocalStorage.", tecnologias: ["HTML5","CSS3","JavaScript","Bootstrap","LocalStorage"], icono: "icono-datos", imagen: "assets/images/crypto.png", url: "https://bvelasquez1369.github.io/crypto-herramienta/" },
    { titulo: "Gestor de Tareas", descripcion: "Aplicación web para gestionar tareas con categorías. Guarda datos en LocalStorage.", tecnologias: ["HTML5","CSS3","JavaScript","LocalStorage"], icono: "icono-datos", imagen: "assets/images/tarea.png", url: "https://bvelasquez1369.github.io/Gestor-de-Tareas/" },
    { titulo: "Tarjeta de Perfil Dinámica", descripcion: "Tarjeta interactiva con efecto 3D, partículas y cambio de color.", tecnologias: ["HTML5","CSS3","JavaScript","Bootstrap","Bootstrap Icons"], icono: "icono-code", imagen: "assets/images/card.png", url: "https://bvelasquez1369.github.io/card-bootstrap-brayan/" },
    { titulo: "Calculadora de Factorial (n!)", descripcion: "Aplicación web que calcula el factorial de un número entero no negativo, mostrando el resultado y el desglose completo de la multiplicación. Ideal para aprender matemáticas o comprobar cálculos rápidamente.", tecnologias: ["HTML5", "CSS3", "JavaScript"], icono: "icono-code", imagen: "assets/images/factorial.png", url: "https://bvelasquez1369.github.io/logica-programacion-3/" }
];

function loadProjects() {
    const container = document.getElementById('proyectos-container');
    if (!container) return;
    container.innerHTML = projects.map(p => `
        <div class="proyecto-card">
            <div class="card-image"><img src="${p.imagen}" alt="${p.titulo}" loading="lazy" width="400" height="200"></div>
            <div class="card-content">
                <div class="card-header"><div class="card-icon ${p.icono}"></div><h3 class="card-title">${p.titulo}</h3></div>
                <p class="card-desc">${p.descripcion}</p>
                <div class="card-tech">${p.tecnologias.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
                <a href="${p.url}" target="_blank" class="card-link">Ver proyecto →</a>
            </div>
        </div>
    `).join('');
}
loadProjects();

// Terminal dinámico
const terminalMessages = [ "Cada línea de código es un paso hacia mi mejor versión", "Aprendo, desaprendo y vuelvo a aprender. Siempre en evolución", "Los errores no son fracasos: son datos para el próximo acierto", "Construyo puentes entre datos, código y propósito", "La disciplina supera al talento cuando el talento no trabaja", "No busco la perfección, busco la mejora continua", "De la trinchera militar a la arquitectura de software: la resiliencia es mi motor" ];
let msgIdx = 0, charIdxT = 0, delT = false, curTxt = '';
const termEl = document.getElementById('terminal-text');
function typeTerminal() {
    if (!termEl) return;
    const full = terminalMessages[msgIdx];
    curTxt = delT ? full.substring(0, charIdxT-1) : full.substring(0, charIdxT+1);
    charIdxT = delT ? charIdxT-1 : charIdxT+1;
    termEl.textContent = curTxt;
    if (!delT && charIdxT === full.length) { delT = true; setTimeout(typeTerminal, 3000); }
    else if (delT && charIdxT === 0) { delT = false; msgIdx = (msgIdx+1)%terminalMessages.length; setTimeout(typeTerminal, 300); }
    else setTimeout(typeTerminal, delT ? 40 : 80);
}
setTimeout(typeTerminal, 1000);

// Botón flotante volver arriba
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => { (window.scrollY > 300) ? backToTop.classList.add('show') : backToTop.classList.remove('show'); });
    backToTop.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}
const footerBack = document.getElementById('footer-back-to-top');
if (footerBack) footerBack.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
document.getElementById('current-year').textContent = new Date().getFullYear();