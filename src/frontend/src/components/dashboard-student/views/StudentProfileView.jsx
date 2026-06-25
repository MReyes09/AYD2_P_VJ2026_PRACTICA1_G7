// src/components/dashboard-student/views/StudentProfileView.jsx
import React, { useState } from "react";
import "../../../styles/DashboardStudent/views/student-profile.css";

const StudentProfileView = () => {
  const [perfil, setPerfil] = useState({
    nombre: "Juan Pérez",
    email: "juan@example.com",
    nit: "1234567",
  });

  const [suscripcion] = useState({
    tipo: "Mensual",
    fechaFin: "2026-07-15",
    estado: "Activa",
  });

  const handleChange = (e) =>
    setPerfil({ ...perfil, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Perfil actualizado mock:", perfil);
  };

  return (
    <section className="student-profile">
      <div className="profile-card">
        <h2>Datos del estudiante</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre completo
            <input
              name="nombre"
              value={perfil.nombre}
              onChange={handleChange}
            />
          </label>
          <label>
            Correo electrónico
            <input
              type="email"
              name="email"
              value={perfil.email}
              onChange={handleChange}
            />
          </label>
          <label>
            NIT
            <input name="nit" value={perfil.nit} onChange={handleChange} />
          </label>

          <button className="btn-primary" type="submit">
            Guardar cambios
          </button>
        </form>
      </div>

      <div className="subscription-card">
        <h2>Suscripción</h2>
        <p>
          Plan actual: <strong>{suscripcion.tipo}</strong>
        </p>
        <p>
          Estado: <strong>{suscripcion.estado}</strong>
        </p>
        <p>Vence el {suscripcion.fechaFin}</p>

        <div className="subscription-actions">
          <button className="btn-small">Renovar plan</button>
          <button className="btn-small btn-outline-danger">
            Cancelar suscripción
          </button>
        </div>
      </div>
    </section>
  );
};

export default StudentProfileView;