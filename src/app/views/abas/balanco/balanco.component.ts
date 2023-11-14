import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionSheetButton,
  ActionSheetController,
  ModalController,
} from '@ionic/angular';
import { Util } from 'src/app/core/util.model';
import { OperacaoBalanco } from '../../../core/model/operacao-balanco.model';
import { OperacaoBalancoUtil } from '../../../core/model/operacao-balanco-util.model';
import { DetalhesBalancoComponent } from './detalhes-balanco/detalhes-balanco.component';
import { ClasseBase } from 'src/app/core/model/classe-base.model';
import { environment } from 'src/environments/environment';
import { DataBaseProvider } from 'src/app/core/service/database';
import { OverlayService } from 'src/app/core/service/overlay.service';
import { AuthService } from '../../../core/service/auth.service';
import { SincronizacaoService } from 'src/app/core/service/sincronizacao.service';

@Component({
  selector: 'app-balanco',
  templateUrl: './balanco.component.html',
  styleUrls: ['./balanco.component.scss'],
})
export class BalancoComponent extends ClasseBase implements OnInit {
  abaSelecionada: string;
  consultando: boolean;
  sincronizando: boolean;
  pendentes: OperacaoBalanco[];
  sincronizados: OperacaoBalanco[];
  constructor(
    private actionSheetController: ActionSheetController,
    private dados: DataBaseProvider,
    private overlay: OverlayService,
    private sincSrv: SincronizacaoService,
    private modal: ModalController,
    private router: Router,
    auth: AuthService
  ) {
    super(auth, environment.id_tela_balanco);
    this.abaSelecionada = 'pendentes';
    this.consultando = false;
    this.sincronizando = false;
    this.pendentes = [];
    this.sincronizados = [];
    this.auth.salvouBalanco$.subscribe((c) => {
      this.OnConsultar();
    });
  }

  doRefresh(event) {
    setTimeout(() => {
      event.target.complete();
      this.OnConsultar();
    }, 100);
  }

  async ngOnInit() {
    this.OnConsultar();
  }

  override limparTela(): void {
    this.pendentes = [];
    this.sincronizados = [];
    this.consultando = false;
  }

  async OnConsultar() {
    try {
      this.abaSelecionada = 'pendentes';
      this.consultando = true;
      this.dados
        .getBalancos()
        .then((balanco) => {
          balanco.forEach((v) => OperacaoBalancoUtil.PreecherDadosJson(v));

          this.pendentes = balanco.filter((c) => !c.id_nuvem);
          this.sincronizados = balanco.filter((c) => c.id_nuvem);
          this.consultando = false;
        })
        .catch((err) => {
          this.consultando = false;
          Util.TratarErro(err);
        });
    } catch (e) {
      this.consultando = false;
      Util.TratarErro(e);
    }
  }

  segmentChanged(ev: any) {
    this.abaSelecionada = ev.detail.value;
  }

  async sincronizarTudo() {
    try {
      this.sincronizando = true;
      const sincronizar = this.pendentes.filter(
        (c) => !c.dados_json.status_manipulacao
      );
      if (sincronizar.length > 0) {
        for (let i = 0; i < sincronizar.length; i++) {
          await this.sincronizarBalanco(sincronizar[i], i, true);
        }
        this.OnConsultar();
      } else {
        Util.AlertInfo('Nenhum BALANÇO pendente foi localizado');
      }
    } catch (e) {
      Util.TratarErro(e);
    }
    this.sincronizando = false;
  }

  async mostrarOpcoesBalanco(balanco: OperacaoBalanco, index: number) {
    const buttons: ActionSheetButton[] = [];
    buttons.push({
      text: 'Copiar',
      icon: 'copy',
      handler: () => {
        this.AbrirTelaBalanco(balanco, true);
      },
    });

    buttons.push({
      text: 'Detalhes',
      icon: 'reader-outline',
      handler: async () => {
        const modal = await this.modal.create({
          component: DetalhesBalancoComponent,
          componentProps: {
            balanco,
          },
        });

        await modal.present();
      },
    });

    //nao ta sincronizado
    if (!balanco.id_nuvem) {
      buttons.push({
        text: 'Reabrir',
        icon: 'pencil',
        handler: () => {
          this.AbrirTelaBalanco(balanco);
        },
      });
      buttons.push({
        text: 'Sincronizar',
        icon: 'sync',
        handler: async () => {
          if (!balanco.dados_json.status_manipulacao) {
            await this.sincronizarBalanco(balanco, index);
          } else {
            Util.Confirm(
              'Não é possível sincronizar BALANÇO, deseja reabrir a balanço para alterá-la?',
              () => {
                this.AbrirTelaBalanco(balanco);
              }
            );
          }
        },
      });

      buttons.push({
        text: 'Cancelar',
        icon: 'trash',
        handler: () => {
          Util.Confirm('Excluindo balanço', async () => {
            try {
              this.dados
                .excluirBalanco(balanco.id)
                .then(() => {
                  this.overlay.notificarSucesso(
                    'Balanço excluído com sucesso!'
                  );
                  this.pendentes.splice(index, 1);
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
    }

    buttons.push({
      text: 'Voltar',
      icon: 'close',
      role: 'cancel',
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Opções do balanço',
      mode: 'ios',
      buttons,
    });
    await actionSheet.present();
  }

  sincronizarBalanco(
    balanco: OperacaoBalanco,
    index: number,
    nao_fazer_nada_apos_sincronizar?: boolean
  ): Promise<any> {
    if (balanco.dados_json.status_manipulacao) {
      //ja ta fazendo alguma coisa (sincronizando ou ta excluido)
      return;
    }
    balanco.dados_json.status_manipulacao = 1;
    try {
      return this.sincSrv
        .enviarBalanco(balanco.dados_json)
        .toPromise()
        .then(
          (r) => {
            balanco.dados_json.status_manipulacao = null;
            if (r.success === true) {
              balanco.id_nuvem = r.retorno.id;
              balanco.sincronizado_em = r.retorno.sincronizado_em;
              OperacaoBalancoUtil.PreecherDadosJson(balanco);
              this.dados
                .atualizarIdNuvemBalanco(
                  balanco.id,
                  r.retorno.id,
                  r.retorno.sincronizado_em
                )
                .then(async () => {
                  if (!nao_fazer_nada_apos_sincronizar) {
                    this.overlay.notificarSucesso(
                      'Balanço sincronizado com sucesso!'
                    );
                    this.pendentes.splice(index, 1);
                    this.sincronizados.unshift(balanco);
                    // await this.sincSrv
                    //   .informarQueTemNovasSincronizacoesDiversas()
                    //   .toPromise();
                  }
                })
                .catch((e) => {
                  Util.TratarErro(e);
                  balanco.dados_json.status_manipulacao = null;
                });
            } else {
              this.overlay.notificarErro(r.message);
            }

            return;
          },
          (e) => {
            Util.TratarErro(e);
            balanco.dados_json.status_manipulacao = null;
            return;
          }
        );
    } catch (e) {
      Util.TratarErro(e);
      balanco.dados_json.status_manipulacao = null;
      return;
    }
  }

  AbrirTelaBalanco(objBalanco?: OperacaoBalanco, copiando?: boolean) {
    let id_balanco: number = null;
    let acao = 'novo';
    if (objBalanco) {
      id_balanco = objBalanco.id;
      if (copiando === true) {
        acao = 'copiando';
      } else {
        acao = 'editando';
      }
    }

    this.router.navigate(['home/balanco/tela-balanco', { id_balanco, acao }]);
  }
}
