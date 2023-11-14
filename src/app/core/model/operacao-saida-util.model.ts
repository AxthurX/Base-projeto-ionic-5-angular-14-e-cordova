import { DadosEmpresa } from '../service/auth.service';
import { Util } from '../util.model';
import { OperacaoSaida, OperacaoSaidaJson } from './operacao-saida.model';

export class OperacaoSaidaUtil {
  static PreecherDadosJson(venda: OperacaoSaida) {
    venda.dados_json = JSON.parse(venda.json);
    venda.dados_json.data = venda.data;
    venda.dados_json.sincronizado_em = venda.sincronizado_em;
    venda.dados_json.id_nuvem = venda.id_nuvem;
  }
  static PreecherJson(venda: OperacaoSaida) {
    venda.json = JSON.stringify(venda.dados_json);
  }
  static GetTipoVenda(pedido: boolean) {
    return pedido === true ? 'Pedido' : 'Orçamento';
  }
  static LimparVenda(venda: OperacaoSaidaJson) {
    venda.excluido = false;
    venda.pedido = true;
    venda.excluido = false;
    this.LimparValores(venda);
    venda.produtos = [];
    venda.cliente = venda.tipo_operacao = null;
    venda.tipo_preco_produto = null;
  }
  static LimparValores(venda: OperacaoSaidaJson) {
    venda.total_liquido =
      venda.desconto_vlr =
      venda.desconto_prc =
      venda.acrescimo_vlr =
      venda.acrescimo_prc =
      venda.total_bruto =
      venda.quantidade_produtos_lancados =
      venda.total_ipi =
      venda.total_icms_st =
      venda.total_desconto_suframa =
        0;
  }

  //Ja manda bala em tudo q é preciso
  static RecalcularTotais(
    venda: OperacaoSaidaJson,
    recalcular_desconto_acrescimento?: boolean
  ) {
    this.LimparValores(venda);

    if (venda.produtos && venda.produtos.length > 0) {
      venda.produtos.forEach((produto) => {
        //a quantidade pode ta nula quando o cara apagar direto na tela, entao assumo que é zero
        let quantidade = 0;
        if (produto.quantidade) {
          quantidade = produto.quantidade;
        }

        if (!produto.desconto_vlr) {
          produto.desconto_vlr = produto.desconto_prc = 0;
        }
        if (!produto.acrescimo_vlr) {
          produto.acrescimo_vlr = produto.acrescimo_prc = 0;
        }
        if (!produto.frete_vlr) {
          produto.frete_vlr = 0;
        }

        if (recalcular_desconto_acrescimento) {
          if (produto.desconto_prc > 0) {
            produto.desconto_vlr = Util.CalculaValorSobrePorcentagem(
              produto.total_bruto,
              produto.desconto_prc
            );
          }

          if (produto.acrescimo_prc > 0) {
            produto.acrescimo_vlr = Util.CalculaValorSobrePorcentagem(
              produto.total_bruto,
              produto.acrescimo_prc
            );
          }
        }

        produto.total_bruto = Util.GetValorArredondado(
          quantidade * produto.valor_unitario
        );

        if (!produto.ipi) {
          produto.ipi = 0;
        }
        if (!produto.desconto_suframa) {
          produto.desconto_suframa = 0;
        }
        if (!produto.icms_st) {
          produto.icms_st = 0;
        }

        produto.total_liquido = Util.GetValorArredondado(
          produto.total_bruto +
            produto.acrescimo_vlr +
            (produto.frete_vlr ?? 0) +
            produto.ipi +
            produto.icms_st -
            produto.desconto_suframa -
            produto.desconto_vlr
        );

        venda.quantidade_produtos_lancados += quantidade;
        venda.total_bruto += produto.total_bruto;
        venda.desconto_vlr += produto.desconto_vlr;
        venda.acrescimo_vlr += produto.acrescimo_vlr;
        venda.total_icms_st += produto.icms_st;
        venda.total_desconto_suframa += produto.desconto_suframa;
        venda.total_ipi += produto.ipi;
        venda.total_liquido += produto.total_liquido;
        venda.total_ipi = Util.GetValorArredondado(venda.total_ipi);
        venda.total_icms_st = Util.GetValorArredondado(venda.total_icms_st);
        venda.total_desconto_suframa = Util.GetValorArredondado(
          venda.total_desconto_suframa
        );
        venda.total_bruto = Util.GetValorArredondado(venda.total_bruto);
        venda.desconto_vlr = Util.GetValorArredondado(venda.desconto_vlr);
        venda.acrescimo_vlr = Util.GetValorArredondado(venda.acrescimo_vlr);
      });

      venda.desconto_prc = Util.CalculaPorcentagem(
        venda.desconto_vlr,
        venda.total_bruto
      );
      venda.acrescimo_prc = Util.CalculaPorcentagem(
        venda.acrescimo_vlr,
        venda.total_bruto
      );
      venda.total_desconto_suframa = Util.GetValorArredondado(
        venda.total_desconto_suframa
      );
      venda.total_ipi = Util.GetValorArredondado(venda.total_ipi);
      venda.total_icms_st = Util.GetValorArredondado(venda.total_icms_st);
      venda.desconto_prc = Util.GetValorArredondado(venda.desconto_prc);
      venda.acrescimo_prc = Util.GetValorArredondado(venda.acrescimo_prc);
      venda.acrescimo_prc = Util.GetValorArredondado(venda.acrescimo_prc);
      venda.total_liquido = Util.GetValorArredondado(venda.total_liquido);
    }
  }

  static Validar(
    venda: OperacaoSaidaJson,
    dados_empresa: DadosEmpresa
  ): boolean {
    if (!venda.tipo_operacao) {
      Util.AlertWarning('Selecione um tipo de operação');
      return false;
    }
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

    let estaTudoValido = true;

    if (venda.pedido) {
      //aplico as validações necessárias
      venda.produtos.forEach((c) => {
        //primeiro limpo o  tiver armazenado
        c.invalidades = [];
        //validar desconto
        if (c.desconto_prc > 0) {
          if (c.desconto_maximo > 0 && c.desconto_prc > c.desconto_maximo_prc) {
            c.invalidades.push(
              `Excedeu o desconto máximo do cadastro do produto (${c.desconto_maximo_prc}%)`
            );
          }

          if (c.tipo_preco === 'T') {
            c.invalidades.push(
              `Não é permitido dar desconto em produto com preço Tabelado`
            );
          }

          if (
            dados_empresa.desconto_porcentagem_maximo_permitido_empresa > 0 &&
            c.desconto_prc >
              dados_empresa.desconto_porcentagem_maximo_permitido_empresa
          ) {
            c.invalidades.push(
              `Excedeu o desconto máximo permitido pela empresa (${dados_empresa.desconto_porcentagem_maximo_permitido_empresa}%)`
            );
          }

          if (
            dados_empresa.desconto_porcentagem_maximo_permitido_usuario > 0 &&
            c.desconto_prc >
              dados_empresa.desconto_porcentagem_maximo_permitido_usuario
          ) {
            c.invalidades.push(
              `Excedeu o desconto máximo permitido no seu cadastro (${dados_empresa.desconto_porcentagem_maximo_permitido_usuario}%)`
            );
          }

          if (c.invalidades.length > 0) {
            estaTudoValido = false;
          }
        }
      });
    }

    if (!estaTudoValido) {
      Util.AlertWarning(
        `Um ou mais produtos contém restrições, por favor confira na aba 'produtos' e faça os devidos ajustes ou então <b>Salve a venda como ORÇAMENTO</b>`
      );
      return false;
    }

    return true;
  }
}
