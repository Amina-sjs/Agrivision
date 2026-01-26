// // auth.js - Авторизация для нового бэкенда

// document.addEventListener('DOMContentLoaded', async function() {
//     console.log('🚀 Инициализация AgriVision');
    
//     // 1. Инициализируем API
//     await initApi();
    
//     // 2. Проверяем авторизацию
//     checkAuth();
    
//     // 3. Обновляем меню
//     updateMobileMenu();
// });

// // Инициализация API
// async function initApi() {
//     console.log('🔍 Проверяем доступность API...');

//     async function registerUser(name, email, phone, password, location) {
//     console.log('📝 Регистрация через API...');
    
//     // ВСЕГДА пытаемся использовать API
//     try {
//         console.log('📝 Отправляем запрос на API...');
        
//         const userData = {
//             name: name,
//             email: email,
//             password: password,
//             phone: phone || null,
//             location: location || null
//         };
        
//         // 1. Регистрируемся через API
//         const result = await api.register(userData);
//         console.log('✅ Регистрация через API успешна:', result);
        
//         // 2. Автоматически логинимся после регистрации
//         const loginResult = await api.login({ email, password });
        
//         if (loginResult.access_token) {
//             // Получаем профиль для сохранения
//             const profile = await api.getProfile();
            
//             // Обновляем UI
//             checkAuth();
//             updateMobileMenu();
//             showNotification(`Регистрация успешна! Добро пожаловать, ${profile.name}!`, 'success');
            
//             // Закрываем модальное окно регистрации
//             closeModal('registerModal');
            
//             return { 
//                 success: true, 
//                 user: profile,
//                 backend: 'api'
//             };
//         }
        
//     } catch (apiError) {
//         console.error('❌ Ошибка регистрации через API:', apiError);
        
//         // Показываем понятную ошибку пользователю
//         let errorMessage = 'Ошибка регистрации';
        
//         if (apiError.message.includes('400')) {
//             errorMessage = 'Пользователь с таким email уже существует';
//         } else if (apiError.message.includes('500')) {
//             errorMessage = 'Ошибка сервера. Попробуйте позже.';
//         } else if (apiError.message.includes('Network')) {
//             errorMessage = 'Нет соединения с сервером. Проверьте подключение.';
//         }
        
//         showNotification(errorMessage, 'error');
//         return { 
//             success: false, 
//             message: errorMessage,
//             backend: 'api'
//         };
//     }
    
//     // try {
//     //     // Используем наш ApiClient
//     //     const isAvailable = await api.checkConnection();
        
        
//     //     if (isAvailable) {
//     //         console.log('✅ API доступен! Используем бэкенд');
            
//     //         // Проверяем сохраненный токен
//     //         const token = Storage.getToken();
//     //         if (token) {
//     //             try {
//     //                 // Проверяем валидность токена
//     //                 const profile = await api.getProfile();
//     //                 console.log('✅ Токен валидный, пользователь:', profile.email);
                    
//     //                 // Сохраняем в совместимом формате
//     //                 Storage.setUser(profile);
                    
//     //             } catch (error) {
//     //                 console.log('❌ Токен невалидный, удаляем');
//     //                 Storage.clear();
//     //             }
//     //         }
//     //     } else {
//     //         // Если API недоступен, переходим в локальный режим
//     //         console.log('📁 API недоступен, перехожу в локальный режим');
//     //         initLocalStorageData();
//     //     }
        
//     // } catch (error) {
//     //     console.log('❌ Ошибка инициализации API:', error.message);
//     //     console.log('📁 Перехожу в локальный режим');
//     //     initLocalStorageData();
//     // }
// }

// function initLocalStorageData() {
//     const dataStr = localStorage.getItem('agrivision_db');
    
//     if (!dataStr) {
//         console.log('📝 Создаю начальные данные в localStorage...');
        
