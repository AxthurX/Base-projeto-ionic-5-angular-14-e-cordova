export class Produto {
  id: number;
  id_erp: number;
  id_produto_sub_grupo: number;
  id_produto_fabricante: number;
  tipo_alteracao_preco: number;
  descricao: string;
  gtin: string;
  unidade: string;
  aplicacao: string;
  codigo_original: string;
  ativo: boolean;
  referencia: boolean;
  movimenta_fracionado: boolean;
  nao_calcula_saldo_flex: boolean;
}
