import axios from "axios";

const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

axios.defaults.withCredentials = true;
const storedCsrf = localStorage.getItem("csrfToken");
if (storedCsrf) {
  axios.defaults.headers.common["X-CSRF-Token"] = storedCsrf;
}

const persistSession = (token: string, user: AuthResponse["user"], csrfToken?: string) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  if (csrfToken) {
    localStorage.setItem("csrfToken", csrfToken);
    axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;
  }
};

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
  csrfToken?: string;
}

export interface UserResponse {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${baseUrl}/auth/login`, credentials);
  const csrfHeader = response.headers["x-csrf-token"] as string | undefined;
  persistSession(response.data.token, response.data.user, csrfHeader ?? response.data.csrfToken);
  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${baseUrl}/auth/register`, data);
  const csrfHeader = response.headers["x-csrf-token"] as string | undefined;
  persistSession(response.data.token, response.data.user, csrfHeader ?? response.data.csrfToken);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await axios.post(`${baseUrl}/auth/logout`);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('csrfToken');
  delete axios.defaults.headers.common["X-CSRF-Token"];
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