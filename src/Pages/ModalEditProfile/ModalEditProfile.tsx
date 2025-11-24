// Pages/ModalEditarPerfil.tsx
import React, { useState } from "react";
import "./ModalEditProfile.scss";

interface ModalEditProfileProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const ModalEditProfile: React.FC<ModalEditProfileProps> = ({ onClose, onSave }) => {
  const [nombre, setNombre] = useState("Ana María");
  const [apellido, setApellido] = useState("García López");
  const [correo, setCorreo] = useState("anagarcia12@gmail.com");
  const [edad, setEdad] = useState("30");
  const [password, setPassword] = useState("•••••••");

  const handleSave = () => {
    const data = { nombre, apellido, correo, edad, password };
    onSave(data);
    onClose();
  };

  return (
    <div className="editar-modal-overlay">
      <div className="editar-modal">

        <h2 className="editar-title">Editar Datos</h2>
        <p className="editar-subtitle">Modifica tu información personal</p>

        <div className="editar-form">

          {/* Nombre */}
          <label className="editar-label">
            <span className="editar-label-text">👤 Nombre</span>
            <input
              type="text"
              className="editar-input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </label>

          {/* Apellido */}
          <label className="editar-label">
            <span className="editar-label-text">👤 Apellido</span>
            <input
              type="text"
              className="editar-input"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </label>

          {/* Correo */}
          <label className="editar-label">
            <span className="editar-label-text">📧 Correo Electrónico</span>
            <input
              type="email"
              className="editar-input"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </label>

          {/* Edad */}
          <label className="editar-label">
            <span className="editar-label-text">🎂 Edad</span>
            <input
              type="number"
              className="editar-input"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
            />
          </label>

          {/* Contraseña */}
          <label className="editar-label">
            <span className="editar-label-text">🔐 Contraseña</span>
            <input
              type="password"
              className="editar-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>

        <div className="editar-buttons">
          <button className="editar-btn cancelar" onClick={onClose}>
            CANCELAR
          </button>

          <button className="editar-btn guardar" onClick={handleSave}>
            GUARDAR
          </button>
        </div>

      </div>
    </div>
  );
};

export default ModalEditProfile;

