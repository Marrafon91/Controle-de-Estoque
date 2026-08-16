import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { produtoService } from "../api/produtoService";
import { categoriaService } from "../api/categoriaService";
import type { ProdutoDTO } from "../types/produto";
import type { CategoriaDTO } from "../types/categoria";

interface AdicionarItemModalProps {
  produtosJaNaLista: number[];
  onConfirmar: (produtoId: number) => Promise<void>;
  onFechar: () => void;
}

export function AdicionarItemModal({
  produtosJaNaLista,
  onConfirmar,
  onFechar,
}: AdicionarItemModalProps) {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  const [produtoId, setProdutoId] = useState<number | "">("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    produtoService
      .listar({ size: 200 })
      .then((r) => setProdutos(r.data.content));
    categoriaService.listar().then((r) => setCategorias(r.data));
  }, []);

  const produtosDaCategoria = useMemo(() => {
    return produtos.filter(
      (p) =>
        (categoriaId === "" || p.categoriaId === categoriaId) &&
        !produtosJaNaLista.includes(p.id),
    );
  }, [produtos, categoriaId, produtosJaNaLista]);

  async function confirmar() {
    if (!produtoId) {
      setErro("Selecione um produto.");
      return;
    }
    setEnviando(true);
    setErro(null);
    try {
      await onConfirmar(produtoId);
      onFechar();
    } catch (err: any) {
      setErro(err.mensagem ?? "Não foi possível adicionar o item.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    // backdrop — clicar aqui fecha o modal
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onFechar}
    >
      {/* stopPropagation: clique DENTRO do card não deve fechar o modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl bg-white p-5 pb-8 sm:rounded-3xl sm:pb-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">Adicionar item</h3>
          <button
            onClick={onFechar}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
          >
            <X size={14} />
          </button>
        </div>

        {erro && (
          <div className="bg-danger-100 text-danger-600 mb-3 rounded-xl px-3 py-2 text-xs">
            {erro}
          </div>
        )}

        <label className="mb-3 block text-sm font-medium text-slate-700">
          Categoria
          <select
            value={categoriaId}
            onChange={(e) => {
              setCategoriaId(e.target.value ? Number(e.target.value) : "");
              setProdutoId("");
            }}
            className="focus:ring-brand-500/30 mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
          >
            <option value="">Todas as categorias</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="mb-5 block text-sm font-medium text-slate-700">
          Produto
          <select
            value={produtoId}
            onChange={(e) =>
              setProdutoId(e.target.value ? Number(e.target.value) : "")
            }
            className="focus:ring-brand-500/30 mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
          >
            <option value="">Selecione um produto</option>
            {produtosDaCategoria.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </select>
          {produtosDaCategoria.length === 0 && (
            <p className="mt-1 text-[11px] text-slate-400">
              Nenhum produto disponível nessa categoria.
            </p>
          )}
        </label>

        <div className="flex gap-3">
          <button
            onClick={onFechar}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={confirmar}
            disabled={enviando || !produtoId}
            className="bg-brand-600 hover:bg-brand-700 flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
          >
            {enviando ? "Adicionando…" : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
