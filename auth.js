// Скрипт для авторизации пользователей

document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, авторизован ли пользователь
    checkAuth();

    // Обновляем мобильное меню
    updateMobileMenu();
});

// ==============================
// ИНТЕГРАЦИЯ С БЭКЕНД API
// ==============================

// Проверяем, используем ли мы localStorage или API
let useLocalStorage = true; // Пока используем localStorage
let currentBackend = 'local'; // 'local' или 'api'

// Проверяем доступность API
async function checkApiAvailability() {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
            method: 'GET',
            timeout: 3000
        });
        if (response.ok) {
            console.log('✅ API доступен, переключаемся на бэкенд');
            useLocalStorage = false;
            currentBackend = 'api';
            return true;
        }
    } catch (error) {
        console.log('ℹ️ API недоступен, используем localStorage');
        useLocalStorage = true;
        currentBackend = 'local';
    }
    return false;
}

// Запускаем проверку при загрузке
checkApiAvailability();

// Обновляем функцию loginUser для работы с обоими бэкендами
async function loginUser(email, password) {
    // Сначала пробуем API
    if (!useLocalStorage) {
        try {
            console.log('🔐 Пробуем вход через API...');
            
            const result = await api.login(email, password);
            
            if (result.access_token) {
                // Сохраняем токен
                localStorage.setItem('access_token', result.access_token);
                
                // Получаем профиль через API
                const profile = await api.getProfile();
                
                // Сохраняем в формате совместимости с текущей системой
                const currentUser = {
                    id: profile.id || Date.now(),
                    name: profile.name || email.split('@')[0],
                    email: profile.email || email,
                    role: 'user',
                    phone: profile.phone || '',
                    location: profile.location || ''
                };
                
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // Обновляем UI
                checkAuth();
                updateMobileMenu();
                
                return { 
                    success: true, 
                    user: currentUser,
                    backend: 'api'
                };
            }
        } catch (apiError) {
            console.warn('⚠️ Ошибка API входа:', apiError.message);
            // Продолжаем с localStorage
        }
    }
    
    // Если API недоступен или произошла ошибка, используем localStorage
    console.log('📁 Используем localStorage для входа');
    const data = getAllData();
    const user = data.users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }));

        checkAuth();
        updateMobileMenu();
        return { 
            success: true, 
            user: user,
            backend: 'local'
        };
    } else {
        return { 
            success: false, 
            message: 'Неверный email или пароль',
            backend: 'local'
        };
    }
}

// Обновляем функцию registerUser
async function registerUser(name, email, phone, password) {
    // Сначала пробуем API
    if (!useLocalStorage) {
        try {
            console.log('📝 Пробуем регистрацию через API...');
            
            const userData = {
                name: name,
                email: email,
                phone: phone || null,
                location: null, // Можно добавить поле location в форму
                password: password
            };
            
            const result = await api.register(userData);
            console.log('✅ Регистрация через API успешна:', result);
            
            // После регистрации автоматически логинимся
            const loginResult = await loginUser(email, password);
            
            return { 
                success: true, 
                user: loginResult.user,
                backend: 'api'
            };
            
        } catch (apiError) {
            console.warn('⚠️ Ошибка API регистрации:', apiError.message);
            // Продолжаем с localStorage
        }
    }
    
    // Если API недоступен, используем localStorage
    console.log('📁 Используем localStorage для регистрации');
    const data = getAllData();

    // Проверка на существующего пользователя
    const existingUser = data.users.find(user => user.email === email);
    if (existingUser) {
        return { 
            success: false, 
            message: "Пользователь с таким email уже существует",
            backend: 'local'
        };
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
    loginUser(email, password);

    return { 
        success: true, 
        user: newUser,
        backend: 'local'
    };
}

// Добавляем функцию для проверки токена API
function checkApiToken() {
    const token = Storage.getToken();
    if (token) {
        useLocalStorage = false;
        currentBackend = 'api';
        return true;
    }
    return false;
}

// Проверяем токен при загрузке
if (checkApiToken()) {
    console.log('✅ Найден токен API, используем бэкенд');
}

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

// Функция входа пользователя
function loginUser(email, password) {
    const data = getAllData();
    const user = data.users.find(u => u.email === email && u.password === password);

    if (user) {
        // Сохраняем пользователя в localStorage
        localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }));

        checkAuth();
        updateMobileMenu();
        return { success: true, user: user };
    } else {
        return { success: false, message: 'Неверный email или пароль' };
    }
}

// Функция регистрации пользователя
function registerUser(name, email, phone, password) {
    const data = getAllData();

    // Проверка на существующего пользователя
    const existingUser = data.users.find(user => user.email === email);
    if (existingUser) {
        return { success: false, message: "Пользователь с таким email уже существует" };
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
    loginUser(email, password);

    return { success: true, user: newUser };
}

// Получить все данные
function getAllData() {
    const dataStr = localStorage.getItem('agrivision_db');
    if (!dataStr) {
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
    return JSON.parse(dataStr);
}

// Сохранить данные
function saveData(data) {
    localStorage.setItem('agrivision_db', JSON.stringify(data));
}