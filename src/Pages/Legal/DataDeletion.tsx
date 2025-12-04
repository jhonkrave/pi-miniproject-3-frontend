import React from 'react';
import { Link } from 'react-router-dom';
import './Legal.scss';

const DataDeletion: React.FC = () => {
  return (
    <div className="legal-container animate-fade-in">
      <header className="legal-header">
        <h1>Instrucciones de Eliminación de Datos</h1>
        <p>Cumplimiento con la política de datos de usuario de Facebook/Meta</p>
      </header>
      
      <div className="legal-content">
        <section>
          <h2>Solicitud de Eliminación de Datos</h2>
          <p>
            De acuerdo con las normas de la Plataforma de Facebook y las regulaciones de privacidad vigentes, 
            en TeamLink proporcionamos a nuestros usuarios el control total sobre sus datos personales, 
            incluyendo la capacidad de solicitar su eliminación permanente.
          </p>
        </section>

        <section>
          <h2>Opción 1: Eliminación Automática desde la App (Recomendado)</h2>
          <p>
            Esta es la forma más rápida y segura de eliminar sus datos. Puede eliminar su cuenta y toda la información asociada directamente desde la interfaz de usuario:
          </p>
          <ol>
            <li>Inicie sesión en <strong>TeamLink</strong> con sus credenciales.</li>
            <li>Navegue a la sección <strong>"Mi Perfil"</strong> (accesible desde el menú o el pie de página).</li>
            <li>Busque la "Zona de Peligro" en la parte inferior de su perfil.</li>
            <li>Haga clic en el botón rojo <strong>"Eliminar Cuenta"</strong>.</li>
            <li>Confirme la acción en la ventana modal de seguridad que aparecerá.</li>
          </ol>
          <p>
            <strong>Consecuencias:</strong> Esta acción es irreversible. Eliminará permanentemente su cuenta de usuario, su información de perfil, su historial de reuniones y desconectará su autenticación de nuestros sistemas y de Firebase.
          </p>
        </section>

        <section>
          <h2>Opción 2: Solicitud de Soporte Manual</h2>
          <p>
            Si no puede acceder a su cuenta o prefiere que nosotros realicemos el proceso, puede enviar una solicitud formal de eliminación:
          </p>
          <ul>
            <li><strong>Correo electrónico:</strong> Envíe un correo a <a href="mailto:privacy@teamlink.demo">privacy@teamlink.demo</a></li>
            <li><strong>Asunto:</strong> "Solicitud de Eliminación de Datos - [Su Plataforma de Login]"</li>
            <li><strong>Contenido:</strong> Incluya su dirección de correo electrónico registrada y una prueba de identidad si es necesario.</li>
          </ul>
          <p>
            Procesaremos su solicitud en un plazo máximo de 30 días hábiles y le notificaremos una vez que sus datos hayan sido eliminados.
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

export default DataDeletion;
