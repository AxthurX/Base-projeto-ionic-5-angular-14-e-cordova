import { Util } from '../util.model';
import { ViewProduto } from './data-base/view-produto.model';

export class ProdutoUtil {
  static CalcularPrecoETotalBruto(
    registro: ViewProduto,
    bloquear_custos: boolean
  ) {
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

  static AplicarAcrescimoNoValorUnitario(
    registro: ViewProduto,
    acrescimo_prc: number
  ) {
    if (!registro.valor_unitario_original) {
      registro.valor_unitario_original = registro.valor_unitario;
    }

    if (acrescimo_prc === 0) {
      registro.valor_unitario = registro.valor_unitario_original;
    } else {
      registro.valor_unitario =
        registro.valor_unitario_original +
        Util.CalculaValorSobrePorcentagem(
          registro.valor_unitario_original,
          acrescimo_prc
        );

      registro.valor_unitario = Util.GetValorArredondado(
        registro.valor_unitario
      );
    }
  }

  static AplicarDescontoPrc(valor: number): boolean {
    try {
      if (valor < 0) {
        valor = 0;
      }

      if (valor > 100) {
        Util.AlertInfo('O desconto não pode ser maior que 100%');
        valor = 100;
      }

      valor = Util.GetValorArredondado(valor);
      return true;
    } catch {
      return false;
    }
  }

  static AplicarDescontoVlr(produto: ViewProduto, valor: number): boolean {
    try {
      valor = Util.GetValorArredondado(valor);

      if (valor < 0) {
        valor = 0;
      }

      if (valor > produto.total_bruto) {
        Util.AlertInfo('O desconto não pode ser maior que o total bruto!');
        return false;
      }

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static AplicarAcrescimoPrc(valor: number): boolean {
    try {
      if (valor < 0) {
        valor = 0;
      }

      if (valor > 100) {
        Util.AlertInfo('O acréscimo não pode ser maior que 100%');
        valor = 100;
      }

      valor = Util.GetValorArredondado(valor);
      return true;
    } catch {
      return false;
    }
  }

  static AplicarAcrescimoVlr(valor: number): boolean {
    try {
      valor = Util.GetValorArredondado(valor);

      if (valor < 0) {
        valor = 0;
      }

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
