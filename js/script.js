
document.addEventListener('DOMContentLoaded', function () {
    console.log('=== ИНИЦИАЛИЗАЦИЯ НАЧАТА ===');

    // ---------- WOW.JS ----------
    if (typeof WOW !== 'undefined') {
        new WOW().init();
        console.log('WOW.js инициализирован');
    }

    // ---------- SIMPLE SLIDER (фоны карточек) ----------
    class SimpleSlider {
        constructor() {
            console.log('Загрузка фоновых изображений...');
            this.loadBackgroundImages();
        }

        loadBackgroundImages() {
            const cards = document.querySelectorAll('.advantage-card[data-bg-image]');
            cards.forEach((card, index) => {
                let bgImage = card.getAttribute('data-bg-image');
                if (bgImage) {
                    bgImage = bgImage.replace(/url\(['"]?/g, '').replace(/['"]?\)/g, '');
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
    }

    // ---------- FAST GALLERY ----------
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
            this.lightboxCloseInner = null;
            this.isLoading = false;

            this.allPhotos = [
                {src: 'images/gallery/photo1.jpg', alt: 'Концерт The Jazz Prisoners'},
                {src: 'images/gallery/photo2.jpeg', alt: 'Николай Басков'},
                {src: 'images/gallery/photo3.jpg', alt: 'Концерт с вокалистом'},
                {src: 'images/gallery/photo4.png', alt: 'Steve Coleman'},
                {src: 'images/gallery/photo5.jpg', alt: 'Авторский проект The Jazz Prisoners'},
                {src: 'images/gallery/photo6.jpeg', alt: 'Съемки "Привет, Андрей"'},
                {src: 'images/gallery/photo7.jpg', alt: 'Группа "ХИТ", Шоу Андрея Малахова'},
                {src: 'images/gallery/photo8.jpg', alt: 'Welcome на юбилей'},
                {src: 'images/gallery/photo9.jpg', alt: 'Александр Олешко'},
                {src: 'images/gallery/photo10.jpg', alt: 'Группа "Фильмы"'},
                {src: 'images/gallery/photo11.jpg', alt: 'Николай Басков'},
                {src: 'images/gallery/photo12.jpg', alt: 'Master Card Day'},
                {src: 'images/gallery/photo13.jpeg', alt: 'Андрей Малахов'},
                {src: 'images/gallery/photo14.jpg', alt: 'Группа "Фильмы"'},
                {src: 'images/gallery/photo15.jpg', alt: 'Группа Teo Sound, Шоу Братьев Запашных'},
                {src: 'images/gallery/photo16.jpg', alt: 'Концерт в клубе Игоря Бутмана'},
                {src: 'images/gallery/photo17.jpg', alt: 'Stand Up Шоу'},
                {src: 'images/gallery/photo18.jpg', alt: 'Концерт с Максимом Дунаевским'},
                {src: 'images/gallery/photo19.jpg', alt: 'Работа с вокалисткой'},
                {src: 'images/gallery/photo20.jpg', alt: 'Концерт в театре'},
                {src: 'images/gallery/photo21.jpg', alt: 'Группа "ХИТ", Шоу Андрея Малахова'},
                {src: 'images/gallery/photo22.jpg', alt: 'Выступление на свадьбе'},
                {src: 'images/gallery/photo23.jpg', alt: 'Jam Club Moscow'},
                {src: 'images/gallery/photo24.jpg', alt: 'Big Hit Cover Band'},
                {src: 'images/gallery/photo25.jpg', alt: 'Концерт с Diana Dank'},
                {src: 'images/gallery/photo26.jpg', alt: 'Kozlov Jazz Club'}
            ];

            this.init();
        }

        init() {
            console.log('FastGallery: инициализация');
            if (this.loadMoreBtn) this.loadMoreBtn.style.display = 'none';
            this.createAnimatedCloseButton();
            this.setupEventListeners();
            this.loadAllPhotos();
        }

        createAnimatedCloseButton() {
            if (!this.lightboxClose) return;
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
            img.onclick = () => this.openLightbox(photo.src, photo.alt);
            item.appendChild(img);
            return item;
        }

        setupEventListeners() {
            if (this.lightboxClose) {
                this.lightboxClose.onclick = (e) => {
                    e.stopPropagation();
                    this.closeLightbox();
                };
            }
            if (this.lightbox) {
                this.lightbox.onclick = (e) => {
                    if (e.target === this.lightbox) this.closeLightbox();
                };
                if (this.lightboxImage) {
                    this.lightboxImage.onclick = (e) => {
                        e.stopPropagation();
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
            if (!this.lightboxCaption) {
                this.lightboxCaption = document.createElement('div');
                this.lightboxCaption.className = 'lightbox-caption';
                this.lightbox.appendChild(this.lightboxCaption);
            }
            this.lightboxCaption.textContent = alt;
            if (this.lightbox) {
                this.lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
                if (this.lightboxCloseInner) {
                    this.lightboxCloseInner.classList.add('animate');
                }
            }
        }

        closeLightbox() {
            if (this.lightbox) {
                this.lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
                if (this.lightboxCloseInner) {
                    this.lightboxCloseInner.classList.remove('animate');
                }
            }
        }
    }

    // ---------- АНИМАЦИЯ ПОЯВЛЕНИЯ ГАЛЕРЕИ ----------
    (function () {
        setTimeout(() => {
            const galleryGrid = document.getElementById('galleryGrid');
            if (!galleryGrid) return;

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
            galleryGrid.classList.add('loaded');

            function animateOnScroll() {
                const items = galleryGrid.querySelectorAll('.gallery-item:not(.animated)');
                items.forEach((item, index) => {
                    const rect = item.getBoundingClientRect();
                    if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
                        item.style.transitionDelay = `${(index % 8) * 0.1}s`;
                        item.classList.add('animated');
                    }
                });
            }

            setTimeout(animateOnScroll, 200);
            window.addEventListener('scroll', animateOnScroll);
            window.addEventListener('resize', animateOnScroll);
        }, 500);
    })();

    // ---------- ТРЕКЛИСТ (аккордеон) ----------
    const toggleBtns = document.querySelectorAll('.disc-toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const tracks = this.closest('.disc-tracklist').querySelector('.disc-tracks');
            const isOpen = tracks.classList.contains('show');
            tracks.classList.toggle('show');
            this.textContent = isOpen ? '+' : '−';
        });
    });

    // ---------- ПАРАЛЛАКС ДЛЯ ОБЛОЖЕК ----------
    window.addEventListener('scroll', function () {
        const cards = document.querySelectorAll('.disc-card');
        const section = document.querySelector('.disc-section');
        if (!section) return;
        const sectionTop = section.offsetTop;
        const scrollY = window.scrollY;

        cards.forEach((card, index) => {
            const cardTop = card.offsetTop;
            const progress = (scrollY - cardTop + window.innerHeight) / (window.innerHeight * 1.5);
            if (progress > 0 && progress < 1) {
                const cover = card.querySelector('.disc-img-wrapper');
                const originalRotateY = card.classList.contains('disc-card-left') ? -10 : 10;
                cover.style.transform = `perspective(800px) rotateY(${originalRotateY}deg) rotateX(3deg) translateY(${(progress - 0.5) * 30}px)`;
            }
        });
    });

    // ---------- ТАБЫ КОНЦЕРТОВ ----------
    function initTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.concerts-content');
        console.log('Табы: кнопок', tabButtons.length, 'вкладок', tabContents.length);
        if (tabButtons.length === 0) return;

        function switchTab(tabName) {
            tabContents.forEach(content => content.classList.add('hidden'));
            tabButtons.forEach(btn => btn.classList.remove('active'));
            const activeTab = document.getElementById(tabName + 'Tab');
            if (activeTab) activeTab.classList.remove('hidden');
            const activeButton = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
            if (activeButton) activeButton.classList.add('active');
        }

        tabButtons.forEach(button => {
            button.addEventListener('click', function () {
                switchTab(this.getAttribute('data-tab'));
            });
        });

        if (tabButtons[0]) {
            switchTab(tabButtons[0].getAttribute('data-tab'));
        }
    }

    // ---------- ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ ----------
    try {
        console.log('--- Начинаем инициализацию компонентов ---');
        setTimeout(() => {
            new SimpleSlider();
            new FastGallery();
            initTabs();
            console.log('=== ВСЕ КОМПОНЕНТЫ ИНИЦИАЛИЗИРОВАНЫ ===');
        }, 100);
    } catch (error) {
        console.error('Критическая ошибка инициализации:', error);
    }

    // ---------- МОДАЛЬНОЕ ОКНО EMAIL ----------
    function openEmailModal() {
        document.getElementById('emailModal').style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeEmailModal() {
        document.getElementById('emailModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    window.onclick = function (event) {
        const modal = document.getElementById('emailModal');
        if (event.target === modal) closeEmailModal();
    };

    // ---------- МОДАЛЬНОЕ ОКНО ЗАКАЗА ----------
    const modal = document.getElementById('orderModal');
    const ctaButton = document.querySelector('.cta-button');
    const closeBtn = document.querySelector('.order-modal-close');
    const form = document.getElementById('orderForm');
    const archiveLink = document.querySelector('.archive-notice a');
    const consentCheckbox = document.getElementById('consentCheckbox');
    const submitBtn = document.getElementById('submitBtn');

    if (consentCheckbox && submitBtn) {
        consentCheckbox.addEventListener('change', function () {
            submitBtn.disabled = !this.checked;
        });
    }

    function openModal() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    if (ctaButton) {
        ctaButton.addEventListener('click', openModal);
    }

    if (archiveLink) {
        archiveLink.addEventListener('click', function (e) {
            e.preventDefault();
            openModal();
        });
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Проверка согласия (на случай, если disabled не сработал)
            if (!consentCheckbox.checked) {
                alert('Пожалуйста, примите условия договора оферты.');
                return;
            }

            // Блокируем кнопку на время отправки
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';

            // Собираем данные
            const data = {
                name: document.getElementById('userName').value.trim(),
                email: document.getElementById('userEmail').value.trim(),
                phone: document.getElementById('userPhone').value.trim(),
                message: document.getElementById('orderMessage').value.trim(),
                consent: consentCheckbox.checked,
            };

            try {
                const response = await fetch('https://ВАШ_WORKER.workers.dev', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Спасибо! Ваша заявка отправлена. Я свяжусь с вами в ближайшее время.');
                    form.reset();
                    closeModal();
                } else {
                    alert('Ошибка при отправке. Попробуйте позже или напишите мне напрямую.');
                }
            } catch (err) {
                console.error(err);
                alert('Ошибка сети. Проверьте интернет и попробуйте снова.');
            } finally {
                // Возвращаем кнопку в исходное состояние
                submitBtn.disabled = !consentCheckbox.checked;
                submitBtn.textContent = originalText;
            }
        });
    }
    // ---------- БУРГЕР-МЕНЮ ----------
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            mainNav.classList.toggle('active');
            menuToggle.textContent = mainNav.classList.contains('active') ? '✕' : '☰';
        });

        document.addEventListener('click', function (e) {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mainNav.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });
    }

    document.querySelectorAll('.dropdown').forEach(function (dropdown) {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', function (e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        }
    });

    <!-- СКРИПТ МАСКИ ТЕЛЕФОНА -->

    var phoneInputs = document.querySelectorAll('input[data-tel-input]');

    var getInputNumbersValue = function (input) {
        return input.value.replace(/\D/g, '');
    }

    var onPhonePaste = function (e) {
        var input = e.target,
            inputNumbersValue = getInputNumbersValue(input);
        var pasted = e.clipboardData || window.clipboardData;
        if (pasted) {
            var pastedText = pasted.getData('Text');
            if (/\D/g.test(pastedText)) {
                input.value = inputNumbersValue;
                return;
            }
        }
    }

    var onPhoneInput = function (e) {
        var input = e.target,
            inputNumbersValue = getInputNumbersValue(input),
            selectionStart = input.selectionStart,
            formattedInputValue = "";

        if (!inputNumbersValue) {
            return input.value = "";
        }

        if (input.value.length != selectionStart) {
            if (e.data && /\D/g.test(e.data)) {
                input.value = inputNumbersValue;
            }
            return;
        }

        if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
            if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
            var firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
            formattedInputValue = input.value = firstSymbols + " ";
            if (inputNumbersValue.length > 1) {
                formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
            }
            if (inputNumbersValue.length >= 5) {
                formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
            }
            if (inputNumbersValue.length >= 8) {
                formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
            }
            if (inputNumbersValue.length >= 10) {
                formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
            }
        } else {
            formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
        }
        input.value = formattedInputValue;
    }

    var onPhoneKeyDown = function (e) {
        var inputValue = e.target.value.replace(/\D/g, '');
        if (e.keyCode == 8 && inputValue.length == 1) {
            e.target.value = "";
        }
    }

    for (var phoneInput of phoneInputs) {
        phoneInput.addEventListener('keydown', onPhoneKeyDown);
        phoneInput.addEventListener('input', onPhoneInput, false);
        phoneInput.addEventListener('paste', onPhonePaste, false);
    }

    // Кнопка возврата наверх
    const backToTopButton = document.getElementById('backToTop');

    // Показываем/скрываем кнопку при скролле
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {  // Показываем после 300px скролла
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    // Плавный возврат наверх при клике
    backToTopButton.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'  // Плавная прокрутка
        });
    });
    console.log('=== ИНИЦИАЛИЗАЦИЯ ЗАВЕРШЕНА ===');
});