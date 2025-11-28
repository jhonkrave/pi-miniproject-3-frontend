import React from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import './AboutUs.scss';

const AboutUs: React.FC = () => {
  return (
    <DashboardLayout title="Sobre Nosotros" subtitle="Conoce más sobre TeamLink">
        <div className="about-container">
            <div className="about-card">
                <div className="about-hero">
                    <img src="/Imagenes/logo2.png" alt="TeamLink" />
                    <h2>Conectando equipos, sin límites.</h2>
                    <p>TeamLink es la plataforma líder en videoconferencias diseñada para la colaboración moderna.</p>
                </div>
                
                <div className="about-grid">
                    <div className="feature-item">
                        <h3>🚀 Rápido y Seguro</h3>
                        <p>Infraestructura optimizada para baja latencia y máxima seguridad en tus datos.</p>
                    </div>
                    <div className="feature-item">
                        <h3>💻 Multiplataforma</h3>
                        <p>Accede desde cualquier dispositivo sin instalar software adicional.</p>
                    </div>
                    <div className="feature-item">
                        <h3>🤝 Colaborativo</h3>
                        <p>Herramientas integradas para compartir pantalla, chat y gestión de equipos.</p>
                    </div>
                </div>
            </div>
        </div>
    </DashboardLayout>
  );
};

export default AboutUs;
