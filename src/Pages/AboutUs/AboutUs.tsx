import React from "react";
import { useNavigate } from "react-router-dom";
import "./AboutUs.scss";

const AboutUs: React.FC = () => {
  const navigate = useNavigate();

  const goHome = () => navigate("/home");
  const goProfile = () => navigate("/profile");

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

                    <li className="menu-item" onClick={goProfile}>
                      <span className="menu-icon">👤</span>
                      <span className="menu-text">Mi Perfil</span>
                    </li>

                    <li className="menu-item active">
                      <span className="menu-icon">ℹ️</span>
                      <span className="menu-text">Sobre Nosotros</span>
                    </li>
                  </ul>
                </nav>

                <div className="menu-footer">
                  <button className="logout-btn-menu">
                    <span className="logout-icon">🚪</span>
                    Cerrar Sesión
                  </button>
                </div>
              </aside>

              {/* CONTENIDO PRINCIPAL */}
              <main className="sobre-main">

                <h1 className="sobre-title">Sobre TeamLink</h1>
                <p className="sobre-subtitle">
                  Conectamos personas, potenciamos ideas.
                </p>

                <div className="sobre-content-wrapper">

                  {/* PANEL IZQUIERDO */}
                  <div className="sobre-info-card">

                    <div className="sobre-section">
                      <h4>💙 Nuestra propuesta</h4>
                      <p>
                        Creamos una experiencia moderna, fluida y pensada para la colaboración. 
                        Una interfaz clara, intuitiva y adaptable que facilita 
                        conectar personas y equipos sin complicaciones.
                      </p>
                    </div>

                    <div className="sobre-section">
                      <h4>🔐 Privacidad y seguridad</h4>
                      <p>
                        Tu seguridad es esencial para nosotros. Protegemos tus datos y te damos 
                        el control de tu cuenta en todo momento. Puedes gestionar tu perfil y reuniones
                        de manera segura y transparente.
                      </p>
                    </div>

                    <div className="sobre-section">
                      <h4>✨ ¿Por qué TeamLink?</h4>
                      <p>
                        Porque creemos en la conexión humana. Diseñamos TeamLink para que comunicarte 
                        y trabajar en equipo sea más fácil, eficiente y humano.
                      </p>
                    </div>

                    <div className="sobre-section">
                      <h4>🚀 Sobre TalkWare Studio</h4>
                      <p>
                        Somos un grupo de jóvenes desarrolladores con una misma pasión: 
                        crear herramientas digitales que acerquen a las personas.
                      </p>
                    </div>

                  </div>

                  {/* IMAGEN */}
                  <div className="sobre-image-container">
                    <img src="/Imagenes/grupo.png" className="sobre-image" />
                  </div>

                </div>

              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

