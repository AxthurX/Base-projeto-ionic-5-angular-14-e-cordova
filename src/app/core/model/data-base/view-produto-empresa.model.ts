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
  pcompra: number;
  saldo_total: number;
  //campos auxiliar para a venda
  quantidade?: number;
  quantidade_adicionada?: number;
  valor_unitario?: number;
  valor_unitario_original?: number;
  total_bruto?: number;
  total_liquido?: number;
  saldo_flex_unitario?: number;
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
