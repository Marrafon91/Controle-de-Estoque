import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import type { ApiError } from "../../types/error";
import { UserRoundPlus } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, carregando } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    try {
      await login({ email, senha });
      navigate("/");
    } catch (err) {
      const erro = err as ApiError;
      setErro(erro.mensagem ?? "E-mail ou senha inválidos.");
    }
  }

  return (
    <div className="bg-surface flex min-h-screen flex-col justify-center px-6 pb-24">
      <div className="mb-8 text-center">
        <div className="bg-brand-600 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold text-white">
          <UserRoundPlus size={22} />
        </div>
        <h1 className="text-xl font-bold text-slate-800">StockHouse</h1>
        <p className="text-xs text-slate-400">Entre para continuar</p>
      </div>

      {erro && (
        <div className="bg-danger-100 text-danger-600 mb-4 rounded-xl px-3 py-2 text-xs">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="mx-auto w-full max-w-md space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            className="focus:ring-brand-500/30 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:ring-2 focus:outline-none"
          />
          <input
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            className="focus:ring-brand-500/30 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:ring-2 focus:outline-none"
          />

          <button
            type="submit"
            disabled={carregando}
            className="bg-brand-600 hover:bg-brand-700 w-full rounded-xl py-3 text-sm font-semibold text-white transition-colors disabled:opacity-50"
          >
            {carregando ? "Entrando…" : "Entrar"}
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-xs text-slate-400">
        Não tem conta?{" "}
        <Link to="/registro" className="text-brand-600 font-semibold">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
