// admin.js - Админ панель для новой структуры API

let currentUser = null;
let currentSection = 'dashboard';
let useAPI = false;

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Инициализация админ-панели');
    
    // Проверяем авторизацию и роль
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser || currentUser.role !== 'admin') {
        alert('Доступ запрещен! Пожалуйста, войдите как администратор.');
        window.location.href = 'index.html';
        return;
    }

    // Проверяем доступность API
    useAPI = window.api && api.isAvailable;
    
    if (useAPI) {
        console.log('✅ Используем API для админки');
        try {
            // Загружаем данные через API
            await loadAdminDataFromAPI();
        } catch (error) {
            console.warn('⚠️ Ошибка загрузки данных через API:', error);
            useAPI = false;
            initLocalAdminData();
        }
    } else {
        console.log('📁 Используем localStorage для админки');
        initLocalAdminData();
    }

    // Рендерим админ-панель
    renderAdminPanel();
});

// ==================== ЗАГРУЗКА ДАННЫХ ====================

async function loadAdminDataFromAPI() {
    console.log('📥 Загружаем данные для админки через API...');
    
    try {
        // Загружаем пользователей
        const usersData = await api.getAdminUsers();
        
        // Загружаем заявки
        const requestsData = await api.getAdminRequests();
        
        // Загружаем статьи
        const articlesData = await api.getArticles();
        
        // Загружаем статистику
        const statsData = await api.getAdminStats();
        
        // Сохраняем в глобальную переменную
        adminData = {
            users: usersData,
            requests: requestsData,
            articles: articlesData,
            stats: statsData,
            settings: {
                siteName: "AgriVision",
                contactEmail: "info@agrivision.ru",
                supportPhone: "+7 (800) 123-45-67",
                siteStatus: "active"
            }
        };
        
        console.log('✅ Данные загружены через API');
        
    } catch (error) {
        console.error('❌ Ошибка загрузки данных через API:', error);
        throw error;
    }
}

function initLocalAdminData() {
    adminData = JSON.parse(localStorage.getItem('agrivision_db'));
    if (!adminData) {
        adminData = {
            users: [
                {
                    id: 1,
                    name: "Администратор",
                    email: "admin@agrivision.ru",
                    password: "AgriVision2024!",
                    role: "admin",
                    registrationDate: "2024-01-01T00:00:00.000Z"
                }
            ],
            requests: [],
            articles: [],
            settings: {
                siteName: "AgriVision",
                contactEmail: "info@agrivision.ru",
                supportPhone: "+7 (800) 123-45-67",
                siteStatus: "active"
            }
        };
        localStorage.setItem('agrivision_db', JSON.stringify(adminData));
    }
}

// ==================== РЕНДЕРИНГ АДМИНКИ ====================

function renderAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (!adminPanel) {
        console.error('Элемент #adminPanel не найден!');
        return;
    }

    adminPanel.innerHTML = `
        <div class="admin-header">
            <h1><i class="fas fa-cogs"></i> Панель администратора AgriVision</h1>
            <div class="admin-info">
                <span class="api-status ${useAPI ? 'online' : 'offline'}">
                    <i class="fas fa-circle"></i> ${useAPI ? 'API онлайн' : 'Локальный режим'}
                </span>
                <span class="user-info">
                    <i class="fas fa-user-shield"></i> ${currentUser.name}
                </span>
            </div>
            <div class="admin-actions">
                <button class="admin-btn btn-secondary" id="refreshBtn">
                    <i class="fas fa-sync-alt"></i> Обновить
                </button>
                <button class="admin-btn btn-danger" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i> Выйти
                </button>
            </div>
        </div>
        
        <div class="admin-content">
            <!-- Навигация -->
            <div class="admin-nav">
                <button class="nav-btn active" data-section="dashboard">
                    <i class="fas fa-tachometer-alt"></i> Дашборд
                </button>
                <button class="nav-btn" data-section="users">
                    <i class="fas fa-users"></i> Пользователи
                </button>
                <button class="nav-btn" data-section="requests">
                    <i class="fas fa-list-alt"></i> Заявки
                </button>
                <button class="nav-btn" data-section="articles">
                    <i class="fas fa-newspaper"></i> Статьи
                </button>
                <button class="nav-btn" data-section="analysis">
                    <i class="fas fa-brain"></i> Анализы
                </button>
                <button class="nav-btn" data-section="settings">
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

    // Инициализация панели
    initPanelFunctions();
    loadDashboard();
}

function initPanelFunctions() {
    // Обработчики навигации
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const section = this.dataset.section;
            currentSection = section;

            switch(section) {
                case 'dashboard':
                    loadDashboard();
                    break;
                case 'users':
                    loadUsers();
                    break;
                case 'requests':
                    loadRequests();
                    break;
                case 'articles':
                    loadArticles();
                    break;
                case 'analysis':
                    loadAnalysis();
                    break;
                case 'settings':
                    loadSettings();
                    break;
            }
        });
    });

    // Кнопка обновления
    document.getElementById('refreshBtn').addEventListener('click', async function() {
        const btn = this;
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обновление...';
        btn.disabled = true;

        try {
            if (useAPI) {
                await loadAdminDataFromAPI();
            }
            
            switch(currentSection) {
                case 'dashboard': loadDashboard(); break;
                case 'users': loadUsers(); break;
                case 'requests': loadRequests(); break;
                case 'articles': loadArticles(); break;
                case 'analysis': loadAnalysis(); break;
                case 'settings': loadSettings(); break;
            }
            
            showNotification('Данные обновлены', 'success');
        } catch (error) {
            showNotification('Ошибка обновления данных', 'error');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });

    // Кнопка выхода
    document.getElementById('logoutBtn').addEventListener('click', async function() {
        if (confirm('Вы уверены, что хотите выйти из админ-панели?')) {
            if (useAPI) {
                try {
                    await api.logout();
                } catch (error) {
                    console.log('Ошибка выхода через API:', error);
                }
            }
            localStorage.removeItem('currentUser');
            localStorage.removeItem('access_token');
            window.location.href = 'index.html';
        }
    });
}

// ==================== ЗАГРУЗКА РАЗДЕЛОВ ====================

function loadDashboard() {
    const stats = calculateStats();
    
    const content = document.getElementById('adminContent');
    content.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon users">
                    <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                    <h3>Пользователи</h3>
                    <p class="stat-number">${stats.totalUsers}</p>
                    <p class="stat-change">+${stats.newUsersToday} сегодня</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon requests">
                    <i class="fas fa-list-alt"></i>
                </div>
                <div class="stat-info">
                    <h3>Заявки</h3>
                    <p class="stat-number">${stats.totalRequests}</p>
                    <p class="stat-change">${stats.pendingRequests} ожидают</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon analysis">
                    <i class="fas fa-brain"></i>
                </div>
                <div class="stat-info">
                    <h3>Анализы</h3>
                    <p class="stat-number">${stats.totalAnalysis}</p>
                    <p class="stat-change">${stats.todayAnalysis} сегодня</p>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon articles">
                    <i class="fas fa-newspaper"></i>
                </div>
                <div class="stat-info">
                    <h3>Статьи</h3>
                    <p class="stat-number">${stats.totalArticles}</p>
                    <p class="stat-change">${stats.articleViews} просмотров</p>
                </div>
            </div>
        </div>
        
        <div class="dashboard-sections">
            <div class="dashboard-section">
                <h3><i class="fas fa-history"></i> Последние действия</h3>
                <div class="table-container">
                    ${renderRecentActivity()}
                </div>
            </div>
            
            <div class="dashboard-section">
                <h3><i class="fas fa-chart-line"></i> Быстрые действия</h3>
                <div class="quick-actions">
                    <button class="action-btn btn-primary" onclick="loadUsers()">
                        <i class="fas fa-user-plus"></i> Добавить пользователя
                    </button>
                    <button class="action-btn btn-success" onclick="loadArticles()">
                        <i class="fas fa-plus"></i> Добавить статью
                    </button>
                    <button class="action-btn btn-warning" onclick="loadRequests()">
                        <i class="fas fa-eye"></i> Проверить заявки
                    </button>
                </div>
            </div>
        </div>
    `;
}

