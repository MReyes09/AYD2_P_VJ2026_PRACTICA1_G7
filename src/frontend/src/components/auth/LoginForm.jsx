// src/components/auth/LoginForm.jsx
import React, { useState } from "react";
import "../../styles/Auth/Login.css";

import { Link } from "react-router-dom";

const LoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí luego llamarías al authController
    console.log("Login mock:", form);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>

      <label>
        Correo electrónico
        <input
          type="email"
          name="email"
          placeholder="tu@correo.com"
          value={form.email}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Contraseña
        <input
          type="password"
          name="password"
          placeholder="********"
          value={form.password}
          onChange={handleChange}
          required
        />
      </label>

      <Link type="submit" className="btn-primary" to="/admin">
        Entrar
      </Link>
      <Link className="btn-secondary" to="/">
        Volver
      </Link>

      <p className="auth-helper">
        ¿No tienes cuenta?{" "}
        <a href="/register" className="auth-link">
          Crear cuenta
        </a>
      </p>
    </form>
  );
};

export default LoginForm;