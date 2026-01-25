// Основной JavaScript для сайта

document.addEventListener('DOMContentLoaded', async function() {
    // 1. Проверяем доступность API
    await checkApiAvailability();
    
    // 2. Если API недоступен, переходим в локальный режим
    if (!window.API_AVAILABLE) {
        console.log('📁 API недоступен, переходим в локальный режим');
        // Инициализируем локальные данные если их нет
        const dataStr = localStorage.getItem('agrivision_db');
        if (!dataStr) {
            const initialData = {
                users: [
                    {
                        id: 1,
                        name: 'Администратор',
                        email: 'admin@agrivision.ru',
                        password: 'AgriVision2024!',
                        phone: '+7 (900) 000-00-00',
                        role: 'admin',
                        registrationDate: new Date().toISOString()
                    }
                ],
                requests: [],
                articles: [],
                analysis: []
            };
            localStorage.setItem('agrivision_db', JSON.stringify(initialData));
        }
    }
    
    // 3. Инициализируем остальные компоненты
    initMobileMenu();
    initModals();
    initTestimonialSlider();
    initRequestHandlers();
    initAdminLogin();
    initLanguageSwitcher();
    initAuthLinks();
    initProfileDropdown();
    initDevelopmentLinks();
    initAuthCheckForAnalysis();

    // 4. Проверяем авторизацию
    checkAuth();
    updateMobileMenu();
});

// Инициализация мобильного меню
function initMobileMenu() {
    const burgerMenu = document.getElementById('burgerMenu');
    const mobileNav = document.getElementById('mobileNav');

    if (burgerMenu && mobileNav) {
        burgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Закрытие меню при клике на ссылку
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                burgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
}

// Инициализация выпадающего меню профиля
function initProfileDropdown() {
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');

    if (profileBtn && profileDropdown) {
        // Обработчик клика по кнопке профиля
        profileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
        });

        // Закрытие dropdown при клике вне
        document.addEventListener('click', function(e) {
            if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('active');
            }
        });

        // Закрытие по нажатию ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && profileDropdown.classList.contains('active')) {
                profileDropdown.classList.remove('active');
            }
        });

        // Обработчики для ссылок в dropdown профиля
        const profileLinks = document.querySelectorAll('.profile-dropdown a');
        profileLinks.forEach(link => {
            if (link.href && link.href.includes('profile.html')) {
                link.addEventListener('click', function(e) {
                    // Разрешаем переход на страницу профиля
                    return true;
                });
            } else if (!link.id || link.id !== 'logoutBtn') {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    showDevelopmentModal();
                    profileDropdown.classList.remove('active');
                });
            }
        });
    }

    // Кнопка выхода
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
    }
}

// Функция выхода пользователя
function logoutUser() {
    localStorage.removeItem('currentUser');
    checkAuth();
    updateMobileMenu();
    showNotification('Вы успешно вышли из системы', 'success');

    // Закрываем dropdown если открыт
    const profileDropdown = document.getElementById('profileDropdown');
    if (profileDropdown) profileDropdown.classList.remove('active');

    // Перезагружаем страницу для обновления состояния
    setTimeout(() => {
        location.reload();
    }, 500);
}

