// Админ-панель AgriVision

// Проверка прав при загрузке админки
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser || currentUser.role !== 'admin') {
    alert('Доступ запрещен! Пожалуйста, войдите как администратор.');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function() {
    // ==================== ИНИЦИАЛИЗАЦИЯ ====================

    // Загружаем данные
    const data = JSON.parse(localStorage.getItem('agrivision_db'));
    if (!data) {
        alert('Ошибка загрузки данных');
        return;
    }

    // ==================== ПЕРЕМЕННЫЕ ====================

    let currentRequestId = null;
    let currentView = 'dashboard';

    // ==================== ФУНКЦИИ УТИЛИТЫ ====================

    function showNotification(message, type = 'success', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10001;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, duration);

        // Добавляем стили для анимации
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function getStatusText(status) {
        const statusMap = {
            'new': { text: 'Новая', class: 'status-new', color: '#856404', bg: '#fff3cd' },
            'processing': { text: 'В обработке', class: 'status-processing', color: '#0c5460', bg: '#d1ecf1' },
            'completed': { text: 'Завершена', class: 'status-completed', color: '#155724', bg: '#d4edda' },
            'cancelled': { text: 'Отменена', class: 'status-cancelled', color: '#721c24', bg: '#f8d7da' }
        };
        return statusMap[status] || { text: 'Неизвестно', class: 'status-new', color: '#856404', bg: '#fff3cd' };
    }

    // ==================== РЕНДЕРИНГ АДМИНКИ ====================

    function renderAdminPanel() {
        const adminPanel = document.getElementById('adminPanel');
        if (!adminPanel) return;

        adminPanel.innerHTML = `
            <div class="admin-header">
                <h1><i class="fas fa-cogs"></i> Панель администратора AgriVision</h1>
                <div class="admin-actions">
                    <button class="admin-btn btn-secondary" id="refreshBtn">
                        <i class="fas fa-sync-alt"></i> Обновить
                    </button>
                    <button class="admin-btn btn-success" id="exportBtn">
                        <i class="fas fa-download"></i> Экспорт
                    </button>
                    <button class="admin-btn btn-danger" id="logoutBtn">
                        <i class="fas fa-sign-out-alt"></i> Выйти
                    </button>
                </div>
            </div>
            
            <div class="admin-content">
                <!-- Навигация -->
                <div class="admin-nav">
                    <button class="nav-btn active" data-view="dashboard">
                        <i class="fas fa-tachometer-alt"></i> Дашборд
                    </button>
                    <button class="nav-btn" data-view="requests">
                        <i class="fas fa-list-alt"></i> Заявки
                    </button>
                    <button class="nav-btn" data-view="users">
                        <i class="fas fa-users"></i> Пользователи
                    </button>
                    <button class="nav-btn" data-view="articles">
                        <i class="fas fa-newspaper"></i> Статьи
                    </button>
                    <button class="nav-btn" data-view="settings">
                        <i class="fas fa-cog"></i> Настройки
                    </button>
                </div>
                
                <!-- Контент -->
                <div id="adminContent">
                    <!-- Загружается динамически -->
                </div>
            </div>
            
            <!-- Модальные окна -->
            <div id="modalsContainer"></div>
        `;

        // Стили для навигации
        const navStyles = document.createElement('style');
        navStyles.textContent = `
            .admin-nav {
                display: flex;
                gap: 10px;
                margin-bottom: 30px;
                flex-wrap: wrap;
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .nav-btn {
                padding: 12px 24px;
                border: 2px solid #e9ecef;
                background: white;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                color: #495057;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s;
            }
            
            .nav-btn:hover {
                border-color: #2e7d32;
                color: #2e7d32;
            }
            
            .nav-btn.active {
                background: #2e7d32;
                border-color: #2e7d32;
                color: white;
            }
        `;
        document.head.appendChild(navStyles);

        // Инициализация
        initAdminPanel();
    }

    function initAdminPanel() {
        // Загрузка начального вида
        loadDashboard();

        // Обработчики навигации
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const view = this.dataset.view;
                currentView = view;

                switch(view) {
                    case 'dashboard':
                        loadDashboard();
                        break;
                    case 'requests':
                        loadRequests();
                        break;
                    case 'users':
                        loadUsers();
                        break;
                    case 'settings':
                        loadSettings();
                        break;
                    case 'articles':
                        loadArticles(); // новая функция для статей
                        break;
                }
            });
        });

        // Кнопка обновления
        document.getElementById('refreshBtn').addEventListener('click', function() {
            switch(currentView) {
                case 'dashboard': loadDashboard(); break;
                case 'requests': loadRequests(); break;
                case 'users': loadUsers(); break;
                case 'articles': loadArticles(); break;
                case 'settings': loadSettings(); break;
            }
            showNotification('Данные обновлены');
        });

        // Кнопка экспорта
        document.getElementById('exportBtn').addEventListener('click', function() {
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `agrivision_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            URL.revokeObjectURL(url);
            showNotification('Данные экспортированы в JSON файл');
        });

        // Кнопка выхода
        document.getElementById('logoutBtn').addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите выйти из админ-панели?')) {
                document.querySelector('.admin-panel-overlay').remove();
                document.getElementById('adminPanel').remove();
                document.body.style.overflow = 'auto';
                showNotification('Вы вышли из админ-панели', 'success');
            }
        });
    }

    // ==================== ЗАГРУЗКА РАЗДЕЛОВ ====================

    function loadDashboard() {
        const content = document.getElementById('adminContent');
        const stats = getStats();

        content.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon users">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="stat-info">
                        <h3>Пользователи</h3>
                        <p class="stat-number">${stats.totalUsers}</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon requests">
                        <i class="fas fa-list-alt"></i>
                    </div>
                    <div class="stat-info">
                        <h3>Всего заявок</h3>
                        <p class="stat-number">${stats.totalRequests}</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon pending">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-info">
                        <h3>Новых заявок</h3>
                        <p class="stat-number">${stats.newRequests}</p>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon completed">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-info">
                        <h3>Сегодня</h3>
                        <p class="stat-number">${stats.todayRequests}</p>
                    </div>
                </div>
            </div>
            
            <div class="table-section">
                <h2><i class="fas fa-history"></i> Последние заявки</h2>
                <div class="table-container">
                    ${renderRecentRequests()}
                </div>
            </div>
            
            <div class="table-section">
                <h2><i class="fas fa-chart-line"></i> Статистика</h2>
                <div style="padding: 20px; background: white; border-radius: 10px;">
                    <p>Всего пользователей: <strong>${stats.totalUsers}</strong></p>
                    <p>Всего заявок: <strong>${stats.totalRequests}</strong></p>
                    <p>Новых заявок: <strong>${stats.newRequests}</strong></p>
                    <p>Заявок сегодня: <strong>${stats.todayRequests}</strong></p>
                </div>
            </div>
        `;

        // Добавляем обработчики для кнопок в таблице
        setTimeout(() => {
            document.querySelectorAll('.btn-view').forEach(btn => {
                btn.addEventListener('click', function() {
                    const requestId = parseInt(this.dataset.id);
                    showRequestDetails(requestId);
                });
            });
        }, 100);
    }

    function loadRequests() {
        const content = document.getElementById('adminContent');

        content.innerHTML = `
            <div class="table-section">
                <h2><i class="fas fa-list-alt"></i> Управление заявками</h2>
                
                <div class="search-filter">
                    <div class="search-box">
                        <input type="text" id="searchRequests" class="form-control" placeholder="Поиск по заявкам...">
                    </div>
                    <select id="filterStatus" class="form-control filter-select">
                        <option value="">Все статусы</option>
                        <option value="new">Новые</option>
                        <option value="processing">В обработке</option>
                        <option value="completed">Завершены</option>
                        <option value="cancelled">Отменены</option>
                    </select>
                    <button class="admin-btn btn-primary" id="clearFilters">
                        <i class="fas fa-times"></i> Сбросить
                    </button>
                </div>
                
                <div class="table-container">
                    ${renderRequestsTable()}
                </div>
                
                <div class="export-options">
                    <button class="admin-btn btn-success" id="exportRequests">
                        <i class="fas fa-file-excel"></i> Экспорт в CSV
                    </button>
                    <button class="admin-btn btn-secondary" id="addDemoRequests">
                        <i class="fas fa-plus"></i> Добавить демо-заявки
                    </button>
                </div>
            </div>
        `;

        // Обработчики
        document.getElementById('searchRequests').addEventListener('input', function(e) {
            filterRequests(e.target.value, document.getElementById('filterStatus').value);
        });

        document.getElementById('filterStatus').addEventListener('change', function(e) {
            filterRequests(document.getElementById('searchRequests').value, e.target.value);
        });

        document.getElementById('clearFilters').addEventListener('click', function() {
            document.getElementById('searchRequests').value = '';
            document.getElementById('filterStatus').value = '';
            filterRequests('', '');
        });

        document.getElementById('exportRequests').addEventListener('click', exportRequestsToCSV);
        document.getElementById('addDemoRequests').addEventListener('click', addDemoRequests);

        // Добавляем обработчики для кнопок в таблице
        setTimeout(() => {
            initRequestTableHandlers();
        }, 100);
    }

    function loadUsers() {
        const content = document.getElementById('adminContent');

        content.innerHTML = `
            <div class="table-section">
                <h2><i class="fas fa-users"></i> Управление пользователями</h2>
                
                <div class="search-filter">
                    <div class="search-box">
                        <input type="text" id="searchUsers" class="form-control" placeholder="Поиск пользователей...">
                    </div>
                    <button class="admin-btn btn-primary" id="addUserBtn">
                        <i class="fas fa-user-plus"></i> Добавить пользователя
                    </button>
                </div>
                
                <div class="table-container">
                    ${renderUsersTable()}
                </div>
            </div>
        `;

        // Обработчики
        document.getElementById('searchUsers').addEventListener('input', function(e) {
            filterUsers(e.target.value);
        });

        document.getElementById('addUserBtn').addEventListener('click', showAddUserModal);

        // Добавляем обработчики для кнопок в таблице
        setTimeout(() => {
            initUserTableHandlers();
        }, 100);
    }

    function loadSettings() {
        const content = document.getElementById('adminContent');

        content.innerHTML = `
            <div class="settings-grid">
                <div class="setting-card">
                    <h3><i class="fas fa-cog"></i> Настройки сайта</h3>
                    
                    <div class="form-group">
                        <label>Название сайта</label>
                        <input type="text" id="siteName" class="form-control" value="${data.settings.siteName}">
                    </div>
                    
                    <div class="form-group">
                        <label>Контактный email</label>
                        <input type="email" id="contactEmail" class="form-control" value="${data.settings.contactEmail}">
                    </div>
                    
                    <div class="form-group">
                        <label>Телефон поддержки</label>
                        <input type="text" id="supportPhone" class="form-control" value="${data.settings.supportPhone}">
                    </div>
                    
                    <div class="form-group">
                        <label>Статус сайта</label>
                        <select id="siteStatus" class="form-control">
                            <option value="active" ${data.settings.siteStatus === 'active' ? 'selected' : ''}>Активен</option>
                            <option value="maintenance" ${data.settings.siteStatus === 'maintenance' ? 'selected' : ''}>На обслуживании</option>
                        </select>
                    </div>
                    
                    <button class="admin-btn btn-primary" id="saveSettings">
                        <i class="fas fa-save"></i> Сохранить настройки
                    </button>
                </div>
                
                <div class="setting-card">
                    <h3><i class="fas fa-database"></i> Управление данными</h3>
                    
                    <div class="form-group">
                        <label>Резервное копирование</label>
                        <p style="color: #666; font-size: 14px; margin: 5px 0 15px 0;">
                            Создайте резервную копию всех данных сайта
                        </p>
                        <button class="admin-btn btn-success" id="backupBtn" style="width: 100%;">
                            <i class="fas fa-download"></i> Создать backup
                        </button>
                    </div>
                    
                    <div class="form-group">
                        <label>Восстановление из backup</label>
                        <p style="color: #666; font-size: 14px; margin: 5px 0 15px 0;">
                            Загрузите файл backup.json для восстановления данных
                        </p>
                        <input type="file" id="restoreFile" class="form-control" accept=".json">
                        <button class="admin-btn btn-warning" id="restoreBtn" style="width: 100%; margin-top: 10px;">
                            <i class="fas fa-upload"></i> Восстановить данные
                        </button>
                    </div>
                    
                    <div class="form-group">
                        <label>Очистка данных</label>
                        <p style="color: #666; font-size: 14px; margin: 5px 0 15px 0;">
                            Внимание! Это действие нельзя отменить
                        </p>
                        <button class="admin-btn btn-danger" id="clearDataBtn" style="width: 100%;">
                            <i class="fas fa-trash-alt"></i> Очистить все данные
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Обработчики
        document.getElementById('saveSettings').addEventListener('click', saveSettings);
        document.getElementById('backupBtn').addEventListener('click', createBackup);
        document.getElementById('restoreBtn').addEventListener('click', restoreFromBackup);
        document.getElementById('clearDataBtn').addEventListener('click', clearAllData);
    }


    // ==================== УПРАВЛЕНИЕ СТАТЬЯМИ ====================

function loadArticles() {
    const content = document.getElementById('adminContent');
    
    // Инициализируем статьи, если их нет
    if (!data.articles) {
        data.articles = [];
        localStorage.setItem('agrivision_db', JSON.stringify(data));
    }

    // Сортируем статьи по дате (новые сверху)
    const sortedArticles = [...data.articles].sort((a, b) => 
        new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
    );

    content.innerHTML = `
        <div class="table-section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2><i class="fas fa-newspaper"></i> Управление статьями</h2>
                <button class="admin-btn btn-success" id="addArticleBtn">
                    <i class="fas fa-plus"></i> Добавить статью
                </button>
            </div>
            
            ${sortedArticles.length === 0 ? 
                '<div style="text-align: center; padding: 40px; background: white; border-radius: 10px;">' +
                    '<i class="fas fa-newspaper" style="font-size: 48px; color: #ddd; margin-bottom: 20px;"></i>' +
                    '<h3 style="color: #666;">Статей пока нет</h3>' +
                    '<p style="color: #999;">Добавьте первую статью, нажав кнопку выше</p>' +
                '</div>' : 
                `
                <div class="table-container">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Заголовок</th>
                                <th>Категория</th>
                                <th>Дата</th>
                                <th>Просмотры</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sortedArticles.map(article => `
                                <tr>
                                    <td>#${article.id}</td>
                                    <td><strong>${article.title}</strong></td>
                                    <td>
                                        <span class="status-badge" style="
                                            background: ${getArticleCategoryColor(article.category)};
                                            color: white;
                                            padding: 4px 10px;
                                            border-radius: 12px;
                                            font-size: 12px;
                                            font-weight: 600;
                                        ">
                                            ${getCategoryName(article.category)}
                                        </span>
                                    </td>
                                    <td>${article.date || new Date(article.createdAt).toLocaleDateString('ru-RU')}</td>
                                    <td>${article.views || 0}</td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="action-btn btn-edit" data-article-id="${article.id}" style="background: #17a2b8; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="action-btn btn-delete" data-article-id="${article.id}" style="background: #dc3545; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                `
            }
        </div>
    `;

    // Обработчик кнопки добавления статьи
    document.getElementById('addArticleBtn').addEventListener('click', showAddArticleModal);
    
    // Обработчики для кнопок в таблице
    setTimeout(() => {
        document.querySelectorAll('.btn-edit[data-article-id]').forEach(btn => {
            btn.addEventListener('click', function() {
                const articleId = parseInt(this.dataset.articleId);
                editArticle(articleId);
            });
        });
        
        document.querySelectorAll('.btn-delete[data-article-id]').forEach(btn => {
            btn.addEventListener('click', function() {
                const articleId = parseInt(this.dataset.articleId);
                deleteArticle(articleId);
            });
        });
    }, 100);
}

// Вспомогательные функции для статей
function getArticleCategoryColor(category) {
    const colors = {
        'diseases': '#dc3545',
        'agriculture': '#28a745',
        'tips': '#ffc107',
        'news': '#17a2b8',
        'default': '#6c757d'
    };
    return colors[category] || colors.default;
}

function getCategoryName(category) {
    const names = {
        'diseases': 'Болезни',
        'agriculture': 'Сельское хоз-во',
        'tips': 'Советы',
        'news': 'Новости',
        'default': 'Статья'
    };
    return names[category] || names.default;
}

// Функция показа модального окна добавления статьи
function showAddArticleModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #2e7d32; font-size: 22px;">
                    <i class="fas fa-plus-circle"></i> Добавить новую статью
                </h2>
                <button id="closeArticleModal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                    <span style="color: #dc3545;">*</span> Заголовок статьи
                </label>
                <input type="text" id="articleTitle" 
                       placeholder="Например: Как лечить паршу на яблонях"
                       style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px;">
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                    Краткое описание
                </label>
                <textarea id="articleDescription" rows="3"
                          placeholder="Короткое описание, которое будет видно в списке статей"
                          style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; resize: vertical;"></textarea>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                    <span style="color: #dc3545;">*</span> Полный текст статьи
                </label>
                <textarea id="articleContent" rows="10"
                          placeholder="Напишите здесь полный текст статьи..."
                          style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; resize: vertical;"></textarea>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                    Ссылка на изображение
                </label>
                <input type="text" id="articleImage" 
                       placeholder="https://example.com/photo.jpg (можно оставить пустым)"
                       style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px;">
                <small style="color: #666; font-size: 13px; display: block; margin-top: 5px;">
                    Если не указать, будет использовано изображение по умолчанию
                </small>
            </div>
            
            <div style="margin-bottom: 30px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                    Категория
                </label>
                <select id="articleCategory" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px;">
                    <option value="diseases">Болезни растений</option>
                    <option value="agriculture">Сельское хозяйство</option>
                    <option value="tips">Советы и рекомендации</option>
                    <option value="news">Новости</option>
                </select>
            </div>
            
            <div style="display: flex; gap: 15px;">
                <button id="saveArticleBtn" 
                        style="flex: 1; background: #2e7d32; color: white; border: none; padding: 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 16px;">
                    <i class="fas fa-save"></i> Опубликовать статью
                </button>
                <button id="cancelArticleBtn"
                        style="flex: 1; background: #6c757d; color: white; border: none; padding: 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 16px;">
                    <i class="fas fa-times"></i> Отмена
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Фокус на поле заголовка
    setTimeout(() => {
        document.getElementById('articleTitle').focus();
    }, 100);
    
    // Обработчики событий
    document.getElementById('closeArticleModal').addEventListener('click', () => modal.remove());
    document.getElementById('cancelArticleBtn').addEventListener('click', () => modal.remove());
    
    document.getElementById('saveArticleBtn').addEventListener('click', () => {
        const title = document.getElementById('articleTitle').value.trim();
        const content = document.getElementById('articleContent').value.trim();
        const description = document.getElementById('articleDescription').value.trim();
        const image = document.getElementById('articleImage').value.trim();
        const category = document.getElementById('articleCategory').value;
        
        // Проверка обязательных полей
        if (!title) {
            alert('Пожалуйста, введите заголовок статьи!');
            document.getElementById('articleTitle').focus();
            return;
        }
        
        if (!content) {
            alert('Пожалуйста, напишите текст статьи!');
            document.getElementById('articleContent').focus();
            return;
        }
        
        // Создаем ID для новой статьи
        let newId = 1;
        if (data.articles && data.articles.length > 0) {
            newId = Math.max(...data.articles.map(a => a.id)) + 1;
        }
        
        // Создаем объект статьи
        const newArticle = {
            id: newId,
            title: title,
            content: content,
            description: description || title.substring(0, 120) + '...',
            image: image || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80',
            category: category,
            date: new Date().toLocaleDateString('ru-RU'),
            createdAt: new Date().toISOString(),
            author: 'Администратор',
            views: 0,
            isPublished: true
        };
        
        // Добавляем статью в массив
        if (!data.articles) {
            data.articles = [];
        }
        data.articles.push(newArticle);
        
        // Сохраняем в localStorage
        localStorage.setItem('agrivision_db', JSON.stringify(data));
        
        // Показываем уведомление
        showNotification(`Статья "${title}" успешно опубликована!`);
        
        // Закрываем окно
        modal.remove();
        
        // Обновляем список статей
        if (currentView === 'articles') {
            loadArticles();
        }
    });
    
    // Закрытие по клику на затемненную область
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
}

// Функция редактирования статьи
function editArticle(articleId) {
    const article = data.articles.find(a => a.id === articleId);
    if (!article) {
        showNotification('Статья не найдена', 'error');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="margin: 0; color: #2e7d32; font-size: 22px;">
                    <i class="fas fa-edit"></i> Редактировать статью
                </h2>
                <button id="closeEditArticleModal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                    <span style="color: #dc3545;">*</span> Заголовок статьи
                </label>
                <input type="text" id="editArticleTitle" 
                       value="${article.title.replace(/"/g, '&quot;')}"
                       style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px;">
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                    Краткое описание
                </label>
                <textarea id="editArticleDescription" rows="3"
                          style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; resize: vertical;">${article.description || ''}</textarea>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                    <span style="color: #dc3545;">*</span> Полный текст статьи
                </label>
                <textarea id="editArticleContent" rows="10"
                          style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; resize: vertical;">${article.content}</textarea>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                    Ссылка на изображение
                </label>
                <input type="text" id="editArticleImage" 
                       value="${article.image || ''}"
                       style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px;">
            </div>
            
            <div style="margin-bottom: 30px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                    Категория
                </label>
                <select id="editArticleCategory" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px;">
                    <option value="diseases" ${article.category === 'diseases' ? 'selected' : ''}>Болезни растений</option>
                    <option value="agriculture" ${article.category === 'agriculture' ? 'selected' : ''}>Сельское хозяйство</option>
                    <option value="tips" ${article.category === 'tips' ? 'selected' : ''}>Советы и рекомендации</option>
                    <option value="news" ${article.category === 'news' ? 'selected' : ''}>Новости</option>
                </select>
            </div>
            
            <div style="display: flex; gap: 15px;">
                <button id="updateArticleBtn" 
                        style="flex: 1; background: #2e7d32; color: white; border: none; padding: 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 16px;">
                    <i class="fas fa-save"></i> Сохранить изменения
                </button>
                <button id="cancelEditArticleBtn"
                        style="flex: 1; background: #6c757d; color: white; border: none; padding: 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 16px;">
                    <i class="fas fa-times"></i> Отмена
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Обработчики событий
    document.getElementById('closeEditArticleModal').addEventListener('click', () => modal.remove());
    document.getElementById('cancelEditArticleBtn').addEventListener('click', () => modal.remove());
    
    document.getElementById('updateArticleBtn').addEventListener('click', () => {
        const title = document.getElementById('editArticleTitle').value.trim();
        const content = document.getElementById('editArticleContent').value.trim();
        const description = document.getElementById('editArticleDescription').value.trim();
        const image = document.getElementById('editArticleImage').value.trim();
        const category = document.getElementById('editArticleCategory').value;
        
        if (!title || !content) {
            alert('Заполните обязательные поля!');
            return;
        }
        
        // Обновляем статью
        article.title = title;
        article.content = content;
        article.description = description || title.substring(0, 120) + '...';
        article.image = image || article.image;
        article.category = category;
        
        // Сохраняем изменения
        localStorage.setItem('agrivision_db', JSON.stringify(data));
        
        showNotification('Статья успешно обновлена!');
        modal.remove();
        
        // Обновляем список
        if (currentView === 'articles') {
            loadArticles();
        }
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
}

// Функция удаления статьи
function deleteArticle(articleId) {
    if (!confirm('Вы уверены, что хотите удалить эту статью?')) {
        return;
    }
    
    const articleIndex = data.articles.findIndex(a => a.id === articleId);
    if (articleIndex === -1) {
        showNotification('Статья не найдена', 'error');
        return;
    }
    
    const articleTitle = data.articles[articleIndex].title;
    data.articles.splice(articleIndex, 1);
    
    localStorage.setItem('agrivision_db', JSON.stringify(data));
    showNotification(`Статья "${articleTitle}" удалена`);
    
    // Обновляем список статей
    if (currentView === 'articles') {
        loadArticles();
    }
}

// Добавляем стили для модальных окон
if (!document.getElementById('modal-styles')) {
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10002;
            padding: 20px;
        }
        
        .modal-overlay .modal-content {
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            animation: modalSlideIn 0.3s ease;
            padding: 25px;
        }
        
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        input:focus, textarea:focus, select:focus {
            border-color: #2e7d32 !important;
            outline: none;
            box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1) !important;
        }
    `;
    document.head.appendChild(style);
}
    // ==================== ФУНКЦИИ РЕНДЕРИНГА ====================

    function renderRecentRequests() {
        const recentRequests = [...data.requests]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        if (recentRequests.length === 0) {
            return '<p style="text-align: center; color: #666; padding: 20px;">Нет заявок</p>';
        }

        let html = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Email</th>
                        <th>Статус</th>
                        <th>Дата</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
        `;

        recentRequests.forEach(request => {
            const status = getStatusText(request.status);

            html += `
                <tr>
                    <td>#${request.id}</td>
                    <td>${request.name}</td>
                    <td>${request.email}</td>
                    <td>
                        <span class="status-badge" style="
                            background: ${status.bg};
                            color: ${status.color};
                            padding: 4px 8px;
                            border-radius: 12px;
                            font-size: 12px;
                            font-weight: 600;
                        ">
                            ${status.text}
                        </span>
                    </td>
                    <td>${formatDate(request.createdAt)}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn btn-view" data-id="${request.id}" style="
                                background: #17a2b8;
                                color: white;
                                border: none;
                                padding: 6px 12px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                            ">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        return html;
    }

    function renderRequestsTable(filteredRequests = null) {
        const requests = filteredRequests || data.requests;

        if (requests.length === 0) {
            return '<p style="text-align: center; color: #666; padding: 20px;">Нет заявок</p>';
        }

        let html = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Email</th>
                        <th>Телефон</th>
                        <th>Тип</th>
                        <th>Статус</th>
                        <th>Дата</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
        `;

        requests.forEach(request => {
            const status = getStatusText(request.status);

            html += `
                <tr>
                    <td>#${request.id}</td>
                    <td>${request.name}</td>
                    <td>${request.email}</td>
                    <td>${request.phone || 'Не указан'}</td>
                    <td>${getRequestTypeText(request.type)}</td>
                    <td>
                        <span class="status-badge" style="
                            background: ${status.bg};
                            color: ${status.color};
                            padding: 4px 8px;
                            border-radius: 12px;
                            font-size: 12px;
                            font-weight: 600;
                        ">
                            ${status.text}
                        </span>
                    </td>
                    <td>${formatDate(request.createdAt)}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn btn-view" data-id="${request.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn btn-edit" data-id="${request.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn btn-delete" data-id="${request.id}">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        return html;
    }

    function renderUsersTable(filteredUsers = null) {
        const users = filteredUsers || data.users;

        if (users.length === 0) {
            return '<p style="text-align: center; color: #666; padding: 20px;">Нет пользователей</p>';
        }

        let html = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Email</th>
                        <th>Роль</th>
                        <th>Дата регистрации</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
        `;

        users.forEach(user => {
            html += `
                <tr>
                    <td>#${user.id}</td>
                    <td>
                        ${user.name}
                        ${user.role === 'admin' ? '<i class="fas fa-crown" style="color: #ffc107; margin-left: 5px;"></i>' : ''}
                    </td>
                    <td>${user.email}</td>
                    <td>
                        <span style="
                            background: ${user.role === 'admin' ? '#dc3545' : '#6c757d'};
                            color: white;
                            padding: 4px 8px;
                            border-radius: 12px;
                            font-size: 12px;
                            font-weight: 600;
                        ">
                            ${user.role === 'admin' ? 'Админ' : 'Пользователь'}
                        </span>
                    </td>
                    <td>${formatDate(user.registrationDate)}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn btn-delete" data-user-id="${user.id}" ${user.role === 'admin' ? 'disabled' : ''}>
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        return html;
    }

    // ==================== ФУНКЦИИ БИЗНЕС-ЛОГИКИ ====================

    function getStats() {
        const today = new Date().toISOString().split('T')[0];

        return {
            totalUsers: data.users.length,
            totalRequests: data.requests.length,
            newRequests: data.requests.filter(r => r.status === 'new').length,
            todayRequests: data.requests.filter(r =>
                r.createdAt.split('T')[0] === today
            ).length
        };
    }

    function getRequestTypeText(type) {
        const types = {
            'consultation': 'Консультация',
            'demo': 'Демо-версия',
            'partnership': 'Сотрудничество',
            'other': 'Другое'
        };
        return types[type] || type;
    }

    function filterRequests(searchTerm, statusFilter) {
        let filtered = data.requests;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(request =>
                request.name.toLowerCase().includes(term) ||
                request.email.toLowerCase().includes(term) ||
                request.phone?.toLowerCase().includes(term) ||
                request.message?.toLowerCase().includes(term)
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(request => request.status === statusFilter);
        }

        // Сортируем по дате (новые сверху)
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const tableContainer = document.querySelector('.table-container');
        if (tableContainer) {
            tableContainer.innerHTML = renderRequestsTable(filtered);
            initRequestTableHandlers();
        }
    }

    function filterUsers(searchTerm) {
        let filtered = data.users;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term)
            );
        }

        const tableContainer = document.querySelector('.table-container');
        if (tableContainer) {
            tableContainer.innerHTML = renderUsersTable(filtered);
            initUserTableHandlers();
        }
    }

    function initRequestTableHandlers() {
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = parseInt(this.dataset.id);
                showRequestDetails(requestId);
            });
        });

        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = parseInt(this.dataset.id);
                editRequestStatus(requestId);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const requestId = parseInt(this.dataset.id);
                deleteRequest(requestId);
            });
        });
    }

    function initUserTableHandlers() {
        document.querySelectorAll('.btn-delete[data-user-id]').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = parseInt(this.dataset.userId);
                deleteUser(userId);
            });
        });
    }

    function showRequestDetails(requestId) {
        const request = data.requests.find(r => r.id === requestId);
        if (!request) return;

        const status = getStatusText(request.status);

        const modal = document.createElement('div');
        modal.className = 'request-details-modal active';
        modal.innerHTML = `
            <div class="request-details-content">
                <h2 style="margin-top: 0; color: #2e7d32;">
                    <i class="fas fa-file-alt"></i> Заявка #${request.id}
                </h2>
                
                <div class="request-field">
                    <label>Статус</label>
                    <div class="value">
                        <span style="
                            background: ${status.bg};
                            color: ${status.color};
                            padding: 6px 12px;
                            border-radius: 15px;
                            font-weight: 600;
                            display: inline-block;
                        ">
                            ${status.text}
                        </span>
                    </div>
                </div>
                
                <div class="request-field">
                    <label>Имя</label>
                    <div class="value">${request.name}</div>
                </div>
                
                <div class="request-field">
                    <label>Email</label>
                    <div class="value">${request.email}</div>
                </div>
                
                <div class="request-field">
                    <label>Телефон</label>
                    <div class="value">${request.phone || 'Не указан'}</div>
                </div>
                
                <div class="request-field">
                    <label>Тип заявки</label>
                    <div class="value">${getRequestTypeText(request.type)}</div>
                </div>
                
                <div class="request-field">
                    <label>Сообщение</label>
                    <div class="value" style="
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 6px;
                        white-space: pre-wrap;
                    ">
                        ${request.message || 'Нет сообщения'}
                    </div>
                </div>
                
                <div class="request-field">
                    <label>Дата создания</label>
                    <div class="value">${formatDate(request.createdAt)}</div>
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 30px;">
                    <button class="admin-btn btn-primary" id="changeStatusBtn">
                        <i class="fas fa-edit"></i> Изменить статус
                    </button>
                    <button class="admin-btn btn-secondary" id="closeDetailsBtn">
                        Закрыть
                    </button>
                </div>
            </div>
        `;

        document.getElementById('modalsContainer').appendChild(modal);

        document.getElementById('closeDetailsBtn').addEventListener('click', () => {
            modal.remove();
        });

        document.getElementById('changeStatusBtn').addEventListener('click', () => {
            modal.remove();
            editRequestStatus(requestId);
        });

        // Закрытие по клику вне контента
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.remove();
            }
        });
    }

    function editRequestStatus(requestId) {
        const request = data.requests.find(r => r.id === requestId);
        if (!request) return;

        const modal = document.createElement('div');
        modal.className = 'request-details-modal active';
        modal.innerHTML = `
            <div class="request-details-content">
                <h2 style="margin-top: 0; color: #2e7d32;">
                    <i class="fas fa-edit"></i> Изменение статуса заявки #${request.id}
                </h2>
                
                <div class="form-group">
                    <label>Текущий статус</label>
                    <div style="padding: 10px; background: #f8f9fa; border-radius: 6px;">
                        ${getStatusText(request.status).text}
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Новый статус</label>
                    <select id="newStatus" class="form-control">
                        <option value="new">Новая</option>
                        <option value="processing">В обработке</option>
                        <option value="completed">Завершена</option>
                        <option value="cancelled">Отменена</option>
                    </select>
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 30px;">
                    <button class="admin-btn btn-primary" id="saveStatusBtn">
                        <i class="fas fa-save"></i> Сохранить
                    </button>
                    <button class="admin-btn btn-secondary" id="cancelStatusBtn">
                        Отмена
                    </button>
                </div>
            </div>
        `;

        document.getElementById('modalsContainer').appendChild(modal);

        document.getElementById('newStatus').value = request.status;

        document.getElementById('saveStatusBtn').addEventListener('click', () => {
            const newStatus = document.getElementById('newStatus').value;
            updateRequestStatus(requestId, newStatus);
            modal.remove();
        });

        document.getElementById('cancelStatusBtn').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.remove();
            }
        });
    }

    function updateRequestStatus(requestId, newStatus) {
        const requestIndex = data.requests.findIndex(r => r.id === requestId);
        if (requestIndex === -1) return;

        data.requests[requestIndex].status = newStatus;
        localStorage.setItem('agrivision_db', JSON.stringify(data));

        showNotification(`Статус заявки #${requestId} изменен на "${getStatusText(newStatus).text}"`);

        // Обновляем таблицу
        if (currentView === 'requests') {
            filterRequests(
                document.getElementById('searchRequests')?.value || '',
                document.getElementById('filterStatus')?.value || ''
            );
        } else if (currentView === 'dashboard') {
            loadDashboard();
        }
    }

    function deleteRequest(requestId) {
        if (!confirm(`Вы уверены, что хотите удалить заявку #${requestId}?`)) return;

        const requestIndex = data.requests.findIndex(r => r.id === requestId);
        if (requestIndex === -1) return;

        data.requests.splice(requestIndex, 1);
        localStorage.setItem('agrivision_db', JSON.stringify(data));

        showNotification(`Заявка #${requestId} удалена`);

        // Обновляем таблицу
        if (currentView === 'requests') {
            filterRequests(
                document.getElementById('searchRequests')?.value || '',
                document.getElementById('filterStatus')?.value || ''
            );
        } else if (currentView === 'dashboard') {
            loadDashboard();
        }
    }

    function deleteUser(userId) {
        const user = data.users.find(u => u.id === userId);
        if (!user) return;

        if (user.role === 'admin') {
            showNotification('Нельзя удалить администратора', 'error');
            return;
        }

        if (!confirm(`Вы уверены, что хотите удалить пользователя ${user.name}?`)) return;

        const userIndex = data.users.findIndex(u => u.id === userId);
        data.users.splice(userIndex, 1);
        localStorage.setItem('agrivision_db', JSON.stringify(data));

        showNotification(`Пользователь ${user.name} удален`);

        // Обновляем таблицу
        if (currentView === 'users') {
            filterUsers(document.getElementById('searchUsers')?.value || '');
        } else if (currentView === 'dashboard') {
            loadDashboard();
        }
    }

    function showAddUserModal() {
        const modal = document.createElement('div');
        modal.className = 'add-user-modal active';
        modal.innerHTML = `
            <div class="add-user-content">
                <h2 style="margin-top: 0; color: #2e7d32;">
                    <i class="fas fa-user-plus"></i> Добавить пользователя
                </h2>
                
                <div class="form-group">
                    <label>Имя пользователя</label>
                    <input type="text" id="newUserName" class="form-control" placeholder="Введите имя">
                </div>
                
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="newUserEmail" class="form-control" placeholder="Введите email">
                </div>
                
                <div class="form-group">
                    <label>Пароль</label>
                    <input type="password" id="newUserPassword" class="form-control" placeholder="Введите пароль">
                </div>
                
                <div class="form-group">
                    <label>Роль</label>
                    <select id="newUserRole" class="form-control">
                        <option value="user">Пользователь</option>
                        <option value="admin">Администратор</option>
                    </select>
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 30px;">
                    <button class="admin-btn btn-primary" id="saveUserBtn">
                        <i class="fas fa-save"></i> Сохранить
                    </button>
                    <button class="admin-btn btn-secondary" id="cancelUserBtn">
                        Отмена
                    </button>
                </div>
            </div>
        `;

        document.getElementById('modalsContainer').appendChild(modal);

        document.getElementById('saveUserBtn').addEventListener('click', () => {
            const name = document.getElementById('newUserName').value.trim();
            const email = document.getElementById('newUserEmail').value.trim();
            const password = document.getElementById('newUserPassword').value;
            const role = document.getElementById('newUserRole').value;

            if (!name || !email || !password) {
                showNotification('Заполните все поля', 'error');
                return;
            }

            if (!email.includes('@')) {
                showNotification('Введите корректный email', 'error');
                return;
            }

            // Проверяем, существует ли пользователь
            const existingUser = data.users.find(u => u.email === email);
            if (existingUser) {
                showNotification('Пользователь с таким email уже существует', 'error');
                return;
            }

            // Добавляем пользователя
            const newId = data.users.length > 0
                ? Math.max(...data.users.map(u => u.id)) + 1
                : 1;

            data.users.push({
                id: newId,
                name,
                email,
                password,
                role,
                registrationDate: new Date().toISOString()
            });

            localStorage.setItem('agrivision_db', JSON.stringify(data));

            showNotification(`Пользователь ${name} добавлен`);
            modal.remove();

            // Обновляем таблицу
            if (currentView === 'users') {
                filterUsers(document.getElementById('searchUsers')?.value || '');
            } else if (currentView === 'dashboard') {
                loadDashboard();
            }
        });

        document.getElementById('cancelUserBtn').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.remove();
            }
        });
    }

    function exportRequestsToCSV() {
        let csv = 'ID;Имя;Email;Телефон;Тип;Статус;Сообщение;Дата создания\n';

        data.requests.forEach(request => {
            const row = [
                request.id,
                `"${request.name}"`,
                request.email,
                request.phone || '',
                getRequestTypeText(request.type),
                getStatusText(request.status).text,
                `"${(request.message || '').replace(/"/g, '""')}"`,
                formatDate(request.createdAt)
            ].join(';');

            csv += row + '\n';
        });

        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `agrivision_requests_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
        showNotification('Заявки экспортированы в CSV файл');
    }

    function addDemoRequests() {
        const demoRequests = [
            {
                name: "Иван Петров",
                email: "ivan.petrov@example.com",
                phone: "+7 (912) 345-67-89",
                type: "consultation",
                message: "Интересует консультация по внедрению системы мониторинга полей",
                status: "new"
            },
            {
                name: "Мария Сидорова",
                email: "maria.sidorova@example.com",
                phone: "+7 (923) 456-78-90",
                type: "demo",
                message: "Хотела бы получить демо-версию вашего продукта для нашего хозяйства",
                status: "processing"
            },
            {
                name: "Алексей Козлов",
                email: "alexey.kozlov@example.com",
                phone: "+7 (934) 567-89-01",
                type: "partnership",
                message: "Предлагаем сотрудничество в рамках пилотного проекта",
                status: "completed"
            }
        ];

        demoRequests.forEach(request => {
            const newId = data.requests.length > 0
                ? Math.max(...data.requests.map(r => r.id)) + 1
                : 1;

            data.requests.push({
                id: newId,
                ...request,
                createdAt: new Date().toISOString()
            });
        });

        localStorage.setItem('agrivision_db', JSON.stringify(data));
        showNotification('Демо-заявки добавлены');

        if (currentView === 'requests') {
            loadRequests();
        } else if (currentView === 'dashboard') {
            loadDashboard();
        }
    }

    function saveSettings() {
        data.settings = {
            siteName: document.getElementById('siteName').value,
            contactEmail: document.getElementById('contactEmail').value,
            supportPhone: document.getElementById('supportPhone').value,
            siteStatus: document.getElementById('siteStatus').value
        };

        localStorage.setItem('agrivision_db', JSON.stringify(data));
        showNotification('Настройки сохранены');
    }

    function createBackup() {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `agrivision_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
        showNotification('Backup создан и скачан');
    }

    function restoreFromBackup() {
        const fileInput = document.getElementById('restoreFile');
        if (!fileInput.files.length) {
            showNotification('Выберите файл для восстановления', 'error');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            try {
                const backupData = JSON.parse(e.target.result);

                // Проверяем структуру данных
                if (!backupData.users || !backupData.requests || !backupData.settings) {
                    throw new Error('Неверный формат файла backup');
                }

                if (!confirm('ВНИМАНИЕ! Все текущие данные будут заменены. Продолжить?')) {
                    return;
                }

                // Сохраняем новые данные
                localStorage.setItem('agrivision_db', JSON.stringify(backupData));

                // Перезагружаем страницу
                showNotification('Данные восстановлены. Страница будет перезагружена...', 'success');
                setTimeout(() => {
                    location.reload();
                }, 2000);

            } catch (error) {
                showNotification('Ошибка при восстановлении: ' + error.message, 'error');
            }
        };

        reader.readAsText(file);
    }

    function clearAllData() {
        if (!confirm('ВНИМАНИЕ! Все данные будут удалены без возможности восстановления. Это действие нельзя отменить. Продолжить?')) {
            return;
        }

        if (!confirm('Вы уверены? Это удалит всех пользователей (кроме админа), все заявки и сбросит настройки.')) {
            return;
        }

        // Сохраняем только администратора
        const adminUser = data.users.find(u => u.role === 'admin');

        const clearedData = {
            users: adminUser ? [adminUser] : [],
            requests: [],
            settings: {
                siteName: "AgriVision",
                contactEmail: "info@agrivision.ru",
                supportPhone: "+7 (800) 123-45-67",
                siteStatus: "active"
            }
        };

        localStorage.setItem('agrivision_db', JSON.stringify(clearedData));

        showNotification('Все данные очищены. Страница будет перезагружена...', 'success');
        setTimeout(() => {
            location.reload();
        }, 2000);
    }

    // ==================== ЗАПУСК ====================

    // Ждем немного перед рендерингом
    setTimeout(() => {
        renderAdminPanel();
    }, 100);
});

