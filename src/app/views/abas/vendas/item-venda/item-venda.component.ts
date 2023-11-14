import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ViewProdutoEmpresa } from 'src/app/core/model/data-base/view-produto-empresa.model';

@Component({
  selector: 'app-item-venda',
  templateUrl: './item-venda.component.html',
  styleUrls: ['./item-venda.component.scss'],
})
export class ItemVendaComponent {
  @Input() registro: ViewProdutoEmpresa;
  @Input() readonly: boolean = false;
  @Output() OnMostrarOpcoesProduto: EventEmitter<any> = new EventEmitter();
  @Output() OnLimparObservacaoItem: EventEmitter<any> = new EventEmitter();
  @Output() OnAjustarQuantidade: EventEmitter<number> = new EventEmitter();
  @Output() OnAlterouQuantidadeManualmente: EventEmitter<number> =
    new EventEmitter();
  constructor() {}
  mostrarOpcoesProduto() {
    if (this.readonly === false) {
      this.OnMostrarOpcoesProduto?.next();
    }
  }

  limparObservacaoItem() {
    if (this.readonly === false) {
      this.OnLimparObservacaoItem?.next();
    }
  }

  ajustarQuantidade(quantidade: number) {
    if (this.readonly === false) {
      this.OnAjustarQuantidade?.next(quantidade);
    }
  }

  alterouQuantidadeManualmente(novoValor: number) {
    if (this.readonly === false) {
      this.OnAlterouQuantidadeManualmente?.next(novoValor);
    }
  }

  getColor(tipo_preco) {
    if (tipo_preco === 'P') {
      return 'success';
    } else if (tipo_preco === 'T') {
      return 'tertiary';
    }
  }
}
