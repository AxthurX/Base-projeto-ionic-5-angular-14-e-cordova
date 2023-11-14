import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ValueBaseModel } from '../../model/value-base.model';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss'],
})
export class LookupComponent {
  @Input() titulo: string;
  @Input() value: ValueBaseModel;
  @Input() icone: string;
  @Input() objeto_auxiliar: any;
  @Output() OnSelecionar: EventEmitter<any> = new EventEmitter();
  @Output() OnLimpar: EventEmitter<any> = new EventEmitter();
  @Output() OnBuscaPorId: EventEmitter<number> = new EventEmitter();
  constructor() {}

  sendOnSelecionar() {
    this.OnSelecionar.emit();
  }

  sendOnLimpar() {
    this.OnLimpar.emit();
  }

  onBuscaPorId($event) {
    try {
      this.OnBuscaPorId.emit(+$event.target.value);
    } catch {}
  }
}
