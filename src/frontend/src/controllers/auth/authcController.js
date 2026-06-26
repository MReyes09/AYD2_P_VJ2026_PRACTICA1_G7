// src/api/authController.js
import axios from "axios";
import { BASE_URL } from "../backendURL";

// Instancia de axios con baseURL configurada
const api = axios.create({
  baseURL: BASE_URL,
});

// Función para registrar estudiante con soporte de archivo (FormData)
export const registrarEstudiante = async (formData) => {
  // formData es un objeto FormData ya construido en el componente
  const response = await api.post("/estudiantes/registro", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export default api;