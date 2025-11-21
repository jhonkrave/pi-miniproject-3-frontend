import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ModalCrearReunion.scss";

export interface ReunionData {
  titulo: string;
  fecha: string;
  hora: string;
  descripcion: string;
}

interface ModalCrearReunionProps {
  onClose: () => void;
  onCreate: (data: ReunionData) => void;
}

const ModalCrearReunion: React.FC<ModalCrearReunionProps> = ({
  onClose,
  onCreate,
}) => {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reunionData = {
      titulo,
      fecha,
      hora,
      descripcion,
    };

    onCreate(reunionData);
    
    // Navegar a la pantalla de HostMeeting
    navigate("/host-meeting");
    
    onClose();
  };

  return (
    <div className="crear-modal-overlay">
      <div className="crear-modal">
        <h2 className="crear-modal__title">CREAR REUNIÓN</h2>
        <p className="crear-modal__subtitle">
          Complete el formulario para crear una nueva Reunión
        </p>

        <form className="crear-modal__form" onSubmit={handleSubmit}>
          <label className="crear-modal__label">
            <span className="crear-modal__label-text">📋 Título de la reunión:</span>
            <input
              type="text"
              className="crear-modal__input"
              placeholder="Escriba el título de la reunión"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </label>

          <div className="crear-modal__row">
            <label className="crear-modal__label">
              <span className="crear-modal__label-text">📅 Fecha de inicio:</span>
              <input
                type="date"
                className="crear-modal__input"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </label>

            <label className="crear-modal__label">
              <span className="crear-modal__label-text">⏰ Hora de inicio:</span>
              <input
                type="time"
                className="crear-modal__input"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                required
              />
            </label>
          </div>

          <label className="crear-modal__label">
            <span className="crear-modal__label-text">📝 Descripción:</span>
            <textarea
              className="crear-modal__textarea"
              rows={3}
              placeholder="¡Descríbela!"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </label>

          <div className="crear-modal__divider"></div>

          <div className="crear-modal__buttons">
            <button
              type="button"
              className="crear-modal__btn crear-modal__btn--cancel"
              onClick={onClose}
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="crear-modal__btn crear-modal__btn--create"
            >
              CREAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearReunion;