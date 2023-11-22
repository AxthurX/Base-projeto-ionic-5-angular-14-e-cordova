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

    //calculo o total bruto
    registro.total_bruto = Util.GetValorArredondado(
      registro.quantidade * registro.valor_unitario
    );
  }
}
