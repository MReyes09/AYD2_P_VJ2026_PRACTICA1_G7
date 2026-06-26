// src/components/suscripcion/SuscripcionModal.jsx
import React, { useEffect, useState } from "react";
import { listarTarifas, adquirirSuscripcion } from "../../controllers/suscripcion/suscripcionController";
import "../../styles/Suscripcion/suscripcion-modal.css";
import { useToast } from "../../context/ToastContext";

const SuscripcionModal = ({ open, onClose, idPersona, onSuscripcionExitosa }) => {
  const { showToast } = useToast();
  const [tarifas, setTarifas] = useState([]);
  const [selectedTarifa, setSelectedTarifa] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const cargarTarifas = async () => {
      try {
        setLoading(true);
        const data = await listarTarifas();
        setTarifas(data || []);
      } catch (err) {
        console.error("Error cargando tarifas:", err);
        showToast("error", "No se pudieron cargar las tarifas de suscripción.");
      } finally {
        setLoading(false);
      }
    };

    cargarTarifas();
  }, [open, showToast]);

  if (!open) return null;

  const handleConfirm = async () => {
    if (!selectedTarifa) {
      showToast("error", "Debes seleccionar un plan de suscripción.");
      return;
    }
    try {
      setLoading(true);
      const result = await adquirirSuscripcion(idPersona, selectedTarifa);
      console.log("Suscripción OK:", result);
      showToast("success", "Suscripción adquirida exitosamente.");
      onSuscripcionExitosa(result);
      onClose();
    } catch (err) {
      console.error("Error al adquirir suscripción:", err);
      const msg =
        err?.response?.data?.error ||
        "No se pudo adquirir la suscripción. Intenta de nuevo.";
      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="suscripcion-modal-backdrop">
      <div className="suscripcion-modal">
        <h2>Elige tu suscripción</h2>
        <p>Para completar tu registro necesitas seleccionar un plan activo.</p>

        {loading && <p>Cargando tarifas...</p>}

        {!loading && (
          <div className="suscripcion-tarifas">
            {tarifas.map((tarifa) => (
              <label
                key={tarifa.idTarifa}
                className={
                  selectedTarifa === tarifa.idTarifa
                    ? "suscripcion-tarifa suscripcion-tarifa--selected"
                    : "suscripcion-tarifa"
                }
              >
                <input
                  type="radio"
                  name="tarifa"
                  value={tarifa.idTarifa}
                  checked={selectedTarifa === tarifa.idTarifa}
                  onChange={() => setSelectedTarifa(tarifa.idTarifa)}
                />
                <div className="suscripcion-tarifa-info">
                  <span className="suscripcion-tarifa-tipo">
                    {tarifa.tipoTarifa}
                  </span>
                  <span className="suscripcion-tarifa-precio">
                    Q {tarifa.precio}
                  </span>
                </div>
              </label>
            ))}

            {tarifas.length === 0 && (
              <p>No hay tarifas disponibles en este momento.</p>
            )}
          </div>
        )}

        <div className="suscripcion-modal-actions">
          <button
            className="btn-secondary"
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="btn-primary"
            type="button"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Confirmar suscripción"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuscripcionModal;