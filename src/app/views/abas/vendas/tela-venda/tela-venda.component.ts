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
        } else if (this.acao === 'copiando_do_erp') {
          this.acao = 'copiando do erp';
          this.overlay.showLoading('Copiando venda da nuvem...');
          this.overlay.dismissLoadCtrl();
        } else {
          const venda = await this.dados.getVenda(id_venda);
          this.objVenda = venda;
          if (this.acao === 'copiando') {
            this.objVenda.id = 0;
            this.objVenda.id_nuvem = null;
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
        (c) => c.id_produto_erp === +valor
      );
    } else {
      return this.objVenda.dados_json.produtos.find((c) => c.gtin === valor);
    }
  }

  //No recalculo, sempre aplico a regra da tributação pra garantir que qualquer alteração aplique tal regra
  async RecalcularTotais() {
    try {
      if (
        this.objVenda?.dados_json?.cliente?.id_erp > 0 &&
        this.objVenda?.dados_json?.produtos?.length > 0
      ) {
        //ja limpo o q tiver preenchido pra evitar problema ao alterar cliente ou tipo de operação
        this.objVenda.dados_json.produtos.forEach((produto) => {
          produto.desconto_suframa = produto.ipi = produto.icms_st = 0;
        });
      }

      OperacaoSaidaUtil.RecalcularTotais(this.objVenda.dados_json);
    } catch (e) {}
  }

  getQuantidadesJaLancadas(): ValueBaseModel[] {
    const retorno: ValueBaseModel[] = [];
    this.objVenda?.dados_json?.produtos?.forEach((p) => {
      retorno.push({
        id: p.id_produto_erp,
        valor: p.quantidade,
        descricao: '',
      });
    });

    return retorno;
  }

  OnConsultou(produtos: ViewProdutoEmpresa[]) {
    produtos.forEach((p) => {
      const existente = this.objVenda.dados_json.produtos.find(
        (c) => c.id_produto_erp === p.id_produto_erp
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
    ProdutoUtil.AplicarDescontoPrc(registro, registro.desconto_prc);
    ProdutoUtil.AplicarAcrescimoPrc(registro, registro.acrescimo_prc);
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
          text: 'Aplicar desconto R$',
          icon: 'trending-down',
          handler: () => {
            Util.EspecificarTexto(
              'Informe o valor de desconto',
              'R$',
              (_valor) => {
                const valor = parseFloat(_valor);
                if (ProdutoUtil.AplicarDescontoVlr(produto, valor) === true) {
                  this.RecalcularTotais();
                }
              },
              '',
              'text'
            );
          },
        },
        {
          text: 'Aplicar desconto %',
          icon: 'trending-down',
          handler: () => {
            Util.EspecificarTexto(
              'Informe o % de desconto',
              '%',
              (_valor) => {
                const valor = parseFloat(_valor);
                if (ProdutoUtil.AplicarDescontoPrc(produto, valor) === true) {
                  this.RecalcularTotais();
                }
              },
              '',
              'text'
            );
          },
        },
        {
          text: 'Aplicar acréscimo R$',
          icon: 'trending-up',
          handler: () => {
            Util.EspecificarTexto(
              'Informe o valor de acréscimo',
              'R$',
              (_valor) => {
                const valor = parseFloat(_valor);
                if (ProdutoUtil.AplicarAcrescimoVlr(produto, valor) === true) {
                  this.RecalcularTotais();
                }
              },
              '',
              'text'
            );
          },
        },
        {
          text: 'Aplicar acréscimo %',
          icon: 'trending-up',
          handler: () => {
            Util.EspecificarTexto(
              'Informe o % de acréscimo',
              '%',
              (_valor) => {
                const valor = parseFloat(_valor);
                if (ProdutoUtil.AplicarAcrescimoPrc(produto, valor) === true) {
                  this.RecalcularTotais();
                }
              },
              '',
              'text'
            );
          },
        },
        {
          text: 'Alterar preço',
          icon: 'money',
          handler: () => {
            if (produto.tipo_alteracao_preco !== 2) {
              Util.EspecificarTexto(
                'Informe o novo valor',
                'R$',
                (_valor) => {
                  const valor = parseFloat(_valor);
                  if (
                    produto.tipo_alteracao_preco === 0 &&
                    valor < produto.valor_unitario_original
                  ) {
                    Util.AlertInfo(
                      `Este produto só permite alteração de preço acima de ${produto.valor_unitario_original}`
                    );
                  } else {
                    produto.valor_unitario = Util.GetValorArredondado(valor);
                    produto.alterou_valor_manualmente = true;
                    this.RecalcularTotais();
                  }
                },
                '',
                'text'
              );
            } else {
              Util.AlertInfo('Alteração de preço bloqueado para este produto!');
            }
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
          text: 'Aplicar desconto R$',
          icon: 'trending-down',
          handler: () => {
            Util.EspecificarTexto(
              'Informe o valor de desconto',
              'R$',
              (_valor) => {
                if (this.objVenda.dados_json.quantidade_produtos_lancados > 0) {
                  const valor = parseFloat(_valor);

                  if (valor > this.objVenda.dados_json.total_bruto) {
                    Util.AlertInfo(
                      'O desconto R$ não pode ser maior que o total bruto'
                    );
                  } else {
                    const desconto_prc = Util.CalculaPorcentagem(
                      valor,
                      this.objVenda.dados_json.total_bruto
                    );
                    let total_desconto_aplicado = 0;
                    this.objVenda.dados_json.produtos.forEach((produto) => {
                      ProdutoUtil.AplicarDescontoPrc(produto, desconto_prc);
                      total_desconto_aplicado += produto.desconto_vlr;
                    });

                    //verifico a diferença e aplico no ultimo item
                    const diferenca = valor - total_desconto_aplicado;
                    if (diferenca !== 0) {
                      const ultimoProdutoLancado =
                        this.objVenda.dados_json.produtos[
                          this.objVenda.dados_json.produtos.length - 1
                        ];
                      ProdutoUtil.AplicarDescontoVlr(
                        ultimoProdutoLancado,
                        ultimoProdutoLancado.desconto_vlr - diferenca
                      );
                    }

                    this.RecalcularTotais();
                  }
                }
              },
              '',
              'text'
            );
          },
        },
        {
          text: 'Aplicar desconto %',
          icon: 'trending-down',
          handler: () => {
            Util.EspecificarTexto(
              'Informe o % de desconto',
              '%',
              (_valor) => {
                if (this.objVenda.dados_json.quantidade_produtos_lancados > 0) {
                  const valor = parseFloat(_valor);

                  if (valor > 100) {
                    Util.AlertInfo('O desconto % não pode ser maior que 100%');
                  } else {
                    this.objVenda.dados_json.produtos.forEach((produto) => {
                      ProdutoUtil.AplicarDescontoPrc(produto, valor);
                    });

                    this.RecalcularTotais();
                  }
                }
              },
              '',
              'text'
            );
          },
        },
        {
          text: 'Aplicar acréscimo R$',
          icon: 'trending-up',
          handler: () => {
            Util.EspecificarTexto(
              'Informe o valor de acréscimo',
              'R$',
              (_valor) => {
                if (this.objVenda.dados_json.quantidade_produtos_lancados > 0) {
                  const valor = parseFloat(_valor);

                  const acrescimo_prc = Util.CalculaPorcentagem(
                    valor,
                    this.objVenda.dados_json.total_bruto
                  );
                  let total_aplicado = 0;
                  this.objVenda.dados_json.produtos.forEach((produto) => {
                    ProdutoUtil.AplicarAcrescimoPrc(produto, acrescimo_prc);
                    total_aplicado += produto.acrescimo_vlr;
                  });

                  //verifico a diferença e aplico no ultimo item
                  const diferenca = valor - total_aplicado;
                  if (diferenca !== 0) {
                    const ultimoProdutoLancado =
                      this.objVenda.dados_json.produtos[
                        this.objVenda.dados_json.produtos.length - 1
                      ];
                    ProdutoUtil.AplicarAcrescimoVlr(
                      ultimoProdutoLancado,
                      ultimoProdutoLancado.acrescimo_vlr - diferenca
                    );
                  }

                  this.RecalcularTotais();
                }
              },
              '',
              'text'
            );
          },
        },
        {
          text: 'Aplicar acréscimo %',
          icon: 'trending-up',
          handler: () => {
            Util.EspecificarTexto(
              'Informe o % de acréscimo',
              '%',
              (_valor) => {
                if (this.objVenda.dados_json.quantidade_produtos_lancados > 0) {
                  const valor = parseFloat(_valor);
                  this.objVenda.dados_json.produtos.forEach((produto) => {
                    ProdutoUtil.AplicarAcrescimoPrc(produto, valor);
                  });

                  this.RecalcularTotais();
                }
              },
              '',
              'text'
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

    if (registro.movimenta_fracionado === false) {
      //forço ficar como inteiro
      registro.quantidade = +registro.quantidade;
    }

    this.RecalcularTotais();
  }

  async SalvarVenda() {
    try {
      this.objVenda.dados_json.pedido = false;
      this.salvarSemValidar();
    } catch (e) {
      Util.AlertError(e);
    }
  }

  async salvarSemValidar() {
    try {
      this.objVenda.data = new Date().getTime();
      OperacaoSaidaUtil.PreecherJson(this.objVenda);
      await this.dados.salvarVenda(this.objVenda);
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
