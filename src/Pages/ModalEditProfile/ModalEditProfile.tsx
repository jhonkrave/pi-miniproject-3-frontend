import React, { useState } from 'react';
import '../../styles/modals.scss'; // Use shared styles

interface ModalEditProfileProps {
  onClose: () => void;
  initialData: {
    firstName: string;
    lastName: string;
    age?: number;
    email?: string;
  };
  onSave: (data: { firstName: string; lastName: string; age?: number; email?: string; password?: string }) => void;
}

const ModalEditProfile: React.FC<ModalEditProfileProps> = ({ onClose, initialData, onSave }) => {
  const [firstName, setFirstName] = useState(initialData.firstName);
  const [lastName, setLastName] = useState(initialData.lastName);
  const [age, setAge] = useState(initialData.age?.toString() || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ 
        firstName, 
        lastName, 
        age: age ? parseInt(age) : undefined,
        email,
        password: password || undefined // Only send if changed
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Perfil</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" autoComplete="off">
          <div style={{display: 'flex', gap: 16}}>
            <div className="input-group">
                <label>Nombre</label>
                <input 
                type="text" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)}
                />
            </div>
            <div className="input-group">
                <label>Apellido</label>
                <input 
                type="text" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}
                />
            </div>
          </div>

          <div className="input-group">
            <label>Edad</label>
            <input 
              type="number" 
              value={age} 
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Nueva Contraseña (Opcional)</label>
            <div style={{position: 'relative'}}>
                <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Dejar en blanco para mantener actual"
                autoComplete="new-password"
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

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditProfile;
