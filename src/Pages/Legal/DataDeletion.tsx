import React from 'react';
import './Legal.scss';

const DataDeletion: React.FC = () => {
  return (
    <div className="legal-container fade-in">
      <header className="legal-header">
        <h1>Instrucciones de Eliminación de Datos</h1>
        <p>Cumplimiento con la política de datos de usuario de Facebook/Meta</p>
      </header>
      
      <div className="legal-content">
        <section>
          <h2>Solicitud de Eliminación de Datos</h2>
          <p>
            De acuerdo con las normas de Facebook Platform, proporcionamos a los usuarios 
            la capacidad de solicitar la eliminación de sus datos.
          </p>
        </section>

        <section>
          <h2>Opción 1: Eliminación Automática desde la App</h2>
          <p>
            Puede eliminar su cuenta y todos los datos asociados directamente desde la aplicación:
          </p>
          <ol>
            <li>Inicie sesión en <strong>TeamLink</strong>.</li>
            <li>Vaya a la sección <strong>"Mi Perfil"</strong>.</li>
            <li>Haga clic en el botón rojo <strong>"Eliminar Cuenta"</strong> en la zona de peligro.</li>
            <li>Confirme la acción en el modal que aparece.</li>
          </ol>
          <p>
            Esta acción eliminará permanentemente su cuenta de usuario, su perfil y sus reuniones de nuestra base de datos y de Firebase Authentication.
          </p>
        </section>

        <section>
          <h2>Opción 2: Solicitud Manual</h2>
          <p>
            Si no puede acceder a su cuenta, puede solicitar la eliminación manual de sus datos enviando un correo electrónico a nuestro soporte.
            Por favor incluya:
          </p>
          <ul>
            <li>Asunto: Solicitud de Eliminación de Datos (Facebook/Google)</li>
            <li>Su correo electrónico registrado.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default DataDeletion;

