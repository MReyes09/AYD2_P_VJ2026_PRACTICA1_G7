// src/components/auth/RegisterForm.jsx
import React, { useState } from "react";
import "../../styles/auth/Register.css";
import { registrarEstudiante } from "../../controllers/auth/authcController";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombreCompleto: "",
    fechaNacimiento: "",
    mail: "",
    contrasenia: "",
    nit: "",
    numeroTarjeta: "",
    fechaVencimiento: "", // YYYY-MM desde el input type="month"
  });

  const [fotoArchivo, setFotoArchivo] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFotoArchivo(null);
      setFotoPreview(null);
      return;
    }
    setFotoArchivo(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const data = new FormData();

      data.append("nombreCompleto", form.nombreCompleto);
      data.append("mail", form.mail);
      data.append("contrasenia", form.contrasenia);

      if (form.fechaNacimiento) {
        data.append("fechaNacimiento", form.fechaNacimiento); // YYYY-MM-DD
      }
      if (form.nit) {
        data.append("nit", form.nit);
      }

      data.append("numeroTarjeta", form.numeroTarjeta);

      // Convertir YYYY-MM a YYYY-MM-01 para el backend
      if (form.fechaVencimiento) {
        const vencimientoFull = `${form.fechaVencimiento}-01`;
        data.append("fechaVencimiento", vencimientoFull);
      }

      if (fotoArchivo) {
        data.append("fotografia", fotoArchivo);
      }
      console.log(form)
      const result = await registrarEstudiante(data);
      console.log("Registro OK:", result);
      setSuccessMsg("Registro realizado con éxito.");

      // Redirigir a /student luego del registro exitoso
      navigate("/student");
    } catch (err) {
      console.error("Error al registrar:", err);
      const msg =
        err?.response?.data?.error ||
        "Ocurrió un error al registrar. Intenta de nuevo.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Crear cuenta</h2>
      <p className="register-form-helper">
        Completa tus datos para configurar tu perfil inicial y método de pago.
      </p>

      {errorMsg && <p className="register-error">{errorMsg}</p>}
      {successMsg && <p className="register-success">{successMsg}</p>}

      {/* Datos personales */}
      <div className="register-row">
        <label>
          Nombre completo
          <input
            name="nombreCompleto"
            value={form.nombreCompleto}
            onChange={handleChange}
            placeholder="Juan Pérez Gómez"
            required
          />
        </label>
      </div>

      <div className="register-row register-row--inline">
        <label>
          Fecha de nacimiento
          <input
            type="date"
            name="fechaNacimiento"
            value={form.fechaNacimiento}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          NIT
          <input
            name="nit"
            value={form.nit}
            onChange={handleChange}
            placeholder="Opcional"
          />
        </label>
      </div>

      <div className="register-row register-row--inline">
        <label>
          Fotografía (opcional)
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>

        {fotoPreview && (
          <div className="register-photo-preview">
            <img src={fotoPreview} alt="Vista previa" />
          </div>
        )}
      </div>

      {/* Credenciales */}
      <div className="register-row">
        <label>
          Correo electrónico
          <input
            type="email"
            name="mail"
            value={form.mail}
            onChange={handleChange}
            placeholder="tu@correo.com"
            required
          />
        </label>
      </div>

      <div className="register-row">
        <label>
          Contraseña
          <input
            type="password"
            name="contrasenia"
            value={form.contrasenia}
            onChange={handleChange}
            placeholder="Mínimo 8 caracteres"
            required
          />
        </label>
      </div>

      {/* Método de pago */}
      <h3 className="register-section-title">Método de pago</h3>

      <div className="register-row register-row--inline">
        <label>
          Número de tarjeta
          <input
            name="numeroTarjeta"
            value={form.numeroTarjeta}
            onChange={handleChange}
            placeholder="XXXX XXXX XXXX XXXX"
            required
          />
        </label>
        <label>
          Fecha de vencimiento
          <input
            type="month"
            name="fechaVencimiento"
            value={form.fechaVencimiento}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <div className="register-footer">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Registrando..." : "Registrarme"}
        </button>
        <p className="register-helper">
          Podrás actualizar tus datos personales y métodos de pago desde tu
          dashboard en cualquier momento.
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;