import { Component, Input } from '@angular/core';
import { OperacaoBalancoJson } from '../../model/operacao-balanco.model';

@Component({
  selector: 'app-cabecalho-balanco',
  templateUrl: './cabecalho-balanco.component.html',
  styleUrls: ['./cabecalho-balanco.component.scss'],
})
export class CabecalhoBalancoComponent {
  @Input() objBalanco: OperacaoBalancoJson;

  constructor() {}

  GetClasse() {
    return this.objBalanco.id_nuvem
      ? 'finalizado'
      : this.objBalanco
      ? 'balanco'
      : 'balanco';
  }
}
