export type TipoMovimentacao = 'ENTRADA' | 'SAIDA' | 'AJUSTE' | 'DESCARTE';

export interface MovimentacaoDTO {
  id: number;
  produtoId: number;
  tipo: TipoMovimentacao;
  quantidade: number;
  observacao: string | null;
  criadoEm: string; // ISO string — converte pra Date só na hora de exibir
}

export interface MovimentacaoInsertDTO {
  quantidade: number;
  observacao?: string;
}