// Инициализация модальных окон
function initModals() {
    // Модальное окно входа
    const loginBtn = document.getElementById('loginBtn');
    const closeLogin = document.getElementById('closeLogin');
    const loginModal = document.getElementById('loginModal');

    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', () => openModal(loginModal));
    }

    if (closeLogin) {
        closeLogin.addEventListener('click', () => closeModal(loginModal));
    }

    // Модальное окно регистрации
    const registerBtn = document.getElementById('registerBtn');
    const closeRegister = document.getElementById('closeRegister');
    const registerModal = document.getElementById('registerModal');

    if (registerBtn && registerModal) {
        registerBtn.addEventListener('click', () => openModal(registerModal));
    }

    if (closeRegister) {
        closeRegister.addEventListener('click', () => closeModal(registerModal));
    }

    // Переключение между модальными окнами входа и регистрации
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');

    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(loginModal);
            setTimeout(() => openModal(registerModal), 300);
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(registerModal);
            setTimeout(() => openModal(loginModal), 300);
        });
    }

    // Обработчики для форм
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
    }

    // Закрытие модальных окон при клике на overlay
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });

    // Обработка модального окна разработки
    const closeDevelopmentModal = document.getElementById('closeDevelopmentModal');
    const closeDevelopmentBtn = document.getElementById('closeDevelopmentBtn');

    if (closeDevelopmentModal) {
        closeDevelopmentModal.addEventListener('click', () => {
            const developmentModal = document.getElementById('developmentModal');
            if (developmentModal) closeModal(developmentModal);
        });
    }

    if (closeDevelopmentBtn) {
        closeDevelopmentBtn.addEventListener('click', () => {
            const developmentModal = document.getElementById('developmentModal');
            if (developmentModal) closeModal(developmentModal);
        });
    }

    // Модальное окно библиотеки
    const libraryModal = document.getElementById('libraryModal');
    const closeLibraryModal = document.getElementById('closeLibraryModal');
    const closeLibraryBtn = document.getElementById('closeLibraryBtn');

    if (closeLibraryModal && libraryModal) {
        closeLibraryModal.addEventListener('click', () => closeModal(libraryModal));
    }

    if (closeLibraryBtn && libraryModal) {
        closeLibraryBtn.addEventListener('click', () => closeModal(libraryModal));
    }
}

// Инициализация слайдера отзывов
function initTestimonialSlider() {
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!track || !prevBtn || !nextBtn) return;

    const slides = Array.from(track.children);
    const slideWidth = slides[0].getBoundingClientRect().width;

    let currentIndex = 0;

    // Устанавливаем позиции слайдов
    slides.forEach((slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    });

    // Функция для перемещения к слайду
    const moveToSlide = (index) => {
        track.style.transform = 'translateX(-' + (slideWidth * index) + 'px)';
        currentIndex = index;
    };

    // Кнопка "назад"
    prevBtn.addEventListener('click', () => {
        if (currentIndex === 0) return;
        moveToSlide(currentIndex - 1);
    });

    // Кнопка "вперед"
    nextBtn.addEventListener('click', () => {
        if (currentIndex === slides.length - 1) return;
        moveToSlide(currentIndex + 1);
    });

    // Автоматическое перелистывание
    let slideInterval = setInterval(() => {
        if (currentIndex === slides.length - 1) {
            moveToSlide(0);
        } else {
            moveToSlide(currentIndex + 1);
        }
    }, 5000);

    // Остановка авто-перелистывания при наведении
    track.addEventListener('mouseenter', () => clearInterval(slideInterval));
    track.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            if (currentIndex === slides.length - 1) {
                moveToSlide(0);
            } else {
                moveToSlide(currentIndex + 1);
            }
        }, 5000);
    });
}

// Инициализация обработчиков заявки
function initRequestHandlers() {
    const heroRequestBtn = document.getElementById('heroRequestBtn');
    const techRequestBtn = document.getElementById('techRequestBtn');
    const navRequestLinks = document.querySelectorAll('a[href="#request"]');
    const closeRequestModal = document.getElementById('closeRequestModal');
    const cancelRequestForm = document.getElementById('cancelRequestForm');
    const requestModal = document.getElementById('requestModal');
    const requestForm = document.getElementById('requestForm');

    // Открытие модального окна заявки
    const openRequestModal = () => openModal(requestModal);

    if (heroRequestBtn) heroRequestBtn.addEventListener('click', openRequestModal);
    if (techRequestBtn) techRequestBtn.addEventListener('click', openRequestModal);

    // Навигационные ссылки "Заявка" в хедере
    navRequestLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openRequestModal();

            // Закрытие мобильного меню если открыто
            const burgerMenu = document.getElementById('burgerMenu');
            const mobileNav = document.getElementById('mobileNav');
            if (burgerMenu && mobileNav && mobileNav.classList.contains('active')) {
                burgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Закрытие модального окна заявки
    if (closeRequestModal) {
        closeRequestModal.addEventListener('click', () => closeModal(requestModal));
    }

    if (cancelRequestForm) {
        cancelRequestForm.addEventListener('click', () => closeModal(requestModal));
    }

    // Обработка отправки формы заявки
    if (requestForm) {
        requestForm.addEventListener('submit', handleRequestSubmit);
    }
}

// Инициализация админ-логина
function initAdminLogin() {
    const adminAccessBtn = document.getElementById('adminAccessBtn');
    const adminLoginModal = document.getElementById('adminLoginModal');
    const closeAdminLogin = document.getElementById('closeAdminLogin');
    const cancelAdminLogin = document.getElementById('cancelAdminLogin');
    const adminLoginForm = document.getElementById('adminLoginForm');

    if (adminAccessBtn && adminLoginModal) {
        adminAccessBtn.addEventListener('click', () => openModal(adminLoginModal));
    }

    if (closeAdminLogin) {
        closeAdminLogin.addEventListener('click', () => closeModal(adminLoginModal));
    }

    if (cancelAdminLogin) {
        cancelAdminLogin.addEventListener('click', () => closeModal(adminLoginModal));
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLoginSubmit);
    }
}

