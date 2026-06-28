// src/components/dashboard-admin/modals/EliminarCatalogoModal.jsx
import { useState } from "react";
import "../../../styles/DashboardAdmin/modals/Eliminar-catalogo-modal.css";
import { useToast } from "../../../context/ToastContext";

/**
 * Props:
 *  - visible    : boolean
 *  - onClose    : () => void
 *  - onSuccess  : () => void — recarga la lista tras eliminar
 *  - tipo       : "tipo" | "tematica" | "dificultad"
 *  - items      : array — lista actual
 *  - eliminarFn : async (id) => any — función DELETE de tu controller
 */

const CONFIG = {
    tipo: {
        titulo: "Eliminar tipo de contenido",
        labelSelect: "Selecciona el tipo a eliminar",
        getId: (item) => item.idTipoContenido,
        getNombre: (item) => item.tipoContenido,
    },
    tematica: {
        titulo: "Eliminar categoría temática",
        labelSelect: "Selecciona la categoría a eliminar",
        getId: (item) => item.idTematica,
        getNombre: (item) => item.tipoTematica,
    },
    dificultad: {
        titulo: "Eliminar nivel de dificultad",
        labelSelect: "Selecciona el nivel a eliminar",
        getId: (item) => item.idDificultad,
        getNombre: (item) => item.tipoDificultad,
    },
};

const EliminarCatalogoModal = ({ visible, onClose, onSuccess, tipo, items = [], eliminarFn }) => {
    const { showToast } = useToast();
    const [selectedId, setSelectedId] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");
    const [confirmando, setConfirmando] = useState(false);

    const config = CONFIG[tipo] ?? CONFIG.tipo;

    if (!visible) return null;

    const itemSeleccionado = items.find((i) => String(config.getId(i)) === String(selectedId));

    const handleSeleccionar = (e) => {
        setSelectedId(e.target.value);
        setError("");
        setConfirmando(false);
    };

    const handleEliminar = async () => {
        if (!selectedId) {
            setError("Debes seleccionar un elemento.");
            return;
        }

        if (!confirmando) {
            setConfirmando(true);
            return;
        }

        setCargando(true);
        setError("");

        try {
            await eliminarFn(selectedId);
            showToast("Elemento eliminado exitosamente.", "success");
            handleClose();
            onSuccess();
        } catch (err) {
            const mensaje = err?.response?.data?.error;
            if (err?.response?.status === 400 && mensaje) {
                showToast(mensaje, "error");
            } else if (err?.response?.status === 404) {
                showToast("El elemento no fue encontrado.", "error");
            } else {
                showToast("Ocurrió un error al eliminar. Intenta de nuevo.", "error");
            }
            setConfirmando(false);
        } finally {
            setCargando(false);
        }
    };

    const handleClose = () => {
        setSelectedId("");
        setError("");
        setConfirmando(false);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>{config.titulo}</h2>
                    <button className="modal-close" onClick={handleClose}>✕</button>
                </header>

                <div className="modal-body">
                    <label className="modal-label">{config.labelSelect}</label>
                    <select
                        className={`modal-input ${error && !selectedId ? "modal-input--error" : ""}`}
                        value={selectedId}
                        onChange={handleSeleccionar}
                        disabled={cargando}
                    >
                        <option value="">-- Seleccionar --</option>
                        {items.map((item) => (
                            <option key={config.getId(item)} value={config.getId(item)}>
                                {config.getNombre(item)}
                            </option>
                        ))}
                    </select>

                    {/* Confirmación antes de eliminar */}
                    {confirmando && itemSeleccionado && (
                        <div className="modal-warning">
                            <span className="modal-warning-icon">⚠️</span>
                            <p>
                                ¿Estás seguro de eliminar{" "}
                                <strong>"{config.getNombre(itemSeleccionado)}"</strong>?
                                Esta acción no se puede deshacer.
                            </p>
                        </div>
                    )}
                </div>

                <footer className="modal-footer">
                    <button className="btn-modal-cancel" onClick={handleClose} disabled={cargando}>
                        Cancelar
                    </button>
                    <button
                        className={`btn-modal-delete ${confirmando ? "btn-modal-delete--confirm" : ""}`}
                        onClick={handleEliminar}
                        disabled={cargando || !selectedId}
                    >
                        {cargando ? "Eliminando..." : confirmando ? "Confirmar eliminación" : "Eliminar"}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default EliminarCatalogoModal;