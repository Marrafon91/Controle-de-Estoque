import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, Info, Minus, Plus } from "lucide-react";
import { listaCompraService } from "../../api/listaCompraService";
import type {
  ListaCompraDTO,
  ListaCompraItemDTO,
} from "../../types/listaCompra";

export function ListaComprasPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const listaId = id ? Number(id) : null;

  const [lista, setLista] = useState<ListaCompraDTO | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [erroPorItem, setErroPorItem] = useState<Record<number, string>>({});

  useEffect(() => {
    if (listaId) {
      carregarLista(listaId);
    }
  }, [listaId]);

  async function carregarLista(id: number) {
    try {
      const res = await listaCompraService.buscarPorId(id);
      setLista(res.data);
    } catch (err: any) {
      setErro(err.mensagem ?? "Não foi possível carregar a lista.");
    }
  }

  async function alterarQuantidade(item: ListaCompraItemDTO, delta: number) {
    if (!lista) return;
    setErroPorItem((prev) => ({ ...prev, [item.id]: "" }));

    const quantidadeAtual = item.quantidadeComprada ?? 0;
    const novaQuantidade = Math.max(0, quantidadeAtual + delta);
    const comprado = novaQuantidade > 0;

    // atualização otimista
    setLista({
      ...lista,
      itens: lista.itens.map((i) =>
        i.id === item.id
          ? { ...i, quantidadeComprada: novaQuantidade, comprado }
          : i,
      ),
    });

    try {
      await listaCompraService.atualizarItem(lista.id, item.id, {
        comprado,
        quantidadeComprada: novaQuantidade,
      });
    } catch (err: any) {
      setErroPorItem((prev) => ({
        ...prev,
        [item.id]: err.mensagem ?? "Não foi possível atualizar o item.",
      }));
      carregarLista(lista.id); // reverte buscando o estado real do backend
    }
  }

  if (!listaId) {
    return (
      <div className="bg-surface text-danger-600 flex min-h-screen items-center justify-center text-sm">
        Lista inválida.
      </div>
    );
  }

  if (!lista) {
    return (
      <div className="bg-surface flex min-h-screen items-center justify-center text-sm text-slate-400">
        Carregando…
      </div>
    );
  }

  const pendentes = lista.itens.filter((i) => !i.comprado).length;

  return (
    <div className="bg-surface min-h-screen px-5 pt-6 pb-24">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Lista de compras</h2>
        <span className="text-xs text-slate-400">{pendentes} pendentes</span>
      </div>

      {erro && (
        <div className="bg-danger-100 text-danger-600 mb-3 rounded-xl px-3 py-2 text-xs">
          {erro}
        </div>
      )}

      <div className="bg-brand-50 text-brand-700 mb-4 flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs">
        <Info size={14} className="mt-0.5 shrink-0" />
        <p>
          Use o + para definir quantos você vai comprar de cada item. Assim que
          a quantidade sair de zero, o item já fica marcado como comprado.
        </p>
      </div>

      <ul className="mb-6 space-y-2">
        {lista.itens.map((item) => {
          const quantidadeAtual = item.quantidadeComprada ?? 0;

          return (
            <li
              key={item.id}
              className={`rounded-2xl border px-4 py-3 transition-colors ${
                item.comprado
                  ? "border-success-500/30 bg-success-500/5"
                  : "border-slate-100 bg-white"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.comprado && (
                    <span className="bg-success-500 flex h-4 w-4 items-center justify-center rounded-full text-white">
                      <Check size={11} strokeWidth={3} />
                    </span>
                  )}
                  <span
                    className={`text-sm font-medium ${
                      item.comprado ? "text-slate-700" : "text-slate-700"
                    }`}
                  >
                    {item.produtoNome}
                  </span>
                </div>
                <span className="bg-brand-100 text-brand-600 shrink-0 rounded-full px-2 py-1 text-[10px] font-bold">
                  AUTO
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-[11px] text-slate-400">
                  sugerido: {item.quantidadeSugerida}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alterarQuantidade(item, -1)}
                    disabled={quantidadeAtual <= 0}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200 disabled:opacity-40"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-slate-800">
                    {quantidadeAtual}
                  </span>
                  <button
                    onClick={() => alterarQuantidade(item, 1)}
                    className="bg-brand-600 hover:bg-brand-700 flex h-7 w-7 items-center justify-center rounded-full text-white transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>

              {erroPorItem[item.id] && (
                <p className="text-danger-600 mt-2 text-[11px]">
                  {erroPorItem[item.id]}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {lista.status === "ABERTA" && (
        <button
          onClick={async () => {
            try {
              await listaCompraService.finalizar(lista.id);
              navigate("/estoque");
            } catch (err: any) {
              setErro(err.mensagem ?? "Não foi possível finalizar a lista.");
            }
          }}
          className="bg-success-600 w-full rounded-xl py-3 text-sm font-semibold text-white"
        >
          Finalizar compra e dar entrada no estoque
        </button>
      )}
    </div>
  );
}
