import { DadosEmpresa } from '../service/auth.service';
import { Util } from '../util.model';
import { OperacaoBalanco, OperacaoBalancoJson } from './operacao-balanco.model';

export class OperacaoBalancoUtil {
  static PreecherDadosJson(balanco: OperacaoBalanco) {
    balanco.dados_json = JSON.parse(balanco.json);
    balanco.dados_json.data = balanco.data;
    balanco.dados_json.quantidade_produtos_lancados = 0;
    balanco.dados_json.produtos.forEach((p) => {
      balanco.dados_json.quantidade_produtos_lancados += p.quantidade;
    });
    balanco.dados_json.sincronizado_em = balanco.sincronizado_em;
    balanco.dados_json.id_nuvem = balanco.id_nuvem;
  }

  static PreecherJson(balanco: OperacaoBalanco) {
    balanco.json = JSON.stringify(balanco.dados_json);
  }

  static LimparBalanco(balanco: OperacaoBalancoJson) {
    balanco.finalizado = false;
    this.LimparValores(balanco);
    balanco.produtos = [];
    balanco.estoque_locais = null;
  }

  static LimparValores(balanco: OperacaoBalancoJson) {
    balanco.quantidade_produtos_lancados = 0;
  }

  static RecalcularTotais(balanco: OperacaoBalancoJson) {
    this.LimparValores(balanco);

    if (balanco.produtos && balanco.produtos.length > 0) {
      balanco.produtos.forEach((produto) => {
        //a quantidade pode ta nula quando o cara apagar direto na tela, entao assumo que é zero
        let quantidade = 0;
        if (produto.quantidade) {
          quantidade = produto.quantidade;
        }
        balanco.quantidade_produtos_lancados += quantidade;
      });
    }
  }

  static Validar(
    balanco: OperacaoBalancoJson,
    dados_empresa: DadosEmpresa
  ): boolean {
    if (!balanco.estoque_locais) {
      Util.AlertWarning('Selecione um Local de estoque');
      return false;
    }
    if (balanco.produtos.length === 0) {
      Util.AlertWarning('Adicione um ou mais produtos no balanço');
      return false;
    }

    const estaTudoValido = true;

    if (!estaTudoValido) {
      Util.AlertWarning(
        `Um ou mais produtos contém erro de validação, por favor confira na aba 'produtos' e faça os devidos ajustes`
      );
      return false;
    }

    return true;
  }
}
