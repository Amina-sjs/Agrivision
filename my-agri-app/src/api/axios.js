// src/api/axios.js
import axios from 'axios';

// === ПАМЯТЬ вместо localStorage ===
let memoryToken = null;
let memoryUser = null;
let memoryUserId = null; // Добавляем хранение ID

// Восстановление сессии из памяти при загрузке страницы
const restoreSession = () => {
  if (window.__agri_token) {
    memoryToken = window.__agri_token;
  }
  if (window.__agri_user) {
    memoryUser = window.__agri_user;
  }
  if (window.__agri_userId) {
    memoryUserId = window.__agri_userId;
  }
  console.log('🔄 Восстановлена сессия из памяти:', {
    hasToken: !!memoryToken,
    user: memoryUser?.email,
    userId: memoryUserId
  });
};

// Вызываем при импорте
restoreSession();

// Создаем экземпляр axios
const api = axios.create({
  baseURL: 'http://172.20.10.2:5000', // Ваш IP бэкенда
  headers: {
    'Content-Type': 'application/json'
  }
});

// Перехватчик запросов - добавляем токен из памяти
api.interceptors.request.use((config) => {
  if (memoryToken) {
    config.headers.Authorization = `Bearer ${memoryToken}`;
  }
  return config;
});

/**
 * === КОНФИГУРАЦИЯ ПО ТЗ ИЗ СКРИНШОТА ===
 * Только правильные эндпоинты!
 */
const API_CONFIG = {
  BASE_URL: 'http://172.20.10.2:5000',
  
  // === ТОЛЬКО ЭНДПОИНТЫ ИЗ СКРИНШОТА ===
  ENDPOINTS: {
    REGISTER: '/register',          // POST - регистрация
    LOGIN: '/login',                // POST - вход
    USER_PROFILE: (id) => `/user/${id}`, // GET - профиль
    UPDATE_PROFILE: (id) => `/user/${id}`, // PATCH - обновление
    
    // Дополнительные (если есть в вашем бэкенде)
    LOGOUT: '/auth/logout',
    UPLOAD_PHOTO: '/analysis/upload',
    ANALYSIS_HISTORY: '/analysis/history',
    CREATE_REQUEST: '/requests/create',
    GET_REQUESTS: '/requests',
    HEALTH: '/health'
  },
  
  // Настройки заголовков
  getHeaders: () => {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(memoryToken ? { 'Authorization': `Bearer ${memoryToken}` } : {})
    };
  }
};

/**
 * MemoryStorage - хранилище в памяти
 */
const MemoryStorage = {
  // Сохраняем сессию
  saveSession(token, userData) {
    memoryToken = token;
    memoryUser = userData;
    memoryUserId = userData?.id || userData?._id;
    
    // Сохраняем в глобальную область для восстановления
    window.__agri_token = token;
    window.__agri_user = userData;
    window.__agri_userId = memoryUserId;
    
    console.log('💾 Сессия сохранена в памяти:', {
      token: token ? '✓' : '✗',
      email: userData?.email,
      userId: memoryUserId
    });
    
    return userData;
  },

  // Очищаем сессию
  clear() {
    memoryToken = null;
    memoryUser = null;
    memoryUserId = null;
    
    delete window.__agri_token;
    delete window.__agri_user;
    delete window.__agri_userId;
    
    console.log('🧹 Сессия полностью очищена');
  },

  // Геттеры
  getToken: () => memoryToken,
  getUser: () => memoryUser,
  getUserId: () => memoryUserId,
  isAuthenticated: () => !!memoryToken && !!memoryUserId,
  
  // Получаем ID пользователя для запросов
  getProfileEndpoint() {
    const userId = this.getUserId();
    if (!userId) {
      console.error('❌ ID пользователя не найден');
      return null;
    }
    return `/user/${userId}`;
  }
};

/**
 * Проверка доступности API
 */
async function checkApiAvailability() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log('🌐 API доступен');
      return true;
    }
  } catch (error) {
    console.error('🌐 API недоступен:', error.message);
  }
  return false;
}

// Экспорт
export { api, API_CONFIG, MemoryStorage, checkApiAvailability };
export default api;