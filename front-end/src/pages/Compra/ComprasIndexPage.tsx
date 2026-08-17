import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { listaCompraService } from "../../api/listaCompraService";
import type { ApiError } from "../../types/error";

export function ComprasIndexPage() {
  const [listaIdAberta, setListaIdAberta] = useState<number | null | undefined>(
    undefined,
  );
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    listaCompraService
      .listar("ABERTA")
      .then(async (res) => {
        if (res.data.length > 0) {
          const id = res.data[0].id;
          await listaCompraService.sincronizar(id);
          setListaIdAberta(id);
        } else {
          setListaIdAberta(null);
        }
      })
      .catch((err) =>
        setErro(err.mensagem ?? "Não foi possível carregar as listas."),
      );
  }, []);

  async function gerarLista() {
    setGerando(true);
    setErro(null);
    try {
      const res = await listaCompraService.gerar({
        titulo: "Lista de compras",
      });
      setListaIdAberta(res.data.id);
    } catch (err) {
      const erro = err as ApiError;
      setErro(erro.mensagem ?? "Não foi possível gerar a lista.");
    } finally {
      setGerando(false);
    }
  }

  if (listaIdAberta === undefined) {
    return (
      <div className="bg-surface flex min-h-screen items-center justify-center text-sm text-slate-400">
        Carregando…
      </div>
    );
  }

  if (listaIdAberta !== null) {
    return <Navigate to={`/compras/${listaIdAberta}`} replace />;
  }

  return (
    <div className="bg-surface flex min-h-screen flex-col items-center justify-center px-6 pb-24 text-center">
      <p className="mb-1 font-bold text-slate-800">Nenhuma lista aberta</p>
      <p className="mb-5 text-sm text-slate-400">
        Comece uma lista e adicione os itens que precisar comprar.
      </p>
      {erro && <p className="text-danger-600 mb-3 text-xs">{erro}</p>}
      <button
        onClick={gerarLista}
        disabled={gerando}
        className="bg-brand-600 rounded-xl px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {gerando ? "Gerando…" : "Gerar lista de compras"}
      </button>
    </div>
  );
}
