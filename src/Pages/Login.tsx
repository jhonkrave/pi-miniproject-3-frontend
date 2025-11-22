// Pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 🔥 Firebase solo para Google/Facebook
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../firebase/firebaseConfig";

import './Login.scss';

interface LoginProps {
  onGoToRegister?: () => void;
  onGoToForgotPassword?: () => void;
}

const Login: React.FC<LoginProps> = ({ onGoToRegister, onGoToForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ⭐ Inicio de sesión normal (correo y contraseña NO usa Firebase)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Iniciando sesión...', { email, password, rememberMe });

    // 👉 Aquí navega directamente al home
    navigate("/home");
  };

  // ⭐⭐⭐ GOOGLE LOGIN ⭐⭐⭐
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Usuario con Google:", user);

      alert("¡Inicio de sesión con Google exitoso!");
      navigate("/home");

    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      alert("No se pudo iniciar sesión con Google");
    }
  };

  // ⭐⭐⭐ FACEBOOK LOGIN ⭐⭐⭐
  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      console.log("Usuario con Facebook:", user);

      alert("¡Inicio de sesión con Facebook exitoso!");
      navigate("/home");

    } catch (error) {
      console.error("Error al iniciar sesión con Facebook:", error);
      alert("No se pudo iniciar sesión con Facebook");
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
    <div className="login-wrapper">

      {/* COLUMNA IZQUIERDA */}
      <div className="login-image-section">
        <div className="image-container">
          <img 
            src="/Imagenes/login-background.jpg"
            alt="TeamLink background"
            className="background-image"
          />
        </div>
      </div>

      {/* COLUMNA DERECHA */}
      <div className="login-form-section">
        <div className="form-card">
          <div className="card-content">

            {/* ICONO */}
            <div className="security-icon">
              <div className="icon-container">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="3" stroke="white" strokeWidth="2"/>
                  <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
            </div>

            <h1 className="form-title">Iniciar Sesión</h1>
            <p className="form-subtitle">👋 Bienvenido de vuelta</p>

            {/* FORMULARIO */}
            <form onSubmit={handleSubmit} className="login-form">

              {/* Email */}
              <div className="input-group">
                <label htmlFor="email" className="input-label">
                  <span className="input-emoji">📧</span>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingresa tu correo electrónico"
                  className="form-input"
                  required
                />
              </div>

              {/* Contraseña */}
              <div className="input-group">
                <label htmlFor="password" className="input-label">
                  <span className="input-emoji">🔑</span>
                  Contraseña
                </label>

                <div className="password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                    className="form-input password-input"
                    required
                  />

                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {/* Recordarme / Olvidé */}
              <div className="form-options">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="checkbox"
                  />
                  <label htmlFor="remember" className="checkbox-label">
                    Recordarme
                  </label>
                </div>

                <a onClick={goToForgotPassword} className="forgot-password">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button type="submit" className="btn btn-primary">
                <span className="btn-emoji">🎥</span>
                Iniciar Sesión
              </button>
            </form>

            <div className="divider">
              <span>o continuar con</span>
            </div>

            {/* BOTONES SOCIALES */}
            <div className="social-buttons">
              
              {/* GOOGLE */}
              <button type="button" className="btn btn-google" onClick={handleGoogleLogin}>
                <svg className="social-icon google-icon" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Iniciar con Google
              </button>

              {/* FACEBOOK */}
              <button type="button" className="btn btn-facebook" onClick={handleFacebookLogin}>
                <svg className="social-icon facebook-icon" width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43
                    c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328
                    l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Iniciar con Facebook
              </button>
            </div>

            <div className="divider">
              <span>¿No tienes cuenta?</span>
            </div>

            <button type="button" className="btn btn-create-account" onClick={goToRegister}>
              <span className="btn-emoji">✨</span>
              Crear Cuenta
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
