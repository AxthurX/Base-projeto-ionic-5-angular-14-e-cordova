import { Util } from '../util.model';
import { ViewProduto } from './data-base/view-produto.model';

export class ProdutoUtil {
  static CalcularPrecoETotalBruto(registro: ViewProduto) {
    //se o preço ja foi calculado como promoçoa ou tabelado.. ou entao foi alterado manualmente, não preciso mais calcular
    if (!registro.alterou_valor_manualmente) {
      //limpo o valor original pra quando eu precisar usa-lo, atualize com o valor certo
      registro.valor_unitario_original = null;
      registro.valor_unitario = Util.GetValorArredondado(
        registro.valor_unitario
      );

      //ja guardo o valor original
      registro.valor_unitario_original = Util.GetValorArredondado(
        registro.valor_unitario
      );
    }

    if (registro.quantidade > registro.quantidade_original) {
      Util.AlertWarning(
        'Na sua venda não é possível adicionar mais produtos do que tem em estoque!'
      );
      registro.quantidade--;
      return;
    }

    //calculo o valor total
    registro.valor_total = Util.GetValorArredondado(
      registro.quantidade * registro.valor_unitario
    );
  }
}
