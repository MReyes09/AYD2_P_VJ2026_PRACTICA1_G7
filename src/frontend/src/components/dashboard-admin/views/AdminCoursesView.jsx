import React, { useState, useEffect } from "react";

import CourseEditModal from "../CourseEditModal"; // ajusta la ruta
import "../../../styles/DashboardTeacher/views/teacher-courses.css";
import { useToast } from "../../../context/ToastContext";

const AdminCoursesView = () => {
  const [cursos, setCursos] = useState([]);
  const [dificultades, setDificultades] = useState([]);
  const [tematicas, setTematicas] = useState([]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [form, setForm] = useState({
    nombreCurso: "",
    resumen: "",
    descripcion: "",
    anioProduccion: new Date().getFullYear(),
    idDificultad: 1,
    idTematica: 1,
    idPersona: parseInt(localStorage.getItem("userId")) || 1,
  });

  const { showToast } = useToast();

  const handleOpenEdit = (curso) => {
    setSelectedCourse(curso);
    setIsEditOpen(true);
  };

  // Opcional: si en algún momento quieres reflejar cambios de contenido en cursos
  const handleContentUpdated = (contenidoActualizado) => {
    console.log("Contenido actualizado", contenidoActualizado);
    // aquí podrías, por ejemplo, refrescar los cursos o marcar algo en estado
  };

  const handleContentDeleted = (idContenido) => {
    console.log("Contenido eliminado", idContenido);
  };

  useEffect(() => {
    // Cargar cursos
    fetch("http://localhost:5000/api/cursos")
      .then((r) => r.json())
      .then((data) => setCursos(data.data || []))
      .catch((err) => console.error("Error cargando cursos", err));

    // Cargar dificultades
    fetch("http://localhost:5000/dificultades")
      .then((r) => r.json())
      .then((data) => {
        setDificultades(data.data || data || []);
      })
      .catch((err) => console.error("Error cargando dificultades", err));

    // Cargar tematicas
    fetch("http://localhost:5000/tematicas")
      .then((r) => r.json())
      .then((data) => {
        setTematicas(data.data || data || []);
      })
      .catch((err) => console.error("Error cargando tematicas", err));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/admin/cursos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          anioProduccion: parseInt(form.anioProduccion),
          idDificultad: parseInt(form.idDificultad),
          idTematica: parseInt(form.idTematica),
          idPersona: parseInt(form.idPersona),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error creando curso");
      showToast("success", "Curso creado exitosamente");
      setCursos([...cursos, data]);
      setForm({
        nombreCurso: "",
        resumen: "",
        descripcion: "",
        anioProduccion: new Date().getFullYear(),
        idDificultad: 1,
        idTematica: 1,
        idPersona: parseInt(localStorage.getItem("userId")) || 1,
      });
    } catch (err) {
      showToast("error", "Error creando curso");
    }
  };

  return (
    <section className="teacher-courses">
      <div className="teacher-courses-list">
        <h2>Mis cursos</h2>
        <table className="courses-table">
          <thead>
            <tr>
              <th>Nombre del curso</th>
              <th>Año</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((c) => (
              <tr key={c.idCurso}>
                <td>{c.nombreCurso}</td>
                <td>{c.anioProduccion}</td>
                <td>
                  <button
                    className="btn-secondary btn-sm"
                    type="button"
                    onClick={() => handleOpenEdit(c)}
                  >
                    Editar contenido
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="teacher-courses-form">
        <h2>Crear nuevo curso</h2>
        <form onSubmit={handleSubmit}>
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
          <button className="btn-primary" type="submit">
            Guardar curso
          </button>
        </form>
      </div>

      <CourseEditModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedCourse(null);
        }}
        curso={selectedCourse}
        dificultades={dificultades}
        tematicas={tematicas}
        onContentUpdated={handleContentUpdated}
        onContentDeleted={handleContentDeleted}
      />
    </section>
  );
};

export default AdminCoursesView;