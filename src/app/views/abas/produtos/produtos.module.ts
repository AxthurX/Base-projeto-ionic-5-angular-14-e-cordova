import { NgModule } from '@angular/core';
import { ProdutosComponent } from './produtos.component';
import { CadastrarComponent } from './cadastrar/cadastrar.component';
import { FinanceiroComponent } from './financeiro/financeiro.component';
import { SharedModule } from 'src/app/core/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ProdutosComponent, CadastrarComponent, FinanceiroComponent],
  imports: [
    SharedModule,
    NgxMaskModule.forChild(),
    RouterModule.forChild([
      {
        path: '',
        component: ProdutosComponent,
      },
      {
        path: 'financeiro',
        component: FinanceiroComponent,
      },
    ]),
  ],
})
export class ProdutosModule {}
