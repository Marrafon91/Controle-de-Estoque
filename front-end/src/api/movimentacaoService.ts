import api from './axios';
import type { MovimentacaoDTO, MovimentacaoInsertDTO, TipoMovimentacao } from '../types/movimentacao';
import type { PageResponse } from '../types/page';
import type { AxiosResponse } from 'axios';

interface HistoricoParams {
  tipo?: TipoMovimentacao;
  ordenarPor?: string;
  page?: number;
  size?: number;
}

export const movimentacaoService = {
  entrada: (produtoId: number, dto: MovimentacaoInsertDTO): Promise<AxiosResponse<MovimentacaoDTO>> =>
    api.post(`/produtos/${produtoId}/entrada`, dto),

  consumo: (produtoId: number, dto: MovimentacaoInsertDTO): Promise<AxiosResponse<MovimentacaoDTO>> =>
    api.post(`/produtos/${produtoId}/consumo`, dto),

  descarte: (produtoId: number, dto: MovimentacaoInsertDTO): Promise<AxiosResponse<MovimentacaoDTO>> =>
    api.post(`/produtos/${produtoId}/descarte`, dto),

  ajuste: (produtoId: number, dto: MovimentacaoInsertDTO): Promise<AxiosResponse<MovimentacaoDTO>> =>
    api.post(`/produtos/${produtoId}/ajuste`, dto),

  historico: (produtoId: number, params?: HistoricoParams): Promise<AxiosResponse<PageResponse<MovimentacaoDTO>>> =>
    api.get(`/produtos/${produtoId}/movimentacoes`, { params }),
};
