export type Unidade = "PCT" | "G" | "UN" | "L" | "ML" | "KG";

export interface ProdutoDTO {
  id: number;
  nome: string;
  categoriaId: number;
  unidade: Unidade;
  quantidadeAtual: number;
  quantidadeMinima: number;
  quantidadeIdeal: number;
  ativo: boolean;
  dataValidade: string | null;
}

export interface ProdutoInsertDTO {
  nome: string;
  categoriaId: number;
  unidade: Unidade;
  quantidadeAtual: number;
  quantidadeMinima: number;
  quantidadeIdeal: number;
}

export interface ProdutoQuickInsertDTO {
  nome: string;
  categoriaId: number;
  unidade: Unidade;
  quantidadeAtual: number;
  quantidadeMinima: number;
  dataValidade?: string;
}

export interface ProdutoUpdateDTO {
  nome: string;
  categoriaId: number;
  unidade: Unidade;
  quantidadeMinima: number;
  quantidadeIdeal: number;
  dataValidade: string | null;
}
