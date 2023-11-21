import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { ViewProduto } from 'src/app/core/model/data-base/view-produto.model';
import { Util } from 'src/app/core/util.model';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { OperacaoBalanco } from '../../../../core/model/operacao-balanco.model';
import { OperacaoBalancoUtil } from '../../../../core/model/operacao-balanco-util.model';
import { ClasseBase } from 'src/app/core/model/classe-base.model';
import { environment } from 'src/environments/environment';
import { OverlayService } from 'src/app/core/service/overlay.service';
import { DataBaseProvider } from 'src/app/core/service/database';
import { AuthService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-tela-balanco',
  templateUrl: './tela-balanco.component.html',
  styleUrls: ['./tela-balanco.component.scss'],
})
export class TelaBalancoComponent
  extends ClasseBase
  implements OnInit, OnDestroy
{
  @ViewChild('btnVoltar') btnVoltar;
  @Input() objBalanco: OperacaoBalanco;
  @Input() copiando?: boolean;
  aba_selecionada: string;
  carregando: boolean;
  acao: string;
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
    super(auth, environment.id_tela_balanco);
    this.aba_selecionada = 'detalhes';
    this.acao = '';
    this.carregando = false;
    this.objBalanco = new OperacaoBalanco();
  }

  ngOnDestroy() {
    this.backbuttonSubscription.unsubscribe();
  }

  ngOnInit() {
    try {
      const event = fromEvent(document, 'backbutton');
      this.backbuttonSubscription = event.subscribe(async () => {
        try {
          this.btnVoltar.voltar();
        } catch {}
      });
      this.route.params.subscribe((params) => {
        this.acao = params.acao;
        const id_balanco = params.id_balanco;

        if (this.acao === 'novo') {
          this.objBalanco = new OperacaoBalanco();
        } else {
          this.dados
            .getOperacaoBalanco(id_balanco)
            .then((balanco) => {
              this.objBalanco = balanco;
              if (this.acao === 'copiando') {
                this.objBalanco.id = 0;
                this.objBalanco.sincronizado_em = null;
              }
              OperacaoBalancoUtil.PreecherDadosJson(this.objBalanco);
              this.carregando = false;
            })
            .catch((e) => {
              Util.TratarErro(e);
              this.carregando = false;
            });
        }
      });
    } catch (e) {
      Util.TratarErro(e);
      this.carregando = false;
    }
  }

  getByIdOrGtin(filtro: string, valor: string) {
    if (filtro === 'id') {
      return this.objBalanco.dados_json.produtos.find(
        (c) => c.id === +valor
      );
    } else {
      return this.objBalanco.dados_json.produtos.find((c) => c.gtin === valor);
    }
  }

  OnConsultou(produtos: ViewProduto[]) {
    produtos.forEach((p) => {
      const existente = this.objBalanco.dados_json.produtos.find(
        (c) => c.id === p.id
      );
      if (existente) {
        existente.quantidade += p.quantidade;
      } else {
        this.objBalanco.dados_json.produtos.unshift(p);
      }
    });
  }

  ajustarQuantidade(
    registro: ViewProduto,
    i: number,
    incremento: number
  ) {
    if (!registro.quantidade) {
      registro.quantidade = 0;
    }
    registro.quantidade += incremento;
    if (registro.quantidade <= -1) {
      registro.quantidade = null;
      this.removerItemNaTora(i);
      return;
    }
  }

  //nao faço pergunta
  removerItemNaTora(i: number, mostrar_alerta: boolean = true) {
    this.objBalanco.dados_json.produtos.splice(i, 1);
    OperacaoBalancoUtil.RecalcularTotais(this.objBalanco.dados_json);

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
      header: 'Aplicar no balanço',
      mode: 'ios',
      buttons: [
        {
          text: 'Incluir observação no balanço',
          icon: 'information-circle-outline',
          handler: () => {
            Util.EspecificarTexto(
              'Observação',
              'Insira aqui a observação',
              (_valor) => {
                this.objBalanco.dados_json.observacao = _valor;
              },
              this.objBalanco.dados_json.observacao
            );
          },
        },
        {
          text: 'Remover todos os produtos',
          icon: 'trash',
          handler: () => {
            Util.Confirm('Remover todos os produtos lançados', () => {
              const tamanho = this.objBalanco.dados_json.produtos.length;
              for (let index = 0; index < tamanho; index++) {
                this.objBalanco.dados_json.produtos.forEach((c) =>
                  this.removerItemNaTora(0, false)
                );
              }
            });
          },
        },
        {
          text: 'Limpar balanço',
          icon: 'alert',
          handler: () => {
            Util.Confirm('Limpar balanço', () => {
              OperacaoBalancoUtil.LimparBalanco(this.objBalanco.dados_json);
              this.aba_selecionada = 'detalhes';
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

    OperacaoBalancoUtil.RecalcularTotais(this.objBalanco.dados_json);
  }

  async SalvarBalanco() {
    this.salvarSemValidar();
  }

  salvarSemValidar() {
    try {
      this.objBalanco.data = new Date().getTime();
      OperacaoBalancoUtil.PreecherJson(this.objBalanco);
      this.dados
        .salvarBalanco(this.objBalanco)
        .then(() => {
          this.overlay.notificarSucesso('Balanço salvo com sucesso!');
          this.auth.informarSalvouBalanco();
          this.router.navigate(['home/balanco']);
        })
        .catch((e) => {
          Util.TratarErro(e);
        });
    } catch (err) {
      Util.TratarErro(err);
    }
  }

  limparObservacaoBalanco() {
    Util.Confirm('Limpar observação', () => {
      this.objBalanco.dados_json.observacao = '';
    });
  }

  limparObservacaoItem(produto: ViewProduto) {
    Util.Confirm('Limpar observação', () => {
      produto.observacao = '';
    });
  }
}
