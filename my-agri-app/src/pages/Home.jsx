// src/pages/Home.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = ({ lang }) => {
    const texts = {
        ru: {
            heroTitle: "AgriVision: Будущее вашего урожая",
            heroSubtitle: "Используйте искусственный интеллект для анализа болезней растений по одной фотографии.",
            startAnalysis: "Начать анализ",
            createAccount: "Создать аккаунт",
            features: "Наши возможности",
            instantAnalysis: "Мгновенный анализ",
            instantDesc: "Определение болезней за считанные секунды с точностью до 98%.",
            statistics: "Статистика",
            statsDesc: "Отслеживайте историю состояний ваших полей в личном профиле.",
            accessibility: "Доступность",
            accessDesc: "Работает на любом устройстве — от смартфона до компьютера.",
            aboutTitle: "О проекте AgriVision",
            aboutText: "AgriVision — это современная система анализа заболеваний растений с использованием искусственного интеллекта. Наша цель — помочь фермерам и садоводам быстро и точно диагностировать проблемы с растениями.",
            requestTitle: "Оставить заявку",
            requestText: "Нужна помощь специалиста? Оставьте заявку на выезд агронома.",
            libraryTitle: "Библиотека знаний",
            libraryText: "Полезные статьи и справочная информация о заболеваниях растений.",
            underDevelopment: "В разработке"
        },
        en: {
            heroTitle: "AgriVision: The Future of Your Harvest",
            heroSubtitle: "Use artificial intelligence to analyze plant diseases with a single photo.",
            startAnalysis: "Start Analysis",
            createAccount: "Create Account",
            features: "Our Capabilities",
            instantAnalysis: "Instant Analysis",
            instantDesc: "Disease detection in seconds with up to 98% accuracy.",
            statistics: "Statistics",
            statsDesc: "Track the history of your field conditions in your personal profile.",
            accessibility: "Accessibility",
            accessDesc: "Works on any device - from smartphone to computer.",
            aboutTitle: "About AgriVision Project",
            aboutText: "AgriVision is a modern plant disease analysis system using artificial intelligence. Our goal is to help farmers and gardeners quickly and accurately diagnose plant problems.",
            requestTitle: "Submit Request",
            requestText: "Need specialist help? Leave a request for an agronomist visit.",
            libraryTitle: "Knowledge Library",
            libraryText: "Useful articles and reference information about plant diseases.",
            underDevelopment: "Under Development"
        }
    };

    const t = texts[lang] || texts.ru;

    // Функция для обработки кликов по навигации
    const handleNavClick = (sectionId, e) => {
        e.preventDefault();
        
        if (sectionId === 'analysis') {
            window.location.href = '/analysis';
            return;
        }
        
        if (sectionId === 'library') {
            alert(t.underDevelopment);
            return;
        }
        
        // Для остальных секций - плавный скролл
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else if (sectionId === 'hero') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="home-page">
            {/* Hero Section — Главный экран */}
            <section id="hero" className="hero" style={{ background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80") no-repeat center/cover', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <div className="hero-content" style={{ color: 'white', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>{t.heroTitle}</h1>
                        <p style={{ fontSize: '1.2rem', marginBottom: '30px', maxWidth: '600px', margin: '0 auto 30px' }}>{t.heroSubtitle}</p>
                        <div className="hero-btns" style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <Link to="/analysis" className="btn btn-primary" style={{ padding: '12px 30px', fontSize: '1.1rem' }}>{t.startAnalysis}</Link>
                            <Link to="/register" className="btn btn-outline" style={{ padding: '12px 30px', fontSize: '1.1rem', background: 'transparent', border: '2px solid white', color: 'white' }}>{t.createAccount}</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features — Преимущества */}
            <section id="features" className="features" style={{ padding: '80px 0', background: '#f9f9f9' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '50px', fontSize: '2.5rem' }}>{t.features}</h2>
                    <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        <div className="feature-card" style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                            <div className="icon" style={{ fontSize: '3rem', marginBottom: '20px' }}>🔍</div>
                            <h3 style={{ marginBottom: '15px' }}>{t.instantAnalysis}</h3>
                            <p>{t.instantDesc}</p>
                        </div>
                        <div className="feature-card" style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                            <div className="icon" style={{ fontSize: '3rem', marginBottom: '20px' }}>📊</div>
                            <h3 style={{ marginBottom: '15px' }}>{t.statistics}</h3>
                            <p>{t.statsDesc}</p>
                        </div>
                        <div className="feature-card" style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                            <div className="icon" style={{ fontSize: '3rem', marginBottom: '20px' }}>🌍</div>
                            <h3 style={{ marginBottom: '15px' }}>{t.accessibility}</h3>
                            <p>{t.accessDesc}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Analysis Section */}
            <section id="analysis" className="analysis-section" style={{ padding: '80px 0' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '2.5rem' }}>Анализ заболеваний</h2>
                    <p style={{ marginBottom: '30px', fontSize: '1.1rem' }}>Просто загрузите фото растения и получите мгновенный диагноз</p>
                    <Link to="/analysis" className="btn btn-primary" style={{ padding: '12px 30px', fontSize: '1.1rem' }}>Перейти к анализу</Link>
                </div>
            </section>

            {/* Library Section */}
            <section id="library" className="library-section" style={{ padding: '80px 0', background: '#f9f9f9' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '2.5rem' }}>{t.libraryTitle}</h2>
                    <p style={{ marginBottom: '30px', fontSize: '1.1rem' }}>{t.libraryText}</p>
                    <button 
                        className="btn btn-outline" 
                        style={{ padding: '12px 30px', fontSize: '1.1rem', background: 'transparent', border: '2px solid #4CAF50', color: '#4CAF50' }}
                        onClick={() => alert(t.underDevelopment)}
                    >
                        Открыть библиотеку
                    </button>
                </div>
            </section>

            {/* Request Section */}
            <section id="request" className="request-section" style={{ padding: '80px 0' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '2.5rem' }}>{t.requestTitle}</h2>
                    <p style={{ marginBottom: '30px', fontSize: '1.1rem' }}>{t.requestText}</p>
                    <button 
                        className="btn btn-primary" 
                        style={{ padding: '12px 30px', fontSize: '1.1rem' }}
                        onClick={() => alert("Форма заявки в разработке")}
                    >
                        Оставить заявку
                    </button>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about-section" style={{ padding: '80px 0', background: '#f9f9f9' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '2.5rem' }}>{t.aboutTitle}</h2>
                    <p style={{ marginBottom: '30px', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto' }}>{t.aboutText}</p>
                </div>
            </section>
        </div>
    );
};

export default Home;