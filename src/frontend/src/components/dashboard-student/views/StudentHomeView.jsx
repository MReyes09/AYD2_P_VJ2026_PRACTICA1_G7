// src/components/dashboard-student/views/StudentHomeView.jsx
import React from "react";
import "../../../styles/DashboardStudent/views/student-home.css";

const mockRecomendados = [
  { id: 1, titulo: "React desde cero", categoria: "Programación", nivel: "Intermedio" },
  { id: 2, titulo: "Diseño UI básico", categoria: "Diseño", nivel: "Principiante" },
];

const mockTop10 = [
  "Python para principiantes",
  "Fundamentos de Bases de Datos",
  "Introducción a Machine Learning",
];

const StudentHomeView = () => {
  return (
    <section className="student-home">
      <header className="student-home-header">
        <h1>Hola, Juan 👋</h1>
        <p>
          Continúa con tus cursos o explora nuevas recomendaciones basadas en lo
          que más ves.
        </p>
      </header>

      <div className="student-home-grid">
        <div className="student-panel">
          <h2>Recomendado para ti</h2>
          <div className="student-cards">
            {mockRecomendados.map((curso) => (
              <article key={curso.id} className="student-course-card">
                <h3>{curso.titulo}</h3>
                <p>{curso.categoria}</p>
                <span className="badge-level">{curso.nivel}</span>
                <button className="btn-small">Ver curso</button>
              </article>
            ))}
          </div>
        </div>

        <div className="student-panel">
          <h2>Top 10 cursos por tráfico</h2>
          <ol className="student-top-list">
            {mockTop10.map((titulo, idx) => (
              <li key={idx}>{titulo}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default StudentHomeView;