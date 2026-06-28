import axios from "axios";
import { BASE_URL } from "../backendURL";

const api = axios.create({ baseURL: BASE_URL });

// Listar Tematicas Cursos
export const listarTematicas = async () => {
    const response = await api.get("/tematicas");
    return response.data
}

// Crear Temática
export const crearTematica = async (tipoTematica) => {
    const response = await api.post("/tematicas", { tipoTematica });
    return response.data;
};

// Editar una Tematica
export const editarTematica = async (id, tipoTematica) => {
    const response = await api.put(`/tematicas/${id}`, { tipoTematica });
    return response.data;
};

// Eliminar Tematica
export const eliminarTematica = async (id) => {
    const response = await api.delete(`/tematicas/${id}`);
    return response.data;
};