function loadUsers() {
    const content = document.getElementById('adminContent');
    
    content.innerHTML = `
        <div class="section-header">
            <h2><i class="fas fa-users"></i> Управление пользователями</h2>
            <button class="btn btn-primary" id="addUserBtn">
                <i class="fas fa-user-plus"></i> Добавить пользователя
            </button>
        </div>
        
        <div class="search-box">
            <input type="text" id="searchUsers" placeholder="Поиск пользователей..." class="form-control">
            <i class="fas fa-search"></i>
        </div>
        
        <div class="table-container">
            ${renderUsersTable()}
        </div>
    `;

    // Обработчики
    document.getElementById('searchUsers').addEventListener('input', function(e) {
        filterUsers(e.target.value);
    });

    document.getElementById('addUserBtn').addEventListener('click', showAddUserModal);
    
    // Инициализация обработчиков таблицы
    setTimeout(() => {
        initUserTableHandlers();
    }, 100);
}

function loadRequests() {
    const content = document.getElementById('adminContent');
    
    content.innerHTML = `
        <div class="section-header">
            <h2><i class="fas fa-list-alt"></i> Управление заявками</h2>
        </div>
        
        <div class="filters">
            <div class="search-box">
                <input type="text" id="searchRequests" placeholder="Поиск заявок..." class="form-control">
                <i class="fas fa-search"></i>
            </div>
            <select id="filterStatus" class="form-control">
                <option value="">Все статусы</option>
                <option value="pending">Ожидают</option>
                <option value="processing">В обработке</option>
                <option value="completed">Завершены</option>
            </select>
        </div>
        
        <div class="table-container">
            ${renderRequestsTable()}
        </div>
    `;

    // Обработчики
    document.getElementById('searchRequests').addEventListener('input', function(e) {
        filterRequests(e.target.value, document.getElementById('filterStatus').value);
    });

    document.getElementById('filterStatus').addEventListener('change', function(e) {
        filterRequests(document.getElementById('searchRequests').value, e.target.value);
    });
    
    // Инициализация обработчиков таблицы
    setTimeout(() => {
        initRequestTableHandlers();
    }, 100);
}

function loadArticles() {
    const content = document.getElementById('adminContent');
    
    content.innerHTML = `
        <div class="section-header">
            <h2><i class="fas fa-newspaper"></i> Управление статьями</h2>
            <button class="btn btn-primary" id="addArticleBtn">
                <i class="fas fa-plus"></i> Добавить статью
            </button>
        </div>
        
        <div class="search-box">
            <input type="text" id="searchArticles" placeholder="Поиск статей..." class="form-control">
            <i class="fas fa-search"></i>
        </div>
        
        <div class="table-container">
            ${renderArticlesTable()}
        </div>
    `;

    // Обработчики
    document.getElementById('searchArticles').addEventListener('input', function(e) {
        filterArticles(e.target.value);
    });

    document.getElementById('addArticleBtn').addEventListener('click', showAddArticleModal);
    
    // Инициализация обработчиков таблицы
    setTimeout(() => {
        initArticleTableHandlers();
    }, 100);
}

function loadAnalysis() {
    const content = document.getElementById('adminContent');
    
    content.innerHTML = `
        <div class="section-header">
            <h2><i class="fas fa-brain"></i> Анализы заболеваний</h2>
        </div>
        
        <div class="search-box">
            <input type="text" id="searchAnalysis" placeholder="Поиск анализов..." class="form-control">
            <i class="fas fa-search"></i>
        </div>
        
        <div class="table-container">
            ${renderAnalysisTable()}
        </div>
    `;

    // Обработчики
    document.getElementById('searchAnalysis').addEventListener('input', function(e) {
        filterAnalysis(e.target.value);
    });
    
    // Инициализация обработчиков таблицы
    setTimeout(() => {
        initAnalysisTableHandlers();
    }, 100);
}

