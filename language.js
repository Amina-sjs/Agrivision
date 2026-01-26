// Скрипт для мультиязычности

const translations = {
ru: {
    // Навигация
    'nav-home': 'Главная',
    'nav-analysis': 'Анализ',
    'nav-library': 'Библиотека',
    'nav-request': 'Заявка',
    'nav-about': 'О нас',

    // Авторизация
    'login': 'Войти',
    'register': 'Регистрация',
    'logout': 'Выйти',
    'login-title': 'Вход в аккаунт',
    'register-title': 'Регистрация',
    'name': 'Имя',
    'name-placeholder': 'Введите ваше имя',
    'email': 'Email',
    'email-placeholder': 'Введите ваш email',
    'phone': 'Телефон',
    'phone-placeholder': '+7 (999) 123-45-67',
    'password': 'Пароль',
    'password-placeholder': 'Введите пароль',
    'login-btn': 'Войти',
    'register-btn': 'Зарегистрироваться',
    'login-link': 'Уже есть аккаунт',
    'register-link': 'Зарегистрироваться',

    // Профиль
    'my-profile': 'Мой профиль',
    'profile-title': 'Мой профиль',
    'profile-subtitle': 'Управление личными данными, уведомлениями и историей анализов',
    'personal-data': 'Личные данные',
    'edit': 'Редактировать',
    'bio': 'О себе',
    'bio-placeholder': 'Расскажите о себе',
    'security': 'Безопасность',
    'change-password': 'Сменить пароль',
    'change-password-btn': 'Сменить пароль',
    'current-password': 'Текущий пароль',
    'current-password-placeholder': 'Введите текущий пароль',
    'new-password': 'Новый пароль',
    'new-password-placeholder': 'Введите новый пароль',
    'confirm-password': 'Подтвердите новый пароль',
    'confirm-password-placeholder': 'Подтвердите новый пароль',
    'notifications': 'Уведомления',
    'mark-all-read': 'Отметить все как прочитанные',
    'clear-all': 'Очистить все',
    'no-notifications': 'Нет уведомлений',
    'no-notifications-text': 'Здесь будут появляться уведомления о статусе ваших заявок и другие важные события',
    'scan-history': 'История анализов',
    'total-scans': 'анализов',
    'no-scans': 'История анализов пуста',
    'no-scans-text': 'Выполните свой первый анализ растений, чтобы увидеть историю здесь',
    'statistics': 'Статистика',
    'total-analyses': 'Всего анализов',
    'completed-requests': 'Завершенных заявок',
    'active-notifications': 'Активных уведомлений',
    'activity': 'Активность',
    'user-since': 'Пользователь с',
    'last-activity': 'Последняя активность',
    'save': 'Сохранить',
    'save-changes': 'Сохранить изменения',
    'cancel': 'Отмена',
    'email-cannot-change': 'Email нельзя изменить',
    'role': 'Роль',
    'view-details': 'Просмотреть детали',
    'download-report': 'Скачать отчет',

    // Герой секция
    'hero-title': 'AgriVision — умное сельское хозяйство',
    'hero-subtitle': 'Дроны и искусственный интеллект для мониторинга полей, выявления болезней и роста урожайности',
    'send-request': 'Отправить заявку',

    // Будущее сельского хозяйства
    'future-title': 'Мы создаем будущее сельского хозяйства',
    'future-text': 'AgriVision помогает аграриям использовать современные технологии для повышения эффективности. Оптимизация ресурсов и защиты урожая.',
    'start-analysis': 'Начать анализ',
    'for-farmers': 'Работаем для фермеров сегодня',

    // Наши возможности
    'features-title': 'НАШИ ВОЗМОЖНОСТИ',
    'features-text': 'Наши технологии помогают экономить ресурсы, беречь природу и увеличивать урожай без лишних трат.',
    'feature1-title': 'Анализ состояния растений с воздуха',
    'feature1-text': 'Мониторинг полей с помощью дронов для раннего выявления проблем с растениями и почвой.',
    'feature2-title': 'Прогноз урожайности',
    'feature2-text': 'Точное прогнозирование урожая на основе анализа данных и метеорологических условий.',
    'feature3-title': 'Все данные в одном месте',
    'feature3-text': 'Централизованная платформа для управления всеми сельскохозяйственными процессами.',
    'feature4-title': 'Снижение использования химикатов',
    'feature4-text': 'Точечное применение средств защиты растений, минимизирующее воздействие на окружающую среду.',

    // Как работает
    'how-title': 'Как работает AgriVision',
    'how-text': 'AgriVision использует дроны и искусственный интеллект для анализа полей, выявляет проблемы и помогает фермерам принимать решения.',
    'how-feature1': 'Точный мониторинг полей',
    'how-feature2': 'Анализ данных в реальном времени',
    'learn-how': 'Попробовать анализ',
    'step1-title': 'Сбор данных',
    'step1-text': 'Дроны собирают информацию о состояние полей',
    'step2-title': 'Анализ ИИ',
    'step2-text': 'Искусственный интеллект обрабатывает данные',
    'step3-title': 'Рекомендации',
    'step3-text': 'Фермер получает точные рекомендации',
    'step4-title': 'Результат',
    'step4-text': 'Увеличение урожайности и снижение затрат',

    // Умные решения
    'solutions-title': 'AgriVision — умные решения для фермеров',
    'solutions-text': 'Мы объединяем дроны, аналитику и ИИ, чтобы вы получали точные данные о своих полях и принимали решения вовремя.',
    'growth-text': 'рост урожайности',
    'solution1-title': 'Аналитика в реальном времени',
    'solution1-text': 'Мгновенный доступ к данным о состоянии ваших полей',
    'solution2-title': 'Рекомендации для вас',
    'solution2-text': 'Индивидуальные советы для каждого участка поля',

    // Технологии
    'tech-title': 'Технологии, которые работают на ваш урожай',

    // Почему выбирают
    'why-title': 'Почему выбирают AgriVision',
    'why-text': 'Мы создаём технологии, которые помогают фермерам работать эффективнее, снижать потери и повышать урожайность.',
    'details': 'Подробнее',
    'reason1-title': 'Инновационные технологии',
    'reason1-text': 'Используем последние достижения в области дронов и ИИ',
    'reason2-title': 'Простота использования',
    'reason2-text': 'Интуитивный интерфейс, не требующий специальных знаний',
    'reason3-title': 'Поддержка 24/7',
    'reason3-text': 'Наша команда всегда готова помочь с любыми вопросами',
    'reason4-title': 'Доказанная эффективность',
    'reason4-text': 'Результаты наших клиентов подтверждают эффективность',

    // Отзывы
    'testimonials-title': 'Отзывы',
    'testimonials-subtitle': 'Наши клиенты делятся своими успехами и впечатлениями от работы с AgriVision.',

    // Футер
    'footer-title': 'AgriVision — умное сельское хозяйство для каждого фермера',
    'footer-pages': 'Страницы',
    'footer-about': 'О нас',
    'copyright': '© 2024 AgriVision. Все права защищены.',

    // Анализ
    'analysis-btn': 'Проанализировать растения',
    'try-analysis': 'Попробовать анализ',
    'analysis-title': 'Анализируйте растения с помощью AI',
    'analysis-subtitle': 'Загрузите фото или видео, и получите точный отчёт о состоянии ваших культур.',
    'upload-text': 'Перетащите файл сюда',
    'or': 'или',
    'select-file': 'Выбрать файл',
    'file-info': 'Поддерживаемые форматы: JPG, PNG, GIF, MP4, AVI. Максимальный размер: 10MB',
    'processing-title': 'Идет анализ...',
    'processing-text': 'Искусственный интеллект анализирует ваше изображение. Это может занять несколько секунд.',
    'result-title': 'Результаты анализа',
    'new-analysis': 'Новый анализ',
    'uploaded-image': 'Загруженное изображение',
    'diagnosis': 'Диагноз',
    'cause': 'Причина',
    'recommendations': 'Рекомендации',
    'confidence': 'Уверенность анализа:',
    'save-report': 'Сохранить отчет',
    'share': 'Поделиться',
    'additional-info': 'Дополнительная информация',
    'analysis-date': 'Дата анализа',
    'processing-time': 'Время обработки',
    'plant-type': 'Тип растения',
    'analysis-id': 'ID анализа',
    'history-title': 'История анализов',
    'how-works-title': 'Как работает AI-анализ',
    'step1-title': 'Загрузка',
    'step1-text': 'Загрузите фото или видео растения',
    'step2-title': 'Анализ ИИ',
    'step2-text': 'Нейросеть анализирует изображение',
    'step3-title': 'Обработка',
    'step3-text': 'Сравнение с базой данных болезней',
    'step4-title': 'Отчет',
    'step4-text': 'Полный отчет с рекомендациями',

    // Заявка на дрон
    'request-title': 'Заявка на выезд дрона',
    'area': 'Площадь участка',
    'area-placeholder': 'Введите площадь участка (в гектарах)',
    'address': 'Адрес',
    'address-placeholder': 'Введите адрес участка',
    'culture': 'Культура',
    'culture-placeholder': 'Введите культуру (пшеница, кукуруза, виноград и т.д.)',
    'preferred-date': 'Предпочтительная дата',
    'message': 'Сообщение',
    'message-placeholder': 'Введите дополнительную информацию',
    'request-subtitle': 'Оставьте данные, и наш дрон выполнит анализ сада',
    'send-request-btn': 'Отправить заявку',

    // Админ-панель
    'admin-login-title': 'Вход в админ-панель',
    'admin-email': 'Email администратора',
    'admin-email-placeholder': 'admin@agrivision.ru',
    'admin-password': 'Пароль',
    'admin-password-placeholder': 'Введите пароль',
    'admin-login-btn': 'Войти в админ-панель',
    'demo-access': 'Демо доступ:',
    'admin-login-error': 'Неверные данные администратора',
    'admin-login-success': 'Вход выполнен! Перенаправление...',
    'admin-login-waiting': 'Проверка данных...',
    'admin-loading': 'Загрузка админ-панели...',
'access-denied': 'Доступ запрещен! Требуются права администратора.',
'admin-test-login': 'Тест: Войти как админ',
'admin-test-success': 'Тестовый администратор авторизован! Обновите страницу.',
'admin-panel-title': 'Панель администратора | AgriVision',
'admin-error-loading': 'Ошибка загрузки!',
'admin-error-details': 'Файл admin.js не загружен или содержит ошибки.',
'admin-error-check-console': 'Проверьте консоль браузера (F12 → Console)',
'admin-name': 'Администратор',
'test-user-name': 'Тестовый пользователь',
'article1-title': 'Как определить болезнь растений по листьям',
'article1-content': 'Полное содержание статьи о болезнях растений...',
'article1-description': 'Узнайте, как по внешним признакам определить заболевания сельскохозяйственных культур',
'article2-title': 'Современные технологии в сельском хозяйстве',
'article2-content': 'Содержание статьи о технологиях...',
'article2-description': 'Обзор новейших технологий для повышения урожайности',
    // Разработка
    'development-title': 'Раздел в разработке',
    'development-message': 'Раздел находится в разработке. Скоро здесь появится новая функциональность!',

    // Библиотека
    'library-title': 'Библиотека',
    'library-message': 'Библиотека растений находится в разработке. Скоро здесь появится полезная информация для фермеров!',

    // Админ панель (дополнительные переводы)
    'dashboard': 'Дашборд',
    'requests': 'Заявки',
    'users': 'Пользователи',
    'settings': 'Настройки',
    'export': 'Экспорт',
    'refresh': 'Обновить',
    'search': 'Поиск',
    'filter': 'Фильтр',
    'status': 'Статус',
    'actions': 'Действия',
    'view': 'Просмотр',
    'delete': 'Удалить',
    'save': 'Сохранить',
    'backup': 'Резервное копирование',
    'restore': 'Восстановление',
    'clear-data': 'Очистка данных',

    // Сообщения и уведомления
    'request-sent': 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
    'login-success': 'Вход выполнен успешно!',
    'login-error': 'Неверный email или пароль',
    'register-success': 'Регистрация прошла успешно!',
    'register-error': 'Пользователь с таким email уже существует',
    'fill-all-fields': 'Пожалуйста, заполните все поля',
    'fill-required-fields': 'Пожалуйста, заполните обязательные поля',
    'logout-success': 'Вы успешно вышли из системы',
    'profile-updated': 'Профиль успешно обновлен!',
    'password-changed': 'Пароль успешно изменен!',
    'passwords-not-match': 'Новые пароли не совпадают',
    'password-too-short': 'Пароль должен содержать не менее 6 символов',
    'incorrect-current-password': 'Текущий пароль неверен',
    'notification-marked-read': 'Уведомление отмечено как прочитанное',
    'all-notifications-read': 'Все уведомления отмечены как прочитанные',
    'all-notifications-deleted': 'Все уведомления удалены',
    'report-downloaded': 'Отчет успешно скачан',

    // Разное
    'admin': 'Администратор',
    'user': 'Пользователь',
    'completed': 'Завершен',
    'processing': 'В процессе',
    'new': 'Новый',
    'read': 'Прочитано',
    'unread': 'Непрочитано',
    'mark-as-read': 'Отметить как прочитанное',
    'analysis': 'Анализ',
    'analyses': 'Анализов',
    'request': 'Заявка',
    'requests': 'Заявки',
    'notification': 'Уведомление',
    'notifications': 'Уведомления',
    'history': 'История',
    'back': 'Назад',
    'close': 'Закрыть',
    'yes': 'Да',
    'no': 'Нет',
    'confirm': 'Подтвердить',
    'loading': 'Загрузка...',
    'error': 'Ошибка',
    'success': 'Успешно',
    'warning': 'Внимание',
    'info': 'Информация',

    'manage-users': 'Управление пользователями',
    'manage-requests': 'Управление заявками',
    'manage-articles': 'Управление статьями',
    'system-settings': 'Настройки системы',
    'data-management': 'Управление данными',
    'system-statistics': 'Статистика системы',
    'site-name': 'Название сайта',
    'contact-email': 'Email для связи',
    'support-phone': 'Телефон поддержки',
    'save-settings': 'Сохранить настройки',
    'create-backup': 'Создать резервную копию',
    'export-data': 'Экспорт данных',
    'restore-from-backup': 'Восстановить из backup',
    'restore': 'Восстановить',
    'clear-cache': 'Очистить кэш',
    'clear': 'Очистить',
    'working-mode': 'Режим работы',
    'local': 'Локальный',
    'total-users': 'Всего пользователей',
    'total-requests': 'Всего заявок',
    'total-articles': 'Всего статей',

    'info': 'Информация',

    // Админка (дополнительные переводы)
    'manage-users': 'Управление пользователями',
    'manage-requests': 'Управление заявками',
    'manage-articles': 'Управление статьями',
    'system-settings': 'Настройки системы',
    'data-management': 'Управление данными',
    'system-statistics': 'Статистика системы',
    'site-name': 'Название сайта',
    'contact-email': 'Email для связи',
    'support-phone': 'Телефон поддержки',
    'save-settings': 'Сохранить настройки',
    'create-backup': 'Создать резервную копию',
    'export-data': 'Экспорт данных',
    'restore-from-backup': 'Восстановить из backup',
    'restore': 'Восстановить',
    'clear-cache': 'Очистить кэш',
    'clear': 'Очистить',
    'working-mode': 'Режим работы',
    'local': 'Локальный',
    'total-users': 'Всего пользователей',
    'total-requests': 'Всего заявок',
    'total-articles': 'Всего статей',
    'admin-api-online': 'API онлайн',
    'admin-api-offline': 'Локальный режим',
    'recent-activity': 'Последние действия',
    'quick-actions': 'Быстрые действия',
    'add-user': 'Добавить пользователя',
    'add-article': 'Добавить статью',
    'check-requests': 'Проверить заявки',
    'pending': 'ожидают',
    'today': 'сегодня',
    'views': 'просмотров',
    'search-users': 'Поиск пользователей...',
    'search-requests': 'Поиск заявок...',
    'search-articles': 'Поиск статей...',
    'search-analysis': 'Поиск анализов...',
    'all-statuses': 'Все статусы',
    'waiting': 'Ожидают',
    'in-process': 'В обработке',
    'completed': 'Завершены',

},

en: {

        'manage-users': 'User Management',
    'manage-requests': 'Request Management',
    'manage-articles': 'Article Management',
    'system-settings': 'System Settings',
    'data-management': 'Data Management',
    'system-statistics': 'System Statistics',
    'site-name': 'Site name',
    'contact-email': 'Contact email',
    'support-phone': 'Support phone',
    'save-settings': 'Save Settings',
    'create-backup': 'Create Backup',
    'export-data': 'Export Data',
    'restore-from-backup': 'Restore from Backup',
    'restore': 'Restore',
    'clear-cache': 'Clear Cache',
    'clear': 'Clear',
    'working-mode': 'Working mode',
    'local': 'Local',
    'total-users': 'Total Users',
    'total-requests': 'Total Requests',
    'total-articles': 'Total Articles',
    // Navigation
    'nav-home': 'Home',
    'nav-analysis': 'Analysis',
    'nav-library': 'Library',
    'nav-request': 'Request',
    'nav-about': 'About',

    // Authentication
    'login': 'Log In',
    'register': 'Register',
    'logout': 'Log Out',
    'login-title': 'Log In to Account',
    'register-title': 'Registration',
    'name': 'Name',
    'name-placeholder': 'Enter your name',
    'email': 'Email',
    'email-placeholder': 'Enter your email',
    'phone': 'Phone',
    'phone-placeholder': '+7 (999) 123-45-67',
    'password': 'Password',
    'password-placeholder': 'Enter password',
    'login-btn': 'Log In',
    'register-btn': 'Register',
    'login-link': 'Already have an account',
    'register-link': 'Register',

    // Profile
    'my-profile': 'My Profile',
    'profile-title': 'My Profile',
    'profile-subtitle': 'Manage personal data, notifications and analysis history',
    'personal-data': 'Personal Data',
    'edit': 'Edit',
    'bio': 'About me',
    'bio-placeholder': 'Tell about yourself',
    'security': 'Security',
    'change-password': 'Change Password',
    'change-password-btn': 'Change Password',
    'current-password': 'Current Password',
    'current-password-placeholder': 'Enter current password',
    'new-password': 'New Password',
    'new-password-placeholder': 'Enter new password',
    'confirm-password': 'Confirm New Password',
    'confirm-password-placeholder': 'Confirm new password',
    'notifications': 'Notifications',
    'mark-all-read': 'Mark all as read',
    'clear-all': 'Clear all',
    'no-notifications': 'No notifications',
    'no-notifications-text': 'Notifications about your requests and other important events will appear here',
    'scan-history': 'Analysis History',
    'total-scans': 'analyses',
    'no-scans': 'Analysis history is empty',
    'no-scans-text': 'Perform your first plant analysis to see history here',
    'statistics': 'Statistics',
    'total-analyses': 'Total Analyses',
    'completed-requests': 'Completed Requests',
    'active-notifications': 'Active Notifications',
    'activity': 'Activity',
    'user-since': 'User since',
    'last-activity': 'Last activity',
    'save': 'Save',
    'save-changes': 'Save Changes',
    'cancel': 'Cancel',
    'email-cannot-change': 'Email cannot be changed',
    'role': 'Role',
    'view-details': 'View details',
    'download-report': 'Download report',

    // Hero section
    'hero-title': 'AgriVision — Smart Agriculture',
    'hero-subtitle': 'Drones and artificial intelligence for field monitoring, disease detection and yield growth',
    'send-request': 'Send Request',

    // Future agriculture
    'future-title': 'We create the future of agriculture',
    'future-text': 'AgriVision helps farmers use modern technologies to improve efficiency. Resource optimization and crop protection.',
    'start-analysis': 'Start Analysis',
    'for-farmers': 'Working for farmers today',

    // Features
    'features-title': 'OUR CAPABILITIES',
    'features-text': 'Our technologies help save resources, protect nature and increase yields without unnecessary costs.',
    'feature1-title': 'Aerial plant condition analysis',
    'feature1-text': 'Field monitoring using drones for early detection of plant and soil problems.',
    'feature2-title': 'Yield forecast',
    'feature2-text': 'Accurate yield forecasting based on data analysis and meteorological conditions.',
    'feature3-title': 'All data in one place',
    'feature3-text': 'Centralized platform for managing all agricultural processes.',
    'feature4-title': 'Reducing chemical use',
    'feature4-text': 'Precise application of plant protection products, minimizing environmental impact.',

    // How it works
    'how-title': 'How AgriVision works',
    'how-text': 'AgriVision uses drones and artificial intelligence to analyze fields, identify problems and help farmers make decisions.',
    'how-feature1': 'Accurate field monitoring',
    'how-feature2': 'Real-time data analysis',
    'learn-how': 'Try Analysis',
    'step1-title': 'Data collection',
    'step1-text': 'Drones collect information about field conditions',
    'step2-title': 'AI analysis',
    'step2-text': 'Artificial intelligence processes data',
    'step3-title': 'Recommendations',
    'step3-text': 'Farmer receives precise recommendations',
    'step4-title': 'Result',
    'step4-text': 'Increased yield and reduced costs',

    // Smart solutions
    'solutions-title': 'AgriVision — smart solutions for farmers',
    'solutions-text': 'We combine drones, analytics and AI so you get accurate data about your fields and make decisions on time.',
    'growth-text': 'yield growth',
    'solution1-title': 'Real-time analytics',
    'solution1-text': 'Instant access to data about the condition of your fields',
    'solution2-title': 'Recommendations for you',
    'solution2-text': 'Individual advice for each field section',

    // Technologies
    'tech-title': 'Technologies that work for your harvest',

    // Why choose
    'why-title': 'Why choose AgriVision',
    'why-text': 'We create technologies that help farmers work more efficiently, reduce losses and increase yields.',
    'details': 'Details',
    'reason1-title': 'Innovative technologies',
    'reason1-text': 'We use the latest achievements in drones and AI',
    'reason2-title': 'Ease of use',
    'reason2-text': 'Intuitive interface, no special knowledge required',
    'reason3-title': '24/7 support',
    'reason3-text': 'Our team is always ready to help with any questions',
    'reason4-title': 'Proven effectiveness',
    'reason4-text': 'Our clients\' results confirm the effectiveness',

    // Testimonials
    'testimonials-title': 'Testimonials',
    'testimonials-subtitle': 'Our clients share their successes and impressions of working with AgriVision.',

    // Footer
    'footer-title': 'AgriVision — smart agriculture for every farmer',
    'footer-pages': 'Pages',
    'footer-about': 'About',
    'copyright': '© 2024 AgriVision. All rights reserved.',

    // Analysis
    'analysis-btn': 'Analyze Plants',
    'try-analysis': 'Try Analysis',
    'analysis-title': 'Analyze plants with AI',
    'analysis-subtitle': 'Upload a photo or video and get an accurate report on the condition of your crops.',
    'upload-text': 'Drag and drop file here',
    'or': 'or',
    'select-file': 'Select File',
    'file-info': 'Supported formats: JPG, PNG, GIF, MP4, AVI. Maximum size: 10MB',
    'processing-title': 'Analysis in progress...',
    'processing-text': 'Artificial intelligence is analyzing your image. This may take a few seconds.',
    'result-title': 'Analysis Results',
    'new-analysis': 'New Analysis',
    'uploaded-image': 'Uploaded Image',
    'diagnosis': 'Diagnosis',
    'cause': 'Cause',
    'recommendations': 'Recommendations',
    'confidence': 'Confidence:',
    'save-report': 'Save Report',
    'share': 'Share',
    'additional-info': 'Additional Information',
    'analysis-date': 'Analysis Date',
    'processing-time': 'Processing Time',
    'plant-type': 'Plant Type',
    'analysis-id': 'Analysis ID',
    'history-title': 'Analysis History',
    'how-works-title': 'How AI analysis works',
    'step1-title': 'Upload',
    'step1-text': 'Upload a photo or video of the plant',
    'step2-title': 'AI Analysis',
    'step2-text': 'Neural network analyzes the image',
    'step3-title': 'Processing',
    'step3-text': 'Comparison with disease database',
    'step4-title': 'Report',
    'step4-text': 'Full report with recommendations',

    // Drone request
    'request-title': 'Drone Visit Request',
    'area': 'Plot Area',
    'area-placeholder': 'Enter plot area (in hectares)',
    'address': 'Address',
    'address-placeholder': 'Enter plot address',
    'culture': 'Crop',
    'culture-placeholder': 'Enter crop (wheat, corn, grapes, etc.)',
    'preferred-date': 'Preferred Date',
    'message': 'Message',
    'message-placeholder': 'Enter additional information',
    'request-subtitle': 'Leave details and our drone will analyze your garden',
    'send-request-btn': 'Send Request',

    // Admin panel
    'admin-login-title': 'Admin Panel Login',
    'admin-email': 'Admin Email',
    'admin-email-placeholder': 'admin@agrivision.ru',
    'admin-password': 'Password',
    'admin-password-placeholder': 'Enter password',
    'admin-login-btn': 'Login to Admin Panel',
    'demo-access': 'Demo access:',
    'admin-login-error': 'Invalid administrator data',
    'admin-login-success': 'Login successful! Redirecting...',
    'admin-login-waiting': 'Checking data...',
    // Admin panel (additional)
    'admin-loading': 'Loading admin panel...',
    'access-denied': 'Access denied! Administrator rights required.',
    'admin-test-login': 'Test: Login as admin',
    'admin-test-success': 'Test administrator authorized! Refresh the page.',
    'admin-panel-title': 'Admin Panel | AgriVision',
    'admin-error-loading': 'Loading error!',
    'admin-error-details': 'admin.js file not loaded or contains errors.',
    'admin-error-check-console': 'Check browser console (F12 → Console)',
    'admin-name': 'Administrator',
    'test-user-name': 'Test user',
    'article1-title': 'How to identify plant diseases by leaves',
    'article1-content': 'Full article content about plant diseases...',
    'article1-description': 'Learn how to identify agricultural crop diseases by external signs',
    'article2-title': 'Modern technologies in agriculture',
    'article2-content': 'Article content about technologies...',
    'article2-description': 'Overview of the latest technologies to increase yield',
        // Development
    'development-title': 'Section in Development',
    'development-message': 'This section is under development. New functionality will be available soon!',

    // Library
    'library-title': 'Library',
    'library-message': 'The plant library is under development. Useful information for farmers will be available soon!',

    // Admin panel (additional translations)
    'dashboard': 'Dashboard',
    'requests': 'Requests',
    'users': 'Users',
    'settings': 'Settings',
    'export': 'Export',
    'refresh': 'Refresh',
    'search': 'Search',
    'filter': 'Filter',
    'status': 'Status',
    'actions': 'Actions',
    'view': 'View',
    'delete': 'Delete',
    'save': 'Save',
    'backup': 'Backup',
    'restore': 'Restore',
    'clear-data': 'Clear Data',

    // Messages and notifications
    'request-sent': 'Request successfully sent! We will contact you shortly.',
    'login-success': 'Login successful!',
    'login-error': 'Invalid email or password',
    'register-success': 'Registration successful!',
    'register-error': 'User with this email already exists',
    'fill-all-fields': 'Please fill in all fields',
    'fill-required-fields': 'Please fill in required fields',
    'logout-success': 'You have successfully logged out',
    'profile-updated': 'Profile successfully updated!',
    'password-changed': 'Password successfully changed!',
    'passwords-not-match': 'New passwords do not match',
    'password-too-short': 'Password must be at least 6 characters',
    'incorrect-current-password': 'Current password is incorrect',
    'notification-marked-read': 'Notification marked as read',
    'all-notifications-read': 'All notifications marked as read',
    'all-notifications-deleted': 'All notifications deleted',
    'report-downloaded': 'Report successfully downloaded',

    // Miscellaneous
    'admin': 'Administrator',
    'user': 'User',
    'completed': 'Completed',
    'processing': 'Processing',
    'new': 'New',
    'read': 'Read',
    'unread': 'Unread',
    'mark-as-read': 'Mark as read',
    'analysis': 'Analysis',
    'analyses': 'Analyses',
    'request': 'Request',
    'requests': 'Requests',
    'notification': 'Notification',
    'notifications': 'Notifications',
    'history': 'History',
    'back': 'Back',
    'close': 'Close',
    'yes': 'Yes',
    'no': 'No',
    'confirm': 'Confirm',
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    'warning': 'Warning',
    'info': 'Info',

    // Admin panel (additional translations)
    'admin-api-online': 'API online',
    'admin-api-offline': 'Local mode',
    'recent-activity': 'Recent Activity',
    'quick-actions': 'Quick Actions',
    'add-user': 'Add User',
    'add-article': 'Add Article',
    'check-requests': 'Check Requests',
    'pending': 'pending',
    'today': 'today',
    'views': 'views',
    'search-users': 'Search users...',
    'search-requests': 'Search requests...',
    'search-articles': 'Search articles...',
    'search-analysis': 'Search analysis...',
    'all-statuses': 'All statuses',
    'waiting': 'Waiting',
    'in-process': 'In process',
    'completed': 'Completed',
    'manage-users': 'User Management',
    'manage-requests': 'Request Management',
    'manage-articles': 'Article Management',
    'system-settings': 'System Settings',
    'data-management': 'Data Management',
    'system-statistics': 'System Statistics',
    'site-name': 'Site name',
    'contact-email': 'Contact email',
    'support-phone': 'Support phone',
    'save-settings': 'Save Settings',
    'create-backup': 'Create Backup',
    'export-data': 'Export Data',
    'restore-from-backup': 'Restore from Backup',
    'restore': 'Restore',
    'clear-cache': 'Clear Cache',
    'clear': 'Clear',
    'working-mode': 'Working mode',
    'local': 'Local',
    'total-users': 'Total Users',
    'total-requests': 'Total Requests',
    'total-articles': 'Total Articles',
}
};

// Устанавливаем язык по умолчанию
let currentLanguage = localStorage.getItem('language') || 'ru';

// Функция установки языка
function setLanguage(lang) {
currentLanguage = lang;
localStorage.setItem('language', lang);
updateTextContent();
updateActiveLanguageButton();
updateDynamicContent();
}

// Функция обновления текста на странице
function updateTextContent() {
    const elements = document.querySelectorAll('[data-key]');

    elements.forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                // Для полей ввода обновляем placeholder
                if (element.placeholder) {
                    element.placeholder = translations[currentLanguage][key];
                }
            } else if (element.tagName === 'SELECT') {
                // Для селектов ничего не делаем (опции обрабатываются отдельно)
                // Можно добавить обработку опций если нужно
            } else {
                // Для остальных элементов обновляем текст
                element.textContent = translations[currentLanguage][key];
            }
        }
    });

    const pageTitle = document.querySelector('title');
    if (pageTitle) {
        const currentPath = window.location.pathname;
        if (currentPath.includes('profile.html')) {
            pageTitle.textContent = translations[currentLanguage]['profile-title'] + ' - AgriVision';
        } else if (currentPath.includes('analysis.html')) {
            pageTitle.textContent = translations[currentLanguage]['analysis-title'] + ' - AgriVision';
        } else if (currentPath.includes('admin.html') || currentPath.includes('admin-panel.html')) {
            // ОБНОВЛЕННАЯ СТРОКА: используем перевод для админки
            pageTitle.textContent = translations[currentLanguage]['admin-panel-title'] || 'Admin Panel - AgriVision';
        } else {
            pageTitle.textContent = 'AgriVision — ' + translations[currentLanguage]['hero-title'];
        }
    }
}
function updateDynamicContent() {
    // Если на странице есть функции для обновления динамического контента, вызываем их
    if (typeof window.updateProfileContent === 'function') {
        window.updateProfileContent();
    }
    if (typeof window.updateAnalysisContent === 'function') {
        window.updateAnalysisContent();
    }
    if (typeof window.updateAdminContent === 'function') {
        window.updateAdminContent();
    }
}