//         const initialData = {
//             users: [
//                 {
//                     id: 1,
//                     name: 'Администратор',
//                     email: 'admin@agrivision.ru',
//                     password: 'AgriVision2024!',
//                     phone: '+7 (900) 000-00-00',
//                     role: 'admin',
//                     registrationDate: new Date().toISOString()
//                 },
//                 {
//                     id: 2,
//                     name: 'Тестовый пользователь',
//                     email: 'test@test.com',
//                     password: '123456',
//                     phone: '+7 (999) 123-45-67',
//                     role: 'user',
//                     registrationDate: new Date().toISOString()
//                 }
//             ],
//             requests: [],
//             articles: [
//                 {
//                     id: 1,
//                     title: "Как определить болезнь растений по листьям",
//                     content: "Полное содержание статьи о болезнях растений...",
//                     description: "Узнайте, как по внешним признакам определить заболевания сельскохозяйственных культур",
//                     image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
//                     category: "diseases",
//                     date: new Date().toLocaleDateString('ru-RU'),
//                     createdAt: new Date().toISOString(),
//                     author: "Администратор",
//                     views: 0,
//                     isPublished: true
//                 }
//             ],
//             analysis: []
//         };
        
//         localStorage.setItem('agrivision_db', JSON.stringify(initialData));
//         console.log('✅ Начальные данные созданы');
//     }
// }

// // Универсальная функция входа
// async function loginUser(email, password) {
//     console.log('🔐 Попытка входа...');
    
//     if (api.isAvailable) {
//         try {
//             console.log('🔐 Пробуем вход через API...');
            
//             const result = await api.login({ email, password });
            
//             if (result.access_token) {
//                 console.log('✅ Вход через API успешен');
                
//                 // Получаем профиль
//                 const profile = await api.getProfile();
                
//                 // Обновляем UI
//                 checkAuth();
//                 updateMobileMenu();
//                 showNotification(`Добро пожаловать, ${profile.name}!`, 'success');
                
//                 return { 
//                     success: true, 
//                     user: profile,
//                     backend: 'api'
//                 };
//             }
//         } catch (apiError) {
//             console.warn('⚠️ Ошибка API входа:', apiError.message);
//             showNotification('Ошибка входа через API: ' + apiError.message, 'error');
//             // Продолжаем с localStorage
//         }
//     }
    
//     // Если API недоступен или произошла ошибка, используем localStorage
//     console.log('📁 Используем localStorage для входа');
//     const data = getAllData();
//     const user = data.users.find(u => u.email === email && u.password === password);

//     if (user) {
//         localStorage.setItem('currentUser', JSON.stringify({
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             role: user.role
//         }));

//         checkAuth();
//         updateMobileMenu();
//         showNotification(`Добро пожаловать, ${user.name}!`, 'success');
//         return { 
//             success: true, 
//             user: user,
//             backend: 'local'
//         };
//     } else {
//         showNotification('Неверный email или пароль', 'error');
//         return { 
//             success: false, 
//             message: 'Неверный email или пароль',
//             backend: 'local'
//         };
//     }
// }

// // Универсальная функция регистрации
// // async function registerUser(name, email, phone, password, location) {
// //     console.log('📝 Попытка регистрации...');
    
// //     if (api.isAvailable) {
// //         try {
// //             console.log('📝 Пробуем регистрацию через API...');
            
// //             const userData = {
// //                 name: name,
// //                 email: email,
// //                 password: password,
// //                 phone: phone || null,
// //                 location: location || null
// //             };
            
// //             const result = await api.register(userData);
// //             console.log('✅ Регистрация через API успешна');
            
// //             // После регистрации автоматически логинимся
// //             const loginResult = await loginUser(email, password);
            
// //             return loginResult;
            
// //         } catch (apiError) {
// //             console.warn('⚠️ Ошибка API регистрации:', apiError.message);
// //             showNotification('Ошибка регистрации через API: ' + apiError.message, 'error');
// //             // Продолжаем с localStorage
// //         }
// //     }
    
// //     // Если API недоступен, используем localStorage
// //     console.log('📁 Используем localStorage для регистрации');
// //     const data = getAllData();

// //     // Проверка на существующего пользователя
// //     const existingUser = data.users.find(user => user.email === email);
// //     if (existingUser) {
// //         showNotification('Пользователь с таким email уже существует', 'error');
// //         return { 
// //             success: false, 
// //             message: "Пользователь с таким email уже существует",
// //             backend: 'local'
// //         };
// //     }

// //     const newId = data.users.length > 0
// //         ? Math.max(...data.users.map(u => u.id)) + 1
// //         : 1;

// //     const newUser = {
// //         id: newId,
// //         name,
// //         email,
// //         phone,
// //         password,
// //         location: location || '',
// //         role: 'user',
// //         registrationDate: new Date().toISOString()
// //     };

