
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://172.20.10.2:5000', // Твой IP из config.js
    headers: {
        'Content-Type': 'application/json'
    }
});

// Автоматически подставляем токен в каждый запрос, если он есть
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;


/**
 * AgriVision - Глобальная конфигурация API
 * Настроено на работу строго с внешним сервером.
 */

const API_CONFIG = {
    // BASE_URL: Используй 127.0.0.1 или localhost, если бэк запущен на той же машине
    BASE_URL: 'http://172.20.10.2:5000', 
    
    ENDPOINTS: {
        // === АУТЕНТИФИКАЦИЯ (Синхронизировано с auth.js) ===
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        PROFILE: '/auth/profile', // GET запрос для получения данных юзера
        
        // === АНАЛИЗ ЗАБОЛЕВАНИЙ ===
        UPLOAD_PHOTO: '/analysis/upload',
        ANALYSIS_HISTORY: '/analysis/history',
        
        // === УСЛУГИ / ЗАЯВКИ ===
        CREATE_REQUEST: '/requests/create',
        GET_REQUESTS: '/requests',
        
        // === ПРОВЕРКА ЗДОРОВЬЯ СЕРВЕРА ===
        HEALTH: '/health'
    },

    // Настройки заголовков по умолчанию
    getHeaders: () => {
        const token = localStorage.getItem('access_token');
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    }
};

/**
 * Storage - Менеджер локального состояния сессии
 */
const Storage = {
    saveSession(token, userData) {
        localStorage.setItem('access_token', token);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        console.log('💾 Сессия сохранена в браузере');
    },

    clear() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('currentUser');
        console.log('🧹 Сессия очищена');
    },

    getToken: () => localStorage.getItem('access_token'),
    getUser: () => JSON.parse(localStorage.getItem('currentUser')),
    isAuthenticated: () => !!localStorage.getItem('access_token')
};

/**
 * API Guard - Проверка связи с сервером
 */
async function checkApiAvailability() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // Таймаут 3 сек

        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`, {
            method: 'GET',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            console.log('🌐 Статус API: [ОНЛАЙН]');
            return true;
        }
    } catch (error) {
        console.error('🌐 Статус API: [ОФФЛАЙН]. Проверьте соединение или IP бэкенда.');
    }
    return false;
}

// Экспорт в глобальную область видимости
window.API_CONFIG = API_CONFIG;
window.Storage = Storage;
window.checkApiAvailability = checkApiAvailability;