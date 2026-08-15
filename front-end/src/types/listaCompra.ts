export type StatusListaCompra = 'ABERTA' | 'FINALIZADA' | 'CANCELADA';

export interface ListaCompraItemDTO {
  id: number;
  produtoId: number;
  produtoNome: string;
  quantidadeSugerida: number;
  quantidadeComprada: number | null;
  comprado: boolean;
}

export interface ListaCompraDTO {
  id: number;
  titulo: string;
  status: StatusListaCompra;
  criadoEm: string;
  finalizadoEm: string | null;
  itens: ListaCompraItemDTO[];
}

export interface ListaCompraGerarDTO {
  titulo: string;
}

export interface ListaCompraItemUpdateDTO {
  quantidadeComprada: number;
  comprado: boolean;
}
