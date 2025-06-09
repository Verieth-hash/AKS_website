/**
 * АКС | Агентство качественного сервиса
 * Основной JavaScript для сайта
 */

document.addEventListener('DOMContentLoaded', function() {
    // Основные элементы интерф ейса
    const elements = {
        header: document.querySelector('.header'),
        mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
        mobileMenu: document.querySelector('.mobile-menu'),
        navLinks: document.querySelectorAll('.mobile-nav-list a'),
        faqItems: document.querySelectorAll('#faq .faq-item'),
        sliderArrows: document.querySelectorAll('.slider-arrow'),
        contactForm: document.getElementById('contactForm'),
        successMessage: document.querySelector('.success-message'),
        closeSuccessBtn: document.querySelector('.close-success'),
        scrollProgressBar: document.querySelector('.scroll-progress-bar'),
        contactPopup: document.querySelector('.contact-popup'),
        contactPopupTriggers: document.querySelectorAll('.contact-popup-trigger'),
        contactPopupClose: document.querySelector('.contact-popup-close'),
        contactPopupOverlay: document.querySelector('.contact-popup-overlay')
    };

    // Инициализация компонентов сайта
    initScrollHandlers();
    initMobileMenu();
    initSmoothScrolling();
    initFaqAccordion();
    initCasesSlider();
    initContactForm();
    initAnimations();
    initContactPopup();
    //initTimedPopup();

    // =======================================
    // ОБРАБОТЧИКИ ПРОКРУТКИ СТРАНИЦЫ
    // =======================================
    function initScrollHandlers() {
        if (!elements.scrollProgressBar || !elements.header) return;

        // Добавляем обработчики событий
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', updateScrollProgress);

        // Вызываем сразу при загрузке для установки начального состояния
        handleScroll();
    }

    function handleScroll() {
        // Обновление класса шапки при прокрутке
        if (window.scrollY > 50 && elements.header) {
            elements.header.classList.add('scrolled');
        } else if (elements.header) {
            elements.header.classList.remove('scrolled');
        }

        // Обновление индикатора прокрутки
        updateScrollProgress();
    }

    function updateScrollProgress() {
        if (!elements.scrollProgressBar) return;

        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        // Вычисляем процент прокрутки
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

        // Обновляем ширину индикатора прокрутки
        elements.scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    // =======================================
    // МОБИЛЬНОЕ МЕНЮ
    // =======================================
    function initMobileMenu() {
        if (!elements.mobileMenuToggle || !elements.mobileMenu) return;

        elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);

        // Закрытие мобильного меню при клике по ссылке
        elements.navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (elements.mobileMenu && elements.mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            });
        });
    }

    function toggleMobileMenu() {
        if (!elements.mobileMenuToggle || !elements.mobileMenu) return;

        elements.mobileMenuToggle.classList.toggle('active');
        elements.mobileMenu.classList.toggle('active');

        // Анимация иконки меню
        const spans = elements.mobileMenuToggle.querySelectorAll('span');
        if (spans.length === 3) {
            if (elements.mobileMenu.classList.contains('active')) {
                spans[0].style.transform = 'translateY(9px) rotate(45deg)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'translateY(-9px) rotate(-45deg)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    }

    // =======================================
    // ПЛАВНАЯ ПРОКРУТКА К СЕКЦИЯМ
    // =======================================
    function initSmoothScrolling() {
        // Выбираем только ссылки, которые начинаются с # (якоря на текущей странице)
        const navLinks = document.querySelectorAll('.mobile-nav-list a[href^="#"]');

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const headerHeight = elements.header ? elements.header.offsetHeight : 0;
                    const offsetTop = targetSection.offsetTop - headerHeight;

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // =======================================
    // АККОРДЕОН ДЛЯ FAQ
    // =======================================
    function initFaqAccordion() {
        if (!elements.faqItems.length) return;

        elements.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const toggleIcon = question?.querySelector('.faq-toggle i');

            if (!question || !answer) return;

            question.addEventListener('click', function() {
                // Если текущий элемент уже открыт, закрываем его
                if (item.classList.contains('active')) {
                    item.classList.remove('active');
                    answer.style.height = '0';

                    // Обновляем иконку
                    if (toggleIcon) toggleIcon.className = 'fas fa-plus';
                } else {
                    // Закрываем все остальные элементы
                    elements.faqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                            otherItem.querySelector('.faq-answer').style.height = '0';

                            // Обновляем иконку
                            const otherToggleIcon = otherItem.querySelector('.faq-toggle i');
                            if (otherToggleIcon) otherToggleIcon.className = 'fas fa-plus';
                        }
                    });

                    // Открываем текущий элемент
                    item.classList.add('active');
                    answer.style.height = answer.scrollHeight + 'px';

                    // Обновляем иконку
                    if (toggleIcon) toggleIcon.className = 'fas fa-minus';
                }
            });
        });
    }

    // =======================================
    // СЛАЙДЕР ДЛЯ КЕЙСОВ
    // =======================================
    function initCasesSlider() {
        const caseCards = document.querySelectorAll('.case-card');
        const sliderDotsContainer = document.querySelector('.slider-dots');
        const prevButton = document.querySelector('.slider-arrow.prev');
        const nextButton = document.querySelector('.slider-arrow.next');
        let currentSlide = 0;

        // Если нет карточек или контейнера для точек, выходим из функции
        if (!caseCards.length || !sliderDotsContainer) return;

        // Генерируем точки динамически на основе количества карточек
        createSliderDots(caseCards, sliderDotsContainer);

        // Скрываем все слайды кроме первого
        if (caseCards.length > 1) {
            for (let i = 1; i < caseCards.length; i++) {
                caseCards[i].style.display = 'none';
            }
        }

        // Обработчики клика для стрелок слайдера
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => changeSlide('prev'));
            nextButton.addEventListener('click', () => changeSlide('next'));
        }

        // Добавляем обработчики свайпа для мобильных устройств
        const sliderContainer = document.querySelector('.cases-slider');
        if (sliderContainer) {
            let touchStartX = 0;
            let touchEndX = 0;

            sliderContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            sliderContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });

            function handleSwipe() {
                const minSwipeDistance = 50; // Минимальное расстояние для регистрации свайпа

                if (touchEndX < touchStartX - minSwipeDistance) {
                    // Свайп влево - следующий слайд
                    changeSlide('next');
                }

                if (touchEndX > touchStartX + minSwipeDistance) {
                    // Свайп вправо - предыдущий слайд
                    changeSlide('prev');
                }
            }
        }

        // Функция для создания точек слайдера
        function createSliderDots(slides, container) {
            // Очищаем контейнер с точками
            container.innerHTML = '';

            // Создаем нужное количество точек
            for (let i = 0; i < slides.length; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Слайд ${i + 1}`);

                // Добавляем обработчик события для каждой точки
                dot.addEventListener('click', function() {
                    // Если кликнули на активную точку, ничего не делаем
                    if (i === currentSlide) return;

                    // Делаем плавный переход между слайдами
                    const direction = i > currentSlide ? 'next' : 'prev';
                    const oldSlide = currentSlide;
                    currentSlide = i;
                    animateSlideChange(slides[oldSlide], slides[currentSlide], direction);
                });

                container.appendChild(dot);
            }
        }

        // Функция для анимированной смены слайдов
        function animateSlideChange(currentCard, nextCard, direction) {
            // Скрываем текущий слайд с анимацией
            currentCard.style.opacity = '0';
            currentCard.style.transform = 'translateX(' + (direction === 'next' ? '-' : '') + '20px)';

            setTimeout(() => {
                currentCard.style.display = 'none';

                // Подготавливаем следующий слайд к анимации
                nextCard.style.display = 'flex';
                nextCard.style.opacity = '0';
                nextCard.style.transform = 'translateX(' + (direction === 'next' ? '' : '-') + '20px)';

                // Запускаем анимацию появления
                setTimeout(() => {
                    nextCard.style.opacity = '1';
                    nextCard.style.transform = 'translateX(0)';
                }, 50);

                // Обновляем активную точку
                updateDots();
            }, 300);
        }

        // Функция для переключения слайдов с плавной анимацией
        function changeSlide(direction) {
            const currentCard = caseCards[currentSlide];
            const oldSlide = currentSlide;

            // Вычисляем индекс следующего слайда
            if (direction === 'next') {
                currentSlide = (currentSlide + 1) % caseCards.length;
            } else {
                currentSlide = (currentSlide - 1 + caseCards.length) % caseCards.length;
            }

            // Используем общую функцию для анимированной смены слайдов
            animateSlideChange(currentCard, caseCards[currentSlide], direction);
        }

        // Обновление активных точек
        function updateDots() {
            const dots = document.querySelectorAll('.slider-dots .dot');
            dots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                    dot.setAttribute('aria-current', 'true');
                } else {
                    dot.classList.remove('active');
                    dot.removeAttribute('aria-current');
                }
            });
        }

        // Автоматическая смена слайдов каждые 6 секунд
        let autoplayInterval;

        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                changeSlide('next');
            }, 6000);
        }

        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        // Запускаем автоматическую смену слайдов
        startAutoplay();

        // Останавливаем автоматическую смену при наведении на слайдер
        const casesSection = document.getElementById('cases');
        if (casesSection) {
            casesSection.addEventListener('mouseenter', stopAutoplay);
            casesSection.addEventListener('mouseleave', startAutoplay);
            casesSection.addEventListener('touchstart', stopAutoplay, { passive: true });
            casesSection.addEventListener('touchend', startAutoplay, { passive: true });
        }
    }
    // =======================================
    // ФОРМА ОБРАТНОЙ СВЯЗИ И ИНТЕГРАЦИЯ С CRM
    // =======================================
    function initContactForm() {
        const contactForms = document.querySelectorAll('#contactForm');
        if (!contactForms.length) return;

        contactForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // Показываем индикатор загрузки
                const submitBtn = form.querySelector('.submit-btn');
                if (!submitBtn) return;

                submitBtn.classList.add('loading');

                // Собираем данные формы
                const formData = new FormData(form);
                const formDataObj = {};

                formData.forEach((value, key) => {
                    formDataObj[key] = value;
                });

                // Создаем объект данных для Bitrix24
                const bitrixData = {
                    fields: {
                        TITLE: 'Заявка с сайта от ' + formDataObj.name,
                        NAME: formDataObj.name,
                        PHONE: [{ VALUE: formDataObj.phone, VALUE_TYPE: 'WORK' }],
                        EMAIL: [{ VALUE: formDataObj.email, VALUE_TYPE: 'WORK' }],
                        COMMENTS: formDataObj.message || 'Заявка с сайта'
                    }
                };

                // Отправляем данные в Bitrix24 CRM
                fetch('https://b24-t9lvb8.bitrix24.ru/rest/1/qbkj2lpoonb6i7hq/crm.lead.add.json?FIELDS[TITLE]=&FIELDS[NAME]=&FIELDS[PHONE][0][VALUE]=', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bitrixData)
                })
                    .then(response => response.json())
                    .then(data => {
                    console.log('Success:', data);
                    submitBtn.classList.remove('loading');
                    showSuccessMessage();
                    form.reset();

                    // Закрываем popup после успешной отправки
                    if (elements.contactPopup && elements.contactPopup.classList.contains('active')) {
                        elements.contactPopup.classList.remove('active');
                        document.body.style.overflow = ''; // Восстанавливаем прокрутку страницы
                    }
                })
                    .catch(error => {
                    console.error('Error:', error);
                    submitBtn.classList.remove('loading');
                    showErrorMessage('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.', form);
                });
            });
        });

        // Закрытие сообщения об успешной отправке
        if (elements.closeSuccessBtn && elements.successMessage) {
            elements.closeSuccessBtn.addEventListener('click', function() {
                elements.successMessage.classList.remove('active');
            });
        }
    }

    // =======================================
    // ВСПЛЫВАЮЩАЯ ФОРМА КОНТАКТОВ
    // =======================================
    function initContactPopup() {
        if (!elements.contactPopup) return;

        // Открытие popup при клике на триггеры
        elements.contactPopupTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                elements.contactPopup.classList.add('active');
                document.body.style.overflow = 'hidden'; // Предотвращаем прокрутку страницы
            });
        });

        // Закрытие popup при клике на кнопку закрытия
        if (elements.contactPopupClose) {
            elements.contactPopupClose.addEventListener('click', function() {
                elements.contactPopup.classList.remove('active');
                document.body.style.overflow = ''; // Восстанавливаем прокрутку страницы
            });
        }

        // Закрытие popup при клике вне формы
        if (elements.contactPopupOverlay) {
            elements.contactPopupOverlay.addEventListener('click', function() {
                elements.contactPopup.classList.remove('active');
                document.body.style.overflow = ''; // Восстанавливаем прокрутку страницы
            });
        }

        // Предотвращаем закрытие popup при клике на его содержимое
        const popupContent = elements.contactPopup.querySelector('.contact-popup-content');
        if (popupContent) {
            popupContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }

    // =======================================
    // АНИМАЦИИ ПРИ ПРОКРУТКЕ
    // =======================================
    function initAnimations() {
        const animatedElements = document.querySelectorAll('.service-card, .about-content, .case-card, .faq-item, .service-list-item');

        if (!animatedElements.length) return;

        // Проверяем поддержку IntersectionObserver
        if ('IntersectionObserver' in window) {
            // Создаем Observer для отслеживания видимости элементов
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        // Отключаем наблюдение после того, как элемент стал видимым
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.2 // Элемент считается видимым, когда 20% его высоты входит в область просмотра
            });

            // Добавляем все элементы в Observer
            animatedElements.forEach(element => {
                observer.observe(element);
            });
        } else {
            // Фоллбэк для браузеров без поддержки IntersectionObserver
            animatedElements.forEach(element => {
                element.classList.add('visible');
            });
        }
    }

    // =======================================
    // ВСПЛЫВАЮЩЕЕ ОКНО ПО ТАЙМЕРУ
    // =======================================
    function initTimedPopup() {
        // Создаем HTML для всплывающего окна, если его еще нет
        if (!document.querySelector('.timed-popup')) {
            createTimedPopup();
        }

        // Получаем элементы всплывающего окна
        const timedPopup = document.querySelector('.timed-popup');
        const timedPopupClose = document.querySelector('.timed-popup-close');
        const timedPopupOverlay = document.querySelector('.timed-popup-overlay');

        if (!timedPopup || !timedPopupClose || !timedPopupOverlay) return;

        // Проверяем, посещал ли пользователь сайт ранее
        const initialDelay = 2 * 60 * 1000; // 2 минуты
        const repeatDelay = 5 * 60 * 1000; // 5 минут

        // Настраиваем первое появление окна
        let firstShowTimeout = setTimeout(() => {
            showTimedPopup();
        }, initialDelay);

        // Создаем функцию, чтобы проверить, показывалось ли окно при прошлом визите
        function checkForInactivity() {
            // Если пользователь прокручивает страницу, сбрасываем таймер
            document.addEventListener('scroll', function() {
                // Сбрасываем текущий таймер и устанавливаем новый
                clearTimeout(firstShowTimeout);
                firstShowTimeout = setTimeout(() => {
                    showTimedPopup();
                }, initialDelay);
            }, { once: true });
        }

        // Запускаем проверку
        checkForInactivity();

        // Обработчики для закрытия всплывающего окна
        timedPopupClose.addEventListener('click', () => {
            hideTimedPopup();
        });

        timedPopupOverlay.addEventListener('click', () => {
            hideTimedPopup();
        });

        // Предотвращаем закрытие при клике на содержимое
        const popupContent = document.querySelector('.timed-popup-content');
        if (popupContent) {
            popupContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Обработка формы во всплывающем окне
        const timedContactForm = document.getElementById('timedContactForm');
        if (timedContactForm) {
            timedContactForm.addEventListener('submit', function(e) {
                e.preventDefault();

                // Показываем индикатор загрузки
                const submitBtn = timedContactForm.querySelector('.submit-btn');
                if (!submitBtn) return;

                submitBtn.classList.add('loading');

                // Собираем данные формы
                const formData = new FormData(timedContactForm);
                const formDataObj = {};

                formData.forEach((value, key) => {
                    formDataObj[key] = value;
                });

                // Создаем объект данных для Bitrix24
                const bitrixData = {
                    fields: {
                        TITLE: 'Заявка на бесплатный аудит от ' + formDataObj.name,
                        NAME: formDataObj.name,
                        PHONE: [{ VALUE: formDataObj.phone, VALUE_TYPE: 'WORK' }],
                        COMMENTS: 'Заявка на бесплатный аудит из всплывающего окна'
                    }
                };

                // Отправляем данные в Bitrix24 CRM
                fetch('https://b24-t9lvb8.bitrix24.ru/rest/1/qbkj2lpoonb6i7hq/crm.lead.add.json?FIELDS[TITLE]=&FIELDS[NAME]=&FIELDS[PHONE][0][VALUE]=', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bitrixData)
                })
                    .then(response => response.json())
                    .then(data => {
                    console.log('Success:', data);
                    submitBtn.classList.remove('loading');
                    hideTimedPopup();

                    // Показываем сообщение об успешной отправке
                    showSuccessMessage();
                    timedContactForm.reset();
                })
                    .catch(error => {
                    console.error('Error:', error);
                    submitBtn.classList.remove('loading');
                    showErrorMessage('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.', timedContactForm);
                });
            });
        }

        // Функция для показа всплывающего окна
        function showTimedPopup() {
            // Проверяем, видны ли уже другие модальные окна
            const otherModalVisible = document.querySelector('.contact-popup.active') ||
            document.querySelector('.success-message.active');

            // Показываем всплывающее окно только если нет других модальных окон
            if (!otherModalVisible) {
                timedPopup.classList.add('active');
                document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы

                // Сохраняем время последнего показа
                localStorage.setItem('lastPopupTime', Date.now().toString());
            }

            // Настраиваем следующее появление
            setTimeout(() => {
                showTimedPopup();
            }, repeatDelay);
        }

        // Функция для скрытия всплывающего окна
        function hideTimedPopup() {
            timedPopup.classList.remove('active');
            document.body.style.overflow = ''; // Разблокируем прокрутку
        }
    }

    // =======================================
    // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
    // =======================================

    // Показать сообщение об успешной отправке
    function showSuccessMessage() {
        if (elements.successMessage) {
            elements.successMessage.classList.add('active');
        }
    }

    // Показать сообщение об ошибке
    function showErrorMessage(message, form) {
        const formMessage = form.querySelector('.form-message');
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.classList.add('error');

            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.classList.remove('error');
            }, 5000);
        }
    }


    // Функция для создания HTML всплывающего окна по таймеру
    function createTimedPopup() {
        const popupHTML = `
            <div class="timed-popup">
                <div class="timed-popup-overlay"></div>
                <div class="timed-popup-content">
                    <div class="timed-popup-badge">
                        <span>Специальное предложение</span>
                    </div>
                    <div class="timed-popup-header">
                        <h3>Бесплатный аудит и план рекламы</h3>
                        <button class="timed-popup-close"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="timed-popup-body">
                        <p>Хотите убедиться в нашем профессионализме не на словах а на деле?</p>
                        <p>Оставляйте заявку, наш менеджер свяжется с вами в течении 10 минут. Мы проведем аудит вашей компании и подготовим для вас индивидуальный план рекламы абсолютно <strong>БЕСПЛАТНО!</strong></p>

                        <div class="contact-form-container timed-form">
                            <form id="timedContactForm" class="contact-form">
                                <div class="form-group">
                                    <label for="timed-name">Имя*</label>
                                    <input type="text" id="timed-name" name="name" required>
                                </div>
                                <div class="form-group">
                                    <label for="timed-phone">Телефон*</label>
                                    <input type="tel" id="timed-phone" name="phone" required>
                                </div>
                                <button type="submit" class="btn btn-primary submit-btn timed-submit-btn">
                                    <span class="btn-text">Получить бесплатный аудит</span>
                                    <span class="btn-loader"></span>
                                </button>
                                <div class="form-group checkbox">
                                    <label>Нажимая на кнопку, я соглашаюсь с <a href="#">политикой обработки персональных данных</a></label>
                                </div>
                                <div class="form-message"></div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', popupHTML);

        // Добавляем стили для всплывающего окна
        const popupStyles = document.createElement('style');
        popupStyles.textContent = `
            .timed-popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2100;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity var(--transition-speed) ease, visibility var(--transition-speed) ease;
            }

            .timed-popup.active {
                opacity: 1;
                visibility: visible;
            }

            .timed-popup-badge {
                position: absolute;
                top: -12px;
                right: 20px;
                background: linear-gradient(145deg, #FF4500, #FF6347);
                color: white;
                padding: 5px 15px;
                border-radius: 30px;
                font-weight: bold;
                font-size: 0.9rem;
                box-shadow: 0 3px 10px rgba(255, 69, 0, 0.4);
                transform: rotate(2deg);
                animation: badge-pulse 2s infinite alternate;
                z-index: 2;
            }

            @keyframes badge-pulse {
                0% {
                    transform: rotate(2deg) scale(1);
                    box-shadow: 0 3px 10px rgba(255, 69, 0, 0.4);
                }
                100% {
                    transform: rotate(2deg) scale(1.05);
                    box-shadow: 0 5px 15px rgba(255, 69, 0, 0.6);
                }
            }

            .timed-popup-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(18, 16, 14, 0.85);
                backdrop-filter: blur(4px);
            }

            .timed-popup-content {
                position: relative;
                background: linear-gradient(145deg, #1E1C19, #20262E);
                border-radius: var(--border-radius);
                width: 90%;
                max-width: 550px;
                padding: 30px;
                box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(245, 166, 91, 0.4);
                transform: translateY(20px);
                transition: transform var(--transition-speed) ease;
                z-index: 1;
                border-top: 4px solid #FFA500;
                border-bottom: 4px solid #FFA500;
                animation: pulse-border 2s infinite alternate;
            }

            @keyframes pulse-border {
                0% {
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3), 0 0 15px rgba(245, 166, 91, 0.4);
                    border-color: #FFA500;
                }
                100% {
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3), 0 0 25px rgba(255, 165, 0, 0.7);
                    border-color: #FF8C00;
                }
            }

            .timed-popup.active .timed-popup-content {
                transform: translateY(0);
            }

            .timed-popup-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .timed-popup-header h3 {
                margin-bottom: 0;
                font-size: 1.7rem;
                color: #FFA500;
                text-shadow: 0 0 5px rgba(255, 165, 0, 0.3);
                font-weight: 700;
                animation: color-shift 3s infinite alternate;
            }

            @keyframes color-shift {
                0% { color: #FFA500; }
                50% { color: #FF8C00; }
                100% { color: #FFD700; }
            }

            .timed-popup-close {
                background: none;
                border: none;
                color: var(--color-text-secondary);
                font-size: 1.25rem;
                cursor: pointer;
                transition: color var(--transition-speed) ease;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
            }

            .timed-popup-close:hover {
                color: var(--color-text);
                background-color: rgba(255, 255, 255, 0.05);
            }

            .timed-popup-body {
                padding: 10px 0;
            }

            .timed-popup-body p {
                font-size: 1.1rem;
                margin-bottom: 15px;
            }

            .timed-popup-body p strong {
                color: #FF8C00;
                font-weight: 700;
                font-size: 1.2rem;
                text-shadow: 0 0 2px rgba(255, 165, 0, 0.3);
                animation: glow-text 2s infinite alternate;
            }

            @keyframes glow-text {
                0% { text-shadow: 0 0 2px rgba(255, 165, 0, 0.3); }
                100% { text-shadow: 0 0 6px rgba(255, 165, 0, 0.6); }
            }

            .timed-popup-body .timed-form {
                background-color: transparent;
                padding: 0;
                box-shadow: none;
                margin-top: 20px;
            }

            .timed-popup-buttons {
                display: flex;
                justify-content: center;
            }

            .timed-submit-btn {
                background: linear-gradient(145deg, #FF8C00, #FFA500);
                color: #000;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                padding: 15px 28px;
                box-shadow: 0 4px 15px rgba(255, 165, 0, 0.4);
                position: relative;
                overflow: hidden;
                transition: all 0.3s ease;
            }

            .timed-submit-btn:hover {
                background: linear-gradient(145deg, #FFD700, #FF8C00);
                transform: translateY(-3px);
                box-shadow: 0 6px 18px rgba(255, 165, 0, 0.5);
            }

            .timed-submit-btn::after {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: rgba(255, 255, 255, 0.1);
                transform: rotate(30deg);
                opacity: 0;
                transition: transform 0.5s ease, opacity 0.5s ease;
            }

            .timed-submit-btn:hover::after {
                opacity: 1;
                transform: rotate(30deg) translate(10%, 10%);
            }

            @media (max-width: 768px) {
                .timed-popup-content {
                    padding: 20px 15px;
                    max-width: 90%;
                }

                .timed-popup-header h3 {
                    font-size: 1.3rem;
                }

                .timed-popup-body p {
                    font-size: 1rem;
                }
            }
        `;

        document.head.appendChild(popupStyles);
    }
});


