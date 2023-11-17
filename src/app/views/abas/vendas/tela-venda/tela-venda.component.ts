import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { ViewProdutoEmpresa } from 'src/app/core/model/data-base/view-produto-empresa.model';
import { OperacaoSaidaUtil } from 'src/app/core/model/operacao-saida-util.model';
import { OperacaoSaida } from 'src/app/core/model/operacao-saida.model';
import { ProdutoUtil } from 'src/app/core/model/produto-util.model';
import { Util } from 'src/app/core/util.model';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { ValueBaseModel } from 'src/app/core/model/value-base.model';
import { OverlayService } from 'src/app/core/service/overlay.service';
import { DataBaseProvider } from 'src/app/core/service/database';

@Component({
  selector: 'app-tela-venda',
  templateUrl: './tela-venda.component.html',
  styleUrls: ['./tela-venda.component.scss'],
})
export class TelaVendaComponent implements OnInit, OnDestroy {
  @ViewChild('btnVoltar') btnVoltar;
  @Input() objVenda: OperacaoSaida;
  @Input() copiando?: boolean;
  carregando: boolean;
  acao: string;
  recalculando_totais: boolean = false;
  teste: OperacaoSaida = {
    id: 1,
    dados_json: {
      excluido: false,
      quantidade_produtos_lancados: 2,
      total_bruto: 22.35,
      total_liquido: 22.35,
      produtos: [
        {
          mostrar_foto: false,
          imagem: 'assets/icon/favicon.png',
          total_liquido: 7.35,
          total_bruto: 7.35,
          valor_unitario: 7.35,
          quantidade: 1,
          descricao: ' BARRA ROSCADA UNC ZB 1/4" 1M - CISER',
          id: 699033,
          id_produto: 841573,
          pcusto: 0,
          pvenda_atacado: 0,
          pcompra: 3.82,
          saldo_total: 1,
          unidade: 'UN ',
          codigo_original: null,
          referencia: null,
          gtin: '00000051017194',
          sub_grupo: 'IMPORTACAO DE DADOS',
          grupo: 'IMPORTACAO DE DADOS',
          fabricante: 'IMPORTACAO DE DADOS',
          valor_unitario_original: 7.35,
          observacao: null,
        },
        {
          mostrar_foto: false,
          imagem: 'assets/icon/favicon.png',
          total_liquido: 15,
          total_bruto: 15,
          valor_unitario: 15,
          quantidade: 1,
          descricao: ' ADAPTADOR SOQUETE 14"X1/2"-2" - WORKER',
          id: 698868,
          id_produto: 841572,
          pcusto: 0,
          pvenda_atacado: 0,
          pcompra: 5.15,
          saldo_total: 1,
          unidade: 'UN ',
          codigo_original: null,
          referencia: null,
          gtin: '7899811603363 ',
          sub_grupo: 'IMPORTACAO DE DADOS',
          grupo: 'IMPORTACAO DE DADOS',
          fabricante: 'IMPORTACAO DE DADOS',
          valor_unitario_original: 15,
          observacao: null,
        },
      ],
      cliente: {
        descricao: 'IGREJA PENTECOSTAL DEUS E AMOR',
        id: 415200,
      },
      view_cliente: {
        id: 415200,
        razao: 'IGREJA PENTECOSTAL DEUS E AMOR',
        cep: '76907834',
        fantasia: 'IGREJA PENTECOSTAL DEUS E AMOR',
        codigo_municipio: '1100122',
        cpf_cnpj: '43208040000136',
        logradouro: 'RUA MATO GROSSO',
        numero: '3182',
        telefone_principal: '06992689800',
        telefone_whatsapp: null,
        complemento: 'IGREJA',
        bairro: 'PARQUE SAO PEDRO',
        municipio: 'JI-PARANÁ',
        sigla_uf: 'RO',
        atividade: null,
        limite_credito_disponivel: 0,
        limite_credito: 0,
        inscricao_estadual: 0,
        indicador_ie: 9,
      },
      data: 1700247580222,
      observacao: null,
    },
    sincronizado_em: new Date().toDateString(),
    data: 1700247580222,
    json: '{"excluido":false,"pedido":true,"total_desconto_suframa":0,"total_icms_st":0,"total_ipi":0,"quantidade_produtos_lancados":2,"total_bruto":22.35,"acrescimo_prc":0,"acrescimo_vlr":0,"desconto_prc":0,"desconto_vlr":0,"total_liquido":22.35,"produtos":[{"mostrar_foto":false,"imagem":"assets/icon/favicon.png","frete_vlr":0,"acrescimo_prc":0,"acrescimo_vlr":0,"desconto_prc":0,"desconto_vlr":0,"total_liquido":7.35,"total_bruto":7.35,"valor_unitario":7.35,"quantidade":1,"descricao":" BARRA ROSCADA UNC ZB 1/4\\" 1M - CISER","aplicacao":null,"id":699033,"id_produto":841573,"id_produto_grupo":1969,"id_produto_sub_grupo":9964,"id_produto_fabricante":26941,"id_empresa":170,"pcusto":0,"pvenda_atacado":0,"pvenda_super_atacado":0,"pcompra":3.82,"pfornecedor":3.82,"saldo_total":1,"pvenda_varejo":7.35,"unidade":"UN ","codigo_original":null,"referencia":null,"gtin":"00000051017194","sub_grupo":"IMPORTACAO DE DADOS","grupo":"IMPORTACAO DE DADOS","fabricante":"IMPORTACAO DE DADOS","desconto_maximo_varejo_vlr":0,"desconto_maximo_atacado_vlr":0,"desconto_maximo_super_atacado_vlr":0,"desconto_maximo_varejo_prc":0,"desconto_maximo_atacado_prc":0,"desconto_maximo_super_atacado_prc":0,"quantidade_minima_atacado":0,"quantidade_minima_super_atacado":0,"movimenta_fracionado":false,"nao_calcula_saldo_flex":false,"valor_unitario_original":7.35,"desconto_maximo":0,"desconto_maximo_prc":0,"tipo_preco":"V","icms_st":0,"ipi":0,"desconto_suframa":0,"invalidades":[]},{"mostrar_foto":false,"imagem":"assets/icon/favicon.png","frete_vlr":0,"acrescimo_prc":0,"acrescimo_vlr":0,"desconto_prc":0,"desconto_vlr":0,"total_liquido":15,"total_bruto":15,"valor_unitario":15,"quantidade":1,"descricao":" ADAPTADOR SOQUETE 14\\"X1/2\\"-2\\" - WORKER","aplicacao":null,"id":698868,"id_produto":841572,,"id_produto_grupo":1969,"id_produto_sub_grupo":9964,"id_produto_fabricante":26941,"tipo_alteracao_preco":1,"id_empresa":170,"pcusto":0,"pvenda_atacado":0,"pvenda_super_atacado":0,"pcompra":5.15,"pfornecedor":5.15,"saldo_total":1,"pvenda_varejo":15,"unidade":"UN ","codigo_original":null,"referencia":null,"gtin":"7899811603363 ","sub_grupo":"IMPORTACAO DE DADOS","grupo":"IMPORTACAO DE DADOS","fabricante":"IMPORTACAO DE DADOS","desconto_maximo_varejo_vlr":0,"desconto_maximo_atacado_vlr":0,"desconto_maximo_super_atacado_vlr":0,"desconto_maximo_varejo_prc":0,"desconto_maximo_atacado_prc":0,"desconto_maximo_super_atacado_prc":0,"quantidade_minima_atacado":0,"quantidade_minima_super_atacado":0,"movimenta_fracionado":false,"nao_calcula_saldo_flex":false,"valor_unitario_original":15,"desconto_maximo":0,"desconto_maximo_prc":0,"tipo_preco":"V","icms_st":0,"ipi":0,"desconto_suframa":0,"invalidades":[]}],"primeiro_vecto_dias":0,"dias_vencimento":0,"quantidade_maxima_parcelas":1,"quantidade_minima_parcelas_solicitar_autorizacao":0,"quantidade_minima_parcelas_exigir_entrada":1,"quantidade_maxima_parcelas_com_desconto":1,"comissao_prc_sobre_vendas":0,"desconto_maximo":0,"entrada_minima":0,"acrescimo_prc":0,"multa_boleto":null,"a_prazo":false,"parcelamento_fixo":false,"tarifa_financeira_vlr":null,"comissao_prc_sobre_servicos":0,"parcelamentos":[]},"cliente":{"descricao":"IGREJA PENTECOSTAL DEUS E AMOR","id":415200},"tipo_preco_produto":5,"view_cliente":{"id":415200,"razao":"IGREJA PENTECOSTAL DEUS E AMOR","cep":"76907834","fantasia":"IGREJA PENTECOSTAL DEUS E AMOR","codigo_municipio":"1100122","cpf_cnpj":"43208040000136","logradouro":"RUA MATO GROSSO","numero":"3182","telefone_principal":"06992689800","telefone_whatsapp":null,"complemento":"IGREJA","bairro":"PARQUE SAO PEDRO","municipio":"JI-PARANÁ","sigla_uf":"RO","atividade":null,"limite_credito_disponivel":0,"limite_credito":0,"inscricao_estadual":0,"indicador_ie":9}}',
  };
  private backbuttonSubscription: Subscription;
  constructor(
    public modal: ModalController,
    private overlay: OverlayService,
    private actionSheetController: ActionSheetController,
    private dados: DataBaseProvider,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.acao = '';
    this.carregando = false;
    this.objVenda = new OperacaoSaida();
  }

