import React, { useState } from "react";
import "../../../styles/DashboardTeacher/views/teacher-content.css";

const cursosMock = [
  { id: 1, nombre: "React desde cero" },
  { id: 2, nombre: "SQL básico" },
];

const AdminContentView = () => {
  const [cursoSeleccionado, setCursoSeleccionado] = useState(cursosMock[0].id);
  const [form, setForm] = useState({
    titulo: "",
    pathContenido: "",
    descripcion: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Crear contenido mock:", {
      cursoSeleccionado,
      ...form,
    });
  };

  return (
    <section className="teacher-content">
      <h2>Contenido de curso</h2>

      <div className="teacher-content-form">
        <label>
          Curso
          <select
            value={cursoSeleccionado}
            onChange={(e) => setCursoSeleccionado(Number(e.target.value))}
          >
            {cursosMock.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>

        <form onSubmit={handleSubmit}>
          <label>
            Título del contenido
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            URL o ruta del video
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

          <button className="btn-primary" type="submit">
            Agregar contenido
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminContentView;