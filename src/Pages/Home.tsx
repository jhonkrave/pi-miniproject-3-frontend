// Pages/Home.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.scss';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [meetingId, setMeetingId] = useState('');

  const handleLogout = () => {
    navigate('/login');
  };

  const handleCreateMeeting = () => {
    console.log('Creando reunión con ID:', meetingId);
  };

  return (
    <div className="home-wrapper">
      <div className="home-full-section">
        <div className="content-card">
          <div className="card-content">

            {/* HEADER (OCULTO POR SCSS) */}
            <header className="home-header">
              <div className="header-icon">
                <i className="fas fa-users"></i>
              </div>
            </header>

            <div className="layout-container">

              {/* ========================== */}
              {/*       MENÚ LATERAL         */}
              {/* ========================== */}
              <aside className="side-menu">

                {/* LOGO DEL MENÚ */}
                <div className="menu-header">
                  <img
                    src="/Imagenes/logo.png"
                    alt="TeamLink Logo"
                    className="menu-logo"
                  />
                </div>

                {/* NAVEGACIÓN */}
                <nav className="menu-nav">
                  <ul>
                    <li className="menu-item active">
                      <span className="menu-icon">🏠</span>
                      <span className="menu-text">Home</span>
                    </li>

                    <li className="menu-item">
                      <span className="menu-icon">👤</span>
                      <span className="menu-text">Mi Perfil</span>
                    </li>

                    <li className="menu-item">
                      <span className="menu-icon">ℹ️</span>
                      <span className="menu-text">Sobre Nosotros</span>
                    </li>
                  </ul>
                </nav>

                {/* BOTÓN CERRAR SESIÓN */}
                <div className="menu-footer">
                  <button className="logout-btn-menu" onClick={handleLogout}>
                    <span className="logout-icon">🚪</span>
                    Cerrar Sesión
                  </button>
                </div>
              </aside>

              {/* ========================== */}
              {/*     CONTENIDO PRINCIPAL    */}
              {/* ========================== */}
              <main className="main-content">

                {/* LOGO SUPERIOR CREADOR DE REUNIÓN */}
                <div className="create-logo-container">
                  <img
                    src="/Imagenes/logo2.png"
                    alt="Crear reunión"
                    className="create-logo"
                  />
                </div>

                {/* SECCIÓN CREAR REUNIÓN */}
                <section className="create-meeting-section">
                  <h2 className="section-title">Crear Reunión</h2>

                  <div className="create-meeting-form">

                    <div className="form-group">
                      <label htmlFor="meeting-id">Ingresar ID de reunión</label>

                      <input
                        type="text"
                        id="meeting-id"
                        value={meetingId}
                        onChange={(e) => setMeetingId(e.target.value)}
                        placeholder="ID de reunión"
                        className="meeting-input"
                      />
                    </div>

                    <button
                      type="button"
                      className="ingresar-btn"
                      onClick={handleCreateMeeting}
                    >
                      Ingresar
                    </button>

                  </div>
                </section>

              </main>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
