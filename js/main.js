// main.js - Funcionalidades principales del portfolio

// Menu móvil
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Animación al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observar elementos para animación
document.querySelectorAll('.stack-layer, .project-card, .ai-focus-item').forEach(el => {
    observer.observe(el);
});

// Efecto de aparición secuencial para proyectos
document.querySelectorAll('.project-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// ============================================
// BOTÓN "SUBIR ARRIBA" - SIN FLICKER
// ============================================
function initScrollTopButton() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    
    if (!scrollBtn) {
        console.log('ℹ️ Botón scroll-top no encontrado');
        return;
    }
    
    console.log('🔧 Inicializando botón scroll-top...');
    
    // 1. FORZAR a estar OCULTO inicialmente (MÁS FUERTE)
    scrollBtn.style.cssText = 'display: none !important; opacity: 0 !important; visibility: hidden !important;';
    
    // 2. Esperar 500ms antes de permitir que se muestre
    let allowShow = false;
    setTimeout(() => { 
        allowShow = true; 
        console.log('⏱️ Ahora se permite mostrar el botón');
    }, 500);
    
    // 3. Función para mostrar/ocultar
    function updateButtonVisibility() {
        // NO mostrar si no han pasado 500ms
        if (!allowShow) {
            scrollBtn.style.cssText = 'display: none !important; opacity: 0 !important; visibility: hidden !important;';
            return;
        }
        
        // Solo mostrar si hay suficiente scroll
        if (window.scrollY > 300) {
            scrollBtn.style.cssText = 'display: flex !important; opacity: 1 !important; visibility: visible !important; transition: all 0.3s ease !important;';
        } else {
            scrollBtn.style.cssText = 'display: none !important; opacity: 0 !important; visibility: hidden !important;';
        }
    }
    
    // 4. Funcionalidad del botón
    scrollBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 5. Escuchar evento de scroll con delay
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateButtonVisibility, 50); // Pequeño delay
    });
    
    // 6. Verificar después de 600ms (no inmediatamente)
    setTimeout(function() {
        updateButtonVisibility();
        console.log('✅ Botón configurado. Scroll actual:', window.scrollY);
    }, 600);
}

// Cambio de color en navbar al hacer scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(10, 10, 26, 0.98)';
            navbar.style.boxShadow = '0 5px 15px rgba(0, 243, 255, 0.2)';
        } else {
            navbar.style.backgroundColor = 'rgba(10, 10, 26, 0.95)';
            navbar.style.boxShadow = '0 5px 15px rgba(0, 243, 255, 0.1)';
        }
    }
});

// Cargar imágenes con efecto
const images = document.querySelectorAll('img');
images.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
    
    if (img.complete) {
        img.style.opacity = '1';
    } else {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
    }
});

// ============================================
// FUNCIONALIDADES ESPECÍFICAS POR PÁGINA
// ============================================