// Функция обновления активной кнопки языка
function updateActiveLanguageButton() {
const langButtons = document.querySelectorAll('.lang-btn');
langButtons.forEach(button => {
    const lang = button.getAttribute('data-lang');
    if (lang === currentLanguage) {
        button.classList.add('active');
    } else {
        button.classList.remove('active');
    }
});
}

// Функция получения перевода по ключу (для использования в других скриптах)
function getTranslation(key) {
return translations[currentLanguage] && translations[currentLanguage][key] ? translations[currentLanguage][key] : key;
}

// Функция получения множественного числа
function getPluralForm(number, forms) {
if (currentLanguage === 'ru') {
    const n = Math.abs(number) % 100;
    const n1 = n % 10;

    if (n > 10 && n < 20) return forms[2];
    if (n1 > 1 && n1 < 5) return forms[1];
    if (n1 == 1) return forms[0];
    return forms[2];
} else {
    // Английская форма
    return number === 1 ? forms[0] : forms[1];
}
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
// Восстанавливаем сохраненный язык
const savedLanguage = localStorage.getItem('language');
if (savedLanguage) {
    setLanguage(savedLanguage);
} else {
    setLanguage('ru');
}

// Назначаем обработчики на кнопки переключения языка
const langButtons = document.querySelectorAll('.lang-btn');
langButtons.forEach(button => {
    button.addEventListener('click', function() {
        const lang = this.getAttribute('data-lang');
        setLanguage(lang);
    });
});
});

// Экспортируем функции для использования в других скриптах
window.setLanguage = setLanguage;
window.currentLanguage = currentLanguage;
window.getTranslation = getTranslation;
window.getPluralForm = getPluralForm;