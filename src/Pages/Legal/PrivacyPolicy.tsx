import React from 'react';
import './Legal.scss';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="legal-container fade-in">
      <header className="legal-header">
        <h1>Política de Privacidad</h1>
        <p>Última actualización: Noviembre 2025</p>
      </header>
      
      <div className="legal-content">
        <section>
          <h2>1. Introducción</h2>
          <p>
            TeamLink ("nosotros", "nuestro") opera como un proyecto académico y de demostración. 
            Esta política de privacidad explica cómo recopilamos, usamos y protegemos su información 
            cuando utiliza nuestra aplicación.
          </p>
        </section>

        <section>
          <h2>2. Información que Recopilamos</h2>
          <p>
            Para proporcionar nuestros servicios de autenticación y videoconferencia, podemos recopilar:
          </p>
          <ul>
            <li>Información de perfil básico (Nombre, Correo electrónico, Foto de perfil) a través de Google o Facebook.</li>
            <li>Credenciales de inicio de sesión (gestionadas de forma segura por Firebase).</li>
            <li>Información de las reuniones creadas (Título, Fecha).</li>
          </ul>
        </section>

        <section>
          <h2>3. Uso de la Información</h2>
          <p>
            Utilizamos su información exclusivamente para:
          </p>
          <ul>
            <li>Autenticar su identidad y permitir el acceso a la aplicación.</li>
            <li>Gestionar su perfil de usuario.</li>
            <li>Facilitar la creación y unión a reuniones de video.</li>
          </ul>
        </section>

        <section>
          <h2>4. Compartir Información</h2>
          <p>
            No vendemos ni compartimos su información personal con terceros. 
            Los datos se almacenan de forma segura utilizando los servicios de Google Firebase.
          </p>
        </section>

        <section>
          <h2>5. Contacto</h2>
          <p>
            Si tiene preguntas sobre esta política, contáctenos en el correo de soporte del desarrollador.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