/**
 * Функционал всплывающего окна для кейсов
 */
document.addEventListener('DOMContentLoaded', function() {
    // Создаем HTML для всплывающего окна, если его еще нет
    if (!document.querySelector('.cases-popup')) {
        createCasesPopup();
    }

    // Получаем элементы всплывающего окна
    const casesPopup = document.querySelector('.cases-popup');
    if (!casesPopup) return;

    const casesPopupTitle = document.querySelector('.cases-popup-title');
    const casesPopupDescription = document.querySelector('.cases-popup-description');
    const casesPopupClose = document.querySelector('.cases-popup-close');
    const casesPopupOverlay = document.querySelector('.cases-popup-overlay');

    // Обработчики для кнопок "Подробнее" в кейсах
    const detailButtons = document.querySelectorAll('.case-card .btn-text');

    detailButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            // Получаем родительскую карточку кейса
            const caseCard = this.closest('.case-card');
            const caseTitle = caseCard.querySelector('h3').textContent;

            // Определяем, какой кейс нужно показать
            let caseKey = '';
            if (caseTitle.includes('KV.CAR')) {
                caseKey = 'kv-car';
            } else if (caseTitle.includes('Auto Unit')) {
                caseKey = 'auto-unit';
            }

            // Сюда добавим проверку для нового кейса
            else if (caseTitle.includes('ГК ДК-П')) {
                caseKey = 'dk-p';
            }

            // Если нашли кейс, показываем его детали
            if (caseKey && casesData[caseKey]) {
                const caseData = casesData[caseKey];

                // Обновляем содержимое всплывающего окна
                casesPopupTitle.textContent = caseData.title;
                casesPopupDescription.innerHTML = caseData.fullDescription;

                // Показываем всплывающее окно
                casesPopup.classList.add('active');
                document.body.style.overflow = 'hidden'; // Блокируем прокрутку
            }
        });
    });

    // Обработчики для закрытия всплывающего окна
    if (casesPopupClose) {
        casesPopupClose.addEventListener('click', function() {
            casesPopup.classList.remove('active');
            document.body.style.overflow = ''; // Восстанавливаем прокрутку
        });
    }

    if (casesPopupOverlay) {
        casesPopupOverlay.addEventListener('click', function() {
            casesPopup.classList.remove('active');
            document.body.style.overflow = ''; // Восстанавливаем прокрутку
        });
    }

    // Предотвращаем закрытие при клике на контент
    const popupContent = casesPopup.querySelector('.cases-popup-content');
    if (popupContent) {
        popupContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});

