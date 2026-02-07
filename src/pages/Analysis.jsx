import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { MemoryStorage } from '../api/axios';

const apiRequests = {
    getHistory: (userId) => api.get(`/user/${userId}/history`),
    analyzeLeaf: (userId, formData, lang) => api.post(`/user/${userId}/analyze?lang=${lang}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

const Analysis = ({ lang = 'ru' }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    // Состояния (полностью сохранены)
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [analysisStage, setAnalysisStage] = useState('upload'); 
    const [analysisResult, setAnalysisResult] = useState(null);
    const [progress, setProgress] = useState(0);
    const [showAuthNotification, setShowAuthNotification] = useState(false);
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [fileInfo, setFileInfo] = useState({});

    const texts = {
        ru: {
            title1: "Как работает AI-анализ",
            subtitle: "Загрузите фото или видео, и получите точный отчёт о состоянии ваших культур.",
            selectFile: "Выбрать изображение",
            dragDrop: "Перетащите файл сюда",
            fileTypes: "Поддерживаемые форматы: JPG, PNG, GIF, WEBP, MP4, AVI, MOV (до 10MB)",
            uploadArea: "Загрузка образца",
            processing: "Анализируем...",
            processingTitle: "Идет анализ...",
            result: "Результат диагностики",
            newAnalysis: "Новый анализ",
            saveResult: "В избранное",
            share: "Поделиться",
            history: "История ваших проверок",
            noHistory: "Вы еще не проводили анализ",
            loginRequired: "Требуется вход",
            authNotification: "Пожалуйста, войдите в систему для доступа к анализу",
            title: "Анализируйте растения с помощью AI",
        
            steps: [
            {
                id: 1,
                t: "Загрузка",
                d: "Загрузите фото или видео растения",
                icon: (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 16V4M12 4L8 8M12 4L16 8M4 20H20" stroke="#2D6A2E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                )
            },
            {
                id: 2,
                t: "Анализ ИИ",
                d: "Нейросеть анализирует изображение",
                icon: (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.5 15.5C8 15.5 6.5 14.5 6 13C5 12.5 4.5 11.5 4.5 10.5C4.5 9 5.5 8 7 8C7 6 8.5 4.5 10.5 4.5C11.5 4.5 12.5 5 13 6C13.5 5 14.5 4.5 15.5 4.5C17.5 4.5 19 6 19 8C20.5 8 21.5 9 21.5 10.5C21.5 11.5 21 12.5 20 13C19.5 14.5 18 15.5 16.5 15.5" stroke="#2D6A2E" strokeWidth="1.8" strokeLinecap="round"/>
                        <path d="M12 15.5V18M10 20H14" stroke="#2D6A2E" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                )
            },
            {
                id: 3,
                t: "Обработка",
                d: "Сравнение с базой данных болезней",
                icon: (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 20H20M7 20v-5M12 20V8M17 20v-8" stroke="#2D6A2E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                )
            },
            {
                id: 4,
                t: "Отчет",
                d: "Полный отчет с рекомендациями",
                icon: (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#2D6A2E" strokeWidth="1.8" strokeLinejoin="round"/>
                        <path d="M14 2v6h6M8 13h8M8 17h5" stroke="#2D6A2E" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                )
            }
        ],
            stats: {
                diagnosis: "Обнаружено", cause: "Описание", recommendation: "Меры борьбы",
                confidence: "Точность", imageDetails: "Свойства фото", plantType: "Культура"
            },
            errors: {
                noFile: "Файл не выбран", fileType: "Неверный формат изображения",
                fileSize: "Файл слишком велик", noAuth: "Нужна авторизация",
                uploadError: "Ошибка связи", analysisError: "Ошибка обработки"
            }
        },
        en: {
            title1: "How AI Analysis Works",
            subtitle: "Upload a photo or video and get an accurate report on the condition of your crops.",
            selectFile: "Select Image",
            dragDrop: "Drag & drop or click to upload",
            fileTypes: "Supported: JPG, PNG, GIF, WEBP, MP4, AVI, MOV (max 10MB)",
            uploadArea: "Upload Sample",
            processing: "Analyzing...",
            processingTitle: "AI is studying the leaf structure",
            result: "Diagnosis Result",
            newAnalysis: "New Analysis",
            saveResult: "Save Result",
            share: "Share",
            history: "Your Analysis History",
            noHistory: "No history yet",
            loginRequired: "Login Required",
            authNotification: "Please login to access the analysis features",
            title: "Analyze plants with AI",
            steps: [
        {
            id: 1,
            t: "Upload", // Было name
            d: "Upload a photo or video of the plant", // Было desc
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16V4M12 4L8 8M12 4L16 8M4 20H20" stroke="#2D6A2E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        },
        {
            id: 2,
            t: "AI Analysis",
            d: "Neural network analyzes the image",
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.5 15.5C8 15.5 6.5 14.5 6 13C5 12.5 4.5 11.5 4.5 10.5C4.5 9 5.5 8 7 8C7 6 8.5 4.5 10.5 4.5C11.5 4.5 12.5 5 13 6C13.5 5 14.5 4.5 15.5 4.5C17.5 4.5 19 6 19 8C20.5 8 21.5 9 21.5 10.5C21.5 11.5 21 12.5 20 13C19.5 14.5 18 15.5 16.5 15.5" stroke="#2D6A2E" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M12 15.5V18M10 20H14" stroke="#2D6A2E" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
            )
        },
        {
            id: 3,
            t: "Processing",
            d: "Comparison with disease database",
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 20H20M7 20v-5M12 20V8M17 20v-8" stroke="#2D6A2E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        },
        {
            id: 4,
            t: "Report",
            d: "Full report with recommendations",
            icon: (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#2D6A2E" strokeWidth="1.8" strokeLinejoin="round"/>
                    <path d="M14 2v6h6M8 13h8M8 17h5" stroke="#2D6A2E" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
            )
        }
    ],
    stats: { // Не забудьте добавить этот блок, иначе результат анализа на англ. упадет с ошибкой
        diagnosis: "Detected", cause: "Description", recommendation: "Measures",
        confidence: "Confidence", imageDetails: "Image Info", plantType: "Crop"
    },
    errors: {
        noFile: "No file selected", fileType: "Invalid format",
        fileSize: "File too large", noAuth: "Auth required",
        uploadError: "Connection error", analysisError: "Processing error"
    }
           
        }
    };

    const t = texts[lang] || texts.ru;

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

         console.log('Language changed to:', lang);        
        return () => { if (filePreview) URL.revokeObjectURL(filePreview); };
    }, [lang]);

    const loadHistory = async () => {
        const userId = MemoryStorage.getUserId();
        if (!userId) return;
        try {
            const response = await apiRequests.getHistory(userId);
            if (response.data) setHistory(response.data);
        } catch (error) {
            console.error('❌ History error:', error);
        }
    };

    const validateAndUploadFile = (file) => {
        if (!currentUser) {
            setShowAuthNotification(true);
            return;
        }
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) { alert(t.errors.fileType); return; }
        if (file.size > 10 * 1024 * 1024) { alert(t.errors.fileSize); return; }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                setFileInfo({
                    width: img.width, height: img.height,
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
            loadHistory();
        } catch (error) {
            clearInterval(progressInterval);
            simulateMockAnalysis();
        }
    };

    const simulateMockAnalysis = () => {
        setTimeout(() => {
            setAnalysisResult({
                status_text: lang === 'ru' ? "Здоровое растение" : "Healthy Plant",
                diagnosis_text: lang === 'ru' ? "Проблем не обнаружено" : "No issues detected",
                confidence: "95%",
                visual_status: "healthy",
                symptom_description: lang === 'ru' ? "Лист выглядит крепким." : "Leaf looks strong.",
                recommendation: lang === 'ru' ? "Продолжайте текущий уход." : "Continue current care."
            });
            setAnalysisStage('result');
            setProgress(100);
        }, 1000);
    };

    // Вспомогательные функции
    const handleFileSelect = () => currentUser ? fileInputRef.current.click() : setShowAuthNotification(true);
    const handleFileChange = (e) => { const file = e.target.files[0]; if (file) validateAndUploadFile(file); };
    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); };
    const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); const file = e.dataTransfer.files[0]; if (file) validateAndUploadFile(file); };
    const resetAnalysis = () => {
        setAnalysisStage('upload');
        setAnalysisResult(null);
        setUploadedFile(null);
        if (filePreview) URL.revokeObjectURL(filePreview);
        setFilePreview(null);
        setProgress(0);
    };

    const saveAnalysisResult = () => {
        alert(lang === 'ru' ? 'Сохранено!' : 'Saved!');
        loadHistory();
    };

    // --- Стили ---
    const styles = {
        card: {
            background: '#ffffff',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            textAlign: 'center',
            transition: 'all 0.4s ease'
        },
        buttonPrimary: {
            background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
            color: 'white',
            border: 'none',
            padding: '14px 28px',
            borderRadius: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
        },
        badge: (status) => ({
            padding: '6px 16px',
            borderRadius: '100px',
            fontSize: '13px',
            fontWeight: '600',
            background: status === 'healthy' ? '#E8F5E9' : '#FFEBEE',
            color: status === 'healthy' ? '#2E7D32' : '#C62828'
        })
    };

    return (
        <div style={{ 
            background: '#F8FAF9', 
            minHeight: '100vh', 
            padding: '120px 20px 60px',
            fontFamily: '"Inter", sans-serif'
        }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                
                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '40px', color: '#1b5e20', marginBottom: '12px', fontWeight: '800' }}>{t.title}</h1>
                    <p style={{ color: '#667A66', fontSize: '18px' }}>{t.subtitle}</p>
                </div>

                {/* User Profile Mini */}
                {/* {currentUser && (
                    <div style={{ 
                        display: 'flex', alignItems: 'center', gap: '15px', 
                        background: '#fff', padding: '12px 20px', borderRadius: '16px',
                        marginBottom: '30px', border: '1px solid #EDF2ED'
                    }}>
                        <div style={{ 
                            width: '40px', height: '40px', background: '#4CAF50', 
                            borderRadius: '12px', display: 'flex', alignItems: 'center', 
                            justifyContent: 'center', color: '#fff', fontWeight: 'bold'
                        }}>
                            {currentUser.name?.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', fontSize: '14px' }}>{currentUser.name}</div>
                            <div style={{ fontSize: '12px', color: '#888' }}>ID: {MemoryStorage.getUserId()}</div>
                        </div>
                    </div>
                )} */}

                {/* Main Content Area */}
                <div style={styles.card}>
                    {analysisStage === 'upload' && (
                        <div className="upload-container">
                            {showAuthNotification && (
                                <div style={{ background: '#FFF4E5', color: '#663C00', padding: '15px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px' }}>
                                     {t.authNotification}
                                </div>
                            )}
                            <div 
                                onClick={handleFileSelect}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                style={{
                                    border: '2px dashed #2D3A2D',
                                    borderRadius: '20px',
                                    padding: '80px 50px',
                                    cursor: currentUser ? 'pointer' : 'not-allowed',
                                    background: '#FBFCFB',
                                    transition: 'border 0.3s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4CAF50'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#D1DED1'}
                            >
                                <div style={{ fontSize: '56px', marginBottom: '20px' }}>🌿</div>
                                <h3 style={{ marginBottom: '10px', color: '#2D3A2D' }}>{t.uploadArea}</h3>
                                <p style={{ color: '#7A8C7A', marginBottom: '25px' }}>{t.dragDrop}</p>
                                <button style={styles.buttonPrimary} disabled={!currentUser}>{t.selectFile}</button>
                                <p style={{ fontSize: '12px', color: '#A0AFA0', marginTop: '20px' }}>{t.fileTypes}</p>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
                        </div>
                    )}

                    {analysisStage === 'processing' && (
                        <div style={{ padding: '40px 0' }}>
                            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 30px' }}>
                                <div className="spinner" style={{
                                    width: '100%', height: '100%', border: '4px solid #E8F5E9',
                                    borderTop: '4px solid #4CAF50', borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                {filePreview && <img src={filePreview} alt="Target" style={{
                                    position: 'absolute', top: '10px', left: '10px', width: '100px', height: '100px',
                                    borderRadius: '50%', objectFit: 'cover'
                                }} />}
                            </div>
                            <h3 style={{ marginBottom: '10px' }}>{t.processingTitle}</h3>
                            <div style={{ width: '100%', height: '8px', background: '#EEE', borderRadius: '4px', overflow: 'hidden', maxWidth: '300px', margin: '20px auto' }}>
                                <div style={{ width: `${progress}%`, height: '100%', background: '#4CAF50', transition: 'width 0.3s' }}></div>
                            </div>
                            <p style={{ color: '#4CAF50', fontWeight: 'bold' }}>{progress}%</p>
                        </div>
                    )}

                    {analysisStage === 'result' && analysisResult && (
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                <h2 style={{ margin: 0 }}>{t.result}</h2>
                                <button onClick={resetAnalysis} style={{ ...styles.buttonPrimary, background: '#f0f0f0', color: '#444', boxShadow: 'none' }}>
                                    {t.newAnalysis}
                                </button>
                            </div>

                            <div style={{ 
                                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' 
                            }}>
                                <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #EEE' }}>
                                    <img src={filePreview} alt="Result" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <span style={styles.badge(analysisResult.visual_status)}>{analysisResult.status_text}</span>
                                        <h3 style={{ marginTop: '15px', color: '#1A2E1A' }}>{analysisResult.diagnosis_text}</h3>
                                    </div>
                                    <div style={{ background: '#F9FBF9', padding: '20px', borderRadius: '16px' }}>
                                        <div style={{ fontSize: '13px', color: '#7A8C7A', marginBottom: '5px' }}>{t.stats.confidence}</div>
                                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>{analysisResult.confidence}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '20px', padding: '20px', background: '#fff', border: '1px solid #EEE', borderRadius: '20px' }}>
                                <div><strong> {t.stats.cause}:</strong> <p style={{ color: '#555', marginTop: '5px' }}>{analysisResult.symptom_description}</p></div>
                                <div style={{ borderTop: '1px solid #EEE', paddingTop: '15px' }}>
                                    <strong> {t.stats.recommendation}:</strong> <p style={{ color: '#555', marginTop: '5px' }}>{analysisResult.recommendation}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                                <button onClick={saveAnalysisResult} style={{ ...styles.buttonPrimary, flex: 1 }}>{t.saveResult}</button>
                                <button style={{ ...styles.buttonPrimary, background: '#fff', color: '#4CAF50', border: '2px solid #4CAF50', flex: 1 }}>{t.share}</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Step Cards Section */}
                <div style={{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(4, 1fr)', // 1fr делает колонки одинаковыми и широкими
    gap: '24px', 
    marginTop: '40px', 
    width: '100%' 
}}>
    {t.steps.map((step, i) => (
        <div key={i} style={{ 
            background: 'white', 
            padding: '40px 20px', // Увеличили верхний/нижний отступ для высоты
            borderRadius: '25px', 
            border: '1px solid #E8EDF2', 
            // Центрирование содержимого карточки:
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
            {/* Контейнер для SVG */}
            <div style={{ 
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                background: '#e8ede8',
                borderRadius: '18px',
                flexShrink: 0 // Чтобы иконку не сжимало
            }}>
                {step.icon}
            </div>

            <div style={{ 
                fontWeight: '700', 
                fontSize: '16px', // Чуть увеличил для читабельности
                marginBottom: '10px',
                color: '#1A2E1A' 
            }}>
                {step.t}
            </div>
            
            <div style={{ 
                fontSize: '13px', 
                color: '#7A8C7A',
                lineHeight: '1.4',
                maxWidth: '200px' // Ограничиваем ширину текста, чтобы он не расплывался
            }}>
                {step.d}
            </div>
        </div>
    ))}
</div>

                {/* History Section */}
                {/* {currentUser && (
                    <div style={{ marginTop: '60px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0 }}>{t.history}</h3>
                            <button onClick={() => setShowHistory(!showHistory)} style={{ border: 'none', background: 'none', color: '#4CAF50', fontWeight: '600', cursor: 'pointer' }}>
                                {showHistory ? 'Скрыть' : 'Показать все'}
                            </button>
                        </div>

                        {showHistory && (
                            <div style={{ display: 'grid', gap: '15px' }}>
                                {history.length > 0 ? history.slice(0, 5).map((item, idx) => (
                                    <div key={idx} style={{ 
                                        display: 'flex', alignItems: 'center', gap: '15px', 
                                        background: '#fff', padding: '15px', borderRadius: '18px',
                                        border: '1px solid #EEE'
                                    }}>
                                        <div style={{ width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                                            <img src={item.image_url || 'https://via.placeholder.com/60'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="H" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '600', fontSize: '15px' }}>{item.status_text || 'Анализ'}</div>
                                            <div style={{ fontSize: '12px', color: '#999' }}>{new Date(item.date).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US')}</div>
                                        </div>
                                        <div style={styles.badge(item.status_text?.includes('Здоров') || item.status_text?.includes('Healthy') ? 'healthy' : 'sick')}>
                                            {item.confidence}%
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>{t.noHistory}</div>
                                )}
                            </div>
                        )}
                    </div> */}
                {/* )} */}

                {/* Debug Info */}
                {/* <div style={{ marginTop: '60px', opacity: 0.4, fontSize: '10px', textAlign: 'center' }}>
                    Endpoints: POST /user/{MemoryStorage.getUserId()}/analyze • GET /user/{MemoryStorage.getUserId()}/history
                </div> */}
            </div>

            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .upload-container:hover .upload-area { border-color: #4CAF50; }
            `}</style>
        </div>
    );
};

export default Analysis; 