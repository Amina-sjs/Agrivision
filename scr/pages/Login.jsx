import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            // Сохраняем токен и данные юзера как в твоем старом config.js
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('currentUser', JSON.stringify(response.data.user));
            
            alert('Вход выполнен!');
            navigate('/profile'); // Перенаправляем в профиль
        } catch (error) {
            alert(error.response?.data?.message || 'Ошибка входа');
        }
    };

    return (
        <div className="modal-overlay" style={{display: 'flex'}}>
            <div className="modal">
                <h2>Вход в аккаунт</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Пароль</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="modal-buttons">
                        <button type="submit" className="btn btn-primary">Войти</button>
                        <Link to="/register" className="btn btn-outline">Регистрация</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;