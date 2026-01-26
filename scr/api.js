import axios from 'axios';

const api = axios.create({
    baseURL: 'http://172.20.10.2:5000', // Твой адрес из config.js
    headers: {
        'Content-Type': 'application/json'
    }
});

// Перехватчик для добавления токена (авторизация)
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getProfile: () => api.get('/auth/profile')
};

export default api;