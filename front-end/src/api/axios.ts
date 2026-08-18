import axios, { type AxiosError } from "axios";
import type { CustomError } from "../types/error";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// anexa o token em toda requisição, se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// trata erros: extrai mensagem amigável, e desloga em caso de 401
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<CustomError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    const mensagem =
      error.response?.data?.error || "Erro inesperado. Tente novamente.";
    return Promise.reject({ ...error, mensagem });
  },
);

export default api;
