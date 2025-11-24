// Pages/Profile.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.scss';

// 🔥 Importar modales
import ModalEditProfile from '../ModalEditProfile/ModalEditProfile';
import ModalDeleteAccount from '../ModalDeleteAccount/ModalDeleteAccount';

const Profile: React.FC = () => {
  const navigate = useNavigate();

  // Estados para los modales
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // 🔵 Navegaciones
  const handleLogout = () => navigate('/login');
  const goHome = () => navigate('/home');
  const goAbout = () => navigate('/sobre-nosotros');  // ⭐ NUEVO

  // 🔵 Handler para guardar datos del perfil
  const handleSaveProfile = (data: any) => {
    // TODO: Implementar lógica para guardar los datos
    console.log('Datos guardados:', data);
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
                    <li className="menu-item" onClick={goHome}>
                      <span className="menu-icon">🏠</span>
                      <span className="menu-text">Home</span>
                    </li>

                    <li className="menu-item active">
                      <span className="menu-icon">👤</span>
                      <span className="menu-text">Mi Perfil</span>
                    </li>

                    {/* ⭐ AHORA SÍ FUNCIONA */}
                    <li className="menu-item" onClick={goAbout}>
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
              <main className="main-content profile-main">

                {/* FOTO */}
                <div className="profile-photo-container">
                  <img
                    src="/Imagenes/usuario.png"
                    className="profile-photo"
                    alt="Foto Usuario"
                  />
                </div>

                {/* NOMBRE */}
                <h1 className="profile-name">Ana María García López</h1>
                <p className="profile-member">Miembro desde 10/11/2025</p>

                <div className="profile-info-wrapper">

                  {/* INFORMACIÓN PERSONAL */}
                  <div className="profile-info-card">
                    <div className="profile-info-header">
                      <h3>Información Personal</h3>

                      <button
                        className="edit-btn"
                        onClick={() => setEditModalOpen(true)}
                      >
                        Editar Datos
                      </button>
                    </div>

                    <div className="profile-info-grid">

                      <div className="info-item">
                        <span className="label">Nombre Completo</span>
                        <span className="value">Ana María</span>
                      </div>

                      <div className="info-item">
                        <span className="label">Apellido</span>
                        <span className="value">García López</span>
                      </div>

                      <div className="info-item">
                        <span className="label">Correo Electrónico</span>
                        <span className="value">anagarcia12@gmail.com</span>
                      </div>

                      <div className="info-item">
                        <span className="label">Edad</span>
                        <span className="value">30</span>
                      </div>

                      <div className="info-item wide">
                        <span className="label">Contraseña</span>
                        <span className="value">•••••••</span>
                      </div>
                    </div>
                  </div>

                  {/* ACCIONES */}
                  <div className="profile-actions-card">
                    <h3 className="actions-title">Acciones de Cuenta</h3>

                    <button
                      className="delete-account-btn"
                      onClick={() => setDeleteModalOpen(true)}
                    >
                      🗑️ Eliminar Cuenta
                    </button>

                    <button className="logout-secondary-btn">
                      🚪 Cerrar Sesión
                    </button>
                  </div>

                </div>

              </main>
            </div>
          </div>

          {/* MODAL EDITAR DATOS */}
          {editModalOpen && (
            <ModalEditProfile 
              onClose={() => setEditModalOpen(false)}
              onSave={handleSaveProfile}
            />
          )}

          {/* MODAL ELIMINAR CUENTA */}
          {deleteModalOpen && (
            <ModalDeleteAccount onClose={() => setDeleteModalOpen(false)} />
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
