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

type Aba = "existente" | "novo";

export function AdicionarItemModal({
  produtosJaNaLista,
  onConfirmar,
  onFechar,
}: AdicionarItemModalProps) {
  const [aba, setAba] = useState<Aba>("existente");
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // aba "existente"
  const [categoriaFiltro, setCategoriaFiltro] = useState<number | "">("");
  const [produtoId, setProdutoId] = useState<number | "">("");

  // aba "novo"
  const [nome, setNome] = useState("");
  const [categoriaNovo, setCategoriaNovo] = useState<number | "">("");
  const [quantidade, setQuantidade] = useState("");
  const [estoqueMinimo, setEstoqueMinimo] = useState("");
  const [dataValidade, setDataValidade] = useState("");

  useEffect(() => {
    produtoService
      .listar({ size: 200 })
      .then((r) => setProdutos(r.data.content));
    categoriaService.listar().then((r) => setCategorias(r.data));
  }, []);

  const produtosDisponiveis = useMemo(() => {
    return produtos.filter(
      (p) =>
        (categoriaFiltro === "" || p.categoriaId === categoriaFiltro) &&
        !produtosJaNaLista.includes(p.id),
    );
  }, [produtos, categoriaFiltro, produtosJaNaLista]);

  async function confirmarExistente() {
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

  async function confirmarNovo() {
    if (!nome.trim() || !categoriaNovo || !estoqueMinimo) {
      setErro("Preencha nome, categoria e estoque mínimo.");
      return;
    }
    setEnviando(true);
    setErro(null);
    try {
      const res = await produtoService.criarRapido({
        nome: nome.trim(),
        categoriaId: categoriaNovo,
        quantidadeAtual: Number(quantidade) || 0,
        quantidadeMinima: Number(estoqueMinimo),
        dataValidade: dataValidade || undefined,
      });
      await onConfirmar(res.data.id);
      onFechar();
    } catch (err: any) {
      setErro(err.mensagem ?? "Não foi possível criar o produto.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onFechar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl bg-white p-5 pb-8 sm:rounded-3xl sm:pb-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">
            {aba === "existente" ? "Adicionar item" : "Novo produto"}
          </h3>
          <button
            onClick={onFechar}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
          >
            <X size={14} />
          </button>
        </div>

        <div className="mb-4 flex gap-2 rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setAba("existente")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors ${
              aba === "existente"
                ? "text-brand-600 bg-white shadow-sm"
                : "text-slate-500"
            }`}
          >
            Produto existente
          </button>
          <button
            onClick={() => setAba("novo")}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors ${
              aba === "novo"
                ? "text-brand-600 bg-white shadow-sm"
                : "text-slate-500"
            }`}
          >
            Criar novo
          </button>
        </div>

        {erro && (
          <div className="bg-danger-100 text-danger-600 mb-3 rounded-xl px-3 py-2 text-xs">
            {erro}
          </div>
        )}

        {aba === "existente" ? (
          <>
            <label className="mb-3 block text-sm font-medium text-slate-700">
              Categoria
              <select
                value={categoriaFiltro}
                onChange={(e) => {
                  setCategoriaFiltro(
                    e.target.value ? Number(e.target.value) : "",
                  );
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
                {produtosDisponiveis.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
              {produtosDisponiveis.length === 0 && (
                <p className="mt-1 text-[11px] text-slate-400">
                  Nenhum produto disponível — tente criar um novo.
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
                onClick={confirmarExistente}
                disabled={enviando || !produtoId}
                className="bg-brand-600 hover:bg-brand-700 flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
              >
                {enviando ? "Adicionando…" : "Confirmar"}
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do produto"
              className="focus:ring-brand-500/30 mb-3 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
            />

            <div className="mb-3 grid grid-cols-2 gap-3">
              <input
                type="number"
                min={0}
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="Quantidade"
                className="focus:ring-brand-500/30 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
              />
              <input
                type="number"
                min={0}
                value={estoqueMinimo}
                onChange={(e) => setEstoqueMinimo(e.target.value)}
                placeholder="Estoque mínimo"
                className="focus:ring-brand-500/30 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
              />
            </div>

            <label className="mb-3 block text-xs font-medium text-slate-500">
              Data de validade (opcional)
              <input
                type="date"
                value={dataValidade}
                onChange={(e) => setDataValidade(e.target.value)}
                className="focus:ring-brand-500/30 mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:ring-2 focus:outline-none"
              />
            </label>

            <div className="scroll-thin mb-5 flex gap-2 overflow-x-auto pb-1">
              {categorias.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoriaNovo(c.id)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    categoriaNovo === c.id
                      ? "bg-brand-600 text-white"
                      : "border border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  {c.nome}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onFechar}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarNovo}
                disabled={enviando}
                className="bg-brand-600 hover:bg-brand-700 flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
              >
                {enviando ? "Criando…" : "Confirmar"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
