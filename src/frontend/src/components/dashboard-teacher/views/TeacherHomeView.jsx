// src/components/dashboard-teacher/views/TeacherHomeView.jsx
import React from "react";
import "../../../styles/DashboardTeacher/views/teacher-home.css";

const TeacherHomeView = () => {
  return (
    <section className="teacher-home">
      <header className="teacher-home-header">
        <h1>Panel del instructor</h1>
        <p>Administra tus cursos y revisa la actividad de tus estudiantes.</p>
      </header>

      <div className="teacher-home-grid">
        <div className="teacher-stat-card">
          <span className="stat-label">Cursos activos</span>
          <span className="stat-value">4</span>
        </div>
        <div className="teacher-stat-card">
          <span className="stat-label">Estudiantes inscritos</span>
          <span className="stat-value">132</span>
        </div>
        <div className="teacher-stat-card">
          <span className="stat-label">Horas de video</span>
          <span className="stat-value">26h</span>
        </div>
      </div>
    </section>
  );
};

export default TeacherHomeView;