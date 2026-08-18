import { createContext, useContext, useState, type ReactNode } from 'react';
import { authService } from '../api/authService';
import type { LoginDTO, RegistroDTO } from '../types/auth';

interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
}

interface AuthContextType {
  usuario: UsuarioLogado | null;
  isAuthenticated: boolean;
  carregando: boolean;
  login: (dto: LoginDTO) => Promise<void>;
  registrar: (dto: RegistroDTO) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function lerUsuarioSalvo(): UsuarioLogado | null {
  const raw = localStorage.getItem('usuario');
  return raw ? JSON.parse(raw) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(lerUsuarioSalvo());
  const [carregando, setCarregando] = useState(false);

  function persistir(token: string, usuarioId: number, nome: string, email: string) {
    const dadosUsuario = { id: usuarioId, nome, email };
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(dadosUsuario));
    setUsuario(dadosUsuario);
  }

  async function login(dto: LoginDTO) {
    setCarregando(true);
    try {
      const res = await authService.login(dto);
      persistir(res.data.token, res.data.usuarioId, res.data.nome, res.data.email);
    } finally {
      setCarregando(false);
    }
  }

  async function registrar(dto: RegistroDTO) {
    setCarregando(true);
    try {
      const res = await authService.registrar(dto);
      persistir(res.data.token, res.data.usuarioId, res.data.nome, res.data.email);
    } finally {
      setCarregando(false);
    }
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{ usuario, isAuthenticated: !!usuario, carregando, login, registrar, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de um AuthProvider');
  }
  return context;
}
