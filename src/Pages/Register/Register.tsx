import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../lib/authService';
import { api } from '../../lib/api';
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return password.length >= 8 && hasUpperCase && hasLowerCase && hasNumber;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("La contraseña no cumple con los requisitos de seguridad.");
      return;
    }

    if (parseInt(formData.age) < 13) {
      setError("Debes tener al menos 13 años.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create Firebase Auth User
      const user = await authService.registerWithEmail(formData.email, formData.password);
      if (user) {
        // 2. Get Token
        const token = await user.getIdToken();
        
        // 3. Create Backend Profile
        // Use new /auth/signup endpoint implied by previous fixes
        await api.signup({
          firstName: formData.firstName,
          lastName: formData.lastName,
          age: parseInt(formData.age),
          email: formData.email,
          password: formData.password
        });

        // 4. Create Session (Optional)
        try { await api.createSession(token); } catch (e) { console.warn(e); }
        
        navigate("/home");
      }
    } catch (err: any) {
      console.error("Registration Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Este correo electrónico ya está registrado.");
      } else {
        setError("Error al crear la cuenta. " + (err.message || ""));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialRegister = async (provider: 'google' | 'facebook') => {
    setError(null);
    try {
      const user = provider === 'google' 
        ? await authService.loginWithGoogle()
        : await authService.loginWithFacebook();
        
      if (user) navigate("/home");
    } catch (err: any) {
       console.error(`Error ${provider}:`, err);
       if (err.code !== "auth/popup-closed-by-user") {
         setError(`No se pudo registrar con ${provider}.`);
       }
    }
  };

  const goToLogin = () => {
    if (onGoToLogin) onGoToLogin();
    else navigate('/login');
  };

  return (
    <div className="register-wrapper">
      <div className="register-card fade-in">
        
        <header className="register-header">
          <img 
            src="/Imagenes/logo2.png" 
            alt="Logo" 
            className="logo-img"
            onError={(e) => e.currentTarget.style.display='none'}
          />
          <h1>Crear Cuenta</h1>
          <p>Únete a TeamLink gratis hoy mismo</p>
        </header>

        {error && (
          <div className="error-banner">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          
          <div className="row-fields">
            <div className="input-group">
                <label>Nombre</label>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    required
                />
            </div>
            <div className="input-group">
                <label>Apellido</label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Tu apellido"
                    required
                />
            </div>
          </div>

          <div className="input-group">
            <label>Correo Electrónico</label>
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@correo.com"
                required
            />
          </div>

          <div className="input-group">
            <label>Edad</label>
            <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Ej: 25"
                min="13"
                required
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <div style={{position:'relative'}}>
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', opacity:0.6}}
                >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
            </div>
            <p className="password-requirements">Mínimo 8 caracteres, mayúscula, minúscula y número.</p>
          </div>

          <div className="input-group">
            <label>Confirmar Contraseña</label>
            <div style={{position:'relative'}}>
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', opacity:0.6}}
                >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{marginTop: 8}}>
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>

        </form>

        <div className="divider" style={{display:'flex', alignItems:'center', color:'var(--text-tertiary)', fontSize:14, margin:'10px 0'}}>
            <span style={{flex:1, borderBottom:'1px solid var(--border-color)'}}></span>
            <span style={{padding:'0 10px'}}>o registrarse con</span>
            <span style={{flex:1, borderBottom:'1px solid var(--border-color)'}}></span>
        </div>

        <div className="social-buttons" style={{display:'flex', gap:12}}>
          <button type="button" className="btn btn-secondary" onClick={() => handleSocialRegister('google')} style={{flex:1}}>
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
            Google
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => handleSocialRegister('facebook')} style={{flex:1}}>
             <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
             Facebook
          </button>
        </div>

        <div className="register-footer">
          ¿Ya tienes cuenta?
          <a onClick={goToLogin}>Iniciar Sesión</a>
        </div>

      </div>
    </div>
  );
};

export default Register;
