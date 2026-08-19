import { useAuth } from "../contexts/AuthContext";
import { LogOut, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AppHeaderProps {
  totalProdutos: number;
  estoqueBaixo: number;
  esgotados: number;
}

export function AppHeader({
  totalProdutos,
  estoqueBaixo,
  esgotados,
}: AppHeaderProps) {
  const { usuario, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleAuthClick() {
    if (isAuthenticated) {
      if (window.confirm("Deseja sair da sua conta?")) {
        logout();
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }

  const iniciais = usuario?.nome
    ? usuario.nome.trim().slice(0, 3).toUpperCase()
    : "OLÁ";

  return (
    <header className="from-brand-600 to-brand-700 rounded-b-3xl bg-linear-to-br px-5 pt-5 pb-6 text-white">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-xs font-bold">
            {iniciais}
          </div>
          <div>
            <p className="text-sm leading-none font-bold">StockHouse</p>
            <p className="text-[11px] text-white/70">
              Controle de estoque da casa
            </p>
          </div>
        </div>
        <button
          onClick={handleAuthClick}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm"
        >
          {isAuthenticated ? <LogOut size={14} /> : <LogIn size={14} />}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatPill
          valor={totalProdutos}
          label="produtos"
          tone="bg-white/15 text-white"
        />
        <StatPill
          valor={estoqueBaixo}
          label="estoque baixo"
          tone="bg-warn-500 text-white"
        />
        <StatPill
          valor={esgotados}
          label="esgotados"
          tone="bg-danger-500 text-white"
        />
      </div>
    </header>
  );
}

function StatPill({
  valor,
  label,
  tone,
}: {
  valor: number;
  label: string;
  tone: string;
}) {
  return (
    <div className={`rounded-xl px-3 py-2 ${tone}`}>
      <p className="text-lg leading-none font-bold">{valor}</p>
      <p className="mt-1 text-[10px] tracking-wide uppercase opacity-80">
        {label}
      </p>
    </div>
  );
}
