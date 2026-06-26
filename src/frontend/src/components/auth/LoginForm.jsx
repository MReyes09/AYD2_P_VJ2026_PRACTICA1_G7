// src/components/auth/LoginForm.jsx
import React, { useState } from "react";
import "../../styles/Auth/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../controllers/auth/authcController";
import { useToast } from "../../context/ToastContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({ mail: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });
    setLoading(true);

    try {
      const resultado = await login(form.mail, form.password);
      // resultado: { idPersona, nombreCompleto, mail, idRol }

      const userData = {
        idPersona: resultado.idPersona,
        nombreCompleto: resultado.nombreCompleto,
        mail: resultado.mail,
        idRol: resultado.idRol,
      };
      localStorage.setItem("userId", String(resultado.idPersona));
      localStorage.setItem("userName", String(resultado.nombreCompleto));

      // Toast de éxito
      showToast("success", "Inicio de sesión exitoso.");

      // Redirigir según rol después de un pequeño delay opcional
      setTimeout(() => {
        if (resultado.idRol === 1) {
          navigate("/student");
        } else if (resultado.idRol === 2) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 800);
    } catch (err) {
      console.error("Error en login:", err);
      const msg =
        err?.response?.data?.error ||
        "No se pudo iniciar sesión. Verifica tus credenciales.";
      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>

      <label>
        Correo electrónico
        <input
          type="email"
          name="mail"
          placeholder="tu@correo.com"
          value={form.mail}
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

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Ingresando..." : "Entrar"}
      </button>

      <Link className="btn-secondary" to="/">
        Volver
      </Link>

      <p className="auth-helper">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="auth-link">
          Crear cuenta
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;