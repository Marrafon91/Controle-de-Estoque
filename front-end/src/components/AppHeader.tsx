interface AppHeaderProps {
  totalProdutos: number;
  estoqueBaixo: number;
  esgotados: number;
}

export function AppHeader({ totalProdutos, estoqueBaixo, esgotados }: AppHeaderProps) {
  return (
    <header className="bg-linear-to-br from-brand-600 to-brand-700 px-5 pt-5 pb-6 text-white">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-xs font-bold">
            GUI
          </div>
          <div>
            <p className="font-bold text-sm leading-none">StockHouse</p>
            <p className="text-[11px] text-white/70">Controle de estoque da casa</p>
          </div>
        </div>
        <button className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm">+</button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatPill valor={totalProdutos} label="produtos" tone="bg-white/15 text-white" />
        <StatPill valor={estoqueBaixo} label="estoque baixo" tone="bg-warn-500 text-white" />
        <StatPill valor={esgotados} label="esgotados" tone="bg-danger-500 text-white" />
      </div>
    </header>
  );
}

function StatPill({ valor, label, tone }: { valor: number; label: string; tone: string }) {
  return (
    <div className={`rounded-xl px-3 py-2 ${tone}`}>
      <p className="text-lg font-bold leading-none">{valor}</p>
      <p className="text-[10px] uppercase tracking-wide opacity-80 mt-1">{label}</p>
    </div>
  );
}