// //     data.users.push(newUser);
// //     saveData(data);

// //     // Автоматический вход после регистрации
// //     const loginResult = await loginUser(email, password);
    
// //     if (loginResult.success) {
// //         showNotification(`Регистрация успешна! Добро пожаловать, ${name}!`, 'success');
// //     }

// //     return loginResult;
// // }


// async function registerUser(name, email, phone, password, location) {
//     console.log('📝 ПРИНУДИТЕЛЬНАЯ попытка регистрации через API...');
    
//     const userData = {
//         name: name,
//         email: email,
//         password: password,
//         phone: phone,
//         location: location,
//     };

//     try {
//         const result = await api.register(userData);
//         console.log('✅ Бэкенд ответил успехом:', result);
//         return await loginUser(email, password);
//     } catch (apiError) {
//         console.error('❌ Ошибка БЭКЕНДА:', apiError.message);
//         showNotification('Ошибка: ' + apiError.message, 'error');
//         throw apiError; // Не даем коду уйти в localStorage
//     }
// }
// // Остальные функции (checkAuth, updateMobileMenu и т.д.) остаются без изменений
// // ...
// // ==============================
// // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// // ==============================

// function checkAuth() {
//     const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//     const authButtons = document.getElementById('authButtons');
//     const userProfile = document.getElementById('userProfile');
//     const userName = document.getElementById('userName');

//     if (currentUser) {
//         // Пользователь авторизован
//         if (authButtons) authButtons.style.display = 'none';
//         if (userProfile) {
//             userProfile.style.display = 'flex';
//             if (userName) userName.textContent = currentUser.name;
//         }
//     } else {
//         // Пользователь не авторизован
//         if (authButtons) authButtons.style.display = 'flex';
//         if (userProfile) userProfile.style.display = 'none';
//     }
// }

// function updateMobileMenu() {
//     const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//     const mobileAuth = document.getElementById('mobileAuth');
//     const mobileProfile = document.getElementById('mobileProfile');
//     const mobileUserName = document.getElementById('mobileUserName');

//     if (mobileAuth && mobileProfile) {
//         if (currentUser) {
//             // Пользователь авторизован - показываем профиль
//             mobileAuth.style.display = 'none';
//             mobileProfile.style.display = 'block';
//             if (mobileUserName) mobileUserName.textContent = currentUser.name;
//         } else {
//             // Пользователь не авторизован - показываем кнопки входа
//             mobileAuth.style.display = 'flex';
//             mobileProfile.style.display = 'none';
//         }
//     }
// }

// function showNotification(message, type = 'success', duration = 3000) {
//     const notification = document.getElementById('notification');
//     if (!notification) return;

//     notification.textContent = message;
//     notification.className = `notification ${type} active`;

//     setTimeout(() => {
//         notification.classList.remove('active');
//     }, duration);
// }

// function getAllData() {
//     const dataStr = localStorage.getItem('agrivision_db');
//     if (!dataStr) {
//         const initialData = {
//             users: [
//                 {
//                     id: 1,
//                     name: 'Администратор',
//                     email: 'admin@agrivision.ru',
//                     password: 'AgriVision2024!',
//                     phone: '+7 (900) 000-00-00',
//                     role: 'admin',
//                     registrationDate: new Date().toISOString()
//                 }
//             ],
//             requests: [],
//             analysis: []
//         };
//         localStorage.setItem('agrivision_db', JSON.stringify(initialData));
//         return initialData;
//     }
//     return JSON.parse(dataStr);
// }

// function saveData(data) {
//     localStorage.setItem('agrivision_db', JSON.stringify(data));
// }

/**
 * AgriVision - Модуль авторизации (только API)
 * Реализовано согласно спецификации: /register, /login, /user/<id>
 */

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 AgriVision: Система авторизации инициализирована');
    
    // Проверяем текущее состояние при загрузке
    await syncAuthState();
    
    // Инициализация UI компонентов
    updateUI();
});

/**
 * СИНХРОНИЗАЦИЯ СОСТОЯНИЯ
 * Проверяем, жив ли токен и получаем актуальные данные профиля
 */
