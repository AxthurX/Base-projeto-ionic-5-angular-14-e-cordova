export class ViewProdutoEmpresa {
  mostrar_foto: boolean = false;
  imagem: string = 'assets/icon/favicon.png';
  descricao: string;
  referencia: string;
  codigo_original: string;
  gtin: string;
  sub_grupo: string;
  grupo: string;
  fabricante: string;
  unidade: string;
  id: number;
  id_produto: number;
  pcusto: number;
  pvenda_atacado: number;
  pvenda_super_atacado: number;
  pcompra: number;
  pfornecedor: number;
  saldo_total: number;
  pvenda_varejo: number;
  //campos auxiliar para a venda
  quantidade?: number;
  quantidade_adicionada?: number;
  valor_unitario?: number;
  valor_unitario_original?: number;
  total_bruto?: number;
  total_liquido?: number;
  desconto_maximo?: number;
  desconto_maximo_prc?: number;
  id_tabela_preco?: number;
  id_promocao?: number;
  preco_unitario_original_flex?: number;
  preco_unitario_vendido_flex?: number;
  saldo_flex_unitario?: number;
  tipo_preco?: string;
  observacao: string;
  alterou_valor_manualmente?: boolean;
  valor_liquido?: number;
  constructor() {
    this.quantidade =
      this.valor_unitario =
      this.total_bruto =
      this.total_liquido =
        0;
  }
}
