import { Component, OnInit } from '@angular/core';
import { ColorSchemeService } from 'src/app/core/color-scheme.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Util } from 'src/app/core/util.model';
import { DataBaseProvider } from 'src/app/core/service/database';
import { OverlayService } from 'src/app/core/service/overlay.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {
  constructor(
    protected color: ColorSchemeService,
    private actRoute: ActivatedRoute,
    protected rota: Router,
    private dbProvider: DataBaseProvider,
    private overlay: OverlayService
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

  goTo(rota) {
    this.rota.navigate([rota]);
  }

  emBreve() {
    Util.Notificacao('Este módulo ainda está em desenvolvimento', 'info');
  }

  limparAplicativo() {
    Util.Confirm(
      'Isto irá excluir o banco de dados local, você perderá todas informações cadastradas. Esta ação não poderá ser desfeita, confirma?',
      () => {
        Util.EspecificarTexto(
          'Digite "LIMPAR"',
          '',
          (digitou) => {
            if (digitou && digitou.toString() === 'LIMPAR') {
              this.dbProvider
                .dropDB()
                .then(() => {
                  this.dbProvider.createDatabase();
                })
                .catch((e) => {
                  Util.TratarErro(e);
                });
            } else {
              this.overlay.showToast('Ação cancelada', 'warning');
            }
          },
          '',
          'text'
        );
      }
    );
  }
}
