import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.scss";

const RecoverPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Enviando enlace de recuperación a:', email);
  };

  const goToLogin = () => {
    navigate("/login"); 
  };

  return (
    <div className="recover-wrapper">

      {/* COLUMNA IZQUIERDA */}
      <div className="recover-image-section">
        <div className="image-container">
          <img
            src="/Imagenes/login-background.jpg"
            alt="TeamLink background"
            className="background-image"
          />
        </div>
      </div>

      {/* COLUMNA DERECHA */}
      <div className="recover-form-section">
        <div className="recover-card">

          {/* ICONO SUPERIOR — SVG BLANCO */}
          <div className="recover-icon">
            <div className="icon-container">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="15" cy="9" r="3" />
                <path d="M21 3l-6 6" />
                <path d="M10 14l-4 4 1.5 1.5" />
                <path d="M10 14l-1.5 1.5 1.5 1.5" />
              </svg>
            </div>
          </div>

          {/* TÍTULO */}
          <h1 className="recover-title">Recuperar Contraseña</h1>

          {/* SUBTÍTULO */}
          <p className="recover-subtitle">
            <span className="subtitle-emoji">🔑</span>
            Te enviaremos un enlace de recuperación
          </p>

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="recover-form">
            <div className="input-group">
              <label className="input-label">
                <span className="input-emoji">📧</span>
                Correo electrónico
              </label>

              <input
                type="email"
                className="form-input"
                placeholder="ejemplo@correo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* TEXTO DE AYUDA CENTRADO */}
            <p className="helper-text centered-helper">
              <span className="helper-emoji">💡</span>
              Ingresa el correo asociado a tu cuenta
            </p>

            {/* BOTÓN ENVIAR */}
            <button type="submit" className="btn btn-primary">
              <span className="btn-emoji">📧</span>
              Enviar Enlace de Recuperación
            </button>
          </form>

          {/* ¿Recordaste tu contraseña? */}
          <p className="optional-text">¿Recordaste tu contraseña?</p>

          {/* BOTÓN VOLVER */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={goToLogin}
          >
            <span className="btn-emoji">🎥</span>
            Volver al inicio de sesión
          </button>

          {/* TÉRMINOS */}
          <p className="terms-text">
            Al continuar, aceptas nuestros <strong>Términos y Condiciones</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;

