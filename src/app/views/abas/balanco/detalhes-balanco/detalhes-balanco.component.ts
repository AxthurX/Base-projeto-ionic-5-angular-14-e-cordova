import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Util } from 'src/app/core/util.model';
import { PDFGenerator, PDFGeneratorOptions } from '@awesome-cordova-plugins/pdf-generator/ngx';
import { OperacaoBalancoJson } from '../../../../core/model/operacao-balanco.model';
import { ClasseBase } from 'src/app/core/model/classe-base.model';
import { AuthService } from 'src/app/core/service/auth.service';
import { OverlayService } from '../../../../core/service/overlay.service';

@Component({
  selector: 'app-detalhes-balanco',
  templateUrl: './detalhes-balanco.component.html',
  styleUrls: ['./detalhes-balanco.component.scss'],
})
export class DetalhesBalancoComponent
  extends ClasseBase
  implements OnInit, OnDestroy
{
  @ViewChild('imprimir') imprimir;
  objBalanco: OperacaoBalancoJson;
  gerando: boolean;
  constructor(
    private nav: NavParams,
    private modal: ModalController,
    private pdf: PDFGenerator,
    private overlay: OverlayService,
    auth: AuthService
  ) {
    super(auth);
    this.gerando = false;
  }

  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    this.modal.dismiss();
  }

  ngOnInit() {
    try {
      this.objBalanco = this.nav.data.balanco.dados_json;
      const modalState = {
        modal: true,
        desc: 'fake state for our modal',
      };
      history.pushState(modalState, null);
      this.downloadPdf();
    } catch (e) {
      Util.TratarErro(e);
    }
  }

  ngOnDestroy() {
    if (window.history.state.modal) {
      history.back();
    }
  }

  downloadPdf() {
    setTimeout(() => {
      try {
        this.gerando = true;
        const content = document.getElementById('imprimir').innerHTML;
        const options: PDFGeneratorOptions = {
          documentSize: 'A4',
          type: 'share',
          fileName: 'Balanco.pdf',
        };
        this.pdf
          .fromData(
           `<html>
              <head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
              </head>
              <body>
                ${content}
              </body>
            </html>`,
            options
          )
          .then(() => {
            this.overlay.dismissLoadCtrl();
            this.gerando = false;
            this.modal.dismiss();
          })
          .catch((e) => {
            this.overlay.dismissLoadCtrl();
            Util.TratarErro(e);
            this.gerando = false;
          });
      } catch (e) {
        Util.TratarErro(e);
        this.gerando = false;
      }
    }, 500);
  }
}
