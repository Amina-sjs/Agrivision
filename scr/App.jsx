import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header'; // Твой хедер
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import './style.css';

function App() {
  return (
    <Router>
      {/* Хедер должен быть ТУТ, чтобы он отображался на всех страницах */}
      <Header /> 
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analysis" element={<Analyses />} />
          {/* Если страницы /analysis еще нет, создадим её следующей */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;