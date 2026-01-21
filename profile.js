// Скрипт для страницы профиля с поддержкой перевода

// Глобальная функция для обновления контента профиля при смене языка
window.updateProfileContent = function() {
    loadUserData();
    loadNotifications();
    loadAnalysisHistory();
    loadStatistics();
};

document.addEventListener('DOMContentLoaded', function() {
    // Проверяем авторизацию
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // Если пользователь не авторизован, перенаправляем на главную
        window.location.href = 'index.html';
        return;
    }

    // Инициализация
    initProfilePage();
    updateProfileContent();
    initEventHandlers();
});

function initProfilePage() {
    // Инициализация мобильного меню
    const burgerMenu = document.getElementById('burgerMenu');
    const mobileNav = document.getElementById('mobileNav');

    if (burgerMenu && mobileNav) {
        burgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : 'auto';
        });
    }

    // Навигация по разделам профиля
    const menuLinks = document.querySelectorAll('.profile-menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Убираем активный класс у всех ссылок
            menuLinks.forEach(l => l.classList.remove('active'));
            // Добавляем активный класс текущей ссылке
            this.classList.add('active');

            // Скрываем все разделы
            document.querySelectorAll('.profile-section').forEach(section => {
                section.classList.remove('active');
            });

            // Показываем выбранный раздел
            const sectionId = this.getAttribute('data-section');
            document.getElementById(`${sectionId}-section`).classList.add('active');
        });
    });

    // Кнопка редактирования профиля
    const editBtn = document.getElementById('editProfileBtn');
    const saveBtn = document.getElementById('saveProfileBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const profileForm = document.getElementById('profileForm');
    const formInputs = profileForm.querySelectorAll('input:not([disabled]), textarea');

    if (editBtn) {
        editBtn.addEventListener('click', function() {
            // Разблокируем поля для редактирования
            formInputs.forEach(input => {
                input.disabled = false;
            });

            // Показываем кнопки сохранения и отмены
            saveBtn.style.display = 'inline-block';
            cancelBtn.style.display = 'inline-block';
            editBtn.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            // Блокируем поля обратно
            formInputs.forEach(input => {
                input.disabled = true;
                if (input.id === 'profileEmail') input.disabled = true; // Email всегда заблокирован
            });

            // Восстанавливаем исходные значения
            loadUserData();

            // Скрываем кнопки сохранения и отмены
            saveBtn.style.display = 'none';
            cancelBtn.style.display = 'none';
            editBtn.style.display = 'inline-block';
        });
    }

    // Форма профиля
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfileData();
        });
    }

    // Кнопка смены пароля
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const changePasswordModal = document.getElementById('changePasswordModal');
    const closeChangePassword = document.getElementById('closeChangePassword');
    const cancelChangePassword = document.getElementById('cancelChangePassword');
    const changePasswordForm = document.getElementById('changePasswordForm');

    if (changePasswordBtn && changePasswordModal) {
        changePasswordBtn.addEventListener('click', function() {
            changePasswordModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeChangePassword) {
        closeChangePassword.addEventListener('click', function() {
            changePasswordModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    if (cancelChangePassword) {
        cancelChangePassword.addEventListener('click', function() {
            changePasswordModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handleChangePassword);
    }

    // Кнопки уведомлений
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    const clearNotificationsBtn = document.getElementById('clearNotificationsBtn');

    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', markAllNotificationsAsRead);
    }

    if (clearNotificationsBtn) {
        clearNotificationsBtn.addEventListener('click', clearAllNotifications);
    }

    // Кнопка выхода
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }

    // Закрытие модальных окон по клику на overlay
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });
}

function loadUserData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const data = getAllData();
    const user = data.users.find(u => u.id === currentUser.id);

    if (user) {
        // Заполняем поля профиля
        document.getElementById('profileUserName').textContent = user.name;
        document.getElementById('profileUserEmail').textContent = user.email;
        document.getElementById('profileUserRole').textContent = user.role === 'admin' ?
            window.getTranslation('admin') :
            window.getTranslation('user');

        document.getElementById('userName').textContent = user.name;
        document.getElementById('mobileUserName').textContent = user.name;

        // Заполняем форму
        document.getElementById('profileName').value = user.name || '';
        document.getElementById('profileEmail').value = user.email || '';
        document.getElementById('profilePhone').value = user.phone || '';
        document.getElementById('profileRole').value = user.role === 'admin' ?
            window.getTranslation('admin') :
            window.getTranslation('user');
        document.getElementById('profileBio').value = user.bio || '';

        // Блокируем email
        document.getElementById('profileEmail').disabled = true;

        // Обновляем дату регистрации
        if (user.registrationDate) {
            const regDate = new Date(user.registrationDate);
            document.getElementById('userSince').textContent =
                window.getTranslation('user-since') + ': ' +
                regDate.toLocaleDateString(window.currentLanguage === 'ru' ? 'ru-RU' : 'en-US');
        }
    }
}

