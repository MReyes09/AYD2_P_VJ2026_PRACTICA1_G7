import axios from "axios";
import { BASE_URL } from "../backendURL";

const api = axios.create({ baseURL: BASE_URL });

// Listar dificultad Cursos
export const listarDificultades = async () => {
    const response = await api.get("/dificultades");
    return response.data
}

// Crear Dificultad
export const crearDificultad = async (tipoDificultad) => {
    const response = await api.post("/dificultades", { tipoDificultad });
    return response.data;
};

// Editar una Dificultad
export const editarDificultad = async (id, tipoDificultad) => {
    const response = await api.put(`/dificultades/${id}`, { tipoDificultad });
    return response.data;
};

// Eliminar una Dificultad
export const eliminarDificultad = async (id) => {
    const response = await api.delete(`/dificultades/${id}`);
    return response.data;
};