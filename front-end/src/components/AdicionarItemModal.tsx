import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { produtoService } from "../api/produtoService";
import { categoriaService } from "../api/categoriaService";
import type { CategoriaDTO } from "../types/categoria";
import type { ApiError } from "../types/error";
import type { Unidade } from "../types/produto";

interface AdicionarItemModalProps {
  onConfirmar: (produtoId: number) => Promise<void>;
  onFechar: () => void;
}

export function AdicionarItemModal({
  onConfirmar,
  onFechar,
}: AdicionarItemModalProps) {
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [nome, setNome] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  const [unidade, setUnidade] = useState<Unidade>("UN");
  const [quantidade, setQuantidade] = useState("");
  const [estoqueMinimo, setEstoqueMinimo] = useState("");
  const [dataValidade, setDataValidade] = useState("");

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    setCarregandoCategorias(true);

    try {
      const res = await categoriaService.listar();
      setCategorias(res.data);
    } catch (err) {
      const erro = err as ApiError;

      setErro(erro.mensagem ?? "Não foi possível carregar as categorias.");
    } finally {
      setCarregandoCategorias(false);
    }
  }

  async function criarCategoriasPadrao() {
    setEnviando(true);
    setErro(null);

    try {
      await categoriaService.semearPadrao();
      await carregarCategorias();
    } catch (err) {
      const erro = err as ApiError;

      setErro(erro.mensagem ?? "Não foi possível criar as categorias.");
    } finally {
      setEnviando(false);
    }
  }

  async function confirmar() {
    if (!nome.trim() || !categoriaId || !estoqueMinimo) {
      setErro("Preencha nome, categoria e estoque mínimo.");
      return;
    }

    setEnviando(true);
    setErro(null);

    try {
      const res = await produtoService.criarRapido({
        nome: nome.trim(),
        categoriaId,
        unidade,
        quantidadeAtual: Number(quantidade) || 0,
        quantidadeMinima: Number(estoqueMinimo),
        dataValidade: dataValidade || undefined,
      });

      await onConfirmar(res.data.id);

      onFechar();
    } catch (err) {
      const erro = err as ApiError;

      setErro(erro.mensagem ?? "Não foi possível criar o produto.");
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
          <h3 className="text-base font-bold text-slate-800">Adicionar item</h3>

          <button
            onClick={onFechar}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
          >
            <X size={14} />
          </button>
        </div>

        {erro && (
          <div className="bg-danger-100 text-danger-600 mb-3 rounded-xl px-3 py-2 text-xs">
            {erro}
          </div>
        )}

        {carregandoCategorias ? (
          <p className="py-6 text-center text-sm text-slate-400">Carregando…</p>
        ) : categorias.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center">
            <p className="text-sm font-semibold text-slate-500">
              Nenhuma categoria cadastrada
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Crie as categorias padrão pra começar a adicionar produtos.
            </p>

            <button
              onClick={criarCategoriasPadrao}
              disabled={enviando}
              className="bg-brand-600 mt-3 cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              {enviando ? "Criando…" : "Criar categorias padrão"}
            </button>
          </div>
        ) : (
          <>
            {/* CATEGORIA */}
            <label className="mb-3 block text-sm font-medium text-slate-700">
              Categoria
              <select
                value={categoriaId}
                onChange={(e) =>
                  setCategoriaId(e.target.value ? Number(e.target.value) : "")
                }
                className="focus:ring-brand-500/30 mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
              >
                <option value="">Selecione a categoria</option>

                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </label>

            {/* PRODUTO */}
            <label className="mb-3 block text-sm font-medium text-slate-700">
              Produto
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome do produto"
                className="focus:ring-brand-500/30 mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
              />
            </label>

            {/* UNIDADE */}
            <label className="mb-3 block text-sm font-medium text-slate-700">
              Unidade
              <select
                value={unidade}
                onChange={(e) => setUnidade(e.target.value as Unidade)}
                className="focus:ring-brand-500/30 mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
              >
                <option value="UN">Unidade (UN)</option>
                <option value="KG">Quilograma (KG)</option>
                <option value="G">Grama (G)</option>
                <option value="L">Litro (L)</option>
                <option value="ML">Mililitro (ML)</option>
                <option value="PCT">Pacote (PCT)</option>
              </select>
            </label>

            {/* QUANTIDADES */}
            <div className="mb-3 grid grid-cols-2 gap-3">
              <label className="block text-xs font-medium text-slate-500">
                Quantidade
                <input
                  type="number"
                  min={0}
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  placeholder="0"
                  className="focus:ring-brand-500/30 mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
                />
              </label>

              <label className="block text-xs font-medium text-slate-500">
                Estoque mínimo
                <input
                  type="number"
                  min={0}
                  value={estoqueMinimo}
                  onChange={(e) => setEstoqueMinimo(e.target.value)}
                  placeholder="0"
                  className="focus:ring-brand-500/30 mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
                />
              </label>
            </div>

            {/* VALIDADE */}
            <label className="mb-5 block text-xs font-medium text-slate-500">
              Data de validade (opcional)
              <input
                type="date"
                value={dataValidade}
                onChange={(e) => setDataValidade(e.target.value)}
                className="focus:ring-brand-500/30 mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:ring-2 focus:outline-none"
              />
            </label>

            {/* BOTÕES */}
            <div className="flex gap-3">
              <button
                onClick={onFechar}
                className="flex-1 cursor-pointer rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Cancelar
              </button>

              <button
                onClick={confirmar}
                disabled={enviando}
                className="bg-brand-600 hover:bg-brand-700 flex-1 cursor-pointer rounded-xl py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
              >
                {enviando ? "Adicionando…" : "Confirmar"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
