import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionSheetButton,
  ActionSheetController,
  ModalController,
} from '@ionic/angular';
import { OperacaoSaida } from 'src/app/core/model/operacao-saida.model';
import { Util } from 'src/app/core/util.model';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { IonContent } from '@ionic/angular';
import { OverlayService } from 'src/app/core/service/overlay.service';
import { DataBaseProvider } from 'src/app/core/service/database';
import { OperacaoSaidaUtil } from 'src/app/core/model/operacao-saida-util.model';
import { AuthService } from 'src/app/core/service/auth.service';
import { ClasseBase } from 'src/app/core/model/classe-base.model';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.scss'],
})
export class VendasComponent extends ClasseBase implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  nenhuma_venda_localizada: boolean = false;
  consultando: boolean;
  vendas: OperacaoSaida[] = [];
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
        this.dados
          .getVendas()
          .then((vendas) => {
            if (vendas?.length > 0) {
              vendas.forEach((v) => OperacaoSaidaUtil.PreecherDadosJson(v));

              vendas.forEach((v) => {
                this.vendas.push(v);
              });
            } else {
              this.nenhuma_venda_localizada = true;
            }
            this.consultando = false;
          })
          .catch((err) => {
            this.consultando = false;
          });
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
