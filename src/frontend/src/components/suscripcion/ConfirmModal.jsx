// src/components/ConfirmModal.jsx
import React from "react";
import "../../styles/Suscripcion/suscripcion-modal.css"; // reutiliza estilos existentes

const ConfirmModal = ({ open, titulo, mensaje, onConfirm, onCancel, cargando }) => {
  if (!open) return null;

  return (
    <div className="suscripcion-modal-backdrop">
      <div className="suscripcion-modal">
        <h2>{titulo}</h2>
        <p>{mensaje}</p>

        <div className="suscripcion-modal-actions">
          <button
            className="btn-secondary"
            type="button"
            onClick={onCancel}
            disabled={cargando}
          >
            No, mantener
          </button>
          <button
            className="btn-primary btn-outline-danger"
            type="button"
            onClick={onConfirm}
            disabled={cargando}
          >
            {cargando ? "Cancelando..." : "Sí, cancelar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;