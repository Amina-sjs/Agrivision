// Скрипт для анализа растений на отдельной странице

document.addEventListener('DOMContentLoaded', function() {
    initAnalysisHandlers();
    updateAnalysisDate();

    // Проверяем авторизацию при загрузке страницы анализа
    checkAuthForAnalysis();

    // Инициализация ссылок на разделы в разработке
    initAnalysisDevelopmentLinks();
});

function checkAuthForAnalysis() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // Показываем уведомление о необходимости авторизации
        showQuickAuthNotification();

        // Отключаем функционал загрузки файлов
        const uploadArea = document.getElementById('uploadArea');
        const selectFileBtn = document.getElementById('selectFileBtn');

        if (uploadArea) {
            uploadArea.style.opacity = '0.5';
            uploadArea.style.pointerEvents = 'none';
        }

        if (selectFileBtn) {
            selectFileBtn.style.pointerEvents = 'none';
            selectFileBtn.innerHTML = '<i class="fas fa-lock"></i> Войдите для анализа';
        }

        // Показываем кнопку входа
        setTimeout(() => {
            openModal(document.getElementById('loginModal'));
        }, 1000);
    }
}

function initAnalysisDevelopmentLinks() {
    // Ссылки на разделы в разработке на странице анализа
    const developmentLinks = document.querySelectorAll('a[href="#library"], a[href="#testimonials"], a.development-link');

    developmentLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showDevelopmentModal();
        });
    });

    // Кнопки в результатах анализа
    const actionButtons = document.querySelectorAll('.action-buttons .btn');
    actionButtons.forEach(button => {
        if (button.textContent.includes('Сохранить') || button.textContent.includes('Поделиться')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                showDevelopmentModal();
            });
        }
    });
}

function showDevelopmentModal() {
    const modal = document.getElementById('developmentModal');
    if (modal) {
        openModal(modal);
    }
}

function showQuickAuthNotification() {
    const quickNotification = document.createElement('div');
    quickNotification.className = 'quick-notification';
    quickNotification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow);
        z-index: 9999;
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 1.5s forwards;
        font-weight: 600;
        max-width: 300px;
    `;
    quickNotification.innerHTML = `
        <i class="fas fa-user-circle" style="margin-right: 8px;"></i>
        <span>Войдите или зарегистрируйтесь для анализа растений</span>
    `;
    document.body.appendChild(quickNotification);

    // Удаляем уведомление через 2 секунды
    setTimeout(() => {
        if (quickNotification.parentNode) {
            quickNotification.remove();
        }
    }, 2000);
}

function updateAnalysisDate() {
    const now = new Date();
    const dateElement = document.getElementById('analysisDate');
    const analysisId = document.getElementById('analysisId');

    if (dateElement) {
        const formattedDate = now.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        dateElement.textContent = formattedDate;
    }

    if (analysisId) {
        const id = `AN-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random()*1000).toString().padStart(3, '0')}`;
        analysisId.textContent = `#${id}`;
    }
}

function initAnalysisHandlers() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const selectFileBtn = document.getElementById('selectFileBtn');
    const newAnalysisBtn = document.getElementById('newAnalysisBtn');

    if (!uploadArea || !fileInput || !selectFileBtn) return;

    // Обработчик для кнопки выбора файла
    selectFileBtn.addEventListener('click', function() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            showQuickAuthNotification();
            setTimeout(() => openModal(document.getElementById('loginModal')), 500);
            return;
        }
        fileInput.click();
    });

    // Обработчик для выбора файла через input
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (!currentUser) {
            showQuickAuthNotification();
            setTimeout(() => openModal(document.getElementById('loginModal')), 500);
            return;
        }

        if (file) {
            handleFileUpload(file);
        }
    });

    // Кнопка нового анализа
    if (newAnalysisBtn) {
        newAnalysisBtn.addEventListener('click', function() {
            resetAnalysis();
        });
    }

    // Drag and drop функционал
    uploadArea.addEventListener('dragover', function(e) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            e.preventDefault();
            showQuickAuthNotification();
            return;
        }

        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            showQuickAuthNotification();
            setTimeout(() => openModal(document.getElementById('loginModal')), 500);
            return;
        }

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileUpload(file);
        }
    });

    // Клик по области загрузки
    uploadArea.addEventListener('click', function() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            showQuickAuthNotification();
            setTimeout(() => openModal(document.getElementById('loginModal')), 500);
            return;
        }
        fileInput.click();
    });
}

