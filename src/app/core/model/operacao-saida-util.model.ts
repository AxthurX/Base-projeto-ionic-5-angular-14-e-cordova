import { DadosEmpresa } from '../service/auth.service';
import { Util } from '../util.model';
import { OperacaoSaida, OperacaoSaidaJson } from './operacao-saida.model';

export class OperacaoSaidaUtil {
  static PreecherDadosJson(venda: OperacaoSaida) {
    venda.dados_json = JSON.parse(venda.json);
    venda.dados_json.data = venda.data;
    venda.dados_json.sincronizado_em = venda.sincronizado_em;
  }

  static PreecherJson(venda: OperacaoSaida) {
    venda.json = JSON.stringify(venda.dados_json);
  }

  static LimparVenda(venda: OperacaoSaidaJson) {
    venda.excluido = false;
    venda.excluido = false;
    this.LimparValores(venda);
    venda.produtos = [];
  }

  static LimparValores(venda: OperacaoSaidaJson) {
    venda.total_liquido =
      venda.total_bruto =
      venda.quantidade_produtos_lancados =
        0;
  }

  //Ja manda bala em tudo q é preciso
  static RecalcularTotais(venda: OperacaoSaidaJson) {
    this.LimparValores(venda);

    if (venda.produtos && venda.produtos.length > 0) {
      venda.produtos.forEach((produto) => {
        //a quantidade pode ta nula quando o cara apagar direto na tela, entao assumo que é zero
        let quantidade = 0;
        if (produto.quantidade) {
          quantidade = produto.quantidade;
        }

        produto.total_bruto = Util.GetValorArredondado(
          quantidade * produto.valor_unitario
        );

        venda.quantidade_produtos_lancados += quantidade;
        venda.total_bruto += produto.total_bruto;
        venda.total_liquido += produto.total_liquido;
        venda.total_bruto = Util.GetValorArredondado(venda.total_bruto);
      });

      venda.total_liquido = Util.GetValorArredondado(venda.total_liquido);
    }
  }

  static Validar(
    venda: OperacaoSaidaJson,
    dados_empresa: DadosEmpresa
  ): boolean {
    if (!venda.cliente) {
      Util.AlertWarning('Selecione um cliente');
      return false;
    }
    if (venda.produtos.length === 0) {
      Util.AlertWarning('Adicione um ou mais produtos na venda');
      return false;
    }
    if (
      venda.produtos.filter((c) => !c.quantidade || c.quantidade === 0).length >
      0
    ) {
      Util.AlertWarning('Existem produtos com quantidade inválida');
      return false;
    }
    if (
      venda.produtos.filter((c) => !c.total_liquido || c.total_liquido === 0)
        .length > 0
    ) {
      Util.AlertWarning('Existem produtos com total líquido inválido');
      return false;
    }
    if (!venda.total_liquido || venda.total_liquido === 0) {
      Util.AlertWarning('O total líquido da venda está inválido');
      return false;
    }

    return true;
  }
}
