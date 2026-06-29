document.addEventListener('DOMContentLoaded', function() {
    console.log('=== ИНИЦИАЛИЗАЦИЯ НАЧАТА ===');

// После инициализации WOW.js
    if (typeof WOW !== 'undefined') {
        new WOW().init();
        console.log('WOW.js инициализирован');
    }

    class SimpleSlider {
        constructor() {
            console.log('Попытка инициализации слайдера...');

            this.sliderContainer = document.querySelector('.advantages-slider');
            this.grid = document.querySelector('.advantages-grid');
            this.slides = this.grid ? this.grid.querySelectorAll('.slide') : [];
            this.prevBtn = document.querySelector('.slider-prev');
            this.nextBtn = document.querySelector('.slider-next');
            this.dots = document.querySelectorAll('.dot');

            console.log('Элементы слайдера:', {
                sliderContainer: !!this.sliderContainer,
                grid: !!this.grid,
                slides: this.slides.length,
                prevBtn: !!this.prevBtn,
                nextBtn: !!this.nextBtn,
                dots: this.dots.length
            });

            if (!this.grid || this.slides.length === 0) {
                console.error('Слайдер: не найдены слайды!');
                return;
            }

            this.currentSlide = 0;
            this.totalSlides = this.slides.length; // Теперь считаем .slide, а не все дочерние элементы
            this.isAnimating = false;

            console.log('Слайдов найдено:', this.totalSlides);

            // Загружаем фоновые изображения для всех карточек
            this.loadBackgroundImages();

            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => this.prevSlide());
            }
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => this.nextSlide());
            }

            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });

            this.updateSlider();
            console.log('Слайдер инициализирован успешно');
        }

        // Загрузка фоновых изображений для всех карточек
        loadBackgroundImages() {
            // Ищем ВСЕ карточки, даже во втором слайде
            const cards = document.querySelectorAll('.advantage-card[data-bg-image]');

            cards.forEach((card, index) => {
                let bgImage = card.getAttribute('data-bg-image');
                if (bgImage) {
                    // Убираем url() если они есть
                    bgImage = bgImage.replace(/url\(['"]?/g, '').replace(/['"]?\)/g, '');

                    // Предзагрузка изображения
                    const img = new Image();
                    img.onload = () => {
                        console.log(`Фон карточки ${index + 1} загружен:`, bgImage);
                        card.style.backgroundImage = `url('${bgImage}')`;
                        card.style.backgroundSize = 'cover';
                        card.style.backgroundPosition = 'center';
                        card.classList.add('bg-loaded');
                    };
                    img.onerror = () => {
                        console.warn(`Не удалось загрузить фон для карточки ${index + 1}:`, bgImage);
                        card.style.backgroundColor = '#f0f0f0';
                    };
                    img.src = bgImage;
                }
            });
        }

        prevSlide() {
            if (this.isAnimating || this.totalSlides <= 1) return;
            this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
            this.updateSlider();
        }

        nextSlide() {
            if (this.isAnimating || this.totalSlides <= 1) return;
            this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
            this.updateSlider();
        }

        goToSlide(slideIndex) {
            if (this.isAnimating || slideIndex === this.currentSlide || slideIndex >= this.totalSlides) return;
            this.currentSlide = slideIndex;
            this.updateSlider();
        }

        updateSlider() {
            this.isAnimating = true;
            const translateX = -this.currentSlide * 100;

            console.log('Переключаем на слайд:', this.currentSlide + 1, 'translateX:', translateX + '%');

            // Важно: двигаем grid, а не отдельные слайды
            this.grid.style.transform = `translateX(${translateX}%)`;
            this.grid.style.transition = 'transform 0.4s ease';

            // Обновляем точки навигации
            this.dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentSlide);
            });

            // Предзагрузка фона для следующего слайда
            this.preloadNextSlideImages();

            setTimeout(() => {
                this.isAnimating = false;
            }, 400);
        }

        // Предзагрузка изображений для следующего слайда
        preloadNextSlideImages() {
            const nextSlideIndex = (this.currentSlide + 1) % this.totalSlides;
            const nextSlide = this.slides[nextSlideIndex];

            if (nextSlide) {
                const cards = nextSlide.querySelectorAll('.advantage-card[data-bg-image]');
                cards.forEach(card => {
                    if (!card.classList.contains('bg-loaded')) {
                        let bgImage = card.getAttribute('data-bg-image');
                        if (bgImage) {
                            bgImage = bgImage.replace(/url\(['"]?/g, '').replace(/['"]?\)/g, '');
                            const img = new Image();
                            img.src = bgImage;
                            console.log('Предзагрузка фона для следующего слайда:', bgImage);
                        }
                    }
                });
            }
        }
    }

// Инициализация
    document.addEventListener('DOMContentLoaded', () => {
        new SimpleSlider();
    });

// САМАЯ ПРОСТАЯ И БЫСТРАЯ ГАЛЕРЕЯ
    class FastGallery {
        constructor() {
            this.galleryGrid = document.getElementById('galleryGrid');
            if (!this.galleryGrid) {
                console.warn('Gallery: элемент не найден');
                return;
            }

            this.loadMoreBtn = document.getElementById('loadMore');
            this.lightbox = document.getElementById('lightbox');
            this.lightboxImage = this.lightbox?.querySelector('.lightbox-image');
            this.lightboxClose = this.lightbox?.querySelector('.lightbox-close');

            // ДОБАВИМ: для анимации крестика
            this.lightboxCloseInner = null;

            // УБИРАЕМ пагинацию - загружаем все сразу
            this.isLoading = false;

            // Все фото (26 штук, убрал дубли)
            this.allPhotos = [
                { src: 'images/gallery/photo1.jpg', alt: 'Концерт The Jazz Prisoners' },
                { src: 'images/gallery/photo2.jpeg', alt: 'Николай Басков' },
                { src: 'images/gallery/photo3.jpg', alt: 'Концерт с вокалистом' },
                { src: 'images/gallery/photo4.png', alt: 'Steve Coleman' },
                { src: 'images/gallery/photo5.jpg', alt: 'Авторский проект The Jazz Prisoners' },
                { src: 'images/gallery/photo6.jpeg', alt: 'Съемки "Привет, Андрей"' },
                { src: 'images/gallery/photo7.jpg', alt: 'Группа "ХИТ", Шоу Андрея Малахова' },
                { src: 'images/gallery/photo8.jpg', alt: 'Welcome на юбилей' },
                { src: 'images/gallery/photo9.jpg', alt: 'Александр Олешко' },
                { src: 'images/gallery/photo10.jpg', alt: 'Группа "Фильмы"' },
                { src: 'images/gallery/photo11.jpg', alt: 'Николай Басков' },
                { src: 'images/gallery/photo12.jpg', alt: 'Master Card Day' },
                { src: 'images/gallery/photo13.jpeg', alt: 'Андрей Малахов' },
                { src: 'images/gallery/photo14.jpg', alt: 'Группа "Фильмы"' },
                { src: 'images/gallery/photo15.jpg', alt: 'Группа Teo Sound, Шоу Братьев Запашных' },
                { src: 'images/gallery/photo16.jpg', alt: 'Концерт в клубе Игоря Бутмана' },
                { src: 'images/gallery/photo17.jpg', alt: 'Stand Up Шоу' },
                { src: 'images/gallery/photo18.jpg', alt: 'Концерт с Максимом Дунаевским' },
                { src: 'images/gallery/photo19.jpg', alt: 'Работа с вокалисткой' },
                { src: 'images/gallery/photo20.jpg', alt: 'Концерт в театре' },
                { src: 'images/gallery/photo21.jpg', alt: 'Группа "ХИТ", Шоу Андрея Малахова' },
                { src: 'images/gallery/photo22.jpg', alt: 'Выступление на свадьбе' },
                { src: 'images/gallery/photo23.jpg', alt: 'Jam Club Moscow' },
                { src: 'images/gallery/photo24.jpg', alt: 'Big Hit Cover Band' },
                // ДОБАВИМ ЕЩЕ 2 УНИКАЛЬНЫХ ФОТО (замени на реальные)
                { src: 'images/gallery/photo25.jpg', alt: 'Концерт с Diana Dank' },
                { src: 'images/gallery/photo26.jpg', alt: 'Kozlov Jazz Club' }
            ];

            this.init();
        }

        init() {
            console.log('FastGallery: инициализация');

            // Скрываем кнопку "Загрузить еще" если она есть
            if (this.loadMoreBtn) {
                this.loadMoreBtn.style.display = 'none';
            }

            // Создаем анимированный крестик если его нет
            this.createAnimatedCloseButton();

            this.setupEventListeners();
            this.loadAllPhotos();
        }

        // Создаем анимированный крестик
        createAnimatedCloseButton() {
            if (!this.lightboxClose) return;

            // Очищаем кнопку и добавляем анимированный крестик
            this.lightboxClose.innerHTML = '';
            this.lightboxCloseInner = document.createElement('div');
            this.lightboxCloseInner.className = 'close-icon';
            this.lightboxCloseInner.innerHTML = `
            <span class="close-line close-line-1"></span>
            <span class="close-line close-line-2"></span>
        `;
            this.lightboxClose.appendChild(this.lightboxCloseInner);
        }

        loadAllPhotos() {
            if (this.isLoading) return;
            this.isLoading = true;

            console.log(`Загружаем все ${this.allPhotos.length} фото`);

            this.galleryGrid.innerHTML = '';

            this.allPhotos.forEach((photo, i) => {
                const item = this.createGalleryItem(photo, i);
                this.galleryGrid.appendChild(item);
            });

            this.isLoading = false;
            console.log('Все фото загружены');
        }

        createGalleryItem(photo, index) {
            const item = document.createElement('div');
            item.className = 'gallery-item';

            if (index % 3 === 0) item.classList.add('tall');
            if (index % 5 === 0) item.classList.add('wide');
            if (index % 7 === 0) item.classList.add('large');

            const img = document.createElement('img');
            img.src = photo.src;
            img.alt = photo.alt;
            img.loading = 'lazy';
            img.width = 300;
            img.height = 200;

            img.onclick = () => {
                this.openLightbox(photo.src, photo.alt);
            };

            item.appendChild(img);
            return item;
        }

        setupEventListeners() {
            if (this.lightboxClose) {
                this.lightboxClose.onclick = (e) => {
                    e.stopPropagation(); // Чтобы не закрывалось по фото
                    this.closeLightbox();
                };
            }

            if (this.lightbox) {
                // Закрытие по клику на overlay (фон)
                this.lightbox.onclick = (e) => {
                    if (e.target === this.lightbox) this.closeLightbox();
                };

                // ДОБАВЛЯЕМ: закрытие по клику на само фото
                if (this.lightboxImage) {
                    this.lightboxImage.onclick = (e) => {
                        e.stopPropagation(); // Не даем событию всплыть до overlay
                        this.closeLightbox();
                    };
                }
            }

            document.onkeydown = (e) => {
                if (e.key === 'Escape' && this.lightbox?.classList.contains('active')) {
                    this.closeLightbox();
                }
            };
        }

        openLightbox(src, alt) {
            if (this.lightboxImage) {
                this.lightboxImage.src = src;
                this.lightboxImage.alt = alt;
            }

            // Добавляем caption если есть
            if (!this.lightboxCaption) {
                this.lightboxCaption = document.createElement('div');
                this.lightboxCaption.className = 'lightbox-caption';
                this.lightbox.appendChild(this.lightboxCaption);
            }
            this.lightboxCaption.textContent = alt;

            if (this.lightbox) {
                this.lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';

                // Добавляем класс анимации для крестика
                if (this.lightboxCloseInner) {
                    this.lightboxCloseInner.classList.add('animate');
                }
            }
        }

        closeLightbox() {
            if (this.lightbox) {
                this.lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';

                // Убираем класс анимации
                if (this.lightboxCloseInner) {
                    this.lightboxCloseInner.classList.remove('animate');
                }
            }
        }
    }

    new FastGallery();
// ===== ПРОСТАЯ АНИМАЦИЯ ПОЯВЛЕНИЯ =====
    (function() {
        // Ждем загрузки DOM и галереи
        setTimeout(() => {
            const galleryGrid = document.getElementById('galleryGrid');
            if (!galleryGrid) return;

            // CSS для анимации
            const style = document.createElement('style');
            style.textContent = `
            .gallery-item {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .gallery-item.animated {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            
            .gallery-grid {
                opacity: 0;
                transition: opacity 0.5s ease;
            }
            
            .gallery-grid.loaded {
                opacity: 1;
            }
        `;
            document.head.appendChild(style);

            // Показываем сетку
            galleryGrid.classList.add('loaded');

            // Функция для анимации при скролле
            function animateOnScroll() {
                const items = galleryGrid.querySelectorAll('.gallery-item:not(.animated)');

                items.forEach((item, index) => {
                    const rect = item.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;

                    if (isVisible) {
                        // Задержка для каждого элемента
                        item.style.transitionDelay = `${(index % 8) * 0.1}s`;
                        item.classList.add('animated');
                    }
                });
            }

            // Запускаем анимацию
            setTimeout(animateOnScroll, 200);
            window.addEventListener('scroll', animateOnScroll);
            window.addEventListener('resize', animateOnScroll);

        }, 500); // Даем время на загрузку фото
    })();

    // Треклист
    const toggleBtns = document.querySelectorAll('.disc-toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tracks = this.closest('.disc-tracklist').querySelector('.disc-tracks');
            const isOpen = tracks.classList.contains('show');

            if (isOpen) {
                tracks.classList.remove('show');
                this.textContent = '+';
            } else {
                tracks.classList.add('show');
                this.textContent = '−';
            }
        });
    });

    // Легкий параллакс для обложек
    window.addEventListener('scroll', function() {
        const cards = document.querySelectorAll('.disc-card');
        const section = document.querySelector('.disc-section');
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const scrollY = window.scrollY;

        cards.forEach((card, index) => {
            const cardTop = card.offsetTop;
            const progress = (scrollY - cardTop + window.innerHeight) / (window.innerHeight * 1.5);

            if (progress > 0 && progress < 1) {
                const cover = card.querySelector('.disc-img-wrapper');
                const moveY = (progress - 0.5) * 30;

                // Сохраняем оригинальный поворот
                const originalRotateY = card.classList.contains('disc-card-left') ? -10 : 10;
                cover.style.transform = `perspective(800px) rotateY(${originalRotateY}deg) rotateX(3deg) translateY(${moveY}px)`;
            }
        });
    });



    // 5. Табы концертов
    function initTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.concerts-content');

        console.log('Табы: кнопок', tabButtons.length, 'вкладок', tabContents.length);

        if (tabButtons.length === 0) return;

        function switchTab(tabName) {
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });

            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });

            const activeTab = document.getElementById(tabName + 'Tab');
            if (activeTab) {
                activeTab.classList.remove('hidden');
            }

            const activeButton = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
            if (activeButton) {
                activeButton.classList.add('active');
            }
        }

        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                switchTab(tabName);
            });
        });

        // Активируем первую вкладку
        if (tabButtons[0]) {
            const firstTab = tabButtons[0].getAttribute('data-tab');
            switchTab(firstTab);
        }
    }

    // 6. ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ с защитой от ошибок
    try {
        console.log('--- Начинаем инициализацию компонентов ---');

        // Запускаем ВСЁ с небольшой задержкой
        setTimeout(() => {
            new SimpleSlider();
            initTabs();
            new SimpleGallery();

            console.log('=== ВСЕ КОМПОНЕНТЫ ИНИЦИАЛИЗИРОВАНЫ ===');
            console.log('Проверьте консоль на ошибки!');
        }, 100);

    } catch (error) {
        console.error('Критическая ошибка инициализации:', error);
    }

    function openEmailModal() {
        document.getElementById('emailModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeEmailModal() {
        document.getElementById('emailModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

// Закрытие при клике вне модального окна
    window.onclick = function(event) {
        const modal = document.getElementById('emailModal');
        if (event.target === modal) {
            closeEmailModal();
        }
    }

// Получаем элементы
    const modal = document.getElementById('orderModal');
    const ctaButton = document.querySelector('.cta-button');
    const closeBtn = document.querySelector('.order-modal-close');
    const form = document.getElementById('orderForm');

    // 👇 НОВЫЙ КОД: получаем ссылку из archive-notice
    const archiveLink = document.querySelector('.archive-notice a');

    // Получаем элементы формы
    const consentCheckbox = document.getElementById('consentCheckbox');
    const submitBtn = document.getElementById('submitBtn');

// Включаем/выключаем кнопку в зависимости от состояния чекбокса
    if (consentCheckbox && submitBtn) {
        consentCheckbox.addEventListener('change', function() {
            submitBtn.disabled = !this.checked;
        });
    }

// Функция открытия модалки (чтобы не дублировать код)
    function openModal() {
        modal.style.display = 'block';    // или 'flex' — зависит от вашего CSS
        document.body.style.overflow = 'hidden'; // блокируем скролл (если нужно)
    }

// Открытие по основной кнопке (скорее всего уже есть)
    ctaButton.addEventListener('click', openModal);

// 👇 НОВЫЙ КОД: открытие по ссылке в archive-notice
    if (archiveLink) {
        archiveLink.addEventListener('click', function(e) {
            e.preventDefault();  // Отменяем переход по ссылке (#)
            openModal();         // Открываем модалку
        });
    }
// Закрыть модалку
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

// Закрыть при клике вне модалки
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

// Отправка формы
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('userName').value;
            const email = document.getElementById('userEmail').value;
            const phone = document.getElementById('userPhone').value;
            const message = document.getElementById('orderMessage').value;

            // Формируем письмо
            const subject = encodeURIComponent(`Заказ выступления от ${name}`);
            const body = encodeURIComponent(
                `Имя: ${name}\n` +
                `Email: ${email}\n` +
                `Телефон: ${phone || 'не указан'}\n\n` +
                `Детали мероприятия:\n${message}`
            );

            // Отправляем через mailto
            window.location.href = `mailto:antpet12@inbox.ru?subject=${subject}&body=${body}`;

            // Показываем уведомление и закрываем
            alert('Спасибо! Ваша заявка отправлена. Я свяжусь с вами в ближайшее время.');
            closeModal();
            form.reset();
        });
    }
// Бургер-меню
    document.addEventListener('DOMContentLoaded', function() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mainNav = document.querySelector('.main-nav');

        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                mainNav.classList.toggle('active');
                // Меняем текст бургера на крестик
                menuToggle.textContent = mainNav.classList.contains('active') ? '✕' : '☰';
            });

            // Закрываем меню при клике вне его
            document.addEventListener('click', function(e) {
                if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                    mainNav.classList.remove('active');
                    menuToggle.textContent = '☰';
                }
            });
        }

        // Мобильный дропдаун
        document.querySelectorAll('.dropdown').forEach(function(dropdown) {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) {
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                });
            }
        });
    });

});