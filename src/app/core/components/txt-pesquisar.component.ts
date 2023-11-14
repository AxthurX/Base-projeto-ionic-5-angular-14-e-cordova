import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-txt-pesquisar',
  template: `
    <ion-grid>
      <ion-row>
        <ion-col size="10">
          <ion-searchbar
            [disabled]="consultando === true"
            #pesquisa
            (keyup.enter)="onPesquisar()"
            [(ngModel)]="texto_pesquisado"
            [placeholder]="placeholder"
          >
          </ion-searchbar>
        </ion-col>
        <ion-col size="2" style="font-size: 30px; margin-top: 12px;">
          <ion-icon (click)="onPesquisar()" name="search-outline"></ion-icon>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
})
export class TxtPesquisarComponent implements OnInit {
  @Output() OnPesquisar: EventEmitter<string> = new EventEmitter();
  @ViewChild('pesquisa') pesquisa;
  @Input() consultando: boolean;
  @Input() placeholder: string;
  texto_pesquisado: string;

  constructor() {}

  ngOnInit() {
    this.setFocus();
  }

  setFocus() {
    setTimeout(() => {
      try {
        this.pesquisa.setFocus();
      } catch {}
    }, 500);
  }

  onPesquisar() {
    this.consultando = true;
    setTimeout(() => {
      if (!this.texto_pesquisado) {
        this.texto_pesquisado = '';
      }
      this.texto_pesquisado = this.texto_pesquisado.toUpperCase();
      this.OnPesquisar.emit(this.texto_pesquisado);

      this.consultando = false;
    }, 500);
  }
}
