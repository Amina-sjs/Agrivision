// Конфигурация API
const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:5000/api', // Твой URL бэкенда
  ENDPOINTS: {
    // Аутентификация
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/profile',
    
    // Анализ заболеваний
    UPLOAD_PHOTO: '/core-ai',
    ANALYSIS_HISTORY: '/history',
    
    // Услуги
    REQUEST_AGRO: '/service-agro',
    USER_SERVICES: '/services',
    
    // Статьи
    ARTICLES: '/articles',
    SAVE_ARTICLE: '/articles/save',
    FAVORITES: '/articles/favorites'
  }
};

// Утилиты для работы с хранилищем
const Storage = {
  setToken(token) {
    localStorage.setItem('access_token', token);
  },
  
  getToken() {
    return localStorage.getItem('access_token');
  },
  
  removeToken() {
    localStorage.removeItem('access_token');
  },
  
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
  }
};