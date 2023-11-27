import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { ViewProduto } from 'src/app/core/model/data-base/view-produto.model';
import { OperacaoSaidaUtil } from 'src/app/core/model/operacao-saida-util.model';
import { OperacaoSaida } from 'src/app/core/model/operacao-saida.model';
import { Util } from 'src/app/core/util.model';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { ValueBaseModel } from 'src/app/core/model/value-base.model';
import { OverlayService } from 'src/app/core/service/overlay.service';
import { DataBaseProvider } from 'src/app/core/service/database';
import { ClasseBase } from 'src/app/core/model/classe-base.model';
import { AuthService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-tela-venda',
  templateUrl: './tela-venda.component.html',
  styleUrls: ['./tela-venda.component.scss'],
})
export class TelaVendaComponent
  extends ClasseBase
  implements OnInit, OnDestroy
{
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
    private router: Router,
    auth: AuthService
  ) {
    super(auth);
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

  getById(filtro: string, valor: string) {
    if (filtro === 'id') {
      return this.objVenda.dados_json.produtos.find((c) => c.id === +valor);
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
        id: p.id,
        valor: p.quantidade,
        descricao: '',
      });
    });

    return retorno;
  }

  OnConsultou(produtos: ViewProduto[]) {
    produtos.forEach((p) => {
      const existente = this.objVenda.dados_json.produtos.find(
        (c) => c.id === p.id
      );
      if (existente) {
        existente.quantidade += p.quantidade;
      } else {
        this.objVenda.dados_json.produtos.unshift(p);
      }
    });

    OperacaoSaidaUtil.RecalcularTotais(this.objVenda.dados_json);
  }

  ajustarQuantidade(registro: ViewProduto, i: number, incremento: number) {
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

  tratarAlteracaoQuantidade(registro: ViewProduto) {
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

  async mostrarOpcoesProduto(produto: ViewProduto, index: number) {
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

  alterouQuantidadeManualmente(registro: ViewProduto, novoValor) {
    registro.quantidade = novoValor;
    if (registro.quantidade && registro.quantidade < 0) {
      registro.quantidade = 1;
    }

    this.RecalcularTotais();
  }

  async SalvarVenda() {
    try {
      this.objVenda.data = new Date().getTime();
      try {
        await this.objVenda.dados_json.produtos.forEach((c) => {
          const nova_qtde =  c.quantidade_original - c.quantidade;
          const nova_total =  c.valor_total_original - c.valor_total;
          c.quantidade_original = nova_qtde;
          c.valor_total_original = nova_total;
          console.log(c.valor_total_original, c.quantidade_original);
          this.dados.salvarProduto(c);
        });
      } catch (e) {
        console.error(e);
      }
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

  limparObservacaoItem(produto: ViewProduto) {
    Util.Confirm('Limpar observação', () => {
      produto.observacao = '';
    });
  }
}
