export class ViewProduto {
  id: number;
  data: number;
  descricao: string;
  ativo: boolean;
  nome: string;
  observacao: string;
  data_fabricacao: string;
  data_vencimento: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  produto_perecivel: boolean;
  mostrar_foto: boolean = false;
  imagem: string = 'assets/icon/favicon.png';
  //campos auxiliar para a venda
  valor_total_original?: number;
  valor_total_cadastrado?: number;
  valor_unitario_original?: number;
  quantidade_original?: number;
  quantidade_adicionada?: number;
  quantidade_cadastrada?: number;
  alterou_valor_manualmente?: boolean;
  constructor() {
    this.quantidade = this.valor_unitario = 0;
  }
}
