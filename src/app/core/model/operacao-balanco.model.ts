import { ViewProduto } from './data-base/view-produto.model';
import { OperacaoBalancoUtil } from './operacao-balanco-util.model';

export class OperacaoBalanco {
  id: number;
  data: number;
  json: string;
  sincronizado_em: string;
  dados_json: OperacaoBalancoJson;
  constructor() {
    this.dados_json = new OperacaoBalancoJson();
  }
}

export class OperacaoBalancoJson {
  produtos: ViewProduto[];
  data_exclusao?: number;
  data: number;
  quantidade_produtos_lancados: number;
  status_manipulacao?: number;
  sincronizado_em?: string;
  observacao: string;
  constructor() {
    OperacaoBalancoUtil.LimparBalanco(this);
  }
}
