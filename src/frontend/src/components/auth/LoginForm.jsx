// src/components/auth/LoginForm.jsx
import React, { useState } from "react";
import "../../styles/Auth/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../controllers/auth/authcController";

const LoginForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ mail: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // Llamada al backend
      const resultado = await login(form.mail, form.password);
      // resultado: { idPersona, nombreCompleto, mail, idRol }

      // Guardar datos básicos en localStorage
      const userData = {
        idPersona: resultado.idPersona,
        nombreCompleto: resultado.nombreCompleto,
        mail: resultado.mail,
        idRol: resultado.idRol,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      // Si solo quieres el id en una key aparte:
      localStorage.setItem("userId", String(resultado.idPersona));

      // Redirigir según rol
      if (resultado.idRol === 1) {
        // 1 = estudiante (ajusta si tu BD usa otro valor)
        navigate("/student");
      } else if (resultado.idRol === 2) {
        // 2 = admin (ajusta si tu BD usa otro valor)
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Error en login:", err);
      const msg =
        err?.response?.data?.error ||
        "No se pudo iniciar sesión. Verifica tus credenciales.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>

      {errorMsg && <p className="auth-error">{errorMsg}</p>}

      <label>
        Correo electrónico
        <input
          type="email"
          name="mail" // el backend espera "mail"
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