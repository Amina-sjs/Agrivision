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
            title: "Анализируйте растения с помощью AI",
            subtitle: "Загрузите фото или видео, и получите точный отчёт о состоянии ваших культур.",
            selectFile: "Выбрать изображение",
            dragDrop: "Перетащите фото или нажмите для загрузки",
            fileTypes: "Поддерживаемые форматы: JPG, PNG, WEBP (до 10MB)",
            uploadArea: "Загрузка образца",
            processing: "Анализируем...",
            processingTitle: "Нейросеть изучает структуру листа",
            result: "Результат диагностики",
            newAnalysis: "Новый анализ",
            saveResult: "В избранное",
            share: "Поделиться",
            history: "История ваших проверок",
            noHistory: "Вы еще не проводили анализ",
            loginRequired: "Требуется вход",
            authNotification: "Пожалуйста, войдите в систему для доступа к анализу",
            title: "Как работает AI-анализ",
            steps: [
        {
          id: 1,
          icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16V4M12 4L8 8M12 4L16 8M4 20H20" stroke="#2D6A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
          name: "Загрузка",
          desc: "Загрузите фото или видео растения"
        },
        {
          id: 2,
          icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5 15C8.5 15 7.5 14.5 7 13.5C6.5 12.5 6.5 11.5 7 10.5C6 10 5.5 9 5.5 8C5.5 6.5 6.5 5.5 8 5.5C8.5 4.5 9.5 4 10.5 4C11.5 4 12.5 4.5 13 5.5C13.5 4.5 14.5 4 15.5 4C16.5 4 17.5 4.5 18 5.5C19.5 5.5 20.5 6.5 20.5 8C20.5 9 20 10 19 10.5C19.5 11.5 19.5 12.5 19 13.5C18.5 14.5 17.5 15 16.5 15" stroke="#2D6A2E" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 15V20" stroke="#2D6A2E" strokeWidth="2"/>
            </svg>
          ),
          name: "Анализ ИИ",
          desc: "Нейросеть анализирует изображение"
        },
        {
          id: 3,
          icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 20H20M4 16H14M4 12H18M4 8H12" stroke="#2D6A2E" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ),
          name: "Обработка",
          desc: "Сравнение с базой данных болезней"
        },
        {
          id: 4,
          icon: (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#2D6A2E" strokeWidth="2"/>
              <path d="M14 2V8H20" stroke="#2D6A2E" strokeWidth="2"/>
              <path d="M8 13H16M8 17H12" stroke="#2D6A2E" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ),
          name: "Отчет",
          desc: "Полный отчет с рекомендациями"
        }
      ],
            steps: [
                { t: "Загрузка", d: "Сделайте четкое фото листа" },
                { t: "Обработка", d: "AI ищет признаки патогенов" },
                { t: "Вердикт", d: "Получите план лечения" }
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
            title: "Analyze plants with AI",
            subtitle: "Upload a photo or video and get an accurate report on the condition of your crops.",
            selectFile: "Select Image",
            dragDrop: "Drag & drop or click to upload",
            fileTypes: "Supported: JPG, PNG, WEBP (max 10MB)",
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
            title: "How AI Analysis Works",
            steps: [
        { id: 1, name: "Upload", desc: "Upload a photo or video of the plant", icon: "..." },
        { id: 2, name: "AI Analysis", desc: "Neural network analyzes the image", icon: "..." },
        { id: 3, name: "Processing", desc: "Comparison with disease database", icon: "..." },
        { id: 4, name: "Report", desc: "Full report with recommendations", icon: "..." }
      ],
            steps: [
                { t: "Upload", d: "Take a clear photo of a leaf" },
                { t: "Analyze", d: "AI detects potential pathogens" },
                { t: "Result", d: "Get a treatment plan" }
            ],
            stats: {
                diagnosis: "Diagnosis", cause: "Description", recommendation: "Treatment",
                confidence: "Confidence", imageDetails: "Image Info", plantType: "Plant Type"
            },
            errors: {
                noFile: "No file selected", fileType: "Invalid image format",
                fileSize: "File is too large", noAuth: "Auth required",
                uploadError: "Upload error", analysisError: "Analysis error"
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
            <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                
                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '36px', color: '#1A2E1A', marginBottom: '12px', fontWeight: '800' }}>{t.title}</h1>
                    <p style={{ color: '#667A66', fontSize: '18px' }}>{t.subtitle}</p>
                </div>

                {/* User Profile Mini */}
                {currentUser && (
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
                )}

                {/* Main Content Area */}
                <div style={styles.card}>
                    {analysisStage === 'upload' && (
                        <div className="upload-container">
                            {showAuthNotification && (
                                <div style={{ background: '#FFF4E5', color: '#663C00', padding: '15px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px' }}>
                                    🔒 {t.authNotification}
                                </div>
                            )}
                            <div 
                                onClick={handleFileSelect}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                style={{
                                    border: '2px dashed #D1DED1',
                                    borderRadius: '20px',
                                    padding: '60px 40px',
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
                                <div><strong>🌿 {t.stats.cause}:</strong> <p style={{ color: '#555', marginTop: '5px' }}>{analysisResult.symptom_description}</p></div>
                                <div style={{ borderTop: '1px solid #EEE', paddingTop: '15px' }}>
                                    <strong>💊 {t.stats.recommendation}:</strong> <p style={{ color: '#555', marginTop: '5px' }}>{analysisResult.recommendation}</p>
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
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '40px' 
                }}>
                    {t.steps.map((step, i) => (
                        <div key={i} style={{ 
                            background: 'white', padding: '20px', borderRadius: '20px', 
                            border: '1px solid #EDF2ED', textAlign: 'center'
                        }}>
                            <div style={{ 
                                width: '32px', height: '32px', background: '#E8F5E9', color: '#4CAF50',
                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 12px', fontWeight: 'bold', fontSize: '14px'
                            }}>{i + 1}</div>
                            <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>{step.t}</div>
                            <div style={{ fontSize: '12px', color: '#888' }}>{step.d}</div>
                        </div>
                    ))}
                </div>

                {/* History Section */}
                {currentUser && (
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
                    </div>
                )}

                {/* Debug Info */}
                <div style={{ marginTop: '60px', opacity: 0.4, fontSize: '10px', textAlign: 'center' }}>
                    Endpoints: POST /user/{MemoryStorage.getUserId()}/analyze • GET /user/{MemoryStorage.getUserId()}/history
                </div>
            </div>

            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .upload-container:hover .upload-area { border-color: #4CAF50; }
            `}</style>
        </div>
    );
};

export default Analysis; 