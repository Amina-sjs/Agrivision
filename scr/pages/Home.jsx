import React from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <>
            <Header />
            <main>
                {/* Hero Section */}
                <section className="hero" id="hero">
                    <div className="container">
                        <div className="hero-content">
                            <h1>AgriVision — умное сельское хозяйство</h1>
                            <p className="hero-subtitle">Дроны и искусственный интеллект для мониторинга полей</p>
                            <div className="hero-buttons">
                                <button className="btn btn-primary">Отправить заявку</button>
                                <Link to="/analysis" className="btn btn-outline" style={{background: 'rgba(255,255,255,0.1)', color: 'white'}}>
                                    Проанализировать растения
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Секция возможностей (Features) */}
                <section className="features">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="text-primary">НАШИ ВОЗМОЖНОСТИ</h2>
                        </div>
                        <div className="features-grid">
                            <div className="feature-card">
                                <div className="feature-icon"><i className="fas fa-drone"></i></div>
                                <h3>Анализ с воздуха</h3>
                                <p>Мониторинг полей с помощью дронов.</p>
                            </div>
                            {/* Повтори для остальных карточек */}
                        </div>
                    </div>
                </section>
            </main>
            {/* Сюда можно добавить Footer */}
        </>
    );
};

export default Home;