// Инициализация переключателя языка
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');

    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');

            // Убираем активный класс у всех кнопок
            langButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');

            // Устанавливаем язык
            setLanguage(lang);
        });
    });
}

// Инициализация ссылок для мобильной авторизации
function initAuthLinks() {
    // Мобильные кнопки входа
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const mobileRegisterBtn = document.getElementById('mobileRegisterBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');

    if (mobileLoginBtn && loginModal) {
        mobileLoginBtn.addEventListener('click', function() {
            openModal(loginModal);
            // Закрываем мобильное меню
            const burgerMenu = document.getElementById('burgerMenu');
            const mobileNav = document.getElementById('mobileNav');
            if (burgerMenu && mobileNav) {
                burgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    if (mobileRegisterBtn && registerModal) {
        mobileRegisterBtn.addEventListener('click', function() {
            openModal(registerModal);
            // Закрываем мобильное меню
            const burgerMenu = document.getElementById('burgerMenu');
            const mobileNav = document.getElementById('mobileNav');
            if (burgerMenu && mobileNav) {
                burgerMenu.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Мобильная кнопка выхода
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', function() {
            logoutUser();
        });
    }

    // Мобильные ссылки на библиотеку
    const mobileLibraryLinks = document.querySelectorAll('.mobile-nav a[href="#library"]');
    mobileLibraryLinks.forEach(link => {
        if (!link.id) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showLibraryModal();

                // Закрываем мобильное меню
                const burgerMenu = document.getElementById('burgerMenu');
                const mobileNav = document.getElementById('mobileNav');
                if (burgerMenu && mobileNav) {
                    burgerMenu.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        }
    });
}

// Инициализация ссылок на разделы в разработке
function initDevelopmentLinks() {
    // Обработчик для ссылок на библиотеку
    const libraryLinks = document.querySelectorAll('a[href="#library"]');
    libraryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showLibraryModal();
        });
    });

    // Кнопки в секциях
    const whyBtn = document.querySelector('.why-btn');
    if (whyBtn) {
        whyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showDevelopmentModal();
        });
    }

    // Социальные иконки
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            showDevelopmentModal();
        });
    });

    // Кнопки в результатах анализа
    const saveReportBtn = document.querySelector('[data-key="save-report"]');
    const shareBtn = document.querySelector('[data-key="share"]');

    if (saveReportBtn) {
        saveReportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showDevelopmentModal();
        });
    }

    if (shareBtn) {
        shareBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showDevelopmentModal();
        });
    }
}

// Функция показа модального окна разработки
function showDevelopmentModal() {
    const modal = document.getElementById('developmentModal');
    if (modal) {
        openModal(modal);
    }
}

// Функция показа модального окна библиотеки
function showLibraryModal() {
    const modal = document.getElementById('libraryModal');
    if (modal) {
        openModal(modal);
    }
}

// Проверка авторизации для анализа
function initAuthCheckForAnalysis() {
    // Кнопки анализа на главной странице
    const analysisButtons = document.querySelectorAll('a[href="analysis.html"]');

    analysisButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                e.preventDefault();
                showQuickAuthNotification();
                setTimeout(() => openModal(document.getElementById('loginModal')), 500);
            }
        });
    });
}

