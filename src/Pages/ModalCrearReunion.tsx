// Pages/ModalCrearReunion.tsx
import React, { useState } from "react";
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
  const [titulo, setTitulo] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onCreate({
      titulo,
      fecha,
      hora,
      descripcion,
    });

    // Opcional: limpiar campos
    setTitulo("");
    setFecha("");
    setHora("");
    setDescripcion("");

    onClose();
  };

  return (
    <div className="crear-modal-overlay">
      <div className="crear-modal">
        <h2 className="crear-modal__title">Crear reunión</h2>

        <form className="crear-modal__form" onSubmit={handleSubmit}>
          <label className="crear-modal__label">
            Nombre de la reunión
            <input
              type="text"
              className="crear-modal__input"
              placeholder="Ej: Reunión de seguimiento"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </label>

          <div className="crear-modal__row">
            <label className="crear-modal__label">
              Fecha
              <input
                type="date"
                className="crear-modal__input"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </label>

            <label className="crear-modal__label">
              Hora
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
            Descripción
            <textarea
              className="crear-modal__textarea"
              rows={3}
              placeholder="Añade una breve descripción"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </label>

          <div className="crear-modal__buttons">
            <button
              type="button"
              className="crear-modal__btn crear-modal__btn--secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="crear-modal__btn crear-modal__btn--primary"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearReunion;
