import { Util } from '../util.model';
import { ViewProdutoEmpresa } from './data-base/view-produto-empresa.model';

export class ProdutoUtil {
  static CalcularPrecoETotalBruto(
    registro: ViewProdutoEmpresa,
    bloquear_custos: boolean,
    TipoPreco: number,
    id_promocao?: number,
    valor_promocao?: number,
    promocao_sobrepor_tabela?: boolean,
    id_tabela_preco?: number,
    valor_tabela?: number,
    juros_aplicar?: number
  ) {
    //se o preço ja foi calculado como promoçoa ou tabelado.. ou entao foi alterado manualmente, não preciso mais calcular
    if (
      registro.tipo_preco !== 'P' &&
      registro.tipo_preco !== 'T' &&
      !registro.alterou_valor_manualmente
    ) {
      //limpo o valor original pra quando eu precisar usa-lo, atualize com o valor certo
      registro.valor_unitario_original = null;
      if (TipoPreco === 1) {
        //Varejo
        registro.valor_unitario = registro.pvenda_varejo;
        registro.desconto_maximo = registro.desconto_maximo_varejo_vlr;
        registro.desconto_maximo_prc = registro.desconto_maximo_varejo_prc;
        registro.tipo_preco = 'V';
      } else if (TipoPreco === 2) {
        //Atacado
        registro.valor_unitario = registro.pvenda_atacado;
        registro.desconto_maximo = registro.desconto_maximo_atacado_vlr;
        registro.desconto_maximo_prc = registro.desconto_maximo_atacado_prc;
        registro.tipo_preco = 'A';
      } else if (TipoPreco === 3) {
        //Super atacado
        registro.valor_unitario = registro.pvenda_super_atacado;
        registro.desconto_maximo = registro.desconto_maximo_super_atacado_vlr;
        registro.desconto_maximo_prc =
          registro.desconto_maximo_super_atacado_prc;
        registro.tipo_preco = 'S';
      } else if (TipoPreco === 6) {
        //Fornecedor
        registro.valor_unitario = registro.pfornecedor;
        registro.desconto_maximo = 0;
        registro.desconto_maximo_prc = 0;
        registro.tipo_preco = 'F';
      } else if (TipoPreco === 7) {
        //Compra
        registro.valor_unitario = registro.pcompra;
        registro.desconto_maximo = 0;
        registro.desconto_maximo_prc = 0;
        registro.tipo_preco = 'O';
      } else if (TipoPreco === 8) {
        //Custo
        registro.valor_unitario = registro.pcusto;
        registro.desconto_maximo = 0;
        registro.desconto_maximo_prc = 0;
        registro.tipo_preco = 'C';
      } // Tipo de preço é de Venda == 5
      else {
        if (!id_promocao && !id_tabela_preco) {
          if (
            TipoPreco === 10 ||
            (registro.pvenda_super_atacado > 0 &&
              registro.quantidade_minima_super_atacado > 0 &&
              registro.quantidade >= registro.quantidade_minima_super_atacado)
          ) {
            registro.valor_unitario = registro.pvenda_super_atacado;
            registro.desconto_maximo =
              registro.desconto_maximo_super_atacado_vlr;
            registro.desconto_maximo_prc =
              registro.desconto_maximo_super_atacado_prc;
            registro.tipo_preco = 'S';
          } else if (
            TipoPreco === 9 ||
            (registro.pvenda_atacado > 0 &&
              registro.quantidade_minima_atacado > 0 &&
              registro.quantidade >= registro.quantidade_minima_atacado)
          ) {
            registro.valor_unitario = registro.pvenda_atacado;
            registro.desconto_maximo = registro.desconto_maximo_atacado_vlr;
            registro.desconto_maximo_prc = registro.desconto_maximo_atacado_prc;
            registro.tipo_preco = 'A';
          } else {
            registro.valor_unitario = registro.pvenda_varejo;
            registro.desconto_maximo = registro.desconto_maximo_varejo_vlr;
            registro.desconto_maximo_prc = registro.desconto_maximo_varejo_prc;
            registro.tipo_preco = 'V';
          }
        } else {
          registro.desconto_maximo = 0;
          registro.desconto_maximo_prc = 0;
          if (
            id_promocao &&
            (!id_tabela_preco || promocao_sobrepor_tabela === true)
          ) {
            registro.id_promocao = id_promocao;
            registro.valor_unitario = valor_promocao;
            registro.tipo_preco = 'P';
          } else {
            registro.id_tabela_preco = id_tabela_preco;
            registro.valor_unitario = valor_tabela;
            registro.tipo_preco = 'T';
          }
        }

        registro.valor_unitario = Util.GetValorArredondado(
          registro.valor_unitario
        );

        //ja guardo o valor original
        registro.valor_unitario_original = Util.GetValorArredondado(
          registro.valor_unitario
        );

        if (juros_aplicar > 0) {
          ProdutoUtil.AplicarAcrescimoNoValorUnitario(registro, juros_aplicar);
        }
      }
    }

    //calculo o total bruto
    registro.total_bruto = bloquear_custos
      ? Util.GetValorArredondado(registro.quantidade * registro.pcusto)
      : Util.GetValorArredondado(registro.quantidade * registro.valor_unitario);
  }