// ==================== ДЛЯ ОТОБРАЖЕНИЯ СТАТЕЙ НА САЙТЕ ====================

// Эту функцию нужно вызвать на главной странице (index.html)
function displayArticlesOnMainPage(containerId = 'articlesContainer', limit = 6) {
    const data = JSON.parse(localStorage.getItem('agrivision_db'));
    
    if (!data || !data.articles || data.articles.length === 0) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-newspaper" style="font-size: 48px; opacity: 0.5; margin-bottom: 20px;"></i>
                    <h3>Статей пока нет</h3>
                    <p>Заходите позже!</p>
                </div>
            `;
        }
        return;
    }
    
    // Сортируем по дате (новые сначала) и ограничиваем количество
    const articlesToShow = [...data.articles]
        .filter(article => article.isPublished !== false) // Показываем только опубликованные
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
    
    let html = '';
    
    articlesToShow.forEach(article => {
        html += `
        <div class="article-card" style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: transform 0.3s;">
            <div style="height: 200px; overflow: hidden;">
                <img src="${article.image}" alt="${article.title}" 
                     style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="padding: 20px;">
                <div style="background: ${getArticleCategoryColor(article.category)}; color: white; padding: 4px 12px; 
                           border-radius: 15px; font-size: 12px; display: inline-block; margin-bottom: 10px;">
                    ${getCategoryName(article.category)}
                </div>
                <h3 style="margin: 10px 0; font-size: 18px; color: #333; min-height: 54px;">
                    ${article.title}
                </h3>
                <p style="color: #666; font-size: 14px; line-height: 1.5; margin-bottom: 15px; min-height: 42px;">
                    ${article.description || ''}
                </p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: #999; font-size: 12px;">
                        <i class="far fa-calendar"></i> ${article.date}
                    </span>
                    <button onclick="openArticle(${article.id})" 
                            style="background: #2e7d32; color: white; border: none; 
                                   padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: 600;">
                        Читать <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
        `;
    });
    
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = html;
    }
}

// Функция для открытия полной статьи
function openArticle(articleId) {
    const data = JSON.parse(localStorage.getItem('agrivision_db'));
    if (!data || !data.articles) return;
    
    const article = data.articles.find(a => a.id === articleId);
    if (!article) return;
    
    // Увеличиваем счетчик просмотров
    article.views = (article.views || 0) + 1;
    localStorage.setItem('agrivision_db', JSON.stringify(data));
    
    // Создаем модальное окно для статьи
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="background: white; max-width: 800px; max-height: 90vh; 
                   overflow-y: auto; border-radius: 10px; position: relative;">
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="position: absolute; top: 15px; right: 15px; 
                           background: none; border: none; font-size: 24px; 
                           cursor: pointer; color: #666; z-index: 1;">
                <i class="fas fa-times"></i>
            </button>
            
            <img src="${article.image}" alt="${article.title}" 
                 style="width: 100%; height: 300px; object-fit: cover;">
            
            <div style="padding: 30px;">
                <div style="background: ${getArticleCategoryColor(article.category)}; color: white; padding: 4px 12px; 
                           border-radius: 15px; font-size: 12px; display: inline-block; margin-bottom: 15px;">
                    ${getCategoryName(article.category)}
                </div>
                
                <h1 style="margin-top: 0; color: #2e7d32;">${article.title}</h1>
                
                <div style="display: flex; gap: 20px; color: #666; margin-bottom: 20px;">
                    <span><i class="far fa-calendar"></i> ${article.date}</span>
                    <span><i class="fas fa-user"></i> ${article.author}</span>
                    <span><i class="far fa-eye"></i> ${article.views || 0} просмотров</span>
                </div>
                
                <div style="line-height: 1.8; color: #333; font-size: 16px; white-space: pre-line;">
                    ${article.content}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Автоматически показывать статьи при загрузке главной страницы
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            displayArticlesOnMainPage('articlesContainer', 6);
        }, 500);
    });
}

// ==================== РАЗДЕЛ СТАТЕЙ ====================

function loadArticles() {
    const content = document.getElementById('adminContent');
    
    // Проверяем, есть ли статьи в данных
    if (!data.articles) {
        data.articles = [];
        localStorage.setItem('agrivision_db', JSON.stringify(data));
    }
    
    content.innerHTML = `
        <div class="table-section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2><i class="fas fa-newspaper"></i> Управление статьями</h2>
                <button class="admin-btn btn-success" id="addArticleBtn">
                    <i class="fas fa-plus"></i> Добавить статью
                </button>
            </div>
            
            ${data.articles.length === 0 ? 
                '<div style="text-align: center; padding: 60px; background: white; border-radius: 10px;">' +
                    '<i class="fas fa-newspaper" style="font-size: 60px; color: #ddd; margin-bottom: 20px;"></i>' +
                    '<h3 style="color: #666;">Статей пока нет</h3>' +
                    '<p style="color: #999;">Нажмите кнопку "Добавить статью" выше</p>' +
                '</div>' : 
                `
                <div class="table-container">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Заголовок</th>
                                <th>Категория</th>
                                <th>Дата</th>
                                <th>Просмотры</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.articles.map(article => `
                                <tr>
                                    <td>#${article.id}</td>
                                    <td><strong>${article.title}</strong></td>
                                    <td>
                                        <span class="status-badge" style="
                                            background: ${getArticleCategoryColor(article.category)};
                                            color: white;
                                            padding: 6px 12px;
                                            border-radius: 15px;
                                            font-size: 12px;
                                            font-weight: 600;
                                        ">
                                            ${getCategoryName(article.category)}
                                        </span>
                                    </td>
                                    <td>${article.date || 'Без даты'}</td>
                                    <td>${article.views || 0}</td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="action-btn btn-edit" onclick="editArticle(${article.id})" 
                                                    style="background: #17a2b8; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; margin-right: 5px;">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="action-btn btn-delete" onclick="deleteArticle(${article.id})" 
                                                    style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                `
            }
        </div>
    `;
    
    // Обработчик кнопки добавления
    document.getElementById('addArticleBtn').addEventListener('click', showAddArticleModal);
}

// Вспомогательные функции для категорий статей
function getArticleCategoryColor(category) {
    const colors = {
        'diseases': '#dc3545',
        'agriculture': '#28a745',
        'tips': '#ffc107',
        'news': '#17a2b8'
    };
    return colors[category] || '#6c757d';
}

function getCategoryName(category) {
    const names = {
        'diseases': 'Болезни',
        'agriculture': 'Сельское хоз-во',
        'tips': 'Советы',
        'news': 'Новости'
    };
    return names[category] || 'Статья';
}

// Функция показа окна добавления статьи
function showAddArticleModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        z-index: 10002;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 10px; width: 100%; max-width: 700px; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
            <div style="padding: 25px 25px 15px 25px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; color: #2e7d32; font-size: 22px;">
                    <i class="fas fa-plus-circle"></i> Добавить новую статью
                </h2>
                <button id="closeModalBtn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div style="padding: 25px;">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                        <span style="color: #dc3545;">*</span> Заголовок статьи
                    </label>
                    <input type="text" id="articleTitle" 
                           placeholder="Например: Как лечить паршу на яблонях"
                           style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px;">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                        Краткое описание
                    </label>
                    <textarea id="articleDescription" rows="3"
                              placeholder="Короткое описание, которое будет видно в списке статей"
                              style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; resize: vertical;"></textarea>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                        <span style="color: #dc3545;">*</span> Полный текст статьи
                    </label>
                    <textarea id="articleContent" rows="12"
                              placeholder="Напишите здесь полный текст статьи..."
                              style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; resize: vertical;"></textarea>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                        Ссылка на изображение
                    </label>
                    <input type="text" id="articleImage" 
                           placeholder="https://example.com/photo.jpg (можно оставить пустым)"
                           style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px;">
                    <small style="color: #666; font-size: 13px; display: block; margin-top: 5px;">
                        Если не указать, будет использовано изображение по умолчанию
                    </small>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                        Категория
                    </label>
                    <select id="articleCategory" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px;">
                        <option value="diseases">Болезни растений</option>
                        <option value="agriculture">Сельское хозяйство</option>
                        <option value="tips">Советы и рекомендации</option>
                        <option value="news">Новости</option>
                    </select>
                </div>
                
                <div style="display: flex; gap: 15px;">
                    <button id="saveArticleBtn" 
                            style="flex: 1; background: #2e7d32; color: white; border: none; padding: 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 16px;">
                        <i class="fas fa-save"></i> Опубликовать статью
                    </button>
                    <button id="cancelArticleBtn"
                            style="flex: 1; background: #6c757d; color: white; border: none; padding: 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 16px;">
                        <i class="fas fa-times"></i> Отмена
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Фокус на поле заголовка
    setTimeout(() => {
        document.getElementById('articleTitle').focus();
    }, 100);
    
    // Обработчики событий
    document.getElementById('closeModalBtn').addEventListener('click', () => modal.remove());
    document.getElementById('cancelArticleBtn').addEventListener('click', () => modal.remove());
    
    // Сохранение статьи
    document.getElementById('saveArticleBtn').addEventListener('click', function() {
        const title = document.getElementById('articleTitle').value.trim();
        const content = document.getElementById('articleContent').value.trim();
        const description = document.getElementById('articleDescription').value.trim();
        const image = document.getElementById('articleImage').value.trim();
        const category = document.getElementById('articleCategory').value;
        
        // Проверка обязательных полей
        if (!title) {
            alert('Пожалуйста, введите заголовок статьи!');
            document.getElementById('articleTitle').focus();
            return;
        }
        
        if (!content) {
            alert('Пожалуйста, напишите текст статьи!');
            document.getElementById('articleContent').focus();
            return;
        }
        
        // Создаем ID для новой статьи
        let newId = 1;
        if (data.articles && data.articles.length > 0) {
            newId = Math.max(...data.articles.map(a => a.id)) + 1;
        }
        
        // Создаем объект статьи
        const newArticle = {
            id: newId,
            title: title,
            content: content,
            description: description || title.substring(0, 120) + '...',
            image: image || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80',
            category: category,
            date: new Date().toLocaleDateString('ru-RU'),
            createdAt: new Date().toISOString(),
            author: 'Администратор',
            views: 0,
            isPublished: true
        };
        
        // Добавляем статью в массив
        if (!data.articles) {
            data.articles = [];
        }
        data.articles.push(newArticle);
        
        // Сохраняем в localStorage
        localStorage.setItem('agrivision_db', JSON.stringify(data));
        
        // Показываем уведомление
        showNotification(`Статья "${title}" успешно опубликована!`);
        
        // Закрываем окно
        modal.remove();
        
        // Обновляем список статей
        if (currentView === 'articles') {
            loadArticles();
        }
    });
    
    // Закрытие по клику на затемненную область
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
}

