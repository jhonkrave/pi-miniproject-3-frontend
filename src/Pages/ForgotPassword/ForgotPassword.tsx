import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { authService } from '../../lib/authService';
import "./ForgotPassword.scss";

const RecoverPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      await authService.sendPasswordResetEmail(email);
      setMessage("Enlace de recuperación enviado. Revisa tu correo.");
    } catch (err: any) {
      console.error("Error sending password reset email:", err);
      if (err.code === 'auth/user-not-found') {
        setError("No existe una cuenta con este correo.");
      } else {
        setError("Error al enviar el correo. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate("/login"); 
  };

  return (
    <div className="recover-wrapper">
      <div className="recover-card fade-in">
        
        <div className="recover-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>

        <div>
            <h1 className="recover-title">Recuperar Contraseña</h1>
            <p className="recover-subtitle">
                Ingresa tu correo y te enviaremos un enlace para restablecer tu acceso.
            </p>
        </div>

        {message && (
            <div className="success-message">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                {message}
            </div>
        )}
        
        {error && (
            <div className="error-message">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="recover-form">
          <div className="input-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>

        <button className="back-button" onClick={goToLogin}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Volver al inicio de sesión
        </button>

      </div>
    </div>
  );
};

export default RecoverPassword;
