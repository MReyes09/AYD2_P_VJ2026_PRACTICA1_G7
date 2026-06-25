// src/components/dashboard-admin/views/AdminAnalyticsView.jsx
import React from "react";
import "../../../styles/DashboardAdmin/views/admin-analytics.css";

const topCategoriasMock = [
  { nombre: "Programación", reproducciones: 1200 },
  { nombre: "Diseño", reproducciones: 800 },
  { nombre: "Negocios", reproducciones: 650 },
];

const topNivelesMock = [
  { nombre: "Principiante", cursados: 900 },
  { nombre: "Intermedio", cursados: 700 },
  { nombre: "Avanzado", cursados: 300 },
];

const topCursosMock = [
  "Python para principiantes",
  "Fundamentos de Bases de Datos",
  "Introducción a Machine Learning",
];

const suscripcionesMock = [
  { tipo: "Mensual", estudiantes: 130 },
  { tipo: "Trimestral", estudiantes: 45 },
  { tipo: "Anual", estudiantes: 60 },
];

const AdminAnalyticsView = () => {
  return (
    <section className="admin-analytics">
      <header className="admin-analytics-header">
        <h1>Analíticas de contenido</h1>
        <p>
          Este panel muestra las métricas de reproducción y distribución de
          suscripciones de la plataforma. [file:9]
        </p>
      </header>

      <div className="admin-analytics-grid">
        {/* Top 3 categorías */}
        <div className="analytics-card">
          <h2>Top 3 categorías por reproducciones</h2>
          <ul>
            {topCategoriasMock.map((c) => (
              <li key={c.nombre}>
                <span>{c.nombre}</span>
                <span className="analytics-value">{c.reproducciones}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top 3 niveles */}
        <div className="analytics-card">
          <h2>Top 3 niveles más cursados</h2>
          <ul>
            {topNivelesMock.map((n) => (
              <li key={n.nombre}>
                <span>{n.nombre}</span>
                <span className="analytics-value">{n.cursados}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top 10 cursos (mostramos algunos) */}
        <div className="analytics-card">
          <h2>Top 10 cursos más visualizados</h2>
          <ol className="analytics-list">
            {topCursosMock.map((titulo, idx) => (
              <li key={idx}>{titulo}</li>
            ))}
          </ol>
        </div>

        {/* Distribución de estudiantes por tipo de suscripción */}
        <div className="analytics-card">
          <h2>Distribución de estudiantes por suscripción</h2>
          <ul>
            {suscripcionesMock.map((s) => (
              <li key={s.tipo}>
                <span>{s.tipo}</span>
                <span className="analytics-value">{s.estudiantes}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default AdminAnalyticsView;