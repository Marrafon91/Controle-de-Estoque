import type { AxiosError } from "axios";

export interface CustomError {
  timestamp: string;
  status: number;
  error: string;
  path: string;
}

// Isso é o que o interceptor do axios.ts realmente retorna no catch
export interface ApiError extends AxiosError<CustomError> {
  mensagem: string;
}
