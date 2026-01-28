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

// Создаем экземпляр axios
const api = axios.create({
  baseURL: 'http://172.20.10.3:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Перехватчик запросов (использует переменные из памяти)
api.interceptors.request.use((config) => {
  if (memoryToken) {
    config.headers.Authorization = `Bearer ${memoryToken}`;
  }
  return config;
});

/**
 * === КОНФИГУРАЦИЯ ПО ТЗ ===
 */
export const API_CONFIG = {
  BASE_URL: 'http://172.20.10.3:5000',
  ENDPOINTS: {
    REGISTER: '/register',
    LOGIN: '/login',
    USER_PROFILE: (id) => `/user/${id}`,
    ANALYZE: (id) => `/user/${id}/analyze`,
    HISTORY: (id) => `/user/${id}/history`,
    SERVICE_REQUEST: (id) => `/user/${id}/service-request`,
  },
  getHeaders: () => {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(memoryToken ? { 'Authorization': `Bearer ${memoryToken}` } : {})
    };
  }
};

/**
 * MemoryStorage - интерфейс для работы с данными
 */
export const MemoryStorage = {
  // Сохраняем сессию и в память, и в localStorage
  saveSession(token, userData) {
    memoryToken = token;
    memoryUser = userData;
    memoryUserId = userData?.id || userData?._id || userData?.userId;

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
    memoryToken = null;
    memoryUser = null;
    memoryUserId = null;
    localStorage.removeItem('agri_token');
    localStorage.removeItem('agri_user');
    localStorage.removeItem('agri_userId');
    console.log('🧹 Сессия полностью очищена');
  },

  // Геттеры (работают с переменными в памяти — это быстро)
  getToken: () => memoryToken,
  getUser: () => memoryUser,
  getUserId: () => memoryUserId,
  isAuthenticated: () => !!memoryToken && !!memoryUserId
};

export default api;