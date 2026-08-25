// ============================================
// АУДИО ПЛЕЙЛИСТ (БЕЗ ИКОНОК PLAY)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.getElementById('audioPlayer');
    const trackItems = document.querySelectorAll('.track-item');
    let currentTrack = null;
    let isPlaying = false;

    // Форматирование времени
    function formatTime(seconds) {
        if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Остановка всех треков
    function stopAllTracks() {
        trackItems.forEach(item => {
            item.classList.remove('active');
            item.classList.remove('error');
            const duration = item.querySelector('.track-duration');
            if (duration) {
                duration.textContent = '0:00';
                duration.style.color = '';
            }
        });
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        isPlaying = false;
        currentTrack = null;
    }

    // Проверка существования файла
    function checkAudioFile(src) {
        return new Promise((resolve) => {
            fetch(src, { method: 'HEAD' })
                .then(response => {
                    resolve(response.ok);
                })
                .catch(() => {
                    resolve(false);
                });
        });
    }

    // Воспроизведение трека
    async function playTrack(trackItem) {
        const audioSrc = trackItem.dataset.audio;
        const durationEl = trackItem.querySelector('.track-duration');

        // Если тот же трек уже играет - ставим на паузу
        if (currentTrack === trackItem && isPlaying) {
            audioPlayer.pause();
            isPlaying = false;
            trackItem.classList.remove('active');
            durationEl.textContent = '▶ на паузе';
            durationEl.style.color = '#FFD700';
            setTimeout(() => {
                if (!isPlaying || currentTrack !== trackItem) {
                    durationEl.textContent = formatTime(audioPlayer.currentTime);
                    durationEl.style.color = '';
                }
            }, 1000);
            return;
        }

        // Если тот же трек на паузе - возобновляем
        if (currentTrack === trackItem && !isPlaying) {
            audioPlayer.play().catch(() => {});
            isPlaying = true;
            trackItem.classList.add('active');
            return;
        }

        // Новый трек - проверяем файл
        trackItem.classList.remove('error');
        durationEl.textContent = '⏳ загрузка...';
        durationEl.style.color = 'rgba(255,215,0,0.8)';

        const fileExists = await checkAudioFile(audioSrc);

        if (!fileExists) {
            durationEl.textContent = '🎵 скоро будет';
            durationEl.style.color = '#FFD700';
            trackItem.classList.add('error');

            setTimeout(() => {
                if (!currentTrack || currentTrack !== trackItem) {
                    durationEl.textContent = '0:00';
                    durationEl.style.color = '';
                    trackItem.classList.remove('error');
                }
            }, 2500);
            return;
        }

        // Файл есть - играем
        stopAllTracks();

        audioPlayer.src = audioSrc;
        audioPlayer.load();

        try {
            await audioPlayer.play();
            isPlaying = true;
            currentTrack = trackItem;
            trackItem.classList.add('active');
            durationEl.style.color = '#FFD700';

            audioPlayer.onloadedmetadata = function() {
                if (durationEl && !isNaN(audioPlayer.duration)) {
                    durationEl.textContent = formatTime(audioPlayer.duration);
                }
            };
        } catch (err) {
            durationEl.textContent = '❌ ошибка';
            durationEl.style.color = '#ff6b6b';
            setTimeout(() => {
                if (!currentTrack || currentTrack !== trackItem) {
                    durationEl.textContent = '0:00';
                    durationEl.style.color = '';
                }
            }, 2000);
        }
    }

    // Обновление времени
    audioPlayer.addEventListener('timeupdate', function() {
        if (currentTrack) {
            const duration = currentTrack.querySelector('.track-duration');
            if (duration && !isNaN(audioPlayer.duration) && isFinite(audioPlayer.duration)) {
                const currentTime = formatTime(audioPlayer.currentTime);
                const totalTime = formatTime(audioPlayer.duration);
                duration.textContent = `${currentTime} / ${totalTime}`;
            }
        }
    });

    // Когда трек закончился
    audioPlayer.addEventListener('ended', function() {
        if (currentTrack) {
            const duration = currentTrack.querySelector('.track-duration');
            currentTrack.classList.remove('active');
            if (duration) {
                duration.textContent = '0:00';
                duration.style.color = '';
            }
            isPlaying = false;
            currentTrack = null;
        }
    });

    // Обработка ошибок (без всплывающих окон)
    audioPlayer.addEventListener('error', function(e) {
        e.preventDefault();

        if (currentTrack) {
            const duration = currentTrack.querySelector('.track-duration');
            currentTrack.classList.remove('active');

            if (duration) {
                duration.textContent = '⛔ не найден';
                duration.style.color = '#ff6b6b';
                setTimeout(() => {
                    if (!currentTrack) {
                        duration.textContent = '0:00';
                        duration.style.color = '';
                    }
                }, 2000);
            }

            isPlaying = false;
            currentTrack = null;
        }
    });

    // Клик по треку
    trackItems.forEach(item => {
        item.addEventListener('click', function() {
            playTrack(this);
        });
    });

    // Клавиша пробел
    document.addEventListener('keydown', function(e) {
        if (e.key === ' ' && currentTrack) {
            e.preventDefault();
            playTrack(currentTrack);
        }
    });

    // Модалка
    const modal = document.getElementById('orderModal');
    const ctaButtons = document.querySelectorAll('.order-btn');
    const closeBtn = document.querySelector('.order-modal-close');

    function openOrderModal() {
        modal.style.display = 'block';
    }

    ctaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openOrderModal();
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Отправка формы
    document.getElementById('orderForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const phone = document.getElementById('userPhone').value;
        const message = document.getElementById('orderMessage').value;

        const subject = encodeURIComponent(`Заказ выступления Группа Фильмы от ${name}`);
        const body = encodeURIComponent(`Имя: ${name}\nEmail: ${email}\nТелефон: ${phone || 'не указан'}\nСообщение: ${message}`);

        window.location.href = `mailto:films@music.ru?subject=${subject}&body=${body}`;
        alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
        modal.style.display = 'none';
        document.getElementById('orderForm').reset();
    });

    // Кнопка наверх
    const backBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backBtn.classList.add('show');
        } else {
            backBtn.classList.remove('show');
        }
    });
    backBtn.addEventListener('click', () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });

    // Плейлист
    document.querySelectorAll('.play-icon').forEach((icon, index) => {
        icon.addEventListener('click', () => {
            alert('🎵 Здесь будет демо-плеер саундтреков!');
        });
    });

});