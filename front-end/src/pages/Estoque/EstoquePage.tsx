import { useEffect, useMemo, useState } from "react";
import { Edit, Minus, Plus, Search, Trash2 } from "lucide-react";

import { produtoService } from "../../api/produtoService";
import { categoriaService } from "../../api/categoriaService";
import { movimentacaoService } from "../../api/movimentacaoService";

import { AppHeader } from "../../components/AppHeader";
import { EditarProdutoModal } from "../../components/EditarProdutoModal";
import { ConfirmarExclusaoModal } from "../../components/ConfirmarExclusaoModal";

import { diasParaVencer, precisaAlertarValidade } from "../../utils/validade";

import type { ProdutoDTO } from "../../types/produto";
import type { CategoriaDTO } from "../../types/categoria";
import type { ApiError } from "../../types/error";

const STEP_PADRAO = 1;
const LIMITE_POR_PAGINA = 10;

export function EstoquePage() {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);

  const [busca, setBusca] = useState("");

  const [categoriaAtiva, setCategoriaAtiva] = useState<number | "todos">(
    "todos",
  );

  const [erroPorProduto, setErroPorProduto] = useState<Record<number, string>>(
    {},
  );

  // ================================
  // MODAL DE EDIÇÃO
  // ================================

  const [produtoEditando, setProdutoEditando] = useState<ProdutoDTO | null>(
    null,
  );

  // ================================
  // MODAL DE EXCLUSÃO
  // ================================

  const [produtoExcluindo, setProdutoExcluindo] = useState<ProdutoDTO | null>(
    null,
  );

  const [excluindo, setExcluindo] = useState(false);

  // ================================
  // PAGINAÇÃO
  // ================================
  const [offset, setOffset] = useState(0);
  const [temMaisProdutos, setTemMaisProdutos] = useState(true);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true); // ← mudou de false pra true
  const [carregandoMais, setCarregandoMais] = useState(false);

  // ================================
  // CARREGAMENTO INICIAL
  // ================================

  async function carregarDadosIniciais() {
    // removido o setCarregandoProdutos(true) daqui

    try {
      const [produtosResponse, categoriasResponse] = await Promise.all([
        produtoService.listar({
          limite: LIMITE_POR_PAGINA,
          offset: 0,
        }),
        categoriaService.listar(),
      ]);

      const pagina = produtosResponse.data;

      setProdutos(pagina.content);
      setCategorias(categoriasResponse.data);

      // Próximo offset
      setOffset(pagina.content.length);

      // Se for a última página, não mostra "Carregar mais"
      setTemMaisProdutos(!pagina.last);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregandoProdutos(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarDadosIniciais();
  }, []);

  // ================================
  // CARREGAR MAIS
  // ================================

  async function carregarMais() {
    if (carregandoMais || !temMaisProdutos) {
      return;
    }

    setCarregandoMais(true);

    try {
      const response = await produtoService.listar({
        limite: LIMITE_POR_PAGINA,
        offset,
      });

      const pagina = response.data;

      // Adiciona os novos produtos aos antigos
      setProdutos((prev) => [...prev, ...pagina.content]);

      // Avança o offset
      setOffset((prev) => prev + pagina.content.length);

      // Se chegou na última página, esconde o botão
      setTemMaisProdutos(!pagina.last);
    } catch (err) {
      console.error(err);
    } finally {
      setCarregandoMais(false);
    }
  }

  // ================================
  // FILTROS
  // ================================

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      const bateBusca = p.nome.toLowerCase().includes(busca.toLowerCase());

      const bateCategoria =
        categoriaAtiva === "todos" || p.categoriaId === categoriaAtiva;

      return bateBusca && bateCategoria;
    });
  }, [produtos, busca, categoriaAtiva]);

  // ================================
  // INDICADORES
  // ================================

  const totalProdutos = produtos.length;

  const estoqueBaixo = produtos.filter(
    (p) => p.quantidadeAtual < p.quantidadeMinima && p.quantidadeAtual > 0,
  ).length;

  const esgotados = produtos.filter((p) => p.quantidadeAtual <= 0).length;

  // ================================
  // ALTERAR QUANTIDADE
  // ================================

  async function ajustarQuantidade(produto: ProdutoDTO, delta: number) {
    setErroPorProduto((prev) => ({
      ...prev,
      [produto.id]: "",
    }));

    const quantidadeAnterior = produto.quantidadeAtual;

    const novaQuantidade = quantidadeAnterior + delta;

    // Atualização otimista
    setProdutos((prev) =>
      prev.map((p) =>
        p.id === produto.id
          ? {
              ...p,
              quantidadeAtual: novaQuantidade,
            }
          : p,
      ),
    );

    try {
      if (delta > 0) {
        await movimentacaoService.entrada(produto.id, {
          quantidade: Math.abs(delta),
        });
      } else {
        await movimentacaoService.consumo(produto.id, {
          quantidade: Math.abs(delta),
        });
      }
    } catch (err) {
      const erro = err as ApiError;

      // Reverte alteração
      setProdutos((prev) =>
        prev.map((p) =>
          p.id === produto.id
            ? {
                ...p,
                quantidadeAtual: quantidadeAnterior,
              }
            : p,
        ),
      );

      setErroPorProduto((prev) => ({
        ...prev,
        [produto.id]: erro.mensagem ?? "Erro ao atualizar estoque",
      }));
    }
  }

  // ================================
  // SLIDER
  // ================================

  function atualizarLocalmenteDuranteArraste(produtoId: number, valor: number) {
    setProdutos((prev) =>
      prev.map((p) =>
        p.id === produtoId
          ? {
              ...p,
              quantidadeAtual: valor,
            }
          : p,
      ),
    );
  }

  async function ajustarPorSlider(produto: ProdutoDTO, novaQuantidade: number) {
    setErroPorProduto((prev) => ({
      ...prev,
      [produto.id]: "",
    }));

    const quantidadeAnterior = produto.quantidadeAtual;

    try {
      await movimentacaoService.ajuste(produto.id, {
        quantidade: novaQuantidade,
      });
    } catch (err) {
      const erro = err as ApiError;

      setProdutos((prev) =>
        prev.map((p) =>
          p.id === produto.id
            ? {
                ...p,
                quantidadeAtual: quantidadeAnterior,
              }
            : p,
        ),
      );

      setErroPorProduto((prev) => ({
        ...prev,
        [produto.id]: erro.mensagem ?? "Erro ao ajustar estoque",
      }));
    }
  }

  // ================================
  // EDIÇÃO
  // ================================

  function abrirEdicao(produto: ProdutoDTO) {
    setProdutoEditando(produto);
  }

  function fecharEdicao() {
    setProdutoEditando(null);
  }

  function atualizarProdutoNaLista(produtoAtualizado: ProdutoDTO) {
    setProdutos((prev) =>
      prev.map((p) => (p.id === produtoAtualizado.id ? produtoAtualizado : p)),
    );

    setProdutoEditando(null);
  }

  // ================================
  // EXCLUSÃO
  // ================================

  function abrirExclusao(produto: ProdutoDTO) {
    setProdutoExcluindo(produto);
  }

  function fecharExclusao() {
    if (excluindo) {
      return;
    }

    setProdutoExcluindo(null);
  }

  async function confirmarExclusao() {
    if (!produtoExcluindo) {
      return;
    }

    setExcluindo(true);

    try {
      await produtoService.deletar(produtoExcluindo.id);

      // Remove da tela
      setProdutos((prev) => prev.filter((p) => p.id !== produtoExcluindo.id));

      // Remove possível erro antigo
      setErroPorProduto((prev) => {
        const novo = { ...prev };

        delete novo[produtoExcluindo.id];

        return novo;
      });

      // Fecha modal
      setProdutoExcluindo(null);
    } catch (err) {
      const erro = err as ApiError;

      setErroPorProduto((prev) => ({
        ...prev,
        [produtoExcluindo.id]:
          erro.mensagem ?? "Não foi possível excluir o produto.",
      }));
    } finally {
      setExcluindo(false);
    }
  }

  // ================================
  // BADGE
  // ================================

  function statusBadge(p: ProdutoDTO) {
    const dias = diasParaVencer(p.dataValidade);

    if (p.quantidadeAtual <= 0) {
      return {
        texto: "ESGOTADO",
        classe: "bg-danger-100 text-danger-600",
      };
    }

    if (dias !== null && dias <= 7) {
      return {
        texto: dias <= 0 ? "VENCIDO" : `VENCE EM ${dias}D`,
        classe: "bg-danger-100 text-danger-600",
      };
    }

    if (p.quantidadeAtual < p.quantidadeMinima) {
      return {
        texto: "BAIXO",
        classe: "bg-warn-100 text-warn-600",
      };
    }

    return null;
  }

  // ================================
  // JSX
  // ================================

  return (
    <div className="bg-surface min-h-screen pb-24">
      <AppHeader
        totalProdutos={totalProdutos}
        estoqueBaixo={estoqueBaixo}
        esgotados={esgotados}
      />

      <div className="-mt-2 px-5">
        <h2 className="mt-4 mb-3 font-bold text-slate-800">Estoque</h2>

        {/* BUSCA */}

        <div className="relative mb-3">
          <Search
            size={16}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
          />

          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar produto"
            className="focus:ring-brand-500/30 w-full rounded-xl border border-slate-100 bg-white py-2.5 pr-3 pl-9 text-sm focus:ring-2 focus:outline-none"
          />
        </div>

        {/* FILTROS */}

        <div className="relative mb-4">
          <div className="scroll-thin flex gap-2 overflow-x-auto pb-2">
            <FiltroChip
              label="Todos"
              ativo={categoriaAtiva === "todos"}
              onClick={() => setCategoriaAtiva("todos")}
            />

            {categorias.map((c) => (
              <FiltroChip
                key={c.id}
                label={c.nome}
                ativo={categoriaAtiva === c.id}
                onClick={() => setCategoriaAtiva(c.id)}
              />
            ))}
          </div>

          <div className="from-surface pointer-events-none absolute top-0 right-0 bottom-3 w-8 bg-linear-to-l to-transparent" />
        </div>

        {/* CARREGANDO */}

        {carregandoProdutos && (
          <p className="py-6 text-center text-sm text-slate-400">
            Carregando produtos...
          </p>
        )}

        {/* PRODUTOS */}

        {!carregandoProdutos && (
          <>
            <ul className="space-y-3">
              {produtosFiltrados.map((p) => {
                const badge = statusBadge(p);

                const categoriaNome =
                  categorias.find((c) => c.id === p.categoriaId)?.nome ?? "";

                const dias = diasParaVencer(p.dataValidade);

                const alertaValidade =
                  precisaAlertarValidade(p.dataValidade) &&
                  p.quantidadeAtual > 0;

                const corThumb = alertaValidade
                  ? "var(--color-danger-600)"
                  : p.quantidadeAtual <= 0
                    ? "var(--color-danger-600)"
                    : p.quantidadeAtual < p.quantidadeMinima
                      ? "var(--color-warn-600)"
                      : "var(--color-success-600)";

                const corPreenchida = alertaValidade
                  ? "#F43F5E"
                  : p.quantidadeAtual <= 0
                    ? "#F43F5E"
                    : p.quantidadeAtual < p.quantidadeMinima
                      ? "#F59E0B"
                      : "#22C55E";

                const percentual = Math.min(
                  100,
                  (p.quantidadeAtual / p.quantidadeIdeal) * 100,
                );

                return (
                  <li
                    key={p.id}
                    className="rounded-2xl border border-slate-100 bg-white p-4"
                  >
                    {/* CABEÇALHO */}

                    <div className="mb-1 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {p.nome}
                        </p>

                        <p className="text-[11px] text-slate-400">
                          {categoriaNome}

                          {dias !== null && (
                            <span
                              className={
                                alertaValidade
                                  ? "text-danger-600 font-medium"
                                  : ""
                              }
                            >
                              {" · vence em "}
                              {dias < 0 ? "vencido" : `${dias} dias`}
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* BADGE */}

                        {badge && (
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-bold ${badge.classe}`}
                          >
                            {badge.texto}
                          </span>
                        )}

                        {/* EDITAR */}

                        <button
                          type="button"
                          onClick={() => abrirEdicao(p)}
                          title="Editar produto"
                          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
                        >
                          <Edit size={14} />
                        </button>

                        {/* EXCLUIR */}

                        <button
                          type="button"
                          onClick={() => abrirExclusao(p)}
                          title="Excluir produto"
                          className="hover:bg-danger-100 hover:text-danger-600 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* SLIDER */}

                    <input
                      type="range"
                      min={0}
                      max={Math.max(p.quantidadeIdeal, p.quantidadeAtual)}
                      step={1}
                      value={p.quantidadeAtual}
                      className="stock-slider my-3"
                      style={
                        {
                          "--thumb-color": corThumb,
                          background: `linear-gradient(to right, ${corPreenchida} ${percentual}%, #E2E8F0 ${percentual}%)`,
                        } as React.CSSProperties & Record<`--${string}`, string>
                      }
                      onInput={(e) =>
                        atualizarLocalmenteDuranteArraste(
                          p.id,
                          Number(e.currentTarget.value),
                        )
                      }
                      onMouseUp={(e) =>
                        ajustarPorSlider(p, Number(e.currentTarget.value))
                      }
                      onTouchEnd={(e) =>
                        ajustarPorSlider(p, Number(e.currentTarget.value))
                      }
                    />

                    {/* QUANTIDADE */}

                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-sm">
                        <span className="font-bold">{p.quantidadeAtual}</span>

                        <span className="text-slate-400">
                          {" "}
                          {p.unidade} · min {p.quantidadeMinima}
                        </span>
                      </p>

                      <div className="flex items-center gap-2">
                        {/* MENOS */}

                        <button
                          onClick={() => ajustarQuantidade(p, -STEP_PADRAO)}
                          disabled={p.quantidadeAtual <= 0}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Minus size={14} />
                        </button>

                        {/* MAIS */}

                        <button
                          onClick={() => ajustarQuantidade(p, STEP_PADRAO)}
                          className="bg-brand-600 hover:bg-brand-700 flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* ERRO */}

                    {erroPorProduto[p.id] && (
                      <p className="text-danger-600 mt-2 text-[11px]">
                        {erroPorProduto[p.id]}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* NENHUM PRODUTO */}

            {produtosFiltrados.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-sm font-semibold text-slate-500">
                  Nenhum produto encontrado
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Tente outra busca ou categoria.
                </p>
              </div>
            )}

            {/* CARREGAR MAIS */}

            {temMaisProdutos && !busca && categoriaAtiva === "todos" && (
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={carregarMais}
                  disabled={carregandoMais}
                  className="bg-brand-600 hover:bg-brand-700 cursor-pointer rounded-xl px-5 py-2.5 text-xs font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {carregandoMais ? "Carregando..." : "Carregar mais"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ================================
          MODAL DE EDIÇÃO
      ================================= */}

      {produtoEditando && (
        <EditarProdutoModal
          produto={produtoEditando}
          categorias={categorias}
          onFechar={fecharEdicao}
          onAtualizado={atualizarProdutoNaLista}
        />
      )}

      {/* ================================
          MODAL DE CONFIRMAÇÃO DE EXCLUSÃO
      ================================= */}

      {produtoExcluindo && (
        <ConfirmarExclusaoModal
          produto={produtoExcluindo}
          onCancelar={fecharExclusao}
          onConfirmar={confirmarExclusao}
          carregando={excluindo}
        />
      )}
    </div>
  );
}

// ======================================================
// FILTRO CHIP
// ======================================================

function FiltroChip({
  label,
  ativo,
  onClick,
}: {
  label: string;
  ativo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
        ativo
          ? "bg-brand-600 text-white"
          : "border border-slate-100 bg-white text-slate-500"
      }`}
    >
      {label}
    </button>
  );
}
