import { Component, OnInit } from '@angular/core';
import { ColorSchemeService } from 'src/app/core/color-scheme.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {
  constructor(
    protected color: ColorSchemeService,
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

  goTo(rota) {
    this.rota.navigate([rota]);
  }
}
