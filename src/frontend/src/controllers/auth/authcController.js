// src/api/authController.js
import axios from "axios";
import { BASE_URL } from "../backendURL";

// Instancia de axios con baseURL configurada
const api = axios.create({
  baseURL: BASE_URL,
});

// Función para registrar estudiante con soporte de archivo (FormData)
export const registrarEstudiante = async (formData) => {
  const response = await api.post("/estudiantes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Función para iniciar sesión
// Envía { mail, password } y recibe { idPersona, nombreCompleto, mail, idRol }
export const login = async (mail, password) => {
  const response = await api.post("/api/auth/login", {
    mail,
    password,
  });
  return response.data;
};


// Crear suscripción nueva
export const adquirirSuscripcion = async (idPersona, idTarifa) => {
  const response = await api.post("/suscripciones", { idPersona, idTarifa });
  return response.data;
};

// Renovar suscripción existente
export const renovarSuscripcion = async (idSuscripcion, idTarifa) => {
  const response = await api.put(`/suscripciones/${idSuscripcion}/renovar`, { idTarifa });
  return response.data;
};

export default api;