// Функция показа быстрого уведомления об авторизации
function showQuickAuthNotification() {
    const quickNotification = document.createElement('div');
    quickNotification.className = 'quick-notification';
    quickNotification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 12px 18px;
        border-radius: 8px;
        box-shadow: var(--shadow);
        z-index: 9999;
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 1.5s forwards;
        font-weight: 600;
        max-width: 280px;
        font-size: 14px;
    `;
    quickNotification.innerHTML = `
        <i class="fas fa-user-circle" style="margin-right: 8px;"></i>
        <span>Зарегистрируйтесь или войдите для анализа</span>
    `;
    document.body.appendChild(quickNotification);

    // Добавляем стили для анимации
    if (!document.getElementById('quick-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'quick-notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; transform: translateX(100%); }
            }
        `;
        document.head.appendChild(style);
    }

    // Удаляем уведомление через 2 секунды
    setTimeout(() => {
        if (quickNotification.parentNode) {
            quickNotification.remove();
        }
    }, 2000);
}

// Функции для работы с модальными окнами
function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Обработчики форм
// В script.js ЗАМЕНИ эти функции:

function handleLoginSubmit(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Простая валидация
    if (!email || !password) {
        showNotification('Пожалуйста, заполните все поля', 'error');
        return;
    }

    // Показываем загрузку
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Вход...';
    submitBtn.disabled = true;

    // Используем нашу универсальную функцию loginUser из auth.js
    loginUser(email, password).then(result => {
        if (result.success) {
            showNotification('Вход выполнен успешно!', 'success');
            closeModal(document.getElementById('loginModal'));
            checkAuth();
            updateMobileMenu();

            // Перезагружаем страницу для обновления состояния
            setTimeout(() => {
                location.reload();
            }, 500);
        } else {
            showNotification(result.message, 'error');
        }
    }).catch(error => {
        showNotification('Ошибка входа: ' + error.message, 'error');
    }).finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// В функции handleRequestSubmit обновите данные для отправки:
function handleRequestSubmit(e) {
    e.preventDefault();

    const area = document.getElementById('requestArea').value;
    const address = document.getElementById('requestAddress').value;
    const culture = document.getElementById('requestCulture').value;
    const date = document.getElementById('requestDate').value;
    const phone = document.getElementById('requestPhone').value;
    const description = document.getElementById('requestDescription')?.value || '';

    // Простая валидация
    if (!area || !address || !culture || !date || !phone) {
        showNotification('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }

    // Получаем текущего пользователя
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Подготавливаем данные согласно схеме API
    const requestData = {
        phone: phone,
        local: address, // "local" = адрес/локация
        plants_description: description || `Культура: ${culture}, Площадь: ${area}`,
        area: area,
        culture: culture,
        date: date
    };

    // Если API доступен, отправляем через него
    if (api.isAvailable) {
        api.createServiceRequest(requestData)
            .then(result => {
                showNotification('Заявка успешно отправлена через API!', 'success');
                closeModal(document.getElementById('requestModal'));
                document.getElementById('requestForm').reset();
            })
            .catch(error => {
                console.error('Ошибка отправки заявки через API:', error);
                saveRequestToLocalStorage(requestData, currentUser);
            });
    } else {
        // Сохраняем в localStorage
        saveRequestToLocalStorage(requestData, currentUser);
    }
}

function saveRequestToLocalStorage(requestData, currentUser) {
    const data = getAllData();
    const newId = data.requests.length > 0
        ? Math.max(...data.requests.map(r => r.id)) + 1
        : 1;

    const newRequest = {
        id: newId,
        userId: currentUser ? currentUser.id : null,
        phone: requestData.phone,
        address: requestData.local,
        description: requestData.plants_description,
        area: requestData.area,
        culture: requestData.culture,
        date: requestData.date,
        status: 'pending', // Согласно схеме: pending, approaching, completed
        createdAt: new Date().toISOString()
    };

    data.requests.push(newRequest);
    saveData(data);

    // Закрываем модальное окно
    closeModal(document.getElementById('requestModal'));

    // Показываем уведомление
    showNotification('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');

    // Очищаем форму
    document.getElementById('requestForm').reset();
}

function handleRegisterSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;

    if (!name || !email || !password) {
        showNotification('Пожалуйста, заполните обязательные поля', 'error');
        return;
    }

    // Проверяем, существует ли пользователь
    const data = getAllData();
    const existingUser = data.users.find(user => user.email === email);

    if (existingUser) {
        showNotification('Пользователь с таким email уже существует', 'error');
        return;
    }

    const newId = data.users.length > 0
        ? Math.max(...data.users.map(u => u.id)) + 1
        : 1;

    const newUser = {
        id: newId,
        name,
        email,
        phone,
        password,
        role: 'user',
        registrationDate: new Date().toISOString()
    };

    data.users.push(newUser);
    saveData(data);

    // Автоматический вход после регистрации
    localStorage.setItem('currentUser', JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
    }));

    showNotification('Регистрация прошла успешно!', 'success');
    closeModal(document.getElementById('registerModal'));
    checkAuth();
    updateMobileMenu();

    // Перезагружаем страницу для обновления состояния
    setTimeout(() => {
        location.reload();
    }, 500);
}

