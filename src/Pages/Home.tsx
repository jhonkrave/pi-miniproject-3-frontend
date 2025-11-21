// Pages/Home.tsx - Sin iconos sociales
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.scss';

const Home: React.FC = () => {
  const [meetingId, setMeetingId] = useState('');
  const navigate = useNavigate();

  const handleCreateMeeting = () => {
    console.log('Creando nueva reunión...');
    // Lógica para crear reunión
  };

  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingId.trim()) {
      console.log('Uniéndose a reunión:', meetingId);
      // Lógica para unirse a reunión
    }
  };

  const handleLogout = () => {
    console.log('Cerrando sesión...');
    // Lógica de logout
    navigate('/login');
  };

  return (
    <div className="home-wrapper">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">TeamLink</h1>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li className="nav-item active">
              <span className="nav-icon">🏠</span>
              <span className="nav-text">Home</span>
            </li>
            <li className="nav-item">
              <span className="nav-icon">👤</span>
              <span className="nav-text">Mi Perfil</span>
            </li>
            <li className="nav-item">
              <span className="nav-icon">ℹ️</span>
              <span className="nav-text">Sobre Nosotros</span>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-text">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <div className="big-icon">🎥</div>
        </div>

        <div className="actions-grid">
          {/* Crear Reunión Card */}
          <div className="action-card create-meeting-card">
            <button className="card-btn primary-btn" onClick={handleCreateMeeting}>
              Crear Reunión
            </button>
          </div>

          {/* Unirse a Reunión Card */}
          <div className="action-card join-meeting-card">
            <form onSubmit={handleJoinMeeting} className="join-form">
              <div className="input-group">
                <input
                  type="text"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                  placeholder="Ingresar ID de reunión"
                  className="meeting-input"
                  required
                />
              </div>
              <button type="submit" className="card-btn secondary-btn">
                Ingresar
              </button>
            </form>
          </div>
        </div>

        {/* Footer con iconos sociales ELIMINADO */}
      </div>
    </div>
  );
};

export default Home;