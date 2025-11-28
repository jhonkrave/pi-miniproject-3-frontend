import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../lib/authService';
import useAuthStore from '../../stores/useAuthStore'; // Import Zustand store
import './Login.scss';

interface LoginProps {
  onGoToRegister?: () => void;
  onGoToForgotPassword?: () => void;
}

const Login: React.FC<LoginProps> = ({ onGoToRegister, onGoToForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Watch user state from store
  const { user } = useAuthStore();

  // Effect to auto-redirect if user becomes authenticated
  useEffect(() => {
    if (user) {
        navigate("/home", { replace: true }); // Use replace to prevent going back to login
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.loginWithEmail(email, password);
      // No need to navigate here manually, the useEffect will handle it when auth state updates
    } catch (err) {
      console.error("Login Error:", err);
      setLoading(false); // Only stop loading if error, otherwise keep loading until redirect
      const code = (err as any).code;
      if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        setError("Correo o contraseña incorrectos.");
      } else if (code === 'auth/too-many-requests') {
        setError("Demasiados intentos fallidos. Intenta más tarde.");
      } else {
        setError("Error al iniciar sesión. Intenta nuevamente.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await authService.loginWithGoogle();
      // useEffect will handle navigation
    } catch (err) {
      console.error("Google Login Error:", err);
      setLoading(false);
      setError("No se pudo iniciar sesión con Google.");
    }
  };

  const handleFacebookLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await authService.loginWithFacebook();
      // useEffect will handle navigation
    } catch (err) {
      console.error("Facebook Login Error:", err);
      setLoading(false);
      setError("No se pudo iniciar sesión con Facebook.");
    }
  };

  const goToRegister = () => {
    if (onGoToRegister) onGoToRegister();
    else navigate('/register');
  };

  const goToForgotPassword = () => {
    if (onGoToForgotPassword) onGoToForgotPassword();
    else navigate('/forgot-password');
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <header className="auth-header">
          <img 
            src="/Imagenes/logo2.png" 
            alt="TeamLink Logo" 
            className="logo-img"
            onError={(e) => e.currentTarget.style.display = 'none'}
          />
          <h1>Bienvenido</h1>
          <p>Ingresa tus credenciales para continuar</p>
        </header>

        {error && (
          <div className="error-banner">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <div style={{ position: 'relative' }}>
                <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        opacity: 0.6
                    }}
                >
                    {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    )}
                </button>
            </div>
          </div>

          <div className="auth-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </button>
            
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginTop: '10px'}}>
                <a onClick={goToForgotPassword} style={{color: 'var(--primary)', cursor: 'pointer'}}>¿Olvidaste tu contraseña?</a>
            </div>
          </div>
        </form>

        <div className="divider">o continúa con</div>

        <div className="social-buttons">
          <button type="button" className="btn btn-secondary" onClick={handleGoogleLogin}>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          
          <button type="button" className="btn btn-secondary" onClick={handleFacebookLogin}>
             <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43
                    c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328
                    l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
             </svg>
             Facebook
          </button>
        </div>

        <div className="auth-footer-link">
          ¿No tienes cuenta? 
          <a onClick={goToRegister} style={{cursor: 'pointer'}}>Regístrate gratis</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
