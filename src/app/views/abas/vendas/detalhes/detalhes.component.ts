import { OperacaoSaidaJson } from 'src/app/core/model/operacao-saida.model';
import { ModalController, NavParams } from '@ionic/angular';
import { Util } from 'src/app/core/util.model';
import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  PDFGenerator,
  PDFGeneratorOptions,
} from '@awesome-cordova-plugins/pdf-generator/ngx';
@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.scss'],
  providers: [PDFGenerator],
})
export class DetalhesComponent implements OnInit, OnDestroy {
  @ViewChild('imprimir') imprimir;
  objVenda: OperacaoSaidaJson;
  gerando: boolean;
  base64: string;
  constructor(
    private nav: NavParams,
    private modal: ModalController,
    private pdf: PDFGenerator
  ) {
    this.gerando = false;
  }

  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    this.modal.dismiss();
  }

  ngOnInit() {
    try {
      this.objVenda = this.nav.data.venda.dados_json;
      const modalState = {
        modal: true,
        desc: 'fake state for our modal',
      };
      history.pushState(modalState, null);
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
    try {
      setTimeout(() => {
        this.gerando = true;
        const content = document.getElementById('imprimir').innerHTML;
        const options: PDFGeneratorOptions = {
          documentSize: 'A4',
          type: 'share',
          fileName: 'venda.pdf',
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
            this.gerando = false;
            this.modal.dismiss();
          });
      }, 500);
    } catch (e) {
      Util.TratarErro(e);
      this.gerando = false;
      this.modal.dismiss();
    }
  }
}
