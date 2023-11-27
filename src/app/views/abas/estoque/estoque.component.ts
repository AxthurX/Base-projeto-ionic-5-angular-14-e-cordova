import {
  ActionSheetButton,
  ActionSheetController,
  ModalController,
} from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { ClasseBase } from 'src/app/core/model/classe-base.model';
import { AuthService } from '../../../core/service/auth.service';
import { RelatorioEntradaComponent } from './relatorio-entrada/relatorio-entrada.component';

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
      text: 'Voltar',
      icon: 'close',
      role: 'cancel',
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Opções do controle de estoque',
      mode: 'ios',
      buttons,
    });
    await actionSheet.present();
  }
}
