document.addEventListener('DOMContentLoaded', function() {
    const parallax = document.querySelector('.hero-parallax');
    if (!parallax) return;

    let lastScroll = 0;
    let isReturning = false;
    let returnTimeout;

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.2;

        if (scrolled < lastScroll && scrolled > 50) {
            // Скроллим вверх — плавно возвращаем
            if (!isReturning) {
                isReturning = true;
                parallax.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
                parallax.style.transform = `translateY(0px)`;

                clearTimeout(returnTimeout);
                returnTimeout = setTimeout(() => {
                    isReturning = false;
                }, 500);
            }
        } else {
            // Скроллим вниз — параллакс
            if (!isReturning) {
                parallax.style.transition = 'transform 0.05s linear';
                const yOffset = Math.min(scrolled * parallaxSpeed, 120);
                parallax.style.transform = `translateY(${yOffset}px)`;
            }
        }

        lastScroll = scrolled;
    });
// Определяем браузер
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    if (isChrome) {
        // Отключаем параллакс для Chrome
        const parallax = document.querySelector('.hero-parallax');
        if (parallax) {
            parallax.style.transform = 'none';
            parallax.style.transition = 'none';
        }
        // Убираем обработчик скролла
        window.removeEventListener('scroll', parallaxHandler);
    }
});