  ngOnDestroy() {
    this.backbuttonSubscription.unsubscribe();
  }

  async ngOnInit() {
    try {
      const event = fromEvent(document, 'backbutton');
      this.backbuttonSubscription = event.subscribe(async () => {
        try {
          this.btnVoltar.voltar();
        } catch {}
      });
      this.route.params.subscribe(async (params) => {
        this.acao = params.acao;
        const id_venda = params.id_venda;

        if (this.acao === 'novo') {
          this.objVenda = new OperacaoSaida();
        } else {
          const venda = await this.dados.getVenda(id_venda);
          this.objVenda = venda;
          if (this.acao === 'copiando') {
            this.objVenda.id = 0;
            this.objVenda.sincronizado_em = null;
          }
          this.CompletarPreenchimentoDaVendaAtual();
        }
      });
    } catch (e) {
      Util.TratarErroEFecharLoading(e, this.overlay);
      this.carregando = false;
    }
  }

  CompletarPreenchimentoDaVendaAtual() {
    OperacaoSaidaUtil.PreecherDadosJson(this.objVenda);
    this.carregando = false;
    this.RecalcularTotais();
  }

  getByIdOrGtin(filtro: string, valor: string) {
    if (filtro === 'id') {
      return this.objVenda.dados_json.produtos.find(
        (c) => c.id_produto === +valor
      );
    } else {
      return this.objVenda.dados_json.produtos.find((c) => c.gtin === valor);
    }
  }

