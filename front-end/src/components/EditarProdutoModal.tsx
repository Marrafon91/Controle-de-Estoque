import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { produtoService } from "../api/produtoService";
import type { CategoriaDTO } from "../types/categoria";
import type { ApiError } from "../types/error";
import type { ProdutoDTO, ProdutoUpdateDTO, Unidade } from "../types/produto";

interface EditarProdutoModalProps {
  produto: ProdutoDTO;
  categorias: CategoriaDTO[];
  onFechar: () => void;
  onAtualizado: (produto: ProdutoDTO) => void;
}

export function EditarProdutoModal({
  produto,
  categorias,
  onFechar,
  onAtualizado,
}: EditarProdutoModalProps) {
  const [nome, setNome] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  const [unidade, setUnidade] = useState<Unidade>("UN");
  const [quantidadeAtual, setQuantidadeAtual] = useState("");
  const [quantidadeMinima, setQuantidadeMinima] = useState("");
  const [quantidadeIdeal, setQuantidadeIdeal] = useState("");
  const [dataValidade, setDataValidade] = useState("");
  const [ativo, setAtivo] = useState(true);

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  /*
   * Preenche o formulário com os dados
   * do produto selecionado.
   */
  useEffect(() => {
    setNome(produto.nome);
    setCategoriaId(produto.categoriaId);
    setUnidade(produto.unidade);
    setQuantidadeAtual(String(produto.quantidadeAtual));
    setQuantidadeMinima(String(produto.quantidadeMinima));
    setQuantidadeIdeal(String(produto.quantidadeIdeal));
    setDataValidade(produto.dataValidade ?? "");
    setAtivo(produto.ativo);
  }, [produto]);

  async function salvar() {
    if (!nome.trim() || !categoriaId) {
      setErro("Preencha o nome e a categoria.");
      return;
    }

    if (!quantidadeMinima || !quantidadeIdeal) {
      setErro("Preencha a quantidade mínima e a quantidade ideal.");
      return;
    }

    setSalvando(true);
    setErro(null);

    try {
      const dto: ProdutoUpdateDTO = {
        nome: nome.trim(),
        categoriaId,
        unidade,
        quantidadeAtual: Number(quantidadeAtual) || 0,
        quantidadeMinima: Number(quantidadeMinima),
        quantidadeIdeal: Number(quantidadeIdeal),
        ativo,
        dataValidade: dataValidade || undefined,
      };

      const response = await produtoService.atualizar(produto.id, dto);

      onAtualizado(response.data);
    } catch (err) {
      const erro = err as ApiError;

      setErro(erro.mensagem ?? "Não foi possível atualizar o produto.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onFechar}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 pb-8 sm:rounded-3xl sm:pb-5"
      >
        {/* CABEÇALHO */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800">Editar produto</h3>

          <button
            type="button"
            onClick={onFechar}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
          >
            <X size={14} />
          </button>
        </div>

        {/* ERRO */}
        {erro && (
          <div className="bg-danger-100 text-danger-600 mb-3 rounded-xl px-3 py-2 text-xs">
            {erro}
          </div>
        )}

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

            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
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
            Quantidade atual
            <input
              type="number"
              min={0}
              step="0.001"
              value={quantidadeAtual}
              onChange={(e) => setQuantidadeAtual(e.target.value)}
              className="focus:ring-brand-500/30 mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
            />
          </label>

          <label className="block text-xs font-medium text-slate-500">
            Estoque mínimo
            <input
              type="number"
              min={0}
              step="0.001"
              value={quantidadeMinima}
              onChange={(e) => setQuantidadeMinima(e.target.value)}
              className="focus:ring-brand-500/30 mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
            />
          </label>
        </div>

        {/* ESTOQUE IDEAL */}
        <label className="mb-3 block text-xs font-medium text-slate-500">
          Estoque ideal
          <input
            type="number"
            min={0}
            step="0.001"
            value={quantidadeIdeal}
            onChange={(e) => setQuantidadeIdeal(e.target.value)}
            className="focus:ring-brand-500/30 mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
          />
        </label>

        {/* VALIDADE */}
        <label className="mb-3 block text-xs font-medium text-slate-500">
          Data de validade (opcional)
          <input
            type="date"
            value={dataValidade}
            onChange={(e) => setDataValidade(e.target.value)}
            className="focus:ring-brand-500/30 mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:ring-2 focus:outline-none"
          />
        </label>

        {/* ATIVO */}
        <label className="mb-5 flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
            className="accent-brand-600 h-4 w-4 cursor-pointer"
          />
          Produto ativo
        </label>

        {/* BOTÕES */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onFechar}
            disabled={salvando}
            className="flex-1 cursor-pointer rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={salvar}
            disabled={salvando}
            className="bg-brand-600 hover:bg-brand-700 flex-1 cursor-pointer rounded-xl py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {salvando ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
