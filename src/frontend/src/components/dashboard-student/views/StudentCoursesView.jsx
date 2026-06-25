// src/components/dashboard-student/views/StudentCoursesView.jsx
import React, { useState } from "react";
import "../../../styles/DashboardStudent/views/student-courses.css";

const cursosMock = [
  {
    id: 1,
    titulo: "React desde cero",
    categoria: "Programación",
    nivel: "Intermedio",
    anio: 2024,
  },
  {
    id: 2,
    titulo: "Excel para negocios",
    categoria: "Negocios",
    nivel: "Principiante",
    anio: 2023,
  },
];

const StudentCoursesView = () => {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [nivel, setNivel] = useState("");

  const filtrados = cursosMock.filter((c) => {
    return (
      c.titulo.toLowerCase().includes(busqueda.toLowerCase()) &&
      (categoria ? c.categoria === categoria : true) &&
      (nivel ? c.nivel === nivel : true)
    );
  });

  return (
    <section className="student-courses">
      <header className="student-courses-header">
        <h1>Buscar cursos</h1>
        <p>Encuentra cursos por título, categoría o nivel de dificultad.</p>
      </header>

      <div className="student-courses-filters">
        <input
          type="text"
          placeholder="Buscar por título..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="">Todas las categorías</option>
          <option value="Programación">Programación</option>
          <option value="Negocios">Negocios</option>
        </select>
        <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
          <option value="">Todos los niveles</option>
          <option value="Principiante">Principiante</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
      </div>

      <div className="student-courses-grid">
        {filtrados.map((curso) => (
          <article key={curso.id} className="student-course-card">
            <h3>{curso.titulo}</h3>
            <p>{curso.categoria}</p>
            <span className="badge-level">{curso.nivel}</span>
            <small>Año {curso.anio}</small>
            <button className="btn-small">Inscribirme</button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default StudentCoursesView;