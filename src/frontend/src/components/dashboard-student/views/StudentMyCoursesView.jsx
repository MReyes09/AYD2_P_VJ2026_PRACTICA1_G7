// src/components/dashboard-student/views/StudentMyCoursesView.jsx
import React, { useState } from "react";
import "../../../styles/DashboardStudent/views/student-my-courses.css";

const misCursosMock = [
  {
    id: 1,
    titulo: "React desde cero",
    progreso: "45%",
    contenidos: [
      { id: 1, titulo: "Introducción", duracion: "10 min" },
      { id: 2, titulo: "Componentes básicos", duracion: "25 min" },
    ],
  },
];

const StudentMyCoursesView = () => {
  const [cursoActivo, setCursoActivo] = useState(misCursosMock[0]);

  return (
    <section className="student-my-courses">
      <div className="my-courses-list">
        <h2>Mis cursos</h2>
        <ul>
          {misCursosMock.map((curso) => (
            <li
              key={curso.id}
              className={cursoActivo.id === curso.id ? "active" : ""}
              onClick={() => setCursoActivo(curso)}
            >
              <span>{curso.titulo}</span>
              <span className="progreso">{curso.progreso}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="my-courses-content">
        <h2>{cursoActivo.titulo}</h2>
        <p>Selecciona un contenido para reproducirlo.</p>
        <div className="contenido-lista">
          {cursoActivo.contenidos.map((c) => (
            <article key={c.id} className="contenido-item">
              <div>
                <h3>{c.titulo}</h3>
                <span className="duracion">{c.duracion}</span>
              </div>
              <button className="btn-small">Reproducir</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudentMyCoursesView;