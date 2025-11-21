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
            <img
              src="/Imagenes/logo.png"
              alt="TeamLink"
              className="logo-img"
            />
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
              <div className="big-icon">🎥</div>
            </div>

            {/* Botones */}
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
              <h2 className="meetings-title">Reuniones</h2>

              <article className="meeting-card">
                <h3 className="meeting-card__title">REUNIÓN DE EQUIPO</h3>

                <div className="meeting-card__row">
                  <div>
                    <p className="meeting-card__label">Fecha y hora de inicio:</p>
                    <p>10-Nov-2025</p>
                    <p>9:20 AM</p>
                  </div>
                  <div>
                    <p className="meeting-card__label">Fecha y hora de creación:</p>
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

              <article className="meeting-card">
                <h3 className="meeting-card__title">REUNIÓN DE EQUIPO</h3>

                <div className="meeting-card__row">
                  <div>
                    <p className="meeting-card__label">Fecha y hora de inicio:</p>
                    <p>20-Nov-2025</p>
                    <p>5:00 PM</p>
                  </div>
                  <div>
                    <p className="meeting-card__label">Fecha y hora de creación:</p>
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
