document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const overlay = document.getElementById('fullscreenOverlay');

    // ---- БУРГЕР ----
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        overlay.classList.toggle('open');
        document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
    });

    // ---- ЗАКРЫТЬ ПРИ КЛИКЕ НА ССЫЛКУ ----
    overlay.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ---- ПЛАВНЫЙ СКРОЛЛ ----
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ---- ЗАКРЫТЬ ПО ESCAPE ----
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('open')) {
            menuToggle.classList.remove('active');
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
// ============================================
// БЕСКОНЕЧНЫЙ ПЛАВНЫЙ СЛАЙДЕР (С КЛОНАМИ)
// ============================================

    const sliderTrack = document.getElementById('sliderTrack');
    const slides = document.querySelectorAll('.slide-item');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');

    const totalSlides = slides.length;

// Клонируем первый и последний слайд (с сохранением всех классов и стилей)
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[totalSlides - 1].cloneNode(true);

// Добавляем клоны в трек
    sliderTrack.appendChild(firstClone);
    sliderTrack.insertBefore(lastClone, slides[0]);

// Обновляем список всех слайдов
    const allSlides = sliderTrack.querySelectorAll('.slide-item');
    const totalSlidesWithClones = allSlides.length;

    let currentIndex = 1; // Начинаем с первого реального слайда (индекс 1)
    let autoplayInterval = null;
    const AUTOPLAY_DELAY = 4000;
    let isTransitioning = false;

// Устанавливаем начальную позицию
    sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.dataset.index = i;
            dot.addEventListener('click', function() {
                if (!isTransitioning) {
                    const index = parseInt(this.dataset.index);
                    goToSlide(index + 1);
                    resetAutoplay();
                }
            });
            dotsContainer.appendChild(dot);
        }
    }

    function goToSlide(index) {
        if (isTransitioning) return;

        isTransitioning = true;
        currentIndex = index;

        // Плавный переход
        sliderTrack.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Обновляем точки
        const realIndex = index - 1;
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === realIndex);
        });

        // После анимации проверяем, не на клоне ли мы
        setTimeout(() => {
            isTransitioning = false;

            // Если мы на первом клоне (индекс 0) - перепрыгиваем на последний реальный
            if (currentIndex === 0) {
                sliderTrack.style.transition = 'none';
                const newIndex = totalSlides;
                sliderTrack.style.transform = `translateX(-${newIndex * 100}%)`;
                currentIndex = newIndex;
                document.querySelectorAll('.dot').forEach((dot, i) => {
                    dot.classList.toggle('active', i === totalSlides - 1);
                });
            }
            // Если мы на последнем клоне - перепрыгиваем на первый реальный
            else if (currentIndex === totalSlidesWithClones - 1) {
                sliderTrack.style.transition = 'none';
                const newIndex = 1;
                sliderTrack.style.transform = `translateX(-${newIndex * 100}%)`;
                currentIndex = newIndex;
                document.querySelectorAll('.dot').forEach((dot, i) => {
                    dot.classList.toggle('active', i === 0);
                });
            }
        }, 800);
    }

    function nextSlide() {
        if (isTransitioning) return;
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        if (isTransitioning) return;
        goToSlide(currentIndex - 1);
    }

    function startAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
    }

    function resetAutoplay() {
        startAutoplay();
    }

    function pauseAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    function initSlider() {
        createDots();
        startAutoplay();

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.preventDefault();
                prevSlide();
                resetAutoplay();
            });

            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                nextSlide();
                resetAutoplay();
            });
        }

        const slider = document.getElementById('mainSlider');
        if (slider) {
            slider.addEventListener('mouseenter', pauseAutoplay);
            slider.addEventListener('mouseleave', startAutoplay);
            slider.addEventListener('touchstart', pauseAutoplay, { passive: true });
            slider.addEventListener('touchend', startAutoplay, { passive: true });
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
                resetAutoplay();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
                resetAutoplay();
            }
        });
    }

    initSlider();

});