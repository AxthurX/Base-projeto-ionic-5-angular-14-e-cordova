import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionSheetButton,
  ActionSheetController,
  ModalController,
} from '@ionic/angular';
import { Util } from 'src/app/core/util.model';
import { ClasseBase } from 'src/app/core/model/classe-base.model';
import { DataBaseProvider } from 'src/app/core/service/database';
import { OverlayService } from 'src/app/core/service/overlay.service';
import { AuthService } from '../../../core/service/auth.service';
import { RelatorioEntradaComponent } from './relatorio-entrada/relatorio-entrada.component';
import { RelatorioSaidaComponent } from './relatorio-saida/relatorio-saida.component';

@Component({
  selector: 'app-estoque',
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.scss'],
})
export class EstoqueComponent extends ClasseBase implements OnInit {
  consultando: boolean;
  constructor(
    private actionSheetController: ActionSheetController,
    private modal: ModalController,
    private router: Router,
    auth: AuthService
  ) {
    super(auth);
    this.consultando = false;
  }

  async ngOnInit() {}

  async mostrarOpcoes() {
    const buttons: ActionSheetButton[] = [];
    buttons.push({
      text: 'Relatorio de entrada',
      icon: 'arrow-undo-circle-outline',
      handler: async () => {
        const modal = await this.modal.create({
          component: RelatorioEntradaComponent,
        });

        await modal.present();
      },
    });

    buttons.push({
      text: 'Relatorio de saida',
      icon: 'arrow-redo-circle-outline',
      handler: async () => {
        const modal = await this.modal.create({
          component: RelatorioSaidaComponent,
        });

        await modal.present();
      },
    });

    buttons.push({
      text: 'Voltar',
      icon: 'close',
      role: 'cancel',
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Opções do controle estoque',
      mode: 'ios',
      buttons,
    });
    await actionSheet.present();
  }
}
