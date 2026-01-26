import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Проверяем, залогинен ли юзер (есть ли данные в localStorage)
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const logout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <header>
            <div className="container header-container">
                <div className="logo">
                    <Link TO="/" className="logo-link">
                        <div className="svg-placeholder">🌱</div>
                    </Link>
                </div>

                <nav>
                    <ul>
                        <li><a href="#hero">Главная</a></li>
                        <li><Link to="/analysis">Анализ</Link></li>
                        <li><a href="#library">Библиотека</a></li>
                        <li><a href="#about">О нас</a></li>
                    </ul>
                </nav>

                <button className="burger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <span></span><span></span><span></span>
                </button>

                <div className="header-right">
                    {!user ? (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn btn-outline">Войти</Link>
                            <Link to="/register" className="btn btn-primary">Регистрация</Link>
                        </div>
                    ) : (
                        <div className="user-profile">
                            <button className="profile-btn">
                                <i className="fas fa-user-circle"></i>
                                <span>{user.full_name || user.name}</span>
                            </button>
                            <div className="profile-dropdown">
                                <Link to="/profile" className="dropdown-item">Мой профиль</Link>
                                <button onClick={logout} className="dropdown-item">Выйти</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;