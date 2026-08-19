import { Trash2, X } from "lucide-react";
import type { ProdutoDTO } from "../types/produto";

interface ConfirmarExclusaoModalProps {
  produto: ProdutoDTO;
  carregando: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ConfirmarExclusaoModal({
  produto,
  carregando,
  onConfirmar,
  onCancelar,
}: ConfirmarExclusaoModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onCancelar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl bg-white p-5 pb-8 sm:rounded-3xl sm:pb-5"
      >
        {/* CABEÇALHO */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">
            Excluir produto
          </h3>

          <button
            type="button"
            onClick={onCancelar}
            disabled={carregando}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={14} />
          </button>
        </div>

        {/* CONTEÚDO */}
        <div className="mb-5 flex flex-col items-center text-center">
          <div className="bg-danger-100 text-danger-600 mb-3 flex h-12 w-12 items-center justify-center rounded-full">
            <Trash2 size={22} />
          </div>

          <h4 className="text-sm font-bold text-slate-800">
            Excluir "{produto.nome}"?
          </h4>

          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Tem certeza que deseja excluir este produto? Ele não aparecerá mais
            no seu estoque.
          </p>
        </div>

        {/* BOTÕES */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancelar}
            disabled={carregando}
            className="flex-1 cursor-pointer rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirmar}
            disabled={carregando}
            className="bg-danger-600 hover:bg-danger-700 flex-1 cursor-pointer rounded-xl py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {carregando ? "Excluindo…" : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
