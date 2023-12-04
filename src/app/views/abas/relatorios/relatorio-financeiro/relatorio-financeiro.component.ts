import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  PDFGenerator,
  PDFGeneratorOptions,
} from '@awesome-cordova-plugins/pdf-generator/ngx';
import { ModalController } from '@ionic/angular';
import { ClasseBase } from 'src/app/core/model/classe-base.model';
import { OperacaoSaidaJson } from 'src/app/core/model/operacao-saida.model';
import { AuthService } from 'src/app/core/service/auth.service';
import { DataBaseProvider } from 'src/app/core/service/database';
import { OverlayService } from 'src/app/core/service/overlay.service';
import { Util } from 'src/app/core/util.model';

@Component({
  selector: 'app-relatorio-financeiro',
  templateUrl: './relatorio-financeiro.component.html',
  styleUrls: ['./relatorio-financeiro.component.scss'],
})
export class RelatorioFinanceiroComponent
  extends ClasseBase
  implements OnInit, OnDestroy
{
  @ViewChild('imprimir') imprimir;
  objRelatorio: OperacaoSaidaJson[] = [];
  gerando: boolean;
  constructor(
    private pdf: PDFGenerator,
    private route: ActivatedRoute,
    private modal: ModalController,
    private overlay: OverlayService,
    private dados: DataBaseProvider,
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
      this.route.params.subscribe(async () => {
        this.dados.getVendas().then((venda) => {
          venda.forEach((item) => {
            const json = JSON.parse(item.json);
            if (!this.objRelatorio.includes(json)) {
              this.objRelatorio.push(json);
            }
          });
        });
      });

      const modalState = {
        modal: true,
        desc: 'fake state for our modal',
      };
      history.pushState(modalState, null);
      if (this.objRelatorio.length > 0) {
        this.downloadPdf();
      }
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
          fileName: 'financeiro pdf',
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
            this.gerando = false;
          });
      } catch (e) {
        Util.TratarErro(e);
        this.gerando = false;
      }
    }, 500);
  }
}
