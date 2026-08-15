import api from "./axios";
import type {
  ProdutoDTO,
  ProdutoInsertDTO,
  ProdutoUpdateDTO,
} from "../types/produto";
import type { PageResponse } from "../types/page";
import type { AxiosResponse } from "axios";

interface ListarProdutosParams {
  categoriaId?: number;
  abaixoMinimo?: boolean;
  busca?: string;
  ordenarPor?: string;
  page?: number;
  size?: number;
}

export const produtoService = {
  listar: (
    params?: ListarProdutosParams,
  ): Promise<AxiosResponse<PageResponse<ProdutoDTO>>> =>
    api.get("/produtos", { params }),

  buscarPorId: (id: number): Promise<AxiosResponse<ProdutoDTO>> =>
    api.get(`/produtos/${id}`),

  criar: (dto: ProdutoInsertDTO): Promise<AxiosResponse<ProdutoDTO>> =>
    api.post("/produtos", dto),

  atualizar: (
    id: number,
    dto: ProdutoUpdateDTO,
  ): Promise<AxiosResponse<ProdutoDTO>> => api.put(`/produtos/${id}`, dto),

  deletar: (id: number): Promise<AxiosResponse<void>> =>
    api.delete(`/produtos/${id}`),
};
