// ===============================
//  DARK MODE TOGGLE
// ===============================
const toggleButton = document.querySelector('.header__theme-toggle');
const body = document.body;

// Función para cambiar icono
function updateIcon() {
    if (body.classList.contains('theme-dark')) {
        toggleButton.textContent = "☀️";
    } else {
        toggleButton.textContent = "🌙";
    }
}

// Icono inicial
updateIcon();

// Activar/desactivar modo oscuro
toggleButton.addEventListener("click", () => {
    body.classList.toggle("theme-dark");
    updateIcon();
});

// ===============================
//  EFECTO SCROLL EN HEADER
// ===============================
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 10) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
});

// ===============================
//  SCROLL SUAVE CON OFFSET PARA HEADER
// ===============================
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const id = this.getAttribute('href');
        const target = document.querySelector(id);
        
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20; // 20px extra
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
