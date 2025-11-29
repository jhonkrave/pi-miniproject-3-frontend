import React from 'react';
import { Link } from 'react-router-dom';
import './Legal.scss';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="legal-container animate-fade-in">
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
            cuando utiliza nuestra aplicación. Nos comprometemos a proteger su privacidad y asegurar 
            que sus datos personales sean tratados de manera segura y responsable.
          </p>
        </section>

        <section>
          <h2>2. Información que Recopilamos</h2>
          <p>
            Para proporcionar nuestros servicios de autenticación y videoconferencia de manera efectiva, podemos recopilar y procesar los siguientes datos:
          </p>
          <ul>
            <li><strong>Información de Perfil:</strong> Nombre completo, dirección de correo electrónico y foto de perfil, obtenidos a través de proveedores de autenticación (Google, Facebook) o proporcionados directamente.</li>
            <li><strong>Credenciales:</strong> Información de autenticación gestionada de forma segura por Google Firebase. Nosotros no almacenamos sus contraseñas en nuestros servidores.</li>
            <li><strong>Datos de Uso:</strong> Información sobre las reuniones creadas (título, fecha, duración) para mantener un historial de su actividad.</li>
          </ul>
        </section>

        <section>
          <h2>3. Uso de la Información</h2>
          <p>
            Utilizamos su información exclusivamente para los siguientes propósitos:
          </p>
          <ul>
            <li><strong>Autenticación:</strong> Verificar su identidad y permitir el acceso seguro a su cuenta.</li>
            <li><strong>Servicio:</strong> Facilitar la creación, gestión y unión a reuniones de video en tiempo real.</li>
            <li><strong>Personalización:</strong> Mostrar su nombre y foto en la interfaz y durante las reuniones para una mejor experiencia de usuario.</li>
            <li><strong>Mejora:</strong> Entender cómo se utiliza nuestra aplicación para mejorar su funcionalidad (datos agregados y anónimos).</li>
          </ul>
        </section>

        <section>
          <h2>4. Compartir Información</h2>
          <p>
            No vendemos, alquilamos ni compartimos su información personal con terceros con fines comerciales. 
            Los datos se almacenan y procesan utilizando la infraestructura segura de <strong>Google Firebase</strong>. 
            Podemos divulgar información si es requerido por ley o para proteger nuestros derechos.
          </p>
        </section>

        <section>
          <h2>5. Seguridad de los Datos</h2>
          <p>
            Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos contra el acceso no autorizado, 
            la pérdida o la alteración. Sin embargo, ningún método de transmisión por Internet es 100% seguro, por lo que no podemos garantizar una seguridad absoluta.
          </p>
        </section>

        <section>
          <h2>6. Contacto</h2>
          <p>
            Si tiene preguntas o inquietudes sobre esta política de privacidad, por favor contáctenos a través de nuestro soporte o en el repositorio del proyecto.
          </p>
        </section>
      </div>

      <div className="legal-footer">
        <Link to="/login" className="btn btn-secondary">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
