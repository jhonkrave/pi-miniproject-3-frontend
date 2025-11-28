import React, { useState } from 'react';
import '../../styles/modals.scss';

interface ModalJoinMeetingProps {
  onClose: () => void;
  onJoin: (id: string) => void;
}

const ModalJoinMeeting: React.FC<ModalJoinMeetingProps> = ({ onClose, onJoin }) => {
  const [meetingId, setMeetingId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingId.trim()) {
      onJoin(meetingId);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{maxWidth: 400}}>
        <div className="modal-header">
          <h2>Unirse a Reunión</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <p style={{color: 'var(--text-secondary)', fontSize: 14}}>
            Ingresa el código o ID de la reunión para participar.
          </p>
          
          <div className="input-group">
            <label>ID de Reunión</label>
            <input 
              type="text" 
              placeholder="Ej: 123-456-789"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              autoFocus
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={!meetingId.trim()}>Unirse</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalJoinMeeting;

