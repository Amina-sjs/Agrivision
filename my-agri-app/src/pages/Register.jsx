// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { MemoryStorage } from '../api/axios';

const Register = ({ lang, onClose }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

   
    const texts = {
        ru: {
            title: "Регистрация",
            name: "Имя",
            email: "Email",
            phone: "Телефон",
            location: "Локация",
            pass: "Пароль",
            btn: "Зарегистрироваться",
            loading: "Регистрация...",
            error: "Ошибка регистрации"
        },
        en: {
            title: "Registration",
            name: "Name",
            email: "Email",
            phone: "Phone",
            location: "Location",
            pass: "Password",
            btn: "Sign Up",
            loading: "Registering...",
            error: "Registration error"
        }
    };

    const t = texts[lang] || texts.ru;

    // 3. Функция отправки данных - ОБНОВЛЯЕМ ЭНДПОИНТ
    const handleSubmit = async (e) => {
        e.preventDefault(); // ОСТАВЛЯЕМ
        
        setLoading(true);
        setError('');
        
        try {
            console.log('🚀 Отправляем запрос регистрации...');
            
            // ✅ МЕНЯЕМ ТОЛЬКО ЭНДПОИНТ: с /auth/register на /register
            const response = await api.post('/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone || '',   // * - опционально
                location: formData.location || '' // * - опционально
            });

            console.log('📥 Ответ от сервера:', response.data);

            if (response.data) {
                console.log("✅ Регистрация успешна!");
                
                // ОСТАВЛЯЕМ СТАРУЮ ЛОГИКУ: сохраняем токен если есть
                if (response.data.access_token) {
                    const userData = response.data.user || {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        location: formData.location,
                        id: response.data.id || response.data.userId
                    };
                    
                    // ИСПОЛЬЗУЕМ MemoryStorage вместо window.Storage
                    MemoryStorage.saveSession(response.data.access_token, userData);
                }
                
                // ОСТАВЛЯЕМ alert как было
                alert("Успешно!");
                
                // ОСТАВЛЯЕМ навигацию
                onClose(); // закрываем модалку
                navigate('/login'); // Перекидываем на логин
            }
        } catch (error) {
            console.error('❌ Ошибка регистрации:', error);
            
            // Улучшенная обработка ошибок
            let errorMessage = t.error;
            
            if (error.response) {
                // Ошибка от сервера
                const serverError = error.response.data;
                console.log('Данные ошибки:', serverError);
                
                if (error.response.status === 400) {
                    errorMessage = serverError.message || 'Неверные данные';
                } else if (error.response.status === 409) {
                    errorMessage = 'Пользователь с таким email уже существует';
                } else {
                    errorMessage = `Ошибка сервера: ${error.response.status}`;
                }
            } else if (error.request) {
                // Нет ответа от сервера
                errorMessage = 'Сервер не отвечает. Проверьте подключение.';
            } else {
                // Другие ошибки
                errorMessage = error.message || t.error;
            }
            
            setError(errorMessage);
            alert(errorMessage); // ОСТАВЛЯЕМ alert как было
        } finally {
            setLoading(false);
        }
    };

    // 4. Функция обновления полей - ОСТАВЛЯЕМ
    const handleChange = (field) => (e) => {
        setFormData({
            ...formData,
            [field]: e.target.value
        });
        if (error) setError('');
    };

    return (
        <div className="modal-overlay" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div className="modal" style={{position: 'relative', top: 0}}>
                {/* Кнопка закрытия как в Login.jsx */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        border: 'none',
                        background: 'transparent',
                        fontSize: '22px',
                        cursor: 'pointer'
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
                        <label>{t.name} *</label>
                        <input 
                            type="text" 
                            placeholder={t.name}
                            value={formData.name}
                            onChange={handleChange('name')}
                            required 
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t.email} *</label>
                        <input 
                            type="email" 
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange('email')}
                            required 
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t.phone}</label>
                        <input 
                            type="tel" 
                            placeholder="+7..."
                            value={formData.phone}
                            onChange={handleChange('phone')}
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t.location}</label>
                        <input 
                            type="text" 
                            placeholder={t.location}
                            value={formData.location}
                            onChange={handleChange('location')}
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t.pass} *</label>
                        <input 
                            type="password" 
                            placeholder="***"
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
                    marginTop: '15px', 
                    fontSize: '12px', 
                    color: '#666',
                    textAlign: 'center' 
                }}>
                    * — обязательные поля<br/>
                    Используется эндпоинт: <code>/register</code>
                </div>
            </div>
        </div>
    );
};

export default Register;