function saveProfileData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const data = getAllData();
    const userIndex = data.users.findIndex(u => u.id === currentUser.id);

    if (userIndex !== -1) {
        const name = document.getElementById('profileName').value;
        const phone = document.getElementById('profilePhone').value;
        const bio = document.getElementById('profileBio').value;

        // Обновляем данные пользователя
        data.users[userIndex].name = name;
        data.users[userIndex].phone = phone;
        data.users[userIndex].bio = bio;

        // Сохраняем в localStorage
        saveData(data);

        // Обновляем текущего пользователя
        const updatedUser = data.users[userIndex];
        localStorage.setItem('currentUser', JSON.stringify({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role
        }));

        // Обновляем отображение
        loadUserData();

        // Блокируем поля обратно
        const formInputs = document.querySelectorAll('#profileForm input:not([disabled]), #profileForm textarea');
        formInputs.forEach(input => {
            input.disabled = true;
            if (input.id === 'profileEmail') input.disabled = true;
        });

        // Скрываем кнопки сохранения и отмены
        document.getElementById('saveProfileBtn').style.display = 'none';
        document.getElementById('cancelEditBtn').style.display = 'none';
        document.getElementById('editProfileBtn').style.display = 'inline-block';

        showNotification(window.getTranslation('profile-updated'), 'success');
    }
}

