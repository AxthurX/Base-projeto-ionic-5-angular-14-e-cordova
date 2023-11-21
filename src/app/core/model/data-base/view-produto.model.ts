export class ViewProduto {
  id: number;
  data: number;
  descricao: string;
  gtin: string;
  unidade: string;
  codigo_original: string;
  ativo: boolean;
  nome: string;
  observacao: string;
  data_fabricacao: string;
  data_vencimento: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  total_bruto: number;
  total_liquido: number;
  saldo_total: number;
  produto_perecivel: boolean;
  mostrar_foto: boolean = false;
  valor_unitario_original?: number;
  imagem: string = 'assets/icon/favicon.png';
  //campos auxiliar para a venda
  quantidade_adicionada?: number;
  alterou_valor_manualmente?: boolean;
  valor_liquido?: number;
  constructor() {
    this.quantidade = this.valor_unitario = 0;
  }
}
