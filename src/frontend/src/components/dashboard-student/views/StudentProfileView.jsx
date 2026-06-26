import React, { useState, useEffect, useRef } from "react";
import "../../../styles/DashboardStudent/views/student-profile.css";
import { BASE_URL } from "../../../controllers/backendURL";
import {
  getEstudiantePorId,
  updateStudentProfile,
  updateStudentCard,
} from "../../../controllers/student/studentController";

// ── Photo helpers ─────────────────────────────────────────────────────────────

const ACCEPTED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;

const resolveProfilePhotoUrl = (photoPath) => {
  if (!photoPath) return null;
  if (
    photoPath.startsWith("http://") ||
    photoPath.startsWith("https://") ||
    photoPath.startsWith("blob:")
  ) {
    return photoPath;
  }
  const normalizedPath = photoPath.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${BASE_URL}/${normalizedPath}`;
};

// ── Card helpers ──────────────────────────────────────────────────────────────

const maskCardNumber = (cardNumber) => {
  const normalized = String(cardNumber || "").replace(/\s/g, "");
  const lastFour = normalized.slice(-4);
  return lastFour ? `•••• •••• •••• ${lastFour}` : "•••• •••• •••• ••••";
};

const formatExpirationDate = (value) => {
  if (!value) return "Sin fecha";
  const [year, month] = String(value).split("-");
  if (!year || !month) return "Sin fecha";
  return `${month}/${year.slice(-2)}`;
};

const formatCardInput = (raw) => {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
};


// ── Initial state constants ───────────────────────────────────────────────────

const emptyPerfil = {
  nombreCompleto: "",
  mail: "",
  nit: "",
  fechaNacimiento: "",
  contrasenia: "",
};

const emptyCardForm = { numeroTarjeta: "", fechaVencimiento: "" };

// ── SVG icons (inline, no extra package) ─────────────────────────────────────

const ChipIcon = () => (
  <svg width="28" height="22" viewBox="0 0 28 22" fill="none" aria-hidden="true">
    <rect width="28" height="22" rx="4" fill="rgba(255,255,255,0.15)" />
    <rect x="4" y="4" width="20" height="14" rx="2" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
    <line x1="14" y1="4" x2="14" y2="18" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    <line x1="4" y1="11" x2="24" y2="11" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
  </svg>
);

const NoCardIcon = () => (
  <svg width="44" height="34" viewBox="0 0 44 34" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="42" height="32" rx="5" stroke="rgba(148,163,184,0.4)" strokeWidth="1.5" fill="none" />
    <rect x="1" y="9" width="42" height="7" fill="rgba(148,163,184,0.12)" />
    <rect x="6" y="22" width="11" height="5" rx="2" fill="rgba(148,163,184,0.22)" />
    <rect x="21" y="22" width="7" height="5" rx="2" fill="rgba(148,163,184,0.18)" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────

const StudentProfileView = () => {
  const userId = localStorage.getItem("userId");

  // ── Personal profile state ────────────────────────────────────────────────
  const [perfil, setPerfil] = useState(emptyPerfil);
  const [originalPerfil, setOriginalPerfil] = useState(null);
  const [savedPhotoPath, setSavedPhotoPath] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null);
  const [photoLoadError, setPhotoLoadError] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ── Subscription state (mock) ─────────────────────────────────────────────
  const [suscripcion, setSuscripcion] = useState({
    tipo: "Mensual",
    fechaFin: "",
    estado: "Activa",
  });

  // ── Card state ────────────────────────────────────────────────────────────
  const [currentCard, setCurrentCard] = useState(null);
  const [titularNombre, setTitularNombre] = useState("");
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardForm, setCardForm] = useState(emptyCardForm);
  const [cardFieldErrors, setCardFieldErrors] = useState({});
  const [savingCard, setSavingCard] = useState(false);
  const [cardErrorMsg, setCardErrorMsg] = useState("");
  const [cardSuccessMsg, setCardSuccessMsg] = useState("");

  // ── General ───────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef(null);

  // ── Load profile ──────────────────────────────────────────────────────────

  const cargarPerfil = async (showLoading = true) => {
    if (!userId) {
      setErrorMsg("No hay sesión activa.");
      setLoading(false);
      return;
    }
    try {
      if (showLoading) setLoading(true);
      setErrorMsg("");

      const data = await getEstudiantePorId(userId);

      const loaded = {
        nombreCompleto: data.nombreCompleto || "",
        mail: data.mail || "",
        nit: data.nit != null ? String(data.nit) : "",
        fechaNacimiento: data.fechaNacimiento || "",
        contrasenia: "",
      };
      setPerfil(loaded);
      setOriginalPerfil(loaded);
      setSavedPhotoPath(data.fotografia || null);
      setPhotoLoadError(false);
      setTitularNombre(data.nombreCompleto || "");

      const tarjeta =
        Array.isArray(data.tarjetas) && data.tarjetas.length > 0
          ? data.tarjetas[0]
          : null;
      setCurrentCard(tarjeta);
      setSuscripcion((prev) => ({
        ...prev,
        fechaFin: tarjeta?.fechaVencimiento || "",
      }));
    } catch (err) {
      console.error("Error cargando perfil:", err);
      setErrorMsg("No se pudo cargar el perfil del estudiante.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreviewUrl);
      }
    };
  }, [photoPreviewUrl]);

  // ── Personal form handlers ────────────────────────────────────────────────

  const handleChange = (e) => {
    setSuccessMsg("");
    setPerfil((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError("");

    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      setPhotoError("Formato de imagen no válido. Utiliza PNG, JPG, JPEG o WEBP.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      setPhotoError("La fotografía no debe superar los 5 MB.");
      e.target.value = "";
      return;
    }

    if (photoPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(photoPreviewUrl);
    const previewUrl = URL.createObjectURL(file);
    setSelectedPhoto(file);
    setPhotoPreviewUrl(previewUrl);
    setPhotoLoadError(false);
    e.target.value = "";
  };

  const handleCancelPhoto = () => {
    if (photoPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(photoPreviewUrl);
    setSelectedPhoto(null);
    setPhotoPreviewUrl(null);
    setPhotoError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!userId) { setErrorMsg("No hay sesión activa."); return; }

    const changedFields = {};
    if (originalPerfil) {
      if (perfil.nombreCompleto !== originalPerfil.nombreCompleto)
        changedFields.nombreCompleto = perfil.nombreCompleto;
      if (perfil.mail !== originalPerfil.mail)
        changedFields.mail = perfil.mail;
      if (perfil.nit !== originalPerfil.nit)
        changedFields.nit = perfil.nit;
      if (perfil.fechaNacimiento !== originalPerfil.fechaNacimiento)
        changedFields.fechaNacimiento = perfil.fechaNacimiento;
    }
    if (perfil.contrasenia) changedFields.contrasenia = perfil.contrasenia;

    if (Object.keys(changedFields).length === 0 && !selectedPhoto) {
      setErrorMsg("No hay cambios pendientes por guardar.");
      return;
    }

    try {
      setSaving(true);
      await updateStudentProfile(userId, changedFields, selectedPhoto);
      setSuccessMsg("Datos actualizados correctamente.");

      if (photoPreviewUrl?.startsWith("blob:")) URL.revokeObjectURL(photoPreviewUrl);
      setSelectedPhoto(null);
      setPhotoPreviewUrl(null);
      setPhotoError("");

      await cargarPerfil(false);
    } catch (err) {
      setErrorMsg(err.message || "No se pudieron actualizar los datos.");
    } finally {
      setSaving(false);
    }
  };

  // ── Card form handlers ────────────────────────────────────────────────────

  const openCardForm = () => {
    setCardFieldErrors({});
    setCardErrorMsg("");
    setCardSuccessMsg("");
    setCardForm({
      numeroTarjeta: "",
      fechaVencimiento: currentCard?.fechaVencimiento
        ? currentCard.fechaVencimiento.slice(0, 7)
        : "",
    });
    setShowCardForm(true);
  };

  const closeCardForm = () => {
    setShowCardForm(false);
    setCardForm(emptyCardForm);
    setCardFieldErrors({});
    setCardErrorMsg("");
  };

  const handleCardNumberChange = (e) => {
    setCardForm((prev) => ({
      ...prev,
      numeroTarjeta: formatCardInput(e.target.value),
    }));
    if (cardFieldErrors.numeroTarjeta)
      setCardFieldErrors((prev) => ({ ...prev, numeroTarjeta: "" }));
  };

  const handleCardMonthChange = (e) => {
    setCardForm((prev) => ({ ...prev, fechaVencimiento: e.target.value }));
    if (cardFieldErrors.fechaVencimiento)
      setCardFieldErrors((prev) => ({ ...prev, fechaVencimiento: "" }));
  };

  const validateCard = () => {
    const errors = {};
    const cleanNumber = cardForm.numeroTarjeta.replace(/\D/g, "");

    if (!cleanNumber) {
      errors.numeroTarjeta = "Ingresa el número de la tarjeta.";
    } else if (!/^\d+$/.test(cleanNumber)) {
      errors.numeroTarjeta = "El número de tarjeta solo debe contener dígitos.";
    } else if (cleanNumber.length !== 16) {
      errors.numeroTarjeta = "El número de tarjeta debe tener exactamente 16 dígitos.";
    }

    if (!cardForm.fechaVencimiento) {
      errors.fechaVencimiento = "Selecciona la fecha de vencimiento.";
    } else {
      const [year, month] = cardForm.fechaVencimiento.split("-").map(Number);
      const now = new Date();
      const expDate = new Date(year, month - 1, 1);
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      if (expDate < thisMonth) {
        errors.fechaVencimiento =
          "La fecha de vencimiento no puede estar en el pasado.";
      }
    }

    return errors;
  };

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    setCardErrorMsg("");
    setCardSuccessMsg("");

    const errors = validateCard();
    if (Object.keys(errors).length > 0) {
      setCardFieldErrors(errors);
      return;
    }

    const cleanNumber = cardForm.numeroTarjeta.replace(/\D/g, "");
    const payload = {
      numeroTarjeta: cleanNumber,
      fechaVencimiento: cardForm.fechaVencimiento,
    };

    try {
      setSavingCard(true);
      const result = await updateStudentCard(userId, payload);
      setCardSuccessMsg(
        result?.mensaje || "Tarjeta actualizada correctamente."
      );
      closeCardForm();
      await cargarPerfil(false);
    } catch (err) {
      setCardErrorMsg(err.message || "No se pudo actualizar la tarjeta.");
    } finally {
      setSavingCard(false);
    }
  };

  // ── Derived values ────────────────────────────────────────────────────────

  const savedPhotoUrl = resolveProfilePhotoUrl(savedPhotoPath);
  const displayPhotoUrl = photoPreviewUrl || savedPhotoUrl;
  const showPhoto = displayPhotoUrl && !photoLoadError;
  const isReplaceMode = currentCard != null;

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return <section className="student-profile">Cargando perfil...</section>;
  }

  return (
    <section className="student-profile">

      {/* ════ Personal data card ════ */}
      <div className="profile-card">
        <h2>Datos del estudiante</h2>

        {errorMsg && <p className="profile-error">{errorMsg}</p>}
        {successMsg && <p className="profile-success">{successMsg}</p>}

        {/* Photo section */}
        <div className="profile-photo-section">
          <div className="profile-photo-wrapper">
            {showPhoto ? (
              <img
                src={displayPhotoUrl}
                alt="Fotografía de perfil"
                className="profile-photo-img"
                onError={() => setPhotoLoadError(true)}
              />
            ) : (
              <div className="profile-photo-placeholder" aria-hidden="true">
                <span>STU</span>
              </div>
            )}
          </div>

          <div className="profile-photo-controls">
            {!selectedPhoto ? (
              <button
                type="button"
                className="btn-small"
                onClick={() => fileInputRef.current?.click()}
              >
                Cambiar fotografía
              </button>
            ) : (
              <button
                type="button"
                className="btn-small btn-outline-danger"
                onClick={handleCancelPhoto}
              >
                Cancelar cambio
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handlePhotoChange}
              style={{ display: "none" }}
              aria-label="Seleccionar fotografía de perfil"
            />
            <p className="photo-hint">PNG, JPG, JPEG o WEBP · Máx. 5 MB</p>
            {photoError && (
              <p className="profile-error photo-error">{photoError}</p>
            )}
          </div>
        </div>

        {/* Personal data form */}
        <form onSubmit={handleSubmit}>
          <label htmlFor="nombreCompleto">
            Nombre completo
            <input
              id="nombreCompleto"
              name="nombreCompleto"
              value={perfil.nombreCompleto}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="mail">
            Correo electrónico
            <input
              id="mail"
              type="email"
              name="mail"
              value={perfil.mail}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="nit">
            NIT
            <input
              id="nit"
              name="nit"
              value={perfil.nit}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="fechaNacimiento">
            Fecha de nacimiento
            <input
              id="fechaNacimiento"
              type="date"
              name="fechaNacimiento"
              value={perfil.fechaNacimiento}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="contrasenia">
            Nueva contraseña
            <input
              id="contrasenia"
              type="password"
              name="contrasenia"
              value={perfil.contrasenia}
              onChange={handleChange}
              placeholder="Dejar vacío para no cambiar"
            />
          </label>

          <button className="btn-primary" type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>

      {/* ════ Right column ════ */}
      <div className="profile-right-col">

      {/* ── Payment method section ── */}
      <div className="payment-section">
        <div className="payment-section-header">
          <h2>Método de pago</h2>
          <p className="payment-section-desc">
            Administra la tarjeta asociada a tu cuenta.
          </p>
        </div>

        {cardSuccessMsg && (
          <p className="profile-success">{cardSuccessMsg}</p>
        )}
        {cardErrorMsg && !showCardForm && (
          <p className="profile-error">{cardErrorMsg}</p>
        )}

        {!showCardForm ? (
          <>
            {isReplaceMode ? (
              /* Visual credit card */
              <div className="payment-card-visual">
                <div className="payment-card-chip">
                  <ChipIcon />
                </div>
                <p className="payment-card-number">
                  {maskCardNumber(currentCard.idTarjeta)}
                </p>
                <div className="payment-card-footer">
                  <div>
                    <span className="payment-card-label">Titular</span>
                    <span className="payment-card-value">
                      {titularNombre || "—"}
                    </span>
                  </div>
                  <div>
                    <span className="payment-card-label">Vence</span>
                    <span className="payment-card-value">
                      {formatExpirationDate(currentCard.fechaVencimiento)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Empty state */
              <div className="payment-empty-state">
                <div className="payment-empty-icon">
                  <NoCardIcon />
                </div>
                <p className="payment-empty-title">
                  No tienes una tarjeta registrada
                </p>
                <p className="payment-empty-desc">
                  Agrega una tarjeta para mantener actualizado tu método de
                  pago.
                </p>
              </div>
            )}

            <button
              type="button"
              className="btn-small payment-action-btn"
              onClick={openCardForm}
            >
              {isReplaceMode ? "Cambiar tarjeta" : "Agregar tarjeta"}
            </button>
          </>
        ) : (
          /* Card form (add / replace) */
          <form
            className="payment-form"
            onSubmit={handleCardSubmit}
            noValidate
          >
            <h3 className="payment-form-title">
              {isReplaceMode ? "Cambiar tarjeta" : "Agregar tarjeta"}
            </h3>

            {isReplaceMode && (
              <p className="payment-form-hint">
                Al guardar, la tarjeta actual será reemplazada por la nueva.
              </p>
            )}

            {cardErrorMsg && (
              <p className="profile-error">{cardErrorMsg}</p>
            )}

            <label htmlFor="numeroTarjeta">
              Número de tarjeta
              <input
                id="numeroTarjeta"
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                value={cardForm.numeroTarjeta}
                onChange={handleCardNumberChange}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                aria-describedby={
                  cardFieldErrors.numeroTarjeta ? "err-num-tarjeta" : undefined
                }
              />
              {cardFieldErrors.numeroTarjeta && (
                <span id="err-num-tarjeta" className="card-field-error">
                  {cardFieldErrors.numeroTarjeta}
                </span>
              )}
            </label>

            <label htmlFor="fechaVencimiento">
              Fecha de vencimiento
              <input
                id="fechaVencimiento"
                type="month"
                autoComplete="cc-exp"
                value={cardForm.fechaVencimiento}
                onChange={handleCardMonthChange}
                aria-describedby={
                  cardFieldErrors.fechaVencimiento
                    ? "err-fecha-venc"
                    : undefined
                }
              />
              {cardFieldErrors.fechaVencimiento && (
                <span id="err-fecha-venc" className="card-field-error">
                  {cardFieldErrors.fechaVencimiento}
                </span>
              )}
            </label>

            <div className="payment-form-actions">
              <button
                type="submit"
                className="btn-primary"
                disabled={savingCard}
              >
                {savingCard
                  ? "Guardando..."
                  : isReplaceMode
                  ? "Actualizar tarjeta"
                  : "Registrar tarjeta"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={closeCardForm}
                disabled={savingCard}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── Subscription section (mock) ── */}
      <div className="subscription-card">
        <h2>Suscripción</h2>
        <p>
          Plan actual: <strong>{suscripcion.tipo}</strong>
        </p>
        <p>
          Estado: <strong>{suscripcion.estado}</strong>
        </p>
        <p>Vence el {suscripcion.fechaFin || "Sin fecha registrada"}</p>

        <div className="subscription-actions">
          <button className="btn-small">Renovar plan</button>
          <button className="btn-small btn-outline-danger">
            Cancelar suscripción
          </button>
        </div>
      </div>

      </div>{/* end profile-right-col */}
    </section>
  );
};

export default StudentProfileView;
