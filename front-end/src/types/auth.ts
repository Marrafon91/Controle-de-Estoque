export interface LoginDTO {
  email: string;
  senha: string;
}

export interface RegistroDTO {
  nome: string;
  email: string;
  senha: string;
}

export interface AuthResponseDTO {
  token: string;
  usuarioId: number;
  nome: string;
  email: string;
}