async function syncAuthState() {
    const token = localStorage.getItem('access_token'); // Токен всё равно храним для сессии
    
    if (token) {
        try {
            // Согласно скриншоту: GET /user/<id>
            // Если api.getProfile() внутри делает запрос к этому эндпоинту
            const profile = await api.getProfile(); 
            localStorage.setItem('currentUser', JSON.stringify(profile));
            console.log('✅ Сессия подтверждена для:', profile.email);
        } catch (error) {
            console.error('❌ Сессия устарела:', error.message);
            logout();
        }
    }
}

/**
 * РЕГИСТРАЦИЯ (POST /register)
 * Соответствует скриншоту: name, email, password, phone*, location*
 */
async function registerUser(name, email, phone, password, location) {
    console.log('📝 Запуск регистрации через API...');
    
    const userData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        phone: phone ? phone.trim() : null,     // Поле phone* из скриншота
        location: location ? location.trim() : null // Поле location* из скриншота
    };

    try {
        // 1. Отправка данных на бэкенд
        const response = await api.register(userData);
        console.log('✅ Регистрация завершена:', response);

        // 2. После регистрации документация подразумевает вход (POST /login)
        return await loginUser(userData.email, userData.password);

    } catch (error) {
        const errorMsg = parseError(error);
        showNotification(errorMsg, 'error');
        return { success: false, message: errorMsg };
    }
}

/**
 * ВХОД (POST /login)
 * Согласно скриншоту: возвращает access_token
 */
async function loginUser(email, password) {
    console.log('🔐 Авторизация...');

    try {
        const result = await api.login({ 
            email: email.trim().toLowerCase(), 
            password: password 
        });

        if (result && result.access_token) {
            // Сохраняем токен для последующих запросов (Auth: Да)
            localStorage.setItem('access_token', result.access_token);
            
            // Получаем данные профиля (GET /user/<id>)
            const profile = await api.getProfile();
            localStorage.setItem('currentUser', JSON.stringify(profile));

            showNotification(`С возвращением, ${profile.name}!`, 'success');
            updateUI();
            
            if (typeof closeModal === 'function') closeModal('loginModal');
            if (typeof closeModal === 'function') closeModal('registerModal');

            return { success: true, user: profile };
        }
    } catch (error) {
        const errorMsg = parseError(error);
        showNotification(errorMsg, 'error');
        return { success: false, message: errorMsg };
    }
}

/**
 * ОБНОВЛЕНИЕ ПРОФИЛЯ (PATCH /user/<id>)
 */
async function updateProfile(userId, updateData) {
    try {
        const updatedUser = await api.updateUser(userId, updateData);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        updateUI();
        showNotification('Данные успешно обновлены', 'success');
        return { success: true };
    } catch (error) {
        showNotification(parseError(error), 'error');
        return { success: false };
    }
}

/**
 * ВЫХОД ИЗ СИСТЕМЫ
 */
function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    updateUI();
    window.location.reload(); // Сброс состояния приложения
}

/**
 * ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ UI
 */
function updateUI() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const isAuth = !!user;

    // Элементы шапки/меню
    const elements = {
        authBtns: document.getElementById('authButtons'),
        profile: document.getElementById('userProfile'),
        name: document.getElementById('userName'),
        mAuth: document.getElementById('mobileAuth'),
        mProfile: document.getElementById('mobileProfile'),
        mName: document.getElementById('mobileUserName')
    };

    if (elements.authBtns) elements.authBtns.style.display = isAuth ? 'none' : 'flex';
    if (elements.profile) elements.profile.style.display = isAuth ? 'flex' : 'none';
    if (elements.name && user) elements.name.textContent = user.name;

    if (elements.mAuth) elements.mAuth.style.display = isAuth ? 'none' : 'flex';
    if (elements.mProfile) elements.mProfile.style.display = isAuth ? 'block' : 'none';
    if (elements.mName && user) elements.mName.textContent = user.name;
}

function parseError(error) {
    // Профессиональная обработка ответов сервера
    if (error.message.includes('401')) return 'Неверный логин или пароль';
    if (error.message.includes('400')) return 'Ошибка в заполнении полей';
    if (error.message.includes('409')) return 'Этот email уже занят';
    return error.message || 'Ошибка связи с сервером';
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    notification.textContent = message;
    notification.className = `notification ${type} active`;
    setTimeout(() => notification.classList.remove('active'), 3000);
}