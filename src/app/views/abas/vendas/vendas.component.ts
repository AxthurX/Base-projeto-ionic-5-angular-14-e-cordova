import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionSheetButton,
  ActionSheetController,
  ModalController,
} from '@ionic/angular';
import { OperacaoSaidaUtil } from 'src/app/core/model/operacao-saida-util.model';
import { OperacaoSaida } from 'src/app/core/model/operacao-saida.model';
import { Util } from 'src/app/core/util.model';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { IonContent } from '@ionic/angular';
import { OverlayService } from 'src/app/core/service/overlay.service';
import { DataBaseProvider } from 'src/app/core/service/database';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.scss'],
})
export class VendasComponent implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  nenhuma_venda_localizada: boolean = false;
  consultando: boolean;
  sincronizando: boolean;
  vendas: OperacaoSaida[] = [];
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
    json: '{"excluido":false,"pedido":true,"total_desconto_suframa":0,"total_icms_st":0,"total_ipi":0,"quantidade_produtos_lancados":2,"total_bruto":22.35,"acrescimo_prc":0,"acrescimo_vlr":0,"desconto_prc":0,"desconto_vlr":0,"total_liquido":22.35,"produtos":[{"mostrar_foto":false,"imagem":"assets/icon/favicon.png","frete_vlr":0,"acrescimo_prc":0,"acrescimo_vlr":0,"desconto_prc":0,"desconto_vlr":0,"total_liquido":7.35,"total_bruto":7.35,"valor_unitario":7.35,"quantidade":1,"descricao":" BARRA ROSCADA UNC ZB 1/4\\" 1M - CISER","aplicacao":null,"id":699033,"id_produto":841573,"id_produto_grupo":1969,"id_produto_sub_grupo":9964,"id_produto_fabricante":26941,"tipo_alteracao_preco":1,"id_empresa":170,"pcusto":0,"pvenda_atacado":0,"pvenda_super_atacado":0,"pcompra":3.82,"pfornecedor":3.82,"saldo_total":1,"pvenda_varejo":7.35,"unidade":"UN ","codigo_original":null,"referencia":null,"gtin":"00000051017194","sub_grupo":"IMPORTACAO DE DADOS","grupo":"IMPORTACAO DE DADOS","fabricante":"IMPORTACAO DE DADOS","desconto_maximo_varejo_vlr":0,"desconto_maximo_atacado_vlr":0,"desconto_maximo_super_atacado_vlr":0,"desconto_maximo_varejo_prc":0,"desconto_maximo_atacado_prc":0,"desconto_maximo_super_atacado_prc":0,"quantidade_minima_atacado":0,"quantidade_minima_super_atacado":0,"movimenta_fracionado":false,"nao_calcula_saldo_flex":false,"valor_unitario_original":7.35,"desconto_maximo":0,"desconto_maximo_prc":0,"tipo_preco":"V","icms_st":0,"ipi":0,"desconto_suframa":0,"invalidades":[]},{"mostrar_foto":false,"imagem":"assets/icon/favicon.png","frete_vlr":0,"acrescimo_prc":0,"acrescimo_vlr":0,"desconto_prc":0,"desconto_vlr":0,"total_liquido":15,"total_bruto":15,"valor_unitario":15,"quantidade":1,"descricao":" ADAPTADOR SOQUETE 14\\"X1/2\\"-2\\" - WORKER","aplicacao":null,"id":698868,"id_produto":841572,"id_produto_grupo":1969,"id_produto_sub_grupo":9964,"id_produto_fabricante":26941,"tipo_alteracao_preco":1,"id_empresa":170,"pcusto":0,"pvenda_atacado":0,"pvenda_super_atacado":0,"pcompra":5.15,"pfornecedor":5.15,"saldo_total":1,"pvenda_varejo":15,"unidade":"UN ","codigo_original":null,"referencia":null,"gtin":"7899811603363 ","sub_grupo":"IMPORTACAO DE DADOS","grupo":"IMPORTACAO DE DADOS","fabricante":"IMPORTACAO DE DADOS","desconto_maximo_varejo_vlr":0,"desconto_maximo_atacado_vlr":0,"desconto_maximo_super_atacado_vlr":0,"desconto_maximo_varejo_prc":0,"desconto_maximo_atacado_prc":0,"desconto_maximo_super_atacado_prc":0,"quantidade_minima_atacado":0,"quantidade_minima_super_atacado":0,"movimenta_fracionado":false,"nao_calcula_saldo_flex":false,"valor_unitario_original":15,"desconto_maximo":0,"desconto_maximo_prc":0,"tipo_preco":"V","icms_st":0,"ipi":0,"desconto_suframa":0,"invalidades":[]}],"primeiro_vecto_dias":0,"dias_vencimento":0,"quantidade_maxima_parcelas":1,"quantidade_minima_parcelas_cobrar_juros":0,"quantidade_minima_parcelas_solicitar_autorizacao":0,"quantidade_minima_parcelas_exigir_entrada":1,"quantidade_maxima_parcelas_com_desconto":1,"comissao_prc_sobre_vendas":0,"desconto_maximo":0,"entrada_minima":0,"acrescimo_prc":0,"multa_boleto":null,"a_prazo":false,"parcelamento_fixo":false,"tarifa_financeira_vlr":null,"comissao_prc_sobre_servicos":0,"parcelamentos":[]},"cliente":{"descricao":"IGREJA PENTECOSTAL DEUS E AMOR","id":415200},"tipo_preco_produto":5,"view_cliente":{"id":415200,"razao":"IGREJA PENTECOSTAL DEUS E AMOR","cep":"76907834","fantasia":"IGREJA PENTECOSTAL DEUS E AMOR","codigo_municipio":"1100122","cpf_cnpj":"43208040000136","logradouro":"RUA MATO GROSSO","numero":"3182","telefone_principal":"06992689800","telefone_whatsapp":null,"complemento":"IGREJA","bairro":"PARQUE SAO PEDRO","municipio":"JI-PARANÁ","sigla_uf":"RO","atividade":null,"limite_credito_disponivel":0,"limite_credito":0,"inscricao_estadual":0,"indicador_ie":9}}',
  };
  constructor(
    private actionSheetController: ActionSheetController,
    private dados: DataBaseProvider,
    private overlay: OverlayService,
    private modal: ModalController,
    private router: Router
  ) {
    this.consultando = false;
    this.sincronizando = false;
    this.vendas = [];
  }

  onForcarConsultarNovamente() {
    this.limparConsultas();
    this.OnConsultar();
  }

  limparConsultas() {
    this.vendas = [];
  }

  doRefresh(event) {
    event.target.complete();
    this.limparConsultas();
    this.OnConsultar();
  }

  ngOnInit() {
    this.OnConsultar();
  }

  async OnConsultar() {
    setTimeout(() => {
      try {
        this.nenhuma_venda_localizada = false;
        // this.dados
        //   .getVendas(this.limit, offSet, apenas_vendas, apenas_sincronizadas)
        //   .then((vendas) => {
        //     if (vendas?.length > 0) {
        //       vendas.forEach((v) => OperacaoSaidaUtil.PreecherDadosJson(v));

        //       vendas
        //         .filter((c) => !c.id_nuvem)
        //         .forEach((v) => {
        //           this.vendas.push(v);
        //         });
        //       vendas
        //         .filter((c) => c.id_nuvem)
        //         .forEach((s) => {
        //           this.sincronizados.push(s);
        //         });
        //     } else {
        //       this.nenhuma_venda_localizada = true;
        //     }
        //     this.consultando = false;

        //     if (this.abaSelecionada === 'vendas') {
        //       this.offSet_vendas += this.limit;
        //     } else {
        //       this.offSet_sincronizadas += this.limit;
        //     }
        //   })
        //   .catch((err) => {
        //     this.consultando = false;
        //   });
        this.vendas.push(this.teste);
      } catch (e) {
        this.consultando = false;
      }
    }, 500);
  }

  async mostrarOpcoesVenda(venda: OperacaoSaida, index: number) {
    const buttons: ActionSheetButton[] = [];
    buttons.push({
      text: 'Copiar',
      icon: 'copy',
      handler: () => {
        this.AbrirTelaVenda(venda, true);
      },
    });

    buttons.push({
      text: 'Imprimir',
      icon: 'print',
      handler: async () => {
        const modal = await this.modal.create({
          component: DetalhesComponent,
          componentProps: {
            venda,
          },
        });

        await modal.present();
      },
    });

    buttons.push({
      text: 'Reabrir',
      icon: 'pencil',
      handler: () => {
        this.AbrirTelaVenda(venda);
      },
    });

    buttons.push({
      text: 'Excluir',
      icon: 'trash',
      handler: () => {
        Util.Confirm('Excluindo Venda', async () => {
          try {
            this.dados
              .excluirVenda(venda.id)
              .then(() => {
                this.overlay.notificarSucesso('Venda excluída com sucesso!');
                this.vendas.splice(index, 1);
              })
              .catch((e) => {
                Util.TratarErroEFecharLoading(e, this.overlay);
              });
          } catch (e) {
            Util.TratarErroEFecharLoading(e, this.overlay);
          }
        });
      },
    });

    buttons.push({
      text: 'Voltar',
      icon: 'close',
      role: 'cancel',
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Opções da venda',
      mode: 'ios',
      buttons,
    });
    await actionSheet.present();
  }

  AbrirTelaVenda(objVenda?: OperacaoSaida, copiando?: boolean) {
    let id_venda: number = null;
    let acao = 'novo';
    if (objVenda) {
      id_venda = objVenda.id;
      if (copiando === true) {
        acao = 'copiando';
      } else {
        acao = 'editando';
      }
    }

    this.router.navigate(['home/vendas/tela-venda', { id_venda, acao }]);
  }
}