function resetAnalysis() {
    const uploadArea = document.getElementById('uploadArea');
    const processingArea = document.getElementById('processingArea');
    const resultArea = document.getElementById('resultArea');

    if (uploadArea) {
        uploadArea.style.display = 'block';
        uploadArea.style.opacity = '1';
        uploadArea.style.pointerEvents = 'auto';
    }
    if (processingArea) processingArea.style.display = 'none';
    if (resultArea) resultArea.style.display = 'none';

    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = '';

    updateAnalysisDate();
    showNotification('Готово к новому анализу', 'success');
}


async function handleFileUpload(file) {
    // Проверяем авторизацию
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        showQuickAuthNotification();
        setTimeout(() => openModal(document.getElementById('loginModal')), 500);
        return;
    }

    // Проверяем тип файла
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!validTypes.includes(file.type)) {
        showNotification('Пожалуйста, загрузите изображение (JPG, PNG, GIF, WEBP)', 'error');
        return;
    }

    // Проверяем размер файла (макс 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showNotification('Файл слишком большой. Максимальный размер: 10MB', 'error');
        return;
    }

    // Показываем процесс загрузки
    const uploadArea = document.getElementById('uploadArea');
    const processingArea = document.getElementById('processingArea');
    const resultArea = document.getElementById('resultArea');

    if (uploadArea) uploadArea.style.display = 'none';
    if (processingArea) processingArea.style.display = 'block';
    if (resultArea) resultArea.style.display = 'none';

    // Обновляем информацию о файле
    updateFileInfo(file);

    // Показываем превью файла
    const reader = new FileReader();

    reader.onload = function(e) {
        const uploadedImage = document.getElementById('uploadedImage');
        if (uploadedImage) {
            uploadedImage.src = e.target.result;
        }

        // Пробуем отправить на анализ через API
        processImageWithAPI(file);
    };

    reader.readAsDataURL(file);
}

// Новая функция для обработки через API
async function processImageWithAPI(file) {
    const hasApiToken = Storage.getToken();
    
    if (hasApiToken) {
        try {
            console.log('🤖 Отправляем изображение на анализ через API...');
            
            // Реальный анализ через API
            const result = await api.uploadPhoto(file);
            
            console.log('✅ Анализ завершен через API:', result);
            
            // Показываем реальный результат
            showRealAnalysisResult(result);
            
            // Сохраняем результат в историю
            saveAnalysisToHistory(result);
            
        } catch (apiError) {
            console.warn('⚠️ Ошибка API анализа:', apiError.message);
            // Если API не работает, используем демо-анализ
            showNotification('Используем демо-режим анализа', 'info');
            simulateAIProcessing();
        }
    } else {
        // Если нет токена API, используем демо-режим
        console.log('📁 Используем демо-анализ (localStorage)');
        simulateAIProcessing();
    }
}

// Восстанавливаем отсутствующие функции
function getAllData() {
    const data = localStorage.getItem('agrivision_db');
    return data ? JSON.parse(data) : { users: [], requests: [], analysis: [], articles: [] };
}

function saveData(data) {
    localStorage.setItem('agrivision_db', JSON.stringify(data));
}

