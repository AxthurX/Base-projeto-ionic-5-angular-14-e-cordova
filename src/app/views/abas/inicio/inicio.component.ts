import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ColorSchemeService } from 'src/app/core/color-scheme.service';
import { ConsultaProdutoComponent } from '../../modais/consulta-produto/consulta-produto.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Util } from 'src/app/core/util.model';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {
  constructor(
    protected color: ColorSchemeService,
    private modal: ModalController,
    private actRoute: ActivatedRoute,
    protected rota: Router
  ) {
    this.color.load();
    this.color.temaEscuro = this.color.currentActive() === 'dark';
  }

  alterarTema() {
    if (this.color.temaEscuro === true) {
      this.color.update('dark');
    } else {
      this.color.update('light');
    }
  }

  ngOnInit() {
    this.actRoute.params.subscribe(() => {
      if (this.color.temaEscuro === true) {
        this.color.temaEscuro = true;
        this.color.update('dark');
      } else {
        this.color.temaEscuro = false;
        this.color.update('light');
      }
    });
  }

  async showTelaConsulta() {
    const modal = await this.modal.create({
      component: ConsultaProdutoComponent,
      componentProps: {
        apenas_consulta: true,
      },
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
      }
    });

    return await modal.present();
  }

  goTo(rota) {
    this.rota.navigate([rota]);
  }

  emBreve() {
    Util.Notificacao('Este módulo ainda está em desenvolvimento', 'info');
  }
}
