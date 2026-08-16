import api from "./axios";
import type {
  ListaCompraDTO,
  ListaCompraGerarDTO,
  ListaCompraItemInsertDTO,
  ListaCompraItemUpdateDTO,
  StatusListaCompra,
} from "../types/listaCompra";
import type { AxiosResponse } from "axios";

export const listaCompraService = {
  gerar: (dto: ListaCompraGerarDTO): Promise<AxiosResponse<ListaCompraDTO>> =>
    api.post("/listas/gerar", dto),

  adicionarItem: ( listaId: number, dto: ListaCompraItemInsertDTO): Promise<AxiosResponse<ListaCompraDTO>> =>
    api.post(`/listas/${listaId}/itens`, dto),

  sincronizar: (id: number): Promise<AxiosResponse<ListaCompraDTO>> =>
    api.post(`/listas/${id}/sincronizar`),

  buscarPorId: (id: number): Promise<AxiosResponse<ListaCompraDTO>> =>
    api.get(`/listas/${id}`),

  atualizarItem: (
    listaId: number,
    itemId: number,
    dto: ListaCompraItemUpdateDTO,
  ): Promise<AxiosResponse<ListaCompraDTO>> =>
    api.patch(`/listas/${listaId}/itens/${itemId}`, dto),

  finalizar: (id: number): Promise<AxiosResponse<ListaCompraDTO>> =>
    api.post(`/listas/${id}/finalizar`),

  cancelar: (id: number): Promise<AxiosResponse<ListaCompraDTO>> =>
    api.post(`/listas/${id}/cancelar`),

  listar: (
    status?: StatusListaCompra,
  ): Promise<AxiosResponse<ListaCompraDTO[]>> =>
    api.get("/listas", { params: status ? { status } : undefined }),
};
