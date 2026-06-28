// src/components/DashboardTeacher/CourseEditModal.jsx
import React, { useState, useEffect } from "react";
import { useToast } from "../../context/ToastContext";
import "../../styles/DashboardTeacher/views/teacher-courses.css";

const CourseEditModal = ({
  isOpen,
  onClose,
  cursos,
  dificultades,
  tematicas,
  onCourseUpdated,
  onCourseDeleted,
}) => {
  const { showToast } = useToast();
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState({
    idCurso: null,
    nombreCurso: "",
    resumen: "",
    descripcion: "",
    anioProduccion: new Date().getFullYear(),
    idDificultad: 1,
    idTematica: 1,
  });

  useEffect(() => {
    if (!isOpen) {
      setSelectedId("");
      setForm({
        idCurso: null,
        nombreCurso: "",
        resumen: "",
        descripcion: "",
        anioProduccion: new Date().getFullYear(),
        idDificultad: 1,
        idTematica: 1,
      });
    }
  }, [isOpen]);

  const handleSelectCourse = (e) => {
    const id = parseInt(e.target.value);
    setSelectedId(id);
    const curso = cursos.find((c) => c.idCurso === id);
    if (curso) {
      setForm({
        idCurso: curso.idCurso,
        nombreCurso: curso.nombreCurso,
        resumen: curso.resumen || "",
        descripcion: curso.descripcion || "",
        anioProduccion: curso.anioProduccion,
        idDificultad: curso.idDificultad,
        idTematica: curso.idTematica,
      });
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.idCurso) return;

    try {
      // TODO: reemplazar cuando tengas endpoint real
      // const res = await fetch(`http://localhost:5000/admin/cursos/${form.idCurso}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     ...form,
      //     anioProduccion: parseInt(form.anioProduccion),
      //     idDificultad: parseInt(form.idDificultad),
      //     idTematica: parseInt(form.idTematica),
      //   }),
      // });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data.error || "Error actualizando curso");

      // Por ahora, simulamos update en frontend
      onCourseUpdated({
        ...form,
        anioProduccion: parseInt(form.anioProduccion),
        idDificultad: parseInt(form.idDificultad),
        idTematica: parseInt(form.idTematica),
      });
      showToast("success", "Curso actualizado");
      onClose();
    } catch (err) {
      showToast("error", "Error actualizando curso");
    }
  };

  const handleDelete = async () => {
    if (!form.idCurso) return;
    if (!window.confirm("¿Seguro que deseas eliminar este curso?")) return;

    try {
      // TODO: reemplazar cuando tengas endpoint real
      // const res = await fetch(`http://localhost:5000/admin/cursos/${form.idCurso}`, {
      //   method: "DELETE",
      // });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data.error || "Error eliminando curso");

      onCourseDeleted(form.idCurso);
      showToast("success", "Curso eliminado");
      onClose();
    } catch (err) {
      showToast("error", "Error eliminando curso");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content course-edit-modal">
        <h2>Editar / eliminar curso</h2>

        <label>
          Selecciona un curso
          <select value={selectedId || ""} onChange={handleSelectCourse}>
            <option value="">-- Selecciona --</option>
            {cursos.map((c) => (
              <option key={c.idCurso} value={c.idCurso}>
                {c.nombreCurso} ({c.anioProduccion})
              </option>
            ))}
          </select>
        </label>

        {form.idCurso && (
          <form onSubmit={handleUpdate} className="course-edit-form">
            <label>
              Nombre del curso
              <input
                name="nombreCurso"
                value={form.nombreCurso}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Resumen
              <input
                name="resumen"
                value={form.resumen}
                onChange={handleChange}
              />
            </label>
            <label>
              Descripción
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                required
              />
            </label>
            <div className="form-row">
              <label>
                Año
                <input
                  type="number"
                  name="anioProduccion"
                  value={form.anioProduccion}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Dificultad
                <select
                  name="idDificultad"
                  value={form.idDificultad}
                  onChange={handleChange}
                >
                  {dificultades.map((d) => (
                    <option key={d.idDificultad} value={d.idDificultad}>
                      {d.tipoDificultad}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Temática
                <select
                  name="idTematica"
                  value={form.idTematica}
                  onChange={handleChange}
                >
                  {tematicas.map((t) => (
                    <option key={t.idTematica} value={t.idTematica}>
                      {t.tipoTematica}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="modal-actions">
              <button className="btn-primary" type="submit">
                Actualizar
              </button>
              <button
                className="btn-danger"
                type="button"
                onClick={handleDelete}
              >
                Eliminar
              </button>
              <button
                className="btn-secondary"
                type="button"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          </form>
        )}

        {!form.idCurso && (
          <p>Selecciona un curso para poder editarlo o eliminarlo.</p>
        )}
      </div>
    </div>
  );
};

export default CourseEditModal;