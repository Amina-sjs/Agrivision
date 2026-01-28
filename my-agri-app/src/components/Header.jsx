// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MemoryStorage } from '../api/axios';

const translations = {
    ru: { 
        home: "Главная", 
        analysis: "Анализ", 
        library: "Библиотека", 
        request: "Заявка", 
        about: "О нас", 
        login: "Войти", 
        register: "Регистрация", 
        profile: "Мой профиль", 
        logout: "Выйти",
        notifications: "Уведомления",
        no_notifications: "Нет новых уведомлений"
    },
    en: { 
        home: "Home", 
        analysis: "Analysis", 
        library: "Library", 
        request: "Request", 
        about: "About", 
        login: "Login", 
        register: "Register", 
        profile: "My Profile", 
        logout: "Logout",
        notifications: "Notifications",
        no_notifications: "No new notifications"
    }
};

const Header = ({ lang, setLang, onOpenRegister, onOpenLogin }) => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Загружаем данные из памяти
        const currentUser = MemoryStorage.getUser();
        if (currentUser) {
            setUser(currentUser);
        }
        
        // Загружаем уведомления (заглушка)
        setNotifications([
            { id: 1, text: "Ваш анализ растения завершен", time: "10 мин назад", read: false },
            { id: 2, text: "Новая статья в библиотеке", time: "1 час назад", read: true },
        ]);
    }, []);

    const t = (key) => translations[lang]?.[key] || key;

    const handleLogout = () => {
        MemoryStorage.clear();
        setUser(null);
        setShowProfileDropdown(false);
        window.location.href = '/';
    };

    const handleNavClick = (sectionId, e) => {
        e.preventDefault();
        
        // Для анализа - используем React Router
        if (sectionId === 'analysis') {
            navigate('/analysis'); 
            setIsMenuOpen(false);
            return;
        }
        
        // Для библиотеки - показываем сообщение
        if (sectionId === 'library') {
            navigate('/library'); 
            setIsMenuOpen(false);
            return;
        }
        
        // Для остальных - скролл к якорям
        if (window.location.pathname !== '/') {
        // Переходим на главную и добавляем хеш в URL
        navigate(`/#${sectionId}`);
    } else {
        // 3. Если мы уже на главной — просто плавно скроллим
        if (sectionId === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
        
        // Закрываем мобильное меню если открыто
        setIsMenuOpen(false);
    };

    const markNotificationAsRead = (id) => {
        setNotifications(prev => 
            prev.map(notif => 
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="main-header" style={{ position: 'relative', zIndex: 1000 }}>
            <div className="container header-container">
                <div className="logo">
                    <Link to="/" className="logo-link" onClick={(e) => handleNavClick('home', e)}>
                        <div className="svg-placeholder">🌱</div>
                    </Link>
                </div>

                {/* Бургер меню для мобильных */}
                <button 
                    className={`burger-menu ${isMenuOpen ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{
                        display: 'none',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '10px'
                    }}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                    <ul>
                        <li><a href="/" onClick={(e) => handleNavClick('home', e)}>{t('home')}</a></li>
                        <li><a href="#analysis" onClick={(e) => handleNavClick('analysis', e)}>{t('analysis')}</a></li>
                        <li><a href="#library" onClick={(e) => handleNavClick('library', e)}>{t('library')}</a></li>
                        <li><a href="#request" onClick={(e) => handleNavClick('request', e)}>{t('request')}</a></li>
                        <li><a href="#about" onClick={(e) => handleNavClick('about', e)}>{t('about')}</a></li>
                    </ul>
                </nav>

                <div className="header-right">
                    <div className="language-switcher">
                        <button 
                            className={`lang-btn ${lang === 'ru' ? 'active' : ''}`} 
                            onClick={() => setLang('ru')}
                        >
                            RU
                        </button>
                        <button 
                            className={`lang-btn ${lang === 'en' ? 'active' : ''}`} 
                            onClick={() => setLang('en')}
                        >
                            EN
                        </button>
                    </div>

                    {!user ? (
                        <div className="auth-buttons">
                            <button className="btn btn-outline" onClick={onOpenLogin}>
                                {t('login')}
                            </button>
                            <button className="btn btn-primary" onClick={onOpenRegister}>
                                {t('register')}
                            </button>
                        </div>
                    ) : (
                        <div className="user-section">
                            {/* Колокольчик уведомлений */}
                            <div className="notifications-wrapper">
                                <button 
                                    className="notifications-btn"
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '20px',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        padding: '5px'
                                    }}
                                >
                                    🔔
                                    {unreadCount > 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '-5px',
                                            right: '-5px',
                                            background: '#ff4757',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '18px',
                                            height: '18px',
                                            fontSize: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                                
                                {showNotifications && (
                                    <div className="notifications-dropdown" style={{
                                        position: 'absolute',
                                        top: '40px',
                                        right: '0',
                                        background: 'white',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        width: '300px',
                                        zIndex: 1001
                                    }}>
                                        <div style={{
                                            padding: '15px',
                                            borderBottom: '1px solid #eee',
                                            fontWeight: 'bold'
                                        }}>
                                            {t('notifications')}
                                        </div>
                                        
                                        {notifications.length > 0 ? (
                                            <div>
                                                {notifications.map(notification => (
                                                    <div 
                                                        key={notification.id}
                                                        onClick={() => markNotificationAsRead(notification.id)}
                                                        style={{
                                                            padding: '10px 15px',
                                                            borderBottom: '1px solid #f5f5f5',
                                                            cursor: 'pointer',
                                                            background: notification.read ? 'white' : '#f8f9fa',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <div>
                                                            <div>{notification.text}</div>
                                                            <div style={{ fontSize: '12px', color: '#666' }}>
                                                                {notification.time}
                                                            </div>
                                                        </div>
                                                        {!notification.read && (
                                                            <div style={{
                                                                width: '8px',
                                                                height: '8px',
                                                                background: '#4CAF50',
                                                                borderRadius: '50%'
                                                            }}></div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                                                {t('no_notifications')}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Профиль пользователя */}
                            <div className="user-profile">
                                <button 
                                    className="profile-btn"
                                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        background: 'none',
                                        border: '1px solid #ddd',
                                        borderRadius: '20px',
                                        padding: '5px 15px',
                                        cursor: 'pointer',
                                        gap: '8px'
                                    }}
                                >
                                    <div style={{
                                        width: '30px',
                                        height: '30px',
                                        background: '#4CAF50',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <span>{user.name || "User"}</span>
                                    <span style={{ fontSize: '12px' }}>▼</span>
                                </button>
                                
                                {showProfileDropdown && (
                                    <div className="profile-dropdown" style={{
                                        position: 'absolute',
                                        top: '50px',
                                        right: '0',
                                        background: 'white',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        width: '200px',
                                        zIndex: 1001
                                    }}>
                                        <Link 
                                            to="/profile" 
                                            className="dropdown-item"
                                            style={{
                                                display: 'block',
                                                padding: '12px 15px',
                                                textDecoration: 'none',
                                                color: '#333',
                                                borderBottom: '1px solid #f5f5f5'
                                            }}
                                            onClick={() => setShowProfileDropdown(false)}
                                        >
                                            👤 {t('profile')}
                                        </Link>
                                        <button 
                                            onClick={handleLogout}
                                            className="dropdown-item"
                                            style={{
                                                display: 'block',
                                                width: '100%',
                                                padding: '12px 15px',
                                                textAlign: 'left',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#333'
                                            }}
                                        >
                                            🚪 {t('logout')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Стили для мобильного меню */}
            <style jsx>{`
                @media (max-width: 768px) {
                    .burger-menu {
                        display: block !important;
                        width: 30px;
                        height: 20px;
                        position: relative;
                    }
                    
                    .burger-menu span {
                        display: block;
                        position: absolute;
                        height: 3px;
                        width: 100%;
                        background: #333;
                        border-radius: 3px;
                        transition: 0.3s;
                    }
                    
                    .burger-menu span:nth-child(1) {
                        top: 0;
                    }
                    
                    .burger-menu span:nth-child(2) {
                        top: 8px;
                    }
                    
                    .burger-menu span:nth-child(3) {
                        top: 16px;
                    }
                    
                    .burger-menu.active span:nth-child(1) {
                        transform: rotate(45deg);
                        top: 8px;
                    }
                    
                    .burger-menu.active span:nth-child(2) {
                        opacity: 0;
                    }
                    
                    .burger-menu.active span:nth-child(3) {
                        transform: rotate(-45deg);
                        top: 8px;
                    }
                    
                    .nav-menu {
                        position: fixed;
                        top: 70px;
                        left: -100%;
                        width: 100%;
                        height: calc(100vh - 70px);
                        background: white;
                        transition: 0.3s;
                        padding: 20px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    
                    .nav-menu.active {
                        left: 0;
                    }
                    
                    .nav-menu ul {
                        flex-direction: column;
                        gap: 20px;
                    }
                    
                    .user-section {
                        display: flex;
                        align-items: center;
                        gap: 15px;
                    }
                }
            `}</style>
        </header>
    );
};

export default Header;