// Функция редактирования статьи
function editArticle(articleId) {
    const article = data.articles.find(a => a.id === articleId);
    if (!article) {
        alert('Статья не найдена');
        return;
    }
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        z-index: 10002;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 10px; width: 100%; max-width: 700px; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
            <div style="padding: 25px 25px 15px 25px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; color: #2e7d32; font-size: 22px;">
                    <i class="fas fa-edit"></i> Редактировать статью
                </h2>
                <button id="closeEditModalBtn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div style="padding: 25px;">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                        <span style="color: #dc3545;">*</span> Заголовок статьи
                    </label>
                    <input type="text" id="editArticleTitle" 
                           value="${article.title.replace(/"/g, '&quot;')}"
                           style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px;">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                        Краткое описание
                    </label>
                    <textarea id="editArticleDescription" rows="3"
                              style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; resize: vertical;">${article.description || ''}</textarea>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                        <span style="color: #dc3545;">*</span> Полный текст статьи
                    </label>
                    <textarea id="editArticleContent" rows="12"
                              style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; resize: vertical;">${article.content}</textarea>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                        Ссылка на изображение
                    </label>
                    <input type="text" id="editArticleImage" 
                           value="${article.image || ''}"
                           style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px;">
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">
                        Категория
                    </label>
                    <select id="editArticleCategory" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px;">
                        <option value="diseases" ${article.category === 'diseases' ? 'selected' : ''}>Болезни растений</option>
                        <option value="agriculture" ${article.category === 'agriculture' ? 'selected' : ''}>Сельское хозяйство</option>
                        <option value="tips" ${article.category === 'tips' ? 'selected' : ''}>Советы и рекомендации</option>
                        <option value="news" ${article.category === 'news' ? 'selected' : ''}>Новости</option>
                    </select>
                </div>
                
                <div style="display: flex; gap: 15px;">
                    <button id="updateArticleBtn" 
                            style="flex: 1; background: #2e7d32; color: white; border: none; padding: 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 16px;">
                        <i class="fas fa-save"></i> Сохранить изменения
                    </button>
                    <button id="cancelEditBtn"
                            style="flex: 1; background: #6c757d; color: white; border: none; padding: 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 16px;">
                        <i class="fas fa-times"></i> Отмена
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Обработчики событий
    document.getElementById('closeEditModalBtn').addEventListener('click', () => modal.remove());
    document.getElementById('cancelEditBtn').addEventListener('click', () => modal.remove());
    
    // Сохранение изменений
    document.getElementById('updateArticleBtn').addEventListener('click', function() {
        const title = document.getElementById('editArticleTitle').value.trim();
        const content = document.getElementById('editArticleContent').value.trim();
        const description = document.getElementById('editArticleDescription').value.trim();
        const image = document.getElementById('editArticleImage').value.trim();
        const category = document.getElementById('editArticleCategory').value;
        
        if (!title || !content) {
            alert('Заполните обязательные поля!');
            return;
        }
        
        // Обновляем статью
        article.title = title;
        article.content = content;
        article.description = description || title.substring(0, 120) + '...';
        article.image = image || article.image;
        article.category = category;
        
        // Сохраняем изменения
        localStorage.setItem('agrivision_db', JSON.stringify(data));
        
        showNotification('Статья успешно обновлена!');
        modal.remove();
        
        // Обновляем список
        if (currentView === 'articles') {
            loadArticles();
        }
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
}

// Функция удаления статьи
function deleteArticle(articleId) {
    if (!confirm('Вы уверены, что хотите удалить эту статью?')) {
        return;
    }
    
    const articleIndex = data.articles.findIndex(a => a.id === articleId);
    if (articleIndex === -1) {
        alert('Статья не найдена');
        return;
    }
    
    const articleTitle = data.articles[articleIndex].title;
    data.articles.splice(articleIndex, 1);
    
    localStorage.setItem('agrivision_db', JSON.stringify(data));
    showNotification(`Статья "${articleTitle}" удалена`);
    
    // Обновляем список статей
    if (currentView === 'articles') {
        loadArticles();
    }
}
