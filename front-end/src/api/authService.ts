import api from './axios';
import type { AuthResponseDTO, LoginDTO, RegistroDTO } from '../types/auth';
import type { AxiosResponse } from 'axios';

export const authService = {
  login: (dto: LoginDTO): Promise<AxiosResponse<AuthResponseDTO>> =>
    api.post('/auth/login', dto),

  registrar: (dto: RegistroDTO): Promise<AxiosResponse<AuthResponseDTO>> =>
    api.post('/auth/registrar', dto),
};
