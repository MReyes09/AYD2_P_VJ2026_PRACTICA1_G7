// src/controllers/suscripcion/suscripcionController.js — archivo completo
import axios from "axios";
import { BASE_URL } from "../backendURL";

const api = axios.create({ baseURL: BASE_URL });

export const listarTarifas = async () => {
  const response = await api.get("/tarifas");
  return response.data;
};

export const adquirirSuscripcion = async (idPersona, idTarifa) => {
  const response = await api.post("/suscripciones", { idPersona, idTarifa });
  return response.data;
};

export const renovarSuscripcion = async (idSuscripcion, idTarifa) => {
  const response = await fetch(
    `${BASE_URL}/suscripciones/${idSuscripcion}/renovar`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idTarifa }),
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error al renovar.");
  return data;
};

export const cancelarSuscripcion = async (idSuscripcion) => {
  const response = await fetch(
    `${BASE_URL}/suscripciones/${idSuscripcion}/cancelar`,
    { method: "PUT" }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error al cancelar.");
  return data;
};