// config.js - Конфигурация API для AgriVision

const API_CONFIG = {
  // БАЗОВЫЙ URL - меняй когда запустишь бэкенд
  BASE_URL: 'http://localhost:5000/api', // ← Сюда твой IP или localhost
  ENDPOINTS: {
    // === АУТЕНТИФИКАЦИЯ ===
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    REFRESH_TOKEN: '/auth/refresh',
    
    // === АНАЛИЗ ЗАБОЛЕВАНИЙ ===
    UPLOAD_PHOTO: '/analysis/upload',
    ANALYSIS_HISTORY: '/analysis/history',
    ANALYSIS_BY_ID: '/analysis/:id',
    DELETE_ANALYSIS: '/analysis/delete',
    
    // === УСЛУГИ / ЗАЯВКИ ===
    CREATE_REQUEST: '/requests/create',
    GET_REQUESTS: '/requests',
    REQUEST_BY_ID: '/requests/:id',
    UPDATE_REQUEST_STATUS: '/requests/:id/status',
    
    // === СТАТЬИ ===
    GET_ARTICLES: '/articles',
    GET_ARTICLE: '/articles/:id',
    CREATE_ARTICLE: '/articles/create',
    UPDATE_ARTICLE: '/articles/:id',
    DELETE_ARTICLE: '/articles/:id',
    
    // === АДМИН ПАНЕЛЬ ===
    ADMIN_USERS: '/admin/users',
    ADMIN_REQUESTS: '/admin/requests',
    ADMIN_ANALYSIS: '/admin/analysis',
    ADMIN_STATS: '/admin/stats',
    
    // === ПРОВЕРКА ЗДОРОВЬЯ ===
    HEALTH: '/health'
  }
};

// Утилиты для работы с хранилищем
const Storage = {
  // Токены
  setToken(token) {
    localStorage.setItem('access_token', token);
  },
  
  getToken() {
    return localStorage.getItem('access_token');
  },
  
  removeToken() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  
  // Пользователь
  setUser(user) {
    localStorage.setItem('user_data', JSON.stringify(user));
  },
  
  getUser() {
    const user = localStorage.getItem('user_data');
    return user ? JSON.parse(user) : null;
  },
  
  clear() {
    this.removeToken();
    localStorage.removeItem('user_data');
    localStorage.removeItem('currentUser');
  },
  
  // Проверка авторизации
  isAuthenticated() {
    return this.getToken() !== null;
  },
  
  // Проверка роли
  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  }
};

// Глобальная переменная для статуса API
let API_AVAILABLE = false;

// Функция проверки доступности API
async function checkApiAvailability() {
  try {
    console.log('🔍 Проверяю доступность API...');
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      timeout: 3000
    }).catch(() => null);
    
    if (response && response.ok) {
      console.log('✅ API доступен');
      API_AVAILABLE = true;
      return true;
    }
  } catch (error) {
    console.log('❌ API недоступен:', error.message);
  }
  
  API_AVAILABLE = false;
  return false;
}

// Экспорт
window.API_CONFIG = API_CONFIG;
window.Storage = Storage;
window.API_AVAILABLE = API_AVAILABLE;
window.checkApiAvailability = checkApiAvailability;