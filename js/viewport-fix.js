// viewport-fix.js - Soluciona problemas de viewport en móviles
(function() {
    'use strict';
    
    // Detectar si es móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        console.log('📱 Dispositivo móvil detectado - Aplicando fixes');
        
        // 1. Forzar viewport meta tag correcto
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        if (!viewportMeta) {
            viewportMeta = document.createElement('meta');
            viewportMeta.name = 'viewport';
            document.head.appendChild(viewportMeta);
        }
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        
        // 2. Prevenir zoom con doble tap
        document.addEventListener('touchstart', function(event) {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        }, { passive: false });
        
        // 3. Prevenir zoom con gesto de pellizco
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // 4. Ajustar tamaño de fuentes en carga
        document.addEventListener('DOMContentLoaded', function() {
            const screenWidth = window.innerWidth;
            
            // Si el ancho es muy pequeño (zoom forzado)
            if (screenWidth < 320) {
                console.log('⚠️ Zoom detectado - Aplicando corrección');
                document.body.style.zoom = '1';
                document.body.style.transform = 'scale(1)';
                document.body.style.transformOrigin = '0 0';
                
                // Forzar recálculo
                setTimeout(() => {
                    window.scrollTo(0, 0);
                }, 100);
            }
            
            // Corregir elementos específicos
            const fixOversizedElements = () => {
                // Foto de perfil
                const profileImg = document.querySelector('.formal-img');
                if (profileImg && profileImg.offsetWidth > window.innerWidth * 0.8) {
                    profileImg.style.maxWidth = '80vw';
                    profileImg.style.height = 'auto';
                }
                
                // Títulos
                document.querySelectorAll('h1').forEach(h1 => {
                    if (h1.offsetWidth > window.innerWidth * 0.9) {
                        h1.style.fontSize = 'calc(1.5rem + 1vw)';
                    }
                });
            };
            
            fixOversizedElements();
            window.addEventListener('resize', fixOversizedElements);
        });
        
        // 5. Detectar y corregir zoom después de carga
        window.addEventListener('load', function() {
            setTimeout(function() {
                const visualViewport = window.visualViewport || window;
                const scale = visualViewport.scale || 1;
                
                if (scale > 1) {
                    console.log('🔍 Zoom detectado:', scale);
                    // Forzar escala normal
                    document.body.style.zoom = (1 / scale).toString();
                }
            }, 500);
        });
    }
    
    // 6. Función para resetear zoom manualmente (útil para debug)
    window.resetMobileView = function() {
        document.querySelector('meta[name="viewport"]').content = 'width=device-width, initial-scale=1.0';
        document.body.style.zoom = '1';
        document.body.style.transform = 'scale(1)';
        location.reload();
    };
    
})();