// База данных кейсов
const casesData = {
    'kv-car': {
        title: 'Повышение узнаваемости автосалона KV.CAR',
        shortDescription: 'С автосалоном было заключено партнерство на мероприятии по розыгрышу тюнингованного жигули в хромированном цвете. Клиент получил большой приток подписчиков в свои соц. сети, а также целевых клиентов которые приходят к ним в салон и приносят хорошую прибыль.',
        fullDescription: `
            <p>Автосалон выступил генеральным спонсором в розыгрыше тюнингованого жигули на котором была сделана фирменная ливрея с логотипом KV.CAR и на протяжении всего розыгрыша размещалась как нативная так и прямая реклама салона.</p>
            <div class="cases-popup-gallery">
                <div><img src="kv-car-case-1.jpg" alt="Кейс KV.CAR фото 1" onerror="this.src='data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%22250%22 width%3D%22400%22%3E%3Crect fill%3D%22%23333%22 width%3D%22400%22 height%3D%22250%22%2F%3E%3Ctext fill%3D%22%23999%22 font-family%3D%22Arial%2C sans-serif%22 font-size%3D%2220%22 x%3D%22200%22 y%3D%22125%22 text-anchor%3D%22middle%22%3EФото будет добавлено позже%3C%2Ftext%3E%3C%2Fsvg%3E'"></div>
                <div><img src="kv-car-case-2.jpg" alt="Кейс KV.CAR фото 2" onerror="this.src='data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 height%3D%22250%22 width%3D%22400%22%3E%3Crect fill%3D%22%23333%22 width%3D%22400%22 height%3D%22250%22%2F%3E%3Ctext fill%3D%22%23999%22 font-family%3D%22Arial%2C sans-serif%22 font-size%3D%2220%22 x%3D%22200%22 y%3D%22125%22 text-anchor%3D%22middle%22%3EФото будет добавлено позже%3C%2Ftext%3E%3C%2Fsvg%3E'"></div>
            </div>
        `
    },
    'auto-unit': {
        title: 'Создание коллаборации с Auto Unit и блогером Tupik Family',
        shortDescription: 'Заключили договор на запись совместного видео с интересным и необычным контентом, в котором будет наглядно представлен товар рекламодателя и его преимущества.',
        fullDescription: `
            <p>Эксклюзивный ролик, который снят совместно с блогером и клиентом. В ролике будет установка противоугонной системы клиента на автомобиль блогера, после чего будут проводиться различные эксперименты на надежность защитной системы, тем самым показывая ее качество и создавая хорошее шоу.</p>
            <div class="video-placeholder">
                <p>Ссылка на видео будет добавлена после публикации</p>
            </div>
        `
    },

    'dk-p': {
        title: 'Упаковка компании ГК ДК-П!',
        shortDescription: 'Собственник ГК ДК-П обратился к нам с задачей по созданию нового сайта и других маркетинговых материалов для его компании, акцентируя внимание на имидже и представительности.',
        fullDescription: `
        <p>ГК ДК-П занимается построением и улучшением отделов продаж, и сайт для них — это лицо компании. Поэтому было крайне важно сделать его качественно и современно.</p>
        <p>Мы с радостью взялись за эту работу, и наша команда программистов успешно реализовала все пожелания клиента!</p>
        <p>🌐 Ознакомьтесь с результатом: <a href="https://dk-p.ru/" target="_blank">dk-p.ru</a></p>
    `
    }
};