function handleChangePassword(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        showNotification(window.getTranslation('fill-all-fields'), 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showNotification(window.getTranslation('passwords-not-match'), 'error');
        return;
    }

    if (newPassword.length < 6) {
        showNotification(window.getTranslation('password-too-short'), 'error');
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const data = getAllData();
    const userIndex = data.users.findIndex(u => u.id === currentUser.id);

    if (userIndex !== -1) {
        if (data.users[userIndex].password !== currentPassword) {
            showNotification(window.getTranslation('incorrect-current-password'), 'error');
            return;
        }

        // Обновляем пароль
        data.users[userIndex].password = newPassword;
        saveData(data);

        // Закрываем модальное окно
        document.getElementById('changePasswordModal').classList.remove('active');
        document.body.style.overflow = 'auto';

        // Очищаем форму
        document.getElementById('changePasswordForm').reset();

        showNotification(window.getTranslation('password-changed'), 'success');
    }
}

function loadNotifications() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const data = getAllData();

    // Получаем уведомления пользователя
    const userNotifications = data.notifications || [];
    const userRequests = data.requests.filter(r => r.userId === currentUser.id);

    // Если у пользователя нет уведомлений в базе, создадим демо-уведомления
    if (userNotifications.length === 0) {
        // Создаем уведомления на основе заявок
        userRequests.forEach(request => {
            const notification = {
                id: Date.now() + Math.random(),
                userId: currentUser.id,
                type: 'request',
                title: window.getTranslation('request-status-update'),
                message: window.currentLanguage === 'ru' ?
                    `Статус вашей заявки #${request.id} изменен на "${getStatusText(request.status)}"` :
                    `Status of your request #${request.id} changed to "${getStatusText(request.status)}"`,
                isRead: false,
                createdAt: new Date().toISOString(),
                relatedId: request.id
            };
            userNotifications.push(notification);
        });

        // Добавляем общие уведомления
        const generalNotifications = [
            {
                id: Date.now() + Math.random(),
                userId: currentUser.id,
                type: 'system',
                title: window.getTranslation('welcome'),
                message: window.currentLanguage === 'ru' ?
                    'Спасибо за регистрацию в AgriVision. Начните использовать наш сервис для анализа растений.' :
                    'Thank you for registering with AgriVision. Start using our plant analysis service.',
                isRead: false,
                createdAt: new Date(Date.now() - 86400000).toISOString() // 1 день назад
            },
            {
                id: Date.now() + Math.random(),
                userId: currentUser.id,
                type: 'update',
                title: window.getTranslation('new-update'),
                message: window.currentLanguage === 'ru' ?
                    'Доступна новая версия системы анализа растений. Попробуйте улучшенные функции!' :
                    'A new version of the plant analysis system is available. Try the improved features!',
                isRead: true,
                createdAt: new Date(Date.now() - 172800000).toISOString() // 2 дня назад
            }
        ];

        userNotifications.push(...generalNotifications);

        // Сохраняем уведомления
        data.notifications = userNotifications;
        saveData(data);
    }

    // Фильтруем уведомления текущего пользователя
    const notifications = userNotifications.filter(n => n.userId === currentUser.id);

    // Сортируем по дате (новые сверху)
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Отображаем уведомления
    const notificationsList = document.getElementById('notificationsList');
    const noNotifications = document.getElementById('noNotifications');
    const notificationCount = document.getElementById('notificationCount');

    if (notifications.length === 0) {
        notificationsList.innerHTML = '';
        noNotifications.style.display = 'block';
        notificationCount.textContent = '0';
        return;
    }

    noNotifications.style.display = 'none';

    let html = '';
    let unreadCount = 0;

    notifications.forEach(notification => {
        if (!notification.isRead) unreadCount++;

        const date = new Date(notification.createdAt);
        const timeAgo = getTimeAgo(date);

        html += `
            <div class="notification-item ${notification.isRead ? 'read' : 'new'}">
                <div class="notification-icon ${notification.isRead ? 'read' : 'new'}">
                    <i class="fas ${getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <h4>${notification.title}</h4>
                    <p>${notification.message}</p>
                    <div class="notification-time">${timeAgo}</div>
                </div>
                ${!notification.isRead ? `
                    <button class="mark-read-btn" data-id="${notification.id}">
                        ${window.getTranslation('mark-as-read')}
                    </button>
                ` : ''}
            </div>
        `;
    });

    notificationsList.innerHTML = html;
    notificationCount.textContent = unreadCount > 0 ? unreadCount.toString() : '0';

    // Добавляем обработчики для кнопок "Отметить как прочитанное"
    document.querySelectorAll('.mark-read-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const notificationId = this.getAttribute('data-id');
            markNotificationAsRead(notificationId);
        });
    });
}

function getNotificationIcon(type) {
    const icons = {
        'request': 'fa-file-alt',
        'system': 'fa-info-circle',
        'update': 'fa-sync-alt',
        'warning': 'fa-exclamation-triangle',
        'success': 'fa-check-circle'
    };
    return icons[type] || 'fa-bell';
}

function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (window.currentLanguage === 'ru') {
        if (diffMins < 1) return 'только что';
        if (diffMins < 60) return `${diffMins} мин. назад`;
        if (diffHours < 24) return `${diffHours} ч. назад`;
        if (diffDays < 7) return `${diffDays} дн. назад`;
        return date.toLocaleDateString('ru-RU');
    } else {
        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US');
    }
}

function markNotificationAsRead(notificationId) {
    const data = getAllData();
    const notificationIndex = data.notifications.findIndex(n => n.id == notificationId);

    if (notificationIndex !== -1) {
        data.notifications[notificationIndex].isRead = true;
        saveData(data);
        loadNotifications();
        showNotification(window.getTranslation('notification-marked-read'), 'success');
    }
}

