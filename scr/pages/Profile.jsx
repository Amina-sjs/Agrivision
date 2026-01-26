import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import api from '../api/axios';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await api.get('/auth/profile');
                setUser(res.data);
            } catch (err) {
                console.error("Не удалось загрузить профиль");
            }
        };
        fetchUserData();
    }, []);

    if (!user) return <div className="container">Загрузка...</div>;

    return (
        <>
            <Header />
            <div className="container" style={{paddingTop: '120px'}}>
                <div className="profile-card">
                    <h2>Личный кабинет</h2>
                    <div className="user-info">
                        <p><strong>Имя:</strong> {user.full_name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Роль:</strong> {user.role}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;