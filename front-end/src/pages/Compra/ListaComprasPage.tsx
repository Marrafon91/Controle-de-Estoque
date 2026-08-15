import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Info } from "lucide-react";
import { listaCompraService } from "../../api/listaCompraService";
import type {
  ListaCompraDTO,
  ListaCompraItemDTO,
} from "../../types/listaCompra";

export function ListaComprasPage() {
  const { id } = useParams<{ id: string }>();
  const listaId = id ? Number(id) : null;

  const [lista, setLista] = useState<ListaCompraDTO | null>(null);
  const [erro, setErro] = useState<string | null>(null);

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

  async function alternarComprado(item: ListaCompraItemDTO) {
    if (!lista) return;
    const comprado = !item.comprado;

    setLista({
      ...lista,
      itens: lista.itens.map((i) =>
        i.id === item.id ? { ...i, comprado } : i,
      ),
    });

    try {
      await listaCompraService.atualizarItem(lista.id, item.id, {
        comprado,
        quantidadeComprada: item.quantidadeComprada ?? item.quantidadeSugerida,
      });
    } catch (err: any) {
      setErro(err.mensagem ?? "Não foi possível atualizar o item.");
      carregarLista(lista.id);
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
          Produtos com estoque igual ou abaixo do mínimo entram aqui
          automaticamente. Ao marcar como comprado, gera a entrada no estoque.
        </p>
      </div>

      <ul className="mb-6 space-y-2">
        {lista.itens.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3"
          >
            <label className="flex flex-1 cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={item.comprado}
                onChange={() => alternarComprado(item)}
                className="accent-brand-600 h-4 w-4 rounded"
              />
              <span
                className={`text-sm ${item.comprado ? "text-slate-400 line-through" : "font-medium text-slate-700"}`}
              >
                {item.produtoNome}
              </span>
            </label>
            <span className="text-brand-600 bg-brand-100 rounded-full px-2 py-1 text-[10px] font-bold">
              AUTO
            </span>
          </li>
        ))}
      </ul>

      {lista.status === "ABERTA" && (
        <button
          onClick={async () => {
            try {
              await listaCompraService.finalizar(lista.id);
              carregarLista(lista.id);
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
