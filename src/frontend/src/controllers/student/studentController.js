import axios from "axios";
import { BASE_URL } from "../backendURL";

const api = axios.create({
  baseURL: BASE_URL,
});

// Ya tienes registrarEstudiante, agregamos getEstudiantePorId:

export const getEstudiantePorId = async (idPersona) => {
  const response = await api.get(`/estudiantes/${idPersona}`);
  return response.data;
};