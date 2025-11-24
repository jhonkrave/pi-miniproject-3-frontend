// Pages/Home.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.scss';

// Modal
import ModalCreateMeeting from '../ModalCreateMeeting/ModalCreateMeeting';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="home-wrapper">
      <div className="home-full-section">
        <div className="content-card">
          <div className="card-content">

            <div className="layout-container">

              {/* MENÚ LATERAL */}
              <aside className="side-menu">

                <div className="menu-header">
                  <img
                    src="/Imagenes/logo.png"
                    alt="TeamLink Logo"
                    className="menu-logo"
                  />
                </div>

                <nav className="menu-nav">
                  <ul>
                    {/* HOME */}
                    <li className="menu-item active">
                      <span className="menu-icon">🏠</span>
                      <span className="menu-text">Home</span>
                    </li>

                    {/* PERFIL */}
                    <li className="menu-item" onClick={goToProfile}>
                      <span className="menu-icon">👤</span>
                      <span className="menu-text">Mi Perfil</span>
                    </li>

                    {/* ⭐ SOBRE NOSOTROS ⭐ */}
                    <li className="menu-item" onClick={() => navigate("/about-us")}>
                      <span className="menu-icon">ℹ️</span>
                      <span className="menu-text">Sobre Nosotros</span>
                    </li>
                  </ul>
                </nav>

                <div className="menu-footer">
                  <button className="logout-btn-menu" onClick={handleLogout}>
                    <span className="logout-icon">🚪</span>
                    Cerrar Sesión
                  </button>
                </div>

              </aside>

              {/* CONTENIDO PRINCIPAL */}
              <main className="main-content">

                <div className="create-logo-container">
                  <img
                    src="/Imagenes/logo2.png"
                    alt="Crear reunión"
                    className="create-logo"
                  />
                </div>

                <div className="crear-reunion-container">
                  <div className="crear-reunion-wrapper">

                    {/* BOTÓN MODAL */}
                    <button
                      className="crear-reunion-title crear-reunion-btn-modal"
                      onClick={() => setModalOpen(true)}
                    >
                      Crear Reunión
                    </button>

                    {/* INPUT + BOTÓN */}
                    <div className="crear-reunion-form">
                      <input
                        type="text"
                        placeholder="Ingresar ID de reunión"
                        className="crear-reunion-input"
                      />

                      <button className="crear-reunion-btn">Ingresar</button>
                    </div>

                    {/* TARJETAS */}
                    <div className="panel-reuniones">
                      <h3 className="panel-reuniones-title">Reuniones</h3>

                      <div className="panel-reuniones-content">

                        <div className="reunion-card">
                          <div className="reunion-card-header">
                            <h4>Reunión de Equipo</h4>
                            <span className="reunion-id">ID: 8379826</span>
                          </div>

                          <div className="reunion-info">
                            <div><strong>📅 Fecha:</strong> 10-Nov-2025</div>
                            <div><strong>⏰ Hora:</strong> 9:20 AM</div>
                          </div>

                          <button className="btn-acceder">Acceder</button>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>

              </main>
            </div>

            {/* MODAL CREAR */}
            {modalOpen && (
              <ModalCreateMeeting
                onClose={() => setModalOpen(false)}
                onCreate={(data) => console.log("Reunión creada:", data)}
              />
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
