// src/components/dashboard-admin/modals/EditarCatalogoModal.jsx
import { useState, useEffect } from "react";
import "../../../styles/DashboardAdmin/modals/Editar-catalogo-modal.css";

/**
 * Props:
 *  - visible    : boolean
 *  - onClose    : () => void
 *  - onSuccess  : () => void — recarga la lista tras editar
 *  - tipo       : "tipo" | "tematica" | "dificultad"
 *  - items      : array — lista actual (tipos, tematicas o dificultades)
 *  - editarFn   : async (id, nuevoNombre) => any — función PUT de tu controller
 */

const CONFIG = {
    tipo: {
        titulo: "Editar tipo de contenido",
        labelSelect: "Selecciona el tipo a editar",
        labelInput: "Nuevo nombre",
        placeholder: "Ej: Taller en vivo",
        getId: (item) => item.idTipoContenido,
        getNombre: (item) => item.tipoContenido,
    },
    tematica: {
        titulo: "Editar categoría temática",
        labelSelect: "Selecciona la categoría a editar",
        labelInput: "Nuevo nombre",
        placeholder: "Ej: Diseño Gráfico",
        getId: (item) => item.idTematica,
        getNombre: (item) => item.tipoTematica,
    },
    dificultad: {
        titulo: "Editar nivel de dificultad",
        labelSelect: "Selecciona el nivel a editar",
        labelInput: "Nuevo nombre",
        placeholder: "Ej: Básico",
        getId: (item) => item.idDificultad,
        getNombre: (item) => item.tipoDificultad,
    },
};

const EditarCatalogoModal = ({ visible, onClose, onSuccess, tipo, items = [], editarFn }) => {
    const [selectedId, setSelectedId] = useState("");
    const [nuevoNombre, setNuevoNombre] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    const config = CONFIG[tipo] ?? CONFIG.tipo;

    // Al seleccionar un item, prellenar el input con el nombre actual
    useEffect(() => {
        if (!selectedId) {
            setNuevoNombre("");
            return;
        }
        const item = items.find((i) => String(config.getId(i)) === String(selectedId));
        if (item) setNuevoNombre(config.getNombre(item));
    }, [selectedId]);

    if (!visible) return null;

    const handleSubmit = async () => {
        if (!selectedId) {
            setError("Debes seleccionar un elemento.");
            return;
        }
        if (!nuevoNombre.trim()) {
            setError("El nombre no puede estar vacío.");
            return;
        }

        setCargando(true);
        setError("");

        try {
            await editarFn(selectedId, nuevoNombre.trim());
            handleClose();
            onSuccess();
        } catch (err) {
            console.error("Error al editar:", err);
            setError("Ocurrió un error al guardar. Intenta de nuevo.");
        } finally {
            setCargando(false);
        }
    };

    const handleClose = () => {
        setSelectedId("");
        setNuevoNombre("");
        setError("");
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
                    {/* Selector del item a editar */}
                    <label className="modal-label">{config.labelSelect}</label>
                    <select
                        className={`modal-input ${error && !selectedId ? "modal-input--error" : ""}`}
                        value={selectedId}
                        onChange={(e) => {
                            setSelectedId(e.target.value);
                            if (error) setError("");
                        }}
                    >
                        <option value="">-- Seleccionar --</option>
                        {items.map((item) => (
                            <option key={config.getId(item)} value={config.getId(item)}>
                                {config.getNombre(item)}
                            </option>
                        ))}
                    </select>

                    {/* Input con el nombre actual prellenado */}
                    <label className="modal-label" style={{ marginTop: "0.8rem" }}>
                        {config.labelInput}
                    </label>
                    <input
                        className={`modal-input ${error && selectedId && !nuevoNombre.trim() ? "modal-input--error" : ""}`}
                        type="text"
                        placeholder={config.placeholder}
                        value={nuevoNombre}
                        onChange={(e) => {
                            setNuevoNombre(e.target.value);
                            if (error) setError("");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        disabled={!selectedId}
                    />

                    {error && <span className="modal-error">{error}</span>}
                </div>

                <footer className="modal-footer">
                    <button className="btn-modal-cancel" onClick={handleClose} disabled={cargando}>
                        Cancelar
                    </button>
                    <button className="btn-modal-confirm" onClick={handleSubmit} disabled={cargando || !selectedId}>
                        {cargando ? "Guardando..." : "Guardar cambios"}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default EditarCatalogoModal;