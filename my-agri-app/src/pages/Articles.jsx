import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import api from '../api/axios';

const Articles = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        api.get('/articles')
            .then(res => setArticles(res.data))
            .catch(err => console.error("Ошибка статей:", err));
    }, []);

    return (
        <>
            <Header />
            <section className="articles-section">
                <div className="container">
                    <h2 className="text-primary">Полезные статьи</h2>
                    <div className="articles-grid">
                        {articles.length > 0 ? articles.map(article => (
                            <div key={article.id} className="article-card">
                                <h3>{article.title}</h3>
                                <p>{article.content}</p>
                            </div>
                        )) : <p>Статей пока нет...</p>}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Articles;