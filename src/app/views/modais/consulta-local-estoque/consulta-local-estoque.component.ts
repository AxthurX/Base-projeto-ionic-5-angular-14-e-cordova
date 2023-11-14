import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { fromEvent, Subscription } from 'rxjs';
import { EstoqueLocais } from 'src/app/core/model/data-base/estoque-locais.model';
import { DataBaseProvider } from 'src/app/core/service/database';
import { OverlayService } from 'src/app/core/service/overlay.service';
import { Util } from 'src/app/core/util.model';

@Component({
  selector: 'app-consulta-local-estoque',
  templateUrl: './consulta-local-estoque.component.html',
  styleUrls: ['./consulta-local-estoque.component.scss'],
})
export class ConsultaLocalEstoqueComponent implements OnInit, OnDestroy {
  @ViewChild('btnVoltar') btnVoltar;
  @ViewChild('pesquisa') pesquisa;
  registros: EstoqueLocais[];
  consultando: boolean;
  id_filtrando?: number;
  private backbuttonSubscription: Subscription;
  constructor(
    private overlay: OverlayService,
    public modal: ModalController,
    private navParams: NavParams,
    private dados: DataBaseProvider
  ) {
    this.registros = [];
    this.consultando = false;
  }

  ngOnDestroy() {
    this.backbuttonSubscription.unsubscribe();
  }

  ngOnInit() {
    const event = fromEvent(document, 'backbutton');
    this.backbuttonSubscription = event.subscribe(async () => {
      try {
        this.btnVoltar.voltar();
      } catch {}
    });

    this.id_filtrando = this.navParams.data.id;
    if (this.id_filtrando) {
      this.onPesquisar(this.id_filtrando.toString(), true);
    } else {
      this.onPesquisar('');
    }

    setTimeout(() => {
      this.pesquisa.setFocus();
    }, 500);
  }

  onClicou(registro: EstoqueLocais) {
    this.modal.dismiss(registro);
  }

  onPesquisar(texto: string, selecionarPrimeiroRegistro?: boolean) {
    try {
      texto = texto.toUpperCase();
      setTimeout(() => {
        this.consultando = true;
        this.dados
          .getEstoqueLocais(texto)
          .then((result) => {
            this.registros = result;

            if (
              selecionarPrimeiroRegistro === true &&
              this.registros.length > 0
            ) {
              this.onClicou(this.registros[0]);
            }

            this.consultando = false;
          })
          .catch((err) => {
            Util.TratarErroEFecharLoading(err, this.overlay);
            this.consultando = false;
          });
      }, 200);
    } catch (e) {
      Util.TratarErroEFecharLoading(e, this.overlay);
      this.consultando = false;
    }
  }
}
