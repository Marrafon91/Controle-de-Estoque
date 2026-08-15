import api from "./axios";
import type { CategoriaDTO } from "../types/categoria";
import type { AxiosResponse } from "axios";

export const categoriaService = {
  listar: (): Promise<AxiosResponse<CategoriaDTO[]>> => api.get("/categorias"),

  buscarPorId: (id: number): Promise<AxiosResponse<CategoriaDTO>> =>
    api.get(`/categorias/${id}`),
};