function loadSettings() {
    const content = document.getElementById('adminContent');
    
    content.innerHTML = `
        <div class="settings-grid">
            <div class="setting-card">
                <h3><i class="fas fa-cog"></i> Настройки системы</h3>
                
                <div class="form-group">
                    <label>Название сайта</label>
                    <input type="text" id="siteName" class="form-control" 
                           value="${adminData.settings?.siteName || 'AgriVision'}">
                </div>
                
                <div class="form-group">
                    <label>Email для связи</label>
                    <input type="email" id="contactEmail" class="form-control" 
                           value="${adminData.settings?.contactEmail || 'info@agrivision.ru'}">
                </div>
                
                <div class="form-group">
                    <label>Телефон поддержки</label>
                    <input type="text" id="supportPhone" class="form-control" 
                           value="${adminData.settings?.supportPhone || '+7 (800) 123-45-67'}">
                </div>
                
                <button class="btn btn-primary" id="saveSettings">
                    <i class="fas fa-save"></i> Сохранить настройки
                </button>
            </div>
            
            <div class="setting-card">
                <h3><i class="fas fa-database"></i> Управление данными</h3>
                
                <div class="form-group">
                    <label>Создать резервную копию</label>
                    <button class="btn btn-success" id="backupBtn" style="width: 100%;">
                        <i class="fas fa-download"></i> Экспорт данных
                    </button>
                </div>
                
                <div class="form-group">
                    <label>Восстановить из backup</label>
                    <input type="file" id="restoreFile" class="form-control" accept=".json">
                    <button class="btn btn-warning" id="restoreBtn" style="width: 100%; margin-top: 10px;">
                        <i class="fas fa-upload"></i> Восстановить
                    </button>
                </div>
                
                <div class="form-group">
                    <label>Очистить кэш</label>
                    <button class="btn btn-danger" id="clearCacheBtn" style="width: 100%;">
                        <i class="fas fa-trash"></i> Очистить
                    </button>
                </div>
            </div>
            
            <div class="setting-card">
                <h3><i class="fas fa-chart-bar"></i> Статистика системы</h3>
                <div class="system-stats">
                    <p><strong>Режим работы:</strong> ${useAPI ? 'API' : 'Локальный'}</p>
                    <p><strong>Всего пользователей:</strong> ${adminData.users?.length || 0}</p>
                    <p><strong>Всего заявок:</strong> ${adminData.requests?.length || 0}</p>
                    <p><strong>Всего статей:</strong> ${adminData.articles?.length || 0}</p>
                </div>
            </div>
        </div>
    `;

    // Обработчики
    document.getElementById('saveSettings').addEventListener('click', saveSettings);
    document.getElementById('backupBtn').addEventListener('click', createBackup);
    document.getElementById('restoreBtn').addEventListener('click', restoreFromBackup);
    document.getElementById('clearCacheBtn').addEventListener('click', clearCache);
}

// ==================== ФУНКЦИИ РЕНДЕРИНГА ТАБЛИЦ ====================

