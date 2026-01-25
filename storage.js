// storage.js - Управление данными с автоматическим переключением API/localStorage

class StorageManager {
    constructor() {
        this.useAPI = false;
        this.apiClient = null;
    }
    
    async init() {
        // Проверяем доступность API
        if (window.api && typeof window.api.checkConnection === 'function') {
            this.useAPI = await window.api.checkConnection();
            this.apiClient = window.api;
        }
        
        if (!this.useAPI) {
            console.log('📁 Используем localStorage');
            this.initLocalStorage();
        }
        
        return this.useAPI;
    }
    
    initLocalStorage() {
        if (!localStorage.getItem('agrivision_db')) {
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
                articles: [],
                analysis: [],
                notifications: []
            };
            localStorage.setItem('agrivision_db', JSON.stringify(initialData));
        }
    }
    
    // Универсальный метод для получения данных
    async getData() {
        if (this.useAPI && this.apiClient) {
            try {
                return await this.apiClient.getData();
            } catch (error) {
                console.warn('⚠️ API недоступен, переходим к localStorage');
                this.useAPI = false;
                return this.getLocalData();
            }
        }
        return this.getLocalData();
    }
    
    getLocalData() {
        const data = localStorage.getItem('agrivision_db');
        return data ? JSON.parse(data) : { users: [], requests: [], articles: [], analysis: [], notifications: [] };
    }
    
    // Универсальный метод для сохранения данных
    async saveData(data) {
        if (this.useAPI && this.apiClient) {
            try {
                return await this.apiClient.saveData(data);
            } catch (error) {
                console.warn('⚠️ API недоступен, сохраняем в localStorage');
                this.useAPI = false;
                this.saveLocalData(data);
                return false;
            }
        }
        this.saveLocalData(data);
        return true;
    }
    
    saveLocalData(data) {
        localStorage.setItem('agrivision_db', JSON.stringify(data));
    }
    
    // Получение текущего пользователя
    getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    }
    
    // Сохранение текущего пользователя
    setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }
    
    // Очистка данных
    clear() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('access_token');
        localStorage.removeItem('agrivision_db');
    }
}

// Создаем глобальный экземпляр
const storageManager = new StorageManager();
window.storageManager = storageManager;