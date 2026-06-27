import React, { useState } from "react";
import "../../../styles/DashboardTeacher/views/teacher-courses.css";

const cursosMock = [
  { id: 1, nombre: "React desde cero", dificultad: "Intermedio", anio: 2024 },
  { id: 2, nombre: "SQL básico", dificultad: "Principiante", anio: 2023 },
];

const AdminCoursesView = () => {
  const [form, setForm] = useState({
    nombre: "",
    resumen: "",
    descripcion: "",
    anio: 2025,
    dificultad: "Principiante",
    tematica: "Programación",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Crear curso mock:", form);
  };

  return (
    <section className="teacher-courses">
      <div className="teacher-courses-list">
        <h2>Mis cursos</h2>
        <ul>
          {cursosMock.map((c) => (
            <li key={c.id}>
              <span>{c.nombre}</span>
              <span className="badge-level">{c.dificultad}</span>
              <small>{c.anio}</small>
            </li>
          ))}
        </ul>
      </div>

      <div className="teacher-courses-form">
        <h2>Crear nuevo curso</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre del curso
            <input
              name="nombre"
              value={form.nombre}
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
                name="anio"
                value={form.anio}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Dificultad
              <select
                name="dificultad"
                value={form.dificultad}
                onChange={handleChange}
              >
                <option>Principiante</option>
                <option>Intermedio</option>
                <option>Avanzado</option>
              </select>
            </label>
            <label>
              Temática
              <select
                name="tematica"
                value={form.tematica}
                onChange={handleChange}
              >
                <option>Programación</option>
                <option>Diseño</option>
                <option>Negocios</option>
              </select>
            </label>
          </div>

          <button className="btn-primary" type="submit">
            Guardar curso
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminCoursesView;