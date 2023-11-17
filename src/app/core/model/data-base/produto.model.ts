export class Produto {
  id: number;
  data: number;
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
  nome: string;
  data_fabricacao: string;
  data_vencimento: string;
  qtde_produto: number;
  valor_unitario: number;
  valor_total: number;
  produto_perecivel: boolean;
}
