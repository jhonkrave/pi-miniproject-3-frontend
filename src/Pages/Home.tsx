// Pages/Home.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.scss";

import ModalCrearReunion from "./ModalCrearReunion";

const Home: React.FC = () => {
  const [meetingId, setMeetingId] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingId.trim()) return;
    console.log("Uniéndose a la reunión con ID:", meetingId);
  };

  const handleLogout = () => {
    console.log("Cerrando sesión…");
    navigate("/login");
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const handleCreateMeeting = (data: any) => {
    console.log("Nueva reunión creada:", data);
    closeCreateModal();
  };

  return (
    <div className="home-page">
      {/* 🔷 RECTÁNGULO CENTRAL */}
      <div className="home-frame">
        
        {/* ▬▬▬▬▬ SIDEBAR ▬▬▬▬▬ */}
        <aside className="sidebar">
          <div className="sidebar-header">
            {/* Contenedor principal con logo y nombre de la app (ajustar si es necesario) */}
             <div className="logo-container">
                <img
                    // ⭐⭐ CAMBIAR RUTA DE LA IMAGEN SI ES NECESARIO ⭐⭐
                    src="/Imagenes/TeamLink-Logo-White.png" 
                    alt="TeamLink"
                    className="logo-img"
                />
             </div>
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
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* ▬▬▬▬▬ CONTENIDO PRINCIPAL ▬▬▬▬▬ */}
        <main className="main-content">
          <div className="content-inner">

            {/* Icono grande */}
            <div className="content-header">
              {/* ⭐⭐ REEMPLAZAR EL ICONO POR EL DE LA MAQUETA ⭐⭐ */}
              <div className="big-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.5 16.5V11.5L9.5 8.5V13.5L14.5 16.5ZM14.5 16.5L19.5 13.5V8.5L14.5 5.5V10.5L19.5 13.5Z" fill="#1B2A41" stroke="#1B2A41" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="7" y="10" width="10" height="7" rx="1.5" fill="#1B2A41"/>
                    <path d="M8 12.5L16 12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Botones y Formulario de Ingreso */}
            <div className="actions-grid">
              
              <div className="action-card create-meeting-card">
                <button
                  className="card-btn primary-btn"
                  onClick={openCreateModal}
                >
                  Crear Reunión
                </button>
              </div>

              <div className="action-card join-meeting-card">
                <form onSubmit={handleJoinMeeting} className="join-form">
                  <div className="input-group">
                    <input
                      type="text"
                      value={meetingId}
                      onChange={(e) => setMeetingId(e.target.value)}
                      placeholder="Ingresar ID de reunión"
                      className="meeting-input"
                    />
                  </div>
                  <button type="submit" className="card-btn secondary-btn">
                    Ingresar
                  </button>
                </form>
              </div>
            </div>

            {/* Sección de reuniones */}
            <section className="meetings-section">
              {/* Se eliminó el h2, el estilo en SCSS lo oculta */}

              {/* REUNIÓN DE EQUIPO 1 */}
              <article className="meeting-card">
                <h3 className="meeting-card__title">REUNIÓN DE EQUIPO</h3>

                <div className="meeting-card__row">
                  <div>
                    <p className="meeting-card__label">Fecha y hora de inicio:</p>
                    <p>10-Nov-2025</p>
                    <p>9:20 AM</p>
                  </div>
                  <div>
                    <p className="meeting-card__label">Fecha y hora creación:</p>
                    <p>08-Nov-2025</p>
                    <p>1:00 PM</p>
                  </div>
                  <div>
                    <p className="meeting-card__label">ID:</p>
                    <p>8379826</p>
                  </div>
                </div>

                <p className="meeting-card__description">
                  Descripción: Se hace con el fin de planear la metodología de trabajo en equipo.
                </p>

                <div className="meeting-card__actions">
                  <button className="meeting-card__btn">Acceder</button>
                </div>
              </article>

              {/* REUNIÓN DE EQUIPO 2 */}
              <article className="meeting-card">
                <h3 className="meeting-card__title">REUNIÓN DE EQUIPO</h3>

                <div className="meeting-card__row">
                  <div>
                    <p className="meeting-card__label">Fecha y hora de inicio:</p>
                    <p>20-Nov-2025</p>
                    <p>5:00 PM</p>
                  </div>
                  <div>
                    <p className="meeting-card__label">Fecha y hora creación:</p>
                    <p>16-Nov-2025</p>
                    <p>6:00 PM</p>
                  </div>
                  <div>
                    <p className="meeting-card__label">ID:</p>
                    <p>8379826</p>
                  </div>
                </div>

                <p className="meeting-card__description">
                  Descripción: Reunión con el fin de planear la metodología de trabajo en equipo.
                </p>

                <div className="meeting-card__actions">
                  <button className="meeting-card__btn">Acceder</button>
                </div>
              </article>
              
              {/* Más Reuniones para demostración del scroll */}
              <article className="meeting-card">
                <h3 className="meeting-card__title">REUNIÓN DE VENTAS</h3>
                <div className="meeting-card__row">
                  <div>
                    <p className="meeting-card__label">Fecha y hora de inicio:</p>
                    <p>25-Nov-2025</p>
                    <p>11:00 AM</p>
                  </div>
                  <div>
                    <p className="meeting-card__label">Fecha y hora creación:</p>
                    <p>22-Nov-2025</p>
                    <p>9:00 AM</p>
                  </div>
                  <div>
                    <p className="meeting-card__label">ID:</p>
                    <p>9012345</p>
                  </div>
                </div>
                <p className="meeting-card__description">
                  Descripción: Revisión de métricas del trimestre y planificación de estrategias.
                </p>
                <div className="meeting-card__actions">
                  <button className="meeting-card__btn">Acceder</button>
                </div>
              </article>
              
            </section>
          </div>
        </main>
      </div>

      {/* ▬▬▬▬▬ MODAL CREAR REUNIÓN ▬▬▬▬▬ */}
      {isCreateModalOpen && (
        <ModalCrearReunion
          onClose={closeCreateModal}
          onCreate={handleCreateMeeting}
        />
      )}
    </div>
  );
};

export default Home;