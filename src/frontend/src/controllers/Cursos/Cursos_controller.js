import axios from "axios";
import { BASE_URL } from "../backendURL";

const api = axios.create({ baseURL: BASE_URL });

// Listar cursos (con filtros opcionales)
export const listarCursos = async (titulo, idTematica, idDificultad) => {
    const params = {};
    if (titulo) params.titulo = titulo;
    if (idTematica) params.idTematica = idTematica;
    if (idDificultad) params.idDificultad = idDificultad;

    const response = await api.get("/api/cursos", { params });
    return response.data;
};