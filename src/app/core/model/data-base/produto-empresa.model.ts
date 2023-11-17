export class ProdutoEmpresa {
  id: number;
  id_produto: number;
  id_empresa: number;
  pcusto: number;
  pvenda_varejo: number;
  pvenda_atacado: number;
  pvenda_super_atacado: number;
  saldo_total: number;
  quantidade_minima_atacado: number;
  quantidade_minima_super_atacado: number;
  desconto_maximo_varejo_vlr: number;
  desconto_maximo_atacado_vlr: number;
  desconto_maximo_super_atacado_vlr: number;
  desconto_maximo_varejo_prc: number;
  desconto_maximo_atacado_prc: number;
  desconto_maximo_super_atacado_prc: number;
  pcompra: number;
  pfornecedor: number;
  ativo: boolean;
}
