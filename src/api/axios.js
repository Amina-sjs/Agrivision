import axios from 'axios';

// === СОСТОЯНИЕ В ПАМЯТИ ===
let memoryToken = null;
let memoryUser = null;
let memoryUserId = null;

// === ЛОГИКА ВОССТАНОВЛЕНИЯ (как в старом коде, но из localStorage) ===
const restoreSession = () => {
  try {
    const savedToken = localStorage.getItem('agri_token');
    const savedUser = localStorage.getItem('agri_user');
    const savedId = localStorage.getItem('agri_userId');

    if (savedToken) {
      memoryToken = savedToken;
    }
    if (savedUser) {
      memoryUser = JSON.parse(savedUser);
    }
    if (savedId) {
      memoryUserId = savedId;
    }

    console.log('🔄 Сессия восстановлена из localStorage:', {
      hasToken: !!memoryToken,
      userId: memoryUserId
    });
  } catch (error) {
    console.error('❌ Ошибка восстановления сессии:', error);
  }
};

// Вызываем при загрузке файла
restoreSession();

export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.108:5000/api',
  ENDPOINTS: {
    // 1. Авторизация
    REGISTER: '/register',
    LOGIN: '/login',
    USER_PROFILE: (id) => `/user/${id}`,
    // 2. Анализ (Core AI)
    ANALYZE: (id) => `/user/${id}/analyze`,
    // 3. История и Сервисы
    HISTORY: (id) => `/user/${id}/history`,
    SERVICE_REQUEST: (id) => `/user/${id}/service-request`,
    SERVICES_LIST: (id) => `/user/${id}/services`,
    // 4. Библиотека
    LIBRARY: '/library',
    LIBRARY_ITEM: (id) => `/library/${id}`,
    SAVE_FAVORITE: (userId, itemId) => `/user/${userId}/save/${itemId}`,
    FAVORITES: (userId) => `/user/${userId}/favorites`,
  }
};

// Создаем экземпляр axios
const api = axios.create({
  baseURL: 'http://192.168.1.108:5000/api',
  timeout: 15000,
});

// Перехватчик запросов (использует переменные из памяти)
api.interceptors.request.use((config) => {
    // Берем токен напрямую из памяти или хранилища
    const token = memoryToken || localStorage.getItem('agri_token');
    
    if (token) {
        
        config.headers.Authorization = `Bearer ${token}`;
        // console.log('✅ Токен прикреплен к запросу:', config.url);
    } else {
        // console.warn('⚠️ Запрос уходит без токена:', config.url);
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});



/**
 * MemoryStorage - интерфейс для работы с данными
 */
export const MemoryStorage = {
  // Сохраняем сессию и в память, и в localStorage
  saveSession(token, userData) {
    memoryToken = token;
    memoryUser = userData;
    // В методе saveSession
    memoryUserId = userData?.user_id || userData?.id;

    localStorage.setItem('agri_token', token);
    localStorage.setItem('agri_user', JSON.stringify(userData));
    localStorage.setItem('agri_userId', memoryUserId);

    console.log('💾 Сессия сохранена (Память + LocalStorage):', {
      email: userData?.email,
      userId: memoryUserId
    });

    return userData;
  },

  // Очищаем всё
  clear() {
    // 1. Очищаем переменные в оперативной памяти
    memoryToken = null;
    memoryUser = null;
    memoryUserId = null;

    // 2. Очищаем localStorage (именно те ключи, которые создавали)
    const keysToRemove = ['agri_token', 'agri_user', 'agri_userId'];
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Дополнительно удаляем старые ключи без префикса на всякий случай
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');

    console.log('🧹 Сессия полностью очищена');
  },

  // Геттеры (работают с переменными в памяти — это быстро)
  getToken: () => memoryToken || localStorage.getItem('agri_token'),
  getUser: () => memoryUser || JSON.parse(localStorage.getItem('agri_user')),
  getUserId: () => memoryUserId || localStorage.getItem('agri_userId'),
  isAuthenticated: () => !!(memoryToken || localStorage.getItem('agri_token'))
};

export const apiRequests = {
  // Регистрация (Блок 1) - не забудь передать phone и location
  register: (data) => api.post(API_CONFIG.ENDPOINTS.REGISTER, data),
  login: (data) => api.post(API_CONFIG.ENDPOINTS.LOGIN, data),
  // Анализ фото (Блок 2) - передавай чистый File из input
  // analyzeLeaf: (file, lang = 'ru') => {
  //   const fd = new FormData();
  //   fd.append('file', file);
  //   return api.post(API_CONFIG.ENDPOINTS.ANALYZE(memoryUserId), fd, {
  //     headers: { 'Accept-Language': lang }
  //   });
  // }
};

export default api;