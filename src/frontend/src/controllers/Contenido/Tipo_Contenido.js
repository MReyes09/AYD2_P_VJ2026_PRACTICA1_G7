import axios from "axios";
import { BASE_URL } from "../backendURL";

const api = axios.create({ baseURL: BASE_URL });

// Listar Tipos de contenidos
export const listarTipoContenido = async () => {
    const response = await api.get("/tipos-contenido");
    return response.data
}

// Crear Tipos de contenidos
export const crearTipoContenido = async (tipoContenido) => {
    const response = await api.post("/tipos-contenido", { tipoContenido });
    return response.data;
};

// Editar Tipo de Contenido
export const editarTipoContenido = async (id, tipoContenido) => {
    const response = await api.put(`/tipos-contenido/${id}`, { tipoContenido });
    return response.data;
};

// Eliminar Tipo de Contenido
export const eliminarTipoContenido = async (id) => {
    const response = await api.delete(`/tipos-contenido/${id}`);
    return response.data;
};