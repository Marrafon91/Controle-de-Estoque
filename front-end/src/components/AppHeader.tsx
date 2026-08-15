import { Package } from "lucide-react";
import { Link } from "react-router-dom";

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
  return (
    <header className="from-brand-600 to-brand-700 bg-linear-to-br px-5 pt-5 pb-6 text-white">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#BFFE44] text-xs font-bold text-[#1F1F51]">
            <Link to="/">
              <Package />
            </Link>
          </div>
          <div>
            <p className="text-sm leading-none font-bold">StockHouse</p>
            <p className="text-[11px] text-white/70">
              Controle de estoque da casa
            </p>
          </div>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#BFFE44] text-sm text-[#1F1F51]">
          +
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
