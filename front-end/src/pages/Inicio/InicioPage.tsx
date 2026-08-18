import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, ClipboardList } from "lucide-react";
import { produtoService } from "../../api/produtoService";
import { categoriaService } from "../../api/categoriaService";
import { AppHeader } from "../../components/AppHeader";
import type { ProdutoDTO } from "../../types/produto";
import type { CategoriaDTO } from "../../types/categoria";
import { diasParaVencer } from "../../utils/validade";
import Button from "../../components/Button";

function badgeStatus(p: ProdutoDTO) {
  const dias = diasParaVencer(p.dataValidade);

  if (p.quantidadeAtual <= 0) {
    return { texto: "ESGOTADO", classe: "bg-danger-100 text-danger-600" };
  }
  if (dias !== null && dias <= 7) {
    return {
      texto: dias <= 0 ? "VENCIDO" : `VENCE EM ${dias}D`,
      classe: "bg-danger-100 text-danger-600",
    };
  }
  return { texto: "BAIXO", classe: "bg-warn-100 text-warn-600" };
}

export function InicioPage() {
  const [produtos, setProdutos] = useState<ProdutoDTO[]>([]);
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      produtoService.listar({ size: 100 }),
      categoriaService.listar(),
    ])
      .then(([resProdutos, resCategorias]) => {
        setProdutos(resProdutos.data.content);
        setCategorias(resCategorias.data);
      })
      .catch((err) =>
        setErro(err.mensagem ?? "Não foi possível carregar os dados."),
      )
      .finally(() => setCarregando(false));
  }, []);

  const precisamAtencao = produtos.filter(
    (p) => p.quantidadeAtual < p.quantidadeMinima,
  );
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
        <p className="mt-4 text-lg font-bold text-slate-800">Olá 👋</p>
        <p className="mb-4 text-xs text-slate-400">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "short",
            day: "2-digit",
            month: "short",
          })}
        </p>

        {erro && (
          <div className="bg-danger-100 text-danger-600 mb-3 rounded-xl px-3 py-2 text-xs">
            {erro}
          </div>
        )}

        {carregando ? (
          <p className="text-sm text-slate-400">Carregando…</p>
        ) : precisamAtencao.length > 0 ? (
          <>
            <div className="mb-4 rounded-2xl border border-slate-100 bg-white p-3">
              <div className="mb-3 flex items-center justify-between px-1">
                <p className="text-sm font-semibold text-slate-700">
                  Precisa de atenção
                </p>
                <span className="bg-danger-100 text-danger-600 rounded-full px-2 py-0.5 text-[11px] font-bold">
                  {precisamAtencao.length} itens
                </span>
              </div>

              <div className="scroll-thin-y flex max-h-72 flex-col divide-y divide-slate-100 overflow-y-auto">
                {precisamAtencao.map((p) => {
                  const badge = badgeStatus(p);
                  const dias = diasParaVencer(p.dataValidade);
                  return (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 px-1 py-3"
                    >
                      <div className="bg-brand-100 text-brand-600 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold">
                        {p.nome.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {p.nome}
                        </p>
                        <p className="truncate text-[11px] text-slate-400">
                          {categorias.find((c) => c.id === p.categoriaId)
                            ?.nome ?? ""}
                          {dias !== null &&
                            ` · vence em ${dias < 0 ? "vencido" : `${dias} dias`}`}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.classe}`}
                      >
                        {badge.texto}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Link
              to="/compras"
              className="bg-brand-50 text-brand-700 mb-6 block rounded-xl py-2.5 text-center text-sm font-semibold"
            >
              Ver lista de compras
            </Link>
          </>
        ) : (
          <div className="mb-6 rounded-xl border border-dashed border-slate-200 py-10 text-center">
            <p className="text-sm font-semibold text-slate-500">
              Tudo em ordem
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Nenhum produto abaixo do mínimo.
            </p>
          </div>
        )}

        <div className="mb-6 grid grid-cols-2 gap-3">
          <Button to="/estoque" variant="entrada">
            <PlusCircle size={22} />

            <span className="text-center text-xs leading-tight font-semibold">
              Nova entrada
              <br />
              no estoque
            </span>
          </Button>

          <Button to="/estoque" variant="registro">
            <ClipboardList size={22} />

            <span className="text-center text-xs leading-tight font-semibold">
              Registrar
              <br />
              consumo
            </span>
          </Button>
        </div>

        <p className="mb-2 text-sm font-semibold text-slate-700">
          Por categoria
        </p>

        <div className="grid grid-cols-2 gap-2 pb-3">
          {categorias.map((c) => {
            const count = produtos.filter((p) => p.categoriaId === c.id).length;

            return (
              <div
                key={c.id}
                className="min-w-0 flex-1 rounded-xl border border-slate-100 bg-white px-2 py-2.5"
              >
                <p className="truncate text-xs font-semibold text-slate-700">
                  {c.nome}
                </p>
                <p className="text-[11px] text-slate-400">{count} itens</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
