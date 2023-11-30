import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Util } from 'src/app/core/util.model';
import {
  PDFGenerator,
  PDFGeneratorOptions,
} from '@awesome-cordova-plugins/pdf-generator/ngx';
import { ClasseBase } from 'src/app/core/model/classe-base.model';
import { AuthService } from 'src/app/core/service/auth.service';
import { DataBaseProvider } from 'src/app/core/service/database';
import { ActivatedRoute } from '@angular/router';
import { OperacaoSaida } from 'src/app/core/model/operacao-saida.model';

@Component({
  selector: 'app-relatorio-saida',
  templateUrl: './relatorio-saida.component.html',
  styleUrls: ['./relatorio-saida.component.scss'],
})
export class RelatorioSaidaComponent
  extends ClasseBase
  implements OnInit, OnDestroy
{
  @ViewChild('imprimir') imprimir;
  objRelatorio: OperacaoSaida;
  gerando: boolean;
  constructor(
    private pdf: PDFGenerator,
    private route: ActivatedRoute,
    private modal: ModalController,
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
      this.route.params.subscribe(async (params) => {
        const id_venda = params.id_venda;
        this.dados.getVenda(id_venda).then((c) => {
          this.objRelatorio = c;
        });
      });

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
          fileName: 'relatorio-saida.pdf',
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
          })
          .catch((e) => {
            this.gerando = false;
          });
      } catch (e) {
        this.gerando = false;
      }
    }, 500);
  }
}
