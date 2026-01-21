// Скрипт для авторизации пользователей

document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, авторизован ли пользователь
    checkAuth();

    // Обновляем мобильное меню
    updateMobileMenu();
});

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