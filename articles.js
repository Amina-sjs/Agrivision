// articles.js - управление отображением статей на главной странице

document.addEventListener('DOMContentLoaded', function() {
    // Ждем 500мс для полной загрузки страницы
    setTimeout(() => {
        loadArticlesOnHomePage();
    }, 500);
});

// Функция для загрузки статей на главной странице
function loadArticlesOnHomePage() {
    console.log('Загружаем статьи на главную страницу...');
    
    // Получаем данные из localStorage
    const data = JSON.parse(localStorage.getItem('agrivision_db'));
    
    // Если нет данных или нет статей
    if (!data || !data.articles || data.articles.length === 0) {
        console.log('Статей нет в базе данных');
        showNoArticlesMessage();
        return;
    }
    
    // Фильтруем только опубликованные статьи
    const publishedArticles = data.articles.filter(article => {
        return article.isPublished !== false; // Показываем все, где isPublished не равен false
    });
    
    if (publishedArticles.length === 0) {
        console.log('Нет опубликованных статей');
        showNoArticlesMessage();
        return;
    }
    
    console.log(`Найдено ${publishedArticles.length} статей`);
    
    // Сортируем по дате (новые сначала) и берем первые 6
    const sortedArticles = [...publishedArticles]
        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
        .slice(0, 6);
    
    // Генерируем HTML для статей
    const articlesHTML = sortedArticles.map(article => createArticleCard(article)).join('');
    
    // Вставляем статьи в контейнер
    const container = document.getElementById('articlesContainer');
    if (container) {
        container.innerHTML = articlesHTML;
        
        // Добавляем обработчики для кнопок "Читать"
        document.querySelectorAll('.read-article-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const articleId = parseInt(this.dataset.articleId);
                openArticleModal(articleId);
            });
        });
        
        // Показываем кнопку "Все статьи", если статей больше 3
        if (publishedArticles.length > 3) {
            const viewAllBtn = document.getElementById('viewAllArticlesBtn');
            if (viewAllBtn) {
                viewAllBtn.style.display = 'inline-block';
                viewAllBtn.addEventListener('click', function() {
                    // Здесь можно добавить переход на страницу со всеми статьями
                    alert('В будущем здесь будет страница со всеми статьями!');
                });
            }
        }
    }
    
    // Скрываем сообщение "нет статей"
    const noArticlesMsg = document.getElementById('noArticlesMessage');
    if (noArticlesMsg) {
        noArticlesMsg.style.display = 'none';
    }
}

// Функция создания карточки статьи
function createArticleCard(article) {
    // Определяем цвет категории
    const categoryColor = getArticleCategoryColor(article.category);
    const categoryName = getArticleCategoryName(article.category);
    
    return `
    <div class="article-card">
        <div class="article-image-container">
            <img src="${article.image || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80'}" 
                 alt="${article.title}" 
                 class="article-image"
                 onerror="this.src='https://images.unsplash.com/photo-1501004318641-b39e6451bec6?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80'">
        </div>
        <div class="article-content">
            <span class="article-category" style="background: ${categoryColor}">
                ${categoryName}
            </span>
            <h3 class="article-title">${article.title}</h3>
            <p class="article-description">
                ${article.description || article.title.substring(0, 100) + '...'}
            </p>
            <div class="article-meta">
                <span><i class="far fa-calendar"></i> ${article.date || new Date(article.createdAt).toLocaleDateString('ru-RU')}</span>
                <span><i class="far fa-eye"></i> ${article.views || 0}</span>
            </div>
            <button class="read-more-btn read-article-btn" data-article-id="${article.id}">
                Читать статью <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    </div>
    `;
}

// Функция открытия модального окна с полной статьей
function openArticleModal(articleId) {
    console.log('Открываем статью с ID:', articleId);
    
    const data = JSON.parse(localStorage.getItem('agrivision_db'));
    if (!data || !data.articles) return;
    
    const article = data.articles.find(a => a.id === articleId);
    if (!article) {
        alert('Статья не найдена');
        return;
    }
    
    // Увеличиваем счетчик просмотров
    article.views = (article.views || 0) + 1;
    localStorage.setItem('agrivision_db', JSON.stringify(data));
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'article-modal active';
    
    const categoryColor = getArticleCategoryColor(article.category);
    const categoryName = getArticleCategoryName(article.category);
    
    modal.innerHTML = `
        <div class="article-modal-content">
            <button class="close-article-btn" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
            
            <img src="${article.image || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80'}" 
                 alt="${article.title}" 
                 class="article-full-image"
                 onerror="this.src='https://images.unsplash.com/photo-1501004318641-b39e6451bec6?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80'">
            
            <div class="article-full-content">
                <span class="article-category" style="background: ${categoryColor}; margin-bottom: 15px; display: inline-block;">
                    ${categoryName}
                </span>
                
                <h1>${article.title}</h1>
                
                <div class="article-full-meta">
                    <span><i class="far fa-calendar"></i> ${article.date || new Date(article.createdAt).toLocaleDateString('ru-RU')}</span>
                    <span><i class="fas fa-user"></i> ${article.author || 'Администратор'}</span>
                    <span><i class="far fa-eye"></i> ${article.views} просмотров</span>
                </div>
                
                <div class="article-full-text">
                    ${article.content.replace(/\n/g, '<br>')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Закрытие по клику на затемненную область
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
    
    // Обновляем счетчик просмотров на главной странице
    setTimeout(() => {
        loadArticlesOnHomePage();
    }, 100);
}

// Вспомогательные функции
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
        'diseases': 'Болезни растений',
        'agriculture': 'Сельское хозяйство',
        'tips': 'Советы',
        'news': 'Новости',
        'default': 'Статья'
    };
    return names[category] || names.default;
}

function showNoArticlesMessage() {
    const container = document.getElementById('articlesContainer');
    const message = document.getElementById('noArticlesMessage');
    
    if (container && message) {
        container.innerHTML = '';
        message.style.display = 'block';
    }
}

// Функция для принудительного обновления статей (может пригодиться)
window.refreshArticles = function() {
    loadArticlesOnHomePage();
};

// Автоматическое обновление статей при изменении localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'agrivision_db') {
        console.log('Данные обновились, обновляем статьи...');
        setTimeout(loadArticlesOnHomePage, 100);
    }
});