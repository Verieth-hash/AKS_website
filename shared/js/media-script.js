/**
 * AKS-Media | Реклама у блогеров
 * Скрипт для страницы AKS-Media
 */

document.addEventListener('DOMContentLoaded', function() {
    // Основные элементы интерфейса
    const elements = {
        header: document.querySelector('.header'),
        mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
        mobileMenu: document.querySelector('.mobile-menu'),
        navLinks: document.querySelectorAll('.mobile-nav-list a'),
        faqItems: document.querySelectorAll('#faq .faq-item'),
        sliderArrows: document.querySelectorAll('.slider-arrow'),
        contactForm: document.getElementById('contactForm'),
        popupContactForm: document.getElementById('popupContactForm'),
        successMessage: document.querySelector('.success-message'),
        closeSuccessBtn: document.querySelector('.close-success'),
        scrollProgressBar: document.querySelector('.scroll-progress-bar'),
        contactPopup: document.querySelector('.contact-popup'),
        contactPopupTriggers: document.querySelectorAll('.contact-popup-trigger'),
        contactPopupClose: document.querySelector('.contact-popup-close'),
        contactPopupOverlay: document.querySelector('.contact-popup-overlay'),
        bloggerDetailsButtons: document.querySelectorAll('.blogger-details-btn'),
        viewStatisticsButtons: document.querySelectorAll('.view-statistics'),
        statisticsPopup: document.querySelector('.statistics-popup'),
        statisticsPopupClose: document.querySelector('.statistics-popup-close'),
        statisticsPopupOverlay: document.querySelector('.statistics-popup-overlay'),
        bloggerDetailPopup: document.querySelector('.blogger-detail-popup'),
        bloggerDetailPopupClose: document.querySelector('.blogger-detail-popup-close'),
        bloggerDetailPopupOverlay: document.querySelector('.blogger-detail-popup-overlay')
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
    initBloggerDetails();
    initStatisticsPopup();
    initBloggerDetailPopup(); // Новый метод для инициализации всплывающего окна с детальной информацией

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
        const contactForms = [elements.contactForm, elements.popupContactForm].filter(form => form !== null);

        if (contactForms.length === 0) return;

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
                        TITLE: 'Заявка с сайта AKS-Media от ' + formDataObj.name,
                        NAME: formDataObj.name,
                        PHONE: [{ VALUE: formDataObj.phone, VALUE_TYPE: 'WORK' }],
                        EMAIL: [{ VALUE: formDataObj.email, VALUE_TYPE: 'WORK' }],
                        COMMENTS: formDataObj.message || 'Заявка с сайта AKS-Media'
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
        const animatedElements = document.querySelectorAll('.service-card, .about-content, .case-card, .faq-item, .service-list-item, .blogger-card');

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
    // ДЕТАЛИ БЛОГЕРОВ И СТАТИСТИКА
    // =======================================
    function initBloggerDetails() {
        if (!elements.bloggerDetailsButtons.length) return;

        elements.bloggerDetailsButtons.forEach(button => {
            button.addEventListener('click', function() {
                const bloggerCard = this.closest('.blogger-card');
                const detailsSection = bloggerCard.querySelector('.blogger-details');

                if (detailsSection) {
                    if (detailsSection.classList.contains('active')) {
                        detailsSection.classList.remove('active');
                        this.textContent = 'Подробнее';
                    } else {
                        detailsSection.classList.add('active');
                        this.textContent = 'Скрыть';
                    }
                }
            });
        });
    }

    function initStatisticsPopup() {
        if (!elements.statisticsPopup || !elements.viewStatisticsButtons.length) return;

        // Данные статистики для разных блогеров
        const statisticsData = {
            'Саня Чётодел': ['stats-sanya-1.jpg', 'stats-sanya-2.jpg', 'stats-sanya-3.jpg'],
            'FP Driving': ['stats-fp-1.jpg', 'stats-fp-2.jpg'],
            'Технолог': ['stats-technolog-1.jpg', 'stats-technolog-2.jpg', 'stats-technolog-3.jpg']
        };

        // Обработчик для кнопок просмотра статистики
        elements.viewStatisticsButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();

                // Определяем, какого блогера статистику открываем
                const bloggerCard = this.closest('.blogger-card');
                const bloggerName = bloggerCard.querySelector('.blogger-header h3').textContent.trim();

                // Находим ключ, наиболее подходящий для названия блогера
                let bloggerKey = Object.keys(statisticsData).find(key => bloggerName.includes(key));

                // Если не нашли точное совпадение, используем первый ключ (для примера)
                if (!bloggerKey) {
                    bloggerKey = Object.keys(statisticsData)[0];
                }

                const statsImages = statisticsData[bloggerKey] || [];

                // Устанавливаем заголовок
                const titleElement = document.querySelector('.statistics-title');
                if (titleElement) {
                    titleElement.textContent = `Статистика канала ${bloggerName}`;
                }

                // Заполняем контейнер изображениями
                const imagesContainer = document.querySelector('.statistics-images');
                if (imagesContainer) {
                    imagesContainer.innerHTML = '';

                    if (statsImages.length > 0) {
                        statsImages.forEach(imgSrc => {
                            const img = document.createElement('img');
                            img.src = imgSrc;
                            img.alt = `Статистика ${bloggerName}`;
                            img.onerror = function() {
                                this.src = 'https://via.placeholder.com/800x600?text=Статистика+будет+добавлена+позже';
                            };
                            imagesContainer.appendChild(img);
                        });
                    } else {
                        // Если нет данных, показываем заглушку
                        const placeholder = document.createElement('div');
                        placeholder.classList.add('statistics-placeholder');
                        placeholder.innerHTML = `
                            <p>Статистика канала ${bloggerName} будет добавлена в ближайшее время.</p>
                            <p>Пожалуйста, свяжитесь с нами для получения актуальных данных.</p>
                        `;
                        imagesContainer.appendChild(placeholder);
                    }
                }

                // Открываем попап
                elements.statisticsPopup.classList.add('active');
                document.body.style.overflow = 'hidden'; // Блокируем прокрутку
            });
        });

        // Закрытие попапа при клике на крестик
        if (elements.statisticsPopupClose) {
            elements.statisticsPopupClose.addEventListener('click', function() {
                elements.statisticsPopup.classList.remove('active');
                document.body.style.overflow = ''; // Восстанавливаем прокрутку
            });
        }

        // Закрытие попапа при клике вне контента
        if (elements.statisticsPopupOverlay) {
            elements.statisticsPopupOverlay.addEventListener('click', function() {
                elements.statisticsPopup.classList.remove('active');
                document.body.style.overflow = ''; // Восстанавливаем прокрутку
            });
        }

        // Предотвращаем закрытие при клике на контент
        const popupContent = elements.statisticsPopup.querySelector('.statistics-popup-content');
        if (popupContent) {
            popupContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }

    // =======================================
    // ИНИЦИАЛИЗАЦИЯ ВСПЛЫВАЮЩЕГО ОКНА С ДЕТАЛЬНОЙ ИНФОРМАЦИЕЙ О БЛОГЕРАХ
    // =======================================
    function initBloggerDetailPopup() {
        // Если элемент всплывающего окна не найден, выходим из функции
        if (!elements.bloggerDetailPopup || !elements.bloggerDetailsButtons.length) return;

        // Данные о блогерах
        const bloggersData = {
            'Tupik Family': {
                name: 'Tupik Family',
                avatar: 'tupik_family.png',
                tags: ['Лайфстайл', 'Авто'],
                stats: {
                    engagement: '12,5%',
                    followers: '131 000',
                    storyViews: '40 000',
                    avgLikes: '5 000',
                    ctr: '3%',
                    cpv: '1,6₽'
                },
                description: `<p>Антон, автор канала, это не просто популярный блогер, а человек, глубоко вовлеченный в автомобильную культуру региона.
                            Его проекты и мероприятия, оформленные в уличном стиле, давно стали узнаваемыми среди автолюбителей,
                            но при этом проходят в полностью легальном и безопасном формате.
                            Благодаря этому он завоевал репутацию надежного организатора, чьему мнению доверяют как подписчики, так и владельцы бизнеса.</p>
                            <h3>Почему сотрудничество с TupikFamily — это выгодное вложение?</h3>
                            <ol>
                                <li>
                                    <h4>Живая и лояльная аудитория</h4>
                                    <p>140 000 подписчиков в Instagram, а также активные подписчики в ВКонтакте (4 500) и Telegram (3 000+).</p>
                                </li>
                                <li>
                                    <h4>Высокий уровень доверия</h4>
                                    <p>Многие предприниматели а так же просто автолюбители знают Антона лично, его рекомендации ценятся и работают.</p>
                                </li>
                                <li>
                                    <h4>Правильно направленная реклама</h4>
                                    <p>Аудитория блогера состоит из активных автолюбителей, которые являются вашей целевой аудиторией.</p>
                                </li>
                                <li>
                                    <h4>Интеграция в реальные события</h4>
                                    <p>Рекламные размещения не выглядят как обычная реклама, а гармонично вписываются в контент Антона, вызывая максимальный отклик у зрителей.</p>
                                </li>
                            </ol>`,
                reach: [
                    { image: 'tupik-story1.jpg', count: '69,553' },
                    { image: 'tupik-story2.jpg', count: '68,982' },
                    { image: 'tupik-story3.jpg', count: '55,909' },
                    { image: 'tupik-story4.jpg', count: '53,872' },
                    { image: 'tupik-story5.jpg', count: '61,058' },
                    { image: 'tupik-story6.jpg', count: '47,456' }
                ],
                socials: [
                    {
                        name: 'Instagram',
                        icon: 'fab fa-instagram',
                        url: 'instagram.com/tupik_family',
                        followers: '160,000',
                        engagement: '1.5%'
                    },
                    {
                        name: 'Telegram',
                        icon: 'fab fa-telegram',
                        url: 't.me/tupicfamilychanel',
                        followers: '1,200',
                        engagement: '5.2%'
                    },
                    {
                        name: 'YouTube',
                        icon: 'fab fa-youtube',
                        url: 'youtube.com/@tupikfamilyekb',
                        followers: '1,000',
                        engagement: '8.7%'
                    },
                    {
                        name: 'ВКонтакте',
                        icon: 'fab fa-vk',
                        url: 'vk.com/tupik_family_original',
                        followers: '4,500',
                        engagement: '3.4%'
                    }
                ]
            },
            'Саня Чётодел': {
                name: 'Саня Чётодел - Ural Custom',
                avatar: 'sanya_chetodel.png',
                tags: ['Мото', 'Кастом'],
                stats: {
                    engagement: '4%',
                    followers: '227 000',
                    storyViews: '50 000',
                    avgLikes: '2 200',
                    ctr: '2,5%',
                    cpv: '1,3₽'
                },
                description: `<p>СаняЧётодел — это полноценный медиа-проект для всех, кто живёт мото-культурой.
                            Кастом-проекты, честные обзоры запчастей, советы по уходу за техникой и реальные истории из гаража —
                            всё это делает контент максимально полезным и интересным для мото-сообщества.
                            Благодаря своему профессиональному опыту и собственному мото-сервису,
                            Александр получил доверие аудитории и прочно закрепился в нише как эксперт,
                            к чьему мнению прислушиваются.</p>
                            <h3>Почему сотрудничество с СаняЧётодел — выгодное вложение?</h3>
                            <ol>
                                <li>
                                    <h4>Живая и вовлечённая аудитория</h4>
                                    <p>Подтверждено реальными цифрами: см. приложенные скриншоты статистики аккаунтов.
                                    Сообщество подписчиков — это активные мотоциклисты, кастомайзеры и владельцы техники,
                                    которые не только следят за контентом, но и регулярно обращаются за советами и услугами.</p>
                                </li>
                                <li>
                                    <h4>Высокий уровень доверия</h4>
                                    <p>Александр — не просто блогер, а эксперт с огромным опытом.
                                    За его плечами — десятки реализованных кастом-проектов, а его собственный мото-сервис
                                    давно стал точкой притяжения для мотоэнтузиастов.
                                    Подписчики доверяют его рекомендациям, потому что знают:
                                    каждую запчасть, каждый бренд и каждое решение он проверяет на своём опыте
                                    в реальной работе с техникой.</p>
                                </li>
                                <li>
                                    <h4>Прямая целевая аудитория</h4>
                                    <p>100% подписчиков — это ваша целевая аудитория.
                                    Владельцы мотоциклов, кастомайзеры, любители тюнинга и мото-соревнований —
                                    все они следят за Александром и доверяют его рекомендациям.</p>
                                </li>
                                <li>
                                    <h4>Нативные интеграции, которые работают</h4>
                                    <p>Рекламные интеграции не воспринимаются как навязчивая реклама —
                                    это полезный и органичный контент, который аудитория смотрит с интересом.
                                    За счёт этого уровень вовлеченности и отклика — максимальный.</p>
                                </li>
                            </ol>`,
                reach: [
                    { image: 'sanya-story1.jpg', count: '15,872' },
                    { image: 'sanya-story2.jpg', count: '16,054' },
                    { image: 'sanya-story3.jpg', count: '14,456' }
                ],
                socials: [
                    {
                        name: 'Telegram',
                        icon: 'fab fa-telegram',
                        url: 't.me/Ural_Custom',
                        followers: '4,000',
                        engagement: '7.2%'
                    },
                    {
                        name: 'YouTube',
                        icon: 'fab fa-youtube',
                        url: 'youtube.com/@chetodelsanya',
                        followers: '225,000',
                        engagement: '4.1%'
                    },
                    {
                        name: 'ВКонтакте',
                        icon: 'fab fa-vk',
                        url: 'vk.com/chetodel',
                        followers: '4,500',
                        engagement: '3.9%'
                    }
                ]
            },
            'FP Driving': {
                name: 'FP Driving',
                avatar: 'fp_driving.png',
                tags: ['Авто', 'Тест-драйвы'],
                stats: {
                    engagement: '3,3%',
                    followers: '499 000',
                    storyViews: '150 000',
                    avgLikes: '5 000',
                    ctr: '1,5%',
                    cpv: '1.8₽'
                },
                description: `<p>FP Driving это ютуб канал с образцовой статистикой, более 5 млн просмотров и 470 тыс. подписчиков.
                            Харитон, автор канала, записывает автообзоры — которые создают ощущение реального вождения.
                            Он снимает тест-драйвы от первого лица, чтобы вы почувствовали машину, будто сами за рулём.
                            За счет этого его канал любят и активно смотрят по всей России и даже за границей.
                            Рекордный ролик на его канале набрал уже более 10 млн. просмотров.</p>
                            <h3>Преимущества сотрудничества с FP Driving:</h3>
                            <ul>
                                <li>
                                    <h4>Уникальный формат контента</h4>
                                    <p>Тест-драйвы от первого лица создают эффект присутствия, что значительно повышает вовлеченность аудитории в контент.</p>
                                </li>
                                <li>
                                    <h4>Широкий охват аудитории</h4>
                                    <p>Канал собирает зрителей со всей России и даже из других стран. Это дает вашему бренду возможность выйти на новые рынки.</p>
                                </li>
                                <li>
                                    <h4>Высокая конверсия</h4>
                                    <p>Рекламные интеграции гармонично вписываются в контент канала, благодаря чему не вызывают отторжения у зрителей и дают высокую конверсию.</p>
                                </li>
                            </ul>`,
                reach: [
                    { image: 'fp-story1.jpg', count: '42,382' },
                    { image: 'fp-story2.jpg', count: '39,658' },
                    { image: 'fp-story3.jpg', count: '41,267' }
                ],
                socials: [
                    {
                        name: 'YouTube',
                        icon: 'fab fa-youtube',
                        url: 'youtube.com/channel/FPDriving',
                        followers: '470,000',
                        engagement: '6.2%'
                    },
                    {
                        name: 'Telegram',
                        icon: 'fab fa-telegram',
                        url: 't.me/fp_driving			',
                        followers: '600',
                        engagement: '5.3%'
                    },
                    {
                        name: 'ВКонтакте',
                        icon: 'fab fa-vk',
                        url: 'vk.com/fp_driving',
                        followers: '800',
                        engagement: '3.8%'
                    },
                    {
                        name: 'Дзен',
                        icon: 'fab fa-yandex',
                        url: 'https://dzen.ru/id/62220fb5b136fc79c09c1cf3?share_to=link',
                        followers: '6,000',
                        engagement: '4.2%'
                    },
                    {
                        name: 'Рутуб',
                        icon: 'fab fa-youtube',
                        url: 'https://rutube.ru/channel/23901749/',
                        followers: '6,000',
                        engagement: '4.2%'
                    }
                ]
            },
            'Технолог': {
                name: 'Технолог',
                avatar: 'technolog.png',
                tags: ['Авто', 'DIY'],
                stats: {
                    engagement: '2,85%',
                    followers: '276 000',
                    storyViews: '35 000',
                    avgLikes: '1 000',
                    ctr: '1,8%',
                    cpv: '1,3₽'
                },
                description: `<p>Канал "Технолог" — это не просто канал про тачки, а полноценная медиа-платформа,
                            объединяющая автоэнтузиастов. Здесь есть всё: тест-драйвы, путешествия, обзоры,
                            кастом и ремонт своими руками. Контент живой, понятный, без лишнего официоза
                            но с экспертностью и реальным опытом.</p>
                            <h3>Что предлагает "Технолог" для рекламы?</h3>
                            <ul>
                                <li>
                                    <p><strong>Размещение нативной рекламы</strong> — интеграции в формате реальных обзоров,
                                    лайфхаков и тест-драйвов.</p>
                                </li>
                                <li>
                                    <p><strong>Доступ к активной авто-аудитории</strong> — люди, которые реально интересуются машинами,
                                    их покупкой, ремонтом и тюнингом.</p>
                                </li>
                                <li>
                                    <p><strong>Разные форматы рекламы</strong> — от полноценного видеообзора до коротких шортсов
                                    и интеграций в соцсетях.</p>
                                </li>
                                <li>
                                    <p><strong>Гибкость</strong> — возможны заказные обзоры, тесты продукции и даже поездки на производство.</p>
                                </li>
                            </ul>`,
                reach: [
                    { image: 'tech-story1.jpg', count: '26,783' },
                    { image: 'tech-story2.jpg', count: '24,159' },
                    { image: 'tech-story3.jpg', count: '25,426' }
                ],
                socials: [
                    {
                        name: 'YouTube (Риал)',
                        icon: 'fab fa-youtube',
                        url: 'youtube.com/@technolog_auto',
                        followers: '273,000',
                        engagement: '5.3%'
                    },
                    {
                        name: 'YouTube (Шортс)',
                        icon: 'fab fa-youtube',
                        url: 'youtube.com/@technolog_shorts',
                        followers: '26,500',
                        engagement: '6.8%'
                    },
                    {
                        name: 'YouTube (Путешествия)',
                        icon: 'fab fa-youtube',
                        url: 'youtube.com/@technolog_real',
                        followers: '6,000',
                        engagement: '4.2%'
                    },
                    {
                        name: 'ВКонтакте',
                        icon: 'fab fa-vk',
                        url: 'vk.com/te4nolog',
                        followers: '7,000',
                        engagement: '3.8%'
                    }
                ]
            },
            'Never Stop': {
                name: 'Never Stop',
                avatar: 'never_stop.png',
                tags: ['Авто', 'Тюнинг'],
                stats: {
                    engagement: '4%',
                    followers: '146 000',
                    storyViews: '30 000',
                    avgLikes: '1 200',
                    ctr: '1.7%',
                    cpv: '2.1₽'
                },
                description: `<p>Never Stop Auto — автомобили без границ! Главное достижение Never Stop Auto —
                            это создание уникального авто-контента, который заряжает энергией и вдохновляет людей на новые проекты.
                            Канал собрал мощное комьюнити, объединяя любителей машин, тюнинга и драйва.
                            Автор канала - Андрей Барсуков, сам отлично разбирается в тюнинге и множество проектов реализовал своими руками.
                            За счет чего он не просто популярный блогер а человек который знает свое дело и которому можно доверять.</p>
                            <p>Канал особо известен по проекту с Seat Ibiza 1.9 TDI которая даже участвовала в гонке с Hellcat Булкина</p>
                            <p><a href="https://www.youtube.com/watch?v=FkQ8Zo74ArQ" target="_blank">Смотреть видео</a></p>
                            <p>Андрей имеет очень хорошую репутация среди автолюбителей и особенно среди любителей тюнинга.
                            Он постоянно общается в чате со своей аудиторией где они обсуждают различные тюнинг решения
                            и в целом все что связано с автомобилями. По этому реклама на канале Never Stop даст вам реальную узнаваемость
                            и репутацию среди автолюбителей, к словам Андрея прислушиваются и его рекомендация это не пустое слово.</p>`,
                reach: [
                    { image: 'never-story1.jpg', count: '33,412' },
                    { image: 'never-story2.jpg', count: '31,856' },
                    { image: 'never-story3.jpg', count: '32,743' }
                ],
                socials: [
                    {
                        name: 'YouTube',
                        icon: 'fab fa-youtube',
                        url: 'youtube.com/@NeverStopAuto',
                        followers: '145,000',
                        engagement: '4.2%'
                    },
                    {
                        name: 'Telegram',
                        icon: 'fab fa-telegram',
                        url: 'youtube.com/@NeverStopAuto',
                        followers: '200',
                        engagement: '4.2%'
                    },
                    {
                        name: 'Telegram',
                        icon: 'fab fa-telegram',
                        url: 'youtube.com/@NeverStopAuto',
                        followers: '1,500',
                        engagement: '4.2%'
                    },
                    {
                        name: 'Вконтакте',
                        icon: 'fab fa-vk',
                        url: 'youtube.com/@NeverStopAuto',
                        followers: '5,600',
                        engagement: '4.2%'
                    },
                ]
            }
        };

        // Переопределяем поведение кнопок "Подробнее"
        elements.bloggerDetailsButtons.forEach(button => {
            // Удаляем старый обработчик события
            const oldButton = button.cloneNode(true);
            button.parentNode.replaceChild(oldButton, button);

            // Добавляем новый обработчик события
            oldButton.addEventListener('click', function(e) {
                e.preventDefault();

                // Определяем, какого блогера детали открываем
                const bloggerCard = this.closest('.blogger-card');
                const bloggerName = bloggerCard.querySelector('.blogger-header h3').textContent.trim();

                // Находим ключ, наиболее подходящий для названия блогера
                let bloggerKey = '';

                for (const key in bloggersData) {
                    if (bloggerName.includes(key)) {
                        bloggerKey = key;
                        break;
                    }
                }

                // Если не нашли точное совпадение, используем первый ключ (для примера)
                if (!bloggerKey && Object.keys(bloggersData).length > 0) {
                    bloggerKey = Object.keys(bloggersData)[0];
                }

                // Если нашли данные о блогере, заполняем и показываем всплывающее окно
                if (bloggerKey && bloggersData[bloggerKey]) {
                    openBloggerDetailPopup(bloggersData[bloggerKey]);
                } else {
                    // Если нет данных, используем текст из карточки блогера
                    const fallbackData = createFallbackData(bloggerCard);
                    openBloggerDetailPopup(fallbackData);
                }
            });
        });

        // Закрытие попапа при клике на крестик
        if (elements.bloggerDetailPopupClose) {
            elements.bloggerDetailPopupClose.addEventListener('click', function() {
                closeBloggerDetailPopup();
            });
        }

        // Закрытие попапа при клике вне контента
        if (elements.bloggerDetailPopupOverlay) {
            elements.bloggerDetailPopupOverlay.addEventListener('click', function() {
                closeBloggerDetailPopup();
            });
        }

        // Предотвращаем закрытие при клике на контент
        const popupContent = elements.bloggerDetailPopup.querySelector('.blogger-detail-popup-content');
        if (popupContent) {
            popupContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }

        // Функция для создания запасных данных из карточки блогера
        function createFallbackData(bloggerCard) {
            const bloggerName = bloggerCard.querySelector('.blogger-header h3').textContent.trim();
            const bloggerImage = bloggerCard.querySelector('.blogger-image img');
            const bloggerDescription = bloggerCard.querySelector('.blogger-description p');
            const bloggerDetails = bloggerCard.querySelector('.blogger-details');

            // Определяем теги блогера по классам карточки
            const tags = [];
            if (bloggerCard.classList.contains('auto') || bloggerName.toLowerCase().includes('авто')) {
                tags.push('Авто');
            }
            if (bloggerCard.classList.contains('moto') || bloggerName.toLowerCase().includes('мото')) {
                tags.push('Мото');
            }
            if (bloggerCard.classList.contains('lifestyle') || bloggerName.toLowerCase().includes('лайф')) {
                tags.push('Лайфстайл');
            }
            if (bloggerCard.classList.contains('travel') || bloggerName.toLowerCase().includes('путеш')) {
                tags.push('Путешествия');
            }

            // Если не определили никаких тегов, добавляем стандартные
            if (tags.length === 0) {
                tags.push('Лайфстайл', 'Авто');
            }

            // Собираем социальные сети
            const socials = [];
            const socialItems = bloggerCard.querySelectorAll('.social-item');
            socialItems.forEach(item => {
                const icon = item.querySelector('i');
                const link = item.querySelector('a');

                if (icon && link) {
                    let name = 'Соцсеть';
                    let iconClass = icon.className;

                    if (icon.classList.contains('fa-instagram')) {
                        name = 'Instagram';
                    } else if (icon.classList.contains('fa-telegram')) {
                        name = 'Telegram';
                    } else if (icon.classList.contains('fa-youtube')) {
                        name = 'YouTube';
                    } else if (icon.classList.contains('fa-vk')) {
                        name = 'ВКонтакте';
                    }

                    socials.push({
                        name: name,
                        icon: iconClass,
                        url: link.getAttribute('href'),
                        followers: 'Не указано',
                        engagement: 'Не указано'
                    });
                }
            });

            // Составляем описание из текста карточки блогера
            let description = '';

            if (bloggerDescription) {
                description += `<p>${bloggerDescription.textContent}</p>`;
            }

            if (bloggerDetails) {
                description += bloggerDetails.innerHTML;
            }

            return {
                name: bloggerName,
                avatar: bloggerImage ? bloggerImage.getAttribute('src') : 'https://via.placeholder.com/300?text=Фото+блогера',
                tags: tags,
                stats: {
                    engagement: 'N/A',
                    followers: 'N/A',
                    storyViews: 'N/A',
                    avgLikes: 'N/A',
                    ctr: 'N/A',
                    cpv: 'N/A'
                },
                description: description || '<p>Подробная информация о блогере появится в ближайшее время.</p>',
                reach: [
                    { image: 'https://via.placeholder.com/180x320?text=Сторис', count: 'N/A' },
                    { image: 'https://via.placeholder.com/180x320?text=Сторис', count: 'N/A' },
                    { image: 'https://via.placeholder.com/180x320?text=Сторис', count: 'N/A' }
                ],
                socials: socials.length > 0 ? socials : [
                    {
                        name: 'Соцсеть',
                        icon: 'fas fa-globe',
                        url: '#',
                        followers: 'Не указано',
                        engagement: 'Не указано'
                    }
                ]
            };
        }

        // Функция для открытия всплывающего окна с деталями блогера
        function openBloggerDetailPopup(bloggerData) {
            // Заполняем верхнюю часть с информацией о блогере
            const avatar = document.querySelector('.blogger-detail-avatar');
            const name = document.querySelector('.blogger-detail-name');
            const tagsContainer = document.querySelector('.blogger-tags');

            if (avatar) avatar.src = bloggerData.avatar;
            if (name) name.textContent = bloggerData.name;

            if (tagsContainer) {
                tagsContainer.innerHTML = '';
                bloggerData.tags.forEach(tag => {
                    const tagClass = tag.toLowerCase() === 'лайфстайл' ? 'lifestyle' :
                    tag.toLowerCase() === 'путешествия' ? 'travel' :
                    tag.toLowerCase() === 'авто' ? 'auto' :
                    tag.toLowerCase() === 'мото' ? 'moto' :
                    tag.toLowerCase();

                    const tagElement = document.createElement('span');
                    tagElement.className = `tag ${tagClass}`;
                    tagElement.textContent = tag;
                    tagsContainer.appendChild(tagElement);
                });
            }

            // Заполняем статистику
            document.querySelector('.engagement-value').textContent = bloggerData.stats.engagement;
            document.querySelector('.followers-value').textContent = bloggerData.stats.followers;
            document.querySelector('.story-views-value').textContent = bloggerData.stats.storyViews;
            document.querySelector('.avg-likes-value').textContent = bloggerData.stats.avgLikes;
            document.querySelector('.ctr-value').textContent = bloggerData.stats.ctr;
            document.querySelector('.cpv-value').textContent = bloggerData.stats.cpv;

            // Заполняем описание
            const description = document.querySelector('.blogger-detail-description');
            if (description) {
                description.innerHTML = bloggerData.description;
            }

            // Заполняем галерею охватов
            const reachGallery = document.querySelector('.reach-gallery');
            if (reachGallery) {
                reachGallery.innerHTML = '';

                bloggerData.reach.forEach(item => {
                    const reachItem = document.createElement('div');
                    reachItem.className = 'reach-item';

                    const image = document.createElement('img');
                    image.src = item.image;
                    image.alt = 'Сторис охват';
                    image.onerror = function() {
                        this.src = 'https://via.placeholder.com/180x320?text=Сторис';
                    };

                    const count = document.createElement('div');
                    count.className = 'reach-count';
                    count.textContent = item.count;

                    reachItem.appendChild(image);
                    reachItem.appendChild(count);
                    reachGallery.appendChild(reachItem);
                });
            }

            // Заполняем социальные сети
            const socialsContainer = document.querySelector('.blogger-socials-detailed');
            if (socialsContainer) {
                socialsContainer.innerHTML = '';

                bloggerData.socials.forEach(social => {
                    const socialItem = document.createElement('div');
                    socialItem.className = 'blogger-social-detailed';

                    const header = document.createElement('h4');
                    header.innerHTML = `<i class="${social.icon}"></i> ${social.name}`;

                    const url = document.createElement('p');
                    const href = social.url.startsWith('http') ? social.url : `https://${social.url}`;
                    url.innerHTML = `<a href="${href}" target="_blank">${social.url}</a>`;

                    const stats = document.createElement('div');
                    stats.className = 'social-stats';

                    const followersStat = document.createElement('div');
                    followersStat.className = 'social-stat';
                    followersStat.innerHTML = `
                        <span class="social-stat-label">Подписчиков:</span>
                        <span class="social-stat-value">${social.followers}</span>
                    `;

                    const engagementStat = document.createElement('div');
                    engagementStat.className = 'social-stat';
                    engagementStat.innerHTML = `
                        <span class="social-stat-label">Вовлеченность:</span>
                        <span class="social-stat-value">${social.engagement}</span>
                    `;

                    stats.appendChild(followersStat);
                    stats.appendChild(engagementStat);

                    socialItem.appendChild(header);
                    socialItem.appendChild(url);
                    socialItem.appendChild(stats);

                    socialsContainer.appendChild(socialItem);
                });
            }

            // Показываем всплывающее окно
            elements.bloggerDetailPopup.classList.add('active');
            document.body.style.overflow = 'hidden'; // Блокируем прокрутку основной страницы
        }

        // Функция для закрытия всплывающего окна с деталями блогера
        function closeBloggerDetailPopup() {
            elements.bloggerDetailPopup.classList.remove('active');
            document.body.style.overflow = ''; // Восстанавливаем прокрутку
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
    if (casesPopup) {
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

                if (caseTitle.includes('Rimzona')) {
                    caseKey = 'rimzona';
                } else if (caseTitle.includes('Т-Банк')) {
                    caseKey = 't-bank';
                } else if (caseTitle.includes('KV.CAR')) {
                    caseKey = 'kv-car';
                } else if (caseTitle.includes('Auto Unit')) {
                    caseKey = 'auto-unit';
                } else if (caseTitle.includes('Ice Lounge')) {
                    caseKey = 'ice-lounge';
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
    }
});

// =======================================
// БАЗА ДАННЫХ КЕЙСОВ
// =======================================
const casesData = {
    'rimzona': {
        title: 'Rimzona - Организация автомероприятия',
        shortDescription: 'Компания Rimzona выступила спонсором и участником организованного нами крупного автомероприятия на 2000+ человек.',
        fullDescription: `
            <p>Компания Rimzona выступила основным спонсором масштабного автомероприятия, которое собрало более 2000 автолюбителей региона.</p>
            <p>В рамках мероприятия был организован:</p>
            <ul>
                <li>Выставочный стенд Rimzona с презентацией новой продукции</li>
                <li>Конкурс для посетителей с розыгрышем ценных призов от бренда</li>
                <li>Фото-зона с брендированием Rimzona</li>
                <li>Интеграция продукции в шоу-программу мероприятия</li>
            </ul>
            <p><strong>Результаты:</strong></p>
            <ul>
                <li>Значительное повышение узнаваемости бренда среди целевой аудитории</li>
                <li>Увеличение подписчиков социальных сетей на 34%</li>
                <li>Рост продаж в месяц проведения мероприятия на 27%</li>
                <li>Формирование долгосрочных партнерских отношений с ключевыми автоблогерами</li>
            </ul>
            <div class="cases-popup-gallery">
                <div><img src="rimzona-case-1.jpg" alt="Rimzona на мероприятии" onerror="this.src='https://via.placeholder.com/400x250?text=Фото+будет+добавлено+позже'"></div>
                <div><img src="rimzona-case-2.jpg" alt="Стенд Rimzona" onerror="this.src='https://via.placeholder.com/400x250?text=Фото+будет+добавлено+позже'"></div>
            </div>
        `
    },
    't-bank': {
        title: 'Т-Банк - Интеграция с каналом FP Driving',
        shortDescription: 'Размещение рекламной интеграции на канале FP Driving. Интеграция была направлена на повышение узнаваемости бренда и привлечения новых клиентов.',
        fullDescription: `
            <p>Для Т-Банка была разработана нативная рекламная интеграция в формате тест-драйва на популярном автомобильном канале FP Driving.</p>
            <p>Особенности проекта:</p>
            <ul>
                <li>Органичная интеграция рекламного сообщения в контент канала</li>
                <li>Демонстрация преимуществ банковских услуг для автолюбителей</li>
                <li>Создание специального промо-кода для отслеживания эффективности рекламы</li>
                <li>Упоминание банка в описании к видео и пинned-комментарии</li>
            </ul>
            <p><strong>Результаты:</strong></p>
            <ul>
                <li>Видео собрало более 260 000 просмотров и продолжает набирать популярность</li>
                <li>CTR по промо-коду составил 4.7%, что в 2.5 раза выше среднего показателя для банковской сферы</li>
                <li>Узнаваемость бренда среди целевой аудитории выросла на 18%</li>
                <li>Получено более 2000 новых клиентов по промо-коду из видео</li>
            </ul>
            <p>Видео с интеграцией:</p>
            <div class="video-container">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/ISKpgFP65RA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        `
    },
    'kv-car': {
        title: 'Повышение узнаваемости автосалона KV.CAR',
        shortDescription: 'С автосалоном было заключено партнерство на мероприятии по розыгрышу тюнингованного жигули в хромированном цвете.',
        fullDescription: `
            <p>Автосалон выступил генеральным спонсором в розыгрыше тюнингованого жигули, на котором была сделана фирменная ливрея с логотипом KV.CAR. На протяжении всего розыгрыша размещалась как нативная, так и прямая реклама салона.</p>
            <p>Ключевые элементы кампании:</p>
            <ul>
                <li>Брендирование автомобиля для розыгрыша с логотипом KV.CAR</li>
                <li>Серия сторис и постов в социальных сетях популярных автоблогеров</li>
                <li>Упоминание автосалона во всех анонсах розыгрыша</li>
                <li>Проведение финального мероприятия на территории автосалона</li>
            </ul>
            <p><strong>Результаты:</strong></p>
            <ul>
                <li>Клиент получил большой приток подписчиков в свои социальные сети (+12 000 за период кампании)</li>
                <li>Значительно выросла узнаваемость бренда на региональном рынке</li>
                <li>Увеличился поток целевых клиентов в салон на 34%</li>
                <li>Рост продаж автомобилей на 22% в течение 2 месяцев после проведения акции</li>
            </ul>
            <div class="cases-popup-gallery">
                <div><img src="kv-car-case-1.jpg" alt="Кейс KV.CAR фото 1" onerror="this.src='https://via.placeholder.com/400x250?text=Фото+будет+добавлено+позже'"></div>
                <div><img src="kv-car-case-2.jpg" alt="Кейс KV.CAR фото 2" onerror="this.src='https://via.placeholder.com/400x250?text=Фото+будет+добавлено+позже'"></div>
            </div>
        `
    },
    'auto-unit': {
        title: 'Создание коллаборации с Auto Unit и блогером Tupik Family',
        shortDescription: 'Заключили договор на запись совместного видео с интересным и необычным контентом, в котором будет наглядно представлен товар рекламодателя и его преимущества.',
        fullDescription: `
            <p>Эксклюзивный ролик, который снят совместно с блогером и клиентом. В ролике будет установка противоугонной системы клиента на автомобиль блогера, после чего будут проводиться различные эксперименты на надежность защитной системы, тем самым показывая ее качество и создавая хорошее шоу.</p>
            <p>Особенности проекта:</p>
            <ul>
                <li>Разработка уникального сценария тестирования продукта</li>
                <li>Привлечение реальных подписчиков к участию в эксперименте</li>
                <li>Создание серии сторис о процессе съемок</li>
                <li>Дополнительное продвижение видео через рекламу в социальных сетях</li>
            </ul>
            <p><strong>Ожидаемые результаты:</strong></p>
            <ul>
                <li>Минимум 150 000 просмотров основного видео</li>
                <li>Охват не менее 200 000 человек с учетом сторис и дополнительного контента</li>
                <li>Повышение доверия к продукту благодаря наглядной демонстрации его преимуществ</li>
                <li>Увеличение продаж противоугонных систем на 25-30%</li>
            </ul>
            <div class="video-placeholder">
                <p>Ссылка на видео будет добавлена после публикации</p>
            </div>
        `
    },
    'ice-lounge': {
        title: 'Ice Lounge - Продвижение ресторана через рекомендации блогеров',
        shortDescription: 'Обеспечение узнаваемости и постоянного притока клиентов в рестораны за счет рекомендации от топового блогера региона и упоминания на мероприятиях.',
        fullDescription: `
            <p>Для сети ресторанов Ice Lounge была разработана комплексная стратегия продвижения через сотрудничество с региональными инфлюенсерами.</p>
            <p>Компоненты рекламной кампании:</p>
            <ul>
                <li>Серия визитов топовых блогеров с обзорами меню и интерьера</li>
                <li>Организация тематических вечеров с участием инфлюенсеров</li>
                <li>Создание эксклюзивных блюд, названных в честь популярных блогеров</li>
                <li>Проведение мастер-классов по приготовлению коктейлей с прямыми трансляциями</li>
            </ul>
            <p><strong>Результаты:</strong></p>
            <ul>
                <li>Увеличение среднемесячной посещаемости ресторанов на 42%</li>
                <li>Рост количества подписчиков в социальных сетях ресторана в 3 раза</li>
                <li>Повышение среднего чека на 18%</li>
                <li>Формирование лояльного комьюнити вокруг бренда</li>
                <li>Появление очередей в выходные дни и полной предварительной записи на месяц вперед</li>
            </ul>
            <div class="cases-popup-gallery">
                <div><img src="ice-lounge-case-1.jpg" alt="Ice Lounge мероприятие" onerror="this.src='https://via.placeholder.com/400x250?text=Фото+будет+добавлено+позже'"></div>
                <div><img src="ice-lounge-case-2.jpg" alt="Блогеры в Ice Lounge" onerror="this.src='https://via.placeholder.com/400x250?text=Фото+будет+добавлено+позже'"></div>
            </div>
        `
    }
};

// =======================================
// СОЗДАНИЕ ВСПЛЫВАЮЩЕГО ОКНА ДЛЯ КЕЙСОВ
// =======================================
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
}