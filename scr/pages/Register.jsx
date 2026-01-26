import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            alert('Регистрация успешна!');
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.message || 'Ошибка регистрации');
        }
    };

    return (
        <div className="modal-overlay" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div className="modal" style={{position: 'relative', top: 0}}>
                <h2>Регистрация</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Имя</label>
                        <input type="text" placeholder="Введите имя" onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Телефон</label>
                        <input type="tel" placeholder="+7..." onChange={e => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>Пароль</label>
                        <input type="password" placeholder="Пароль" onChange={e => setFormData({...formData, password: e.target.value})} required />
                    </div>
                    <div className="modal-buttons">
                        <button type="submit" className="btn btn-primary">Зарегистрироваться</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;