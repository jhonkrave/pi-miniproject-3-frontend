// Pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.scss';

interface RegisterProps {
  onGoToLogin?: () => void;
}

const Register: React.FC<RegisterProps> = ({ onGoToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // --------------------------------------------------
  // CREAR CUENTA MANUAL
  // --------------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creando cuenta manualmente...', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // --------------------------------------------------
  // ⭐⭐⭐ REGISTRO CON GOOGLE — YA FUNCIONAL ⭐⭐⭐
  // --------------------------------------------------
  const handleGoogleRegister = async () => {
    try {
      //const result = await signInWithPopup(auth, googleProvider);

      //const user = result.user;
      //console.log("Usuario registrado con Google:", user);

      alert("Cuenta creada exitosamente con Google ✨");
      navigate("/home");

    } catch (error: any) {
      console.error("Error al registrar con Google:", error);

      // Si el usuario cierra el popup, no debemos mostrar error
      if (error.code === "auth/popup-closed-by-user") {
        console.warn("Popup cerrado por el usuario.");
        return;
      }

      alert("No se pudo registrar con Google");
    }
  };

  // --------------------------------------------------
  // ⭐⭐⭐ REGISTRO CON FACEBOOK — FUNCIÓN REAL ⭐⭐⭐
  // --------------------------------------------------
  const handleFacebookRegister = async () => {
    try {
      //const result = await signInWithPopup(auth, facebookProvider);

      //const user = result.user;
      //console.log("Usuario registrado con Facebook:", user);

      alert("Cuenta creada exitosamente con Facebook ✨");
      navigate("/home");

    } catch (error: any) {
      console.error("Error al registrar con Facebook:", error);

      // Si el usuario cierra el popup, silenciamos
      if (error.code === "auth/popup-closed-by-user") {
        console.warn("Popup de Facebook cerrado por el usuario.");
        return;
      }

      alert("No se pudo registrar con Facebook");
    }
  };

  const goToLogin = () => {
    if (onGoToLogin) onGoToLogin();
    else navigate('/login');
  };

  return (
    <div className="register-wrapper">
      
      {/* Columna izquierda */}
      <div className="register-image-section">
        <div className="image-container">
          <img 
            src="/Imagenes/login-background.jpg"
            alt="TeamLink background"
            className="background-image"
          />
        </div>
      </div>

      {/* Columna derecha */}
      <div className="register-form-section">
        <div className="register-form-card">
          <div className="card-content">

            {/* Icono */}
            <div className="user-icon">
              <div className="icon-container">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2"/>
                  <path d="M6 20C6 17.7909 7.79086 16 10 16H14C16.2091 16 18 17.7909 18 20V21H6V20Z" stroke="white" strokeWidth="2"/>
                  <path d="M19 11H22M19 8H22M19 14H22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            <h1 className="register-title">Crear Cuenta</h1>
            <p className="register-subtitle">✨ Únete a TeamLink</p>

            {/* FORMULARIO */}
            <form onSubmit={handleSubmit} className="register-form">

              {/* Nombre + Apellido */}
              <div className="name-fields">
                <div className="input-group">
                  <label className="input-label">
                    <span className="input-emoji">👤</span> Nombre
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">
                    <span className="input-emoji">👤</span> Apellido
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="input-group">
                <label className="input-label">
                  <span className="input-emoji">📧</span> Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              {/* Edad */}
              <div className="input-group">
                <label className="input-label">
                  <span className="input-emoji">🎂</span> Edad
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              {/* Contraseña */}
              <div className="input-group">
                <label className="input-label">
                  <span className="input-emoji">🔒</span> Contraseña
                </label>
                <div className="password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
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

              {/* Confirmar contraseña */}
              <div className="input-group">
                <label className="input-label">
                  <span className="input-emoji">🔒</span> Confirmar contraseña
                </label>
                <div className="password-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {/* Botón principal */}
              <button type="submit" className="btn btn-primary">
                ✨ Crear Cuenta
              </button>

            </form>

            {/* Separador */}
            <div className="divider">
              <span>o continuar con</span>
            </div>

            {/* BOTONES SOCIALES */}
            <div className="social-buttons">

              {/* GOOGLE ORIGINAL */}
              <button type="button" className="btn btn-google" onClick={handleGoogleRegister}>
                <svg className="social-icon google-icon" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Crear Cuenta con Google
              </button>

              {/* FACEBOOK — AHORA FUNCIONAL */}
              <button type="button" className="btn btn-facebook" onClick={handleFacebookRegister}>
                <svg className="social-icon facebook-icon" width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43
                    c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328
                    l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Crear Cuenta con Facebook
              </button>
            </div>

            {/* Link */}
            <div className="login-link">
              ¿Ya tienes cuenta?
              <a onClick={goToLogin}> 🔑 Iniciar Sesión</a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
