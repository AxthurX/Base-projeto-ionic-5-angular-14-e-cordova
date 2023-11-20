import { Component, Input } from '@angular/core';
import { OperacaoSaidaJson } from '../../model/operacao-saida.model';

@Component({
  selector: 'app-cabecalho-venda',
  templateUrl: './cabecalho-venda.component.html',
  styleUrls: ['./cabecalho-venda.component.scss'],
})
export class CabecalhoVendaComponent {
  @Input() objVenda: OperacaoSaidaJson;
  constructor() {}

  GetClasse() {
    return 'Azul';
  }

  GetColor(pedido) {
    return !pedido ? 'warning' : 'tertiary';
  }
}
