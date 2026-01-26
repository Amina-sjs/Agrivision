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
    <div className="container" style={{ paddingTop: '100px' }}>
      <div className="profile-header">
        <div className="profile-avatar">👤</div>
        <h1>{userData.full_name || userData.name}</h1>
        <p>{userData.email}</p>
      </div>
      
      <div className="profile-stats">
        <div className="stat-card">
          <h3>Анализов проведено</h3>
          <p>0</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;