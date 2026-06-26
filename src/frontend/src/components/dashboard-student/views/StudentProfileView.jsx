// src/components/dashboard-student/views/StudentProfileView.jsx
import React, { useState, useEffect } from "react";
import "../../../styles/DashboardStudent/views/student-profile.css";
import { getEstudiantePorId } from "../../../controllers/student/studentController";

const StudentProfileView = () => {
  // TODO: reemplazar 9 por el id del estudiante logueado (desde contexto / auth)
  const ID_ESTUDIANTE = 9;

  const [perfil, setPerfil] = useState({
    nombreCompleto: "",
    mail: "",
    nit: "",
  });

  const [suscripcion, setSuscripcion] = useState({
    tipo: "Mensual",
    fechaFin: "",
    estado: "Activa",
  });

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const data = await getEstudiantePorId(ID_ESTUDIANTE);
        // data es algo como:
        // {
        //   fechaNacimiento: "2003-06-12",
        //   fotografia: "uploads\\fotografias\\...",
        //   idPersona: 9,
        //   idRol: 1,
        //   mail: "jona@gmail.com",
        //   nit: 123456789,
        //   nombreCompleto: "Jonatan ...",
        //   tarjetas: [{ fechaVencimiento: "2026-12-01", idPersona: 9, idTarjeta: 123... }]
        // }

        setPerfil({
          nombreCompleto: data.nombreCompleto || "",
          mail: data.mail || "",
          nit: data.nit != null ? String(data.nit) : "",
        });

        const tarjetaPrincipal = Array.isArray(data.tarjetas)
          ? data.tarjetas[0]
          : null;

        setSuscripcion((prev) => ({
          ...prev,
          // puedes mapear la suscripción como quieras;
          // aquí usamos la fechaVencimiento de la tarjeta principal
          fechaFin: tarjetaPrincipal?.fechaVencimiento || "",
        }));
      } catch (err) {
        console.error("Error cargando perfil:", err);
        setErrorMsg("No se pudo cargar el perfil del estudiante.");
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, []);

  const handleChange = (e) =>
    setPerfil({ ...perfil, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Perfil actualizado mock:", perfil);
    // Aquí luego conectarías un PUT/PATCH al backend para actualizar datos
  };

  if (loading) {
    return <section className="student-profile">Cargando perfil...</section>;
  }

  return (
    <section className="student-profile">
      {errorMsg && <p className="profile-error">{errorMsg}</p>}

      <div className="profile-card">
        <h2>Datos del estudiante</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre completo
            <input
              name="nombreCompleto"
              value={perfil.nombreCompleto}
              onChange={handleChange}
            />
          </label>
          <label>
            Correo electrónico
            <input
              type="email"
              name="mail"
              value={perfil.mail}
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
        <p>
          Vence el {suscripcion.fechaFin || "Sin fecha registrada"}
        </p>

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