function handleRequestSubmit(e) {
    e.preventDefault();

    const area = document.getElementById('requestArea').value;
    const address = document.getElementById('requestAddress').value;
    const culture = document.getElementById('requestCulture').value;
    const date = document.getElementById('requestDate').value;
    const phone = document.getElementById('requestPhone').value;

    // Простая валидация
    if (!area || !address || !culture || !date || !phone) {
        showNotification('Пожалуйста, заполните все поля', 'error');
        return;
    }

    // Получаем текущего пользователя
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Сохраняем заявку
    const data = getAllData();
    const newId = data.requests.length > 0
        ? Math.max(...data.requests.map(r => r.id)) + 1
        : 1;

    const newRequest = {
        id: newId,
        userId: currentUser ? currentUser.id : null,
        area,
        address,
        culture,
        date,
        phone,
        status: 'new',
        createdAt: new Date().toISOString()
    };

    data.requests.push(newRequest);
    saveData(data);

    // Закрываем модальное окно
    closeModal(document.getElementById('requestModal'));

    // Показываем уведомление
    showNotification('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');

    // Очищаем форму
    document.getElementById('requestForm').reset();
}

function handleAdminLoginSubmit(e) {
    e.preventDefault();

    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    // Проверяем демо доступ
    if (email === 'admin@agrivision.ru' && password === 'AgriVision2024!') {
        // Сохраняем админа в localStorage
        localStorage.setItem('currentUser', JSON.stringify({
            id: 0,
            name: 'Администратор',
            email: email,
            role: 'admin'
        }));

        showNotification('Вход в админ-панель выполнен успешно!', 'success');
        closeModal(document.getElementById('adminLoginModal'));
        checkAuth();
        updateMobileMenu();

        // Перенаправляем на админ-панель
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);

        return;
    }

    // Проверяем данные в localStorage
    const data = getAllData();
    const admin = data.users.find(u => u.email === email && u.password === password && u.role === 'admin');

    if (admin) {
        // Сохраняем пользователя в localStorage
        localStorage.setItem('currentUser', JSON.stringify({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        }));

        showNotification('Вход в админ-панель выполнен успешно!', 'success');
        closeModal(document.getElementById('adminLoginModal'));
        checkAuth();
        updateMobileMenu();

        // Перенаправляем на админ-панель
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
    } else {
        showNotification('Неверные данные администратора', 'error');
    }
}

