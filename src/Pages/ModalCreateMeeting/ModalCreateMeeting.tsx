import React, { useState } from 'react';
import '../../styles/modals.scss';
import { useToast } from '../../context/ToastContext';

interface ModalCreateMeetingProps {
  onClose: () => void;
  onCreate: (data: { title: string; description: string; date: string; time: string }) => void;
}

const ModalCreateMeeting: React.FC<ModalCreateMeetingProps> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) {
        showToast("Por favor completa los campos obligatorios", "error");
        return;
    }
    onCreate({ title, description, date, time });
    showToast("Reunión creada exitosamente", "success");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nueva Reunión</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="input-group">
            <label>Título de la reunión *</label>
            <input 
              type="text" 
              placeholder="Ej: Daily Standup"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="input-group">
            <label>Descripción (Opcional)</label>
            <input 
              type="text" 
              placeholder="Temas a tratar..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{display: 'flex', gap: 16}}>
            <div className="input-group">
                <label>Fecha *</label>
                <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                />
            </div>
            <div className="input-group">
                <label>Hora *</label>
                <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Crear Reunión</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateMeeting;
