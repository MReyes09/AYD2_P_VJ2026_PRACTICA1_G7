// src/components/auth/RegisterForm.jsx
import React, { useState } from "react";
import "../../styles/Auth/Register.css";

const RegisterForm = () => {
  const [form, setForm] = useState({
    rol: "estudiante",
    nombreCompleto: "",
    fechaNacimiento: "",
    correo: "",
    contrasenia: "",
    nit: "",
    fotografia: "",
    numeroTarjeta: "",
    fechaVencimiento: "",
  });

const [fotoArchivo, setFotoArchivo] = useState(null);
const [fotoPreview, setFotoPreview] = useState(null);

const handleFileChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) {
    setFotoArchivo(null);
    setFotoPreview(null);
    return;
  }
  setFotoArchivo(file);
  setFotoPreview(URL.createObjectURL(file)); // solo para ver la foto en pantalla
};

const handleChange = (e) => {
const { name, value } = e.target;
    ((prev) => ({ ...prev, [name]: value }));
};

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
        ...form,
        // no mandas la foto en JSON si vas a usar FormData, pero puedes loguearla
    };

    console.log("Registro mock:", payload, fotoArchivo);
    // luego usarías FormData para enviar archivo + datos
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Crear cuenta</h2>
      <p className="register-form-helper">
        Completa tus datos para configurar tu perfil inicial y método de pago.
      </p>

      {/* Tipo de usuario */}
      <div className="register-row register-row--inline">
        <label>
          Tipo de usuario
          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            required
          >
            <option value="estudiante">Estudiante</option>
            <option value="instructor">Instructor</option>
          </select>
        </label>
      </div>

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
            name="correo"
            value={form.correo}
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
        <button type="submit" className="btn-primary">
          Registrarme
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