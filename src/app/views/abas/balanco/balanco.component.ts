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

@Component({
  selector: 'app-balanco',
  templateUrl: './balanco.component.html',
  styleUrls: ['./balanco.component.scss'],
})
export class BalancoComponent extends ClasseBase implements OnInit {
  consultando: boolean;
  balancos: OperacaoBalanco[];
  constructor(
    private actionSheetController: ActionSheetController,
    private dados: DataBaseProvider,
    private overlay: OverlayService,
    private modal: ModalController,
    private router: Router,
    auth: AuthService
  ) {
    super(auth);
    this.consultando = false;
    this.balancos = [];
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
    this.balancos = [];
    this.consultando = false;
  }

  async OnConsultar() {
    try {
      this.consultando = true;
      this.dados
        .getBalancos()
        .then((balanco) => {
          balanco.forEach((v) => OperacaoBalancoUtil.PreecherDadosJson(v));

          this.balancos = balanco;
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
    buttons.push({
      text: 'Reabrir',
      icon: 'pencil',
      handler: () => {
        this.AbrirTelaBalanco(balanco);
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
                this.overlay.notificarSucesso('Balanço excluído com sucesso!');
                this.balancos.splice(index, 1);
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
      header: 'Opções do balanço',
      mode: 'ios',
      buttons,
    });
    await actionSheet.present();
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
