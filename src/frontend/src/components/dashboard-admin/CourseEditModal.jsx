// src/components/DashboardTeacher/CourseEditModal.jsx
import React, { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import "../../styles/DashboardTeacher/views/teacher-courses.css";

const CourseEditModal = ({
  isOpen,
  onClose,
  curso,           // curso seleccionado
  dificultades,    // actualmente no se usan, pero los puedes usar luego
  tematicas,
  onContentUpdated,
  onContentDeleted,
}) => {
  const { showToast } = useToast();

  const [contenidos, setContenidos] = useState([]);
  const [selectedContentId, setSelectedContentId] = useState("");
  const [tipoContenidos, setTipoContenidos] = useState([]);

  const [form, setForm] = useState({
    idContenido: null,
    titulo: "",
    pathContenido: "",
    descripcion: "",
    idTipoContenido: "",
  });

  // Reset al cerrar
  useEffect(() => {
    if (!isOpen) {
      setContenidos([]);
      setSelectedContentId("");
      setForm({
        idContenido: null,
        titulo: "",
        pathContenido: "",
        descripcion: "",
        idTipoContenido: "",
      });
    }
  }, [isOpen]);

  // Cargar tipos de contenido cuando se abre el modal
  useEffect(() => {
    if (!isOpen) return;
    fetch("http://localhost:5000/tipos-contenido")
      .then((r) => r.json())
      .then((data) => {
        setTipoContenidos(data.data || data || []);
      })
      .catch((err) => {
        console.error("Error cargando tipos de contenido", err);
        showToast("error", "Error cargando tipos de contenido");
      });
  }, [isOpen, showToast]);

  // Cargar contenidos del curso seleccionado cuando se abre
  useEffect(() => {
    if (!isOpen || !curso) return;

    fetch(`http://localhost:5000/admin/cursos/${curso.idCurso}/contenido`)
      .then((r) => r.json())
      .then((data) => {
        setContenidos(data.data || data || []);
      })
      .catch((err) => {
        console.error("Error cargando contenido del curso", err);
        showToast("error", "Error cargando contenido del curso");
      });
  }, [isOpen, curso, showToast]);

  const handleSelectContent = (e) => {
    const id = parseInt(e.target.value);
    setSelectedContentId(id || "");
    const contenido = contenidos.find((c) => c.idContenido === id);
    if (contenido) {
      setForm({
        idContenido: contenido.idContenido,
        titulo: contenido.titulo || "",
        pathContenido: contenido.pathContenido || "",
        descripcion: contenido.descripcion || "",
        idTipoContenido: contenido.idTipoContenido || "",
      });
    } else {
      setForm({
        idContenido: null,
        titulo: "",
        pathContenido: "",
        descripcion: "",
        idTipoContenido: "",
      });
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.idContenido) return;

    try {
      const res = await fetch(
        `http://localhost:5000/admin/cursos/contenido/${form.idContenido}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titulo: form.titulo,
            pathContenido: form.pathContenido,
            descripcion: form.descripcion,
            idTipoContenido: form.idTipoContenido
              ? parseInt(form.idTipoContenido)
              : undefined,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error actualizando contenido");

      setContenidos((prev) =>
        prev.map((c) =>
          c.idContenido === form.idContenido ? { ...c, ...data } : c
        )
      );
      onContentUpdated && onContentUpdated(data);
      showToast("success", "Contenido actualizado exitosamente");
      onClose();
    } catch (err) {
      console.error(err);
      showToast("error", "Error actualizando contenido");
    }
  };

  const handleDelete = async () => {
    if (!form.idContenido) return;
    if (!window.confirm("¿Seguro que deseas eliminar este contenido?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/admin/cursos/contenido/${form.idContenido}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error eliminando contenido");

      setContenidos((prev) =>
        prev.filter((c) => c.idContenido !== form.idContenido)
      );
      onContentDeleted && onContentDeleted(form.idContenido);

      showToast("success", "Contenido eliminado exitosamente");
      onClose();
    } catch (err) {
      console.error(err);
      showToast("error", "Error eliminando contenido");
    }
  };

  if (!isOpen || !curso) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content course-edit-modal">
        <div className="modal-header">
          <h2>
            Contenido de: {curso.nombreCurso} ({curso.anioProduccion})
          </h2>
          <button
            className="btn-secondary btn-sm"
            type="button"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>

        <label>
          Contenidos del curso
          <select
            value={selectedContentId || ""}
            onChange={handleSelectContent}
          >
            <option value="">-- Selecciona contenido --</option>
            {contenidos.map((ct) => (
              <option key={ct.idContenido} value={ct.idContenido}>
                {ct.titulo}
              </option>
            ))}
          </select>
        </label>

        {form.idContenido && (
          <form onSubmit={handleUpdate} className="course-edit-form">
            <label>
              Título
              <input
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              URL / path del contenido
              <input
                name="pathContenido"
                value={form.pathContenido}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Descripción
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
              />
            </label>
            <div className="form-row">
              <label>
                Tipo de contenido
                <select
                  name="idTipoContenido"
                  value={form.idTipoContenido || ""}
                  onChange={handleChange}
                >
                  <option value="">Sin tipo</option>
                  {tipoContenidos.map((t) => (
                    <option key={t.idTipoContenido} value={t.idTipoContenido}>
                      {t.nombreTipo || t.tipoContenido || t.descripcion}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="modal-actions">
              <button className="btn-primary" type="submit">
                Actualizar contenido
              </button>
              <button
                className="btn-warning"
                type="button"
                onClick={handleDelete}
              >
                Eliminar contenido
              </button>
            </div>
          </form>
        )}

        {!form.idContenido && (
          <p>Selecciona un contenido para poder editarlo o eliminarlo.</p>
        )}
      </div>
    </div>
  );
};

export default CourseEditModal;