import React, { useState, useEffect } from "react";
import "../../../styles/DashboardTeacher/views/teacher-courses.css";

const AdminCoursesView = () => {
  const [cursos, setCursos] = useState([]);
  const [form, setForm] = useState({
    nombreCurso: "",
    resumen: "",
    descripcion: "",
    anioProduccion: 2025,
    idDificultad: 1,
    idTematica: 1,
    idPersona: parseInt(localStorage.getItem("idPersona")) || 1,
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/cursos")
      .then((r) => r.json())
      .then((data) => setCursos(data.data || []));
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
      if (!res.ok) throw new Error(data.error);
      alert("Curso creado exitosamente");
      setCursos([...cursos, data]);
      setForm({ nombreCurso: "", resumen: "", descripcion: "", anioProduccion: 2025, idDificultad: 1, idTematica: 1, idPersona: parseInt(localStorage.getItem("idPersona")) || 1 });
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <section className="teacher-courses">
      <div className="teacher-courses-list">
        <h2>Mis cursos</h2>
        <ul>
          {cursos.map((c) => (
            <li key={c.idCurso}>
              <span>{c.nombreCurso}</span>
              <small>{c.anioProduccion}</small>
            </li>
          ))}
        </ul>
      </div>

      <div className="teacher-courses-form">
        <h2>Crear nuevo curso</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre del curso
            <input name="nombreCurso" value={form.nombreCurso} onChange={handleChange} required />
          </label>
          <label>Resumen
            <input name="resumen" value={form.resumen} onChange={handleChange} />
          </label>
          <label>Descripción
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required />
          </label>
          <div className="form-row">
            <label>Año
              <input type="number" name="anioProduccion" value={form.anioProduccion} onChange={handleChange} required />
            </label>
            <label>Dificultad
              <select name="idDificultad" value={form.idDificultad} onChange={handleChange}>
                <option value={1}>Principiante</option>
                <option value={2}>Intermedio</option>
                <option value={3}>Avanzado</option>
              </select>
            </label>
            <label>Temática
              <select name="idTematica" value={form.idTematica} onChange={handleChange}>
                <option value={1}>Programación</option>
                <option value={2}>Diseño</option>
                <option value={3}>Negocios</option>
              </select>
            </label>
          </div>
          <button className="btn-primary" type="submit">Guardar curso</button>
        </form>
      </div>
    </section>
  );
};

export default AdminCoursesView;