// VALIDACIONES DEL FORMULARIO DE CONTACTO
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const formMessage = document.getElementById('formMessage');
    
    // Validar nombre (solo letras y espacios)
    function validateName(name) {
        const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,50}$/;
        return nameRegex.test(name.trim());
    }
    
    // Validar email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }
    
    // Validar mensaje
    function validateMessage(message) {
        return message.trim().length >= 10 && message.trim().length <= 1000;
    }
    
    // Validar asunto
    function validateSubject(subject) {
        return subject.trim().length >= 3 && subject.trim().length <= 100;
    }
    
    // Mostrar error
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
        return false;
    }
    
    // Remover error
    function removeError(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
        
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        return true;
    }
    
    // Eventos de validación en tiempo real
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    if (nameInput) {
        nameInput.addEventListener('blur', () => {
            if (!validateName(nameInput.value)) {
                showError(nameInput, 'Nombre inválido. Solo letras y espacios (2-50 caracteres).');
            } else {
                removeError(nameInput);
            }
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            if (!validateEmail(emailInput.value)) {
                showError(emailInput, 'Email inválido. Ejemplo: usuario@dominio.com');
            } else {
                removeError(emailInput);
            }
        });
    }
    
    if (subjectInput) {
        subjectInput.addEventListener('blur', () => {
            if (!validateSubject(subjectInput.value)) {
                showError(subjectInput, 'Asunto muy corto o muy largo (3-100 caracteres).');
            } else {
                removeError(subjectInput);
            }
        });
    }
    
    if (messageInput) {
        messageInput.addEventListener('blur', () => {
            if (!validateMessage(messageInput.value)) {
                showError(messageInput, 'Mensaje debe tener entre 10 y 1000 caracteres.');
            } else {
                removeError(messageInput);
            }
        });
    }
    
    // Envío del formulario a Formspree
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validar todos los campos
        let isValid = true;
        
        if (!validateName(nameInput.value)) {
            showError(nameInput, 'Nombre inválido.');
            isValid = false;
        }
        
        if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Email inválido.');
            isValid = false;
        }
        
        if (!validateSubject(subjectInput.value)) {
            showError(subjectInput, 'Asunto inválido.');
            isValid = false;
        }
        
        if (!validateMessage(messageInput.value)) {
            showError(messageInput, 'Mensaje inválido.');
            isValid = false;
        }
        
        if (!isValid) {
            formMessage.textContent = 'Por favor, corrige los errores en el formulario.';
            formMessage.className = 'form-message error';
            return;
        }
        
        // Preparar datos para Formspree
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Mostrar estado de carga
        const submitBtn = contactForm.querySelector('.btn-send');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        try {
            // Enviar a Formspree
            const response = await fetch('https://formspree.io/f/meeddvlq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                // Éxito
                formMessage.textContent = '¡Mensaje enviado con éxito! Me pondré en contacto contigo pronto.';
                formMessage.className = 'form-message success';
                
                // Resetear formulario
                contactForm.reset();
                
                // Ocultar mensaje después de 5 segundos
                setTimeout(() => {
                    formMessage.style.opacity = '0';
                    setTimeout(() => {
                        formMessage.textContent = '';
                        formMessage.className = 'form-message';
                        formMessage.style.opacity = '1';
                    }, 500);
                }, 5000);
                
            } else {
                throw new Error('Error en el servidor');
            }
            
        } catch (error) {
            console.error('Error:', error);
            formMessage.textContent = 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.';
            formMessage.className = 'form-message error';
            
        } finally {
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ============================================
// INICIALIZACIÓN
// ============================================

// Cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfolio RyuZeNK.Ai - Inicializando...');
    
    // 1. Configurar botón "subir arriba" en todas las páginas
    initScrollTopButton();
    
    // 2. Configurar formulario de contacto (solo en contact.html)
    setupContactForm();
    
    // 3. Inicializar elementos con animaciones
    document.querySelectorAll('.stack-layer, .project-card, .ai-focus-item').forEach(el => {
        observer.observe(el);
    });
    
    // 4. Depuración final
    console.log('✅ Portfolio inicializado correctamente');
    console.log('📍 Botón scroll-top:', document.getElementById('scrollTopBtn') ? 'Encontrado ✓' : 'No encontrado ✗');
    console.log('📍 Scroll actual:', window.scrollY, 'px');
    console.log('📍 El botón aparecerá cuando scrollY > 300px');
});

// Inicializar inmediatamente si el DOM ya está cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollTopButton);
} else {
    setTimeout(initScrollTopButton, 100);
}
// ============================================
// HACER TARJETAS DE PROYECTO CLICKEABLES
// ============================================

function initClickableProjectCards() {
    console.log('🔧 Configurando tarjetas clickeables...');
    
    // Seleccionar solo las tarjetas NO bloqueadas
    const projectCards = document.querySelectorAll('.project-card:not(.blocked)');
    
    projectCards.forEach((card, index) => {
        // 1. Añadir cursor pointer
        card.style.cursor = 'pointer';
        
        // 2. Encontrar el enlace "Ver Detalles" dentro de esta tarjeta
        const detailsLink = card.querySelector('a.btn-small:last-child');
        
        if (!detailsLink || !detailsLink.href) {
            console.log(`⚠️ Tarjeta ${index} no tiene enlace de detalles`);
            return;
        }
        
        // 3. Añadir evento click a TODA la tarjeta
        card.addEventListener('click', function(event) {
            // IMPORTANTE: Si el clic fue en un botón, NO hacer nada
            if (event.target.closest('.btn-small')) {
                console.log('👉 Clic en botón, ignorando clic en tarjeta');
                return;
            }
            
            console.log('🖱️ Clic en tarjeta, redirigiendo a:', detailsLink.href);
            window.location.href = detailsLink.href;
        });
        
        // 4. Efectos visuales opcionales
        card.addEventListener('mouseenter', function() {
            if (!event.target.closest('.btn-small')) {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 10px 25px rgba(0, 243, 255, 0.2)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 0 20px rgba(0, 243, 255, 0.1)';
        });
        
        console.log(`✅ Tarjeta ${index} configurada: ${detailsLink.href}`);
    });
    
    console.log(`✅ ${projectCards.length} tarjetas configuradas como clickeables`);
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClickableProjectCards);
} else {
    // DOM ya cargado
    initClickableProjectCards();
}

// También ejecutar después de un pequeño delay por si acaso
setTimeout(initClickableProjectCards, 500);