function markAllNotificationsAsRead() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const data = getAllData();

    data.notifications.forEach(notification => {
        if (notification.userId === currentUser.id && !notification.isRead) {
            notification.isRead = true;
        }
    });

    saveData(data);
    loadNotifications();
    showNotification(window.getTranslation('all-notifications-read'), 'success');
}

function clearAllNotifications() {
    if (!confirm(
        window.currentLanguage === 'ru' ?
            'Вы уверены, что хотите удалить все уведомления? Это действие нельзя отменить.' :
            'Are you sure you want to delete all notifications? This action cannot be undone.'
    )) {
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const data = getAllData();

    // Удаляем все уведомления пользователя
    data.notifications = data.notifications.filter(n => n.userId !== currentUser.id);

    saveData(data);
    loadNotifications();
    showNotification(window.getTranslation('all-notifications-deleted'), 'success');
}

function loadAnalysisHistory() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const data = getAllData();

    // Получаем историю анализов пользователя
    const userAnalysis = data.analysis ? data.analysis.filter(a => a.userId === currentUser.id) : [];

    // Если нет истории, создаем демо-данные
    if (userAnalysis.length === 0) {
        const demoAnalysis = [
            {
                id: 1,
                userId: currentUser.id,
                plantType: window.currentLanguage === 'ru' ? 'Пшеница озимая' : 'Winter wheat',
                diagnosis: window.currentLanguage === 'ru' ?
                    'Растение здорово, признаки заболеваний отсутствуют' :
                    'Plant is healthy, no signs of disease',
                cause: window.currentLanguage === 'ru' ?
                    'Оптимальные условия выращивания' :
                    'Optimal growing conditions',
                recommendation: window.currentLanguage === 'ru' ?
                    'Продолжайте текущий режим полива и удобрения' :
                    'Continue current watering and fertilizing regimen',
                confidence: 92,
                date: new Date(Date.now() - 86400000).toISOString(), // 1 день назад
                status: 'completed'
            },
            {
                id: 2,
                userId: currentUser.id,
                plantType: window.currentLanguage === 'ru' ? 'Томаты' : 'Tomatoes',
                diagnosis: window.currentLanguage === 'ru' ?
                    'Легкая форма мучнистой росы' :
                    'Mild form of powdery mildew',
                cause: window.currentLanguage === 'ru' ?
                    'Высокая влажность воздуха' :
                    'High air humidity',
                recommendation: window.currentLanguage === 'ru' ?
                    'Обработать фунгицидом Топаз' :
                    'Treat with Topaz fungicide',
                confidence: 85,
                date: new Date(Date.now() - 172800000).toISOString(), // 2 дня назад
                status: 'completed'
            },
            {
                id: 3,
                userId: currentUser.id,
                plantType: window.currentLanguage === 'ru' ? 'Виноград' : 'Grapes',
                diagnosis: window.currentLanguage === 'ru' ?
                    'Анализ в процессе' :
                    'Analysis in progress',
                cause: window.currentLanguage === 'ru' ?
                    'Обработка изображения ИИ' :
                    'AI image processing',
                recommendation: window.currentLanguage === 'ru' ?
                    'Ожидайте результатов' :
                    'Await results',
                confidence: 0,
                date: new Date().toISOString(),
                status: 'processing'
            }
        ];

        userAnalysis.push(...demoAnalysis);
        data.analysis = userAnalysis;
        saveData(data);
    }

    // Сортируем по дате (новые сверху)
    userAnalysis.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Отображаем историю
    const scansList = document.getElementById('scansList');
    const noScans = document.getElementById('noScans');
    const totalScansCount = document.getElementById('totalScansCount');

    if (userAnalysis.length === 0) {
        scansList.innerHTML = '';
        noScans.style.display = 'block';
        totalScansCount.textContent = `0 ${window.getTranslation('total-scans')}`;
        return;
    }

    noScans.style.display = 'none';
    totalScansCount.textContent = `${userAnalysis.length} ${window.getPluralForm(userAnalysis.length, [
        window.getTranslation('analysis'),
        window.getTranslation('analyses'),
        window.getTranslation('analyses')
    ])}`;

    let html = '';

    userAnalysis.forEach(analysis => {
        const date = new Date(analysis.date);
        const formattedDate = date.toLocaleDateString(window.currentLanguage === 'ru' ? 'ru-RU' : 'en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        html += `
            <div class="scan-item">
                <div class="scan-header">
                    <div>
                        <div class="scan-title">${window.getTranslation('analysis')} #${analysis.id} - ${analysis.plantType}</div>
                        <div class="scan-date">${formattedDate}</div>
                    </div>
                    <div class="scan-status status-${analysis.status}">
                        ${analysis.status === 'completed' ?
            window.getTranslation('completed') :
            window.getTranslation('processing')}
                    </div>
                </div>
                
                <div class="scan-details">
                    <div class="detail-item">
                        <h4>${window.getTranslation('diagnosis')}</h4>
                        <p>${analysis.diagnosis}</p>
                    </div>
                    <div class="detail-item">
                        <h4>${window.getTranslation('cause')}</h4>
                        <p>${analysis.cause}</p>
                    </div>
                    <div class="detail-item">
                        <h4>${window.getTranslation('confidence')}</h4>
                        <p>${analysis.confidence}%</p>
                    </div>
                </div>
                
                <div class="detail-item">
                    <h4>${window.getTranslation('recommendations')}</h4>
                    <p>${analysis.recommendation}</p>
                </div>
                
                <div class="scan-actions">
                    <button class="btn btn-outline view-scan-btn" data-id="${analysis.id}">
                        <i class="fas fa-eye"></i> ${window.getTranslation('view-details')}
                    </button>
                    ${analysis.status === 'completed' ? `
                        <button class="btn btn-outline download-report-btn" data-id="${analysis.id}">
                            <i class="fas fa-download"></i> ${window.getTranslation('download-report')}
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    });

    scansList.innerHTML = html;

    // Добавляем обработчики для кнопок
    document.querySelectorAll('.view-scan-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const scanId = this.getAttribute('data-id');
            viewScanDetails(scanId);
        });
    });

    document.querySelectorAll('.download-report-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const scanId = this.getAttribute('data-id');
            downloadScanReport(scanId);
        });
    });
}

function viewScanDetails(scanId) {
    const data = getAllData();
    const scan = data.analysis.find(a => a.id == scanId);

    if (scan) {
        alert(
            window.getTranslation('analysis') + ' #' + scan.id + '\n\n' +
            window.getTranslation('plant-type') + ': ' + scan.plantType + '\n' +
            window.getTranslation('analysis-date') + ': ' + new Date(scan.date).toLocaleDateString(window.currentLanguage === 'ru' ? 'ru-RU' : 'en-US') + '\n' +
            window.getTranslation('diagnosis') + ': ' + scan.diagnosis + '\n' +
            window.getTranslation('cause') + ': ' + scan.cause + '\n' +
            window.getTranslation('recommendations') + ': ' + scan.recommendation + '\n' +
            window.getTranslation('confidence') + ': ' + scan.confidence + '%'
        );
    }
}

function downloadScanReport(scanId) {
    const data = getAllData();
    const scan = data.analysis.find(a => a.id == scanId);

    if (scan) {
        const report = window.currentLanguage === 'ru' ? `
            ОТЧЕТ ОБ АНАЛИЗЕ РАСТЕНИЙ
            =========================
            
            Номер анализа: #${scan.id}
            Дата анализа: ${new Date(scan.date).toLocaleDateString('ru-RU')}
            Тип растения: ${scan.plantType}
            
            РЕЗУЛЬТАТЫ АНАЛИЗА:
            -----------------
            Диагноз: ${scan.diagnosis}
            Причина: ${scan.cause}
            Уверенность анализа: ${scan.confidence}%
            
            РЕКОМЕНДАЦИИ:
            ------------
            ${scan.recommendation}
            
            Сгенерировано системой AgriVision
            ${new Date().toLocaleDateString('ru-RU')}
        ` : `
            PLANT ANALYSIS REPORT
            =====================
            
            Analysis number: #${scan.id}
            Analysis date: ${new Date(scan.date).toLocaleDateString('en-US')}
            Plant type: ${scan.plantType}
            
            ANALYSIS RESULTS:
            ----------------
            Diagnosis: ${scan.diagnosis}
            Cause: ${scan.cause}
            Analysis confidence: ${scan.confidence}%
            
            RECOMMENDATIONS:
            ----------------
            ${scan.recommendation}
            
            Generated by AgriVision system
            ${new Date().toLocaleDateString('en-US')}
        `;

        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `agrivision_analysis_${scanId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification(window.getTranslation('report-downloaded'), 'success');
    }
}

function loadStatistics() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const data = getAllData();

    // Общее количество анализов
    const totalAnalyses = data.analysis ? data.analysis.filter(a => a.userId === currentUser.id).length : 0;
    document.getElementById('totalAnalysesCount').textContent = totalAnalyses;

    // Количество завершенных заявок
    const completedRequests = data.requests.filter(r =>
        r.userId === currentUser.id && r.status === 'completed'
    ).length;
    document.getElementById('completedRequestsCount').textContent = completedRequests;

    // Количество активных уведомлений
    const activeNotifications = data.notifications ?
        data.notifications.filter(n => n.userId === currentUser.id && !n.isRead).length : 0;
    document.getElementById('activeNotificationsCount').textContent = activeNotifications;

    // Последняя активность
    const user = data.users.find(u => u.id === currentUser.id);
    if (user.lastActivity) {
        const lastActivityDate = new Date(user.lastActivity);
        document.getElementById('lastActivity').textContent =
            window.getTranslation('last-activity') + ': ' +
            lastActivityDate.toLocaleDateString(window.currentLanguage === 'ru' ? 'ru-RU' : 'en-US');
    }
}

function getStatusText(status) {
    const statusMap = {
        'new': window.getTranslation('new'),
        'processing': window.getTranslation('processing'),
        'completed': window.getTranslation('completed'),
        'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
}

function getAllData() {
    const data = localStorage.getItem('agrivision_db');
    if (!data) {
        const initialData = {
            users: [
                {
                    id: 1,
                    name: window.getTranslation('admin'),
                    email: 'admin@agrivision.ru',
                    password: 'AgriVision2024!',
                    phone: '+7 (900) 000-00-00',
                    role: 'admin',
                    bio: window.currentLanguage === 'ru' ? 'Системный администратор AgriVision' : 'AgriVision system administrator',
                    registrationDate: new Date().toISOString(),
                    lastActivity: new Date().toISOString()
                }
            ],
            requests: [],
            analysis: [],
            notifications: []
        };
        localStorage.setItem('agrivision_db', JSON.stringify(initialData));
        return initialData;
    }
    return JSON.parse(data);
}

function saveData(data) {
    localStorage.setItem('agrivision_db', JSON.stringify(data));
}

function showNotification(message, type = 'success', duration = 3000) {
    // Создаем уведомление, если его еще нет на странице
    let notification = document.getElementById('profileNotification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'profileNotification';
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 30px;
            background-color: ${type === 'success' ? '#2e7d32' : '#dc3545'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            max-width: 400px;
        `;
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.style.backgroundColor = type === 'success' ? '#2e7d32' : '#dc3545';
    notification.classList.add('active');
    notification.style.transform = 'translateY(0)';
    notification.style.opacity = '1';

    setTimeout(() => {
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
    }, duration);
}

function initEventHandlers() {
    // Обновляем последнюю активность при любом действии пользователя
    ['click', 'keypress', 'scroll'].forEach(event => {
        document.addEventListener(event, function() {
            updateLastActivity();
        });
    });
}

function updateLastActivity() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    const data = getAllData();
    const userIndex = data.users.findIndex(u => u.id === currentUser.id);

    if (userIndex !== -1) {
        data.users[userIndex].lastActivity = new Date().toISOString();
        saveData(data);
    }
}