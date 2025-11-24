// Pages/ModalEliminar.tsx
import React, { useState } from "react";
import "./ModalDeleteAccount.scss";

interface ModalDeleteAccountProps {
  onClose: () => void;
}

const ModalDeleteAccount: React.FC<ModalDeleteAccountProps> = ({ onClose }) => {
  const [texto, setTexto] = useState("");

  const handleDelete = () => {
    if (texto === "ELIMINAR") {
      alert("Cuenta eliminada con éxito (simulación)");
      onClose();
    } else {
      alert("Debes escribir ELIMINAR exactamente como aparece.");
    }
  };

  return (
    <div className="eliminar-modal-overlay">
      <div className="eliminar-modal">

        {/* Ícono y título */}
        <div className="eliminar-icon">⚠️</div>
        <h2 className="eliminar-title">ADVERTENCIA</h2>

        <p className="eliminar-subtitle">
          ¿Seguro que quieres eliminar tu cuenta?
        </p>

        <p className="eliminar-text">
          Tu información se eliminará permanentemente y no se podrá recuperar.  
          <br />
          Para confirmar, escribe la palabra{" "}
          <strong>ELIMINAR</strong> en mayúsculas.
        </p>

        {/* Campo de texto */}
        <label className="eliminar-label">
          <span className="eliminar-label-text">Escribe aquí: <strong>ELIMINAR</strong></span>
          <input
            type="text"
            className="eliminar-input"
            placeholder="ELIMINAR"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </label>

        {/* Botones */}
        <div className="eliminar-buttons">
          <button className="eliminar-btn cancelar" onClick={onClose}>
            CANCELAR
          </button>

          <button className="eliminar-btn eliminar" onClick={handleDelete}>
            ELIMINAR
          </button>
        </div>

      </div>
    </div>
  );
};

export default ModalDeleteAccount;
