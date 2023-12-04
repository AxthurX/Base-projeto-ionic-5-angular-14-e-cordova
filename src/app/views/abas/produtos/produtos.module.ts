import { NgModule } from '@angular/core';
import { ProdutosComponent } from './produtos.component';
import { CadastrarComponent } from './cadastrar/cadastrar.component';
import { SharedModule } from 'src/app/core/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { RouterModule } from '@angular/router';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@NgModule({
  declarations: [ProdutosComponent, CadastrarComponent],
  imports: [
    SharedModule,
    CurrencyMaskModule,
    NgxMaskModule.forChild(),
    RouterModule.forChild([
      {
        path: '',
        component: ProdutosComponent,
      },
    ]),
  ],
})
export class ProdutosModule {}