function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type} active`;
    
    setTimeout(() => {
        notification.classList.remove('active');
    }, duration);
}

function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Функция для отображения реального результата анализа
function showRealAnalysisResult(result) {
    const processingArea = document.getElementById('processingArea');
    const resultArea = document.getElementById('resultArea');
    
    // Определяем цвет рамки
    const isHealthy = result.visual_status === 'healthy';
    const borderColor = isHealthy ? '#4CAF50' : '#F44336';
    const statusColor = isHealthy ? 'green' : 'red';
    
    // Создаем HTML с результатом
    const resultHTML = `
        <div class="analysis-result" style="border: 3px solid ${borderColor};">
            <div class="result-header">
                <h3 style="color: ${statusColor};">${result.status_text}</h3>
                <span class="confidence-badge">${result.confidence}</span>
            </div>
            
            <div class="result-details">
                <p><strong>Диагноз:</strong> ${result.diagnosis_text}</p>
                <p><strong>Симптомы:</strong> ${result.symptom_description}</p>
                <p><strong>Рекомендация:</strong> ${result.recommendation}</p>
                <p><strong>Метка:</strong> <span class="tag">${result.label}</span></p>
                <p><strong>ID анализа:</strong> ${result.analysis_id}</p>
            </div>
            
            <div class="result-image">
                <p><strong>Анализируемое изображение:</strong></p>
                <img src="${result.image_url}" 
                     alt="Результат анализа" 
                     style="max-width: 100%; border-radius: 8px; margin-top: 10px;">
            </div>
            
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="saveAnalysisResult(${result.analysis_id})">
                    <i class="fas fa-save"></i> Сохранить результат
                </button>
                <button class="btn btn-outline" onclick="resetAnalysis()">
                    <i class="fas fa-redo"></i> Новый анализ
                </button>
            </div>
        </div>
    `;
    
    if (processingArea) processingArea.style.display = 'none';
    if (resultArea) {
        resultArea.innerHTML = resultHTML;
        resultArea.style.display = 'block';
    }
    
    showNotification('Анализ завершен!', 'success');
}

// Функция для сохранения анализа в историю
function saveAnalysisToHistory(result) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const data = getAllData();
    
    const newAnalysis = {
        id: data.analysis.length > 0 ? Math.max(...data.analysis.map(a => a.id)) + 1 : 1,
        userId: currentUser.id,
        analysis_id: result.analysis_id,
        plantType: result.label || 'Растение',
        diagnosis: result.diagnosis_text,
        cause: result.symptom_description,
        recommendation: result.recommendation,
        confidence: parseFloat(result.confidence) || 0,
        date: new Date().toISOString(),
        status: 'completed',
        image_url: result.image_url,
        status_text: result.status_text,
        visual_status: result.visual_status || 'diseased'
    };
    
    // Добавляем в массив или создаем если нет
    if (!data.analysis) data.analysis = [];
    data.analysis.push(newAnalysis);
    
    saveData(data);
    
    console.log('💾 Анализ сохранен в историю:', newAnalysis);
}

// Обновляем функцию для загрузки истории
async function loadAnalysisHistory() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const hasApiToken = Storage.getToken();
    
    let userAnalysis = [];
    
    // Пробуем загрузить через API
    if (hasApiToken) {
        try {
            console.log('📥 Загружаем историю анализов через API...');
            const apiHistory = await api.getAnalysisHistory();
            
            // Преобразуем данные API в формат приложения
            userAnalysis = apiHistory.map(item => ({
                id: item.analysis_id || Date.now(),
                userId: currentUser.id,
                analysis_id: item.analysis_id,
                plantType: item.label || 'Растение',
                diagnosis: item.diagnosis_text,
                cause: item.symptom_description,
                recommendation: item.recommendation,
                confidence: parseFloat(item.confidence) || 0,
                date: item.created_at || new Date().toISOString(),
                status: 'completed',
                image_url: item.image_url,
                status_text: item.status_text,
                visual_status: item.visual_status || 'diseased'
            }));
            
            console.log('✅ История загружена через API:', userAnalysis.length, 'анализов');
            
        } catch (apiError) {
            console.warn('⚠️ Ошибка загрузки истории через API:', apiError.message);
            // Продолжаем с localStorage
        }
    }
    
    // Если не удалось через API или нет данных, загружаем из localStorage
    if (userAnalysis.length === 0) {
        console.log('📁 Загружаем историю из localStorage');
        const data = getAllData();
        userAnalysis = data.analysis ? data.analysis.filter(a => a.userId === currentUser.id) : [];
    }
    
    // Если нет истории, создаем демо-данные
    if (userAnalysis.length === 0) {
        // ... твой существующий код для демо-данных ...
    }
    
    // Отображаем историю (используй существующую функцию displayHistory)
    displayHistory(userAnalysis);
}

function updateFileInfo(file) {
    const imageDetails = document.getElementById('imageDetails');
    const processingTime = document.getElementById('processingTime');
    const plantType = document.getElementById('plantType');

    if (imageDetails) {
        if (file.type.startsWith('image/')) {
            // Для изображений создаем временный объект для получения размеров
            const img = new Image();
            img.onload = function() {
                imageDetails.textContent = `Размер: ${img.width}x${img.height} • Формат: ${file.type.split('/')[1].toUpperCase()} • ${(file.size/1024/1024).toFixed(2)}MB`;
            };
            img.src = URL.createObjectURL(file);
        } else {
            imageDetails.textContent = `Видео файл • ${(file.size/1024/1024).toFixed(2)}MB • Формат: ${file.type.split('/')[1].toUpperCase()}`;
        }
    }

    if (processingTime) {
        // Случайное время обработки от 2 до 5 секунд
        const time = (2 + Math.random() * 3).toFixed(1);
        processingTime.textContent = `${time} секунд`;
    }

    if (plantType) {
        // Случайный тип растения
        const plants = ['Пшеница озимая', 'Кукуруза', 'Картофель', 'Виноград', 'Яблоня', 'Томаты', 'Огурцы', 'Рис'];
        const randomPlant = plants[Math.floor(Math.random() * plants.length)];
        plantType.textContent = randomPlant;
    }
}

function simulateAIProcessing() {
    const progressFill = document.getElementById('progressFill');
    let progress = 0;

    // Анимация прогресс-бара
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) progress = 100;

        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }

        if (progress >= 100) {
            clearInterval(interval);

            // Генерируем фиктивный анализ
            generateMockAnalysis();

            // Показываем результаты через небольшую задержку
            setTimeout(() => {
                const processingArea = document.getElementById('processingArea');
                const resultArea = document.getElementById('resultArea');

                if (processingArea) processingArea.style.display = 'none';
                if (resultArea) resultArea.style.display = 'block';

                showNotification('Анализ завершен! Результаты готовы.', 'success');
            }, 500);
        }
    }, 150);
}

// В analysis.js заменить функцию generateMockAnalysis():
function generateMockAnalysis() {
    // Массивы с возможными результатами анализа
    const diagnoses = [
        'Растение здорово, признаки заболеваний отсутствуют',
        'Легкая форма мучнистой росы, начальная стадия',
        'Признаки фитофтороза, требуется немедленное лечение',
        'Недостаток азота, умеренный хлороз листьев',
        'Оптимальное состояние, растение развивается нормально',
        'Незначительное пожелтение листьев, возможно недостаток железа',
        'Признаки переувлажнения почвы, корневая гниль начальная стадия'
    ];

    const causes = [
        'Оптимальные условия выращивания, отсутствие патогенов в почве',
        'Высокая влажность и температура, способствующие развитию грибка',
        'Грибковая инфекция в почве, заражение от соседних растений',
        'Недостаточное внесение азотных удобрений, бедная почва',
        'Нормальное развитие растения, благоприятные условия',
        'Недостаток солнечного света, высокий уровень pH почвы',
        'Избыточный полив, плохой дренаж, застой воды'
    ];

    const recommendations = [
        'Продолжайте текущий режим полива и удобрения. Рекомендуется профилактический осмотр через 2 недели.',
        'Обработать фунгицидом Топаз, уменьшить полив на 30%, обеспечить вентиляцию.',
        'Удалить пораженные части, обработать медным купоросом, изолировать от других растений.',
        'Внести азотные удобрения (мочевина 30г/м²), увеличить полив на 20%.',
        'Рекомендуется профилактическая обработка биопрепаратами раз в месяц.',
        'Увеличить освещение, внести хелат железа, проверить дренаж почвы.',
        'Уменьшить частоту полива в 2 раза, улучшить вентиляцию, добавить дренажный слой.'
    ];

    const confidenceLevels = [78, 82, 85, 89, 92, 95, 88];

    // Выбираем случайные результаты
    const randomIndex = Math.floor(Math.random() * diagnoses.length);
    const plantType = document.getElementById('plantType').textContent;

    // Обновляем DOM
    const diagnosisResult = document.getElementById('diagnosisResult');
    const causeResult = document.getElementById('causeResult');
    const recommendationResult = document.getElementById('recommendationResult');
    const diagnosisConfidence = document.getElementById('diagnosisConfidence');
    const causeConfidence = document.getElementById('causeConfidence');

    if (diagnosisResult) diagnosisResult.textContent = diagnoses[randomIndex];
    if (causeResult) causeResult.textContent = causes[randomIndex];
    if (recommendationResult) recommendationResult.textContent = recommendations[randomIndex];
    if (diagnosisConfidence) diagnosisConfidence.textContent = confidenceLevels[randomIndex] + '%';
    if (causeConfidence) causeConfidence.textContent = confidenceLevels[(randomIndex + 2) % confidenceLevels.length] + '%';

    // Сохраняем результат анализа
    const analysisData = {
        plantType: plantType,
        diagnosis: diagnoses[randomIndex],
        cause: causes[randomIndex],
        recommendation: recommendations[randomIndex],
        confidence: confidenceLevels[randomIndex]
    };

    // Проверяем, есть ли функция saveAnalysisResult в глобальной области видимости
    if (typeof window.saveAnalysisResult === 'function') {
        window.saveAnalysisResult(analysisData);
    }
}

function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type} active`;

    setTimeout(() => {
        notification.classList.remove('active');
    }, duration);
}

