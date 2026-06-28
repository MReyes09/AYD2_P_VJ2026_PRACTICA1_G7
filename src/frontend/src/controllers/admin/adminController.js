import axios from "axios";
import { BASE_URL } from "../backendURL";

const api = axios.create({
    baseURL: BASE_URL,
});

export const getAdminAnalytics = async () => {
    const response = await api.get(`/api/analytics/dashboard`);
    return response;
}