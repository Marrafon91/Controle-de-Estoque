import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, Search } from "lucide-react";
import { produtoService } from "../../api/produtoService";
import { categoriaService } from "../../api/categoriaService";
import { movimentacaoService } from "../../api/movimentacaoService";
import { AppHeader } from "../../components/AppHeader";
import type { ProdutoDTO } from "../../types/produto";
import type { CategoriaDTO } from "../../types/categoria";

const STEP_PADRAO = 1;

function statusBadge(atual: number, minima: number) {
  if (atual <= 0)
    return { texto: "ESGOTADO", classe: "bg-danger-100 text-danger-600" };
  if (atual < minima)
    return { texto: "BAIXO", classe: "bg-warn-100 text-warn-600" };
  return null;
}

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

  useEffect(() => {
    produtoService
      .listar({ size: 100 })
      .then((r) => setProdutos(r.data.content));
    categoriaService.listar().then((r) => setCategorias(r.data));
  }, []);

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      const bateBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
      const bateCategoria =
        categoriaAtiva === "todos" || p.categoriaId === categoriaAtiva;
      return bateBusca && bateCategoria;
    });
  }, [produtos, busca, categoriaAtiva]);

  const totalProdutos = produtos.length;
  const estoqueBaixo = produtos.filter(
    (p) => p.quantidadeAtual < p.quantidadeMinima && p.quantidadeAtual > 0,
  ).length;
  const esgotados = produtos.filter((p) => p.quantidadeAtual <= 0).length;

  async function ajustarQuantidade(produto: ProdutoDTO, delta: number) {
    setErroPorProduto((prev) => ({ ...prev, [produto.id]: "" }));
    const quantidadeAnterior = produto.quantidadeAtual;
    const novaQuantidade = quantidadeAnterior + delta;

    // atualização otimista
    setProdutos((prev) =>
      prev.map((p) =>
        p.id === produto.id ? { ...p, quantidadeAtual: novaQuantidade } : p,
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
    } catch (err: any) {
      // reverte em caso de erro (ex: estoque insuficiente)
      setProdutos((prev) =>
        prev.map((p) =>
          p.id === produto.id
            ? { ...p, quantidadeAtual: quantidadeAnterior }
            : p,
        ),
      );
      setErroPorProduto((prev) => ({
        ...prev,
        [produto.id]: err.mensagem ?? "Erro ao atualizar estoque",
      }));
    }
  }

  function atualizarLocalmenteDurranteArraste(
    produtoId: number,
    valor: number,
  ) {
    setProdutos((prev) =>
      prev.map((p) =>
        p.id === produtoId ? { ...p, quantidadeAtual: valor } : p,
      ),
    );
  }

  async function ajustarPorSlider(produto: ProdutoDTO, novaQuantidade: number) {
    setErroPorProduto((prev) => ({ ...prev, [produto.id]: "" }));
    const quantidadeAnterior = produto.quantidadeAtual;

    try {
      await movimentacaoService.ajuste(produto.id, {
        quantidade: novaQuantidade,
      });
    } catch (err: any) {
      setProdutos((prev) =>
        prev.map((p) =>
          p.id === produto.id
            ? { ...p, quantidadeAtual: quantidadeAnterior }
            : p,
        ),
      );
      setErroPorProduto((prev) => ({
        ...prev,
        [produto.id]: err.mensagem ?? "Erro ao ajustar estoque",
      }));
    }
  }

  return (
    <div className="bg-surface min-h-screen pb-24">
      <AppHeader
        totalProdutos={totalProdutos}
        estoqueBaixo={estoqueBaixo}
        esgotados={esgotados}
      />

      <div className="-mt-2 px-5">
        <h2 className="mt-4 mb-3 font-bold text-slate-800">Estoque</h2>

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
          <div className="from-surface pointer-events-none absolute top-0 right-0 bottom-3 w-8 bg-gradient-to-l to-transparent" />
        </div>

        <ul className="space-y-3">
          {produtosFiltrados.map((p) => {
            const badge = statusBadge(p.quantidadeAtual, p.quantidadeMinima);
            const categoriaNome =
              categorias.find((c) => c.id === p.categoriaId)?.nome ?? "";

            const corThumb =
              p.quantidadeAtual <= 0
                ? "var(--color-danger-600)"
                : p.quantidadeAtual < p.quantidadeMinima
                  ? "var(--color-warn-600)"
                  : "var(--color-success-600)";

            const percentual = Math.min(
              100,
              (p.quantidadeAtual / p.quantidadeIdeal) * 100,
            );
            const corPreenchida =
              p.quantidadeAtual <= 0
                ? "#F43F5E"
                : p.quantidadeAtual < p.quantidadeMinima
                  ? "#F59E0B"
                  : "#22C55E";

            return (
              <li
                key={p.id}
                className="rounded-2xl border border-slate-100 bg-white p-4"
              >
                <div className="mb-1 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {p.nome}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {categoriaNome}
                    </p>
                  </div>
                  {badge && (
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-bold ${badge.classe}`}
                    >
                      {badge.texto}
                    </span>
                  )}
                </div>

                <input
                  type="range"
                  min={0}
                  max={Math.max(p.quantidadeIdeal, p.quantidadeAtual)}
                  step={1}
                  value={p.quantidadeAtual}
                  className="stock-slider my-3"
                  style={{
                    ["--thumb-color" as any]: corThumb,
                    background: `linear-gradient(to right, ${corPreenchida} ${percentual}%, #E2E8F0 ${percentual}%)`,
                  }}
                  onInput={(e) =>
                    atualizarLocalmenteDurranteArraste(
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

                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm">
                    <span className="font-bold">{p.quantidadeAtual}</span>
                    <span className="text-slate-400">
                      {" "}
                      {p.unidade.toLowerCase()} · min {p.quantidadeMinima}
                    </span>
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => ajustarQuantidade(p, -STEP_PADRAO)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200"
                    >
                      <Minus size={14} />
                    </button>
                    <button
                      onClick={() => ajustarQuantidade(p, STEP_PADRAO)}
                      className="bg-brand-600 hover:bg-brand-700 flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {erroPorProduto[p.id] && (
                  <p className="text-danger-600 mt-2 text-[11px]">
                    {erroPorProduto[p.id]}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

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
