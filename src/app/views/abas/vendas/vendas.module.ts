import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/core/shared.module';
import { TelaVendaComponent } from 'src/app/views/abas/vendas/tela-venda/tela-venda.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { VendasComponent } from './vendas.component';
import { ItemVendaComponent } from './item-venda/item-venda.component';

@NgModule({
  declarations: [
    VendasComponent,
    TelaVendaComponent,
    DetalhesComponent,
    ItemVendaComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: VendasComponent,
      },
      {
        path: 'tela-venda',
        component: TelaVendaComponent,
      },
    ]),
  ],
})
export class VendasModule {}
