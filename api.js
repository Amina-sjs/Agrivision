// api.js - Единый клиент для работы с новым бэкендом API

class ApiClient {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.isAvailable = false;
    this.currentLanguage = Storage.getLanguage();
    
    // Автоматическая проверка при создании
    this.checkConnection();
  }

  // ============ ОСНОВНЫЕ МЕТОДЫ ============

  async checkConnection() {
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.HEALTH}`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      });
      
      this.isAvailable = response.ok;
      console.log(this.isAvailable ? '✅ API доступен' : '❌ API недоступен');
      return this.isAvailable;
    } catch (error) {
      console.log('❌ API недоступен, переходим в локальный режим');
      this.isAvailable = false;
      return false;
    }
  }

  // Общая функция для всех запросов
  async request(endpoint, method = 'GET', data = null, isFormData = false) {
    // Если API недоступен, кидаем ошибку
    if (!this.isAvailable) {
      throw new Error('API недоступен. Работаем в автономном режиме.');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const token = Storage.getToken();
    
    const headers = {};
    
    // Добавляем заголовки
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    // Добавляем заголовок языка (если endpoint требует)
    if (endpoint.includes('/diseases/') || endpoint.includes('/articles')) {
      headers['Accept-Language'] = this.currentLanguage;
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers
    };

    // Добавляем тело запроса
    if (data) {
      options.body = isFormData ? data : JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      // Обработка 401 Unauthorized
      if (response.status === 401) {
        Storage.clear();
        window.location.href = '/login.html';
        throw new Error('Требуется авторизация');
      }
      
      // Обработка других ошибок
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: `Ошибка ${response.status}: ${response.statusText}` 
        }));
        throw new Error(errorData.message || 'Ошибка сервера');
      }
      
      // Возвращаем данные
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
      
    } catch (error) {
      console.error(`❌ Ошибка API (${method} ${endpoint}):`, error);
      throw error;
    }
  }

  // ============ АУТЕНТИФИКАЦИЯ И ПРОФИЛЬ ============

  async register(userData) {
    // Согласно схеме: {"name", "email", "phone"*, "location"}
    const data = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || null,
      location: userData.location || null
    };
    
    return this.request(API_CONFIG.ENDPOINTS.REGISTER, 'POST', data);
  }

  async login(credentials) {
    // Согласно схеме: {"email", "password"}
    const result = await this.request(API_CONFIG.ENDPOINTS.LOGIN, 'POST', credentials);
    
    // Сохраняем токен
    if (result.access_token) {
      Storage.setToken(result.access_token);
    }
    
    // Сохраняем пользователя
    if (result.user) {
      Storage.setUser(result.user);
    }
    
    return result;
  }

  async logout() {
    try {
      await this.request(API_CONFIG.ENDPOINTS.LOGOUT, 'POST');
    } finally {
      Storage.clear();
    }
  }

  async getProfile() {
    return this.request(API_CONFIG.ENDPOINTS.PROFILE, 'GET');
  }

  async updateProfile(profileData) {
    // Согласно схеме: {"name"*, "phone"*, "location"*}
    return this.request(API_CONFIG.ENDPOINTS.UPDATE_PROFILE, 'PATCH', profileData);
  }

  // ============ АНАЛИЗ ЗАБОЛЕВАНИЙ (CORE AI) ============

  async uploadPhoto(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Согласно схеме: Body (form-data), Header: Accept - ru (или en)
    return this.request(API_CONFIG.ENDPOINTS.UPLOAD_PHOTO, 'POST', formData, true);
  }

  async getAnalysisHistory() {
    // Согласно схеме: GET /diseases/history
    return this.request(API_CONFIG.ENDPOINTS.ANALYSIS_HISTORY, 'GET');
  }

  // ============ СЕРВИСЫ ============

  async createServiceRequest(requestData) {
    // Согласно схеме: {"phone", "local"} plants_description
    // Предполагаю что "local" = "location"
    const data = {
      phone: requestData.phone,
      local: requestData.local || requestData.location,
      plants_description: requestData.plants_description || requestData.description,
      area: requestData.area,
      culture: requestData.culture,
      date: requestData.date
    };
    
    return this.request(API_CONFIG.ENDPOINTS.CREATE_SERVICE_REQUEST, 'POST', data);
  }

  async getUserServices() {
    // Согласно схеме: GET /services/services
    return this.request(API_CONFIG.ENDPOINTS.USER_SERVICES, 'GET');
  }

  // ============ СТАТЬИ ============

  async getArticles() {
    // Согласно схеме: GET /articles
    return this.request(API_CONFIG.ENDPOINTS.GET_ARTICLES, 'GET');
  }

  async getArticleById(id) {
    const endpoint = API_CONFIG.ENDPOINTS.GET_ARTICLE_BY_ID.replace(':id', id);
    return this.request(endpoint, 'GET');
  }

  async saveArticle(articleId) {
    const endpoint = API_CONFIG.ENDPOINTS.SAVE_ARTICLE.replace(':item_id', articleId);
    return this.request(endpoint, 'POST');
  }

  async getFavorites() {
    return this.request(API_CONFIG.ENDPOINTS.GET_FAVORITES, 'GET');
  }

  // ============ УТИЛИТЫ ============

  setLanguage(lang) {
    if (API_CONFIG.LANGUAGES.includes(lang)) {
      this.currentLanguage = lang;
      Storage.setLanguage(lang);
    }
  }

  getLanguage() {
    return this.currentLanguage;
  }

  // Проверка файла перед загрузкой
  validateFile(file) {
    if (!API_CONFIG.ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error(`Неподдерживаемый тип файла. Разрешенные: ${API_CONFIG.ALLOWED_FILE_TYPES.join(', ')}`);
    }

    if (file.size > API_CONFIG.MAX_FILE_SIZE) {
      throw new Error(`Файл слишком большой. Максимальный размер: ${API_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    return true;
  }
}

// Создаем глобальный экземпляр API клиента
const api = new ApiClient();
window.api = api;