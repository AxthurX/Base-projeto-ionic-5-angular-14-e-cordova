import { ViewProduto } from './data-base/view-produto.model';
import { ValueBaseModel } from './value-base.model';
import { OperacaoBalancoUtil } from './operacao-balanco-util.model';

export class OperacaoBalanco {
  id: number;
  data: number;
  json: string;
  estoque_locais?: number;
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
  id_estoque_locais?: number;
  estoque_locais: ValueBaseModel;
  quantidade_produtos_lancados: number;
  //1: sincronizando - 2: excluindo
  status_manipulacao?: number;
  sincronizado_em?: string;
  observacao: string;
  constructor() {
    OperacaoBalancoUtil.LimparBalanco(this);
  }
}
