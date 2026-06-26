// src/components/auth/RegisterForm.jsx
import React, { useState } from "react";
import "../../styles/Auth/Register.css";
import { registrarEstudiante } from "../../controllers/auth/authcController";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import SuscripcionModal from "../suscripcion/SuscripcionModal";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

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

  // Estado para el flujo de suscripción
  const [suscripcionModalOpen, setSuscripcionModalOpen] = useState(false);
  const [idPersonaRegistrada, setIdPersonaRegistrada] = useState(null);

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
    // limpiar espacios en NIT y tarjeta
    const cleanValue =
      name === "nit" || name === "numeroTarjeta"
        ? value.replace(/\s+/g, "")
        : value;

    setForm((prev) => ({
      ...prev,
      [name]: cleanValue,
    }));
  };

  // Validar datos antes de enviar al backend
  const validarFormulario = () => {
    // NIT entre 8 y 13 dígitos (solo si se llenó)
    if (form.nit) {
      const nitDigits = form.nit.replace(/\D/g, "");
      if (nitDigits.length < 8 || nitDigits.length > 13) {
        showToast(
          "error",
          "El NIT debe tener entre 8 y 13 dígitos si se ingresa."
        );
        return false;
      }
    }

    // Número de tarjeta exactamente 16 dígitos
    const tarjetaDigits = form.numeroTarjeta.replace(/\D/g, "");
    if (tarjetaDigits.length !== 16) {
      showToast("error", "El número de tarjeta debe tener exactamente 16 dígitos.");
      return false;
    }

    // podrías agregar más validaciones aquí (correo, contraseña, etc.)

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validaciones de front
    const esValido = validarFormulario();
    if (!esValido) {
      return; // no enviar si falla
    }

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

      const result = await registrarEstudiante(data);

      // Backend retorna: { mensaje, idPersona, idTarjeta }
      showToast(
        "success",
        result.mensaje || "Registro realizado con éxito. Elige tu suscripción."
      );

      if (!result.idPersona) {
        showToast(
          "error",
          "No se recibió el idPersona desde el backend. No se puede continuar."
        );
        return;
      }

      // Guardar idPersona en localStorage para usar luego
      localStorage.setItem("userId", String(result.idPersona));

      // Guardar en estado local y abrir modal de suscripción
      setIdPersonaRegistrada(result.idPersona);
      setSuscripcionModalOpen(true);
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        "Ocurrió un error al registrar. Intenta de nuevo.";
      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  // 2. Cuando la suscripción se compra exitosamente, terminar el flujo
  const handleSuscripcionExitosa = (suscripcionResult) => {
    showToast("success", "Suscripción adquirida exitosamente. Bienvenido a LearnFlow.");
    navigate("/student");
  };

  return (
    <>
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Crear cuenta</h2>
        <p className="register-form-helper">
          Completa tus datos para configurar tu perfil inicial y método de pago.
        </p>

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
              placeholder="*********"
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
              placeholder="XXXXXXXXXXXX" // 12 dígitos
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

      {/* Modal de suscripción después del registro */}
      <SuscripcionModal
        open={suscripcionModalOpen}
        onClose={() => setSuscripcionModalOpen(false)}
        idPersona={idPersonaRegistrada}
        onSuscripcionExitosa={handleSuscripcionExitosa}
      />
    </>
  );
};

export default RegisterForm;