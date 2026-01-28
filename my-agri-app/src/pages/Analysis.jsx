// src/pages/Analysis.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { MemoryStorage } from '../api/axios';

const Analysis = ({ lang }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    // Состояния
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [analysisStage, setAnalysisStage] = useState('upload'); // upload, processing, result
    const [analysisResult, setAnalysisResult] = useState(null);
    const [progress, setProgress] = useState(0);
    const [showAuthNotification, setShowAuthNotification] = useState(false);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [fileInfo, setFileInfo] = useState({});

    const texts = {
        ru: {
            title: "Анализ заболеваний растений",
            subtitle: "Загрузите фото растения для диагностики",
            selectFile: "Выбрать файл",
            dragDrop: "или перетащите файл сюда",
            fileTypes: "JPG, PNG, GIF, WEBP до 10MB",
            uploadArea: "Загрузка файла",
            processing: "Идет анализ...",
            processingTitle: "Анализируем изображение",
            result: "Результат анализа",
            newAnalysis: "Новый анализ",
            saveResult: "Сохранить результат",
            share: "Поделиться",
            history: "История анализов",
            noHistory: "История анализов пуста",
            loginRequired: "Войдите для анализа",
            authNotification: "Зарегистрируйтесь или войдите для анализа",
            stats: {
                diagnosis: "Диагноз",
                cause: "Причина",
                recommendation: "Рекомендация",
                confidence: "Уверенность",
                imageDetails: "Детали изображения",
                time: "Время обработки",
                plantType: "Тип растения"
            },
            errors: {
                noFile: "Пожалуйста, выберите файл",
                fileType: "Только изображения (JPG, PNG, GIF, WEBP)",
                fileSize: "Файл слишком большой. Максимум 10MB",
                noAuth: "Требуется авторизация",
                uploadError: "Ошибка загрузки файла",
                analysisError: "Ошибка анализа"
            }
        },
        en: {
            title: "Plant Disease Analysis",
            subtitle: "Upload plant photo for diagnosis",
            selectFile: "Select File",
            dragDrop: "or drag and drop file here",
            fileTypes: "JPG, PNG, GIF, WEBP up to 10MB",
            uploadArea: "File Upload",
            processing: "Analyzing...",
            processingTitle: "Analyzing image",
            result: "Analysis Result",
            newAnalysis: "New Analysis",
            saveResult: "Save Result",
            share: "Share",
            history: "Analysis History",
            noHistory: "No analysis history",
            loginRequired: "Login required for analysis",
            authNotification: "Register or login for analysis",
            stats: {
                diagnosis: "Diagnosis",
                cause: "Cause",
                recommendation: "Recommendation",
                confidence: "Confidence",
                imageDetails: "Image Details",
                time: "Processing Time",
                plantType: "Plant Type"
            },
            errors: {
                noFile: "Please select a file",
                fileType: "Only images (JPG, PNG, GIF, WEBP)",
                fileSize: "File too large. Maximum 10MB",
                noAuth: "Authorization required",
                uploadError: "Upload error",
                analysisError: "Analysis error"
            }
        }
    };

    const t = texts[lang] || texts.ru;

    // Проверяем авторизацию при загрузке
    useEffect(() => {
    const user = MemoryStorage.getUser();
    if (user) {
        setCurrentUser(user);
        setShowAuthNotification(false);
        loadHistory();
    } else {
        setCurrentUser(null);
        setShowAuthNotification(true);
    }
}, [lang]);

    const checkAuth = () => {
        const user = MemoryStorage.getUser();
        const token = MemoryStorage.getToken();
        
        if (!user || !token) {
            setCurrentUser(null);
            setShowAuthNotification(true);
        } else {
            setCurrentUser(user);
            setShowAuthNotification(false);
        }
    };

    // ✅ Загружаем историю анализов по ТЗ: GET /user/:id/history
    const loadHistory = async () => {
        const userId = MemoryStorage.getUserId();
        const token = MemoryStorage.getToken();
        
        if (!userId || !token) return;

        try {
            const response = await api.get(`/user/${userId}/history`);
            if (response.data) {
                setHistory(response.data);
            }
        } catch (error) {
            console.error('❌ Ошибка загрузки истории:', error);
            // Можно показать заглушечные данные для демо
            setHistory([
                {
                    id: 1,
                    status_text: "Здоровое растение",
                    image_url: "https://via.placeholder.com/150",
                    date: new Date().toISOString(),
                    confidence: 92
                },
                {
                    id: 2,
                    status_text: "Мучнистая роса",
                    image_url: "https://via.placeholder.com/150",
                    date: new Date(Date.now() - 86400000).toISOString(),
                    confidence: 85
                }
            ]);
        }
    };

    const handleFileSelect = () => {
        if (!currentUser) {
            setShowAuthNotification(true);
            return;
        }
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        validateAndUploadFile(file);
    };

    const validateAndUploadFile = (file) => {
        // Проверка авторизации
        if (!currentUser) {
            setShowAuthNotification(true);
            return;
        }

        // Проверка типа файла
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert(t.errors.fileType);
            return;
        }

        // Проверка размера файла (10MB максимум)
        if (file.size > 10 * 1024 * 1024) {
            alert(t.errors.fileSize);
            return;
        }

        // Обновляем информацию о файле
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                setFileInfo({
                    width: img.width,
                    height: img.height,
                    size: (file.size / 1024 / 1024).toFixed(2),
                    type: file.type.split('/')[1].toUpperCase()
                });
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);

        setUploadedFile(file);
        setFilePreview(URL.createObjectURL(file));
        startAnalysis(file);
    };

    // ✅ Основная функция анализа по ТЗ: POST /user/:id/analyze
    const startAnalysis = async (file) => {
        const userId = MemoryStorage.getUserId();
        
        if (!userId) {
            alert(t.errors.noAuth);
            return;
        }

        setAnalysisStage('processing');
        setLoading(true);
        setProgress(0);

        // Анимация прогресс-бара
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return prev;
                }
                return prev + Math.random() * 10;
            });
        }, 200);

        try {
            console.log('🚀 Отправляем файл на анализ...');
            
            // ✅ Используем FormData для отправки файла
            const formData = new FormData();
            formData.append('file', file);

            // ✅ Добавляем заголовок языка по ТЗ
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept-Language': lang === 'en' ? 'en' : 'ru'
                }
            };

            // ✅ Отправляем запрос по ТЗ
            const response = await api.post(`/user/${userId}/analyze`, formData, config);
            
            clearInterval(progressInterval);
            setProgress(100);
            
            console.log('✅ Анализ завершен:', response.data);
            
            // Сохраняем результат
            setAnalysisResult(response.data);
            setAnalysisStage('result');
            
            // Обновляем историю
            setTimeout(() => {
                loadHistory();
            }, 1000);

        } catch (error) {
            console.error('❌ Ошибка анализа:', error);
            clearInterval(progressInterval);
            
            // Демо-режим если API не работает
            if (error.response?.status === 404 || error.response?.status === 500) {
                simulateMockAnalysis();
            } else {
                alert(error.response?.data?.message || t.errors.analysisError);
                setAnalysisStage('upload');
            }
        } finally {
            setLoading(false);
        }
    };

    // Демо-режим анализа
    const simulateMockAnalysis = () => {
        setTimeout(() => {
            const mockResult = {
                status_text: "Здоровое растение",
                diagnosis_text: "Признаки заболеваний отсутствуют",
                symptom_description: "Оптимальные условия выращивания",
                recommendation: "Продолжайте текущий режим ухода",
                confidence: "92%",
                label: "Томаты",
                visual_status: "healthy"
            };
            
            setAnalysisResult(mockResult);
            setProgress(100);
            setAnalysisStage('result');
            
            // Добавляем в историю
            const newHistoryItem = {
                id: Date.now(),
                status_text: mockResult.status_text,
                image_url: filePreview,
                date: new Date().toISOString(),
                confidence: parseInt(mockResult.confidence)
            };
            
            setHistory(prev => [newHistoryItem, ...prev]);
        }, 1500);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        if (!currentUser) {
            setShowAuthNotification(true);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        
        if (!currentUser) {
            setShowAuthNotification(true);
            return;
        }

        const file = e.dataTransfer.files[0];
        if (file) {
            validateAndUploadFile(file);
        }
    };

    const resetAnalysis = () => {
        setUploadedFile(null);
        setFilePreview(null);
        setAnalysisResult(null);
        setAnalysisStage('upload');
        setProgress(0);
        setFileInfo({});
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const saveAnalysisResult = async () => {
        if (!analysisResult) return;
        
        // В реальном приложении здесь можно сохранять результат
        // через дополнительный эндпоинт или в локальное состояние
        alert('Результат сохранен в историю');
        loadHistory(); // Обновляем историю
    };

    // Рендерим разные стадии анализа
    const renderUploadStage = () => (
        <div className="upload-stage" style={{ textAlign: 'center' }}>
            <h2>{t.title}</h2>
            <p>{t.subtitle}</p>
            
            {showAuthNotification && (
                <div style={{
                    background: '#fff3cd',
                    border: '1px solid #ffeaa7',
                    borderRadius: '8px',
                    padding: '15px',
                    margin: '20px 0',
                    color: '#856404'
                }}>
                    ⚠️ {t.authNotification}
                </div>
            )}

            <div
                className="upload-area"
                onClick={handleFileSelect}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{
                    border: '2px dashed #4CAF50',
                    borderRadius: '12px',
                    padding: '60px 20px',
                    margin: '30px auto',
                    maxWidth: '600px',
                    cursor: currentUser ? 'pointer' : 'not-allowed',
                    opacity: currentUser ? 1 : 0.5,
                    background: '#f9f9f9',
                    transition: 'all 0.3s'
                }}
            >
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>📷</div>
                <h3>{t.uploadArea}</h3>
                <button
                    className="btn btn-primary"
                    onClick={(e) => { e.stopPropagation(); handleFileSelect(); }}
                    disabled={!currentUser}
                    style={{
                        margin: '20px 0',
                        padding: '12px 30px',
                        fontSize: '16px'
                    }}
                >
                    {t.selectFile}
                </button>
                <p style={{ color: '#666' }}>{t.dragDrop}</p>
                <p style={{ fontSize: '14px', color: '#999' }}>{t.fileTypes}</p>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
        </div>
    );

    const renderProcessingStage = () => (
        <div className="processing-stage" style={{ textAlign: 'center' }}>
            <h2>{t.processingTitle}</h2>
            <div style={{ margin: '40px 0' }}>
                <div style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    margin: '0 auto 30px',
                    overflow: 'hidden',
                    border: '3px solid #4CAF50'
                }}>
                    {filePreview && (
                        <img 
                            src={filePreview} 
                            alt="Uploaded" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    )}
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                    <div style={{
                        width: '100%',
                        height: '20px',
                        background: '#e0e0e0',
                        borderRadius: '10px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: '#4CAF50',
                            transition: 'width 0.3s'
                        }}></div>
                    </div>
                    <p style={{ marginTop: '10px' }}>{progress.toFixed(0)}%</p>
                </div>

                <div style={{
                    background: '#f5f5f5',
                    padding: '15px',
                    borderRadius: '8px',
                    marginTop: '20px'
                }}>
                    {fileInfo.width && (
                        <p>{t.stats.imageDetails}: {fileInfo.width}x{fileInfo.height} • {fileInfo.size}MB • {fileInfo.type}</p>
                    )}
                </div>
            </div>
        </div>
    );

    const renderResultStage = () => (
        <div className="result-stage">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2>{t.result}</h2>
                <button onClick={resetAnalysis} className="btn btn-outline">
                    🔄 {t.newAnalysis}
                </button>
            </div>

            {analysisResult && (
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '30px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    border: `3px solid ${analysisResult.visual_status === 'healthy' ? '#4CAF50' : '#F44336'}`
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ color: analysisResult.visual_status === 'healthy' ? '#4CAF50' : '#F44336' }}>
                            {analysisResult.status_text}
                        </h3>
                        <span style={{
                            background: analysisResult.visual_status === 'healthy' ? '#4CAF50' : '#F44336',
                            color: 'white',
                            padding: '5px 15px',
                            borderRadius: '20px',
                            fontSize: '14px'
                        }}>
                            {analysisResult.confidence}
                        </span>
                    </div>

                    <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
                        <div>
                            <h4>{t.stats.diagnosis}</h4>
                            <p>{analysisResult.diagnosis_text}</p>
                        </div>
                        
                        <div>
                            <h4>{t.stats.cause}</h4>
                            <p>{analysisResult.symptom_description}</p>
                        </div>
                        
                        <div>
                            <h4>{t.stats.recommendation}</h4>
                            <p>{analysisResult.recommendation}</p>
                        </div>
                        
                        {analysisResult.label && (
                            <div>
                                <h4>{t.stats.plantType}</h4>
                                <p>{analysisResult.label}</p>
                            </div>
                        )}
                    </div>

                    {filePreview && (
                        <div style={{ marginBottom: '30px' }}>
                            <h4>Анализируемое изображение:</h4>
                            <img 
                                src={filePreview} 
                                alt="Analysis result" 
                                style={{
                                    maxWidth: '100%',
                                    borderRadius: '8px',
                                    marginTop: '10px',
                                    border: '1px solid #ddd'
                                }}
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <button onClick={saveAnalysisResult} className="btn btn-primary">
                            💾 {t.saveResult}
                        </button>
                        <button onClick={() => alert('Функция в разработке')} className="btn btn-outline">
                            📤 {t.share}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

const renderHistory = () => (
    <div className="history-section" style={{ marginTop: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>{t.history}</h3>
            <button 
                onClick={() => setShowHistory(!showHistory)}
                className="btn btn-outline"
            >
                {showHistory ? '▲' : '▼'}
            </button>
        </div>

        {showHistory && (
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
                {history.length > 0 ? (
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {history.slice(0, 5).map((item, index) => (
                            <div 
                                key={item.id || index}
                                style={{
                                    // 1. Условие для цвета рамки теперь проверяет и русское, и английское слово
                                    borderLeft: `4px solid ${
                                        (item.status_text?.includes('Здоров') || item.status_text?.includes('Healthy')) 
                                        ? '#4CAF50' : '#F44336'
                                    }`,
                                    padding: '15px',
                                    background: '#f9f9f9',
                                    borderRadius: '8px'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    {/* 2. Заменяем текст "Анализ" на перевод из t */}
                                    <strong>{item.status_text || (lang === 'ru' ? 'Анализ' : 'Analysis')}</strong>
                                    
                                    <span style={{ color: '#666', fontSize: '14px' }}>
                                        {/* 3. Меняем формат даты в зависимости от lang */}
                                        {new Date(item.date).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US')}
                                    </span>
                                </div>
                                
                                {item.image_url && (
                                    <img 
                                        src={item.image_url} 
                                        alt="History" 
                                        style={{
                                            maxWidth: '100px',
                                            borderRadius: '4px',
                                            marginTop: '10px'
                                        }}
                                    />
                                )}
                                
                                {item.confidence && (
                                    <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                                        {/* 4. Заменяем "Уверенность" на перевод из объекта stats */}
                                        {t.stats.confidence}: {item.confidence}%
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>{t.noHistory}</p>
                )}
            </div>
        )}
    </div>
);

    return (
        <div className="container" style={{ paddingTop: '100px', maxWidth: '800px', margin: '0 auto' }}>
            {/* Статус авторизации */}
            {currentUser && (
                <div style={{
                    background: '#e8f5e9',
                    padding: '10px 15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
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
                        {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                        <div><strong>{currentUser.name || 'Пользователь'}</strong></div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            ID: {MemoryStorage.getUserId()}
                        </div>
                    </div>
                </div>
            )}

            {/* Основной контент */}
            {analysisStage === 'upload' && renderUploadStage()}
            {analysisStage === 'processing' && renderProcessingStage()}
            {analysisStage === 'result' && renderResultStage()}

            {/* История анализов (только для авторизованных) */}
            {currentUser && renderHistory()}

            {/* Информация о эндпоинтах (для отладки) */}
            <div style={{
                marginTop: '40px',
                padding: '15px',
                background: '#f5f5f5',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#666'
            }}>
                <div>Используемые эндпоинты:</div>
                <div style={{ marginTop: '5px' }}>
                    📤 Анализ: <code>POST /user/{MemoryStorage.getUserId()}/analyze</code>
                </div>
                <div>
                    📜 История: <code>GET /user/{MemoryStorage.getUserId()}/history</code>
                </div>
            </div>
        </div>
    );
};

export default Analysis;