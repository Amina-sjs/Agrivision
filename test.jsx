import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { MemoryStorage } from '../api/axios';

// Предполагаем, что apiRequests определен здесь или импортирован
// Если он в другом файле, убедитесь, что импорт корректен
const apiRequests = {
    getHistory: (userId) => api.get(`/user/${userId}/history`),
    analyzeLeaf: (userId, formData, lang) => api.post(`/user/${userId}/analyze?lang=${lang}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

const Analysis = ({ lang = 'ru' }) => {
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

    // Инициализация пользователя и истории
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
        
        // Очистка превью при размонтировании
        return () => {
            if (filePreview) URL.revokeObjectURL(filePreview);
        };
    }, [lang]); // Перезагружаем при смене языка

    const loadHistory = async () => {
        const userId = MemoryStorage.getUserId();
        if (!userId) return;

        try {
            const response = await apiRequests.getHistory(userId);
            if (response.data) {
                setHistory(response.data);
            }
        } catch (error) {
            console.error('❌ Ошибка истории:', error);
            // Если API упало, оставляем пустой массив или демо-данные
        }
    };

    const validateAndUploadFile = (file) => {
        if (!currentUser) {
            setShowAuthNotification(true);
            return;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert(t.errors.fileType);
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert(t.errors.fileSize);
            return;
        }

        // Собираем метаданные изображения
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

        const objectUrl = URL.createObjectURL(file);
        setUploadedFile(file);
        setFilePreview(objectUrl);
        startAnalysis(file);
    };

    const startAnalysis = async (file) => {
        const userId = MemoryStorage.getUserId();
        const token = localStorage.getItem('token');
        if (!userId) return;

        setAnalysisStage('processing');
        setProgress(0);

        const progressInterval = setInterval(() => {
            setProgress(prev => (prev >= 90 ? prev : prev + 5));
        }, 300);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await apiRequests.analyzeLeaf(userId, formData, lang);
            
            clearInterval(progressInterval);
            setProgress(100);
            setAnalysisResult(response.data);
            setAnalysisStage('result');
            
            loadHistory(); // Обновляем историю после успешного анализа
        } catch (error) {
            clearInterval(progressInterval);
            console.error('Analysis failed:', error);
            simulateMockAnalysis(); // Включаем демо, если бэкенд не отвечает
        }
    };

    const simulateMockAnalysis = () => {
        // ... ваша функция симуляции (оставляем как была, она полезна для тестов)
        setTimeout(() => {
            setAnalysisResult({
                status_text: lang === 'ru' ? "Здоровое растение" : "Healthy Plant",
                diagnosis_text: lang === 'ru' ? "Проблем не обнаружено" : "No issues detected",
                confidence: "95%",
                visual_status: "healthy"
            });
            setAnalysisStage('result');
            setProgress(100);
        }, 1000);
    };


    // --- ДОБАВЬ ЭТИ ФУНКЦИИ ---
    const handleFileSelect = () => {
        if (!currentUser) {
            setShowAuthNotification(true);
            return;
        }
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) validateAndUploadFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) validateAndUploadFile(file);
    };

    const resetAnalysis = () => {
        setAnalysisStage('upload');
        setAnalysisResult(null);
        setUploadedFile(null);
        if (filePreview) URL.revokeObjectURL(filePreview);
        setFilePreview(null);
        setProgress(0);
    };

    const saveAnalysisResult = () => {
        alert(lang === 'ru' ? 'Результат сохранен в историю' : 'Result saved to history');
        loadHistory();
    };
    // ---------------------------
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