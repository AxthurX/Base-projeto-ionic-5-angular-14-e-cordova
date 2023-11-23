import { ViewProduto } from './data-base/view-produto.model';
import { OperacaoSaidaUtil } from './operacao-saida-util.model';

export class OperacaoSaida {
  id: number;
  data: number;
  json: string;
  dados_json: OperacaoSaidaJson;
  constructor() {
    this.dados_json = new OperacaoSaidaJson();
  }
}

export class OperacaoSaidaJson {
  total_liquido: number;
  total_bruto: number;
  produtos: ViewProduto[];
  excluido: boolean;
  data_exclusao?: number;
  data: number;
  quantidade_produtos_lancados: number;
  observacao: string;
  constructor() {
    OperacaoSaidaUtil.LimparVenda(this);
  }
}
