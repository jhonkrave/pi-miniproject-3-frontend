import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../../lib/authService';
import { useToast } from '../../context/ToastContext';
import './AuthAction.scss';

const AuthAction: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Procesando tu solicitud...');

  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    const handleAction = async () => {
      if (!oobCode) {
        setStatus('error');
        setMessage('Código de acción no válido o faltante.');
        return;
      }

      // Optimización: Redirigir inmediatamente si es restablecimiento de contraseña
      if (mode === 'resetPassword') {
        navigate(`/reset-password?oobCode=${oobCode}`);
        return;
      }

      try {
        // Verify what kind of action this is
        const info = await authService.checkActionCode(oobCode);
        
        switch (mode) {
          case 'verifyEmail':
            // Apply the code to verify/update the email
            await authService.applyActionCode(oobCode);
            setStatus('success');
            setMessage(
                info['data']['previousEmail'] 
                ? `Tu correo ha sido actualizado correctamente a ${info['data']['email']}.` 
                : 'Tu correo ha sido verificado correctamente.'
            );
            showToast("Correo verificado exitosamente", "success");
            break;

          case 'recoverEmail':
            // This happens if someone changed the email and the original owner clicked "revoke"
            await authService.applyActionCode(oobCode);
            setStatus('success');
            setMessage('La acción de recuperación de correo se ha completado. Tu cuenta ha sido restaurada al correo original.');
            break;

          default:
            setStatus('error');
            setMessage('Acción desconocida o no soportada.');
        }
      } catch (error) {
        console.error("Action code error:", error);
        setStatus('error');
        setMessage('El código es inválido o ha expirado. Por favor solicita uno nuevo.');
      }
    };

    handleAction();
  }, [oobCode, mode, navigate, showToast]);

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
            <h1>
                {status === 'loading' && 'Procesando...'}
                {status === 'success' && '¡Listo!'}
                {status === 'error' && 'Error'}
            </h1>
        </header>

        <div className="auth-content" style={{ textAlign: 'center', padding: '20px 0' }}>
            {status === 'loading' && <div className="spinner"></div>}
            
            {status === 'success' && (
                <div className="success-icon-large">
                    <svg viewBox="0 0 24 24" width="64" height="64" stroke="var(--success)" fill="none" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
            )}

            {status === 'error' && (
                <div className="error-icon-large">
                    <svg viewBox="0 0 24 24" width="64" height="64" stroke="var(--error)" fill="none" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>
            )}

            <p className="status-message" style={{ marginTop: '16px', fontSize: '1.1rem' }}>
                {message}
            </p>
        </div>

        <div className="auth-footer-link">
            <button 
                className="btn btn-primary" 
                onClick={() => navigate('/login')}
                style={{ width: '100%', marginTop: '20px' }}
            >
                Volver al Inicio de Sesión
            </button>
        </div>
      </div>
    </div>
  );
};

export default AuthAction;

