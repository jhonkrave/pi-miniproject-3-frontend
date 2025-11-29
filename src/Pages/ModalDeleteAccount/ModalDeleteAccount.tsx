import React from 'react';
import '../../styles/modals.scss';

interface ModalDeleteAccountProps {
  onClose: () => void;
  onConfirm: () => void;
}

const ModalDeleteAccount: React.FC<ModalDeleteAccountProps> = ({ onClose, onConfirm }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{color: 'var(--error)'}}>¿Eliminar Cuenta?</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <p>
            Estás a punto de eliminar tu cuenta permanentemente. Esta acción no se puede deshacer y perderás acceso a todas tus reuniones e historial.
          </p>
          <p style={{fontWeight: 600}}>¿Estás seguro de continuar?</p>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirm}>Sí, eliminar cuenta</button>
        </div>
      </div>
    </div>
  );
};

export default ModalDeleteAccount;
