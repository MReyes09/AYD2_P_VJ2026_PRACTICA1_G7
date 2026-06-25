// src/pages/Register.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth/Register.css";
import RegisterForm from "../components/auth/RegisterForm.jsx";

const Register = () => {
  const navigate = useNavigate();

  const goHome = () => navigate("/");
  const goLogin = () => navigate("/login");

  return (
    <div className="register-page">
      <div className="register-shell">
        {/* Panel izquierdo: menos texto, más compacto */}
        <div className="register-side register-side--left">
          <div className="register-logo">
            <span className="register-logo-icon">▶</span>
            <span className="register-logo-text serif-text">LearnFlow</span>
          </div>

          <div className="register-copy">
            <h1 className="serif-text">Únete a LearnFlow</h1>
            <p>
              Crea tu cuenta como estudiante o instructor y administra tus
              cursos en video desde una sola plataforma.
            </p>
          </div>

          <div className="register-nav-buttons">
            <button className="btn-secondary" onClick={goHome}>
              ← Inicio
            </button>
            <button className="btn-primary" onClick={goLogin}>
              Iniciar sesión
            </button>
          </div>
        </div>

        {/* Panel derecho: solo el formulario */}
        <div className="register-side register-side--right">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;