// Функция для создания HTML всплывающего окна для кейсов
function createCasesPopup() {
    const popupHTML = `
        <div class="cases-popup">
            <div class="cases-popup-overlay"></div>
            <div class="cases-popup-content">
                <div class="cases-popup-header">
                    <h3 class="cases-popup-title">Детали кейса</h3>
                    <button class="cases-popup-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="cases-popup-body">
                    <div class="cases-popup-description"></div>
                    <div class="cases-popup-gallery"></div>
                </div>
            </div>
        </div>
    `;

    // Добавляем HTML в конец body
    document.body.insertAdjacentHTML('beforeend', popupHTML);

    // Добавляем стили для всплывающего окна
    const popupStyles = document.createElement('style');
    popupStyles.textContent = `
        /* Стили для всплывающего окна кейсов */
        .cases-popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2050;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity var(--transition-speed) ease, visibility var(--transition-speed) ease;
        }

        .cases-popup.active {
            opacity: 1;
            visibility: visible;
        }

        .cases-popup-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(18, 16, 14, 0.9);
            backdrop-filter: blur(5px);
            z-index: 1;
        }

        .cases-popup-content {
            position: relative;
            background-color: var(--color-card);
            border-radius: var(--border-radius);
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            padding: 30px;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
            transform: translateY(20px);
            transition: transform var(--transition-speed) ease;
            z-index: 2;
            overflow-y: auto;
        }

        .cases-popup.active .cases-popup-content {
            transform: translateY(0);
        }

        .cases-popup-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .cases-popup-title {
            margin-bottom: 0;
            font-size: 1.8rem;
            color: var(--color-highlight);
        }

        .cases-popup-close {
            background: none;
            border: none;
            color: var(--color-text-secondary);
            font-size: 1.25rem;
            cursor: pointer;
            transition: color var(--transition-speed) ease;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }

        .cases-popup-close:hover {
            color: var(--color-text);
            background-color: rgba(255, 255, 255, 0.1);
        }

        .cases-popup-body {
            color: var(--color-text-secondary);
        }

        .cases-popup-description {
            margin-bottom: 30px;
            line-height: 1.6;
            font-size: 1.1rem;
        }

        .cases-popup-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }

        .cases-popup-gallery img {
            width: 100%;
            height: auto;
            border-radius: var(--border-radius);
            transition: transform 0.3s ease;
        }

        .cases-popup-gallery img:hover {
            transform: scale(1.02);
        }

        .video-container {
            position: relative;
            padding-bottom: 56.25%; /* 16:9 соотношение сторон */
            height: 0;
            width: 100%;
            margin: 30px 0;
        }

        .video-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: var(--border-radius);
            border: none;
        }

        .video-placeholder {
            width: 100%;
            padding: 30px;
            background-color: rgba(255, 255, 255, 0.05);
            border-radius: var(--border-radius);
            text-align: center;
            margin: 30px 0;
        }

        .video-placeholder p {
            margin: 0;
            opacity: 0.8;
        }

        /* Адаптивность для мобильных устройств */
        @media (max-width: 768px) {
            .cases-popup-content {
                padding: 20px 15px;
            }

            .cases-popup-title {
                font-size: 1.4rem;
            }

            .cases-popup-gallery {
                grid-template-columns: 1fr;
            }
        }
    `;

    document.head.appendChild(popupStyles);
}