// auth.js - Исправленная версия с поддержкой API

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
let useBackendAPI = false;
let apiAvailable = false;

// Проверяем доступность API при загрузке
async function initApiCheck() {
    try {
        const token = localStorage.getItem('access_token');
        if (token) {
            console.log('✅ Найден токен API, используем бэкенд');
            useBackendAPI = true;
            apiAvailable = true;
            return;
        }
        
        // Пробуем получить статьи (публичный endpoint)
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ARTICLES}`, {
            method: 'GET',
            headers: {
                'Accept-Language': 'ru'
            }
        });
        
        if (response.ok) {
            console.log('✅ API доступен');
            apiAvailable = true;
        }
    } catch (error) {
        console.log('📁 API недоступен, используем localStorage');
        apiAvailable = false;
    }
}

// Запускаем проверку при загрузке
initApiCheck();

// ОБНОВЛЕННАЯ ФУНКЦИЯ ВХОДА (единственная!)
async function loginUser(email, password) {
    // Сначала пробуем API если доступен
    if (apiAvailable) {
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

// ОБНОВЛЕННАЯ ФУНКЦИЯ РЕГИСТРАЦИИ (единственная!)
async function registerUser(name, email, phone, password) {
    // Сначала пробуем API если доступен
    if (apiAvailable) {
        try {
            console.log('📝 Пробуем регистрацию через API...');
            
            const userData = {
                name: name,
                email: email,
                phone: phone || null,
                location: null
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

// ==============================
// СТАРЫЕ ФУНКЦИИ (оставляем без изменений)
// ==============================

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

function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type} active`;

    setTimeout(() => {
        notification.classList.remove('active');
    }, duration);
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