import axios, { type AxiosError } from 'axios';
import type { CustomError } from '../types/error';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<CustomError>) => {
    const mensagem = error.response?.data?.error || 'Erro inesperado. Tente novamente.';
    return Promise.reject({ ...error, mensagem });
  }
);

export default api;
