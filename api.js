// Основной класс для работы с API
class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.token = Storage.getToken();
  }

  // Базовый метод для всех запросов
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Формируем заголовки
    const headers = {
      'Content-Type': 'application/json',
      'Accept-Language': 'ru', // или 'en'
      ...options.headers
    };

    // Добавляем токен если есть
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Убираем Content-Type для FormData
    if (options.body && options.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    console.log(`📤 Отправка запроса: ${options.method || 'GET'} ${url}`);

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      // Проверяем статус ответа
      if (!response.ok) {
        let errorText = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      // Парсим JSON ответ
      const data = await response.json();
      console.log('📥 Ответ от сервера:', data);
      
      return data;

    } catch (error) {
      console.error('❌ Ошибка API:', error.message);
      
      // Если ошибка авторизации - очищаем данные
      if (error.message.includes('401') || error.message.includes('token')) {
        Storage.clear();
        this.token = null;
        // Показываем сообщение пользователю
        alert('Сессия истекла. Пожалуйста, войдите снова.');
        window.location.href = 'index.html'; // Редирект на главную
      }
      
      throw error;
    }
  }

  // === АВТОРИЗАЦИЯ ===
  async register(userData) {
    const data = await this.request(API_CONFIG.ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return data;
  }

  async login(email, password) {
    const data = await this.request(API_CONFIG.ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (data.access_token) {
      Storage.setToken(data.access_token);
      this.token = data.access_token;
    }
    
    return data;
  }

  // === ПРОФИЛЬ ===
  async getProfile() {
    return await this.request(API_CONFIG.ENDPOINTS.PROFILE);
  }

  async updateProfile(profileData) {
    return await this.request(API_CONFIG.ENDPOINTS.PROFILE, {
      method: 'PATCH',
      body: JSON.stringify(profileData)
    });
  }

  // === АНАЛИЗ ЗАБОЛЕВАНИЙ ===
  async uploadPhoto(file) {
    const formData = new FormData();
    formData.append('photo', file); // Уточни у бэкендера название поля!

    return await this.request(API_CONFIG.ENDPOINTS.UPLOAD_PHOTO, {
      method: 'POST',
      body: formData
    });
  }

  async getAnalysisHistory() {
    return await this.request(API_CONFIG.ENDPOINTS.ANALYSIS_HISTORY);
  }

  // === УСЛУГИ ===
  async requestAgronomist(requestData) {
    return await this.request(API_CONFIG.ENDPOINTS.REQUEST_AGRO, {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  }

  async getUserServices() {
    return await this.request(API_CONFIG.ENDPOINTS.USER_SERVICES);
  }

  // === СТАТЬИ ===
  async getArticles() {
    return await this.request(API_CONFIG.ENDPOINTS.ARTICLES);
  }

  async getArticleById(id) {
    return await this.request(`${API_CONFIG.ENDPOINTS.ARTICLES}/${id}`);
  }

  async saveArticle(articleId) {
    return await this.request(`${API_CONFIG.ENDPOINTS.SAVE_ARTICLE}/${articleId}`, {
      method: 'POST'
    });
  }

  async getFavorites() {
    return await this.request(API_CONFIG.ENDPOINTS.FAVORITES);
  }

  // Проверка авторизации
  isAuthenticated() {
    return !!this.token;
  }

  // Выход
  logout() {
    Storage.clear();
    this.token = null;
  }
}

// Создаем глобальный экземпляр
const api = new ApiClient();