// Функция для входа в админку (добавьте после handleAdminLoginSubmit)
async function handleAdminLoginSubmit(e) {
    e.preventDefault();

    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    // Показываем загрузку
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Вход...';
    submitBtn.disabled = true;

    try {
        // Пробуем войти через API
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Ошибка входа');
        }

        const data = await response.json();
        
        // Ключевое изменение: сохраняем ОДИНАКОВЫЕ данные
        localStorage.setItem('adminToken', data.access_token);
        localStorage.setItem('currentUser', JSON.stringify({
            id: data.user_id,
            email: email,
            role: 'admin', // Явно указываем роль admin
            name: data.name || email.split('@')[0],
            access_token: data.access_token // Сохраняем токен тоже
        }));

        showNotification('Вход в админ-панель выполнен успешно!', 'success');
        closeModal(document.getElementById('adminLoginModal'));
        
        // Перезагружаем страницу для применения изменений
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);

    } catch (error) {
        // Если API недоступен, пробуем локальный вход
        console.log('API недоступен, пробую локальный вход:', error.message);
        
        const localData = JSON.parse(localStorage.getItem('agrivision_db')) || {
            users: [{
                id: 1,
                name: "Администратор",
                email: "admin@agrivision.ru",
                password: "AgriVision2024!",
                role: "admin"
            }]
        };

        const admin = localData.users.find(u => 
            u.email === email && 
            u.password === password && 
            u.role === 'admin'
        );

        if (admin) {
            // Сохраняем данные как для API
            localStorage.setItem('currentUser', JSON.stringify({
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                access_token: 'demo-token-' + Date.now()
            }));

            showNotification('Вход в админ-панель выполнен успешно!', 'success');
            closeModal(document.getElementById('adminLoginModal'));
            
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1000);
        } else {
            showNotification('Неверные данные администратора', 'error');
        }
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Получить все данные
function getAllData() {
    const data = localStorage.getItem('agrivision_db');
    if (!data) {
        // Создаем начальную структуру данных
        const initialData = {
            users: [
                {
                    id: 1,
                    name: 'Администратор',
                    email: 'admin@agrivision.ru',
                    password: 'AgriVision2024!',
                    phone: '+7 (900) 000-00-00',
                    role: 'admin',
                    registrationDate: new Date().toISOString()
                }
            ],
            requests: [],
            analysis: []
        };
        localStorage.setItem('agrivision_db', JSON.stringify(initialData));
        return initialData;
    }
    return JSON.parse(data);
}

// Добавить после функции getAllData() в script.js:
function saveAnalysisResult(analysisData) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    const data = getAllData();

    if (!data.analysis) {
        data.analysis = [];
    }

    const newId = data.analysis.length > 0
        ? Math.max(...data.analysis.map(a => a.id)) + 1
        : 1;

    const newAnalysis = {
        id: newId,
        userId: currentUser.id,
        plantType: analysisData.plantType,
        diagnosis: analysisData.diagnosis,
        cause: analysisData.cause,
        recommendation: analysisData.recommendation,
        confidence: analysisData.confidence,
        date: new Date().toISOString(),
        status: 'completed'
    };

    data.analysis.push(newAnalysis);
    saveData(data);

    // Создаем уведомление о завершении анализа
    const notification = {
        id: Date.now() + Math.random(),
        userId: currentUser.id,
        type: 'success',
        title: 'Анализ завершен',
        message: `Анализ растения "${analysisData.plantType}" успешно завершен. Результаты готовы.`,
        isRead: false,
        createdAt: new Date().toISOString(),
        relatedId: newId
    };

    if (!data.notifications) {
        data.notifications = [];
    }

    data.notifications.push(notification);
    saveData(data);
}

// Сохранить данные
function saveData(data) {
    localStorage.setItem('agrivision_db', JSON.stringify(data));
}

// Функция показа уведомления
function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type} active`;

    setTimeout(() => {
        notification.classList.remove('active');
    }, duration);
}

// Проверка авторизации
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authButtons = document.getElementById('authButtons');
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');

    if (currentUser) {
        // Пользователь авторизован
        if (authButtons) authButtons.style.display = 'none';
        if (userProfile) {
            userProfile.style.display = 'flex';
            if (userName) userName.textContent = currentUser.name;
        }
    } else {
        // Пользователь не авторизован
        if (authButtons) authButtons.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
    }
}

// Обновление мобильного меню
function updateMobileMenu() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const mobileAuth = document.getElementById('mobileAuth');
    const mobileProfile = document.getElementById('mobileProfile');
    const mobileUserName = document.getElementById('mobileUserName');

    if (mobileAuth && mobileProfile) {
        if (currentUser) {
            // Пользователь авторизован - показываем профиль
            mobileAuth.style.display = 'none';
            mobileProfile.style.display = 'block';
            if (mobileUserName) mobileUserName.textContent = currentUser.name;
        } else {
            // Пользователь не авторизован - показываем кнопки входа
            mobileAuth.style.display = 'flex';
            mobileProfile.style.display = 'none';
        }
    }
}