function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Функция для отображения истории (отсутствовала)
function displayHistory(history) {
    const historyContainer = document.getElementById('historyContainer');
    if (!historyContainer) return;
    
    if (history.length === 0) {
        historyContainer.innerHTML = '<p>История анализов пуста</p>';
        return;
    }
    
    // Сортируем по дате (новые сверху)
    history.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let html = '';
    
    history.forEach(item => {
        const isHealthy = item.visual_status === 'healthy';
        const borderColor = isHealthy ? '#4CAF50' : '#F44336';
        const statusIcon = isHealthy ? '✅' : '⚠️';
        const date = item.date ? new Date(item.date) : new Date();
        const formattedDate = date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        html += `
            <div class="history-item" style="border-left: 4px solid ${borderColor}; padding: 15px; margin: 10px 0; background: white; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span><strong>${statusIcon} ${item.status_text || 'Анализ'}</strong></span>
                    <span style="color: #666; font-size: 0.9em;">${formattedDate}</span>
                </div>
                <div>
                    <p><strong>Диагноз:</strong> ${item.diagnosis || item.diagnosis_text || 'Не указан'}</p>
                    <p><strong>Уверенность:</strong> ${item.confidence || 'Нет данных'}</p>
                    ${item.image_url ? `
                        <div style="margin-top: 10px;">
                            <img src="${item.image_url}" alt="История анализа" style="max-width: 150px; border-radius: 4px;">
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    historyContainer.innerHTML = html;
}