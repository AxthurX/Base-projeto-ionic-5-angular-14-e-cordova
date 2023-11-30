import { Util } from '../util.model';
import { OperacaoSaida, OperacaoSaidaJson } from './operacao-saida.model';

export class OperacaoSaidaUtil {
  static PreecherDadosJson(venda: OperacaoSaida) {
    venda.dados_json = JSON.parse(venda.json);
    venda.dados_json.data = venda.data;
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
    venda.valor_total = venda.quantidade_produtos_lancados = 0;
  }

  //Ja manda bala em tudo q é preciso
  static RecalcularTotais(venda: OperacaoSaidaJson) {
    this.LimparValores(venda);

    if (venda.produtos && venda.produtos.length > 0) {
      venda.produtos.forEach((produto) => {
        //a quantidade pode ta nula quando o cara apagar direto na tela, entao assumo que é zero
        let quantidade = 0;

        if (produto.quantidade > produto.quantidade_original) {
          if (produto.quantidade === 0) {
            Util.AlertWarning(
              'Nenhum produto em estoque!'
            );
          } else {
            Util.AlertWarning(
              'Na sua venda não é possível adicionar mais produtos do que tem em estoque!'
            );
          }
          produto.quantidade--;
          return;
        } else {
          quantidade = produto.quantidade;
        }

        produto.valor_total = Util.GetValorArredondado(
          quantidade * produto.valor_unitario
        );

        venda.quantidade_produtos_lancados += quantidade;
        venda.valor_total += produto.valor_total;
        venda.valor_total = Util.GetValorArredondado(venda.valor_total);
      });
    }
  }

  static Validar(venda: OperacaoSaidaJson): boolean {
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

    if (!venda.valor_total || venda.valor_total === 0) {
      Util.AlertWarning('O Valor Total da venda está inválido');
      return false;
    }

    return true;
  }
}
