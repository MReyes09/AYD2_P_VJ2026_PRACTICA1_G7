import axios from "axios";
import { BASE_URL } from "../backendURL";

const api = axios.create({
  baseURL: BASE_URL,
});

export const getEstudiantePorId = async (idPersona) => {
  const response = await api.get(`/estudiantes/${idPersona}`);
  return response.data;
};

export const updateStudentCard = async (idPersona, payload) => {
  try {
    const response = await api.put(
      `/estudiantes/${idPersona}/tarjeta`,
      payload
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const msg = error.response.data?.error;
      if (status === 404) throw new Error("Estudiante no encontrado.");
      if (status === 400)
        throw new Error(
          msg || "Campos requeridos faltantes: numeroTarjeta, fechaVencimiento"
        );
      if (status === 500)
        throw new Error("No fue posible actualizar la tarjeta.");
      throw new Error(msg || "No se pudo actualizar la tarjeta.");
    }
    throw new Error("No se pudo conectar con el servidor.");
  }
};

export const updateStudentProfile = async (
  idPersona,
  payload,
  photoFile = null
) => {
  const hasPhoto = photoFile instanceof File;

  try {
    let response;

    if (hasPhoto) {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, String(value));
        }
      });
      formData.append("fotografia", photoFile);
      response = await api.put(`/estudiantes/${idPersona}`, formData);
    } else {
      response = await api.put(`/estudiantes/${idPersona}`, payload);
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const msg = error.response.data?.error;
      if (status === 404) throw new Error("Estudiante no encontrado.");
      if (status === 400) throw new Error(msg || "Datos inválidos.");
      if (status === 500)
        throw new Error("No fue posible actualizar la fotografía.");
      throw new Error(
        msg || "No se pudieron actualizar los datos del estudiante."
      );
    }
    throw new Error("No se pudo conectar con el servidor.");
  }
};