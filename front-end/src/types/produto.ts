export type Unidade = 'PCT' | 'G' | 'UN' | 'L' | 'ML' | 'KG';

export interface ProdutoDTO {
  id: number;
  nome: string;
  categoriaId: number;
  unidade: Unidade;
  quantidadeAtual: number;
  quantidadeMinima: number;
  quantidadeIdeal: number;
  ativo: boolean;
}

export interface ProdutoInsertDTO {
  nome: string;
  categoriaId: number;
  unidade: Unidade;
  quantidadeAtual: number;
  quantidadeMinima: number;
  quantidadeIdeal: number;
}

export type ProdutoUpdateDTO = ProdutoInsertDTO;
