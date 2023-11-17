import { ViewCliente } from './data-base/view-cliente.model';
import { ViewProdutoEmpresa } from './data-base/view-produto-empresa.model';
import { OperacaoSaidaUtil } from './operacao-saida-util.model';
import { ValueBaseModel } from './value-base.model';

export class OperacaoSaida {
  id: number;
  data: number;
  id_cliente?: number;
  json: string;
  sincronizado_em: string;
  dados_json: OperacaoSaidaJson;
  constructor() {
    this.dados_json = new OperacaoSaidaJson();
  }
}

export class OperacaoSaidaJson {
  total_liquido: number;
  total_bruto: number;
  produtos: ViewProdutoEmpresa[];
  excluido: boolean;
  data_exclusao?: number;
  data: number;
  view_cliente: ViewCliente;
  cliente: ValueBaseModel;
  quantidade_produtos_lancados: number;
  //1: sincronizando - 2: excluindo
  status_manipulacao?: number;
  sincronizado_em?: string;
  observacao: string;
  constructor() {
    OperacaoSaidaUtil.LimparVenda(this);
  }

  //Não colocar metodo aqui, utilize o OperacaoSaidaUtil, pq essa terra sem lei, quando recupero o objeto do banco de dados, ele n reconhece as funções (metodos)
  //entao bora gambiarrar
}
