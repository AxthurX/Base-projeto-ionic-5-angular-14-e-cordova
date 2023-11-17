import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { fromEvent, Subscription } from 'rxjs';
import { Produto } from 'src/app/core/model/data-base/produto.model';
import { ViewCliente } from 'src/app/core/model/data-base/view-cliente.model';
import { DataBaseProvider } from 'src/app/core/service/database';
import { Util } from 'src/app/core/util.model';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.scss'],
})
export class FinanceiroComponent implements OnInit, OnDestroy {
  @ViewChild('btnVoltar') btnVoltar;
  cliente: ViewCliente;
  produtos: Produto[] = [];
  consultando: boolean;
  total_aberto: number;
  multa: number;
  juros: number;
  abaSelecionada: string;
  private backbuttonSubscription: Subscription;
  constructor(private dados: DataBaseProvider, public modal: ModalController) {
    this.consultando = false;
    this.total_aberto = 0;
    this.abaSelecionada = 'contas';
  }

  segmentChanged(ev: any) {
    this.abaSelecionada = ev.detail.value;
  }

  ngOnDestroy() {
    this.backbuttonSubscription.unsubscribe();
  }

  ngOnInit() {
    try {
      const event = fromEvent(document, 'backbutton');
      this.backbuttonSubscription = event.subscribe(async () => {
        try {
          this.modal.dismiss();
        } catch {}
      });

      this.dados
        .getEmpresaLogada()
        .then((empresa) => {
          this.multa = empresa.multa_contas_a_receber_em_atraso;
          this.juros = empresa.juros_mensal_contas_a_receber_em_atraso;
        })
        .catch((e) => {
          Util.TratarErro(e);
          this.consultando = false;
        });
    } catch (e) {
      Util.TratarErro(e);
      this.consultando = false;
    }
  }

  getNomeCliente() {
    return this.cliente.fantasia ? this.cliente.fantasia : this.cliente.razao;
  }
}
