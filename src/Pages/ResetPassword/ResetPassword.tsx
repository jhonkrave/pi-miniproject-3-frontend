import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from '../../lib/authService';
import "./ResetPassword.scss";

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    if (!oobCode) {
      setError("Enlace inválido o expirado.");
    }
  }, [oobCode]);

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return password.length >= 8 && hasUpperCase && hasLowerCase && hasNumber;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!oobCode) {
      setError("Falta el código de restablecimiento.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!validatePassword(newPassword)) {
      setError("La contraseña debe tener al menos 8 caracteres, mayúscula, minúscula y número.");
      return;
    }

    setLoading(true);

    try {
      await authService.confirmPasswordReset(oobCode, newPassword);
      setMessage("¡Contraseña restablecida con éxito!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Error resetting password:", err);
      const code = (err as any).code;
      if (code === 'auth/expired-action-code') {
        setError("El enlace ha expirado. Solicita uno nuevo.");
      } else if (code === 'auth/invalid-action-code') {
        setError("El enlace no es válido.");
      } else {
        setError("Error al restablecer la contraseña. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate("/login"); 
  };

  if (message) {
      return (
        <div className="reset-wrapper">
            <div className="reset-card fade-in">
                <div className="reset-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h1 className="reset-title">¡Todo listo!</h1>
                <p className="reset-subtitle">Tu contraseña ha sido actualizada correctamente.</p>
                <button className="btn btn-primary" onClick={goToLogin}>Iniciar Sesión</button>
            </div>
        </div>
      );
  }

  return (
    <div className="reset-wrapper">
      <div className="reset-card fade-in">
        
        <div className="reset-icon" style={{backgroundColor: '#e0f2fe', color: 'var(--primary)'}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>

        <div>
            <h1 className="reset-title">Nueva Contraseña</h1>
            <p className="reset-subtitle">
                Ingresa tu nueva contraseña segura.
            </p>
        </div>
        
        {error && (
            <div className="error-message">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="reset-form">
          
          <div className="input-group">
            <label>Nueva Contraseña</label>
            <div style={{position:'relative'}}>
                <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', opacity:0.6}}
                >
                    {showPassword ? 
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        : 
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    }
                </button>
            </div>
          </div>

          <div className="input-group">
            <label>Confirmar Contraseña</label>
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading || !oobCode}>
            {loading ? "Guardando..." : "Restablecer Contraseña"}
          </button>
        </form>

        <button className="btn btn-ghost" onClick={goToLogin} style={{fontSize: 14}}>
            Volver al inicio de sesión
        </button>

      </div>
    </div>
  );
};

export default ResetPassword;

