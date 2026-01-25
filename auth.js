// auth.js - Авторизация для нового бэкенда

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Инициализация AgriVision');
    
    // 1. Инициализируем API
    await initApi();
    
    // 2. Проверяем авторизацию
    checkAuth();
    
    // 3. Обновляем меню
    updateMobileMenu();
});

// Инициализация API
async function initApi() {
    console.log('🔍 Проверяем доступность API...');
    
    try {
        // Используем наш ApiClient
        const isAvailable = await api.checkConnection();
        
        if (isAvailable) {
            console.log('✅ API доступен! Используем бэкенд');
            
            // Проверяем сохраненный токен
            const token = Storage.getToken();
            if (token) {
                try {
                    // Проверяем валидность токена
                    const profile = await api.getProfile();
                    console.log('✅ Токен валидный, пользователь:', profile.email);
                    
                    // Сохраняем в совместимом формате
                    Storage.setUser(profile);
                    
                } catch (error) {
                    console.log('❌ Токен невалидный, удаляем');
                    Storage.clear();
                }
            }
        } else {
            // Если API недоступен, переходим в локальный режим
            console.log('📁 API недоступен, перехожу в локальный режим');
            initLocalStorageData();
        }
        
    } catch (error) {
        console.log('❌ Ошибка инициализации API:', error.message);
        console.log('📁 Перехожу в локальный режим');
        initLocalStorageData();
    }
}

function initLocalStorageData() {
    const dataStr = localStorage.getItem('agrivision_db');
    
    if (!dataStr) {
        console.log('📝 Создаю начальные данные в localStorage...');
        
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
                },
                {
                    id: 2,
                    name: 'Тестовый пользователь',
                    email: 'test@test.com',
                    password: '123456',
                    phone: '+7 (999) 123-45-67',
                    role: 'user',
                    registrationDate: new Date().toISOString()
                }
            ],
            requests: [],
            articles: [
                {
                    id: 1,
                    title: "Как определить болезнь растений по листьям",
                    content: "Полное содержание статьи о болезнях растений...",
                    description: "Узнайте, как по внешним признакам определить заболевания сельскохозяйственных культур",
                    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
                    category: "diseases",
                    date: new Date().toLocaleDateString('ru-RU'),
                    createdAt: new Date().toISOString(),
                    author: "Администратор",
                    views: 0,
                    isPublished: true
                }
            ],
            analysis: []
        };
        
        localStorage.setItem('agrivision_db', JSON.stringify(initialData));
        console.log('✅ Начальные данные созданы');
    }
}

// Универсальная функция входа
async function loginUser(email, password) {
    console.log('🔐 Попытка входа...');
    
    if (api.isAvailable) {
        try {
            console.log('🔐 Пробуем вход через API...');
            
            const result = await api.login({ email, password });
            
            if (result.access_token) {
                console.log('✅ Вход через API успешен');
                
                // Получаем профиль
                const profile = await api.getProfile();
                
                // Обновляем UI
                checkAuth();
                updateMobileMenu();
                showNotification(`Добро пожаловать, ${profile.name}!`, 'success');
                
                return { 
                    success: true, 
                    user: profile,
                    backend: 'api'
                };
            }
        } catch (apiError) {
            console.warn('⚠️ Ошибка API входа:', apiError.message);
            showNotification('Ошибка входа через API: ' + apiError.message, 'error');
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
        showNotification(`Добро пожаловать, ${user.name}!`, 'success');
        return { 
            success: true, 
            user: user,
            backend: 'local'
        };
    } else {
        showNotification('Неверный email или пароль', 'error');
        return { 
            success: false, 
            message: 'Неверный email или пароль',
            backend: 'local'
        };
    }
}

// Универсальная функция регистрации
async function registerUser(name, email, phone, password, location) {
    console.log('📝 Попытка регистрации...');
    
    if (api.isAvailable) {
        try {
            console.log('📝 Пробуем регистрацию через API...');
            
            const userData = {
                name: name,
                email: email,
                password: password,
                phone: phone || null,
                location: location || null
            };
            
            const result = await api.register(userData);
            console.log('✅ Регистрация через API успешна');
            
            // После регистрации автоматически логинимся
            const loginResult = await loginUser(email, password);
            
            return loginResult;
            
        } catch (apiError) {
            console.warn('⚠️ Ошибка API регистрации:', apiError.message);
            showNotification('Ошибка регистрации через API: ' + apiError.message, 'error');
            // Продолжаем с localStorage
        }
    }
    
    // Если API недоступен, используем localStorage
    console.log('📁 Используем localStorage для регистрации');
    const data = getAllData();

    // Проверка на существующего пользователя
    const existingUser = data.users.find(user => user.email === email);
    if (existingUser) {
        showNotification('Пользователь с таким email уже существует', 'error');
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
        location: location || '',
        role: 'user',
        registrationDate: new Date().toISOString()
    };

    data.users.push(newUser);
    saveData(data);

    // Автоматический вход после регистрации
    const loginResult = await loginUser(email, password);
    
    if (loginResult.success) {
        showNotification(`Регистрация успешна! Добро пожаловать, ${name}!`, 'success');
    }

    return loginResult;
}

// Остальные функции (checkAuth, updateMobileMenu и т.д.) остаются без изменений
// ...
// ==============================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
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

function getAllData() {
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
            analysis: []
        };
        localStorage.setItem('agrivision_db', JSON.stringify(initialData));
        return initialData;
    }
    return JSON.parse(dataStr);
}

function saveData(data) {
    localStorage.setItem('agrivision_db', JSON.stringify(data));
}