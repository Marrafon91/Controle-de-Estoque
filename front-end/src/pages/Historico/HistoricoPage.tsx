import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import { movimentacaoService } from "../../api/movimentacaoService";
import { produtoService } from "../../api/produtoService";
import { AppHeader } from "../../components/AppHeader";
import type { MovimentacaoDTO } from "../../types/movimentacao";
import type { ProdutoDTO } from "../../types/produto";

interface MovimentacaoComProduto extends MovimentacaoDTO {
  produtoNome: string;
}

function formatarData(iso: string): string {
  const data = new Date(iso);
  const hoje = new Date();
  const ontem = new Date(hoje);
  ontem.setDate(hoje.getDate() - 1);

  const mesmaData = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const hora = data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (mesmaData(data, hoje)) return `hoje, ${hora}`;
  if (mesmaData(data, ontem)) return `ontem, ${hora}`;
  return `${data.toLocaleDateString("pt-BR")}, ${hora}`;
}

function isEntrada(tipo: MovimentacaoDTO["tipo"]) {
  return tipo === "ENTRADA";
}

function isAjuste(tipo: MovimentacaoDTO["tipo"]) {
  return tipo === "AJUSTE";
}

function labelTipo(tipo: MovimentacaoDTO["tipo"]) {
  switch (tipo) {
    case "ENTRADA":
      return "Entrada";
    case "SAIDA":
      return "Consumo";
    case "AJUSTE":
      return "Ajuste";
    case "DESCARTE":
      return "Descarte";
  }
}

export function HistoricoPage() {
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoComProduto[]>(
    [],
  );
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    carregarHistorico();
  }, []);

  async function carregarHistorico() {
    setCarregando(true);
    setErro(null);
    try {
      const resProdutos = await produtoService.listar({ size: 100 });
      const listaProdutos = resProdutos.data.content;
      setProdutos(listaProdutos);

      // busca o histórico de cada produto em paralelo e junta tudo numa timeline só
      const resultados = await Promise.all(
        listaProdutos.map((p) =>
          movimentacaoService
            .historico(p.id, { size: 20, ordenarPor: "criado_em" })
            .then((res) =>
              res.data.content.map((m) => ({ ...m, produtoNome: p.nome })),
            ),
        ),
      );

      const todas = resultados
        .flat()
        .sort(
          (a, b) =>
            new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime(),
        );

      setMovimentacoes(todas);
    } catch (err: any) {
      setErro(err.mensagem ?? "Não foi possível carregar o histórico.");
    } finally {
      setCarregando(false);
    }
  }

  const totalProdutos = produtos.length;
  const estoqueBaixo = produtos.filter(
    (p) => p.quantidadeAtual < p.quantidadeMinima && p.quantidadeAtual > 0,
  ).length;
  const esgotados = produtos.filter((p) => p.quantidadeAtual <= 0).length;

  return (
    <div className="bg-surface min-h-screen pb-24">
      <AppHeader
        totalProdutos={totalProdutos}
        estoqueBaixo={estoqueBaixo}
        esgotados={esgotados}
      />

      <div className="-mt-2 px-5">
        <h2 className="mt-4 mb-3 font-bold text-slate-800">Movimentações</h2>

        {erro && (
          <div className="bg-danger-100 text-danger-600 mb-3 rounded-xl px-3 py-2 text-xs">
            {erro}
          </div>
        )}

        {carregando ? (
          <p className="text-sm text-slate-400">Carregando…</p>
        ) : movimentacoes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-16 text-center">
            <p className="text-sm font-semibold text-slate-500">
              Nenhuma movimentação ainda
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Entradas e consumos aparecem aqui.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white">
            {movimentacoes.map((m) => {
              const entrada = isEntrada(m.tipo);
              const ajuste = isAjuste(m.tipo);

              return (
                <li key={m.id} className="flex items-center gap-3 px-4 py-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      ajuste
                        ? "bg-info-600/10 text-info-600"
                        : entrada
                          ? "bg-success-500/10 text-success-600"
                          : "bg-danger-500/10 text-danger-600"
                    }`}
                  >
                    {ajuste ? (
                      <RefreshCw size={15} />
                    ) : entrada ? (
                      <ArrowDown size={16} />
                    ) : (
                      <ArrowUp size={16} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {m.produtoNome}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {labelTipo(m.tipo)} · {formatarData(m.criadoEm)}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 text-sm font-bold ${
                      ajuste
                        ? "text-info-600"
                        : entrada
                          ? "text-success-600"
                          : "text-danger-600"
                    }`}
                  >
                    {ajuste
                      ? `= ${m.quantidade}`
                      : entrada
                        ? `+${m.quantidade}`
                        : `-${m.quantidade}`}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
