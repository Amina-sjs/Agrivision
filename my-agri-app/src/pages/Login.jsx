// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { MemoryStorage } from '../api/axios';

const Login = ({ lang, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const texts = {
    ru: {
      title: "Вход в аккаунт",
      email: "Email",
      password: "Пароль",
      btn: "Войти",
      error: "Ошибка входа",
      loading: "Вход..."
    },
    en: {
      title: "Login",
      email: "Email",
      password: "Password",
      btn: "Sign In",
      error: "Login error",
      loading: "Logging in..."
    }
  };

  const t = texts[lang] || texts.ru;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🚀 Отправляем запрос на /login...');
      
      // ✅ ИСПОЛЬЗУЕМ ПРАВИЛЬНЫЙ ЭНДПОИНТ ИЗ ТЗ
      const response = await api.post('/login', {
        email: formData.email,
        password: formData.password
      });

      console.log('📥 Ответ от сервера:', response.data);

      // Проверяем структуру ответа
      if (response.data && response.data.access_token) {
        const userData = response.data.user || {
          email: formData.email,
          // ID может быть в разных полях
          id: response.data.id || response.data.userId || response.data._id
        };
        
        // Сохраняем сессию в память
        MemoryStorage.saveSession(response.data.access_token, userData);
        
        console.log('✅ Вход успешен!');
        console.log('Токен сохранен:', !!MemoryStorage.getToken());
        console.log('ID пользователя:', MemoryStorage.getUserId());
        
        // Закрываем модалку и редиректим
        onClose();
        navigate('/profile');
      } else {
        throw new Error('Токен не получен от сервера');
      }
      
    } catch (err) {
      console.error('❌ Ошибка входа:', err);
      
      // Улучшенная обработка ошибок
      if (err.response) {
        // Ошибка от сервера
        const serverError = err.response.data;
        console.log('Данные ошибки:', serverError);
        
        if (err.response.status === 401) {
          setError('Неверный email или пароль');
        } else if (err.response.status === 400) {
          setError(serverError.message || 'Неверные данные');
        } else {
          setError(`Ошибка сервера: ${err.response.status}`);
        }
      } else if (err.request) {
        // Нет ответа от сервера
        setError('Сервер не отвечает. Проверьте подключение к бэкенду.');
      } else {
        // Другие ошибки
        setError(err.message || t.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
    if (error) setError('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ position: 'relative' }}>
        <button
          onClick={onClose}
          className="close-btn"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            border: 'none',
            background: 'transparent',
            fontSize: '22px',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          ✕
        </button>

        <h2>{t.title}</h2>

        {error && (
          <div style={{ 
            color: '#d32f2f', 
            padding: '10px 15px', 
            margin: '15px 0',
            background: '#ffebee',
            borderRadius: '8px',
            border: '1px solid #ffcdd2',
            fontSize: '14px'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t.email}</label>
            <input
              type="email"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={handleChange('email')}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>{t.password}</label>
            <input
              type="password"
              placeholder="••••••"
              value={formData.password}
              onChange={handleChange('password')}
              required
              disabled={loading}
            />
          </div>

          <div className="modal-buttons">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? t.loading : t.btn}
            </button>
          </div>
        </form>

        <div style={{ 
          marginTop: '20px', 
          fontSize: '12px', 
          color: '#666',
          textAlign: 'center'
        }}>
          Используется эндпоинт: <code>/login</code>
        </div>
      </div>
    </div>
  );
};

export default Login;