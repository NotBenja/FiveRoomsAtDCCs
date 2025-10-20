// todo: Borrar esto, supongo que el BenjaR hizo algo parecido
import axios from "axios";

const baseUrl = "http://localhost:3001/api";

axios.defaults.withCredentials = true;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  token: string;
}

export interface UserResponse {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export const login = async (credentials: LoginCredentials): Promise<UserResponse> => {
  const response = await axios.post<AuthResponse>(`${baseUrl}/auth/login`, credentials);
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  const user = {
    id: response.data.user.id,
    first_name: response.data.user.first_name,
    last_name: response.data.user.last_name,
    email: response.data.user.email
  }
  return { user };
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${baseUrl}/auth/register`, data);
  // Guardar token en localStorage
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  return response.data;
};

export const logout = async (): Promise<void> => {
  await axios.post(`${baseUrl}/auth/logout`);
  // Limpiar localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await axios.get<UserResponse>(`${baseUrl}/auth/me`);
  const user = response.data.user;
  return { user };
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
  isAuthenticated,
  getToken,
  getStoredUser
};