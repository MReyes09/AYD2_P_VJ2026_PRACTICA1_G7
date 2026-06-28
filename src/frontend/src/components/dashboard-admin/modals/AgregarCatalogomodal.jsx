// src/components/dashboard-admin/modals/AgregarCatalogoModal.jsx
import { useState } from "react";

/**
 * Props:
 *  - visible   : boolean — controla si el modal se muestra
 *  - onClose   : () => void — cierra el modal
 *  - onSuccess : () => void — se llama tras crear exitosamente (para recargar la lista)
 *  - tipo      : "tipo" | "tematica" | "dificultad" — determina título, label y función
 *  - crearFn   : async (nombre: string) => any — función de tu controller que hace el POST
 */

const CONFIG = {
    tipo: {
        titulo: "Agregar tipo de contenido",
        label: "Nombre del tipo",
        placeholder: "Ej: Taller en vivo",
    },
    tematica: {
        titulo: "Agregar categoría temática",
        label: "Nombre de la categoría",
        placeholder: "Ej: Ciberseguridad",
    },
    dificultad: {
        titulo: "Agregar nivel de dificultad",
        label: "Nombre del nivel",
        placeholder: "Ej: Experto",
    },
};

const AgregarCatalogoModal = ({ visible, onClose, onSuccess, tipo, crearFn }) => {
    const [nombre, setNombre] = useState("");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState("");

    if (!visible) return null;

    const config = CONFIG[tipo] ?? CONFIG.tipo;

    const handleSubmit = async () => {
        if (!nombre.trim()) {
            setError("Este campo es requerido.");
            return;
        }

        setCargando(true);
        setError("");

        try {
            await crearFn(nombre.trim());
            setNombre("");
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Error al crear:", err);
            setError("Ocurrió un error al guardar. Intenta de nuevo.");
        } finally {
            setCargando(false);
        }
    };

    const handleClose = () => {
        setNombre("");
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
                    <label className="modal-label">{config.label}</label>
                    <input
                        className={`modal-input ${error ? "modal-input--error" : ""}`}
                        type="text"
                        placeholder={config.placeholder}
                        value={nombre}
                        onChange={(e) => {
                            setNombre(e.target.value);
                            if (error) setError("");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        autoFocus
                    />
                    {error && <span className="modal-error">{error}</span>}
                </div>

                <footer className="modal-footer">
                    <button className="btn-modal-cancel" onClick={handleClose} disabled={cargando}>
                        Cancelar
                    </button>
                    <button className="btn-modal-confirm" onClick={handleSubmit} disabled={cargando}>
                        {cargando ? "Guardando..." : "Agregar"}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default AgregarCatalogoModal;