  //No recalculo, sempre aplico a regra da tributação pra garantir que qualquer alteração aplique tal regra
  async RecalcularTotais() {
    try {
      OperacaoSaidaUtil.RecalcularTotais(this.objVenda.dados_json);
    } catch (e) {}
  }

  getQuantidadesJaLancadas(): ValueBaseModel[] {
    const retorno: ValueBaseModel[] = [];
    this.objVenda?.dados_json?.produtos?.forEach((p) => {
      retorno.push({
        id: p.id_produto,
        valor: p.quantidade,
        descricao: '',
      });
    });

    return retorno;
  }

  OnConsultou(produtos: ViewProdutoEmpresa[]) {
    produtos.forEach((p) => {
      const existente = this.objVenda.dados_json.produtos.find(
        (c) => c.id_produto === p.id_produto
      );
      if (existente) {
        existente.quantidade += p.quantidade;
      } else {
        this.objVenda.dados_json.produtos.unshift(p);
      }
    });
  }

  ajustarQuantidade(
    registro: ViewProdutoEmpresa,
    i: number,
    incremento: number
  ) {
    if (!registro.quantidade) {
      registro.quantidade = 0;
    }
    registro.quantidade += incremento;
    if (registro.quantidade <= 0) {
      registro.quantidade = null;
      this.removerItemNaTora(i);
      return;
    }
    this.tratarAlteracaoQuantidade(registro);
  }

