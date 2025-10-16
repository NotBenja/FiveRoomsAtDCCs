import axios from "axios";
import axiosSecure from "../utils/axiosSecure";
import type { LoginCredentials, LoginResponse } from "../types/users";

const API_URL = "http://localhost:3001";

const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
        const response = await axios.post(`${API_URL}/api/login`, credentials);

        const csrfToken = response.headers["x-csrf-token"];
        if (csrfToken) {
            localStorage.setItem("csrfToken", csrfToken);
        }

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error("Usuario o contraseña incorrectos");
        }
        throw error;
    }
};

const restoreLogin = async () => {
    try {
        const response = await axiosSecure.get(`${API_URL}/api/login/me`);
        return response.data; // Usuario logueado
    } catch {
        return null; // No logueado
    }
};

const logout = async () => {
    await axios.post(`${API_URL}/api/login/logout`);
    localStorage.removeItem("csrfToken");
    // Esto esta por mientras
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export { login, restoreLogin, logout };