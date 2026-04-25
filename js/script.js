// DETECCIÓN DE MÓVIL
const esMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// CURSOR PERSONALIZADO 
if (!esMovil) {
    const cursor = document.querySelector('.cursor');
    const seguidor = document.querySelector('.cursor-follower');
    if (cursor && seguidor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
            seguidor.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
        });
        const elementosHover = document.querySelectorAll('a, button, .btn-cv, .card-link, .habilidad-tag, .herramienta-tag');
        elementosHover.forEach(el => {
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

// FONDO DE PARTÍCULAS 
(function() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let ancho, alto;
    let particulas = [];
    let raton = { x: null, y: null, radio: esMovil ? 0 : 200 };

    function redimensionarCanvas() {
        ancho = window.innerWidth;
        alto = window.innerHeight;
        canvas.width = ancho;
        canvas.height = alto;
        inicializarParticulas();
    }

    class Particula {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.baseX = x;
            this.baseY = y;
            this.tamano = Math.random() * 2 + 0.5; // reducido ligeramente
            this.densidad = Math.random() * 20 + 8;
            this.color = Math.random() > 0.6 ? '#6366F1' : '#A78BFA';
        }
        dibujar() {
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.tamano, 0, Math.PI * 2);
            ctx.fill();
        }
        actualizar() {
            if (!esMovil && raton.x && raton.y) {
                const dx = raton.x - this.x;
                const dy = raton.y - this.y;
                const distancia = Math.sqrt(dx * dx + dy * dy);
                if (distancia < raton.radio) {
                    const fuerza = (raton.radio - distancia) / raton.radio;
                    const angulo = Math.atan2(dy, dx);
                    this.x -= Math.cos(angulo) * fuerza * this.densidad * 0.4;
                    this.y -= Math.sin(angulo) * fuerza * this.densidad * 0.4;
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

    function inicializarParticulas() {
        particulas = [];
        // Reducimos la cantidad de partículas en desktop para mejorar TBT
        const factor = esMovil ? 15000 : 10000;
        const cantidad = Math.floor((ancho * alto) / factor);
        for (let i = 0; i < cantidad; i++) {
            particulas.push(new Particula(Math.random() * ancho, Math.random() * alto));
        }
    }

    function dibujarLineas() {
        if (esMovil) return;
        for (let a = 0; a < particulas.length; a++) {
            for (let b = a; b < particulas.length; b++) {
                const dx = particulas[a].x - particulas[b].x;
                const dy = particulas[a].y - particulas[b].y;
                const distancia = Math.sqrt(dx * dx + dy * dy);
                if (distancia < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distancia / 100)})`;
                    ctx.lineWidth = 0.4;
                    ctx.moveTo(particulas[a].x, particulas[a].y);
                    ctx.lineTo(particulas[b].x, particulas[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animar() {
        ctx.clearRect(0, 0, ancho, alto);
        dibujarLineas();
        particulas.forEach(p => {
            p.actualizar();
            p.dibujar();
        });
        requestAnimationFrame(animar);
    }

    if (!esMovil) {
        window.addEventListener('mousemove', (e) => {
            raton.x = e.clientX;
            raton.y = e.clientY;
        });
    }
    window.addEventListener('resize', redimensionarCanvas);
    redimensionarCanvas();
    animar();
})();

// MENÚ HAMBURGUESA Y NAVEGACIÓN ACTIVA
const botonHamburguesa = document.querySelector('.hamburger');
const menuLinks = document.querySelector('.nav-links');
if (botonHamburguesa) {
    botonHamburguesa.addEventListener('click', () => {
        botonHamburguesa.classList.toggle('active');
        menuLinks.classList.toggle('active');
    });
}
document.querySelectorAll('.nav-links a').forEach(enlace => {
    enlace.addEventListener('click', () => {
        if (botonHamburguesa) botonHamburguesa.classList.remove('active');
        if (menuLinks) menuLinks.classList.remove('active');
    });
});

window.addEventListener('scroll', () => {
    let actual = '';
    const secciones = document.querySelectorAll('.section');
    secciones.forEach(seccion => {
        const topSeccion = seccion.offsetTop - 120;
        const alturaSeccion = seccion.clientHeight;
        if (window.pageYOffset >= topSeccion && window.pageYOffset < topSeccion + alturaSeccion) {
            actual = seccion.getAttribute('id');
        }
    });
    document.querySelectorAll('.nav-links a').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${actual}`) {
            item.classList.add('active');
        }
    });
});

// EFECTO TYPING EN TÍTULO
const textosTitulo = [
    "🧠 Reprogramo mi mente con cada línea de código · el error es un feedback, no un fracaso ♾️",
    "⚡ Arquitecto de escalas: transmuto datos en decisiones, caos en estructura · alquimia digital 🔮",
    "🌀 No persigo la perfección, persigo la fluidez · el universo responde a mi constancia ✨",
    "🔭 Visualizo mi éxito antes de escribirlo · mis pensamientos crean mi realidad 🎯",
    "🧘 De la adversidad militar nació mi disciplina · hoy escribo mi destino con lógica y fe 🌌",
    "💎 Escucho el silencio entre los datos · allí donde la intuición y la lógica se abrazan 🔍",
    "🔥 Fracasar rápido es pulirme · cada error me acerca a mi versión más elevada 💡",
    "✨ No soy un desarrollador, soy un canal · la tecnología fluye a través de mí para transformar 📈"
];
let indiceTexto = 0;
let indiceCaracter = 0;
let borrando = false;
let textoActual = '';
const elementoEscrito = document.getElementById('typed-title');

function efectoEscritura() {
    if (!elementoEscrito) return;
    const textoCompleto = textosTitulo[indiceTexto];
    if (borrando) {
        textoActual = textoCompleto.substring(0, indiceCaracter - 1);
        indiceCaracter--;
    } else {
        textoActual = textoCompleto.substring(0, indiceCaracter + 1);
        indiceCaracter++;
    }
    elementoEscrito.innerHTML = textoActual + '<span class="typed-cursor">|</span>';
    if (!borrando && indiceCaracter === textoCompleto.length) {
        borrando = true;
        setTimeout(efectoEscritura, 2000);
    } else if (borrando && indiceCaracter === 0) {
        borrando = false;
        indiceTexto = (indiceTexto + 1) % textosTitulo.length;
        setTimeout(efectoEscritura, 300);
    } else {
        setTimeout(efectoEscritura, borrando ? 60 : 120);
    }
}
efectoEscritura();

// PROYECTOS 
const proyectos = [
    {
        titulo: "LUMI STORE - E-commerce de Lujo",
        descripcion: "Plataforma completa para joyería y perfumería. Autenticación, carrito, PayPal y despliegue en Azure. Rol: full stack.",
        tecnologias: ["C#", "ASP.NET Core MVC", "SQL Server", "Azure", "PayPal"],
        icono: "icono-code",
        imagen: "assets/images/lumi.png",
        url: "#"
    },
    {
        titulo: "SGI - Gestión de Inventario con IA Predictiva",
        descripcion: "Control de stock y predicción de demanda con regresión lineal. Flask + PostgreSQL en Render.",
        tecnologias: ["Python", "Flask", "PostgreSQL", "Scikit-learn"],
        icono: "icono-datos",
        imagen: "assets/images/sgi.png",
        url: "https://sig-6cr9.onrender.com"
    },
    {
        titulo: "Predicción de Trends con IA (TikTok)",
        descripcion: "Red neuronal con TensorFlow/Keras para predecir tendencias musicales. Análisis de datos masivos.",
        tecnologias: ["Python", "TensorFlow", "Keras", "Pandas"],
        icono: "icono-datos",
        imagen: "assets/images/limpieza_data.png",
        url: "#"
    }
];

function cargarProyectos() {
    const contenedor = document.getElementById('proyectos-container');
    if (!contenedor) return;
    contenedor.innerHTML = proyectos.map(proy => `
        <div class="proyecto-card">
            <div class="card-image"><img src="${proy.imagen}" alt="${proy.titulo}" loading="lazy" width="400" height="200"></div>
            <div class="card-content">
                <div class="card-header">
                    <div class="card-icon ${proy.icono}"></div>
                    <h3 class="card-title">${proy.titulo}</h3>
                </div>
                <p class="card-desc">${proy.descripcion}</p>
                <div class="card-tech">${proy.tecnologias.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
                <a href="${proy.url}" target="_blank" rel="noopener" class="card-link">Ver proyecto →</a>
            </div>
        </div>
    `).join('');
}
cargarProyectos();

// TERMINAL DINÁMICO (con efecto máquina de escribir)
const mensajesTerminal = [
    "Cada línea de código es un paso hacia mi mejor versión",
    "Aprendo, desaprendo y vuelvo a aprender. Siempre en evolución",
    "Los errores no son fracasos: son datos para el próximo acierto",
    "Construyo puentes entre datos, código y propósito",
    "La disciplina supera al talento cuando el talento no trabaja",
    "No busco la perfección, busco la mejora continua",
    "De la trinchera militar a la arquitectura de software: la resiliencia es mi motor"
];
let indiceMensaje = 0;
const elementoTerminal = document.getElementById('terminal-text');
let indiceCharTerminal = 0;
let borrandoTerminal = false;
let textoTerminalActual = '';

function escribirTerminal() {
    if (!elementoTerminal) return;
    const mensajeCompleto = mensajesTerminal[indiceMensaje];
    if (borrandoTerminal) {
        textoTerminalActual = mensajeCompleto.substring(0, indiceCharTerminal - 1);
        indiceCharTerminal--;
    } else {
        textoTerminalActual = mensajeCompleto.substring(0, indiceCharTerminal + 1);
        indiceCharTerminal++;
    }
    elementoTerminal.textContent = textoTerminalActual;
    if (!borrandoTerminal && indiceCharTerminal === mensajeCompleto.length) {
        borrandoTerminal = true;
        setTimeout(escribirTerminal, 3000);
    } else if (borrandoTerminal && indiceCharTerminal === 0) {
        borrandoTerminal = false;
        indiceMensaje = (indiceMensaje + 1) % mensajesTerminal.length;
        setTimeout(escribirTerminal, 300);
    } else {
        setTimeout(escribirTerminal, borrandoTerminal ? 40 : 80);
    }
}
setTimeout(escribirTerminal, 1000);

// ACTUALIZAR AÑO EN FOOTER
document.getElementById('current-year').textContent = new Date().getFullYear();