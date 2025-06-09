/**
 * АКС | Агентство качественного сервиса
 * JavaScript для страницы "Блогерам"
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Bloggers.js loaded');

    // Основные элементы страницы
    const elements = {
        bloggerContactForm: document.getElementById('bloggerContactForm'),
        closeSuccessBtn: document.querySelector('.close-success'),
        successMessage: document.querySelector('.success-message'),
        scrollProgressBar: document.querySelector('.scroll-progress-bar'),
        faqItems: document.querySelectorAll('#blogger-faq .faq-item'),
        mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
        mobileMenu: document.querySelector('.mobile-menu'),
        navLinks: document.querySelectorAll('.mobile-nav-list a'),
        header: document.querySelector('.header')
    };

    // Инициализация компонентов страницы
    initScrollHandlers();
    initMobileMenu();
    initSmoothScrolling();
    initFaqAccordion();
    initAnimations();
    initBloggerContactForm();

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
        const menuToggle = elements.mobileMenuToggle;
        const mobileMenu = elements.mobileMenu;

        if (!menuToggle || !mobileMenu) {
            console.error('Mobile menu elements not found');
            return;
        }

        // Функция для переключения меню
        menuToggle.addEventListener('click', function() {
            // Переключаем классы
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');

            // Анимация иконки меню
            const spans = menuToggle.querySelectorAll('span');
            if (spans.length === 3) {
                if (mobileMenu.classList.contains('active')) {
                    spans[0].style.transform = 'translateY(9px) rotate(45deg)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'translateY(-9px) rotate(-45deg)';
                } else {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });

        // Закрытие мобильного меню при клике по ссылке
        elements.navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (mobileMenu.classList.contains('active')) {
                    menuToggle.click(); // Используем существующий обработчик для закрытия
                }
            });
        });
    }

    // =======================================
    // ПЛАВНАЯ ПРОКРУТКА К СЕКЦИЯМ
    // =======================================
    function initSmoothScrolling() {
        // Выбираем ТОЛЬКО ссылки, которые начинаются с # (якоря на текущей странице)
        const mobileMenuLinks = document.querySelectorAll('.mobile-nav-list a[href^="#"]');

        if (!mobileMenuLinks.length) return;

        // Обрабатываем только ссылки-якоря для плавной прокрутки
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                // Если это просто #, прокручиваем в самый верх
                if (targetId === '#') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    return;
                }

                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    // Учитываем высоту шапки при прокрутке
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
    // АККОРДЕОН ДЛЯ FAQ НА СТРАНИЦЕ БЛОГЕРОВ
    // =======================================
    function initFaqAccordion() {
        const faqItems = elements.faqItems;

        if (!faqItems || faqItems.length === 0) {
            console.log('FAQ items not found');
            return;
        }

        faqItems.forEach((item) => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const toggleBtn = item.querySelector('.faq-toggle');

            if (!question || !answer) return;

            // Добавляем обработчик на весь блок вопроса
            question.addEventListener('click', function(e) {
                toggleFaqItem(item, answer);
            });

            // Отдельный обработчик для кнопки, если она есть
            if (toggleBtn) {
                toggleBtn.addEventListener('click', function(e) {
                    // Предотвращаем всплытие события, чтобы не сработал обработчик question
                    e.stopPropagation();
                    toggleFaqItem(item, answer);
                });
            }
        });

        // Функция переключения состояния элемента FAQ
        function toggleFaqItem(item, answer) {
            const isActive = item.classList.contains('active');

            // Закрываем все элементы
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) otherAnswer.style.height = '0';

                    // Меняем иконку на плюс
                    const otherToggle = otherItem.querySelector('.faq-toggle i');
                    if (otherToggle) otherToggle.className = 'fas fa-plus';
                }
            });

            // Переключаем текущий элемент
            if (isActive) {
                item.classList.remove('active');
                answer.style.height = '0';

                // Меняем иконку на плюс
                const toggle = item.querySelector('.faq-toggle i');
                if (toggle) toggle.className = 'fas fa-plus';
            } else {
                item.classList.add('active');
                answer.style.height = answer.scrollHeight + 'px';

                // Меняем иконку на минус
                const toggle = item.querySelector('.faq-toggle i');
                if (toggle) toggle.className = 'fas fa-minus';
            }
        }
    }

    // =======================================
    // ОБРАБОТКА ФОРМЫ ДЛЯ БЛОГЕРОВ
    // =======================================
    function initBloggerContactForm() {
        const bloggerContactForm = elements.bloggerContactForm;
        if (!bloggerContactForm) return;

        bloggerContactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Показываем индикатор загрузки
            const submitBtn = bloggerContactForm.querySelector('.submit-btn');
            if (!submitBtn) return;

            submitBtn.classList.add('loading');

            // Собираем данные формы
            const formData = new FormData(bloggerContactForm);
            const formDataObj = {};

            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });

            // Создаем объект данных для Bitrix24 с указанием, что это заявка от блогера
            const bitrixData = {
                fields: {
                    TITLE: 'Заявка от блогера: ' + formDataObj.name,
                    NAME: formDataObj.name,
                    PHONE: [{ VALUE: formDataObj.phone, VALUE_TYPE: "WORK" }],
                    EMAIL: [{ VALUE: formDataObj.email, VALUE_TYPE: "WORK" }],
                    COMMENTS: `Платформа: ${formDataObj.platform}
Ссылка: ${formDataObj.resource}
Подписчиков: ${formDataObj.followers || 'Не указано'}
Сообщение: ${formDataObj.message || 'Не указано'}`
                },
                // Добавляем специальное поле для идентификации формы блогера
                ASSIGNED_BY_ID: 1 // ID директора в Bitrix24
            };

            // Отправляем данные в Bitrix24 CRM для директора
            // Используем отдельный webhook специально для заявок от блогеров
            fetch('https://b24-t9lvb8.bitrix24.ru/rest/1/5bm0ize5q6t53jxe/crm.lead.add.json?FIELDS[TITLE]=&FIELDS[NAME]=&FIELDS[PHONE][0][VALUE]=&FIELDS[EMAIL][0][VALUE]=&FIELDS[COMMENTS]=', {
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
                bloggerContactForm.reset();
            })
                .catch(error => {
                console.error('Error:', error);
                submitBtn.classList.remove('loading');
                showErrorMessage('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
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
    // АНИМАЦИИ ПРИ ПРОКРУТКЕ
    // =======================================
    function initAnimations() {
        const animatedElements = document.querySelectorAll('.service-card, .about-content, .faq-item');

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
    // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
    // =======================================

    // Показать сообщение об успешной отправке
    function showSuccessMessage() {
        if (elements.successMessage) {
            elements.successMessage.classList.add('active');
        }
    }

    // Показать сообщение об ошибке
    function showErrorMessage(message) {
        const formMessage = document.querySelector('#bloggerContactForm .form-message');
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