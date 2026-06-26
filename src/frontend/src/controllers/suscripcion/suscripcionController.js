// src/controllers/auth/authcController.js
import axios from "axios";
import { BASE_URL } from "../backendURL";

const api = axios.create({
  baseURL: BASE_URL,
});

// Obtener tarifas de suscripción
export const listarTarifas = async () => {
  const response = await api.get("/tarifas");
  return response.data; // lista de tarifas
};

// Adquirir suscripción
export const adquirirSuscripcion = async (idPersona, idTarifa) => {
  const response = await api.post("/suscripciones", {
    idPersona,
    idTarifa,
  });
  return response.data;
};