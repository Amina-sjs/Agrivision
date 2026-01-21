// Админ-панель AgriVision

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
                }
            });
        });

        // Кнопка обновления
        document.getElementById('refreshBtn').addEventListener('click', function() {
            switch(currentView) {
                case 'dashboard': loadDashboard(); break;
                case 'requests': loadRequests(); break;
                case 'users': loadUsers(); break;
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