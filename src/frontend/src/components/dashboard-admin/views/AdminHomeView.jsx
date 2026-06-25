// src/components/dashboard-admin/views/AdminHomeView.jsx
import React from "react";
import "../../../styles/DashboardAdmin/views/admin-home.css";

const AdminHomeView = () => {
  return (
    <section className="admin-home">
      <header className="admin-home-header">
        <h1>Panel de administración de contenido</h1>
        <p>
          Desde aquí puedes gestionar el catálogo de cursos y revisar las
          métricas de reproducción de la plataforma.
        </p>
      </header>

      <div className="admin-home-grid">
        <div className="admin-home-card">
          <span className="card-label">Cursos registrados</span>
          <span className="card-value">42</span>
        </div>
        <div className="admin-home-card">
          <span className="card-label">Categorías temáticas</span>
          <span className="card-value">8</span>
        </div>
        <div className="admin-home-card">
          <span className="card-label">Niveles de dificultad</span>
          <span className="card-value">3</span>
        </div>
      </div>
    </section>
  );
};

export default AdminHomeView;