  tratarAlteracaoQuantidade(registro: ViewProdutoEmpresa) {
    //primeiro forço a correto do total bruto, pode ficar negativo o liquido, mas no final pe corrigido
    OperacaoSaidaUtil.RecalcularTotais(this.objVenda.dados_json);
    this.RecalcularTotais();
  }
  //nao faço pergunta
  removerItemNaTora(i: number, mostrar_alerta: boolean = true) {
    this.objVenda.dados_json.produtos.splice(i, 1);
    this.RecalcularTotais();

    if (mostrar_alerta === true) {
      this.overlay.showToast('Produto removido', 'warning');
    }
  }

  async mostrarOpcoesProduto(produto: ViewProdutoEmpresa, index: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Produto: ' + produto.descricao,
      mode: 'ios',
      buttons: [
        {
          text: 'Incluir observação no produto',
          icon: 'information-circle-outline',
          handler: () => {
            Util.EspecificarTexto(
              'Observação',
              'Insira aqui a observação',
              (_valor) => {
                produto.observacao = _valor;
              },
              produto.observacao
            );
          },
        },
        {
          text: 'Remover produto',
          icon: 'trash',
          handler: () => {
            Util.Confirm('Remover produto lançado', () => {
              this.removerItemNaTora(index);
            });
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async mostrarOpcoesGerais() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Aplicar na venda',
      mode: 'ios',
      buttons: [
        {
          text: 'Incluir observação na venda',
          icon: 'information-circle-outline',
          handler: () => {
            Util.EspecificarTexto(
              'Observação',
              'Insira aqui a observação',
              (_valor) => {
                this.objVenda.dados_json.observacao = _valor;
              },
              this.objVenda.dados_json.observacao
            );
          },
        },
        {
          text: 'Remover todos os produtos',
          icon: 'trash',
          handler: () => {
            Util.Confirm('Remover todos os produtos lançados', () => {
              const tamanho = this.objVenda.dados_json.produtos.length;
              for (let index = 0; index < tamanho; index++) {
                this.objVenda.dados_json.produtos.forEach((c) =>
                  this.removerItemNaTora(0, false)
                );
              }
            });
          },
        },
        {
          text: 'Limpar venda',
          icon: 'alert',
          handler: () => {
            Util.Confirm('Limpar venda', () => {
              OperacaoSaidaUtil.LimparVenda(this.objVenda.dados_json);
            });
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  alterouQuantidadeManualmente(registro: ViewProdutoEmpresa, novoValor) {
    registro.quantidade = novoValor;
    if (registro.quantidade && registro.quantidade < 0) {
      registro.quantidade = 1;
    }

    this.RecalcularTotais();
  }

  async SalvarVenda() {
    try {
      this.objVenda.data = new Date().getTime();
      // OperacaoSaidaUtil.PreecherJson(this.objVenda);
      // await this.dados.salvarVenda(this.objVenda);
      OperacaoSaidaUtil.PreecherJson(this.teste);
      await this.dados.salvarVenda(this.teste);
      this.overlay.notificarSucesso('Venda salva com sucesso!');
      this.router.navigate(['home/vendas']);
    } catch (err) {
      Util.logarErro(err);
      Util.AlertErrorPadrao();
    }
  }

  limparObservacaoVenda() {
    Util.Confirm('Limpar observação', () => {
      this.objVenda.dados_json.observacao = '';
    });
  }

  limparObservacaoItem(produto: ViewProdutoEmpresa) {
    Util.Confirm('Limpar observação', () => {
      produto.observacao = '';
    });
  }
}