  static AplicarAcrescimoNoValorUnitario(
    registro: ViewProdutoEmpresa,
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

  static AplicarDescontoPrc(
    produto: ViewProdutoEmpresa,
    valor: number
  ): boolean {
    try {
      if (valor < 0) {
        valor = 0;
      }

      if (valor > 100) {
        Util.AlertInfo('O desconto não pode ser maior que 100%');
        valor = 100;
      }

      valor = Util.GetValorArredondado(valor);

      produto.desconto_prc = valor;
      produto.desconto_vlr = Util.GetValorArredondado(
        produto.total_bruto * (valor / 100)
      );

      this.CalcularTotalLiquido(produto);
      return true;
    } catch {
      return false;
    }
  }

  static AplicarDescontoVlr(
    produto: ViewProdutoEmpresa,
    valor: number
  ): boolean {
    try {
      valor = Util.GetValorArredondado(valor);

      if (valor < 0) {
        valor = 0;
      }

      if (valor > produto.total_bruto) {
        Util.AlertInfo('O desconto não pode ser maior que o total bruto!');
        return false;
      }

      produto.desconto_vlr = valor;
      produto.desconto_prc = Util.CalculaPorcentagem(
        valor,
        produto.total_bruto
      );

      this.CalcularTotalLiquido(produto);

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static AplicarAcrescimoPrc(
    produto: ViewProdutoEmpresa,
    valor: number
  ): boolean {
    try {
      if (valor < 0) {
        valor = 0;
      }

      if (valor > 100) {
        Util.AlertInfo('O acréscimo não pode ser maior que 100%');
        valor = 100;
      }

      valor = Util.GetValorArredondado(valor);

      produto.acrescimo_prc = valor;
      produto.acrescimo_vlr = Util.GetValorArredondado(
        produto.total_bruto * (valor / 100)
      );

      this.CalcularTotalLiquido(produto);
      return true;
    } catch {
      return false;
    }
  }

  static AplicarAcrescimoVlr(
    produto: ViewProdutoEmpresa,
    valor: number
  ): boolean {
    try {
      valor = Util.GetValorArredondado(valor);

      if (valor < 0) {
        valor = 0;
      }

      produto.acrescimo_vlr = valor;
      produto.acrescimo_prc = Util.CalculaPorcentagem(
        valor,
        produto.total_bruto
      );

      this.CalcularTotalLiquido(produto);

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static CalcularTotalLiquido(produto: ViewProdutoEmpresa) {
    produto.total_liquido = Util.GetValorArredondado(
      produto.total_bruto - produto.desconto_vlr + produto.acrescimo_vlr
    );
  }
}
