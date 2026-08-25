// ===== ПАРАЛЛАКС =====
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
            if (!isReturning) {
                isReturning = true;
                parallax.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
                parallax.style.transform = 'translateY(0px)';

                clearTimeout(returnTimeout);
                returnTimeout = setTimeout(() => {
                    isReturning = false;
                }, 500);
            }
        } else {
            if (!isReturning) {
                parallax.style.transition = 'transform 0.05s linear';
                const yOffset = Math.min(scrolled * parallaxSpeed, 120);
                parallax.style.transform = 'translateY(' + yOffset + 'px)';
            }
        }

        lastScroll = scrolled;
    });

    // Определяем браузер
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    if (isChrome) {
        const parallax = document.querySelector('.hero-parallax');
        if (parallax) {
            parallax.style.transform = 'none';
            parallax.style.transition = 'none';
        }
        // !!! УБИРАЕМ ОШИБКУ: parallaxHandler не существует
        // window.removeEventListener('scroll', parallaxHandler);
    }

});

// ===== МОДАЛЬНОЕ ОКНО ДЛЯ ГАЛЕРЕИ (ВНЕ DOMContentLoaded) =====
function openModal(imgSrc, captionText) {
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('galleryModalImg');
    const caption = document.getElementById('galleryModalCaption');

    if (!modal || !modalImg || !caption) {
        console.error('Элементы модалки не найдены!');
        return;
    }

    modal.style.display = 'block';
    modalImg.src = imgSrc;
    caption.textContent = captionText;
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Закрытие по клику на фон
document.addEventListener('click', function(e) {
    const modal = document.getElementById('galleryModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Закрытие по Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});