import { ViewCliente } from './data-base/view-cliente.model';
import { ViewProdutoEmpresa } from './data-base/view-produto-empresa.model';
import { OperacaoSaidaUtil } from './operacao-saida-util.model';
import { ValueBaseModel } from './value-base.model';

export class OperacaoSaida {
  id: number;
  data: number;
  id_cliente?: number;
  id_nuvem?: number;
  id_tipo_operacao?: number;
  id_forma_pagamento?: number;
  json: string;
  sincronizado_em: string;
  dados_json: OperacaoSaidaJson;
  constructor() {
    this.dados_json = new OperacaoSaidaJson();
  }
}

export class OperacaoSaidaJson {
  total_liquido: number;
  total_icms_st: number;
  total_ipi: number;
  total_desconto_suframa: number;
  desconto_vlr: number;
  desconto_prc: number;
  acrescimo_vlr: number;
  acrescimo_prc: number;
  total_bruto: number;
  produtos: ViewProdutoEmpresa[];
  pedido: boolean;
  excluido: boolean;
  data_exclusao?: number;
  data: number;
  //vai servir pra cadastradar o cliente quando sincronizar a venda (se necessario)
  view_cliente: ViewCliente;
  id_nuvem?: number;
  cliente: ValueBaseModel;
  tipo_operacao: ValueBaseModel;
  tipo_preco_produto?: number;
  id_tabela_preco_erp?: number;
  id_forma_pagamento?: number;
  quantidade_produtos_lancados: number;
  //1: sincronizando - 2: excluindo
  status_manipulacao?: number;
  latitude?: number;
  longitude?: number;
  sincronizado_em?: string;
  observacao: string;
  id_controle_visita?: number;
  constructor() {
    OperacaoSaidaUtil.LimparVenda(this);
  }

  //Não colocar metodo aqui, utilize o OperacaoSaidaUtil, pq essa terra sem lei, quando recupero o objeto do banco de dados, ele n reconhece as funções (metodos)
  //entao bora gambiarrar
}
