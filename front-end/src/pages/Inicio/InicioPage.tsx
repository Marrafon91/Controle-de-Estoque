import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, ClipboardList } from "lucide-react";
import { produtoService } from "../../api/produtoService";
import { categoriaService } from "../../api/categoriaService";
import { AppHeader } from "../../components/AppHeader";
import type { ProdutoDTO } from "../../types/produto";
import type { CategoriaDTO } from "../../types/categoria";

function badgeStatus(p: ProdutoDTO) {
  if (p.quantidadeAtual <= 0)
    return { texto: "ESGOTADO", classe: "bg-danger-100 text-danger-600" };
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
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">
                Precisa de atenção
              </p>
              <span className="text-[11px] text-slate-400">
                {precisamAtencao.length} itens
              </span>
            </div>

            <div className="relative mb-4">
              <div className="scroll-thin -mx-5 flex gap-3 overflow-x-auto px-5 pb-3">
                {precisamAtencao.map((p) => {
                  const badge = badgeStatus(p);
                  return (
                    <div
                      key={p.id}
                      className="min-w-45 shrink-0 rounded-2xl border border-slate-100 bg-white p-3"
                    >
                      <div className="mb-1 flex items-start justify-between">
                        <div className="bg-brand-100 text-brand-600 flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold">
                          {p.nome.charAt(0)}
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.classe}`}
                        >
                          {badge.texto}
                        </span>
                      </div>
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {p.nome}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {p.quantidadeAtual} {p.unidade.toLowerCase()} · min{" "}
                        {p.quantidadeMinima}
                      </p>
                    </div>
                  );
                })}
              </div>
              {/* <div className="from-surface pointer-events-none absolute top-0 right-5 bottom-4 w-8 bg-linear-to-l to-transparent" /> */}
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
          <Link
            to="/estoque"
            className="bg-success-500 flex flex-col items-center justify-center gap-1.5 rounded-2xl py-5 text-white"
          >
            <PlusCircle size={22} />
            <span className="text-center text-xs leading-tight font-semibold">
              Nova entrada
              <br />
              no estoque
            </span>
          </Link>
          <Link
            to="/estoque"
            className="bg-info-600 flex flex-col items-center justify-center gap-1.5 rounded-2xl py-5 text-white"
          >
            <ClipboardList size={22} />
            <span className="text-center text-xs leading-tight font-semibold">
              Registrar
              <br />
              consumo
            </span>
          </Link>
        </div>

        <p className="mb-2 text-sm font-semibold text-slate-700">
          Por categoria
        </p>
        <div className="relative">
          <div className="scroll-thin flex gap-2 overflow-x-auto pb-3">
            {categorias.map((c) => {
              const count = produtos.filter(
                (p) => p.categoriaId === c.id,
              ).length;
              return (
                <div
                  key={c.id}
                  className="min-w-27.5 shrink-0 rounded-xl border border-slate-100 bg-white px-3 py-2.5"
                >
                  <p className="truncate text-xs font-semibold text-slate-700">
                    {c.nome}
                  </p>
                  <p className="text-[11px] text-slate-400">{count} itens</p>
                </div>
              );
            })}
          </div>
          <div className="from-surface pointer-events-none absolute top-0 right-0 bottom-4 w-8 bg-linear-to-l to-transparent" />
        </div>
      </div>
    </div>
  );
}
