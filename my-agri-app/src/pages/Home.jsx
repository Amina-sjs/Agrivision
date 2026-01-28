// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MemoryStorage } from '../api/axios';

const Home = ({ lang }) => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [testimonialIndex, setTestimonialIndex] = useState(0);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showLibraryModal, setShowLibraryModal] = useState(false);
    const [showDevelopmentModal, setShowDevelopmentModal] = useState(false);
    const [requestForm, setRequestForm] = useState({
        area: '',
        address: '',
        culture: '',
        date: '',
        phone: '',
        description: ''
    });
    const [activeSlide, setActiveSlide] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const texts = {
        ru: {
            hero: {
                title: "AgriVision",
                subtitle: "Интеллектуальная система диагностики заболеваний растений",
                startAnalysis: "Начать анализ",
                request: "Отправить заявку",
                forFarmers: "Работаем для фармеров сегодня"
            },
            capabilities: {
                title: "НАШИ ВОЗМОЖНОСТИ",
                description: "Наши технологии помогают экономить ресурсы, беречь природу и увеличивать урожай.",
                items: [
                    {
                        title: "Анализ состояния растений с воздуха",
                        description: "Мониторинг полей с помощью дронов для раннего выявления проблем с растениями и почвой."
                    },
                    {
                        title: "Прогноз урожайности",
                        description: "Точное прогнозирование урожая на основе анализа данных и метеорологических условий."
                    },
                    {
                        title: "Все данные в одном месте",
                        description: "Централизованная платформа для управления всеми сельскохозяйственными процессами."
                    },
                    {
                        title: "Снижение использования химикатов",
                        description: "Точечное применение средств защиты растений, минимизирующее воздействие на окружающую среду."
                    }
                ]
            },
            about: {
                title: "AgriVision — умные решения для фермеров",
                description: "Мы объединяем дроны, аналитику и ИИ, чтобы вы получали точные данные о своих полях и принимали решения вовремя.",
                stats: "+30% рост урожайности",
                features: [
                    "Аналитика в реальном времени",
                    "Рекомендации для вас"
                ],
                descriptions: [
                    "Мгновенный доступ к данным о состоянии ваших полей",
                    "Индивидуальные советы для каждого участка поля"
                ]
            },
            technologies: {
                title: "Технологии, которые работают на ваш урожай",
                tryAnalysis: "Попробовать анализ",
                sendRequest: "Отправить заявку"
            },
            howItWorks: {
                title: "Как работает AgriVision",
                description: "AgriVision использует дроны и искусственный интеллект для анализа полей, выявляет проблемы и помогает фермерам принимать решения.",
                steps: [
                    {
                        icon: "📤",
                        title: "Загрузка",
                        description: "Загрузите фото или видео растения"
                    },
                    {
                        icon: "🤖",
                        title: "Анализ ИИ",
                        description: "Наш ИИ анализирует изображение"
                    },
                    {
                        icon: "⚙️",
                        title: "Обработка",
                        description: "Сравнение с базой данных болезней"
                    },
                    {
                        icon: "📊",
                        title: "Отчет",
                        description: "Полный отчет с рекомендациями"
                    }
                ],
                footer: "AgriVision — умные решения"
            },
            whyChoose: {
                title: "Почему выбирают AgriVision",
                description: "Мы создаём технологии, которые помогают фермерам работать эффективнее, снижать потери и повышать урожайность.",
                more: "Подробнее",
                features: [
                    {
                        icon: "🚀",
                        title: "Инновационные технологии",
                        description: "Используем последние достижения в области дронов и ИИ"
                    },
                    {
                        icon: "👆",
                        title: "Простота использования",
                        description: "Интуитивный интерфейс, не требующий специальных знаний"
                    },
                    {
                        icon: "🕒",
                        title: "Поддержка 24/7",
                        description: "Наша команда всегда готова помочь с любыми вопросами"
                    },
                    {
                        icon: "📈",
                        title: "Доказанная эффективность",
                        description: "Результаты наших клиентов подтверждают эффективность"
                    }
                ]
            },
            testimonials: {
                title: "Отзывы",
                description: "Наши клиенты делятся своими успехами и впечатлениями от работы с AgriVision.",
                items: [
                    {
                        name: "Мария Смирнова",
                        role: "Владелец виноградника в Калининграде",
                        text: "AgriVision помог нам выявить болезнь винограда на ранней стадии. Благодаря своевременным рекомендациям мы спасли 90% урожая!",
                        avatar: "👩‍🌾"
                    },
                    {
                        name: "Иван Петров",
                        role: "Фермер, Краснодарский край",
                        text: "Система мониторинга полей позволила сократить расход воды на 40% и увеличить урожайность пшеницы на 25%.",
                        avatar: "👨‍🌾"
                    },
                    {
                        name: "Ольга Козлова",
                        role: "Агроном, Тамбовская область",
                        text: "Точный прогноз урожайности помог оптимизировать логистику и сократить потери при хранении.",
                        avatar: "👩‍🔬"
                    }
                ]
            },
            modals: {
                library: {
                    title: "Библиотека знаний",
                    content: "Библиотека находится в разработке. Скоро здесь будет доступна база знаний по заболеваниям растений и агротехнике.",
                    close: "Закрыть"
                },
                development: {
                    title: "Раздел в разработке",
                    content: "Данный раздел находится в разработке. Мы работаем над его созданием!",
                    close: "Закрыть"
                },
                request: {
                    title: "Оставить заявку",
                    fields: {
                        area: "Площадь участка (га)*",
                        address: "Адрес/Локация*",
                        culture: "Культура*",
                        date: "Дата*",
                        phone: "Телефон*",
                        description: "Описание проблемы"
                    },
                    submit: "Отправить заявку",
                    cancel: "Отмена"
                }
            }
        },
        en: {
            hero: {
                title: "AgriVision",
                subtitle: "Intelligent plant disease diagnosis system",
                startAnalysis: "Start Analysis",
                request: "Submit Request",
                forFarmers: "Working for farmers today"
            },
            capabilities: {
                title: "OUR CAPABILITIES",
                description: "Our technologies help save resources, protect nature and increase yield.",
                items: [
                    {
                        title: "Plant health analysis from the air",
                        description: "Field monitoring with drones for early detection of plant and soil problems."
                    },
                    {
                        title: "Yield forecast",
                        description: "Accurate harvest forecasting based on data analysis and meteorological conditions."
                    },
                    {
                        title: "All data in one place",
                        description: "Centralized platform for managing all agricultural processes."
                    },
                    {
                        title: "Reduced chemical use",
                        description: "Precise application of plant protection products minimizing environmental impact."
                    }
                ]
            },
            about: {
                title: "AgriVision — smart solutions for farmers",
                description: "We combine drones, analytics and AI so you get accurate field data and make timely decisions.",
                stats: "+30% yield growth",
                features: [
                    "Real-time analytics",
                    "Personal recommendations"
                ],
                descriptions: [
                    "Instant access to your field condition data",
                    "Individual advice for each field section"
                ]
            },
            technologies: {
                title: "Technologies that work for your harvest",
                tryAnalysis: "Try Analysis",
                sendRequest: "Submit Request"
            },
            howItWorks: {
                title: "How AgriVision works",
                description: "AgriVision uses drones and artificial intelligence to analyze fields, identify problems and help farmers make decisions.",
                steps: [
                    {
                        icon: "📤",
                        title: "Upload",
                        description: "Upload photo or video of plant"
                    },
                    {
                        icon: "🤖",
                        title: "AI Analysis",
                        description: "Our AI analyzes the image"
                    },
                    {
                        icon: "⚙️",
                        title: "Processing",
                        description: "Comparison with disease database"
                    },
                    {
                        icon: "📊",
                        title: "Report",
                        description: "Complete report with recommendations"
                    }
                ],
                footer: "AgriVision — smart solutions"
            },
            whyChoose: {
                title: "Why choose AgriVision",
                description: "We create technologies that help farmers work more efficiently, reduce losses and increase yield.",
                more: "Learn more",
                features: [
                    {
                        icon: "🚀",
                        title: "Innovative technologies",
                        description: "We use the latest achievements in drones and AI"
                    },
                    {
                        icon: "👆",
                        title: "Easy to use",
                        description: "Intuitive interface, no special knowledge required"
                    },
                    {
                        icon: "🕒",
                        title: "24/7 support",
                        description: "Our team is always ready to help with any questions"
                    },
                    {
                        icon: "📈",
                        title: "Proven effectiveness",
                        description: "Our clients' results confirm effectiveness"
                    }
                ]
            },
            testimonials: {
                title: "Testimonials",
                description: "Our clients share their successes and impressions from working with AgriVision.",
                items: [
                    {
                        name: "Maria Smirnova",
                        role: "Vineyard owner in Kaliningrad",
                        text: "AgriVision helped us detect grape disease at an early stage. Thanks to timely recommendations, we saved 90% of the harvest!",
                        avatar: "👩‍🌾"
                    },
                    {
                        name: "Ivan Petrov",
                        role: "Farmer, Krasnodar region",
                        text: "The field monitoring system allowed us to reduce water consumption by 40% and increase wheat yield by 25%.",
                        avatar: "👨‍🌾"
                    },
                    {
                        name: "Olga Kozlova",
                        role: "Agronomist, Tambov region",
                        text: "Accurate yield forecast helped optimize logistics and reduce storage losses.",
                        avatar: "👩‍🔬"
                    }
                ]
            },
            modals: {
                library: {
                    title: "Knowledge Library",
                    content: "The library is under development. A knowledge base on plant diseases and agricultural technology will be available here soon.",
                    close: "Close"
                },
                development: {
                    title: "Section under development",
                    content: "This section is under development. We are working on its creation!",
                    close: "Close"
                },
                request: {
                    title: "Submit Request",
                    fields: {
                        area: "Plot area (ha)*",
                        address: "Address/Location*",
                        culture: "Crop*",
                        date: "Date*",
                        phone: "Phone*",
                        description: "Problem description"
                    },
                    submit: "Submit Request",
                    cancel: "Cancel"
                }
            }
        }
    };

    const t = texts[lang] || texts.ru;

    // Проверяем авторизацию
    useEffect(() => {
        const user = MemoryStorage.getUser();
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    // Автоматическая смена слайдов отзывов
    useEffect(() => {
        const interval = setInterval(() => {
            setTestimonialIndex(prev => 
                prev < t.testimonials.items.length - 1 ? prev + 1 : 0
            );
        }, 5000);
        
        return () => clearInterval(interval);
    }, [t.testimonials.items.length]);

    // Обработчики навигации
    const handleNavClick = (section, e) => {
        e?.preventDefault();
        
        switch(section) {
            case 'analysis':
                navigate('/analysis');
                break;
            case 'library':
                setShowLibraryModal(true);
                break;
            case 'request':
                setShowRequestModal(true);
                break;
            case 'home':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            default:
                setShowDevelopmentModal(true);
        }
        
        // Закрываем мобильное меню
        setIsMenuOpen(false);
    };

    // Обработчик отправки заявки
    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        
        // Проверяем авторизацию
        if (!currentUser) {
            alert(lang === 'ru' ? 'Пожалуйста, войдите в систему' : 'Please login');
            return;
        }

        // Валидация
        if (!requestForm.area || !requestForm.address || !requestForm.culture || !requestForm.date || !requestForm.phone) {
            alert(lang === 'ru' ? 'Заполните обязательные поля' : 'Fill required fields');
            return;
        }

        try {
            const userId = MemoryStorage.getUserId();
            const token = MemoryStorage.getToken();
            
            if (!userId || !token) {
                throw new Error('Not authenticated');
            }

            // ✅ Отправляем заявку по ТЗ: POST /user/:id/service-request
            const response = await fetch(`http://172.20.10.3:5000/user/${userId}/service-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    phone: requestForm.phone,
                    location: requestForm.address,
                    plants_description: requestForm.description || `${requestForm.culture}, ${requestForm.area}га`
                })
            });

            if (response.ok) {
                alert(lang === 'ru' ? 'Заявка отправлена!' : 'Request submitted!');
                setShowRequestModal(false);
                setRequestForm({
                    area: '',
                    address: '',
                    culture: '',
                    date: '',
                    phone: '',
                    description: ''
                });
            } else {
                throw new Error('Request failed');
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            alert(lang === 'ru' ? 'Ошибка отправки заявки' : 'Error submitting request');
        }
    };

    // Рендер Hero секции
    const renderHero = () => (
        <section id="hero" style={{
            background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
            color: 'white',
            padding: '100px 20px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: 'bold' }}>
                    {t.hero.title}
                </h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
                    {t.hero.subtitle}
                </p>
                
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button 
                        onClick={() => navigate('/analysis')}
                        style={{
                            padding: '15px 30px',
                            fontSize: '1.1rem',
                            background: 'white',
                            color: '#4CAF50',
                            border: 'none',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        {t.hero.startAnalysis}
                    </button>
                    
                    <button 
                        onClick={() => setShowRequestModal(true)}
                        style={{
                            padding: '15px 30px',
                            fontSize: '1.1rem',
                            background: 'transparent',
                            color: 'white',
                            border: '2px solid white',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'white';
                            e.target.style.color = '#4CAF50';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = 'white';
                        }}
                    >
                        {t.hero.request}
                    </button>
                </div>
                
                <div style={{ marginTop: '60px', fontSize: '1.1rem' }}>
                    {t.hero.forFarmers}
                </div>
            </div>
        </section>
    );

    // Рендер Возможности
    const renderCapabilities = () => (
        <section id="capabilities" style={{ padding: '80px 20px', background: '#f9f9f9' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ 
                    textAlign: 'center', 
                    marginBottom: '20px',
                    fontSize: '2rem',
                    color: '#333'
                }}>
                    {t.capabilities.title}
                </h2>
                <p style={{ 
                    textAlign: 'center', 
                    marginBottom: '50px',
                    fontSize: '1.1rem',
                    color: '#666',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    {t.capabilities.description}
                </p>
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '30px'
                }}>
                    {t.capabilities.items.map((item, index) => (
                        <div 
                            key={index}
                            style={{
                                background: 'white',
                                padding: '30px',
                                borderRadius: '15px',
                                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s',
                                transform: hoveredIndex === index ? 'translateY(-10px)' : 'none',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <h3 style={{ 
                                marginBottom: '15px',
                                fontSize: '1.3rem',
                                color: '#4CAF50'
                            }}>
                                {item.title}
                            </h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    // Рендер О нас
    const renderAbout = () => (
        <section id="about" style={{ padding: '80px 20px', background: 'white' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '60px',
                    alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{ 
                            fontSize: '2.2rem',
                            marginBottom: '20px',
                            color: '#333'
                        }}>
                            {t.about.title}
                        </h2>
                        <p style={{ 
                            fontSize: '1.1rem',
                            marginBottom: '30px',
                            color: '#666',
                            lineHeight: '1.6'
                        }}>
                            {t.about.description}
                        </p>
                        
                        <div style={{
                            display: 'inline-block',
                            background: '#4CAF50',
                            color: 'white',
                            padding: '10px 25px',
                            borderRadius: '25px',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            marginBottom: '30px'
                        }}>
                            {t.about.stats}
                        </div>
                        
                        <div style={{ display: 'grid', gap: '20px' }}>
                            {t.about.features.map((feature, index) => (
                                <div key={index}>
                                    <h4 style={{ 
                                        fontSize: '1.2rem',
                                        marginBottom: '8px',
                                        color: '#333'
                                    }}>
                                        {feature}
                                    </h4>
                                    <p style={{ color: '#666' }}>
                                        {t.about.descriptions[index]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div style={{
                        background: '#f5f5f5',
                        padding: '40px',
                        borderRadius: '15px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🌱</div>
                        <h3 style={{ marginBottom: '15px', color: '#333' }}>
                            {t.technologies.title}
                        </h3>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button 
                                onClick={() => navigate('/analysis')}
                                style={{
                                    padding: '12px 25px',
                                    background: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                {t.technologies.tryAnalysis}
                            </button>
                            <button 
                                onClick={() => setShowRequestModal(true)}
                                style={{
                                    padding: '12px 25px',
                                    background: 'transparent',
                                    color: '#4CAF50',
                                    border: '2px solid #4CAF50',
                                    borderRadius: '25px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                {t.technologies.sendRequest}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    // Рендер Как работает
    const renderHowItWorks = () => (
        <section id="how-it-works" style={{ padding: '80px 20px', background: '#f9f9f9' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ 
                    textAlign: 'center',
                    fontSize: '2.2rem',
                    marginBottom: '20px',
                    color: '#333'
                }}>
                    {t.howItWorks.title}
                </h2>
                <p style={{ 
                    textAlign: 'center',
                    marginBottom: '50px',
                    fontSize: '1.1rem',
                    color: '#666',
                    maxWidth: '700px',
                    margin: '0 auto 50px'
                }}>
                    {t.howItWorks.description}
                </p>
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '30px',
                    textAlign: 'center'
                }}>
                    {t.howItWorks.steps.map((step, index) => (
                        <div key={index} style={{
                            padding: '30px 20px',
                            background: 'white',
                            borderRadius: '15px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s'
                        }}>
                            <div style={{ 
                                fontSize: '3rem',
                                marginBottom: '20px'
                            }}>
                                {step.icon}
                            </div>
                            <h3 style={{ 
                                marginBottom: '15px',
                                fontSize: '1.3rem',
                                color: '#333'
                            }}>
                                {step.title}
                            </h3>
                            <p style={{ color: '#666' }}>
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
                
                <div style={{ 
                    textAlign: 'center',
                    marginTop: '50px',
                    fontSize: '1.2rem',
                    color: '#4CAF50',
                    fontWeight: 'bold'
                }}>
                    {t.howItWorks.footer}
                </div>
            </div>
        </section>
    );

    // Рендер Почему выбирают
    const renderWhyChoose = () => (
        <section id="why-choose" style={{ padding: '80px 20px', background: 'white' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ 
                    textAlign: 'center',
                    fontSize: '2.2rem',
                    marginBottom: '20px',
                    color: '#333'
                }}>
                    {t.whyChoose.title}
                </h2>
                <p style={{ 
                    textAlign: 'center',
                    marginBottom: '30px',
                    fontSize: '1.1rem',
                    color: '#666',
                    maxWidth: '700px',
                    margin: '0 auto 30px'
                }}>
                    {t.whyChoose.description}
                </p>
                
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <button 
                        onClick={() => setShowDevelopmentModal(true)}
                        style={{
                            padding: '12px 30px',
                            background: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold'
                        }}
                    >
                        {t.whyChoose.more}
                    </button>
                </div>
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '30px'
                }}>
                    {t.whyChoose.features.map((feature, index) => (
                        <div key={index} style={{
                            textAlign: 'center',
                            padding: '30px',
                            background: '#f9f9f9',
                            borderRadius: '15px',
                            transition: 'all 0.3s'
                        }}>
                            <div style={{ 
                                fontSize: '2.5rem',
                                marginBottom: '20px'
                            }}>
                                {feature.icon}
                            </div>
                            <h3 style={{ 
                                marginBottom: '15px',
                                fontSize: '1.3rem',
                                color: '#333'
                            }}>
                                {feature.title}
                            </h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    // Рендер Отзывы
    const renderTestimonials = () => (
        <section id="testimonials" style={{ padding: '80px 20px', background: '#f9f9f9' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h2 style={{ 
                    textAlign: 'center',
                    fontSize: '2.2rem',
                    marginBottom: '20px',
                    color: '#333'
                }}>
                    {t.testimonials.title}
                </h2>
                <p style={{ 
                    textAlign: 'center',
                    marginBottom: '50px',
                    fontSize: '1.1rem',
                    color: '#666'
                }}>
                    {t.testimonials.description}
                </p>
                
                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    position: 'relative'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '15px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                        minHeight: '250px'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <div style={{
                                fontSize: '3rem',
                                marginRight: '20px'
                            }}>
                                {t.testimonials.items[testimonialIndex].avatar}
                            </div>
                            <div>
                                <h3 style={{ marginBottom: '5px', color: '#333' }}>
                                    {t.testimonials.items[testimonialIndex].name}
                                </h3>
                                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                                    {t.testimonials.items[testimonialIndex].role}
                                </p>
                            </div>
                        </div>
                        <p style={{ 
                            fontSize: '1.1rem',
                            lineHeight: '1.6',
                            color: '#555'
                        }}>
                            {t.testimonials.items[testimonialIndex].text}
                        </p>
                    </div>
                    
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '30px',
                        gap: '10px'
                    }}>
                        {t.testimonials.items.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setTestimonialIndex(index)}
                                style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: index === testimonialIndex ? '#4CAF50' : '#ddd',
                                    cursor: 'pointer'
                                }}
                            />
                        ))}
                    </div>
                    
                    <button
                        onClick={() => setTestimonialIndex(prev => 
                            prev > 0 ? prev - 1 : t.testimonials.items.length - 1
                        )}
                        style={{
                            position: 'absolute',
                            left: '-50px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'white',
                            border: 'none',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            fontSize: '1.2rem'
                        }}
                    >
                        ←
                    </button>
                    
                    <button
                        onClick={() => setTestimonialIndex(prev => 
                            prev < t.testimonials.items.length - 1 ? prev + 1 : 0
                        )}
                        style={{
                            position: 'absolute',
                            right: '-50px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'white',
                            border: 'none',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            fontSize: '1.2rem'
                        }}
                    >
                        →
                    </button>
                </div>
            </div>
        </section>
    );

    // Модальное окно разработки
    const renderDevelopmentModal = () => (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: showDevelopmentModal ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '15px',
                maxWidth: '500px',
                width: '90%',
                position: 'relative'
            }}>
                <button 
                    onClick={() => setShowDevelopmentModal(false)}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer'
                    }}
                >
                    ×
                </button>
                
                <h2 style={{ marginBottom: '20px' }}>
                    {t.modals.development.title}
                </h2>
                <p style={{ marginBottom: '30px', lineHeight: '1.6' }}>
                    {t.modals.development.content}
                </p>
                <button 
                    onClick={() => setShowDevelopmentModal(false)}
                    style={{
                        padding: '10px 30px',
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {t.modals.development.close}
                </button>
            </div>
        </div>
    );

    // Модальное окно заявки
    const renderRequestModal = () => (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: showRequestModal ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '15px',
                maxWidth: '600px',
                width: '90%',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <button 
                    onClick={() => setShowRequestModal(false)}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer'
                    }}
                >
                    ×
                </button>
                
                <h2 style={{ marginBottom: '30px' }}>
                    {t.modals.request.title}
                </h2>
                
                <form onSubmit={handleRequestSubmit}>
                    <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                {t.modals.request.fields.area}
                            </label>
                            <input
                                type="number"
                                value={requestForm.area}
                                onChange={(e) => setRequestForm({...requestForm, area: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    fontSize: '16px'
                                }}
                                required
                            />
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                {t.modals.request.fields.address}
                            </label>
                            <input
                                type="text"
                                value={requestForm.address}
                                onChange={(e) => setRequestForm({...requestForm, address: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    fontSize: '16px'
                                }}
                                required
                            />
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                {t.modals.request.fields.culture}
                            </label>
                            <input
                                type="text"
                                value={requestForm.culture}
                                onChange={(e) => setRequestForm({...requestForm, culture: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    fontSize: '16px'
                                }}
                                required
                            />
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                {t.modals.request.fields.date}
                            </label>
                            <input
                                type="date"
                                value={requestForm.date}
                                onChange={(e) => setRequestForm({...requestForm, date: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    fontSize: '16px'
                                }}
                                required
                            />
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                {t.modals.request.fields.phone}
                            </label>
                            <input
                                type="tel"
                                value={requestForm.phone}
                                onChange={(e) => setRequestForm({...requestForm, phone: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    fontSize: '16px'
                                }}
                                required
                            />
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                                {t.modals.request.fields.description}
                            </label>
                            <textarea
                                value={requestForm.description}
                                onChange={(e) => setRequestForm({...requestForm, description: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    minHeight: '100px'
                                }}
                            />
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                        <button 
                            type="button"
                            onClick={() => setShowRequestModal(false)}
                            style={{
                                padding: '12px 25px',
                                background: '#f5f5f5',
                                color: '#333',
                                border: 'none',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {t.modals.request.cancel}
                        </button>
                        <button 
                            type="submit"
                            style={{
                                padding: '12px 25px',
                                background: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {t.modals.request.submit}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <div className="home-page">
            {renderHero()}
            {renderCapabilities()}
            {renderAbout()}
            {renderHowItWorks()}
            {renderWhyChoose()}
            {renderTestimonials()}
           
            
            {/* {renderLibraryModal()}
            {renderDevelopmentModal()}
            {renderRequestModal()} */}
        </div>
    );
};

export default Home;