import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { Util } from '../../util.model';
import { DataBaseProvider } from '../../service/database';
import { OverlayService } from '../../service/overlay.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropDownComponent implements OnInit, OnDestroy {
  @Input() titulo: string;
  @Input() value: any;
  @Input() icone: string;
  @Input() get: string;
  @Input() modal: boolean;
  @Output() OnSelecionar: EventEmitter<any> = new EventEmitter();
  @Output() OnBuscarPorId: EventEmitter<any> = new EventEmitter();
  @Output() OnLimpar: EventEmitter<any> = new EventEmitter();
  @ViewChild('btnVoltar') btnVoltar;
  registros: any[];
  selecionado: any;
  consultando: boolean;
  interfaceOptions = {
    translucent: true,
    mode: 'ios',
    animated: true,
  };
  private backbuttonSubscription: Subscription;
  constructor(
    private dados: DataBaseProvider,
    private overlay: OverlayService
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

    this.onPesquisar('');
    this.selecionado = this.registros.find(
      (a) => a?.id_erp === this.value?.id_erp
    );
  }

  onClicou() {
    this.onPesquisar('');
  }

  onPesquisar(texto: string) {
    try {
      setTimeout(() => {
        this.consultando = true;
        if (this.get) {
          this.dados[this.get](texto)
            .then((result) => {
              if (this.registros.length !== result.length) {
                this.registros = result;
                this.selecionado = this.registros.find(
                  (obj) => obj.id_erp === this.value?.id_erp
                );
                if (this.registros.length === 0) {
                  this.overlay.showToast(
                    'Nenhum resultado encontrado',
                    'light'
                  );
                }
                this.consultando = false;
              }
            })
            .catch((err) => {
              Util.TratarErroEFecharLoading(err, this.overlay);
              this.consultando = false;
            });
        }
      }, 200);
    } catch (e) {
      Util.TratarErroEFecharLoading(e, this.overlay);
      this.consultando = false;
    }
  }

  onSelecionar(ev) {
    this.selecionado = ev.target.value;
    this.OnSelecionar.emit(this.selecionado);
  }

  onBuscarPorId($event) {
    try {
      this.OnBuscarPorId.emit(+$event.target.value);
    } catch {}
  }

  onLimpar() {
    this.OnLimpar.emit();
    this.selecionado = null;
  }
}
