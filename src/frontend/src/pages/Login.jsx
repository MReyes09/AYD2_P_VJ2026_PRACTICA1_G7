// src/pages/Login.jsx
import React from "react";
import "../styles/Auth/Login.css";
import LoginForm from "../components/auth/LoginForm.jsx";

const Login = () => {
  return (
    <div className="auth-page auth-login">
      <div className="auth-card">
        <div className="auth-left">
          <h1 className="serif-text">Bienvenido a LearnFlow</h1>
          <p>Ingresa con tu cuenta para continuar con tus cursos.</p>
        </div>

        <div className="auth-right">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;