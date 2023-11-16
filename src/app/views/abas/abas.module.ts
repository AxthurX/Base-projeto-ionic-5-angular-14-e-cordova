import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AbasComponent } from './abas.component';
import { SharedModule } from '../../core/shared.module';

@NgModule({
  declarations: [AbasComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: AbasComponent,
        children: [
          {
            path: '',
            redirectTo: 'inicio',
            pathMatch: 'full',
          },
          {
            path: 'inicio',
            loadChildren: () =>
              import('./inicio/inicio.module').then((m) => m.InicioModule),
          },
          {
            path: 'vendas',
            loadChildren: () =>
              import('./vendas/vendas.module').then((m) => m.VendasModule),
          },
          {
            path: 'balanco',
            loadChildren: () =>
              import('./balanco/balanco.module').then((m) => m.BalancoModule),
          },
          {
            path: 'produtos',
            loadChildren: () =>
              import('./produtos/produtos.module').then((m) => m.ProdutosModule),
          },
        ],
      },
    ]),
  ],
})
export class AbasModule {}