function renderUsersTable(users = null) {
    const userList = users || adminData.users || [];
    
    if (userList.length === 0) {
        return '<div class="empty-state">Нет пользователей</div>';
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
    
    userList.forEach(user => {
        html += `
            <tr>
                <td>#${user.id}</td>
                <td>
                    <strong>${escapeHtml(user.name)}</strong>
                    ${user.role === 'admin' ? '<span class="badge badge-danger">Админ</span>' : ''}
                </td>
                <td>${escapeHtml(user.email)}</td>
                <td>
                    <span class="role-badge ${user.role}">
                        ${user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    </span>
                </td>
                <td>${formatDate(user.registrationDate)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-info view-user-btn" data-id="${user.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${user.role !== 'admin' ? `
                            <button class="btn btn-sm btn-danger delete-user-btn" data-id="${user.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    return html;
}

function renderRequestsTable(requests = null) {
    const requestList = requests || adminData.requests || [];
    
    if (requestList.length === 0) {
        return '<div class="empty-state">Нет заявок</div>';
    }
    
    let html = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Пользователь</th>
                    <th>Тип</th>
                    <th>Описание</th>
                    <th>Статус</th>
                    <th>Дата</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    requestList.forEach(request => {
        const status = getRequestStatus(request.status);
        const user = adminData.users?.find(u => u.id === request.userId);
        
        html += `
            <tr>
                <td>#${request.id}</td>
                <td>
                    ${user ? escapeHtml(user.name) : 'Неизвестно'}
                    <br><small>${user ? escapeHtml(user.email) : ''}</small>
                </td>
                <td>${getRequestType(request.type)}</td>
                <td class="truncate-text" title="${escapeHtml(request.description || '')}">
                    ${escapeHtml(request.description?.substring(0, 50) || '')}${request.description?.length > 50 ? '...' : ''}
                </td>
                <td>
                    <span class="status-badge ${status.class}">
                        ${status.text}
                    </span>
                </td>
                <td>${formatDate(request.createdAt)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-info view-request-btn" data-id="${request.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-warning edit-request-btn" data-id="${request.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    return html;
}

function renderArticlesTable(articles = null) {
    const articleList = articles || adminData.articles || [];
    
    if (articleList.length === 0) {
        return '<div class="empty-state">Нет статей</div>';
    }
    
    let html = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Заголовок</th>
                    <th>Категория</th>
                    <th>Просмотры</th>
                    <th>Дата</th>
                    <th>Статус</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    articleList.forEach(article => {
        html += `
            <tr>
                <td>#${article.id}</td>
                <td>
                    <strong>${escapeHtml(article.title)}</strong>
                    <br><small>${escapeHtml(article.description?.substring(0, 60) || '')}${article.description?.length > 60 ? '...' : ''}</small>
                </td>
                <td>
                    <span class="category-badge" style="background: ${getArticleCategoryColor(article.category)}">
                        ${getArticleCategoryName(article.category)}
                    </span>
                </td>
                <td>${article.views || 0}</td>
                <td>${formatDate(article.createdAt || article.date)}</td>
                <td>
                    <span class="status-badge ${article.isPublished !== false ? 'published' : 'draft'}">
                        ${article.isPublished !== false ? 'Опубликовано' : 'Черновик'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-info view-article-btn" data-id="${article.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-warning edit-article-btn" data-id="${article.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-article-btn" data-id="${article.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    return html;
}

function renderAnalysisTable(analysis = null) {
    // Эта функция будет отображать историю анализов
    // Пока используем демо-данные или данные из localStorage
    
    let analysisList = analysis || [];
    
    if (!analysisList.length && adminData.analysis) {
        analysisList = adminData.analysis;
    }
    
    if (analysisList.length === 0) {
        return '<div class="empty-state">Нет данных об анализах</div>';
    }
    
    let html = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Пользователь</th>
                    <th>Тип растения</th>
                    <th>Диагноз</th>
                    <th>Уверенность</th>
                    <th>Дата</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    analysisList.forEach(item => {
        const user = adminData.users?.find(u => u.id === item.userId);
        const isHealthy = item.visual_status === 'healthy';
        
        html += `
            <tr>
                <td>#${item.id}</td>
                <td>${user ? escapeHtml(user.name) : 'Неизвестно'}</td>
                <td>${escapeHtml(item.plantType || 'Неизвестно')}</td>
                <td>
                    <span class="diagnosis-badge ${isHealthy ? 'healthy' : 'diseased'}">
                        ${isHealthy ? '✅ Здорово' : '⚠️ Заболевание'}
                    </span>
                </td>
                <td>
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${item.confidence || 0}%"></div>
                        <span>${item.confidence || 0}%</span>
                    </div>
                </td>
                <td>${formatDate(item.date)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-info view-analysis-btn" data-id="${item.id}">
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

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

function calculateStats() {
    const today = new Date().toISOString().split('T')[0];
    
    return {
        totalUsers: adminData.users?.length || 0,
        newUsersToday: adminData.users?.filter(u => 
            u.registrationDate && u.registrationDate.split('T')[0] === today
        ).length || 0,
        totalRequests: adminData.requests?.length || 0,
        pendingRequests: adminData.requests?.filter(r => 
            r.status === 'pending' || r.status === 'new'
        ).length || 0,
        totalAnalysis: adminData.analysis?.length || 0,
        todayAnalysis: adminData.analysis?.filter(a => 
            a.date && a.date.split('T')[0] === today
        ).length || 0,
        totalArticles: adminData.articles?.length || 0,
        articleViews: adminData.articles?.reduce((sum, article) => 
            sum + (article.views || 0), 0
        ) || 0
    };
}

function getRequestStatus(status) {
    const statuses = {
        'new': { text: 'Новая', class: 'new' },
        'pending': { text: 'Ожидает', class: 'pending' },
        'processing': { text: 'В обработке', class: 'processing' },
        'completed': { text: 'Завершена', class: 'completed' }
    };
    return statuses[status] || { text: 'Неизвестно', class: 'unknown' };
}

function getRequestType(type) {
    const types = {
        'consultation': 'Консультация',
        'demo': 'Демо-версия',
        'support': 'Поддержка',
        'other': 'Другое'
    };
    return types[type] || 'Неизвестно';
}

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

function getArticleCategoryName(category) {
    const names = {
        'diseases': 'Болезни',
        'agriculture': 'Сельское хозяйство',
        'tips': 'Советы',
        'news': 'Новости',
        'default': 'Статья'
    };
    return names[category] || names.default;
}

function formatDate(dateString) {
    if (!dateString) return 'Нет даты';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Некорректная дата';
    
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'success') {
    // Удаляем старые уведомления
    const oldNotifications = document.querySelectorAll('.admin-notification');
    oldNotifications.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== ФИЛЬТРАЦИЯ И ПОИСК ====================

function filterUsers(searchTerm) {
    if (!searchTerm) {
        const tableContainer = document.querySelector('.table-container');
        if (tableContainer) {
            tableContainer.innerHTML = renderUsersTable();
            initUserTableHandlers();
        }
        return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = adminData.users.filter(user =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
    );
    
    const tableContainer = document.querySelector('.table-container');
    if (tableContainer) {
        tableContainer.innerHTML = renderUsersTable(filtered);
        initUserTableHandlers();
    }
}

function filterRequests(searchTerm, statusFilter) {
    let filtered = adminData.requests || [];
    
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(request => {
            const user = adminData.users?.find(u => u.id === request.userId);
            return (
                (user && user.name.toLowerCase().includes(term)) ||
                (user && user.email.toLowerCase().includes(term)) ||
                (request.description && request.description.toLowerCase().includes(term)) ||
                (request.type && request.type.toLowerCase().includes(term))
            );
        });
    }
    
    if (statusFilter) {
        filtered = filtered.filter(request => request.status === statusFilter);
    }
    
    const tableContainer = document.querySelector('.table-container');
    if (tableContainer) {
        tableContainer.innerHTML = renderRequestsTable(filtered);
        initRequestTableHandlers();
    }
}

function filterArticles(searchTerm) {
    if (!searchTerm) {
        const tableContainer = document.querySelector('.table-container');
        if (tableContainer) {
            tableContainer.innerHTML = renderArticlesTable();
            initArticleTableHandlers();
        }
        return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = adminData.articles.filter(article =>
        article.title.toLowerCase().includes(term) ||
        article.description.toLowerCase().includes(term) ||
        article.category.toLowerCase().includes(term)
    );
    
    const tableContainer = document.querySelector('.table-container');
    if (tableContainer) {
        tableContainer.innerHTML = renderArticlesTable(filtered);
        initArticleTableHandlers();
    }
}

function filterAnalysis(searchTerm) {
    // Реализация фильтрации анализов
    showNotification('Функция фильтрации анализов в разработке', 'info');
}

// ==================== ИНИЦИАЛИЗАЦИЯ ОБРАБОТЧИКОВ ТАБЛИЦ ====================

function initUserTableHandlers() {
    document.querySelectorAll('.view-user-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = parseInt(this.dataset.id);
            viewUserDetails(userId);
        });
    });
    
    document.querySelectorAll('.delete-user-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = parseInt(this.dataset.id);
            deleteUser(userId);
        });
    });
}

function initRequestTableHandlers() {
    document.querySelectorAll('.view-request-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const requestId = parseInt(this.dataset.id);
            viewRequestDetails(requestId);
        });
    });
    
    document.querySelectorAll('.edit-request-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const requestId = parseInt(this.dataset.id);
            editRequestStatus(requestId);
        });
    });
}

function initArticleTableHandlers() {
    document.querySelectorAll('.view-article-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const articleId = parseInt(this.dataset.id);
            viewArticleDetails(articleId);
        });
    });
    
    document.querySelectorAll('.edit-article-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const articleId = parseInt(this.dataset.id);
            editArticle(articleId);
        });
    });
    
    document.querySelectorAll('.delete-article-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const articleId = parseInt(this.dataset.id);
            deleteArticle(articleId);
        });
    });
}

function initAnalysisTableHandlers() {
    document.querySelectorAll('.view-analysis-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const analysisId = parseInt(this.dataset.id);
            viewAnalysisDetails(analysisId);
        });
    });
}

// ==================== ОСНОВНЫЕ ФУНКЦИИ АДМИНКИ ====================

// Здесь добавьте функции для работы с модальными окнами:
// viewUserDetails, deleteUser, showAddUserModal, 
// viewRequestDetails, editRequestStatus,
// viewArticleDetails, editArticle, deleteArticle, showAddArticleModal,
// viewAnalysisDetails, 
// saveSettings, createBackup, restoreFromBackup, clearCache

// Эти функции можно взять из вашего старого admin.js файла
// и адаптировать их для работы с новой структурой данных

// Пример функции для удаления пользователя
function deleteUser(userId) {
    const user = adminData.users.find(u => u.id === userId);
    if (!user) return;
    
    if (user.role === 'admin') {
        showNotification('Нельзя удалить администратора', 'error');
        return;
    }
    
    if (confirm(`Вы уверены, что хотите удалить пользователя ${user.name}?`)) {
        if (useAPI) {
            // Удалить через API
            // api.deleteUser(userId).then(...).catch(...)
            showNotification('Удаление через API в разработке', 'info');
        } else {
            // Удалить локально
            const userIndex = adminData.users.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                adminData.users.splice(userIndex, 1);
                localStorage.setItem('agrivision_db', JSON.stringify(adminData));
                showNotification('Пользователь удален');
                loadUsers(); // Обновить таблицу
            }
        }
    }
}

// Добавьте остальные функции по аналогии

// ==================== CSS СТИЛИ ====================

// Добавьте эти стили в ваш CSS файл или в head через JavaScript
const adminStyles = `
    .admin-header {
        background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        margin-bottom: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .admin-header h1 {
        margin: 0;
        font-size: 24px;
    }
    
    .admin-info {
        display: flex;
        gap: 15px;
        align-items: center;
    }
    
    .api-status {
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 12px;
        font-weight: 600;
    }
    
    .api-status.online {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .api-status.offline {
        background: rgba(255, 255, 255, 0.1);
    }
    
    .api-status i {
        font-size: 8px;
        margin-right: 5px;
    }
    
    .user-info {
        font-size: 14px;
        opacity: 0.9;
    }
    
    .admin-actions {
        display: flex;
        gap: 10px;
    }
    
    .admin-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s;
    }
    
    .btn-secondary {
        background: rgba(255, 255, 255, 0.2);
        color: white;
    }
    
    .btn-danger {
        background: #dc3545;
        color: white;
    }
    
    .admin-nav {
        display: flex;
        gap: 10px;
        margin-bottom: 30px;
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    
    .nav-btn {
        padding: 12px 20px;
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
    
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }
    
    .stat-card {
        background: white;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        display: flex;
        align-items: center;
        gap: 20px;
    }
    
    .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: white;
    }
    
    .stat-icon.users { background: #17a2b8; }
    .stat-icon.requests { background: #6f42c1; }
    .stat-icon.analysis { background: #fd7e14; }
    .stat-icon.articles { background: #28a745; }
    
    .stat-info h3 {
        margin: 0 0 5px 0;
        font-size: 14px;
        color: #666;
    }
    
    .stat-number {
        font-size: 28px;
        font-weight: bold;
        color: #333;
        margin: 0;
    }
    
    .stat-change {
        font-size: 12px;
        color: #28a745;
        margin: 5px 0 0 0;
    }
    
    .dashboard-sections {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 30px;
    }
    
    .dashboard-section {
        background: white;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    
    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .search-box {
        position: relative;
        margin-bottom: 20px;
    }
    
    .search-box input {
        width: 100%;
        padding: 12px 40px 12px 15px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 16px;
    }
    
    .search-box i {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
    }
    
    .filters {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
    }
    
    .table-container {
        overflow-x: auto;
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    
    .admin-table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .admin-table th {
        padding: 15px;
        text-align: left;
        font-weight: 600;
        color: #495057;
        border-bottom: 2px solid #e9ecef;
        background: #f8f9fa;
    }
    
    .admin-table td {
        padding: 12px 15px;
        border-bottom: 1px solid #e9ecef;
    }
    
    .admin-table tr:hover {
        background: #f8f9fa;
    }
    
    .action-buttons {
        display: flex;
        gap: 5px;
    }
    
    .btn {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
    }
    
    .btn-sm {
        padding: 4px 8px;
        font-size: 12px;
    }
    
    .btn-info { background: #17a2b8; color: white; }
    .btn-warning { background: #ffc107; color: black; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-primary { background: #2e7d32; color: white; }
    .btn-success { background: #28a745; color: white; }
    
    .badge {
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 11px;
        font-weight: 600;
    }
    
    .badge-danger { background: #dc3545; color: white; }
    
    .role-badge {
        padding: 4px 10px;
        border-radius: 15px;
        font-size: 12px;
        font-weight: 600;
    }
    
    .role-badge.admin { background: #dc3545; color: white; }
    .role-badge.user { background: #6c757d; color: white; }
    
    .status-badge {
        padding: 4px 10px;
        border-radius: 15px;
        font-size: 12px;
        font-weight: 600;
    }
    
    .status-badge.new { background: #fff3cd; color: #856404; }
    .status-badge.pending { background: #d1ecf1; color: #0c5460; }
    .status-badge.processing { background: #cce5ff; color: #004085; }
    .status-badge.completed { background: #d4edda; color: #155724; }
    .status-badge.published { background: #d4edda; color: #155724; }
    .status-badge.draft { background: #fff3cd; color: #856404; }
    
    .category-badge {
        padding: 4px 10px;
        border-radius: 15px;
        font-size: 12px;
        font-weight: 600;
        color: white;
    }
    
    .diagnosis-badge {
        padding: 4px 10px;
        border-radius: 15px;
        font-size: 12px;
        font-weight: 600;
    }
    
    .diagnosis-badge.healthy { background: #d4edda; color: #155724; }
    .diagnosis-badge.diseased { background: #f8d7da; color: #721c24; }
    
    .confidence-bar {
        width: 60px;
        height: 20px;
        background: #e9ecef;
        border-radius: 10px;
        position: relative;
        overflow: hidden;
    }
    
    .confidence-fill {
        height: 100%;
        background: linear-gradient(90deg, #4CAF50, #8BC34A);
        border-radius: 10px;
        transition: width 0.3s;
    }
    
    .confidence-bar span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 10px;
        font-weight: bold;
        color: #333;
    }
    
    .truncate-text {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    .empty-state {
        text-align: center;
        padding: 40px;
        color: #666;
    }
    
    .settings-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
    }
    
    .setting-card {
        background: white;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    
    .form-group {
        margin-bottom: 20px;
    }
    
    .form-control {
        width: 100%;
        padding: 10px 15px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 16px;
        box-sizing: border-box;
    }
    
    .quick-actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .action-btn {
        padding: 12px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        text-align: left;
    }
    
    .system-stats p {
        margin: 10px 0;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
    }
    
    .admin-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        background: white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    }
    
    .admin-notification.success {
        border-left: 4px solid #28a745;
    }
    
    .admin-notification.error {
        border-left: 4px solid #dc3545;
    }
    
    .admin-notification.info {
        border-left: 4px solid #17a2b8;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .fade-out {
        animation: fadeOut 0.3s ease forwards;
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .recent-activity {
        max-height: 300px;
        overflow-y: auto;
    }
    
    .activity-item {
        padding: 15px;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .activity-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8f9fa;
        color: #2e7d32;
    }
    
    .activity-content {
        flex: 1;
    }
    
    .activity-content strong {
        display: block;
        margin-bottom: 5px;
    }
    
    .activity-time {
        font-size: 12px;
        color: #666;
    }
`;

// Добавляем стили в документ
const styleElement = document.createElement('style');
styleElement.textContent = adminStyles;
document.head.appendChild(styleElement);

// ==================== ЗАПУСК АДМИНКИ ====================

// Инициализация уже вызвана в DOMContentLoaded
console.log('Админ-панель готова к работе!');